# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.
같은 작업의 카드는 # 작업: 작업 이름 아래에 모으고, 그 아래에서 ## 구분자부터 다시 씁니다.

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

- 카드는 위에서부터 작업할 순서대로 나열했습니다. '한 번에 적용'이 적힌 카드는 함께 넣어야 빌드됩니다.

# 작업: 마이페이지 사이드메뉴 — 메뉴 항목 사이 간격

## [Diff 확인]

### [컴포넌트] 스티키 사이드바(StickySidebar) — 메뉴 항목 사이 8px

- 대상: src/components/composite/sticky-sidebar.tsx
- 변경:
    - AS-IS: 메뉴 항목이 간격 없이 붙어 있어 마우스를 올린 면 · 현재 메뉴 면이 이웃 항목과 맞닿음
    - TO-BE: 메뉴 목록(StickySidebarNav)에 항목 사이 8px(gap-2)
    - 주석: 조각 5개 · 쓰는 법 위주로 정리
- 결과: 마이페이지 사이드메뉴를 쓰는 모든 화면(기업 7 · 기관 14)의 항목 사이가 8px 벌어짐 · 태블릿 · 모바일에서 여는 메뉴 목록도 같음
- 영향 화면: [기업 내 정보](/corp/mypage/profile)
    - [기관 평가결과 조회](/org/mypage/evaluation-history)
    - [스티키 사이드바](/component-guide/sticky-sidebar)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ef16dcf036de5b86add1f2673863912b9dc0a827)

### [컴포넌트] 마이페이지 사이드바(MypageSidebar) — 주석 정리

- 대상: src/components/composite/mypage-sidebar.tsx
- 변경: 주석만 정리(쓰는 법 · current 는 메뉴 라벨과 같아야 함 · 메뉴 추가 · 기관 내 정보 경로 연동) — 코드 · 화면 그대로
- 결과: 메뉴를 바꿀 때 고칠 곳과 연동할 값이 파일에서 바로 보임
- 영향 화면: 없음(주석만)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4d0bad569bc4621f0555ec9ccb0c00ae9b0e0c0f)

# 작업: 기업 마이페이지 내 정보 — 마케팅 알림 수신 동의 배치 변경 · 동의 모달 버튼 통일

## [Diff 확인]

### [컴포넌트] 마케팅 정보 수신 동의 모달 — 버튼 문구를 한 가지로 통일

- 대상: src/content/service/k-bigx-marketing-consent.ts
    - src/components/composite/k-bigx-marketing-consent-dialog.tsx
- 변경:
    - AS-IS: 마이페이지에서 열 때만 버튼이 [비동의] · [동의] (actions prop · MYPAGE_MARKETING_CONSENT_ACTIONS)
    - TO-BE: 어디서 열어도 [동의안함] · [동의 후 이용] — 화면마다 다른 것은 제목(title)뿐
    - actions prop · MYPAGE_MARKETING_CONSENT_ACTIONS 삭제
    - 주석: 쓰는 곳 · 문구 위치 · 버튼과 닫기(X · Esc) 동작 위주로 정리
- 결과: K-BIGx 보고서와 마이페이지의 동의 모달이 제목만 다르고 본문 · 버튼이 같음
- 영향 화면: [기업 내 정보](/corp/mypage/profile)
    - [마이페이지 마케팅 정보 수신 동의](/corp/mypage/profile/marketing-consent)
    - [K-BIGx 마케팅 알림 수신동의](/corp/k-bigx-report/innovation-growth-report/marketing-consent) (모양 그대로)
- 함께 작업: 아래 두 카드와 한 번에 적용 (actions prop 삭제라 함께 넣어야 빌드됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0a0fe11d70d3cb09e5adf0aa5cd44cc7ee4ce2bb)

### [화면] 기업 마이페이지 내 정보 — 마케팅 알림 수신 동의 영역 배치 변경

- 대상: src/components/composite/mypage-profile-form.tsx
- 변경:
    - 이름: "마케팅 알림 수신 동의 (선택)" → "[선택] 마케팅 알림 수신 동의" (전체 16 Bold)
    - 설명: 14 → 16 Regular · 이름 바로 아래(간격 4) · 이름과 같은 시작선
    - 배치: 체크박스 옆에 이름 · 설명을 위아래로 쌓고 [자세히]는 오른쪽 세로 가운데
    - 구분선 위아래 간격: 32 → 40
    - [자세히]: 오른쪽 화살표 아이콘 제거(밑줄 글자만)
    - 모달 버튼: [동의 후 이용] · [동의안함]이 체크를 켜고 끔
    - 주석: 값 형식('Y' / '') · 처음 값 · 저장 흐름을 [프론트엔드 연동]으로 정리
- 결과: 마케팅 알림 수신 동의 영역이 새 배치 · 크기로 보임
- 영향 화면: [기업 내 정보](/corp/mypage/profile)
- 함께 작업: 위 · 아래 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/497d0fdab3949095282098b05ee300d7045a7783)

