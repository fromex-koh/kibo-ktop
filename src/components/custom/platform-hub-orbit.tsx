import type {ReactNode} from 'react'
import Image from 'next/image'
import {platformServiceIconVariants} from '@/components/theme/platform-intro.variants'
import type {PlatformServiceKind} from '@/content/service/platform-intro'
import {cn} from '@/lib/utils'

// 허브 궤도 그림 — 가운데 K-TOP 로고 칸에서 서비스 칸 4개로 점선이 뻗고, 네 칸을 지나는 점선 원을 따라 40초에 한 바퀴 돈다(시계 방향).
// 칸은 같은 속도로 반대로 돌아 글자가 늘 똑바로 보인다. 마우스를 올리면 멈추고, 동작 줄이기 설정이면 돌지 않는다[6.3.1].
// 그림 전체가 한 장의 꾸밈 그림이라 안쪽은 읽지 않고(aria-hidden) 바깥 role="img" 의 aria-label 로 뜻을 전한다.
//
// 크기 — 그림 폭(최대 446)에 비례해 칸 · 글자 · 아이콘이 함께 줄어든다. 단위 --hub-u 는 돌 때 차지하는 전체 지름(446u = 궤도 반지름 171
// + 칸 반폭 52, 양쪽)이 그림 칸 폭에 꼭 들어가게 정한다 — 칸이 돌며 그림 칸 밖으로 나가 히어로 끝에 붙지 않게(오른쪽 여백 = 히어로 안쪽 여백).
// 최대 1px(시안 크기 — 그림 칸 최대 폭 446 에서 1px) · 최소 0.7px(좁은 폭 1024~1279 에서 글자가 너무 작아지지 않게).
// 쓰는 곳: 플랫폼 소개 히어로(1024↑에서만 보임) — 칸 오른쪽에 붙여(justify-self-end) 오른쪽 여백을 히어로 안쪽 여백과 맞춘다.
// 칸 면 · 테두리는 platform-panel(-border), 점선은 platform-hub-line — 다크에서 남색 슬레이트 계열이다.
// 칸 크기를 그림 폭에 묶어야 해서 크기 · 글자는 --hub-u 를 곱한 계산식으로 둔다(SC-01 CSS 변수 예외 — 토큰 고정값으로는 비례가 안 된다).

type PlatformHubNode = {
    label: string
    /** 아이콘 칸 색(서비스). */
    service: PlatformServiceKind
    /** 아이콘(lucide, aria-hidden). */
    icon: ReactNode
}

// 칸 자리 — 궤도 정사각의 네 모서리(좌상 · 우상 · 우하 · 좌하). 점선 원이 이 정사각에 외접해 네 모서리가 원 위(45° 지점)에 온다.
const NODE_POSITION_CLASS = ['top-0 left-0', 'top-0 left-full', 'top-full left-full', 'top-full left-0'] as const
// 가운데(50, 50)에서 뻗는 점선의 끝 — 네 모서리(SVG viewBox 0~100).
const HUB_SPOKE_ENDS = [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
] as const

// 크기 — 시안 480 폭 기준 px 에 --hub-u 를 곱한다. 궤도 정사각 한 변 242 = 원 지름 342 × 0.7071.
// 가운데 K-TOP 로고 원본 크기(124 × 28) — 높이만 정하고 폭은 w-auto 라 width · height 속성이 덮인다. 비율을 CSS 로도 두어
// Chrome 의 'Lazy-loaded images should have explicit dimensions' 를 막고, 첫 화면 그림이라 지연 로딩하지 않는다(eager).
const LOGO_WIDTH = 124
const LOGO_HEIGHT = 28

