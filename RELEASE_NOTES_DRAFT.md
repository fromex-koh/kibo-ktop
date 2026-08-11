# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 `##` 구분자, `###` 작업명, `- 라벨: 내용` 순서로 작성하세요.

## [Diff 확인]

### Header 반응형 개선
- 대상: src/components/composite/header.tsx
- 변경: 사용자 정보 영역 breakpoint 조정
- 결과: 768px 이상에서 사용자 정보 표시
- 커밋: [변경사항 보기](https://github.com/{organization}/{repository}/commit/{commit-hash})

## [신규 추가]

### EmailField 컴포넌트
- 대상: src/components/composite/email-field.tsx
- 적용: 신규 파일 추가

## [덮어쓰기]

### 문의 완료 화면
- 대상: src/components/custom/inquiry-complete
- 적용: 지정한 파일만 교체

컴포넌트 가이드 페이지는 `[페이지 제목](/component-guide/경로)` 형식으로 작성하면 새 창 링크로 표시됩니다.
릴리스 성공 후 내용은 자동으로 비워집니다.
-->

## [Diff 확인]

### [헤더 반응형] Header 사용자 정보·GNB 반응형 노출 기준 조정

- 대상: src/components/composite/header.tsx
- 변경: 사용자 정보는 768px 이상(md), GNB는 1280px 이상(xl)에서 표시되도록 조정하고 그리드 기준으로 정렬
- 결과: 768px 이상(md)에서는 사용자 정보가 표시되고, 1280px 이상(xl)에서는 GNB가 표시되며 각 영역이 그리드 기준으로 정렬
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/92551c8)

### [마크업 검사] Header 중복 title·Radix ID 오류 수정

- 대상: src/components/composite/header.tsx
- 변경: `aria-label`과 중복되는 `title` 속성을 제거하고, GNB `NavigationMenu` 값을 메뉴 라벨 대신 `nav-{index}` 형식으로 변경
- 결과: WAVE의 `Redundant title text` 경고와 공백이 포함된 메뉴명으로 생성되던 W3C 유효하지 않은 ID 오류 해결
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/233c13c)

### [Footer 반응형] Footer 모바일 세로 배치·태블릿 화면 폭 개선

- 대상: src/components/composite/footer.tsx
- 변경: Footer 컨테이너를 `grid-layout`으로 교체하고 태블릿부터 PC 컨테이너 기준을 적용
- 결과: 모바일에서는 Footer 메뉴와 안내 정보가 세로로 정렬되고, 관련사이트는 화면 너비에 맞게 표시되며, 태블릿과 PC에서는 콘텐츠 좌우 여백 기준을 동일하게 유지
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b9d18ba)

### [버튼 배치] 문의 완료 화면 모바일·데스크톱 버튼 배치 개선

- 대상: src/components/custom/inquiry-complete.tsx
- 변경: 화면 너비에 따라 문의 완료 버튼 배치 기준 조정
- 결과: 767px 이하에서는 두 버튼이 화면 너비에 맞춰 위아래로 표시되고, 768px 이상에서는 좌우로 나란히 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/178139f)

### [버튼 배치] 문의하기 폼 버튼 반응형 배치

- 대상: src/components/custom/inquiry-form.tsx
- 변경: 화면 너비에 따라 문의 취소·등록 버튼 배치 기준 조정
- 결과: 767px 이하에서는 두 버튼이 위아래로, 768px 이상에서는 좌우로 배치되어 문의하기와 개인정보 수집·이용 안내 화면에서 동일하게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fbb8a26)

### [화면 레이아웃] 개인정보 처리방침 기업 화면 레이아웃 동기화

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/privacy-policy/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/privacy-policy/page.tsx
- 변경: 기업 화면의 본문 너비와 배치를 기관 화면과 동일하게 조정
- 결과: 기업과 기관의 개인정보 처리방침 내용이 같은 기준으로 정렬되어 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5ec3741)

### [화면 레이아웃] 알기 쉬운 개인정보 처리방침 기업·기관 화면 그리드 적용

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/privacy-policy/easy-privacy-policy/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/privacy-policy/easy-privacy-policy/page.tsx
- 변경: 기업·기관 화면의 본문 너비와 구성 방식을 동일하게 조정
- 결과: 알기 쉬운 개인정보 처리방침 내용이 기업·기관에서 같은 위치와 폭으로 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/31d5170)

