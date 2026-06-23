export function encodeShare(matches) {
  try {
    const payload = matches.map(({ id, homeScore, awayScore, status }) => [id, homeScore, awayScore, status]);
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  } catch {
    return '';
  }
}

export function applyShare(matches, code) {
  if (!code) return matches;
  try {
    const rows = JSON.parse(decodeURIComponent(escape(atob(code))));
    const map = Object.fromEntries(rows.map(([id, homeScore, awayScore, status]) => [id, { homeScore, awayScore, status }]));
    return matches.map((match) => map[match.id] ? { ...match, ...map[match.id], userEdited: true } : match);
  } catch {
    return matches;
  }
}

export function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve) => {
    window.prompt('아래 링크를 복사해줘', text);
    resolve();
  });
}
