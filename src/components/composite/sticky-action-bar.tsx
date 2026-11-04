'use client'

import {useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode} from 'react'
import {CircleAlert} from 'lucide-react'
import {TruncatedText} from '@/components/composite/truncated-text'
import {Badge} from '@/components/ui/badge'
import {useIsMobile} from '@/hooks/use-mobile'
import {cn} from '@/lib/utils'

// 하단 고정 액션 바(StickyActionBar) — 긴 목록을 내려도 화면 아래에 남아 고른 항목 · 상태 안내 · 다음 동작을 보여 주는 띠.
// 고른 항목은 '이름표 + 칩'(Badge outline · primary — 선택 목록 카드의 고른 상태와 같은 색)으로 보인다.
//
// 배치
//   · 고른 항목 없음: 안내 | 버튼
//   · 고른 항목 있음(모바일): 고른 항목 | 버튼 → 아래 줄에 안내(전체 폭 · 가운데)
//   · 고른 항목 있음(태블릿 이상): 왼쪽에 고른 항목 → 안내, 오른쪽에 버튼
// 떠 있을 때는 반투명 · 흐림 · 그림자 · 위 테두리, 내용 끝에 닿으면 모두 빠져 푸터 위에 놓인 면이 된다.
//
// 쓰는 법
//   · 내용을 담은 세로 묶음의 마지막 자식으로 둔다 — sticky 라 부모 안에서만 따라오고, 그리드 칸 안에서는 따라오지 못한다.
//   · 쓰는 화면의 main 에 overflow-x-clip 을 둔다 — 띠가 w-screen 이라 스크롤바 폭만큼 넘칠 수 있다.
//
// 접근성: 안내가 바뀌면 스크린리더가 읽고(aria-live), 오류는 색만으로 알리지 않도록 아이콘을 함께 둔다[5.3.1].

type StickyActionBarTone = 'default' | 'muted' | 'error'

// 고른 항목이 없을 때의 안내 — 모바일 14, 태블릿 이상 16. typo-* 는 md: 를 붙일 수 없어 화면 폭으로 고른다.
const STICKY_ACTION_BAR_TONE: Record<StickyActionBarTone, {mobile: string; desktop: string}> = {
    default: {mobile: 'typo-body-l-bold text-foreground', desktop: 'typo-body-xl-bold text-foreground'},
    muted: {
        mobile: 'typo-body-l-regular text-foreground-subtle',
        desktop: 'typo-body-xl-regular text-foreground-subtle',
    },
    error: {
        mobile: 'typo-body-l-bold text-field-error-foreground',
        desktop: 'typo-body-xl-bold text-field-error-foreground',
    },
}

// 고른 항목이 있을 때의 안내 — 첫 줄(고른 항목)이 주인공이라 한 단계 작게 둔다.
const STICKY_ACTION_BAR_SELECTION_TONE: Record<StickyActionBarTone, string> = {
    default: 'typo-body-m-regular text-label-foreground',
    muted: 'typo-body-m-regular text-foreground-subtle',
    error: 'typo-body-m-bold text-field-error-foreground',
}

type StickyActionBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /**
     * 고른 항목(이름 · 값) — 쪽을 넘겨도 무엇을 골랐는지 보인다. 값은 칩으로 보이고, 넘치면 칩 안에서 말줄임 + 툴팁이다.
     * 모바일은 줄마다, 태블릿 이상은 한 줄(앞 항목 최대 40%, 마지막 항목은 나머지 폭)이다.
     */
    selection?: readonly {label: string; value: string}[]
    /** 지금 상태 안내. */
    message: ReactNode
    /** 안내 아래 보조 한 줄. */
    description?: ReactNode
    /** 안내의 강조 단계 — default(굵게) · muted(아직 고르지 않음) · error(진행 불가, 아이콘 포함). */
    tone?: StickyActionBarTone
    /** 오른쪽 동작(버튼). */
    action: ReactNode
}

