import fs from 'node:fs';
import path from 'node:path';

const iconDir = path.resolve('assets/gadget-icons');
fs.mkdirSync(iconDir, { recursive: true });

const webShooterModes = [
  ['standard-web-line', 'Standard Web Line', 'WEB_AMMO', 'basic', 'Infinite', 0, ['web', 'interrupt'], 'Sợi tơ tiêu chuẩn để khóa tay, kéo vật thể nhẹ và ngắt nhịp tấn công.', 'Default quick shot for safe crowd control.'],
  ['rapid-fire-web', 'Rapid-Fire Web', 'WEB_AMMO', 'burst', 'Heat meter', 1, ['web', 'combo'], 'Bắn loạt tơ mỏng tốc độ cao, dùng để giữ combo và tích web buildup nhanh.', 'Best when enemies are already staggered.'],
  ['impact-webbing', 'Impact Webbing', 'WEB_AMMO', 'impact', '3 shots', 3, ['web', 'knockback', 'stun'], 'Tơ nén áp lực cao bắn một phát đẩy mục tiêu dính chặt vào tường hoặc sàn.', 'High stagger single target shot.'],
  ['web-bomb', 'Web Bomb', 'WEB_DEPLOYABLE', 'area', '3 bombs', 3, ['web', 'area', 'immobilize'], 'Quả cầu tơ nổ diện rộng, quấn nhiều mục tiêu trong cùng một nhịp.', 'Classic crowd lock gadget.'],
  ['web-grenade', 'Web Grenade', 'WEB_DEPLOYABLE', 'scatter', '2 grenades', 3, ['web', 'area', 'knockback'], 'Lựu tơ bung mảnh theo hình nan nhện, đẩy lùi nhóm địch áp sát.', 'Better spacing than Web Bomb, less hard lock.'],
  ['net-web', 'Net Web', 'WEB_AMMO', 'net', '2 nets', 2, ['web', 'immobilize'], 'Bắn lưới tơ bản rộng để chặn đường lao tới hoặc bắt mục tiêu bay thấp.', 'Good anti-air and lane control.'],
  ['ricochet-web', 'Ricochet Web', 'WEB_AMMO', 'ricochet', '3 shots', 2, ['web', 'chain'], 'Đạn tơ nảy qua nhiều mục tiêu, dọn nhóm nhỏ đứng gần nhau.', 'Chain control without spending drone charges.'],
  ['splitter-web', 'Splitter Web', 'WEB_AMMO', 'split', '2 bursts', 2, ['web', 'area'], 'Một phát tơ tách thành nhiều tia nhỏ sau khi rời cổ tay, phủ cone phía trước.', 'Wide cone opener.'],
  ['hook-web', 'Hook Web', 'WEB_AMMO', 'hook', '4 hooks', 1, ['web', 'pull'], 'Đầu móc tơ kéo vũ khí, khiên hoặc mục tiêu nhẹ về phía Spider.', 'Utility pull, not raw damage.'],
  ['taser-web', 'Taser Web', 'WEB_AMMO', 'electric', '3 charges', 3, ['web', 'venom', 'stun'], 'Tơ dẫn điện giật tê liệt mục tiêu công nghệ hoặc kẻ địch dùng giáp điện.', 'Peter tech answer to electric enemies.'],
  ['non-conductive-webbing', 'Non-Conductive Webbing', 'WEB_AMMO', 'insulated', '2 canisters', 2, ['web', 'barrier'], 'Tơ cách điện dùng để khóa nguồn điện, bọc dây hở hoặc chống phản sốc.', 'Defensive cartridge for Electro-style threats.'],
  ['magnetic-webbing', 'Magnetic Webbing', 'WEB_AMMO', 'magnet', '2 cartridges', 2, ['web', 'pull', 'marked'], 'Tơ có hạt từ tính kéo vũ khí kim loại và gom drone nhỏ vào một điểm.', 'Anti-metal control option.'],
  ['anti-electro-netting', 'Anti-Electro Netting', 'WEB_DEPLOYABLE', 'net-electric', '1 net', 4, ['web', 'barrier', 'stun'], 'Lưới tơ chống điện mở ra như khiên, hấp thụ xung và phản lại một cú choáng.', 'Boss counter cartridge.'],
  ['shield-web', 'Shield Web', 'WEB_DEPLOYABLE', 'shield', '2 shields', 3, ['web', 'barrier'], 'Đan tơ dày thành tấm khiên tạm thời chặn đạn đạo và mảnh nổ.', 'Momentary projectile defense.'],
  ['web-line', 'Web Line', 'WEB_DEPLOYABLE', 'line', '2 lines', 2, ['web', 'stealth'], 'Tạo dây tơ ngang giữa hai điểm neo để di chuyển, phục kích hoặc treo mục tiêu.', 'Stealth setup tool.'],
  ['timer-web', 'Timer Web', 'WEB_DEPLOYABLE', 'timer', '2 traps', 2, ['web', 'trap'], 'Bẫy tơ hẹn giờ bung sau vài giây, hợp với combo kéo nhóm vào tâm.', 'Delayed crowd control.'],
  ['freeze-capsules', 'Freeze Capsules', 'WEB_AMMO', 'freeze', '2 capsules', 3, ['slow', 'immobilize'], 'Viên lạnh trộn vào tơ làm cứng nhanh, giữ brute hoặc symbiote nhỏ trong khoảnh khắc.', 'Temporary hard stop.'],
  ['web-fluid-cartridges', 'Web Fluid Cartridges', 'WEB_SHOOTER', 'cartridge', '+2 capacity', 1, ['web', 'reload'], 'Băng đạn dịch tơ dự phòng, tăng số lần dùng các chế độ tơ đặc biệt trong patrol dài.', 'Capacity upgrade rather than a shot.']
].map(([id, title, category, visual, charges, cooldown, effectIcons, description, tuning]) => ({
  id,
  title,
  category,
  family: 'Web Shooter DB',
  visual,
  charges,
  cooldown,
  effectIcons,
  role: category === 'WEB_SHOOTER' ? 'Rig / upgrade' : category === 'WEB_DEPLOYABLE' ? 'Deployable web shot' : 'Web cartridge',
  description,
  tuning,
  source: 'Notion Gadget DB',
  image: `./assets/gadget-icons/${id}.svg`,
  notionStatus: 'Ready to sync'
}));

