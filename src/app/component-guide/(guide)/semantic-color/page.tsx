import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '색상 (Semantic)'}

// 각 슬롯에서 '실제로 쓰는' 대표 유틸리티 하나만 노출한다 — bg-/text-/border- 를 다 나열하면
// text-background 처럼 안 쓰는 조합까지 보여 헷갈리기 때문. 유형별로:
//   -foreground(텍스트색) → text- · border/-border(테두리) → border- · ring/-ring(포커스링) → ring- ·
//   input/control(폼·선택 컨트롤 테두리) → border- · 그 외(배경 표면) → bg-.
// 다른 접두사(outline-/divide-/fill-/stroke- 등)도 전부 유효하며(설명 참고) 필요하면 직접 붙여 쓴다.
// scroll-thumb/track 은 pseudo-element(::-webkit-scrollbar) 전용이라 Tailwind 유틸리티 자체가
// 없다(build-tokens.mjs 의 NO_UTILITY_SLOTS) — CSS 안에서 var() 로 직접 참조하는 게 유일한 사용법이라
// 복사값도 유틸리티 클래스가 아니라 그 CSS 변수 자체로 보여준다.
// 테두리 전용 색 슬롯 — 이름에 'border' 를 넣으면 유틸이 border-border-* 로 이중접두라, 슬롯명엔 border 를
// 빼고(예: subtle-1) 유틸 표기만 border- 로 강제한다 → border-subtle-1.
const BORDER_TONE_SLOTS = new Set(['subtle-1', 'subtle-2', 'subtle-3', 'secondary-strong', 'tertiary-strong'])
const TEXT_TONE_SLOTS = new Set([
    'disabled',
    'disabled-subtle',
    'placeholder',
    'primary-strong',
    'badge-solid-fg',
    'stepper-inactive',
])
const utilClasses = (name: string): string[] => {
    if (name === 'scroll-thumb' || name === 'scroll-track') return [`var(--ds-${name})`]
    if (TEXT_TONE_SLOTS.has(name)) return [`text-${name}`]
    if (name === 'foreground' || name.endsWith('-foreground') || name.startsWith('foreground-')) return [`text-${name}`]
    if (name === 'border' || name.endsWith('-border') || BORDER_TONE_SLOTS.has(name)) return [`border-${name}`]
    if (name === 'ring' || name.endsWith('-ring')) return [`ring-${name}`]
    if (name === 'input' || name === 'control') return [`border-${name}`]
    return [`bg-${name}`]
}

// 앱이 실제로 쓰는 시맨틱 토큰(--ds → bg-*/text-* 유틸)을 tokens.json 에서 그대로 문서화한다.
// 인덱싱 타입 오류를 피하려고 Record 로 받는다(값 형태는 build-tokens 검증이 보장).
const primitive: Record<string, Record<string, string>> = tokens.primitive
const common: Record<string, string> = tokens.common
type SemanticValue = {light: string; dark: string; mainpage: string}
const semantic: Record<string, SemanticValue> = tokens.semantic

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

// tokens.json 에 명시된 테마별 참조를 색상값으로 해석한다.
const resolveModes = (val: SemanticValue): {light: string; dark: string; mainpage: string} => {
    return {light: rawColor(val.light), dark: rawColor(val.dark), mainpage: rawColor(val.mainpage)}
}

