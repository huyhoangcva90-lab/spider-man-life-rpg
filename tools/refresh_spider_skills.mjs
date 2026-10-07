import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('assets/skill-icons');
fs.mkdirSync(outDir, { recursive: true });

const effectIconMap = {
  impact: { icon: 'burst', label: 'Impact' },
  launch: { icon: 'arrow-up-right', label: 'Launch' },
  airborne: { icon: 'wind', label: 'Airborne' },
  stun: { icon: 'sparkles', label: 'Stun' },
  knockback: { icon: 'chevrons-right', label: 'Knockback' },
  focus: { icon: 'gauge', label: 'Focus' },
  combo: { icon: 'repeat-2', label: 'Combo' },
  finisher: { icon: 'badge-x', label: 'Finisher' },
  mobility: { icon: 'route', label: 'Mobility' },
  traversal: { icon: 'send', label: 'Traversal' },
  sense: { icon: 'radar', label: 'Spider-Sense' },
  dodge: { icon: 'circle-dashed', label: 'Dodge' },
  parry: { icon: 'shield-check', label: 'Parry' },
  counter: { icon: 'rotate-ccw', label: 'Counter' },
  slow: { icon: 'hourglass', label: 'Slow' },
  stealth: { icon: 'eye-off', label: 'Stealth' },
  takedown: { icon: 'crosshair', label: 'Takedown' },
  marked: { icon: 'scan', label: 'Marked' },
  camouflage: { icon: 'scan-face', label: 'Camouflage' },
  venom: { icon: 'zap', label: 'Bio-Electric' },
  chain: { icon: 'network', label: 'Chain' },
  overload: { icon: 'activity', label: 'Overload' },
  heal: { icon: 'heart-pulse', label: 'Heal' },
  barrier: { icon: 'shield', label: 'Barrier' },
  spiderArms: { icon: 'git-fork', label: 'Spider-Arms' },
  symbiote: { icon: 'tentacle', label: 'Symbiote' },
  antiVenom: { icon: 'sparkle', label: 'Anti-Venom' },
  pull: { icon: 'magnet', label: 'Pull' },
  slam: { icon: 'hammer', label: 'Slam' },
  area: { icon: 'scan-search', label: 'Area' },
  pierce: { icon: 'swords', label: 'Pierce' },
  rage: { icon: 'flame', label: 'Surge' }
};