const HUB_CLASS = {
    root: '@container group/hub relative aspect-5/4 w-full max-w-111.5 [--hub-u:clamp(--spacing(0.175),calc(100cqw/446),--spacing(0.25))]',
    orbit: 'absolute top-1/2 left-1/2 aspect-square w-[calc(var(--hub-u)*242)] -translate-1/2',
    node: 'bg-platform-panel border-platform-panel-border text-foreground flex w-[calc(var(--hub-u)*104)] flex-col items-center gap-[calc(var(--hub-u)*6)] rounded-[calc(var(--hub-u)*14)] border px-[calc(var(--hub-u)*8)] py-[calc(var(--hub-u)*10)] text-center text-[length:calc(var(--hub-u)*14)] leading-snug font-bold break-keep shadow-md',
    nodeIcon: 'size-[calc(var(--hub-u)*36)] rounded-[calc(var(--hub-u)*10)] [&_svg]:size-[calc(var(--hub-u)*20)]',
    center: 'bg-platform-panel border-platform-panel-border absolute top-1/2 left-1/2 grid -translate-1/2 justify-items-center gap-[calc(var(--hub-u)*6)] rounded-[calc(var(--hub-u)*20)] border px-[calc(var(--hub-u)*18)] py-[calc(var(--hub-u)*14)] shadow-lg',
    logo: 'h-[calc(var(--hub-u)*28)] w-auto',
    caption:
        'text-foreground-subtle text-center text-[length:max(--spacing(2.625),calc(var(--hub-u)*11.5))] leading-snug font-bold',
} as const

const PlatformHubOrbit = ({
    nodes,
    label,
    className,
}: {
    nodes: readonly PlatformHubNode[]
    label: string
    className?: string
}) => (
    <div role="img" aria-label={label} className={cn(HUB_CLASS.root, className)}>
        <div
            aria-hidden="true"
            className={cn(
                HUB_CLASS.orbit,
                'motion-safe:animate-orbit-spin group-hover/hub:[animation-play-state:paused]',
            )}
        >
            {/* 점선 — 가운데에서 네 칸으로 뻗는 선 + 네 칸을 지나는 원(정사각에 외접, 반지름 = 반 대각선 70.71). 궤도와 함께 돈다. */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
                <g className="stroke-platform-hub-line fill-none" strokeWidth={1.5} strokeDasharray="3 4">
                    {HUB_SPOKE_ENDS.map(([x, y]) => (
                        <line key={`${x}-${y}`} x1={50} y1={50} x2={x} y2={y} vectorEffect="non-scaling-stroke" />
                    ))}
                    <circle cx={50} cy={50} r={70.71} vectorEffect="non-scaling-stroke" />
                </g>
            </svg>
            {nodes.map((node, index) => (
                <div
                    key={node.label}
                    className={cn('absolute -translate-1/2', NODE_POSITION_CLASS[index % NODE_POSITION_CLASS.length])}
                >
                    <div
                        className={cn(
                            HUB_CLASS.node,
                            'motion-safe:animate-orbit-counter group-hover/hub:[animation-play-state:paused]',
                        )}
                    >
                        <span
                            className={cn(
                                platformServiceIconVariants({service: node.service, size: 'sm'}),
                                HUB_CLASS.nodeIcon,
                            )}
                        >
                            {node.icon}
                        </span>
                        {node.label}
                    </div>
                </div>
            ))}
        </div>
        <div aria-hidden="true" className={HUB_CLASS.center}>
            <Image
                src="/images/logo-ktop.svg"
                alt=""
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                loading="eager"
                style={{aspectRatio: `${LOGO_WIDTH} / ${LOGO_HEIGHT}`}}
                className={cn('[display:var(--logo-on-light)]', HUB_CLASS.logo)}
            />
            <Image
                src="/images/logo-ktop-white.svg"
                alt=""
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                loading="eager"
                style={{aspectRatio: `${LOGO_WIDTH} / ${LOGO_HEIGHT}`}}
                className={cn('[display:var(--logo-on-dark)]', HUB_CLASS.logo)}
            />
            <span className={HUB_CLASS.caption}>
                Technology-rating
                <br />
                Open Platform
            </span>
        </div>
    </div>
)

export {PlatformHubOrbit}
export type {PlatformHubNode}