// tokens.json 에 명시된 light / dark / mainpage primitive 참조를 그대로 표기한다.
const refLabel = (val: SemanticValue): string => {
    return `${val.light} / ${val.dark} / ${val.mainpage}`
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
// `bg-${name}` 처럼 동적으로 조합하면 생성되지 않는다. 이 페이지가 보여주는 슬롯을 전부 리터럴로 나열한다.
// scroll-thumb/track 은
// pseudo-element 전용이라 --color-* 유틸이 없어(build-tokens.mjs 의 NO_UTILITY_SLOTS) var() 임의값으로 참조한다.
const LIVE_SWATCH_CLASS: Record<string, string> = {
    background: 'bg-background',
    surface: 'bg-surface',
    foreground: 'bg-foreground',
    'foreground-subtle': 'bg-foreground-subtle',
    control: 'bg-control',
    'label-foreground': 'bg-label-foreground',
    placeholder: 'bg-placeholder',
    card: 'bg-card',
    'card-foreground': 'bg-card-foreground',
    popover: 'bg-popover',
    'popover-foreground': 'bg-popover-foreground',
    primary: 'bg-primary',
    'primary-strong': 'bg-primary-strong',
    'primary-hover': 'bg-primary-hover',
    'primary-pressed': 'bg-primary-pressed',
    'primary-foreground': 'bg-primary-foreground',
    secondary: 'bg-secondary',
    'secondary-hover': 'bg-secondary-hover',
    'secondary-pressed': 'bg-secondary-pressed',
    'secondary-foreground': 'bg-secondary-foreground',
    'secondary-foreground-hover': 'bg-secondary-foreground-hover',
    'secondary-foreground-pressed': 'bg-secondary-foreground-pressed',
    'secondary-strong': 'bg-secondary-strong',
    tertiary: 'bg-tertiary',
    'tertiary-hover': 'bg-tertiary-hover',
    'tertiary-pressed': 'bg-tertiary-pressed',
    'tertiary-foreground': 'bg-tertiary-foreground',
    'tertiary-strong': 'bg-tertiary-strong',
    'disabled-subtle': 'bg-disabled-subtle',
    muted: 'bg-muted',
    'muted-foreground': 'bg-muted-foreground',
    accent: 'bg-accent',
    'accent-foreground': 'bg-accent-foreground',
    destructive: 'bg-destructive',
    'destructive-foreground': 'bg-destructive-foreground',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    'primary-subtle': 'bg-primary-subtle',
    'action-check-halo': 'bg-action-check-halo',
    border: 'bg-border',
    'subtle-1': 'bg-subtle-1',
    'subtle-2': 'bg-subtle-2',
    'subtle-3': 'bg-subtle-3',
    input: 'bg-input',
    ring: 'bg-ring',
    'separator-dot': 'bg-separator-dot',
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
    disabled: 'bg-disabled',
    'control-disabled': 'bg-control-disabled',
    'control-disabled-subtle': 'bg-control-disabled-subtle',
    'field-disabled': 'bg-field-disabled',
    'icon-solid-neutral': 'bg-icon-solid-neutral',
    'icon-solid-neutral-foreground': 'bg-icon-solid-neutral-foreground',
    'stepper-accent': 'bg-stepper-accent',
    'stepper-inactive': 'bg-stepper-inactive',
    'number-badge-new': 'bg-number-badge-new',
    'badge-solid-fg': 'bg-badge-solid-fg',
    'main-accent': 'bg-main-accent',
    'main-accent-bright': 'bg-main-accent-bright',
    'segmented-track': 'bg-segmented-track',
    'segmented-foreground': 'bg-segmented-foreground',
    'segmented-active': 'bg-segmented-active',
    'segmented-solid-active': 'bg-segmented-solid-active',
    'segmented-solid-active-foreground': 'bg-segmented-solid-active-foreground',
    'pagination-active': 'bg-pagination-active',
    'pagination-active-foreground': 'bg-pagination-active-foreground',
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
        <span className="typo-body-l-regular text-muted-foreground font-mono whitespace-nowrap">
            {toRgbaText(color)}
        </span>
    </span>
)

type SemanticEntry = [string, SemanticValue]
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

// 컴포넌트 전용 레시피 토큰(action-check-*/button-*/checkbox-*/radio-*/badge-*/icon-*)은 일반 색 슬롯이 아니라 특정 컴포넌트
// 내부에서만 쓰는 값이라 이 색 개요 페이지에서는 제외한다(각 컴포넌트 가이드에서 다룸).
const isComponentRecipe = (n: string): boolean =>
    /^(action-check|button|checkbox|radio|badge|number-badge|chip|icon|selectable-card|stepper|segmented)-/.test(n)

// 슬롯 가족(테이블) 정의 — 표준/커스텀 각각. 각 슬롯은 자기 버킷 안에서 한 가족에만 속한다.
const STANDARD_GROUPS: Group[] = [
    {name: 'background', match: (n) => n === 'background'},
    {name: 'foreground', match: (n) => n === 'foreground'},
    {name: 'card / card-foreground', match: (n) => n === 'card' || n === 'card-foreground'},
    {name: 'popover / popover-foreground', match: (n) => n === 'popover' || n === 'popover-foreground'},
    {
        name: 'primary / primary-foreground',
        match: (n) => n === 'primary' || n === 'primary-foreground',
    },
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
    {name: 'surface', match: (n) => n === 'surface'},
    {name: 'foreground-subtle', match: (n) => n === 'foreground-subtle'},
    {
        name: 'label-foreground / placeholder',
        match: (n) => n === 'label-foreground' || n === 'placeholder',
    },
    {name: 'control', match: (n) => n === 'control'},
    {
        name: 'primary 확장 (strong / hover / pressed)',
        match: (n) => n === 'primary-strong' || n === 'primary-hover' || n === 'primary-pressed',
    },
    {name: 'primary-subtle', match: (n) => n === 'primary-subtle'},
    {
        name: 'secondary state',
        match: (n) =>
            n === 'secondary-hover' ||
            n === 'secondary-pressed' ||
            n === 'secondary-foreground-hover' ||
            n === 'secondary-foreground-pressed' ||
            n === 'secondary-strong',
    },
    {
        name: 'tertiary / tertiary-foreground / tertiary-strong',
        match: (n) =>
            n === 'tertiary' ||
            n === 'tertiary-hover' ||
            n === 'tertiary-pressed' ||
            n === 'tertiary-foreground' ||
            n === 'tertiary-strong',
    },
    {name: 'subtle-1 / subtle-2 / subtle-3', match: (n) => BORDER_TONE_SLOTS.has(n)},
    {
        name: 'disabled',
        match: (n) =>
            n === 'disabled' ||
            n === 'disabled-subtle' ||
            n === 'control-disabled' ||
            n === 'control-disabled-subtle' ||
            n === 'field-disabled',
    },
    {name: 'separator-dot', match: (n) => n === 'separator-dot'},
    {
        name: '상태 (success / warning / error / info)',
        match: (n) => ['success', 'warning', 'error', 'info'].some((s) => n === s || n === `${s}-foreground`),
    },
    {name: 'scroll-thumb / scroll-track', match: (n) => n === 'scroll-thumb' || n === 'scroll-track'},
    {name: 'main-accent / main-accent-bright', match: (n) => n.startsWith('main-accent')},
    {name: 'pagination', match: (n) => n.startsWith('pagination-')},
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
const recipeEntries = Object.entries(semantic).filter(([name]) => isComponentRecipe(name))
const RECIPE_COUNT = recipeEntries.length

// 그룹 하나 = 독립 테이블. 현재(라이브)·클래스(클릭 복사)·light·dark·mainpage·참조 primitive.
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
    <section className="border-border flex flex-col gap-4 border-b pb-8 last:border-b-0 last:pb-0">
        <h3 className="typo-title-m-semibold text-foreground">{title}</h3>
        {usage && <p className="typo-body-l-regular text-muted-foreground">{usage}</p>}
        {note && <p className="typo-body-l-regular text-muted-foreground">{note}</p>}
        <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full text-left">
                <caption className="sr-only">{title} 시맨틱 색상 토큰과 light·dark·mainpage 매핑</caption>
                <thead>
                    <tr className="border-border bg-card border-b">
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
                            메인페이지
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
                            <tr key={name} className="border-border border-b last:border-b-0">
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
                                                    className="typo-body-l-regular text-foreground font-mono"
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
                                <td className="px-3 py-3">
                                    <ModeSwatch color={modes.mainpage} />
                                </td>
                                <td className="typo-body-l-regular text-muted-foreground px-3 py-3 font-mono whitespace-nowrap">
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
    'primary 확장 (strong / hover / pressed)': (
        <>진한 강조 텍스트와 Primary Button의 hover·pressed 배경에 사용합니다.</>
    ),
    background: (
        <>
            <code className="font-mono">body</code>와 최상위 레이아웃의 기본 배경입니다.
        </>
    ),
    foreground: <>제목·본문 등 가장 기본적인 텍스트에 사용합니다. 보조 텍스트에는 foreground-subtle을 사용합니다.</>,
    'card / card-foreground': <>페이지 위에 놓이는 Card·Panel의 표면과 내부 텍스트에 사용합니다.</>,
    'muted / muted-foreground': <>보조 표면과 캡션·도움말처럼 우선순위가 낮은 텍스트에 사용합니다.</>,
    'primary / primary-foreground': <>주요 버튼·링크·강조와 Primary 배경 위 텍스트에 사용합니다.</>,
    'accent / accent-foreground': <>메뉴·옵션·Ghost Button의 hover 또는 선택 상태에 사용하는 중립 하이라이트입니다.</>,
    'destructive / destructive-foreground': (
        <>삭제처럼 되돌리기 어려운 액션에 사용합니다. 오류 상태 표시는 error 슬롯을 사용합니다.</>
    ),
    'secondary / secondary-foreground': (
        <>Secondary Button의 기본 배경과 텍스트에 사용합니다. 상태와 테두리는 프로젝트 확장 슬롯을 사용합니다.</>
    ),
    border: <>Card·Table·Separator 등 일반적인 외곽선과 구분선에 사용합니다.</>,
    input: <>shadcn primitive 호환용 입력 테두리입니다. 프로젝트 공통 컨트롤에는 control을 사용합니다.</>,
    ring: <>버튼·입력·링크 등 상호작용 요소의 키보드 포커스 표시에 사용합니다.</>,
    // ── 아래는 shadcn 표준에 없는 프로젝트 커스텀 슬롯 ──
    'foreground-subtle': <>설명·캡션·도움말처럼 기본 본문보다 우선순위가 낮은 텍스트에 사용합니다.</>,
    surface: <>입력 컨트롤·Chip·선택 카드 등 Card보다 넓은 범위의 기본 표면에 사용합니다.</>,
    'label-foreground / placeholder': (
        <>label-foreground는 Label과 입력값, placeholder는 빈 필드의 안내 문구에 사용합니다.</>
    ),
    control: <>Checkbox·Radio·Input·Select 등 프로젝트 입력·선택 컨트롤의 기본 테두리입니다.</>,
    'primary-subtle': <>선택되거나 강조된 영역의 옅은 브랜드 배경에 사용합니다.</>,
    'secondary state': <>Secondary Button의 hover·pressed 배경과 텍스트, 기본 테두리에 사용합니다.</>,
    'tertiary / tertiary-foreground / tertiary-strong': (
        <>Tertiary Button의 기본·hover·pressed 배경과 텍스트·테두리에 사용합니다.</>
    ),
    'subtle-1 / subtle-2 / subtle-3': <>기본 border보다 옅은 경계선입니다. 숫자가 클수록 더 약한 테두리를 뜻합니다.</>,
    disabled: <>비활성 텍스트·테두리와 액션 컨트롤·입력 필드의 비활성 배경을 구분합니다.</>,
    'separator-dot': <>Breadcrumb 경로 사이의 작은 점 구분자에 사용합니다.</>,
    '상태 (success / warning / error / info)': (
        <>Badge·Alert 등에서 성공·경고·오류·정보 상태를 구분합니다. 위험 액션에는 destructive를 사용합니다.</>
    ),
    'scroll-thumb / scroll-track': (
        <>전역 스크롤바의 thumb와 track에 사용합니다. globals.css에서 CSS 변수로 직접 참조합니다.</>
    ),
    'main-accent / main-accent-bright': (
        <>
            메인페이지(<code className="font-mono">mainpage</code> 스킨)의 포인트 그린입니다. main-accent는 활성
            메뉴·인디케이터, main-accent-bright는 수치 강조에 사용합니다. 팔레트 스케일 밖 값이라 common 앵커
            (mint·mint-bright)를 참조하며 모든 테마에서 같은 값입니다.
        </>
    ),
    pagination: (
        <>
            페이지네이션(Pagination)의 현재 페이지 강조 면(navy)과 그 위 텍스트에 사용합니다. 시안대로 세 테마에서 같은
            navy 값을 유지합니다.
        </>
    ),
}

// 색상(Semantic) — 프로젝트가 실제로 쓰는 시맨틱 토큰(--ds). Figma 02 Semantic 그룹별로 표를 나눈다.
const SemanticColorGuidePage = () => (
    <GuidePageShell
        title="색상 (Semantic)"
        description={
            <>
                같은 역할의 색상 클래스를 light·dark·mainpage 세 테마에서 일관되게 사용하는 방법과 테마별 매핑을
                확인합니다.
            </>
        }
    >
        <div className="flex flex-col gap-12">
            <BaseCard>
                <section aria-labelledby="semantic-rule" className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <h2 id="semantic-rule" className="typo-h4-bold text-foreground">
                            구조와 사용 원칙
                        </h2>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            색상값이나 단계가 아니라 UI에서 맡는 역할을 기준으로 클래스를 선택합니다.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">역할 기반 클래스 사용</strong>
                            <p className="text-foreground-subtle">
                                <code className="font-mono">bg-blue-500</code>·
                                <code className="font-mono">bg-info-500</code> 대신{' '}
                                <code className="font-mono">bg-primary</code>·<code className="font-mono">bg-info</code>
                                처럼 역할이 드러나는 클래스를 사용합니다.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">배경과 전경 함께 적용</strong>
                            <p className="text-foreground-subtle">
                                <code className="font-mono">bg-primary</code>에는{' '}
                                <code className="font-mono">text-primary-foreground</code>처럼 대응하는 전경색을 함께
                                사용해 대비를 유지합니다.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">테마별 클래스 분기 금지</strong>
                            <p className="text-foreground-subtle">
                                동일한 시맨틱 클래스가 라이트·다크 값을 자동 전환합니다. 컴포넌트에서 테마별 원시 색상을
                                직접 지정하지 않습니다.
                            </p>
                        </div>
                    </div>

                    <div className="border-border flex flex-col gap-5 border-t pt-8">
                        <div className="flex flex-col gap-1">
                            <h3 className="typo-title-l-bold text-foreground">테마별 동일 토큰 세트</h3>
                            <p className="typo-body-l-regular text-foreground-subtle">
                                세 테마는 이름과 개수가 같은 시맨틱 토큰 한 벌씩을 가집니다. 현재 특정 테마에서 사용하지
                                않는 토큰도 삭제하지 않으며, 토큰 이름은 동일하고 실제 색상값만 테마에 따라 달라집니다.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="border-border bg-surface flex flex-col gap-1 rounded-lg border p-4">
                                <strong className="text-foreground">
                                    <code className="font-mono">:root</code> · light
                                </strong>
                                <p className="text-foreground-subtle">별도 테마 클래스가 없을 때 적용되는 기본 세트</p>
                            </div>
                            <div className="border-border bg-surface flex flex-col gap-1 rounded-lg border p-4">
                                <strong className="text-foreground">
                                    <code className="font-mono">.dark</code>
                                </strong>
                                <p className="text-foreground-subtle">다크 화면에 적용되는 동일 이름의 전체 세트</p>
                            </div>
                            <div className="border-border bg-surface flex flex-col gap-1 rounded-lg border p-4">
                                <strong className="text-foreground">
                                    <code className="font-mono">.mainpage</code>
                                </strong>
                                <p className="text-foreground-subtle">
                                    메인페이지 전용 스킨에 적용되는 동일 이름의 전체 세트
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <strong className="text-foreground">개발자는 클래스 하나만 사용</strong>
                                <p className="text-foreground-subtle">
                                    예를 들어 <code className="font-mono">bg-primary</code>는 현재 상위 테마의{' '}
                                    <code className="font-mono">--ds-primary</code> 값을 자동으로 사용합니다.
                                    컴포넌트에서 light·dark·mainpage 클래스를 조건문으로 나누지 않습니다.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <strong className="text-foreground">세 테마 값을 원본에 모두 명시</strong>
                                <p className="text-foreground-subtle">
                                    모든 토큰은 <code className="font-mono">tokens.json</code>에 light·dark·mainpage
                                    값을 각각 작성합니다. 값이 같아도 생략하거나 다른 테마에서 자동 상속하지 않습니다.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <strong className="text-foreground">현재 미사용 토큰도 세 테마 모두 보유</strong>
                                <p className="text-foreground-subtle">
                                    light·dark에서 <code className="font-mono">main-accent</code>를 사용하지 않더라도
                                    세트 구조를 맞추기 위해 동일 토큰을 유지합니다. 이후 테마별 값만 독립적으로 변경할
                                    수 있습니다.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <strong className="text-foreground">부분 테마 덮어쓰기 대신 역할 토큰 확장</strong>
                                <p className="text-foreground-subtle">
                                    특정 영역만 항상 다른 표면 색이 필요하면 <code className="font-mono">.light</code>·
                                    <code className="font-mono">.dark</code>를 부분 적용하지 않고{' '}
                                    <code className="font-mono">sidebar-*</code>·
                                    <code className="font-mono">chart-*</code>처럼 독립 색맥락을 갖는 역할 토큰을 새로
                                    정의해 사용합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </BaseCard>

            {/* ① shadcn 표준 슬롯 체계 — 두 섹션 제목은 같은 위계(h2)라 표준/커스텀이 한눈에 구분된다. */}
            <BaseCard>
                <section aria-labelledby="std-slots" className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <h2 id="std-slots" className="typo-h4-bold text-foreground">
                            shadcn 표준 슬롯{' '}
                            <span className="text-muted-foreground font-normal">({STANDARD_COUNT}개)</span>
                        </h2>
                        <p className="typo-body-l-regular text-muted-foreground">
                            shadcn primitive와 공통 UI에서 사용하는 기본 역할입니다. 컴포넌트를 추가할 때 먼저 이
                            슬롯으로 표현할 수 있는지 확인합니다. 슬롯 이름은{' '}
                            <a
                                href="https://ui.shadcn.com/docs/theming"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-strong underline underline-offset-2"
                            >
                                theming 문서
                            </a>
                            를 따릅니다.
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
            </BaseCard>

            {/* ② 프로젝트 커스텀 슬롯 — 표준에 없는 프로젝트 확장. */}
            <BaseCard>
                <section aria-labelledby="custom-slots" className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <h2 id="custom-slots" className="typo-h4-bold text-foreground">
                            프로젝트 커스텀 슬롯{' '}
                            <span className="text-muted-foreground font-normal">({CUSTOM_COUNT}개)</span>
                        </h2>
                        <p className="typo-body-l-regular text-muted-foreground">
                            보조 텍스트·표면·컨트롤·상태처럼 여러 화면에서 공유하는 프로젝트 역할입니다. 표준 슬롯으로
                            의미를 표현할 수 없을 때만 사용합니다.
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
            </BaseCard>

            <BaseCard>
                <section aria-labelledby="component-recipes" className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <h2 id="component-recipes" className="typo-h4-bold text-foreground">
                            컴포넌트 전용 레시피 토큰{' '}
                            <span className="text-muted-foreground font-normal">({RECIPE_COUNT}개)</span>
                        </h2>
                        <p className="typo-body-l-regular text-muted-foreground">
                            특정 컴포넌트 내부 구현에서만 사용합니다. 화면에서는 이 토큰을 직접 조합하지 말고 해당
                            컴포넌트의 variant·prop을 사용합니다.
                        </p>
                    </div>
                    <SemanticTable title="ActionCheck / Icon / Badge / Stepper / Segmented" tokens={recipeEntries} />
                </section>
            </BaseCard>
        </div>
    </GuidePageShell>
)

export default SemanticColorGuidePage
