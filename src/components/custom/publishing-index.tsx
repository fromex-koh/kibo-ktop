'use client'

import Link from 'next/link'
import {
    Check,
    ChevronUp,
    CircleCheckBig,
    ExternalLink,
    File,
    Folder,
    GitBranch,
    Info,
    LayoutGrid,
    Sparkles,
} from 'lucide-react'
import {toast} from 'sonner'
import {useEffect, useMemo, useRef, useState} from 'react'
import {
    USER_TYPE_VALUES,
    isExternalUserType,
    isStructureBranch,
    PUBLISHING_INDEX_CONTENT,
    SCREEN_REGISTRY,
    STATUS_VALUES,
    type UserType,
    type ExternalProject,
    type Status,
    type ReleaseNoteChange,
    type ReleaseNoteHandoff,
    type StructureGroup,
    type StructureNode,
} from '@/content/publishing-guide'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {BaseCard} from '@/components/composite/base-card'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {ListMarker} from '@/components/custom/list-marker'

// isCurrent(이번 릴리스에서 변경됨) 하이라이트는 자산 표·공통 레이아웃 표·화면 표가 모두 같은
// 방식(배경색 + 아이콘 + sr-only 텍스트)을 쓰므로, 버전 셀 하나를 공용 컴포넌트로 뺀다.
const VersionCell = ({version, isCurrent}: {version: string; isCurrent: boolean}) => (
    <>
        <span className="inline-flex items-center gap-1">
            {isCurrent && <Sparkles aria-hidden="true" className="size-3 shrink-0" />}
            {version}
        </span>
        {isCurrent && <span className="sr-only"> (이번 릴리스에서 변경됨)</span>}
    </>
)

// 릴리스 초안에서 명시한 컴포넌트 가이드 내부 링크만 새 창 링크로 변환한다.
// 그 외 Markdown 문법이나 외부 주소는 일반 문자열로 남겨 임의 링크가 화면에 생성되지 않게 한다.
const RELEASE_NOTE_LINK_PATTERN = /\[([^\]]+)\]\((\/component-guide\/[^)\s]+)\)/g

