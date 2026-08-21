/* ==========================================================================
   SPIDER-MAN LIFE RPG - CENTRALIZED MEDIA CATALOG & ARTWORK PROVENANCE
   ========================================================================== */

const MEDIA_CATALOG = {
  // --- VILLAINS (30 ENTRIES: MARVEL SNAP CARD ARTWORK & OFFICIAL MEDIA) ---
  "docock": {
    src: "https://game-assets.snap.fan/card_variant_images/DoctorOctopus-c6776e01041071036c336b0dbb45104f69297ca78c9d7696a1b4326e51474ea4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/DoctorOctopus/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🐙",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><path d="M10 20 Q30 10 40 35 M90 20 Q70 10 60 35 M10 80 Q30 90 40 65 M90 80 Q70 90 60 65" stroke="#94a3b8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="10" cy="20" r="5" fill="#e62429"/><circle cx="90" cy="20" r="5" fill="#e62429"/><circle cx="10" cy="80" r="5" fill="#e62429"/><circle cx="90" cy="80" r="5" fill="#e62429"/><circle cx="50" cy="48" r="22" fill="#166534"/><rect x="34" y="42" width="32" height="10" rx="4" fill="#00f0ff" stroke="#ffffff" stroke-width="2"/><circle cx="42" cy="47" r="3" fill="#ffffff"/><circle cx="58" cy="47" r="3" fill="#ffffff"/></svg>`
  },
  "greengoblin": {
    src: "https://game-assets.snap.fan/card_variant_images/GreenGoblin-0f170f55120785636f1ee3983fa19521739f770070ab13402dd81bdc16e72f98.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/GreenGoblin/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "👺",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#a855f7" stroke-width="3"/><polygon points="50,15 75,40 68,75 50,88 32,75 25,40" fill="#15803d" stroke="#86efac" stroke-width="2"/><polygon points="35,42 46,45 38,52" fill="#ffb700"/><polygon points="65,42 54,45 62,52" fill="#ffb700"/><path d="M36 68 Q50 82 64 68 Z" fill="#7e22ce"/></svg>`
  },
  "venom": {
    src: "https://game-assets.snap.fan/card_variant_images/Venom-f29cdd80e077ddd235a9dac65d1958beed8593bb86c4d9649c7ba07a6cfb93b0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Venom/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🖤",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#020617" stroke="#ffffff" stroke-width="3"/><path d="M20 35 C35 30 45 45 42 52 C35 55 25 45 20 35 Z" fill="#ffffff"/><path d="M80 35 C65 30 55 45 58 52 C65 55 75 45 80 35 Z" fill="#ffffff"/><path d="M30 65 Q50 85 70 65" stroke="#ffffff" stroke-width="4" fill="none"/><path d="M40 70 Q58 95 62 78" stroke="#ef4444" stroke-width="5" fill="none"/></svg>`
  },
  "carnage": {
    src: "https://game-assets.snap.fan/card_variant_images/Carnage-5747bb77f8030b904c64d07795c9541a26aa7d6884ca2e400c8db64bd257a114.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Carnage/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🩸",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#450a0a" stroke="#dc2626" stroke-width="3"/><path d="M20 35 Q40 25 40 50 Z" fill="#fef08a"/><path d="M80 35 Q60 25 60 50 Z" fill="#fef08a"/><path d="M25 65 Q50 90 75 65" stroke="#ffffff" stroke-width="4" fill="none"/></svg>`
  },
  "mysterio": {
    src: "https://game-assets.snap.fan/card_variant_images/Mysterio-07d5bb69a4b6e0496f12000c7cd58aa8f0f3001783d756ce0d95d8f6596e72e6.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Mysterio/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🔮",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" stroke-width="3"/><circle cx="50" cy="45" r="26" fill="#a7f3d0" stroke="#047857" stroke-width="2"/></svg>`
  },
  "kraven": {
    src: "https://game-assets.snap.fan/card_variant_images/Kraven-16756b16289cb2d19aadfd63c9ea2fddfc6827dd130021ce9002c22363efed02.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Kraven/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🦁",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#f59e0b" stroke-width="3"/><path d="M25 40 Q50 15 75 40 Q85 70 50 85 Q15 70 25 40 Z" fill="#b45309"/><circle cx="50" cy="50" r="14" fill="#78350f"/><line x1="15" y1="85" x2="85" y2="15" stroke="#f59e0b" stroke-width="4"/></svg>`
  },
  "lizard": {
    src: "https://game-assets.snap.fan/card_variant_images/Lizard-8323799e8a03fee92c6e1268b0c7dcbd9f8df549f234e2ad0cdcc7f62496c96e.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Lizard/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🦎",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#14532d" stroke="#22c55e" stroke-width="3"/><polygon points="50,20 70,50 50,80 30,50" fill="#15803d"/><circle cx="42" cy="45" r="4" fill="#ef4444"/><circle cx="58" cy="45" r="4" fill="#ef4444"/></svg>`
  },
  "sandman": {
    src: "https://game-assets.snap.fan/card_variant_images/Sandman-00af2690df8d6faf7c666c3e86c55a7549cee6e25f807fcab4b81f6c41902863.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Sandman/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "⏳",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#78350f" stroke="#d97706" stroke-width="3"/><rect x="30" y="30" width="40" height="40" rx="8" fill="#f59e0b"/></svg>`
  },
  "electro": {
    src: "https://game-assets.snap.fan/card_variant_images/Electro-6a3c5623f11581f5b9fd25d6c68df90cfbdb22216aab14a5fd62e6d956e9c111.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Electro/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#eab308" stroke-width="3"/><polygon points="50,15 60,40 45,45 65,85 40,55 55,50" fill="#facc15"/></svg>`
  },
  "vulture": {
    src: "https://game-assets.snap.fan/card_variant_images/Vulture-a1cf16d8ad3c4a6f0e2a6833c0414785235386069af2a3e1ee4b114b354fafe5.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Vulture/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🦅",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" stroke-width="3"/><path d="M15 50 L50 20 L85 50 L50 80 Z" fill="#047857"/></svg>`
  },
  "rhino": {
    src: "https://game-assets.snap.fan/card_variant_images/Rhino-0f81008884ce7abce712dfb458f2687b72193db81e79e7bd896f961f8d5b0615.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Rhino/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🦏",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#334155" stroke="#94a3b8" stroke-width="3"/><polygon points="50,15 65,45 35,45" fill="#e2e8f0"/></svg>`
  },
  "scorpion": {
    src: "https://game-assets.snap.fan/card_variant_images/Scorpion-d2b1e67aae1c1f56bad3d7dc2ff59c5181bd5471e8d0f3e33b26f1e0c88dc30a.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Scorpion/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🦂",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#14532d" stroke="#84cc16" stroke-width="3"/><path d="M50 80 Q80 50 50 20" stroke="#84cc16" stroke-width="6" fill="none"/></svg>`
  },
  "shocker": {
    src: "https://game-assets.snap.fan/card_variant_images/Shocker-5ecde1461bb16ccc1bcc2a64049faf3217b58948340d3d1ba58045122a5f219b.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Shocker/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🥊",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#78350f" stroke="#eab308" stroke-width="3"/><circle cx="50" cy="50" r="25" fill="#ca8a04"/></svg>`
  },
  "kingpin": {
    src: "https://game-assets.snap.fan/card_variant_images/Kingpin-a8f5307a1ff643d8f21525244c8a76197741ad7e6de02c71dd743b2459fdadbb.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Kingpin/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "👔",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#ffffff" stroke-width="3"/><circle cx="50" cy="40" r="22" fill="#f8fafc"/><polygon points="35,80 50,60 65,80" fill="#e2e8f0"/></svg>`
  },
  "misternegative": {
    src: "https://game-assets.snap.fan/card_variant_images/MrNegative-74f2dbc65c88bd4f877fa5e6343e5aac179196393a4fd5d122544ac22af07eb0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MrNegative/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "☯️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#000000" stroke="#ffffff" stroke-width="3"/><circle cx="50" cy="50" r="25" fill="#ffffff"/></svg>`
  },
  "tombstone": {
    src: "https://game-assets.snap.fan/card_variant_images/Tombstone-da49688eaef8caa7aac3baf531c6c140ee83cb81c3354e3a8477cfb3a57c19bf.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Tombstone/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🪨",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/><rect x="30" y="25" width="40" height="50" rx="6" fill="#64748b"/></svg>`
  },
  "hammerhead": {
    src: "https://game-assets.snap.fan/card_variant_images/Kingpin-a8f5307a1ff643d8f21525244c8a76197741ad7e6de02c71dd743b2459fdadbb.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Kingpin/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🔨",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#334155" stroke="#94a3b8" stroke-width="3"/><rect x="30" y="20" width="40" height="25" rx="2" fill="#cbd5e1"/></svg>`
  },
  "taskmaster": {
    src: "https://game-assets.snap.fan/card_variant_images/Taskmaster-ffa1033367eb36c0627f3f4e59551809dda557c8ebfed583bfbe7e1e1f3213eb.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Taskmaster/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "💀",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#f59e0b" stroke-width="3"/><circle cx="50" cy="45" r="20" fill="#ffffff"/><circle cx="42" cy="42" r="4" fill="#000000"/><circle cx="58" cy="42" r="4" fill="#000000"/></svg>`
  },
  "prowler": {
    src: "https://game-assets.snap.fan/card_variant_images/Prowler-a1b5384828488ed8ac77a1127ca7e26111eb1ea7ab22935cefde4ee477796e75.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Prowler/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🟣",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#3b0764" stroke="#a855f7" stroke-width="3"/><polygon points="30,40 50,20 70,40 50,75" fill="#7e22ce"/></svg>`
  },
  "tinkerer": {
    src: "https://game-assets.snap.fan/card_variant_images/DoctorOctopus-c6776e01041071036c336b0dbb45104f69297ca78c9d7696a1b4326e51474ea4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/DoctorOctopus/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "💡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#18181b" stroke="#c084fc" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#581c87"/></svg>`
  },
  "spot": {
    src: "https://game-assets.snap.fan/card_variant_images/Mysterio-07d5bb69a4b6e0496f12000c7cd58aa8f0f3001783d756ce0d95d8f6596e72e6.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Mysterio/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center center",
    fallbackIcon: "⚪",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#000000" stroke-width="3"/><circle cx="30" cy="30" r="8" fill="#000000"/><circle cx="70" cy="35" r="10" fill="#000000"/><circle cx="45" cy="65" r="12" fill="#000000"/></svg>`
  },
  "morbius": {
    src: "https://game-assets.snap.fan/card_variant_images/Morbius-57f69abb0a557071091fc1b6083d9b3eb6f7ffff1ae7b199b4a7e085cb7bd51b.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Morbius/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🦇",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#020617" stroke="#ef4444" stroke-width="3"/><path d="M20 40 Q50 20 80 40 Q50 80 20 40 Z" fill="#991b1b"/></svg>`
  },
  "chameleon": {
    src: "https://game-assets.snap.fan/card_variant_images/Chameleon-e69d8a4463dc73310dc01b19d5b9842ace32731cbc9f124e164d89522dab253a.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Chameleon/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🎭",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#334155" stroke="#cbd5e1" stroke-width="3"/><circle cx="50" cy="48" r="22" fill="#f1f5f9"/></svg>`
  },
  "hobgoblin": {
    src: "https://game-assets.snap.fan/card_variant_images/Hobgoblin-d1afd2f89a4c8f0fb5fc6786848bb9f6581f7a60bb8820c87fafec65da180b6c.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Hobgoblin/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🎃",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7c2d12" stroke="#ea580c" stroke-width="3"/><polygon points="50,15 75,40 68,75 50,88 32,75 25,40" fill="#c2410c"/></svg>`
  },
  "jackal": {
    src: "https://game-assets.snap.fan/card_variant_images/Lizard-8323799e8a03fee92c6e1268b0c7dcbd9f8df549f234e2ad0cdcc7f62496c96e.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Lizard/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🐺",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#14532d" stroke="#22c55e" stroke-width="3"/><polygon points="50,20 70,55 30,55" fill="#16a34a"/></svg>`
  },
  "hydroman": {
    src: "https://game-assets.snap.fan/card_variant_images/HydroMan-3ba324206190760633ece8b7ae2c48d2a72fd747ecec2a72146f3ddfb32ebcba.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/HydroMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🌊",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0c4a6e" stroke="#0284c7" stroke-width="3"/><path d="M20 60 Q50 30 80 60 T20 60 Z" fill="#38bdf8"/></svg>`
  },
  "moltenman": {
    src: "https://game-assets.snap.fan/card_variant_images/Electro-6a3c5623f11581f5b9fd25d6c68df90cfbdb22216aab14a5fd62e6d956e9c111.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Electro/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🔥",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#f97316" stroke-width="3"/><circle cx="50" cy="50" r="26" fill="#fb923c"/></svg>`
  },
  "scream": {
    src: "https://game-assets.snap.fan/card_variant_images/Scream-9fe5956e6bbe30cf7f6220449aacb78fc696ebb6a7cf18e96f3630f72fe69435.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Scream/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "💛",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#eab308" stroke-width="3"/><path d="M20 30 Q50 90 80 30 Z" fill="#ca8a04"/></svg>`
  },
  "knull": {
    src: "https://game-assets.snap.fan/card_variant_images/Knull-4371f05e45b8d25996a8fa653395fe2ea778ed5104a1d055e7c157c1a71654d3.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Knull/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "👑",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#000000" stroke="#dc2626" stroke-width="3"/><polygon points="30,25 50,45 70,25 80,75 20,75" fill="#991b1b"/></svg>`
  },
  "morlun": {
    src: "https://game-assets.snap.fan/card_variant_images/Kraven-16756b16289cb2d19aadfd63c9ea2fddfc6827dd130021ce9002c22363efed02.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Kraven/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🩸",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#9333ea" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#581c87"/></svg>`
  },

  // --- ALLIES (24 ENTRIES: MARVEL SNAP CARD ARTWORK & OFFICIAL PLAYSTATION MEDIA) ---
  "mj": {
    src: "https://game-assets.snap.fan/card_variant_images/MaryJane-b9721d759d080b71986680646ca0068498b71bad262b750029679824133a12e0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MaryJane/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "👩‍🦰",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#ea580c" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fdba74"/></svg>`
  },
  "aunt_may": {
    src: "https://game-assets.snap.fan/card_variant_images/AuntMay-a90c9c98897297078cc60ecd20d8cde36e2dffcc63e6380997752aa3efde3bf2.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/AuntMay/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "👵",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#334155" stroke="#f1f5f9" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fed7aa"/></svg>`
  },
  "uncle_ben": {
    src: "https://game-assets.snap.fan/card_variant_images/UncleBen-b5469c602158076ac306ce00aab865346f2fd045e2fa2967f1eda73e3f2a2e5e.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/UncleBen/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "👴",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fde68a"/></svg>`
  },
  "harry_osborn": {
    src: "https://game-assets.snap.fan/card_variant_images/UncleBen-b5469c602158076ac306ce00aab865346f2fd045e2fa2967f1eda73e3f2a2e5e.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/UncleBen/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "👱‍♂️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#14532d" stroke="#16a34a" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fef08a"/></svg>`
  },
  "gwen_stacy": {
    src: "https://game-assets.snap.fan/card_variant_images/GhostSpider-f84661a735d817978d9174512691236eb8ac84ed438cbf4d91a367bbc540da2c.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/GhostSpider/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🌸",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#00f0ff" stroke-width="3"/><path d="M50 10 Q10 25 20 85 Q50 95 80 85 Q90 25 50 10 Z" fill="#ffffff" stroke="#ec4899" stroke-width="2"/><polygon points="30,45 44,50 40,36" fill="#00f0ff"/><polygon points="70,45 56,50 60,36" fill="#00f0ff"/></svg>`
  },
  "miles_morales": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#e62429" stroke-width="3"/><path d="M50 12 C28 12 15 32 15 55 C15 78 38 88 50 88 C62 88 85 78 85 55 C85 32 72 12 50 12 Z" fill="#18181b"/><polygon points="25,45 42,52 38,35" fill="#e62429"/><polygon points="75,45 58,52 62,35" fill="#e62429"/></svg>`
  },
  "ganke_lee": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "💻",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fed7aa"/></svg>`
  },
  "yuri_watanabe": {
    src: "https://game-assets.snap.fan/card_variant_images/SilverSable-e87013e0bf5c491ed968bc16b853e6600fb2fda689e830602fa2d81cd164b7c3.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SilverSable/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🚨",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#0ea5e9" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fde68a"/></svg>`
  },
  "black_cat": {
    src: "https://game-assets.snap.fan/card_variant_images/BlackCat-cefb454d4c241f1699a8ddb9326a10d42946ae5786c97da4b604ddb5a7e5f6c6.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/BlackCat/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🐾",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#ffffff" stroke-width="3"/><circle cx="50" cy="48" r="22" fill="#334155"/><path d="M28 42 Q50 30 72 42 L68 52 Q50 40 32 52 Z" fill="#000000"/></svg>`
  },
  "silver_sable": {
    src: "https://game-assets.snap.fan/card_variant_images/SilverSable-e87013e0bf5c491ed968bc16b853e6600fb2fda689e830602fa2d81cd164b7c3.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SilverSable/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🗡️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#334155" stroke="#e2e8f0" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#e2e8f0"/></svg>`
  },
  "wraith": {
    src: "https://game-assets.snap.fan/card_variant_images/BlackCat-cefb454d4c241f1699a8ddb9326a10d42946ae5786c97da4b604ddb5a7e5f6c6.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/BlackCat/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "⛓️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#312e81" stroke="#a855f7" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#6b21a8"/></svg>`
  },
  "daredevil": {
    src: "https://game-assets.snap.fan/card_variant_images/Daredevil-523c0c2ade3acb03dbb53bc68c970b32e3a0b83c3048406dff30cba20a41f93e.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Daredevil/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "😈",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/><polygon points="30,40 45,45 35,55" fill="#ef4444"/><polygon points="70,40 55,45 65,55" fill="#ef4444"/></svg>`
  },
  "human_torch": {
    src: "https://game-assets.snap.fan/card_variant_images/HumanTorch-5cb414ab203e49e7fafa506a784c5588969f535e100fd540174ff149d54abf1d.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/HumanTorch/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🔥",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7c2d12" stroke="#f97316" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fb923c"/></svg>`
  },
  "wolverine": {
    src: "https://game-assets.snap.fan/card_variant_images/Wolverine-a5818711f341fce2d32b720b5e5c1ce3abdeb87115ba2f13338fe938ac635c1d.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Wolverine/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🐺",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#713f12" stroke="#eab308" stroke-width="3"/><polygon points="20,20 40,50 30,70" fill="#ca8a04"/><polygon points="80,20 60,50 70,70" fill="#ca8a04"/></svg>`
  },
  "deadpool": {
    src: "https://game-assets.snap.fan/card_variant_images/Deadpool-a5dc40fe983c98a608ace9b8229bb6d9a88f1ff3e55d980879bd84b41033a16f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Deadpool/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "⚔️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#000000" stroke-width="3"/><circle cx="38" cy="45" r="10" fill="#000000"/><circle cx="62" cy="45" r="10" fill="#000000"/></svg>`
  },
  "doctor_strange": {
    src: "https://game-assets.snap.fan/card_variant_images/DoctorStrange-b05d7d9c7f09c8981d5800833bbfe8f8d27777917e7907e15d0f3586ba484f1e.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/DoctorStrange/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "👁️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#eab308" stroke-width="3"/><circle cx="50" cy="45" r="18" fill="#eab308"/></svg>`
  },
  "iron_man": {
    src: "https://game-assets.snap.fan/card_variant_images/IronMan-ff455ad737fcc333a64944f87b2d1345f517d2e7e39915b516aba4ad2616a05a.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/IronMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🤖",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#eab308" stroke-width="3"/><rect x="35" y="35" width="30" height="30" rx="4" fill="#facc15"/></svg>`
  },
  "captain_america": {
    src: "https://game-assets.snap.fan/card_variant_images/CaptainAmerica-5152ba5b103593cd4227da4e9272aa3da068285b7a18a1b9dfbd1509ddb1ae45.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/CaptainAmerica/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🛡️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#ef4444" stroke-width="3"/><polygon points="50,30 55,42 68,42 57,50 62,62 50,54 38,62 43,50 32,42 45,42" fill="#ffffff"/></svg>`
  },
  "luke_cage": {
    src: "https://game-assets.snap.fan/card_variant_images/LukeCage-c0437a9aa3943f12536a6f61e0d0950e76117dabc97859ce52f4493b26c64d66.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/LukeCage/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "💪",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#713f12" stroke="#eab308" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#a16207"/></svg>`
  },
  "jessica_jones": {
    src: "https://game-assets.snap.fan/card_variant_images/JessicaJones-f349d112280e57d1de59da6f0f83bc6ec59673bb48e2418df5f19d6772be3199.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/JessicaJones/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🔍",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#cbd5e1"/></svg>`
  },
  "cloak": {
    src: "https://game-assets.snap.fan/card_variant_images/Cloak-248d08214f0630def092261598e1da5745245cc595df15e0873d507f42e3123e.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Cloak/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🌌",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#020617" stroke="#6366f1" stroke-width="3"/><path d="M20 20 Q50 60 80 20 L50 85 Z" fill="#1e1b4b"/></svg>`
  },
  "dagger": {
    src: "https://game-assets.snap.fan/card_variant_images/Dagger-36fc61c776919faf73422806151c91ff8cd28203715b1e7e917aaed3ca54354c.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Dagger/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "✨",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#38bdf8" stroke-width="3"/><polygon points="50,15 55,40 80,50 55,60 50,85 45,60 20,50 45,40" fill="#bae6fd"/></svg>`
  },
  "silk": {
    src: "https://game-assets.snap.fan/card_variant_images/Silk-9fa78c4a1ee313122bee1e1d31ab275eb4d6521f894e83ce3a97c97f3254a936.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Silk/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🧣",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#dc2626" stroke-width="3"/><rect x="30" y="50" width="40" height="20" rx="4" fill="#dc2626"/></svg>`
  },
  "spider_woman": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderWoman-ed7b385eaf7274cac81cfe52ed2273606f4c5a81cc89db8fab10fc95c2bbeec4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderWoman/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🕷️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#eab308" stroke-width="3"/><polygon points="25,45 42,52 38,35" fill="#facc15"/><polygon points="75,45 58,52 62,35" fill="#facc15"/></svg>`
  },

  // --- SPIDER-VERSE VARIANTS (18 ENTRIES: MARVEL SNAP CARD ARTWORK & SONY/MARVEL MEDIA) ---
  "peter_parker": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🕷️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#e62429" stroke-width="3"/><polygon points="25,45 42,52 38,35" fill="#ffffff"/><polygon points="75,45 58,52 62,35" fill="#ffffff"/></svg>`
  },
  "spider_man_2099": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan2099-fab01f8f4107e3f4031f9bf75b5e66b265bb7dd4511581dbed5a056611ec73bf.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan2099/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🌃",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#ef4444" stroke-width="3"/><polygon points="25,45 42,52 38,35" fill="#ef4444"/><polygon points="75,45 58,52 62,35" fill="#ef4444"/></svg>`
  },
  "spider_man_noir": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderManNoir-e01cf38009141109dec85d609ee733008d966592386bc17a60921288ae496d65.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderManNoir/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🕵️‍♂️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/><circle cx="50" cy="45" r="20" fill="#334155"/></svg>`
  },
  "spider_punk": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderPunk-7b05ee843607b5afeaf06183ab64362f4a25233f849ab079d4a4d85d978a09d0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderPunk/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🎸",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#f59e0b" stroke-width="3"/><polygon points="50,15 65,45 35,45" fill="#facc15"/></svg>`
  },
  "peni_parker": {
    src: "https://game-assets.snap.fan/card_variant_images/SPdr-dbb2263aecbaf3f25915ba5e7b54ae6517e892640220faa341512b47ebc160b4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SPdr/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🤖",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0284c7"/></svg>`
  },
  "spider_man_india": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderPunk-7b05ee843607b5afeaf06183ab64362f4a25233f849ab079d4a4d85d978a09d0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderPunk/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🕌",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7c2d12" stroke="#f97316" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fb923c"/></svg>`
  },
  "spider_ham": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderHam-16c58126fc5758c15538424046d0f71048cdaf6c239851c7f5f031aadcedcf57.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderHam/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🐷",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#831843" stroke="#f472b6" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#fbcfe8"/></svg>`
  },
  "scarlet_spider": {
    src: "https://game-assets.snap.fan/card_variant_images/ScarletSpider-abc9a5d2965279c73c1b5ce5b3351c6c9e947a7476bbdccc96141046ee2d93ff.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/ScarletSpider/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🔴",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#0284c7" stroke-width="3"/><polygon points="25,45 42,52 38,35" fill="#ffffff"/><polygon points="75,45 58,52 62,35" fill="#ffffff"/></svg>`
  },
  "scarlet_spider_kaine": {
    src: "https://game-assets.snap.fan/card_variant_images/ScarletSpider-abc9a5d2965279c73c1b5ce5b3351c6c9e947a7476bbdccc96141046ee2d93ff.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/ScarletSpider/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🔥",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#450a0a" stroke="#ef4444" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#b91c1c"/></svg>`
  },
  "superior_spider_man": {
    src: "https://game-assets.snap.fan/card_variant_images/SuperiorSpiderMan-ec42948df34870d0d5afa25a9ba5cb0e4f0a2369d194f85df6c684468f6c7a56.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SuperiorSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🐙",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#991b1b"/></svg>`
  },
  "spider_man_uk": {
    src: "https://game-assets.snap.fan/card_variant_images/CaptainAmerica-5152ba5b103593cd4227da4e9272aa3da068285b7a18a1b9dfbd1509ddb1ae45.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/CaptainAmerica/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🇬🇧",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#ef4444" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#3b82f6"/></svg>`
  },
  "cosmic_spider_man": {
    src: "https://game-assets.snap.fan/card_variant_images/SymbioteSpiderMan-5f90b5bb525007714c23b58a27bd33613111480bdadb8c59d1fb75ebf3ea9c1f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SymbioteSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🌌",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#020617" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0ea5e9"/></svg>`
  },
  "symbiote_spider_man": {
    src: "https://game-assets.snap.fan/card_variant_images/SymbioteSpiderMan-5f90b5bb525007714c23b58a27bd33613111480bdadb8c59d1fb75ebf3ea9c1f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SymbioteSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    fallbackIcon: "🖤",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#ffffff" stroke-width="3"/><polygon points="25,45 42,52 38,35" fill="#ffffff"/><polygon points="75,45 58,52 62,35" fill="#ffffff"/></svg>`
  },

  // --- SUITS (18 ENTRIES: OFFICIAL PLAYSTATION BLOG & INSOMNIAC PROMOTIONAL MEDIA) ---
  "classic_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🔴",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#e62429" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#ef4444"/></svg>`
  },
  "advanced_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "⚪",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#ffffff" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#e2e8f0"/></svg>`
  },
  "advanced_suit_2": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "⚪",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0284c7"/></svg>`
  },
  "black_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SymbioteSpiderMan-5f90b5bb525007714c23b58a27bd33613111480bdadb8c59d1fb75ebf3ea9c1f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SymbioteSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🖤",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#020617" stroke="#ffffff" stroke-width="3"/><polygon points="25,45 42,52 38,35" fill="#ffffff"/><polygon points="75,45 58,52 62,35" fill="#ffffff"/></svg>`
  },
  "anti_ock_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/DoctorOctopus-c6776e01041071036c336b0dbb45104f69297ca78c9d7696a1b4326e51474ea4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/DoctorOctopus/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🟡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#eab308" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#ca8a04"/></svg>`
  },
  "iron_spider": {
    src: "https://game-assets.snap.fan/card_variant_images/IronMan-ff455ad737fcc333a64944f87b2d1345f517d2e7e39915b516aba4ad2616a05a.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/IronMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🟡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#eab308" stroke-width="3"/><rect x="35" y="35" width="30" height="30" rx="4" fill="#facc15"/></svg>`
  },
  "miles_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🔴",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#dc2626" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#ef4444"/></svg>`
  },
  "miles_2020_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🎧",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0284c7"/></svg>`
  },
  "miles_bodega_cat": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🐱",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#78350f" stroke="#fbbf24" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#f59e0b"/></svg>`
  },
  "velocity_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0ea5e9"/></svg>`
  },
  "spider_armor_mk4": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🛡️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#22c55e" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#16a34a"/></svg>`
  },
  "stealth_big_time": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderManNoir-e01cf38009141109dec85d609ee733008d966592386bc17a60921288ae496d65.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderManNoir/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🟢",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#022c22" stroke="#10b981" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#059669"/></svg>`
  },
  "noir_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderManNoir-e01cf38009141109dec85d609ee733008d966592386bc17a60921288ae496d65.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderManNoir/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🕵️‍♂️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/><circle cx="50" cy="45" r="20" fill="#334155"/></svg>`
  },
  "punk_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderPunk-7b05ee843607b5afeaf06183ab64362f4a25233f849ab079d4a4d85d978a09d0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderPunk/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🎸",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#f59e0b" stroke-width="3"/><polygon points="50,15 65,45 35,45" fill="#facc15"/></svg>`
  },
  "superior_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SuperiorSpiderMan-ec42948df34870d0d5afa25a9ba5cb0e4f0a2369d194f85df6c684468f6c7a56.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SuperiorSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🕷️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#991b1b"/></svg>`
  },
  "web_wings_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "🦅",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0369a1" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0284c7"/></svg>`
  },
  "anti_venom_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/SymbioteSpiderMan-5f90b5bb525007714c23b58a27bd33613111480bdadb8c59d1fb75ebf3ea9c1f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SymbioteSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "⚪",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#00f0ff" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#ffffff"/></svg>`
  },
  "evolved_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "portrait",
    objectPosition: "center top",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#06b6d4" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0891b2"/></svg>`
  },

  // --- GADGETS (16 ENTRIES: OFFICIAL PLAYSTATION BLOG & INSOMNIAC GAMEPLAY MEDIA) ---
  "web_shooter": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🕸️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><line x1="10" y1="50" x2="90" y2="50" stroke="#ffffff" stroke-width="3"/></svg>`
  },
  "impact_web": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "💥",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/><polygon points="50,20 65,40 50,60 35,40" fill="#f59e0b"/></svg>`
  },
  "web_bomb": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "💣",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#312e81" stroke="#a855f7" stroke-width="3"/><circle cx="50" cy="50" r="20" fill="#7e22ce"/></svg>`
  },
  "spider_drone": {
    src: "https://game-assets.snap.fan/card_variant_images/SPdr-dbb2263aecbaf3f25915ba5e7b54ae6517e892640220faa341512b47ebc160b4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SPdr/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🤖",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="18" fill="#0284c7"/></svg>`
  },
  "electric_web": {
    src: "https://game-assets.snap.fan/card_variant_images/Electro-6a3c5623f11581f5b9fd25d6c68df90cfbdb22216aab14a5fd62e6d956e9c111.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Electro/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#eab308" stroke-width="3"/><polygon points="50,15 60,40 45,45 65,85 40,55 55,50" fill="#facc15"/></svg>`
  },
  "suspension_matrix": {
    src: "https://game-assets.snap.fan/card_variant_images/Mysterio-07d5bb69a4b6e0496f12000c7cd58aa8f0f3001783d756ce0d95d8f6596e72e6.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Mysterio/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🌀",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#047857" stroke="#10b981" stroke-width="3"/><circle cx="50" cy="50" r="22" fill="#059669"/></svg>`
  },
  "trip_mine": {
    src: "https://game-assets.snap.fan/card_variant_images/Taskmaster-ffa1033367eb36c0627f3f4e59551809dda557c8ebfed583bfbe7e1e1f3213eb.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Taskmaster/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🚨",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#450a0a" stroke="#ef4444" stroke-width="3"/><line x1="15" y1="50" x2="85" y2="50" stroke="#ef4444" stroke-width="4"/></svg>`
  },
  "concussive_blast": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderPunk-7b05ee843607b5afeaf06183ab64362f4a25233f849ab079d4a4d85d978a09d0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderPunk/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "💨",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/><circle cx="50" cy="50" r="24" fill="#94a3b8"/></svg>`
  },
  "gravity_well": {
    src: "https://game-assets.snap.fan/card_variant_images/Mysterio-07d5bb69a4b6e0496f12000c7cd58aa8f0f3001783d756ce0d95d8f6596e72e6.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Mysterio/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🔮",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#3b0764" stroke="#c084fc" stroke-width="3"/><circle cx="50" cy="50" r="22" fill="#a855f7"/></svg>`
  },
  "remote_mine": {
    src: "https://game-assets.snap.fan/card_variant_images/Taskmaster-ffa1033367eb36c0627f3f4e59551809dda557c8ebfed583bfbe7e1e1f3213eb.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Taskmaster/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "📱",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#eab308" stroke-width="3"/><rect x="35" y="25" width="30" height="50" rx="4" fill="#facc15"/></svg>`
  },
  "holo_drone": {
    src: "https://game-assets.snap.fan/card_variant_images/Mysterio-07d5bb69a4b6e0496f12000c7cd58aa8f0f3001783d756ce0d95d8f6596e72e6.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/Mysterio/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "👥",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0369a1" stroke="#38bdf8" stroke-width="3"/><circle cx="35" cy="45" r="14" fill="#38bdf8"/><circle cx="65" cy="45" r="14" fill="#38bdf8"/></svg>`
  },
  "web_grabber": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🧲",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><path d="M30 30 C30 60 70 60 70 30" stroke="#e62429" stroke-width="8" fill="none"/></svg>`
  },
  "ricochet_web": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🎾",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#14532d" stroke="#84cc16" stroke-width="3"/><circle cx="50" cy="50" r="20" fill="#a3e635"/></svg>`
  },
  "sonic_burst": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderPunk-7b05ee843607b5afeaf06183ab64362f4a25233f849ab079d4a4d85d978a09d0.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderPunk/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🔊",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#020617" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="50" r="22" fill="#0ea5e9"/></svg>`
  },
  "upshot": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🚀",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#f59e0b" stroke-width="3"/><polygon points="50,15 65,45 35,45" fill="#facc15"/></svg>`
  },
  "spider_tracer": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "📍",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#ea580c" stroke-width="3"/><circle cx="50" cy="50" r="18" fill="#f97316"/></svg>`
  },

  // --- SKILLS & MOVES (28 ENTRIES: OFFICIAL PLAYSTATION & INSOMNIAC GAMEPLAY STILLS) ---
  "spider_sense": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#eab308" stroke-width="3"/><polygon points="50,15 60,40 45,45 65,85 40,55 55,50" fill="#facc15"/></svg>`
  },
  "web_swing": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🕸️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><path d="M10 80 Q50 20 90 80" stroke="#ffffff" stroke-width="4" fill="none"/></svg>`
  },
  "wall_crawl": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🧗‍♂️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/><rect x="35" y="20" width="30" height="60" fill="#64748b"/></svg>`
  },
  "perfect_dodge": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "💨",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#00f0ff" stroke-width="3"/><path d="M20 50 Q50 20 80 50" stroke="#00f0ff" stroke-width="4" fill="none"/></svg>`
  },
  "point_launch": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🚀",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#f59e0b" stroke-width="3"/><polygon points="50,15 65,45 35,45" fill="#facc15"/></svg>`
  },
  "slingshot_launch": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🏹",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0369a1" stroke="#38bdf8" stroke-width="3"/><path d="M20 30 L50 80 L80 30" stroke="#ffffff" stroke-width="4" fill="none"/></svg>`
  },
  "loop_de_loop": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🔄",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#a855f7" stroke-width="3"/><circle cx="50" cy="50" r="22" stroke="#c084fc" stroke-width="4" fill="none"/></svg>`
  },
  "web_wings_glide": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🦅",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/><polygon points="20,40 50,20 80,40 50,75" fill="#bae6fd"/></svg>`
  },
  "basic_combat": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🥊",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#ef4444" stroke-width="3"/><circle cx="50" cy="50" r="22" fill="#f87171"/></svg>`
  },
  "web_strike": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "💥",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/><polygon points="50,20 65,40 50,60 35,40" fill="#f59e0b"/></svg>`
  },
  "web_slam": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🏋️‍♂️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#312e81" stroke="#818cf8" stroke-width="3"/><circle cx="50" cy="50" r="22" fill="#6366f1"/></svg>`
  },
  "web_whip": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🌾",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#14532d" stroke="#22c55e" stroke-width="3"/><path d="M20 70 Q50 20 80 70" stroke="#22c55e" stroke-width="4" fill="none"/></svg>`
  },
  "parry_counter": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🛡️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#eab308" stroke-width="3"/><polygon points="50,20 75,40 75,70 50,85 25,70 25,40" fill="#ca8a04"/></svg>`
  },
  "spider_rush": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🏃‍♂️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#f87171" stroke-width="3"/><path d="M20 50 L80 50" stroke="#ef4444" stroke-width="6"/></svg>`
  },
  "spider_barrage": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🥊",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#f59e0b" stroke-width="3"/><circle cx="40" cy="45" r="12" fill="#d97706"/><circle cx="60" cy="45" r="12" fill="#d97706"/></svg>`
  },
  "aerial_combat": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🦘",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0369a1" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0284c7"/></svg>`
  },
  "finisher_move": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "⚔️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#facc15" stroke-width="3"/><line x1="25" y1="25" x2="75" y2="75" stroke="#facc15" stroke-width="5"/><line x1="75" y1="25" x2="25" y2="75" stroke="#facc15" stroke-width="5"/></svg>`
  },
  "venom_punch": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7c2d12" stroke="#ea580c" stroke-width="3"/><polygon points="50,15 60,40 45,45 65,85 40,55 55,50" fill="#f97316"/></svg>`
  },
  "venom_dash": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🏃‍♂️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#f97316" stroke-width="3"/><path d="M20 50 L80 50" stroke="#f97316" stroke-width="6"/></svg>`
  },
  "venom_jump": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🦘",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#713f12" stroke="#eab308" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#ca8a04"/></svg>`
  },
  "mega_venom_blast": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "💥",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#f97316" stroke-width="3"/><circle cx="50" cy="50" r="30" fill="#ea580c"/></svg>`
  },
  "camouflage": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/MilesMorales/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "👻",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#38bdf8" opacity="0.4"/></svg>`
  },
  "symbiote_punch": {
    src: "https://game-assets.snap.fan/card_variant_images/SymbioteSpiderMan-5f90b5bb525007714c23b58a27bd33613111480bdadb8c59d1fb75ebf3ea9c1f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SymbioteSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🖤",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#020617" stroke="#ffffff" stroke-width="3"/><polygon points="25,45 42,52 38,35" fill="#ffffff"/><polygon points="75,45 58,52 62,35" fill="#ffffff"/></svg>`
  },
  "symbiote_blast": {
    src: "https://game-assets.snap.fan/card_variant_images/SymbioteSpiderMan-5f90b5bb525007714c23b58a27bd33613111480bdadb8c59d1fb75ebf3ea9c1f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SymbioteSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🩸",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#450a0a" stroke="#dc2626" stroke-width="3"/><path d="M20 50 L80 50 M50 20 L50 80" stroke="#dc2626" stroke-width="4"/></svg>`
  },
  "symbiote_yank": {
    src: "https://game-assets.snap.fan/card_variant_images/SymbioteSpiderMan-5f90b5bb525007714c23b58a27bd33613111480bdadb8c59d1fb75ebf3ea9c1f.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/SymbioteSpiderMan/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🐙",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#a855f7" stroke-width="3"/><path d="M20 80 Q50 20 80 80" stroke="#a855f7" stroke-width="5" fill="none"/></svg>`
  },
  "science_mastery": {
    src: "https://game-assets.snap.fan/card_variant_images/DoctorOctopus-c6776e01041071036c336b0dbb45104f69297ca78c9d7696a1b4326e51474ea4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/DoctorOctopus/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🧪",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" stroke-width="3"/><circle cx="50" cy="45" r="20" fill="#059669"/></svg>`
  },
  "gadget_crafting": {
    src: "https://game-assets.snap.fan/card_variant_images/DoctorOctopus-c6776e01041071036c336b0dbb45104f69297ca78c9d7696a1b4326e51474ea4.webp?width=500&quality=80",
    sourceUrl: "https://snap.fan/cards/DoctorOctopus/",
    sourceName: "Marvel Snap Card Database (snap.fan)",
    publisherChip: "MARVEL SNAP",
    mediaType: "landscape",
    objectPosition: "center center",
    fallbackIcon: "🔧",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/><rect x="35" y="35" width="30" height="30" rx="4" fill="#94a3b8"/></svg>`
  },
  // --- SPIDER-PEOPLE & NEW ENTRIES FOR TASK 15 ---
  "mayday_parker": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-411db1fb6a6f69ad.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/mayday_parker.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🎀",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#ec4899" stroke-width="3"/><path d="M25 40 Q50 20 75 40 M50 20 L50 85" stroke="#ec4899" stroke-width="4" fill="none"/></svg>`
  },
  "annie_may_parker": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-411db1fb6a6f69ad.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/annie_may_parker.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "⭐",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/><polygon points="50,20 60,40 80,40 64,52 70,72 50,60 30,72 36,52 20,40 40,40" fill="#f59e0b"/></svg>`
  },
  "spider_man_2211": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan2099-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/spider_man_2211.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🛰️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="50" r="20" fill="#0f172a"/></svg>`
  },
  "spider_man_unlimited": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/spider_man_unlimited.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "💫",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#a855f7" stroke-width="3"/><path d="M30 50 L70 50 M50 30 L50 70" stroke="#a855f7" stroke-width="5"/></svg>`
  },
  "spider_byte": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/spider_byte.png",
    generated: true,
    promptFamily: "Original Cyber Spider Heroine Portrait v1",
    creationTool: "OpenAI ImageGen",
    disclaimer: "Original fan-project cyber spider heroine artwork used as a Spider-Byte archive placeholder. Not official Marvel artwork.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🌐",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0369a1" stroke="#00f0ff" stroke-width="3"/><rect x="30" y="30" width="40" height="40" rx="6" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/></svg>`
  },
  "sun_spider": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/sun_spider.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "☀️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7c2d12" stroke="#f97316" stroke-width="3"/><circle cx="50" cy="50" r="18" fill="#facc15"/></svg>`
  },
  "web_weaver": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/web_weaver.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🪡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#047857" stroke="#34d399" stroke-width="3"/><path d="M20 50 Q50 20 80 50 Q50 80 20 50 Z" fill="#065f46" stroke="#34d399" stroke-width="2"/></svg>`
  },
  "night_spider": {
    src: "https://game-assets.snap.fan/card_variant_images/BlackCat-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/night_spider.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🌙",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/><path d="M50 20 A 25 25 0 1 0 75 65 A 30 30 0 1 1 50 20 Z" fill="#e2e8f0"/></svg>`
  },
  "arana": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/arana.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🦂",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#881337" stroke="#f43f5e" stroke-width="3"/><circle cx="50" cy="50" r="22" fill="#be123c"/></svg>`
  },
  "julia_carpenter": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderWoman-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/julia_carpenter.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🕸️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#18181b" stroke="#e4e4e7" stroke-width="3"/><path d="M20 20 L80 80 M80 20 L20 80 M50 10 L50 90 M10 50 L90 50" stroke="#e4e4e7" stroke-width="2"/></svg>`
  },
  "madame_web": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/madame_web.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🔮",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" stroke-width="3"/><circle cx="50" cy="50" r="24" fill="#a7f3d0" stroke="#047857" stroke-width="2"/></svg>`
  },
  "spiderling": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/spiderling.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🛡️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#6366f1" stroke-width="3"/><polygon points="50,20 75,35 75,65 50,80 25,65 25,35" fill="#4338ca"/></svg>`
  },
  "spider_armor_mk1": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/spider_armor_mk1.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🛡️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#334155" stroke="#94a3b8" stroke-width="3"/><rect x="30" y="30" width="40" height="40" rx="8" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/></svg>`
  },
  "cyborg_spider_man": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/cyborg_spider_man.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "⚙️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#00f0ff" stroke-width="3"/><circle cx="50" cy="50" r="20" fill="#dc2626"/><line x1="10" y1="50" x2="90" y2="50" stroke="#00f0ff" stroke-width="4"/></svg>`
  },
  "spider_rex": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/spider_rex.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🦖",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#14532d" stroke="#22c55e" stroke-width="3"/><path d="M30 70 Q40 30 70 30 L80 45 L60 55 L70 80 Z" fill="#16a34a"/></svg>`
  },
  "supaidaman": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/supaidaman.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🤖",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/><polygon points="30,30 70,30 80,70 20,70" fill="#b91c1c"/></svg>`
  },
  "web_slinger": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/web_slinger.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🤠",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#78350f" stroke="#d97706" stroke-width="3"/><path d="M20 40 Q50 20 80 40 L90 50 L10 50 Z" fill="#b45309"/></svg>`
  },
  "spider_boy": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/spider-people/spider_boy.png",
    generated: true,
    promptFamily: "Spider-Verse Portrait v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🧢",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#3b82f6" stroke-width="3"/><path d="M30 40 Q50 25 70 40 L85 50 L15 50 Z" fill="#2563eb"/></svg>`
  },
  "ned_leeds": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/ned_leeds.png",
    generated: true,
    promptFamily: "Spider-Verse Allies v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "💻",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="18" fill="#0284c7"/></svg>`
  },
  "otto_octavius_ally": {
    src: "https://game-assets.snap.fan/card_variant_images/DoctorOctopus-c6776e01041071036c336b0dbb45104f69297ca78c9d7696a1b4326e51474ea4.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/otto_octavius_ally.png",
    generated: true,
    promptFamily: "Spider-Verse Allies v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🧪",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" stroke-width="3"/><circle cx="50" cy="45" r="20" fill="#059669"/></svg>`
  },
  "agent_venom": {
    src: "https://game-assets.snap.fan/card_variant_images/Venom-f29cdd80e077ddd235a9dac65d1958beed8593bb86c4d9649c7ba07a6cfb93b0.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/agent_venom.png",
    generated: true,
    promptFamily: "Spider-Verse Allies v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🔫",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#ffffff" stroke-width="3"/><path d="M30 40 L70 40 M50 20 L50 80" stroke="#ffffff" stroke-width="6"/></svg>`
  },
  "ezekiel_sims": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/ezekiel_sims.png",
    generated: true,
    promptFamily: "Spider-Verse Allies v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🏛️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#451a03" stroke="#d97706" stroke-width="3"/><rect x="30" y="30" width="40" height="40" fill="#b45309"/></svg>`
  },
  "robbie_robertson": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/robbie_robertson.png",
    generated: true,
    promptFamily: "Spider-Verse Allies v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "📰",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#334155" stroke="#cbd5e1" stroke-width="3"/><rect x="28" y="28" width="44" height="44" rx="4" fill="#64748b"/></svg>`
  },
  "moon_knight": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-01.webp?width=500&quality=80",
    localSrc: "assets/generated/portraits/moon_knight.png",
    generated: true,
    promptFamily: "Spider-Verse Allies v1",
    creationTool: "Antigravity Fan Art Generator",
    disclaimer: "Fan-project generated original portrait artwork - Not an official Marvel asset.",
    publisherChip: "FAN ARTWORK",
    mediaType: "portrait",
    fallbackIcon: "🌙",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#ffffff" stroke-width="3"/><path d="M50 20 A 25 25 0 1 0 75 65 A 30 30 0 1 1 50 20 Z" fill="#ffffff"/></svg>`
  },
  "miles_classic_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/games/marvels-spider-man-miles-morales/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "portrait",
    fallbackIcon: "🕷️",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#e62429" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#ef4444"/></svg>`
  },
  "miles_evolved_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/games/marvels-spider-man-2/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "portrait",
    fallbackIcon: "⚡",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#06b6d4" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0891b2"/></svg>`
  },
  "miles_upgraded_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/games/marvels-spider-man-2/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "portrait",
    fallbackIcon: "🔴",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#ef4444" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#dc2626"/></svg>`
  },
  "suit_shadow_spider": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/support/games/marvels-spider-man-2-support/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "portrait",
    fallbackIcon: "🥷",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#a855f7" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#7e22ce"/></svg>`
  },
  "miles_crimson_cowl": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/games/marvels-spider-man-miles-morales/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "portrait",
    fallbackIcon: "🩸",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#450a0a" stroke="#ef4444" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#b91c1c"/></svg>`
  },
  "miles_2020": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/games/marvels-spider-man-miles-morales/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "portrait",
    fallbackIcon: "🎧",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#09090b" stroke="#38bdf8" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#0284c7"/></svg>`
  },
  "miles_bodega_cat_suit": {
    src: "https://game-assets.snap.fan/card_variant_images/MilesMorales-c2789b29c3ededaac7f01c32b5ebe9f8802094d8c3f0e7e94348ce7953208fb4.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/games/marvels-spider-man-miles-morales/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "portrait",
    fallbackIcon: "🐱",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#78350f" stroke="#fbbf24" stroke-width="3"/><circle cx="50" cy="45" r="22" fill="#f59e0b"/></svg>`
  },
  "web_line": {
    src: "https://game-assets.snap.fan/card_variant_images/SpiderMan-f388d4345ce9359030e73259cc862cb3483e0c45e63577ce050755b358932c19.webp?width=500&quality=80",
    sourceUrl: "https://www.playstation.com/en-us/games/marvels-spider-man-2/",
    sourceName: "PlayStation Official Games",
    publisherChip: "PLAYSTATION",
    mediaType: "landscape",
    fallbackIcon: "🧵",
    fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/><line x1="10" y1="50" x2="90" y2="50" stroke="#f1f5f9" stroke-width="5"/></svg>`
  }
};

class MediaHelper {
  static getMedia(mediaId) {
    if (MEDIA_CATALOG[mediaId]) {
      return MEDIA_CATALOG[mediaId];
    }
    return {
      src: "",
      localSrc: `assets/generated/portraits/spider-people/${mediaId}.png`,
      generated: true,
      promptFamily: "Spider-Verse Cinematic Portraits v1",
      creationTool: "Antigravity Generated Fan Art",
      disclaimer: "Fan-project generated original illustration - Not official Marvel asset.",
      sourceUrl: "Internal Fan Art Generator",
      sourceName: "Generated Fan Artwork",
      publisherChip: "FAN ARTWORK",
      mediaType: "portrait",
      fallbackIcon: "🕷️",
      fallbackSvg: `<svg viewBox="0 0 100 100" class="snap-avatar-svg" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><path d="M50 28 C45 34 45 42 50 46 C55 42 55 34 50 28 Z" fill="#e62429"/><path d="M50 46 C42 52 42 66 50 72 C58 66 58 52 50 46 Z" fill="#e62429"/><path d="M48 36 Q30 25 18 32 M48 40 Q24 40 14 50 M48 52 Q24 62 18 76 M48 60 Q32 75 25 86" stroke="#e62429" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M52 36 Q70 25 82 32 M52 40 Q76 40 86 50 M52 52 Q76 62 82 76 M52 60 Q68 75 75 86" stroke="#e62429" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
    };
  }

  static renderMediaCardHtml(mediaId, altText = "", extraClass = "media-avatar-img", isLandscape = false) {
    const item = this.getMedia(mediaId);
    const useLandscape = isLandscape || item.mediaType === 'landscape';
    const frameClass = useLandscape ? 'media-card-frame landscape-frame' : 'media-card-frame portrait-frame';

    const localPath = item.localSrc || `assets/generated/portraits/spider-people/${mediaId}.png`;
    const remoteSrc = item.src || "";
    const initialSrc = item.localSrc ? localPath : (remoteSrc || localPath);

    const defaultFallbackSvg = `<svg viewBox="0 0 100 100" class="snap-avatar-svg" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#e62429" stroke-width="3"/><path d="M50 28 C45 34 45 42 50 46 C55 42 55 34 50 28 Z" fill="#e62429"/><path d="M50 46 C42 52 42 66 50 72 C58 66 58 52 50 46 Z" fill="#e62429"/><path d="M48 36 Q30 25 18 32 M48 40 Q24 40 14 50 M48 52 Q24 62 18 76 M48 60 Q32 75 25 86" stroke="#e62429" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M52 36 Q70 25 82 32 M52 40 Q76 40 86 50 M52 52 Q76 62 82 76 M52 60 Q68 75 75 86" stroke="#e62429" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

    let rawSvg = item.fallbackSvg || defaultFallbackSvg;
    rawSvg = rawSvg.replace(/<text[\s\S]*?<\/text>/gi, '');
    if (!rawSvg.includes('aria-hidden')) {
      rawSvg = rawSvg.replace('<svg ', '<svg aria-hidden="true" ');
    }

    const escapedSvg = rawSvg
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '');

    const objPosStyle = item.objectPosition ? `style="object-position: ${item.objectPosition};"` : '';

    return `<div class="${frameClass}">
      <img src="${initialSrc}" alt="${altText || mediaId}" class="${extraClass}" loading="lazy" ${objPosStyle} onerror="if(this.src && !this.src.endsWith('${remoteSrc}') && '${remoteSrc}'){this.src='${remoteSrc}';}else{this.onerror=null; this.parentElement.innerHTML='${escapedSvg}';}" />
    </div>`;
  }
}

window.MEDIA_CATALOG = MEDIA_CATALOG;
window.MediaHelper = MediaHelper;
