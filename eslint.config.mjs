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
    {rules: jsxA11y.flatConfigs.recommended.rules},
    // CODE_CONVENTION 강제 — 위반 시 lint 실패(→ pre-push 차단). docs/CODE_CONVENTION.md 참고.
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'error', // [ST-001] any 금지
            // [ST-002] as 타입 단언 금지 — 타입가드 사용. as const 는 허용(const assertion).
            '@typescript-eslint/consistent-type-assertions': ['error', {assertionStyle: 'never'}],
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
