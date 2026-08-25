# 다음 릴리스 변경사항

## [덮어쓰기]

### 퍼블리싱 인덱스 콘텐츠 스키마 — 탄소 FO IA 지원

- 대상: src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
- 적용: 두 파일을 함께 교체한다 — 타입과 파서가 한 세트다
- 변경: `UserType` 에 `탄소` 추가. 화면 주소를 적는 `externalHref` 와 탄소 FO 저장소·배포 주소를 적는 `ExternalProject` 를 더했다

### 퍼블리싱 인덱스 데이터 — 탄소 FO IA 56건 추가 · 응용2 상태 54건 갱신

- 대상: src/content/publishing-guide/publishing-index.json
- 적용: 지정한 파일만 교체
- 변경: 탄소 FO IA 56건과 저장소·배포 주소를 더하고, 응용2팀이 화면 54건의 `application2Status` 를 완료로 올렸다(기업 25 · 기관 29). 기업·기관 IA 구조와 퍼블리싱 상태(UIUX)는 그대로다
- 결과: 응용2 진척률이 기업 47% → 62%, 기관 29% → 48% 로 오른다

### 퍼블리싱 인덱스 화면 — 탄소 탭

- 대상: src/components/custom/publishing-index.tsx
- 적용: 파일 교체. 위 스키마·데이터 카드와 한 벌로 반영한다
- 변경: 유형 필터에 탄소를 더하고, 탄소 탭에서 응용2·공통 레이아웃 표를 감춘다. 저장소·배포 배지와 `externalHref` 링크·뎁스 배지 키 복사가 함께 동작한다