### [화면 레이아웃] 이용약관 기업·기관 화면 레이아웃 동기화

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/terms/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/terms/page.tsx
- 변경: 기업·기관 화면의 본문 너비와 구성을 개인정보 처리방침과 동일하게 조정
- 결과: 이용약관 내용이 기업·기관에서 동일한 위치와 폭으로 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/80d13d4)

### [화면 레이아웃] 자료실 기업·기관 화면 레이아웃 동기화

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/notice/resources/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/notice/resources/page.tsx
- 변경: 기업·기관 자료실 화면의 본문 너비와 구성을 개인정보 처리방침과 동일하게 조정
- 결과: 자료실 목록이 기업·기관에서 동일한 너비와 위치 기준으로 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/412ba15)

### [화면 레이아웃] 공지사항 목록 기업·기관 화면 그리드 적용

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/notice/announcements/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/notice/announcements/page.tsx
- 변경: 기업·기관 공지사항 목록 화면의 본문 너비와 구성을 동일하게 조정
- 결과: 공지사항 목록이 기업·기관에서 같은 위치와 폭으로 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bfe460b)

### [화면 레이아웃] 공지사항 상세 기업·기관 화면 그리드 적용

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/notice/announcements/detail/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/notice/announcements/detail/page.tsx
- 변경: 기업·기관 공지사항 상세 화면의 본문 너비와 구성을 동일하게 조정
- 결과: 공지사항 상세 내용이 기업·기관에서 같은 위치와 폭으로 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d00fe1a)

### [화면 레이아웃] FAQ 기업·기관 화면 그리드 적용

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/notice/faq/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/notice/faq/page.tsx
- 변경: 기업·기관 FAQ 화면의 본문 너비와 구성을 동일하게 조정
- 결과: FAQ 질문과 답변이 기업·기관에서 같은 위치와 폭으로 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7382db4)

### [화면 레이아웃] 문의하기 기업·기관 화면 레이아웃 동기화

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/notice/inquiry-create/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/notice/inquiry-create/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/notice/inquiry-create/privacy-consent-guide/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/notice/inquiry-create/privacy-consent-guide/page.tsx
- 변경: 기업·기관 문의하기 화면의 본문 너비와 구성을 개인정보 처리방침과 동일하게 조정
- 결과: 문의 작성 영역이 기업·기관에서 같은 위치와 폭으로 일관되게 표시
- 커밋: [변경사항 1 보기](https://github.com/fromex-koh/kibo-ktop/commit/287efd0) · [변경사항 2 보기](https://github.com/fromex-koh/kibo-ktop/commit/e14c1b8)

### [화면 레이아웃] 문의 완료 기업·기관 화면 그리드 적용

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/notice/inquiry-create/inquiry-complete/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/notice/inquiry-create/inquiry-complete/page.tsx
- 변경: 기업·기관 문의 완료 화면의 본문 너비와 구성을 동일하게 조정
- 결과: 문의 완료 안내와 버튼 영역이 기업·기관에서 같은 위치와 폭으로 일관되게 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8820fe6)

### [인증 흐름] 우편번호 검색 공통 다이얼로그 연결

- 대상: src/components/custom/auth-flow-page.tsx
- 변경: 페이지 내부에 구현한 우편번호 검색 다이얼로그를 공통 `PostcodeSearchDialog` 컴포넌트로 교체하고 화면 확인용으로 기본 노출
- 결과: 우편번호 검색 화면이 공통 다이얼로그를 사용하며, 실제 서비스에서는 주소 검색 버튼으로 열 수 있는 구조로 정리
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ca62142)

## [덮어쓰기]

### 컴포넌트 가이드 전체

- 대상: src/app/component-guide
- 적용: 기존 가이드 문서와 EmailField·RepeatCard·DatePicker·Dialog·FormTabs·SubSectionHeader 가이드 페이지, GuidePageShell 제목 줄바꿈 및 마크업 검사 예외 최신화를 포함한 전체 폴더 교체

### [이미지 자산] 피인용 확인 매뉴얼 이미지 추가

