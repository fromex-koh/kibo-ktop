'use client'

import {useEffect, useState, useSyncExternalStore} from 'react'
import Image from 'next/image'
import {ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Dialog as DialogPrimitive} from 'radix-ui'
import {Dialog, DialogClose, DialogPortal, DialogTitle} from '@/components/ui/dialog'
import type {HomeNotice} from '@/content/service/home-notices'
import {cn} from '@/lib/utils'

// 홈 공지 팝업 — 메인 화면 위에 어두운 막을 깔고 공지 카드를 띄운다.
//
// 동작
//   · 공지는 최대 3건이다(백오피스 등록 한도). 더 들어와도 앞 3건만 보여 준다.
//   · 한 번에 보이는 카드: 모바일 1장 · 태블릿(md) 2장 · PC(xl) 3장.
//   · 공지가 그보다 많으면 아래에 조작 줄(번호 · 이전 · 재생/정지 · 다음)이 생기고 한 장씩 순환한다.
//     적으면 조작 줄 없이 카드만 가운데에 모인다 — PC 는 3건이 한 번에 보여 조작 줄이 나오지 않는다.
//   · 자동 넘김은 5초 간격이다. 카드에 마우스를 올리거나 초점이 있으면 멈추고,
//     OS 의 '동작 줄이기'가 켜져 있으면 정지 상태로 시작한다[6.2.2 · 6.3.1].
//   · 카드 모양(글만 · 그림+글 · 그림만)은 공지 데이터가 정한다 — content/service/home-notices.ts.
//   · 케이스별 모습은 컴포넌트 가이드(/component-guide/home-notice-popup)에서 확인한다.
//
// [프론트엔드 연동]
//   · items 에 조회한 공지를 넘긴다. 빈 배열이면 아무것도 그리지 않는다.
//   · [오늘 하루 보지않기]는 지금 창만 닫는다. onHideToday 에서 '오늘 숨김'을 쿠키·localStorage 에 기록하고,
//     다음 방문 때는 화면에서 이 컴포넌트를 렌더하지 않는다. 함수 prop 이라 서버 컴포넌트(page.tsx)에서
//     직접 넘길 수 없다 — 클라이언트 컴포넌트로 한 번 감싸서 넘긴다.

const HIDE_TODAY_LABEL = '오늘 하루 보지않기'
const CLOSE_LABEL = '닫기'
const AUTOPLAY_INTERVAL_MS = 5000
// 백오피스에서 등록할 수 있는 팝업 공지 수.
const MAX_NOTICE_COUNT = 3

// 화면 폭별 카드 수. 임계값은 tokens.json 의 breakpoint(md 768 · xl 1280)와 맞춘다.
const TABLET_QUERY = '(min-width: 48rem)'
const PC_QUERY = '(min-width: 80rem)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const MOBILE_PER_VIEW = 1
const TABLET_PER_VIEW = 2
const PC_PER_VIEW = 3

const subscribeToQueries = (onStoreChange: () => void) => {
    const queries = [TABLET_QUERY, PC_QUERY, REDUCED_MOTION_QUERY].map((query) => window.matchMedia(query))
    queries.forEach((query) => query.addEventListener('change', onStoreChange))

    return () => queries.forEach((query) => query.removeEventListener('change', onStoreChange))
}

const getPerView = () => {
    if (window.matchMedia(PC_QUERY).matches) return PC_PER_VIEW

    return window.matchMedia(TABLET_QUERY).matches ? TABLET_PER_VIEW : MOBILE_PER_VIEW
}

// 서버 값은 모바일 기준이다. 팝업은 브라우저에서만 그려지므로 실제로는 늘 화면 폭 값이 쓰인다.
const usePerView = () => useSyncExternalStore(subscribeToQueries, getPerView, () => MOBILE_PER_VIEW)
const usePrefersReducedMotion = () =>
    useSyncExternalStore(
        subscribeToQueries,
        () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
        () => false,
    )

