import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {ExternalLink, Info} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import IssueBadge from './issue-badge'
import LatestAudit, {type Audit} from './latest-audit'
import auditData from '@/content/publishing-guide/accessibility-audit.json'
import type {MarkupIssueKind} from './screen-markup-results'

const audit: Audit = auditData

export const metadata: Metadata = {title: '접근성 검사 예외사항'}

// 날짜·커밋은 한 곳에서 관리해 본문 어디에서도 회차가 어긋나지 않게 한다.
const AUDIT_DATE = audit.checkedAt?.slice(0, 10) ?? '미검사'
const AUDIT_COMMIT = audit.commit?.slice(0, 7) ?? '기록 없음'
const NU_VERSION = audit.validatorVersion ?? '기록 없음'

// 종류별 짧은 이름과 책임 소재. 종류별 표와 화면별 표의 배지가 같은 값을 본다.
const ISSUE_LABEL: Record<MarkupIssueKind, {label: string; isProjectCause: boolean}> = {
    'empty-option': {label: '빈 option', isProjectCause: false},
    'select-required': {label: 'required select', isProjectCause: false},
    'div-in-span': {label: 'span 안의 div', isProjectCause: true},
    'span-type': {label: 'span 의 type', isProjectCause: true},
    'span-role': {label: 'span 의 role', isProjectCause: true},
    'heading-skip': {label: '제목 레벨 건너뜀', isProjectCause: true},
    'chart-style': {label: '차트 style 중첩', isProjectCause: false},
    'chart-width': {label: '차트 div의 width', isProjectCause: false},
    'chart-height': {label: '차트 div의 height', isProjectCause: false},
    unknown: {label: '원인 확인 필요', isProjectCause: false},
    'nav-role': {label: 'nav role', isProjectCause: false},
}

type IssueCatalogEntry = {
    kind: MarkupIssueKind
    level: 'error' | 'warning'
    message: string
    count: number
    screens: number
    owner: string
    isProjectCause: boolean
    verdict: string
}

// 확인된 메시지의 분류 정의입니다. 새 메시지는 원인 확인 필요로 남깁니다.
const ISSUE_DEFINITIONS: readonly Omit<IssueCatalogEntry, 'count' | 'screens'>[] = [
    {
        kind: 'chart-style',
        level: 'error',
        message:
            'Element “style” not allowed as child of element “div” in this context. (Suppressing further errors from this subtree.)',
        owner: 'shadcn/ui ChartStyle (src/components/ui/chart.tsx)',
        isProjectCause: false,
        verdict: 'ChartContainer의 div 내부에 ChartStyle이 style 요소를 생성합니다. 차트 셸의 스타일 주입 구조입니다.',
    },
    {
        kind: 'chart-width',
        level: 'error',
        message: 'Attribute “width” not allowed on element “div” at this point.',
        owner: 'Recharts 3.8.0 RechartsWrapper / StaticDiv',
        isProjectCause: false,
        verdict:
            'Recharts가 차트 크기 props를 내부 div에 그대로 전달합니다. 화면에서 div에 직접 지정한 속성이 아닙니다.',
    },
    {
        kind: 'chart-height',
        level: 'error',
        message: 'Attribute “height” not allowed on element “div” at this point.',
        owner: 'Recharts 3.8.0 RechartsWrapper / StaticDiv',
        isProjectCause: false,
        verdict:
            'Recharts가 차트 크기 props를 내부 div에 그대로 전달합니다. 화면에서 div에 직접 지정한 속성이 아닙니다.',
    },
    {
        kind: 'empty-option',
        level: 'error',
        message: 'Element “option” without attribute “label” must not be empty.',
        owner: 'shadcn/ui → Radix UI Select',
        isProjectCause: false,
        verdict: 'Footer 및 화면 내 Select에서 발생할 수 있으므로 요소 위치를 확인합니다.',
    },
    {
        kind: 'div-in-span',
        level: 'error',
        message:
            'Element “div” not allowed as child of element “span” in this context. (Suppressing further errors from this subtree.)',
        owner: '프로젝트 — 목록 한 줄의 구분선 배치',
        isProjectCause: true,
        verdict: '우리 마크업이 원인이다',
    },
    {
        kind: 'span-type',
        level: 'error',
        message: 'Attribute “type” not allowed on element “span” at this point.',
        owner: '프로젝트 — 모달 단독 화면의 숨은 트리거',
        isProjectCause: true,
        verdict: '아래 span 의 role 과 원인이 하나다',
    },
    {
        kind: 'span-role',
        level: 'error',
        message:
            'Element “span” is missing one or more of the following attributes: “aria-checked”, “aria-level”, “role”.',
        owner: '프로젝트 — 모달 단독 화면의 숨은 트리거',
        isProjectCause: true,
        verdict: '같은 span 하나에서 위 오류와 함께 나온다',
    },
    {
        kind: 'select-required',
        level: 'error',
        message:
            'A “select” element with a “required” attribute, and without a “multiple” attribute, and without a “size” attribute whose value is greater than “1”, must have a child “option” element.',
        owner: 'shadcn/ui → Radix UI Select',
        isProjectCause: false,
        verdict: 'Select 의 required 가 Radix 가 만든 숨은 select 로 그대로 넘어간다',
    },
    {
        kind: 'heading-skip',
        level: 'error',
        message:
            'The “heading” “h3” (with computed level 3) follows the heading “h1” (with computed level 1), skipping 1 heading level.',
        owner: '프로젝트 — 안내 상자의 제목 레벨',
        isProjectCause: true,
        verdict: '웹 접근성 [6.4.2] 와 직접 맞닿은 항목이다',
    },
    {
        kind: 'nav-role',
        level: 'warning',
        message: 'The “navigation” role is unnecessary for element “nav”.',
        owner: 'shadcn/ui Pagination 순정 셸',
        isProjectCause: false,
        verdict: 'nav 의 기본 역할과 겹친다는 안내다. 순정 셸이라 고치지 않는다 [SC-02]',
    },
]

// 저장된 검사 JSON만 집계하며, 미등록 메시지는 기존 원인으로 분류하지 않습니다.
const normalizeMessage = (message: string) => message.replace('The “heading” “h3”', 'The heading “h3”')
const kindForMessage = (message: string): MarkupIssueKind =>
    ISSUE_DEFINITIONS.find((issue) => normalizeMessage(issue.message) === normalizeMessage(message))?.kind ?? 'unknown'
const SCREEN_MARKUP_RESULTS = audit.screens.map((screen) => ({
    ...screen,
    userType: screen.path.startsWith('/corp/') ? '기업' : '기관',
    kinds: [
        ...new Set(
            screen.messages
                .filter((message) => message.type === 'error' || message.subType === 'warning')
                .map((message) => kindForMessage(message.message)),
        ),
    ],
}))
const ISSUE_CATALOG: readonly IssueCatalogEntry[] = ISSUE_DEFINITIONS.map((issue) => ({
    ...issue,
    count: audit.screens.reduce(
        (sum, screen) =>
            sum +
            screen.messages.filter(
                (message) =>
                    kindForMessage(message.message) === issue.kind &&
                    (message.type === 'error' || message.subType === 'warning'),
            ).length,
        0,
    ),
    screens: SCREEN_MARKUP_RESULTS.filter((screen) => screen.kinds.includes(issue.kind)).length,
}))
const UNKNOWN_ERROR_TOTAL = audit.screens.reduce(
    (sum, screen) =>
        sum +
        screen.messages.filter((message) => message.type === 'error' && kindForMessage(message.message) === 'unknown')
            .length,
    0,
)

type ProjectIssueSource = {
    kind: MarkupIssueKind
    title: string
    /** 이 원인이 만드는 표의 줄 — 한 원인이 두 줄을 만들기도 한다. */
    kinds: readonly MarkupIssueKind[]
    reason: string
    source: string
    fix: string
}