### [화면] 마이페이지 마케팅 정보 수신 동의 확인 화면 — 버튼 문구 옵션 제거

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/marketing-consent/page.tsx
- 변경: 모달에 넘기던 actions(버튼 문구) 제거 · 주석의 버튼 이름 갱신
- 결과: 버튼이 [동의안함] · [동의 후 이용]으로 보임
- 영향 화면: [마이페이지 마케팅 정보 수신 동의](/corp/mypage/profile/marketing-consent)
- 함께 작업: 위 두 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b63eb1252cd8f38191ee63c04a8b26ab237579b9)

# 작업: 헤더 — 로그인한 회원 이름을 누르면 마이페이지로 이동

## [Diff 확인]

### [컴포넌트] 헤더(Header) — 회원 배지 + 이름을 마이페이지 내 정보 링크로

- 대상: src/constants/header-navigation.ts
    - src/constants/preview-user.ts
    - src/components/composite/header.tsx
- 변경:
    - AS-IS: 로그인 상태 헤더의 [배지 + 기업명/기관명 님]이 글자뿐
    - TO-BE: 누르면 그 회원의 마이페이지 내 정보로 이동(마우스를 올리면 이름에 밑줄 · 포커스 테두리 · 화면 낭독기는 "마이페이지로 이동"까지 읽음)
    - header-navigation: 마이페이지 첫 화면 경로 MYPAGE_HOME_HREF 추가(기업 /corp/mypage/profile · 기관 /org/mypage/profile-edit/partner-bank) — 전체 메뉴의 "내 정보"도 같은 값
    - header: HeaderUser 에 mypageHref(선택) 추가 — 없으면 MYPAGE_HOME_HREF
    - preview-user: 기관 회원 유형 5종 목업에 각자의 내 정보 경로(mypageHref)
    - 주석: mypageHref · MYPAGE_HOME_HREF 에 [프론트엔드 연동](기관은 로그인 회원 유형의 경로를 넘김)
- 결과: 로그인 상태의 모든 화면 헤더에서 이름을 누르면 마이페이지로 감 · 기관은 회원 유형에 맞는 내 정보 화면으로 감
- 영향 화면: [기업 내 정보](/corp/mypage/profile)
    - [기관 평가진행방식 선택](/org/individual-evaluation/verification-progress)
    - [기관 협약기관 내 정보](/org/mypage/profile-edit/partner-agency)
- 함께 작업: 세 파일 한 번에 적용(서로 가져다 씀)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8498d8f0489a42551a95cce91be53fb2417c2d33)

# 작업: 기업 기술평가 고객정보활용동의 — 부분발송 이메일 필수

## [Diff 확인]

### [컴포넌트] 이메일 입력(EmailField) — 값이 바뀔 때 알리는 onValueChange 추가

- 대상: src/components/composite/email-field.tsx
- 변경:
    - onValueChange(선택) 추가 — 합친 주소와 형식이 맞는지({email, isValid})를 바뀔 때마다 알림 · 넘기지 않는 화면은 그대로
    - 주석: 넘기는 함수는 useCallback 등으로 고정할 것
- 결과: 이메일이 채워져야 열리는 버튼 등을 바깥에서 만들 수 있음
- 영향 화면: 없음(쓰는 곳은 아래 카드)
- 함께 작업: 아래 두 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9a89c1be65e74726144f97ed4f991bddfdbc3b04)

### [컴포넌트] 고객정보활용동의 — 부분발송 이메일 필수 · 이메일까지 채워야 [동의 후 인증서명] 열림

- 대상: src/components/custom/customer-consent-agreement.tsx
- 변경:
    - CustomerConsentNoticeEmail 추가: "부분발송 이메일등록" 카드 + 필수 이메일 칸(안내 문구 없음)
    - [동의 후 인증서명] 열림 조건: 필수 동의 · 확인 체크 2개 + 이메일이 올바르게 입력됨(이 조각이 있는 화면만)
    - 주석: 쓰는 화면 · 서버로 가는 값(additionalNoticeEmail, 합친 주소 하나)을 [프론트엔드 연동]으로 표시
- 결과: 이메일이 비었거나 아이디만 있거나 도메인 형식이 틀리면 버튼이 꺼져 있음
- 영향 화면: [기업 KTRS-FM 고객정보활용동의](/corp/technology-evaluation/ktrs-fm/customer-consent)
    - 마이페이지 대표자 이력 고객정보활용동의는 그대로(이메일 선택)
- 함께 작업: 위 · 아래 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1eb26aee641af148295f11ad4fb64ef70462c910)

### [화면] 기업 기술평가 고객정보활용동의 4개 — 이메일 카드를 공용 조각으로 교체

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/page.tsx
- 변경:
    - AS-IS: 화면마다 FormCard + EmailField(선택) · 안내 문구 "안내문을 추가로 받으실 이메일 주소를 입력해 주세요."
    - TO-BE: <CustomerConsentNoticeEmail /> 한 줄 — 안내 문구 삭제 · 이메일 필수
