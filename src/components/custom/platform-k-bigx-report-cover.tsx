import {useId} from 'react'
import {cn} from '@/lib/utils'

// K-BIGx 보고서 표지 — K-BIGx 보고서 소개 히어로 오른쪽 그림(PlatformHero visual). A4 비율 표지(브랜드 · 제목 · 목차 · 발행처)를
//   살짝 기울여(-2°) 두고, 오른쪽 아래 모서리에 반원 게이지(호만, 글 없음)를 겹쳐 얹는다.
//   · 표지는 7초마다 떠오르며 살짝 기운다(platform-float-tilt). 게이지 값 호는 화면을 열면 0 에서 74% 까지 한 번 올라간다(platform-gauge).
//     동작 줄이기면 둘 다 멈추고 처음부터 다 그려져 있다[6.3.1]. 마우스를 올리면 떠다니기가 멈춘다.
//   · 한 장의 예시 그림이라 role="img" + aria-label 로 한 번에 읽힌다(label). 게이지는 꾸밈(aria-hidden).
//   · 게이지는 표지 위에 걸쳐 놓이는 장식이라 absolute 로 둔다 — DOM 순서가 표지 뒤라 z-index 없이 위에 그려진다.
// 쓰는 곳: custom/platform-k-bigx-report.tsx.

// 게이지 반원 — 뷰박스 200 × 108, 중심 (100, 100) 반지름 84. pathLength 100 으로 값(%)을 dasharray 에 바로 쓴다.
const GAUGE_ARC = 'M16 100 A84 84 0 0 1 184 100'
const GAUGE_VALUE = 74
// 게이지 번짐 — 시안 drop-shadow(0 8px 14px 강조색 28%)를 SVG 필터로 그대로 옮긴다(바탕 호 · 값 호 전체에 한 번).
//   필터 값은 뷰박스 단위라 PC 표시 폭(172 / 뷰박스 200 = 0.86배)에서 화면 8px · 흐림 14px(표준편차 7px)이 되게 나눠 둔다.
//   그림자 토큰은 상자 그림자(검정 · 흰색)만 다뤄 SVG 그림자 색을 줄 수 없어서 필터로 둔다. 색은 svg 의 글자색(currentColor).
const GAUGE_SHADOW_DY = 9.3
const GAUGE_SHADOW_BLUR = 8.1
const GAUGE_SHADOW_OPACITY = 0.28

const PlatformKBigxReportCover = ({
    brand,
    title,
    contents,
    publisher,
    label,
    className,
}: {
    brand: string
    title: string
    /** 표지 목차 줄(예: '01 진단브리핑'). */
    contents: readonly string[]
    publisher: string
    /** 그림 전체 설명(낭독기). */
    label: string
    className?: string
}) => {
    const shadowId = useId()
    return (
        <div className={cn('relative flex w-full justify-center', className)}>
            <div
                role="img"
                aria-label={label}
                className="motion-safe:animate-platform-float-tilt w-full max-w-67.5 hover:[animation-play-state:paused]"
            >
                <div className="bg-platform-panel border-platform-panel-border shadow-float rounded-paper flex aspect-[210/297] -rotate-2 flex-col gap-2 border p-5">
                    <span className="typo-platform-cover-brand-black text-platform-bigx-accent-foreground">
                        {brand}
                    </span>
                    <strong className="typo-platform-cover-title-extrabold text-foreground">{title}</strong>
                    <span className="bg-platform-bigx-accent mt-0.5 mb-1.5 h-1 w-12 rounded-full" />
                    <ul className="typo-platform-cover-item-semibold text-label-foreground grid gap-1.5">
                        {contents.map((line) => (
                            <li key={line} className="bg-platform-panel-inset rounded-xs px-2.25 py-1">
                                {line}
                            </li>
                        ))}
                    </ul>
                    <span className="typo-caption-bold text-foreground-subtle mt-auto">{publisher}</span>
                </div>
            </div>
            {/* 반원 게이지 — 표지 가운데에서 오른쪽으로 36 · 아래에서 10 띄운 자리. 폭은 그림 칸의 36%(140 ~ 172). */}
            <svg
                aria-hidden="true"
                viewBox="0 0 200 108"
                className="text-service-hero-navy-emphasis absolute bottom-2.5 left-[calc(50%+--spacing(9))] h-auto w-[clamp(--spacing(35),36%,--spacing(43))] overflow-visible fill-none"
            >
                <defs>
                    <filter id={shadowId} x="-30%" y="-40%" width="160%" height="200%">
                        <feDropShadow
                            dx={0}
                            dy={GAUGE_SHADOW_DY}
                            stdDeviation={GAUGE_SHADOW_BLUR}
                            floodColor="currentColor"
                            floodOpacity={GAUGE_SHADOW_OPACITY}
                        />
                    </filter>
                </defs>
                <g filter={`url(#${shadowId})`}>
                    <path
                        d={GAUGE_ARC}
                        pathLength={100}
                        strokeWidth={18}
                        strokeLinecap="round"
                        className="stroke-platform-bigx-gauge-track"
                    />
                    <path
                        d={GAUGE_ARC}
                        pathLength={100}
                        strokeWidth={18}
                        strokeLinecap="round"
                        strokeDasharray={`${GAUGE_VALUE} 100`}
                        className="motion-safe:animate-platform-gauge stroke-service-hero-navy-emphasis"
                    />
                </g>
            </svg>
        </div>
    )
}

export {PlatformKBigxReportCover}
