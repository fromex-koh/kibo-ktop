# 다음 릴리스 변경사항

## [Diff 확인]

### [접근성 보완] 성장률 우수기업 그래프 — 평균 · 조회 기업 막대 색 변경

- 대상: src/components/custom/diverging-rank-chart.tsx
- 변경: 평균 막대를 purple.500(#6b6eeb)에서 purple.600(#5a5fd2)으로, 조회 기업 막대를 mint.700(#169f59)에서 success.500(#228738)으로 교체
- 결과: 막대 안 기업명(흰 11px)의 명도 대비가 5.25:1 · 4.57:1 로 올라 본문 기준 4.5:1 을 충족
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3b6f4936)

### [접근성 보완] 현금흐름등급 — CR-5 칸 색과 글자색 변경

- 대상: src/components/custom/innovation-growth-report-credit.tsx
- 변경: CR-5 칸 배경을 gray.300(#848b94)에서 gray.200(#b7bbbf)으로 바꾸고 칸 글자를 짙은 색(gray.900 #1d2023)으로 전환
- 결과: 칸 명도 대비 8.47:1, 현재 등급이 CR-5 일 때 게이지 원호도 같은 색으로 그려짐
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9b7a31da)

### [마크업] 수치 상자(StatBox)를 정의 목록으로 변경

- 대상: src/components/custom/innovation-growth-report-parts.tsx
- 변경: 이름 줄과 값 줄을 문단 두 개에서 dl · dt · dd 구조로 교체
- 결과: 값만 있는 굵은 문단이 제목으로 오인되던 접근성 경고 해소(기업현황 탭 4건), 화면에 보이는 모양과 높이는 그대로
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/939cb7e2)

### [데이터] 기술혁신정보 표의 노출 건수 규칙을 타입 주석으로 명시

- 대상: src/content/service/k-bigx-innovation-report.ts
- 변경: InnovationTechDetail 의 특허 보유현황 · 우수특허 · 이머징 기술 · R&D 전문기관 현황 · 정부 R&D 사업 현황 필드에 최대 10건 규칙과 '기타' 묶음 주체를 주석으로 추가
- 결과: 값을 내려주는 쪽에서 데이터 파일만 보고 표별 제한을 확인 가능(코드 동작 변경 없음)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f14e62f8)

## [덮어쓰기]

### [문서] 컴포넌트 가이드 — 등급 척도 게이지

- 대상: src/app/component-guide/(guide)/grade-scale-gauge/page.tsx
- 적용: 지정한 파일만 교체
- 내용: 여섯 등급을 각각 현재 등급으로 둔 "등급별" 확인 영역 추가, CR-5 색 변경 반영
- 문서: [등급 척도 게이지 (GradeScaleGauge)](/component-guide/grade-scale-gauge)

### [문서] 컴포넌트 가이드 — 양쪽 순위 막대

- 대상: src/app/component-guide/(guide)/diverging-rank-chart/page.tsx
- 적용: 지정한 파일만 교체
- 내용: 막대 색 설명을 변경된 값으로 갱신
- 문서: [양쪽 순위 막대 (DivergingRankChart)](/component-guide/diverging-rank-chart)