const skills = [
  ['Web Strike', 'Combat & Acrobatics', 1, 1, 'active', 'Peter', ['Spider-Man 2 (2004)', 'Marvel Spider-Man 2018'], ['impact', 'mobility'], 'Bắn tơ neo vào mục tiêu rồi lao tới đá mở giao tranh, dùng để rút ngắn khoảng cách và phá nhịp súng.', 'web-strike'],
  ['Aerial Launch', 'Combat & Acrobatics', 1, 2, 'active', 'Peter', ['Spider-Man 2 (2004)', 'Insomniac Spider-Man'], ['launch', 'airborne'], 'Móc hàm hất mục tiêu lên không để cô lập khỏi nhóm địch và mở chuỗi không chiến.', 'air-launch'],
  ['Swing Kick', 'Combat & Acrobatics', 1, 3, 'active', 'Peter', ['Spider-Man 2 (2004)', 'Web of Shadows', 'Marvel Spider-Man 2018'], ['knockback', 'impact'], 'Đu tơ lấy đà tung song phi quét ngang, đẩy kẻ địch văng vào tường hoặc đồng bọn.', 'swing-kick'],
  ['Dodge Under', 'Combat & Acrobatics', 1, 4, 'active', 'Peter', ['Marvel Spider-Man 2018'], ['dodge', 'counter'], 'Lộn người luồn qua dưới chân đối thủ cầm khiên hoặc brute, đặt Spider vào sau lưng để phản kích.', 'dodge-under'],
  ['Air Yank', 'Combat & Acrobatics', 2, 1, 'active', 'Peter', ['Ultimate Spider-Man', 'Marvel Spider-Man 2018'], ['pull', 'airborne'], 'Kéo mục tiêu đang đứng dưới đất bật lên không, nối combo aerial mà không cần gadget bắn tơ thuần.', 'air-yank'],
  ['Ground Strike', 'Combat & Acrobatics', 2, 2, 'active', 'Peter', ['Marvel Spider-Man 2018', 'Marvel Spider-Man 2'], ['slam', 'area'], 'Bổ nhào từ độ cao lớn và nện xuống sàn, gây sóng xung kích lên nhóm địch quanh điểm rơi.', 'ground-strike'],
  ['Yank Down Slam', 'Combat & Acrobatics', 2, 3, 'active', 'Peter', ['Web of Shadows', 'Marvel Spider-Man 2018'], ['pull', 'slam'], 'Kéo mục tiêu từ trên không xuống đất thật mạnh, tạo nhịp kết thúc cho aerial combo.', 'yank-down-slam'],
  ['Perfect Hit Chain', 'Combat & Acrobatics', 2, 4, 'active', 'Peter', ['Spider-Man 3', 'Marvel Spider-Man 2018'], ['combo', 'focus'], 'Canh đúng nhịp đòn cuối để tăng Focus và mở cửa sổ finisher nhanh hơn.', 'perfect-hit-chain'],
  ['Wall Bounce', 'Combat & Acrobatics', 3, 1, 'active', 'Peter', ['Shattered Dimensions', 'Marvel Spider-Man 2018'], ['knockback', 'stun'], 'Đá mục tiêu bật vào tường, nếu va chạm thành công sẽ choáng ngắn và tăng sát thương đòn tiếp theo.', 'wall-bounce'],
  ['Ceiling Pounce', 'Combat & Acrobatics', 3, 2, 'active', 'Peter', ['Spider-Man 2000', 'Shattered Dimensions'], ['stealth', 'takedown'], 'Bám trần rồi lao xuống triệt hạ mục tiêu đơn lẻ, dùng tốt trong phòng hẹp.', 'ceiling-pounce'],
  ['Maximum Spider', 'Combat & Acrobatics', 5, 1, 'ultimate', 'Peter', ['Marvel vs. Capcom', 'Spider-Man 2000'], ['finisher', 'combo', 'impact'], 'Tuyệt chiêu lao liên hoàn đa hướng, khóa mục tiêu trong chuỗi va chạm tốc độ cao trước cú đá kết thúc.', 'maximum-spider'],
  ['Spider Barrage', 'Combat & Acrobatics', 5, 2, 'ultimate', 'Peter', ['Marvel Spider-Man 2018'], ['finisher', 'area', 'focus'], 'Tiêu hao đầy Focus để tung chuỗi đòn tay chân và quăng tơ dồn dập, gây sát thương lớn lên boss.', 'spider-barrage'],

  ['Point Launch Boost', 'Traversal', 1, 1, 'active', 'Shared', ['Spider-Man 2 (2004)', 'Marvel Spider-Man 2018'], ['traversal', 'mobility'], 'Búng khỏi điểm neo để tăng tốc tức thì, dùng trong nhiệm vụ thời gian và mở aerial opener.', 'point-launch-boost'],
  ['Web Zip Reposition', 'Traversal', 1, 2, 'active', 'Shared', ['Ultimate Spider-Man', 'Marvel Spider-Man 2018'], ['mobility', 'dodge'], 'Kéo người đổi vị trí chớp nhoáng giữa không trung, thoát khỏi vòng vây và tìm góc đánh mới.', 'web-zip-reposition'],
  ['Charge Jump', 'Traversal', 1, 3, 'active', 'Shared', ['Spider-Man 2 (2004)', 'Marvel Spider-Man 2018'], ['launch', 'traversal'], 'Nén lực bật cao để vào trạng thái không chiến hoặc vượt địa hình nhanh.', 'charge-jump'],
  ['Web Wings Glide', 'Traversal', 2, 1, 'active', 'Shared', ['Marvel Spider-Man 2'], ['traversal', 'airborne'], 'Mở web wings lướt qua luồng gió thành phố, giữ nhịp di chuyển dài mà không rơi tốc độ.', 'web-wings-glide'],
  ['Slingshot Launch', 'Traversal', 2, 2, 'active', 'Shared', ['Marvel Spider-Man 2'], ['traversal', 'launch'], 'Kéo căng hai sợi tơ như ná cao su rồi phóng đi cực nhanh, mở đầu giao tranh hoặc truy đuổi.', 'slingshot-launch'],
  ['Loop De Loop', 'Traversal', 3, 1, 'active', 'Shared', ['Spider-Man 2 (2004)', 'Marvel Spider-Man 2'], ['traversal', 'focus'], 'Vòng người lấy đà quanh điểm neo để tích tốc độ và nạp Focus bằng kỹ thuật di chuyển mạo hiểm.', 'loop-de-loop'],
  ['Corner Tether Drift', 'Traversal', 3, 2, 'active', 'Shared', ['The Amazing Spider-Man', 'Marvel Spider-Man 2'], ['mobility', 'dodge'], 'Neo tơ vào góc phố để bẻ hướng gấp, né hỏa lực khi đang truy đuổi tốc độ cao.', 'corner-tether-drift'],
  ['City Flow State', 'Traversal', 5, 1, 'ultimate', 'Shared', ['Spider-Man 2 (2004)', 'Marvel Spider-Man 2'], ['traversal', 'focus', 'dodge'], 'Trong vài lượt, mọi di chuyển chuẩn nhịp đều hồi Focus, tăng né và cho phép mở combat bằng đòn lao cực mạnh.', 'city-flow-state'],

  ['Danger Sense', 'Spider-Sense & Defense', 1, 1, 'active', 'Shared', ['Spider-Man 2000', 'Marvel Spider-Man 2018'], ['sense', 'dodge'], 'Giác quan nhện cảnh báo đòn hiểm, tăng khung né đúng lúc trước khi bị đánh trúng.', 'danger-sense'],
  ['Perfect Dodge', 'Spider-Sense & Defense', 1, 2, 'active', 'Shared', ['Marvel Spider-Man 2018'], ['dodge', 'slow'], 'Né vào khoảnh khắc cuối khiến thời gian chậm lại ngắn, mở phản công an toàn.', 'perfect-dodge'],
  ['Spider-Sense Parry', 'Spider-Sense & Defense', 2, 1, 'active', 'Peter', ['Marvel Spider-Man 2'], ['parry', 'stun'], 'Gạt đòn cận chiến bằng phản xạ nhện, làm đối thủ lộ sơ hở và choáng nhẹ.', 'spider-sense-parry'],
  ['Perfect Counter', 'Spider-Sense & Defense', 2, 2, 'active', 'Shared', ['Spider-Man 3', 'Marvel Spider-Man 2018'], ['counter', 'impact'], 'Ngay sau né chuẩn, trả đòn bằng cú đá hoặc elbow strike vào điểm yếu.', 'perfect-counter'],
  ['Last-Second Save', 'Spider-Sense & Defense', 3, 1, 'active', 'Shared', ['Edge of Time', 'Marvel Spider-Man 2018'], ['sense', 'heal'], 'Khi sắp gục, Spider-Sense kích hoạt một lần để giảm sát thương chí tử và hồi nhẹ.', 'last-second-save'],
  ['Untouchable Rhythm', 'Spider-Sense & Defense', 4, 1, 'active', 'Shared', ['Marvel Spider-Man 2018', 'Miles Morales'], ['dodge', 'focus', 'combo'], 'Chuỗi né hoàn hảo liên tiếp nạp Focus và tăng sát thương đòn phản kế tiếp.', 'untouchable-rhythm'],
  ['Spectacular Reflex', 'Spider-Sense & Defense', 5, 1, 'ultimate', 'Shared', ['Shattered Dimensions', 'Marvel Spider-Man 2'], ['sense', 'slow', 'counter'], 'Tăng tốc nhận thức cực đại: kẻ địch gần như chậm lại, mọi phản đòn đều gây stagger lớn.', 'spectacular-reflex'],

  ['Perch Takedown', 'Stealth & Predator', 1, 1, 'active', 'Shared', ['Spider-Man 2000', 'Marvel Spider-Man 2018'], ['stealth', 'takedown'], 'Treo ngược mục tiêu từ vị trí cao, loại khỏi giao tranh mà không báo động nhóm còn lại.', 'perch-takedown'],
  ['Wall Takedown', 'Stealth & Predator', 1, 2, 'active', 'Shared', ['Shattered Dimensions', 'Marvel Spider-Man 2018'], ['stealth', 'impact'], 'Bám tường chờ mục tiêu đi ngang rồi kéo giật triệt hạ sát vách.', 'wall-takedown'],
  ['Ceiling Ambush', 'Stealth & Predator', 2, 1, 'active', 'Shared', ['The Amazing Spider-Man', 'Marvel Spider-Man 2018'], ['stealth', 'marked'], 'Ẩn trên trần, đánh dấu mục tiêu nguy hiểm và lao xuống hạ nhanh.', 'ceiling-ambush'],
  ['Multi-Takedown Flow', 'Stealth & Predator', 3, 1, 'active', 'Shared', ['Shattered Dimensions', 'Marvel Spider-Man 2'], ['stealth', 'combo', 'takedown'], 'Sau một takedown sạch, đổi vị trí tức thì để nối triệt hạ mục tiêu kế tiếp.', 'multi-takedown-flow'],
  ['Noir Predator Mode', 'Stealth & Predator', 5, 1, 'ultimate', 'Peter', ['Shattered Dimensions'], ['stealth', 'slow', 'takedown'], 'Chế độ săn mồi kiểu Noir: giảm tầm nhìn địch, mọi takedown tạo thêm thời gian ẩn thân.', 'noir-predator-mode'],

  ['Spider-Arm Strike', 'Spider-Arms', 1, 1, 'active', 'Peter', ['Marvel Spider-Man 2'], ['spiderArms', 'impact'], 'Cánh tay máy vươn ra đâm thẳng trước mặt, cắt ngang đòn brute và giữ khoảng cách.', 'spider-arm-strike'],
  ['Spider-Arm Rush', 'Spider-Arms', 2, 1, 'active', 'Peter', ['Marvel Spider-Man 2'], ['spiderArms', 'combo'], 'Bốn tay máy đánh liên tục trong khi Peter di chuyển, dọn nhóm địch nhẹ quanh thân.', 'spider-arm-rush'],
  ['Iron Arms Parry', 'Spider-Arms', 2, 2, 'active', 'Peter', ['Marvel Spider-Man 2'], ['spiderArms', 'parry'], 'Dựng tay máy đỡ đòn nặng rồi phản lại bằng cú quật ngang.', 'iron-arms-parry'],
  ['Spider-Arm Slam', 'Spider-Arms', 3, 1, 'active', 'Peter', ['Marvel Spider-Man 2'], ['spiderArms', 'slam', 'area'], 'Tay máy ghim xuống đất tạo chấn động hình nan nhện, hất lùi mục tiêu quanh Peter.', 'spider-arm-slam'],
  ['Iron Spider Overdrive', 'Spider-Arms', 5, 1, 'ultimate', 'Peter', ['Marvel Spider-Man 2018', 'Marvel Spider-Man 2'], ['spiderArms', 'finisher', 'combo'], 'Kích hoạt overdrive tay máy, mọi đòn cận chiến có thêm hit phụ và phá giáp nhanh.', 'iron-spider-overdrive'],

  ['Symbiote Punch', 'Symbiote & Anti-Venom', 1, 1, 'active', 'Peter', ['Web of Shadows', 'Marvel Spider-Man 2'], ['symbiote', 'impact'], 'Nắm đấm symbiote nặng, đánh xuyên phòng thủ và đẩy lùi mục tiêu đơn.', 'symbiote-punch'],
  ['Symbiote Blast', 'Symbiote & Anti-Venom', 2, 1, 'active', 'Peter', ['Web of Shadows', 'Marvel Spider-Man 2'], ['symbiote', 'area', 'knockback'], 'Bùng nổ xúc tu đen quanh người, quét sạch nhóm địch đang áp sát.', 'symbiote-blast'],
  ['Symbiote Yank', 'Symbiote & Anti-Venom', 2, 2, 'active', 'Peter', ['Web of Shadows', 'Marvel Spider-Man 2'], ['symbiote', 'pull'], 'Xúc tu kéo nhiều mục tiêu gom vào một điểm để chuẩn bị slam hoặc finisher.', 'symbiote-yank'],
  ['Symbiote Surge', 'Symbiote & Anti-Venom', 3, 1, 'active', 'Peter', ['Web of Shadows', 'Marvel Spider-Man 2'], ['symbiote', 'rage', 'combo'], 'Tạm thời đổi nhịp chiến đấu sang hung bạo, tăng sát thương cận chiến và kháng stagger.', 'symbiote-surge'],
  ['Tendril Uppercut', 'Symbiote & Anti-Venom', 3, 2, 'active', 'Peter', ['Marvel Spider-Man 2'], ['symbiote', 'launch'], 'Xúc tu đội đất hất tung mục tiêu lớn, mở không chiến với cả brute.', 'tendril-uppercut'],
  ['Anti-Venom Burst', 'Symbiote & Anti-Venom', 4, 1, 'active', 'Peter', ['Marvel Spider-Man 2'], ['antiVenom', 'area', 'stun'], 'Năng lượng Anti-Venom trắng bùng sáng, làm choáng symbiote và xóa hiệu ứng độc.', 'anti-venom-burst'],
  ['Anti-Venom Tempest', 'Symbiote & Anti-Venom', 5, 1, 'ultimate', 'Peter', ['Marvel Spider-Man 2'], ['antiVenom', 'finisher', 'area'], 'Tuyệt kỹ bão Anti-Venom: xúc tu trắng càn quét diện rộng, đặc biệt mạnh trước symbiote boss.', 'anti-venom-tempest'],

  ['Venom Punch', 'Miles Bio-Electric', 1, 1, 'active', 'Miles', ['Miles Morales', 'Marvel Spider-Man 2'], ['venom', 'stun'], 'Miles dồn điện sinh học vào nắm đấm, làm tê liệt mục tiêu và phá giáp công nghệ.', 'venom-punch'],
  ['Venom Jump', 'Miles Bio-Electric', 1, 2, 'active', 'Miles', ['Miles Morales'], ['venom', 'launch'], 'Phóng điện từ mặt đất hất tung nhóm địch, đưa trận đấu lên không trung.', 'venom-jump'],
  ['Venom Dash', 'Miles Bio-Electric', 2, 1, 'active', 'Miles', ['Miles Morales'], ['venom', 'mobility', 'impact'], 'Lao xuyên tuyến địch bằng điện sinh học, gây damage trên đường đi.', 'venom-dash'],
  ['Chain Lightning', 'Miles Bio-Electric', 2, 2, 'active', 'Miles', ['Miles Morales', 'Marvel Spider-Man 2'], ['venom', 'chain'], 'Tia điện nhảy qua nhiều mục tiêu gần nhau, xử lý nhóm đông cực nhanh.', 'chain-lightning'],
  ['Reverse Flux', 'Miles Bio-Electric', 3, 1, 'active', 'Miles', ['Marvel Spider-Man 2'], ['venom', 'pull', 'overload'], 'Kéo điện trường ngược vào tâm, gom địch và làm quá tải thiết bị trên người chúng.', 'reverse-flux'],
  ['Thunder Burst', 'Miles Bio-Electric', 3, 2, 'active', 'Miles', ['Marvel Spider-Man 2'], ['venom', 'area', 'stun'], 'Nổ điện xanh diện rộng, ngắt chuỗi tấn công của cả nhóm địch.', 'thunder-burst'],
  ['Mega Venom Blast', 'Miles Bio-Electric', 5, 1, 'ultimate', 'Miles', ['Miles Morales'], ['venom', 'finisher', 'area'], 'Miles giải phóng toàn bộ điện sinh học thành vụ nổ khổng lồ, quét sạch vòng vây.', 'mega-venom-blast'],
  ['Bioelectric Overload', 'Miles Bio-Electric', 5, 2, 'ultimate', 'Miles', ['Marvel Spider-Man 2'], ['venom', 'overload', 'chain'], 'Điện sinh học cộng hưởng liên hoàn, mọi đòn tiếp theo phát tia nhảy sang mục tiêu khác.', 'bioelectric-overload'],

  ['Camouflage Cloak', 'Miles Camouflage', 1, 1, 'active', 'Miles', ['Miles Morales'], ['camouflage', 'stealth'], 'Miles biến mất trong vài giây, thoát khỏi ngắm bắn và chuẩn bị takedown.', 'camouflage-cloak'],
  ['Camo Strike', 'Miles Camouflage', 2, 1, 'active', 'Miles', ['Miles Morales'], ['camouflage', 'takedown'], 'Đòn đánh đầu tiên khi tàng hình gây sát thương cao và làm mục tiêu hoảng loạn.', 'camo-strike'],
  ['Camo Reset', 'Miles Camouflage', 3, 1, 'active', 'Miles', ['Miles Morales', 'Marvel Spider-Man 2'], ['camouflage', 'dodge', 'focus'], 'Sau né hoàn hảo, hồi một phần năng lượng tàng hình để tái lập thế chủ động.', 'camo-reset'],
  ['Invisible Predator', 'Miles Camouflage', 5, 1, 'ultimate', 'Miles', ['Miles Morales'], ['camouflage', 'stealth', 'finisher'], 'Trong thời gian ngắn, Miles giữ tàng hình sau mỗi takedown và finisher không phá stealth ngay.', 'invisible-predator']
].map(([name, branch, tier, order, slot, hero, sourceGames, effectIcons, description, slug]) => ({
  name,
  branch,
  tier,
  order,
  slot,
  type: slot === 'ultimate' ? 'Ultimate' : 'Active',
  hero,
  sourceGames,
  sp_cost: slot === 'ultimate' ? 5 : Math.max(1, Math.min(4, tier)),
  level_req: tier === 1 ? 1 : tier * 4,
  effectIcons,
  image: `./assets/skill-icons/${slug}.svg`,
  description
}));

