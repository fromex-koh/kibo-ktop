// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {DistributionCurveChartSkeleton} from '@/components/composite/distribution-curve-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {DistributionCurveChart, type DistributionCurveChartProps} from '@/components/custom/distribution-curve-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '분포 곡선 (DistributionCurveChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

type CaseProps = Pick<
    DistributionCurveChartProps,
    'mean' | 'standardDeviation' | 'value' | 'markerLabel' | 'min' | 'max' | 'tickStep'
>

// K-BIGx 보고서 "Tech-Index 표준정보 비교" 카드와 같은 값이다.
const REPORT_CASE: CaseProps = {mean: 50.5, standardDeviation: 21.5, value: 73.8, markerLabel: '상위 2.2%'}

const USAGE_CODE = `import {DistributionCurveChart} from '@/components/custom/distribution-curve-chart'

<DistributionCurveChart
  ariaLabel="Tech-Index 표준분포와 신청기업 위치 — 상위 2.2%"
  mean={50.5}
  standardDeviation={21.5}
  value={73.8}
  markerLabel="상위 2.2%"
/>`

const DATA_CODE = `// [프론트엔드 연동] 분포(평균 · 표준편차)와 조회 기업 점수 · 순위 문구를 그대로 넘긴다.
// 순위 문구는 화면이 계산하지 않는다 — 백엔드가 준 값(예: '상위 2.2%')을 쓴다.
<DistributionCurveChart
  ariaLabel={\`Tech-Index 표준분포와 신청기업 위치 — \${standard.percentileLabel}\`}
  mean={standard.mean}
  standardDeviation={standard.standardDeviation}
  value={techIndex.score}
  markerLabel={standard.percentileLabel}
/>`

const SHAPE_RULES = [
    '높이 162 칸 상자(위 선 없음 · 바닥 · 양 끝 실선, 눈금 사이 점선 gray.100) 아래 8 에 눈금 숫자(12 Regular)가 옵니다. 전체 높이 196 입니다.',
    '눈금은 min~max 를 tickStep 간격으로 나눕니다. 처음 숫자는 왼쪽 끝 · 마지막 숫자는 오른쪽 끝에 붙어 칸 밖으로 나가지 않습니다.',
    '곡선은 평균 · 표준편차로 계산한 정규분포입니다. 선 1(blue.500) 아래를 위에서 아래로 옅어지는 면으로 채우고, 꼭대기는 칸 높이의 92% 에 닿습니다.',
    '점은 지름 12(blue.500), 점 글자는 12 Bold(blue.600)로 점 아래 12 에 둡니다. 글자가 곡선 · 칸 바닥에 닿으면 점 위(곡선보다 위)로, 그래도 자리가 없으면 점 옆으로 옮깁니다.',
    '그림은 role="img" 이름으로 읽고, 숨김 문단이 평균 · 점수 · 점 글자를 읽어 줍니다.',
] as const

