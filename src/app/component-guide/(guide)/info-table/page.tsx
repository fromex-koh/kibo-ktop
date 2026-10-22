// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {InfoTable} from '@/components/composite/info-table'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BothHeadTypeDemo, HorizontalTypeDemo, SplitValueTypeDemo, VerticalTypeDemo} from './info-table-types'

export const metadata: Metadata = {title: '정보 표 (InfoTable)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const COMPANY_ITEMS = [
    {label: '기업명', value: '프롬엑스테크'},
    {label: '대표자', value: '홍길동'},
    {label: '기업유형/형태', value: '유가증권시장/법인기업'},
    {label: '표준산업분류', value: '(C26299) 그 외 기타 전자부품 제조업'},
    {label: '대표기술분야', value: '-'},
    {label: '주요제품', value: '5G통신 및 IoT 관련 서비스'},
] as const

const USAGE_CODE = `import {InfoTable} from '@/components/composite/info-table'

<InfoTable
  aria-label="기업 정보"
  items={[
    {label: '기업명', value: '프롬엑스테크'},
    {label: '대표자', value: '홍길동'},
  ]}
/>`

const PAIRS_CODE = `<InfoTable aria-label="기업 정보" layout="pairs" items={items} />`

const TYPE_COLUMNS = [
    {key: 'type', header: '유형', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'how', header: '만드는 법', align: 'start', wrap: true},
] as const

const TYPE_ROWS = [
    {
        key: 'horizontal',
        cells: [
            '가로형 (horizontal)',
            '맨 윗줄이 열 머리이고, 아래로 여러 건이 쌓입니다.',
            'ui/table + 아래 스타일 상수',
        ],
    },
    {
        key: 'vertical',
        cells: [
            '세로형 (vertical)',
            '줄마다 왼쪽이 머리, 오른쪽이 값입니다(한 건의 상세).',
            <span key="how">
                한 줄에 한 쌍이면 ui/table, 여러 쌍을 촘촘히 두면 <code>InfoTable</code>
            </span>,
        ],
    },
    {
        key: 'th-multi',
        cells: [
            '행·열 머리 (th_multi)',
            '윗줄은 열 머리, 왼쪽 칸은 행 머리입니다. 행 머리는 Medium 으로 열 머리(Bold)와 구분합니다.',
            'ui/table + 행 머리에 infoTableRowHeadClassName',
        ],
    },
    {
        key: 'td-multi',
        cells: [
            '값 칸 나눔 (td_multi)',
            '세로형에서 한 머리 아래 값이 여러 칸 · 여러 줄로 나뉩니다.',
            '머리 칸 rowSpan · 다른 줄의 값 칸 colSpan',
        ],
    },
] as const

const STYLE_COLUMNS = [
    {key: 'name', header: '상수', align: 'start', rowHeader: true},
    {key: 'target', header: '붙이는 곳', align: 'start'},
    {key: 'look', header: '모양', align: 'start', wrap: true},
] as const

const STYLE_ROWS = [
    {
        key: 'table',
        cells: [<code key="n">infoTableClassName</code>, 'Table', '위 진한 선 · 열 폭 균등(table-fixed)'],
    },
    {
        key: 'row',
        cells: [<code key="n">infoTableRowClassName</code>, 'TableRow', '셸의 줄 아래 선 · hover 면을 끕니다.'],
    },
    {
        key: 'head',
        cells: [<code key="n">infoTableHeadClassName</code>, 'TableHead', '옅은 파란 면 · 14 Bold · 가운데'],
    },
    {
        key: 'row-head',
        cells: [<code key="n">infoTableRowHeadClassName</code>, 'TableHead', '열 머리와 함께 쓰는 행 머리 · 14 Medium'],
    },
    {
        key: 'cell',
        cells: [<code key="n">infoTableCellClassName</code>, 'TableCell', '카드 면 · 14 Regular · 가운데'],
    },
    {
        key: 'split',
        cells: [<code key="n">infoTableSplitCellClassName</code>, 'TableCell', '값 칸 나눔의 왼쪽 칸 · 오른쪽 세로 선'],
    },
] as const

const TYPE_IMPORT_CODE = `import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {
  infoTableCellClassName,
  infoTableClassName,
  infoTableHeadClassName,
  infoTableRowClassName,
  infoTableRowHeadClassName,
  infoTableSplitCellClassName,
} from '@/components/theme/info-table.variants'`

