import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '색상 (Semantic)'}

// 각 슬롯에서 '실제로 쓰는' 대표 유틸리티 하나만 노출한다 — bg-/text-/border- 를 다 나열하면
// text-background 처럼 안 쓰는 조합까지 보여 헷갈리기 때문. 유형별로:
//   -foreground(텍스트색) → text- · border/-border(테두리) → border- · ring/-ring(포커스링) → ring- ·
//   input(폼 테두리) → border- · 그 외(배경 표면) → bg-.
// 다른 접두사(outline-/divide-/fill-/stroke- 등)도 전부 유효하며(설명 참고) 필요하면 직접 붙여 쓴다.
// scroll-thumb/track 은 pseudo-element(::-webkit-scrollbar) 전용이라 Tailwind 유틸리티 자체가
// 없다(build-tokens.mjs 의 NO_UTILITY_SLOTS) — CSS 안에서 var() 로 직접 참조하는 게 유일한 사용법이라
// 복사값도 유틸리티 클래스가 아니라 그 CSS 변수 자체로 보여준다.
// 테두리 전용 색 슬롯 — 이름에 'border' 를 넣으면 유틸이 border-border-* 로 이중접두라, 슬롯명엔 border 를
// 빼고(예: subtle-1) 유틸 표기만 border- 로 강제한다 → border-subtle-1.
const BORDER_TONE_SLOTS = new Set(['subtle-1', 'subtle-2', 'subtle-3'])
const utilClasses = (name: string): string[] => {
    if (name === 'scroll-thumb' || name === 'scroll-track') return [`var(--ds-${name})`]
    if (name === 'foreground' || name.endsWith('-foreground') || name.startsWith('foreground-')) return [`text-${name}`]
    if (name === 'border' || name.endsWith('-border') || BORDER_TONE_SLOTS.has(name)) return [`border-${name}`]
    if (name === 'ring' || name.endsWith('-ring')) return [`ring-${name}`]
    if (name === 'input') return [`border-${name}`]
    return [`bg-${name}`]
}

// 앱이 실제로 쓰는 시맨틱 토큰(--ds → bg-*/text-* 유틸)을 tokens.json 에서 그대로 문서화한다.
// 인덱싱 타입 오류를 피하려고 Record 로 받는다(값 형태는 build-tokens 검증이 보장).
const scale: number[] = tokens.scale
const primitive: Record<string, Record<string, string>> = tokens.primitive
const common: Record<string, string> = tokens.common
const semantic: Record<string, string | {light: string; dark: string}> = tokens.semantic

// 다크 위치반사(생성기와 동일 규칙): 스케일 배열에서 대칭 위치.
const mirror = (step: number): number => scale[scale.length - 1 - scale.indexOf(step)]

// 투명 값(alpha) 뒤에 깔 체커보드 (토큰 뷰어 인라인 var 은 PB-12 허용).
// --raw-* 는 모드에 안 뒤집히는 고정 프리미티브라 라이트/다크 어디서든 동일한 '투명 표시' 체커가 된다.
const CHECKERBOARD =
    'repeating-conic-gradient(var(--raw-gray-300) 0% 25%, var(--raw-common-white) 0% 50%) 0 0 / 8px 8px'

// 참조("gray.900"·"common.white"·"black.75") → CSS 색. alpha(black/white)는 rgba, 그 외는 hex.
const rawColor = (ref: string): string => {
    if (ref === 'transparent' || ref === 'currentColor') return ref
    const [hue, step] = ref.split('.')
    if (hue === 'black' || hue === 'white') {
        return `rgba(${hue === 'black' ? '0, 0, 0' : '255, 255, 255'}, ${Number(step) / 100})`
    }
    return hue === 'common' ? common[step] : primitive[hue][step]
}

// 문자열 ref = 다크 자동 반사, {light,dark} = 명시값 → 모드별 색으로 해석
const resolveModes = (val: string | {light: string; dark: string}): {light: string; dark: string} => {
    if (typeof val !== 'string') {
        return {light: rawColor(val.light), dark: rawColor(val.dark)}
    }
    const [hue, step] = val.split('.')
    return {light: rawColor(val), dark: rawColor(`${hue}.${mirror(Number(step))}`)}
}

