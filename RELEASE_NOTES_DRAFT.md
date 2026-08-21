# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.

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

### 고객정보활용동의 — [동의 후 인증서명]에 전자서명 모달 연결

- 대상: src/components/custom/customer-consent-agreement.tsx
- 변경: [동의 후 인증서명]이 곧바로 다음 단계로 가던 것을, 저장 뒤 약정서 전자서명 모달을 열도록 교체. 모달의 [법인인증]·[개인인증]은 둘 다 모달을 닫고 다음 단계로 보낸다
- 결과: 동의 폼을 함께 쓰는 다섯 화면(기술평가 KTRS-FM·투자모형·Tech-Index 일반/창업, 마이페이지 대표자 이력)에 한 번에 반영된다. 각 화면의 다음 단계 경로(nextHref)는 종전과 같다
- 연동: 두 인증은 외부 인증 연동 자리다. 법인·개인 각각의 인증서 절차와 "둘 다 마쳐야 완료" 규칙은 연동 때 이 자리에서 처리하고, 성공한 뒤 지금의 이동을 그대로 쓰면 된다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/80ecc7411da018d5c4f6add4d477fea50f588336)

## [신규 추가]

### 약정서 전자서명 모달 컴포넌트

- 대상: src/components/composite/e-signature-dialog.tsx
- 적용: Figma "[기술평가_공통모달] 약정서 전자서명"을 그대로 옮긴 모달 컴포넌트 신규 추가. 제목·닫기, 안내 두 줄(18px Bold), 점 목록 두 줄, 같은 폭의 [법인인증](tertiary)·[개인인증](primary) 버튼으로 구성
- 사용: 다섯 화면이 같은 모달을 써서 화면마다 두지 않고 공통 자리에 둔다. 트리거로 열 때는 children 을, 단독 화면처럼 처음부터 열어 둘 때는 defaultOpen 을, 바깥에서 여닫을 때는 open·onOpenChange 를 넘긴다

### 전자서명 모달 단독 화면 — 기술평가 네 모형·마이페이지 대표자 이력

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/e-signature/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/customer-consent/e-signature/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/e-signature/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/e-signature/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/customer-consent/electronic-signature/page.tsx
- 적용: 화면정의서에 있으나 비어 있던 전자서명 하위 화면 다섯 개를 신규 추가. KTRS-FM 것이 본체이고 나머지 넷은 그 page 를 재수출하는 얇은 화면이라 구현 파일은 하나다
- 주의: 위 [신규 추가] 모달 컴포넌트가 함께 있어야 한다 — 다섯 화면이 모두 그 컴포넌트를 가져다 쓴다

## [덮어쓰기]

### 퍼블리싱 인덱스 — 전자서명 화면 5건 완료 처리

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 화면 경로 정보(screen-registry.json)는 이번에 바뀌지 않았다 — 다섯 경로는 이미 등록돼 있었고 화면만 없던 상태였다
- 변경: 전자서명 다섯 행의 상태를 대기중에서 완료로 바꾸고, 화면 경로 상태의 구현 여부를 함께 반영(구현 210건 → 215건)
- 순서: 위 [신규 추가] 화면과 함께 반영해야 한다. 화면 없이 인덱스만 반영하면 완료로 표시된 행이 실제로는 비어 있다
