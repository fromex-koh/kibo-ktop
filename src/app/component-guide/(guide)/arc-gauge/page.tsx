// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ArcGauge} from '@/components/custom/arc-gauge'
import {ARC_GAUGE_TONE_GRADIENTS, type ArcGaugeTone} from '@/components/custom/arc-gauge-shape'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '원호 게이지 뼈대 (ArcGauge)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const TONES: readonly ArcGaugeTone[] = ['excellent', 'good', 'normal', 'poor', 'weak']

const USAGE_CODE = `import {ArcGauge} from '@/components/custom/arc-gauge'
import {ARC_GAUGE_TONE_GRADIENTS} from '@/components/custom/arc-gauge-shape'

<ArcGauge
  value={72}
  color={ARC_GAUGE_TONE_GRADIENTS.good.from}
  gradientTo={ARC_GAUGE_TONE_GRADIENTS.good.to}
  size="lg"
  ariaLabel="혁신성장역량지수 72점 · 양호"
  overlayClassName="px-12 pb-8"
>
  {/* 그림 속 글자 — 제목이 아니므로 p 대신 div 를 씁니다. */}
  <div className="typo-display-m-bold text-foreground">72점</div>
  <div className="typo-body-xl-bold text-foreground">양호</div>
</ArcGauge>`

const COLOR_CODE = `import {
  ARC_GAUGE_TONE_GRADIENTS, // 상태 5개(excellent · good · normal · poor · weak)의 from · to
  gaugeGradient,            // 그 밖의 단계 — tokens.json 의 gauge-<이름>-from/-to
  creditGaugeGradient,      // 기업신용등급 단계 — credit-gauge-<단계>-from/-to(단계는 getCriGradeBand)
  CREDIT_GAUGE_TRACK,       // 기업신용등급 트랙
} from '@/components/custom/arc-gauge-shape'

const gradient = creditGaugeGradient('good')

<ArcGauge
  value={80}
  color={gradient.from}
  gradientTo={gradient.to}
  trackColor={CREDIT_GAUGE_TRACK}
  size="md"
  ariaLabel="기업신용등급 양호"
>
  …
</ArcGauge>`

const SIZE_COLUMNS = [
    {key: 'size', header: 'size', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'where', header: '쓰는 컴포넌트', align: 'start', wrap: true},
] as const

