/* WEB OPS TRACKER V6 - SAMPLE DATA LOADER */

export class SampleDataLoader {
  static getDemoEntries() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return [
      {
        id: 'demo-entry-1',
        type: 'MEETING',
        title: '[DEMO] Họp chiến lược Đặc vụ Tech',
        lat: 10.7769,
        lng: 106.7009,
        address: 'Quận 1, TP. Hồ Chí Minh',
        startsAt: `${todayStr}T09:30:00.000Z`,
        endsAt: `${todayStr}T11:00:00.000Z`,
        personName: 'Nguyễn Văn Anh',
        notes: 'Thảo luận kế hoạch triển khai Hub Tracker V6 thực tế.',
        status: 'CONFIRMED',
        notionPageUrl: '',
        source: 'DEMO',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'demo-entry-2',
        type: 'LEISURE',
        title: '[DEMO] Cà phê Đào Tấn & Ghé thăm Căn cứ',
        lat: 10.7720,
        lng: 106.6980,
        address: 'Quận 1, TP. Hồ Chí Minh',
        startsAt: `${todayStr}T14:00:00.000Z`,
        endsAt: `${todayStr}T16:00:00.000Z`,
        personName: 'Lê Minh',
        notes: 'Gặp gỡ trao đổi về thiết bị cảm biến bản đồ.',
        status: 'PLANNED',
        notionPageUrl: '',
        source: 'DEMO',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 'demo-entry-3',
        type: 'ERRAND',
        title: '[DEMO] Mua linh kiện máy quét GPS',
        lat: 10.7800,
        lng: 106.6920,
        address: 'Quận 3, TP. Hồ Chí Minh',
        startsAt: `${todayStr}T08:00:00.000Z`,
        endsAt: `${todayStr}T09:00:00.000Z`,
        personName: '',
        notes: 'Nâng cấp ăng-ten thu nhận vệ tinh GNSS.',
        status: 'DONE',
        notionPageUrl: '',
        source: 'DEMO',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];
  }

  static getSeedEntries() {
    return [];
  }
}