const ReleaseNoteChange = ({change}: {change: string}) => {
    const parts: React.ReactNode[] = []
    let cursor = 0

    for (const match of change.matchAll(RELEASE_NOTE_LINK_PATTERN)) {
        const [source, label, href] = match
        const index = match.index

        if (index > cursor) parts.push(change.slice(cursor, index))
        parts.push(
            <a
                key={`${href}-${index}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground focus-visible:ring-ring inline-flex items-center gap-0.5 underline underline-offset-4 focus-visible:rounded-xs focus-visible:ring-2 focus-visible:outline-none"
            >
                {label}
                <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="sr-only"> (새 창)</span>
            </a>,
        )
        cursor = index + source.length
    }

    if (cursor < change.length) parts.push(change.slice(cursor))
    return <span className="min-w-0">{parts.length > 0 ? parts : change}</span>
}

const RELEASE_NOTE_COMMIT_MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\((https:\/\/github\.com\/[^)\s]+)\)/g

const getReleaseNoteCommitLinks = (label: string, value: string): {href: string; text: string}[] => {
    if (!['커밋', 'GitHub Diff', 'Diff 링크'].includes(label)) return []

    const markdownLinks = Array.from(value.matchAll(RELEASE_NOTE_COMMIT_MARKDOWN_LINK_PATTERN), (match) => ({
        href: match[2],
        text: match[1],
    }))
    if (markdownLinks.length > 0) return markdownLinks
    if (value.startsWith('https://github.com/')) return [{href: value, text: '변경사항 보기'}]

    return []
}

const ReleaseNoteDetailValue = ({label, value}: {label: string; value: string}) => {
    if (label === '대상' && value.includes('\n')) {
        return (
            <div className="flex min-w-0 flex-col gap-1">
                {value.split('\n').map((target) => (
                    <span key={target} className="block min-w-0 break-all">
                        {target}
                    </span>
                ))}
            </div>
        )
    }

    const commitLinks = getReleaseNoteCommitLinks(label, value)

    if (commitLinks.length > 0) {
        return (
            <span className="inline-flex max-w-full flex-wrap items-center">
                {commitLinks.map((commitLink, index) => (
                    <span key={`${commitLink.href}-${index}`} className="inline-flex min-w-0 items-center">
                        <a
                            href={commitLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground focus-visible:ring-ring inline-flex max-w-full items-center gap-1 underline underline-offset-4 focus-visible:rounded-xs focus-visible:ring-2 focus-visible:outline-none"
                        >
                            <span className="truncate">{commitLink.text}</span>
                            <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
                            <span className="sr-only"> (새 창)</span>
                        </a>
                        {index < commitLinks.length - 1 && <span className="mx-2">·</span>}
                    </span>
                ))}
            </span>
        )
    }

    return <ReleaseNoteChange change={value} />
}

const ReleaseNoteHandoff = ({change}: {change: ReleaseNoteHandoff}) => {
    const handoffPresentation = {
        diff: {label: 'Diff 확인', color: 'info'},
        new: {label: '신규 추가', color: 'success'},
        overwrite: {label: '덮어쓰기', color: 'secondary-purple'},
    } as const
    const {label, color} = handoffPresentation[change.mode]

    return (
        <div className="border-border bg-background/60 flex min-w-0 flex-col gap-2 rounded-sm border p-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Badge variant="solid-pastel" color={color} shape="round" size="sm">
                    {label}
                </Badge>
                <strong className="typo-body-l-medium text-foreground min-w-0">{change.title}</strong>
            </div>
            <dl className="text-muted-foreground grid min-w-0 gap-1.5">
                {change.details.map((detail) => (
                    <div
                        key={`${detail.label}-${detail.value}`}
                        className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-2"
                    >
                        <dt className="text-foreground-subtle shrink-0">{detail.label}</dt>
                        <dd className="min-w-0 break-words">
                            <ReleaseNoteDetailValue label={detail.label} value={detail.value} />
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

const isReleaseNoteHandoff = (change: ReleaseNoteChange): change is ReleaseNoteHandoff => typeof change !== 'string'

const createOverwriteChange = (title: string, targets: string[]): ReleaseNoteHandoff => ({
    type: 'handoff',
    mode: 'overwrite',
    title,
    details: [
        {label: '대상', value: targets.join('\n')},
        {label: '적용', value: '지정된 경로를 현재 작업본으로 교체'},
    ],
})

// 이전 릴리즈의 "덮어쓰기: 경로" 문장도 변경 이유별 전달 카드로 표시한다.
const normalizeReleaseNoteChange = (change: ReleaseNoteChange): ReleaseNoteChange[] => {
    if (typeof change !== 'string' || !change.startsWith('덮어쓰기:')) return [change]

    const targets = change
        .slice('덮어쓰기:'.length)
        .split(',')
        .map((target) => target.trim().replace(/^`|`$/g, ''))
        .filter(Boolean)

    if (targets.length === 0) return [change]

    if (targets.some((target) => target.endsWith('/inquiry-complete'))) {
        return [createOverwriteChange('문의 완료 화면 반응형 개선', targets)]
    }

    if (targets.includes('src/app/component-guide') && targets.includes('src/constants/header-navigation.ts')) {
        return [
            createOverwriteChange('개인정보 처리방침 디자인 누락 반영에 따른 컴포넌트 가이드 문서 업데이트', [
                'src/app/component-guide',
            ]),
            createOverwriteChange('Header 탄소중립 외부 링크 연결', ['src/constants/header-navigation.ts']),
        ]
    }

    if (targets.includes('src/components/custom/faq-list.tsx')) {
        return [createOverwriteChange('FAQ 빈 상태(EmptyState) 처리 및 디자인 누락 반영', ['src/components'])]
    }

    return [createOverwriteChange('변경사항 반영 대상', targets)]
}

// 릴리즈 초안의 섹션 작성 순서와 관계없이 인계 카드는 개발자가 적용 방식을 빠르게 훑을 수 있도록
// Diff 확인 → 덮어쓰기 → 신규 추가 순으로 고정한다. 같은 분류 안에서는 초안 작성 순서를 유지한다.
const RELEASE_NOTE_HANDOFF_ORDER = {diff: 0, overwrite: 1, new: 2} as const
const sortReleaseNoteChanges = (changes: ReleaseNoteChange[]) =>
    changes
        .map((change, index) => ({change, index}))
        .sort((left, right) => {
            const leftOrder = isReleaseNoteHandoff(left.change) ? RELEASE_NOTE_HANDOFF_ORDER[left.change.mode] : -1
            const rightOrder = isReleaseNoteHandoff(right.change) ? RELEASE_NOTE_HANDOFF_ORDER[right.change.mode] : -1

            return leftOrder - rightOrder || left.index - right.index
        })
        .map(({change}) => change)

// 퍼블리싱 진행 상태 인덱스 데모. 데이터는 src/content/publishing-guide/publishing-index.json 단일 소스에서 온다.
// 이 컴포넌트는 '표현'(상태 색·아이콘 매핑, 뎁스별 rowSpan 계산, 레이아웃, 사용자 유형 필터)만 담당한다.

// 현재 릴리스 버전 — next.config.ts가 주입(src/app/page.tsx의 BUILD_VERSION과 같은 소스).
// 화면(leaf)의 수동 기입 버전이 이 값과 같으면 "이번 릴리스에서 반영됨"으로 하이라이트한다.
const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? 'dev'

// 상태별 Badge 색·변형 — 색만으로 구분하지 않도록 상태명을 항상 함께 표기한다. [KWCAG 5.3.1]
// success/warning 은 kit Badge 가 제공하는 색으로 매핑(진행=info·보완=warning·완료=success).
// 완료·최종완료는 같은 success 라, 최종완료만 solid 변형을 써서 완료(solid-pastel)와 시각적으로 겹치지 않게 한다.
const STATUS_BADGE: Record<Status, {color: 'neutral' | 'info' | 'warning' | 'success' | 'error'; variant?: 'solid'}> = {
    대기중: {color: 'neutral'},
    진행중: {color: 'info'},
    수정요청: {color: 'error'},
    보완: {color: 'warning'},
    완료: {color: 'success'},
    최종완료: {color: 'success', variant: 'solid'},
}

const StatusTag = ({status}: {status: Status}) => (
    <Badge color={STATUS_BADGE[status].color} variant={STATUS_BADGE[status].variant} shape="round">
        {status === '최종완료' && <CircleCheckBig aria-hidden="true" />}
        {status === '완료' && <Check aria-hidden="true" />}
        {status}
    </Badge>
)

// 실제 화면의 마지막 뎁스 배지는 페이지 구현 여부와 관계없이 publishing-index에서 검색할 고유 키를 복사한다.
// 이 저장소에 화면이 없는 외부 IA(탄소)도 인덱스에는 key 가 있으므로 똑같이 복사할 수 있다.
// 상위 메뉴 뎁스는 여러 화면을 대표할 수 있으므로 복사 버튼으로 만들지 않는다.
const KeyCopyDepthBadge = ({depth, screenKey}: {depth: number; screenKey: string}) => {
    const copyKey = async () => {
        try {
            await navigator.clipboard.writeText(screenKey)
            toast('키값이 복사되었습니다.', {position: 'top-center'})
        } catch {
            // 클립보드 권한이 없으면 상태를 바꾸지 않는다.
        }
    }

    const label = `${screenKey} 키값 복사`

    return (
        <Badge
            asChild
            type="number"
            color="primary"
            className="hover:ring-primary/40 cursor-pointer transition-shadow focus-within:ring-2 hover:ring-2"
        >
            <button type="button" onClick={copyKey} title={label} aria-label={label}>
                {depth}
            </button>
        </Badge>
    )
}

// 사이트 구조는 뎁스 제한 없는 트리라, 표에 그리려면 각 leaf(실제 화면)를 "뿌리부터 자신까지의
// 라벨 경로"로 펼쳐야 한다. 이 펼친 목록 + 뎁스별 rowSpan 계산이 표 렌더링의 핵심이다.
type FlatLeaf = {
    rowKey: string
    registryKey?: string
    path: string[] // index 0 = 1뎁스(그룹명) ... 마지막 = leaf 자신의 라벨
    subtotalDepths: number[] // 소계/구분 브랜치의 뎁스 인덱스 — 표에서 뎁스 배지를 숨긴다.
    // 뎁스가 아니라 묶기만 한 행의 뎁스 인덱스 — 배지를 숨기고, 아래 화면의 뎁스 번호에서도 빼 준다.
    groupOnlyDepths: number[]
    screenId: string | null
    status: Status
    application2Status: Status
    version: string
    isRed?: boolean
    userType?: UserType // 상위에서 상속된 최종 사용자 유형. 없으면 어느 필터에도 걸리지 않는다.
    // 외부 프로젝트 화면의 주소(탄소) — 있으면 화면명을 새 창 링크로 연다.
    externalHref?: string
}

const collectLeaves = (group: StructureGroup): FlatLeaf[] => {
    // inherited = 상위(그룹·브랜치)에서 내려온 userType. 노드에 자체 userType 가 있으면 그것이 우선한다.
    const walk = (
        node: StructureNode,
        path: string[],
        inherited?: UserType,
        subtotalDepths: number[] = [],
        groupOnlyDepths: number[] = [],
    ): FlatLeaf[] => {
        // 라벨이 바로 위 뎁스와 같으면(예: '홈' 그룹의 유일한 화면도 라벨이 '홈') 실질적으로
        // 추가 뎁스가 아니므로 경로에 다시 넣지 않는다 — 컬럼마다 같은 텍스트가 반복되지 않는다.
        const last = path[path.length - 1]
        const nextPath = node.label === last ? path : [...path, node.label]
        if (isStructureBranch(node)) {
            const branchUserType = node.userType ?? inherited
            const nextSubtotalDepths = node.isSubtotal ? [...subtotalDepths, nextPath.length - 1] : subtotalDepths
            const nextGroupOnlyDepths = node.isGroupOnly ? [...groupOnlyDepths, nextPath.length - 1] : groupOnlyDepths
            // branch 자신도 독립된 화면(screen)일 수 있다 — 예: '(1) 고객정보활용동의' 자체가
            // 화면이면서 하위에 상세보기·전자서명을 더 갖는 경우. 있으면 그 행을 먼저 넣는다.
            // screen.label 이 있으면(예: '목록') 자기 화면을 한 뎁스 더 내려간 항목으로 취급해,
            // 하위 뎁스 빈 칸('-')이 그 라벨 한 칸으로 병합돼 보이게 한다.
            const screenPath = node.screen?.label ? [...nextPath, node.screen.label] : nextPath
            const ownScreen: FlatLeaf[] = node.screen
                ? [
                      {
                          // 같은 상위 뎁스에 동일한 화면명이 반복될 수 있으므로 화면 경로보다 영구 key를 우선한다.
                          rowKey: node.screen.key ?? screenPath.join(' > '),
                          ...(node.screen.key !== undefined ? {registryKey: node.screen.key} : {}),
                          path: screenPath,
                          subtotalDepths: nextSubtotalDepths,
                          groupOnlyDepths: nextGroupOnlyDepths,
                          screenId: node.screen.screenId,
                          status: node.screen.status,
                          application2Status: node.screen.application2Status ?? '대기중',
                          version: node.screen.version,
                          ...(node.screen.isRed ? {isRed: true} : {}),
                          userType: node.screen.userType ?? branchUserType,
                          ...(node.screen.externalHref !== undefined ? {externalHref: node.screen.externalHref} : {}),
                      },
                  ]
                : []
            return [
                ...ownScreen,
                ...node.children.flatMap((child) =>
                    walk(child, nextPath, branchUserType, nextSubtotalDepths, nextGroupOnlyDepths),
                ),
            ]
        }
        return [
            {
                // IA 화면명은 중복될 수 있지만 레지스트리 key는 고유하므로 React 행 identity로 사용할 수 있다.
                rowKey: node.key ?? nextPath.join(' > '),
                ...(node.key !== undefined ? {registryKey: node.key} : {}),
                path: nextPath,
                subtotalDepths,
                groupOnlyDepths,
                screenId: node.screenId,
                status: node.status,
                application2Status: node.application2Status ?? '대기중',
                version: node.version,
                ...(node.isRed ? {isRed: true} : {}),
                userType: node.userType ?? inherited,
                ...(node.externalHref !== undefined ? {externalHref: node.externalHref} : {}),
            },
        ]
    }
    return group.children.flatMap((child) => walk(child, [group.name], group.userType))
}

// depth 컬럼에서 두 leaf 를 "같은 상위 아래" 로 볼지 판단하는 키. depth 가 leaf 의 실제 경로보다
// 깊으면(그 leaf 는 거기까지 내려가지 않으면) null — rowSpan 병합 대상이 아니다.
const pathKeyAt = (leaf: FlatLeaf, depth: number): string | null =>
    depth < leaf.path.length ? leaf.path.slice(0, depth + 1).join(' ') : null

const spanAt = (leaves: FlatLeaf[], index: number, depth: number): number => {
    const key = pathKeyAt(leaves[index], depth)
    const rest = leaves.slice(index + 1)
    const breakOffset = rest.findIndex((leaf) => pathKeyAt(leaf, depth) !== key)
    return breakOffset === -1 ? rest.length + 1 : breakOffset + 1
}

type DepthCell =
    | {kind: 'span'; label: string; rowSpan: number; colSpan: number}
    | {kind: 'continued'} // 이전 행의 rowSpan 이 덮고 있거나, 같은 행의 colSpan 에 흡수됨 — 렌더하지 않음
    | {kind: 'empty'; colSpan: number} // 이 화면에서 사용하지 않는 나머지 뎁스를 한 칸으로 병합.

// 같은 접두사의 화면이 모두 끝나는 뎁스는 마지막 라벨을 남은 칸까지 병합한다. 메뉴 자체도 화면이면서
// 하위 화면이 더 있는 경우에는 라벨 셀의 rowSpan을 유지하고, 자기 화면 행에서만 남은 빈 뎁스를 하나의
// "해당 없음" 셀로 병합한다. 따라서 하위 행의 실제 뎁스는 보존하면서 '-'가 여러 번 반복되지 않는다.
const buildDepthCells = (leaves: FlatLeaf[], maxDepth: number): DepthCell[][] =>
    leaves.map((leaf, i) => {
        const cells: DepthCell[] = Array.from({length: maxDepth}, () => ({kind: 'continued'}))
        let depth = 0
        while (depth < maxDepth) {
            if (depth >= leaf.path.length) {
                const colSpan = maxDepth - depth
                cells[depth] = {kind: 'empty', colSpan}
                depth += colSpan
                continue
            }
            const key = pathKeyAt(leaf, depth)
            const prevKey = i > 0 ? pathKeyAt(leaves[i - 1], depth) : null
            if (key === prevKey) {
                depth += 1 // 위 rowSpan 이 덮음 — 'continued' 유지
                continue
            }
            const span = spanAt(leaves, i, depth)
            const noneDeeper = leaves.slice(i, i + span).every((l) => l.path.length <= depth + 1)
            const colSpan = noneDeeper ? maxDepth - depth : 1
            cells[depth] = {kind: 'span', label: leaf.path[depth], rowSpan: span, colSpan}
            depth += colSpan // colSpan 만큼 건너뛴다 — 그 칸들은 이미 이 셀에 흡수됐다(재처리 방지)
        }
        return cells
    })

// IA 원문이 기업용·기관용으로 각각 관리되므로 사용자 유형별 인덱스도 서로 섞지 않는다.
// 같은 메뉴명이라도 역할과 동작이 다를 수 있어 공통 화면으로 합치지 않는다.
type UserTypeFilter = UserType
const USER_TYPE_FILTERS: readonly UserTypeFilter[] = USER_TYPE_VALUES
// 상태·릴리스 배지에서 이미 사용하는 색상과 겹치지 않는 분류용 보조색을 IA 유형에 사용한다.
const IA_BADGE_COLOR: Record<UserTypeFilter, 'secondary-orange' | 'secondary-green' | 'secondary-purple'> = {
    기업: 'secondary-orange',
    기관: 'secondary-green',
    탄소: 'secondary-purple',
}
// SegmentedControl radio 타입이 넘겨주는 문자열 value를 UserTypeFilter로 좁히는 타입가드([ST-002] as 회피).
const isUserTypeFilter = (value: string): value is UserTypeFilter => USER_TYPE_FILTERS.some((f) => f === value)

type UserTypeControlProps = {
    filter: UserTypeFilter
    label: string
    onFilterChange: (filter: UserTypeFilter) => void
}

// 시작페이지 상단 필터와 스크롤 추적 퀵메뉴가 같은 선택 상태를 공유한다.
const UserTypeControl = ({filter, label, onFilterChange}: UserTypeControlProps) => (
    <SegmentedControl
        type="radio"
        value={filter}
        onValueChange={(value) => {
            if (isUserTypeFilter(value)) onFilterChange(value)
        }}
        aria-label={label}
        className="w-fit"
    >
        {USER_TYPE_FILTERS.map((userType) => (
            <SegmentedControlItem
                key={userType}
                value={userType}
                className="has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground px-4"
            >
                {userType}
            </SegmentedControlItem>
        ))}
    </SegmentedControl>
)

const matchesUserType = (leaf: FlatLeaf, filter: UserTypeFilter): boolean => leaf.userType === filter

const {releaseNotes, assetVersions, commonLayouts, iaVersions, externalProjects, structureGroups} =
    PUBLISHING_INDEX_CONTENT

// 전체 화면(트리를 펼친 leaf) — 필터·카운트는 이 목록을 기준으로 컴포넌트 안에서 파생한다.
const ALL_LEAVES = structureGroups.flatMap(collectLeaves)
// 외부 저장소에서 만드는 IA(탄소)를 고르면, 그 프로젝트의 저장소를 진척률 아래에 배지로 나열한다 —
// 진행 상태 범례와 같은 배지 줄이라 화면에서 한 덩어리로 읽힌다.
const RepositoryBadge = ({href, label, branch}: {href: string; label: string; branch: string}) => (
    <Badge asChild variant="outline" color="info" shape="round" className="hover:ring-ring/40 hover:ring-2">
        <a href={href} target="_blank" rel="noopener noreferrer">
            <GitBranch aria-hidden="true" />
            {label}
            <span className="text-muted-foreground">({branch} 브랜치)</span>
            <ExternalLink aria-hidden="true" />
            <span className="sr-only"> (새 창에서 열림)</span>
        </a>
    </Badge>
)

const ExternalProjectInfo = ({project}: {project: ExternalProject}) => {
    // 스킴은 빼고 주소만 보여 준다(홈 화면 '프로젝트 정보'와 같은 표기).
    const repositoryLabel = project.repositoryUrl.replace(/^https?:\/\//, '')

    return (
        <div className="flex flex-col gap-2">
            <span className="typo-caption-medium text-muted-foreground flex items-center gap-1.5">
                <Info aria-hidden="true" className="text-primary size-4 shrink-0" />
                프로젝트 정보 · {project.name} — 화면은 이 저장소가 아니라 아래 저장소에서 만듭니다.
            </span>
            <ul aria-label={`${project.name} 저장소`} className="flex flex-wrap items-center gap-2">
                <li>
                    <RepositoryBadge href={project.repositoryUrl} label={repositoryLabel} branch="main" />
                </li>
                <li>
                    <RepositoryBadge href={project.handoffUrl} label={repositoryLabel} branch="frontend-handoff" />
                </li>
            </ul>
        </div>
    )
}

const SCREEN_REGISTRY_BY_KEY = new Map(SCREEN_REGISTRY.map((screen) => [screen.key, screen]))

const PublishingIndex = () => {
    const [filter, setFilter] = useState<UserTypeFilter>('기업')
    const [isQuickMenuVisible, setIsQuickMenuVisible] = useState(false)
    const userTypeControlRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const userTypeControl = userTypeControlRef.current
        if (!userTypeControl) return

        const observer = new IntersectionObserver(([entry]) => {
            setIsQuickMenuVisible(!entry.isIntersecting)
        })

        observer.observe(userTypeControl)
        return () => observer.disconnect()
    }, [])

    // 선택된 사용자 유형에 맞는 화면만 남기고, 그 부분집합으로 뎁스 컬럼·rowSpan·카운트를 다시 계산한다.
    const leaves = useMemo(() => ALL_LEAVES.filter((leaf) => matchesUserType(leaf, filter)), [filter])
    const maxDepth = useMemo(() => leaves.reduce((max, leaf) => Math.max(max, leaf.path.length), 0), [leaves])
    const depthCells = useMemo(() => buildDepthCells(leaves, maxDepth), [leaves, maxDepth])
    const depthHeaders = useMemo(() => Array.from({length: maxDepth}, (_, depth) => `${depth + 1}뎁스`), [maxDepth])

    const screenCount = leaves.length
    // UIUX·응용2 진척률 — 각 상태에서 '완료' 또는 '최종완료'된 화면 수 / 전체 화면 수.
    const uiuxDoneCount = useMemo(
        () => leaves.filter((leaf) => leaf.status === '완료' || leaf.status === '최종완료').length,
        [leaves],
    )
    const application2DoneCount = useMemo(
        () =>
            leaves.filter((leaf) => leaf.application2Status === '완료' || leaf.application2Status === '최종완료')
                .length,
        [leaves],
    )
    const uiuxProgressPercent = screenCount === 0 ? 0 : Math.round((uiuxDoneCount / screenCount) * 100)
    const application2ProgressPercent = screenCount === 0 ? 0 : Math.round((application2DoneCount / screenCount) * 100)
    // 응용2는 이 저장소가 넘긴 화면의 후속 작업 상태다 — 화면을 넘기지 않는 외부 IA(탄소)에는
    // 해당하는 진행이 없으므로 진척률 카드와 표의 열을 함께 감춘다(빈 값을 대기중으로 보여 주지 않는다).
    const showsApplication2 = !isExternalUserType(filter)
    const externalProject = externalProjects.find((project) => project.userType === filter)

    const scrollToTop = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }

    return (
        <section aria-label="퍼블리싱 현황" className="flex flex-col gap-4">
            {/* 시작페이지 전용 퀵메뉴. 긴 IA 표를 내려보는 중에도 기업·기관 화면을 즉시 전환한다. */}
            <aside
                aria-label="사용자 유형 빠른 전환"
                aria-hidden={!isQuickMenuVisible}
                inert={!isQuickMenuVisible}
                className={`border-border bg-background/95 fixed right-4 bottom-4 z-40 flex max-w-[calc(100vw-(var(--spacing)*8))] flex-col gap-2 rounded-lg border p-3 shadow-lg backdrop-blur-sm transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none md:right-6 md:bottom-6 ${
                    isQuickMenuVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
                }`}
            >
                <span className="typo-caption-medium text-muted-foreground px-1">화면 유형 빠른 전환</span>
                <Badge
                    color={IA_BADGE_COLOR[filter]}
                    shape="round"
                    size="sm"
                    className="w-fit"
                    aria-label={`${filter} IA 버전 ${iaVersions[filter]}`}
                >
                    {filter} IA {iaVersions[filter]}
                </Badge>
                <UserTypeControl filter={filter} label="사용자 유형 빠른 전환" onFilterChange={setFilter} />
                <Button type="button" variant="secondary" size="sm" className="w-full" onClick={scrollToTop}>
                    맨 위로
                    <ChevronUp aria-hidden="true" />
                </Button>
            </aside>
            <BaseCard>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <SectionHeader>
                            <SectionHeaderTitle id="release-notes-title">버전 업데이트</SectionHeaderTitle>
                            <SectionHeaderDescription asChild>
                                <ul className="list-disc pl-5">
                                    <li>버전별 주요 개선 사항과 변경 내용을 최신순으로 안내합니다.</li>
                                </ul>
                            </SectionHeaderDescription>
                        </SectionHeader>

                        <div className="bg-background border-border overflow-hidden rounded-md border">
                            <div
                                role="region"
                                aria-labelledby="release-notes-title"
                                className="max-h-100 overflow-auto overscroll-contain [contain:layout_paint]"
                            >
                                <table className="w-full min-w-2xl table-fixed text-left">
                                    <caption className="sr-only">버전별 릴리스 날짜와 주요 변경사항</caption>
                                    <thead className="bg-muted sticky top-0 z-10">
                                        <tr className="border-border border-b">
                                            <th scope="col" className="typo-body-l-medium w-28 px-4 py-3">
                                                버전
                                            </th>
                                            <th scope="col" className="typo-body-l-medium w-32 px-4 py-3">
                                                릴리스
                                            </th>
                                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                                변경사항
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-surface">
                                        {releaseNotes.map((release, index) => (
                                            <tr
                                                key={release.version}
                                                className={`border-border border-b last:border-b-0 ${
                                                    index === 0 ? 'bg-primary-subtle' : ''
                                                }`}
                                            >
                                                <th
                                                    scope="row"
                                                    className={`typo-body-l-medium w-28 px-4 py-3 align-top ${
                                                        index === 0 ? 'text-primary' : 'text-foreground'
                                                    }`}
                                                >
                                                    {release.version}
                                                </th>
                                                <td className="typo-body-l-regular text-muted-foreground w-32 px-4 py-3 align-top">
                                                    <time dateTime={release.releasedAt}>{release.releasedAt}</time>
                                                </td>
                                                <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                                    <ul className="flex list-none flex-col gap-2">
                                                        {sortReleaseNoteChanges(
                                                            release.changes.flatMap(normalizeReleaseNoteChange),
                                                        ).map((displayChange, changeIndex) => {
                                                            const key =
                                                                typeof displayChange === 'string'
                                                                    ? displayChange
                                                                    : `${displayChange.mode}-${displayChange.title}`

                                                            return (
                                                                <li
                                                                    key={`${key}-${changeIndex}`}
                                                                    className={
                                                                        isReleaseNoteHandoff(displayChange)
                                                                            ? ''
                                                                            : 'flex'
                                                                    }
                                                                >
                                                                    {isReleaseNoteHandoff(displayChange) ? (
                                                                        <ReleaseNoteHandoff change={displayChange} />
                                                                    ) : (
                                                                        <>
                                                                            <ListMarker />
                                                                            <ReleaseNoteChange change={displayChange} />
                                                                        </>
                                                                    )}
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <SectionHeader>
                            <SectionHeaderTitle id="frontend-handoff-assets-title">
                                프론트엔드 인계 자산
                            </SectionHeaderTitle>
                            <SectionHeaderDescription asChild>
                                <ul className="flex list-disc flex-col gap-1 pl-5">
                                    <li>
                                        <code className="text-foreground font-mono">main</code>은 퍼블리싱 제작·검수용
                                        브랜치입니다. 프론트엔드 개발은 검증된 결과만 제공하는{' '}
                                        <code className="text-foreground font-mono">frontend-handoff</code> 브랜치를
                                        내려받아 시작합니다.
                                    </li>
                                    <li>
                                        아래 표는 전달 자산의 원본 경로와 마지막 반영 버전이며, 이번 버전에 반영된
                                        항목은 강조해 표시합니다.
                                    </li>
                                </ul>
                            </SectionHeaderDescription>
                        </SectionHeader>

                        {/* 프론트엔드 개발자에게 인계할 자산과 마지막 반영 버전 */}
                        <div className="bg-background border-border overflow-hidden rounded-md border">
                            <div
                                role="region"
                                aria-labelledby="frontend-handoff-assets-title"
                                className="max-h-100 overflow-auto overscroll-contain [contain:layout_paint]"
                            >
                                <table className="w-full min-w-3xl table-fixed text-left">
                                    <caption className="sr-only">프론트엔드 인계 자산별 역할과 반영 버전</caption>
                                    <thead className="bg-muted sticky top-0 z-10">
                                        <tr className="border-border border-b">
                                            <th scope="col" className="typo-body-l-medium w-24 px-4 py-3">
                                                구분
                                            </th>
                                            <th scope="col" className="typo-body-l-medium w-1/3 px-4 py-3">
                                                원본 경로
                                            </th>
                                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                                역할
                                            </th>
                                            <th scope="col" className="typo-body-l-medium w-28 px-4 py-3">
                                                반영 버전
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-surface">
                                        {assetVersions.map((asset) => (
                                            <tr
                                                key={asset.name}
                                                className={`border-border border-b last:border-b-0 ${
                                                    asset.isCurrent ? 'bg-primary-subtle' : ''
                                                }`}
                                            >
                                                <td className="typo-body-l-regular text-muted-foreground w-24 px-4 py-3">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        {asset.kind === 'folder' ? (
                                                            <Folder aria-hidden="true" className="size-3.5 shrink-0" />
                                                        ) : (
                                                            <File aria-hidden="true" className="size-3.5 shrink-0" />
                                                        )}
                                                        {asset.kind === 'folder' ? '폴더' : '파일'}
                                                    </span>
                                                </td>
                                                <th
                                                    scope="row"
                                                    className="typo-body-l-medium text-primary w-1/3 px-4 py-3"
                                                >
                                                    {asset.name}
                                                </th>
                                                <td className="typo-body-l-regular text-foreground-subtle min-w-64 px-4 py-3">
                                                    {asset.description}
                                                </td>
                                                <td
                                                    className={`typo-body-l-regular w-28 px-4 py-3 ${
                                                        asset.isCurrent
                                                            ? 'text-primary font-semibold'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    <VersionCell version={asset.version} isCurrent={asset.isCurrent} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <SectionHeader>
                            <SectionHeaderTitle
                                id="section-publishing-index"
                                className="flex flex-wrap items-center gap-2"
                            >
                                <span>퍼블리싱 인덱스</span>
                                <Badge
                                    color={IA_BADGE_COLOR[filter]}
                                    shape="round"
                                    size="sm"
                                    aria-label={`${filter} IA 버전 ${iaVersions[filter]}`}
                                >
                                    {filter} IA {iaVersions[filter]}
                                </Badge>
                            </SectionHeaderTitle>
                            <SectionHeaderDescription asChild>
                                <ul className="flex list-disc flex-col gap-1 pl-5">
                                    <li>기업·기관·탄소 IA를 역할별로 분리해 화면 상태와 버전을 추적합니다.</li>
                                    <li>
                                        탄소는 별도 프로젝트(탄소중립 플랫폼 FO)의 IA입니다 — 이 저장소에서 화면을
                                        만들지 않고 구조와 화면 주소만 관리합니다.
                                    </li>
                                    <li>
                                        메뉴 자체가 화면인 행의 미사용 하위 뎁스는 병합된 &apos;-&apos;로 표시합니다.
                                    </li>
                                    <li>취소선 항목은 기존에 있었지만 삭제된 내용입니다.</li>
                                </ul>
                            </SectionHeaderDescription>
                        </SectionHeader>
                        {/* 사용자 유형 필터 + 요약 — 아래 사이트 구조 표를 기업/기관 IA 한 벌씩 걸러 보여준다.
          위 공통 레이아웃 표와 구분되도록 간격을 더 둔다. */}
                        {/* 사용자 유형 필터 — 라디오 기반 단일 선택이다. 비어 있는 값은 무시해 항상 하나가 선택된 상태를
                    유지한다. 화살표 키·역할은 Radix 담당. */}
                        <div ref={userTypeControlRef} className="w-fit">
                            <UserTypeControl filter={filter} label="사용자 유형별 화면" onFilterChange={setFilter} />
                        </div>

                        {/* 역할별 전체 화면 수와 UIUX·응용2 진척률을 같은 기준으로 나란히 비교한다. */}
                        <div aria-live="polite" className={`grid gap-3 ${showsApplication2 ? 'sm:grid-cols-2' : ''}`}>
                            {showsApplication2 && (
                                <div className="border-border bg-surface flex flex-col gap-1 rounded-md border p-4">
                                    <span className="typo-caption-medium text-muted-foreground">응용2 진척률</span>
                                    <strong className="typo-h4-bold text-foreground">
                                        {application2ProgressPercent}%
                                    </strong>
                                    <span className="typo-caption-regular text-muted-foreground">
                                        완료 {application2DoneCount}/{screenCount} · {filter} 화면 {screenCount}개
                                    </span>
                                </div>
                            )}
                            <div className="border-border bg-surface flex flex-col gap-1 rounded-md border p-4">
                                <span className="typo-caption-medium text-muted-foreground">UIUX 진척률</span>
                                <strong className="typo-h4-bold text-foreground">{uiuxProgressPercent}%</strong>
                                <span className="typo-caption-regular text-muted-foreground">
                                    완료 {uiuxDoneCount}/{screenCount} · {filter} 화면 {screenCount}개
                                </span>
                            </div>
                        </div>
                        {externalProject && <ExternalProjectInfo project={externalProject} />}
                        {/* 아래 화면 목록에서 사용하는 진행 상태 범례 */}
                        <ul aria-label="화면 진행 상태 범례" className="flex flex-wrap items-center gap-2">
                            {STATUS_VALUES.map((status) => (
                                <li key={status}>
                                    <StatusTag status={status} />
                                </li>
                            ))}
                        </ul>
                        {/* 응용2 상태 갱신 안내와 공통 레이아웃 표는 이 저장소가 만드는 화면에만 해당한다 —
                            외부 IA(탄소)에서는 따라 할 일이 없으므로 함께 감춘다. */}
                        {showsApplication2 && (
                            <>
                                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1.5 pl-5">
                                    <li>
                                        <strong className="text-foreground font-medium">작업 브랜치:</strong> 최신{' '}
                                        <code className="text-foreground font-mono">work</code>에서 별도 브랜치를
                                        생성하고, 완료 후 <code className="text-foreground font-mono">work</code>를
                                        대상으로 PR을 보냅니다.
                                    </li>
                                    <li>
                                        <strong className="text-foreground font-medium">화면 찾기:</strong> 실제
                                        화면명의 뎁스 배지를 눌러 고유 키를 복사한 뒤,{' '}
                                        <code className="text-foreground font-mono">publishing-index.json</code>에서
                                        해당 키를 바로 검색합니다.
                                    </li>
                                    <li>
                                        <strong className="text-foreground font-medium">수정 파일:</strong>{' '}
                                        <code className="text-foreground font-mono">
                                            src/content/publishing-guide/publishing-index.json
                                        </code>
                                    </li>
                                    <li>
                                        <strong className="text-foreground font-medium">수정 방법:</strong> 해당 화면의
                                        기존 UIUX <code className="text-foreground font-mono">status</code> 키는
                                        유지하고, 바로 아래에{' '}
                                        <code className="text-foreground font-mono">application2Status</code> 키를
                                        추가하거나 값을 수정합니다.
                                    </li>
                                    <li>
                                        <strong className="text-foreground font-medium">입력 가능 상태:</strong>{' '}
                                        <code className="text-foreground font-mono">
                                            대기중, 진행중, 수정요청, 보완, 완료, 최종완료
                                        </code>
                                        . 키가 없으면 대기중으로 표시됩니다.
                                    </li>
                                    <li>
                                        <strong className="text-foreground font-medium">최종완료 기준:</strong> 더 이상
                                        수정사항이 발생하지 않을 것으로 확정된 화면에만 표시합니다.
                                    </li>
                                </ul>
                                {/* 여러 화면이 공유하는 레이아웃은 개별 화면과 구분해 별도 표로 표시한다. */}
                                <div className="bg-background border-border overflow-x-auto rounded-md border">
                                    <table className="w-full text-left">
                                        <caption className="sr-only">공통 레이아웃 상태·버전</caption>
                                        <thead>
                                            <tr className="border-border bg-muted/25 border-b">
                                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                                    공통 레이아웃
                                                </th>
                                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                                    UIUX
                                                </th>
                                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                                    버전
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-surface">
                                            {commonLayouts.map((layout) => {
                                                const isCurrent = layout.version === BUILD_VERSION
                                                return (
                                                    <tr
                                                        key={layout.label}
                                                        className={`border-border border-b last:border-b-0 ${
                                                            isCurrent ? 'bg-primary-subtle' : 'bg-surface'
                                                        }`}
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="typo-body-l-regular border-border border-r px-4 py-3 align-top font-normal"
                                                        >
                                                            <span className="inline-flex items-center gap-2">
                                                                <LayoutGrid
                                                                    aria-hidden="true"
                                                                    className="text-muted-foreground size-4 shrink-0"
                                                                />
                                                                {'href' in layout && typeof layout.href === 'string' ? (
                                                                    <Link
                                                                        href={layout.href}
                                                                        className="text-primary focus-visible:ring-ring rounded-xs font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                                                                    >
                                                                        {layout.label}
                                                                    </Link>
                                                                ) : (
                                                                    layout.label
                                                                )}
                                                            </span>
                                                        </th>
                                                        <td className="px-4 py-3">
                                                            <StatusTag status={layout.status} />
                                                        </td>
                                                        <td
                                                            className={`typo-caption-regular px-4 py-3 ${
                                                                isCurrent
                                                                    ? 'text-primary font-semibold'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        >
                                                            <VersionCell
                                                                version={layout.version}
                                                                isCurrent={isCurrent}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        {/* 사이트 구조 정보 (선택된 사용자 유형으로 필터된 표) — 표의 caption 이 표 자체를 설명한다. */}
                        <div className="bg-background border-border overflow-x-auto rounded-md border">
                            <table className="w-full text-left">
                                <caption className="sr-only">사이트 구조별 상태·버전 예시</caption>
                                <thead>
                                    <tr className="border-border bg-muted/25 border-b">
                                        {depthHeaders.map((header) => (
                                            <th key={header} scope="col" className="typo-body-l-medium px-4 py-3">
                                                {header}
                                            </th>
                                        ))}
                                        {showsApplication2 && (
                                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                                응용2
                                            </th>
                                        )}
                                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                                            UIUX
                                        </th>
                                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                                            버전
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface">
                                    {leaves.map((leaf, i) => {
                                        const registeredScreen =
                                            leaf.registryKey !== undefined
                                                ? SCREEN_REGISTRY_BY_KEY.get(leaf.registryKey)
                                                : undefined
                                        const displayedVersion = registeredScreen?.version ?? leaf.version
                                        const isCurrent =
                                            registeredScreen?.isCurrent ?? displayedVersion === BUILD_VERSION
                                        const effectiveStatus =
                                            leaf.status === '대기중' && registeredScreen?.implemented
                                                ? '진행중'
                                                : leaf.status
                                        return (
                                            <tr
                                                key={leaf.rowKey}
                                                className={`border-border border-b last:border-b-0 ${
                                                    isCurrent ? 'bg-primary-subtle' : 'bg-surface'
                                                }`}
                                            >
                                                {depthCells[i].map((cell, depth) => {
                                                    if (cell.kind === 'continued') return null
                                                    if (cell.kind === 'empty') {
                                                        return (
                                                            <th
                                                                key={depth}
                                                                scope="row"
                                                                colSpan={cell.colSpan}
                                                                className="typo-caption-regular text-muted-foreground border-border border-r px-4 py-3 align-top font-normal"
                                                            >
                                                                <span aria-hidden="true">-</span>
                                                                <span className="sr-only">해당 없음</span>
                                                            </th>
                                                        )
                                                    }
                                                    const isScreenLink =
                                                        depth === leaf.path.length - 1 && registeredScreen?.implemented
                                                    // 외부 프로젝트 화면(탄소)은 이 저장소에 경로가 없어 새 창으로 연다.
                                                    const externalHref =
                                                        depth === leaf.path.length - 1 ? leaf.externalHref : undefined
                                                    // 묶기만 한 행은 뎁스로 세지 않는다 — 앞쪽의 묶음 수만큼 번호를 당긴다.
                                                    const depthNumber =
                                                        depth +
                                                        1 -
                                                        leaf.groupOnlyDepths.filter((index) => index < depth).length
                                                    const isRedLabel =
                                                        leaf.isRed === true && depth === leaf.path.length - 1
                                                    // 삭제된 항목은 취소선으로 표시한다(IA 원본의 꺾쇠는 옮기지 않는다).
                                                    // 취소선·색만으로는 무엇을 뜻하는지 읽어 주지 못하므로 말로도 알린다[5.3.1].
                                                    const displayLabel = isRedLabel ? (
                                                        <s>
                                                            {cell.label}
                                                            <span className="sr-only"> (삭제된 항목)</span>
                                                        </s>
                                                    ) : (
                                                        cell.label
                                                    )
                                                    return (
                                                        <th
                                                            key={depth}
                                                            scope="row"
                                                            rowSpan={cell.rowSpan}
                                                            colSpan={cell.colSpan}
                                                            className="typo-body-l-regular border-border border-r px-4 py-3 align-top font-normal"
                                                        >
                                                            <span className="inline-flex items-center gap-2">
                                                                {!leaf.subtotalDepths.includes(depth) &&
                                                                    !leaf.groupOnlyDepths.includes(depth) && (
                                                                        <>
                                                                            {depth === leaf.path.length - 1 &&
                                                                            leaf.registryKey !== undefined ? (
                                                                                <KeyCopyDepthBadge
                                                                                    depth={depthNumber}
                                                                                    screenKey={leaf.registryKey}
                                                                                />
                                                                            ) : (
                                                                                <Badge
                                                                                    aria-hidden="true"
                                                                                    type="number"
                                                                                    color="primary"
                                                                                >
                                                                                    {depthNumber}
                                                                                </Badge>
                                                                            )}
                                                                            <span className="sr-only">
                                                                                {depthNumber}뎁스{' '}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                {isScreenLink ? (
                                                                    <Link
                                                                        href={registeredScreen.path}
                                                                        className={`${
                                                                            isRedLabel ? 'text-error' : 'text-primary'
                                                                        } focus-visible:ring-ring rounded-xs underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none`}
                                                                    >
                                                                        {displayLabel}
                                                                        <span className="sr-only"> 화면으로 이동</span>
                                                                    </Link>
                                                                ) : externalHref !== undefined ? (
                                                                    <a
                                                                        href={externalHref}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={`${
                                                                            isRedLabel ? 'text-error' : 'text-primary'
                                                                        } focus-visible:ring-ring inline-flex items-center gap-1 rounded-xs underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none`}
                                                                    >
                                                                        {displayLabel}
                                                                        <ExternalLink
                                                                            aria-hidden="true"
                                                                            className="size-3.5 shrink-0"
                                                                        />
                                                                        <span className="sr-only">
                                                                            {' '}
                                                                            화면으로 이동 (새 창)
                                                                        </span>
                                                                    </a>
                                                                ) : (
                                                                    <span
                                                                        className={
                                                                            isRedLabel ? 'text-error' : undefined
                                                                        }
                                                                    >
                                                                        {displayLabel}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </th>
                                                    )
                                                })}
                                                {showsApplication2 && (
                                                    <td className="px-4 py-3">
                                                        <StatusTag status={leaf.application2Status} />
                                                    </td>
                                                )}
                                                <td className="px-4 py-3">
                                                    <StatusTag status={effectiveStatus} />
                                                </td>
                                                <td
                                                    className={`typo-caption-regular px-4 py-3 ${
                                                        isCurrent
                                                            ? 'text-primary font-semibold'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    <VersionCell version={displayedVersion} isCurrent={isCurrent} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </BaseCard>
        </section>
    )
}

export default PublishingIndex
