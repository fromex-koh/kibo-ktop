import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '색상 (Semantic)'}

// 시맨틱 색상 슬롯 하나는 --color-* 브리지를 거쳐 색을 받는 유틸리티 접두사 전부(bg-/text-/border-/
// ring-/outline-/divide-/fill-/stroke-/decoration-/accent-/caret-/from-/via-/to- 등 13개 이상)에서
// 실제로 유효하다. 여기선 실무에서 가장 많이 쓰는 3개(bg-/text-/border-)만 큐레이션해서 보여준다 —
// 나머지 접두사도 전부 동작하니 필요하면 같은 슬롯 이름에 직접 붙여 쓰면 된다.
// scroll-thumb/track 은 pseudo-element(::-webkit-scrollbar) 전용이라 Tailwind 유틸리티 자체가
// 없다(build-tokens.mjs 의 NO_UTILITY_SLOTS) — className 이 아니라 CSS 안에서 var() 로 직접 참조하는
// 게 유일한 실제 사용법이라, 복사값도 가짜 유틸리티 클래스가 아니라 그 CSS 변수 자체로 보여준다.
const utilClasses = (name: string): string[] => {
    if (name === 'scroll-thumb' || name === 'scroll-track') return [`var(--ds-${name})`]
    return [`bg-${name}`, `text-${name}`, `border-${name}`]
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
// `bg-${name}` 처럼 동적으로 조합하면 생성되지 않는다. semantic 슬롯은 34개로 고정돼 있어 전부
// 리터럴로 나열한다. scroll-thumb/track 은 pseudo-element 전용이라 --color-* 유틸이 없어(build-tokens.mjs
// 의 NO_UTILITY_SLOTS) var() 임의값으로 대신 참조한다.
const LIVE_SWATCH_CLASS: Record<string, string> = {
    background: 'bg-background',
    foreground: 'bg-foreground',
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
    destructive: 'bg-destructive',
    'destructive-foreground': 'bg-destructive-foreground',
    border: 'bg-border',
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

// 그룹 판별 — 순서대로 첫 매칭. shadcn 표준 슬롯의 base/-foreground 페어를 한 그룹으로 묶는다.
const SEMANTIC_GROUPS: {name: string; match: (n: string) => boolean}[] = [
    {name: 'background', match: (n) => n === 'background' || n === 'foreground'},
    {name: 'card', match: (n) => n === 'card' || n === 'card-foreground'},
    {name: 'popover', match: (n) => n === 'popover' || n === 'popover-foreground'},
    {name: 'primary', match: (n) => n === 'primary' || n === 'primary-foreground'},
    {name: 'secondary', match: (n) => n === 'secondary' || n === 'secondary-foreground'},
    {name: 'muted', match: (n) => n === 'muted' || n === 'muted-foreground'},
    {name: 'accent', match: (n) => n === 'accent' || n === 'accent-foreground'},
    {name: 'destructive', match: (n) => n === 'destructive' || n === 'destructive-foreground'},
    {name: 'border / input / ring', match: (n) => n === 'border' || n === 'input' || n === 'ring'},
    {name: 'chart', match: (n) => n.startsWith('chart-')},
    {name: 'sidebar', match: (n) => n.startsWith('sidebar')},
    {name: '기타', match: () => true},
]
const groupNameOf = (name: string): string => SEMANTIC_GROUPS.find((group) => group.match(name))?.name ?? '기타'

// tokens.json 순서를 유지한 채 그룹으로 묶는다(각 토큰은 첫 매칭 그룹 하나에만 속함).
const GROUPED = SEMANTIC_GROUPS.map((group) => ({
    name: group.name,
    tokens: Object.entries(semantic).filter(([name]) => groupNameOf(name) === group.name),
})).filter((group) => group.tokens.length > 0)

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
        <h2 className="typo-body-l-medium text-foreground font-semibold">{title}</h2>
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
            바탕. 그 위에 <code className="font-mono">card</code>·<code className="font-mono">popover</code>·
            <code className="font-mono">sidebar</code> 등 다른 표면이 얹힌다. 짝인{' '}
            <code className="font-mono">foreground</code> 는 이 배경 위 기본 텍스트색이다.
        </>
    ),
}

// 색상(Semantic) — 앱이 실제로 쓰는 시맨틱 토큰(--ds). Figma 02 Semantic 그룹별로 표를 나눈다.
const SemanticColorGuidePage = () => (
    <GuidePage title="색상 (Semantic)" description="앱이 실제로 쓰는 시맨틱 색상 토큰을 그룹별 표로 정리했습니다.">
        <p className="typo-body-m-regular text-muted-foreground">
            &ldquo;클래스&rdquo; 칸의 <code className="font-mono">bg-</code>/<code className="font-mono">text-</code>/
            <code className="font-mono">border-</code>는 자주 쓰는 3개만 고른 큐레이션입니다. 시맨틱 슬롯은 실제로{' '}
            <code className="font-mono">ring-</code>/<code className="font-mono">outline-</code>/
            <code className="font-mono">divide-</code>/<code className="font-mono">fill-</code>/
            <code className="font-mono">stroke-</code> 등 색을 받는 유틸리티 접두사 13개 이상에서 전부 유효하니,
            필요하면 같은 슬롯 이름에 원하는 접두사를 직접 붙여 쓰면 됩니다.
        </p>
        <div className="flex flex-col gap-8">
            {GROUPED.map((group) => (
                <SemanticTable
                    key={group.name}
                    title={group.name}
                    tokens={group.tokens}
                    usage={GROUP_USAGE[group.name]}
                    note={
                        group.name === '기타' ? (
                            <>
                                스크롤바 색은 <code className="font-mono">::-webkit-scrollbar</code> 가상요소에만
                                적용되는데, 가상요소엔 <code className="font-mono">className</code> 을 붙일 수 없어{' '}
                                <code className="font-mono">bg-*</code> 같은 유틸리티가 무의미합니다. 그래서 유틸리티로
                                만들지 않고 <code className="font-mono">globals.css</code> 안에서{' '}
                                <code className="font-mono">var(--ds-scroll-*)</code> 로 직접 참조하며, 여기선 그
                                변수명만 표기합니다(복사 대상 아님).
                            </>
                        ) : undefined
                    }
                />
            ))}
        </div>
    </GuidePage>
)

export default SemanticColorGuidePage
