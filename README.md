# Job Application Tracker

개인 지원 현황과 마감일을 정리하는 브라우저 기반 도구입니다. 데이터는 서버로 전송되지 않고, 사용하는 브라우저의 `localStorage`에만 저장됩니다.

## Live demo

https://team-library.biny.cloud/job-application-tracker/

## Features

- 회사·직무·공고 URL·마감일·상태·메모 기록
- 회사 또는 직무 검색, 상태별 필터, 가까운 마감일 정렬
- `Saved` · `Applied` · `Interview` · `Offer` · `Closed` 상태 변경
- 마감일을 `.ics` 캘린더 파일로 내보내기
- 반응형 UI와 키보드 접근성 지원

## Run locally

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173/`를 엽니다.

## Verify

```bash
npm test
npm run lint
```

## Project documents

- `AGENTS.md` — 작업 규칙과 완료 기준
- `docs/product-spec.md` — 제품 범위
- `docs/design.md` — UI·접근성 기준
- `docs/architecture.md` — 데이터 구조
- `docs/plans/mvp.md` — 구현 계획
