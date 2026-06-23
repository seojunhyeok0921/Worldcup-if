import { TEAMS } from '../data/worldCup2026.js';
import { statusFor } from '../lib/standings.js';

export default function StandingsTable({ group, rows, standingsByGroup, thirdRanking }) {
  return (
    <section className="card table-card" aria-labelledby="standings-title">
      <div className="card-head">
        <div>
          <span className="kicker">STANDINGS</span>
          <h2 id="standings-title">{group}조 순위</h2>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>순위</th>
              <th>팀</th>
              <th>승점</th>
              <th>경기</th>
              <th>득실</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const status = statusFor(group, row.team, standingsByGroup, thirdRanking);
              return (
                <tr key={row.team}>
                  <td>{index + 1}</td>
                  <td className="team-cell">{TEAMS[row.team].flag} {TEAMS[row.team].ko}</td>
                  <td><strong>{row.pts}</strong></td>
                  <td>{row.played}</td>
                  <td className={row.gd >= 0 ? 'pos' : 'neg'}>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td><span className={`badge ${status.tone}`}>{status.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="fine-print">간단 정렬 기준: 승점 → 득실차 → 다득점. 실제 FIFA 세부 동률 규정에는 상대전적·페어플레이 등이 추가됩니다.</p>
    </section>
  );
}
