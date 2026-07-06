# Git 워크플로 & 커밋 컨벤션

이 프로젝트의 **브랜치 전략과 커밋 메시지 포맷**을 정의한다. 팀 규모(현재 1인 → 추후 프론트엔드 개발자 합류)에 따라 브랜치 전략은 단계적으로 전환하지만, **커밋 메시지 포맷은 지금부터 항상 적용**한다.

> **적용 범위**: 이 문서는 코드/마크업 내용이 아니라 **작업 절차(브랜치·커밋)** 를 다룬다. `CODE_CONVENTION.md`(최우선) → `ACCESSIBILITY.md` → `PUBLISHING_CONVENTION.md` 로 이어지는 **내용 우선순위 체계와는 별개 축**이라, 그 순위에 끼워 넣지 않는다.

## 원칙

- 리뷰어가 없는 단계에서 PR을 강제하는 건 절차만 늘릴 뿐 실익이 없다 — **필요해지는 시점에 도입**한다.
- 반면 커밋 메시지 규칙은 팀 규모와 무관하게 유효하다 — 나중에 히스토리를 읽거나 합류한 개발자가 변경 이력을 파악할 때 그대로 도움이 된다.
- 한 커밋은 **의미 있는 변경 하나**를 담는다(여러 무관한 변경을 한 커밋에 섞지 않는다).

### `CODE_CONVENTION.md`·`ACCESSIBILITY.md` 의 "리뷰 절차/PR 체크리스트" 문구와의 관계

두 문서는 "모든 코드는 리뷰 절차·PR 체크리스트를 통과해야 병합된다"고 명시한다. 이건 **항상 유효한 요구사항**이고, 아래처럼 단계에 따라 통과 방식만 다르다.

