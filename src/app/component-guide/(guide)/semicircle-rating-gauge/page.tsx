// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SemicircleRatingGauge, type SemicircleRatingData} from '@/components/custom/semicircle-rating-gauge'
import {CRI_GRADES, criGradePercentage, toCriRatingData} from '@/content/service/cri-grades'
import {RatingScenarioDemo} from './semicircle-rating-gauge-demo'

export const metadata: Metadata = {title: '등급 원호 게이지 (SemicircleRatingGauge)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const DETAILS = [
    {label: '평가일자', value: '2022-06-15'},
    {label: '결산일자', value: '2024-08-04'},
]

const REPORT_DATA: SemicircleRatingData = {
    label: 'A',
    description: '우량 등급',
    percentage: 82,
    details: DETAILS,
}

const USAGE_CODE = `import {SemicircleRatingGauge} from '@/components/custom/semicircle-rating-gauge'

<SemicircleRatingGauge
  title="기업신용등급"
  ariaLabel="기업신용등급 A, 우량 등급"
  data={{
    label: 'A',
    description: '우량 등급',
    percentage: 82,
    details: [
      {label: '평가일자', value: '2022-06-15'},
      {label: '결산일자', value: '2024-08-04'},
    ],
  }}
/>`

const DATA_CODE = `import {toCriRatingData} from '@/content/service/cri-grades'

// API 는 등급 코드와 날짜만 줍니다. 등급명 · 채움 비율은 CRI 등급표에서 찾습니다.
const data = toCriRatingData(creditRating.gradeCode, [
  {label: '평가일자', value: creditRating.evaluationDate},
  {label: '결산일자', value: creditRating.settlementDate},
])
// → {label: 'BBB+', description: '양호 등급', percentage: 67, details: [...]}

<SemicircleRatingGauge
  data={data}
  title="기업신용등급"
  ariaLabel={\`기업신용등급 \${data.label}, \${data.description}\`}
/>`

const LOADING_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton'