- 대상: public
- 적용: 피인용 확인 매뉴얼의 KIPRIS 검색·특허번호 조회·피인용 횟수 확인 이미지를 포함한 정적 이미지 폴더 교체

### [토스트 반응형] 모바일 토스트 너비·중앙 정렬 개선

- 대상: src/app/globals.css
- 적용: 600px 이하에서 Sonner 토스터의 화면 넘침을 방지하고 내용 길이에 맞는 토스트가 화면 중앙에 표시되도록 전역 스타일 교체

### [토스트 정렬] 중앙 위치 토스트 정렬 개선

- 대상: src/components/theme/sonner.variants.ts
- 적용: 상단·하단 중앙 위치의 토스트가 내용 너비를 유지하면서 화면 가운데 정렬되도록 스타일 교체

### 컴포넌트 가이드 내비게이션

- 대상: src/constants/publishing-guide.ts
- 적용: RepeatCard 가이드 메뉴 추가

### [컴포넌트 타이포그래피] SubSectionHeader 설명 텍스트 크기 조정

- 대상: src/components/composite/sub-section-header.tsx
- 적용: 설명 텍스트를 `typo-body-l-regular` 기준으로 교체하고 제목·설명 위계와 제목 줄바꿈 방식을 조정

### [컴포넌트 타이포그래피] SectionHeader 제목 줄바꿈 개선

- 대상: src/components/composite/section-header.tsx
- 적용: 제목에 강제 적용되던 균형 줄바꿈을 제거해 콘텐츠 너비에 따라 자연스럽게 표시되도록 교체

### [InfoBox 접근성] 제목 헤딩 단계 지원

- 대상: src/components/composite/info-box.tsx
- 적용: 안내 상자 제목을 문단이 아닌 실제 헤딩으로 렌더링하고 화면의 문서 구조에 맞춰 2~4단계 헤딩을 선택할 수 있도록 교체

### [목록 마커] 타이포그래피 상속 옵션 추가

- 대상: src/components/custom/list-marker.tsx
- 적용: 목록 마커의 기본 본문 타이포그래피를 유지하거나 부모 요소의 타이포그래피를 상속할 수 있도록 옵션 추가

### [Chip 접근성] 체크박스 그룹 구조 개선

- 대상: src/components/composite/chip.tsx
- 적용: 같은 이름의 체크박스 묶음을 fieldset과 시각적으로 숨긴 legend로 구성해 그룹 이름을 제공하고 WAVE의 Missing fieldset 경고 해결

### [Chip 반응형] 여러 줄 라벨 높이·정렬 개선

- 대상: src/components/theme/chip.variants.ts
- 적용: 좁은 화면에서 긴 라벨이 자연스럽게 줄바꿈되도록 고정 높이를 최소 높이로 교체하고 텍스트 중앙 정렬과 반응형 내부 여백 적용

### [폼 탭 반응형] FormTabs 레이아웃 및 스타일 개선

- 대상:
    - src/components/composite/form-tabs.tsx
    - src/components/theme/form-tabs.variants.ts
- 적용: 데스크톱 가로 탭, 태블릿 현재 섹션 선택 카드, 모바일 단계·제목을 포함한 고정 헤더로 반응형 동작을 교체하고 기존 `form-section-collapse.tsx` 접기 구조 제거

### [토큰 검증] FormTabs breakpoint 동기화 검증 추가

- 대상: scripts/build-tokens.mjs
- 적용: 디자인 토큰의 `md`·`xl` breakpoint와 FormTabs 미디어쿼리 불일치 시 빌드에서 검증 오류가 발생하도록 검증 로직 교체

### 공통 CTA 정렬 개선

- 대상: src/components/composite/action-bar.tsx
- 적용: CTA 그룹의 가로 중앙 정렬 스타일 교체

### [DatePicker] 날짜·월 선택 및 검증 기능 개선

- 대상:
    - src/components/composite/date-picker.tsx
    - src/components/theme/date-picker.variants.ts
- 적용: 날짜·월 단위 선택, 최소·최대 날짜 제한, 유효성 메시지와 월 선택 패널 스타일을 반영하고 모바일에서는 화면 너비에 맞는 다이얼로그로 달력이 열리도록 교체

