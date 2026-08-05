import Link from 'next/link'
import {ChevronDown, ChevronUp, Paperclip} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {NOTICE_CATEGORY, type NoticeCategory} from '@/components/custom/notice-category'

// 공지사항 상세 — 시안 "[알림마당] 공지사항_상세"(40006769:23841).
// 기존 컴포넌트 조합이다: BaseCard(흰 면·radius 16) · Badge(분류) · Separator(구분선) · Button(목록으로 돌아가기).
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
    publishedAt,
    content,
    attachments,
    prev,
    next,
    listHref,
}: NoticeDetailProps) => {
    const badge = NOTICE_CATEGORY[category]
    const hasSiblings = prev != null || next != null

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                {/* 본문 카드 — 세로 여백 32(py-8), 가로 여백은 Card 기본값 24. 목록 카드와 같은 규칙이다. */}
                <BaseCard className="py-8">
                    <article className="flex flex-col">
                        <header className="flex flex-col gap-2">
                            <h2 className="typo-title-m-medium text-foreground break-keep">{title}</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge color={badge.color} shape="round">
                                    {badge.label}
                                </Badge>
                                <time dateTime={publishedAt} className="typo-body-l-regular text-foreground-subtle">
                                    {publishedAt}
                                </time>
                            </div>
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
