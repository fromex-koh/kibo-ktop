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

# 작업: 약정서 전자서명 — 번호 입력 · 인증서 선택 · 인증 결과

## [신규 추가]

### [컴포넌트] 인증서 선택 모달(CertificateSelectDialog)

- 대상: src/components/composite/certificate-select-dialog.tsx
- 적용: 신규 파일 추가
- 내용:
    - 약정서 전자서명의 [인증서로 인증하기]를 누르면 위에 겹쳐 뜨는 모달
    - 안내 문단 → 지금 하는 인증 안내 한 줄(target) → [공동인증서 로그인] · [금융인증서 로그인]
    - 항목을 누르는 것이 곧 선택(아래 버튼 없음) · 마우스를 올리거나 누르면 파란 테두리 · 옅은 파랑 면
    - 전자서명 모달 안에서 쓸 때는 따로 연결할 것 없음(인증 연동은 아래 카드의 onCertify)
- 영향 화면: [인증서 선택](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/certificate-select)
- 함께 작업: 아래 두 카드보다 먼저 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6680b1bf0bc3ba6ac5f64d80798d370b3bb724b7)

## [Diff 확인]

### [컴포넌트] 약정서 전자서명 모달(ESignatureDialog) — 번호 입력 · 인증 결과 · 제출

- 대상: src/components/composite/e-signature-dialog.tsx
- 변경:
    - AS-IS: 안내 문구 + [법인인증] · [개인인증] 버튼 두 개(onCorporate · onPersonal)
    - TO-BE: [법인인증] · [개인인증] 칩 → 사업자등록번호(읽기 전용) + 법인등록번호 / 대표자 주민등록번호(앞 6 · 뒤 7, 주민번호 뒷자리 가림) → [인증서로 인증하기]
    - 사업자 유형: businessType — 'corporation'(법인기업, 기본) 법인 · 개인 2건 / 'individual'(개인기업) 개인 1건
    - [인증서로 인증하기]: 번호 두 칸을 다 채워야 열림 · 누르면 인증서 선택 모달
    - 성공: 칩에 [인증완료] 배지 · "공동인증서로 인증했습니다." 안내 · 번호 칸 잠금(읽기 전용) · 남은 인증 칩으로 자동 전환
    - 실패: 번호 칸 빨간 테두리 + 오류 문구(번호를 고치면 지워짐)
    - 모두 마치면 버튼이 [제출하기]로 바뀜(onSubmit)
    - 칩을 오가거나 모달을 닫았다 열어도 입력값 · 결과 유지, 다시 열면 남은 인증 칩으로 열림
    - 결과가 나오면 그 자리로 자동 스크롤 · 포커스(모바일 · 태블릿 포함)
    - props 삭제: onCorporate · onPersonal → 추가: businessType · businessNumber · onCertify · onSubmit
    - 주석: 연결할 props 와 이미 구현된 동작을 [프론트엔드 연동]으로 정리
- 결과: 고객정보활용동의의 [동의 후 인증서명]에서 번호 입력 → 인증서 선택 → 결과 확인 → 제출까지 이어짐
- 영향 화면: [KTRS-FM 고객정보활용동의](/corp/technology-evaluation/ktrs-fm/customer-consent)
    - [투자모형](/corp/technology-evaluation/investment-model/customer-consent)
    - [Tech-Index(일반)](/corp/technology-evaluation/tech-index/general/customer-consent)
    - [Tech-Index(창업)](/corp/technology-evaluation/tech-index/startup/customer-consent)
    - [마이페이지 대표자 이력 고객정보활용동의](/corp/mypage/representative-history/customer-consent)
- 함께 작업: 위 · 아래 카드와 한 번에 적용(props 삭제라 함께 넣어야 빌드됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b7a9a8ceea4fa1cba3b90d4c3ecd501efcd15690)

### [컴포넌트] 고객정보활용동의 — 전자서명 모달 연결 변경

- 대상: src/components/custom/customer-consent-agreement.tsx
- 변경:
    - ESignatureDialog 에 onCorporate · onPersonal 대신 onSubmit 연결
    - 주석: 이 자리에서 businessType · businessNumber · onCertify 를 넘기도록 [프론트엔드 연동] 갱신
