// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {TitleDetailTable} from '@/components/composite/title-detail-table'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '제목 · 상세 표 (TitleDetailTable)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const PATENT_COLUMNS = [
    {key: 'number', label: '출원번호'},
    {key: 'date', label: '출원일'},
    {key: 'applicant', label: '출원인'},
    {key: 'field', label: '기술분야'},
] as const

const PATENT_ROWS = [
    {
        key: 'patent-1',
        title: '차세대 이동통신 네트워크 환경에서',
        details: {number: '10-2024-0184164', date: '2025-12-01', applicant: '프롬엑스테크', field: '정보통신'},
    },
    {
        key: 'patent-2',
        title: '인공지능 기반 기업 신용 평가 모형 학습 방법 및 장치',
        details: {number: '10-2023-0098211', date: '2024-07-15', applicant: '프롬엑스테크', field: '인공지능'},
    },
] as const

// 엣지 케이스 ① 띄어쓰기 없는 긴 값 — 여러 분류 코드를 붙여 쓴 값.
const LONG_VALUE_COLUMNS = [
    {key: 'number', label: '출원번호'},
    {key: 'ipc', label: 'IPC 분류'},
] as const

const LONG_VALUE_ROWS = [
    {
        key: 'patent-ipc',
        title: '차세대 이동통신 네트워크 환경에서',
        details: {number: '10-2024-0184164', ipc: 'H04W72/04,H04W76/14,H04W88/02,G06Q40/03'},
    },
] as const

// 엣지 케이스 ② 상세 열이 많은 표 — 좁은 화면에서 칸이 빠르게 좁아진다.
const MANY_COLUMNS = [
    {key: 'number', label: '출원번호'},
    {key: 'date', label: '출원일'},
    {key: 'registration', label: '등록번호'},
    {key: 'registeredAt', label: '등록일'},
    {key: 'applicant', label: '출원인'},
    {key: 'field', label: '기술분야'},
] as const

const MANY_COLUMN_ROWS = [
    {
        key: 'patent-many',
        title: '차세대 이동통신 네트워크 환경에서',
        details: {
            number: '10-2024-0184164',
            date: '2025-12-01',
            registration: '10-2789012',
            registeredAt: '2026-03-02',
            applicant: '프롬엑스테크',
            field: '정보통신',
        },
    },
] as const

// 엣지 케이스 ③ 제목을 링크로 — 상세 화면으로 이동할 때. title 은 ReactNode 라 링크를 그대로 넘긴다.
const LINKED_ROWS = [
    {
        key: 'patent-link',
        title: (
            <Link href="/component-guide/title-detail-table" className={LINK_CLASS}>
                차세대 이동통신 네트워크 환경에서
            </Link>
        ),
        details: PATENT_ROWS[0].details,
    },
]

const EDGE_CODE = `// ③ 제목을 링크로 — title 은 ReactNode
rows={[{key: 'patent-1', title: <Link href={detailHref}>차세대 이동통신 …</Link>, details}]}

// ④ 건이 없으면 표 대신 EmptyState
{rows.length ? (
  <TitleDetailTable caption="특허 목록" titleLabel="특허명" columns={columns} rows={rows} />
) : (
  <EmptyState title="조회된 특허가 없습니다." />
)}`

const EDGE_CASE_COLUMNS = [
    {key: 'case', header: '경우', align: 'start', rowHeader: true},
    {key: 'how', header: '처리', align: 'start', wrap: true},
] as const

const EDGE_CASE_ROWS = [
    {
        key: 'long',
        cells: ['① 띄어쓰기 없는 긴 값', '칸 안에서 끊어 줄바꿈합니다(wrap-anywhere) — 표가 넓어지지 않습니다.'],
    },
    {
        key: 'many',
        cells: [
            '② 상세 열이 많음',
            '좁은 화면에서 칸이 빠르게 좁아집니다. 상세 열은 4개 안팎으로 두고, 더 필요하면 상세 화면으로 넘깁니다.',
        ],
    },
    {
        key: 'link',
        cells: ['③ 제목을 링크로', 'title 에 링크를 넘깁니다. 링크 글자가 곧 특허명이라 따로 이름표가 필요 없습니다.'],
    },
    {key: 'empty', cells: ['④ 건이 없음', '머리글만 남은 빈 표를 그리지 않고 EmptyState 로 안내합니다.']},
    {
        key: 'missing',
        cells: ['⑤ 값이 없는 칸', 'details 에 없거나 빈 값이면 빈 칸으로 그립니다 — 줄 높이 · 선은 그대로입니다.'],
    },
] as const

