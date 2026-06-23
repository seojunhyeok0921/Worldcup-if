export const SEED_UPDATED_AT = '2026-06-23 13:15 KST';

export const OFFICIAL_RESULTS = {
  // Group A
  '66456904': { status: 'final', homeScore: 2, awayScore: 0, locked: true },
  '66456906': { status: 'final', homeScore: 2, awayScore: 1, locked: true },
  '66456910': { status: 'final', homeScore: 1, awayScore: 1, locked: true },
  '66456908': { status: 'final', homeScore: 1, awayScore: 0, locked: true },

  // Group B
  '66456916': { status: 'final', homeScore: 1, awayScore: 1, locked: true },
  '66456918': { status: 'final', homeScore: 1, awayScore: 1, locked: true },
  '66456922': { status: 'final', homeScore: 4, awayScore: 1, locked: true },
  '66456920': { status: 'final', homeScore: 6, awayScore: 0, locked: true },

  // Group C
  '66456928': { status: 'final', homeScore: 1, awayScore: 1, locked: true },
  '66456930': { status: 'final', homeScore: 0, awayScore: 1, locked: true },
  '66456934': { status: 'final', homeScore: 0, awayScore: 1, locked: true },
  '66456932': { status: 'final', homeScore: 3, awayScore: 0, locked: true },

  // Group D
  '66456940': { status: 'final', homeScore: 4, awayScore: 1, locked: true },
  '66456942': { status: 'final', homeScore: 2, awayScore: 0, locked: true },
  '66456944': { status: 'final', homeScore: 2, awayScore: 0, locked: true },
  '66456946': { status: 'final', homeScore: 0, awayScore: 1, locked: true },

  // Group E
  '66457070': { status: 'final', homeScore: 7, awayScore: 1, locked: true },
  '66457072': { status: 'final', homeScore: 1, awayScore: 0, locked: true },
  '66457074': { status: 'final', homeScore: 2, awayScore: 1, locked: true },
  '66457076': { status: 'final', homeScore: 0, awayScore: 0, locked: true },

  // Group F
  '66456968': { status: 'final', homeScore: 2, awayScore: 2, locked: true },
  '66456970': { status: 'final', homeScore: 5, awayScore: 1, locked: true },
  '66456972': { status: 'final', homeScore: 5, awayScore: 1, locked: true },
  '66456974': { status: 'final', homeScore: 0, awayScore: 4, locked: true },

  // Group G
  '66456982': { status: 'final', homeScore: 1, awayScore: 1, locked: true },
  '66456984': { status: 'final', homeScore: 2, awayScore: 2, locked: true },
  '66456986': { status: 'final', homeScore: 0, awayScore: 0, locked: true },
  '66456988': { status: 'final', homeScore: 1, awayScore: 3, locked: true },

  // Group H
  '66456994': { status: 'final', homeScore: 0, awayScore: 0, locked: true },
  '66456996': { status: 'final', homeScore: 1, awayScore: 1, locked: true },
  '66456998': { status: 'final', homeScore: 4, awayScore: 0, locked: true },
  '66457000': { status: 'final', homeScore: 2, awayScore: 2, locked: true },

  // Group I
  '66457006': { status: 'final', homeScore: 3, awayScore: 1, locked: true },
  '66457008': { status: 'final', homeScore: 1, awayScore: 4, locked: true },
  '66457010': { status: 'final', homeScore: 3, awayScore: 0, locked: true },
  '66457012': { status: 'final', homeScore: 3, awayScore: 2, locked: true },

  // Group J
  '66457018': { status: 'final', homeScore: 3, awayScore: 0, locked: true },
  '66457020': { status: 'final', homeScore: 3, awayScore: 1, locked: true },
  '66457022': { status: 'final', homeScore: 2, awayScore: 0, locked: true },

  // Live seed
  '66457024': { status: 'live', homeScore: 1, awayScore: 0, locked: true },
};

export function applyOfficialResults(matches) {
  return matches.map((match) => {
    const official = OFFICIAL_RESULTS[String(match.id)];

    if (!official) return match;

    return {
      ...match,
      ...official,
      userEdited: false,
    };
  });
}