const palette = {
  Peter: ['#e84a5f', '#2566d8', '#f6c667'],
  Miles: ['#16171d', '#f45a3d', '#4fd6ff'],
  Shared: ['#17415f', '#5ac8d8', '#f6c667']
};

function iconSvg(skill, index) {
  const [bg, primary, accent] = palette[skill.hero] || palette.Shared;
  const tokens = skill.effectIcons;
  const isUlt = skill.slot === 'ultimate';
  const familyTokens = new Set(['venom', 'symbiote', 'spiderArms', 'antiVenom', 'camouflage']);
  const motif = tokens.find((token) => !familyTokens.has(token)) || tokens[0] || 'impact';
  const short = skill.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 3).toUpperCase();
  const paths = {
    impact: `<path d="M48 14l8 26 26-8-18 22 20 18-28-5-8 27-8-27-28 5 20-18-18-22 26 8z" fill="${primary}" opacity=".92"/>`,
    launch: `<path d="M48 84V20m0 0L25 43m23-23 23 23" fill="none" stroke="${primary}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
    pull: `<path d="M18 50h60M18 50l20-18M18 50l20 18" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
    combo: `<path d="M24 34h26c12 0 20 7 20 17s-8 17-20 17H35" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round"/><path d="M36 22 23 34l13 12M60 74l13-12-13-12" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    chain: `<path d="M30 36h17m2 24h17M29 49c-9 0-16-7-16-16s7-16 16-16h15c9 0 16 7 16 16M67 47c9 0 16 7 16 16s-7 16-16 16H52c-9 0-16-7-16-16" fill="none" stroke="${primary}" stroke-width="7" stroke-linecap="round"/>`,
    area: `<circle cx="48" cy="48" r="30" fill="none" stroke="${primary}" stroke-width="7"/><circle cx="48" cy="48" r="13" fill="${accent}"/><path d="M48 8v14M48 74v14M8 48h14M74 48h14" stroke="${primary}" stroke-width="6" stroke-linecap="round"/>`,
    slam: `<path d="M48 14v45M29 59h38M24 76h48" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round"/><path d="m33 45 15 14 15-14" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
    parry: `<path d="M48 13 75 26v21c0 19-12 32-27 39-15-7-27-20-27-39V26z" fill="${primary}" opacity=".9"/><path d="m34 50 10 11 21-25" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
    counter: `<path d="M72 26C54 12 27 20 22 45c-3 18 8 32 26 36" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round"/><path d="m70 25-2 19-18-4" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    focus: `<path d="M48 18a30 30 0 1 0 30 30" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round"/><path d="M48 48 66 30" stroke="${accent}" stroke-width="8" stroke-linecap="round"/><circle cx="48" cy="48" r="7" fill="${accent}"/>`,
    mobility: `<path d="M17 70c20-35 39-45 62-44" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round"/><path d="m64 15 18 11-15 15" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 75h46" stroke="${primary}" stroke-width="6" stroke-linecap="round" opacity=".7"/>`,
    venom: `<path d="M54 6 22 54h22l-7 44 37-55H52z" fill="${primary}"/>`,
    symbiote: `<path d="M50 16c-25 4-25 28-8 34-20 5-20 26 1 32 11 3 27-2 31-17-20 9-27-4-14-17 13-13 5-31-10-32z" fill="${primary}"/>`,
    antiVenom: `<path d="M48 10c19 16 28 32 28 48 0 17-12 30-28 30S20 75 20 58c0-16 9-32 28-48z" fill="${primary}"/><path d="M36 55h24M48 43v24" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`,
    spiderArms: `<path d="M48 25v46M30 35 12 18m54 17 18-17M31 61 11 80m54-19 20 19" stroke="${primary}" stroke-width="7" stroke-linecap="round"/><circle cx="48" cy="48" r="14" fill="${accent}"/>`,
    stealth: `<path d="M10 49s14-21 38-21 38 21 38 21-14 21-38 21-38-21-38-21z" fill="none" stroke="${primary}" stroke-width="7"/><path d="M31 67 65 31" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`,
    sense: `<path d="M48 19c16 0 29 13 29 29S64 77 48 77 19 64 19 48s13-29 29-29z" fill="none" stroke="${primary}" stroke-width="7"/><path d="M48 33v15l11 9" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`,
    traversal: `<path d="M17 73C34 22 62 20 80 25M22 64c17-5 38-4 57 14" fill="none" stroke="${primary}" stroke-width="7" stroke-linecap="round"/><circle cx="79" cy="25" r="7" fill="${accent}"/>`,
    dodge: `<path d="M72 25C45 18 24 31 21 51c-2 16 11 29 29 28" fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round"/><path d="M70 25 58 16m12 9-12 12" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`
  };
  const main = paths[motif] || paths.impact;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${skill.name}">
  <rect width="96" height="96" rx="14" fill="${bg}"/>
  <path d="M0 78 96 18v78H0z" fill="#05070b" opacity=".32"/>
  <circle cx="75" cy="22" r="${isUlt ? 16 : 10}" fill="${accent}" opacity=".86"/>
  ${main}
  <path d="M14 14h68v68H14z" fill="none" stroke="${isUlt ? accent : '#e8f7ff'}" stroke-width="${isUlt ? 5 : 3}" opacity=".85"/>
  <text x="48" y="89" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="12" fill="#fff">${short}</text>
