const {
  useState,
  useRef,
  useEffect
} = React;
const EMOJIS = ["🛏️", "🧴", "🪥", "🪒", "🧘", "🚿", "💆", "✨", "🥣", "☕", "📖", "🏃", "💊", "🧹", "👔", "🌅", "🌙", "🧠", "💪", "🥗", "🍵", "🧃", "🫧", "🪴", "📝", "🎧", "🕯️", "🫁", "🤸", "🏋️", "🚴", "🧗", "🛁", "👁️", "💤", "🌿", "🫶", "🥛", "🍳", "🧇", "🫐", "🍎", "🪞", "🌬️", "🫀", "🦷", "🧼", "📱", "📅", "⭐", "🎯", "🔥", "💫", "🌊", "🍃", "🦋", "🌸", "🎵", "🏆", "⚡", "🔮", "🌈", "🧬", "🎨", "🌺", "🍀", "🌻", "🏅", "🐬", "🌴", "🍁", "🎭"];
const IBGS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#A78BFA", "#34D399", "#FB923C", "#F472B6", "#60A5FA", "#FBBF24", "#818CF8", "#2DD4BF"];
const PAL = [{
  c: "#FF9500"
}, {
  c: "#34C759"
}, {
  c: "#FF3B30"
}, {
  c: "#5856D6"
}, {
  c: "#007AFF"
}, {
  c: "#FF2D55"
}, {
  c: "#AF52DE"
}, {
  c: "#00C7BE"
}];
const DEF = [{
  id: 1,
  name: "Morning Routine",
  emoji: "🌅",
  color: "#FF9500",
  tasks: [{
    id: 11,
    name: "Make bed",
    emoji: "🛏️",
    dur: 1
  }, {
    id: 12,
    name: "Cleanse",
    emoji: "🧴",
    dur: 3
  }, {
    id: 13,
    name: "Brush teeth",
    emoji: "🦷",
    dur: 3
  }, {
    id: 14,
    name: "Shave",
    emoji: "🪒",
    dur: 5
  }, {
    id: 15,
    name: "Stretching",
    emoji: "🤸",
    dur: 5
  }, {
    id: 16,
    name: "Shower",
    emoji: "🚿",
    dur: 10
  }, {
    id: 17,
    name: "Skincare",
    emoji: "✨",
    dur: 5
  }, {
    id: 18,
    name: "Breakfast",
    emoji: "🥣",
    dur: 10
  }]
}, {
  id: 2,
  name: "Yoga & Mobility",
  emoji: "🧘",
  color: "#34C759",
  tasks: [{
    id: 21,
    name: "Breathwork",
    emoji: "🫁",
    dur: 3
  }, {
    id: 22,
    name: "Warm up",
    emoji: "🌬️",
    dur: 5
  }, {
    id: 23,
    name: "Sun salutation",
    emoji: "🌅",
    dur: 10
  }, {
    id: 24,
    name: "Flow",
    emoji: "🧘",
    dur: 15
  }, {
    id: 25,
    name: "Balance poses",
    emoji: "🤸",
    dur: 10
  }, {
    id: 26,
    name: "Cool down",
    emoji: "🌿",
    dur: 5
  }, {
    id: 27,
    name: "Meditation",
    emoji: "🕯️",
    dur: 5
  }]
}, {
  id: 3,
  name: "Workout Strength",
  emoji: "💪",
  color: "#FF3B30",
  tasks: [{
    id: 31,
    name: "Warm up",
    emoji: "🏃",
    dur: 5
  }, {
    id: 32,
    name: "Cardio",
    emoji: "🚴",
    dur: 15
  }, {
    id: 33,
    name: "Strength",
    emoji: "🏋️",
    dur: 20
  }, {
    id: 34,
    name: "Core",
    emoji: "🧗",
    dur: 10
  }, {
    id: 35,
    name: "Cool down",
    emoji: "💆",
    dur: 5
  }, {
    id: 36,
    name: "Protein",
    emoji: "🥛",
    dur: 2
  }]
}, {
  id: 4,
  name: "Night Wind-down",
  emoji: "🌙",
  color: "#5856D6",
  tasks: [{
    id: 41,
    name: "Tidy up",
    emoji: "🧹",
    dur: 5
  }, {
    id: 42,
    name: "Skincare",
    emoji: "🧴",
    dur: 5
  }, {
    id: 43,
    name: "Brush teeth",
    emoji: "🦷",
    dur: 3
  }, {
    id: 44,
    name: "Journal",
    emoji: "📝",
    dur: 10
  }, {
    id: 45,
    name: "Read",
    emoji: "📖",
    dur: 20
  }, {
    id: 46,
    name: "No screens",
    emoji: "🕯️",
    dur: 10
  }, {
    id: 47,
    name: "Sleep",
    emoji: "💤",
    dur: 1
  }]
}, {
  id: 5,
  name: "Lunch & Reset",
  emoji: "🥗",
  color: "#00C7BE",
  tasks: [{
    id: 51,
    name: "Hydrate",
    emoji: "🧃",
    dur: 2
  }, {
    id: 52,
    name: "Lunch",
    emoji: "🥗",
    dur: 20
  }, {
    id: 53,
    name: "Walk",
    emoji: "🚶",
    dur: 10
  }, {
    id: 54,
    name: "Breathe & reset",
    emoji: "🫁",
    dur: 5
  }]
}];
function ensureRoutineDefaults(saved) {
  if (!saved) return DEF;
  const routines = Array.isArray(saved) ? saved : [];
  if (!routines.some(r => /lunch|trưa/i.test(r.name || ''))) {
    const lunch = DEF.find(r => r.id === 5);
    return [...routines, lunch];
  }
  return routines;
}
const p2 = n => String(Math.floor(n)).padStart(2, "0");
const fmt = s => `${p2(s / 60)}:${p2(s % 60)}`;
const tot = ts => ts.reduce((a, t) => a + t.dur, 0);
const addM = (d, m) => new Date(d.getTime() + m * 60000);
const fT = d => d.toLocaleTimeString([], {
  hour: "numeric",
  minute: "2-digit"
});
function snd(type, muted) {
  if (muted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    (({
      complete: [[523, 0], [659, .12], [784, .24], [1047, .4]],
      switch: [[659, 0], [784, .12]],
      pause: [[440, 0]],
      resume: [[523, 0], [659, .1]]
    })[type] || [[440, 0]]).forEach(([f, d]) => {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = f;
      g.gain.setValueAtTime(0, ctx.currentTime + d);
      g.gain.linearRampToValueAtTime(.18, ctx.currentTime + d + .03);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + d + .4);
      o.start(ctx.currentTime + d);
      o.stop(ctx.currentTime + d + .5);
    });
  } catch {}
}
function vibe(t = 'light') {
  try {
    if (navigator.vibrate) navigator.vibrate({
      light: [12],
      medium: [25],
      success: [12, 25, 12]
    }[t] || [12]);
  } catch {}
}
function setMS(task, color, rname) {
  if (!('mediaSession' in navigator)) return;
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = color;
    x.fillRect(0, 0, 512, 512);
    x.font = '220px serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(task.emoji, 256, 256);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: task.name,
      artist: rname,
      artwork: [{
        src: c.toDataURL(),
        sizes: '512x512',
        type: 'image/png'
      }]
    });
    navigator.mediaSession.playbackState = 'playing';
  } catch {}
}
async function reqWL() {
  try {
    return 'wakeLock' in navigator ? await navigator.wakeLock.request('screen') : null;
  } catch {
    return null;
  }
}
const LS = 'routines_v5';
const ldR = () => {
  try {
    const d = localStorage.getItem(LS);
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
};
const svR = r => {
  try {
    localStorage.setItem(LS, JSON.stringify(r));
  } catch {}
};
const syncR = r => fetch('/api/cloud?key=routines', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    version: 1,
    updatedAt: new Date().toISOString(),
    routines: r
  })
}).catch(() => {});
const Icon = ({
  name,
  size = 20
}) => React.createElement("i", {
  className: `ti ti-${name}`,
  "aria-hidden": "true",
  style: {
    fontSize: size
  }
});
const routineIcon = name => /yoga/i.test(name) ? 'yoga' : /work|gym/i.test(name) ? 'barbell' : /night|sleep/i.test(name) ? 'moon-stars' : /morning/i.test(name) ? 'sunrise' : /lunch|trưa/i.test(name) ? 'bowl-spoon' : 'repeat';
const taskIcon = name => /bed|sleep/i.test(name) ? 'bed' : /brush|teeth/i.test(name) ? 'dental' : /shower|cleanse|skin/i.test(name) ? 'droplet' : /read/i.test(name) ? 'book-2' : /journal|write/i.test(name) ? 'pencil' : /meditat|breath/i.test(name) ? 'wind' : /breakfast|protein|eat|lunch/i.test(name) ? 'bowl-spoon' : /walk|cardio|run/i.test(name) ? 'run' : /strength|workout|core/i.test(name) ? 'barbell' : /tidy|clean/i.test(name) ? 'sparkles' : /stretch|yoga|flow|pose/i.test(name) ? 'yoga' : 'circle-dotted';
function App() {
  const [RR, setRR] = useState(() => ensureRoutineDefaults(ldR()));
  const [view, setView] = useState("home");
  const [sid, setSid] = useState(null);
  const [ci, setCi] = useState(0);
  const [tl, setTl] = useState(0);
  const [run, setRun] = useState(false);
  const [done, setDone] = useState([]);
  const [fSt, setFSt] = useState(null);
  const [rotSt, setRotSt] = useState(null);
  const [form, setForm] = useState({});
  const [tf, setTf] = useState({});
  const [es, setEs] = useState("");
  const [muted, setMuted] = useState(false);
  const cloudReady = useRef(false);
  useEffect(() => {
    fetch('/api/cloud?key=routines').then(r => r.json()).then(res => {
      const remote = res && res.data && (Array.isArray(res.data) ? res.data : res.data.routines);
      if (res && res.ok && Array.isArray(remote) && remote.length > 0) {
        setRR(remote);
        try {
          localStorage.setItem(LS, JSON.stringify(remote));
        } catch {}
      }
    }).catch(() => {}).finally(() => {
      cloudReady.current = true;
    });
  }, []);
  const iv = useRef(null),
    ciR = useRef(0),
    trR = useRef(0),
    rrR = useRef(RR),
    wlR = useRef(null);
  useEffect(() => {
    rrR.current = RR;
    svR(RR);
    if (cloudReady.current) syncR(RR);
  }, [RR]);
  useEffect(() => {
    const target = new URLSearchParams(location.search).get('routine');
    if (!target) return;
    const patterns = {
      morning: /morning|sáng/i,
      lunch: /lunch|trưa/i,
      night: /night|tối/i
    };
    const routine = RR.find(r => patterns[target]?.test(r.name || ''));
    if (routine) {
      setSid(routine.id);
      setRotSt(new Date());
      setView('routine');
    }
  }, []);
  const sel = RR.find(r => r.id === sid) || null;
  const stop = () => clearInterval(iv.current);
  const startT = (i, tasks) => {
    stop();
    const s = tasks[i].dur * 60;
    trR.current = s;
    setTl(s);
    setRun(true);
    const r = rrR.current.find(r => r.id === sid) || rrR.current[0];
    setMS(tasks[i], r.color, r.name);
    iv.current = setInterval(() => {
      trR.current -= 1;
      setTl(trR.current);
      if (trR.current <= 0) {
        stop();
        setRun(false);
        snd('complete', false);
        vibe('success');
        aN(i, rrR.current.find(r => r.id === sid)?.tasks || []);
      }
    }, 1000);
  };
  const resumeT = () => {
    stop();
    setRun(true);
    if (navigator.mediaSession) navigator.mediaSession.playbackState = 'playing';
    iv.current = setInterval(() => {
      trR.current -= 1;
      setTl(trR.current);
      if (trR.current <= 0) {
        stop();
        setRun(false);
        snd('complete', false);
        vibe('success');
        aN(ciR.current, rrR.current.find(r => r.id === sid)?.tasks || []);
      }
    }, 1000);
  };
  const jumpToTask = (targetIndex, tasks) => {
    stop();
    setCi(targetIndex);
    ciR.current = targetIndex;
    const s = tasks[targetIndex].dur * 60;
    trR.current = s;
    setTl(s);
    if (run) {
      startT(targetIndex, tasks);
    } else {
      vibe('medium');
    }
  };
  const aN = (i, tasks) => {
    const n = i + 1;
    if (n >= tasks.length) {
      setView('done');
      setCi(0);
      setDone([]);
      if (wlR.current) {
        wlR.current.release();
        wlR.current = null;
      }
      return;
    }
    setDone(d => [...d, i]);
    setCi(n);
    ciR.current = n;
    startT(n, tasks);
    snd('switch', muted);
  };
  const mN = (i, tasks) => {
    stop();
    setRun(false);
    snd('complete', muted);
    vibe('medium');
    if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
    const n = i + 1;
    if (n >= tasks.length) {
      setView('done');
      setCi(0);
      setDone([]);
      if (wlR.current) {
        wlR.current.release();
        wlR.current = null;
      }
      return;
    }
    setDone(d => [...d, i]);
    setCi(n);
    ciR.current = n;
    const s = tasks[n].dur * 60;
    trR.current = s;
    setTl(s);
  };
  const openF = async r => {
    setCi(0);
    ciR.current = 0;
    setDone([]);
    const now = new Date();
    setFSt(now);
    wlR.current = await reqWL();
    setView('focus');
    startT(0, r.tasks);
  };
  const togP = () => {
    if (run) {
      stop();
      setRun(false);
      snd('pause', muted);
      vibe('light');
      if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
    } else {
      snd('resume', muted);
      vibe('light');
      resumeT();
    }
  };
  const resetT = () => {
    stop();
    setRun(false);
    vibe('medium');
    const s = (sel?.tasks[ciR.current]?.dur || 1) * 60;
    trR.current = s;
    setTl(s);
    if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
  };
  const closeF = () => {
    stop();
    setRun(false);
    if (wlR.current) {
      wlR.current.release();
      wlR.current = null;
    }
    setView('routine');
    setCi(0);
    setDone([]);
  };
  const INP = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: 16,
    outline: 'none',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff'
  };
  const LBL = {
    fontSize: 12,
    color: 'var(--muted)',
    letterSpacing: .5,
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 8,
    fontWeight: 700
  };
  const fe = es ? EMOJIS.filter(e => e.includes(es)) : EMOJIS;
  const EP = ({
    value,
    onChange
  }) => React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, React.createElement("label", {
    style: LBL
  }, "Icon"), React.createElement("input", {
    value: es,
    onChange: e => setEs(e.target.value),
    placeholder: "Search...",
    style: {
      ...INP,
      marginBottom: 10,
      fontSize: 14
    }
  }), React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      maxHeight: 200,
      overflowY: 'auto'
    }
  }, fe.map(e => React.createElement("button", {
    key: e,
    onClick: () => onChange(e),
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      border: `2px solid ${value === e ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
      background: value === e ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
      fontSize: 20,
      cursor: 'pointer'
    }
  }, e))));
  const WP = ({
    title,
    back,
    children
  }) => React.createElement("div", {
    style: {
      background: 'var(--bg)',
      minHeight: '100vh',
      color: '#fff'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 430,
      margin: '0 auto',
      background: 'var(--surface)',
      minHeight: '100vh',
      borderLeft: '1px solid var(--line)',
      borderRight: '1px solid var(--line)'
    }
  }, React.createElement("div", {
    style: {
      padding: 'calc(max(20px, env(safe-area-inset-top)) + 14px) 20px 0',
      display: 'flex',
      alignItems: 'center'
    }
  }, React.createElement("button", {
    onClick: back,
    className: "subview-back"
  }, React.createElement(Icon, {
    name: "chevron-left",
    size: 19
  }), " Tr\u1EDF v\u1EC1")), React.createElement("div", {
    style: {
      padding: '14px 20px 0',
      fontSize: 28,
      fontWeight: 800,
      color: '#fff',
      letterSpacing: -.5,
      marginBottom: 24
    }
  }, title), React.createElement("div", {
    style: {
      padding: '0 20px 60px'
    }
  }, children)));
  if (view === 'home') return React.createElement("div", {
    className: "routine-shell",
    style: {
      background: 'var(--bg)',
      minHeight: '100vh'
    }
  }, React.createElement("div", {
    className: "routine-frame",
    style: {
      maxWidth: 430,
      margin: '0 auto',
      minHeight: '100vh',
      position: 'relative',
      borderLeft: '1px solid var(--line)',
      borderRight: '1px solid var(--line)'
    }
  }, React.createElement("a", {
    className: "hub-back",
    "data-gambit-home": "true",
    href: "../../index.html",
    "aria-label": "Tr\u1EDF v\u1EC1 trang ch\u1EE7"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, React.createElement("path", {
    d: "m15 18-6-6 6-6"
  })), React.createElement("span", null, "Tr\u1EDF v\u1EC1")), React.createElement("div", {
    style: {
      padding: 'calc(max(24px, env(safe-area-inset-top)) + 52px) 20px 8px'
    }
  }, React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      marginBottom: 6,
      fontWeight: 600
    }
  }, new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })), React.createElement("h1", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      color: 'var(--ink)',
      letterSpacing: -0.5
    }
  }, "Routines"), React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--muted)',
      marginTop: 6,
      lineHeight: 1.5
    }
  }, "Build a steady rhythm, one sequence at a time.")), React.createElement("div", {
    style: {
      padding: '12px 20px 80px'
    }
  }, RR.map(r => React.createElement("div", {
    className: "routine-card",
    key: r.id,
    onClick: () => {
      setSid(r.id);
      setRotSt(new Date());
      setView('routine');
      vibe('light');
    },
    style: {
      background: 'var(--surface)',
      borderRadius: 18,
      marginBottom: 12,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      gap: 14,
      border: '1px solid var(--line)'
    }
  }, React.createElement("div", {
    className: "routine-mark",
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      background: r.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      flexShrink: 0,
      boxShadow: `0 4px 14px ${r.color}44`
    }
  }, React.createElement(Icon, {
    name: routineIcon(r.name),
    size: 23
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--ink)',
      marginBottom: 3
    }
  }, r.name), React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, r.tasks.length, " tasks \xB7 ", tot(r.tasks), " min")), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: r.color,
      fontWeight: 700,
      background: r.color + '22',
      padding: '5px 10px',
      borderRadius: 8
    }
  }, tot(r.tasks), "m"), React.createElement(Icon, {
    name: "chevron-right",
    size: 18
  })))), React.createElement("button", {
    onClick: () => {
      setForm({
        name: '',
        emoji: '⭐',
        color: PAL[RR.length % PAL.length].c
      });
      setView('addRoutine');
    },
    style: {
      width: '100%',
      minHeight: 48,
      padding: '14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px dashed rgba(255,255,255,0.2)',
      borderRadius: 14,
      fontSize: 14,
      color: 'var(--muted)',
      cursor: 'pointer',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, React.createElement(Icon, {
    name: "plus",
    size: 18
  }), " New routine"))));
  if (view === 'routine' && sel) {
    const now = rotSt || new Date();
    const range = `${fT(now)} – ${fT(addM(now, tot(sel.tasks)))} (${tot(sel.tasks)}m)`;
    return React.createElement("div", {
      style: {
        background: 'var(--bg)',
        minHeight: '100vh',
        color: '#fff'
      }
    }, React.createElement("div", {
      style: {
        maxWidth: 430,
        margin: '0 auto',
        background: 'var(--surface)',
        minHeight: '100vh',
        position: 'relative',
        borderLeft: '1px solid var(--line)',
        borderRight: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        padding: 'calc(max(20px, env(safe-area-inset-top)) + 14px) 20px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, React.createElement("button", {
      onClick: () => setView('home'),
      className: "subview-back"
    }, React.createElement(Icon, {
      name: "chevron-left",
      size: 19
    }), " Tr\u1EDF v\u1EC1"), React.createElement("button", {
      onClick: () => {
        setForm({
          ...sel
        });
        setView('editRoutine');
      },
      "aria-label": "Routine options",
      title: "Routine options",
      className: "icon-button",
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--muted)',
        padding: 0
      }
    }, React.createElement(Icon, {
      name: "dots",
      size: 22
    }))), React.createElement("div", {
      style: {
        padding: '16px 20px 0'
      }
    }, React.createElement("h1", {
      style: {
        fontSize: 28,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: -.5,
        marginBottom: 4
      }
    }, sel.name), React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--muted)',
        marginBottom: 8
      }
    }, range)), React.createElement("div", {
      style: {
        paddingBottom: 120
      }
    }, sel.tasks.map((t, i) => React.createElement("div", {
      key: t.id,
      onClick: () => {
        setTf({
          ...t,
          routineId: sid
        });
        setView('editTask');
        vibe('light');
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid var(--line)',
        cursor: 'pointer',
        gap: 12,
        transition: 'background .15s'
      }
    }, React.createElement("div", {
      className: "task-mark",
      style: {
        width: 40,
        height: 40,
        borderRadius: 11,
        background: IBGS[i % IBGS.length],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 19,
        flexShrink: 0
      }
    }, React.createElement(Icon, {
      name: taskIcon(t.name),
      size: 19
    })), React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 16,
        fontWeight: 600,
        color: '#fff'
      }
    }, t.name), React.createElement("span", {
      style: {
        fontSize: 14,
        color: 'var(--muted)',
        marginRight: 12
      }
    }, t.dur, "m"), React.createElement("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.25)',
        flexShrink: 0
      }
    }))), React.createElement("button", {
      onClick: () => {
        setTf({
          name: '',
          emoji: '⭐',
          dur: 5,
          routineId: sid
        });
        setView('addTask');
      },
      style: {
        margin: '16px 20px 0',
        display: 'block',
        width: 'calc(100% - 40px)',
        padding: '13px',
        background: 'rgba(255,255,255,0.03)',
        border: `1.5px dashed ${sel.color}`,
        borderRadius: 14,
        fontSize: 15,
        color: sel.color,
        cursor: 'pointer',
        fontWeight: 600
      }
    }, React.createElement(Icon, {
      name: "plus",
      size: 17
    }), " Add task")), React.createElement("div", {
      style: {
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: 'rgba(14,20,32,.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--line)',
        padding: '14px 0 34px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 28
      }
    }, React.createElement("button", {
      onClick: () => {
        setForm({
          ...sel
        });
        setView('editRoutine');
      },
      className: "icon-button secondary-action",
      "aria-label": "Edit routine",
      title: "Edit routine",
      style: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid var(--line)',
        background: 'rgba(255,255,255,0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        color: '#fff'
      }
    }, React.createElement(Icon, {
      name: "pencil",
      size: 20
    })), React.createElement("button", {
      onClick: () => {
        openF(sel);
        vibe('medium');
      },
      className: "primary-action",
      "aria-label": "Start routine",
      title: "Start routine",
      style: {
        width: 64,
        height: 56,
        borderRadius: 16,
        background: sel.color || '#3b82f6',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 6px 20px ${sel.color}44`
      }
    }, React.createElement(Icon, {
      name: "player-play-filled",
      size: 24
    })), React.createElement("button", {
      onClick: () => {
        setTf({
          name: '',
          emoji: '⭐',
          dur: 5,
          routineId: sid
        });
        setView('addTask');
      },
      className: "icon-button accent-action",
      "aria-label": "Add task",
      title: "Add task",
      style: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 700,
        color: '#fff'
      }
    }, React.createElement(Icon, {
      name: "plus",
      size: 22
    })))));
  }
  if (view === 'focus' && sel) {
    const tasks = sel.tasks,
      task = tasks[ci] || {},
      nextT = tasks[ci + 1];
    const circ = 2 * Math.PI * 84;
    const pct = task.dur ? tl / (task.dur * 60) : 1;
    const nextStart = fSt && nextT ? fT(addM(fSt, tasks.slice(0, ci + 1).reduce((a, t) => a + t.dur, 0))) : null;
    const allEnds = fSt ? fT(addM(fSt, tot(tasks))) : null;
    return React.createElement("div", {
      style: {
        background: 'var(--bg)',
        minHeight: '100vh',
        color: '#fff'
      }
    }, React.createElement("div", {
      style: {
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--line)',
        borderRight: '1px solid var(--line)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'calc(max(20px, env(safe-area-inset-top)) + 14px) 20px 0'
      }
    }, React.createElement("button", {
      onClick: closeF,
      className: "subview-back"
    }, React.createElement(Icon, {
      name: "chevron-left",
      size: 19
    }), " Tr\u1EDF v\u1EC1"), React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--accent)',
        background: 'rgba(59,130,246,0.15)',
        padding: '6px 16px',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontWeight: 700,
        border: '1px solid rgba(59,130,246,0.3)'
      }
    }, React.createElement(Icon, {
      name: "hourglass",
      size: 14
    }), " Ho\u1EA1t \u0111\u1ED9ng ", ci + 1, "/", tasks.length), React.createElement("div", {
      style: {
        minWidth: 70
      }
    })), React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '24px 20px 0'
      }
    }, React.createElement("h2", {
      style: {
        fontSize: 26,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: -.5,
        lineHeight: 1.15
      }
    }, task.name)), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0 16px'
      }
    }, React.createElement("div", {
      onClick: resetT,
      style: {
        position: 'relative',
        width: 190,
        height: 190,
        cursor: 'pointer'
      }
    }, React.createElement("svg", {
      width: "190",
      height: "190",
      style: {
        position: 'absolute',
        inset: 0,
        transform: 'rotate(-90deg)'
      }
    }, React.createElement("circle", {
      cx: "95",
      cy: "95",
      r: "80",
      fill: "rgba(255,255,255,0.03)"
    }), React.createElement("circle", {
      cx: "95",
      cy: "95",
      r: "80",
      fill: "none",
      stroke: "rgba(255,255,255,0.08)",
      strokeWidth: "4"
    }), React.createElement("circle", {
      cx: "95",
      cy: "95",
      r: "80",
      fill: "none",
      stroke: sel.color || 'var(--accent)',
      strokeWidth: "5",
      strokeDasharray: 2 * Math.PI * 80,
      strokeDashoffset: 2 * Math.PI * 80 - 2 * Math.PI * 80 * pct,
      strokeLinecap: "round",
      style: {
        transition: 'stroke-dashoffset 1s linear'
      }
    })), React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        gap: 2
      }
    }, React.createElement("span", {
      style: {
        fontSize: 28
      }
    }, task.emoji), React.createElement("span", {
      style: {
        fontSize: 44,
        fontWeight: 800,
        letterSpacing: -2,
        color: '#fff',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.05
      }
    }, fmt(tl)), React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--muted)',
        marginTop: 3
      }
    }, task.dur, "m")))), React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        marginBottom: 16
      }
    }, React.createElement("button", {
      onClick: togP,
      title: run ? "Pause" : "Play",
      "aria-label": run ? "Pause timer" : "Start timer",
      style: {
        width: 52,
        height: 52,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.08)',
        fontSize: 20,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
      }
    }, React.createElement(Icon, {
      name: run ? "player-pause-filled" : "player-play-filled",
      size: 20
    })), React.createElement("button", {
      onClick: () => mN(ciR.current, tasks),
      title: "Complete task",
      "aria-label": "Complete task",
      style: {
        width: 66,
        height: 66,
        borderRadius: '50%',
        border: 'none',
        background: sel.color || 'var(--accent)',
        fontSize: 26,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: `0 6px 20px ${sel.color}44`
      }
    }, React.createElement(Icon, {
      name: "check",
      size: 28
    })), React.createElement("button", {
      onClick: () => mN(ciR.current, tasks),
      title: "Skip task",
      "aria-label": "Skip task",
      style: {
        width: 52,
        height: 52,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.08)',
        fontSize: 17,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
      }
    }, React.createElement(Icon, {
      name: "player-skip-forward-filled",
      size: 18
    }))), React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 13,
        color: 'var(--muted)',
        padding: '0 20px',
        marginBottom: 14
      }
    }, nextT ? React.createElement(React.Fragment, null, "Up next \xB7 ", React.createElement("span", {
      style: {
        color: '#fff',
        fontWeight: 600
      }
    }, nextT.name), nextStart && React.createElement(React.Fragment, null, " (", nextStart, ")")) : React.createElement("span", {
      style: {
        color: 'var(--green)',
        fontWeight: 600
      }
    }, "Last task \uD83C\uDF89")), React.createElement("div", {
      style: {
        margin: 'auto 20px 0',
        marginTop: 'auto'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--muted)',
        fontWeight: 700,
        letterSpacing: .5,
        textTransform: 'uppercase',
        marginBottom: 6,
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, React.createElement("span", null, "Thanh Ho\u1EA1t \u0110\u1ED9ng (B\u1EA5m chuy\u1EC3n)"), React.createElement("span", null, ci + 1, " / ", tasks.length)), React.createElement("div", {
      className: "bottom-step-bar"
    }, tasks.map((t, idx) => {
      const isCur = idx === ci,
        isD = done.includes(idx);
      return React.createElement("div", {
        key: t.id,
        onClick: () => jumpToTask(idx, tasks),
        className: `step-chip ${isCur ? 'active' : isD ? 'done-step' : ''}`
      }, React.createElement("span", null, t.emoji), React.createElement("div", null, t.name), React.createElement("small", null, t.dur, "m"));
    })), React.createElement("div", {
      style: {
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        border: '1px solid var(--line)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30
      }
    }, React.createElement("button", {
      onClick: () => setMuted(m => !m),
      title: muted ? "Unmute timer" : "Mute timer",
      "aria-label": muted ? "Unmute timer" : "Mute timer",
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 18,
        color: 'var(--muted)',
        padding: 0,
        display: 'flex',
        alignItems: 'center'
      }
    }, React.createElement(Icon, {
      name: muted ? 'volume-off' : 'bell',
      size: 19
    })), React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--muted)'
      }
    }, "All ends: ", React.createElement("span", {
      style: {
        color: '#fff',
        fontWeight: 600
      }
    }, allEnds)), React.createElement("button", {
      onClick: closeF,
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 13,
        color: 'var(--accent)',
        fontWeight: 700,
        padding: 0
      }
    }, "Exit")))));
  }
  if (view === 'done' && sel) return React.createElement("div", {
    style: {
      background: 'var(--bg)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 32,
      color: '#fff'
    }
  }, React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: '50%',
      background: sel.color + '22',
      border: `2px solid ${sel.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 42,
      marginBottom: 20,
      boxShadow: `0 0 32px ${sel.color}33`
    }
  }, sel.emoji), React.createElement("h2", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      color: '#fff',
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: -.5
    }
  }, "All done! \uD83C\uDF89"), React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--muted)',
      marginBottom: 44,
      textAlign: 'center'
    }
  }, sel.name, " \xB7 ", tot(sel.tasks), " minutes"), React.createElement("button", {
    onClick: () => setView('routine'),
    style: {
      padding: '16px 56px',
      background: sel.color || 'var(--accent)',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      fontSize: 16,
      fontWeight: 800,
      cursor: 'pointer',
      boxShadow: `0 6px 24px ${sel.color}44`
    }
  }, "Ho\xE0n th\xE0nh"));
  if (view === 'addRoutine' || view === 'editRoutine') {
    const isE = view === 'editRoutine';
    const sv = () => {
      if (!form.name?.trim()) return;
      vibe('medium');
      isE ? setRR(p => p.map(r => r.id === form.id ? {
        ...r,
        ...form
      } : r)) : setRR(p => [...p, {
        ...form,
        id: Date.now(),
        tasks: []
      }]);
      setView(isE ? 'routine' : 'home');
    };
    return React.createElement(WP, {
      title: isE ? 'Edit Routine' : 'New Routine',
      back: () => setView(isE ? 'routine' : 'home')
    }, React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, React.createElement("label", {
      style: LBL
    }, "Name"), React.createElement("input", {
      value: form.name || '',
      onChange: e => setForm(p => ({
        ...p,
        name: e.target.value
      })),
      placeholder: "e.g. Evening Wind-down",
      style: INP
    })), React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, React.createElement("label", {
      style: LBL
    }, "Color"), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, PAL.map(({
      c
    }) => React.createElement("button", {
      key: c,
      onClick: () => setForm(p => ({
        ...p,
        color: c
      })),
      style: {
        width: 42,
        height: 42,
        borderRadius: 12,
        background: c,
        border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`,
        cursor: 'pointer'
      }
    })))), React.createElement(EP, {
      value: form.emoji,
      onChange: e => setForm(p => ({
        ...p,
        emoji: e
      }))
    }), isE && React.createElement("button", {
      onClick: () => {
        setRR(p => p.filter(r => r.id !== form.id));
        setView('home');
      },
      style: {
        width: '100%',
        padding: '14px',
        background: 'rgba(239,68,68,0.15)',
        color: '#ef4444',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        marginBottom: 12
      }
    }, "Delete Routine"), React.createElement("button", {
      onClick: sv,
      style: {
        width: '100%',
        padding: '15px',
        background: 'var(--accent)',
        color: '#fff',
        border: 'none',
        borderRadius: 16,
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, isE ? 'Save Changes' : 'Create Routine'));
  }
  if (view === 'addTask' || view === 'editTask') {
    const isE = view === 'editTask';
    const sv = () => {
      if (!tf.name?.trim()) return;
      vibe('medium');
      isE ? setRR(p => p.map(r => r.id === tf.routineId ? {
        ...r,
        tasks: r.tasks.map(t => t.id === tf.id ? tf : t)
      } : r)) : setRR(p => p.map(r => r.id === tf.routineId ? {
        ...r,
        tasks: [...r.tasks, {
          ...tf,
          id: Date.now()
        }]
      } : r));
      setView('routine');
    };
    const dl = () => {
      vibe('medium');
      setRR(p => p.map(r => r.id === tf.routineId ? {
        ...r,
        tasks: r.tasks.filter(t => t.id !== tf.id)
      } : r));
      setView('routine');
    };
    return React.createElement(WP, {
      title: isE ? 'Edit Task' : 'New Task',
      back: () => setView('routine')
    }, React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, React.createElement("label", {
      style: LBL
    }, "Task name"), React.createElement("input", {
      value: tf.name || '',
      onChange: e => setTf(p => ({
        ...p,
        name: e.target.value
      })),
      placeholder: "e.g. Meditate",
      style: INP,
      onKeyDown: e => e.key === 'Enter' && sv()
    })), React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, React.createElement("label", {
      style: LBL
    }, "Duration (minutes)"), React.createElement("input", {
      type: "number",
      value: tf.dur || 5,
      onChange: e => setTf(p => ({
        ...p,
        dur: Number(e.target.value)
      })),
      min: 1,
      max: 120,
      style: INP
    })), React.createElement(EP, {
      value: tf.emoji,
      onChange: e => setTf(p => ({
        ...p,
        emoji: e
      }))
    }), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, isE && React.createElement("button", {
      onClick: dl,
      style: {
        flex: 1,
        padding: '14px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 14,
        cursor: 'pointer',
        color: '#ef4444',
        fontWeight: 700,
        fontSize: 15
      }
    }, "Delete"), React.createElement("button", {
      onClick: sv,
      style: {
        flex: 2,
        padding: '14px',
        background: 'var(--accent)',
        color: '#fff',
        border: 'none',
        borderRadius: 14,
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: 16
      }
    }, "Save")));
  }
  return null;
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
