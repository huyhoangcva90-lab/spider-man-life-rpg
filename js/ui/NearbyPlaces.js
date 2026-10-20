import { googleDirections, googlePlaceSearch } from '../map/GoogleMapsLinks.js';
import { RoutingAdapter } from '../map/RoutingAdapter.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

export class NearbyPlaces {
  constructor(bus, engine, repo) { Object.assign(this, { bus, engine, repo }); this.items = []; this.mission = null; this.request = null; this.cache = new Map(); }
  init() {
    this.panel = document.getElementById('nearby-places');
    if (!this.panel) return;
    this.results = this.panel.querySelector('[data-nearby-results]');
    document.getElementById('btn-find-places')?.addEventListener('click', () => this.open());
    this.panel.querySelector('[data-nearby-close]').addEventListener('click', () => this.close());
    this.panel.querySelector('form').addEventListener('submit', event => { event.preventDefault(); this.search(); });
    this.panel.querySelector('[data-nearby-name]').addEventListener('input', () => this.render());
    this.bus.on('MAP_PLAN_MISSION', mission => {
      const saved = mission.sourceUrl && this.repo.getAll().find(entry => entry.notionPageUrl === mission.sourceUrl);
      if (saved) mission = { ...mission, address:saved.address, lat:saved.lat, lng:saved.lng };
      this.mission = mission;
      this.open();
      if (mission.address) {
        const direction = googleDirections(mission);
        this.results.innerHTML = `<p>Địa điểm trong nhiệm vụ: ${esc(mission.address)}</p><a class="nearby-primary" target="_blank" rel="noopener noreferrer" href="${esc(direction)}">CHỈ ĐƯỜNG GOOGLE MAPS ↗</a>`;
      }
    });
    this.panel.addEventListener('click', event => {
      const button = event.target.closest('[data-place-show],[data-place-save]');
      if (!button) return;
      const index = Number(button.dataset.placeShow ?? button.dataset.placeSave);
      const place = this.items[index]; if (!place) return;
      if (button.hasAttribute('data-place-show')) {
        this.engine.flyTo(place.lat, place.lng, 16);
        if (innerWidth < 600) { this.panel.hidden = true; this.panel.inert = true; }
        this.preview?.remove();
        if (this.engine.map && window.maplibregl) {
          const pin = document.createElement('img'); pin.src = './assets/spideytracker/green_pin.png'; pin.alt = place.title; pin.style.cssText = 'width:44px;height:48px;image-rendering:pixelated;object-fit:contain';
          this.preview = new window.maplibregl.Marker({ element: pin, anchor:'bottom' }).setLngLat([place.lng,place.lat]).addTo(this.engine.map);
        }
      } else {
        const mission = this.mission;
        const data = { type:mission ? 'NOTION_MISSION' : 'LEISURE', title:mission?.title || place.title, lat:place.lat, lng:place.lng, address:`${place.title}${place.address ? ', ' + place.address : ''}`, notionPageUrl:mission?.sourceUrl || '', source:mission ? 'NOTION' : 'MANUAL', notes:'Địa điểm được chọn trên bản đồ; lưu trên thiết bị này.' };
        const existing = mission?.sourceUrl && this.repo.getAll().find(entry => entry.notionPageUrl === mission.sourceUrl);
        if (existing) this.repo.update(existing.id, data); else this.repo.create(data);
        button.textContent = mission ? 'ĐÃ GẮN ĐỊA ĐIỂM TRÊN MÁY' : 'ĐÃ LƯU TRÊN MÁY'; button.disabled = true;
      }
    });
  }
  open() {
    this.panel.hidden = false; this.panel.inert = false;
    this.panel.querySelector('[data-nearby-heading]').textContent = this.mission ? `CHỌN ĐỊA ĐIỂM · ${this.mission.title}` : 'CHỌN QUÁN QUANH MAP';
  }
  close() { this.panel.hidden = true; this.panel.inert = true; this.mission = null; this.request?.abort(); this.preview?.remove(); }
  async search() {
    if (!this.engine.map) return;
    this.request?.abort(); const request = new AbortController(); this.request = request;
    const center = this.engine.map.getCenter();
    const radius = Number(this.panel.querySelector('[data-nearby-radius]').value);
    const category = this.panel.querySelector('[data-nearby-category]').value;
    const cacheKey = `${center.lat.toFixed(3)},${center.lng.toFixed(3)},${radius},${category}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now()-cached.at < 600000) { this.items = cached.items; this.render(); return; }
    this.results.innerHTML = '<p role="status">Đang tìm địa điểm quanh tâm bản đồ…</p>';
    const submit = this.panel.querySelector('[type="submit"]'); submit.disabled = true;
    try {
      const wait = 1000 - (Date.now()-(this.lastSearchAt || 0));
      if (wait > 0) await new Promise(resolve => setTimeout(resolve,wait));
      this.lastSearchAt = Date.now();
      const deltaLat = radius / 111320;
      const deltaLng = deltaLat / Math.max(.1,Math.cos(center.lat*Math.PI/180));
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.search = new URLSearchParams({q:category === 'cafe' ? '[cafe]' : '[restaurant]',format:'jsonv2',bounded:'1',viewbox:`${center.lng-deltaLng},${center.lat+deltaLat},${center.lng+deltaLng},${center.lat-deltaLat}`,limit:'40',extratags:'1'});
      const response = await fetch(url, { headers:{'Accept-Language':'vi,en;q=0.9'}, signal:AbortSignal.any([request.signal,AbortSignal.timeout(15000)]) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!Array.isArray(json)) throw new Error('Service unavailable');
      this.items = json.map(item => {
        const tags = item.extratags || {}, lat = Number(item.lat), lng = Number(item.lon);
        return { title:item.name || item.display_name?.split(',')[0], lat, lng, address:item.display_name, distance:RoutingAdapter.calculateDistanceKm(center.lat,center.lng,lat,lng), cuisine:tags.cuisine?.replaceAll(';',', '), hours:tags.opening_hours };
      }).filter(item => item.title && Number.isFinite(item.lat) && Number.isFinite(item.lng) && item.distance <= radius/1000).sort((a,b) => a.distance-b.distance);
      this.cache.set(cacheKey, { at:Date.now(), items:this.items });
      this.render();
    } catch (error) {
      if (request.signal.aborted) return;
      this.results.innerHTML = '<p>Chưa tải được danh sách quán. Bạn có thể thử lại hoặc tìm trực tiếp trên Google Maps.</p>';
    } finally { if (this.request === request) submit.disabled = false; }
    const google = this.panel.querySelector('[data-nearby-google]');
    google.href = googlePlaceSearch({ title:category === 'cafe' ? 'quán cà phê gần' : 'nhà hàng quán ăn gần', lat:center.lat,lng:center.lng });
  }
  render() {
    const keyword = this.panel.querySelector('[data-nearby-name]').value.toLocaleLowerCase('vi');
    const rows = this.items.map((item,index) => ({item,index})).filter(({item}) => `${item.title} ${item.cuisine || ''}`.toLocaleLowerCase('vi').includes(keyword));
    this.results.innerHTML = `<p>${rows.length} địa điểm · gần tâm map nhất trước · khoảng cách đường thẳng</p>${rows.map(({item,index}) => `<article><h3>${esc(item.title)}</h3><p>${esc(RoutingAdapter.formatDistance(item.distance))}${item.address ? ' · '+esc(item.address) : ''}</p>${item.cuisine ? `<small>${esc(item.cuisine)}</small>` : ''}${item.hours ? `<small>Giờ theo OSM: ${esc(item.hours)}</small>` : ''}<div class="nearby-actions"><button data-place-show="${index}">XEM MAP</button><a class="nearby-primary" target="_blank" rel="noopener noreferrer" href="${esc(googleDirections(item))}">CHỈ ĐƯỜNG ↗</a><a target="_blank" rel="noopener noreferrer" href="${esc(googlePlaceSearch(item))}">ĐÁNH GIÁ GOOGLE ↗</a><button data-place-save="${index}">${this.mission ? 'CHỌN CHO NHIỆM VỤ' : 'LƯU QUÁN'}</button></div></article>`).join('') || '<p>Chưa có quán phù hợp trong dữ liệu bản đồ. Thử tăng bán kính hoặc mở Google Maps để xem thêm.</p>'}`;
  }
}