### [FormCard] 반응형 여백·FormTabs 접기 연동 개선

- 대상: src/components/composite/form-card.tsx
- 적용: 모바일·태블릿·데스크톱 구간별 내부 여백을 적용하고, FormTabs 접기 구조 제거에 맞춰 화면에서 전달한 보조 액션만 헤더에 표시하도록 교체

### PageTitleBar 반응형 배치 개선

- 대상: src/components/composite/page-title-bar.tsx
- 적용: 제목·뱃지·브레드크럼의 반응형 배치와 제목 줄바꿈 스타일 교체

### StepHeader 반응형 배치 개선

- 대상: src/components/composite/step-header.tsx
- 적용: 화면 폭별 단계 헤더 배치와 제목 줄바꿈 스타일을 교체하고, 모바일에서 현재·전체 단계와 화면 제목만 표시하는 축약 헤더 추가

### [동의 흐름] 동의사항 다이얼로그 단계 전환 개선

- 대상: src/components/composite/consent-terms-dialog.tsx
- 적용: 동의사항 본문 스크롤·동의·미동의 동작을 반영하고, 필수·선택 단계를 동일 DialogContent에서 전환해 재등장 애니메이션과 화면 깜빡임 방지

### [Dialog] 포커스 이동 시 스크롤 튐 방지

- 대상: src/components/theme/dialog.variants.ts
- 적용: Dialog 내부 포커스 이동 시 본문 영역만 스크롤되도록 하고, 긴 안내·표 콘텐츠의 세로·가로 스크롤과 하단 여백이 유지되도록 본문 스타일 교체

### [폼 유효성] 오류 입력 필드 포커스 표시 개선

- 대상:
    - src/components/theme/input-group.variants.ts
    - src/components/theme/input.variants.ts
    - src/components/theme/select.variants.ts
    - src/components/theme/textarea.variants.ts
- 적용: aria-invalid 상태의 입력 필드가 마우스 제출 후에도 포커스 표시를 유지하도록 하고, Select 목록이 모달 위에 표시되며 옵션이 많을 때 최대 높이 안에서 스크롤되도록 스타일 교체

### [선택 카드] SelectableCard 라벨 정렬·클릭·마크업 개선

- 대상: src/components/composite/selectable-card.tsx
- 적용: 체크박스와 1·2줄 라벨의 세로 정렬 기준을 교체하고, Radix 폼 연동용 숨은 input의 클릭이 카드 onClick으로 중복 전달되지 않도록 처리하며, 최상위 label을 일반 컨테이너로 변경해 하나의 label 안에 버튼과 숨은 input이 중복 포함되던 마크업 오류 해결

### 퍼블리싱 인덱스 화면

- 대상: src/components/custom/publishing-index.tsx
- 적용: 퍼블리싱 인덱스 화면 구성 교체

### 로그인 흐름 화면 반응형 버튼 배치

- 대상: src/components/custom/auth-flow-page.tsx
- 적용: 로그인 종료 화면의 모바일 1열·`md` 이상 가로 버튼 배치 반영

### 퍼블리싱 가이드 관리 데이터

- 대상: src/content/publishing-guide
- 적용: KTRS-FM 화면 완료 상태와 인계 자산의 폴더 단위 추적 범위를 반영한 퍼블리싱 인덱스, 화면 레지스트리, 릴리즈 노트 생성 데이터 및 가이드 운영 데이터를 포함한 전체 폴더 교체

### 동의사항 콘텐츠

- 대상: src/content/service/consent-terms.ts
- 적용: 기존 약관 콘텐츠 교체

### 동의 카드 스타일

- 대상: src/components/theme/consent-list.variants.ts
- 적용: 동의 목록 반응형 스타일 교체

### 선택 카드 스타일

- 대상: src/components/theme/selectable-card.variants.ts
- 적용: 선택 카드 반응형 여백과 컨트롤 정렬 스타일 교체

## [신규 추가]

### 고객정보활용동의 페이지

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/page.tsx
- 적용: 신규 서비스 페이지 추가

### 고객정보활용동의 컴포넌트

