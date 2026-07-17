import {readdirSync, readFileSync} from 'node:fs'
import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'

// ui/ 셸 중 "순정(다운로드 그대로)"인 파일만 lint 면제 대상으로 동적 수집한다.
// 판별 기준: theme/*.variants import 가 있으면 프로젝트가 손댄 셸(cva 추출) → 검사 대상.
// 목록을 손으로 관리하면 셸을 수정할 때마다 어긋나므로, import 여부로 기계 판별해 drift 를 없앤다.
const UI_DIR = 'src/components/ui'
const vanillaUiFiles = readdirSync(UI_DIR)
    .filter((name) => name.endsWith('.tsx'))
    .filter((name) => !readFileSync(`${UI_DIR}/${name}`, 'utf8').includes("from '@/components/theme/"))
    .map((name) => `${UI_DIR}/${name}`)

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // 웹 접근성(KWCAG 2.1 대응) 정적 검사 — docs/ACCESSIBILITY.md 참고.
    // eslint-config-next가 이미 jsx-a11y 플러그인을 등록하므로, 플러그인 재정의 없이 rules만 적용.
    // files 를 nextVitals 와 동일하게 맞춰야 한다 — 미지정 시 jsx-a11y 플러그인이 없는
    // 파일(예: .mjs 설정 파일)까지 이 config 가 적용 대상으로 잡혀 플러그인을 못 찾는 에러가 난다.
    {files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'], rules: jsxA11y.flatConfigs.recommended.rules},
    // CODE_CONVENTION 강제 — 위반 시 lint 실패(→ pre-push 차단). docs/CODE_CONVENTION.md 참고.
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'error', // [ST-001] any 금지
            // [ST-002] as 타입 단언 금지 — 타입가드 사용. as const 는 허용(const assertion).
            '@typescript-eslint/consistent-type-assertions': ['error', {assertionStyle: 'never'}],
        },
    },
    // .cjs 설정 파일은 강제 CommonJS 라 require() 가 필요하다 — typescript-eslint recommended 의
    // no-require-imports 는 files 제한 없이 전체 파일에 적용되므로 여기서만 끈다.
    {
        files: ['**/*.cjs'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    // 수정 셸(theme import 있는 ui 파일)은 lint 대상이지만, 셸 본문은 여전히 업스트림 코드다.
    // input-group 순정 셸의 "그룹 클릭 → 내부 input 포커스" 패턴이 jsx-a11y 2개 규칙에 걸리는데,
    // 셸에 disable 주석을 넣으면 업스트림 diff 가 오염되므로 config 레벨에서 해당 파일만 끈다.
    {
        files: ['src/components/ui/input-group.tsx'],
        rules: {
            'jsx-a11y/click-events-have-key-events': 'off',
            'jsx-a11y/no-noninteractive-element-interactions': 'off',
        },
    },
    // Prettier 와 충돌하는 포맷팅 규칙 비활성화 — 반드시 마지막에 둔다. (포맷은 prettier 가 담당)
    prettier,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        // shadcn vendored 중 "순정" 파일만 면제한다(SC-02) — 순정 코드는 as·기본 팔레트 등 프로젝트
        // 컨벤션과 다를 수 있다. cva 를 theme/ 로 추출한 "수정 셸"은 프로젝트가 유지보수하는 코드라
        // 검사 대상이다(목록은 위 vanillaUiFiles 가 theme import 여부로 자동 판별).
        ...vanillaUiFiles,
        // shadcn 이 함께 내려주는 순정 파일들.
        'src/lib/utils.ts',
        'src/hooks/use-mobile.ts',
        // 바닐라 cva 보관소(업데이트 diff 기준선) — 앱 코드가 아니다. vendor/shadcn-baseline/README.md 참조.
        'vendor/**',
    ]),
])

export default eslintConfig
