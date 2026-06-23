import { GROUPS } from '../data/worldCup2026.js';

export function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null;

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * 이 경기를 순위표 계산에 넣을지 판단하는 함수
 *
 * 계산되는 경우:
 * - status: final / finished / complete / completed / live / predicted / official
 * - locked: true
 * - isOfficial: true
 * - official: true
 * - userEdited: true
 *
 * 계산 안 되는 경우:
 * - 점수가 비어 있음
 * - status: scheduled / postponed / cancelled
 */
export function shouldCountMatch(match) {
  const hs = toNumber(match.homeScore);
  const as = toNumber(match.awayScore);

  // 점수 둘 중 하나라도 비어 있으면 계산 안 함
  if (hs === null || as === null) return false;

  const status = String(match.status || '').toLowerCase();

  // 사용자가 예정 경기 점수를 직접 입력한 경우 계산
  if (match.userEdited === true) return true;
  if (match.isPredicted === true) return true;

  // 공식 결과 / 라이브 결과 계산
  if (match.locked === true) return true;
  if (match.isOfficial === true) return true;
  if (match.official === true) return true;

  if (status === 'final') return true;
  if (status === 'finished') return true;
  if (status === 'complete') return true;
  if (status === 'completed') return true;
  if (status === 'live') return true;
  if (status === 'predicted') return true;
  if (status === 'official') return true;

  // 예정/취소/연기 경기는 기본 계산 제외
  if (status === 'scheduled') return false;
  if (status === 'postponed') return false;
  if (status === 'cancelled') return false;

  // status가 아예 없는 옛 데이터 호환용
  // 점수가 있으면 계산
  if (!match.status) return true;

  return false;
}

export function isScored(match) {
  return shouldCountMatch(match);
}

export function buildMatchesByGroup(matches) {
  return matches.reduce((acc, match) => {
    acc[match.group] ||= [];
    acc[match.group].push(match);
    return acc;
  }, {});
}

export function createEmptyRow(team) {
  return {
    team,
    played: 0,
    win: 0,
    draw: 0,
    lose: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    pts: 0,
  };
}

export function calculateGroupStandings(group, matches = []) {
  const teams = GROUPS[group] || [];

  const base = teams.map((team) => createEmptyRow(team));
  const byTeam = Object.fromEntries(base.map((row) => [row.team, row]));

  matches.forEach((match) => {
    if (!shouldCountMatch(match)) return;

    const hs = toNumber(match.homeScore);
    const as = toNumber(match.awayScore);

    const home = byTeam[match.home];
    const away = byTeam[match.away];

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;

    home.gf += hs;
    home.ga += as;

    away.gf += as;
    away.ga += hs;

    if (hs > as) {
      home.win += 1;
      home.pts += 3;

      away.lose += 1;
    } else if (hs < as) {
      away.win += 1;
      away.pts += 3;

      home.lose += 1;
    } else {
      home.draw += 1;
      away.draw += 1;

      home.pts += 1;
      away.pts += 1;
    }
  });

  base.forEach((row) => {
    row.gd = row.gf - row.ga;
  });

  return base.sort((a, b) => {
    return (
      b.pts - a.pts ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      a.team.localeCompare(b.team)
    );
  });
}

export function calculateAllStandings(matches = []) {
  const byGroup = buildMatchesByGroup(matches);

  return Object.fromEntries(
    Object.keys(GROUPS).map((group) => [
      group,
      calculateGroupStandings(group, byGroup[group] || []),
    ])
  );
}

export function calculateThirdPlaceRanking(standingsByGroup) {
  return Object.entries(standingsByGroup)
    .map(([group, rows]) => {
      const third = rows[2];

      if (!third) {
        return {
          group,
          team: '',
          played: 0,
          win: 0,
          draw: 0,
          lose: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          pts: 0,
        };
      }

      return {
        group,
        ...third,
      };
    })
    .sort((a, b) => {
      return (
        b.pts - a.pts ||
        b.gd - a.gd ||
        b.gf - a.gf ||
        a.team.localeCompare(b.team)
      );
    });
}

export function statusFor(group, team, standingsByGroup, thirdRanking) {
  const table = standingsByGroup[group] || [];
  const rank = table.findIndex((row) => row.team === team) + 1;

  if (rank <= 0) {
    return {
      rank: 0,
      tone: 'red',
      label: '정보 없음',
    };
  }

  const thirdIndex = thirdRanking.findIndex(
    (row) => row.group === group && row.team === team
  );

  if (rank <= 2) {
    return {
      rank,
      tone: 'green',
      label: '32강 직행권',
    };
  }

  if (rank === 3 && thirdIndex >= 0 && thirdIndex < 8) {
    return {
      rank,
      tone: 'yellow',
      label: `3위 랭킹 ${thirdIndex + 1}위`,
    };
  }

  if (rank === 3) {
    return {
      rank,
      tone: 'orange',
      label: '3위 경쟁권',
    };
  }

  return {
    rank,
    tone: 'red',
    label: '위험권',
  };
}

export function koreaScenario(standingsByGroup, thirdRanking) {
  const groupA = standingsByGroup.A || [];
  const row = groupA.find((item) => item.team === 'KOR');

  if (!row) {
    return '대한민국 데이터를 찾을 수 없습니다. 경기 데이터와 조 편성을 확인해주세요.';
  }

  const status = statusFor('A', 'KOR', standingsByGroup, thirdRanking);

  const thirdIndex = thirdRanking.findIndex(
    (item) => item.group === 'A' && item.team === 'KOR'
  );

  if (status.rank <= 2) {
    return `대한민국은 현재 A조 ${status.rank}위, 승점 ${row.pts}점입니다. 이 예측 기준이면 32강 직행권입니다.`;
  }

  if (status.rank === 3 && thirdIndex >= 0 && thirdIndex < 8) {
    return `대한민국은 현재 A조 3위, 전체 3위 랭킹 ${thirdIndex + 1}위입니다. 상위 8팀 안이라 32강 진출권입니다.`;
  }

  if (status.rank === 3) {
    return `대한민국은 현재 A조 3위입니다. 3위 팀 상위 8팀 안에 들어야 하므로 승점과 득실차가 중요합니다.`;
  }

  return `대한민국은 현재 A조 ${status.rank}위입니다. 남은 경기 예측을 바꿔 승점과 득실차를 끌어올려야 합니다.`;
}