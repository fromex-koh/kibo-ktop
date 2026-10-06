import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import {Check, TriangleAlert, X} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Badge} from '@/components/ui/badge'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
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
    'calendar-sunday',
    'calendar-saturday',
    'select-selected-foreground',
])
// 이름은 -border 지만 테두리가 아니라 1px 면(구분선·진행 레일)으로 그리는 슬롯 — 실제 사용처가 bg- 다.
const LINE_SURFACE_SLOTS = new Set(['main-intro-border', 'menu-overlay-border'])
const utilClasses = (name: string): string[] => {
    if (name === 'scroll-thumb' || name === 'scroll-track') return [`var(--ds-${name})`]
    if (LINE_SURFACE_SLOTS.has(name)) return [`bg-${name}`]
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
// `bg-${name}` 처럼 동적으로 조합하면 생성되지 않는다. semantic 슬롯 전부를 리터럴로 나열하며, 키 타입이
// tokens.semantic 이라 슬롯을 추가하고 여기 빠뜨리면 typecheck 가 실패한다(스와치가 빈칸으로 나가지 않게).
// scroll-thumb/track 은 pseudo-element 전용이라 --color-* 유틸이 없어(build-tokens.mjs 의 NO_UTILITY_SLOTS)
// var() 임의값으로 참조한다.
const LIVE_SWATCH_CLASS: Record<keyof typeof tokens.semantic, string> = {
    background: 'bg-background',
    surface: 'bg-surface',
    foreground: 'bg-foreground',
    'foreground-subtle': 'bg-foreground-subtle',
    'label-foreground': 'bg-label-foreground',
    disabled: 'bg-disabled',
    'disabled-subtle': 'bg-disabled-subtle',
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
    'secondary-strong': 'bg-secondary-strong',
    'secondary-foreground': 'bg-secondary-foreground',
    'secondary-foreground-hover': 'bg-secondary-foreground-hover',
    'secondary-foreground-pressed': 'bg-secondary-foreground-pressed',
    tertiary: 'bg-tertiary',
    'tertiary-hover': 'bg-tertiary-hover',
    'tertiary-pressed': 'bg-tertiary-pressed',
    'tertiary-strong': 'bg-tertiary-strong',
    'tertiary-foreground': 'bg-tertiary-foreground',
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
    'status-evaluated': 'bg-status-evaluated',
    'primary-subtle': 'bg-primary-subtle',
    'action-check-halo': 'bg-action-check-halo',
    'action-fill-hover': 'bg-action-fill-hover',
    border: 'bg-border',
    'subtle-1': 'bg-subtle-1',
    'subtle-2': 'bg-subtle-2',
    'subtle-3': 'bg-subtle-3',
    input: 'bg-input',
    control: 'bg-control',
    'separator-dot': 'bg-separator-dot',
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
    'control-disabled': 'bg-control-disabled',
    'control-disabled-subtle': 'bg-control-disabled-subtle',
    'field-disabled': 'bg-field-disabled',
    'icon-solid-neutral': 'bg-icon-solid-neutral',
    'icon-solid-neutral-foreground': 'bg-icon-solid-neutral-foreground',
    'icon-solid-subtle': 'bg-icon-solid-subtle',
    'icon-solid-subtle-foreground': 'bg-icon-solid-subtle-foreground',
    'icon-solid-error': 'bg-icon-solid-error',
    'accent-subtle': 'bg-accent-subtle',
    'surface-subtle': 'bg-surface-subtle',
    'field-error-foreground': 'bg-field-error-foreground',
    'icon-interactive-hover': 'bg-icon-interactive-hover',
    'step-progress-inactive': 'bg-step-progress-inactive',
    'number-badge-new': 'bg-number-badge-new',
    'badge-solid-fg': 'bg-badge-solid-fg',
    'segmented-track': 'bg-segmented-track',
    'segmented-foreground': 'bg-segmented-foreground',
    'segmented-active': 'bg-segmented-active',
    'segmented-solid-active': 'bg-segmented-solid-active',
    'segmented-solid-active-foreground': 'bg-segmented-solid-active-foreground',
    'pagination-active': 'bg-pagination-active',
    'pagination-active-foreground': 'bg-pagination-active-foreground',
    'tab-pill-active': 'bg-tab-pill-active',
    'tab-pill-active-foreground': 'bg-tab-pill-active-foreground',
    'select-selected-foreground': 'bg-select-selected-foreground',
    'calendar-sunday': 'bg-calendar-sunday',
    'calendar-saturday': 'bg-calendar-saturday',
    'main-accent': 'bg-main-accent',
    'main-accent-bright': 'bg-main-accent-bright',
    'main-intro-surface': 'bg-main-intro-surface',
    'main-intro-foreground': 'bg-main-intro-foreground',
    'main-intro-foreground-subtle': 'bg-main-intro-foreground-subtle',
    'main-intro-accent': 'bg-main-intro-accent',
    'main-intro-border': 'bg-main-intro-border',
    'menu-overlay': 'bg-menu-overlay',
    'menu-overlay-foreground': 'bg-menu-overlay-foreground',
    'menu-overlay-foreground-subtle': 'bg-menu-overlay-foreground-subtle',
    'menu-overlay-accent': 'bg-menu-overlay-accent',
    'menu-overlay-border': 'bg-menu-overlay-border',
    'cta-surface': 'bg-cta-surface',
    'pastel-info': 'bg-pastel-info',
    'pastel-info-foreground': 'bg-pastel-info-foreground',
    'pastel-info-foreground-strong': 'bg-pastel-info-foreground-strong',
    'pastel-success': 'bg-pastel-success',
    'pastel-success-foreground': 'bg-pastel-success-foreground',
    'pastel-success-foreground-strong': 'bg-pastel-success-foreground-strong',
    'pastel-warning': 'bg-pastel-warning',
    'pastel-warning-foreground': 'bg-pastel-warning-foreground',
    'pastel-warning-foreground-strong': 'bg-pastel-warning-foreground-strong',
    'pastel-error': 'bg-pastel-error',
    'pastel-error-foreground': 'bg-pastel-error-foreground',
    'pastel-error-foreground-strong': 'bg-pastel-error-foreground-strong',
    'pastel-neutral': 'bg-pastel-neutral',
    'pastel-neutral-foreground': 'bg-pastel-neutral-foreground',
    'pastel-navy': 'bg-pastel-navy',
    'pastel-navy-foreground': 'bg-pastel-navy-foreground',
    'badge-solid-info': 'bg-badge-solid-info',
    'badge-solid-success': 'bg-badge-solid-success',
    'badge-solid-warning': 'bg-badge-solid-warning',
    'badge-solid-error': 'bg-badge-solid-error',
    'badge-solid-neutral': 'bg-badge-solid-neutral',
    'badge-solid-navy': 'bg-badge-solid-navy',
    'badge-outline-neutral': 'bg-badge-outline-neutral',
    'badge-outline-neutral-foreground': 'bg-badge-outline-neutral-foreground',
    'alert-info-border': 'bg-alert-info-border',
    'alert-success-border': 'bg-alert-success-border',
    'alert-warning-border': 'bg-alert-warning-border',
    'alert-error-border': 'bg-alert-error-border',
    'file-upload-complete': 'bg-file-upload-complete',
    'file-upload-complete-border': 'bg-file-upload-complete-border',
    toast: 'bg-toast',
    'toast-foreground': 'bg-toast-foreground',
    'toast-icon': 'bg-toast-icon',
}
// 표는 tokens.json 순서로 그리므로 조회는 문자열 키로 한다(위 객체가 누락 검사를 맡는다).
const LIVE_SWATCH_BY_NAME = new Map<string, string>(Object.entries(LIVE_SWATCH_CLASS))

// 맨 앞 '현재' 칸 — 실제 토큰을 현재 테마로 렌더. 다크 토글 시 실제로 바뀐다(파이프라인 검증).
const LiveSwatch = ({name}: {name: string}) => (
    <span
        aria-hidden="true"
        className="border-border size-icon-lg relative block shrink-0 overflow-hidden rounded border"
        style={{background: CHECKERBOARD}}
    >
        <span className={`absolute inset-0 ${LIVE_SWATCH_BY_NAME.get(name) ?? ''}`} />
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
        <span className="text-muted-foreground font-mono whitespace-nowrap">{toRgbaText(color)}</span>
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

// 컴포넌트 전용 레시피 토큰은 일반 색 슬롯이 아니라 특정 컴포넌트 내부에서만 쓰는 값이라
// 표준·커스텀 슬롯 표에서 제외하고 하단의 레시피 표에 모아 노출한다.
const isComponentRecipe = (n: string): boolean =>
    /^(action-check|alert|button|checkbox|radio|badge|number-badge|chip|file-upload|icon|selectable-card|step-progress|segmented)-/.test(
        n,
    )

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
    // 카드 안에 한 단계 들어간 옅은 면 — 공지 상세의 첨부파일 줄처럼 흰 카드 위 영역을 구분한다.
    {name: 'surface-subtle', match: (n) => n === 'surface-subtle'},
    // 토스트 면은 시안이 테마와 무관하게 한 벌(반투명 검정 + 흰 글자 + 초록 체크 원)이라 세 테마 값이 모두 같다.
    {
        name: 'toast / toast-foreground / toast-icon',
        match: (n) => n === 'toast' || n === 'toast-foreground' || n === 'toast-icon',
    },
    // 옅은 채움 — 배지 solid-pastel·등급 표가 공유한다. 다크는 중립 표면 위 상태색 글자로 뒤집힌다.
    {name: 'pastel (옅은 채움 배경 / 글자)', match: (n) => n.startsWith('pastel-')},
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
    // 조회 목록의 진행 상태 글자색 — 팔레트 밖 값이라 common 앵커(status-blue)를 가리킨다.
    {name: 'status-evaluated (평가완료)', match: (n) => n === 'status-evaluated'},
    {name: 'scroll-thumb / scroll-track', match: (n) => n === 'scroll-thumb' || n === 'scroll-track'},
    {name: 'main-accent / main-accent-bright', match: (n) => n.startsWith('main-accent')},
    {name: 'main-intro (메인 2섹션)', match: (n) => n.startsWith('main-intro-')},
    {name: 'menu-overlay (서비스 헤더 전체 메뉴)', match: (n) => n.startsWith('menu-overlay')},
    {name: 'pagination', match: (n) => n.startsWith('pagination-')},
    {name: 'calendar (일요일 / 토요일)', match: (n) => n.startsWith('calendar-')},
    {name: 'select-selected-foreground', match: (n) => n === 'select-selected-foreground'},
    {name: 'accent-subtle', match: (n) => n === 'accent-subtle'},
    {name: 'field-error-foreground', match: (n) => n === 'field-error-foreground'},
    {
        name: 'tab-pill-active / tab-pill-active-foreground',
        match: (n) => n === 'tab-pill-active' || n === 'tab-pill-active-foreground',
    },
    {name: 'cta-surface', match: (n) => n === 'cta-surface'},
    {name: 'action-fill-hover', match: (n) => n === 'action-fill-hover'},
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
// 레시피 토큰은 쓰는 컴포넌트별로 표를 나눈다 — 표 제목이 컴포넌트 이름이다.
const RECIPE_GROUPS: Group[] = [
    {name: 'Icon', match: (n) => n.startsWith('icon-')},
    {name: 'Badge', match: (n) => n.startsWith('badge-') || n.startsWith('number-badge-')},
    {name: 'Alert', match: (n) => n.startsWith('alert-')},
    {name: 'SegmentedControl', match: (n) => n.startsWith('segmented-')},
    {name: 'FileUpload', match: (n) => n.startsWith('file-upload-')},
    {name: 'StepProgress', match: (n) => n.startsWith('step-progress-')},
    {name: 'ActionCheck', match: (n) => n.startsWith('action-check-')},
    {name: '기타 컴포넌트', match: () => true}, // 안전망 — 새 접두사의 레시피 토큰이 생기면 여기로.
]
const RECIPE_GROUPED = groupBy(RECIPE_GROUPS, recipeEntries)

const SEMANTIC_TABLE_COLUMNS = [
    {key: 'current', header: <span className="text-muted-foreground">현재</span>, align: 'start'},
    {
        key: 'class',
        header: <span className="text-muted-foreground">클래스 (클릭 복사)</span>,
        align: 'start',
        rowHeader: true,
    },
    {key: 'light', header: <span className="text-muted-foreground">라이트</span>, align: 'start'},
    {key: 'dark', header: <span className="text-muted-foreground">다크</span>, align: 'start'},
    {key: 'mainpage', header: <span className="text-muted-foreground">메인페이지</span>, align: 'start'},
    {
        key: 'primitive',
        header: <span className="text-muted-foreground">참조 primitive</span>,
        align: 'start',
    },
] as const

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
        <h3 className="typo-title-m-bold text-foreground">{title}</h3>
        {usage && <p className="typo-body-l-regular text-muted-foreground">{usage}</p>}
        {note && <p className="typo-body-l-regular text-muted-foreground">{note}</p>}
        <Table
            size="sm"
            caption={`${title} 시맨틱 색상 토큰과 light·dark·mainpage 매핑`}
            columns={SEMANTIC_TABLE_COLUMNS}
            rows={tokens.map(([name, val]) => {
                const modes = resolveModes(val)
                return {
                    key: name,
                    cells: [
                        <LiveSwatch key="current" name={name} />,
                        <span key="class" className="flex flex-wrap items-center gap-1.5">
                            {utilClasses(name).map((cls) =>
                                // var(--ds-*) 참조는 유틸리티 클래스가 아니라 CSS 변수라 복사 대상이
                                // 아니다 — 칩 대신 변수명만 평문으로 노출한다(scroll-thumb/track).
                                cls.startsWith('var(') ? (
                                    <span key={cls} className="text-foreground font-mono">
                                        {cls.slice(4, -1)}
                                    </span>
                                ) : (
                                    <CopyChip key={cls} value={cls} />
                                ),
                            )}
                        </span>,
                        <ModeSwatch key="light" color={modes.light} />,
                        <ModeSwatch key="dark" color={modes.dark} />,
                        <ModeSwatch key="mainpage" color={modes.mainpage} />,
                        <span key="primitive" className="text-muted-foreground font-mono whitespace-nowrap">
                            {refLabel(val)}
                        </span>,
                    ],
                }
            })}
        />
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
            메인페이지의 포인트 그린입니다. main-accent는 활성 메뉴·인디케이터, main-accent-bright는 수치 강조에 씁니다.
        </>
    ),
    'main-intro (메인 2섹션)': (
        <>
            메인페이지 두 번째 섹션 전용입니다. surface는 섹션 배경, accent는 단계 번호·진행 표식, foreground는
            제목·레이블, foreground-subtle은 본문, border는 진행 레일입니다. 세 테마 값이 같습니다.
        </>
    ),
    'menu-overlay (서비스 헤더 전체 메뉴)': (
        <>서비스 헤더의 햄버거 버튼으로 여는 전체 메뉴 전용입니다. Header 컴포넌트 안에서만 사용합니다.</>
    ),
    pagination: <>Pagination의 현재 페이지 면(navy)과 그 위 글자입니다. 세 테마 값이 같습니다.</>,
    'select-selected-foreground': <>Select·드롭다운에서 현재 선택된 옵션의 글자색입니다.</>,
    'popover / popover-foreground': (
        <>Popover·Dropdown·Select 목록처럼 화면 위에 뜨는 면과 그 안의 텍스트에 사용합니다.</>
    ),
    'chart-1~5': <>차트의 계열 색입니다. 계열 순서대로 1부터 사용합니다.</>,
    'sidebar (+ 세부 7)': (
        <>사이드바의 면·텍스트·활성 항목·테두리·포커스 링입니다. 본문과 다른 색 맥락을 갖도록 따로 둡니다.</>
    ),
    'surface-subtle': (
        <>카드 안에서 한 단계 들어간 옅은 면입니다. 첨부파일 줄·모달 안내 상자처럼 흰 카드 위 영역을 구분합니다.</>
    ),
    'toast / toast-foreground / toast-icon': (
        <>토스트의 면·글자·아이콘 원입니다. 테마와 무관하게 한 벌이라 세 테마 값이 같습니다.</>
    ),
    'pastel (옅은 채움 배경 / 글자)': <>Badge의 solid-pastel과 등급 표가 공유하는 옅은 채움 면과 그 위 글자입니다.</>,
    'status-evaluated (평가완료)': <>조회 목록에서 평가완료 상태를 나타내는 글자색입니다.</>,
    'accent-subtle': <>게이지·비율 막대의 바탕, 옵션의 눌림 상태처럼 accent보다 한 단계 옅은 중립 면에 사용합니다.</>,
    'field-error-foreground': <>입력 필드 아래 오류 메시지의 글자색입니다.</>,
    'tab-pill-active / tab-pill-active-foreground': (
        <>알약 모양 탭(Tabs)의 활성 탭 면과 그 위 글자입니다. 세 테마에서 같은 navy 값을 유지합니다.</>
    ),
    'cta-surface': <>화면 아래에 고정되는 CTA 줄(StepNavigation)의 반투명 면입니다.</>,
    'action-fill-hover': <>메인페이지 서비스 카드의 [시작하기] 버튼에서 hover 때 좌에서 우로 채워지는 면입니다.</>,
    'calendar (일요일 / 토요일)': (
        <>달력 요일 헤더의 일요일·토요일 글자색입니다. 오류를 뜻하는 error·destructive와 구분해 씁니다.</>
    ),
}

