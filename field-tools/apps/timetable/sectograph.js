import { $, esc, icon, read, write, toast, dialog } from "./common.js";
import {
  key,
  time,
  stamp,
  times,
  expand,
  unionMinutes,
  rollingRange,
  laneEvents,
  validEvent,
} from "./calendar-model.mjs";
import ICAL from "./vendor/ical.js";
import { googleEvents, notionEvents, routineEvents, mergeEvents } from './spider-calendar-sources.mjs';
import { queryAllNotionPages, NOTION_GAME_DATABASES } from '../../../../js/integrations/notion/NotionGameData.js';
const storage = "spider_sectograph_v1",
  now = new Date(),
  palette = ["#009a3d", "#f45a47", "#a159d5", "#54a9f1", "#f3b82b", "#ef7b30"];
const s = read(storage, {
  mode: 24,
  theme: "light",
  date: key(now),
  events: [],
});
s.settings ??= {
  minuteHand: true,
  scales: true,
  freeIntervals: true,
  rounded: 3,
  opacity: 0.9,
  noonTop: false,
  fullDay: false,
  hiddenCalendars: [],
};
for (const [k, v] of Object.entries({
  minuteHand: true,
  scales: true,
  freeIntervals: true,
  rounded: 3,
  opacity: 0.9,
  noonTop: false,
  fullDay: false,
  hiddenCalendars: [],
}))
  s.settings[k] ??= v;
s.events.forEach((e) => {
  e.endDate ??= e.date;
  e.repeat ??= "None";
  e.allDay ??= false;
});
let screen = "main",
  month = new Date(s.date + "T12:00:00"),
  scrub = null,
  draft = null,
  editing = null,
  importWarning = "";
let sources={google:[],notion:[],routine:[],calendars:[],googleConnected:false,status:'Đang đọc nguồn lịch…',loading:false,date:null,request:0};
let calendarConfig;try{calendarConfig=JSON.parse(localStorage.getItem('notionKingGoogleCalendar')||'{}');}catch{calendarConfig={};}
const save = () => write(storage, s),
  all = () =>
    mergeEvents(s.events,sources.google,sources.notion,sources.routine).filter((e) => !s.settings.hiddenCalendars.includes(e.category));
