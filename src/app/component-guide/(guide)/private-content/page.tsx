// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {PRIVATE_SHORT_LABEL, PrivateCell, PrivateContent} from '@/components/composite/private-content'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Card, ReportTable} from '@/components/custom/innovation-growth-report-parts'
import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'
import PropsTable from '@/components/custom/props-table'
import {RatioStackBar} from '@/components/custom/ratio-stack-bar'
import {Table} from '@/components/custom/table'

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

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {PrivateContent} from '@/components/composite/private-content'

<PrivateContent>
  <Card title="기관별 비중" aside="단위 : %">
    {/* 실제 값이 아닌, 모양만 비슷한 임의 값의 표 · 그래프 */}
  </Card>
</PrivateContent>`

const COLUMN_CODE = `import {PRIVATE_SHORT_LABEL, PrivateCell} from '@/components/composite/private-content'

// 가릴 열의 머리 · 값 칸마다 PrivateCell 로 감싸고, 안내(label)는 값 칸 한 곳에만 둔다
<ReportTable
  caption="단기연체정보"
  columns={[
    {key: 'date', label: '발생일자'},
    {key: 'amount', label: <PrivateCell>연체금액</PrivateCell>},
  ]}
  rows={[
    {id: 'row', cells: {date: '2023-11-06', amount: <PrivateCell label={PRIVATE_SHORT_LABEL}>000,000</PrivateCell>}},
  ]}
/>`

const DATA_CODE = `// 비공개 여부는 API 가 준다. 비공개면 실제 값 대신 임의의 자리 표시 값을 넘긴다
{institution.isPrivate ? (
  <PrivateContent>
    <InstitutionCard data={INSTITUTION_PLACEHOLDER} />
  </PrivateContent>
) : (
  <InstitutionCard data={institution} />
)}`

const CHOICE_COLUMNS = [
    {key: 'case', header: '가리는 범위', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'private-content',
        cells: [
            '카드 · 표 · 그래프 덩어리 전체',
            <code key="component">PrivateContent</code>,
            '카드 제목까지 가리려면 카드째 감쌉니다. 표 제목처럼 보여 줄 부분은 바깥에 둡니다.',
        ],
    },
    {
        key: 'private-cell',
        cells: [
            '표의 열 하나',
            <code key="component">PrivateCell</code>,
            '그 열의 머리 · 값 칸마다 감쌉니다. 가림 면이 칸 여백까지 덮어 열이 한 덩어리로 보입니다.',
        ],
    },
    {
        key: 'empty-state',
        cells: [
            '값이 없거나 조회 결과가 없음',
            <Link key="component" href="/component-guide/empty-state" className={LINK_CLASS}>
                EmptyState
            </Link>,
            '비공개가 아니라 데이터가 없는 경우입니다. 원래 자리의 모양을 남기지 않습니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'PrivateContent',
        'children',
        '흐리게 깔 자리 표시(임의 값)입니다. 비우면 안내만 나옵니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'PrivateContent',
        'label',
        '안내 글입니다. 좁은 자리는 PRIVATE_SHORT_LABEL(“비공개”)을 넘깁니다.',
        'PRIVATE_CARD_LABEL',
        'string',
    ],
    [
        'PrivateContent',
        'className · 나머지',
        '바깥 div 의 속성입니다. 최소 높이 24(96px)가 기본이며 className 으로 바꿉니다.',
        'undefined',
        "ComponentPropsWithoutRef<'div'>",
    ],
    ['PrivateCell', 'children', '칸에 흐리게 깔 자리 표시입니다.', 'undefined', 'ReactNode'],
    [
        'PrivateCell',
        'label',
        '칸 가운데에 보일 안내입니다. 열에서 한 칸에만 넘기고, 없으면 “비공개”가 화면 낭독기에만 읽힙니다.',
        'undefined',
        'string',
    ],
    ['PrivateCell', 'className', '칸 안쪽 상자에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const SUB_LIST = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const PrivateContentGuidePage = () => (
    <GuidePageShell
        title="비공개 정보 (PrivateContent)"
        description="정책상 보여 줄 수 없는 값을 흐린 자리 표시와 흰 가림 면으로 덮고 안내를 띄웁니다. 원래 자리의 모양(표 · 그래프 · 카드)은 남깁니다."
    >
        <BaseCard>
            <section aria-labelledby="pc-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        가릴 덩어리를 <code>PrivateContent</code> 로 감쌉니다. 흐린 자리 표시 위에 흰 면(
                        <code>bg-card/80</code>)이 덮이고 가운데에 안내가 놓입니다. 안내 기본값은 “정책에 따라 비공개
                        처리된 정보입니다.”입니다.
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
            <section aria-labelledby="pc-cases" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pc-cases" className="typo-h4-bold">
                        범위별 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        가리는 범위와 자리 크기에 따라 <code>label</code> · <code>className</code> 을 조정합니다.
                    </p>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">반쪽 카드</h3>
                        <p className="typo-body-l-regular text-label-foreground">
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
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">표 전체 — 짧은 안내</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            좁은 자리는 <code>label</code> 에 <code>PRIVATE_SHORT_LABEL</code>(“비공개”)을 넘기고, 표
                            제목은 바깥에 두어 가리지 않습니다. 감쌀 내용이 낮으면 <code>min-h-0</code> 로 최소 높이를
                            없앱니다.
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
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">표의 열 하나 (PrivateCell)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            가릴 열의 머리 · 값 칸마다 <code>PrivateCell</code> 을 쓰고 안내는 값 칸 한 곳에만 둡니다.
                            다른 열은 그대로 보입니다.
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
                        <CodeBlock code={COLUMN_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">자리 표시 없음</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>children</code> 이 없으면 최소 높이의 빈 자리에 안내만 놓입니다.
                        </p>
                        <PrivateContent className="border-subtle-3 rounded-sm border" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">긴 안내</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            좁은 자리에서 긴 안내는 어절 단위로 접혀 가운데 정렬됩니다.
                        </p>
                        <PrivateContent
                            className="border-subtle-3 max-w-80 rounded-sm border"
                            label="정보 제공 기관의 요청에 따라 이 항목은 보고서에서 비공개 처리되었습니다."
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        비공개면 실제 값을 넘기지 말고 임의의 자리 표시 값으로 채웁니다. 흐려도 실제 값이 DOM 에 남으면
                        복사나 개발자 도구로 읽힙니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">가리는 범위와 사유로 고릅니다.</p>
                </div>
                <Table
                    caption="PrivateContent · PrivateCell · EmptyState 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        자리 표시는 <code>aria-hidden</code> · <code>inert</code> 로 화면 낭독기와 키보드에서 빠지고
                        안내 글만 읽힙니다[8.2.1].
                    </li>
                    <li>
                        <code>label</code> 이 없는 <code>PrivateCell</code> 은 “비공개”를 <code>sr-only</code> 로 읽게
                        합니다. 열에서 모든 칸에 안내를 보이면 반복되므로 한 칸에만 둡니다.
                    </li>
                    <li>
                        안내 글은 <code>text-foreground</code> 로 흰 가림 면 위에서 본문 대비를 지킵니다[5.3.3].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PrivateContent · PrivateCell Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PrivateContentGuidePage
