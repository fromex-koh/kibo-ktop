import {ExternalLink} from 'lucide-react'
import type {
    ReleaseNoteChange as ReleaseNoteChangeValue,
    ReleaseNoteGroup as ReleaseNoteGroupValue,
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
    typeof change !== 'string' && change.type === 'handoff'
const isReleaseNoteGroup = (change: ReleaseNoteChangeValue): change is ReleaseNoteGroupValue =>
    typeof change !== 'string' && change.type === 'group'

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

// 변경 목록 — 일반 문장 · 전달 카드를 초안에 적은 순서대로 그린다(묶음 머리는 바깥에서 이미 걸러 낸다).
const ReleaseNoteItems = ({changes}: {changes: readonly ReleaseNoteChangeValue[]}) => (
    <ul className="flex list-none flex-col gap-2">
        {changes.map((displayChange, changeIndex) => {
            if (typeof displayChange === 'string') {
                return (
                    <li key={`${displayChange}-${changeIndex}`} className="flex">
                        <ListMarker />
                        <ReleaseNoteChange change={displayChange} />
                    </li>
                )
            }
            if (!isReleaseNoteHandoff(displayChange)) return null

            return (
                <li key={`${displayChange.mode}-${displayChange.title}-${changeIndex}`}>
                    <ReleaseNoteHandoff change={displayChange} />
                </li>
            )
        })}
    </ul>
)

// 작업 묶음으로 나눈다 — 묶음 머리(group) 뒤로 다음 머리 전까지가 한 작업이다. 첫 머리 앞 항목은 제목 없는 묶음.
const toReleaseNoteSections = (changes: readonly ReleaseNoteChangeValue[]) =>
    changes.reduce<{title?: string; items: ReleaseNoteChangeValue[]}[]>((sections, change) => {
        if (isReleaseNoteGroup(change)) return [...sections, {title: change.title, items: []}]
        const last = sections[sections.length - 1]
        if (!last) return [{items: [change]}]
        return [...sections.slice(0, -1), {...last, items: [...last.items, change]}]
    }, [])

const ReleaseNoteChangeList = ({changes}: {changes: readonly ReleaseNoteChangeValue[]}) => {
    // 카드는 초안에 적은 순서 그대로 보인다 — 초안은 프론트엔드가 위에서부터 차례로 적용할 작업 순서로 쓴다.
    const sections = toReleaseNoteSections(changes.flatMap(normalizeReleaseNoteChange))

    return (
        <div className="flex flex-col gap-5">
            {sections.map((section, sectionIndex) =>
                section.title ? (
                    // 작업 묶음 — 테두리 상자 하나에 작업 이름(머리) + 그 작업의 카드들. 머리 아래 선으로 이름과 카드를 가른다.
                    <section
                        key={`${section.title}-${sectionIndex}`}
                        aria-label={section.title}
                        className="border-border bg-card/40 flex min-w-0 flex-col gap-3 rounded-md border p-3 sm:p-4"
                    >
                        <header className="border-border flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border-b pb-3">
                            <Badge variant="outline" color="info" shape="round" size="sm">
                                작업
                            </Badge>
                            <h4 className="typo-title-m-bold text-foreground min-w-0 break-keep">{section.title}</h4>
                            <span className="typo-body-m-regular text-foreground-subtle">
                                카드 {section.items.length}개
                            </span>
                        </header>
                        <ReleaseNoteItems changes={section.items} />
                    </section>
                ) : (
                    <ReleaseNoteItems key={`intro-${sectionIndex}`} changes={section.items} />
                ),
            )}
        </div>
    )
}

export {ReleaseNoteChangeList}
