import { useEffect, useMemo, useState } from 'react';
import './styles.css';

import { MATCHES, TEAMS } from './data/worldCup2026.js';
import { applyOfficialResults, SEED_UPDATED_AT } from './data/officialResults.js';

import { applyShare, copyText, encodeShare } from './lib/share.js';
import {
  calculateAllStandings,
  calculateThirdPlaceRanking,
  buildMatchesByGroup,
  koreaScenario,
  statusFor,
} from './lib/standings.js';

import GroupTabs from './components/GroupTabs.jsx';
import MatchEditor from './components/MatchEditor.jsx';
import ScenarioCard from './components/ScenarioCard.jsx';
import StandingsTable from './components/StandingsTable.jsx';
import ThirdRanking from './components/ThirdRanking.jsx';

const STORAGE_KEY = 'worldcup-if-final-matches-v2';

function loadInitialMatches() {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get('s');

  if (shared) {
    const sharedMatches = applyShare(MATCHES, shared);
    return applyOfficialResults(sharedMatches);
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const savedMatches = JSON.parse(saved);
      return applyOfficialResults(savedMatches);
    }

    return applyOfficialResults(MATCHES);
  } catch {
    return applyOfficialResults(MATCHES);
  }
}

function cleanScore(value) {
  if (value === '') return '';

  const number = Number(value);

  if (!Number.isFinite(number)) return '';

  return Math.max(0, Math.min(99, Math.trunc(number)));
}

function App() {
  const [matches, setMatches] = useState(loadInitialMatches);
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  }, [matches]);

  const matchesByGroup = useMemo(() => buildMatchesByGroup(matches), [matches]);

  const standingsByGroup = useMemo(
    () => calculateAllStandings(matches),
    [matches]
  );

  const thirdRanking = useMemo(
    () => calculateThirdPlaceRanking(standingsByGroup),
    [standingsByGroup]
  );

  const selectedMatches = matchesByGroup[selectedGroup] || [];
  const selectedRows = standingsByGroup[selectedGroup] || [];

  const koreaRow = standingsByGroup.A.find((row) => row.team === 'KOR');
  const koreaStatus = statusFor('A', 'KOR', standingsByGroup, thirdRanking);
  const scenario = koreaScenario(standingsByGroup, thirdRanking);

  const shareCode = useMemo(() => encodeShare(matches), [matches]);
  const shareUrl = `${window.location.origin}${window.location.pathname}?s=${shareCode}`;

  const updateScore = (matchId, side, value) => {
    setMatches((prev) =>
      prev.map((match) => {
        if (match.id !== matchId) return match;

        if (match.status === 'final' || match.status === 'live') {
          return match;
        }

        return {
          ...match,
          [side]: cleanScore(value),
          userEdited: true,
        };
      })
    );
  };

  const clearPredictions = () => {
    setMatches((prev) =>
      prev.map((match) => {
        if (match.status === 'final' || match.status === 'live') {
          return match;
        }

        return {
          ...match,
          homeScore: '',
          awayScore: '',
          userEdited: false,
        };
      })
    );
  };

  const resetAll = () => {
    const resetMatches = applyOfficialResults(MATCHES);

    setMatches(resetMatches);
    localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const copyShare = async () => {
    await copyText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="app-shell">
      <div className="grain" />

      <header className="nav">
        <a className="brand" href="#top" aria-label="경우의수 홈">
          <span className="brand-mark">월드컵</span>
          <span>경우의수</span>
        </a>

        <nav className="nav-links" aria-label="페이지 이동">
          <a href="#predictor">예측</a>
          <a href="#third">3위컷</a>
        </nav>

        <button
          className="mini-cta"
          onClick={() =>
            document
              .querySelector('#predictor')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          시작하기
        </button>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-copy">
            <span className="eyebrow">
              NO LOGIN · REAL DATA SEED · SHARE LINK
            </span>

            <h1>
              월드컵 경우의 수
              <br />
              계산하기
            </h1>

            <p>
              로그인 없이 실제 조 구성과 경기 결과를 기반으로 32강 진출 가능성을
              계산합니다. 남은 경기는 직접 예측하고 링크로 공유할 수 있습니다.
            </p>

            <div className="hero-actions">
              <button
                className="primary"
                onClick={() =>
                  document
                    .querySelector('#predictor')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                한국 경우의 수 보기
              </button>
            </div>

            <p className="sync idle">
              공식 결과 seed 기준: {SEED_UPDATED_AT}
            </p>
          </div>

          <div
            className={`phone-preview ${koreaStatus.tone}`}
            aria-label="대한민국 경우의 수 요약"
          >
            <div className="phone-top">
              <strong>경우의수</strong>
              <span>GROUP A</span>
            </div>

            <div className="phone-score">
              <small>{TEAMS.KOR.flag} 대한민국</small>
              <b>{koreaStatus.label}</b>
              <em>
                {koreaRow.pts}점 · 득실{' '}
                {koreaRow.gd > 0 ? `+${koreaRow.gd}` : koreaRow.gd}
              </em>
            </div>

            <div className="mini-table">
              {standingsByGroup.A.map((row, index) => (
                <div
                  key={row.team}
                  className={row.team === 'KOR' ? 'focus' : ''}
                >
                  <span>{index + 1}</span>
                  <strong>
                    {TEAMS[row.team].flag} {TEAMS[row.team].ko}
                  </strong>
                  <em>{row.pts}점</em>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad" id="predictor">
          <div className="section-head">
            <span className="eyebrow">PREDICTOR</span>
            <h2>점수 입력 대시보드</h2>
            <p>
              공식 결과는 잠겨 있고, 아직 끝나지 않은 경기만 예측값을 넣을 수
              있습니다. 예측값은 브라우저에 저장되고 공유 링크에도 들어갑니다.
            </p>
          </div>

          <GroupTabs selected={selectedGroup} onSelect={setSelectedGroup} />

          <div className="dashboard-grid">
            <MatchEditor
              matches={selectedMatches}
              selectedGroup={selectedGroup}
              onScore={updateScore}
              onClearPredictions={clearPredictions}
            />

            <StandingsTable
              group={selectedGroup}
              rows={selectedRows}
              standingsByGroup={standingsByGroup}
              thirdRanking={thirdRanking}
            />
          </div>
        </section>

        <section className="section-pad scenario-section">
          <ScenarioCard
            koreaRow={koreaRow}
            status={koreaStatus}
            scenario={scenario}
            onShare={copyShare}
          />

          <div className="share-panel" id="share">
            <span className="kicker">SHARE</span>
            <h2>로그인 없이 공유</h2>
            <p>
              현재 점수 입력 상태가 URL에 저장됩니다. 링크를 누르면 같은 예측
              화면이 열립니다.
            </p>

            <button className="primary" onClick={copyShare}>
              {copied ? '복사 완료!' : '예측 링크 복사'}
            </button>

            <button className="ghost" onClick={resetAll}>
              전체 초기화
            </button>
          </div>
        </section>

        <section className="section-pad" id="third">
          <div className="section-head compact-head">
            <span className="eyebrow">ROUND OF 32 CUT</span>
            <h2>3위 상위 8팀 컷라인</h2>
            <p>
              각 조 1·2위와 3위 팀 중 상위 8팀이 32강에 진출합니다.
            </p>
          </div>

          <ThirdRanking rows={thirdRanking} />
        </section>
      </main>

      <footer className="footer">
        <strong>경우의수</strong>
        <span>월드컵 32강 경우의 수 계산기 · 예측 공유</span>
      </footer>
    </div>
  );
}

export default App;