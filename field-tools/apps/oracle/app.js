(function () {
  'use strict';

  const cards = [
    ['0','Kẻ Khờ','ti ti-balloon','Một khởi đầu đang mở ra. Hôm nay, sự tò mò sẽ đưa bạn đi xa hơn một kế hoạch hoàn hảo.','Đâu là bước nhỏ bạn có thể thử mà không cần biết trước toàn bộ kết quả?'],
    ['I','Nhà Ảo Thuật','ti ti-wand','Bạn đã có đủ công cụ để bắt đầu. Điều còn thiếu không phải năng lực, mà là quyết định dùng nó vào đâu.','Hôm nay, bạn muốn chủ động tạo ra điều gì?'],
    ['II','Nữ Tư Tế','ti ti-moon','Có một điều bạn đã cảm thấy nhưng chưa gọi thành tên. Hãy để khoảng lặng nói trước khi tìm thêm lời khuyên bên ngoài.','Cảm giác đầu tiên của bạn đang cố nhắc điều gì?'],
    ['III','Hoàng Hậu','ti ti-flower','Năng lượng nuôi dưỡng đang hiện diện. Hãy chăm điều bạn muốn lớn lên bằng sự kiên nhẫn và dịu dàng.','Điều gì trong đời bạn đang cần được chăm sóc thay vì thúc ép?'],
    ['IV','Hoàng Đế','ti ti-building-castle','Một ranh giới rõ ràng sẽ mang lại bình an. Hôm nay phù hợp để sắp xếp, quyết định và đứng vững trong lựa chọn của mình.','Bạn cần đặt lại trật tự ở đâu?'],
    ['V','Giáo Hoàng','ti ti-book','Một nguyên tắc cũ đang cho bạn điểm tựa. Hãy học từ kinh nghiệm, nhưng chỉ giữ lại điều còn thật sự phù hợp.','Giá trị nào bạn không muốn đánh đổi?'],
    ['VI','Tình Nhân','ti ti-heart','Một lựa chọn cần sự đồng thuận giữa trái tim và lý trí. Điều đúng thường là điều giúp bạn sống thật hơn với chính mình.','Lựa chọn nào phản ánh con người thật của bạn?'],
    ['VII','Cỗ Xe','ti ti-car','Đà tiến đang đến, nhưng cần một hướng đi duy nhất. Thu năng lượng đang phân tán và đặt nó vào điều quan trọng nhất.','Đích đến nào xứng đáng với toàn bộ sự tập trung hôm nay?'],
    ['VIII','Sức Mạnh','ti ti-paw','Sức mạnh hôm nay không nằm ở ép buộc. Sự điềm tĩnh, kiên nhẫn và tử tế với chính mình sẽ giúp bạn đi qua điều khó.','Bạn có thể mềm lại mà vẫn giữ vững điều gì?'],
    ['IX','Ẩn Sĩ','ti ti-lamp','Lùi lại một nhịp không có nghĩa là bỏ cuộc. Khoảng riêng tư sẽ giúp bạn nghe được câu trả lời vốn đã ở bên trong.','Bạn cần tạm rời tiếng ồn nào?'],
    ['X','Bánh Xe Số Phận','ti ti-refresh','Nhịp cũ đang chuyển. Đừng cố giữ mọi thứ đứng yên; hãy chú ý cơ hội xuất hiện khi hoàn cảnh thay đổi.','Bạn có thể thích nghi với thay đổi này như thế nào?'],
    ['XI','Công Lý','ti ti-scale','Sự rõ ràng đến từ việc nhìn cả mong muốn lẫn hậu quả. Hãy lựa chọn dựa trên sự thật, không chỉ cảm xúc tức thời.','Điều gì là công bằng với cả bạn và người liên quan?'],
    ['XII','Người Treo Ngược','ti ti-perspective','Một góc nhìn mới quan trọng hơn việc cố tiến lên. Tạm dừng có chủ ý sẽ hé lộ điều mà sự vội vàng che khuất.','Nếu nhìn ngược lại, bạn sẽ thấy điều gì khác?'],
    ['XIII','Chuyển Hóa','ti ti-butterfly','Một chương đang khép lại để tạo chỗ cho điều mới. Buông bỏ đúng lúc là một hành động sống, không phải mất mát.','Điều gì đã hoàn thành vai trò của nó?'],
    ['XIV','Tiết Chế','ti ti-droplets','Hôm nay cần sự pha trộn vừa đủ: làm và nghỉ, nói và nghe, mong muốn và thực tế. Đừng đi đến cực đoan.','Bạn cần điều chỉnh nhịp độ ở đâu?'],
    ['XV','Bóng Tối','ti ti-link','Một thói quen hoặc nỗi sợ đang khiến lựa chọn có vẻ ít hơn thực tế. Gọi đúng tên nó là bước đầu để lấy lại tự do.','Điều gì đang giữ bạn lại vì bạn cho phép nó?'],
    ['XVI','Tòa Tháp','ti ti-bolt','Một sự thật có thể làm rung cấu trúc cũ, nhưng cũng giải phóng bạn khỏi điều không còn vững. Hãy giữ phần cốt lõi, để phần giả tạo rơi xuống.','Điều gì cần được xây lại trên nền thật hơn?'],
    ['XVII','Ngôi Sao','ti ti-sparkles','Sau những ngày nặng nề, hy vọng đang trở lại theo cách yên tĩnh. Hãy tin vào quá trình hồi phục và tiếp tục nuôi ánh sáng nhỏ.','Điều gì vẫn khiến bạn tin vào ngày mai?'],
    ['XVIII','Mặt Trăng','ti ti-moon-stars','Mọi thứ chưa hoàn toàn rõ ràng. Đừng vội kết luận khi cảm xúc đang phóng đại bóng tối; hãy đi chậm và kiểm chứng.','Đâu là sự thật, đâu là điều bạn đang lo sợ?'],
    ['XIX','Mặt Trời','ti ti-sun','Một nguồn sáng rõ ràng đang hiện diện. Cho phép mình vui, được nhìn thấy và ghi nhận điều đang tiến triển tốt.','Bạn có thể ăn mừng điều gì ngay hôm nay?'],
    ['XX','Thức Tỉnh','ti ti-bell-ringing','Đã đến lúc nhìn lại mà không tự kết tội. Bài học cũ đang gọi bạn bước sang một phiên bản thành thật hơn.','Bạn đã sẵn sàng trả lời lời gọi nào?'],
    ['XXI','Thế Giới','ti ti-world','Một vòng tròn đang hoàn tất. Hãy ghi nhận quãng đường đã đi trước khi mở cánh cửa tiếp theo.','Bạn cần công nhận thành tựu nào của chính mình?']
  ];
  const englishNames = ['THE FOOL','THE MAGICIAN','THE HIGH PRIESTESS','THE EMPRESS','THE EMPEROR','THE HIEROPHANT','THE LOVERS','THE CHARIOT','STRENGTH','THE HERMIT','WHEEL OF FORTUNE','JUSTICE','THE HANGED MAN','DEATH','TEMPERANCE','THE DEVIL','THE TOWER','THE STAR','THE MOON','THE SUN','JUDGEMENT','THE WORLD'];
  const rankThemes = {
    1: ['Mầm khởi đầu đang xuất hiện; hãy đón nhận tiềm năng trước khi đòi hỏi một kết quả hoàn chỉnh.','Bạn muốn gieo hạt giống nào?'],
    2: ['Hai hướng đang cần được cân bằng. Đừng chọn chỉ để thoát khỏi cảm giác lưỡng lự.','Điều gì giúp hai phía cùng được lắng nghe?'],
    3: ['Năng lượng phát triển đến từ kết nối, trao đổi và cùng nhau tạo nên điều lớn hơn.','Ai hoặc điều gì có thể đồng hành với bạn?'],
    4: ['Sự ổn định đang cần thiết, nhưng hãy để ý khi an toàn biến thành trì trệ hoặc khép kín.','Bạn đang bảo vệ điều gì quá chặt?'],
    5: ['Một thử thách đang phơi bày điểm yếu cần được nhìn thẳng. Đây là ma sát để trưởng thành, không phải dấu chấm hết.','Bài học nào nằm bên trong khó khăn này?'],
    6: ['Dòng chảy bắt đầu hài hòa hơn. Hãy nhận sự hỗ trợ và cũng nhớ trao lại điều mình có thể.','Bạn cần nhận hay cần cho nhiều hơn?'],
    7: ['Bạn đang được thử thách về niềm tin và sự kiên định. Hãy kiểm tra thực tế trước khi tiếp tục đầu tư năng lượng.','Điều gì thật sự xứng đáng để bạn kiên trì?'],
    8: ['Mọi thứ đang chuyển động nhanh. Sự tập trung và hành động đúng lúc sẽ quan trọng hơn suy nghĩ thêm.','Bước nào có thể thực hiện ngay hôm nay?'],
    9: ['Bạn đã đi gần hết một chặng đường. Giữ ranh giới và sức bền, nhưng đừng tự cô lập mình.','Bạn cần bảo vệ năng lượng theo cách nào?'],
    10: ['Một chu kỳ đã đầy và mang theo cả thành quả lẫn sức nặng. Đã đến lúc hoàn tất hoặc chia bớt gánh.','Bạn có thể buông bớt trách nhiệm nào?']
  };
  const suitInfo = {
    gay: { vi:'Gậy', en:'WANDS', icon:'ti ti-flame', focus:'hành động, động lực và tham vọng', files:(n)=>`gay ${n}.png` },
    ly: { vi:'Ly', en:'CUPS', icon:'ti ti-cup', focus:'cảm xúc, tình yêu và các mối quan hệ', files:(n)=>`ly (${n}).png` },
    kiem: { vi:'Kiếm', en:'SWORDS', icon:'ti ti-sword', focus:'suy nghĩ, giao tiếp và những xung đột', files:(n)=>`kiem (${n}).png` },
    xu: { vi:'Xu', en:'PENTACLES', icon:'ti ti-coin', focus:'tiền bạc, công việc và nền tảng thực tế', files:(n)=>`xu (${n}).png` }
  };
  const courtInfo = {
    Pages: ['Tiểu Đồng','PAGE','Một thông tin hoặc cách học mới đang mở ra. Hãy giữ tâm thế tò mò thay vì vội chứng minh mình đã biết.','Bạn đang được mời học điều gì?'],
    Knights: ['Kỵ Sĩ','KNIGHT','Năng lượng muốn tiến về phía trước. Hãy hành động có chủ đích để nhiệt huyết không biến thành hấp tấp.','Bạn đang theo đuổi điều gì và vì sao?'],
    Queens: ['Nữ Hoàng','QUEEN','Sự trưởng thành nằm ở khả năng làm chủ thế giới bên trong và nuôi dưỡng điều có ý nghĩa.','Bạn có thể tin vào phẩm chất nào của mình?'],
    Kings: ['Quốc Vương','KING','Đây là lời gọi bước vào vai trò chủ động, có trách nhiệm và nhìn xa hơn cảm xúc nhất thời.','Bạn cần lãnh đạo phần nào trong cuộc sống?']
  };
  const sourceCards = Array.isArray(window.TAROT_SOURCE_CARDS) ? window.TAROT_SOURCE_CARDS : [];
  const rankNames = { 1:'ACE', 2:'TWO', 3:'THREE', 4:'FOUR', 5:'FIVE', 6:'SIX', 7:'SEVEN', 8:'EIGHT', 9:'NINE', 10:'TEN' };
  function getSourceCard(card) {
    const key = card.kind === 'minor'
      ? `${rankNames[card.rank]} OF ${suitInfo[card.suit].en}`
      : card.english;
    return sourceCards.find((item) => item.key === key || item.key.includes(key));
  }
  function enrichCard(card) {
    const source = getSourceCard(card);
    if (!source) return card;
    return {
      ...card,
      meaning: source.upright || source.overview || card.meaning,
      reversedMeaning: source.reversed || '',
      sourceUrl: source.sourceUrl
    };
  }
  function buildDeck() {
    const major = cards.map((card,index) => ({ kind:'major', number:card[0], name:card[1], english:englishNames[index], icon:card[2], meaning:card[3], reflection:card[4], image:`${index}.png` }));
    const minor = [];
    Object.entries(suitInfo).forEach(([key,suit]) => {
      for (let rank=1; rank<=10; rank++) {
        minor.push({ kind:'minor', suit:key, rank, number:String(rank), name:`${rank} ${suit.vi}`, english:`${rank} OF ${suit.en}`, icon:suit.icon, meaning:`Trong lĩnh vực ${suit.focus}, ${rankThemes[rank][0].toLowerCase()}`, reflection:rankThemes[rank][1], image:suit.files(rank) });
      }
      Object.entries(courtInfo).forEach(([file,[vi,en,meaning,reflection]]) => minor.push({ kind:'court', suit:key, rank:en, number:en, name:`${vi} ${suit.vi}`, english:`${en} OF ${suit.en}`, icon:suit.icon, meaning:`Liên quan đến ${suit.focus}: ${meaning}`, reflection, image:`${file} ${key}.png` }));
    });
    return major.concat(minor).map(enrichCard);
  }
  const fullDeck = buildDeck();
  const screens = ['startScreen','setupScreen','drawScreen'];
  const state = { mode: 'daily', context: 'Thông điệp hôm nay', selected: [], targetCount: 1, positions: [] };
  const $ = (id) => document.getElementById(id);
  const secureRandom = (max) => {
    if (window.crypto && crypto.getRandomValues) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % max; }
    return Math.floor(Math.random() * max);
  };
  function show(id) { screens.forEach((s) => $(s).classList.toggle('is-active', s === id)); window.scrollTo({top:0,behavior:'smooth'}); }
  
  function beginDraw(context) {
    state.context = context; state.selected = Array(state.mode === 'daily' ? 1 : 3).fill(null);
    state.targetCount = state.mode === 'daily' ? 1 : 3;
    state.positions = state.mode === 'daily'
      ? ['Năng lượng hôm nay']
      : state.mode === 'topic'
        ? ['Hiện trạng','Điều đang ẩn','Hướng đi']
        : ['Cốt lõi câu hỏi','Điều cần biết','Lời khuyên'];
        
    $('drawContext').textContent = context;
    $('drawReading').hidden = true;
    $('cardReadings').innerHTML = '';
    
    // Reset titles
    $('drawTitle').textContent = 'Hít thở thật sâu';
    $('drawHint').textContent = 'Chạm vào các lá bài bên dưới để rút và lật mở thông điệp.';
    
    renderSpread();
    show('drawScreen');
  }
  
  document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
    state.mode = button.dataset.mode;
    if (state.mode === 'daily') return beginDraw('Thông điệp hôm nay');
    const isTopic = state.mode === 'topic';
    $('setupEyebrow').textContent = isTopic ? 'Chọn chủ đề' : 'Đặt câu hỏi';
    $('setupTitle').textContent = isTopic ? 'Điều gì đang gọi bạn?' : 'Bạn muốn nhìn rõ điều gì?';
    $('topicPicker').hidden = !isTopic; $('questionForm').hidden = isTopic; show('setupScreen');
    if (!isTopic) setTimeout(() => $('questionInput').focus(), 350);
  }));
  $('setupBack').addEventListener('click', () => show('startScreen'));
  document.querySelectorAll('[data-topic]').forEach((button) => button.addEventListener('click', () => beginDraw(button.dataset.topic)));
  $('questionInput').addEventListener('input', (event) => $('charCount').textContent = `${event.target.value.length}/160`);
  $('questionForm').addEventListener('submit', (event) => { event.preventDefault(); const value = $('questionInput').value.trim(); if (!value) { $('questionInput').focus(); return; } beginDraw(value); });

  function renderSpread() {
    const spreadArea = $('spreadArea');
    spreadArea.innerHTML = '';
    
    for (let i = 0; i < state.targetCount; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'spread-card-wrap';
      wrap.innerHTML = `
        <button class="tarot-card" aria-label="Lật lá bài ${state.positions[i]}" data-index="${i}">
          <span class="card-inner">
            <span class="card-face card-back"><small>Chạm để rút</small></span>
            <span class="card-face card-front"></span>
          </span>
        </button>
        <div class="result-card-meta" style="opacity: 1; transform: none;">
          <em style="color: var(--gold); font-size: 8px; font-style: normal; letter-spacing: 0.1em; text-transform: uppercase;">${state.positions[i]}</em>
          <strong class="card-name-label" style="font-family: var(--serif); font-size: clamp(14px, 3.5vw, 18px); font-weight: 500; opacity: 0.4;">Đang chờ...</strong>
          <small class="card-orientation-label" style="font-size: 8px; text-transform: uppercase; color: var(--muted); margin-top: 2px;">Chưa rút</small>
        </div>
      `;
      
      const cardBtn = wrap.querySelector('.tarot-card');
      cardBtn.addEventListener('click', () => drawAndFlipCard(cardBtn, wrap, i));
      spreadArea.appendChild(wrap);
    }
  }

  function drawAndFlipCard(cardBtn, wrap, index) {
    if (state.selected[index]) return; // prevent flipping twice
    
    // Select unique random card
    let drawn;
    do { 
      drawn = fullDeck[secureRandom(fullDeck.length)]; 
    } while (state.selected.some((item) => item && item.card.image === drawn.image));
    
    const isReversed = secureRandom(100) < 28;
    state.selected[index] = { card: drawn, reversed: isReversed };
    
    // 1. Visual lift animation: "cảm giác rút lên"
    wrap.classList.add('is-drawn');
    
    // Spark animation
    createSelectionBurst(wrap);
    
    // 2. Flip animation: reveal details (keep image upright)
    setTimeout(() => {
      cardBtn.classList.add('is-flipped');
      const cardFront = cardBtn.querySelector('.card-front');
      cardFront.innerHTML = `
        <img src="../../assets/tarot/${encodeURIComponent(drawn.image)}" alt="Lá bài ${drawn.name}" decoding="async">
        <span class="card-inscription card-inscription-top">${drawn.number}</span>
        <span class="card-inscription card-inscription-bottom${drawn.english.length > 18 ? ' is-very-long' : drawn.english.length > 13 ? ' is-long' : ''}">${drawn.english}</span>
        ${isReversed ? '<span class="card-badge">↕ NGƯỢC</span>' : '<span class="card-badge" style="border-color: #6ee7c8; color: #6ee7c8;">☼ XUÔI</span>'}
      `;
    }, 150);
    
    // 3. Settle details and check if spread complete
    setTimeout(() => {
      cardBtn.classList.add('is-settled');
      
      const nameLabel = wrap.querySelector('.card-name-label');
      nameLabel.textContent = drawn.name;
      nameLabel.style.opacity = '1';
      
      const orientLabel = wrap.querySelector('.card-orientation-label');
      orientLabel.textContent = isReversed ? 'Lá ngược' : 'Lá xuôi';
      orientLabel.style.color = isReversed ? 'var(--gold)' : 'var(--gold-bright)';
      
      const completeCount = state.selected.filter(item => item !== null).length;
      if (completeCount === state.targetCount) {
        $('drawTitle').textContent = 'Trải bài hoàn tất';
        $('drawHint').textContent = 'Khám phá lời giải nghĩa chi tiết ở bên dưới.';
        setTimeout(() => {
          showFinalReading();
        }, 600);
      } else {
        $('drawTitle').textContent = `Chọn lá tiếp theo`;
        $('drawHint').textContent = `${completeCount}/${state.targetCount} lá đã lật mở.`;
      }
    }, 720);
  }

  function createSelectionBurst(parent) {
    const burst = document.createElement('span'); 
    burst.className = 'selection-burst';
    burst.style.cssText = `position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 55;`;
    for (let i=0; i<10; i++) {
      const spark = document.createElement('i');
      spark.style.setProperty('--angle', `${i * 36}deg`);
      spark.style.animationDelay = `${i * 12}ms`;
      burst.appendChild(spark);
    }
    parent.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
  }

  function showFinalReading() {
    buildReading();
    const readingSection = $('drawReading');
    readingSection.hidden = false;
    readingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function buildReading() {
    const domain = detectDomain();
    $('cardReadings').innerHTML = state.selected.map((selection,index) => {
      const prefix = selection.reversed ? 'Năng lượng này đang bị chặn, chậm lại hoặc hướng vào bên trong. ' : '';
      const sourceMeaning = selection.reversed && selection.card.reversedMeaning
        ? selection.card.reversedMeaning
        : selection.card.meaning;
      const sourceLink = selection.card.sourceUrl
        ? `<a class="reading-source" href="${selection.card.sourceUrl}" target="_blank" rel="noopener noreferrer">Xem ý nghĩa đầy đủ <i class="ti ti-external-link"></i></a>`
        : '';
      const detail = createDetailedMeaning(selection.card, selection.reversed, state.positions[index], domain, index);
      return `<section class="card-reading">
        <small>${state.positions[index]}</small>
        <strong>${selection.card.name} · ${selection.reversed ? 'Ngược' : 'Xuôi'}</strong>
        <div class="reading-detail"><b>Thông điệp chính</b><p>${prefix}${sourceMeaning}</p>${sourceLink}</div>
        <div class="reading-detail"><b>${domain.label}</b><p>${detail.domain}</p></div>
        <div class="reading-detail"><b>Vai trò trong trải bài</b><p>${detail.position}</p></div>
        <div class="reading-detail"><b>Điều nên làm</b><p>${detail.action}</p></div>
      </section>`;
    }).join('');
    const names = state.selected.map((item) => item.card.name).join(', ');
    $('readingText').textContent = state.targetCount === 1
      ? `Trọng tâm hôm nay nằm ở ${state.selected[0].card.name}. Lá bài không đóng khung tương lai mà chỉ ra dòng năng lượng đang mạnh nhất: điều bạn cần nhìn, cách bạn đang phản ứng và khoảng tự do vẫn còn trong lựa chọn. Hãy quan sát xem thông điệp này xuất hiện ở đâu trong ngày thay vì cố buộc mọi sự kiện phải khớp với nó.`
      : createSynthesis(names, domain);
    $('reflectionText').textContent = `${state.selected[state.selected.length - 1].card.reflection} Hãy ghi lại câu trả lời đầu tiên xuất hiện, kể cả khi nó chưa hoàn chỉnh.`;
  }
  function detectDomain() {
    const text = state.context.toLowerCase();
    if (/tình|yêu|quan hệ|người ấy|crush|kết hôn|chia tay/.test(text)) return { key:'love', label:'Trong tình cảm' };
    if (/tiền|tài chính|thu nhập|đầu tư|chi tiêu|nợ/.test(text)) return { key:'finance', label:'Trong tài chính' };
    if (/việc|nghề|sự nghiệp|dự án|học|công ty|kinh doanh/.test(text)) return { key:'work', label:'Trong công việc' };
    return { key:'general', label:'Trong hoàn cảnh hiện tại' };
  }
  function createDetailedMeaning(card,reversed,position,domain,index) {
    const suit = card.suit || 'major';
    const domainMap = {
      love: {
        gay:'Sức hút và đam mê đang cao, nhưng cần phân biệt giữa nhiệt thành bền vững với cảm giác muốn chinh phục. Hãy nhìn vào hành động nhất quán thay vì chỉ tin lời hứa hoặc khoảnh khắc mãnh liệt.',
        ly:'Cảm xúc là trung tâm của câu chuyện. Sự chân thành, khả năng đón nhận và cách hai người nuôi dưỡng an toàn cảm xúc sẽ quyết định mối quan hệ tiến gần hay xa nhau.',
        kiem:'Điều cần chữa là cách giao tiếp và những giả định chưa được kiểm chứng. Một cuộc nói chuyện rõ ràng có thể khó chịu lúc đầu nhưng tốt hơn việc để im lặng biến thành khoảng cách.',
        xu:'Mối quan hệ cần được nhìn qua sự ổn định, trách nhiệm và những gì hai bên thực sự xây dựng cùng nhau. Tình cảm đẹp vẫn cần thời gian, sự hiện diện và cam kết cụ thể.',
        major:'Đây là một bài học tình cảm có tính bước ngoặt. Mối quan hệ đang phản chiếu một phần quan trọng trong hành trình trưởng thành, buộc bạn chọn giữa lặp lại thói quen cũ và sống thật hơn.'
      },
      work: {
        gay:'Động lực, tham vọng và tốc độ là điểm nổi bật. Cơ hội có thể đến khi bạn chủ động, nhưng cần một mục tiêu đủ rõ để năng lượng không bị tản ra vào quá nhiều hướng.',
        ly:'Sự hài lòng, môi trường làm việc và kết nối con người quan trọng không kém thành tích. Hãy hỏi liệu công việc này có nuôi dưỡng giá trị của bạn hay chỉ khiến bạn bận rộn.',
        kiem:'Đây là vấn đề của chiến lược, quyết định và trao đổi thông tin. Kiểm tra dữ kiện, nói rõ kỳ vọng và đừng để áp lực khiến bạn phản ứng trước khi hiểu toàn cảnh.',
        xu:'Năng lực thực tế, thu nhập và quá trình tích lũy đang được nhấn mạnh. Tiến chậm nhưng chắc, hoàn thiện kỹ năng và giữ cam kết sẽ tạo kết quả đáng tin hơn đường tắt.',
        major:'Một chuyển biến nghề nghiệp lớn hơn công việc thường ngày đang hình thành. Lá bài hỏi bạn muốn trở thành ai qua công việc, không chỉ muốn đạt được chức danh hay kết quả nào.'
      },
      finance: {
        gay:'Tiền bạc liên quan đến một kế hoạch đang cần hành động và tầm nhìn. Tránh quyết định vì hưng phấn; hãy biến ý tưởng thành các bước có giới hạn rủi ro rõ ràng.',
        ly:'Cảm xúc có thể đang ảnh hưởng đến cách chi tiêu hoặc đánh giá giá trị. Hãy tránh dùng tiền để bù đắp cảm giác thiếu thốn và ưu tiên lựa chọn mang lại sự đủ đầy lâu dài.',
        kiem:'Cần đọc kỹ con số, điều khoản và giả định. Nỗi lo có thể giúp bạn thận trọng nhưng không nên trở thành lý do trì hoãn mọi quyết định hoặc chọn trong hoảng sợ.',
        xu:'Đây là bộ bài gắn trực tiếp với nguồn lực vật chất. Hãy tập trung vào ngân sách, tích lũy, tài sản và những hành động nhỏ có thể lặp lại đều đặn.',
        major:'Tài chính ở đây gắn với một bài học lớn về quyền tự chủ và giá trị cá nhân. Quyết định tốt là quyết định phù hợp với đường dài, không chỉ giải tỏa áp lực trong khoảnh khắc.'
      },
      general: {
        gay:'Năng lượng muốn chuyển thành hành động. Điều quan trọng là chọn đúng hướng, giữ nhịp và để sự nhiệt thành phục vụ một mục tiêu có ý nghĩa.',
        ly:'Thế giới cảm xúc đang cung cấp thông tin quan trọng. Hãy lắng nghe cảm giác nhưng cũng tạo đủ khoảng lặng để phân biệt trực giác với phản ứng nhất thời.',
        kiem:'Tâm trí, lời nói và cách nhìn nhận đang quyết định trải nghiệm của bạn. Sự thật sẽ rõ hơn khi bạn tách dữ kiện khỏi câu chuyện mình đang tự kể.',
        xu:'Hãy quay về điều cụ thể: cơ thể, thời gian, tiền bạc, trách nhiệm và môi trường sống. Một thay đổi nhỏ nhưng thực tế có thể hữu ích hơn một ý định lớn.',
        major:'Bạn đang chạm vào một chủ đề lớn của hành trình cá nhân. Đây không chỉ là chuyện của hôm nay mà là cơ hội thay đổi cách bạn nhìn và lựa chọn trong một chu kỳ dài hơn.'
      }
    };
    const positionTexts = [
      `Ở vị trí “${position}”, ${card.name} mô tả nền năng lượng đang vận hành. Hãy dùng nó để gọi đúng tên điều đang xảy ra, chưa cần vội phán xét tốt hay xấu.`,
      `Ở vị trí “${position}”, ${card.name} chỉ vào phần dễ bị bỏ qua: động cơ, nỗi sợ hoặc nguồn lực chưa được thừa nhận. Đây thường là chiếc chìa khóa làm thay đổi cách đọc lá đầu tiên.`,
      `Ở vị trí “${position}”, ${card.name} không hứa một kết quả cố định mà đề xuất thái độ và bước đi phù hợp nhất. Quyền quyết định vẫn nằm ở cách bạn sử dụng thông tin này.`
    ];
    const action = reversed
      ? `${card.reflection} Vì lá đang ngược, hãy giảm tốc, kiểm tra điều bị né tránh và xử lý từ bên trong trước khi thúc ép hoàn cảnh thay đổi.`
      : `${card.reflection} Chọn một hành động nhỏ, rõ ràng và có thể thực hiện trong 24 giờ để đưa thông điệp của lá bài vào thực tế.`;
    return { domain:domainMap[domain.key][suit], position:positionTexts[Math.min(index,2)], action };
  }
  function createSynthesis(names,domain) {
    const reversedCount = state.selected.filter(item => item.reversed).length;
    const suits = state.selected.map(item => item.card.suit).filter(Boolean);
    const repeatedSuit = suits.find((suit,index) => suits.indexOf(suit) !== index);
    const tone = reversedCount >= 2
      ? 'Nhiều lá ngược cho thấy câu trả lời chưa nằm ở việc hành động nhanh. Trải bài thiên về tháo gỡ nút thắt, nhìn lại giả định và thu hồi năng lượng đang bị phân tán.'
      : reversedCount === 1
        ? 'Một lá ngược tạo ra điểm nghẽn trong tiến trình. Đây không phải điềm xấu; nó chỉ ra chính xác nơi cần kiên nhẫn hoặc thay đổi cách tiếp cận.'
        : 'Ba lá xuôi tạo nên một dòng chuyển động khá rõ: nhận biết, điều chỉnh và tiến lên. Tuy vậy, sự thuận chiều vẫn cần lựa chọn có ý thức.';
    const element = repeatedSuit
      ? 'Một nhóm nguyên tố được lặp lại cho thấy chủ đề này đang chiếm nhiều năng lượng hơn bạn tưởng. Đừng chỉ xử lý biểu hiện bên ngoài; hãy quay về nhu cầu cốt lõi mà các lá cùng nhắc tới.'
      : 'Các lá đến từ những nhóm năng lượng khác nhau, vì vậy câu chuyện cần sự cân bằng giữa cảm xúc, suy nghĩ, hành động và thực tế thay vì dựa vào một phía duy nhất.';
    return `Nhìn tổng thể, ${names} tạo thành một tiến trình hoàn chỉnh cho ${domain.label.toLowerCase()}: lá đầu xác định thực trạng, lá giữa mở phần chưa được nhìn thấy và lá cuối đưa ra hướng hành động. ${tone} ${element} Hãy đọc cả ba như một câu chuyện liên tục, không tách chúng thành ba dự đoán rời rạc.`;
  }
  function reset() { state.selected = []; $('drawReading').hidden = true; show('startScreen'); }
  $('newReading').addEventListener('click', reset); $('resetButton').addEventListener('click', reset);
})();
