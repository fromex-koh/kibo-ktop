# Git 워크플로 & 커밋 컨벤션

이 프로젝트의 **브랜치 전략과 커밋 메시지 포맷**을 정의한다. 팀 규모(현재 1인 → 추후 프론트엔드 개발자 합류)에 따라 브랜치 전략은 단계적으로 전환하지만, **커밋 메시지 포맷은 지금부터 항상 적용**한다.

> **적용 범위**: 이 문서는 코드/마크업 내용이 아니라 **작업 절차(브랜치·커밋)** 를 다룬다. `CODE_CONVENTION.md`(최우선) → `ACCESSIBILITY.md` → `PUBLISHING_CONVENTION.md` 로 이어지는 **내용 우선순위 체계와는 별개 축**이라, 그 순위에 끼워 넣지 않는다.

## 원칙

- 리뷰어가 없는 단계에서 PR을 강제하는 건 절차만 늘릴 뿐 실익이 없다 — **필요해지는 시점에 도입**한다.
- 반면 커밋 메시지 규칙은 팀 규모와 무관하게 유효하다 — 나중에 히스토리를 읽거나 합류한 개발자가 변경 이력을 파악할 때 그대로 도움이 된다.
- 한 커밋은 **의미 있는 변경 하나**를 담는다(여러 무관한 변경을 한 커밋에 섞지 않는다).

### 컨벤션 검토와의 관계

`CODE_CONVENTION.md`는 모든 코드가 규칙과 리뷰 절차를 통과해야 병합될 수 있다고 명시한다. 구체적인 검토 항목은 각 전용 문서의 체크리스트를 따른다.

