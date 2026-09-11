'use client'

import {useId, useState} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {NOTICE_CATEGORY, type HomeNotice} from '@/content/service/home-notices'
import {cn} from '@/lib/utils'

// 홈 공지 팝업 — 메인 화면에 들어오면 떠 있는 공지다. 여러 건이면 옆으로 넘겨 본다.
//
// 저절로 넘어가지 않는다 — 스스로 움직이는 콘텐츠에는 정지 수단을 두어야 하는데[6.2.2], 읽는 속도가
// 사람마다 다른 공지에서는 멈추는 버튼을 두는 것보다 아예 넘기지 않는 편이 낫다. 넘기는 일은 화살표와
// 아래 점이 맡는다.
//
// 넘기는 모습은 띠(track)를 옆으로 밀어서 만든다 — 한 장씩 갈아 끼우면 어느 쪽으로 넘어갔는지 알 수
// 없다. 동작을 줄이도록 설정한 사용자에게는 밀리지 않고 바로 바뀐다[6.3.1].
//
// [프론트엔드 연동] 목업은 content/service/home-notices.ts 에 있다. [오늘 하루 열지 않기]는 지금 화면에서
// 창만 닫는다 — 실제로는 그 값을 하루짜리 쿠키·localStorage 에 적고, 다음 방문 때 이 컴포넌트를 아예
// 렌더하지 않도록 화면에서 판단한다.

const TODAY_HIDE_LABEL = '오늘 하루 열지 않기'

type HomeNoticePopupProps = {
    /** 보여 줄 공지. 비어 있으면 팝업을 그리지 않는다. */
    items: readonly HomeNotice[]
    /** 공지 상세로 가는 주소 — 기업·기관이 다르다. 글 번호는 쿼리로 붙인다. */
    detailHref: string
}

const HomeNoticePopup = ({items, detailHref}: HomeNoticePopupProps) => {
    const [index, setIndex] = useState(0)
    const trackId = useId()
    const total = items.length

    if (total === 0) return null

    const current = Math.min(index, total - 1)
    const move = (step: number) => setIndex((previous) => (previous + step + total) % total)

    return (
        <Dialog defaultOpen>
            {/* 팝업 자체가 공지 묶음이라 따로 설명 문단을 두지 않는다 — radix 에 설명 없음을 알린다. */}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>공지사항</DialogTitle>
                </DialogHeader>

                <div className={cn(dialogBodyClassName, 'gap-4')}>
                    {/* 넘기는 자리 — 띠를 밀어 보여 준다. 보이지 않는 장의 링크까지 탭으로 잡히지 않도록
                        지금 장이 아닌 것은 inert 로 둔다. */}
                    <div className="overflow-hidden">
                        <ul
                            id={trackId}
                            style={{transform: `translateX(-${current * 100}%)`}}
                            className="flex items-stretch transition-transform motion-safe:duration-300 motion-reduce:transition-none"
                        >
                            {items.map((notice, noticeIndex) => (
                                <li
                                    key={notice.id}
                                    inert={noticeIndex === current ? undefined : true}
                                    aria-hidden={noticeIndex === current ? undefined : true}
                                    className="flex w-full shrink-0 flex-col gap-3"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="solid-pastel" color="info" shape="round" size="xs">
                                            {NOTICE_CATEGORY[notice.category]}
                                        </Badge>
                                        <time
                                            className="typo-body-l-regular text-foreground-subtle"
                                            dateTime={notice.postedAt}
                                        >
                                            {notice.postedAt}
                                        </time>
                                    </div>
                                    <h3 className="typo-title-m-bold text-foreground break-keep">{notice.title}</h3>
                                    <p className="typo-body-xl-regular text-label-foreground break-keep">
                                        {notice.summary}
                                    </p>
                                    <Button asChild variant="text-underline" size="md" className="self-start">
                                        {/* 어느 공지의 상세인지 이름에 담는다 — 장마다 같은 글자라 링크만으로는 알 수 없다[6.4.3]. */}
                                        <a href={`${detailHref}?id=${notice.id}`}>
                                            자세히 보기
                                            <span className="sr-only">{` (${notice.title})`}</span>
                                        </a>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 공지가 한 건뿐이면 넘길 곳이 없어 조작 줄을 두지 않는다. */}
                    {total > 1 ? (
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                aria-label="이전 공지"
                                aria-controls={trackId}
                                onClick={() => move(-1)}
                            >
                                <ChevronLeft aria-hidden="true" />
                            </Button>

                            {/* 지금 몇 번째인지 — 점은 장식이라 읽히지 않게 하고, 읽어 줄 문장을 따로 둔다. */}
                            <p className="flex items-center gap-2">
                                <span
                                    aria-live="polite"
                                    className="sr-only"
                                >{`공지 ${total}개 중 ${current + 1}번째`}</span>
                                {items.map((notice, noticeIndex) => (
                                    <button
                                        key={notice.id}
                                        type="button"
                                        aria-label={`${noticeIndex + 1}번째 공지 보기`}
                                        aria-current={noticeIndex === current ? 'true' : undefined}
                                        aria-controls={trackId}
                                        onClick={() => setIndex(noticeIndex)}
                                        className={cn(
                                            'focus-visible:ring-ring size-2 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                                            noticeIndex === current ? 'bg-primary' : 'bg-border',
                                        )}
                                    />
                                ))}
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                aria-label="다음 공지"
                                aria-controls={trackId}
                                onClick={() => move(1)}
                            >
                                <ChevronRight aria-hidden="true" />
                            </Button>
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="sm:justify-between">
                    {/* 라벨을 눌러도 체크되도록 htmlFor 로 잇는다[7.4.1]. */}
                    <span className="flex items-center gap-2 sm:flex-none">
                        <Checkbox id="home-notice-today-hide" name="todayHide" />
                        <label htmlFor="home-notice-today-hide" className="typo-body-l-regular text-label-foreground">
                            {TODAY_HIDE_LABEL}
                        </label>
                    </span>
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="md" className="sm:flex-none">
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {HomeNoticePopup, TODAY_HIDE_LABEL}
export type {HomeNoticePopupProps}
