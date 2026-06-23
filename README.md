# 경우의수 | 월드컵 32강 예측 계산기

로그인 없이 점수만 바꿔보는 2026 월드컵 경우의 수 계산기입니다.

## 실행

```powershell
npm.cmd install
npm.cmd run dev
```

## 배포 전 확인

```powershell
npm.cmd run build
```

Vercel 설정:

- Framework: Vite
- Build Command: npm run build
- Output Directory: dist

## 수익화

이 프로젝트는 접속 자체를 유료화하지 않습니다. 대신 광고/스폰서 슬롯이 들어갈 수 있는 구조입니다.

- `src/components/AdSlot.jsx`: 스폰서/광고 placeholder
- `.env.example`: 애드센스 승인 후 사용할 환경변수 예시

광고 클릭 유도 문구는 넣지 마세요. 애드센스 정책 위반입니다.

## 실제 데이터 구조

- `src/data/worldCup2026.js`: 2026 월드컵 조/일정/실제 결과 seed
- `src/services/liveScores.js`: 공개 scoreboard endpoint에서 현재 결과를 가져오려는 adapter
- API 실패 시 내장 seed로 계속 동작합니다.

## 핵심 기능

- 로그인 없음
- 친구 예측/댓글 없음
- A~L조 실제 조 구성
- 실제 경기 seed + 온라인 업데이트 시도
- 점수 입력/예측
- 조별 순위 자동 계산
- 3위 팀 상위 8팀 랭킹
- 대한민국 경우의 수 문장
- 공유 링크 복사
- 로컬 저장
- 초기화
- 광고/스폰서 슬롯
