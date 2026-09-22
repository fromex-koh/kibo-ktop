// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {SemicircleRatingGauge, type SemicircleRatingData} from '@/components/custom/semicircle-rating-gauge'
import {CRI_GRADES, criGradePercentage, toCriRatingData} from '@/content/service/cri-grades'
import {RatingScenarioDemo} from './semicircle-rating-gauge-demo'

export const metadata: Metadata = {title: '등급 원호 게이지 (SemicircleRatingGauge)'}

const DETAILS = [
    {label: '평가일자', value: '2022-06-15'},
    {label: '결산일자', value: '2024-08-04'},
]

// K-BIGx 기업혁신성장 보고서 "기업신용등급" 카드와 같은 값이다.
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

const DATA_CODE = `import {SemicircleRatingGauge} from '@/components/custom/semicircle-rating-gauge';
import {toCriRatingData} from '@/content/service/cri-grades';

// API 응답 예시 — 등급 코드와 날짜만 받는다.
const creditRatingFromApi = {
  gradeCode: 'BBB+',
  evaluationDate: '2025-05-20',
  settlementDate: '2024-12-31',
};

// 등급 코드 → 게이지 데이터(등급명 · 채움 비율은 CRI 등급표에서 찾는다).
const data = toCriRatingData(creditRatingFromApi.gradeCode, [
  {label: '평가일자', value: creditRatingFromApi.evaluationDate},
  {label: '결산일자', value: creditRatingFromApi.settlementDate},
]);
// → {label: 'BBB+', description: '양호 등급', percentage: 67, details: [...]}

<SemicircleRatingGauge
  data={data}
  title="기업신용등급"
  ariaLabel={\`기업신용등급 \${data.label}, \${data.description}\`}
/>`

const SHAPE_RULES = [
    '원호는 ArcGauge(md) — 원 지름 260 · 굵기 37 · 끝 둥글림 · 위 172 만 보입니다. 혁신성장역량지수(ScoreGauge)와 같은 모양을 줄인 것입니다.',
    '채움은 percentage(0~100)만큼 왼쪽 아래 끝에서 시계 방향으로 이어집니다. 0 보다 크면 최소 둥근 끝 두 개만큼은 그립니다.',
    '채움 색은 등급과 무관하게 파랑(blue.500) 하나이고, 등급은 채움 길이로만 달라집니다. 트랙은 gray.50 입니다.',
    '가운데 글자는 등급 48 Bold → 설명 16 Bold. 원호 아래 16 간격으로 날짜 목록(이름 16 Regular ↔ 값 16 Medium, 줄 간격 12)을 둡니다.',
    '폭이 260 보다 좁으면 원호와 가운데 글자가 같은 비율로 함께 줄어듭니다. 등급 · 설명은 ariaLabel 로 한 번에 읽어 줍니다.',
] as const

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

const PROPS_ITEMS = [
    ['SemicircleRatingGauge', 'data', '등급 · 설명 · 채움 비율 · 상태 · 날짜 목록입니다.', '-', 'SemicircleRatingData'],
    ['SemicircleRatingGauge', 'title', '화면 낭독기가 읽을 게이지 이름입니다(예: 기업신용등급).', '-', 'string'],
    ['SemicircleRatingGauge', 'ariaLabel', '등급과 설명을 한 문장으로 읽어 줍니다.', '-', 'string'],
    [
        'SemicircleRatingData',
        'label / description',
        '가운데 등급(48 Bold)과 설명(16 Bold)입니다.',
        '-',
        'string / string',
    ],
    ['SemicircleRatingData', 'percentage', '채움 비율(0~100)입니다. 범위 밖 값은 끝으로 맞춥니다.', '-', 'number'],
    [
        'SemicircleRatingData',
        'details',
        '원호 아래 날짜 목록입니다. 비우면 목록을 두지 않습니다.',
        '-',
        '{label; value}[]',
    ],
] as const

const SemicircleRatingGaugeGuidePage = () => (
    <GuidePageShell
        title="등급 원호 게이지 (SemicircleRatingGauge)"
        description="등급을 위가 열린 굵은 원호로 보여 주고, 가운데에 등급 · 설명, 아래에 기준 날짜 목록을 두는 게이지입니다."
    >
        <BaseCard>
            <section aria-labelledby="srg-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="srg-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 기업신용등급 카드와 같은 구성입니다.
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="srg-shape" className="typo-h4-bold">
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
            <section aria-labelledby="srg-grades" className="flex flex-col gap-4">
                <div>
                    <h2 id="srg-grades" className="typo-h4-bold">
                        등급별 (Grades)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        CRI 24개 등급을 바꿔 채움 비율 · 등급명 · 등급정의를 확인합니다. 색은 등급과 무관하게 파랑
                        하나입니다.
                    </p>
                </div>
                <div className="bg-surface border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                    <RatingScenarioDemo />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-cri" className="flex flex-col gap-4">
                <div>
                    <h2 id="srg-cri" className="typo-h4-bold">
                        CRI 등급표 (Grades)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        게이지의 등급명 · 채움 비율은 이 표(content/service/cri-grades.ts)가 단일 소스입니다. 가운데
                        설명은 &apos;등급명 + 등급&apos;이고, 평가 등급 22개(AAA+ ~ D)는 위에서부터 100 → 0 으로 고르게
                        나눈 비율로 채웁니다. R(유보) · NR(평가 제외)은 채움 없이 등급명만(&apos;등급&apos; 없이)
                        보입니다. 표에 없는 코드는 &apos;등급 코드 확인 필요&apos;로 보입니다(아래 특이 케이스).
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full min-w-160 text-left">
                        <caption className="sr-only">CRI 등급 정의 및 등급명</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                {['CRI 등급', '등급명', '게이지 설명', '채움 비율', '등급정의'].map((heading) => (
                                    <th
                                        key={heading}
                                        scope="col"
                                        className="typo-body-l-medium px-4 py-3 whitespace-nowrap"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {CRI_GRADES.map((item) => (
                                <tr key={item.grade} className="border-border border-b last:border-b-0">
                                    <th scope="row" className="typo-body-l-bold text-foreground px-4 py-3 font-mono">
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="srg-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        비율 · 글자 길이 · 목록 유무 · 폭이 달라 배치가 흔들릴 수 있는 경우입니다. 모두 컴포넌트가
                        처리하므로 받은 값을 그대로 넣으면 됩니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <SemicircleRatingGauge
                                data={item.data}
                                title="기업신용등급"
                                ariaLabel={`기업신용등급 ${item.data.label}, ${item.data.description}`}
                            />
                        </li>
                    ))}
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">좁은 폭 (200)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="srg-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">ChartSkeleton type=&quot;gauge&quot;</code>
                        를 같은 자리에 둡니다. 같은 원호 경로와 가운데 · 날짜 목록 줄을 써서 불러온 뒤 자리가 흔들리지
                        않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="gauge" label="기업신용등급을 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <SemicircleRatingGauge
                            data={REPORT_DATA}
                            title="기업신용등급"
                            ariaLabel="기업신용등급 A, 우량 등급"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="srg-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 등급 코드를 toCriRatingData 로 바꿔 넘깁니다 — 등급명 · 채움 비율은 CRI 등급표에서
                        찾습니다. 색은 컴포넌트가 정합니다(파랑 하나).
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="SemicircleRatingGauge 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="srg-props" className="flex flex-col gap-4">
                <h2 id="srg-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="SemicircleRatingGauge 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SemicircleRatingGaugeGuidePage
