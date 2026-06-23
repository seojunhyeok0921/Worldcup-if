import { TEAMS } from '../data/worldCup2026.js';

function name(code) {
  const team = TEAMS[code];
  return `${team.flag} ${team.ko}`;
}

export default function MatchEditor({ matches, selectedGroup, onScore, onClearPredictions }) {
  return (
    <section className="card match-editor" aria-labelledby="match-editor-title">
      <div className="card-head">
        <div>
          <span className="kicker">GROUP {selectedGroup}</span>
          <h2 id="match-editor-title">경기 결과 / 예측 입력</h2>
        </div>
        <button className="text-button" onClick={onClearPredictions}>예측만 초기화</button>
      </div>

      <div className="match-list">
        {matches.map((match) => {
          const locked = match.status === 'final' || match.status === 'live';
          return (
            <article key={match.id} className={`match-row ${locked ? 'locked' : ''}`}>
              <div className="match-meta">
                <span>{match.date}</span>
                <em className={`status ${match.status}`}>{match.status === 'final' ? '공식 결과' : match.status === 'live' ? 'LIVE' : '예상 가능'}</em>
              </div>
              <div className="score-line">
                <strong>{name(match.home)}</strong>
                <input
                  aria-label={`${TEAMS[match.home].ko} 점수`}
                  type="number"
                  min="0"
                  max="99"
                  inputMode="numeric"
                  value={match.homeScore}
                  disabled={locked}
                  onChange={(event) => onScore(match.id, 'homeScore', event.target.value)}
                />
                <span>:</span>
                <input
                  aria-label={`${TEAMS[match.away].ko} 점수`}
                  type="number"
                  min="0"
                  max="99"
                  inputMode="numeric"
                  value={match.awayScore}
                  disabled={locked}
                  onChange={(event) => onScore(match.id, 'awayScore', event.target.value)}
                />
                <strong>{name(match.away)}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
