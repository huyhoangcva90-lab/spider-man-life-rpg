const CHAT_KEY = 'spidey-message-center-v1';
const DEMO_SENDERS = new Set(['NED // HQ', 'MJ // WATCH', 'MILES // TEAM']);
export const KAREN_TELEGRAM_URL = 'https://t.me/Huykl_KarenBot';

// Continue the owner's existing Hermes bot in Telegram. Do not simulate replies
// or send browser drafts, Notion data or credentials through the link.
export class ChatCenter {
  constructor(soundController) { this.sound = soundController; }

  init() {
    try {
      const saved = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
      if (Array.isArray(saved)) {
        localStorage.setItem(CHAT_KEY, JSON.stringify(saved.filter(message => !DEMO_SENDERS.has(message?.from))));
      }
    } catch { /* A storage failure must not block opening Telegram. */ }
    for (const id of ['btn-chat-list', 'btn-chat-compose']) {
      document.getElementById(id)?.addEventListener('click', () => this.open());
    }
  }

  open() {
    this.sound?.playClick?.();
    window.open(KAREN_TELEGRAM_URL, '_blank', 'noopener,noreferrer');
  }
}