const fieldGadgets = [
  ['classic-web-shooters', 'Classic Web Shooters', 'WEB_SHOOTER', 'rig', 'Infinite basic', 0, ['web', 'reload'], 'Bộ máy bắn tơ cơ khí cổ điển của Peter, ổn định, dễ nâng cấp, dùng mọi cartridge tiêu chuẩn.', 'Baseline rig.'],
  ['tasm-mechanical-web-shooters', 'TASM Mechanical Web-Shooters', 'WEB_SHOOTER', 'rig-tasm', '+aim assist', 0, ['web', 'marked'], 'Cặp web-shooter cơ khí thiên về độ chính xác, hợp bắn tơ dài và tước vũ khí.', 'Precision rig.'],
  ['stark-web-shooters', 'Stark Web-Shooters', 'WEB_SHOOTER', 'rig-stark', '+smart modes', 0, ['web', 'overload'], 'Web-shooter Stark tích hợp AI chọn đầu đạn tơ, đổi mode nhanh và khóa mục tiêu mềm.', 'Smart targeting rig.'],
  ['miles-web-shooters', 'Miles Web Shooters', 'WEB_SHOOTER', 'rig-miles', '+venom sync', 0, ['web', 'venom'], 'Máy bắn tơ của Miles đồng bộ bio-electricity, cho phép cartridge tơ dẫn điện ổn định hơn.', 'Miles bio-electric rig.'],
  ['spider-drone', 'Spider-Drone', 'TECH_GADGET', 'drone', '2 drones', 4, ['marked', 'combo'], 'Drone nhện bay quanh chiến trường, bắn hỗ trợ vào mục tiêu đã đánh dấu.', 'Passive pressure, low burst.'],
  ['holo-drone', 'Holo-Drone', 'STEALTH_GADGET', 'holo', '1 decoy', 4, ['stealth', 'marked'], 'Máy chiếu mồi nhử hologram kéo hỏa lực khỏi Spider và gom địch về một hướng.', 'Aggro redirect.'],
  ['trip-mine', 'Trip Mine', 'TECH_GADGET', 'mine', '3 mines', 3, ['trap', 'pull'], 'Mìn tơ cảm biến gắn tường hoặc sàn, kéo mục tiêu vào bề mặt khi kích hoạt.', 'Wall-control trap.'],
  ['remote-mine', 'Remote Mine', 'TECH_GADGET', 'remote-mine', '2 mines', 3, ['trap', 'impact'], 'Mìn kích hoạt thủ công, dùng để mở combat hoặc phá armor khi boss vào phase mới.', 'Manual burst setup.'],
  ['gravity-well', 'Gravity Well', 'TECH_GADGET', 'gravity', '1 well', 5, ['pull', 'area'], 'Trường hấp dẫn mini hút địch, vật thể và projectile nhỏ vào tâm.', 'Setup for AoE skills.'],
  ['suspension-matrix', 'Suspension Matrix', 'TECH_GADGET', 'suspend', '2 pods', 4, ['airborne', 'immobilize'], 'Thiết bị phản trọng lực treo nhóm mục tiêu lên không, mở combo aerial an toàn.', 'Aerial setup.'],
  ['concussive-blast', 'Concussive Blast', 'TECH_GADGET', 'blast', '2 blasts', 3, ['knockback', 'impact'], 'Sóng xung lực không sát thương cao nhưng phá vây, đẩy brute và khiên khỏi vị trí.', 'Spacing tool.'],
  ['sonic-burst', 'Sonic Burst', 'TECH_GADGET', 'sonic', '2 bursts', 4, ['stun', 'area'], 'Xung âm tần số cao làm gián đoạn symbiote và kẻ địch tụ đông.', 'Symbiote counter.'],
  ['web-grabber', 'Web Grabber', 'TECH_GADGET', 'grabber', '2 pulls', 3, ['pull', 'area'], 'Thiết bị bắn nhiều móc tơ nhỏ kéo vật thể môi trường lao vào nhóm địch.', 'Environmental combo tool.'],
  ['upshot', 'Upshot', 'TECH_GADGET', 'upshot', '2 shots', 3, ['launch', 'airborne'], 'Nổ lực nâng dưới chân mục tiêu, hất nhiều kẻ địch lên không ngay tại chỗ.', 'Aerial opener.'],
  ['spider-tracer', 'Spider-Tracer', 'UTILITY_GADGET', 'tracer', '4 tags', 1, ['marked', 'sense'], 'Bọ theo dõi siêu nhỏ đánh dấu mục tiêu, lộ tuyến di chuyển và tăng độ chính xác gadget.', 'Tracking utility.'],
  ['spider-signal', 'Spider-Signal', 'UTILITY_GADGET', 'signal', '1 beacon', 4, ['marked', 'stun'], 'Đèn tín hiệu nhện làm kẻ địch mất phương hướng và gọi assist trong các encounter đặc biệt.', 'Taunt plus team cue.'],
  ['web-wings', 'Web Wings', 'MOBILITY_GADGET', 'wings', 'Passive', 0, ['traversal', 'airborne'], 'Cánh lượn tơ dưới cánh tay, dùng cho traversal và mở aerial combat từ tốc độ cao.', 'Movement gadget, not a web shot.'],
  ['web-parachute', 'Web Parachute', 'MOBILITY_GADGET', 'parachute', 'Passive', 0, ['traversal', 'barrier'], 'Dù tơ khẩn cấp giảm rơi, cứu lỗi traversal và cho phép đáp xuống vị trí chiến thuật.', 'Safety mobility tool.']
].map(([id, title, category, visual, charges, cooldown, effectIcons, description, tuning]) => ({
  id,
  title,
  category,
  family: category.includes('WEB') ? 'Web Shooter DB' : 'Field Gadget DB',
  visual,
  charges,
  cooldown,
  effectIcons,
  role: category === 'WEB_SHOOTER' ? 'Web-shooter rig' : category.replaceAll('_', ' ').toLowerCase(),
  description,
  tuning,
  source: 'Notion Gadget DB',
  image: `./assets/gadget-icons/${id}.svg`,
  notionStatus: 'Ready to sync'
}));