// 조작 줄 버튼 — 어두운 막 위의 진한 면(32 · 라운드 8 · 아이콘 20).
const controlButtonClassName =
    "border-foreground bg-foreground text-background interactive:hover:bg-foreground/80 interactive:active:bg-foreground/70 rounded-sm [&_svg:not([class*='size-'])]:size-icon-md"

// 카드의 글 영역(제목 + 본문). 길면 이 상자 안에서 스크롤된다.
// tabIndex 는 키보드로 스크롤하기 위한 것이다[6.1.1] — 지우면 키보드 사용자는 넘친 글을 읽을 수 없다.
const NoticeText = ({title, body}: {title?: string; body?: string}) => (
    <div
        role="group"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 스크롤 상자의 키보드 접근
        tabIndex={0}
        aria-label={title ? `${title} 내용` : '공지 내용'}
        className="outline-ring flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-3 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
        {title ? <h3 className="typo-title-m-bold text-foreground wrap-anywhere break-keep">{title}</h3> : null}
        {body ? (
            <p className="typo-body-xl-regular text-label-foreground wrap-anywhere break-keep whitespace-pre-line">
                {body}
            </p>
        ) : null}
    </div>
)

// 공지 카드 한 장. 안쪽 상자는 늘 3:4 라 폭만 정하면 높이가 따라온다(모바일·태블릿 264×352 · PC 320×426).
//   · 그림 없음        — 글만(제목 + 본문)
//   · 그림 + 본문      — 그림 4:3 + 제목 + 본문
//   · 그림, 본문 없음  — 그림만 3:4. 제목은 보이지 않고 그림의 대체 텍스트가 된다
//
// 그림의 대체 텍스트(백오피스에 따로 입력하는 칸이 없다)
//   · 제목이 그림 아래에 보이는 카드 — 비운다. 같은 말을 두 번 읽게 되고 검사 도구도 '중복 대체 텍스트'로 경고한다.
//   · 그림만 있는 카드               — 제목을 쓴다.
//   · 제목이 비어 있으면              — '공지 n 이미지'(n = 공지 순서)를 넣는다. 빈 채로 나가지 않는다.
const NoticeCard = ({notice, order}: {notice: HomeNotice; order: number}) => {
    const title = notice.title?.trim()
    const isImageOnly = Boolean(notice.image) && !notice.body
    const isTitleVisible = Boolean(title) && !isImageOnly
    const imageAlt = isTitleVisible ? '' : (title ?? `공지 ${order} 이미지`)

    return (
        <li className="bg-card w-full max-w-82 rounded-2xl p-8 xl:max-w-96">
            <div className="flex aspect-3/4 flex-col gap-6">
                {notice.image ? (
                    // 비율이 다른 그림은 찌그러지지 않고 가운데 기준으로 잘린다(object-cover).
                    <div
                        className={cn(
                            'bg-background relative overflow-hidden',
                            isImageOnly ? 'min-h-0 flex-1' : 'aspect-4/3 shrink-0',
                        )}
                    >
                        <Image
                            src={notice.image}
                            alt={imageAlt}
                            fill
                            sizes="(min-width: 80rem) 20rem, 16.5rem"
                            className="object-cover"
                        />
                    </div>
                ) : null}
                {isImageOnly ? null : <NoticeText title={title} body={notice.body} />}
            </div>
        </li>
    )
}

type NoticeControlsProps = {
    current: number
    total: number
    isPlaying: boolean
    /** 지금 저절로 넘어가는 중인지 — 그동안에는 번호를 읽어 주지 않는다(넘어갈 때마다 읽던 것을 끊는다). */
    isRotating: boolean
    onMove: (step: 1 | -1) => void
    onTogglePlay: () => void
}