const StickyActionBar = ({
    selection,
    message,
    description,
    tone = 'default',
    action,
    className,
    ...props
}: StickyActionBarProps) => {
    const isMobile = useIsMobile()
    const sentinelRef = useRef<HTMLSpanElement>(null)
    const [isStuck, setIsStuck] = useState(true)

    // 떠 있는지 — 바 아래 끝의 1px 기준점이 화면 안에 들어오면 내용 끝에 닿은 것이다.
    // 바 자체는 스크롤바 폭만큼 잘릴 수 있어 기준점으로 잰다.
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(([entry]) => setIsStuck(!entry?.isIntersecting), {
            // 경계에 맞닿기만 해도 교차로 치므로 기준점(1px)보다 1px 더 뺀다.
            rootMargin: '0px 0px -2px 0px',
        })
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            data-slot="sticky-action-bar"
            data-stuck={isStuck}
            className={cn(
                'border-subtle-3 bg-card/80 shadow-1 z-sticky data-[stuck=false]:bg-card sticky bottom-0 ms-[50%] w-screen -translate-x-1/2 border-t pt-3 pb-[max(--spacing(3),env(safe-area-inset-bottom))] backdrop-blur-md data-[stuck=false]:border-transparent data-[stuck=false]:shadow-none data-[stuck=false]:backdrop-blur-none md:pb-3',
                className,
            )}
            {...props}
        >
            <span ref={sentinelRef} aria-hidden="true" className="absolute bottom-0 left-1/2 size-px" />
            <div className="grid-layout">
                {/* 고른 항목이 있으면 — 모바일: 고른 항목 + 버튼 한 줄, 그 아래 안내가 전체 폭 · 가운데 정렬. 태블릿 이상: 왼쪽에 두 줄(칩 줄 · 안내 사이 8), 버튼은 두 줄 높이의 가운데. */}
                <div className="col-span-full grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:gap-x-6 md:gap-y-2">
                    {selection?.length ? (
                        // 모바일은 항목을 세로로 쌓는다 — 칩끼리 붙지 않게 8 띄운다(태블릿 이상은 한 줄 · 사이 24).
                        <span
                            aria-live="polite"
                            className="col-start-1 row-start-1 flex min-w-0 flex-col gap-x-6 gap-y-2 md:flex-row"
                        >
                            {selection.map((item) => (
                                <span
                                    key={item.label}
                                    className="flex min-w-0 items-center gap-2 md:not-last:max-w-2/5 md:not-last:shrink-0 md:last:flex-1"
                                >
                                    <span className="typo-body-m-regular text-foreground-subtle shrink-0">
                                        {item.label}
                                    </span>
                                    {/* 고른 이름은 칩 — 공용 Badge(outline · primary). 칩이 자리보다 길면 칩 안에서 말줄임 + 툴팁. */}
                                    <Badge
                                        variant="outline"
                                        color="primary"
                                        size="sm"
                                        className="max-w-full min-w-0 shrink justify-start"
                                    >
                                        <TruncatedText className="min-w-0">{item.value}</TruncatedText>
                                    </Badge>
                                </span>
                            ))}
                        </span>
                    ) : null}
                    {/* 상태 안내라 제목이 아니다 — 굵은 <p> 는 WAVE 가 'Possible heading' 으로 잡을 수 있어 span 으로 둔다. */}
                    <span
                        aria-live="polite"
                        className={cn(
                            'flex min-w-0 items-start gap-1 wrap-anywhere break-keep',
                            selection?.length
                                ? cn(
                                      'col-span-2 row-start-2 justify-center text-center md:col-span-1 md:justify-start md:text-start',
                                      STICKY_ACTION_BAR_SELECTION_TONE[tone],
                                  )
                                : cn(
                                      'col-start-1 row-start-1',
                                      STICKY_ACTION_BAR_TONE[tone][isMobile ? 'mobile' : 'desktop'],
                                  ),
                        )}
                    >
                        {tone === 'error' ? (
                            <CircleAlert aria-hidden="true" className="size-icon-sm mt-0.5 shrink-0" />
                        ) : null}
                        {message}
                    </span>
                    {description != null ? (
                        <p className="typo-body-m-regular text-foreground-subtle col-span-2 row-start-3 md:col-span-1">
                            {description}
                        </p>
                    ) : null}
                    <div className="col-start-2 row-start-1 shrink-0 md:row-span-2">{action}</div>
                </div>
            </div>
        </div>
    )
}

export {StickyActionBar}
export type {StickyActionBarProps, StickyActionBarTone}