// 참조 primitive 표기 — 문자열은 "라이트 → 다크(반사)", 객체는 "light / dark".
const refLabel = (val: string | {light: string; dark: string}): string => {
    if (typeof val !== 'string') {
        return `${val.light} / ${val.dark}`
    }
    const [hue, step] = val.split('.')
    return `${val} → ${hue}.${mirror(Number(step))} (반사)`
}

// 표기용 rgba 문자열 — hex 는 변환, 이미 rgba(alpha)면 그대로.
const toRgbaText = (color: string): string => {
    if (!color.startsWith('#')) return color
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 1)`
}

// '현재' 칸 배경 유틸리티 클래스 — Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔하므로
// `bg-${name}` 처럼 동적으로 조합하면 생성되지 않는다. 이 페이지가 보여주는 슬롯(표준 32 + 커스텀 22)을 전부
// 리터럴로 나열한다(컴포넌트 레시피 토큰 button-*/checkbox-*/radio-*/badge-* 는 제외). scroll-thumb/track 은
// pseudo-element 전용이라 --color-* 유틸이 없어(build-tokens.mjs 의 NO_UTILITY_SLOTS) var() 임의값으로 참조한다.
const LIVE_SWATCH_CLASS: Record<string, string> = {
    background: 'bg-background',
    surface: 'bg-surface',
    foreground: 'bg-foreground',
    'foreground-subtle': 'bg-foreground-subtle',
    'label-foreground': 'bg-label-foreground',
    placeholder: 'bg-placeholder',
    card: 'bg-card',
    'card-foreground': 'bg-card-foreground',
    popover: 'bg-popover',
    'popover-foreground': 'bg-popover-foreground',
    primary: 'bg-primary',
    'primary-foreground': 'bg-primary-foreground',
    secondary: 'bg-secondary',
    'secondary-foreground': 'bg-secondary-foreground',
    muted: 'bg-muted',
    'muted-foreground': 'bg-muted-foreground',
    accent: 'bg-accent',
    'accent-foreground': 'bg-accent-foreground',
    'accent-subtle': 'bg-accent-subtle',
    'accent-strong': 'bg-accent-strong',
    destructive: 'bg-destructive',
    'destructive-foreground': 'bg-destructive-foreground',
    success: 'bg-success',
    'success-foreground': 'bg-success-foreground',
    warning: 'bg-warning',
    'warning-foreground': 'bg-warning-foreground',
    error: 'bg-error',
    'error-foreground': 'bg-error-foreground',
    info: 'bg-info',
    'info-foreground': 'bg-info-foreground',
    'primary-subtle': 'bg-primary-subtle',
    'secondary-green-subtle': 'bg-secondary-green-subtle',
    'secondary-orange-subtle': 'bg-secondary-orange-subtle',
    border: 'bg-border',
    'subtle-1': 'bg-subtle-1',
    'subtle-2': 'bg-subtle-2',
    'subtle-3': 'bg-subtle-3',
    input: 'bg-input',
    ring: 'bg-ring',
    'chart-1': 'bg-chart-1',
    'chart-2': 'bg-chart-2',
    'chart-3': 'bg-chart-3',
    'chart-4': 'bg-chart-4',
    'chart-5': 'bg-chart-5',
    sidebar: 'bg-sidebar',
    'sidebar-foreground': 'bg-sidebar-foreground',
    'sidebar-primary': 'bg-sidebar-primary',
    'sidebar-primary-foreground': 'bg-sidebar-primary-foreground',
    'sidebar-accent': 'bg-sidebar-accent',
    'sidebar-accent-foreground': 'bg-sidebar-accent-foreground',
    'sidebar-border': 'bg-sidebar-border',
    'sidebar-ring': 'bg-sidebar-ring',
    'scroll-thumb': 'bg-[var(--ds-scroll-thumb)]',
    'scroll-track': 'bg-[var(--ds-scroll-track)]',
}

// 맨 앞 '현재' 칸 — 실제 토큰을 현재 테마로 렌더. 다크 토글 시 실제로 바뀐다(파이프라인 검증).
const LiveSwatch = ({name}: {name: string}) => (
    <span
        aria-hidden="true"
        className="border-border size-icon-lg relative block shrink-0 overflow-hidden rounded border"
        style={{background: CHECKERBOARD}}
    >
        <span className={`absolute inset-0 ${LIVE_SWATCH_CLASS[name]}`} />
    </span>
)

// 정적 모드값 칸 — 해석된 색 스와치 + rgba 표기(모드 무관 고정 표시).
const ModeSwatch = ({color}: {color: string}) => (
    <span className="flex items-center gap-3">
        <span
            aria-hidden="true"
            className="border-border size-icon-md relative shrink-0 overflow-hidden rounded border"
            style={{background: CHECKERBOARD}}
        >
            <span className="absolute inset-0" style={{background: color}} />
        </span>
        <span className="typo-caption-regular text-muted-foreground font-mono whitespace-nowrap">
            {toRgbaText(color)}
        </span>
    </span>
)

type SemanticEntry = [string, string | {light: string; dark: string}]
type Group = {name: string; match: (n: string) => boolean}

// shadcn 공식 표준 슬롯 (https://ui.shadcn.com/docs/theming) — 생성기의 SHADCN_SLOTS 와 동일한 32개.
// 이 목록에 있으면 '표준', 없으면 '커스텀'으로 분류한다.
const STANDARD_SLOTS = new Set([
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
    'sidebar',
    'sidebar-foreground',
    'sidebar-primary',
    'sidebar-primary-foreground',
    'sidebar-accent',
    'sidebar-accent-foreground',
    'sidebar-border',
    'sidebar-ring',
])

// 컴포넌트 전용 레시피 토큰(button-*/checkbox-*/radio-*/badge-*)은 일반 색 슬롯이 아니라 특정 컴포넌트
// 내부에서만 쓰는 값이라 이 색 개요 페이지에서는 제외한다(각 컴포넌트 가이드에서 다룸).
const isComponentRecipe = (n: string): boolean => /^(button|checkbox|radio|badge)-/.test(n)

// 슬롯 가족(테이블) 정의 — 표준/커스텀 각각. 각 슬롯은 자기 버킷 안에서 한 가족에만 속한다.
const STANDARD_GROUPS: Group[] = [
    {name: 'background', match: (n) => n === 'background'},
    {name: 'foreground', match: (n) => n === 'foreground'},
    {name: 'card / card-foreground', match: (n) => n === 'card' || n === 'card-foreground'},
    {name: 'popover / popover-foreground', match: (n) => n === 'popover' || n === 'popover-foreground'},
    {name: 'primary / primary-foreground', match: (n) => n === 'primary' || n === 'primary-foreground'},
    {name: 'secondary / secondary-foreground', match: (n) => n === 'secondary' || n === 'secondary-foreground'},
    {name: 'muted / muted-foreground', match: (n) => n === 'muted' || n === 'muted-foreground'},
    {name: 'accent / accent-foreground', match: (n) => n === 'accent' || n === 'accent-foreground'},
    {name: 'destructive / destructive-foreground', match: (n) => n === 'destructive' || n === 'destructive-foreground'},
    {name: 'border', match: (n) => n === 'border'},
    {name: 'input', match: (n) => n === 'input'},
    {name: 'ring', match: (n) => n === 'ring'},
    {name: 'chart-1~5', match: (n) => n.startsWith('chart-')},
    {name: 'sidebar (+ 세부 7)', match: (n) => n.startsWith('sidebar')},
]
const CUSTOM_GROUPS: Group[] = [
    {name: 'foreground-subtle', match: (n) => n === 'foreground-subtle'},
    {name: 'primary-subtle', match: (n) => n === 'primary-subtle'},
    {name: 'accent-subtle / accent-strong', match: (n) => n === 'accent-subtle' || n === 'accent-strong'},
    {
        name: 'secondary-green-subtle / secondary-orange-subtle',
        match: (n) => n === 'secondary-green-subtle' || n === 'secondary-orange-subtle',
    },
    {name: 'subtle-1 / subtle-2 / subtle-3', match: (n) => BORDER_TONE_SLOTS.has(n)},
    {
        name: '상태 (success / warning / error / info)',
        match: (n) => ['success', 'warning', 'error', 'info'].some((s) => n === s || n === `${s}-foreground`),
    },
    {name: 'scroll-thumb / scroll-track', match: (n) => n === 'scroll-thumb' || n === 'scroll-track'},
    {name: '기타', match: () => true}, // 안전망 — 위에서 안 잡힌 커스텀 슬롯이 있으면 여기로.
]

// 각 슬롯은 '첫 매칭' 그룹 하나에만 속한다(catch-all 기타가 앞 그룹과 중복 수집하지 않도록).
const groupBy = (groups: Group[], entries: SemanticEntry[]) => {
    const firstMatch = (name: string) => groups.find((group) => group.match(name))?.name
    return groups
        .map((group) => ({name: group.name, tokens: entries.filter(([name]) => firstMatch(name) === group.name)}))
        .filter((group) => group.tokens.length > 0)
}

// 컴포넌트 레시피 토큰 제외 후, 표준/커스텀으로 나눠 각각 가족별 테이블로 묶는다.
const shownEntries: SemanticEntry[] = Object.entries(semantic).filter(([name]) => !isComponentRecipe(name))
const standardEntries = shownEntries.filter(([name]) => STANDARD_SLOTS.has(name))
const customEntries = shownEntries.filter(([name]) => !STANDARD_SLOTS.has(name))
const STANDARD_GROUPED = groupBy(STANDARD_GROUPS, standardEntries)
const CUSTOM_GROUPED = groupBy(CUSTOM_GROUPS, customEntries)
const STANDARD_COUNT = standardEntries.length
const CUSTOM_COUNT = customEntries.length

// 그룹 하나 = 독립 테이블. 현재(라이브)·클래스(클릭 복사)·라이트·다크·참조 primitive.
// usage: 이 슬롯(그룹)이 화면 어디에 쓰이는 색인지 간결한 사용처 설명(제목 아래 서브텍스트).
// note: 특수 동작 부연(예: scroll 은 유틸리티가 아닌 이유).
const SemanticTable = ({
    title,
    tokens,
    usage,
    note,
}: {
    title: string
    tokens: SemanticEntry[]
    usage?: ReactNode
    note?: ReactNode
}) => (
    <section className="flex flex-col gap-2">
        <h3 className="typo-body-l-medium text-foreground font-semibold">{title}</h3>
        {usage && <p className="typo-caption-regular text-muted-foreground">{usage}</p>}
        {note && <p className="typo-caption-regular text-muted-foreground">{note}</p>}
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-border border-b">
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            현재
                        </th>
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            클래스 (클릭 복사)
                        </th>
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            라이트
                        </th>
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            다크
                        </th>
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            참조 primitive
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map(([name, val]) => {
                        const modes = resolveModes(val)
                        return (
                            <tr key={name} className="border-border hover:bg-card border-b transition-colors">
                                <td className="px-3 py-3">
                                    <LiveSwatch name={name} />
                                </td>
                                <th scope="row" className="px-3 py-3 text-left">
                                    <span className="flex flex-wrap items-center gap-1.5">
                                        {utilClasses(name).map((cls) =>
                                            // var(--ds-*) 참조는 유틸리티 클래스가 아니라 CSS 변수라 복사 대상이
                                            // 아니다 — 칩 대신 변수명만 평문으로 노출한다(scroll-thumb/track).
                                            cls.startsWith('var(') ? (
                                                <span
                                                    key={cls}
                                                    className="typo-caption-regular text-foreground font-mono"
                                                >
                                                    {cls.slice(4, -1)}
                                                </span>
                                            ) : (
                                                <CopyChip key={cls} value={cls} />
                                            ),
                                        )}
                                    </span>
                                </th>
                                <td className="px-3 py-3">
                                    <ModeSwatch color={modes.light} />
                                </td>
                                <td className="px-3 py-3">
                                    <ModeSwatch color={modes.dark} />
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-3 py-3 font-mono whitespace-nowrap">
                                    {refLabel(val)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </section>
)

// 그룹별 사용처 설명 — 각 시맨틱 슬롯이 화면 어디에 쓰이는 색인지 간결히. 채워진 그룹만 표기한다.
const GROUP_USAGE: Record<string, ReactNode> = {
    background: (
        <>
            페이지·앱의 가장 바닥 배경색 — <code className="font-mono">&lt;body&gt;</code> 와 최상위 레이아웃의 기본
            바탕(gray.50). 그 위에 <code className="font-mono">card</code>·<code className="font-mono">popover</code>·
            <code className="font-mono">sidebar</code> 등 다른 표면이 얹힌다.
        </>
    ),
    foreground: (
        <>
            배경 위 <strong>기본 텍스트색</strong> — <code className="font-mono">text-foreground</code>(gray.900,
            제목·강조·본문). 다크는 밝은 톤으로 자동 반사. 비활성은{' '}
            <code className="font-mono">disabled:opacity-50</code>, 색 있는 텍스트는{' '}
            <code className="font-mono">text-primary</code>·<code className="font-mono">text-error</code> 등 해당 슬롯.
            더 흐린 보조 텍스트는 커스텀 <code className="font-mono">foreground-subtle</code>(아래).
        </>
    ),
    'card / card-foreground': (
        <>
            바탕 위에 얹는 <strong>담긴 콘텐츠 블록(카드·패널)</strong> — 통계 카드, 항목 박스, 섹션 패널 등 표면에{' '}
            <code className="font-mono">bg-card</code>, 그 안 텍스트에{' '}
            <code className="font-mono">text-card-foreground</code>(값은 <code className="font-mono">foreground</code>와
            동일). 역할이 &lsquo;바닥&rsquo;이 아니라 &lsquo;그 위에 올린 면&rsquo;이라 별도 슬롯으로 둔다.
        </>
    ),
    'muted / muted-foreground': (
        <>
            시선을 덜 끄는 <strong>보조 표면</strong> — <strong>비활성 입력 필드 배경</strong>, 헤더 드롭다운·토글·표
            행의 <strong>hover/선택</strong>, 스켈레톤 로딩 등에 <code className="font-mono">bg-muted</code>. 짝인{' '}
            <code className="font-mono">muted-foreground</code> 는 캡션·placeholder·도움말처럼{' '}
            <strong>덜 중요한 보조 텍스트</strong>에 쓰는 흐린 글자색(
            <code className="font-mono">text-muted-foreground</code>)이다.
        </>
    ),
    'primary / primary-foreground': (
        <>
            브랜드·주요 액션 색 — <code className="font-mono">bg-primary</code>(blue.600 솔리드)는 주요
            버튼·링크·강조에, <code className="font-mono">text-primary-foreground</code> 는 그 위 텍스트에 쓴다. 다크는
            각각 자동 반사. 옅은 브랜드 틴트 표면은 커스텀 <code className="font-mono">primary-subtle</code>(아래).
        </>
    ),
    'accent / accent-foreground': (
        <>
            중립 하이라이트 — <code className="font-mono">bg-accent</code>(gray.100)는 메뉴·옵션·ghost 버튼에서
            hover/선택된 항목을 칠하는 표준 하이라이트, <code className="font-mono">text-accent-foreground</code> 는 그
            위 텍스트. 더 옅거나 진한 중립 표면 레벨은 커스텀 <code className="font-mono">accent-subtle</code>/
            <code className="font-mono">accent-strong</code>(아래).
        </>
    ),
    'destructive / destructive-foreground': (
        <>
            <strong>위험/삭제 액션</strong>의 단색 빨강 — 삭제 버튼(
            <code className="font-mono">&lt;Button variant=&quot;destructive&quot;&gt;</code>)·되돌릴 수 없는 동작에{' '}
            <code className="font-mono">bg-destructive</code>(error.600) +{' '}
            <code className="font-mono">text-destructive-foreground</code>(흰). 상태 표시(배너·배지)용 오류색은 커스텀{' '}
            <strong>상태</strong> 섹션의 <code className="font-mono">bg-error</code> 를 쓴다(역할이 다름 — 버튼 vs 상태
            표면).
        </>
    ),
    'secondary / secondary-foreground': (
        <>
            보조(secondary) 색 — <code className="font-mono">bg-secondary</code>(회색 중립 표면)·
            <code className="font-mono">text-secondary-foreground</code> 는 shadcn 표준 보조 버튼·칩. 초록·주황 옅은
            틴트 표면은 커스텀 <code className="font-mono">secondary-green-subtle</code>/
            <code className="font-mono">-orange-subtle</code>(아래).
        </>
    ),
    border: (
        <>
            일반 <strong>테두리·구분선</strong> 색 — 카드·패널 외곽선, 표(Table) 구분선,{' '}
            <code className="font-mono">Separator</code>, 섹션 경계 등에{' '}
            <code className="font-mono">border-border</code>
            (거의 모든 컴포넌트 기본 테두리, gray.700). 더 옅은 테두리는 커스텀{' '}
            <code className="font-mono">subtle-1/2/3</code>(아래).
        </>
    ),
    input: (
        <>
            <strong>폼 컨트롤 테두리</strong> 색 — Input·Textarea·Select 등 입력 요소의 테두리에{' '}
            <code className="font-mono">border-input</code>. 일반 테두리(<code className="font-mono">border</code>)와
            구분되는 폼 전용 테두리색이라, 인풋만 다른 톤으로 조정할 수 있다.
        </>
    ),
    ring: (
        <>
            <strong>키보드 포커스 링</strong> 색 — 버튼·인풋·링크 등 상호작용 요소가 포커스될 때 두르는 링에{' '}
            <code className="font-mono">focus-visible:ring-ring</code>. 키보드 접근성(KWCAG 6.1.2)의 포커스 표시라 모든
            인터랙티브 요소에 필수다.
        </>
    ),
    // ── 아래는 shadcn 표준에 없는 프로젝트 커스텀 슬롯 ──
    'foreground-subtle': (
        <>
            <strong>덜 중요한 보조 텍스트</strong>색(gray.500) — 캡션·placeholder·도움말 등에{' '}
            <code className="font-mono">text-foreground-subtle</code>. 다크 자동 반사. 표준{' '}
            <code className="font-mono">foreground</code> 의 프로젝트 확장(보조 톤).
        </>
    ),
    'primary-subtle': (
        <>
            <strong>옅은 브랜드 틴트 표면</strong>(blue.50) — 선택·강조 패널 등에{' '}
            <code className="font-mono">bg-primary-subtle</code>. 표준 <code className="font-mono">primary</code>
            (솔리드)와 별개 멤버. 다크 자동 반사.
        </>
    ),
    'accent-subtle / accent-strong': (
        <>
            중립 하이라이트(<code className="font-mono">accent</code>)의 <strong>표면 레벨 세분</strong> —{' '}
            <code className="font-mono">bg-accent-subtle</code>(gray.50, 더 옅음)·
            <code className="font-mono">bg-accent-strong</code>(gray.200, 더 진함). 디자인 gray-subtle-1/2/3 대응,
            문자열 ref라 다크에서 &lsquo;배경에 가까울수록 subtle&rsquo; 유지.
        </>
    ),
    'secondary-green-subtle / secondary-orange-subtle': (
        <>
            <strong>초록·주황 옅은 틴트 표면</strong>(각 hue 50 · 다크 900 반사) — 카테고리 카드·강조 패널에{' '}
            <code className="font-mono">bg-secondary-green-subtle</code>·
            <code className="font-mono">bg-secondary-orange-subtle</code>. 위 텍스트는{' '}
            <code className="font-mono">text-foreground</code> flip. 파랑 계열은{' '}
            <code className="font-mono">primary-subtle</code>.
        </>
    ),
    'subtle-1 / subtle-2 / subtle-3': (
        <>
            <strong>옅은 테두리</strong> 색 — <code className="font-mono">border-subtle-1</code>(gray.300)~
            <code className="font-mono">border-subtle-3</code>(gray.100), 다크는 모두 gray.500. 표준{' '}
            <code className="font-mono">border</code>(진한 기본)보다 옅게. 슬롯명에 border 를 빼 이중접두(
            <code className="font-mono">border-border-*</code>) 회피 →{' '}
            <code className="font-mono">border-subtle-1</code>.
        </>
    ),
    '상태 (success / warning / error / info)': (
        <>
            성공·경고·오류·정보 상태색 — <code className="font-mono">bg-success</code>·
            <code className="font-mono">bg-error</code> 등(진한 톤 700)은 배지·배너 등 <strong>상태 표면</strong>에,{' '}
            <code className="font-mono">text-success-foreground</code> 등은 일반 배경 위에서 바로 읽는{' '}
            <strong>상태 텍스트</strong>(에러 문구·안내 라벨)에 쓴다 — 대비쌍이 아니라 각각 독립적으로 쓰는 두 색이다.
            다크 자동 반사. 오류는 shadcn 표준 <code className="font-mono">destructive</code>(버튼용)와 구분되는{' '}
            <strong>status 전용</strong> 슬롯이다.
        </>
    ),
    'scroll-thumb / scroll-track': (
        <>
            스크롤바 색 — <code className="font-mono">::-webkit-scrollbar</code> 가상요소 전용이라{' '}
            <code className="font-mono">className</code> 을 못 붙인다. 그래서 <code className="font-mono">bg-*</code>{' '}
            유틸을 만들지 않고 <code className="font-mono">globals.css</code> 에서{' '}
            <code className="font-mono">var(--ds-scroll-*)</code> 로 직접 참조한다(여기선 변수명만 표기, 복사 대상
            아님).
        </>
    ),
}

// 색상(Semantic) — 앱이 실제로 쓰는 시맨틱 토큰(--ds). Figma 02 Semantic 그룹별로 표를 나눈다.
const SemanticColorGuidePage = () => (
    <GuidePage
        title="색상 (Semantic)"
        description={
            <>
                앱이 실제로 쓰는 시맨틱 색상 토큰을 그룹별 표로 정리했습니다. &ldquo;클래스&rdquo; 칸은 각 슬롯에서
                실제로 쓰는 대표 유틸리티 하나만 보여줍니다 — 배경은 <code className="font-mono">bg-</code>, 텍스트(
                <code className="font-mono">-foreground</code>)는 <code className="font-mono">text-</code>, 테두리는{' '}
                <code className="font-mono">border-</code>, 포커스 링은 <code className="font-mono">ring-</code>. 시맨틱
                슬롯은 실제로 <code className="font-mono">outline-</code>/<code className="font-mono">divide-</code>/
                <code className="font-mono">fill-</code>/<code className="font-mono">stroke-</code> 등 색을 받는
                유틸리티 접두사 13개 이상에서 전부 유효하니, 필요하면 같은 슬롯 이름에 원하는 접두사를 직접 붙여 쓰면
                됩니다.
            </>
        }
    >
        <div className="flex flex-col gap-12">
            {/* ① shadcn 표준 슬롯 체계 — 두 섹션 제목은 같은 위계(h2)라 표준/커스텀이 한눈에 구분된다. */}
            <section aria-labelledby="std-slots" className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h2 id="std-slots" className="typo-h4-bold text-foreground">
                        shadcn 표준 슬롯 <span className="text-muted-foreground font-normal">({STANDARD_COUNT}개)</span>
                    </h2>
                    <p className="typo-caption-regular text-muted-foreground">
                        아래 표들은 <strong>shadcn 공식 표준 슬롯 체계</strong>입니다(
                        <a
                            href="https://ui.shadcn.com/docs/theming"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            theming 문서
                        </a>{' '}
                        기준, 이름 고정·값만 프로젝트 매핑). 개수는 빌드가 강제해 하나라도 빠지면 실패합니다.
                    </p>
                </div>
                {STANDARD_GROUPED.map((group) => (
                    <SemanticTable
                        key={group.name}
                        title={group.name}
                        tokens={group.tokens}
                        usage={GROUP_USAGE[group.name]}
                    />
                ))}
            </section>

            {/* ② 프로젝트 커스텀 슬롯 — 표준에 없는 프로젝트 확장. */}
            <section aria-labelledby="custom-slots" className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h2 id="custom-slots" className="typo-h4-bold text-foreground">
                        프로젝트 커스텀 슬롯{' '}
                        <span className="text-muted-foreground font-normal">({CUSTOM_COUNT}개)</span>
                    </h2>
                    <p className="typo-caption-regular text-muted-foreground">
                        shadcn 표준에 없어 프로젝트가 추가한 슬롯입니다(보조 톤·틴트 표면·상태색·스크롤바). 컴포넌트
                        전용 레시피 토큰(<code className="font-mono">button-*</code>·
                        <code className="font-mono">checkbox-*</code>·<code className="font-mono">radio-*</code>·
                        <code className="font-mono">badge-*</code>)은 일반 색 슬롯이 아니라 각 컴포넌트 내부용이라
                        여기서 제외했고, 해당 컴포넌트 가이드에서 다룹니다.
                    </p>
                </div>
                {CUSTOM_GROUPED.map((group) => (
                    <SemanticTable
                        key={group.name}
                        title={group.name}
                        tokens={group.tokens}
                        usage={GROUP_USAGE[group.name]}
                    />
                ))}
            </section>
        </div>
    </GuidePage>
)

export default SemanticColorGuidePage
