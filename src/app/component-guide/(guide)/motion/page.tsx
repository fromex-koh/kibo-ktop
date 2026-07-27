import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import MotionPreview, {type MotionPreviewKind} from './motion-preview'

export const metadata: Metadata = {title: '모션 (Motion)'}

// 모션 값의 단일 소스는 src/app/globals.css 의 @theme 이다(색·간격과 달리 tokens.json 이 다루지 않는다 —
// @keyframes 와 한 몸이라 CSS 에 둔다). 여기 목록이 그 @theme 과 어긋나면 check:conventions 가 빌드를 세운다.
//
// value 는 @theme 에 적힌 값 그대로, usage 는 그 유틸리티를 실제로 붙이는 파일이다.

const EASINGS = [
    {
        name: 'ease-stack',
        value: 'cubic-bezier(0.5, 0, 0, 1)',
        points: [0.5, 0, 0, 1],
        usage: '스택 페이저의 섹션 전환 — 초반에 빠르게 밀고 끝에서 길게 감속한다.',
        source: 'theme/stack-pager.variants.ts',
    },
    {
        name: 'ease-roll',
        value: 'cubic-bezier(0.22, 1, 0.36, 1)',
        points: [0.22, 1, 0.36, 1],
        usage: '지표 롤러의 행 이동과 숫자 크기 전환.',
        source: 'theme/hero-stats-roller.variants.ts',
    },
] as const

const ANIMATIONS = [
    {
        name: 'animate-hero-zoom-out',
        value: 'main-hero-zoom-out 7s ease both',
        usage: '히어로 배경 슬라이드가 1.2배에서 원래 크기로 천천히 물러난다.',
        source: 'custom/hero-background.tsx',
        preview: 'scale',
    },
    {
        name: 'animate-counter-roll',
        value: 'animated-counter-roll ease both',
        usage: '숫자 카운터의 자릿수 릴 회전. 시간은 사용처가 인라인으로 주입한다(자릿수마다 지연이 달라서).',
        source: 'custom/animated-counter.tsx',
        preview: 'counter',
    },
    {
        name: 'animate-scroll-line',
        value: 'main-scroll-line-fill 1.5s ease-in-out infinite',
        usage: '히어로 하단 SCROLL 표시의 세로선이 위에서 아래로 차오른다.',
        source: 'custom/hero-section.tsx',
        preview: 'line',
    },
    {
        name: 'animate-header-menu-close-enter',
        value: 'header-menu-close-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '전체 메뉴가 열릴 때 닫기 아이콘이 회전·확대된 뒤 제자리에서 안정된다.',
        source: 'composite/header.tsx',
        preview: 'menu-close',
    },
    {
        name: 'animate-header-menu-trigger-return',
        value: 'header-menu-trigger-return 340ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '전체 메뉴가 닫힐 때 메뉴 아이콘이 짧게 회전·확대된 뒤 원래 상태로 복귀한다.',
        source: 'composite/header.tsx',
        preview: 'menu-return',
    },
    {
        name: 'animate-tech-progress',
        value: 'tech-service-progress 5s linear forwards',
        usage: '2섹션 서비스 목차의 진행 바. 끝나면 다음 서비스로 넘어간다.',
        source: 'custom/tech-eval-section.tsx',
        preview: 'progress',
    },
    {
        name: 'animate-tech-enter',
        value: 'tech-service-content-enter 600ms ease both',
        usage: '2섹션에서 서비스가 바뀔 때 본문이 아래에서 떠오르며 나타난다.',
        source: 'custom/tech-eval-section.tsx',
        preview: 'enter',
    },
    {
        name: 'animate-marquee',
        value: 'main-marquee 40s linear infinite',
        usage: '푸터 위 장식 문구 밴드가 왼쪽으로 끝없이 흐른다.',
        source: 'custom/marquee-band.tsx',
        preview: 'marquee',
    },
] as const satisfies readonly {
    name: string
    value: string
    usage: string
    source: string
    preview: MotionPreviewKind
}[]

const EASING_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
    {key: 'usage', header: '쓰임', align: 'start', wrap: true},
] as const

// 사용처는 별도 컬럼으로 두지 않고 쓰임 끝에 붙인다 — 컬럼이 늘면 좁은 폭에서 모든 칸이 줄바꿈돼 행이 과하게 높아진다.
const ANIMATION_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스', align: 'start', rowHeader: true},
    // Table 은 기본이 nowrap 이라, 이름·시간·가속도가 붙은 긴 값은 wrap 을 켜야 표가 넘치지 않는다.
    {key: 'value', header: '값', align: 'start', wrap: true},
    {key: 'usage', header: '쓰임', align: 'start', wrap: true},
] as const