const fmt = (n) => {
  const m = Math.round(n / 60000);
  return (
    `${Math.floor(m / 60) ? Math.floor(m / 60) + "h " : ""}${m % 60 ? (m % 60) + "m" : ""}`.trim() ||
    "0m"
  );
};
function anchor() {
  if (scrub !== null) return scrub;
  const d = new Date(),
    chosen = new Date(s.date + "T00:00:00");
  chosen.setHours(d.getHours(), d.getMinutes(), d.getSeconds());
  return +chosen;
}
const point = (angle, r) => [
  240 + Math.sin(angle) * r,
  240 - Math.cos(angle) * r,
];
const angle = (t) => {
  const d = new Date(t),
    minutes = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
  return (
    (minutes / (s.mode * 60)) * Math.PI * 2 +
    (s.settings.noonTop && s.mode === 24 ? Math.PI : 0)
  );
};
function arc(a, b, inner, outer, round = s.settings.rounded) {
  return globalThis.d3
    .arc()
    .innerRadius(inner)
    .outerRadius(outer)
    .cornerRadius(round)({ startAngle: a, endAngle: b });
}
function visibleEvents(from, to) {
  let events = all();
  if (draft && validEvent(draft)) {
    events = events.filter((e) => e.id !== editing);
    events = [...events, { ...draft, id: "draft-preview" }];
  }
  return expand(events, from, to);
}
function clock() {
  const t = anchor(),
    [from, to] = rollingRange(t, s.mode, s.settings.fullDay),
    span = s.mode * 3600000,
    events = laneEvents(visibleEvents(from, to)),
    a = angle(t);
  let content = '<circle cx="240" cy="240" r="203" fill="var(--surface)"/>';
  if (s.settings.scales) {
    const count = s.mode >= 12 ? 60 : 48;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2,
        p1 = point(theta, 203),
        p2 = point(theta, i % 5 === 0 ? 211 : 207);
      content += `<path class="tick ${i % 5 === 0 ? "major" : ""}" d="M ${p1} L ${p2}"/>`;
    }
  }
  const labelCount = s.mode === 24 ? 24 : s.mode === 12 ? 12 : s.mode * 2;
  for (let i = 0; i < labelCount; i++) {
    const theta = (i / labelCount) * Math.PI * 2,
      p = point(theta, 184);
    let label =
      s.mode === 24 ? i : s.mode === 12 ? i || 12 : (i * s.mode) / labelCount;
    if (s.settings.noonTop && s.mode === 24) label = (i + 12) % 24;
    content += `<text class="hour-label" x="${p[0]}" y="${p[1]}">${label}</text>`;
  }
  if (s.settings.freeIntervals) {
    let end = from;
    const occupied = events
      .filter((e) => !e.allDay)
      .map((e) => ({ a: Math.max(from, e.a), b: Math.min(to, e.b) }))
      .filter((e) => e.b > e.a)
      .sort((a, b) => a.a - b.a);
    for (const e of [...occupied, { a: to, b: to }]) {
      if (e.a - end > 20 * 60000) {
        const mid = end + (e.a - end) / 2,
          p = point(angle(mid), 219);
        content += `<text class="free-label" x="${p[0]}" y="${p[1]}">${fmt(e.a - end)}</text>`;
      }
      end = Math.max(end, e.b);
    }
  }
  for (const e of events) {
    const start = Math.max(from, e.a),
      end = Math.min(to, e.b);
    if (end < start) continue;
    const startAngle = angle(start),
      endAngle = startAngle + ((end - start) / span) * Math.PI * 2,
      color = /^#[\da-f]{6}$/i.test(e.color) ? e.color : palette[0],
      outer = e.allDay ? 200 : Math.max(95, 176 - Math.min(e.lane, 3) * 24),
      inner = e.allDay ? 192 : 63;
    if (end === start) {
      const p1 = point(startAngle, 66),
        p2 = point(startAngle, 176);
      content += `<path d="M ${p1} L ${p2}" stroke="${color}" stroke-width="3" data-event="${e.id}" tabindex="0" role="button" aria-label="${esc(e.name)}"/>`;
      continue;
    }
    content += `<path class="sector" transform="translate(240 240)" d="${arc(startAngle, endAngle, inner, outer)}" fill="${color}" opacity="${s.settings.opacity}" data-event="${e.id}" tabindex="0" role="button" aria-label="Edit ${esc(e.name)} ${e.start} to ${e.end}"><title>${esc(e.name)} ${e.date} ${e.start}–${e.end}</title></path>`;
    if (!e.allDay && endAngle - startAngle > 0.16) {
      const theta = (startAngle + endAngle) / 2,
        p = point(theta, (outer + inner) / 2),
        deg = ((theta * 180) / Math.PI) % 360,
        rotation = deg > 180 ? deg + 90 : deg - 90;
      content += `<text class="sector-text" transform="translate(${p}) rotate(${rotation})">${esc(e.name.length > 25 ? e.name.slice(0, 23) + "…" : e.name)}</text>`;
    }
  }
  const pBoundary1 = point(angle(from), 64),
    pBoundary2 = point(angle(from), 205);
  content += `<path class="boundary" d="M ${pBoundary1} L ${pBoundary2}"/>`;
  if (s.settings.minuteHand) {
    const theta = (new Date(t).getMinutes() / 60) * Math.PI * 2,
      p = point(theta, 172);
    content += `<path class="minute-hand" d="M 240 240 L ${p}"/>`;
  }
  const hand = point(a, 199),
    handInner = point(a, 61);
  content += `<path class="hour-hand" d="M ${handInner} L ${hand}"/><path class="hand-hit" d="M ${handInner} L ${hand}" data-hand="true" role="slider" tabindex="0" aria-label="Drag hour hand to preview time" aria-valuemin="0" aria-valuemax="1440" aria-valuenow="${new Date(t).getHours() * 60 + new Date(t).getMinutes()}"/><circle cx="${hand[0]}" cy="${hand[1]}" r="4" fill="#fa4a59"/><circle cx="240" cy="240" r="54" fill="var(--accent)"/><text x="240" y="237" fill="white" text-anchor="middle" font-size="27" font-weight="300">${new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</text><text x="240" y="256" fill="white" text-anchor="middle" font-size="12">${new Date(t).toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}</text>`;
  return `<svg class="sg-clock" viewBox="0 0 480 480" aria-label="${s.mode} hour circular calendar">${content}</svg>`;
}
function toolbar(title = "Sectograph") {
  return `<header class="sg-toolbar"><button data-action="${screen === "main" ? "drawer" : "back"}" aria-label="${screen === "main" ? "Open navigation menu" : "Back"}">${icon(screen === "main" ? "tasks" : "left")}</button><h1>${title}</h1><button data-action="calendars" aria-label="My calendars">${icon("calendar")}</button><button data-action="reset" aria-label="Return to current time">${icon("reset")}</button><button data-action="more" aria-label="More options">⋮</button></header>`;
}
function dayRange() {
  const a = stamp(s.date),
    d = new Date(a);
  d.setDate(d.getDate() + 1);
  return [a, +d];
}
function agenda() {
  const [a, b] = dayRange(),
    events = expand(all(), a, b).filter((e) => e.a < b && e.b >= a);
  return `<div class="sg-date-bar"><button class="round-button" data-action="prev-date" aria-label="Previous day">${icon("left")}</button><div class="sg-date-center"><input id="selected-date" aria-label="Selected date" type="date" value="${s.date}"><small>${new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" })}</small></div><button class="round-button" data-action="next-date" aria-label="Next day">${icon("right")}</button></div><div class="sg-list">${events.map((e) => `<article class="sg-event ${e.b < Date.now() ? "past" : ""}" style="--color:${/^#[\da-f]{6}$/i.test(e.color) ? e.color : palette[0]}"><button class="initial" data-event="${e.id}" aria-label="Edit ${esc(e.name)}">${esc(e.name[0]?.toUpperCase() || "E")}</button><button class="event-copy" data-event="${e.id}"><strong>${esc(e.name)}</strong><small>${e.allDay ? "All day" : new Date(e.a).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " – " + new Date(e.b).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}${e.repeat !== "None" ? " · ↻" : ""}</small></button><button class="event-more" data-event="${e.id}" aria-label="Edit event options">⋮</button><span class="duration-label">${e.allDay ? "" : fmt(e.b - e.a)}</span></article>`).join("") || '<p class="sg-empty">No events.<br>Tap + to create one.</p>'}<p class="sg-info">${esc(sources.status)}<br>Notion · Google Calendar · Lịch riêng trên thiết bị</p></div>`;
}
function main() {
  const d = new Date(s.date + "T12:00:00");
  return (
    toolbar() +
    `<main class="sg-main"><section class="sg-dial-pane"><div class="sg-caption">${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}<small>${d.toLocaleDateString("en-US", { weekday: "long" })}</small></div><button class="round-button sg-month-button" data-action="month" aria-label="Open month calendar">${icon("calendar")}</button><div class="sg-clock-wrap" id="clock-wrap">${clock()}<button class="sg-scrub-left" data-action="scrub-prev" aria-label="Earlier time">${icon("left")}</button><button class="sg-scrub-right" data-action="scrub-next" aria-label="Later time">${icon("right")}</button></div><div class="sg-dial-controls"><div class="sg-range"><button class="sg-hours" data-action="hours" aria-label="Choose hour range">${s.mode}</button>${s.mode === 24 ? `<button class="sg-hours" data-action="full-day" aria-label="Toggle full calendar day" style="background:${s.settings.fullDay ? "var(--accent)" : "#ddd"}">▣</button>` : ""}</div><span class="sg-preview-label" id="preview-label">${scrub !== null ? "Preview time · reset to return" : ""}</span><button class="round-button sg-reset" data-action="reset" aria-label="Return to now">${icon("reset")}</button></div></section><section class="sg-agenda-pane"><div class="sg-day-grip"></div>${agenda()}</section></main><button class="round-button sg-fab" data-action="add" aria-label="Add event">${icon("plus")}</button>${draft ? editor() : ""}`
  );
}
function editor() {
  return `<section class="sg-editor" aria-label="Event editor"><form id="event-form"><div class="sg-editor-head"><button class="editor-close" type="button" data-action="close-editor" aria-label="Close editor">${icon("close")}</button><button type="button" data-action="delete-event" ${editing ? "" : "disabled"}>Delete</button><button type="submit">Save</button></div><input class="sg-editor-name" name="name" aria-label="Event name" placeholder="Event name" required maxlength="120" value="${esc(draft.name)}"><div class="editor-field"><span>${icon("sun")}</span><label>All day<input name="allDay" type="checkbox" ${draft.allDay ? "checked" : ""} style="margin-left:auto"></label></div><div class="editor-field"><span>${icon("timer")}</span><div class="date-time"><input name="date" aria-label="Start date" type="date" required value="${draft.date}"><input name="start" aria-label="Start time" type="time" required value="${draft.start}" ${draft.allDay ? "hidden" : ""}></div></div><div class="editor-field"><span>↳</span><div class="date-time"><input name="endDate" aria-label="End date" type="date" required value="${draft.endDate}"><input name="end" aria-label="End time" type="time" required value="${draft.end}" ${draft.allDay ? "hidden" : ""}></div></div><div class="editor-field"><label>Duration<input name="duration" aria-label="Duration in minutes" type="range" min="5" max="720" step="5" value="${Math.max(5, (times(draft).end - times(draft).start) / 60000)}"></label></div><div class="editor-field"><span>↻</span><select name="repeat" aria-label="Repeat event">${["None", "Daily", "Weekly", "Monthly"].map((r) => `<option ${draft.repeat === r ? "selected" : ""}>${r}</option>`).join("")}</select><input name="until" type="date" aria-label="Repeat until" value="${draft.until || ""}" style="margin-left:auto"></div><div class="editor-field"><span>●</span><input name="color" aria-label="Event color" type="color" value="${draft.color}"><select name="category" aria-label="Calendar">${["Personal", "Work", "Study", "Imported"].map((c) => `<option ${draft.category === c ? "selected" : ""}>${c}</option>`).join("")}</select></div><div class="editor-field"><span>♧</span><select name="reminder" aria-label="Reminder">${[
    ["None", "No reminder"],
    ["5", "5 minutes before"],
    ["15", "15 minutes before"],
    ["30", "30 minutes before"],
  ]
    .map(
      ([v, l]) =>
        `<option value="${v}" ${String(draft.reminder) === v ? "selected" : ""}>${l}</option>`,
    )
    .join(
      "",
    )}</select></div><p class="editor-error" id="editor-error" role="alert"></p><p class="editor-note">${editing ? "Edits apply to this series. " : ""}Live preview is shown on the clock when it lies in the displayed range. Reminder selection is saved locally; notification delivery is not connected.</p></form></section>`;
}
function begin(e) {
  if(e?.readOnly){
    dialog(esc(e.name),`<p class="note">Nguồn: ${esc(e.source)}. Sự kiện này được đọc từ lịch gốc. Sửa tại nguồn rồi làm mới để đồng bộ.</p>${sourceLink(e.sourceUrl,'Mở sự kiện gốc ↗')}`,()=>{});
    $('#editor [type="submit"]').textContent='Đóng';return;
  }
  editing = e?.id || null;
  const a = new Date(anchor()),
    b = new Date(+a + 3600000);
  draft = e
    ? structuredClone(e)
    : {
        id: crypto.randomUUID(),
        name: "",
        date: key(a),
        endDate: key(b),
        start: time(a),
        end: time(b),
        allDay: false,
        repeat: "None",
        category: "Personal",
        color: palette[0],
        reminder: "None",
      };
  render();
}
function readDraft(form) {
  const f = new FormData(form);
  return {
    ...draft,
    name: f.get("name"),
    date: f.get("date"),
    endDate: f.get("endDate"),
    start: f.get("start"),
    end: f.get("end"),
    allDay: f.has("allDay"),
    repeat: f.get("repeat"),
    until: f.get("until"),
    category: f.get("category"),
    color: f.get("color"),
    reminder: f.get("reminder"),
  };
}
function refreshClock() {
  if ($("#clock-wrap")) {
    const wrap = $("#clock-wrap");
    wrap.querySelector("svg").outerHTML = clock();
    bindClock();
    if ($("#preview-label"))
      $("#preview-label").textContent =
        scrub !== null ? "Preview time · reset to return" : "";
  }
}
function bindClock() {
  document.querySelectorAll(".sg-clock [data-event]").forEach((el) => {
    const open = () => {
      const e = all().find((e) => e.id === el.dataset.event);
      if (e) begin(e);
    };
    el.onclick = open;
    el.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    };
  });
  const hand = $("[data-hand]");
  if (!hand) return;
  hand.onkeydown = (e) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      scrub = anchor() + (e.key === "ArrowLeft" ? -1 : 1) * 15 * 60000;
      refreshClock();
    }
  };
  hand.onpointerdown = (e) => {
    e.preventDefault();
    const svg = hand.closest("svg"),
      rect = svg.getBoundingClientRect(),
      base = anchor(),
      baseAngle = angle(base),
      cx = rect.left + rect.width / 2,
      cy = rect.top + rect.height / 2;
    const move = (ev) => {
      let theta = Math.atan2(ev.clientX - cx, cy - ev.clientY),
        delta = theta - baseAngle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      scrub =
        base +
        Math.round(((delta / (Math.PI * 2)) * s.mode * 60) / 5) * 5 * 60000;
      refreshClock();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };
}
function drawer() {
  const d = $("#nav-drawer");
  d.innerHTML = `<div class="sg-drawer-header">Sectograph<small>Visual time planner</small></div>${[
    ["calendars", "My calendars", "calendar"],
    ["settings", "Settings", "settings"],
    ["widgets", "Widget themes", "grid"],
    ["about", "FAQ", "info"],
    ["about", "Support the app", "star"],
    ["about", "About the app", "info"],
  ]
    .map(([a, l, i]) => `<button data-action="${a}">${icon(i)}${l}</button>`)
    .join(
      "",
    )}<div class="sg-drawer-footer">Spider Time<br><small>Notion · Google Calendar</small></div>`;
  d.querySelectorAll("[data-action]").forEach(
    (b) =>
      (b.onclick = () => {
        d.close();
        action(b.dataset.action);
      }),
  );
  d.showModal();
}
function settings() {
  return (
    toolbar("Settings") +
    `<main class="sg-settings"><div class="sg-setting-title">GENERAL</div><label class="sg-setting"><span>Appearance</span><select id="theme-select"><option value="light" ${s.theme === "light" ? "selected" : ""}>Light</option><option value="dark" ${s.theme === "dark" ? "selected" : ""}>Dark</option></select></label><div class="sg-setting-title">CLOCK</div>${[
      ["minuteHand", "Minute hand", "Show the minute hand"],
      ["scales", "Clock scale", "Graduations around the dial"],
      ["noonTop", "Noon at the top", "Rotate the 24-hour dial"],
      [
        "freeIntervals",
        "Free time intervals",
        "Label gaps between scheduled events",
      ],
      [
        "fullDay",
        "Full calendar day",
        "Use midnight-to-midnight in 24-hour mode",
      ],
    ]
      .map(
        ([id, l, d]) =>
          `<label class="sg-setting"><span>${l}<small>${d}</small></span><input data-setting="${id}" type="checkbox" ${s.settings[id] ? "checked" : ""}></label>`,
      )
      .join(
        "",
      )}<div class="sg-setting-title">EVENT SECTORS</div><label class="sg-setting"><span>Rounded corners</span><input data-setting="rounded" type="range" min="0" max="15" step="1" value="${s.settings.rounded}"></label><label class="sg-setting"><span>Sector opacity</span><input data-setting="opacity" type="range" min="0.2" max="1" step="0.05" value="${s.settings.opacity}"></label><div class="sg-setting-title">DATA</div><div class="sg-actions"><button class="primary" data-action="calendars">My calendars</button><button class="secondary" data-action="export-json">Export backup</button><button class="secondary" data-action="about">About Spider Time</button></div></main>`
  );
}
function monthPage() {
  const y = month.getFullYear(),
    m = month.getMonth(),
    offset = (new Date(y, m, 1).getDay() + 6) % 7,
    n = new Date(y, m + 1, 0).getDate();
  return (
    toolbar("Calendar") +
    `<main class="sg-month"><div class="sg-month-header"><button class="round-button" data-action="prev-month" aria-label="Previous month">${icon("left")}</button><h2>${month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2><button class="round-button" data-action="next-month" aria-label="Next month">${icon("right")}</button></div><div class="sg-month-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<small>${d}</small>`).join("")}${"<span></span>".repeat(offset)}${Array.from(
      { length: n },
      (_, i) => {
        const k = key(new Date(y, m, i + 1)),
          from = stamp(k),
          to = from + 86400000,
          events = expand(all(), from, to);
        return `<button class="sg-day-cell ${k === s.date ? "selected" : ""}" data-date="${k}" aria-label="${k}, ${events.length} events"><svg viewBox="-45 -45 90 90"><circle r="39" fill="var(--surface)" stroke="var(--line)"/>${events
          .filter((e) => !e.allDay)
          .map(
            (e) =>
              `<path d="${arc(((Math.max(from, e.a) - from) / 86400000) * Math.PI * 2, ((Math.min(to, e.b) - from) / 86400000) * Math.PI * 2, 12, 39, 0)}" fill="${/^#[\da-f]{6}$/i.test(e.color) ? e.color : palette[0]}"/>`,
          )
          .join("")}</svg><span class="day-number">${i + 1}</span></button>`;
      },
    ).join(
      "",
    )}</div><div class="sg-actions"><button class="primary" data-action="main">Clock</button><button class="secondary" data-action="timeline">Day timeline</button></div>${agenda()}</main>`
  );
}
function timeline() {
  const [a, b] = dayRange(),
    events = laneEvents(expand(all(), a, b).filter((e) => !e.allDay)),
    count = Math.max(1, ...events.map((e) => e.lane + 1));
  return (
    toolbar("Day timeline") +
    `<main class="sg-settings">${agenda().split('<div class="sg-list">')[0]}<div class="sg-timeline">${Array.from({ length: 24 }, (_, h) => `<span class="sg-time-label" style="top:${h * 60}px">${String(h).padStart(2, "0")}:00</span>`).join("")}${events.map((e) => `<button class="sg-time-event" data-event="${e.id}" style="top:${Math.max(0, (e.a - a) / 60000)}px;height:${Math.max(15, (Math.min(b, e.b) - Math.max(a, e.a)) / 60000)}px;left:${(e.lane / count) * 100}%;width:${100 / count}%;background:${/^#[\da-f]{6}$/i.test(e.color) ? e.color : palette[0]}">${esc(e.name)}</button>`).join("")}</div></main>${draft ? editor() : ""}`
  );
}
function calendars() {
  return (
    toolbar("My calendars") +
    `<main class="sg-settings">${sourceControls()}<div class="sg-setting-title">LOCAL CALENDARS</div>${["Personal", "Work", "Study", "Imported"].map((c) => `<label class="sg-setting"><span>${c}<small>${s.events.filter((e) => e.category === c).length} records</small></span><input type="checkbox" data-calendar="${c}" ${!s.settings.hiddenCalendars.includes(c) ? "checked" : ""}></label>`).join("")}<div class="sg-setting-title">IMPORT / EXPORT</div><label class="sg-setting"><span>Import iCalendar (.ics)<small>Parsed with ical.js. UTC, floating times and embedded VTIMEZONE supported. Unsupported cases are reported.</small></span><input type="file" id="ics-file" accept=".ics,text/calendar" style="max-width:150px"></label><div class="sg-actions"><button class="primary" data-action="export-ics">Export ICS</button><button class="secondary" data-action="export-json">Export backup</button></div>${importWarning ? `<p class="sg-info">${esc(importWarning)}</p>` : ""}<div class="sg-setting-title">ACCOUNT CALENDARS</div><p class="sg-info">Tệp ICS được nhập vào lịch riêng trên thiết bị. Dùng các nguồn phía trên để đọc dữ liệu Notion và Google trực tiếp.</p></main>`
  );
}
function about() {
 return toolbar("Spider Time") + `<main class="sg-settings"><div class="sg-setting-title">MỘT NGÀY TRÊN MẶT ĐỒNG HỒ</div><p class="sg-info">Timetable theo phong cách Sectograph. Đọc lịch từ Google Calendar, nhiệm vụ và Routine trong Notion của bạn. Dùng My calendars để kết nối và làm mới.</p><p class="sg-info">Dấu + tạo sự kiện riêng trên thiết bị. Sự kiện có nguồn được sửa tại Google hoặc Notion. Chưa gửi thông báo nền hay đồng bộ sự kiện riêng lên Notion.</p><div class="sg-actions"><button class="primary" data-action="calendars">Lịch của tôi</button><a class="secondary" href="./vendor/THIRD_PARTY.md" target="_blank">Thư viện và giấy phép</a></div></main>`;
}
function render() {
  if(sources.date!==s.date)void loadSources();
  document.body.classList.toggle("sg-dark", s.theme === "dark");
  document.body.innerHTML =
    {
      main,
      settings,
      month: monthPage,
      timeline,
      calendars,
      about,
      widgets: about,
    }[screen]() +
    `<dialog id="editor"></dialog><dialog class="sg-drawer" id="nav-drawer"></dialog>`;
  bind();
}
function sourceLink(url,label){try{const u=new URL(url);return u.protocol==='https:'?`<a class="primary" href="${esc(u.href)}" target="_blank" rel="noopener">${label}</a>`:'';}catch{return '';}}
function sourceControls(){return `<div class="sg-setting-title">SPIDER · LỊCH ĐANG KẾT NỐI</div><p class="sg-info" role="status">${esc(sources.status)}</p><div class="sg-actions"><button class="primary" data-action="source-refresh" ${sources.loading?'disabled':''}>${sources.loading?'Đang tải…':'Đồng bộ lịch'}</button><button class="secondary" data-action="google-connect">${sources.googleConnected?'Kết nối lại Google':'Kết nối Google'}</button><button class="secondary" data-action="notion-connect">Kết nối Notion hiện có</button></div>${sources.calendars.map(c=>`<label class="sg-setting"><span>${esc(c.summaryOverride||c.summary||c.id)}</span><input type="checkbox" data-google-calendar="${esc(c.id)}" ${selectedGoogleIds().includes(c.id)?'checked':''}></label>`).join('')}<p class="sg-info">Notion: Master Calendar, Quest và Routine. Google: ngày đang chọn và hai ngày liền kề. Lịch tháng chỉ phản ánh những sự kiện Google đã tải. Các sự kiện có nguồn được sửa tại nguồn; dấu + tạo sự kiện riêng trên thiết bị.</p>`;}
function selectedGoogleIds(){return Array.isArray(calendarConfig.calendarIds)?calendarConfig.calendarIds:sources.calendars.map(c=>c.id);}
async function jsonGet(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
async function loadSources(){
  const request=++sources.request,day=s.date;sources.date=day;sources.loading=true;sources.status='Đang đọc Notion và Google Calendar…';
  const offset=n=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return key(d);};
  const jobs=await Promise.allSettled([
    (async()=>{const status=await jsonGet('/api/google/status');if(!status.connected)return {connected:false,calendars:[],events:[]};const calendars=(await jsonGet('/api/google/calendars')).items||[];const ids=Array.isArray(calendarConfig.calendarIds)?calendarConfig.calendarIds:calendars.map(c=>c.id);const days=await Promise.all([-1,0,1].map(async n=>ids.length?jsonGet('/api/google/events?'+new URLSearchParams({date:offset(n),calendarIds:ids.join(',')})):{calendars:[]}));return {connected:true,calendars,events:mergeEvents(...days.map(d=>googleEvents(d.calendars||[])))};})(),
    (async()=>{const status=await jsonGet('/api/notion-session');if(!status.connected)throw Error('Notion chưa mở phiên');const data=await Promise.all([queryAllNotionPages(NOTION_GAME_DATABASES.masterCalendar),queryAllNotionPages(NOTION_GAME_DATABASES.activeQuests)]);return notionEvents(data.flat());})(),
    (async()=>routineEvents((await jsonGet('/api/routine')).routines||[],day))()
  ]);
  if(request!==sources.request)return;
  let messages=[];jobs.forEach((r,i)=>{if(r.status==='rejected'){messages.push(['Google chưa tải được','Notion chưa tải được','Routine chưa tải được'][i]);return;}if(i===0){sources.googleConnected=r.value.connected;sources.calendars=r.value.calendars;sources.google=r.value.events;messages.push(r.value.connected?`Google: ${sources.google.length} sự kiện`:'Google chưa kết nối');}else {sources[i===1?'notion':'routine']=r.value;messages.push(`${i===1?'Notion':'Routine'}: ${r.value.length}`);}});
  sources.status=messages.join(' · ');sources.loading=false;render();
  parent.postMessage({type:'spider:notion-status',state:jobs[1].status==='fulfilled'?'connected':'locked'},location.origin);
}
async function connectNotion(){
  try{const status=await jsonGet('/api/notion-session');if(status.connected){toast('Đang dùng kết nối Notion hiện có.');return loadSources();}}catch{}
  dialog('Kết nối Notion hiện có','<p class="note">Dùng mật khẩu Gambit để mở phiên Notion chung của Spider.</p><label>Mật khẩu Gambit<input name="accessCode" type="password" autocomplete="current-password" required></label>',(form,d)=>{const b=d.querySelector('[type="submit"]');b.disabled=true;fetch('/api/notion-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessCode:form.get('accessCode')})}).then(async r=>{if(!r.ok)throw Error('Chưa mở được phiên. Kiểm tra mật khẩu Gambit.');d.close();await loadSources();}).catch(e=>{d.querySelector('.error').textContent=e.message;}).finally(()=>{b.disabled=false;});return false;});
}
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='spider:open-app-settings')action('settings');if(e.data?.type==='spider:notion-connect')connectNotion();if(e.data?.type==='spider:session-changed')loadSources();});
let lastSourceRead=Date.now();
function refreshVisibleSources(){if(document.visibilityState==='visible'&&!sources.loading&&!draft&&!$('#editor')?.open&&Date.now()-lastSourceRead>30000){lastSourceRead=Date.now();loadSources();}}
window.addEventListener('focus',refreshVisibleSources);document.addEventListener('visibilitychange',refreshVisibleSources);
const each = (q, fn) => document.querySelectorAll(q).forEach(fn);
function bind() {
  each('[data-google-calendar]',b=>b.onchange=()=>{calendarConfig.calendarIds=[...document.querySelectorAll('[data-google-calendar]:checked')].map(c=>c.dataset.googleCalendar);localStorage.setItem('notionKingGoogleCalendar',JSON.stringify(calendarConfig));loadSources();});
  each("[data-action]", (b) => (b.onclick = () => action(b.dataset.action)));
  each("[data-event]", (b) => {
    if (!b.closest("svg"))
      b.onclick = () => begin(all().find((e) => e.id === b.dataset.event));
  });
  bindClock();
  each(
    "[data-date]",
    (b) =>
      (b.onclick = () => {
        s.date = b.dataset.date;
        scrub = null;
        screen = "main";
        save();
        render();
      }),
  );
  $("#selected-date")?.addEventListener("change", (e) => {
    if (e.target.value) {
      s.date = e.target.value;
      scrub = null;
      save();
      render();
    }
  });
  $("#theme-select")?.addEventListener("change", (e) => {
    s.theme = e.target.value;
    save();
    render();
  });
  each(
    "[data-setting]",
    (b) =>
      (b.onchange = () => {
        s.settings[b.dataset.setting] =
          b.type === "checkbox" ? b.checked : Number(b.value);
        save();
        render();
      }),
  );
  each(
    "[data-calendar]",
    (b) =>
      (b.onchange = () => {
        s.settings.hiddenCalendars = s.settings.hiddenCalendars.filter(
          (c) => c !== b.dataset.calendar,
        );
        if (!b.checked) s.settings.hiddenCalendars.push(b.dataset.calendar);
        save();
      }),
  );
  $("#ics-file")?.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await importIcs(f);
  });
  const form = $("#event-form");
  if (form) {
    form.oninput = (e) => {
      draft = readDraft(form);
      if (e.target.name === "repeat") draft.rrule = "";
      if (e.target.name === "duration") {
        const start = times(draft).start,
          end = new Date(start + Number(e.target.value) * 60000);
        draft.endDate = key(end);
        draft.end = time(end);
        form.elements.endDate.value = draft.endDate;
        form.elements.end.value = draft.end;
      }
      if (e.target.name === "allDay") {
        form.elements.start.hidden = draft.allDay;
        form.elements.end.hidden = draft.allDay;
      }
      refreshClock();
    };
    form.onsubmit = (e) => {
      e.preventDefault();
      draft = readDraft(form);
      if (!validEvent(draft)) {
        $("#editor-error").textContent =
          "Enter a name and an end date/time at or after the start, within one year.";
        return;
      }
      if (draft.until && draft.until < draft.date) {
        $("#editor-error").textContent =
          "Repeat end must be on or after the start date.";
        return;
      }
      const data = { ...draft, name: draft.name.trim() };
      if (editing) {
        const index = s.events.findIndex((e) => e.id === editing);
        s.events[index] = data;
      } else s.events.push(data);
      s.date = data.date;
      save();
      draft = null;
      editing = null;
      render();
      toast("Event saved.");
    };
  }
}
function download(data, name, type) {
  const url = URL.createObjectURL(new Blob([data], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function importIcs(file) {
  if (file.size > 2 * 1024 * 1024)
    return toast("Use an ICS file smaller than 2 MB.");
  try {
    const root = new ICAL.Component(ICAL.parse(await file.text()));
    for (const tz of root.getAllSubcomponents("vtimezone"))
      ICAL.TimezoneService.register(
        new ICAL.Timezone({ component: tz }),
        tz.getFirstPropertyValue("tzid"),
      );
    const imported = [];
    let unsupported = 0;
    for (const component of root.getAllSubcomponents("vevent").slice(0, 500)) {
      try {
        const event = new ICAL.Event(component),
          a = event.startDate,
          b = event.endDate;
        const tzid = component
          .getFirstProperty("dtstart")
          ?.getParameter("tzid");
        if (tzid && !ICAL.TimezoneService.has(tzid)) {
          unsupported++;
          continue;
        }
        const rule = component.getFirstPropertyValue("rrule")?.toString();
        if (
          rule &&
          (!/FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY)(;|$)/.test(rule) ||
            /BYSECOND|BYMINUTE|BYHOUR/.test(rule))
        ) {
          unsupported++;
          continue;
        }
        if (
          component.getAllProperties("exdate").length ||
          component.getFirstProperty("recurrence-id")
        ) {
          unsupported++;
          continue;
        }
        const ad = a.toJSDate(),
          bd = b.toJSDate();
        if (a.isDate) bd.setDate(bd.getDate() - 1);
        const item = {
          id: crypto.randomUUID(),
          name: event.summary || "Imported event",
          date: key(ad),
          endDate: key(bd),
          start: time(ad),
          end: time(bd),
          allDay: a.isDate,
          category: "Imported",
          color: palette[3],
          repeat: "None",
          rrule: rule || "",
          sourceUid: event.uid,
        };
        if (
          validEvent(item) &&
          !s.events.some((e) => e.sourceUid && e.sourceUid === item.sourceUid)
        )
          imported.push(item);
        else unsupported++;
      } catch {
        unsupported++;
      }
    }
    if (!imported.length) {
      importWarning = `No new events imported. ${unsupported} unsupported or duplicate records.`;
      render();
      return;
    }
    dialog(
      "Import calendar",
      `<p class="note">Add ${imported.length} events to your local calendar? ${unsupported ? unsupported + " unsupported or duplicate records will be skipped." : ""}</p>`,
      () => {
        s.events.push(...imported);
        save();
        importWarning = `Imported ${imported.length} events. ${unsupported} skipped. No live account sync established.`;
        render();
        toast("Calendar imported.");
      },
    );
  } catch {
    toast("The file could not be read as an iCalendar calendar.");
  }
}
function exportIcs() {
  const clean = (t) =>
      String(t)
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;"),
    icalTime = (d) =>
      new Date(d)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sectograph Web Study//EN",
  ];
  for (const e of s.events) {
    const { start, end } = times(e);
    lines.push(
      "BEGIN:VEVENT",
      "UID:" + clean(e.sourceUid || e.id),
      "DTSTAMP:" + icalTime(Date.now()),
      "DTSTART:" + icalTime(start),
      "DTEND:" + icalTime(end),
      "SUMMARY:" + clean(e.name),
    );
    if (e.rrule) lines.push("RRULE:" + e.rrule);
    else if (e.repeat && e.repeat !== "None")
      lines.push(
        "RRULE:FREQ=" +
          { Daily: "DAILY", Weekly: "WEEKLY", Monthly: "MONTHLY" }[e.repeat] +
          (e.until ? ";UNTIL=" + e.until.replaceAll("-", "") + "T235959Z" : ""),
      );
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  download(lines.join("\r\n"), "sectograph-web.ics", "text/calendar");
}
function action(a) {
  if(a==='source-refresh')return loadSources();
  if(a==='google-connect'){window.open('/api/google/start','_blank','noopener');return;}
  if(a==='notion-connect')return connectNotion();
  if (a === "drawer") return drawer();
  if (a === "back" || a === "main") {
    screen = "main";
    return render();
  }
  if (
    ["settings", "month", "timeline", "calendars", "about", "widgets"].includes(
      a,
    )
  ) {
    screen = a;
    month = new Date(s.date + "T12:00:00");
    draft = null;
    return render();
  }
  if (a === "add") return begin();
  if (a === "close-editor") {
    draft = null;
    editing = null;
    return render();
  }
  if (a === "delete-event") {
    if (!editing) return;
    const old = structuredClone(s.events.find((e) => e.id === editing));
    s.events = s.events.filter((e) => e.id !== editing);
    draft = null;
    editing = null;
    save();
    render();
    dialog(
      "Event deleted",
      '<p class="note">The event was removed locally. Choose Save to undo, or Cancel to keep it deleted.</p>',
      () => {
        s.events.push(old);
        save();
        render();
      },
    );
    return;
  }
  if (a === "reset") {
    scrub = null;
    s.date = key(new Date());
    save();
    return render();
  }
  if (a === "scrub-prev" || a === "scrub-next") {
    scrub = anchor() + (a === "scrub-prev" ? -1 : 1) * 60 * 60000;
    return refreshClock();
  }
  if (a === "prev-date" || a === "next-date") {
    const d = new Date(s.date + "T12:00:00");
    d.setDate(d.getDate() + (a === "prev-date" ? -1 : 1));
    s.date = key(d);
    scrub = null;
    save();
    return render();
  }
  if (a === "prev-month" || a === "next-month") {
    month = new Date(
      month.getFullYear(),
      month.getMonth() + (a === "prev-month" ? -1 : 1),
      1,
    );
    return render();
  }
  if (a === "hours") {
    dialog(
      "Hour range",
      `<div class="sg-hour-options">${[1, 2, 4, 6, 12, 24].map((n) => `<button type="button" data-hours="${n}" class="${s.mode === n ? "active" : ""}">${n}</button>`).join("")}</div>`,
      () => {},
    );
    each(
      "[data-hours]",
      (b) =>
        (b.onclick = () => {
          s.mode = Number(b.dataset.hours);
          save();
          $("#editor").close();
          render();
        }),
    );
    return;
  }
  if (a === "full-day") {
    s.settings.fullDay = !s.settings.fullDay;
    save();
    return render();
  }
  if (a === "more") {
    dialog(
      "View",
      `<div class="sg-actions"><button type="button" data-option="month" class="secondary">Month</button><button type="button" data-option="timeline" class="secondary">Day timeline</button><button type="button" data-option="settings" class="secondary">Settings</button></div>`,
      () => {},
    );
    each(
      "[data-option]",
      (b) =>
        (b.onclick = () => {
          $("#editor").close();
          action(b.dataset.option);
        }),
    );
    return;
  }
  if (a === "export-json")
    return download(
      JSON.stringify(s, null, 2),
      "sectograph-web-backup.json",
      "application/json",
    );
  if (a === "export-ics") return exportIcs();
}
setInterval(() => {
  if (
    screen === "main" &&
    !draft &&
    scrub === null &&
    !document.activeElement?.matches("[data-hand]")
  )
    refreshClock();
}, 30000);
render();