const legacy = JSON.parse(fs.readFileSync('data/gadgets.json', 'utf8').replace(/^\uFEFF/, ''));
const legacyByTitle = new Map(legacy.map((item) => [item.Title?.toLowerCase(), item]));
const canonical = [...fieldGadgets, ...webShooterModes].map((item, index) => {
  const legacyItem = legacyByTitle.get(item.title.toLowerCase());
  return {
    Id: legacyItem?.Id || `local-gadget-${String(index + 1).padStart(3, '0')}-${item.id}`,
    Title: item.title,
    Category: item.category,
    Family: item.family,
    Role: item.role,
    Charges: item.charges,
    Cooldown: item.cooldown,
    EffectIcons: item.effectIcons,
    GameEffect: item.description,
    Tuning: item.tuning,
    ImageUrl: item.image,
    HasImage: true,
    HasIcon: true,
    ImageStatus: 'Local SVG',
    NotionStatus: item.notionStatus,
    Source: item.source,
    Visual: item.visual
  };
});

const categoryOrder = ['WEB_SHOOTER', 'WEB_AMMO', 'WEB_DEPLOYABLE', 'TECH_GADGET', 'STEALTH_GADGET', 'MOBILITY_GADGET', 'UTILITY_GADGET'];
canonical.sort((a, b) => {
  const categoryDiff = categoryOrder.indexOf(a.Category) - categoryOrder.indexOf(b.Category);
  return categoryDiff || a.Title.localeCompare(b.Title);
});

