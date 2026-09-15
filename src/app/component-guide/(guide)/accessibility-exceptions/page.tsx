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
import {
    PUBLISHING_INDEX_CONTENT,
    SCREEN_REGISTRY,
    isStructureBranch,
    type Status,
    type StructureGroup,
    type StructureNode,
    type UserType,
} from '@/content/publishing-guide'
import IssueBadge from './issue-badge'
import type {Audit} from './latest-audit'
import auditData from '@/content/publishing-guide/accessibility-audit.json'
import type {MarkupIssueKind} from './screen-markup-results'
import AuditSummaryMetadata from './audit-summary-metadata'

const audit: Audit = auditData

export const metadata: Metadata = {title: '접근성 검사 예외사항'}

// 날짜·커밋은 한 곳에서 관리해 본문 어디에서도 회차가 어긋나지 않게 한다.
const AUDIT_COMMIT = audit.commit?.slice(0, 7) ?? '기록 없음'
const NU_VERSION = audit.validatorVersion?.replace(/\s+\([^)]*\)\s*$/, '') ?? '기록 없음'

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

const EMPTY_OPTION_MESSAGE = 'Element “option” without attribute “label” must not be empty.'
const SELECT_REQUIRED_MESSAGE =
    'A “select” element with a “required” attribute, and without a “multiple” attribute, and without a “size” attribute whose value is greater than “1”, must have a child “option” element.'

const LIBRARY_ISSUE_TARGET: Partial<Record<MarkupIssueKind, string>> = {
    'empty-option': 'library-empty-option',
    'select-required': 'library-select-required',
    'nav-role': 'library-nav-role',
    'chart-style': 'library-chart',
    'chart-width': 'library-chart',
    'chart-height': 'library-chart',
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
        message: EMPTY_OPTION_MESSAGE,
        owner: 'shadcn/ui Select 내부의 Radix UI',
        isProjectCause: false,
        verdict: '선택 전 placeholder 상태를 나타내려고 Radix UI가 숨은 select 안에 빈 option을 자동 생성합니다.',
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
        message: SELECT_REQUIRED_MESSAGE,
        owner: 'shadcn/ui Select 내부의 Radix UI',
        isProjectCause: false,
        verdict: '초기 HTML에서 Radix UI가 만든 숨은 필수 select에 option이 아직 생성되지 않은 상태입니다.',
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
        verdict: 'nav 의 기본 역할과 겹친다는 안내다. 순정 셸이라 고치지 않는다',
    },
]

// 저장된 검사 JSON만 집계하며, 미등록 메시지는 기존 원인으로 분류하지 않습니다.
const normalizeMessage = (message: string) => message.replace('The “heading” “h3”', 'The heading “h3”')
const kindForMessage = (message: string): MarkupIssueKind =>
    ISSUE_DEFINITIONS.find((issue) => normalizeMessage(issue.message) === normalizeMessage(message))?.kind ?? 'unknown'