- 결과: 인증을 모두 마치고 [제출하기]를 누르면 다음 단계로 이동
- 영향 화면: 위 카드와 같음
- 함께 작업: 위 두 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0528409ec1ce21fa03f5e3891a21ba53bedf835a)

### [화면] 전자서명 (법인기업) 확인 화면 — 제목 · 설명 변경

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/page.tsx
- 변경:
    - 제목: 전자서명 → 전자서명 (법인기업)
    - 설명: 확인용으로 공동인증서는 성공 · 금융인증서는 실패로 보인다는 안내 추가
- 결과: 확인 화면에서 성공 · 실패 흐름을 직접 눌러 볼 수 있음
- 영향 화면: [전자서명 (법인기업)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8bac090669914550f779b96f001e0751499e86ed)

## [신규 추가]

### [화면] 전자서명 확인 화면 4종 — 개인기업 · 인증서 선택 · 인증 완료 · 인증 실패

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/individual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/certificate-select/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/certified/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/certify-error/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/customer-consent/e-signature/individual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/customer-consent/e-signature/certificate-select/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/customer-consent/e-signature/certified/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/customer-consent/e-signature/certify-error/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/e-signature/individual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/e-signature/certificate-select/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/e-signature/certified/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/e-signature/certify-error/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/e-signature/individual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/e-signature/certificate-select/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/e-signature/certified/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/e-signature/certify-error/page.tsx
- 적용: 신규 파일 추가
- 내용: 모달만 열어 두고 확인하는 화면 16개(4종 × 4개 모형) · 투자모형 · Tech-Index 는 KTRS-FM 화면을 재수출
- 영향 화면: [전자서명 (개인기업)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/individual)
    - [인증서 선택](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/certificate-select)
    - [전자서명 (인증 완료)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/certified)
    - [전자서명 (인증 실패)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/certify-error)
- 함께 작업: 위 카드들 다음에 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6de2f4f807bfc9952ef801b164a7e86ade09777e)

# 작업: K-BIGx 기업혁신성장보고서 조회 — 본인확인 모달

## [Diff 확인]

### [컴포넌트] 본인 확인 모달(IdentityVerificationDialog) — 가입 정보 목록 선택으로

- 대상: src/components/composite/identity-verification-dialog.tsx
- 변경:
    - items: 필수 → 선택 — 넘기지 않으면 가입 정보 목록 없이 비밀번호 칸만
    - 주석: 쓰는 곳 두 가지(마이페이지 내 정보 · K-BIGx 보고서 조회) 정리
- 결과: 마이페이지 내 정보는 그대로 · K-BIGx 보고서 조회는 비밀번호 칸만 보임
- 영향 화면: [기업 내 정보](/corp/mypage/profile) (모양 그대로)
- 함께 작업: 아래 카드보다 먼저 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1b0b96849872c36bed6186f6cc916abcd5a16447)

## [신규 추가]

### [화면] 본인확인(인증번호) 확인 화면 — 기업 · 기관

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/identity-verification/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/identity-verification/page.tsx
- 적용: 신규 파일 추가
- 내용: 모달만 열어 두고 확인하는 화면 — 설명 "기업혁신성장보고서 조회 화면 진입시 노출되는 모달"
- 영향 화면: [기업 본인확인(인증번호)](/corp/k-bigx-report/innovation-growth-report/identity-verification)
    - [기관 본인확인(인증번호)](/org/k-bigx-report/innovation-growth-report/identity-verification)
- 함께 작업: 위 카드 다음에 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/057858ae2cc0c580d5fe62448b70c00aafd1476e)

# 작업: 문서

## [덮어쓰기]

### [문서] 퍼블리싱 인덱스 — 전자서명 · 본인확인 · 탄소 보완요청 팝업 행 추가 · 결제 완료 행 삭제

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용:
    - 기술평가 4개 모형: 전자서명 → 전자서명 (법인기업) 이름 변경 · 아래에 개인기업 · 인증서 선택 · 인증 완료 · 인증 실패 4행 추가
    - K-BIGx 보고서(기업 · 기관): 기업혁신성장보고서 조회 아래 '본인확인(인증번호)' 행 추가
    - 탄소: 로그인 아래 '선도기업 신청 보완요청 팝업' 행 추가(UIUX · 응용2 완료, 탄소 FO 인덱스와 맞춤)
    - 행 삭제: 기업 결제 완료(쓰지 않는 화면)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/158d17ecb098a19f4ecc7c48b09f7529437b0be7)