- **1인 작업 단계(지금)**: PR이라는 형식적 절차는 없지만, 커밋 전에 각 문서 하단의 PR 체크리스트를 **스스로 검토·통과**시킨 뒤 커밋한다 — 즉 "리뷰"가 셀프 리뷰로 대체될 뿐, 체크리스트 통과 자체는 생략되지 않는다.
- **팀 합류 후**: 아래 [전환 시점](#전환-시점-프론트엔드-개발자가-합류하면) 구조로 넘어가면 실제 PR + 타인 리뷰가 그 자리를 대신한다.

---

## 브랜치 전략

### 현재 (퍼블리싱 작업자 1인)

- **`main` 브랜치 하나로 작업, 직접 커밋한다.** PR·리뷰 절차 없음.
- 필요하면 `feature/<kebab-case>` 브랜치를 짧게 쓸 수 있지만 선택 사항이다 — 혼자 작업할 땐 `main`에 바로 커밋해도 무방하다.

### 전환 시점: 프론트엔드 개발자가 합류하면

그 시점에 아래 구조(Git Flow 경량화 버전)를 도입한다. **미리 만들어두지 않는다** — 혼자인 지금 `develop`을 만들면 `main`과의 동기화만 신경 쓰는 불필요한 관리 부담이 된다.

| 브랜치                 | 역할                                     | 원본      | 병합 대상             |
| ---------------------- | ---------------------------------------- | --------- | --------------------- |
| `main`                 | 배포 가능한 안정 버전 (protected)        | —         | —                     |
| `develop`              | 통합 개발 브랜치 (기본 브랜치)           | `main`    | `main` (release 경유) |
| `feature/<kebab-case>` | 기능/화면 단위 작업                      | `develop` | `develop`             |
| `release/<version>`    | 릴리스 준비(문서·버전 고정, 버그만 수정) | `develop` | `main` + `develop`    |
| `hotfix/<kebab-case>`  | 운영 중 긴급 수정                        | `main`    | `main` + `develop`    |

전환하면서 함께 할 것:

- GitHub 브랜치 보호 규칙 설정(`main`·`develop` 직접 push 금지, PR 필수)
- `.github/PULL_REQUEST_TEMPLATE.md` 작성 — [CODE_CONVENTION.md](CODE_CONVENTION.md)·[ACCESSIBILITY.md](ACCESSIBILITY.md)·[PUBLISHING_CONVENTION.md](PUBLISHING_CONVENTION.md) 각 문서 하단의 PR 체크리스트를 템플릿에 반영

### 브랜치 명명 (MUST)

파일명과 동일하게 **kebab-case**를 쓴다([CODE_CONVENTION.md](CODE_CONVENTION.md) `NC-001` 연계).

```
feature/screen-id-depth3
release/1.5.0
hotfix/table-header-contrast
```

---

## 커밋 메시지 컨벤션 (지금부터 적용, MUST)

[Conventional Commits](https://www.conventionalcommits.org/)를 따르되, 이 프로젝트는 한글 팀이므로 `subject`/`body`는 한글로 쓴다.

```
<type>(<scope>): <subject>

<body>

<footer>
```

| 구성요소  | 필수 | 규칙                                                                          |
| --------- | ---- | ----------------------------------------------------------------------------- |
| `type`    | 필수 | 아래 목록 중 하나                                                             |
| `scope`   | 권장 | 영역명, kebab-case (예: `tokens`·`publishing-index`·`component-guide`·`home`) |
| `subject` | 필수 | 한글, 명령형("~추가"·"~수정"), 마침표 없음                                    |
| `body`    | 선택 | 한글. **무엇을**보다 **왜**를 설명. subject와 빈 줄로 구분                    |
| `footer`  | 선택 | `BREAKING CHANGE: ...` 등                                                     |

### type 목록

| type       | 의미                            |
| ---------- | ------------------------------- |
| `feat`     | 기능 추가                       |
| `fix`      | 버그 수정                       |
| `docs`     | 문서 변경                       |
| `style`    | 포맷팅 등 로직에 영향 없는 변경 |
| `refactor` | 동작은 그대로, 구조만 개선      |
| `perf`     | 성능 개선                       |
| `test`     | 테스트 추가·수정                |
| `chore`    | 빌드·설정·의존성 등 잡무        |
| `build`    | 빌드 시스템·외부 의존성 변경    |

### 예시

단순 변경(body 없음):

```
fix(publishing-index): 테이블 헤더 배경색을 카드와 동일하게 수정
```

기능 추가(body로 "왜" 설명):

```
feat(publishing-index): 사이트 구조 정보에 3뎁스 계층 지원

자가진단 > 자가진단 신청 > 평가모형 선택처럼 3단 이상 깊은 메뉴는
기존 1뎁스+세부항목 2단 구조로 표현할 수 없어, 뎁스별 컬럼을
분리해 실제 화면정의서 구조를 그대로 담을 수 있도록 함.
```

여러 파일에 걸친 구조 변경:

```
refactor(content): 홈·퍼블리싱 인덱스 데이터를 JSON 단일 소스로 분리

컴포넌트에 하드코딩돼 있던 텍스트·아이콘·화면 데이터를
src/content/*.json 으로 옮기고 타입가드로 검증. 프론트 개발자가
코드를 건드리지 않고 JSON만 수정해 화면 내용을 관리할 수 있게 함.
```

설정·잡무:

```
chore: 프로젝트명을 kibo-ktop으로 변경

package.json·README·홈 배지·저장소 URL 전체에 반영.
```

호환성이 깨지는 변경(`footer`의 `BREAKING CHANGE` 예시):

```
refactor(content): StructureRow.pageId 를 screenId 로 이름 변경

퍼블리싱 인덱스 컬럼명을 실무 표준 용어 "화면 ID"에 맞춰
필드명도 통일.

BREAKING CHANGE: publishing-index.json 의 row.pageId 필드가
row.screenId 로 이름이 바뀜. 기존 데이터를 쓰는 곳이 있다면
필드명 갱신 필요.
```

---

## 자동 게이트 — 컨벤션 위반 시 push 차단

리뷰어가 없는 1인 작업 단계에서도 컨벤션 준수를 보장하기 위해, **`git push` 시점에 검증이 자동 실행되고 하나라도 실패하면 push 가 거부**된다(Husky `pre-push` 훅 → `yarn verify`).

`yarn verify` 가 순서대로 실행하는 것:

| 단계 | 명령                     | 검사 내용                                                                                                                      |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1    | `yarn tokens`            | 디자인 토큰 생성 + **대비(PB-11) 검증** — 미달 시 실패                                                                         |
| 2    | `yarn lint`              | ESLint — **[ST-001] `any`·[ST-002] `as` 금지**, jsx-a11y 접근성 정적 검사                                                      |
| 3    | `yarn format:check`      | Prettier 포맷 일치                                                                                                             |
| 4    | `yarn check:conventions` | Tailwind 클래스 규칙 — hex 색상[NA-009]·고정 px[ST-004]·`!important`[CD-001]·`z-[]`[CD-002]·기본 팔레트[PB-05]·`<img>`[NA-005] |
| 5    | `yarn typecheck`         | `tsc --noEmit` 타입 오류                                                                                                       |

- 로컬에서 push 전에 미리 확인하려면 `yarn verify` 를 직접 실행한다.
- 훅을 우회(`--no-verify`)하지 않는다 — 게이트의 존재 이유가 사라진다.

### 자동 게이트가 잡지 못하는 것 (수동 확인 필수)

기계적으로 판별할 수 없는 규칙은 자동화 대상이 아니다. 커밋 전 아래를 **사람이** 확인한다.

- **[MD-010] Magic Number/String**, 가독성·네이밍의 적절성 등 판단이 필요한 코드 규칙
- **[NA-006] `<a>` vs `next/link`** — 외부링크·해시 앵커는 `<a>` 가 정당하므로 자동 판별에서 제외했다
- **[5.1.1] 대체 텍스트의 적절성**, **[5.3.3] 실제 색상 대비값** 등 `docs/ACCESSIBILITY.md` 의 `📄 콘텐츠 검수 필요` 항목
- 각 컨벤션 문서 하단의 **PR 체크리스트** 전 항목

## 커밋 전 체크리스트

- [ ] 한 커밋에 무관한 변경이 섞여 있지 않은가
- [ ] `type`이 실제 변경 성격과 맞는가 (`feat` vs `fix` vs `refactor` 혼동 주의)
- [ ] `subject`가 한글 명령형이고 마침표가 없는가
- [ ] 변경 이유가 코드만으로 드러나지 않는다면 `body`에 "왜"를 적었는가
- [ ] 자동 게이트(`yarn verify`)가 통과하는가 — push 시 자동 실행되지만, 미리 돌려두면 빠르다
- [ ] 위 "자동 게이트가 잡지 못하는 것"을 수동으로 확인했는가