- 대상: src/components/custom/customer-consent-agreement.tsx
- 적용: 동의 범위 선택, 필수·선택 동의 모달, 제출 데이터 수집 및 하단 CTA 연동을 포함하고, 폼 제출 이벤트 타입을 `SubmitEvent`로 적용하며 부분발송 이메일 유효성 검사 실패 시 제출과 다음 화면 이동을 차단하는 신규 컴포넌트 추가

### 고객정보활용동의 필수·선택 동의 팝업 화면

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/consent-popup/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/consent-popup/customer-consent-popup.tsx
- 적용: 기업 로그인 상태에서 필수 동의사항을 먼저 표시하고 동의 완료 후 선택 동의사항을 이어서 확인하는 신규 팝업 화면 추가

### 고객정보활용동의 개별 상세 화면

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/detail/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/detail/customer-consent-detail-content.tsx
- 적용: 고객정보활용동의 항목별 내용보기 다이얼로그를 확인하고 다른 동의사항 상세 내용으로 전환할 수 있는 신규 화면 추가

### 동의사항 상세보기 버튼

- 대상: src/components/composite/consent-terms-detail-button.tsx
- 적용: 신규 컴포넌트 추가

### EmailField 컴포넌트

- 대상: src/components/composite/email-field.tsx
- 적용: 아이디·도메인 입력과 프리셋 선택을 조합해 완성된 이메일 주소를 폼 데이터로 전달하고, 두 값이 모두 비어 있으면 허용하되 일부 입력 또는 잘못된 직접입력 도메인은 공통 오류 메시지와 빨간 테두리로 안내하며, 도메인 선택 컨트롤의 폼 식별 이름과 Radix가 생성하는 native select의 접근 가능한 이름이 유지되도록 처리한 신규 컴포넌트 추가

### 기술평가 상수

- 대상: src/constants/technology-evaluation.ts
- 적용: 신규 기술평가 단계 상수 추가

### 폼 상수

- 대상: src/constants/form.ts
- 적용: 신규 공통 폼 상수 추가

### FormTabs 지원 컴포넌트 및 값 관리

- 대상:
    - src/components/composite/form-tab-title.tsx
    - src/components/composite/form-values.tsx
    - src/components/theme/form-tab-title.variants.ts
    - src/lib/phone.ts
- 적용: 폼 탭 제목과 섹션 선택 목록 스타일, 입력값 보관 및 전화번호 포맷 기능 추가

### FormTabs 제출 상태 관리

- 대상: src/components/composite/form-tabs-submit.ts
- 적용: 탭별 입력값 검증, 오류가 있는 탭 이동, 전체 폼 데이터 수집과 최종 제출 흐름을 관리하는 신규 훅 추가

### 기업·기술정보 탭 폼

- 대상: src/components/composite/self-diagnosis-tabs-form.tsx
- 적용: 기업·기술정보의 모든 탭 입력값을 유지하고 검증한 뒤 전체 폼 데이터를 수집하여 다음 단계로 이동하는 신규 폼 컴포넌트 추가

### RepeatCard 컴포넌트

- 대상:
    - src/components/composite/repeat-card.tsx
    - src/components/theme/repeat-card.variants.ts
- 적용: 반복 입력 카드의 접기·펼치기·추가·삭제 UI와 상태 관리 기능을 제공하고, 사용 위치의 문서 구조에 맞춰 카드 제목의 헤딩 단계를 선택할 수 있도록 추가

### 공통 완료 토스트

- 대상: src/components/custom/check-toast.tsx
- 적용: 체크 아이콘·노출 시간·헤더와 모바일 고정 탭을 고려한 표시 위치를 공통으로 관리하는 완료 토스트 함수 추가

### 체크리스트 질문 입력 컴포넌트

- 대상:
    - src/components/composite/question-list.tsx
    - src/components/composite/question-select.tsx
    - src/components/theme/question-group-header.variants.ts
    - src/components/theme/question-list.variants.ts
- 적용: 체크박스·배지·질문 본문·선택 항목의 반응형 배치와 제어형 Select, 인라인 액션, 유효성 메시지를 지원하는 체크리스트 질문 입력 컴포넌트 및 스타일 추가

### KTRS-FM 체크리스트 입력 흐름

