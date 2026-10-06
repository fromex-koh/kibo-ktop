// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {InfoTable} from '@/components/composite/info-table'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

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
        description="이름 칸과 값 칸을 한 줄에 두 쌍씩 놓는 조회용 표입니다. 기업 정보처럼 '항목: 값' 쌍을 보여 줄 때 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="info-table-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
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
                <div className="flex max-w-4xl flex-col gap-2">
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
            <section aria-labelledby="info-table-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="info-table-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="InfoTable · SummaryList 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
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
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
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
