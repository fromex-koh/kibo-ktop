'use client'

import {useAutoplayPause} from '@/hooks/use-autoplay-pause'
import {cn} from '@/lib/utils'

// ChipMarquee — 칩 줄이 왼쪽으로 끊김 없이 계속 흐른다(링크가 아닌 꾸밈 목록).
// 쓰는 곳: 플랫폼 소개 > 탄소중립 '이런 기업에 적합합니다'. 화면 끝까지 흐르게 하려면 본문 칸(grid-layout) 밖에 둔다.
//
// 알아둘 점
//   · 같은 목록을 COPY_COUNT 벌 이어 붙이고 절반만큼 옮긴 뒤 처음으로 돌아간다(animate-marquee · linear) —
//     절반 지점이 처음 모습과 같아 이음매가 없다. 칩이 적어 넓은 화면에서 끝이 비면 벌 수를 늘린다.
//   · 마우스 · 터치 · 키보드 포커스로 멈추고 멈춘 자리에서 이어 흐른다(useAutoplayPause)[6.2.2].
//   · 동작 줄이기면 흐르지 않고 줄바꿈된 목록 한 벌만 보인다[6.3.1]. 화면 낭독기는 첫 벌만 읽는다.
//   · 칩 색은 chip-marquee-* 토큰 — 다크에서 띠와 칩 면이 같아지지 않게 따로 둔다.

const COPY_COUNT = 4

type ChipMarqueeProps = {
    items: readonly string[]
    /** 흐르는 목록의 이름(화면 낭독기) — 포커스하면 멈춘다는 안내가 붙는다. */
    label: string
    className?: string
}

const ChipMarquee = ({items, label, className}: ChipMarqueeProps) => {
    const {isPaused, pauseHandlers} = useAutoplayPause()

    return (
        <div
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 흐르는 목록을 키보드 포커스로 멈추기 위함[6.2.2]
            tabIndex={0}
            role="group"
            aria-label={`${label} — 흐르는 목록(포커스하면 멈춤)`}
            {...pauseHandlers}
            className={cn(
                'outline-ring focus-visible:outline-ring overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid',
                className,
            )}
        >
            <div
                data-paused={isPaused}
                className="motion-safe:animate-marquee flex w-max data-[paused=true]:[animation-play-state:paused] motion-reduce:w-auto"
            >
                {Array.from({length: COPY_COUNT}, (_, copyIndex) => (
                    <ul
                        key={copyIndex}
                        aria-hidden={copyIndex > 0 ? true : undefined}
                        className={cn(
                            'flex shrink-0 gap-4 pr-4 motion-reduce:flex-wrap motion-reduce:pr-0',
                            copyIndex > 0 && 'motion-reduce:hidden',
                        )}
                    >
                        {items.map((item) => (
                            <li
                                key={item}
                                className="border-chip-marquee-border typo-body-xl-bold text-chip-marquee-foreground hover:text-primary-foreground bg-chip-marquee-surface hover:bg-chip-marquee-hover hover:border-chip-marquee-hover-border rounded-lg border px-6 py-4 whitespace-nowrap transition-colors"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    )
}

export {ChipMarquee}
export type {ChipMarqueeProps}
