# 프론트엔드 표준 코드 컨벤션 (채널계)

출처: `채널계 프론트엔드 개발 표준 가이드 (v1, 2026.3)`.
이 프로젝트의 **모든 코드는 아래 규칙과 리뷰 절차를 통과해야** 병합될 수 있다.

> ## ⚠️ 예외: `src/components/ui/**` (shadcn vendored 원본)
>
> **이 문서의 규칙(ST/NA/NC/MD/CD)은 `src/components/ui/**` 에는 적용하지 않는다.** 이 폴더는 `npx shadcn add`
> 로 받은 **다운로드 순정 상태 그대로** 두는 vendored 코드다. 순정 코드에는 `as` 타입 단언([ST-002])·Tailwind
> 기본 팔레트·`function` 선언([MD-009])·2-space 포맷 등 이 컨벤션과 다른 부분이 있을 수 있는데, **그건 버그가
> 아니라 의도**다.
>
> **왜** — shadcn 이 업데이트될 때 우리 파일과의 **diff 가 "업스트림이 실제로 바꾼 것"만** 남아야 확인·반영이
> 쉽다. 우리가 규칙에 맞춰 손대면 매 업데이트가 diff·머지 충돌 범벅이 된다. 그래서 원본은 **손대지 않고**, 게이트
> (ESLint·Prettier·check:conventions)에서도 **면제**한다(typecheck 만 유지).
>
> **그럼 프로젝트 커스텀은 어디서?** — 색·크기 등 스타일은 `src/components/kit/<name>.tsx`(styled copy)에서만
> 한다. 화면·도메인 코드는 항상 `@/components/kit/*` 를 import 하고, `@/components/ui/*` 를 직접 쓰지 않는다.
> 이 kit/ 코드와 그 외 **모든 앱 코드에는 아래 규칙이 그대로 적용된다.** 자세한 내용: [SHADCN.md](SHADCN.md).

## 개발 원칙

코드를 작성하는 시간보다 **읽는 시간**이 길다.

- **가독성 우선** — 비전공자·업무담당자도 이해할 직관적 코드.
- **기술 독립성** — 비즈니스 로직/도메인은 특정 프레임워크·라이브러리에 종속되지 않는다.
- **테스트 용이성** — 모든 비즈니스 로직은 단위 테스트 가능하도록 의존성 주입(DI).
- **표준 준수** — 팀 컨벤션(필수)은 개인 선호보다 우선한다.

## 표준 기술 스택

| 구분       | 기술                     | 비고                           |
| ---------- | ------------------------ | ------------------------------ |
| 언어       | **TypeScript** 5.x+      | `strict` 적용 필수             |
| 프레임워크 | **Next.js** 15.x+        | App Router                     |
| 빌드도구   | **Yarn** 1.2x+           |                                |
| API        | **Swagger/Orval** 7.9.x+ | OpenAPI 기반 호출코드 자동생성 |
| 스타일     | **Tailwind CSS**         | `absolute` 사용 제한           |
| 컴포넌트   | **shadcn/ui**            | Headless                       |
| 아이콘     | **lucide-react**         | 표준 단일 아이콘 라이브러리    |
| 포맷팅     | **Prettier**             | IDE 자동 적용                  |

## 카테고리 & 접두사(Prefix)

규칙은 **필수(MUST)** / **권장(RECOMMENDED)** 으로 구분한다.

| Prefix | 의미                                          |
| ------ | --------------------------------------------- |
| **ST** | Strict Restriction — 일반적으로 금지되는 규칙 |
| **NA** | Next.js Architecture — 프레임워크·외부 통신   |
| **NC** | Naming Convention — 네이밍                    |
| **MD** | Method Design — 로직 설계                     |
| **CD** | Component & CSS Design — UI·스타일            |

---

## ST — Strict Restriction

- **[ST-001] `any` 타입 사용 금지 (MUST)** — 에러 검출을 무력화. 구체 타입/인터페이스 사용.
    ```ts
    const processData = (data: RequestData) => data.value * 2 // O
    const processData = (data: any) => data.value * 2 // X
    ```
- **[ST-002] `as`(Type Assertion) 사용 금지 (MUST)** — 런타임 에러 주원인. Type Guard로 검증.
    ```ts
    if (event.payload && typeof event.payload === 'object' && 'name' in event.payload) {
        const user: User = event.payload // O
    }
    const user = event.payload as User // X
    ```
- **[ST-003] 변수 재할당 및 `for`/`forEach` 지양 (권장)** — 불변성 유지, 람다(`map`/`reduce`).
    ```ts
    const total = prices.reduce((acc, p) => acc + p, 0) // O
    let total = 0
    prices.forEach((p) => (total += p)) // X
    ```
- **[ST-004] `height`/`width` 고정값 사용 금지 (MUST)** — 반응형 불가. `max-w`/`min-w`/`%`/브레이크포인트 사용.
    ```tsx
    <div className="w-full max-w-4xl min-h-[50vh] md:w-3/4" />    // O
    <div className="w-[800px] h-[600px]" />                       // X
    ```
- **[ST-005] Tailwind `absolute` 사용 지양 (권장)** — Flex/Grid + `relative` 우선.

## NA — Next.js Architecture

