// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {PRIVATE_SHORT_LABEL, PrivateCell, PrivateContent} from '@/components/composite/private-content'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Card, ReportTable} from '@/components/custom/innovation-growth-report-parts'
import {ListMarker} from '@/components/custom/list-marker'
import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'
import PropsTable from '@/components/custom/props-table'
import {RatioStackBar} from '@/components/custom/ratio-stack-bar'

export const metadata: Metadata = {title: '비공개 정보 (PrivateContent)'}

// 자리 표시 값 — 모양만 남기는 임의 값이다(실제 값이 아니다).
const PLACEHOLDER_REGISTRY_COLUMNS = [
    {key: 'number', label: '법인등록번호'},
    {key: 'status', label: '법인등기상태'},
    {key: 'audit', label: '외부감사여부'},
    {key: 'month', label: '결산월'},
]
const PLACEHOLDER_REGISTRY_ROWS = [
    {id: 'placeholder', cells: {number: '000000-0000000', status: '정상', audit: '여', month: '12월'}},
]
const PLACEHOLDER_INSTITUTION_ROWS = ['은행업권', '상호금융업권', '저축은행업권', '카드/캐피탈업권', '대부업권'].map(
    (label, index) => ({id: label, cells: {label, y1: '00.0', y2: '00.0', y3: index % 2 ? '-' : '00.0'}}),
)
const PLACEHOLDER_DONUT = [
    {id: 'a', label: '구분 1', percentage: 50, valueLabel: '00%', color: 'var(--raw-navy-500)'},
    {id: 'b', label: '구분 2', percentage: 25, valueLabel: '00%', color: 'var(--raw-blue-500)'},
    {id: 'c', label: '구분 3', percentage: 25, valueLabel: '00%', color: 'var(--raw-blue-300)'},
]

const USAGE_CODE = `import {PrivateContent} from '@/components/composite/private-content'

// 카드째 가린다 — 제목까지 흐리게 깔리고 가운데에 안내가 뜬다.
<PrivateContent>
  <Card title="기관별 비중" aside="단위 : %">
    {/* 모양이 비슷한 임의 값의 표 · 그래프 */}
  </Card>
</PrivateContent>`

const COLUMN_CODE = `import {PRIVATE_SHORT_LABEL, PrivateCell} from '@/components/composite/private-content'

// 표의 열 하나만 가린다 — 그 열의 머리 · 값 칸마다 PrivateCell 로 감싸고, 안내는 한 칸(값 칸)에만 둔다.
<ReportTable
  caption="단기연체정보"
  columns={[
    {key: 'date', label: '발생일자'},
    {key: 'amount', label: <PrivateCell>연체금액</PrivateCell>},
    {key: 'org', label: '등록기관'},
  ]}
  rows={[{id: 'row', cells: {date: '2023-11-06', amount: <PrivateCell label={PRIVATE_SHORT_LABEL}>000,000</PrivateCell>, org: '부산은행'}}]}
/>`

const DATA_CODE = `// [프론트엔드 연동] 비공개 여부는 API 가 준다. 비공개면 실제 값을 넘기지 말고 임의의 자리 표시 값으로 채운다 —
// 흐려도 실제 값이 문서(DOM)에 남으면 복사 · 개발자 도구로 읽힌다.
{institution.isPrivate ? (
  <PrivateContent>
    <InstitutionCard data={INSTITUTION_PLACEHOLDER} />
  </PrivateContent>
) : (
  <InstitutionCard data={institution} />
)}`

const SHAPE_RULES = [
    '흐린 자리 표시(blur-sm) 위에 흰 면 80%(bg-card/80)를 덮고, 가운데에 안내 20 Medium(gray.900)을 둡니다.',
    '카드 · 표 덩어리는 PrivateContent 로 통째로 감쌉니다. 카드 제목까지 가리려면 카드째 감쌉니다. 안내 기본값은 “정책에 따라 비공개 처리된 정보입니다.”입니다.',
    '표처럼 좁은 자리는 안내를 “비공개”로 줄입니다(label).',
    '열 하나만 가릴 때는 그 열의 머리 · 값 칸마다 PrivateCell 을 씁니다. 가림 면이 칸 여백까지 덮어 열이 한 덩어리로 보이고, 안내는 한 칸에만 둡니다.',
    '자리 표시는 화면 낭독기 · 키보드에서 빠지고(aria-hidden · inert) 안내 글만 읽힙니다. 안내가 없는 칸은 “비공개”를 숨김 글로 읽습니다.',
] as const

const PROPS_ITEMS = [
    [
        'PrivateContent',
        'children',
        '흐리게 깔 자리 표시(임의 값)입니다. 원래 자리의 모양을 남깁니다.',
        '-',
        'ReactNode',
    ],
    [
        'PrivateContent',
        'label',
        '안내 글입니다. 좁은 자리는 PRIVATE_SHORT_LABEL(“비공개”)을 넘깁니다.',
        "'정책에 따라 비공개 처리된 정보입니다.'",
        'string',
    ],
    ['PrivateContent', 'className', '바깥 상자 클래스(높이 등)입니다. 최소 높이 96 을 지킵니다.', '-', 'string'],
    ['PrivateCell', 'children', '칸에 흐리게 깔 자리 표시입니다.', '-', 'ReactNode'],
    ['PrivateCell', 'label', '칸 가운데 안내입니다. 열에서 한 칸에만 넘깁니다.', '-', 'string'],
] as const

