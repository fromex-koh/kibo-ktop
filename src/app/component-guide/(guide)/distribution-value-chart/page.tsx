// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {DistributionValueChartSkeleton} from '@/components/composite/distribution-value-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {DistributionValueChart} from '@/components/custom/distribution-value-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '분포 곡선 값 차트 (DistributionValueChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'

// 3. 엣지 케이스.
const EDGE_CASES = [
    {
        key: 'low',
        title: '점수가 낮은 꼬리',
        description: '점이 바닥선 가까이 있으면 글자를 점 위로 올려 눈금 숫자와 겹치지 않게 합니다.',
        props: {mean: 50.5, standardDeviation: 21.5, value: 4, markerLabel: '하위 1.8%'},
    },
    {
        key: 'edge',
        title: '오른쪽 끝',
        description: '점이 끝 가까이 있으면 글자를 끝 쪽 정렬로 바꿔 그림 밖으로 나가지 않게 합니다.',
        props: {mean: 50.5, standardDeviation: 21.5, value: 99, markerLabel: '상위 0.1%'},
    },
    {
        key: 'over',
        title: '범위를 벗어난 점수',
        description: '점수가 0~100 밖이면 끝으로 맞춥니다(120 → 100).',
        props: {mean: 50.5, standardDeviation: 21.5, value: 120, markerLabel: '상위 0.1%'},
    },
    {
        key: 'narrow',
        title: '표준편차가 작을 때',
        description: '좁고 높은 종 모양이 됩니다. 꼭대기 높이는 늘 같습니다.',
        props: {mean: 62, standardDeviation: 8, value: 70, markerLabel: '상위 15.9%'},
    },
    {
        key: 'zero-sd',
        title: '표준편차 0',
        description: '가로 범위의 5% 로 맞춰 곡선이 선 한 줄로 사라지지 않게 합니다.',
        props: {mean: 50, standardDeviation: 0, value: 50, markerLabel: '평균'},
    },
    {
        key: 'no-value',
        title: '점수 없음',
        description: '점수가 없으면 점 · 글자 없이 곡선만 그립니다.',
        props: {mean: 50.5, standardDeviation: 21.5},
    },
] as const

const USAGE_CODE = `import {DistributionValueChart} from '@/components/custom/distribution-value-chart'

<DistributionValueChart
  ariaLabel="Tech-Index 표준정보 분포 — 전체 평균 50.5점, 조회기업 73.8점, 상위 2.2%"
  mean={standard.mean}
  standardDeviation={standard.standardDeviation}
  value={techIndex.score}
  markerLabel={standard.percentileLabel}
/>`

const LOADING_CODE = `import {DistributionValueChartSkeleton} from '@/components/composite/distribution-value-chart-skeleton'

// 그림 범위(1168 × 336)가 실제 차트와 같아 자리가 흔들리지 않습니다.
{isLoading ? (
  <DistributionValueChartSkeleton label="표준정보 분포를 불러오는 중입니다." />
) : (
  <DistributionValueChart {...chartProps} />
)}`

const PRINT_CODE = `// K-BIGx PDF 템플릿 — 색만 kbx 변수로 넘깁니다(kbigx-print-tech-index.tsx).
<DistributionValueChart
  {...chartProps}
  colors={{
    curve: 'var(--kbx-color-blue)',
    grid: 'var(--kbx-color-border)',
    baseline: 'var(--kbx-color-chart-line-subtle)',
    tick: 'var(--kbx-color-label)',
    label: 'var(--kbx-color-chart-marker-label)',
    markerStroke: 'var(--kbx-color-paper)',
    surface: 'var(--kbx-color-paper)',
  }}
/>`

