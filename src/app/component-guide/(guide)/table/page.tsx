// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '테이블 (Table)'}

const USAGE_CODE = `import {Table} from '@/components/custom/table'

<Table
  caption="이용권 사용 이력"
  columns={[
    {key: 'name', header: '상품명', align: 'start', rowHeader: true},
    {key: 'date', header: '사용일시'},
    {key: 'status', header: '상태'},
  ]}
  rows={[
    {
      key: 'r1',
      cells: [
        'K-BIGx 보고서 이용권',
        '2024.05.18 14:23',
        <Badge variant="solid-pastel" color="info" shape="round" size="sm">차감완료</Badge>,
      ],
    },
  ]}
/>`

const SIZE_CODE = `<Table size="lg" caption="큰 크기" columns={columns} rows={rows} />
<Table size="md" caption="중간 크기" columns={columns} rows={rows} />
<Table size="sm" caption="작은 크기" columns={columns} rows={rows} />`

const TEXT_CODE = `const columns = [
  {key: 'name', header: '항목', align: 'start', rowHeader: true},
  {key: 'desc', header: '설명', align: 'start', wrap: true},
]`

const detailButton = (
    <Button variant="tertiary" size="xs">
        상세
    </Button>
)

const LEDGER_COLUMNS = [
    {key: 'name', header: '상품명', align: 'start', rowHeader: true},
    {key: 'date', header: '사용일시'},
    {key: 'used', header: '차감 횟수'},
    {key: 'left', header: '남은 횟수'},
    {key: 'status', header: '상태'},
    {key: 'detail', header: '상세'},
] as const

const LEDGER_ROWS = [
    {
        key: 'r1',
        cells: [
            'K-BIGx 보고서 이용권',
            '2024.05.18 14:23',
            '-1회',
            '15회',
            <Badge key="b" variant="solid-pastel" color="info" shape="round" size="sm">
                차감완료
            </Badge>,
            detailButton,
        ],
    },
    {
        key: 'r2',
        cells: [
            '기술평가 이용권',
            '2024.05.10 09:12',
            '-1회',
            '3회',
            <Badge key="b" variant="solid-pastel" color="info" shape="round" size="sm">
                차감완료
            </Badge>,
            detailButton,
        ],
    },
    {
        key: 'r3',
        cells: [
            '특허평가 이용권',
            '2024.04.28 16:40',
            '-2회',
            '0회',
            <Badge key="b" variant="solid-pastel" color="neutral" shape="round" size="sm">
                소진
            </Badge>,
            detailButton,
        ],
    },
]

const NOTE_COLUMNS = [
    {key: 'name', header: '항목', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const NOTE_ROWS = [
    {key: 'n1', cells: ['월 무료 제공', '기업회원에 한해 자가진단용 평가를 월 1회 무료로 제공합니다.']},
    {key: 'n2', cells: ['결과 확인', '제출한 결과는 진행현황 화면에서 확인할 수 있습니다.']},
]

const PROPS_ITEMS = [
    ['Table', 'caption', '표의 이름입니다. 화면에는 보이지 않고 스크린리더가 읽습니다.', '-', 'string'],
    ['Table', 'columns', '열 정의 목록입니다.', '-', 'readonly TableColumn[]'],
    ['Table', 'rows', '행 목록입니다.', '-', 'readonly TableRowData[]'],
    ['Table', 'variant', '표 스타일입니다. 현재 상단 굵은 선 · 하단 얇은 선의 line 하나뿐입니다.', "'line'", "'line'"],
    ['Table', 'size', '글자 크기와 셀 여백입니다. sm 12px · md 14px · lg 16px.', "'lg'", "'sm' | 'md' | 'lg'"],
    ['Table', 'className', '바깥 스크롤 컨테이너에 덧붙일 클래스입니다.', 'undefined', 'string'],
    ['TableColumn', 'key', '열 식별 키입니다.', '-', 'string'],
    ['TableColumn', 'header', '열 제목입니다.', '-', 'ReactNode'],
    ['TableColumn', 'align', '헤더와 본문 셀의 정렬입니다.', "'center'", "'start' | 'center' | 'end'"],
    [
        'TableColumn',
        'wrap',
        '셀 줄바꿈 허용 여부입니다. false 면 한 줄로 고정되고 넘치면 가로 스크롤됩니다.',
        'false',
        'boolean',
    ],
    ['TableColumn', 'rowHeader', '이 열의 본문 셀을 행 머리글(th scope="row")로 렌더합니다.', 'false', 'boolean'],
    ['TableRowData', 'key', '행 식별 키입니다.', '-', 'string'],
    [
        'TableRowData',
        'cells',
        '열 순서대로의 셀입니다. 배지·버튼 등 ReactNode 를 넣을 수 있습니다.',
        '-',
        'readonly ReactNode[]',
    ],
    ['TableRowData', 'className', '행 단위로 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const TableGuidePage = () => (
    <GuidePageShell
        title="테이블 (Table)"
        description="columns · rows 로 데이터를 넘겨 그리는 표입니다. 셀에는 배지·버튼 같은 ReactNode 를 그대로 넣습니다."
    >
        <BaseCard>
            <section aria-labelledby="table-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="table-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        컴포넌트 가이드 같은 문서 화면 전용 표입니다. 서비스 화면의 표는 별도로 정의합니다.
                    </p>
                </div>
                <Table caption="이용권 사용 이력" columns={LEDGER_COLUMNS} rows={LEDGER_ROWS} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="table-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="table-variants" className="typo-h4-bold">
                        크기와 열 설정
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        크기는 <code>size</code>, 정렬·줄바꿈·행 머리글은 열 정의에서 정합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">크기 (size)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            크기가 작을수록 셀 여백도 함께 줄어듭니다.
                        </p>
                        <Table caption="큰 크기 표(lg, 기본)" columns={NOTE_COLUMNS} rows={NOTE_ROWS} />
                        <Table size="md" caption="중간 크기 표(md)" columns={NOTE_COLUMNS} rows={NOTE_ROWS} />
                        <Table size="sm" caption="작은 크기 표(sm)" columns={NOTE_COLUMNS} rows={NOTE_ROWS} />
                        <CodeBlock code={SIZE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">정렬 · 줄바꿈 (align · wrap)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            기본은 가운데 정렬 · 한 줄 고정입니다. 긴 설명 열에는 <code>align: &apos;start&apos;</code>{' '}
                            와 <code>wrap: true</code> 를 줍니다.
                        </p>
                        <CodeBlock code={TEXT_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="table-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="table-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>caption</code> 은 필수이며 sr-only 캡션으로 렌더됩니다[7.3.2].
                    </li>
                    <li>
                        열 제목은 <code>th scope=&quot;col&quot;</code> 입니다. 행을 대표하는 열에{' '}
                        <code>rowHeader</code> 를 주면 <code>th scope=&quot;row&quot;</code> 가 됩니다[7.3.2].
                    </li>
                    <li>한 줄 고정 열이 넘치면 표 컨테이너가 가로 스크롤됩니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="table-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="table-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Table Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TableGuidePage