const PROJECT_ISSUE_SOURCES: readonly ProjectIssueSource[] = [
    {
        kind: 'div-in-span',
        title: 'span 안에 들어간 구분선 div',
        kinds: ['div-in-span'],
        reason: '목록 한 줄을 span 으로 감싸고 그 안에 InlineSeparator 를 기본형으로 넣었습니다. 기본형은 div 로 그려지는데 div 는 span 안에 올 수 없습니다. 검사기가 이 지점에서 아래 트리 검사를 멈추므로, 고치면 가려져 있던 오류가 더 드러날 수 있습니다.',
        source: 'src/components/composite/history-list.tsx · src/components/custom/inquiry-list.tsx',
        fix: 'InlineSeparator 에 이미 있는 inline 옵션을 켭니다 — 같은 모양을 span 으로 그립니다. 감싼 span 을 div 로 바꾸는 방법도 있지만 목록 한 줄이 통째로 링크 안이라 inline 쪽이 맞습니다.',
    },
    {
        kind: 'span-type',
        title: '모달만 있는 화면의 숨은 트리거가 span',
        kinds: ['span-type', 'span-role'],
        reason: '모달 단독 화면에서 DialogTrigger 의 asChild 대상으로 sr-only span 을 넘겼습니다. Radix 가 그 요소에 type="button" 과 버튼 역할의 aria 를 얹는데 span 은 그 속성을 받을 수 없습니다. 두 메시지가 같은 span 하나에서 나옵니다.',
        source: 'src/app/(user-type)/**/company-info/item-description/page.tsx · .../technology-category/page.tsx',
        fix: 'span 대신 sr-only 를 얹은 button 으로 바꿉니다. 보이는 모습은 그대로이고, 키보드·스크린리더에는 오히려 제 역할을 하는 버튼이 됩니다.',
    },
    {
        kind: 'heading-skip',
        title: '제목이 h1 에서 h3 으로 건너뜀',
        kinds: ['heading-skip'],
        reason: 'PageTitleBar 의 h1 다음에 h2 없이 InfoBox(기본 h3)가 옵니다. 제목 계층을 건너뛰면 스크린리더의 제목 이동에서 구획이 하나 사라진 것처럼 읽힙니다 [KWCAG 6.4.2].',
        source: 'src/app/(user-type)/{corp,org}/**/tech-index/selection/page.tsx',
        fix: 'InfoBox 에 headingLevel 을 2 로 넘기거나 그 위 구획에 h2 를 둡니다. InfoBox 는 이미 레벨을 받도록 되어 있습니다.',
    },
]

// 절마다 자기 줄만 담은 표를 세운다 — 표 하나에 몰아 두면 어느 설명이 어느 줄의 것인지 되짚어야 한다.
const issuesByKind = (kinds: readonly MarkupIssueKind[]) => ISSUE_CATALOG.filter((issue) => kinds.includes(issue.kind))

const routesWithKind = (kind: MarkupIssueKind) =>
    SCREEN_MARKUP_RESULTS.filter((screen) => screen.kinds.includes(kind)).map((screen) => screen.path)

const PROJECT_ISSUES = PROJECT_ISSUE_SOURCES.map((issue) => ({...issue, routes: routesWithKind(issue.kind)}))

const SCREEN_TOTALS = {
    screens: SCREEN_MARKUP_RESULTS.length,
    errors: SCREEN_MARKUP_RESULTS.reduce((sum, screen) => sum + screen.errors, 0),
    warnings: SCREEN_MARKUP_RESULTS.reduce((sum, screen) => sum + screen.warnings, 0),
    cleanScreens: SCREEN_MARKUP_RESULTS.filter((screen) => !screen.errors).length,
}

// 화면별 표는 이용자 구분으로 나눈다 — 두 묶음은 서로 다른 화면이라 한 표에 붙여 두면
// 찾는 쪽 화면을 만나기까지 반대편 100여 줄을 지나야 한다.
const SCREEN_GROUPS = [
    {key: 'corp', label: '기업', screens: SCREEN_MARKUP_RESULTS.filter((screen) => screen.userType === '기업')},
    {key: 'org', label: '기관', screens: SCREEN_MARKUP_RESULTS.filter((screen) => screen.userType === '기관')},
]

const PROJECT_ERROR_TOTAL = ISSUE_CATALOG.filter((issue) => issue.isProjectCause).reduce(
    (sum, issue) => sum + issue.count,
    0,
)
const LIBRARY_ERROR_TOTAL = ISSUE_CATALOG.filter((issue) => !issue.isProjectCause && issue.level === 'error').reduce(
    (sum, issue) => sum + issue.count,
    0,
)
const PROJECT_ISSUE_SCREENS = SCREEN_MARKUP_RESULTS.filter((screen) =>
    screen.kinds.some((kind) => ISSUE_LABEL[kind].isProjectCause),
).length

// 상단 요약 — 읽는 사람이 표를 열기 전에 규모와 결론을 먼저 잡도록 네 숫자만 크게 둔다.
// 총계 — 규모만 알려 주는 값이라 라벨은 낮추고 숫자만 굵게 둔다. 라벨·값이 짝으로 붙어 있어
// 한 줄에 늘어놓아도 어디까지가 한 항목인지 눈으로 갈린다.
const SUMMARY_TOTALS = [
    {label: '검사한 화면', value: `${SCREEN_TOTALS.screens}개`},
    {label: '오류', value: `${SCREEN_TOTALS.errors}건`},
    {label: '경고', value: `${SCREEN_TOTALS.warnings}건`},
    {label: '오류 없음', value: `${SCREEN_TOTALS.cleanScreens}개`},
]

const ISSUE_SCREENS_BY_KIND: Record<string, number> = Object.fromEntries(
    ISSUE_CATALOG.map((issue) => [issue.kind, issue.screens]),
)

// 발생한 오류만 공통 원인별로 묶습니다. 화면 수는 같은 원인 안에서 중복을 제거합니다.
const ACTIVE_PROJECT_ISSUES = PROJECT_ISSUES.filter((issue) =>
    issuesByKind(issue.kinds).some((entry) => entry.count > 0),
)
const UNKNOWN_GROUPS = new Map<string, {count: number; paths: Set<string>}>()
for (const screen of audit.screens) {
    for (const message of screen.messages) {
        if (message.type !== 'error' || kindForMessage(message.message) !== 'unknown') continue
        const key = normalizeMessage(message.message)
        const group = UNKNOWN_GROUPS.get(key) ?? {count: 0, paths: new Set<string>()}
        group.count += 1
        group.paths.add(screen.path)
        UNKNOWN_GROUPS.set(key, group)
    }
}
const SUMMARY_SPLIT = [
    {
        label: '외부 라이브러리 원인',
        badge: '예외 검토',
        color: 'success',
        value: `${LIBRARY_ERROR_TOTAL}건`,
        reasons: ISSUE_CATALOG.filter(
            (issue) => !issue.isProjectCause && issue.level === 'error' && issue.count > 0,
        ).map((issue) => ({
            head: `${ISSUE_LABEL[issue.kind].label} ${issue.count}건`,
            detail: `${issue.screens}개 화면 · ${issue.owner}`,
        })),
    },
    {
        label: '프로젝트 수정 대상',
        badge: PROJECT_ERROR_TOTAL ? '수정 대상' : '발생 없음',
        color: PROJECT_ERROR_TOTAL ? 'error' : 'neutral',
        value: `${PROJECT_ERROR_TOTAL}건`,
        reasons: ACTIVE_PROJECT_ISSUES.map((issue) => ({
            head: `${issue.title} ${issuesByKind(issue.kinds).reduce((sum, entry) => sum + entry.count, 0)}건`,
            detail: `${SCREEN_MARKUP_RESULTS.filter((screen) => issue.kinds.some((kind) => screen.kinds.includes(kind))).length}개 화면`,
        })),
    },
    {
        label: '원인 확인 필요',
        badge: '미분류',
        color: 'warning',
        value: `${UNKNOWN_ERROR_TOTAL}건`,
        reasons: [...UNKNOWN_GROUPS].map(([message, group]) => ({
            head: `${message} · ${group.count}건`,
            detail: `${group.paths.size}개 화면`,
        })),
    },
] as const

// sonner 관련 메시지 — 검사 대상인 서버 전송 HTML 에서는 217화면 모두 0건이고, 브라우저가 렌더한
// DOM 을 직렬화해 넣으면 화면마다 아래만큼 나온다. 2026-08-24 에 /corp/home 과 /corp/mypage/profile 의
// 직렬화본을 같은 검사기로 돌려 두 화면 모두 같은 값이었다.
// 2026-07-31 회차의 charset 1024바이트 초과는 이번 재현에서 나오지 않아(직렬화본에서도 104바이트 위치)
// 목록에서 내렸다.
const SONNER_ISSUES = [
    {
        level: 'error',
        message: 'Error: CSS: Parse Error. — “onner-toast]>*{transition:n”',
        count: 3,
        screens: 0,
        owner: 'sonner 주입 스타일시트',
        verdict: '한 규칙에서 파생된 뒤 선언까지 함께 보고돼 3건이며 원인은 하나다',
    },
    {
        level: 'warning',
        message: 'The “type” attribute for the “style” element is not needed and should be omitted.',
        count: 1,
        screens: 0,
        owner: 'sonner 동적 style 요소',
        verdict: 'HTML5 에서 style 의 기본 타입이 CSS 라 불필요하다는 안내다',
    },
] as const