// 색상(Semantic) — 프로젝트가 실제로 쓰는 시맨틱 토큰(--ds). Figma 02 Semantic 그룹별로 표를 나눈다.
// 적용 규칙 카드 — 규칙마다 설명 · 사용 · 금지를 같은 자리에 둔다.
const SEMANTIC_RULES = [
    {
        title: '역할 기반 클래스 사용',
        description: '역할이 드러나는 클래스를 씁니다.',
        use: 'bg-primary · bg-info',
        avoid: 'bg-blue-500 · bg-info-500',
    },
    {
        title: '배경과 전경 함께 적용',
        description: '배경에 대응하는 전경색을 함께 써 대비를 유지합니다.',
        use: 'bg-primary + text-primary-foreground',
        avoid: '배경만 바꾸고 글자색은 그대로 두기',
    },
    {
        title: '테마별 클래스 분기 금지',
        description: '같은 클래스가 테마에 따라 값을 자동으로 바꿉니다.',
        use: 'bg-surface (테마 공통)',
        avoid: 'dark: 로 분기',
    },
] as const

const SEMANTIC_THEMES = [
    {selector: ':root · light', description: '테마 클래스가 없을 때의 기본값'},
    {selector: '.dark', description: '다크 화면'},
    {selector: '.mainpage', description: '메인페이지 전용'},
] as const

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
                <section aria-labelledby="semantic-rule" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 id="semantic-rule" className="typo-h4-bold text-foreground">
                            시맨틱 색상 적용 방식
                        </h2>
                        <p className="typo-body-l-regular text-label-foreground">
                            색 값이나 단계가 아니라 UI 에서 맡는 역할로 클래스를 고릅니다.
                        </p>
                    </div>

                    {/* 규칙마다 같은 자리에 같은 항목(설명 · 사용 · 금지)을 둔다. */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {SEMANTIC_RULES.map((rule) => (
                            <div
                                key={rule.title}
                                className="border-foreground-subtle/30 bg-pastel-neutral/40 flex flex-col gap-3 rounded-sm border p-5"
                            >
                                <h3 className="typo-body-xl-bold text-foreground">{rule.title}</h3>
                                <p className="text-label-foreground">{rule.description}</p>
                                <dl className="border-subtle-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t pt-3">
                                    {/* 색만으로 가르지 않도록 글자(사용 · 금지)와 아이콘을 함께 둔다[5.3.1]. */}
                                    <dt>
                                        <Badge variant="solid-pastel" color="success" size="sm">
                                            <Check aria-hidden="true" />
                                            사용
                                        </Badge>
                                    </dt>
                                    <dd className="text-label-foreground self-center font-mono text-sm">{rule.use}</dd>
                                    <dt>
                                        <Badge variant="solid-pastel" color="error" size="sm">
                                            <X aria-hidden="true" />
                                            금지
                                        </Badge>
                                    </dt>
                                    <dd className="text-label-foreground self-center font-mono text-sm">
                                        {rule.avoid}
                                    </dd>
                                </dl>
                            </div>
                        ))}
                    </div>

                    <div className="border-subtle-3 flex flex-col gap-4 border-t pt-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="typo-title-m-bold text-foreground">테마별 동일 토큰 세트</h3>
                            <p className="typo-body-l-regular text-label-foreground">
                                light · dark · mainpage 세 테마는 이름과 개수가 같은 토큰 한 벌씩을 갖고, 값만 다릅니다.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            {SEMANTIC_THEMES.map((theme) => (
                                <div
                                    key={theme.selector}
                                    className="border-foreground-subtle/30 bg-pastel-neutral/40 flex flex-col gap-1 rounded-sm border p-5"
                                >
                                    <code className="typo-body-xl-bold text-foreground font-mono">
                                        {theme.selector}
                                    </code>
                                    <p className="text-label-foreground">{theme.description}</p>
                                </div>
                            ))}
                        </div>
                        <ul className="text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                토큰을 추가할 때는 <code className="text-foreground font-mono">tokens.json</code>에 세
                                테마 값을 모두 적습니다. 값이 같아도 생략하지 않습니다.
                            </li>
                            <li>
                                특정 영역만 다른 색이 필요하면 <code className="text-foreground font-mono">.light</code>
                                ·<code className="text-foreground font-mono">.dark</code>를 부분 적용하지 말고{' '}
                                <code className="text-foreground font-mono">sidebar-*</code>처럼 전용 토큰을 만듭니다.
                            </li>
                        </ul>
                        {/* 예외는 목록 끝에 묻히지 않게 따로 떼어 경고 상자로 세운다. */}
                        <Alert variant="outline" color="warning">
                            <TriangleAlert aria-hidden="true" />
                            <AlertDescription>
                                <strong>예외</strong> — 인쇄용 리포트와 메인 공지 팝업처럼 영역 전체가 늘 라이트여야
                                하면 그 영역 뿌리에 <code className="font-mono font-bold">.light</code>를 한 번
                                적용합니다.
                            </AlertDescription>
                        </Alert>
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
                    {RECIPE_GROUPED.map((group) => (
                        <SemanticTable key={group.name} title={group.name} tokens={group.tokens} />
                    ))}
                </section>
            </BaseCard>
        </div>
    </GuidePageShell>
)

export default SemanticColorGuidePage
