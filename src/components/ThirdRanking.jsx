import { TEAMS } from '../data/worldCup2026.js';

export default function ThirdRanking({ rows }) {
  return (
    <section className="card third-card" aria-labelledby="third-title">
      <div className="card-head">
        <div>
          <span className="kicker">BEST 3RD</span>
          <h2 id="third-title">3위 팀 랭킹</h2>
        </div>
      </div>
      <div className="third-list">
        {rows.map((row, index) => (
          <article key={`${row.group}-${row.team}`} className={index < 8 ? 'in' : 'out'}>
            <span>{index + 1}</span>
            <strong>{row.group}조 {TEAMS[row.team].flag} {TEAMS[row.team].ko}</strong>
            <em>{row.pts}점 · {row.gd > 0 ? `+${row.gd}` : row.gd}</em>
            <b>{index < 8 ? 'IN' : 'OUT'}</b>
          </article>
        ))}
      </div>
    </section>
  );
}