// 이 저장소에서 직접 만드는 기업·기관 화면만 검사 결과에 포함합니다.
// 외부 프로젝트인 탄소 화면을 비롯한 다른 경로는 저장된 JSON에 섞여 있어도 모든 집계에서 제외합니다.
const AUDITED_SCREENS = audit.screens.filter(
    (screen) => screen.path.startsWith('/corp/') || screen.path.startsWith('/org/'),
)
const SCREEN_MARKUP_RESULTS = AUDITED_SCREENS.map((screen) => ({
    ...screen,
    userType: screen.path.startsWith('/corp/') ? ('기업' as const) : ('기관' as const),
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
    count: AUDITED_SCREENS.reduce(
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
const NAV_ROLE_ISSUES = issuesByKind(['nav-role']).filter((issue) => issue.count > 0)

const routesWithKind = (kind: MarkupIssueKind) =>
    SCREEN_MARKUP_RESULTS.filter((screen) => screen.kinds.includes(kind)).map((screen) => screen.path)

const PROJECT_ISSUES = PROJECT_ISSUE_SOURCES.map((issue) => ({...issue, routes: routesWithKind(issue.kind)}))

const screenTotals = (screens: typeof SCREEN_MARKUP_RESULTS) => ({
    screens: screens.length,
    errors: screens.reduce((sum, screen) => sum + screen.errors, 0),
    warnings: screens.reduce((sum, screen) => sum + screen.warnings, 0),
})

// 화면별 표는 이용자 구분으로 나눈다 — 두 묶음은 서로 다른 화면이라 한 표에 붙여 두면
// 찾는 쪽 화면을 만나기까지 반대편 100여 줄을 지나야 한다.
const SCREEN_GROUPS = [
    {key: 'corp', label: '기업', screens: SCREEN_MARKUP_RESULTS.filter((screen) => screen.userType === '기업')},
    {key: 'org', label: '기관', screens: SCREEN_MARKUP_RESULTS.filter((screen) => screen.userType === '기관')},
] as const
const SCREEN_TOTALS = screenTotals(SCREEN_MARKUP_RESULTS)

type IndexedAuditScreen = {
    registryKey?: string
    path: string[]
    status: Status
    isRed: boolean
    userType?: UserType
}

const countsAsDone = (status: Status) => status === '완료' || status === '최종완료' || status === '보완'

// 최근 검사 화면 수 메모도 퍼블리싱 인덱스와 검사 JSON을 그대로 본다. 인덱스 상태나 구현 여부,
// 검사 대상이 바뀌면 설명 숫자와 펼침 목록이 따로 어긋나지 않고 함께 갱신된다.
const collectIndexedAuditScreens = (group: StructureGroup): IndexedAuditScreen[] => {
    const walk = (node: StructureNode, path: string[], inheritedUserType?: UserType): IndexedAuditScreen[] => {
        const nextPath = node.label === path.at(-1) ? path : [...path, node.label]
        if (isStructureBranch(node)) {
            const branchUserType = node.userType ?? inheritedUserType
            const screenPath = node.screen?.label ? [...nextPath, node.screen.label] : nextPath
            const ownScreen: IndexedAuditScreen[] = node.screen
                ? [
                      {
                          ...(node.screen.key ? {registryKey: node.screen.key} : {}),
                          path: screenPath,
                          status: node.screen.status,
                          isRed: node.screen.isRed === true,
                          userType: node.screen.userType ?? branchUserType,
                      },
                  ]
                : []

            return [...ownScreen, ...node.children.flatMap((child) => walk(child, nextPath, branchUserType))]
        }

        return [
            {
                ...(node.key ? {registryKey: node.key} : {}),
                path: nextPath,
                status: node.status,
                isRed: node.isRed === true,
                userType: node.userType ?? inheritedUserType,
            },
        ]
    }

    return group.children.flatMap((child) => walk(child, [group.name], group.userType))
}

const INDEXED_AUDIT_SCREENS = PUBLISHING_INDEX_CONTENT.structureGroups.flatMap(collectIndexedAuditScreens)
const SCREEN_REGISTRY_BY_KEY = new Map(SCREEN_REGISTRY.map((screen) => [screen.key, screen]))
const SCREEN_REGISTRY_BY_PATH = new Map(SCREEN_REGISTRY.map((screen) => [screen.path, screen]))
const INDEXED_AUDIT_SCREEN_BY_KEY = new Map(
    INDEXED_AUDIT_SCREENS.filter((screen) => screen.registryKey).map((screen) => [screen.registryKey, screen]),
)
const waveScreenLabel = (route: string) => {
    const registryKey = SCREEN_REGISTRY_BY_PATH.get(route)?.key
    const menuPath = registryKey ? INDEXED_AUDIT_SCREEN_BY_KEY.get(registryKey)?.path : undefined
    return menuPath?.join(' > ') ?? SCREEN_REGISTRY_BY_PATH.get(route)?.name ?? route
}
const AUDIT_SCOPE_NOTES = SCREEN_GROUPS.map((group) => {
    const indexedScreens = INDEXED_AUDIT_SCREENS.filter((screen) => screen.userType === group.label)
    const completedScreens = indexedScreens.filter((screen) => !screen.isRed && countsAsDone(screen.status))
    const missingScreens = completedScreens.filter(
        (screen) => screen.registryKey && SCREEN_REGISTRY_BY_KEY.get(screen.registryKey)?.implemented === false,
    )
    const crossedOutScreens = indexedScreens.filter((screen) => screen.isRed)

    return {
        ...group,
        completedCount: completedScreens.length,
        missingScreens,
        crossedOutScreens,
    }
})

const auditScopeDescription = (note: (typeof AUDIT_SCOPE_NOTES)[number]) => {
    const missing = note.missingScreens.length > 0 ? `페이지가 없는 ${note.missingScreens.length}개를 제외` : ''
    const audited = missing
        ? `${note.label}은 완료 ${note.completedCount}개 중 ${missing}해 ${note.screens.length}개입니다.`
        : `${note.label}은 완료 ${note.completedCount}개이며, 검사 화면은 ${note.screens.length}개입니다.`
    const crossedOut =
        note.crossedOutScreens.length > 0
            ? ` 취소선 화면 ${note.crossedOutScreens.length}개는 검사 대상 밖에서 별도로 표시합니다.`
            : ''
    return `${audited}${crossedOut}`
}

const AUDIT_SCOPE_ACCORDIONS = AUDIT_SCOPE_NOTES.flatMap((note) => [
    ...(note.missingScreens.length > 0
        ? [{key: `${note.key}-missing`, label: note.label, screens: note.missingScreens}]
        : []),
    ...(note.crossedOutScreens.length > 0
        ? [{key: `${note.key}-crossed-out`, label: `${note.label} 취소선`, screens: note.crossedOutScreens}]
        : []),
])

const PROJECT_ERROR_TOTAL = ISSUE_CATALOG.filter((issue) => issue.isProjectCause).reduce(
    (sum, issue) => sum + issue.count,
    0,
)
const PROJECT_ISSUE_SCREENS = SCREEN_MARKUP_RESULTS.filter((screen) =>
    screen.kinds.some((kind) => ISSUE_LABEL[kind].isProjectCause),
).length

const ISSUE_SCREENS_BY_KIND: Record<string, number> = Object.fromEntries(
    ISSUE_CATALOG.map((issue) => [issue.kind, issue.screens]),
)
// 공통 Footer 한 건을 넘어서는 화면은 화면 내부 Select에서도 같은 Radix 빈 option이 생긴 경우다.
// 저장된 검사 원문에서 직접 세므로 재검사 후 화면이나 건수가 바뀌면 이 목록도 함께 갱신된다.
const MULTIPLE_EMPTY_OPTION_SCREENS = SCREEN_MARKUP_RESULTS.map((screen) => ({
    ...screen,
    emptyOptionCount: screen.messages.filter((message) => normalizeMessage(message.message) === EMPTY_OPTION_MESSAGE)
        .length,
}))
    .filter((screen) => screen.emptyOptionCount > 1)
    .sort((a, b) => b.emptyOptionCount - a.emptyOptionCount || a.path.localeCompare(b.path))
const REQUIRED_SELECT_SCREENS = SCREEN_MARKUP_RESULTS.map((screen) => ({
    ...screen,
    requiredSelectCount: screen.messages.filter(
        (message) => normalizeMessage(message.message) === SELECT_REQUIRED_MESSAGE,
    ).length,
}))
    .filter((screen) => screen.requiredSelectCount > 0)
    .sort((a, b) => b.requiredSelectCount - a.requiredSelectCount || a.path.localeCompare(b.path))

// 발생한 오류만 공통 원인별로 묶습니다. 화면 수는 같은 원인 안에서 중복을 제거합니다.
const ACTIVE_PROJECT_ISSUES = PROJECT_ISSUES.filter((issue) =>
    issuesByKind(issue.kinds).some((entry) => entry.count > 0),
)
// 상단 요약은 전체 원인과 유형별 숫자를 따로 놓지 않고, 기업·기관 카드 안에서 함께 읽히게 합니다.
const SUMMARY_GROUPS = SCREEN_GROUPS.map((group) => {
    const totals = screenTotals(group.screens)
    const issueCatalog = ISSUE_DEFINITIONS.map((issue) => ({
        ...issue,
        count: group.screens.reduce(
            (sum, screen) =>
                sum +
                screen.messages.filter(
                    (message) =>
                        kindForMessage(message.message) === issue.kind &&
                        (message.type === 'error' || message.subType === 'warning'),
                ).length,
            0,
        ),
        screens: group.screens.filter((screen) => screen.kinds.includes(issue.kind)).length,
    }))
    const unknownGroups = new Map<string, {count: number; paths: Set<string>}>()
    for (const screen of group.screens) {
        for (const message of screen.messages) {
            if (message.type !== 'error' || kindForMessage(message.message) !== 'unknown') continue
            const key = normalizeMessage(message.message)
            const unknown = unknownGroups.get(key) ?? {count: 0, paths: new Set<string>()}
            unknown.count += 1
            unknown.paths.add(screen.path)
            unknownGroups.set(key, unknown)
        }
    }
    const libraryIssues = issueCatalog.filter(
        (issue) => !issue.isProjectCause && issue.level === 'error' && issue.count > 0,
    )
    const projectIssues = PROJECT_ISSUE_SOURCES.map((issue) => {
        const entries = issueCatalog.filter((entry) => issue.kinds.includes(entry.kind))
        return {
            ...issue,
            count: entries.reduce((sum, entry) => sum + entry.count, 0),
            screens: group.screens.filter((screen) => issue.kinds.some((kind) => screen.kinds.includes(kind))).length,
        }
    }).filter((issue) => issue.count > 0)
    const libraryTotal = libraryIssues.reduce((sum, issue) => sum + issue.count, 0)
    const projectTotal = projectIssues.reduce((sum, issue) => sum + issue.count, 0)
    const unknownTotal = [...unknownGroups.values()].reduce((sum, unknown) => sum + unknown.count, 0)

    return {
        ...group,
        totals: [
            {label: '검사한 화면', value: `${totals.screens}개`},
            {label: '오류', value: `${totals.errors}건`},
            {label: '경고', value: `${totals.warnings}건`},
        ],
        causes: [
            {
                label: '외부 라이브러리 원인',
                badge: '예외 검토',
                color: 'success' as const,
                value: `${libraryTotal}건`,
                reasons: libraryIssues.map((issue) => ({
                    head: `${ISSUE_LABEL[issue.kind].label} ${issue.count}건`,
                    detail: `${issue.screens}개 화면 · ${issue.owner}`,
                })),
            },
            {
                label: '프로젝트 수정 대상',
                badge: projectTotal ? '수정 대상' : '발생 없음',
                color: projectTotal ? ('error' as const) : ('neutral' as const),
                value: `${projectTotal}건`,
                reasons: projectIssues.map((issue) => ({
                    head: `${issue.title} ${issue.count}건`,
                    detail: `${issue.screens}개 화면`,
                })),
            },
            {
                label: '원인 확인 필요',
                badge: '미분류',
                color: 'warning' as const,
                value: `${unknownTotal}건`,
                reasons: [...unknownGroups].map(([message, unknown]) => ({
                    head: `${message} · ${unknown.count}건`,
                    detail: `${unknown.paths.size}개 화면`,
                })),
            },
        ],
    }
})

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
// WAVE — Radix RadioGroup과 Checkbox가 폼 전송용으로 만드는 숨은 입력에서 나온 오류다.
const WAVE_SCREEN_ROUTES = [
    '/org/mypage/evaluation-history/guarantee-recommendation',
    '/corp/technology-evaluation/ktrs-fm/customer-consent',
    '/corp/technology-evaluation/ktrs-fm/company-technology-info',
    '/corp/technology-evaluation/ktrs-fm/checklist/manufacturing',
    '/corp/technology-evaluation/ktrs-fm/checklist/service',
    '/corp/technology-evaluation/tech-index/selection',
    '/corp/technology-evaluation/tech-index/general/customer-consent',
    '/corp/technology-evaluation/tech-index/general/company-technology-info',
    '/corp/technology-evaluation/tech-index/startup/customer-consent',
    '/corp/technology-evaluation/tech-index/startup/company-technology-info',
    '/corp/technology-evaluation/investment-model/customer-consent',
    '/corp/technology-evaluation/investment-model/company-technology-info',
    '/corp/technology-evaluation/investment-model/checklist/manufacturing',
    '/corp/technology-evaluation/investment-model/checklist/service',
    '/corp/mypage/representative-history/customer-consent',
    '/corp/mypage/evaluation-results',
    '/corp/mypage/k-bigx-report-history',
    '/corp/notice/inquiry-create',
    '/corp/notice/inquiry-create/privacy-consent-guide',
    '/org/individual-evaluation/ktrs-fm/customer-consent',
    '/org/individual-evaluation/ktrs-fm/company-technology-info',
    '/org/individual-evaluation/ktrs-fm/checklist/manufacturing',
    '/org/individual-evaluation/ktrs-fm/checklist/service',
    '/org/individual-evaluation/tech-index/selection',
    '/org/individual-evaluation/tech-index/general/customer-consent',
    '/org/individual-evaluation/tech-index/general/company-technology-info',
    '/org/individual-evaluation/tech-index/startup/customer-consent',
    '/org/individual-evaluation/tech-index/startup/company-technology-info',
    '/org/individual-evaluation/investment-model/customer-consent',
    '/org/individual-evaluation/investment-model/company-technology-info',
    '/org/individual-evaluation/investment-model/checklist/manufacturing',
    '/org/individual-evaluation/investment-model/checklist/service',
    '/org/batch-evaluation/tech-index-selection',
    '/org/batch-evaluation/evaluation-history-or-batch',
    '/org/mypage/evaluation-history',
    '/org/mypage/verification-application',
    '/org/mypage/k-bigx-report-history',
    '/org/notice/inquiry-create',
    '/org/notice/inquiry-create/privacy-consent-guide',
    '/org/individual-evaluation/verification-progress',
] as const

const WAVE_ISSUES = [
    {
        level: 'error',
        message: 'Missing form label (204)',
        count: 204,
        screens: 36,
        owner: 'Radix RadioGroup의 숨은 input',
        verdict: '값을 폼에 담는 input이라 aria-hidden·tabindex="-1"이 붙어 있고 라벨이 없다',
    },
    {
        level: 'error',
        message: 'Missing form label (282)',
        count: 282,
        screens: 21,
        owner: 'Radix Checkbox의 숨은 input',
        verdict: '값을 폼에 담는 input이라 aria-hidden·tabindex="-1"이 붙어 있고 라벨이 없다',
    },
] as const

const WAVE_GUARANTEE_ISSUES = [{...WAVE_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1}] as const
const WAVE_CUSTOMER_CONSENT_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (16)', count: 16, screens: 1},
    {...WAVE_ISSUES[1], message: 'Missing form label (2)', count: 2, screens: 1},
] as const
const WAVE_COMPANY_TECH_RADIO_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (7)', count: 7, screens: 1},
] as const
const WAVE_MANUFACTURING_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
    {...WAVE_ISSUES[1], message: 'Missing form label (26)', count: 26, screens: 1},
] as const
const WAVE_SERVICE_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
    {...WAVE_ISSUES[1], message: 'Missing form label (26)', count: 26, screens: 1},
] as const
const WAVE_TECH_INDEX_SELECTION_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
] as const
const WAVE_TECH_INDEX_COMPANY_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (8)', count: 8, screens: 1},
    {...WAVE_ISSUES[1], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_TECH_INDEX_STARTUP_COMPANY_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (8)', count: 8, screens: 1},
    {...WAVE_ISSUES[1], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_INVESTMENT_COMPANY_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (9)', count: 9, screens: 1},
] as const
const WAVE_INVESTMENT_MANUFACTURING_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
    {...WAVE_ISSUES[1], message: 'Missing form label (37)', count: 37, screens: 1},
] as const
const WAVE_INVESTMENT_SERVICE_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
    {...WAVE_ISSUES[1], message: 'Missing form label (37)', count: 37, screens: 1},
] as const
const WAVE_EVALUATION_RESULTS_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_BATCH_SELECTION_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_ORG_EVALUATION_HISTORY_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_VERIFICATION_APPLICATION_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_ORG_K_BIGX_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_K_BIGX_CONTROL_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (4)', count: 4, screens: 1},
] as const
const WAVE_INQUIRY_CONTROL_ISSUES = [
    {...WAVE_ISSUES[1], message: 'Missing form label (1)', count: 1, screens: 1},
] as const
const WAVE_ORG_CUSTOMER_CONSENT_ISSUES = [
    {...WAVE_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
] as const

// WAVE — 조회 필터(SelectFilterField·KeywordSearchField)가 있는 목록 화면의 숨은 Select 사례.
// Radix Select 가 고른 값을 폼에 담으려고 만드는 숨은 native select 가 원인이고, 셀렉트 한 칸에 하나씩
// 생긴다. 같은 라벨 누락을 가리키는 WAVE 오류·경고 중 오류 한 종류만 기록한다.
const WAVE_SELECT_SCREEN_ROUTES = [
    '/org/mypage/sub-account-progress',
    '/corp/technology-evaluation/ktrs-fm/company-technology-info',
    '/corp/technology-evaluation/ktrs-fm/checklist/manufacturing',
    '/corp/technology-evaluation/ktrs-fm/checklist/service',
    '/corp/technology-evaluation/tech-index/general/company-technology-info',
    '/corp/technology-evaluation/tech-index/startup/company-technology-info',
    '/corp/technology-evaluation/investment-model/company-technology-info',
    '/corp/mypage/profile',
    '/corp/mypage/representative-history',
    '/corp/mypage/k-bigx-report-history',
    '/corp/notice/inquiry-create',
    '/corp/notice/inquiry-create/privacy-consent-guide',
    '/org/individual-evaluation/ktrs-fm/company-technology-info',
    '/org/individual-evaluation/ktrs-fm/checklist/manufacturing',
    '/org/individual-evaluation/ktrs-fm/checklist/service',
    '/org/individual-evaluation/tech-index/general/company-technology-info',
    '/org/individual-evaluation/tech-index/startup/company-technology-info',
    '/org/individual-evaluation/investment-model/company-technology-info',
    '/org/batch-evaluation/evaluation-history-or-batch/general/bulk-data-request',
    '/org/batch-evaluation/evaluation-history-or-batch/general/batch-evaluation-request',
    '/org/mypage/profile-edit/partner-bank',
    '/org/mypage/profile-edit/non-partner-bank',
    '/org/mypage/profile-edit/partner-agency',
    '/org/mypage/profile-edit/non-partner-agency',
    '/org/mypage/evaluation-history',
    '/org/mypage/k-bigx-report-history',
    '/org/mypage/sub-account-progress/k-bigx-non-partner',
    '/org/mypage/sub-account-progress/k-bigx-partner',
    '/org/mypage/sub-account-progress/tech-partner',
    '/org/mypage/sub-account-progress/create',
    '/org/mypage/sub-account-progress/edit',
    '/org/notice/inquiry-create',
    '/org/notice/inquiry-create/privacy-consent-guide',
] as const

const WAVE_SELECT_ISSUES = [
    {
        level: 'error',
        message: 'Missing form label (115)',
        count: 115,
        screens: 25,
        owner: 'Radix Select 의 숨은 native select',
        verdict: '값을 폼에 담으려고 두는 select 라 aria-hidden·tabindex="-1" 이 붙어 있고 라벨이 없다',
    },
    {
        level: 'warning',
        message: 'Select missing label (26)',
        count: 26,
        screens: 14,
        owner: 'Radix Select 의 숨은 native select',
        verdict: '같은 기업형태 Select를 WAVE가 경고 항목으로도 탐지한다',
    },
] as const

const WAVE_SUB_ACCOUNT_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_COMPANY_TECH_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (9)', count: 9, screens: 1},
] as const
const WAVE_MANUFACTURING_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (3)', count: 3, screens: 1},
] as const
const WAVE_SERVICE_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (3)', count: 3, screens: 1},
] as const
const WAVE_TECH_INDEX_COMPANY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (10)', count: 10, screens: 1},
] as const
const WAVE_ORG_TECH_INDEX_COMPANY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (11)', count: 11, screens: 1},
] as const
const WAVE_ORG_INVESTMENT_COMPANY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (10)', count: 10, screens: 1},
] as const
const WAVE_TECH_INDEX_STARTUP_COMPANY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (15)', count: 15, screens: 1},
] as const
const WAVE_INVESTMENT_COMPANY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (9)', count: 9, screens: 1},
] as const
const WAVE_PROFILE_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_REPRESENTATIVE_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (7)', count: 7, screens: 1},
] as const
const WAVE_K_BIGX_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
] as const
const WAVE_INQUIRY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
] as const
const WAVE_BULK_DATA_REQUEST_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
] as const
const WAVE_BATCH_EVALUATION_REQUEST_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
] as const
const WAVE_PARTNER_BANK_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (3)', count: 3, screens: 1},
] as const
const WAVE_NON_PARTNER_BANK_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (2)', count: 2, screens: 1},
] as const
const WAVE_PARTNER_AGENCY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (3)', count: 3, screens: 1},
] as const
const WAVE_NON_PARTNER_AGENCY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (2)', count: 2, screens: 1},
] as const
const WAVE_ORG_EVALUATION_HISTORY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_ORG_K_BIGX_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (2)', count: 2, screens: 1},
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_ORG_INQUIRY_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
] as const
const WAVE_K_BIGX_NON_PARTNER_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_K_BIGX_PARTNER_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_TECH_PARTNER_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[0], message: 'Missing form label (1)', count: 1, screens: 1},
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_SUB_ACCOUNT_CREATE_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const
const WAVE_SUB_ACCOUNT_EDIT_SELECT_ISSUES = [
    {...WAVE_SELECT_ISSUES[1], message: 'Select missing label (1)', count: 1, screens: 1},
] as const