# 작업: 로그인 — 아이디 · 비밀번호 찾기 문구 · 기관 회원가입 모달 · 가입 대상 표

## [Diff 확인]

### [컴포넌트] 아이디 · 비밀번호 찾기 모달 — 서비스별 담당자 연락처로 문구 교체

- 대상: src/content/service/login.ts
    - src/components/composite/login-find-account-dialog.tsx
- 변경:
    - AS-IS: "아이디 비밀번호는 담당자 (111-111-1111)으로 문의하여주세요." 한 줄
    - TO-BE: "아이디·비밀번호 찾기는 담당자에게 문의 해주세요." / "담당자 기술평가 : 051-606-7398, K-BIGx 보고서 : 051-606-7596" 두 줄
    - login.ts: FIND_ACCOUNT_MESSAGE(안내 문장) · FIND_ACCOUNT_CONTACT_LABEL · FIND_ACCOUNT_CONTACTS(서비스 · 번호) 로 나눔
    - 좁은 화면: 연락처가 서비스 단위로 줄바꿈(번호 중간에서 끊기지 않음)
    - 기관회원 가입 안내의 임시 번호(111-111-1111)는 그대로
    - 주석: 임시 번호(LOGIN_CONTACT_NUMBER)와 확정 번호(FIND_ACCOUNT_CONTACTS)를 [프론트엔드 연동]에서 구분
- 결과: 아이디 · 비밀번호 찾기 모달에 기술평가 · K-BIGx 보고서 담당자 번호가 보임
- 영향 화면: [기관 로그인](/org/auth)
    - [기업 아이디 · 비밀번호 찾기](/corp/auth/find-account)
    - [기관 아이디 · 비밀번호 찾기](/org/auth/find-account)
- 함께 작업: 두 파일 한 번에 적용(새 상수를 가져다 씀)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f0223b55c09cfb61dd70df0cfbecb51e6ec85672)

### [컴포넌트] 로그인 화면 — 기관회원 [회원가입]이 가입 안내 모달을 열도록 수정

- 대상: src/components/custom/login-screen.tsx
- 변경:
    - AS-IS: 모달 열기가 문단 전체에 걸려 있어 [회원가입]을 눌러도 모달이 열리지 않음
    - TO-BE: SignUpNotice 에 wrapButton 추가 — 모달이 [회원가입] 버튼만 감쌈
    - 주석: [프론트엔드 연동]을 현재 동작에 맞게 갱신 — 기업 회원가입 주소만 임시값, 기관 [회원가입] · [찾기]는 모달이라 연동 없음
- 결과: 기관회원 탭의 [회원가입]을 누르면 기관회원 가입 안내 모달이 열림
- 영향 화면: [기관 로그인](/org/auth)
    - [기업 로그인](/corp/auth)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6086dccf6320b4c1f8c3d570ebdb7e870ae10624)

### [컴포넌트] 기관회원 가입 안내 모달 — 가입 대상 표만 가로 스크롤

- 대상: src/components/composite/login-agency-signup-guide-dialog.tsx
- 변경:
    - AS-IS: 모바일에서 표가 모달 폭에 눌려 칸이 글자 단위로 깨짐
    - TO-BE: 표 최소 폭 500(dialogTableClassName) · 표 상자만 가로 스크롤
    - 표 상자: 키보드로 밀 수 있게 포커스를 받고 "기관회원 가입 대상 표"로 읽힘
- 결과: 모바일은 표만 좌우로 밀어 확인 · 태블릿 · PC 는 표가 다 들어가 스크롤 없음
- 영향 화면: [기관 로그인](/org/auth)
    - [기관회원 가입 안내](/org/auth/agency-signup-guide)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/66e34eb99c052b8d53e45197a11e9a8288c8bc38)
