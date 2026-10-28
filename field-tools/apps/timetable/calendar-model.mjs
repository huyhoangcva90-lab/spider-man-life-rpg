export const key = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const time = (d) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
export const stamp = (d, t = "00:00") =>
  new Date(d + "T" + t + ":00").getTime();
export function times(e) {
  const allDayEnd = new Date(stamp(e.endDate || e.date));
  allDayEnd.setDate(allDayEnd.getDate() + 1);
  const start = stamp(e.date, e.allDay ? "00:00" : e.start),
    end = e.allDay
      ? allDayEnd.getTime()
      : stamp(e.endDate || e.date, e.end);
  return { start, end };
}
export function expand(events, from, to) {
  const result = [];
  for (const e of events) {
    if (e.hidden) continue;
    const base = times(e),
      duration = base.end - base.start;
    if (!Number.isFinite(duration) || duration < 0) continue;
    if (e.rrule && globalThis.rrule) {
      try {
        const options = globalThis.rrule.RRule.parseString(e.rrule);
        options.dtstart = new Date(base.start);
        const rule = new globalThis.rrule.RRule(options),
          dates = rule.between(new Date(from - duration), new Date(to), true);
        for (const d of dates.slice(0, 500)) {
          if (!e.exceptions?.includes(key(d)))
            result.push({
              ...e,
              a: d.getTime(),
              b: d.getTime() + duration,
              occurrence: key(d),
            });
        }
        continue;
      } catch {}
    }
    if (e.repeat && e.repeat !== "None") {
      const cursor = new Date(Math.max(base.start, from - duration));
      cursor.setHours(0, 0, 0, 0);
      let loops = 0;
      while (cursor.getTime() <= to && loops++ < 800) {
        const k = key(cursor),
          baseDay = new Date(e.date + "T12:00:00"),
          match =
            e.repeat === "Daily" ||
            (e.repeat === "Weekly" && cursor.getDay() === baseDay.getDay()) ||
            (e.repeat === "Monthly" && cursor.getDate() === baseDay.getDate());
        if (
          match &&
          k >= e.date &&
          (!e.until || k <= e.until) &&
          !e.exceptions?.includes(k)
        ) {
          const a = stamp(k, e.allDay ? "00:00" : e.start);
          if (a + duration >= from && a <= to)
            result.push({ ...e, a, b: a + duration, occurrence: k });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    } else if (base.end >= from && base.start <= to)
      result.push({ ...e, a: base.start, b: base.end, occurrence: e.date });
  }
  return result.sort((a, b) => a.a - b.a);
}
export function unionMinutes(events, from, to) {
  let total = 0,
    end = from;
  for (const e of events
    .filter((e) => !e.allDay)
    .map((e) => ({ a: Math.max(from, e.a), b: Math.min(to, e.b) }))
    .filter((e) => e.b > e.a)
    .sort((a, b) => a.a - b.a)) {
    total += Math.max(0, e.b - Math.max(end, e.a));
    end = Math.max(end, e.b);
  }
  return Math.round(total / 60000);
}
export function rollingRange(anchor, hours, fullDay = false) {
  if (hours === 24 && fullDay) {
    const d = new Date(anchor);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setDate(end.getDate() + 1);
    return [d.getTime(), end.getTime()];
  }
  const past = (hours / 6) * 3600000;
  return [anchor - past, anchor + (hours * 3600000 - past)];
}
export function laneEvents(events) {
  const ends = [];
  return events.map((e) => {
    let lane = ends.findIndex((end) => end <= e.a);
    if (lane < 0) lane = ends.length;
    ends[lane] = e.b;
    return { ...e, lane };
  });
}
export function validEvent(e) {
  const { start, end } = times(e);
  return (
    e.name.trim() &&
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    end >= start &&
    end - start <= 366 * 86400000
  );
}