// 가속도 미리보기 — 곡선 자체를 그린다. 움직이는 데모로 보여주려면 가이드 전용 @keyframes 를 새로
// 만들어야 하는데, 그러면 이 페이지가 큐레이션하는 목록에 실제로 쓰지 않는 값이 끼어든다.
// x=시간, y=진행률. 왼쪽 아래(0,0)에서 오른쪽 위(1,1)로 가며, 가파른 구간이 빠르게 움직이는 구간이다.
const CURVE_SIZE = 44

const EasingCurve = ({points}: {points: readonly [number, number, number, number]}) => {
    const [x1, y1, x2, y2] = points
    const toX = (value: number) => (value * CURVE_SIZE).toFixed(2)
    const toY = (value: number) => ((1 - value) * CURVE_SIZE).toFixed(2)

    return (
        <svg
            aria-hidden="true"
            viewBox={`-4 -12 ${CURVE_SIZE + 8} ${CURVE_SIZE + 24}`}
            className="text-primary size-icon-2xl shrink-0"
        >
            <path
                d={`M0 ${CURVE_SIZE} L${CURVE_SIZE} ${CURVE_SIZE} M0 ${CURVE_SIZE} L0 0`}
                className="stroke-border"
                strokeWidth={1}
                fill="none"
            />
            <path
                d={`M0 ${toY(0)} C${toX(x1)} ${toY(y1)}, ${toX(x2)} ${toY(y2)}, ${toX(1)} ${toY(1)}`}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    )
}

// 모션 — 가속도(ease-*)와 애니메이션(animate-*) 유틸리티. 값의 단일 소스는 globals.css 의 @theme 이다.
const MotionGuidePage = () => (
    <GuidePageShell
        title="모션 (Motion)"
        description="화면 전환과 장식 애니메이션에 쓰는 ease-* · animate-* 유틸리티입니다."
    >
        <BaseCard>
            <section aria-labelledby="motion-rule" className="flex flex-col gap-2">
                <h2 id="motion-rule" className="typo-h4-bold text-foreground">
                    사용 원칙
                </h2>
                <p className="typo-body-l-regular text-foreground-subtle">
                    값은 <code>src/app/globals.css</code>의 <code>@theme</code>이 단일 소스입니다(색·간격과 달리{' '}
                    <code>tokens.json</code>이 다루지 않습니다 — <code>@keyframes</code>와 한 몸이라 CSS에 둡니다). 모든
                    애니메이션은 사용처에서 <code>motion-reduce:animate-none</code>으로 끄고, 1초에 3~50회 범위의
                    번쩍임은 만들지 않습니다. [KWCAG 6.3.1]
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="motion-easing" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="motion-easing" className="typo-h4-bold text-foreground">
                        가속도 (Easing)
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        <code>transition-*</code>·<code>duration-*</code>과 함께 씁니다. 미리보기는 곡선 자체로, 가로가
                        시간·세로가 진행률이며 가파른 구간이 빠르게 움직이는 구간입니다.
                    </p>
                </div>
                <Table
                    caption="ease-* 가속도 토큰의 값과 쓰임"
                    columns={EASING_COLUMNS}
                    rows={EASINGS.map((easing) => ({
                        key: easing.name,
                        cells: [
                            <EasingCurve key="preview" points={easing.points} />,
                            <CopyChip key="class" value={easing.name} />,
                            <span key="value" className="text-muted-foreground font-mono whitespace-nowrap">
                                {easing.value}
                            </span>,
                            <span key="usage">
                                {easing.usage} <span className="text-muted-foreground font-mono">{easing.source}</span>
                            </span>,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="motion-animation" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="motion-animation" className="typo-h4-bold text-foreground">
                        애니메이션 (Animation)
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        이름·시간·가속도가 한 값에 묶여 있어 클래스 하나로 적용합니다. 미리보기는 실제 유틸리티를 그대로
                        붙인 것이라 원본과 같은 속도로 움직입니다.
                    </p>
                </div>
                <Table
                    caption="animate-* 애니메이션 토큰의 값과 쓰임"
                    columns={ANIMATION_COLUMNS}
                    rows={ANIMATIONS.map((animation) => ({
                        key: animation.name,
                        cells: [
                            <MotionPreview
                                key="preview"
                                kind={animation.preview}
                                loop={animation.value.includes('infinite')}
                                label={animation.name}
                            />,
                            <CopyChip key="class" value={animation.name} />,
                            <span key="value" className="text-muted-foreground font-mono">
                                {animation.value}
                            </span>,
                            <span key="usage">
                                {animation.usage}{' '}
                                <span className="text-muted-foreground font-mono">{animation.source}</span>
                            </span>,
                        ],
                    }))}
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MotionGuidePage
