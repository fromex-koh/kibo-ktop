// CODE_CONVENTION / PUBLISHING_CONVENTION 중 ESLint 로 잡기 어려운 Tailwind 클래스 규칙을
// 정규식으로 정적 검사한다. 위반이 하나라도 있으면 exit 1 → pre-push 훅이 push 를 막는다.
//
// ⚠️ 자동 검사는 '기계적으로 판별 가능한' 규칙만 커버한다. Magic Number·가독성·대체 텍스트의
//    적절성 등은 사람이 판단해야 하므로 코드 리뷰에서 수동 확인한다.
//
// 검사 대상: src/**/*.{ts,tsx}. (docs/*.md 의 '나쁜 예시' 코드블록은 검사하지 않는다.)

import {readdirSync, readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {join, extname} from 'node:path'

const SRC_DIR = 'src'
const TARGET_EXT = new Set(['.ts', '.tsx'])
const CODE_CONVENTION_PATH = 'docs/CODE_CONVENTION.md'
const CODE_CONVENTION_SHA256 = '716d3050220913335f68cb77f575b84fc7c08d10137f112357e64b453f427167'

const codeConventionHash = createHash('sha256').update(readFileSync(CODE_CONVENTION_PATH)).digest('hex')

if (codeConventionHash !== CODE_CONVENTION_SHA256) {
    console.error(`\n❌ ${CODE_CONVENTION_PATH}는 원본 HWP 전용 잠금 문서이므로 수정할 수 없습니다.\n`)
    process.exit(1)
}

// [규칙ID, 설명, 정규식] — 각 소스 라인에 대해 test 한다.
const RULES = [
    {
        id: 'NA-009',
        desc: 'hex 색상 하드코딩 — 시맨틱 색상 토큰을 쓰세요',
        re: /\[#[0-9a-fA-F]{3,8}\]/,
    },
    {
        id: 'ST-004',
        desc: '고정 px 크기 — 반응형 단위(%/vh/max-w 등)를 쓰세요',
        re: /\b(?:w|h|min-w|max-w|min-h|max-h)-\[[\d.]+px\]/,
    },
    {
        id: 'SC-01',
        desc: 'arbitrary value 사용 — 토큰/기존 유틸리티를 쓰세요',
        // data-[state] 같은 arbitrary variant와 CSS 변수 기반 예외는 제외하고,
        // 기존 유틸리티로 대체 가능한 간격·링·위치·크기의 숫자/px/calc arbitrary value를 막는다.
        re: /\b(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy]|ring|top|right|bottom|left|inset(?:-[xy])?|w|h|min-w|min-h)-\[(?:-?[\d.]+(?:px|rem)?|calc\([^\]]+\))\]/,
    },
    {
        id: 'CD-001',
        desc: '!important 사용 금지 — 선택자 구체성/클래스 조합으로 해결하세요',
        re: /!important|(?<=[\s"'`])!(?:bg|text|border|ring|outline|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|h|gap|rounded|shadow|z|font|leading|tracking|opacity|flex|grid|from|to|via)-/,
    },
    {
        id: 'CD-002',
        desc: 'z-index 하드코딩 금지 — DOM 순서/Portal 로 해결하세요',
        re: /\bz-\[\d+\]/,
    },
    {
        id: 'PB-05',
        // 프로젝트 소유 10색(blue·navy·green·orange·grape·gray·success·warning·error·info)은 50~900 스케일로 허용.
        // 스케일이 Tailwind 기본(50~950)과 이름이 겹치므로, 소유하지 않은 기본 팔레트 휴(slate·red·amber·purple 등)와
        // 소유 휴의 950 스텝(프로젝트 최대 900 → 950 은 기본 팔레트 누수)만 차단한다.
        // (navy·grape 는 Tailwind 기본에 없는 이름이라 차단 목록/950 가드 어디에도 넣지 않는다 — 보라색 hue 는
        //  Tailwind 의 purple 과 철자가 겹쳐 유틸이 오탐되므로 grape 로 명명해 충돌을 피한다.)
        desc: 'Tailwind 기본 팔레트 키 사용 금지 — 프로젝트 팔레트(10색·50~900)/시맨틱 토큰을 쓰세요',
        re: /-(?:zinc|slate|neutral|stone|red|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|-(?:gray|blue|green|orange)-950\b/,
    },
    {
        id: 'NA-005',
        desc: '<img> 대신 next/image 를 쓰세요',
        re: /<img[\s>]/,
    },
]

// shadcn vendored 중 "순정" 파일만 컨벤션 검사에서 제외한다(SC-02) — 순정 코드는 기본 팔레트·
// arbitrary value 등 프로젝트 컨벤션과 다를 수 있다. cva 를 theme/ 로 추출한 "수정 셸"(theme import
// 가 있는 ui 파일)은 프로젝트가 유지보수하는 코드라 정상 검사한다(eslint.config.mjs 와 같은 판별).
// 프로젝트 스타일(components/theme/)은 항상 전체 검사 대상이다.
const norm = (p) => p.replace(/^src[/\\]/, '').replace(/\\/g, '/')
const SKIP_FILES = new Set(['lib/utils.ts', 'hooks/use-mobile.ts'])
// 메인페이지는 풀스크린 스택·뷰포트 비례 레이아웃이라 토큰만으로 표현할 수 없는 페이지 전용 계산을 허용한다.
// 다른 규칙과 다른 파일의 SC-01 검사는 그대로 유지한다.
const RULE_FILE_EXCEPTIONS = new Map([['SC-01', new Set(['app/component-guide/main-page/page.tsx'])]])
const UI_DIR_PREFIX = 'components/ui/'
const isVanillaUiFile = (full) =>
    norm(full).startsWith(UI_DIR_PREFIX) && !readFileSync(full, 'utf8').includes("from '@/components/theme/")

const collectFiles = (dir) => {
    const entries = readdirSync(dir, {withFileTypes: true})
    return entries.flatMap((entry) => {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) {
            return collectFiles(full)
        }
        if (SKIP_FILES.has(norm(full))) return []
        if (!TARGET_EXT.has(extname(entry.name))) return []
        if (isVanillaUiFile(full)) return []
        return [full]
    })
}

const files = collectFiles(SRC_DIR)
const violations = files.flatMap((file) => {
    const lines = readFileSync(file, 'utf8').split('\n')
    return lines.flatMap((line, i) =>
        RULES.filter((rule) => !RULE_FILE_EXCEPTIONS.get(rule.id)?.has(norm(file)) && rule.re.test(line)).map(
            (rule) => ({
                file,
                line: i + 1,
                rule,
                snippet: line.trim(),
            }),
        ),
    )
})

if (violations.length === 0) {
    console.log(`✅ 컨벤션 검사 통과 (검사 파일 ${files.length}개)`)
    process.exit(0)
}

console.error(`\n❌ 컨벤션 위반 ${violations.length}건 발견:\n`)
violations.forEach(({file, line, rule, snippet}) => {
    console.error(`  ${file}:${line}  [${rule.id}] ${rule.desc}`)
    console.error(`    → ${snippet}\n`)
})
console.error('위반을 수정한 뒤 다시 커밋/푸시하세요.\n')
process.exit(1)