// 차트가 있는 화면에서만 나오는 메시지 — 평가결과 리포트(심층분석)가 유일하다. 위 총계의 217화면에는
// 차트가 없어 그 회차에는 잡히지 않는다. 아래 건수는 차트 4개(레이더 1 · 선 1 · 막대 2)가 들어 있는
// /org/mypage/evaluation-history/deep-analysis/ktrs-fm 한 화면에서 잰 값이다.
//
// 서버가 보내는 문서에는 12건(wrapper div 8 · style 4)만 있고, 나머지 228건은 브라우저에서 차트가
// 그려진 뒤에 생긴다 — 전송 문서를 검사하면 12건, 렌더된 DOM 을 검사하면 240건이다.
// 차트가 들어간 화면 — 지금은 리포트 두 갈래뿐이고, 기업·기관이 같은 문서를 쓴다.
// WAVE — 보증추천 모달을 연 화면에서 나온 오류. 두 건 모두 Radix 가 만든 숨은 입력이다.
const WAVE_SCREEN_ROUTES = ['/org/mypage/evaluation-history/guarantee-recommendation'] as const

const WAVE_ISSUES = [
    {
        level: 'error',
        message: 'Missing form label (2)',
        count: 2,
        screens: 1,
        owner: 'Radix RadioGroup 의 숨은 라디오 input',
        verdict: '값을 폼에 담으려고 두는 input 이라 aria-hidden·tabindex="-1" 이 붙어 있고 라벨이 없다',
    },
] as const

// WAVE — 조회 필터(SelectFilterField·KeywordSearchField)가 있는 목록 화면이면 어디서나 나오는 두 건.
// Radix Select 가 고른 값을 폼에 담으려고 만드는 숨은 native select 가 원인이고, 셀렉트 한 칸에 하나씩
// 생긴다. 아래 건수는 셀렉트 두 칸(상태·검색 대상)이 있는 하위계정 현황에서 잰 값이다.
const WAVE_SELECT_SCREEN_ROUTES = ['/org/mypage/sub-account-progress'] as const

const WAVE_SELECT_ISSUES = [
    {
        level: 'error',
        message: 'Missing form label (1)',
        count: 1,
        screens: 1,
        owner: 'Radix Select 의 숨은 native select',
        verdict: '값을 폼에 담으려고 두는 select 라 aria-hidden·tabindex="-1" 이 붙어 있고 라벨이 없다',
    },
    {
        // WAVE 는 이 등급을 Alert 으로 적는다 — 이 표의 경고와 같은 자리다.
        level: 'warning',
        message: 'Select missing label (1)',
        count: 1,
        screens: 1,
        owner: 'Radix Select 의 숨은 native select',
        verdict: '위와 같은 종류의 요소를 두고 WAVE 가 등급만 달리 매긴 것이다',
    },
] as const

// 모달을 연 화면에서만 나오는 것들 — 모달 단독 확인 화면이 대표 예다.
const DIALOG_SCREEN_ROUTES = [
    '/org/mypage/evaluation-history/guarantee-recommendation/center-search',
    '/org/mypage/evaluation-history/guarantee-recommendation/bank-branch-search',
] as const

const DIALOG_ISSUES = [
    {
        level: 'warning',
        message: 'Attribute “aria-hidden” is unnecessary for elements that have attribute “hidden”.',
        count: 1,
        screens: 0,
        owner: 'aria-hidden 패키지(Radix 모달의 배경 감춤)',
        verdict: 'Next.js 가 남긴 <div hidden> 자리표시자에 모달이 aria-hidden 을 덧붙여 두 표시가 겹친다',
    },
    {
        level: 'warning',
        message: 'The “type” attribute for the “style” element is not needed and should be omitted.',
        count: 1,
        screens: 0,
        owner: 'react-style-singleton(react-remove-scroll)',
        verdict: '모달이 배경 스크롤을 잠그며 넣는 스타일에 type="text/css" 가 붙는다 — sonner 와 같은 종류다',
    },
] as const

const CHART_SCREEN_ROUTES = [
    '/org/mypage/evaluation-history/deep-analysis/ktrs-fm',
    '/corp/mypage/evaluation-results/general-analysis/ktrs-fm',
] as const

const CHART_ISSUES = [
    {
        level: 'error',
        message: 'Attribute “x” / “y” / “width” / “height” not allowed on element “path”.',
        count: 100,
        screens: 0,
        owner: 'recharts Rectangle(막대)',
        verdict: '막대를 rect 가 아니라 path 로 그리면서 사각형 좌표·크기를 그대로 붙인다',
    },
    {
        level: 'error',
        message:
            'Attribute “cx” / “cy” / “radius” / “angle” / “orientation” not allowed on element “path” / “line” / “text”.',
        count: 96,
        screens: 0,
        owner: 'recharts 극좌표(레이더)',
        verdict: '격자·축을 그릴 때 쓴 중심·반지름·각도 계산값이 그린 요소에 남는다',
    },
    {
        level: 'error',
        message: 'Attribute “width” / “height” not allowed on element “circle”.',
        count: 18,
        screens: 0,
        owner: 'recharts Dot(선 차트의 점)',
        verdict: '점 하나에 차트 폭·높이를 함께 붙인다. circle 은 r·cx·cy 만 받는다',
    },
    {
        level: 'error',
        message: 'Attribute “name” not allowed on element “path” / “circle”.',
        count: 12,
        screens: 0,
        owner: 'recharts 계열 이름',
        verdict: '계열 key(company·average·maturity)를 도형에 남긴다. name 은 SVG 도형 속성이 아니다',
    },
    {
        level: 'error',
        message: 'Attribute “width” / “height” not allowed on element “div”.',
        count: 8,
        screens: 0,
        owner: 'recharts 바깥 상자(.recharts-wrapper)',
        verdict: '크기를 style 과 속성 양쪽에 쓴다. div 는 전역 속성만 받는다',
    },
    {
        level: 'error',
        message: 'Element “style” not allowed as child of element “div” in this context.',
        count: 4,
        screens: 0,
        owner: 'shadcn/ui chart 셸(ChartStyle)',
        verdict: '차트 색 변수를 넣으려고 div 안에 style 을 그린다. style 은 head 에만 올 수 있다',
    },
    {
        level: 'error',
        message: 'Attribute “cx” / “cy” not allowed on element “svg”.',
        count: 2,
        screens: 0,
        owner: 'recharts RadarChart',
        verdict: '극좌표 중심값을 루트 svg 에까지 붙인다. cx·cy 는 circle 전용이다',
    },
] as const

// 종류별 표 — 같은 컬럼을 세 곳(외부·프로젝트·sonner)에서 쓰므로 한 조각으로 둔다.
type IssueTableRow = {
    level: 'error' | 'warning'
    message: string
    count: number
    screens: number
    owner: string
    verdict: string
}