const HORIZONTAL_CODE = `<Table className={infoTableClassName}>
  <caption className="sr-only">결제 내역</caption>
  <TableHeader>
    <TableRow className={infoTableRowClassName}>
      <TableHead scope="col" className={infoTableHeadClassName}>결제일</TableHead>
      <TableHead scope="col" className={infoTableHeadClassName}>상품명</TableHead>
      <TableHead scope="col" className={infoTableHeadClassName}>결제금액</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className={infoTableRowClassName}>
      <TableCell className={infoTableCellClassName}>2026-09-17</TableCell>
      <TableCell className={infoTableCellClassName}>프리미엄</TableCell>
      <TableCell className={infoTableCellClassName}>1,100,000원</TableCell>
    </TableRow>
  </TableBody>
</Table>`

const VERTICAL_CODE = `<Table className={infoTableClassName}>
  <caption className="sr-only">기업 기본 정보</caption>
  <TableBody>
    <TableRow className={infoTableRowClassName}>
      <TableHead scope="row" className={infoTableHeadClassName}>기업명</TableHead>
      <TableCell className={infoTableCellClassName}>프롬엑스테크</TableCell>
    </TableRow>
  </TableBody>
</Table>`

const BOTH_HEAD_CODE = `<Table className={infoTableClassName}>
  <caption className="sr-only">연도별 재무 현황</caption>
  <TableHeader>
    <TableRow className={infoTableRowClassName}>
      <TableHead scope="col" className={infoTableHeadClassName}>구분</TableHead>
      <TableHead scope="col" className={infoTableHeadClassName}>2024년</TableHead>
      <TableHead scope="col" className={infoTableHeadClassName}>2025년</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className={infoTableRowClassName}>
      {/* 행 머리는 Medium */}
      <TableHead scope="row" className={infoTableRowHeadClassName}>매출액</TableHead>
      <TableCell className={infoTableCellClassName}>120억</TableCell>
      <TableCell className={infoTableCellClassName}>148억</TableCell>
    </TableRow>
  </TableBody>
</Table>`