const USAGE_CODE = `import {TitleDetailTable} from '@/components/composite/title-detail-table'

<TitleDetailTable
  caption="특허 목록"
  titleLabel="특허명"
  columns={[
    {key: 'number', label: '출원번호'},
    {key: 'date', label: '출원일'},
    {key: 'applicant', label: '출원인'},
    {key: 'field', label: '기술분야'},
  ]}
  rows={[
    {
      key: 'patent-1',
      title: '차세대 이동통신 네트워크 환경에서',
      details: {number: '10-2024-0184164', date: '2025-12-01', applicant: '프롬엑스테크', field: '정보통신'},
    },
  ]}
/>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'title-detail-table',
        cells: [
            '여러 건 × 여러 열, 제목이 길다',
            <code key="component">TitleDetailTable</code>,
            '한 건을 제목 줄 + 상세 줄 두 줄로 보입니다(특허 목록).',
        ],
    },
    {
        key: 'info-table',
        cells: [
            "한 대상의 '항목: 값' 쌍",
            <Link key="component" href="/component-guide/info-table" className={LINK_CLASS}>
                InfoTable
            </Link>,
            '이름 칸과 값 칸이 한 줄에 두 쌍씩 놓이는 조회용 표입니다(기업 정보).',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['TitleDetailTable', 'caption', '표 이름입니다. 화면에는 숨기고 스크린리더가 읽습니다.', '-', 'string'],
    ['TitleDetailTable', 'titleLabel', '첫 머리 줄의 제목 열 이름입니다(예: 특허명).', '-', 'ReactNode'],
    [
        'TitleDetailTable',
        'columns',
        '둘째 줄의 상세 열 목록입니다. key 로 rows 의 details 값을 찾습니다.',
        '-',
        'readonly {key: string; label: ReactNode}[]',
    ],
    [
        'TitleDetailTable',
        'rows',
        '건 목록입니다. title 은 첫 줄, details 는 열 key 별 값입니다. 없는 값은 빈 칸으로 그립니다.',
        '-',
        'readonly {key: string; title: ReactNode; details: Record<string, ReactNode>}[]',
    ],
    ['TitleDetailTable', 'className', 'table 에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const TitleDetailTableGuidePage = () => (
    <GuidePageShell
        title="제목 · 상세 표 (TitleDetailTable)"
        description="한 건을 두 줄로 보이는 목록 표입니다. 첫 줄은 제목이 전체 폭을 쓰고, 둘째 줄은 들여 쓴 뒤 상세 값을 열마다 놓습니다."
    >
        <BaseCard>
            <section aria-labelledby="title-detail-table-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="title-detail-table-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        둘째 줄의 들여 쓴 칸은 위 선 없이 제목 줄과 이어져, 상세 값이 제목에 딸린 줄로 읽힙니다. 색 · 줄
                        높이는 InfoTable 과 같습니다.
                    </p>
                </div>
                <TitleDetailTable caption="특허 목록" titleLabel="특허명" columns={PATENT_COLUMNS} rows={PATENT_ROWS} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="title-detail-table-edge" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="title-detail-table-edge" className="typo-h4-bold">
                        엣지 케이스
                    </h2>
                </div>
                <Table
                    caption="TitleDetailTable 엣지 케이스"
                    columns={EDGE_CASE_COLUMNS}
                    rows={EDGE_CASE_ROWS}
                    size="md"
                />
                <div className="flex flex-col gap-3">
                    <h3 className="typo-title-m-bold text-foreground">① 띄어쓰기 없는 긴 값</h3>
                    <TitleDetailTable
                        caption="특허 목록(긴 분류 코드)"
                        titleLabel="특허명"
                        columns={LONG_VALUE_COLUMNS}
                        rows={LONG_VALUE_ROWS}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="typo-title-m-bold text-foreground">② 상세 열이 많음(6열) — 창 폭을 줄여 확인</h3>
                    <TitleDetailTable
                        caption="특허 목록(상세 6열)"
                        titleLabel="특허명"
                        columns={MANY_COLUMNS}
                        rows={MANY_COLUMN_ROWS}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="typo-title-m-bold text-foreground">③ 제목을 링크로</h3>
                    <TitleDetailTable
                        caption="특허 목록(제목 링크)"
                        titleLabel="특허명"
                        columns={PATENT_COLUMNS}
                        rows={LINKED_ROWS}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="typo-title-m-bold text-foreground">④ 건이 없음</h3>
                    <EmptyState title="조회된 특허가 없습니다." className="border-subtle-3 min-h-0 border-y py-10" />
                </div>
                <CodeBlock code={EDGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="title-detail-table-choice" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="title-detail-table-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="TitleDetailTable · InfoTable 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="title-detail-table-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="title-detail-table-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        표 이름은 숨김 <code>caption</code>, 열 머리는 <code>th scope=&quot;col&quot;</code> 입니다.
                    </li>
                    <li>
                        한 건은 <code>tbody</code> 하나(두 줄)이고, 값 칸은 <code>headers</code> 로 제목 · 열 머리와
                        잇습니다 — 스크린리더가 &apos;특허명, 출원번호: 값&apos; 처럼 읽습니다[7.3.2].
                    </li>
                    <li>
                        들여 쓴 빈 칸은 읽을 내용이 없어 <code>aria-hidden</code> 입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="title-detail-table-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="title-detail-table-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="TitleDetailTable Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TitleDetailTableGuidePage