const PrivateContentGuidePage = () => (
    <GuidePageShell
        title="비공개 정보 (PrivateContent)"
        description="정책상 보여 줄 수 없는 값을 흐린 자리 표시와 흰 가림 면으로 가리고 안내를 띄웁니다. EmptyState 처럼 값 대신 안내를 보이되, 원래 자리의 모양은 남깁니다."
    >
        <BaseCard>
            <section aria-labelledby="pc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="pc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서 신용/재무정보 탭의 비공개 카드입니다. 열람
                        케이스(report.viewerCase)에 따라 보고서 화면에 적용됩니다.
                    </p>
                </div>
                <PrivateContent>
                    <Card title="기관별 비중" aside="단위 : %">
                        <div className="grid gap-12 xl:grid-cols-2">
                            <ReportTable
                                caption="자리 표시"
                                minWidthClassName="min-w-0"
                                columns={[
                                    {key: 'label', label: '구분', isRowHeader: true},
                                    {key: 'y1', label: '2022년'},
                                    {key: 'y2', label: '2023년'},
                                    {key: 'y3', label: '2024년'},
                                ]}
                                rows={PLACEHOLDER_INSTITUTION_ROWS}
                            />
                            <PercentageDonutChart
                                animate={false}
                                showTooltip={false}
                                data={PLACEHOLDER_DONUT}
                                ariaLabel="자리 표시"
                            />
                        </div>
                    </Card>
                </PrivateContent>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="pc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="pc-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="pc-cases" className="typo-h4-bold">
                        케이스 (Cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        가리는 범위(카드 · 표 · 열)와 자리 크기에 따라 나눈 경우입니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    <li className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">반쪽 카드 — 그래프 · 비율 막대</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            카드가 좁아 긴 안내가 접히면 어절 단위로 두 줄이 됩니다.
                        </p>
                        <PrivateContent className="max-w-147">
                            <Card title="신용/담보 비중" aside="단위 : %">
                                <div className="bg-surface-subtle h-49 rounded-sm" />
                                <RatioStackBar
                                    data={[
                                        {id: 'a', label: '신용', value: 50, color: 'var(--raw-blue-500)'},
                                        {id: 'b', label: '담보', value: 50, color: 'var(--raw-mint-700)'},
                                    ]}
                                />
                            </Card>
                        </PrivateContent>
                    </li>
                    <li className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">표 전체 — 짧은 안내</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            표 자리는 좁아 안내를 “비공개”로 줄입니다. 표 제목(상태 글 포함)은 가리지 않습니다.
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="typo-body-l-medium">
                                법인등기정보 <span className="typo-body-l-regular text-foreground-subtle">정상</span>
                            </p>
                            <PrivateContent label={PRIVATE_SHORT_LABEL} className="min-h-0">
                                <ReportTable
                                    caption="자리 표시"
                                    minWidthClassName="min-w-0"
                                    columns={PLACEHOLDER_REGISTRY_COLUMNS}
                                    rows={PLACEHOLDER_REGISTRY_ROWS}
                                />
                            </PrivateContent>
                        </div>
                    </li>
                    <li className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">표의 열 하나</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            가릴 열의 머리 · 값 칸마다 PrivateCell 을 쓰고, 안내는 값 칸 하나에만 둡니다. 다른 열은
                            그대로 보입니다.
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="typo-body-l-medium">
                                단기연체정보{' '}
                                <span className="typo-body-l-regular text-foreground-subtle">해당없음</span>
                            </p>
                            <ReportTable
                                caption="단기연체정보 — 연체금액 비공개"
                                minWidthClassName="min-w-0"
                                columns={[
                                    {key: 'date', label: '발생일자'},
                                    {key: 'release', label: '해제일자'},
                                    {key: 'amount', label: <PrivateCell>연체금액</PrivateCell>},
                                    {key: 'org', label: '등록기관'},
                                    {key: 'base', label: '조회기준일자'},
                                ]}
                                rows={[
                                    {
                                        id: 'row',
                                        cells: {
                                            date: '2023-11-06',
                                            release: '2024-11-06',
                                            amount: <PrivateCell label={PRIVATE_SHORT_LABEL}>000,000</PrivateCell>,
                                            org: '부산은행',
                                            base: '2023-12-06',
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </li>
                    <li className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">자리 표시 없음</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            깔 모양이 없으면 최소 높이 96 의 빈 자리에 안내만 둡니다 — 가림 면이 0 높이로 사라지지
                            않습니다.
                        </p>
                        <PrivateContent className="border-subtle-3 rounded-sm border" />
                    </li>
                    <li className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">긴 안내</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            좁은 자리에서 긴 안내는 어절 단위로 접혀 가운데 정렬로 남습니다.
                        </p>
                        <PrivateContent
                            className="border-subtle-3 max-w-80 rounded-sm border"
                            label="정보 제공 기관의 요청에 따라 이 항목은 보고서에서 비공개 처리되었습니다."
                        />
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-column" className="flex flex-col gap-4">
                <div>
                    <h2 id="pc-column" className="typo-h4-bold">
                        열 하나 가리기 (PrivateCell)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        보고서 표(ReportTable)는 머리 칸 글에도 요소를 받으므로 그 열의 머리 · 값 칸을 PrivateCell 로
                        감쌉니다.
                    </p>
                </div>
                <CodeBlock code={COLUMN_CODE} language="tsx" copyLabel="PrivateCell 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="pc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        비공개면 실제 값 대신 임의의 자리 표시 값으로 채워 감쌉니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="PrivateContent 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-props" className="flex flex-col gap-4">
                <h2 id="pc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="PrivateContent · PrivateCell 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PrivateContentGuidePage