const WAVE_SCREEN_RESULTS = [
    {
        name: '보증추천',
        path: WAVE_SCREEN_ROUTES[0],
        issues: WAVE_GUARANTEE_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: 'KTRS-FM 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[1],
        issues: WAVE_CUSTOMER_CONSENT_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 16건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 2건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: '기관 마이페이지 · 하위 계정 현황',
        path: WAVE_SELECT_SCREEN_ROUTES[0],
        issues: WAVE_SUB_ACCOUNT_SELECT_ISSUES,
        kinds: [
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
            {label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'},
        ],
    },
    {
        name: 'KTRS-FM 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[2],
        issues: [...WAVE_COMPANY_TECH_RADIO_ISSUES, ...WAVE_COMPANY_TECH_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 7건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Select 9건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: 'KTRS-FM 체크리스트 · 제조업',
        path: WAVE_SCREEN_ROUTES[3],
        issues: [...WAVE_MANUFACTURING_CONTROL_ISSUES, ...WAVE_MANUFACTURING_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 26건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 3건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: 'KTRS-FM 체크리스트 · 서비스업',
        path: WAVE_SCREEN_ROUTES[4],
        issues: [...WAVE_SERVICE_CONTROL_ISSUES, ...WAVE_SERVICE_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 26건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 3건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: 'Tech-Index 평가모형 선택',
        path: WAVE_SCREEN_ROUTES[5],
        issues: WAVE_TECH_INDEX_SELECTION_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: 'Tech-Index 일반용 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[6],
        issues: WAVE_CUSTOMER_CONSENT_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 16건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 2건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: 'Tech-Index 일반용 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[7],
        issues: [...WAVE_TECH_INDEX_COMPANY_CONTROL_ISSUES, ...WAVE_TECH_INDEX_COMPANY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 8건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 4건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 10건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: 'Tech-Index 창업용 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[8],
        issues: WAVE_CUSTOMER_CONSENT_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 16건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 2건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: 'Tech-Index 창업용 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[9],
        issues: [...WAVE_TECH_INDEX_STARTUP_COMPANY_CONTROL_ISSUES, ...WAVE_TECH_INDEX_STARTUP_COMPANY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 8건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 4건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 15건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '투자모형 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[10],
        issues: WAVE_CUSTOMER_CONSENT_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 16건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 2건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: '투자모형 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[11],
        issues: [...WAVE_INVESTMENT_COMPANY_CONTROL_ISSUES, ...WAVE_INVESTMENT_COMPANY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 9건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Select 9건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '투자모형 체크리스트 · 제조업',
        path: WAVE_SCREEN_ROUTES[12],
        issues: WAVE_INVESTMENT_MANUFACTURING_CONTROL_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 37건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: '투자모형 체크리스트 · 서비스업',
        path: WAVE_SCREEN_ROUTES[13],
        issues: WAVE_INVESTMENT_SERVICE_CONTROL_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 37건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: '기업 마이페이지 · 대표자 변경 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[14],
        issues: WAVE_CUSTOMER_CONSENT_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 16건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 2건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: '기업 마이페이지 · 평가결과 조회',
        path: WAVE_SCREEN_ROUTES[15],
        issues: WAVE_EVALUATION_RESULTS_CONTROL_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 4건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기업 마이페이지 · K-BIGx 보고서 이력',
        path: WAVE_SCREEN_ROUTES[16],
        issues: [...WAVE_K_BIGX_CONTROL_ISSUES, ...WAVE_K_BIGX_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 4건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기업 1:1 문의 작성',
        path: WAVE_SCREEN_ROUTES[17],
        issues: [...WAVE_INQUIRY_CONTROL_ISSUES, ...WAVE_INQUIRY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · Checkbox 1건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기업 1:1 문의 작성 · 개인정보 동의 안내',
        path: WAVE_SCREEN_ROUTES[18],
        issues: [...WAVE_INQUIRY_CONTROL_ISSUES, ...WAVE_INQUIRY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · Checkbox 1건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 KTRS-FM 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[19],
        issues: WAVE_ORG_CUSTOMER_CONSENT_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 KTRS-FM 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[20],
        issues: [...WAVE_COMPANY_TECH_RADIO_ISSUES, ...WAVE_COMPANY_TECH_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 7건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Select 9건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 KTRS-FM 체크리스트 · 제조업',
        path: WAVE_SCREEN_ROUTES[21],
        issues: [...WAVE_MANUFACTURING_CONTROL_ISSUES, ...WAVE_MANUFACTURING_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 26건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 3건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 KTRS-FM 체크리스트 · 서비스업',
        path: WAVE_SCREEN_ROUTES[22],
        issues: [...WAVE_SERVICE_CONTROL_ISSUES, ...WAVE_SERVICE_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 26건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 3건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 Tech-Index 평가모형 선택',
        path: WAVE_SCREEN_ROUTES[23],
        issues: WAVE_TECH_INDEX_SELECTION_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 Tech-Index 일반용 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[24],
        issues: WAVE_ORG_CUSTOMER_CONSENT_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 Tech-Index 일반용 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[25],
        issues: [...WAVE_TECH_INDEX_COMPANY_CONTROL_ISSUES, ...WAVE_ORG_TECH_INDEX_COMPANY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 8건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 4건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 11건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 Tech-Index 창업용 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[26],
        issues: WAVE_ORG_CUSTOMER_CONSENT_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 Tech-Index 창업용 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[27],
        issues: [...WAVE_TECH_INDEX_STARTUP_COMPANY_CONTROL_ISSUES, ...WAVE_TECH_INDEX_STARTUP_COMPANY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 8건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 4건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 15건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 투자모형 고객 정보 활용 동의',
        path: WAVE_SCREEN_ROUTES[28],
        issues: WAVE_ORG_CUSTOMER_CONSENT_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 투자모형 기업·기술정보 입력',
        path: WAVE_SCREEN_ROUTES[29],
        issues: [...WAVE_INVESTMENT_COMPANY_CONTROL_ISSUES, ...WAVE_ORG_INVESTMENT_COMPANY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 9건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Select 10건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 투자모형 체크리스트 · 제조업',
        path: WAVE_SCREEN_ROUTES[30],
        issues: WAVE_INVESTMENT_MANUFACTURING_CONTROL_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 37건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: '기관 투자모형 체크리스트 · 서비스업',
        path: WAVE_SCREEN_ROUTES[31],
        issues: WAVE_INVESTMENT_SERVICE_CONTROL_ISSUES,
        kinds: [
            {label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Checkbox 37건', level: 'error', target: 'wave-checkbox'},
        ],
    },
    {
        name: '기관 일괄평가 · Tech-Index 선택',
        path: WAVE_SCREEN_ROUTES[32],
        issues: WAVE_BATCH_SELECTION_CONTROL_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 4건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 평가이력·일괄평가 선택',
        path: WAVE_SCREEN_ROUTES[33],
        issues: WAVE_BATCH_SELECTION_CONTROL_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 4건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 마이페이지 · 평가이력',
        path: WAVE_SCREEN_ROUTES[34],
        issues: [...WAVE_ORG_EVALUATION_HISTORY_CONTROL_ISSUES, ...WAVE_ORG_EVALUATION_HISTORY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 4건', level: 'error', target: 'wave-radio'},
            {label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'},
        ],
    },
    {
        name: '기관 마이페이지 · 확인 신청',
        path: WAVE_SCREEN_ROUTES[35],
        issues: WAVE_VERIFICATION_APPLICATION_CONTROL_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 4건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 마이페이지 · K-BIGx 보고서 이력',
        path: WAVE_SCREEN_ROUTES[36],
        issues: [...WAVE_ORG_K_BIGX_CONTROL_ISSUES, ...WAVE_ORG_K_BIGX_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · RadioGroup 4건', level: 'error', target: 'wave-radio'},
            {label: 'Missing form label · Select 2건', level: 'error', target: 'wave-select-error'},
            {label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'},
        ],
    },
    {
        name: '기관 1:1 문의 작성',
        path: WAVE_SCREEN_ROUTES[37],
        issues: [...WAVE_INQUIRY_CONTROL_ISSUES, ...WAVE_ORG_INQUIRY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · Checkbox 1건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        name: '기관 1:1 문의 작성 · 개인정보 동의 안내',
        path: WAVE_SCREEN_ROUTES[38],
        issues: [...WAVE_INQUIRY_CONTROL_ISSUES, ...WAVE_ORG_INQUIRY_SELECT_ISSUES],
        kinds: [
            {label: 'Missing form label · Checkbox 1건', level: 'error', target: 'wave-checkbox'},
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
        ],
    },
    {
        // 카드 두 장이 RadioGroup 한 묶음이라 Tech-Index 평가모형 선택과 같은 2건이다.
        name: '기관 개별평가 · 평가진행방식 선택',
        path: WAVE_SCREEN_ROUTES[39],
        issues: WAVE_TECH_INDEX_SELECTION_ISSUES,
        kinds: [{label: 'Missing form label · RadioGroup 2건', level: 'error', target: 'wave-radio'}],
    },
    {
        name: '기관 일괄평가 · 대량정보 조회 신청',
        path: WAVE_SELECT_SCREEN_ROUTES[18],
        issues: WAVE_BULK_DATA_REQUEST_SELECT_ISSUES,
        kinds: [{label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'}],
    },
    {
        name: '기관 일괄평가 · 평가 신청',
        path: WAVE_SELECT_SCREEN_ROUTES[19],
        issues: WAVE_BATCH_EVALUATION_REQUEST_SELECT_ISSUES,
        kinds: [{label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'}],
    },
    {
        name: '기관 마이페이지 · 협약은행 수정',
        path: WAVE_SELECT_SCREEN_ROUTES[20],
        issues: WAVE_PARTNER_BANK_SELECT_ISSUES,
        kinds: [{label: 'Select missing label 3건', level: 'warning', target: 'wave-select-warning'}],
    },
    {
        name: '기관 마이페이지 · 비협약 은행 수정',
        path: WAVE_SELECT_SCREEN_ROUTES[21],
        issues: WAVE_NON_PARTNER_BANK_SELECT_ISSUES,
        kinds: [{label: 'Select missing label 2건', level: 'warning', target: 'wave-select-warning'}],
    },
    {
        name: '기관 마이페이지 · 협약기관 수정',
        path: WAVE_SELECT_SCREEN_ROUTES[22],
        issues: WAVE_PARTNER_AGENCY_SELECT_ISSUES,
        kinds: [{label: 'Select missing label 3건', level: 'warning', target: 'wave-select-warning'}],
    },
    {
        name: '기관 마이페이지 · 비협약기관 수정',
        path: WAVE_SELECT_SCREEN_ROUTES[23],
        issues: WAVE_NON_PARTNER_AGENCY_SELECT_ISSUES,
        kinds: [{label: 'Select missing label 2건', level: 'warning', target: 'wave-select-warning'}],
    },
    {
        name: '기관 하위 계정 현황 · K-BIGx 비협약',
        path: WAVE_SELECT_SCREEN_ROUTES[26],
        issues: WAVE_K_BIGX_NON_PARTNER_SELECT_ISSUES,
        kinds: [
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
            {label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'},
        ],
    },
    {
        name: '기관 하위 계정 현황 · K-BIGx 협약',
        path: WAVE_SELECT_SCREEN_ROUTES[27],
        issues: WAVE_K_BIGX_PARTNER_SELECT_ISSUES,
        kinds: [
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
            {label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'},
        ],
    },
    {
        name: '기관 하위 계정 현황 · 기술평가 협약',
        path: WAVE_SELECT_SCREEN_ROUTES[28],
        issues: WAVE_TECH_PARTNER_SELECT_ISSUES,
        kinds: [
            {label: 'Missing form label · Select 1건', level: 'error', target: 'wave-select-error'},
            {label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'},
        ],
    },
    {
        name: '기관 하위 계정 등록',
        path: WAVE_SELECT_SCREEN_ROUTES[29],
        issues: WAVE_SUB_ACCOUNT_CREATE_SELECT_ISSUES,
        kinds: [{label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'}],
    },
    {
        name: '기관 하위 계정 수정',
        path: WAVE_SELECT_SCREEN_ROUTES[30],
        issues: WAVE_SUB_ACCOUNT_EDIT_SELECT_ISSUES,
        kinds: [{label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'}],
    },
    {
        name: '기업 마이페이지 · 기업정보',
        path: WAVE_SELECT_SCREEN_ROUTES[7],
        issues: WAVE_PROFILE_SELECT_ISSUES,
        kinds: [
            {label: 'Missing form label · Select 2건', level: 'error', target: 'wave-select-error'},
            {label: 'Select missing label 1건', level: 'warning', target: 'wave-select-warning'},
        ],
    },
    {
        name: '기업 마이페이지 · 대표자 이력',
        path: WAVE_SELECT_SCREEN_ROUTES[8],
        issues: WAVE_REPRESENTATIVE_SELECT_ISSUES,
        kinds: [{label: 'Select missing label 7건', level: 'warning', target: 'wave-select-warning'}],
    },
] as const

const countWaveIssues = (issues: readonly {level: 'error' | 'warning'; count: number}[], level: 'error' | 'warning') =>
    issues.reduce((sum, issue) => sum + (issue.level === level ? issue.count : 0), 0)

const waveIssueControl = (owner: string) => {
    if (owner.startsWith('Radix RadioGroup')) return 'RadioGroup'
    if (owner.startsWith('Radix Checkbox')) return 'Checkbox'
    if (owner.startsWith('Radix Select')) return 'Select'
    return owner
}

const WAVE_SCREEN_RECORDS = WAVE_SCREEN_RESULTS.map((screen) => ({
    ...screen,
    errors: countWaveIssues(screen.issues, 'error'),
    warnings: countWaveIssues(screen.issues, 'warning'),
    messages: screen.issues.map(({level, message, count, owner, verdict}) => ({
        level,
        message: message.replace(/\s\(\d+\)$/, ''),
        count,
        control: waveIssueControl(owner),
        owner,
        verdict,
    })),
}))
const WAVE_RADIO_SCREEN_ROUTES = WAVE_SCREEN_RECORDS.filter((screen) =>
    screen.issues.some((issue) => issue.owner.startsWith('Radix RadioGroup')),
).map((screen) => screen.path)
const WAVE_CHECKBOX_SCREEN_ROUTES = WAVE_SCREEN_RECORDS.filter((screen) =>
    screen.issues.some((issue) => issue.owner.startsWith('Radix Checkbox')),
).map((screen) => screen.path)
const WAVE_SELECT_ERROR_SCREEN_ROUTES = WAVE_SCREEN_RECORDS.filter((screen) =>
    screen.issues.some((issue) => issue.owner.startsWith('Radix Select') && issue.level === 'error'),
).map((screen) => screen.path)
const WAVE_SELECT_WARNING_SCREEN_ROUTES = WAVE_SCREEN_RECORDS.filter((screen) =>
    screen.issues.some((issue) => issue.owner.startsWith('Radix Select') && issue.level === 'warning'),
).map((screen) => screen.path)

const WAVE_TOTALS = WAVE_SCREEN_RECORDS.reduce(
    (totals, screen) => ({
        screens: totals.screens + 1,
        errors: totals.errors + screen.errors,
        warnings: totals.warnings + screen.warnings,
    }),
    {screens: 0, errors: 0, warnings: 0},
)

const WAVE_SUMMARY_GROUPS = [
    {key: 'corp', label: '기업', screens: WAVE_SCREEN_RECORDS.filter((screen) => screen.path.startsWith('/corp/'))},
    {key: 'org', label: '기관', screens: WAVE_SCREEN_RECORDS.filter((screen) => screen.path.startsWith('/org/'))},
].map((group) => ({
    ...group,
    totals: group.screens.reduce(
        (totals, screen) => ({
            screens: totals.screens + 1,
            errors: totals.errors + screen.errors,
            warnings: totals.warnings + screen.warnings,
        }),
        {screens: 0, errors: 0, warnings: 0},
    ),
    radio: {
        count: group.screens.reduce(
            (sum, screen) =>
                sum +
                screen.issues.reduce(
                    (issueSum, issue) => issueSum + (issue.owner.startsWith('Radix RadioGroup') ? issue.count : 0),
                    0,
                ),
            0,
        ),
        screens: group.screens.filter((screen) =>
            screen.issues.some((issue) => issue.owner.startsWith('Radix RadioGroup')),
        ).length,
    },
    checkbox: {
        count: group.screens.reduce(
            (sum, screen) =>
                sum +
                screen.issues.reduce(
                    (issueSum, issue) => issueSum + (issue.owner.startsWith('Radix Checkbox') ? issue.count : 0),
                    0,
                ),
            0,
        ),
        screens: group.screens.filter((screen) =>
            screen.issues.some((issue) => issue.owner.startsWith('Radix Checkbox')),
        ).length,
    },
    selectError: {
        count: group.screens.reduce(
            (sum, screen) =>
                sum +
                screen.issues.reduce(
                    (issueSum, issue) =>
                        issueSum +
                        (issue.owner.startsWith('Radix Select') && issue.level === 'error' ? issue.count : 0),
                    0,
                ),
            0,
        ),
        screens: group.screens.filter((screen) =>
            screen.issues.some((issue) => issue.owner.startsWith('Radix Select') && issue.level === 'error'),
        ).length,
    },
    selectWarning: {
        count: group.screens.reduce(
            (sum, screen) =>
                sum +
                screen.issues.reduce(
                    (issueSum, issue) =>
                        issueSum +
                        (issue.owner.startsWith('Radix Select') && issue.level === 'warning' ? issue.count : 0),
                    0,
                ),
            0,
        ),
        screens: group.screens.filter((screen) =>
            screen.issues.some((issue) => issue.owner.startsWith('Radix Select') && issue.level === 'warning'),
        ).length,
    },
}))

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

// 긴 영문 원문은 일반 문장으로 읽히게 두고, 검사 대상 요소·속성만 코드 형태로 구분한다.
// 원문 자체는 바꾸지 않아 검사 도구에서 그대로 검색할 수 있다.
const ValidatorMessage = ({message}: {message: string}) => (
    <p lang="en" className="text-foreground leading-6">
        {message.split(/(“[^”]+”)/g).map((part, index) =>
            part.startsWith('“') && part.endsWith('”') ? (
                <code
                    key={`${part}-${index}`}
                    className="bg-muted mx-0.5 inline-block rounded-xs px-1.5 py-0.5 font-mono text-xs leading-5 whitespace-nowrap"
                >
                    {part}
                </code>
            ) : (
                part
            ),
        )}
    </p>
)

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
    <Table className="min-w-320 table-fixed">
        <colgroup>
            <col className="w-36" />
            <col className="w-112" />
            <col className="w-24" />
            {showScreens ? <col className="w-20" /> : null}
            <col className="w-56" />
            <col className="w-72" />
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
                    <TableCell className="align-top whitespace-normal">
                        <ValidatorMessage message={issue.message} />
                    </TableCell>
                    <TableCell className="text-center align-top font-bold">{issue.count}</TableCell>
                    {showScreens ? <TableCell className="text-center align-top">{issue.screens}</TableCell> : null}
                    <TableCell className="align-top break-words whitespace-normal">{issue.owner}</TableCell>
                    <TableCell className="align-top break-words whitespace-normal">{issue.verdict}</TableCell>
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

// 라이브러리별 검사 표는 바로 비교할 수 있게 두고, 긴 원인·조치·근거만 필요할 때 펼쳐 본다.
const LibraryDetailAccordion = ({rows}: {rows: readonly DetailRow[]}) => (
    <Accordion type="single" collapsible className="gap-0">
        <AccordionItem value="details" className="border-subtle-3 rounded-sm border bg-transparent px-4 py-3">
            <AccordionTrigger className="text-sm! leading-5! font-bold!">발생 이유 · 조치 및 근거</AccordionTrigger>
            <AccordionContent className="mt-3 pt-3 text-sm! leading-5!">
                <DetailList rows={rows} />
            </AccordionContent>
        </AccordionItem>
    </Accordion>
)

const OccurrenceScreensAccordion = ({routes}: {routes: readonly string[]}) => (
    <Accordion type="single" collapsible className="gap-0">
        <AccordionItem value="screens" className="border-subtle-3 rounded-sm border bg-transparent px-3 py-2">
            <AccordionTrigger className="py-1 text-sm! leading-5! font-bold!">{routes.length}개</AccordionTrigger>
            <AccordionContent className="mt-2 border-0 pt-2 pb-1 text-sm! leading-5!">
                <ul className="flex flex-col gap-2">
                    {routes.map((route) => (
                        <li key={route} className="flex min-w-0 items-start">
                            <ListMarker type="unordered-small" />
                            <Link className="text-primary min-w-0 underline" href={route}>
                                {waveScreenLabel(route)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
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
        <BaseCard title={cardHeading('검사 방법')}>
            <div className="flex flex-col gap-4">
                <dl className="grid gap-3 md:grid-cols-[10rem_1fr]">
                    <dt className="font-bold">검사 대상</dt>
                    <dd>
                        탄소를 제외한 기업·기관 화면을 <code className="font-mono">next build</code> 후 운영 모드로
                        실행하여, 서버가 응답한 초기 HTML을 검사합니다
                    </dd>
                    <dt className="font-bold">검사 도구</dt>
                    <dd className="flex flex-col gap-2">
                        <p>
                            <strong>W3C 마크업 검사:</strong>{' '}
                            <ReferenceLink href="https://validator.github.io/validator/">Nu Html Checker</ReferenceLink>{' '}
                            {NU_VERSION}로 자동 검사합니다.{' '}
                            <ReferenceLink href="https://validator.w3.org/">
                                W3C Markup Validation Service
                            </ReferenceLink>
                            와 같은 엔진을 사용합니다
                        </p>
                        <p>
                            <strong>WAVE 웹 접근성 검사:</strong> 자동 수집하지 않고 브라우저에서 수동으로 검사해
                            기록합니다
                        </p>
                    </dd>
                    <dt className="font-bold">주요 프론트엔드 버전</dt>
                    <dd>
                        Next.js 16.2.9 · React 19.2.4 · radix-ui 1.6.2 (shadcn/ui 기반 UI 라이브러리) · Recharts 3.8.0
                        (shadcn/ui 차트에서 사용하는 그래프 라이브러리)
                    </dd>
                </dl>
                <Alert variant="outline" color="info">
                    <Info aria-hidden="true" />
                    <AlertDescription>
                        Nu Html Checker는 MIT 라이선스로 사용·수정·배포·상업적 이용이 허용됩니다. 검사기 복사본이나 주요
                        소스를 재배포할 때는 저작권 및 라이선스 고지를 포함해야 합니다.{' '}
                        <ReferenceLink href="https://github.com/validator/validator/blob/main/LICENSE">
                            공식 LICENSE
                        </ReferenceLink>
                    </AlertDescription>
                </Alert>
            </div>
        </BaseCard>

        <Alert variant="outline" color="warning">
            <Info aria-hidden="true" />
            <AlertDescription className="flex flex-col gap-0.5">
                <strong className="block">현재 회차 화면 수 메모</strong>
                <div className="leading-5">
                    {AUDIT_SCOPE_NOTES.map((note) => (
                        <span key={note.key} className="block">
                            {auditScopeDescription(note)}
                        </span>
                    ))}
                </div>
                <Accordion type="multiple" className="mt-1 gap-0">
                    {AUDIT_SCOPE_ACCORDIONS.map((item) => (
                        <AccordionItem
                            key={item.key}
                            value={item.key}
                            className="rounded-none bg-transparent px-0 py-0"
                        >
                            <AccordionTrigger className="py-2 text-sm! leading-5! font-bold!">
                                {item.label}({item.screens.length})
                            </AccordionTrigger>
                            <AccordionContent className="mt-0 border-0 pt-0 pb-2 text-sm! leading-5!">
                                <ul className="list-disc space-y-1 pl-5">
                                    {item.screens.map((screen) => (
                                        <li key={screen.registryKey ?? screen.path.join(' > ')}>
                                            {screen.path.join(' > ')}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </AlertDescription>
        </Alert>

        {/* W3C 마크업 검사와 WAVE 를 갈라 둔다 — 검사 도구가 다르고 회차도 따로 돈다.
            탭 밖의 판정 원칙은 두 검사에 함께 적용된다. */}
        <Tabs defaultValue="w3c" className="gap-5">
            <TabsList variant="line" aria-label="검사 도구">
                <TabsTrigger value="w3c">W3C 마크업 검사</TabsTrigger>
                <TabsTrigger value="wave">WAVE 웹 접근성 검사</TabsTrigger>
            </TabsList>
            <TabsContent value="w3c" className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                    <Alert variant="outline" color="info">
                        <Info aria-hidden="true" />
                        <AlertDescription>
                            <strong>자동 검사 결과</strong> — Nu Html Checker로 검사한 결과를 이 페이지의 요약과 화면별
                            기록에 제공합니다.
                        </AlertDescription>
                    </Alert>
                    <BaseCard
                        title={cardHeading('최근 검사 요약')}
                        subtitle={
                            <AuditSummaryMetadata
                                checkedAt={audit.checkedAt}
                                commit={AUDIT_COMMIT}
                                validatorVersion={NU_VERSION}
                            />
                        }
                    >
                        <div className="flex flex-col gap-5">
                            <Tabs defaultValue={SUMMARY_GROUPS[0].key}>
                                <TabsList variant="pill" aria-label="검사 대상 구분">
                                    {SUMMARY_GROUPS.map((group) => (
                                        <TabsTrigger key={group.key} value={group.key}>
                                            {group.label} {group.screens.length}개
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                {SUMMARY_GROUPS.map((group) => (
                                    <TabsContent key={group.key} value={group.key}>
                                        <section className="border-subtle-3 rounded-sm border p-5 md:p-6">
                                            <dl className="border-subtle-3 grid grid-cols-2 gap-x-5 gap-y-4 border-b pb-5 sm:grid-cols-3">
                                                {group.totals.map((total) => (
                                                    <div key={total.label} className="flex min-w-0 flex-col gap-1">
                                                        <dt className="typo-body-s-regular text-foreground-subtle">
                                                            {total.label}
                                                        </dt>
                                                        <dd className="typo-title-l-bold text-foreground">
                                                            {total.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                            <div className="divide-subtle-3 mt-1 flex flex-col divide-y">
                                                {group.causes.map((cause) => (
                                                    <section
                                                        key={cause.label}
                                                        className="grid gap-3 py-5 md:grid-cols-[14rem_1fr]"
                                                    >
                                                        <div className="flex flex-col items-start gap-2">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Badge color={cause.color}>{cause.badge}</Badge>
                                                                <h4 className="font-bold">{cause.label}</h4>
                                                            </div>
                                                            <p className="typo-title-l-bold">{cause.value}</p>
                                                        </div>
                                                        <div className="self-center">
                                                            {cause.reasons.length === 0 ? (
                                                                <p className="text-foreground-subtle">
                                                                    발생한 오류가 없습니다.
                                                                </p>
                                                            ) : (
                                                                <ul className="text-foreground-subtle flex list-none flex-col gap-2">
                                                                    {cause.reasons.map((reason) => (
                                                                        <li key={reason.head} className="flex">
                                                                            <ListMarker type="unordered-small" />
                                                                            <span className="min-w-0 break-keep">
                                                                                <strong className="text-foreground">
                                                                                    {reason.head}
                                                                                </strong>{' '}
                                                                                · {reason.detail}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </section>
                                                ))}
                                            </div>
                                        </section>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                    </BaseCard>
                </div>

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
                                <SectionHeaderTitle
                                    className="typo-title-l-bold scroll-mt-24"
                                    id="library-empty-option"
                                >
                                    {sectionHeading('Radix UI Select', '빈 option')}
                                </SectionHeaderTitle>
                            </SectionHeader>
                            <IssueTable
                                caption="빈 option 오류의 건수와 판정"
                                issues={issuesByKind(['empty-option'])}
                            />
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    프로젝트가 일반적인 placeholder 방식을 사용했을 때, Radix UI가 폼
                                                    연동용으로 자동 생성한 숨은 옵션에서 발생합니다. 사용자가 조작하는
                                                    선택 버튼에는 이름이 제공되어 있으며, 현재 확인 범위에서 이용에는
                                                    영향이 없습니다.
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '오류의 뜻',
                                        body: (
                                            <div className="flex flex-col gap-2">
                                                <p>
                                                    검사기는 이름이 없는 빈 선택지를 발견했다는 뜻으로 이 오류를
                                                    표시합니다.
                                                </p>
                                                <CodeBlock code={'<option value=""></option>'} language="html" />
                                                <p className="text-foreground-subtle">
                                                    HTML 규칙상 <code className="font-mono">&lt;option&gt;</code>에는
                                                    태그 안의 글자나 <code className="font-mono">label</code> 속성 중
                                                    하나가 있어야 합니다. 여기서 label은 별도의{' '}
                                                    <code className="font-mono">&lt;label&gt;</code> 태그가 아니라
                                                    선택지 자체의 이름입니다.
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <div className="flex flex-col gap-2">
                                                <ul className="flex list-none flex-col gap-1">
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            선택 전에는 값이 비어 있어 “관련사이트” placeholder가
                                                            보입니다. 일반적인 Select 사용 방식입니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            shadcn/ui Select가 사용하는 Radix UI는 보이는 선택 버튼과
                                                            별도로, 폼에 값을 전달할 숨은{' '}
                                                            <code className="font-mono">&lt;select&gt;</code>를
                                                            만듭니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            아직 선택한 값이 없다는 상태를 표현하려고 Radix UI가 그
                                                            select 안에 이름 없는 빈 option을 자동으로 넣습니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            Nu Html Checker는 화면에 보이는지와 관계없이 이 빈 option을
                                                            HTML 문법 오류로 보고합니다.
                                                        </span>
                                                    </li>
                                                </ul>
                                                <CodeBlock
                                                    code={
                                                        '<!-- 프로젝트가 작성한 보이는 선택 버튼 -->\n<button role="combobox" aria-label="관련 사이트">관련사이트</button>\n\n<!-- Radix UI가 자동 생성한 폼 연동용 요소 -->\n<select aria-hidden="true" tabindex="-1" name="familySite">\n  <option value="" selected></option>\n</select>'
                                                    }
                                                    language="html"
                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        term: '책임 구분',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>프로젝트 코드:</strong> placeholder와 빈 초기값을
                                                        사용합니다. 선택 항목에는 모두 화면에 표시할 이름이 있고, 실제
                                                        선택 버튼에도 <code className="font-mono">aria-label</code>이
                                                        있습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>라이브러리 코드:</strong> 오류 대상인 빈 option을 직접
                                                        생성합니다. 프로젝트의 Select 래퍼와 사용 화면에는 해당 option이
                                                        작성되어 있지 않습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        따라서 오류가 발견된 곳은 우리 화면이지만, 오류 마크업의 생성
                                                        주체는 Radix UI로 분류합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '영향과 조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>HTML 적합성 오류는 맞습니다.</strong> 다만 오류가 난
                                                        select는 값 전달을 위한 숨은 요소이며 스크린리더와 키보드
                                                        탐색에서 제외되어 있습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>사용자 이용에는 결함이 없습니다.</strong> 실제로
                                                        조작하는 버튼에는 “관련 사이트”라는 접근 가능한 이름이 있고,
                                                        키보드 선택과 새 창 열기 동작도 정상임을 확인했습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        근본 수정은 Radix UI가 빈 option에 이름을 제공하도록 변경해야
                                                        합니다.{' '}
                                                        <strong>
                                                            라이브러리 원본 수정이나 가짜 선택값을 사용하는 우회는
                                                            업데이트 및 동작에 영향을 줄 수 있어 적용하지 않습니다.
                                                        </strong>{' '}
                                                        따라서 외부 라이브러리 예외 검토 항목으로 관리합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '반복 이유',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        모든 화면의 Footer에 “관련 사이트” Select가 있어 기본적으로
                                                        화면당 1건이 발생합니다. 총{' '}
                                                        {ISSUE_SCREENS_BY_KIND['empty-option']}개 화면에 같은 원인이
                                                        반복된 결과입니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>
                                                            2건 이상도 Footer와 동일한 Radix UI의 빈 option 오류입니다.
                                                        </strong>{' '}
                                                        화면 본문에 같은 방식의 Select가 있어 발생 건수가 추가됩니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '여러 건 화면',
                                        body: (
                                            <Accordion type="single" collapsible className="gap-0">
                                                <AccordionItem
                                                    value="multiple-empty-options"
                                                    className="border-subtle-3 rounded-sm border bg-transparent px-4 py-3"
                                                >
                                                    <AccordionTrigger className="text-sm! leading-5! font-bold!">
                                                        2건 이상 발생한 {MULTIPLE_EMPTY_OPTION_SCREENS.length}개 화면
                                                        보기
                                                    </AccordionTrigger>
                                                    <AccordionContent className="mt-3 pt-3 text-sm! leading-5!">
                                                        <p className="text-foreground-subtle mb-3">
                                                            건수 구성은 공통 Footer 1건과 해당 화면 본문의 Select 건수로
                                                            나눠 표시합니다.
                                                        </p>
                                                        <Table className="min-w-220 table-fixed">
                                                            <colgroup>
                                                                <col className="w-16" />
                                                                <col className="w-56" />
                                                                <col />
                                                                <col className="w-28" />
                                                            </colgroup>
                                                            <TableCaption className="sr-only">
                                                                빈 option 오류가 2건 이상 발생한 화면과 건수 구성
                                                            </TableCaption>
                                                            <TableHeader>
                                                                <TableRow className="bg-muted hover:bg-muted">
                                                                    <TableHead scope="col">구분</TableHead>
                                                                    <TableHead scope="col">화면명</TableHead>
                                                                    <TableHead scope="col">경로</TableHead>
                                                                    <TableHead scope="col" className="text-center">
                                                                        건수 구성
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {MULTIPLE_EMPTY_OPTION_SCREENS.map((screen) => (
                                                                    <TableRow key={screen.path}>
                                                                        <TableCell className="align-top">
                                                                            {screen.userType}
                                                                        </TableCell>
                                                                        <TableCell className="align-top whitespace-normal">
                                                                            <Link
                                                                                href={screen.path}
                                                                                className="text-primary focus-visible:ring-ring rounded-xs font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                                                                            >
                                                                                {screen.name}
                                                                            </Link>
                                                                        </TableCell>
                                                                        <TableCell className="align-top whitespace-normal">
                                                                            <code className="font-mono break-all">
                                                                                {screen.path}
                                                                            </code>
                                                                        </TableCell>
                                                                        <TableCell className="text-center align-top font-bold tabular-nums">
                                                                            1 + {screen.emptyOptionCount - 1} ={' '}
                                                                            {screen.emptyOptionCount}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
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
                                <SectionHeaderTitle
                                    className="typo-title-l-bold scroll-mt-24"
                                    id="library-select-required"
                                >
                                    {sectionHeading('Radix UI Select', 'required select')}
                                </SectionHeaderTitle>
                            </SectionHeader>
                            <IssueTable
                                caption="required select 오류의 건수와 판정"
                                issues={issuesByKind(['select-required'])}
                            />
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    필수 Select의 값이나 동작 문제가 아니라, 초기 HTML에서 Radix UI가
                                                    만든 숨은 select에 option이 아직 채워지지 않아 발생합니다. 브라우저
                                                    실행 후에는 선택지가 채워지고 필수 검증도 정상 동작합니다.
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '오류의 뜻',
                                        body: (
                                            <div className="flex flex-col gap-2">
                                                <p>
                                                    검사기가 “필수 선택 상자인데 선택 항목이 하나도 없다”고 판단한
                                                    오류입니다.
                                                </p>
                                                <CodeBlock code={'<select required></select>'} language="html" />
                                                <p className="text-foreground-subtle">
                                                    HTML 규칙상 <code className="font-mono">required</code>가 붙은{' '}
                                                    <code className="font-mono">&lt;select&gt;</code>에는 최소 한 개의{' '}
                                                    <code className="font-mono">&lt;option&gt;</code>이 있어야 합니다.
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <div className="flex flex-col gap-2">
                                                <ul className="flex list-none flex-col gap-2">
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            프로젝트에서 필수 입력으로 지정하면 Radix UI가 만든 숨은{' '}
                                                            <code className="font-mono">&lt;select&gt;</code>에도{' '}
                                                            <code className="font-mono">required</code>가 붙습니다.
                                                        </span>
                                                    </li>
                                                    <li className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            초기 HTML에서는 실제 선택 항목이 숨은 select에 아직 복사되지
                                                            않아 빈 상태로 검사됩니다.
                                                        </span>
                                                    </li>
                                                </ul>
                                                <CodeBlock
                                                    code={
                                                        '<!-- 사용자가 조작하는 선택 버튼 -->\n<button role="combobox" id="corpType">기업형태</button>\n\n<!-- Radix UI가 초기 HTML에 생성한 폼 연동용 요소 -->\n<select aria-hidden="true" required tabindex="-1" name="corpType"></select>'
                                                    }
                                                    language="html"
                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        term: '책임 구분',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>프로젝트 코드:</strong> 업무상 필요한 필수 입력과 실제
                                                        선택 항목을 정상적으로 제공합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>라이브러리 코드:</strong> 초기 HTML에 option이 없는 숨은
                                                        필수 select를 생성합니다. 따라서 생성 주체는 Radix UI로
                                                        분류합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '영향과 조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>HTML 적합성 오류는 맞습니다.</strong> 다만 브라우저가
                                                        실행되면 숨은 select에 option이 채워집니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>사용자 이용에는 결함이 없습니다.</strong> 사용자가
                                                        조작하는 Select의 선택지와 필수 입력 검증은 정상 동작합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        필수 검증에 필요한 <code className="font-mono">required</code>를
                                                        제거하거나 라이브러리 원본을 수정하면 동작과 업데이트에 영향을
                                                        줄 수 있어 적용하지 않습니다. 따라서 외부 라이브러리 예외 검토
                                                        항목으로 관리합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '발생 화면',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                {REQUIRED_SELECT_SCREENS.map((screen) => (
                                                    <li key={screen.path} className="flex">
                                                        <ListMarker type="unordered-small" />
                                                        <span className="min-w-0">
                                                            <Link
                                                                href={screen.path}
                                                                className="text-primary focus-visible:ring-ring rounded-xs font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                                                            >
                                                                {screen.name}
                                                            </Link>{' '}
                                                            · {screen.userType} · {screen.requiredSelectCount}건
                                                        </span>
                                                    </li>
                                                ))}
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

                        {NAV_ROLE_ISSUES.length > 0 ? (
                            <section
                                aria-labelledby="library-nav-role"
                                className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                            >
                                <SectionHeader>
                                    <SectionHeaderTitle
                                        className="typo-title-l-bold scroll-mt-24"
                                        id="library-nav-role"
                                    >
                                        {sectionHeading('shadcn Pagination', 'nav role 경고')}
                                    </SectionHeaderTitle>
                                </SectionHeader>
                                <IssueTable caption="nav role 경고의 건수와 판정" issues={NAV_ROLE_ISSUES} />
                                <LibraryDetailAccordion
                                    rows={[
                                        {
                                            term: '발생 이유',
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
                                            body: <p>shadcn/ui가 관리하는 primitive 셸 구조이므로 그대로 둡니다.</p>,
                                        },
                                    ]}
                                />
                            </section>
                        ) : null}

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
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    sonner가 토스트 디자인을 위해 브라우저 실행 후 추가한 스타일에서
                                                    발생합니다. 프로젝트가 작성한 CSS 오류가 아니며, 스타일과 토스트
                                                    동작은 브라우저에서 정상 작동합니다.
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '오류의 뜻',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>CSS Parse Error:</strong> Nu Html Checker가 sonner
                                                        스타일 일부를 CSS 문법으로 해석하지 못했다는 뜻입니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>style type 경고:</strong>{' '}
                                                        <code className="font-mono">type=&quot;text/css&quot;</code>는
                                                        HTML5에서 기본값이므로 생략해도 된다는 안내입니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        sonner는 알림 토스트를 표시하는 외부 라이브러리입니다. 화면이
                                                        실행되면 자체 CSS를{' '}
                                                        <code className="font-mono">
                                                            &lt;style type=&quot;text/css&quot;&gt;
                                                        </code>
                                                        로 문서에 추가합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        이 스타일이 포함된 브라우저 DOM을 검사하면 두 메시지가
                                                        발생합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '책임 구분',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>프로젝트 코드:</strong> 공통 레이아웃에 토스트 영역만
                                                        배치하며, 오류가 표시된 style과 CSS를 직접 작성하지 않습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>라이브러리 코드:</strong> sonner가 style 요소와 CSS를
                                                        실행 중에 직접 생성합니다. 따라서 생성 주체는 sonner로
                                                        분류합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '영향과 조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>사용자 이용에는 결함이 없습니다.</strong> sonner의
                                                        스타일과 토스트 표시·닫기 동작은 브라우저에서 정상 작동합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        제거하려면 sonner 원본을 수정하거나 토스트 라이브러리를 교체해야
                                                        하며, 업데이트와 공통 알림 기능에 영향을 줄 수 있어 적용하지
                                                        않습니다. 따라서 외부 라이브러리 예외 검토 항목으로 관리합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '발생 조건',
                                        body: (
                                            <p>
                                                서버가 처음 전송한 HTML에는 sonner 스타일이 없습니다. 브라우저 실행 후의
                                                DOM을 복사하거나 직렬화해 검사할 때만 나타나며, 검사 방식에 따라 CSS
                                                Parse Error 건수는 달라질 수 있습니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <div className="flex flex-col gap-2">
                                                <p>
                                                    sonner 2.0.7 배포 코드에서{' '}
                                                    <code className="font-mono">style.type = &apos;text/css&apos;</code>
                                                    와 자체 CSS를 문서에 삽입하는 동작을 확인했습니다.
                                                </p>
                                                <div className="flex flex-col items-start gap-1">
                                                    <ReferenceLink href="https://app.unpkg.com/sonner@2.0.7/files/dist/index.mjs">
                                                        sonner 2.0.7 배포 코드 — style 요소와 CSS 삽입 구현
                                                    </ReferenceLink>
                                                    <ReferenceLink href="https://github.com/emilkowalski/sonner/releases/tag/v2.0.7">
                                                        sonner 공식 GitHub — v2.0.7 릴리스
                                                    </ReferenceLink>
                                                </div>
                                            </div>
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
                                    퍼블리싱 확인용 화면과 실제 서비스 화면 모두 모달을 연 상태에서 발생할 수 있습니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <IssueTable
                                caption="모달이 열렸을 때 생기는 메시지와 화면당 건수"
                                issues={DIALOG_ISSUES}
                                countHeader="화면당 건수"
                                showScreens={false}
                            />
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    모달이 열릴 때 Radix UI가 배경을 숨기고 스크롤을 막는 과정에서
                                                    발생합니다. 모달 단독 확인 화면만의 문제가 아니며, 실제 서비스
                                                    모달을 연 상태에서도 같은 원인으로 나타날 수 있습니다.
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '오류의 뜻',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>배경 감춤 경고:</strong> 이미{' '}
                                                        <code className="font-mono">hidden</code>인 요소에 같은 의미의{' '}
                                                        <code className="font-mono">aria-hidden</code>이 추가돼
                                                        불필요하다는 안내입니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>style type 경고:</strong> 스크롤 잠금용 style의{' '}
                                                        <code className="font-mono">type=&quot;text/css&quot;</code>는
                                                        HTML5에서 기본값이므로 생략해도 된다는 안내입니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        모달이 열리면 배경을 스크린리더에서 제외하기 위해 Radix UI가{' '}
                                                        <code className="font-mono">aria-hidden</code>을 추가합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        동시에 react-remove-scroll이 배경 스크롤을 막는 style을 문서에
                                                        추가합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '책임 구분',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>프로젝트 코드:</strong> Radix 모달을 정상적인 방법으로
                                                        열고 닫습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>라이브러리 코드:</strong> 경고 대상인 aria-hidden과
                                                        스크롤 잠금 style을 실행 중에 생성합니다. 따라서 외부 라이브러리
                                                        원인으로 분류합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '영향과 조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>사용자 이용에는 결함이 없습니다.</strong> 배경 감춤은
                                                        모달에 집중하도록 돕고, 스크롤 잠금도 정상 작동합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        제거하려면 라이브러리의 모달 접근성 및 스크롤 제어를 수정해야
                                                        하므로 적용하지 않습니다. 따라서 외부 라이브러리 예외 검토
                                                        항목으로 관리합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '발생 조건',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        서버의 초기 HTML이나 모달이 닫힌 상태에서는 발생하지 않습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        퍼블리싱 확인용 화면과 실제 서비스 화면 모두 모달을 연 뒤의
                                                        DOM을 검사하면 발생할 수 있습니다. 모달을 닫으면 추가된 속성과
                                                        style도 제거됩니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '대표 확인 경로',
                                        body: (
                                            <ul className="flex flex-wrap gap-2">
                                                {DIALOG_SCREEN_ROUTES.map((route) => (
                                                    <li key={route}>
                                                        <Badge variant="solid-pastel" color="success" size="xs" asChild>
                                                            <Link href={route}>
                                                                <code className="font-mono">{route}</code>
                                                            </Link>
                                                        </Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span>
                                                            Radix Dialog가 모달 바깥 영역을 숨기고 RemoveScroll을
                                                            실행합니다.
                                                        </span>
                                                        <ReferenceLink href="https://github.com/radix-ui/primitives/blob/main/packages/react/dialog/src/dialog.tsx#L198-L232">
                                                            스크롤 잠금 공식 소스
                                                        </ReferenceLink>
                                                        <ReferenceLink href="https://github.com/radix-ui/primitives/blob/main/packages/react/dialog/src/dialog.tsx#L272-L285">
                                                            배경 감춤 공식 소스
                                                        </ReferenceLink>
                                                    </div>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span>
                                                            react-style-singleton 2.2.3이 스크롤 잠금용 style에{' '}
                                                            <code className="font-mono">type=&quot;text/css&quot;</code>
                                                            를 지정합니다.
                                                        </span>
                                                        <ReferenceLink href="https://unpkg.com/react-style-singleton@2.2.3/dist/es2019/singleton.js">
                                                            배포 코드 확인
                                                        </ReferenceLink>
                                                    </div>
                                                </li>
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
                                <SectionHeaderTitle className="typo-title-l-bold scroll-mt-24" id="library-chart">
                                    {sectionHeading('recharts · shadcn chart', 'SVG 속성 · div 안의 style')}
                                </SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    차트가 있는 평가결과 화면에서 shadcn Chart와 Recharts가 생성한 요소에 발생합니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold">운영 HTML 자동 검사</h4>
                                <IssueTable
                                    caption="최근 운영 HTML 검사 — 차트 셸과 Recharts 생성 요소"
                                    issues={issuesByKind(['chart-style', 'chart-width', 'chart-height'])}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold">브라우저 렌더링 후 DOM 검사 사례</h4>
                                <p className="text-foreground-subtle">
                                    차트가 완성된 뒤 SVG 도형에 추가되는 항목입니다. 현재 운영 HTML 자동 집계와
                                    구분합니다.
                                </p>
                                <IssueTable
                                    caption="과거 브라우저 DOM 검사 사례 — 현재 운영 HTML 집계와 별개"
                                    issues={CHART_ISSUES}
                                    countHeader="화면당 건수"
                                    showScreens={false}
                                />
                            </div>
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    shadcn Chart와 Recharts가 차트를 그리며 자동 생성한 HTML·SVG에서
                                                    발생합니다. 프로젝트가 입력한 차트 데이터의 오류가 아니며, 차트
                                                    표시와 이용은 정상입니다.
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '오류의 뜻',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>div 안의 style:</strong> shadcn Chart가 차트 색상을
                                                        적용하려고 div 내부에 style 요소를 만들어 발생합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>div의 width·height:</strong> Recharts가 div에 허용되지
                                                        않는 크기 속성을 직접 붙여 발생합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>SVG 속성:</strong> 차트 계산에 쓴 좌표·크기·이름이
                                                        허용되지 않는 SVG 요소에 남아 브라우저 DOM 검사에서 추가로
                                                        발생합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        shadcn Chart가 색상용 style을 만들고, Recharts가 차트 크기를
                                                        계산해 바깥 div를 생성합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        브라우저에서 차트가 완성되면 Recharts가 막대·선·점·레이더를 SVG
                                                        요소로 그리며 관련 속성이 추가됩니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '책임 구분',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>프로젝트 코드:</strong> 차트 데이터와 접근 가능한 이름을
                                                        제공하고, 동일한 값을 확인할 수 있는 숨김 데이터 표를 함께
                                                        제공합니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>라이브러리 코드:</strong> 오류 대상인 style, div 속성,
                                                        SVG 요소와 속성을 직접 생성합니다. 따라서 shadcn Chart와
                                                        Recharts 원인으로 분류합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '영향과 조치',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>HTML·SVG 적합성 오류는 맞습니다.</strong> 브라우저는
                                                        허용되지 않는 추가 속성을 무시하고 차트를 정상적으로 그립니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        <strong>사용자 이용에는 결함이 없습니다.</strong> 차트에는 접근
                                                        가능한 이름이 있고, 같은 정보를 제공하는 숨김 데이터 표도
                                                        있습니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        제거하려면 shadcn Chart 구조와 Recharts 내부 출력을 수정하거나
                                                        차트를 직접 다시 구현해야 하므로 적용하지 않습니다. 따라서 외부
                                                        라이브러리 예외 검토 항목으로 관리합니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '검사 범위',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        운영 HTML 자동 검사에는 style과 바깥 div의 width·height가
                                                        포함됩니다.
                                                    </span>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <span className="min-w-0">
                                                        브라우저 실행 후 DOM 검사에는 차트가 그려지며 생성된 SVG 속성
                                                        오류가 추가됩니다. 두 표의 건수는 서로 합산하지 않습니다.
                                                    </span>
                                                </li>
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '대표 확인 경로',
                                        body: (
                                            <ul className="flex flex-wrap gap-2">
                                                {CHART_SCREEN_ROUTES.map((route) => (
                                                    <li key={route}>
                                                        <Badge variant="solid-pastel" color="success" size="xs" asChild>
                                                            <Link href={route}>
                                                                <code className="font-mono">{route}</code>
                                                            </Link>
                                                        </Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <ul className="flex list-none flex-col gap-2">
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span>
                                                            shadcn ChartStyle 생성 위치:{' '}
                                                            <code className="font-mono">
                                                                src/components/ui/chart.tsx
                                                            </code>
                                                        </span>
                                                        <ReferenceLink href="https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/chart.tsx#L77-L107">
                                                            shadcn/ui 공식 ChartStyle 소스
                                                        </ReferenceLink>
                                                    </div>
                                                </li>
                                                <li className="flex">
                                                    <ListMarker type="unordered-small" />
                                                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span>
                                                            Recharts 3.8.0 생성 위치: RechartsWrapper·StaticDiv 및 SVG
                                                            도형 컴포넌트
                                                        </span>
                                                        <ReferenceLink href="https://github.com/recharts/recharts/blob/v3.8.0/src/chart/RechartsWrapper.tsx#L170-L193">
                                                            div 크기 속성 생성 코드
                                                        </ReferenceLink>
                                                        <ReferenceLink href="https://github.com/recharts/recharts/blob/v3.8.0/src/shape/Rectangle.tsx#L212-L225">
                                                            SVG 도형 속성 생성 코드
                                                        </ReferenceLink>
                                                    </div>
                                                </li>
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
                                        {term: '발생 이유', body: <p>{issue.reason}</p>},
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
                                                        <col className="w-14" />
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
                                                            <TableHead scope="col" className="text-center">
                                                                번호
                                                            </TableHead>
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
                                                        {group.screens.map((screen, index) => (
                                                            <TableRow key={screen.path}>
                                                                <TableCell className="text-foreground-subtle text-center align-top tabular-nums">
                                                                    {index + 1}
                                                                </TableCell>
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
                                                                            {screen.kinds.map((kind) => {
                                                                                const target =
                                                                                    LIBRARY_ISSUE_TARGET[kind]
                                                                                const hasError = screen.messages.some(
                                                                                    (message) =>
                                                                                        message.type === 'error' &&
                                                                                        kindForMessage(
                                                                                            message.message,
                                                                                        ) === kind,
                                                                                )
                                                                                const badge = (
                                                                                    <Badge
                                                                                        size="xs"
                                                                                        color={
                                                                                            hasError
                                                                                                ? 'error'
                                                                                                : 'warning'
                                                                                        }
                                                                                        asChild={target !== undefined}
                                                                                    >
                                                                                        {target ? (
                                                                                            <Link href={`#${target}`}>
                                                                                                {
                                                                                                    ISSUE_LABEL[kind]
                                                                                                        .label
                                                                                                }
                                                                                            </Link>
                                                                                        ) : (
                                                                                            ISSUE_LABEL[kind].label
                                                                                        )}
                                                                                    </Badge>
                                                                                )

                                                                                return <span key={kind}>{badge}</span>
                                                                            })}
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
                <div className="flex flex-col gap-5">
                    <Alert variant="outline" color="warning">
                        <Info aria-hidden="true" />
                        <AlertDescription>
                            <strong>수동 검사 결과</strong> — WAVE는 자동 수집하지 않으며, 브라우저에서 화면별로 검사한
                            사례를 수동으로 기록합니다.
                        </AlertDescription>
                    </Alert>
                    <BaseCard
                        title={cardHeading('최근 검사 요약')}
                        subtitle="현재 페이지에 수동으로 기록된 WAVE 검사 사례입니다."
                    >
                        <Tabs defaultValue="wave-corp">
                            <TabsList variant="pill" aria-label="검사 대상 구분">
                                {WAVE_SUMMARY_GROUPS.map((group) => (
                                    <TabsTrigger key={group.key} value={`wave-${group.key}`}>
                                        {group.label} {group.totals.screens}개
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {WAVE_SUMMARY_GROUPS.map((group) => (
                                <TabsContent key={group.key} value={`wave-${group.key}`}>
                                    <section className="border-subtle-3 rounded-sm border p-5 md:p-6">
                                        <dl className="border-subtle-3 grid grid-cols-2 gap-x-5 gap-y-4 border-b pb-5 sm:grid-cols-3">
                                            <div className="flex min-w-0 flex-col gap-1">
                                                <dt className="typo-body-s-regular text-foreground-subtle">
                                                    검사한 화면
                                                </dt>
                                                <dd className="typo-title-l-bold text-foreground">
                                                    {group.totals.screens}개
                                                </dd>
                                            </div>
                                            <div className="flex min-w-0 flex-col gap-1">
                                                <dt className="typo-body-s-regular text-foreground-subtle">오류</dt>
                                                <dd className="typo-title-l-bold text-foreground">
                                                    {group.totals.errors}건
                                                </dd>
                                            </div>
                                            <div className="flex min-w-0 flex-col gap-1">
                                                <dt className="typo-body-s-regular text-foreground-subtle">경고</dt>
                                                <dd className="typo-title-l-bold text-foreground">
                                                    {group.totals.warnings}건
                                                </dd>
                                            </div>
                                        </dl>
                                        <div className="divide-subtle-3 mt-1 flex flex-col divide-y">
                                            <section className="grid gap-3 py-5 md:grid-cols-[14rem_1fr]">
                                                <div className="flex flex-col items-start gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge color="success">예외 검토</Badge>
                                                        <h4 className="font-bold">외부 라이브러리 원인</h4>
                                                    </div>
                                                    <p className="typo-title-l-bold">
                                                        {group.totals.errors + group.totals.warnings}건
                                                    </p>
                                                </div>
                                                <div className="self-center">
                                                    <ul className="text-foreground-subtle flex list-none flex-col gap-2">
                                                        <li className="flex">
                                                            <ListMarker type="unordered-small" />
                                                            <span className="min-w-0 break-keep">
                                                                <strong className="text-foreground">
                                                                    Radix RadioGroup {group.radio.count}건
                                                                </strong>{' '}
                                                                · {group.radio.screens}개 화면 · 숨은 input
                                                            </span>
                                                        </li>
                                                        <li className="flex">
                                                            <ListMarker type="unordered-small" />
                                                            <span className="min-w-0 break-keep">
                                                                <strong className="text-foreground">
                                                                    Radix Checkbox {group.checkbox.count}건
                                                                </strong>{' '}
                                                                · {group.checkbox.screens}개 화면 · 숨은 input
                                                            </span>
                                                        </li>
                                                        <li className="flex">
                                                            <ListMarker type="unordered-small" />
                                                            <span className="min-w-0 break-keep">
                                                                <strong className="text-foreground">
                                                                    Radix Select · Missing form label{' '}
                                                                    {group.selectError.count}건
                                                                </strong>{' '}
                                                                · {group.selectError.screens}개 화면 · 숨은 select
                                                            </span>
                                                        </li>
                                                        <li className="flex">
                                                            <ListMarker type="unordered-small" />
                                                            <span className="min-w-0 break-keep">
                                                                <strong className="text-foreground">
                                                                    Radix Select · Select missing label{' '}
                                                                    {group.selectWarning.count}건
                                                                </strong>{' '}
                                                                · {group.selectWarning.screens}개 화면 · 숨은 select
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </section>
                                            <section className="grid gap-3 py-5 md:grid-cols-[14rem_1fr]">
                                                <div className="flex flex-col items-start gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge color="neutral">발생 없음</Badge>
                                                        <h4 className="font-bold">프로젝트 수정 대상</h4>
                                                    </div>
                                                    <p className="typo-title-l-bold">0건</p>
                                                </div>
                                                <div className="self-center">
                                                    <p className="text-foreground-subtle">발생한 오류가 없습니다.</p>
                                                </div>
                                            </section>
                                            <section className="grid gap-3 py-5 md:grid-cols-[14rem_1fr]">
                                                <div className="flex flex-col items-start gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge color="warning">미분류</Badge>
                                                        <h4 className="font-bold">원인 확인 필요</h4>
                                                    </div>
                                                    <p className="typo-title-l-bold">0건</p>
                                                </div>
                                                <div className="self-center">
                                                    <p className="text-foreground-subtle">발생한 오류가 없습니다.</p>
                                                </div>
                                            </section>
                                        </div>
                                    </section>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </BaseCard>
                </div>
                <BaseCard
                    title={cardHeading('외부 라이브러리 원인')}
                    subtitle="라이브러리가 생성한 숨김 요소의 검사 사례입니다. 사용자 조작 요소의 라벨 연결은 별도로 확인합니다."
                    action={<Badge color="warning">예외 검토</Badge>}
                >
                    <div className="divide-subtle-3 flex flex-col divide-y">
                        <section
                            aria-labelledby="wave-radio"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold scroll-mt-24" id="wave-radio">
                                    {sectionHeading('Radix RadioGroup', 'Missing form label')}
                                </SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    라디오의 숨은 폼 전송용 input 수만큼 나옵니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <IssueTable caption="WAVE 가 보고한 RadioGroup 메시지와 건수" issues={[WAVE_ISSUES[0]]} />
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    WAVE가 Radix RadioGroup의 숨은 폼 전송용 input을 라벨 없는 입력으로
                                                    감지한 사례입니다.{' '}
                                                    <strong>
                                                        사용자가 조작하는 컨트롤에는 질문과 보기 이름이 정상적으로
                                                        연결되어 있습니다.
                                                    </strong>
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '오류의 뜻',
                                        body: (
                                            <p>
                                                사용자가 조작하는 Radix 컨트롤과 함께 생성된 숨은 input에서 라벨을 찾지
                                                못했다는 의미입니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <p>
                                                Radix UI가 화면에 <code className="font-mono">button[role=radio]</code>
                                                를 표시하고, 선택값을 폼에 전달하기 위해 라디오마다 숨은 input을
                                                추가합니다. WAVE는 이 숨은 input도 폼 컨트롤로 검사합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '책임 구분',
                                        body: (
                                            <p>
                                                프로젝트는 질문과 각 보기의 이름을 사용자가 조작하는 컨트롤에
                                                연결합니다. 라벨 없는 숨은 input은 Radix UI가 내부에서 생성하므로 외부
                                                라이브러리 원인으로 분류합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '영향과 조치',
                                        body: (
                                            <p>
                                                숨은 input은 <code className="font-mono">aria-hidden</code>과{' '}
                                                <code className="font-mono">tabindex=&quot;-1&quot;</code>로 사용자
                                                탐색에서 제외됩니다.{' '}
                                                <strong>실제 컨트롤의 읽기와 키보드 조작에는 결함이 없습니다.</strong>{' '}
                                                라이브러리 원본 수정은 업데이트와 폼 동작에 영향을 줄 수 있어 적용하지
                                                않고 예외 검토 항목으로 관리합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '발생 화면',
                                        body: <OccurrenceScreensAccordion routes={WAVE_RADIO_SCREEN_ROUTES} />,
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <div className="flex flex-col items-start gap-1">
                                                <ReferenceLink href="https://unpkg.com/@radix-ui/react-radio-group@1.4.3/dist/index.mjs">
                                                    Radix RadioGroup 1.4.3 배포 코드
                                                </ReferenceLink>
                                                <ReferenceLink href="https://wave.webaim.org/api/docs?format=html#label_missing">
                                                    WAVE Missing form label 설명
                                                </ReferenceLink>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="wave-checkbox"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold scroll-mt-24" id="wave-checkbox">
                                    {sectionHeading('Radix Checkbox', 'Missing form label')}
                                </SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    체크박스의 숨은 폼 전송용 input 수만큼 나옵니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <IssueTable caption="WAVE 가 보고한 Checkbox 메시지와 건수" issues={[WAVE_ISSUES[1]]} />
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    WAVE가 Radix Checkbox의 숨은 폼 전송용 input을 라벨 없는 입력으로
                                                    감지한 사례입니다.{' '}
                                                    <strong>
                                                        사용자가 조작하는 체크박스에는 질문과 보기 이름이 정상적으로
                                                        연결되어 있습니다.
                                                    </strong>
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <p>
                                                Radix UI가 화면에{' '}
                                                <code className="font-mono">button[role=checkbox]</code>를 표시하고,
                                                선택값을 폼에 전달하기 위해 체크박스마다 숨은 input을 추가합니다. WAVE는
                                                이 숨은 input도 폼 컨트롤로 검사합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '책임 구분과 조치',
                                        body: (
                                            <p>
                                                라벨 없는 숨은 input은 Radix UI가 내부에서 생성하며{' '}
                                                <code className="font-mono">aria-hidden</code>과{' '}
                                                <code className="font-mono">tabindex=&quot;-1&quot;</code>로 사용자
                                                탐색에서 제외됩니다. 실제 체크박스의 읽기와 키보드 조작을 확인한 뒤 외부
                                                라이브러리 예외 검토 항목으로 관리합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '발생 화면',
                                        body: <OccurrenceScreensAccordion routes={WAVE_CHECKBOX_SCREEN_ROUTES} />,
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <div className="flex flex-col items-start gap-1">
                                                <ReferenceLink href="https://unpkg.com/@radix-ui/react-checkbox@1.3.7/dist/index.mjs">
                                                    Radix Checkbox 1.3.7 배포 코드
                                                </ReferenceLink>
                                                <ReferenceLink href="https://wave.webaim.org/api/docs?format=html#label_missing">
                                                    WAVE Missing form label 설명
                                                </ReferenceLink>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="wave-select-error"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold scroll-mt-24" id="wave-select-error">
                                    {sectionHeading('Radix Select', 'Missing form label')}
                                </SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    조회 필터의 셀렉트 한 칸마다 하나씩 나옵니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <IssueTable
                                caption="WAVE 가 보고한 Select Missing form label 오류와 건수"
                                issues={[WAVE_SELECT_ISSUES[0]]}
                            />
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    WAVE가 Radix UI의 숨은 폼 전송용 select를 라벨 없는 입력으로 감지한
                                                    사례입니다.{' '}
                                                    <strong>
                                                        사용자가 조작하는 Select에는 접근 가능한 이름이 정상적으로
                                                        제공됩니다.
                                                    </strong>
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '오류의 뜻',
                                        body: <p>조회 필터의 숨은 select에서 라벨을 찾지 못했다는 의미입니다.</p>,
                                    },
                                    {
                                        term: '발생 과정',
                                        body: (
                                            <p>
                                                Radix UI가 화면에{' '}
                                                <code className="font-mono">button[role=combobox]</code>를 표시하고,
                                                선택값을 폼에 전달하기 위해 각 항목에 숨은 select를 추가합니다. WAVE는
                                                이 숨은 select도 폼 컨트롤로 검사합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '책임 구분',
                                        body: (
                                            <p>
                                                프로젝트는 사용자가 조작하는 Select에{' '}
                                                <code className="font-mono">label</code> 또는{' '}
                                                <code className="font-mono">aria-label</code>을 제공합니다. 라벨 없는
                                                숨은 select는 Radix UI가 내부에서 생성하므로 외부 라이브러리 원인으로
                                                분류합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '영향과 조치',
                                        body: (
                                            <p>
                                                숨은 select는 <code className="font-mono">aria-hidden</code>과{' '}
                                                <code className="font-mono">tabindex=&quot;-1&quot;</code>로 사용자
                                                탐색에서 제외됩니다.{' '}
                                                <strong>실제 Select의 읽기와 키보드 조작에는 결함이 없습니다.</strong>{' '}
                                                라이브러리 원본 수정은 업데이트와 폼 동작에 영향을 줄 수 있어 적용하지
                                                않고 예외 검토 항목으로 관리합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '발생 화면',
                                        body: <OccurrenceScreensAccordion routes={WAVE_SELECT_ERROR_SCREEN_ROUTES} />,
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <div className="flex flex-col items-start gap-1">
                                                <ReferenceLink href="https://unpkg.com/@radix-ui/react-select@2.3.3/dist/index.mjs">
                                                    Radix Select 2.3.3 배포 코드
                                                </ReferenceLink>
                                                <ReferenceLink href="https://wave.webaim.org/api/docs?format=html#label_missing">
                                                    WAVE Missing form label 설명
                                                </ReferenceLink>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </section>

                        <section
                            aria-labelledby="wave-select-warning"
                            className="flex flex-col gap-3 py-10 first:pt-0 last:pb-0"
                        >
                            <SectionHeader>
                                <SectionHeaderTitle className="typo-title-l-bold scroll-mt-24" id="wave-select-warning">
                                    {sectionHeading('Radix Select', 'Select missing label')}
                                </SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    숨은 native select의 접근 가능한 이름을 확인하라는 경고입니다
                                </SectionHeaderDescription>
                            </SectionHeader>
                            <IssueTable
                                caption="WAVE 가 보고한 Select missing label 경고와 건수"
                                issues={[WAVE_SELECT_ISSUES[1]]}
                            />
                            <LibraryDetailAccordion
                                rows={[
                                    {
                                        term: '한눈에 보기',
                                        body: (
                                            <Alert variant="outline" color="info">
                                                <Info aria-hidden="true" />
                                                <AlertDescription>
                                                    WAVE가 Radix Select의 숨은 native select에서 접근 가능한 이름을 찾지
                                                    못해 표시한 경고입니다.{' '}
                                                    <strong>
                                                        사용자가 조작하는 Select 버튼에는 접근 가능한 이름이 제공됩니다.
                                                    </strong>
                                                </AlertDescription>
                                            </Alert>
                                        ),
                                    },
                                    {
                                        term: '경고의 뜻',
                                        body: (
                                            <p>
                                                값 전달용으로 생성된 숨은 native select에 연결된 label이 없다는
                                                의미입니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '책임 구분과 조치',
                                        body: (
                                            <p>
                                                숨은 select는 Radix UI가 내부에서 생성하며{' '}
                                                <code className="font-mono">aria-hidden</code>과{' '}
                                                <code className="font-mono">tabindex=&quot;-1&quot;</code>로 사용자
                                                탐색에서 제외됩니다. 실제 Select의 이름과 키보드 조작을 확인한 뒤 외부
                                                라이브러리 예외 검토 항목으로 관리합니다.
                                            </p>
                                        ),
                                    },
                                    {
                                        term: '발생 화면',
                                        body: <OccurrenceScreensAccordion routes={WAVE_SELECT_WARNING_SCREEN_ROUTES} />,
                                    },
                                    {
                                        term: '근거',
                                        body: (
                                            <div className="flex flex-col items-start gap-1">
                                                <ReferenceLink href="https://unpkg.com/@radix-ui/react-select@2.3.3/dist/index.mjs">
                                                    Radix Select 2.3.3 배포 코드
                                                </ReferenceLink>
                                                <ReferenceLink href="https://wave.webaim.org/api/docs?format=html#select_missing_label">
                                                    WAVE Select missing label 설명
                                                </ReferenceLink>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </section>
                    </div>
                </BaseCard>

                <BaseCard
                    title={cardHeading('화면별 검사 기록')}
                    subtitle="현재 수동으로 기록된 WAVE 화면별 검사 결과입니다."
                >
                    <Accordion type="multiple">
                        <AccordionItem value="screens">
                            <AccordionTrigger>
                                서비스 화면 {WAVE_TOTALS.screens}개 — 오류 {WAVE_TOTALS.errors}건 · 경고{' '}
                                {WAVE_TOTALS.warnings}건
                            </AccordionTrigger>
                            <AccordionContent>
                                <Tabs defaultValue="wave-records-corp">
                                    <TabsList variant="pill" aria-label="WAVE 화면별 검사 대상 구분">
                                        {WAVE_SUMMARY_GROUPS.map((group) => (
                                            <TabsTrigger key={group.key} value={`wave-records-${group.key}`}>
                                                {group.label} {group.totals.screens}개
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {WAVE_SUMMARY_GROUPS.map((group) => (
                                        <TabsContent key={group.key} value={`wave-records-${group.key}`}>
                                            <Table className="min-w-240 table-fixed">
                                                <colgroup>
                                                    <col className="w-14" />
                                                    <col className="w-1/5" />
                                                    <col className="w-1/4" />
                                                    <col className="w-16" />
                                                    <col className="w-16" />
                                                    <col />
                                                </colgroup>
                                                <TableCaption className="sr-only">
                                                    WAVE {group.label} 화면별 접근성 검사 오류·경고 건수와 종류
                                                </TableCaption>
                                                <TableHeader>
                                                    <TableRow className="bg-muted hover:bg-muted">
                                                        <TableHead scope="col" className="text-center">
                                                            번호
                                                        </TableHead>
                                                        <TableHead scope="col">화면명</TableHead>
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
                                                    {group.screens.map((screen, index) => (
                                                        <TableRow key={screen.path}>
                                                            <TableCell className="text-foreground-subtle text-center align-top tabular-nums">
                                                                {index + 1}
                                                            </TableCell>
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
                                                                <ul className="flex flex-col items-start gap-1">
                                                                    {screen.kinds.map((kind) => (
                                                                        <li
                                                                            key={`${kind.level}-${kind.target}-${kind.label}`}
                                                                        >
                                                                            <Badge
                                                                                size="xs"
                                                                                color={
                                                                                    kind.level === 'error'
                                                                                        ? 'error'
                                                                                        : 'warning'
                                                                                }
                                                                                asChild
                                                                            >
                                                                                <Link
                                                                                    href={`#${kind.target}`}
                                                                                    aria-label={`${kind.label} 외부 라이브러리 원인 확인`}
                                                                                >
                                                                                    {kind.label}
                                                                                </Link>
                                                                            </Badge>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                                <Accordion type="single" collapsible className="mt-2">
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
                                                                                {screen.messages.map((message) => (
                                                                                    <li
                                                                                        key={`${message.level}-${message.control}-${message.message}`}
                                                                                        className="flex flex-col items-start gap-1"
                                                                                    >
                                                                                        <IssueBadge
                                                                                            level={message.level}
                                                                                        />
                                                                                        <p className="font-bold break-words">
                                                                                            <span lang="en">
                                                                                                {message.message}
                                                                                            </span>{' '}
                                                                                            · {message.control}{' '}
                                                                                            {message.count}건
                                                                                        </p>
                                                                                        <dl className="text-foreground-subtle grid gap-x-2 gap-y-0.5 sm:grid-cols-[4rem_1fr]">
                                                                                            <dt className="font-bold">
                                                                                                발생 요소
                                                                                            </dt>
                                                                                            <dd>{message.owner}</dd>
                                                                                            <dt className="font-bold">
                                                                                                상세
                                                                                            </dt>
                                                                                            <dd>{message.verdict}</dd>
                                                                                        </dl>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                </Accordion>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </BaseCard>
            </TabsContent>
        </Tabs>
    </GuidePageShell>
)

export default AccessibilityExceptionsPage
