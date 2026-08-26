/* WEB OPS TRACKER V6 - SEARCH PANEL UI */

export class SearchPanel {
  constructor(geocoderAdapter, eventBus, soundController) {
    this.geocoder = geocoderAdapter;
    this.bus = eventBus;
    this.sound = soundController;
    this.searchInput = null;
    this.resultsContainer = null;
    this.isSearching = false;
  }

  init() {
    this.searchInput = document.getElementById('search-input');
    this.resultsContainer = document.getElementById('search-results-dropdown');
    const searchBtn = document.getElementById('search-submit-btn');

    if (!this.searchInput) return;

    // Explicit search on Enter key press
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.performSearch();
      }
    });

    // Explicit search on Search button click
    searchBtn?.addEventListener('click', () => {
      this.performSearch();
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!this.resultsContainer.contains(e.target) && e.target !== this.searchInput && e.target !== searchBtn) {
        this.hideResults();
      }
    });
  }

  async performSearch() {
    const query = this.searchInput.value.trim();
    if (!query) return;

    this.sound.playClick();
    this.showSearchingState();

    const results = await this.geocoder.search(query);
    this.renderResults(results);
  }

  showSearchingState() {
    if (!this.resultsContainer) return;
    this.resultsContainer.style.display = 'block';
    this.resultsContainer.innerHTML = `
      <div style="padding: 12px; font-size: 11px; color: var(--amber-gold); text-align: center;">
        🔍 Đang tìm kiếm trên bản đồ... (Thực hiện rate limit 1s/yêu cầu)
      </div>
    `;
  }

  renderResults(results) {
    if (!this.resultsContainer) return;

    if (!results || results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 12px; font-size: 11px; color: var(--color-meeting); text-align: center;">
          ❌ Không tìm thấy kết quả phù hợp cho từ khóa này.
        </div>
      `;
      return;
    }

    this.resultsContainer.style.display = 'block';
    this.resultsContainer.innerHTML = results.map(item => `
      <div class="search-result-item" data-lat="${item.lat}" data-lng="${item.lng}" data-address="${encodeURIComponent(item.address)}" data-title="${encodeURIComponent(item.title)}">
        <div style="font-weight: 600; color: #fff; font-size: 12px;">📍 ${item.title}</div>
        <div style="font-size: 10px; color: var(--text-muted); line-height: 1.3;">${item.address}</div>
        <div style="font-size: 8px; color: var(--amber-gold); margin-top: 2px;">${item.attribution}</div>
      </div>
    `).join('');

    // Bind item clicks
    const items = this.resultsContainer.querySelectorAll('.search-result-item');
    items.forEach(el => {
      el.addEventListener('click', () => {
        const lat = parseFloat(el.getAttribute('data-lat'));
        const lng = parseFloat(el.getAttribute('data-lng'));
        const address = decodeURIComponent(el.getAttribute('data-address'));
        const title = decodeURIComponent(el.getAttribute('data-title'));

        this.sound.playSelect();
        this.hideResults();

        // Fly camera to result
        this.bus.emit('FLY_TO_LOCATION', { lat, lng, zoom: 16 });

        // Prompt user to save entry
        this.bus.emit('OPEN_EDITOR', {
          title,
          lat,
          lng,
          address,
          source: 'SEARCH'
        });
      });
    });
  }

  hideResults() {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'none';
    }
  }
}
