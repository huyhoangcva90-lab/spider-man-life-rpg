const CHAT_KEY = 'spidey-message-center-v1';

const starterThreads = [
  { from: 'NED // HQ', text: 'Tracker online. Main Quest và Daily Quest đã đồng bộ cùng Life OS.', at: 'NOW', tone: 'cyan' },
  { from: 'MJ // WATCH', text: 'Nhớ xem Timetable trước khi swing sang nhiệm vụ tiếp theo.', at: '2M', tone: 'amber' },
  { from: 'MILES // TEAM', text: 'Spider-Verse challenge có 5 cấp. Gọi mình khi Arena cần assist.', at: '5M', tone: 'green' }
];

export class ChatCenter {
  constructor(soundController) {
    this.sound = soundController;
    this.root = null;
    this.messages = this.load();
  }

  init() {
    this.root = document.getElementById('chat-center');
    if (!this.root) return;
    document.getElementById('btn-chat-list')?.addEventListener('click', () => this.open(false));
    document.getElementById('btn-chat-compose')?.addEventListener('click', () => this.open(true));
    document.getElementById('chat-center-close')?.addEventListener('click', () => this.close());
    document.getElementById('chat-composer')?.addEventListener('submit', (event) => this.send(event));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !this.root.hidden) this.close(); });
    this.render();
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
      return Array.isArray(saved) && saved.length ? saved : starterThreads;
    } catch { return starterThreads; }
  }

  open(focusComposer) {
    this.sound.playActivityVoice();
    this.root.hidden = false;
    this.root.removeAttribute('inert');
    this.root.classList.add('active');
    if (focusComposer) window.setTimeout(() => document.getElementById('chat-message-input')?.focus(), 80);
  }

  close() {
    this.sound.playClick();
    this.root.classList.remove('active');
    window.setTimeout(() => { this.root.hidden = true; this.root.setAttribute('inert', ''); }, 180);
  }

  send(event) {
    event.preventDefault();
    const input = document.getElementById('chat-message-input');
    const text = input?.value.trim();
    if (!text) return;
    this.messages.push({ from: 'YOU // PETER', text, at: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), tone: 'red', own: true });
    this.messages = this.messages.slice(-30);
    try { localStorage.setItem(CHAT_KEY, JSON.stringify(this.messages)); } catch { /* chat still works in memory */ }
    input.value = '';
    this.sound.playFreshSightingVoice();
    this.render();
    document.getElementById('chat-thread-list')?.lastElementChild?.scrollIntoView({ block: 'end' });
  }

  render() {
    const list = document.getElementById('chat-thread-list');
    if (!list) return;
    list.innerHTML = this.messages.map((message) => `<article class="chat-message chat-message--${message.tone || 'cyan'} ${message.own ? 'chat-message--own' : ''}"><span class="chat-avatar">${message.own ? 'ME' : 'SP'}</span><div><header><strong>${this.escape(message.from)}</strong><time>${this.escape(message.at)}</time></header><p>${this.escape(message.text)}</p></div></article>`).join('');
  }

  escape(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }
}