- 결과: 네 화면 모두 이메일을 입력해야 [동의 후 인증서명]이 열림
- 영향 화면: [KTRS-FM](/corp/technology-evaluation/ktrs-fm/customer-consent)
    - [투자모형](/corp/technology-evaluation/investment-model/customer-consent)
    - [Tech-Index(일반)](/corp/technology-evaluation/tech-index/general/customer-consent)
    - [Tech-Index(창업)](/corp/technology-evaluation/tech-index/startup/customer-consent)
- 함께 작업: 위 두 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c4b29e666cf50fc7c63ebd21aa386ae2fa14725a)

# 작업: 제목 · 브레드크럼 수정

## [Diff 확인]

### [화면] Tech-Index 평가모형 선택(기업 · 기관) — 브레드크럼 3depth에 Tech-Index 추가

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/page.tsx
- 변경:
    - 기업: 홈 › 기술평가 → 홈 › 기술평가 › Tech-Index
    - 기관: 홈 › 개별평가 → 홈 › 개별평가 › Tech-Index
- 결과: 현재 위치가 Tech-Index 로 표시됨(Tech-Index 다음 단계 화면들과 같은 브레드크럼)
- 영향 화면: [기업 Tech-Index 선택](/corp/technology-evaluation/tech-index/selection)
    - [기관 Tech-Index 선택](/org/individual-evaluation/tech-index/selection)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/97405b0df0f9ea16cd4daafbc9f55e2063354b69)

### [화면] 기관 평가진행방식 선택 — 제목 신속표준모형 + KTRS-FM 배지 · 브레드크럼 3depth

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/page.tsx
- 변경:
    - 제목: 평가진행방식 선택 → 신속표준모형 + KTRS-FM 배지
    - 브레드크럼: 홈 › 개별평가 → 홈 › 개별평가 › KTRS-FM
    - 브라우저 탭 제목: 평가진행방식 선택 (신속표준모형)
- 결과: KTRS-FM 단계 화면(고객정보활용동의)과 같은 제목 · 배지 · 브레드크럼
- 영향 화면: [기관 평가진행방식 선택](/org/individual-evaluation/verification-progress)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3a4b95eb67a2c6e6588d5811a36b108aba6dd417)

# 작업: 기관 서비스 이용 불가 안내 모달 추가

## [신규 추가]

### [컴포넌트] 서비스 이용 불가 안내 모달(ServiceUnavailableDialog)

- 대상: src/components/composite/service-unavailable-dialog.tsx
    - src/content/service/service-unavailable.ts
- 적용: 신규 파일 추가
- 내용:
    - 기관 회원은 서비스별로 계정을 따로 만들어, 할당되지 않은 서비스 메뉴에 들어오면 뜨는 안내
    - service 로 서비스를 고름 — 'technology-evaluation'(기술평가) · 'k-bigx'(K-BIGx), 서비스 이름만 바뀜
    - 제목 → 안내 문구 → 문의전화(임시 번호) → [확인] · 닫기(X) 없음
    - 여는 조건 · [확인] 뒤 동작은 [프론트엔드 연동] 주석 참고(open · onConfirm)
- 영향 화면: 아래 확인 화면 2개
- 함께 작업: 아래 카드보다 먼저 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b920685b813c61c681f46780b24a70cad2f3ed37)

### [화면] 기술평가 · K-BIGx 서비스 불가 안내 확인 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/service-unavailable/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/service-unavailable/page.tsx
- 적용: 신규 파일 추가
- 내용: 모달만 열어 두고 확인하는 화면 — 설명 "기관 회원은 서비스별로 계정 각각 생성, 할당 서비스 외 다른 서비스 접근시 노출되는 모달"
- 영향 화면: [기술평가 서비스 불가 안내](/org/individual-evaluation/verification-progress/service-unavailable)
    - [K-BIGx 서비스 불가 안내](/org/k-bigx-report/service-unavailable)
- 함께 작업: 위 카드 다음에 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/df4880cd065aa7b7622bb1f860f5f7aff0ce0a2e)

# 작업: 문서

## [덮어쓰기]

### [문서] 퍼블리싱 인덱스 — 서비스 불가 안내 2행 추가 · 평가진행방식 선택 이름 변경

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용:
    - 행 추가: 기관 > 개별평가 '기술평가 서비스 불가 안내' · 기관 > K-BIGx 보고서 맨 위 'K-BIGx 서비스 불가 안내'
    - 이름 변경: 평가검증 진행확인 → 평가진행방식 선택 (신속표준모형)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5563c627b7f5fb188ad6da0d70ebab4591ed372f)

### [문서] 스티키 사이드바 가이드 — 메뉴 항목 사이 8px 안내

- 대상: src/app/component-guide/(guide)/sticky-sidebar/page.tsx
- 적용: 지정한 파일만 교체
- 내용: StickySidebarNavItem 설명에 "항목 사이는 8px" 추가
- 영향 화면: [스티키 사이드바](/component-guide/sticky-sidebar)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/23f982ef5ab94463b5fe820ad41ebcab75d51104)
