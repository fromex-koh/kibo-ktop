import {ExternalLink} from 'lucide-react'
import type {
    ReleaseNoteChange as ReleaseNoteChangeValue,
    ReleaseNoteHandoff as ReleaseNoteHandoffValue,
} from '@/content/publishing-guide'
import {Badge} from '@/components/ui/badge'
import {ListMarker} from '@/components/custom/list-marker'

// 릴리즈 한 건의 변경사항 목록 — 퍼블리싱 인덱스의 "버전 업데이트" 표와 가이드의 버전 업데이트 아카이브가 함께 쓴다.

// 릴리스 초안에서 명시한 이 사이트 내부 링크(컴포넌트 가이드·기업·기관 화면)만 새 창 링크로 변환한다.
// 그 외 Markdown 문법이나 외부 주소는 일반 문자열로 남겨 임의 링크가 화면에 생성되지 않게 한다.
const RELEASE_NOTE_LINK_PATTERN = /\[([^\]]+)\]\((\/(?:component-guide|corp|org)\/[^)\s]+)\)/g

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

const ReleaseNoteHandoff = ({change}: {change: ReleaseNoteHandoffValue}) => {
    const handoffPresentation = {
        diff: {label: 'Diff 확인', color: 'info'},
        new: {label: '신규 추가', color: 'success'},
        overwrite: {label: '덮어쓰기', color: 'secondary-purple'},
        // 지울 파일은 더하거나 바꾸는 카드와 섞이면 놓치기 쉽다 — 경고 색으로 따로 세운다.
        delete: {label: '삭제', color: 'error'},
    } as const
    const {label, color} = handoffPresentation[change.mode]
    // 제목 앞의 [태그]는 그 카드의 성격을 한눈에 알리는 표시다 — 굵게 떼어 그리고 나머지가 제목이다.
    const titleMatch = /^\[([^\]]+)\]\s*(.+)$/.exec(change.title)
    const titleTag = titleMatch?.[1]
    const titleText = titleMatch?.[2] ?? change.title

    return (
        <div className="border-border bg-background/60 flex min-w-0 flex-col gap-2 rounded-sm border p-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Badge variant="solid-pastel" color={color} shape="round" size="sm">
                    {label}
                </Badge>
                <strong className="typo-body-l-medium text-foreground min-w-0">
                    {titleTag ? <span className="typo-body-l-bold">[{titleTag}] </span> : null}
                    {titleText}
                </strong>
            </div>
            {/* 항목명과 내용을 두 칸으로 세운다 — 항목명이 위에 얹히면 카드 하나가 두 배로 길어지고,
                어느 내용이 어느 항목의 것인지 눈으로 되짚어야 한다. 항목명 칸은 그 카드에서 가장 긴
                이름에 맞춰지므로(max-content) 길이가 제각각인 이름도 잘리지 않는다.
                좁은 화면에서는 두 칸이 설 자리가 없어 예전처럼 위아래로 쌓는다(sm 미만). */}
            <dl className="text-muted-foreground border-border grid min-w-0 gap-3 border-t pt-3 sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-x-5 sm:gap-y-2">
                {change.details.map((detail) => {
                    // 줄이 하나뿐인 항목까지 점을 찍으면 카드가 온통 점으로 덮인다 — 여럿일 때만 목록으로 둔다.
                    const values = detail.value.split('\n').filter(Boolean)
                    // 대상은 파일 경로라 고정폭 글꼴로 둔다 — 글 사이에서 경로가 바로 구분된다. 고정폭 글꼴은
                    // 같은 크기에서도 글자가 커 보여, 옆 설명글과 눈높이가 맞도록 한 단 줄인다.
                    const valueClassName = detail.label === '대상' ? 'min-w-0 font-mono text-xs break-all' : 'min-w-0'

                    return (
                        <div key={`${detail.label}-${detail.value}`} className="grid min-w-0 gap-1 sm:contents">
                            <dt className="text-foreground-subtle font-medium break-keep">{detail.label}</dt>
                            <dd className={valueClassName}>
                                {values.length > 1 ? (
                                    <ul className="flex min-w-0 list-disc flex-col gap-1 pl-5">
                                        {values.map((value, index) => (
                                            <li key={`${index}-${value}`} className="min-w-0 break-words">
                                                <ReleaseNoteDetailValue label={detail.label} value={value} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ReleaseNoteDetailValue label={detail.label} value={values[0] ?? detail.value} />
                                )}
                            </dd>
                        </div>
                    )
                })}
            </dl>
        </div>
    )
}

const isReleaseNoteHandoff = (change: ReleaseNoteChangeValue): change is ReleaseNoteHandoffValue =>
    typeof change !== 'string'

const createOverwriteChange = (title: string, targets: string[]): ReleaseNoteHandoffValue => ({
    type: 'handoff',
    mode: 'overwrite',
    title,
    details: [
        {label: '대상', value: targets.join('\n')},
        {label: '적용', value: '지정된 경로를 현재 작업본으로 교체'},
    ],
})

// 이전 릴리즈의 "덮어쓰기: 경로" 문장도 변경 이유별 전달 카드로 표시한다.
const normalizeReleaseNoteChange = (change: ReleaseNoteChangeValue): ReleaseNoteChangeValue[] => {
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
// Diff 확인 → 덮어쓰기 → 신규 추가 → 삭제 순으로 고정한다. 같은 분류 안에서는 초안 작성 순서를 유지한다.
// 삭제는 맨 뒤에 둔다 — 더하고 바꾼 뒤 마지막에 지우는 것이 순서상 안전하다.
const RELEASE_NOTE_HANDOFF_ORDER = {diff: 0, overwrite: 1, new: 2, delete: 3} as const
const sortReleaseNoteChanges = (changes: readonly ReleaseNoteChangeValue[]) =>
    changes
        .map((change, index) => ({change, index}))
        .sort((left, right) => {
            const leftOrder = isReleaseNoteHandoff(left.change) ? RELEASE_NOTE_HANDOFF_ORDER[left.change.mode] : -1
            const rightOrder = isReleaseNoteHandoff(right.change) ? RELEASE_NOTE_HANDOFF_ORDER[right.change.mode] : -1

            return leftOrder - rightOrder || left.index - right.index
        })
        .map(({change}) => change)

const ReleaseNoteChangeList = ({changes}: {changes: readonly ReleaseNoteChangeValue[]}) => (
    <ul className="flex list-none flex-col gap-2">
        {sortReleaseNoteChanges(changes.flatMap(normalizeReleaseNoteChange)).map((displayChange, changeIndex) => {
            const key =
                typeof displayChange === 'string' ? displayChange : `${displayChange.mode}-${displayChange.title}`

            return (
                <li key={`${key}-${changeIndex}`} className={isReleaseNoteHandoff(displayChange) ? '' : 'flex'}>
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
)

export {ReleaseNoteChangeList}