const IssueTable = ({
    caption,
    issues,
    countHeader = '건수',
    showScreens = true,
}: {
    caption: string
    issues: readonly IssueTableRow[]
    /** 건수의 단위가 다른 표에서 머리글만 바꾼다(예: 화면당 건수). */
    countHeader?: string
    /** 화면 수를 셀 수 없는 표에서는 그 열을 뺀다. */
    showScreens?: boolean
}) => (
    <Table className="min-w-240 table-fixed">
        <colgroup>
            <col className="w-1/5" />
            <col className="w-1/4" />
            <col className="w-16" />
            <col className="w-16" />
            <col />
        </colgroup>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
                <TableHead scope="col">등급</TableHead>
                <TableHead scope="col">검사기 메시지</TableHead>
                <TableHead scope="col" className="text-center">
                    {countHeader}
                </TableHead>
                {showScreens ? (
                    <TableHead scope="col" className="text-center">
                        화면
                    </TableHead>
                ) : null}
                <TableHead scope="col">생성 주체</TableHead>
                <TableHead scope="col">비고</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {issues.map((issue) => (
                <TableRow key={issue.message}>
                    <TableCell className="align-top">
                        <IssueBadge level={issue.level} />
                    </TableCell>
                    <TableCell className="max-w-100 align-top font-mono whitespace-normal">{issue.message}</TableCell>
                    <TableCell className="text-center align-top font-bold">{issue.count}</TableCell>
                    {showScreens ? <TableCell className="text-center align-top">{issue.screens}</TableCell> : null}
                    <TableCell className="max-w-60 align-top whitespace-normal">{issue.owner}</TableCell>
                    <TableCell className="max-w-70 align-top whitespace-normal">{issue.verdict}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

// 절 본문 — 항목마다 가로선으로 갈라 둔다. 여러 항목을 간격만으로 띄우면 어디까지가 한 항목인지
// 흐려지고, 라벨이 본문에 묻힌다.
type DetailRow = {term: string; body: ReactNode}

const DetailList = ({rows}: {rows: readonly DetailRow[]}) => (
    <dl className="divide-subtle-3 flex flex-col divide-y">
        {rows.map((row) => (
            <div key={row.term} className="grid gap-x-3 gap-y-1 py-4 first:pt-0 last:pb-0 md:grid-cols-[7rem_1fr]">
                <dt className="font-bold">{row.term}</dt>
                <dd className="min-w-0">{row.body}</dd>
            </div>
        ))}
    </dl>
)

// 절 제목 — 앞머리에 [만든 주체] 를 달아 둔다. 네 절의 대괄호가 한 열로 서서, 어느 라이브러리
// 이야기인지 제목만 훑어도 갈린다.
const sectionHeading = (owner: string, title: string) => (
    <>
        <span className="text-foreground-subtle">[{owner}]</span> {title}
    </>
)

// 카드 제목 — 셸의 CardTitle 기본값(16)은 이 문서에서 카드 안 섹션 제목(24)보다 작아 위계가 뒤집힌다.
// 화면 제목(36) > 카드(24) > 섹션(20) > 본문 순으로 읽히도록 이 페이지에서만 카드 제목을 올려 준다.
const cardHeading = (text: string) => <span className="typo-h4-bold">{text}</span>

const ReferenceLink = ({href, children}: {href: string; children: string}) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary inline-flex items-center gap-1 underline underline-offset-4"
    >
        {children}
        <ExternalLink aria-hidden="true" className="size-icon-xs" />
        <span className="sr-only"> (새 창에서 열림)</span>
    </a>
)

const AccessibilityExceptionsPage = () => (
    <GuidePageShell
        title="접근성 검사 예외사항"
        description="접근성 증적 작성 시 WAVE·W3C 검사 메시지의 발생 원인과 예외 검토 근거를 확인하는 안내입니다."
    >
        <Alert variant="outline" color="info">
            <Info aria-hidden="true" />
            <AlertDescription>
                라이브러리에서 발생한 항목도 자동으로 접근성 통과나 예외 확정이 되는 것은 아닙니다. 아래 근거와 실제
                화면의 동작을 확인한 뒤 예외 검토 내용을 증적에 기록합니다.
            </AlertDescription>
        </Alert>

        <BaseCard title={cardHeading('증적 작성 안내')} subtitle="검사 메시지와 발생 조건을 대조한 뒤 기록합니다.">
            <div className="flex flex-col gap-4">
                <div>
                    <p className="font-bold">확인 순서</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                        <li>검사 도구 탭에서 동일한 오류·경고 메시지를 찾습니다.</li>
                        <li>발생 요소와 라이브러리·프로젝트 원인, 재현 조건을 확인합니다.</li>
                        <li>현재 화면에서도 재현되는지 확인하고, 예외 검토 근거 또는 수정 결과를 기록합니다.</li>
                    </ul>
                </div>
                <div>
                    <p className="font-bold">증적에 남길 항목</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                        <li>화면 URL · 검사일 · 빌드 버전 · 검사 도구와 버전</li>
                        <li>오류·경고 원문 · 해당 요소 · 화면 캡처 · 재현 조건(모달 열림, 선택값 등)</li>
                        <li>발생 원인 · 예외 검토 근거 링크 · 실제 조작 및 접근 가능한 이름 확인 결과</li>
                    </ul>
                </div>
                <p className="text-foreground-subtle">
                    요약·유형별 건수·화면별 표는 최근 저장된 W3C 검사 결과를 함께 사용합니다. 현재 소스와의 일치 여부는
                    아래 표시를 확인합니다. WAVE와 조작 후 DOM 사례는 별도 확인 대상입니다.
                </p>
            </div>
        </BaseCard>

        <LatestAudit />

        {/* W3C 마크업 검사와 WAVE 를 갈라 둔다 — 검사 도구가 다르고 회차도 따로 돈다.
            탭 밖의 판정 원칙은 두 검사에 함께 적용된다. */}
        <Tabs defaultValue="w3c">
            <TabsList variant="line" aria-label="검사 도구">
                <TabsTrigger value="w3c">W3C 검사 결과·예외 근거</TabsTrigger>
                <TabsTrigger value="wave">WAVE (웹 접근성 검사)</TabsTrigger>
            </TabsList>
            <TabsContent value="w3c" className="flex flex-col gap-10">
                <BaseCard
                    title={cardHeading('검사 방법')}
                    subtitle="같은 조건으로 다시 돌리면 같은 수치가 나오도록 기록합니다"
                >
                    <div className="flex flex-col gap-4">
                        <dl className="grid gap-3 md:grid-cols-[10rem_1fr]">
                            <dt className="font-bold">검사 대상</dt>
                            <dd>
                                커밋 <code className="font-mono">{AUDIT_COMMIT}</code> 의{' '}
                                <code className="font-mono">next build</code> 운영 HTML. 개발 서버가 아니라 실제로
                                전송되는 문서입니다
                            </dd>
                            <dt className="font-bold">검사 범위</dt>
                            <dd>퍼블리싱 인덱스에서 링크가 살아 있는 서비스 화면 {SCREEN_TOTALS.screens}개 전부</dd>
                            <dt className="font-bold">검사 도구</dt>
                            <dd>
                                <ReferenceLink href="https://validator.github.io/validator/">
                                    Nu Html Checker
                                </ReferenceLink>{' '}
                                {NU_VERSION} —{' '}
                                <ReferenceLink href="https://validator.w3.org/">
                                    W3C Markup Validation Service
                                </ReferenceLink>{' '}
                                와 같은 엔진입니다
                            </dd>
                            <dt className="font-bold">사용 버전</dt>
                            <dd>Next.js 16.2.9 · React 19.2.4 · radix-ui 1.6.2 · Recharts 3.8.0</dd>
                            <dt className="font-bold">shadcn 구성</dt>
                            <dd>
                                <code className="font-mono">radix-nova</code> 스타일 — 컴포넌트가 Radix UI 를 기반으로
                                합니다(Combobox 만 Base UI). shadcn 은 같은 이름의 컴포넌트를 Base UI 판과 Radix 판으로
                                함께 내놓는데, 판이 다르면 생성 DOM 도 다릅니다. 예를 들어 Select 는 Base UI 판이 숨은{' '}
                                <code className="font-mono">&lt;input&gt;</code> 을, 우리가 쓰는 Radix 판이 숨은{' '}
                                <code className="font-mono">&lt;select&gt;</code> 를 만듭니다
                            </dd>
                        </dl>
                    </div>
                </BaseCard>

                <BaseCard
                    title={cardHeading('최근 검사 요약')}
                    subtitle={`${AUDIT_DATE} · 커밋 ${AUDIT_COMMIT} 운영 빌드`}
                >
                    <div className="flex flex-col gap-5">
                        <dl className="grid gap-4 md:grid-cols-2">
                            {SUMMARY_SPLIT.map((item) => (
                                <div
                                    key={item.label}
                                    className="border-subtle-3 flex flex-col gap-3 rounded-sm border p-5"
                                >
                                    <dt className="flex flex-wrap items-center gap-2">
                                        <Badge color={item.color}>{item.badge}</Badge>
                                        <span className="typo-title-m-bold text-foreground">{item.label}</span>
                                    </dt>
                                    <dd className="flex flex-col gap-2">
                                        <span className="typo-display-s-bold text-foreground block">{item.value}</span>
                                        {item.reasons.length === 0 ? (
                                            <p className="typo-body-m-regular text-foreground-subtle">
                                                발생한 오류가 없습니다.
                                            </p>
                                        ) : null}
                                        <ul className="typo-body-m-regular text-foreground-subtle flex list-none flex-col gap-1">
                                            {item.reasons.map((reason) => (
                                                <li key={reason.head} className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0 break-keep">
                                                        <strong className="text-foreground">{reason.head}</strong> ·{' '}
                                                        {reason.detail}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        {/* 총계는 규모만 알려 주는 값이라 두 갈래 아래에 낮춰 둔다. */}
                        <dl className="typo-body-m-regular flex flex-wrap gap-x-5 gap-y-1">
                            {SUMMARY_TOTALS.map((total) => (
                                <div key={total.label} className="flex items-baseline gap-1.5">
                                    <dt className="text-foreground-subtle">{total.label}</dt>
                                    <dd className="text-foreground font-bold">{total.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </BaseCard>

                <BaseCard
                    title={cardHeading('외부 라이브러리 원인')}
                    subtitle="검사 당시 라이브러리 생성 DOM에서 확인한 항목입니다. 현재 화면의 발생 요소와 대조합니다."
                    action={<Badge color="success">예외 검토</Badge>}
                >
                    {/* 원인이 여럿이라 간격만으로는 경계가 흐려진다 — 절마다 구분선과 40px 여백을 둔다. */}
                    <div className="divide-subtle-3 flex flex-col divide-y">
                        <section
                            aria-labelledby="library-empty-option"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold" id="library-empty-option">
                                    {sectionHeading('Radix UI Select', '빈 option')}
                                </SectionHeaderTitle>
                            </SectionHeader>
                            <IssueTable
                                caption="빈 option 오류의 건수와 판정"
                                issues={issuesByKind(['empty-option'])}
                            />
                            <DetailList
                                rows={[
                                    {
                                        term: '왜 생기나',
                                        body: (
                                            <div className="flex flex-col gap-2">
                                                <p>shadcn/ui 의 Select 는 요소를 두 개 그립니다.</p>
                                                <ul className="flex list-none flex-col gap-1">
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            보이는 <code className="font-mono">&lt;button&gt;</code> —
                                                            사용자가 누르고 키보드로 조작하는 부분
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            숨은 <code className="font-mono">&lt;select&gt;</code> —
                                                            화면에 보이지 않고 키보드로도 닿지 않으며, 폼을 제출할 때
                                                            값만 넘기는 용도
                                                        </span>
                                                    </li>
                                                </ul>
                                                <CodeBlock
                                                    code={
                                                        '<!-- 보이는 것 -->\n<button role="combobox" aria-expanded="false">…</button>\n\n<!-- 숨은 것: 폼 제출용 -->\n<select aria-hidden="true" tabindex="-1" name="familySite" style="…">\n  <option value="" selected></option>\n</select>'
                                                    }
                                                    language="html"
                                                />
                                                <ul className="flex list-none flex-col gap-1">
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            <code className="font-mono">&lt;button&gt;</code> 은 폼
                                                            값으로 전송되지 않아, 값 전달용{' '}
                                                            <code className="font-mono">&lt;select&gt;</code> 를 따로
                                                            둡니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            숨은 <code className="font-mono">&lt;select&gt;</code> 는
                                                            사람이 볼 일이 없어 선택지에 표시할 글자가 없습니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            HTML 규칙상{' '}
                                                            <code className="font-mono">&lt;option&gt;</code> 은 글자를
                                                            갖거나 <code className="font-mono">label</code> 속성을
                                                            가져야 하는데, 둘 다 없어 오류가 납니다.
                                                        </span>
                                                    </li>
                                                </ul>
                                                <ul className="text-foreground-subtle flex list-none flex-col gap-1">
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            여기서 <code className="font-mono">label</code> 은{' '}
                                                            <code className="font-mono">&lt;label&gt;</code> 태그가
                                                            아니라 <code className="font-mono">&lt;option&gt;</code>{' '}
                                                            자신의 속성입니다 —{' '}
                                                            <code className="font-mono">
                                                                &lt;option label=&quot;사과&quot;&gt;
                                                            </code>
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            이 속성을 넣거나 태그 안에 글자를 넣으면(
                                                            <code className="font-mono">
                                                                &lt;option&gt;사과&lt;/option&gt;
                                                            </code>
                                                            ) 오류가 사라집니다.
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        ),
                                    },
                                    {
                                        term: '화면마다 반복',
                                        body: (
                                            <p>
                                                모든 화면 아래쪽 Footer 에 “관련 사이트” Select 가 있습니다. 그래서 화면
                                                수만큼({ISSUE_SCREENS_BY_KIND['empty-option']}개 화면) 같은 오류가
                                                반복됩니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>고칠 자리가 없습니다</strong> — 이 마크업은 우리가 쓴
                                                        것이 아니라 라이브러리가 만든 것이고, 라이브러리 원본은 고치지
                                                        않는 것이 프로젝트 규칙([SC-02])입니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>사용자에게 영향이 없습니다</strong> — 이 숨은{' '}
                                                        <code className="font-mono">&lt;select&gt;</code> 는 화면에
                                                        보이지도, 키보드로 닿지도, 스크린리더가 읽지도 않습니다(
                                                        <code className="font-mono">aria-hidden=&quot;true&quot;</code>·
                                                        <code className="font-mono">tabindex=&quot;-1&quot;</code>).
                                                        사용자가 실제로 조작하는{' '}
                                                        <code className="font-mono">&lt;button&gt;</code> 에는 라벨이
                                                        붙어 있습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>실행되면 사라집니다</strong> — Footer 의 Select 는 폼
                                                        안에 있지 않아, 화면이 실행되면 이 숨은{' '}
                                                        <code className="font-mono">&lt;select&gt;</code> 자체가 DOM
                                                        에서 빠집니다. 사용자가 보는 화면에는{' '}
                                                        <code className="font-mono">&lt;button&gt;</code> 하나만
                                                        남습니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <div className="flex flex-col gap-1">
                                                <ReferenceLink href="https://github.com/radix-ui/primitives/blob/a06624085504a13d9c21c04d238cf4c4f6905de1/packages/react/select/src/select.tsx#L1825-L1841">
                                                    Radix Select 소스 — 숨은 select 와 빈 option 을 만드는
                                                    곳(L1825~1841)
                                                </ReferenceLink>
                                                <ul className="text-foreground-subtle flex list-none flex-col gap-1">
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            Radix 는 따로 들여온 라이브러리가 아니라 shadcn/ui 가 쓰는
                                                            엔진입니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            shadcn 이 준 Select 소스 첫머리에{' '}
                                                            <code className="font-mono">
                                                                import {'{'} Select {'}'} from &quot;radix-ui&quot;
                                                            </code>{' '}
                                                            가 있습니다.
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="library-select-required"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold" id="library-select-required">
                                    {sectionHeading('Radix UI Select', 'required select')}
                                </SectionHeaderTitle>
                            </SectionHeader>
                            <IssueTable
                                caption="required select 오류의 건수와 판정"
                                issues={issuesByKind(['select-required'])}
                            />
                            <DetailList
                                rows={[
                                    {
                                        term: '왜 생기나',
                                        body: (
                                            <div className="flex flex-col gap-2">
                                                <ul className="flex list-none flex-col gap-1">
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            필수 입력으로 표시한 Select 는 숨은{' '}
                                                            <code className="font-mono">&lt;select&gt;</code> 태그에도{' '}
                                                            <code className="font-mono">required</code> 가 함께
                                                            붙습니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            HTML 규칙상 <code className="font-mono">required</code> 인{' '}
                                                            <code className="font-mono">&lt;select&gt;</code> 는{' '}
                                                            <code className="font-mono">&lt;option&gt;</code> 을 하나
                                                            이상 가져야 하는데, 이 숨은 태그에는 하나도 없어 오류가
                                                            납니다.
                                                        </span>
                                                    </li>
                                                </ul>
                                                <CodeBlock
                                                    code={
                                                        '<!-- 보이는 것 -->\n<button role="combobox" aria-expanded="false" id="corpType">…</button>\n\n<!-- 숨은 것: required 는 붙었는데 option 이 하나도 없다 -->\n<select aria-hidden="true" required tabindex="-1" name="corpType" style="…"></select>'
                                                    }
                                                    language="html"
                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        term: '조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>고칠 자리가 없습니다</strong> — 이 마크업은 우리가 쓴
                                                        것이 아니라 라이브러리가 만든 것이고, 라이브러리 원본은 고치지
                                                        않는 것이 프로젝트 규칙([SC-02])입니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>
                                                            <code className="font-mono">required</code> 를 뗄 수는
                                                            없습니다
                                                        </strong>{' '}
                                                        — 폼 검증이 이 속성으로 필수 미입력을 판정합니다. 떼면 사용자가
                                                        값을 비운 채 제출할 수 있게 됩니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>사용자에게 영향이 없습니다</strong> — 화면이 실행되면
                                                        숨은 <code className="font-mono">&lt;select&gt;</code> 에{' '}
                                                        <code className="font-mono">&lt;option&gt;</code> 이 채워져 정상
                                                        상태가 되고, 필수 검증도 정상으로 동작합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <div className="flex flex-col gap-1">
                                                <ReferenceLink href="https://github.com/radix-ui/primitives/blob/a06624085504a13d9c21c04d238cf4c4f6905de1/packages/react/select/src/select.tsx#L1828">
                                                    Radix Select 소스 — required 를 숨은 select 로 넘기는 곳(L1828)
                                                </ReferenceLink>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="library-nav-role"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold" id="library-nav-role">
                                    {sectionHeading('shadcn Pagination', 'nav role 경고')}
                                </SectionHeaderTitle>
                            </SectionHeader>
                            <IssueTable caption="nav role 경고의 건수와 판정" issues={issuesByKind(['nav-role'])} />
                            <DetailList
                                rows={[
                                    {
                                        term: '왜 생기나',
                                        body: (
                                            <p>
                                                shadcn Pagination 순정 셸이{' '}
                                                <code className="font-mono">
                                                    &lt;nav role=&quot;navigation&quot;&gt;
                                                </code>{' '}
                                                을 출력합니다. <code className="font-mono">nav</code> 의 기본 역할과
                                                겹쳐 불필요하다는 안내이며 오류가 아닙니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '조치',
                                        body: (
                                            <p>
                                                shadcn/ui 의 primitive 셸 구조에 손대지 않는다는 규칙([SC-02])에 따라
                                                그대로 둡니다.
                                            </p>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="library-sonner"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold" id="library-sonner">
                                    {sectionHeading('sonner', 'CSS Parse Error · style type 경고')}
                                </SectionHeaderTitle>
                            </SectionHeader>
                            <IssueTable
                                caption="sonner 가 만든 DOM 직렬화본에서 나오는 메시지와 화면당 건수"
                                issues={SONNER_ISSUES}
                                countHeader="화면당 건수"
                                showScreens={false}
                            />
                            <DetailList
                                rows={[
                                    {
                                        term: '왜 생기나',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        sonner 는 알림 토스트를 띄우는 라이브러리입니다. 화면이 실행될
                                                        때 자기 스타일을{' '}
                                                        <code className="font-mono">&lt;style&gt;</code> 요소로 문서에
                                                        끼워 넣습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>서버가 보내는 문서에는 그 요소가 없습니다.</strong> 이는
                                                        과거 조작 후 DOM 검사 사례이며, 현재 운영 HTML 집계와는
                                                        별개입니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        브라우저에서 실행된 뒤의 화면을 그대로 복사해(DevTools 복사·확장
                                                        저장 등) 검사기에 넣으면 그 스타일이 함께 들어가, 위 두 메시지가
                                                        나옵니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>고칠 자리가 없습니다</strong> — 우리 코드에는 그
                                                        마크업이 없습니다. 실행 중에 라이브러리가 만들고, 서드파티
                                                        원본은 고치지 않습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>문법 오류가 아닙니다</strong> — CSS Parse Error 는
                                                        sonner 가 쓴 최신 CSS 문법을 검사기가 읽지 못해 나는
                                                        오탐입니다(모든 브라우저는 정상 해석). style 의 type 은 sonner
                                                        가 그 요소를 만들며{' '}
                                                        <code className="font-mono">type=&quot;text/css&quot;</code> 를
                                                        붙이는데, HTML5 에서는 그게 기본값이라 없어도 된다는 안내입니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="library-dialog"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold" id="library-dialog">
                                    {sectionHeading('Radix 모달', '배경 감춤 · 스크롤 잠금 스타일')}
                                </SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    모달이 열린 화면에서만 나옵니다 — 모달 단독 확인 화면이 대표 예입니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <IssueTable
                                caption="모달이 열렸을 때 생기는 메시지와 화면당 건수"
                                issues={DIALOG_ISSUES}
                                countHeader="화면당 건수"
                                showScreens={false}
                            />
                            <DetailList
                                rows={[
                                    {
                                        term: '왜 생기나',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        모달이 열리면 Radix 는 읽어 주는 기계가 뒤 배경을 읽지 않도록{' '}
                                                        <strong>본문의 형제 요소마다 aria-hidden 을 붙입니다.</strong>{' '}
                                                        그 대상 중 하나가 Next.js 가 남긴{' '}
                                                        <code className="font-mono">&lt;div hidden&gt;</code>{' '}
                                                        자리표시자라, 이미 숨겨진 요소에 표시가 하나 더 붙습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        같은 순간 모달은 배경 스크롤을 잠그며 스타일 한 벌을 문서에 끼워
                                                        넣습니다(react-remove-scroll). 그 요소에{' '}
                                                        <code className="font-mono">type=&quot;text/css&quot;</code> 가
                                                        붙어 sonner 와 같은 안내가 한 건 더 나옵니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>서버가 보내는 문서에는 둘 다 없습니다</strong> — 전송
                                                        문서에는 자리표시자만 있고 aria-hidden 도, 주입된 스타일도
                                                        없습니다. 브라우저에서 모달이 열린 뒤의 화면을 복사해 넣을 때만
                                                        나옵니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '영향',
                                        body: (
                                            <p>
                                                화면과 접근성에는 영향이 없습니다. 겹친 두 표시는 뜻이 같아 (&quot;읽지
                                                않는다&quot;) 서로 어긋나지 않고, 스크롤 잠금 스타일은 모달을 닫으면
                                                사라집니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '조치',
                                        body: (
                                            <p>
                                                <strong>고칠 자리가 없습니다</strong> — 우리 코드에는 그 마크업이
                                                없습니다. 모달의 배경 감춤·스크롤 잠금은 Radix 가 맡는 동작이라 셸에서
                                                손대지 않는다는 규칙([SC-02])에 해당합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '해당 화면',
                                        body: (
                                            <ul className="flex flex-wrap gap-2">
                                                {DIALOG_SCREEN_ROUTES.map((route) => (
                                                    <li key={route}>
                                                        <Badge variant="solid-pastel" color="success" size="xs">
                                                            <code className="font-mono">{route}</code>
                                                        </Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="library-chart"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold" id="library-chart">
                                    {sectionHeading('recharts · shadcn chart', 'SVG 속성 · div 안의 style')}
                                </SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    차트가 있는 화면에서만 나옵니다 — 평가결과 리포트(심층분석)가 유일합니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <IssueTable
                                caption="최근 운영 HTML 검사 — 차트 셸과 Recharts 생성 요소"
                                issues={issuesByKind(['chart-style', 'chart-width', 'chart-height'])}
                            />
                            <ReferenceLink href="/org/mypage/evaluation-history/deep-analysis/ktrs-fm">
                                기관 KTRS-FM 심층분석 화면 확인
                            </ReferenceLink>
                            <p>
                                ChartStyle은 프로젝트에 복사된 shadcn 셸에서 생성되고, width·height는 Recharts 내부
                                StaticDiv에서 생성됩니다. 라이브러리 원인 분류이며 접근성 예외 확정을 뜻하지 않습니다.
                            </p>
                            <IssueTable
                                caption="과거 브라우저 DOM 검사 사례 — 현재 운영 HTML 집계와 별개"
                                issues={CHART_ISSUES}
                                countHeader="화면당 건수"
                                showScreens={false}
                            />
                            <DetailList
                                rows={[
                                    {
                                        term: '왜 생기나',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        recharts 는 차트를 계산할 때 쓴 값(중심·반지름·각도·좌표·계열
                                                        이름)을 <strong>그린 SVG 요소에 그대로 남깁니다.</strong> SVG
                                                        규격에 없는 속성이라 검사기가 하나하나 오류로 셉니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        shadcn <code className="font-mono">ui/chart.tsx</code> 의
                                                        ChartStyle 은 차트 색 변수를 넣으려고{' '}
                                                        <code className="font-mono">&lt;div&gt;</code> 안에{' '}
                                                        <code className="font-mono">&lt;style&gt;</code> 을 그립니다.
                                                        style 은 head 에만 올 수 있습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>전송 문서에는 12건뿐입니다</strong> — 바깥 상자의 크기
                                                        속성 8건과 style 4건입니다. 나머지 228건은 브라우저에서 차트가
                                                        그려진 뒤에 생기므로, 렌더된 DOM 을 넣으면 240건이 됩니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '영향',
                                        body: (
                                            <p>
                                                브라우저는 모르는 속성을 무시하므로 화면과 접근성에는 영향이 없습니다.
                                                차트에는 이미 <code className="font-mono">role=&quot;img&quot;</code> 과
                                                이름이 있고, 같은 값을 담은 숨김 데이터표를 함께 두었습니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '조치',
                                        body: (
                                            <p>
                                                <strong>고칠 자리가 없습니다</strong> — 우리 코드에는 그 마크업이
                                                없습니다. recharts 가 그리는 것이고, shadcn 셸의 구조는 수정하지
                                                않는다는 규칙([SC-02])에 해당합니다. 없애려면 차트를 직접 SVG 로 그려야
                                                합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '해당 화면',
                                        body: (
                                            <ul className="flex flex-wrap gap-2">
                                                {CHART_SCREEN_ROUTES.map((route) => (
                                                    <li key={route}>
                                                        <Badge variant="solid-pastel" color="success" size="xs">
                                                            <code className="font-mono">{route}</code>
                                                        </Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                ]}
                            />
                        </section>
                    </div>
                </BaseCard>

                <BaseCard
                    title={cardHeading('프로젝트 원인')}
                    subtitle={`오류 ${PROJECT_ERROR_TOTAL}건 · 화면 ${PROJECT_ISSUE_SCREENS}개 — 우리 마크업에서 나옵니다`}
                    action={
                        <Badge color={PROJECT_ERROR_TOTAL ? 'error' : 'neutral'}>
                            {PROJECT_ERROR_TOTAL ? '수정 대상' : '발생 없음'}
                        </Badge>
                    }
                >
                    {ACTIVE_PROJECT_ISSUES.length === 0 ? <p>발생한 프로젝트 오류가 없습니다.</p> : null}
                    {/* 원인이 여럿이라 간격만으로는 경계가 흐려진다 — 절마다 구분선과 40px 여백을 둔다. */}
                    <div className="divide-subtle-3 flex flex-col divide-y">
                        {ACTIVE_PROJECT_ISSUES.map((issue, index) => (
                            <section
                                key={issue.kind}
                                aria-labelledby={`project-issue-${issue.kind}`}
                                className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                            >
                                <SectionHeader>
                                    <SectionHeaderTitle
                                        className="typo-title-l-bold"
                                        id={`project-issue-${issue.kind}`}
                                    >
                                        {index + 1}. {issue.title}
                                    </SectionHeaderTitle>
                                    <SectionHeaderDescription>
                                        {issue.routes.length}개 화면에서 재현
                                    </SectionHeaderDescription>
                                </SectionHeader>
                                <IssueTable
                                    caption={`${issue.title} 의 건수와 판정`}
                                    issues={issuesByKind(issue.kinds)}
                                />
                                <DetailList
                                    rows={[
                                        {term: '왜 생기나', body: <p>{issue.reason}</p>},
                                        {
                                            term: '원인 파일',
                                            body: <code className="font-mono break-all">{issue.source}</code>,
                                        },
                                        {term: '조치', body: <p>{issue.fix}</p>},
                                        {
                                            term: '해당 화면',
                                            body: (
                                                <ul className="flex flex-col gap-2 break-all">
                                                    {issue.routes.map((route) => (
                                                        <li key={route}>
                                                            <ReferenceLink href={route}>{route}</ReferenceLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ),
                                        },
                                    ]}
                                />
                            </section>
                        ))}
                    </div>
                </BaseCard>

                <BaseCard
                    title={cardHeading('화면별 검사 기록')}
                    subtitle="최근 저장된 전수검사 결과입니다. 소스가 변경되었다면 재검사합니다."
                >
                    <Accordion type="multiple">
                        <AccordionItem value="screens">
                            <AccordionTrigger>
                                서비스 화면 {SCREEN_TOTALS.screens}개 — 오류 {SCREEN_TOTALS.errors}건 · 경고{' '}
                                {SCREEN_TOTALS.warnings}건
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-4">
                                    {/* 기업·기관은 서로 다른 화면 묶음이라 한 표에 붙여 두면 200줄을 훑어야 한다.
                                        1뎁스가 검사 도구 탭이므로 여기는 2뎁스인 pill 을 쓴다. */}
                                    <Tabs defaultValue={SCREEN_GROUPS[0].key}>
                                        <TabsList variant="pill" aria-label="이용자 구분">
                                            {SCREEN_GROUPS.map((group) => (
                                                <TabsTrigger key={group.key} value={group.key}>
                                                    {group.label} {group.screens.length}개
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {SCREEN_GROUPS.map((group) => (
                                            <TabsContent key={group.key} value={group.key}>
                                                <Table className="min-w-240 table-fixed">
                                                    <colgroup>
                                                        <col className="w-1/5" />
                                                        <col className="w-1/4" />
                                                        <col className="w-16" />
                                                        <col className="w-16" />
                                                        <col />
                                                    </colgroup>
                                                    <TableCaption className="sr-only">
                                                        {group.label} 화면별 마크업 검사 오류·경고 건수와 종류
                                                    </TableCaption>
                                                    <TableHeader>
                                                        <TableRow className="bg-muted hover:bg-muted">
                                                            <TableHead scope="col">화면명</TableHead>
                                                            {/* 경로는 공백이 없어 그냥 두면 한 줄로 끝까지 늘어난다 —
                                                                폭을 정하고 줄바꿈을 허용한다. */}
                                                            <TableHead scope="col" className="w-70">
                                                                경로
                                                            </TableHead>
                                                            <TableHead scope="col" className="text-center">
                                                                오류
                                                            </TableHead>
                                                            <TableHead scope="col" className="text-center">
                                                                경고
                                                            </TableHead>
                                                            <TableHead scope="col">종류</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {group.screens.map((screen) => (
                                                            <TableRow key={screen.path}>
                                                                {/* 화면명이 그 화면으로 가는 링크다 — 경로 문자열보다 이름이 눈에 먼저 들어온다. */}
                                                                <TableCell className="max-w-60 align-top whitespace-normal">
                                                                    <Link
                                                                        href={screen.path}
                                                                        className="text-primary focus-visible:ring-ring rounded-xs font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                                                                    >
                                                                        {screen.name}
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell className="max-w-70 align-top whitespace-normal">
                                                                    <code className="font-mono break-all">
                                                                        {screen.path}
                                                                    </code>
                                                                </TableCell>
                                                                <TableCell className="text-center align-top font-bold">
                                                                    {screen.errors}
                                                                </TableCell>
                                                                <TableCell className="text-center align-top">
                                                                    {screen.warnings}
                                                                </TableCell>
                                                                <TableCell className="max-w-90 align-top whitespace-normal">
                                                                    {screen.kinds.length ? (
                                                                        <span className="flex flex-wrap gap-1">
                                                                            {screen.kinds.map((kind) => (
                                                                                <Badge
                                                                                    key={kind}
                                                                                    size="xs"
                                                                                    color={
                                                                                        ISSUE_LABEL[kind].isProjectCause
                                                                                            ? 'error'
                                                                                            : 'warning'
                                                                                    }
                                                                                >
                                                                                    {ISSUE_LABEL[kind].label}
                                                                                </Badge>
                                                                            ))}
                                                                        </span>
                                                                    ) : (
                                                                        <Badge size="xs" color="success">
                                                                            없음
                                                                        </Badge>
                                                                    )}
                                                                    {screen.messages.some(
                                                                        (message) =>
                                                                            message.type === 'error' ||
                                                                            message.subType === 'warning',
                                                                    ) ? (
                                                                        <Accordion
                                                                            type="single"
                                                                            collapsible
                                                                            className="mt-2"
                                                                        >
                                                                            <AccordionItem
                                                                                value="messages"
                                                                                className="rounded-none bg-transparent p-0"
                                                                            >
                                                                                <AccordionTrigger
                                                                                    aria-label={`${screen.name} 오류·경고 상세`}
                                                                                    className="text-foreground-subtle **:data-[slot=accordion-trigger-icon]:size-icon-xs flex-none items-center justify-start gap-1 py-1 text-xs! leading-5! font-normal! **:data-[slot=accordion-trigger-icon]:ml-0"
                                                                                >
                                                                                    오류·경고 상세
                                                                                </AccordionTrigger>
                                                                                <AccordionContent className="pt-2 text-xs! leading-5! font-normal!">
                                                                                    <ul className="flex flex-col gap-3">
                                                                                        {screen.messages
                                                                                            .filter(
                                                                                                (message) =>
                                                                                                    message.type ===
                                                                                                        'error' ||
                                                                                                    message.subType ===
                                                                                                        'warning',
                                                                                            )
                                                                                            .map((message, index) => (
                                                                                                <li
                                                                                                    key={index}
                                                                                                    className="flex flex-col items-start gap-1"
                                                                                                >
                                                                                                    <IssueBadge
                                                                                                        level={
                                                                                                            message.subType ||
                                                                                                            message.type
                                                                                                        }
                                                                                                    />
                                                                                                    <p className="break-words">
                                                                                                        {
                                                                                                            message.message
                                                                                                        }
                                                                                                    </p>
                                                                                                    {message.lastLine ? (
                                                                                                        <span className="text-foreground-subtle">
                                                                                                            HTML{' '}
                                                                                                            {
                                                                                                                message.lastLine
                                                                                                            }
                                                                                                            행
                                                                                                        </span>
                                                                                                    ) : null}
                                                                                                </li>
                                                                                            ))}
                                                                                    </ul>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                    ) : null}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </BaseCard>
            </TabsContent>
            <TabsContent value="wave" className="flex flex-col gap-10">
                <BaseCard
                    title={cardHeading('라이브러리 원인')}
                    subtitle="라이브러리가 생성한 숨김 요소의 검사 사례입니다. 사용자 조작 요소의 라벨 연결은 별도로 확인합니다."
                    action={<Badge color="warning">라이브러리 발생</Badge>}
                >
                    <section aria-labelledby="wave-radio" className="flex flex-col gap-3">
                        <SectionHeader>
                            <SectionHeaderTitle className="typo-title-l-bold" id="wave-radio">
                                {sectionHeading('Radix RadioGroup', 'Missing form label')}
                            </SectionHeaderTitle>
                            <SectionHeaderDescription>
                                라디오 묶음이 있는 화면에서 보기 수만큼 나옵니다
                            </SectionHeaderDescription>
                        </SectionHeader>
                        <IssueTable caption="WAVE 가 보고한 메시지와 건수" issues={WAVE_ISSUES} />
                        <DetailList
                            rows={[
                                {
                                    term: '왜 생기나',
                                    body: (
                                        <ul className="flex list-none flex-col gap-2">
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    Radix 라디오는 눈에 보이는 컨트롤을{' '}
                                                    <code className="font-mono">button[role=radio]</code> 로 그리고,
                                                    고른 값이 폼 제출에 담기도록{' '}
                                                    <strong>보기마다 숨은 input 을 하나씩 더 둡니다.</strong>
                                                </span>
                                            </li>
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    그 input 에는{' '}
                                                    <code className="font-mono">aria-hidden=&quot;true&quot;</code> 와{' '}
                                                    <code className="font-mono">tabindex=&quot;-1&quot;</code> 이 붙어
                                                    읽어 주는 기계와 키보드 모두 닿지 않습니다. WAVE 는 그래도 폼
                                                    컨트롤로 세어 라벨이 없다고 알립니다.
                                                </span>
                                            </li>
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    <strong>보이는 컨트롤에는 라벨이 있습니다</strong> — 보기마다{' '}
                                                    <code className="font-mono">label[for]</code> 이 붙고(&quot;여&quot;
                                                    ·&quot;부&quot;), 물음은 묶음(radiogroup)의 이름으로 잇습니다.
                                                </span>
                                            </li>
                                        </ul>
                                    ),
                                },
                                {
                                    term: '조치',
                                    body: (
                                        <p>
                                            <strong>고칠 자리가 없습니다</strong> — 우리 코드에는 그 input 이 없습니다.
                                            Radix 가 폼 제출을 위해 만드는 것이고, 셸의 구조는 수정하지 않는다는
                                            규칙([SC-02])에 해당합니다.
                                        </p>
                                    ),
                                },
                                {
                                    term: '해당 화면',
                                    body: (
                                        <ul className="flex flex-wrap gap-2">
                                            {WAVE_SCREEN_ROUTES.map((route) => (
                                                <li key={route}>
                                                    <Badge variant="solid-pastel" color="success" size="xs">
                                                        <code className="font-mono">{route}</code>
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    ),
                                },
                            ]}
                        />
                    </section>

                    <section aria-labelledby="wave-select" className="flex flex-col gap-3">
                        <SectionHeader>
                            <SectionHeaderTitle className="typo-title-l-bold" id="wave-select">
                                {sectionHeading('Radix Select', 'Missing form label · Select missing label')}
                            </SectionHeaderTitle>
                            <SectionHeaderDescription>
                                조회 필터의 셀렉트 한 칸마다 하나씩 나옵니다
                            </SectionHeaderDescription>
                        </SectionHeader>
                        <IssueTable caption="WAVE 가 보고한 메시지와 건수" issues={WAVE_SELECT_ISSUES} />
                        <DetailList
                            rows={[
                                {
                                    term: '왜 생기나',
                                    body: (
                                        <ul className="flex list-none flex-col gap-2">
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    Radix 셀렉트는 눈에 보이는 컨트롤을{' '}
                                                    <code className="font-mono">button[role=combobox]</code> 로 그리고,
                                                    고른 값이 폼 제출에 담기도록{' '}
                                                    <strong>
                                                        칸마다 숨은 <code className="font-mono">select</code> 를 하나씩
                                                        더 둡니다.
                                                    </strong>
                                                </span>
                                            </li>
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    그 <code className="font-mono">select</code> 에는{' '}
                                                    <code className="font-mono">aria-hidden=&quot;true&quot;</code> ·{' '}
                                                    <code className="font-mono">tabindex=&quot;-1&quot;</code> 이 붙어
                                                    있어 스크린리더도 키보드도 닿지 않습니다. WAVE 는 그 두 속성을 보지
                                                    않고 라벨 유무만 셉니다.
                                                </span>
                                            </li>
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    사용자가 실제로 쓰는 컨트롤에는 이름이 있습니다 — 상태 칸은{' '}
                                                    <code className="font-mono">label[for]</code>(감춘 라벨), 검색 대상
                                                    칸은 <code className="font-mono">aria-label</code> 입니다[7.4.1].
                                                </span>
                                            </li>
                                        </ul>
                                    ),
                                },
                                {
                                    term: '조치',
                                    body: (
                                        <p>
                                            <strong>고칠 자리가 없습니다</strong> — 우리 코드에는 그{' '}
                                            <code className="font-mono">select</code> 가 없습니다. Radix 가 폼 제출을
                                            위해 만드는 것이고 이름을 넣을 prop 도 열려 있지 않아, 고치려면 셸을 손대야
                                            합니다([SC-02]).
                                        </p>
                                    ),
                                },
                                {
                                    term: '해당 화면',
                                    body: (
                                        <ul className="flex flex-wrap gap-2">
                                            {WAVE_SELECT_SCREEN_ROUTES.map((route) => (
                                                <li key={route}>
                                                    <Badge variant="solid-pastel" color="success" size="xs">
                                                        <code className="font-mono">{route}</code>
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    ),
                                },
                            ]}
                        />
                    </section>
                </BaseCard>

                <BaseCard
                    title={cardHeading('프로젝트 원인')}
                    subtitle="우리 마크업에서 나왔고 같은 회차에 고친 것입니다"
                    action={<Badge color="success">수정 완료</Badge>}
                >
                    <section aria-labelledby="wave-radio-label" className="flex flex-col gap-3">
                        <SectionHeader>
                            <SectionHeaderTitle className="typo-title-l-bold" id="wave-radio-label">
                                {sectionHeading('라디오 묶음', '물음이 첫 보기의 이름이 됨')}
                            </SectionHeaderTitle>
                            <SectionHeaderDescription>
                                검사기 메시지로는 잡히지 않고, 읽어 주는 이름을 직접 확인해야 드러납니다
                            </SectionHeaderDescription>
                        </SectionHeader>
                        <DetailList
                            rows={[
                                {
                                    term: '무엇이 문제였나',
                                    body: (
                                        <ul className="flex list-none flex-col gap-2">
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    묶음 전체의 물음(&quot;현재 다른 보증기관 이용 여부&quot;)을{' '}
                                                    <code className="font-mono">
                                                        &lt;label htmlFor=&quot;…-no&quot;&gt;
                                                    </code>{' '}
                                                    로 두어 <strong>첫 보기 하나에 묶여 있었습니다.</strong>
                                                </span>
                                            </li>
                                            <li className="flex">
                                                <ListMarker type="unordered-small" />
                                                <span className="min-w-0">
                                                    그래서 첫 보기의 이름이 &quot;부&quot; 가 아니라 물음 전체가 되고,
                                                    둘째 보기(&quot;여&quot;)는 무엇을 묻는지 없이 홀로 읽혔습니다
                                                    [7.4.1].
                                                </span>
                                            </li>
                                        </ul>
                                    ),
                                },
                                {
                                    term: '원인 파일',
                                    body: (
                                        <code className="font-mono break-all">
                                            src/components/composite/guarantee-recommendation-dialog.tsx
                                        </code>
                                    ),
                                },
                                {
                                    term: '조치',
                                    body: (
                                        <p>
                                            물음을 <code className="font-mono">id</code> 를 가진 글자로 두고 묶음
                                            (radiogroup)에 <code className="font-mono">aria-labelledby</code> 로
                                            이었습니다 — 기관 고객정보활용동의의 동의 여부 물음과 같은 방식입니다. label
                                            을 그대로 두고 htmlFor 만 지우면 가리키는 컨트롤이 없는 라벨이 되어 검사기가
                                            다시 잡습니다.
                                        </p>
                                    ),
                                },
                                {
                                    term: '해당 화면',
                                    body: (
                                        <ul className="flex flex-wrap gap-2">
                                            {WAVE_SCREEN_ROUTES.map((route) => (
                                                <li key={route}>
                                                    <Badge variant="solid-pastel" color="success" size="xs">
                                                        <code className="font-mono">{route}</code>
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    ),
                                },
                            ]}
                        />
                    </section>
                </BaseCard>
            </TabsContent>
        </Tabs>
    </GuidePageShell>
)

export default AccessibilityExceptionsPage