const SPLIT_CODE = `<Table className={infoTableClassName}>
  <caption className="sr-only">기업 담당자 정보</caption>
  <TableBody>
    <TableRow className={infoTableRowClassName}>
      <TableHead scope="row" className={infoTableHeadClassName}>기업명</TableHead>
      {/* 나뉜 값 칸 수만큼 합친다 */}
      <TableCell colSpan={2} className={infoTableCellClassName}>프롬엑스테크</TableCell>
    </TableRow>
    <TableRow className={infoTableRowClassName}>
      {/* 값 줄 수만큼 합친다 */}
      <TableHead scope="row" rowSpan={2} className={infoTableHeadClassName}>담당자</TableHead>
      <TableCell className={infoTableSplitCellClassName}>김담당</TableCell>
      <TableCell className={infoTableCellClassName}>02-1234-5678</TableCell>
    </TableRow>
    <TableRow className={infoTableRowClassName}>
      <TableCell className={infoTableSplitCellClassName}>이영업</TableCell>
      <TableCell className={infoTableCellClassName}>02-2345-6789</TableCell>
    </TableRow>
  </TableBody>
</Table>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'info-table',
        cells: [
            "'항목: 값' 쌍을 문서 안에 촘촘히 보임",
            <code key="component">InfoTable</code>,
            '이름 칸과 값 칸이 한 줄에 두 쌍씩 놓이는 조회용 표입니다.',
        ],
    },
    {
        key: 'info-table-types',
        cells: [
            '열 머리 · 행 머리 · 칸 합치기가 필요하다',
            <code key="component">ui/table + info-table.variants</code>,
            '위 표 유형 네 가지입니다. 줄 수가 폭과 상관없이 같은 표입니다.',
        ],
    },
    {
        key: 'title-detail-table',
        cells: [
            '여러 건 × 여러 열, 제목이 길다',
            <Link key="component" href="/component-guide/title-detail-table" className={LINK_CLASS}>
                TitleDetailTable
            </Link>,
            '한 건을 제목 줄 + 상세 줄 두 줄로 보입니다(특허 목록).',
        ],
    },
    {
        key: 'summary-list',
        cells: [
            '카드형 목록으로 보임',
            <Link key="component" href="/component-guide/summary-list" className={LINK_CLASS}>
                SummaryList
            </Link>,
            '항목마다 카드 면을 두는 목록입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'InfoTable',
        'items',
        '이름 칸(label)과 값 칸(value) 쌍의 목록입니다. key 를 주면 목록 key 로 씁니다.',
        '-',
        'readonly {label: ReactNode; value: ReactNode; key?: string}[]',
    ],
    [
        'InfoTable',
        'layout',
        'responsive 는 xl 이상 두 쌍, 그 아래 한 쌍입니다. pairs 는 폭과 무관하게 늘 두 쌍이며 이름 칸이 w-40 입니다.',
        "'responsive'",
        "'responsive' | 'pairs'",
    ],
    ['InfoTable', 'className', 'dl 에 덧붙일 클래스입니다.', 'undefined', 'string'],
    [
        'InfoTable',
        '...props',
        'aria-label 등 나머지 dl 속성을 전달합니다.',
        '-',
        "Omit<ComponentPropsWithoutRef<'dl'>, 'children'>",
    ],
] as const

const InfoTableGuidePage = () => (
    <GuidePageShell
        title="정보 표 (InfoTable)"
        description="머리 칸과 값 칸으로 정보를 보여 주는 조회용 표입니다. InfoTable 과 가로형 · 세로형 · 행·열 머리 · 값 칸 나눔 네 유형을 다룹니다."
    >
        <BaseCard>
            <section aria-labelledby="info-table-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>xl</code> 이상은 한 줄에 두 쌍, 그 아래는 한 쌍씩 세로로 쌓입니다. 긴 값은 칸 안에서
                        줄바꿈되고 같은 줄의 칸이 함께 높아집니다. 창 폭을 줄여 확인해 보세요.
                    </p>
                </div>
                <InfoTable aria-label="기업 정보" items={COMPANY_ITEMS} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-variants" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-variants" className="typo-h4-bold">
                        배치 (layout)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면 전체가 PC 폭을 지키고 좁으면 가로로 넘기는 곳에서는 <code>pairs</code> 로 폭과 무관하게 두
                        쌍을 유지합니다.
                    </p>
                </div>
                <InfoTable aria-label="기업 정보(두 쌍 고정)" layout="pairs" items={COMPANY_ITEMS} />
                <CodeBlock code={PAIRS_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-types" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-types" className="typo-h4-bold">
                        표 유형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        InfoTable 로 담기 어려운 모양은 ui/table 에 아래 스타일 상수를 붙여 그립니다. 선 · 면 · 글자가
                        InfoTable 과 같아 한 화면에 섞여도 같은 표로 보입니다.
                    </p>
                </div>
                <Table caption="정보 표 유형" columns={TYPE_COLUMNS} rows={TYPE_ROWS} size="md" />
                <Table caption="정보 표 스타일 상수" columns={STYLE_COLUMNS} rows={STYLE_ROWS} size="md" />
                <CodeBlock code={TYPE_IMPORT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-horizontal" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-horizontal" className="typo-h4-bold">
                        1. 가로형 (horizontal)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        맨 윗줄 열 머리 아래로 여러 건을 쌓습니다. 결제 내역처럼 같은 항목을 가진 건이 여럿일 때 씁니다.
                    </p>
                </div>
                <HorizontalTypeDemo />
                <CodeBlock code={HORIZONTAL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-vertical" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-vertical" className="typo-h4-bold">
                        2. 세로형 (vertical)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        줄마다 머리 한 칸과 값 한 칸을 둡니다. 쌍이 많아 촘촘히 두려면 위의 InfoTable 을 씁니다.
                    </p>
                </div>
                <VerticalTypeDemo />
                <CodeBlock code={VERTICAL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-both-head" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-both-head" className="typo-h4-bold">
                        3. 행·열 머리 (th_multi)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        윗줄은 열 머리, 왼쪽 칸은 행 머리입니다. 행 머리는 Medium 으로 굵기를 낮춰 열 머리와 구분합니다.
                    </p>
                </div>
                <BothHeadTypeDemo />
                <CodeBlock code={BOTH_HEAD_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-split" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-split" className="typo-h4-bold">
                        4. 값 칸 나눔 (td_multi)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        한 머리 아래 값이 여러 칸 · 여러 줄이면 머리 칸을 rowSpan 으로 합치고, 나머지 줄의 값 칸은
                        colSpan 으로 폭을 맞춥니다. 나뉜 값 사이에는 세로 선을 둡니다.
                    </p>
                </div>
                <SplitValueTypeDemo />
                <CodeBlock code={SPLIT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-choice" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="InfoTable · TitleDetailTable · SummaryList 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        마크업은 정의 목록(<code>dl · dt · dd</code>)이라 스크린리더가 &apos;이름: 값&apos; 쌍으로
                        읽습니다[7.3.2][8.1.1].
                    </li>
                    <li>
                        표 이름은 <code>aria-label</code> 로 붙입니다.
                    </li>
                    <li>
                        표 유형은 <code>table</code> 마크업입니다. 표 이름은 <code>caption</code>(sr-only)으로, 열
                        머리는 <code>th scope=&quot;col&quot;</code>, 행 머리는 <code>th scope=&quot;row&quot;</code> 로
                        줍니다[7.3.2].
                    </li>
                    <li>
                        값 칸 나눔에서 <code>rowSpan</code> 으로 합친 행 머리는 합친 줄 전체의 값 칸에 이어져 읽힙니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="info-table-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="InfoTable Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default InfoTableGuidePage
