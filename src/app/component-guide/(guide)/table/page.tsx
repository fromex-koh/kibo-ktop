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
import {Badge} from '@/components/ui/badge'

<Table
  caption="이용권 사용 이력"
  columns={[
    {key: 'name', header: '상품명', align: 'start'},
    {key: 'date', header: '사용일시'},
    {key: 'used', header: '차감 횟수'},
    {key: 'left', header: '남은 횟수'},
    {key: 'status', header: '상태'},
    {key: 'detail', header: '상세'},
  ]}
  rows={[
    {
      key: 'r1',
      cells: [
        'K-BIGx 보고서 이용권', '2024.05.18 14:23', '-1회', '15회',
        <Badge variant="solid-pastel" color="info" shape="round" size="sm">차감완료</Badge>,
        <Button variant="tertiary" size="sm">상세</Button>,
      ],
    },
  ]}
/>`

const detailButton = (
    <Button variant="tertiary" size="sm">
        상세
    </Button>
)

// 데이터 표 컬럼(Figma "이용권 이력") — 상품명만 좌측, 나머지는 중앙.
const LEDGER_COLUMNS = [
    {key: 'name', header: '상품명', align: 'start'},
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

// 좌측 정렬 텍스트 표 예시 — 긴 설명엔 align:'start' 를 쓴다.
const NOTE_COLUMNS = [
    {key: 'name', header: '항목', align: 'start'},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const NOTE_ROWS = [
    {key: 'n1', cells: ['월 무료 제공', '기업회원에 한해 자가진단용 평가를 월 1회 무료로 제공합니다.']},
    {key: 'n2', cells: ['결과 확인', '제출한 결과는 진행현황 화면에서 확인할 수 있습니다.']},
]

const PROPS_ITEMS = [
    ['Table', 'caption', '표의 접근 가능한 이름입니다(sr-only caption).', '-', 'string'],
    [
        'Table',
        'columns',
        '열 정의 배열. { key, header, align, wrap }. align 은 정렬(기본 center), wrap 은 셀 줄바꿈 허용(기본 false — 한 줄 고정, 넘치면 가로 스크롤).',
        '-',
        'TableColumn[]',
    ],
    [
        'Table',
        'rows',
        '행 배열. { key, cells }. cells 는 열 순서대로의 ReactNode(배지·버튼 등 가능).',
        '-',
        'TableRowData[]',
    ],
    [
        'Table',
        'variant',
        '표 스타일 변형. 현재 line(상·하단 굵은 라인) 하나이며, 추후 다른 표 스타일이 생기면 확장됩니다.',
        "'line'",
        "'line'",
    ],
    ['Table', 'className', '컨테이너에 추가할 클래스입니다.', 'undefined', 'string'],
] as const

// 테이블 — 컴포넌트 가이드 문서 전용 데이터 표(데이터 주도 columns·rows). Figma "이용권 이력 표" 반영.
const TableGuidePage = () => (
    <GuidePageShell
        title="테이블 (Table)"
        description="컴포넌트 가이드 등 문서 화면에서 데이터를 행/열로 보여주는 표입니다. columns·rows 로 데이터를 넘기고, 셀은 ReactNode라 배지·버튼도 그대로 넣습니다."
    >
        <BaseCard>
            <section aria-labelledby="tb-scope" className="flex flex-col gap-2">
                <h2 id="tb-scope" className="typo-h4-bold">
                    사용 범위
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    이 표 스타일은 <strong className="text-foreground">컴포넌트 가이드 문서 페이지 전용</strong>입니다.
                    실제 프로젝트 화면에는 사용하지 않으며, 프로젝트에서 쓰는 표는 별도 스타일로 정의합니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tb-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="tb-data" className="typo-h4-bold">
                        데이터 표
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        헤더는 옅은 회색 배경 + 굵은 제목, 본문은 회색 텍스트로 표시되고 행 사이에 옅은 구분선이
                        들어갑니다. 상태·상세처럼 셀에 배지·버튼 컴포넌트를 그대로 넣을 수 있습니다.
                    </p>
                </div>
                <Table caption="이용권 사용 이력" columns={LEDGER_COLUMNS} rows={LEDGER_ROWS} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tb-align" className="flex flex-col gap-4">
                <div>
                    <h2 id="tb-align" className="typo-h4-bold">
                        정렬 (align)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        셀은 기본 가운데 정렬이고 한 줄로 고정(넘치면 가로 스크롤)됩니다. 긴 설명 텍스트처럼 왼쪽
                        정렬·줄바꿈이 자연스러운 열은 열 정의에{' '}
                        <code className="font-mono">align: &apos;start&apos;</code>와{' '}
                        <code className="font-mono">wrap: true</code>를 줍니다.
                    </p>
                </div>
                <Table caption="정렬 예시" columns={NOTE_COLUMNS} rows={NOTE_ROWS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tb-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="tb-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Table 에 넘기는 속성입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Table 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TableGuidePage