- **1인 작업 단계(지금)**: PR이라는 형식적 절차는 없지만, 커밋 전에 자동 게이트와 각 전용 문서의 체크리스트를 스스로 검토한다.
- **팀 합류 후**: 아래 [전환 시점](#전환-시점-프론트엔드-개발자가-합류하면) 구조로 넘어가면 실제 PR + 타인 리뷰가 그 자리를 대신한다.

---

## 브랜치 전략

### 현재 (퍼블리셔 1인 + 개발자에게 단방향 공유)

작업(WIP)과 공유(안정)를 **두 브랜치로 분리**한다. 개발자가 언제 `main` 을 받아도 안정적이도록 하고, 공유 시점을 이력으로 남기기 위해서다.

| 브랜치 | 역할                                                              | 커밋                                       |
| ------ | ----------------------------------------------------------------- | ------------------------------------------ |
| `main` | 개발자에게 공유하는 **안정 브랜치**. 개발자가 pull/clone 하는 곳. | 직접 커밋하지 않는다(`work` 머지로만 갱신) |
| `work` | 퍼블리셔 **작업 브랜치**. 일상 작업·커밋은 여기서 한다.           | 직접 커밋                                  |

#### 공유 흐름

1. `work` 에서 작업하고 커밋·push 한다(자동 게이트가 push 를 검증).
2. 개발자에게 넘길 만한 지점이 되면 `work` 를 `main` 에 머지한다.
3. `main` push가 검증을 통과하면 GitHub Actions가 패치 버전을 올린 빈 릴리스 커밋과 태그(`vX.Y.Z`)를 만든다.
4. 자동화가 만든 **릴리스 커밋 + 태그가 "언제 무엇을 공유했는지" 이력**이다.

```bash
git switch work && git push               # 평소 작업
# 공유할 때:
git switch main
git merge --no-ff work -m "chore: work 공유 (화면 세트 …)"
git push origin main                       # 검증 후 다음 패치 태그 자동 생성
git switch work                            # 다시 작업 브랜치로 복귀
```

- **`--no-ff` 필수**: fast-forward 하면 머지 커밋이 안 생겨 "공유 지점"이 히스토리에서 흐려진다. 항상 머지 커밋을 남긴다.
- `.github/workflows/release-main.yml`은 최신 태그의 PATCH를 하나 올린다(예: `v0.1.0` → `v0.1.1`).
- 자동화는 검증이 성공한 경우에만 `chore(release): vX.Y.Z` 빈 커밋을 만들고 그 커밋에 주석 태그를 붙인다.
- 릴리스 커밋이 다시 `main` push 이벤트를 만들더라도, HEAD에 버전 태그가 있으면 즉시 종료하므로 중복 릴리스되지 않는다.
- 시작 페이지와 사이드바의 현재 버전은 동일한 Git 태그를 사용하므로 릴리스 커밋 빌드에서 함께 갱신된다.
- 개발자에겐 **`main` 만 받으면 된다**고 안내한다(`work` 는 진행 중이라 불안정).

### 전환 시점: 개발자가 이 저장소에 직접 커밋을 시작하면

양방향 협업(개발자도 커밋)이 되면 `work` 를 팀 공용 통합 브랜치로 승격하고 아래를 도입한다.

- `feature/<kebab-case>` 브랜치 + PR 리뷰
- GitHub 브랜치 보호 규칙(`main` 직접 push 금지, PR 필수)
- `.github/PULL_REQUEST_TEMPLATE.md` — [ACCESSIBILITY.md](ACCESSIBILITY.md)·[PUBLISHING_CONVENTION.md](PUBLISHING_CONVENTION.md)·[SHADCN.md](SHADCN.md)의 체크리스트를 반영

### 브랜치 명명 (MUST)

작업용 보조 브랜치를 추가로 만들 땐 파일명과 동일하게 **kebab-case**를 쓴다([CODE_CONVENTION.md](CODE_CONVENTION.md) `NC-001` 연계).

```
feature/screen-id-depth3
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

## 버전 관리 (SemVer + 자동 패치 태그)

버전의 **단일 소스는 git 태그**다(`package.json` 의 `version` 이 아님). 화면의 '현재 버전'은 빌드 시점에 `git describe --tags --always` 로 읽어 주입되므로, **태그를 붙이면 그 순간부터 화면에 `vX.Y.Z` 가 표시**된다(태그가 없으면 커밋 SHA).

### 버전 체계 — `vMAJOR.MINOR.PATCH` (예 `v1.4.9`)

| 자리      | 올리는 시점     | 이 프로젝트에서의 의미                                             | 대응 커밋 type           |
| --------- | --------------- | ------------------------------------------------------------------ | ------------------------ |
| **MAJOR** | 하위 호환 깨짐  | 토큰 구조·컨벤션의 큰 개편(`tokens.json` 스키마·브레이크포인트 등) | `BREAKING CHANGE:`       |
| **MINOR** | 기능 추가(호환) | 새 화면·컴포넌트·토큰 추가                                         | `feat`                   |
| **PATCH** | 버그·미세 수정  | 스타일 교정·오타·리팩터링                                          | `fix`/`style`/`refactor` |

### 태그 생성 방식

`work`를 `main`에 공유하면 GitHub Actions가 `yarn verify`를 실행하고, 성공한 경우 최신 태그의 PATCH를 하나 올린다.

```bash
v0.1.0 → v0.1.1 → v0.1.2
```

- 태그는 자동화가 만든 **`main`의 빈 릴리스 커밋**에 주석 태그(`-a`)로 붙는다.
- 배포는 최초 머지 커밋이 아니라 뒤이어 생성되는 `chore(release): vX.Y.Z` 커밋을 기준으로 완료되어야 한다.
- MAJOR·MINOR 변경은 자동 PATCH 릴리스 범위가 아니므로, 필요할 때 워크플로 입력을 확장하거나 담당자가 별도 릴리스 정책을 결정한다.

> 커밋 type을 분석해 MAJOR·MINOR·PATCH를 자동 결정해야 하는 시점에는 `semantic-release`로 승격할 수 있다. 지금의 `git describe` 주입 방식은 그대로 호환된다.

### 배포 연동

이 저장소는 릴리스 커밋과 태그 생성 및 빌드 시점 버전 주입까지 책임진다. 외부 배포 서비스는 자동화가 뒤이어 push하는 `chore(release): vX.Y.Z` 커밋을 최종 배포해야 한다. 해당 커밋은 태그와 같은 커밋이므로 시작 페이지와 사이드바에 정확한 버전이 표시된다.

### 퍼블리싱 인덱스의 자산별 버전 — git 히스토리에서 자동 계산

`퍼블리싱 인덱스` 표의 자산 버전(`components`·`cn(lib/utils)`·`tokens.json`·`globals.css`·`public`·`fonts` 등 — 목록은 `publishing-index.json` 의 `assetVersions` 가 단일 소스)은 **손으로 적지 않는다.** 각 `assetVersions[].path` 를 기준으로 `scripts/compute-asset-versions.mjs` 가 아래 규칙으로 계산해 `src/content/asset-versions.generated.json`(생성 파일, git 미추적)에 쓴다.

- 그 경로가 **마지막으로 바뀐 커밋**을 찾고, **그 변경을 포함하는 가장 가까운 태그**를 버전으로 표시한다.
- 아직 어떤 태그에도 포함되지 않았으면(직전 릴리스 이후 변경, 미공유) `미배포` 로 표시한다.
- 계산된 버전이 **현재 HEAD 버전과 같으면**(`isCurrent: true`) 표에서 하이라이트(배경색 + 아이콘 + `sr-only` 텍스트)된다 — 즉 **이번 공유(머지+태그)에서 실제로 바뀐 자산만 강조**되어 보인다.

새 자산을 표에 추가하려면 `publishing-index.json` 에 `{ name, path, kind }` 만 추가하면 된다(버전은 자동).

```bash
yarn asset-versions   # predev/prebuild/verify 에 이미 포함 — 수동 실행은 확인용
```

---

## 자동 게이트 — 컨벤션 위반 시 push 차단

리뷰어가 없는 1인 작업 단계에서도 컨벤션 준수를 보장하기 위해, **`git push` 시점에 검증이 자동 실행되고 하나라도 실패하면 push 가 거부**된다(Husky `pre-push` 훅 → `yarn verify`).

`yarn verify` 가 순서대로 실행하는 것:

| 단계 | 명령                     | 검사 내용                                                                                                                      |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1    | `yarn tokens`            | 디자인 토큰 스키마 검증과 CSS 생성. 대비 게이트는 light/dark 정합 완료 전까지 임시 비활성화                                    |
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
- `ACCESSIBILITY.md`·`PUBLISHING_CONVENTION.md`·`SHADCN.md`의 체크리스트 전 항목

## 커밋 전 체크리스트

- [ ] 한 커밋에 무관한 변경이 섞여 있지 않은가
- [ ] `type`이 실제 변경 성격과 맞는가 (`feat` vs `fix` vs `refactor` 혼동 주의)
- [ ] `subject`가 한글 명령형이고 마침표가 없는가
- [ ] 변경 이유가 코드만으로 드러나지 않는다면 `body`에 "왜"를 적었는가
- [ ] 자동 게이트(`yarn verify`)가 통과하는가 — push 시 자동 실행되지만, 미리 돌려두면 빠르다
- [ ] 위 "자동 게이트가 잡지 못하는 것"을 수동으로 확인했는가