</svg>`;
}

for (const [index, skill] of skills.entries()) {
  const file = path.resolve(outDir, path.basename(skill.image));
  fs.writeFileSync(file, iconSvg(skill, index), 'utf8');
}

fs.writeFileSync('data/skills.json', `${JSON.stringify(skills, null, 2)}\n`, 'utf8');
fs.writeFileSync('data/effect_icons.json', `${JSON.stringify(effectIconMap, null, 2)}\n`, 'utf8');

const gadgetIcons = {
  'gadget_concussive_blast.png': 'https://iili.io/nuzaxLJ.png',
  'gadget_electric_web.png': 'https://iili.io/nuzaugp.png',
  'gadget_iron_spider_arms.png': 'https://iili.io/nuza57I.png',
  'gadget_spider_drone.png': 'https://iili.io/nuza0LG.png',
  'gadget_suspension_matrix.png': 'https://iili.io/nuzaW22.png',
  'gadget_trip_mine.png': 'https://iili.io/nuzaOhu.png',
  'gadget_web_bomb.png': 'https://iili.io/nuzaeLb.png',
  'gadget_web_shooter.png': 'https://iili.io/nuzarYB.png'
};
const skillIcons = {
  ...gadgetIcons,
  ...Object.fromEntries(skills.map((skill) => [path.basename(skill.image), skill.image]))
};
fs.writeFileSync('data/skill_icons.json', `${JSON.stringify(skillIcons, null, 2)}\n`, 'utf8');

console.log(`Wrote ${skills.length} active Spider skills and ${skills.length} icons.`);
