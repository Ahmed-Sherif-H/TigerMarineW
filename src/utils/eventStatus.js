/**
 * Event status helpers — derive upcoming / ongoing / past from dates
 * so filters stay correct even if admin status was left as "upcoming".
 */

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Compute status from start/end dates.
 * - before start → upcoming
 * - on/after start and on/before end (or no end) → ongoing
 * - after end → past
 */
export function getEventStatus(event, now = new Date()) {
  const start = toDate(event?.startDate);
  if (!start) {
    const manual = String(event?.status || '').toLowerCase();
    if (manual === 'ongoing' || manual === 'past' || manual === 'upcoming') return manual;
    return 'upcoming';
  }

  const end = toDate(event?.endDate) || start;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (today < startDay) return 'upcoming';
  if (today > endDay) return 'past';
  return 'ongoing';
}

/** Attach computedStatus without mutating the original event */
export function withComputedEventStatus(event, now = new Date()) {
  return {
    ...event,
    computedStatus: getEventStatus(event, now),
  };
}

export function normalizeEventsList(eventsData) {
  if (Array.isArray(eventsData)) return eventsData;
  if (Array.isArray(eventsData?.data)) return eventsData.data;
  return [];
}

export function filterEventsByStatus(events, statusFilter, now = new Date()) {
  const list = normalizeEventsList(events).map((e) => withComputedEventStatus(e, now));
  if (!statusFilter || statusFilter === 'all') return list;
  return list.filter((e) => e.computedStatus === statusFilter);
}

/** Home: show only non-past events */
export function getActiveEvents(events, now = new Date()) {
  return filterEventsByStatus(events, 'all', now)
    .filter((e) => e.computedStatus === 'upcoming' || e.computedStatus === 'ongoing')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}