const PROPS_ITEMS = [
    ['DistributionCurveChart', 'mean', '분포 평균입니다.', '-', 'number'],
    [
        'DistributionCurveChart',
        'standardDeviation',
        '분포 표준편차입니다. 0 이하면 가로 범위의 5% 로 맞춥니다.',
        '-',
        'number',
    ],
    ['DistributionCurveChart', 'value', '조회 대상 점수입니다. 없으면 점을 찍지 않습니다.', '-', 'number'],
    ['DistributionCurveChart', 'markerLabel', '점 글자(예: 상위 2.2%)입니다.', '-', 'string'],
    ['DistributionCurveChart', 'min · max', '가로 범위입니다.', '0 · 100', 'number'],
    ['DistributionCurveChart', 'tickStep', '눈금 간격입니다. 칸이 20 개를 넘으면 넓힙니다.', '10', 'number'],
    ['DistributionCurveChart', 'color', '곡선 · 점 색(토큰 변수)입니다.', "'var(--raw-blue-500)'", 'string'],
    ['DistributionCurveChart', 'animate', '곡선이 그려지는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['DistributionCurveChart', 'ariaLabel', '차트 이름입니다.', '-', 'string'],
    [
        'DistributionCurveChartSkeleton',
        'label',
        '불러오는 중 안내 문구(화면 낭독기용)입니다.',
        "'그래프를 …'",
        'string',
    ],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; chart: CaseProps}[] = [
    {
        title: '평균보다 낮은 점수',
        description: '곡선 왼쪽 비탈에 점을 찍습니다. 아래 자리가 넉넉하면 글자는 점 아래에 둡니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 38.2, markerLabel: '하위 24.6%'},
    },
    {
        title: '분포 꼬리 (아래 자리가 모자랄 때)',
        description: '점이 바닥에 붙어 글자 한 줄이 들어가지 않으면 글자를 점 위로 올립니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 94.5, markerLabel: '상위 0.8%'},
    },
    {
        title: '0점',
        description: '점이 왼쪽 끝에 서면 글자를 왼쪽 끝에 붙여 칸 밖으로 나가지 않게 합니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 0, markerLabel: '하위 0.3%'},
    },
    {
        title: '100점',
        description: '점이 오른쪽 끝에 서면 글자를 오른쪽 끝에 붙입니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 100, markerLabel: '상위 0.3%'},
    },
    {
        title: '범위를 벗어난 점수 (잘못된 자료)',
        description: '가로 범위 끝(0 · 100)으로 맞춰 점을 찍습니다. 칸 밖에 점이 그려지지 않습니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 124, markerLabel: '상위 0.3%'},
    },
    {
        title: '긴 점 글자',
        description: '글자 폭의 절반이 칸 끝을 넘으면 그 끝 쪽에 붙입니다. 가운데 쪽에서는 점 가운데에 둡니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 88, markerLabel: '상위 2.2% (동일업종 3위)'},
    },
    {
        title: '표준편차가 작을 때 (뾰족한 분포)',
        description: '꼭대기는 늘 칸 높이의 92% 입니다. 평균에서 먼 점은 바닥에 붙어 글자가 위로 올라갑니다.',
        chart: {mean: 50.5, standardDeviation: 5, value: 62, markerLabel: '상위 1.1%'},
    },
    {
        title: '표준편차가 클 때 (평평한 분포)',
        description: '범위 안의 가장 높은 곳을 92% 로 맞춰 곡선이 납작하게 눕지 않습니다.',
        chart: {mean: 50.5, standardDeviation: 60, value: 73.8, markerLabel: '상위 35.2%'},
    },
    {
        title: '평균이 한쪽으로 치우칠 때',
        description: '범위 안에 보이는 부분만 그리고, 보이는 부분의 가장 높은 곳을 92% 로 맞춥니다.',
        chart: {mean: 92, standardDeviation: 12, value: 73.8, markerLabel: '하위 6.5%'},
    },
    {
        title: '점수 없음',
        description: '점수가 없으면 점 · 글자 없이 분포만 그립니다.',
        chart: {mean: 50.5, standardDeviation: 18},
    },
    {
        title: '표준편차 0 (잘못된 자료)',
        description:
            '가로 범위의 5% 로 맞춰 곡선이 선 한 줄로 사라지지 않게 합니다. 뾰족한 꼭대기라 위 · 아래 자리가 없으면 점 옆에 글자를 둡니다.',
        chart: {mean: 50.5, standardDeviation: 0, value: 50.5, markerLabel: '상위 50.0%'},
    },
    {
        title: '눈금 간격이 너무 좁을 때',
        description: '칸이 20 개를 넘지 않게 간격을 넓혀 눈금 숫자가 서로 겹치지 않습니다(tickStep 1 → 5).',
        chart: {...REPORT_CASE, tickStep: 1},
    },
] as const

const DistributionCurveChartGuidePage = () => (
    <GuidePageShell
        title="분포 곡선 (DistributionCurveChart)"
        description="점수 분포를 종 모양 곡선으로 그리고, 조회 대상 점수 자리에 점과 순위 글자를 찍습니다."
    >
        <BaseCard>
            <section aria-labelledby="dcc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="dcc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서 Tech-Index 탭의 표준정보 비교 카드 그래프입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <div className="flex items-baseline justify-between gap-4">
                        <h3 className="typo-body-xl-bold">Tech-Index 표준정보 비교</h3>
                        <p className="typo-body-l-regular text-foreground-subtle">전체 평균 50.5점</p>
                    </div>
                    <DistributionCurveChart ariaLabel="Tech-Index 표준분포와 신청기업 위치" {...REPORT_CASE} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="dcc-shape" className="typo-h4-bold">
                        모양 (Shape)
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                        {SHAPE_RULES.map((rule) => (
                            <li key={rule} className="flex">
                                <ListMarker type="unordered" />
                                <span className="min-w-0">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="dcc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        점 · 글자가 칸을 넘거나 곡선이 깨질 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <DistributionCurveChart ariaLabel={item.title} {...item.chart} />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="dcc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">DistributionCurveChartSkeleton</code>을
                        같은 자리에 둡니다. 칸 상자 · 곡선 면 · 눈금 자리의 짜임과 높이(196)가 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <DistributionCurveChartSkeleton label="Tech-Index 표준정보를 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <DistributionCurveChart ariaLabel="Tech-Index 표준분포와 신청기업 위치" {...REPORT_CASE} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="dcc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        분포 값과 조회 기업 점수 · 순위 문구를 그대로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="DistributionCurveChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-props" className="flex flex-col gap-4">
                <h2 id="dcc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="DistributionCurveChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DistributionCurveChartGuidePage
