import { createSessionReader } from './session-reader.mjs';
export const readOwnerSession = createSessionReader();

export function setupOwnerConnection(onConnected) {
  const root = document.getElementById('habit-owner-connection');
  const label = root.querySelector('summary');
  const state = root.querySelector('[role=status]');
  const form = root.querySelector('form');
  const check = async (force = false) => {
    try {
      const data = await readOwnerSession({ force });
      label.textContent = data.connected ? 'Kết nối riêng đã mở' : 'Mở kết nối Notion';
      state.textContent = data.connected ? 'Các nguồn dữ liệu báo thời điểm đồng bộ riêng ở từng màn.' : data.configured ? 'Dùng mã truy cập Spider hoặc mật khẩu Field hiện có. Không nhập khóa API Notion.' : 'Kết nối chưa sẵn sàng. Dữ liệu hiện tại có thể là bản lưu.';
      form.hidden = !data.configured || data.connected;
      return !!data.connected;
    } catch { state.textContent = 'Chưa kiểm tra được kết nối. Thử lại khi có mạng.'; return false; }
  };
  root.addEventListener('toggle', () => { if (root.open) void check(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = form.querySelector('button'); submit.disabled = true;
    try {
      const response = await fetch('/api/notion-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessCode: form.elements.accessCode.value }) });
      form.reset();
      if (!response.ok) throw Error('Chưa mở được phiên riêng. Kiểm tra lại mã hoặc mật khẩu Field.');
      if (await check(true)) { root.open = false; onConnected(); }
    } catch (error) { state.textContent = error.message; } finally { submit.disabled = false; }
  });
  void check();
}