- 대상:
    - src/app/component-guide/(demo)/self-diagnosis/checklist/page.tsx
    - src/components/composite/checklist-form.tsx
    - src/components/composite/citation-manual-dialog.tsx
    - src/components/composite/submit-confirm-dialog.tsx
    - src/components/composite/trl-guide-dialog.tsx
    - src/components/composite/trl-stages.ts
    - src/content/technology-evaluation/ktrs-fm-checklist.ts
- 적용: KTRS-FM 체크리스트 데이터와 입력 폼, TRL·피인용 확인 안내, 최종 제출 확인 다이얼로그 및 전체 흐름을 확인하는 데모 화면을 추가하고, 폼 제출 이벤트 타입을 `SubmitEvent`로 적용

### KTRS-FM 체크리스트 서비스·안내 화면

- 대상:
    - src/components/composite/restricted-industries-dialog.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/citation-manual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/restricted-industries/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/trl-guide/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/final-review/page.tsx
- 적용: 기업 로그인 상태의 KTRS-FM 체크리스트 입력 페이지와 피인용 확인·제한업종·TRL 안내 및 최종 제출 확인 모달 화면 추가

### 기업·기술정보 입력 안내 다이얼로그

- 대상:
    - src/components/composite/career-input-help-dialog.tsx
    - src/components/composite/recognized-ip-dialog.tsx
    - src/components/composite/technology-definition-dialog.tsx
    - src/components/composite/trade-type-guide-dialog.tsx
    - src/components/theme/dialog-table.variants.ts
- 적용: 대표자 경력 입력 도움말, 실적인정 지식재산, 기술 정의, 거래유형 안내 콘텐츠와 표 레이아웃을 제공하는 신규 다이얼로그 묶음 추가

### [신속진단 폼] 공통 폼 컴포넌트 추가

- 대상:
    - src/components/composite/career-form.tsx
    - src/components/composite/company-etc-form.tsx
    - src/components/composite/company-info-form.tsx
    - src/components/composite/date-field.tsx
    - src/components/composite/form-fields.tsx
    - src/components/composite/industry-code-dialog.tsx
    - src/components/composite/postcode-search-dialog.tsx
    - src/components/composite/rnd-form.tsx
    - src/components/composite/self-diagnosis-form-tabs.tsx
    - src/components/composite/self-diagnosis-input-header.tsx
    - src/components/composite/tech-staff-form.tsx
    - src/components/custom/autosave-toast.tsx
- 적용: 기업·대표자·기술정보 입력 폼과 검색·입력 도움말 다이얼로그를 공통 컴포넌트로 분리하고 필수 항목 안내, 라디오 묶음 이름, 반복 카드 헤딩 단계를 접근 가능한 구조로 연결하며, PostcodeSearchDialog에 Kakao API 교체 지점과 화면 확인용 주소 검색·선택 흐름 추가

### 기업·기술정보 입력 페이지

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/page.tsx
- 적용: 기업 로그인 헤더, KTRS-FM 2단계 진행 정보, 기업·기술정보 탭 폼, 자동저장 안내와 이전·다음 이동을 포함한 신규 서비스 페이지 추가

### 기업정보 주소·업종코드 검색 화면

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-info/address-search/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-info/industry-code-search/page.tsx
- 적용: 기업 로그인 상태에서 주소 검색과 업종코드 조회 다이얼로그를 각각 확인하는 신규 화면 추가

### 기업 추가정보 입력 안내 화면

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/recognized-ip/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/technology-definition/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/transaction-type-guide/page.tsx
- 적용: 기업 로그인 상태에서 실적인정 지식재산, 기술 정의, 거래유형 안내 다이얼로그를 각각 확인하는 신규 화면 추가

### 대표자 이력 입력 도움말 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/representative-career/input-helper/page.tsx
- 적용: 기업 로그인 상태에서 대표자 경력 입력 기준과 작성 예시를 안내하는 다이얼로그 확인 화면 추가

### 기술평가 완료 및 후속 신청 화면

- 대상:
    - src/components/composite/bank-transfer-dialog.tsx
    - src/components/composite/guarantee-application-dialog.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/bank-transfer/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/guarantee-application/page.tsx
- 적용: 기술평가 신청 완료 안내와 계좌이체·보증 신청 다이얼로그 및 각 다이얼로그를 확인하는 신규 화면 추가
