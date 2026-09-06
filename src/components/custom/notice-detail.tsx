import Link from 'next/link'
import {ChevronDown, ChevronUp, Paperclip} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {NOTICE_CATEGORY, type NoticeCategory} from '@/components/custom/notice-category'

// 공지사항 상세 — 시안 "[알림마당] 공지사항_상세"(40007386:80228).
// 기존 컴포넌트 조합이다: BaseCard(흰 면·radius 16) · InlineSeparator(분류│제목) · Badge(중요공지) ·
// Separator(구분선) · Button(목록으로 돌아가기).
// 상태가 없어 서버 컴포넌트로 둔다. 본문·첨부파일·이웃 글은 화면(page.tsx)이 props 로 넘긴다.

type NoticeAttachment = {
    name: string
    href: string
}

type NoticeSibling = {
    title: string
    href: string
}

type NoticeDetailProps = {
    category: NoticeCategory
    title: string
    // 중요공지 표시 — 목록과 같은 배지가 제목 뒤에 붙는다.
    isImportant?: boolean
    // 새 글 표시(N) — 중요공지 배지 다음에 이어 붙는다(목록과 같은 순서).
    isNew?: boolean
    // 화면에 그대로 노출하는 등록일(YYYY-MM-DD).
    publishedAt: string
    content: string
    // 없으면 첨부 영역 자체를 렌더하지 않는다. 본문이 최소 높이를 가지므로 있어도 없어도 카드 모양은 유지된다.
    attachments?: readonly NoticeAttachment[]
    prev?: NoticeSibling
    next?: NoticeSibling
    listHref: string
}

// 이웃 글 한 줄 — [이전 글/다음 글 + 화살표] 다음에 제목이 온다.
const NoticeSiblingRow = ({
    label,
    sibling,
    direction,
}: {
    label: string
    sibling: NoticeSibling
    direction: 'prev' | 'next'
}) => {
    const DirectionIcon = direction === 'prev' ? ChevronUp : ChevronDown

    return (
        <Link
            href={sibling.href}
            className="group/sibling outline-ring rounded-2xs flex items-center gap-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid"
        >
            <span className="typo-body-xl-medium text-foreground flex shrink-0 items-center gap-1">
                {label}
                <DirectionIcon aria-hidden="true" className="size-icon-sm" />
            </span>
            <span className="typo-title-m-medium text-foreground min-w-0 flex-1 truncate group-hover/sibling:underline">
                {sibling.title}
            </span>
        </Link>
    )
}

const NoticeDetail = ({
    category,
    title,
    isImportant,
    isNew,
    publishedAt,
    content,
    attachments,
    prev,
    next,
    listHref,
}: NoticeDetailProps) => {
    const categoryLabel = NOTICE_CATEGORY[category]
    const hasSiblings = prev != null || next != null

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                {/* 본문 카드 — 세로 여백 32(py-8), 가로 여백은 Card 기본값 24. 목록 카드와 같은 규칙이다. */}
                <BaseCard className="py-8">
                    <article className="flex flex-col">
                        <header className="flex flex-col gap-2">
                            {/* 모바일은 목록처럼 분류를 윗줄에 두고 제목과 뱃지를 글 흐름으로 이어 붙인다.
                                상세 제목은 말줄임 없이 전체 내용을 표시한다. */}
                            <div className="flex flex-col gap-y-1 md:flex-row md:flex-wrap md:items-center md:gap-x-1 md:gap-y-2">
                                <span className="typo-body-xl-regular text-label-foreground shrink-0">
                                    {categoryLabel}
                                </span>
                                {/* 좌우 16 은 이 구분선의 기본 여백 12 와 줄의 gap 4 가 합쳐진 값이다. */}
                                <InlineSeparator className="max-md:hidden" />
                                <div className="min-w-0 md:contents">
                                    <h2 className="typo-title-m-medium text-foreground min-w-0 break-keep max-md:inline">
                                        {title}
                                    </h2>
                                    {isImportant ? (
                                        <Badge
                                            color="error"
                                            shape="round"
                                            className="shrink-0 max-md:ml-1 max-md:align-middle"
                                        >
                                            중요공지
                                        </Badge>
                                    ) : null}
                                    {/* 새 글 표시 — 글자 N 만으로는 뜻이 전해지지 않아 말로도 알린다[5.1.1]. */}
                                    {isNew ? (
                                        <Badge
                                            type="number"
                                            color="new"
                                            className="shrink-0 max-md:ml-1 max-md:align-middle"
                                        >
                                            <span aria-hidden="true">N</span>
                                            <span className="sr-only">새 글</span>
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>
                            <time dateTime={publishedAt} className="typo-body-l-regular text-foreground-subtle">
                                {publishedAt}
                            </time>
                        </header>

                        <Separator className="my-6" />

                        {/* 본문 최소 높이 200(min-h-50) — 내용이 짧아도 카드가 납작해지지 않는다(시안 표기).
                            줄바꿈은 원문 그대로 살린다. 원문이 HTML 로 오면 이 자리를 그에 맞게 교체한다. */}
                        <div className="typo-body-xl-regular text-label-foreground min-h-50 break-keep whitespace-pre-line">
                            {content}
                        </div>

                        {/* 첨부파일 — 없으면 영역 자체를 렌더하지 않는다. 본문 최소 높이가 있어 레이아웃은 그대로다. */}
                        {attachments?.length ? (
                            <ul className="mt-6 flex flex-col gap-2">
                                {attachments.map((attachment) => (
                                    <li key={attachment.href}>
                                        <a
                                            href={attachment.href}
                                            download
                                            className="bg-surface-subtle text-label-foreground outline-ring hover:text-foreground flex h-14 items-center gap-2 rounded-sm px-6 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid"
                                        >
                                            <Paperclip aria-hidden="true" className="size-icon-sm shrink-0" />
                                            <span className="typo-body-xl-regular min-w-0 truncate">
                                                {attachment.name}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </article>
                </BaseCard>

                {/* 이웃 글 — 첫 글·마지막 글이면 해당 줄이 빠지고, 둘 다 없으면 카드가 통째로 빠진다. */}
                {hasSiblings ? (
                    <BaseCard className="py-8">
                        <nav aria-label="이웃 글 이동">
                            <ul className="flex flex-col">
                                {prev != null ? (
                                    <li>
                                        <NoticeSiblingRow label="이전 글" sibling={prev} direction="prev" />
                                    </li>
                                ) : null}
                                {next != null ? (
                                    <li className="flex flex-col">
                                        {prev != null ? <Separator className="my-6" /> : null}
                                        <NoticeSiblingRow label="다음 글" sibling={next} direction="next" />
                                    </li>
                                ) : null}
                            </ul>
                        </nav>
                    </BaseCard>
                ) : null}
            </div>

            {/* 시안의 버튼은 흰 면(common.white) · 테두리 gray.300 · 글자 gray.700 이라 tertiary 다.
                outline 은 면이 background(gray.50)이고 테두리가 input(gray.200), 글자가 foreground(gray.900)로 모두 다르다. */}
            <div className="flex justify-center">
                <Button asChild variant="tertiary" size="xl">
                    <Link href={listHref}>목록으로 돌아가기</Link>
                </Button>
            </div>
        </div>
    )
}

export {NoticeDetail}
export type {NoticeDetailProps, NoticeAttachment, NoticeSibling}