function visualPath(item) {
  const color = item.Category === 'WEB_SHOOTER' ? '#54b6d0'
    : item.Category === 'WEB_AMMO' ? '#e8f7ff'
    : item.Category === 'WEB_DEPLOYABLE' ? '#f2c06b'
    : item.Category === 'MOBILITY_GADGET' ? '#83b96b'
    : '#f0645c';
  const accent = item.EffectIcons.includes('venom') ? '#f2c06b'
    : item.EffectIcons.includes('stealth') ? '#83b96b'
    : item.EffectIcons.includes('impact') ? '#f0645c'
    : '#9ed9e7';
  const lines = {
    rig: `<rect x="25" y="28" width="46" height="32" rx="6" fill="${color}"/><path d="M31 60v15m34-15v15M36 38h24" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    basic: `<path d="M14 49h68M54 33l28 16-28 16" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    burst: `<path d="M15 34h52M15 49h66M15 64h52" stroke="${color}" stroke-width="6" stroke-linecap="round"/><circle cx="78" cy="49" r="8" fill="${accent}"/>`,
    impact: `<path d="M48 15 57 39 82 31 64 51 80 72 55 65 48 89 40 65 16 72 32 51 14 31 39 39z" fill="${color}"/>`,
    area: `<circle cx="48" cy="48" r="31" fill="none" stroke="${color}" stroke-width="7"/><path d="M24 48h48M48 24v48" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    scatter: `<path d="M48 48 22 22m26 26 32-18M48 48 22 74m26-26 30 25" stroke="${color}" stroke-width="7" stroke-linecap="round"/><circle cx="48" cy="48" r="9" fill="${accent}"/>`,
    net: `<path d="M20 22h56v52H20zM20 39h56M20 57h56M38 22v52M58 22v52" fill="none" stroke="${color}" stroke-width="5"/>`,
    ricochet: `<path d="M17 30h44l-16 18h34L41 77" fill="none" stroke="${color}" stroke-width="7" stroke-linejoin="round"/><circle cx="75" cy="48" r="7" fill="${accent}"/>`,
    split: `<path d="M18 48h30m0 0 28-22M48 48l32 1M48 48l28 22" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`,
    hook: `<path d="M20 49h42c12 0 16-19 2-24-9-3-17 2-18 12" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/><path d="M20 49l16-14M20 49l16 14" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    electric: `<path d="M54 7 23 54h22l-7 35 35-50H52z" fill="${color}"/>`,
    insulated: `<path d="M48 14 73 27v21c0 17-10 30-25 38-15-8-25-21-25-38V27z" fill="${color}"/><path d="M35 50h26" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`,
    magnet: `<path d="M26 20v30c0 28 44 28 44 0V20H56v30c0 11-16 11-16 0V20z" fill="${color}"/><path d="M26 20h14M56 20h14" stroke="${accent}" stroke-width="6"/>`,
    shield: `<path d="M48 13 77 28v21c0 19-12 31-29 38-17-7-29-19-29-38V28z" fill="${color}"/><path d="M34 50h28M48 36v28" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    line: `<path d="M12 36c22-16 50-16 72 0M12 60c22-16 50-16 72 0" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/><circle cx="20" cy="36" r="6" fill="${accent}"/><circle cx="76" cy="60" r="6" fill="${accent}"/>`,
    timer: `<circle cx="48" cy="51" r="27" fill="none" stroke="${color}" stroke-width="7"/><path d="M48 33v18l13 8M39 15h18" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    freeze: `<path d="M48 15v66M20 31l56 34M76 31 20 65" stroke="${color}" stroke-width="7" stroke-linecap="round"/><circle cx="48" cy="48" r="10" fill="${accent}"/>`,
    cartridge: `<rect x="28" y="16" width="40" height="64" rx="8" fill="${color}"/><path d="M36 30h24M36 48h24M36 66h24" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`,
    drone: `<circle cx="48" cy="48" r="17" fill="${color}"/><path d="M20 26h18M58 26h18M20 70h18M58 70h18" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`,
    holo: `<path d="M24 70h48L62 24H34z" fill="none" stroke="${color}" stroke-width="7"/><path d="M34 39h28M30 55h36" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`,
    mine: `<path d="M23 61h50L63 30H33z" fill="${color}"/><path d="M20 22 76 78M76 22 20 78" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`,
    gravity: `<circle cx="48" cy="48" r="9" fill="${accent}"/><path d="M48 17c25 12 25 50 0 62M48 17c-25 12-25 50 0 62" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`,
    suspend: `<path d="M22 62c13 10 39 10 52 0M22 34c13-10 39-10 52 0" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/><path d="M48 28v40" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    blast: `<path d="M20 48h31M51 25v46l27-23z" fill="${color}"/><path d="M67 29c13 10 13 28 0 38" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`,
    sonic: `<path d="M25 57h14l17 15V24L39 39H25z" fill="${color}"/><path d="M65 35c8 8 8 18 0 26M75 25c14 14 14 32 0 46" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`,
    grabber: `<path d="M48 49 20 24m28 25 28-25M48 49 20 73m28-24 28 24" stroke="${color}" stroke-width="7" stroke-linecap="round"/><circle cx="48" cy="49" r="11" fill="${accent}"/>`,
    upshot: `<path d="M48 78V22m0 0L27 43m21-21 21 21" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 78h48" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`,
    tracer: `<circle cx="48" cy="48" r="29" fill="none" stroke="${color}" stroke-width="7"/><circle cx="48" cy="48" r="8" fill="${accent}"/><path d="M48 9v14M48 73v14M9 48h14M73 48h14" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`,
    signal: `<path d="M25 72 48 16l23 56z" fill="${color}"/><path d="M37 51h22M48 40v22" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    wings: `<path d="M48 34C33 18 18 19 10 45c13-5 24 2 38 32 14-30 25-37 38-32-8-26-23-27-38-11z" fill="${color}"/>`,
    parachute: `<path d="M18 47c5-23 55-23 60 0H18z" fill="${color}"/><path d="M24 47 48 75 72 47" fill="none" stroke="${accent}" stroke-width="5"/>`
  };
  return lines[item.Visual] || lines.basic;
}

function iconSvg(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${item.Title}">
  <rect width="96" height="96" rx="13" fill="#06101d"/>
  <path d="M0 75 96 21v75H0z" fill="#102c45" opacity=".88"/>
  <path d="M13 13h70v70H13z" fill="none" stroke="#397c9b" stroke-width="4"/>
  ${visualPath(item)}
  <path d="M14 82c18-9 50-9 68 0" fill="none" stroke="#54b6d0" stroke-width="3" opacity=".45"/>
</svg>`;
}

for (const item of canonical) {
  fs.writeFileSync(path.resolve(iconDir, `${item.Id.split('-').slice(-1)[0] === item.id ? item.id : item.Title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.svg`), iconSvg(item), 'utf8');
  const expected = path.resolve(item.ImageUrl.replace('./', ''));
  if (!fs.existsSync(expected)) fs.writeFileSync(expected, iconSvg(item), 'utf8');
}

const effectIconsPath = 'data/effect_icons.json';
const effectIcons = JSON.parse(fs.readFileSync(effectIconsPath, 'utf8'));
Object.assign(effectIcons, {
  web: { icon: 'web', label: 'Web' },
  interrupt: { icon: 'slash', label: 'Interrupt' },
  immobilize: { icon: 'lock', label: 'Immobilize' },
  trap: { icon: 'trap', label: 'Trap' },
  reload: { icon: 'reload', label: 'Reload' }
});

fs.writeFileSync(effectIconsPath, `${JSON.stringify(effectIcons, null, 2)}\n`, 'utf8');
fs.writeFileSync('data/web_shooter_modes.json', `${JSON.stringify(webShooterModes, null, 2)}\n`, 'utf8');
fs.writeFileSync('data/gadgets.json', `${JSON.stringify(canonical, null, 2)}\n`, 'utf8');

console.log(`Wrote ${canonical.length} gadgets and ${webShooterModes.length} web-shooter modes.`);