const SIZE_ROWS = [
    {
        key: 'lg',
        cells: [
            <code key="s">&apos;lg&apos;</code>,
            '원 지름 320 · 굵기 46 · 보이는 높이 208',
            <Link key="w" href="/component-guide/score-gauge" className={LINK_CLASS}>
                ScoreGauge
            </Link>,
        ],
    },
    {
        key: 'md',
        cells: [
            <code key="s">&apos;md&apos;</code>,
            '원 지름 260 · 굵기 37 · 보이는 높이 172',
            <span key="w">
                <Link href="/component-guide/semicircle-rating-gauge" className={LINK_CLASS}>
                    SemicircleRatingGauge
                </Link>{' '}
                ·{' '}
                <Link href="/component-guide/grade-scale-gauge" className={LINK_CLASS}>
                    GradeScaleGauge
                </Link>
            </span>,
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'ArcGauge',
        'value',
        '0~100 채움 값입니다. 범위 밖 · 숫자가 아닌 값은 0 · 100 으로 맞추고, 0 보다 크면 둥근 끝 두 개만큼은 채웁니다.',
        '-',
        'number',
    ],
    [
        'ArcGauge',
        'color',
        '채움 색(토큰 변수)입니다. gradientTo 를 주면 그라데이션의 시작 색(오른쪽 위)이 됩니다.',
        '-',
        'string',
    ],
    [
        'ArcGauge',
        'gradientTo',
        '주면 color → gradientTo 그라데이션(오른쪽 위 → 왼쪽 아래)으로 칠합니다.',
        '-',
        'string',
    ],
    ['ArcGauge', 'trackColor', '빈 트랙 색(토큰 변수)입니다. 없으면 gauge-track 입니다.', 'gauge-track', 'string'],
    ['ArcGauge', 'size', '원호 크기입니다. 위 표를 봅니다.', "'lg'", "'lg' | 'md'"],
    ['ArcGauge', 'ariaLabel', '그림 전체를 읽어 줄 이름입니다. 가운데 글자의 내용을 모두 담습니다.', '-', 'string'],
    [
        'ArcGauge',
        'children',
        '원호 위에 겹칠 가운데 글자입니다. 아래를 기준으로 쌓이고, 화면 낭독기에는 읽히지 않습니다.',
        '-',
        'ReactNode',
    ],
    [
        'ArcGauge',
        'overlayClassName',
        '가운데 글자 묶음에 더할 클래스입니다. 기본 아래 여백은 12(pb-3)이고, 좌우 px-* 로 글자를 원호 안쪽에 가둡니다.',
        '-',
        'string',
    ],
    [
        'ArcGauge',
        'animate',
        '원호가 차오르는 움직임입니다. 안 주면 useChartAnimation() 값을 따릅니다.',
        'useChartAnimation()',
        'boolean',
    ],
    ['ArcGauge', 'className', '바깥 상자에 더할 클래스입니다.', '-', 'string'],
] as const

const ArcGaugeGuidePage = () => (
    <GuidePageShell
        title="원호 게이지 뼈대 (ArcGauge)"
        description="위가 열린 굵은 원호(트랙 + 채움)를 그리고 가운데 글자를 겹쳐 놓는 게이지 뼈대입니다. 원호 게이지 컴포넌트들이 함께 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="arc-gauge-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="arc-gauge-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면에서는 이 뼈대를 감싼 게이지(아래 표)를 씁니다. 같은 원호에 다른 가운데 글자가 필요한 새
                        게이지를 만들 때만 <code>ArcGauge</code> 를 직접 씁니다.
                    </p>
                </div>
                <ArcGauge
                    value={72}
                    color={ARC_GAUGE_TONE_GRADIENTS.good.from}
                    gradientTo={ARC_GAUGE_TONE_GRADIENTS.good.to}
                    size="lg"
                    ariaLabel="혁신성장역량지수 예시 72점 · 양호"
                    overlayClassName="px-12 pb-8"
                >
                    <div className="typo-display-m-bold text-foreground">72점</div>
                    <div className="typo-body-xl-bold text-foreground">양호</div>
                </ArcGauge>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="arc-gauge-size" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="arc-gauge-size" className="typo-h4-bold">
                        크기 (size)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        크기는 두 가지입니다. 칸이 기준 크기보다 좁으면 원호와 가운데 글자가 같은 비율로 함께
                        줄어듭니다.
                    </p>
                </div>
                <ul className="flex flex-wrap items-end gap-6">
                    <li className="flex w-full max-w-80 flex-col items-center gap-2">
                        <ArcGauge
                            value={72}
                            color={ARC_GAUGE_TONE_GRADIENTS.good.from}
                            gradientTo={ARC_GAUGE_TONE_GRADIENTS.good.to}
                            size="lg"
                            ariaLabel="lg 크기 예시 72점"
                        >
                            <div className="typo-display-m-bold text-foreground">lg</div>
                        </ArcGauge>
                        <p className="typo-body-m-regular text-label-foreground">
                            <code>size=&quot;lg&quot;</code>
                        </p>
                    </li>
                    <li className="flex w-full max-w-65 flex-col items-center gap-2">
                        <ArcGauge
                            value={72}
                            color={ARC_GAUGE_TONE_GRADIENTS.excellent.from}
                            gradientTo={ARC_GAUGE_TONE_GRADIENTS.excellent.to}
                            size="md"
                            ariaLabel="md 크기 예시 72점"
                        >
                            <div className="typo-display-m-bold text-foreground">md</div>
                        </ArcGauge>
                        <p className="typo-body-m-regular text-label-foreground">
                            <code>size=&quot;md&quot;</code>
                        </p>
                    </li>
                </ul>
                <Table caption="ArcGauge 크기" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="arc-gauge-color" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="arc-gauge-color" className="typo-h4-bold">
                        색 · 그라데이션 · 트랙
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        색은 <code>arc-gauge-shape</code> 의 토큰 변수 짝을 넘깁니다. 다크 모드 값은 토큰이 바꾸므로
                        사용처에서 따로 분기하지 않습니다.
                    </p>
                </div>
                <ul className="flex flex-wrap gap-6">
                    {TONES.map((tone) => (
                        <li key={tone} className="flex w-full max-w-50 flex-col items-center gap-2">
                            <ArcGauge
                                value={60}
                                color={ARC_GAUGE_TONE_GRADIENTS[tone].from}
                                gradientTo={ARC_GAUGE_TONE_GRADIENTS[tone].to}
                                size="md"
                                ariaLabel={`${tone} 그라데이션 예시`}
                            />
                            <p className="typo-body-m-regular text-label-foreground">
                                <code>{tone}</code>
                            </p>
                        </li>
                    ))}
                </ul>
                <CodeBlock code={COLOR_CODE} language="tsx" copyLabel="색 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="arc-gauge-note" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="arc-gauge-note" className="typo-h4-bold">
                        주의할 점
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        게이지 전체가 <code>role=&quot;img&quot;</code> 하나로 읽히고 가운데 글자는 읽히지 않습니다. 값
                        · 등급을 <code>ariaLabel</code> 한 문장에 모두 담습니다[5.1.1].
                    </li>
                    <li>
                        가운데 글자는 제목이 아니므로 <code>p</code> · 헤딩 대신 <code>div</code> 로 둡니다.
                    </li>
                    <li>
                        긴 글자는 <code>overlayClassName</code> 의 좌우 여백(<code>px-*</code>)으로 원호 안쪽 폭에
                        가둡니다. lg 는 <code>px-12</code>, md 는 <code>px-10</code> 을 씁니다.
                    </li>
                    <li>페이지를 처음 그릴 때(하이드레이션 전)는 같은 크기의 회색 원호 스켈레톤이 잠깐 보입니다.</li>
                    <li>
                        움직임은{' '}
                        <Link href="/component-guide/chart-reveal" className={LINK_CLASS}>
                            차트 등장 (ChartReveal)
                        </Link>{' '}
                        설정을 따르고, 동작 줄이기 설정이면 움직이지 않습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="arc-gauge-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="arc-gauge-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ArcGauge Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ArcGaugeGuidePage
