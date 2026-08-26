import { format, parseISO } from 'date-fns';

export function asDate(value: string | Date) {
  return typeof value === 'string' ? parseISO(value) : value;
}

export function formatMatchDate(value: string | Date) {
  return format(asDate(value), 'EEE d MMM, HH:mm');
}

export function formatShortDate(value: string | Date) {
  return format(asDate(value), 'EEE d MMM');
}

export function formatTime(value: string | Date) {
  return format(asDate(value), 'HH:mm');
}

export function playerName(player: {
  firstName?: string | null;
  lastName?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}) {
  const first = player.firstName ?? player.first_name ?? '';
  const last = player.lastName ?? player.last_name ?? '';
  return `${first} ${last}`.trim();
}