<ChartSkeleton type="gauge" label="기업신용등급을 불러오는 중입니다." />`

// CRI 등급표의 끝 등급 · 긴 등급명 · 등급이 매겨지지 않은 경우 · 표에 없는 코드 · 목록 유무.
const SPECIAL_CASES: Array<{title: string; description: string; data: SemicircleRatingData}> = [
    {
        title: '최상위 등급 (AAA+)',
        description: '네 글자 등급 · 등급명 "최우량". 채움이 원호 끝까지 찹니다.',
        data: toCriRatingData('AAA+', DETAILS),
    },
    {
        title: '최하위 평가 등급 (D)',
        description: '등급명 "위험". 채움 없이 트랙만 보입니다.',
        data: toCriRatingData('D', DETAILS),
    },
    {
        title: '낮은 비율 (C+ · 5%)',
        description: '둥근 끝 두 개보다 짧은 채움도 둥근 끝으로 그립니다.',
        data: toCriRatingData('C+', DETAILS),
    },
    {
        title: '긴 등급명 (CCC0 · 보통 이하)',
        description: '가장 긴 등급명 "보통 이하 등급"도 원호 안쪽 폭 안에 들어갑니다.',
        data: toCriRatingData('CCC0', DETAILS),
    },
    {
        title: '평가 유보 (R)',
        description: '등급이 매겨지지 않아 채움 없이 등급명 "유보"만 보입니다("등급"을 붙이지 않습니다).',
        data: toCriRatingData('R', DETAILS),
    },
    {
        title: '평가 제외 (NR)',
        description: '등급명 "평가 제외" — 채움 없이 등급명만 보입니다.',
        data: toCriRatingData('NR', DETAILS),
    },
    {
        title: '잘못된 코드 (예: A)',
        description:
            'CRI 등급표에 없는 코드 — 끝의 0 · + · - 가 빠진 "A", 오타 등. 채움 없이 받은 코드와 "등급 코드 확인 필요"를 보이고, 개발 모드 콘솔에 "올바른 예: A+ · A0 · A-" 경고를 남깁니다. 이 화면이 보이면 API 값이나 매핑을 확인하세요.',
        data: toCriRatingData('A', DETAILS),
    },
    {
        title: '날짜 목록이 없는 경우',
        description: 'details 가 비면 목록 없이 원호만 둡니다.',
        data: toCriRatingData('A0'),
    },
]

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shows', header: '보여 주는 값', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'semicircle-rating',
        cells: [
            <code key="component">SemicircleRatingGauge</code>,
            '등급 + 채움 비율 + 날짜 목록',
            '채움 비율(percentage)을 직접 넘기고 색은 파랑 하나입니다. 원호 아래에 기준일 목록이 붙습니다.',
        ],
    },
    {
        key: 'grade-scale',
        cells: [
            <Link key="component" href="/component-guide/grade-scale-gauge" className={LINK_CLASS}>
                GradeScaleGauge
            </Link>,
            '현재 등급 + 전체 등급 척도',
            '채움이 등급 순번에서 계산되고 색은 등급 칸이 정합니다.',
        ],
    },
    {
        key: 'grade-arc',
        cells: [
            <Link key="component" href="/component-guide/grade-arc-gauge" className={LINK_CLASS}>
                GradeArcGauge
            </Link>,
            '등급의 자리',
            '인쇄용 리포트의 작은 반원이며 날짜 목록이 없습니다.',
        ],
    },
    {
        key: 'score-gauge',
        cells: [
            <Link key="component" href="/component-guide/score-gauge" className={LINK_CLASS}>
                ScoreGauge
            </Link>,
            '0~100 점수',
            '같은 원호의 큰 크기(lg)이며 상태 색을 씁니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['SemicircleRatingGauge', 'data', '등급 · 설명 · 채움 비율 · 날짜 목록입니다.', '-', 'SemicircleRatingData'],
    ['SemicircleRatingGauge', 'title', '화면 낭독기가 읽을 게이지 이름입니다(예: 기업신용등급).', '-', 'string'],
    [
        'SemicircleRatingGauge',
        'ariaLabel',
        '원호(그림)의 이름입니다. 등급과 설명을 한 문장으로 넘깁니다.',
        '-',
        'string',
    ],
    [
        'SemicircleRatingGauge',
        'className · div props',
        '바깥 div 에 전달됩니다. children 은 받지 않습니다.',
        '-',
        'HTMLAttributes',
    ],
    ['SemicircleRatingData', 'label', '가운데에 크게 서는 등급입니다(예: A · BBB+).', '-', 'string'],
    ['SemicircleRatingData', 'description', '등급 아래 설명입니다(예: 우량 등급).', '-', 'string'],
    [
        'SemicircleRatingData',
        'percentage',
        '채움 비율(0~100)입니다. 범위 밖 값은 끝으로 맞추고, 0 보다 크면 최소 둥근 끝 두 개만큼은 그립니다.',
        '-',
        'number',
    ],
    [
        'SemicircleRatingData',
        'details',
        '원호 아래 목록입니다. 비우면 목록을 두지 않습니다.',
        '-',
        'RatingGaugeDetail[]',
    ],
    ['RatingGaugeDetail', 'label · value', '목록의 이름과 값입니다(예: 평가일자 · 2022-06-15).', '-', 'string'],
] as const

const SemicircleRatingGaugeGuidePage = () => (
    <GuidePageShell
        title="등급 원호 게이지 (SemicircleRatingGauge)"
        description="등급을 위가 열린 굵은 원호로 보여 주고, 가운데에 등급 · 설명, 아래에 기준 날짜 목록을 두는 게이지입니다."
    >
        <BaseCard>
            <section aria-labelledby="srg-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="srg-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data.percentage</code> 만큼 원호를 채웁니다. 색은 등급과 무관하게 파랑 하나이고 등급은
                        채움 길이로만 달라집니다. 폭이 260 보다 좁으면 원호와 글자가 같은 비율로 줄어듭니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-96 rounded-sm border p-6">
                    <SemicircleRatingGauge
                        data={REPORT_DATA}
                        title="기업신용등급"
                        ariaLabel="기업신용등급 A, 우량 등급"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="srg-variants" className="typo-h4-bold">
                        등급과 상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        등급명과 채움 비율은 CRI 등급표(<code>content/service/cri-grades.ts</code>)가 단일 소스입니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">등급별</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            버튼으로 CRI 24개 등급을 바꿔 채움 비율 · 등급명 · 등급정의를 확인합니다.
                        </p>
                        <div className="bg-surface border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                            <RatingScenarioDemo />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">CRI 등급표</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            가운데 설명은 &apos;등급명 + 등급&apos;입니다. 평가 등급 22개(AAA+ ~ D)는 위에서부터 100 → 0
                            으로 고르게 나눈 비율로 채우고, R(유보) · NR(평가 제외)은 채움 없이 등급명만 보입니다.
                        </p>
                        <div className="border-border overflow-x-auto rounded-xl border">
                            <table className="w-full min-w-160 text-left">
                                <caption className="sr-only">CRI 등급 정의 및 등급명</caption>
                                <thead>
                                    <tr className="border-border bg-card border-b">
                                        {['CRI 등급', '등급명', '게이지 설명', '채움 비율', '등급정의'].map(
                                            (heading) => (
                                                <th
                                                    key={heading}
                                                    scope="col"
                                                    className="typo-body-l-medium px-4 py-3 whitespace-nowrap"
                                                >
                                                    {heading}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {CRI_GRADES.map((item) => (
                                        <tr key={item.grade} className="border-border border-b last:border-b-0">
                                            <th
                                                scope="row"
                                                className="typo-body-l-bold text-foreground px-4 py-3 font-mono"
                                            >
                                                {item.grade}
                                            </th>
                                            <td className="typo-body-l-regular text-foreground px-4 py-3 whitespace-nowrap">
                                                {item.name}
                                            </td>
                                            <td className="typo-body-l-regular text-foreground-subtle px-4 py-3 whitespace-nowrap">
                                                {toCriRatingData(item.grade).description}
                                            </td>
                                            <td className="typo-body-l-regular text-foreground-subtle px-4 py-3 tabular-nums">
                                                {criGradePercentage(item)}%
                                            </td>
                                            <td className="typo-body-l-regular text-foreground-subtle px-4 py-3 break-keep">
                                                {item.definition}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">특이 케이스</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            비율 · 글자 길이 · 목록 유무 · 폭이 달라도 컴포넌트가 처리하므로 받은 값을 그대로 넣습니다.
                        </p>
                        <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <SemicircleRatingGauge
                                        data={item.data}
                                        title="기업신용등급"
                                        ariaLabel={`기업신용등급 ${item.data.label}, ${item.data.description}`}
                                    />
                                </li>
                            ))}
                            <li className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">좁은 폭 (200)</p>
                                <p className="typo-body-m-regular text-label-foreground">
                                    원호와 가운데 글자가 같은 비율로 함께 줄어듭니다.
                                </p>
                                <SemicircleRatingGauge
                                    data={toCriRatingData('AA0', DETAILS)}
                                    title="기업신용등급"
                                    ariaLabel="기업신용등급 AA0, 우량 등급"
                                    className="max-w-50"
                                />
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중 (ChartSkeleton)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            로딩 prop 이 없어 같은 자리에 스켈레톤을 둡니다. 같은 원호 경로와 가운데 · 목록 줄을 써서
                            불러온 뒤 자리가 흔들리지 않습니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러오는 중</p>
                                <ChartSkeleton type="gauge" label="기업신용등급을 불러오는 중입니다." />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러온 뒤</p>
                                <SemicircleRatingGauge
                                    data={REPORT_DATA}
                                    title="기업신용등급"
                                    ariaLabel="기업신용등급 A, 우량 등급"
                                />
                            </div>
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="srg-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        채움을 어떻게 정하는지와 날짜 목록이 필요한지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="등급 · 점수 원호 게이지 선택 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="srg-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        원호는 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 읽히고, 숨김 문단이{' '}
                        <code>title</code> · 등급 · 설명을 읽어 줍니다[5.1.1].
                    </li>
                    <li>
                        날짜 목록은 <code>dl</code> 로 이름과 값이 짝지어 읽힙니다[7.3.1].
                    </li>
                    <li>등급이 글자로도 있어 색만으로 뜻을 전하지 않습니다[5.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="srg-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SemicircleRatingGauge Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SemicircleRatingGaugeGuidePage
