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

# 작업: 약정서 전자서명 — 법인인증 법인등록번호 · 개인인증 사업자등록번호 칸 삭제

## [Diff 확인]

### [컴포넌트] 전자서명 모달(ESignatureDialog) — 법인인증: 법인등록번호 입력 칸 삭제 · 개인인증: 사업자등록번호 칸 삭제

- 대상: src/components/composite/e-signature-dialog.tsx
- 변경:
    - 법인인증: 법인등록번호 입력 칸 삭제 → 사업자등록번호(읽기 전용)만 표시 · 안내 "사업자등록번호를 확인해 주세요." · 입력 없이 바로 [인증서로 인증하기]
    - 개인인증: 대표자 주민등록번호(앞 6 · 뒤 7, 뒷자리 가림)만 표시 — 사업자등록번호 칸 없음
    - 실패 문구 인증별로 구분: 법인인증 "사업자등록번호와 인증서 정보가 일치하지 않습니다. …" · 개인인증 "대표자 주민등록번호와 인증서 정보가 일치하지 않습니다. …"
    - 실패 표시: 법인인증은 사업자등록번호 칸, 개인인증은 주민등록번호 칸에 빨간 테두리 + 오류 문구 · 그 칸으로 포커스
    - onCertify: (method, registrationNumber, certificate) → onCertify({method, certificate, residentNumber}) — residentNumber 는 개인인증일 때만 있음
    - businessNumber: 선택(목업 기본값) → 필수(기본값 없음)
    - 타입: RegistrationNumber → ResidentNumber · CertifyRequest 추가
    - previewResult: registrationNumber → residentNumber · 모든 인증을 같은 결과로 시작(실패 화면에서 칩을 오가며 법인 · 개인 실패를 봄)
    - 주석: [프론트엔드 연동] 을 연결할 props → 함수 인자 → 이미 구현된 동작 순으로 정리
- 결과: 법인인증은 번호 입력 없이 인증, 개인인증은 주민등록번호를 넣고 인증 · 실패하면 인증별 문구로 안내
- 영향 화면: [KTRS-FM 고객정보활용동의](/corp/technology-evaluation/ktrs-fm/customer-consent)
    - [투자모형](/corp/technology-evaluation/investment-model/customer-consent)
    - [Tech-Index(일반)](/corp/technology-evaluation/tech-index/general/customer-consent)
    - [Tech-Index(창업)](/corp/technology-evaluation/tech-index/startup/customer-consent)
    - [마이페이지 대표자 이력 고객정보활용동의](/corp/mypage/representative-history/customer-consent)
- 함께 작업: 아래 두 카드와 한 번에 적용(businessNumber 필수 · props 이름 변경이라 함께 넣어야 빌드됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8fdd7b96932ce1eb580e5b4986c03c9538749db1)

### [컴포넌트] 고객정보활용동의 — 법인인증 · 개인인증 칸 삭제 반영

- 대상: src/components/custom/customer-consent-agreement.tsx
- 변경:
    - ESignatureDialog 에 businessNumber={PREVIEW_BUSINESS_NUMBER}(목업) 전달
    - 주석: businessNumber 목업 자리를 회원정보 값으로 바꾸도록 [프론트엔드 연동] 갱신
- 결과: 법인인증 화면에 사업자등록번호가 보임
- 영향 화면: 위 카드와 같음
- 함께 작업: 위 · 아래 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/542292ef2b5334ce1ad05be4b238cb7c30b5187f)

### [화면] 전자서명 확인 화면 4종 — 법인인증 · 개인인증 칸 삭제 반영

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/individual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/certified/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/certify-error/page.tsx
- 변경:
    - 4개 화면: businessNumber={PREVIEW_BUSINESS_NUMBER} 전달
    - 인증 완료 · 인증 실패: previewResult 의 registrationNumber(110111-1234567) → residentNumber(800101-1234567)
    - 인증 실패: 법인인증 · 개인인증 모두 실패 상태로 열림 — 칩을 눌러 각 실패 화면 확인(설명 문구 갱신)
- 결과: 인증 실패 화면에서 사업자등록번호 · 주민등록번호 실패를 모두 확인
- 영향 화면: [전자서명 (법인기업)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature)
    - [전자서명 (개인기업)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/individual)
    - [전자서명 (인증 완료)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/certified)
    - [전자서명 (인증 실패)](/corp/technology-evaluation/ktrs-fm/customer-consent/e-signature/certify-error)
- 함께 작업: 위 두 카드와 한 번에 적용 · 투자모형 · Tech-Index 확인 화면은 이 화면을 재수출하므로 따로 고칠 것 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b85df3dbae0438ec50290c79835af1e6c55beb2f)