const PROPS_ITEMS = [
    ['DistributionValueChart', 'ariaLabel', '그림의 이름입니다.', '-', 'string'],
    ['DistributionValueChart', 'mean · standardDeviation', '분포 평균 · 표준편차입니다.', '-', 'number'],
    ['DistributionValueChart', 'value', '조회 대상 점수입니다. 없으면 점을 찍지 않습니다.', 'undefined', 'number'],
    ['DistributionValueChart', 'markerLabel', '점 글자(백엔드가 준 순위 문구)입니다.', 'undefined', 'string'],
    ['DistributionValueChart', 'min · max · tickStep', '가로 범위와 눈금 간격입니다.', '0 · 100 · 10', 'number'],
    [
        'DistributionValueChart',
        'colors',
        '곡선 · 점선 · 바닥선 · 눈금 숫자 · 점 글자 · 점 테두리 · 바탕(surface) 색입니다. 면은 곡선 색을 바탕색에 섞은 불투명 띠로 칠해 PDF 에서도 브라우저와 관계없이 같습니다. 넘기지 않은 항목은 웹 색입니다.',
        '웹 시맨틱 색',
        'Partial<DistributionValueColors>',
    ],
    ['DistributionValueChartSkeleton', 'tickCount', '눈금 숫자 자리 수입니다.', '11', 'number'],
    [
        'DistributionValueChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
] as const

const Example = ({title, description, children}: {title: string; description: string; children: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <p className="typo-body-xl-bold text-foreground">{title}</p>
        <p className="typo-body-m-regular text-foreground-subtle break-keep">{description}</p>
        <div className="border-subtle-3 bg-card rounded-sm border p-6">{children}</div>
    </div>
)

const SectionHeading = ({id, title, children}: {id: string; title: string; children?: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        {children ? <p className="typo-body-l-regular text-label-foreground">{children}</p> : null}
    </div>
)

const DistributionValueChartGuidePage = () => (
    <GuidePageShell
        title="분포 곡선 값 차트 (DistributionValueChart)"
        description="평균 · 표준편차로 종 모양 곡선을 그리고 조회 대상 점수 자리에 점과 순위 글자를 찍는 차트입니다. K-BIGx 보고서 PDF 템플릿 Tech-Index 의 Tech-Index 표준정보 비교 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="dvc-basic" className="flex flex-col gap-6">
                <SectionHeading id="dvc-basic" title="1. 기본 사용">
                    서버에서 바로 그리는 SVG 곡선입니다. 화면 폭에 맞춰 늘어나는 웹 화면용은{' '}
                    <Link href="/component-guide/distribution-curve-chart" className={LINK_CLASS}>
                        DistributionCurveChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="평균 50.5 · 표준편차 21.5, 조회기업 73.8점 — 점 아래 '상위 2.2%'."
                >
                    <DistributionValueChart
                        mean={50.5}
                        standardDeviation={21.5}
                        value={73.8}
                        markerLabel="상위 2.2%"
                        ariaLabel="표준정보 분포 예시"
                    />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dvc-rule" className="flex flex-col gap-6">
                <SectionHeading id="dvc-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>그림 1168 × 336. 가로 범위(0~100)는 x 20 ~ 1148, 바닥선 y 290, 아래 눈금 숫자 20px.</li>
                    <li>
                        곡선은 평균 · 표준편차로 계산한 종 모양이고, 꼭대기(평균 자리)는 늘 바닥선 위 250 에 닿습니다.
                        선 3 + 위에서 아래로 옅어지는 면입니다.
                    </li>
                    <li>점은 반지름 11(바탕색 테두리 3), 점 글자는 점 아래 44 에 22px 굵게 적습니다.</li>
                    <li>곡선은 실제 표본 분포가 아니라 두 값으로 그린 모양입니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dvc-edge" className="flex flex-col gap-6">
                <SectionHeading id="dvc-edge" title="3. 엣지 케이스">
                    점 자리 · 범위 · 표준편차에 따라 모양을 맞춥니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <DistributionValueChart {...item.props} ariaLabel={`${item.title} 예시`} />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dvc-loading" className="flex flex-col gap-6">
                <SectionHeading id="dvc-loading" title="4. 불러오는 중 (DistributionValueChartSkeleton)">
                    같은 그림 범위에 종 모양 면 · 바닥선 · 눈금 숫자 자리를 그립니다. PDF 템플릿은 데이터를 받은 뒤
                    서버에서 바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <DistributionValueChartSkeleton label="표준정보 분포를 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <DistributionValueChart
                            mean={50.5}
                            standardDeviation={21.5}
                            value={73.8}
                            markerLabel="상위 2.2%"
                            ariaLabel="불러온 뒤 예시"
                        />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dvc-print" className="flex flex-col gap-6">
                <SectionHeading id="dvc-print" title="5. K-BIGx PDF 템플릿에서">
                    Tech-Index 1쪽 — 소제목 오른쪽 &apos;전체 평균 50.5점&apos;, 아래 16 간격에 요약 상자. 확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=tech-index"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 PDF 템플릿 Tech-Index
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dvc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="dvc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 평균 · 점수 ·
                        점 글자를 숨김 문단으로 읽어 줍니다[5.1.1].
                    </li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dvc-props" className="flex flex-col gap-6">
                <SectionHeading id="dvc-props" title="7. Props API">
                    <code>ariaLabel</code> · <code>mean</code> · <code>standardDeviation</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable
                    items={PROPS_ITEMS}
                    caption="DistributionValueChart · DistributionValueChartSkeleton Props 목록"
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DistributionValueChartGuidePage
