import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'

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
    // Prettier 와 충돌하는 포맷팅 규칙 비활성화 — 반드시 마지막에 둔다. (포맷은 prettier 가 담당)
    prettier,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
])

export default eslintConfig
