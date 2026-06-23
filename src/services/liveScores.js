import { TEAM_ALIASES } from '../data/worldCup2026.js';

function normalizeName(name = '') {
  return name.replace(/\s+/g, ' ').trim();
}

function teamCode(name) {
  return TEAM_ALIASES[normalizeName(name)] || null;
}

function dateRange(start, end) {
  const out = [];
  const d = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (d <= last) {
    out.push(d.toISOString().slice(0, 10).replaceAll('-', ''));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

function parseEvent(event) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];
  if (competitors.length < 2) return null;

  const homeComp = competitors.find((item) => item.homeAway === 'home') || competitors[0];
  const awayComp = competitors.find((item) => item.homeAway === 'away') || competitors[1];
  const home = teamCode(homeComp.team?.displayName || homeComp.team?.shortDisplayName || homeComp.team?.name);
  const away = teamCode(awayComp.team?.displayName || awayComp.team?.shortDisplayName || awayComp.team?.name);
  if (!home || !away) return null;

  const completed = Boolean(event.status?.type?.completed);
  const state = event.status?.type?.state;
  const scoreKnown = homeComp.score !== undefined && awayComp.score !== undefined && (completed || state === 'in');

  return {
    home,
    away,
    date: event.date?.slice(0, 10),
    homeScore: scoreKnown ? Number(homeComp.score) : '',
    awayScore: scoreKnown ? Number(awayComp.score) : '',
    status: completed ? 'final' : state === 'in' ? 'live' : 'scheduled',
    source: 'live',
  };
}

export async function fetchLiveWorldCupMatches() {
  // Public ESPN scoreboard endpoint. If it changes or CORS blocks it, the app safely falls back to seeded data.
  const dates = dateRange('2026-06-11', '2026-06-27');
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?limit=200&dates=${dates.join(',')}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`scoreboard ${res.status}`);
  const json = await res.json();
  const events = json.events || [];
  return events.map(parseEvent).filter(Boolean);
}

export function mergeLiveMatches(seedMatches, liveMatches) {
  if (!liveMatches?.length) return seedMatches;
  return seedMatches.map((match) => {
    const live = liveMatches.find((item) =>
      (item.home === match.home && item.away === match.away) ||
      (item.home === match.away && item.away === match.home)
    );
    if (!live) return match;
    const reversed = live.home === match.away;
    return {
      ...match,
      date: live.date || match.date,
      homeScore: reversed ? live.awayScore : live.homeScore,
      awayScore: reversed ? live.homeScore : live.awayScore,
      status: live.status,
      source: 'live',
      official: live.status === 'final' || live.status === 'live',
    };
  });
}
