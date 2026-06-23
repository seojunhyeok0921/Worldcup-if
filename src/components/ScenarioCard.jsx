import { TEAMS } from '../data/worldCup2026.js';

export default function ScenarioCard({ koreaRow, status, scenario, onShare }) {
  return (
    <section className={`scenario-card ${status.tone}`} id="scenario">
      <span className="kicker">KOREA SCENARIO</span>
      <h2>{TEAMS.KOR.flag} 대한민국 32강 경우의 수</h2>
      <div className="scenario-grid">
        <div>
          <small>현재 예측 기준</small>
          <strong>{status.label}</strong>
        </div>
        <div>
          <small>승점</small>
          <strong>{koreaRow.pts}점</strong>
        </div>
        <div>
          <small>득실</small>
          <strong>{koreaRow.gd > 0 ? `+${koreaRow.gd}` : koreaRow.gd}</strong>
        </div>
      </div>
      <p>{scenario}</p>
      <button className="primary" onClick={onShare}>내 예측 링크 복사</button>
    </section>
  );
}