- **[NA-001] 외부 URL·엔드포인트는 환경변수 처리 (MUST)**
    ```ts
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/data` // O
    const apiUrl = 'https://api.domain.com/data' // X
    ```
- **[NA-002] API 통신은 orval 통한 백엔드 경유 (권장)** — 자동 생성 훅/함수만 사용.
- **[NA-003] 프론트엔드에서 직접 외부 API 호출 금지 (MUST)** — 인증키는 `NEXT_PUBLIC_`에 두지 않는다. 외부 요청은 백엔드(서버) 경유로 CORS·키 노출 차단.
- **[NA-004] `use client`/`use server` 분리 (권장)** — 무분별한 `use client` 금지. 상호작용(이벤트·Hook)에만 제한적 사용.
- **[NA-005] `<img>` 지양, `next/image` 사용 (MUST)** — 로컬 이미지는 정적 `import`.
    ```tsx
    import Image from "next/image";
    import logoImg from "@/public/assets/logo.png";
    <Image src={logoImg} alt="로고" placeholder="blur" />        // O
    <img src="/assets/logo.png" alt="로고" />                     // X
    ```
- **[NA-006] `<a>` 지양, `next/link` 사용 (MUST)** — (해시 앵커/외부 링크 제외)
    ```tsx
    import Link from 'next/link'
    ;<Link href="/dashboard">대시보드</Link> // O
    ```
- **[NA-007] 공통 컴포넌트(shadcn 등) 내부 코드 수정 금지 (MUST)** — `className`/`props`/`variant`로 외부 확장.
- **[NA-008] 아이콘은 `lucide-react` 사용 (MUST)** — 하드코딩 SVG·폰트 아이콘 금지.
    ```tsx
    import {CheckCircle} from 'lucide-react'
    ;<CheckCircle className="h-5 w-5 text-green-500" />
    ```
- **[NA-009] Tailwind 색상 하드코딩 금지 (MUST)** — Hex 대신 시맨틱 토큰만 사용.
    ```tsx
    <div className="bg-background text-destructive" />            // O
    <div className="bg-[#1e1e2f] text-red-500" />                 // X
    ```
- **[NA-010] 간격은 margin 남발 대신 Flex `gap`으로 제어 (권장)**
    ```tsx
    <div className="flex flex-col gap-4">…</div> // O
    ```

## NC — Naming Convention

- **[NC-001] 파일·디렉토리는 `kebab-case` (MUST)** — 예: `app/user-profile/page.tsx`.
- **[NC-002] Boolean은 `is`/`has`/`can` 접두사 (MUST)** — `const isLoading = true;`
- **[NC-003] 상수는 `SCREAMING_SNAKE_CASE` (MUST)** — `const MAX_UPLOAD_SIZE_MB = 10;`

## MD — Method Design

- **[MD-001] `const` 우선, `var` 금지 (MUST)** — 재할당 필요 시에만 `let`.
- **[MD-002] Truthy/Falsy 활용 (권장)** — `if (!list.length || !name)`.
- **[MD-003] Nullish Coalescing `??` 사용 (MUST)** — `0`·`""`를 살린다.
    ```ts
    const maxCount = inputCount ?? 10 // O (0 유지)
    const maxCount = inputCount || 10 // X (0이면 10)
    ```
- **[MD-004] Early Return 패턴 (권장)** — 중첩 `else` 지양, 예외를 최상단에서 처리.
- **[MD-005] `break`/`continue` 지양 (권장)** — 고차함수(`filter`/`map`/`some`/`every`).
- **[MD-006] 증감 연산자는 독립 라인 (MUST)** — `currentId += 1;` (`x++`를 식에 섞지 않음).
- **[MD-007] 변수는 사용 직전에 선언·초기화 (MUST)** — 최상단 몰아 선언 금지.
- **[MD-008] Optional Chaining `?.` 필수 (MUST)** — `company?.address?.zipCode`.
- **[MD-009] Arrow Function 지향 (MUST)** — `this` 바인딩 오염 방지. 컴포넌트도 `const X = () => {}`.
    ```ts
    const calculate = (a, b) => a + b // O
    function calculate(a, b) {
        return a + b
    } // X
    ```
- **[MD-010] Magic Number/String 지양 (MUST)** — 의미 있는 상수로 선언.
- **[MD-011] Deprecated 기능 금지 (MUST)** — 예: `substr` → `substring`/`slice`.

## CD — Component & CSS Design

- **[CD-001] CSS `!important` 금지 (MUST)** — `!bg-primary`도 금지. 선택자 구체성/클래스 조합으로 해결.
- **[CD-002] `z-index` 하드코딩 금지 (MUST)** — DOM 배치 순서 우선, 예외는 Portal 활용.

---

## PR 체크리스트

> 아래 항목은 **앱 코드·`kit/` 에만** 해당한다. `src/components/ui/**`(shadcn vendored 원본)는 검사 대상이 아니다
> (위 [예외](#️-예외-srccomponentsui-shadcn-vendored-원본) 참조).

- [ ] [ST-001/002] `any`·`as` 없음 (Type Guard 사용)
- [ ] [ST-004] 고정 `w-[px]`/`h-[px]` 없음 (반응형 단위)
- [ ] [NA-005/006/008] `<img>`→`next/image`, `<a>`→`next/link`, 아이콘 lucide-react
- [ ] [NA-009] 색상 Hex 하드코딩 없음 (시맨틱 토큰)
- [ ] [NC-001] 파일/폴더 kebab-case, [NC-002] Boolean is/has/can, [NC-003] 상수 SNAKE
- [ ] [MD-001] `const` 우선(`var` 없음), [MD-003] `??`, [MD-008] `?.`, [MD-009] Arrow Function
- [ ] [MD-010] Magic Number 없음, [MD-011] Deprecated API 없음
- [ ] [CD-001] `!important` 없음, [CD-002] `z-[숫자]` 하드코딩 없음