// 조작 줄 — 왼쪽에 '지금 번호 / 전체', 오른쪽에 이전 · 재생/정지 · 다음.
// 폭은 카드 묶음과 같다(모바일 328 · 태블릿 680 · PC 1200).
const NoticeControls = ({current, total, isPlaying, isRotating, onMove, onTogglePlay}: NoticeControlsProps) => (
    <div className="xl:max-w-content flex w-full max-w-82 items-center justify-between gap-4 md:max-w-170">
        <p className="typo-body-xl-bold text-white">
            <span aria-hidden="true">
                {current + 1} / {total}
            </span>
            <span aria-live={isRotating ? 'off' : 'polite'} className="sr-only">
                {`공지 ${total}개 중 ${current + 1}번째`}
            </span>
        </p>
        <div className="flex items-center gap-2">
            <Button
                type="button"
                size="icon-xs"
                aria-label="이전 공지"
                className={controlButtonClassName}
                onClick={() => onMove(-1)}
            >
                <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
                type="button"
                size="icon-xs"
                aria-label={isPlaying ? '공지 자동 넘김 정지' : '공지 자동 넘김 재생'}
                className={controlButtonClassName}
                onClick={onTogglePlay}
            >
                {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </Button>
            <Button
                type="button"
                size="icon-xs"
                aria-label="다음 공지"
                className={controlButtonClassName}
                onClick={() => onMove(1)}
            >
                <ChevronRight aria-hidden="true" />
            </Button>
        </div>
    </div>
)

type HomeNoticePopupProps = {
    /** 보여 줄 공지. 비어 있으면 팝업을 그리지 않는다. */
    items: readonly HomeNotice[]
    /** [오늘 하루 보지않기]를 눌렀을 때. 창은 스스로 닫히므로 '오늘 숨김' 기록만 한다. */
    onHideToday?: () => void
    /** 창이 닫힌 뒤(두 버튼 · Esc 모두). 닫힘에 맞춰 화면에서 할 일이 있을 때 쓴다. */
    onClose?: () => void
}

const HomeNoticePopup = ({items: allItems, onHideToday, onClose}: HomeNoticePopupProps) => {
    const items = allItems.slice(0, MAX_NOTICE_COUNT)
    const perView = usePerView()
    const prefersReducedMotion = usePrefersReducedMotion()
    const [isOpen, setIsOpen] = useState(true)
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState<'next' | 'previous'>()
    // 재생/정지를 직접 누르기 전(undefined)에는 '동작 줄이기' 설정을 따른다.
    const [playPreference, setPlayPreference] = useState<boolean>()
    // 카드에 마우스가 올라가 있거나 초점이 들어가 있는 동안 — 자동 넘김을 멈춘다.
    const [isReading, setIsReading] = useState(false)
    // 화면 폭이 바뀌어 한 번에 보이는 카드 수가 달라지면 첫 공지부터 다시 놓는다 — 좁은 화면에서 넘긴 번호를
    // 넓은 화면에 그대로 쓰면 카드 순서가 바뀌어 보인다. (렌더 중 상태 맞춤 — effect 로 하면 한 번 깜빡인다.)
    const [layoutPerView, setLayoutPerView] = useState(perView)
    if (layoutPerView !== perView) {
        setLayoutPerView(perView)
        setIndex(0)
        setDirection(undefined)
    }

    const total = items.length
    const visibleCount = Math.min(perView, total)
    const canMove = total > perView
    const isPlaying = playPreference ?? !prefersReducedMotion
    const isRotating = isOpen && canMove && isPlaying && !isReading
    const current = canMove ? index % total : 0

    useEffect(() => {
        if (!isRotating) return

        const timer = window.setInterval(() => {
            setDirection('next')
            setIndex((previous) => (previous + 1) % total)
        }, AUTOPLAY_INTERVAL_MS)

        return () => window.clearInterval(timer)
    }, [isRotating, total])

    if (total === 0) return null

    const move = (step: 1 | -1) => {
        setDirection(step === 1 ? 'next' : 'previous')
        setIndex((previous) => (previous + step + total) % total)
    }
    // 지금 번호부터 보이는 수만큼 꺼낸다. 끝을 넘으면 처음으로 이어진다(순환).
    const visibleOrders = Array.from({length: visibleCount}, (_, offset) => (current + offset) % total)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(nextOpen) => {
                setIsOpen(nextOpen)
                if (!nextOpen) onClose?.()
            }}
        >
            {/* 카드 여러 장이 막 위에 뜨는 모양이라 셸의 DialogContent(흰 판)를 쓰지 않는다.
                화면을 덮는 내용 상자가 막(검정 75%)을 직접 칠한다 — 막을 별도 요소로 두면 그 위의 글자
                (번호 · 숨김 제목)가 배경색 없는 상자에 놓여, 접근성 검사 도구가 페이지 바탕색과 견주어
                '대비 매우 낮음'으로 잡는다. 초점 가두기 · Esc · 스크롤 잠금은 radix 가 그대로 맡는다.
                light — 메인 화면은 어두운 mainpage 테마라, 막과 카드 색을 라이트 토큰으로 고정한다. */}
            <DialogPortal>
                <DialogPrimitive.Content
                    data-slot="dialog-content"
                    aria-describedby={undefined}
                    // 열릴 때 초점을 내용 상자에 둔다 — 기본 동작은 첫 카드의 글 상자에 초점 테두리를 그린다.
                    onOpenAutoFocus={(event) => {
                        event.preventDefault()
                        if (event.currentTarget instanceof HTMLElement) event.currentTarget.focus()
                    }}
                    className="light bg-overlay-xl data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 z-modal fixed inset-0 flex flex-col items-center overflow-y-auto px-4 py-6 duration-100 outline-none"
                >
                    {/* m-auto — 가운데에 놓되, 화면이 낮으면 위에서부터 놓여 잘리지 않고 스크롤된다. */}
                    <div className="m-auto flex w-full flex-col items-center gap-10">
                        <DialogTitle className="sr-only text-white">공지사항</DialogTitle>

                        <div className="flex w-full flex-col items-center gap-6">
                            {/* 읽는 중 판단은 카드 묶음에만 건다 — 조작 줄까지 감싸면 재생 버튼을 누르는 동안과
                                누른 뒤(초점이 버튼에 남는다)에도 멈춘 채여서 버튼이 동작하지 않는 것처럼 보인다. */}
                            <div
                                className="xl:max-w-content w-full max-w-82 md:max-w-170"
                                onPointerEnter={() => setIsReading(true)}
                                onPointerLeave={() => setIsReading(false)}
                                onFocus={() => setIsReading(true)}
                                onBlur={() => setIsReading(false)}
                            >
                                {/* key 가 바뀌면 묶음을 새로 그리며 넘어간 방향에서 들어온다. */}
                                <ul
                                    key={current}
                                    className={cn(
                                        'flex w-full justify-center gap-6',
                                        canMove &&
                                            direction &&
                                            'animate-in fade-in-0 duration-300 motion-reduce:animate-none',
                                        direction === 'next' && 'slide-in-from-right-4',
                                        direction === 'previous' && 'slide-in-from-left-4',
                                    )}
                                >
                                    {visibleOrders.map((order) => (
                                        <NoticeCard key={items[order].id} notice={items[order]} order={order + 1} />
                                    ))}
                                </ul>
                            </div>

                            {canMove ? (
                                <NoticeControls
                                    current={current}
                                    total={total}
                                    isPlaying={isPlaying}
                                    isRotating={isRotating}
                                    onMove={move}
                                    onTogglePlay={() => setPlayPreference(!isPlaying)}
                                />
                            ) : null}
                        </div>

                        {/* CTA — 모바일은 카드 폭을 반씩 나누고, 태블릿부터는 글자 폭대로 가운데에 모인다. */}
                        <div className="md:*:min-w-control-min-w-lg flex w-full max-w-82 gap-2 *:min-w-0 *:flex-1 md:w-auto md:max-w-none md:*:flex-none">
                            <DialogClose asChild>
                                <Button type="button" variant="tertiary" size="xl" onClick={onHideToday}>
                                    {HIDE_TODAY_LABEL}
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="button" size="xl">
                                    {CLOSE_LABEL}
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    )
}

export {HomeNoticePopup, HIDE_TODAY_LABEL}
export type {HomeNoticePopupProps}
