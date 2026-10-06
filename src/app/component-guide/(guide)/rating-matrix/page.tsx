// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {RatingMatrix, type RatingMatrixRow} from '@/components/custom/rating-matrix'

export const metadata: Metadata = {title: '등급 매트릭스 (RatingMatrix)'}

const REPORT_ROWS: RatingMatrixRow[] = [
    {id: 'sales-growth', label: '매출액증가율', rating: 'poor'},
    {id: 'operating-margin', label: '영업이익율', rating: 'normal'},
    {id: 'equity-ratio', label: '자기자본비율', rating: 'good'},
    {id: 'asset-turnover', label: '총자본회전율', rating: 'excellent'},
    {id: 'cash-flow', label: '현금흐름', rating: 'weak'},
]

const LONG_LABEL_ROWS: RatingMatrixRow[] = [
    {id: 'long-1', label: '매출액 증가율 (전년 대비)', rating: 'poor'},
    {id: 'long-2', label: '총자본회전율', rating: 'excellent'},
    {id: 'long-3', label: '이자보상배율(영업이익 기준)', rating: 'normal'},
]

const ALL_LEVEL_ROWS: RatingMatrixRow[] = [
    {id: 'all-weak', label: '취약', rating: 'weak'},
    {id: 'all-poor', label: '미흡', rating: 'poor'},
    {id: 'all-normal', label: '보통', rating: 'normal'},
    {id: 'all-good', label: '양호', rating: 'good'},
    {id: 'all-excellent', label: '우수', rating: 'excellent'},
]

const USAGE_CODE = `import {RatingMatrix, type RatingMatrixRow} from '@/components/custom/rating-matrix'

// rating: weak(취약) · poor(미흡) · normal(보통) · good(양호) · excellent(우수)
const rows: RatingMatrixRow[] = [
  {id: 'sales-growth', label: '매출액증가율', rating: 'poor'},
  {id: 'operating-margin', label: '영업이익율', rating: 'normal'},
]

<RatingMatrix ariaLabel="재무비율진단 — 항목별 수준" rows={rows} />`

const DATA_CODE = `// API 의 등급 이름을 rating 값으로 바꿔 넘긴다.
const RATING_BY_NAME = {취약: 'weak', 미흡: 'poor', 보통: 'normal', 양호: 'good', 우수: 'excellent'} as const

const rows: RatingMatrixRow[] = ratiosFromApi.map((item) => ({
  id: item.code,
  label: item.name,
  rating: RATING_BY_NAME[item.levelName],
}))`

const LOADING_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton'

<ChartSkeleton type="matrix" label="재무비율진단을 불러오는 중입니다." />`

const PROPS_ITEMS = [
    ['RatingMatrix', 'rows', '항목 목록입니다. 항목마다 한 칸에만 표시됩니다.', '-', 'readonly RatingMatrixRow[]'],
    ['RatingMatrix', 'ariaLabel', '표 이름입니다. 캡션(스크린리더용)으로 쓰입니다.', '-', 'string'],
    [
        'RatingMatrix',
        'className · div props',
        '바깥 div 의 네이티브 속성을 전달합니다. children 은 받지 않습니다.',
        'undefined',
        "ComponentPropsWithoutRef<'div'>",
    ],
    ['RatingMatrixRow', 'id', '항목 식별자입니다. key 로 쓰이므로 고유해야 합니다.', '-', 'string'],
    ['RatingMatrixRow', 'label', '항목 이름입니다.', '-', 'string'],
    [
        'RatingMatrixRow',
        'rating',
        '등급입니다. weak 취약 · poor 미흡 · normal 보통 · good 양호 · excellent 우수.',
        '-',
        "'weak' | 'poor' | 'normal' | 'good' | 'excellent'",
    ],
] as const

const RatingMatrixGuidePage = () => (
    <GuidePageShell
        title="등급 매트릭스 (RatingMatrix)"
        description="지표마다 다섯 단계(취약 · 미흡 · 보통 · 양호 · 우수) 중 한 칸에 색 원 체크를 두는 표입니다."
    >
        <BaseCard>
            <section aria-labelledby="rm-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rm-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        항목 칸과 등급 5칸으로 이루어지며, 항목마다 <code>rating</code> 에 해당하는 칸에 원이
                        표시됩니다. 원 색은 등급별로 고정되어 있습니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-96 rounded-sm border p-6">
                    <RatingMatrix ariaLabel="재무비율진단 — 항목별 수준" rows={REPORT_ROWS} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rm-variants" className="typo-h4-bold">
                        상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        등급, 항목명 길이, 폭이 달라도 컴포넌트가 배치를 맞춥니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">모든 등급</h3>
                        <p className="typo-body-l-regular text-label-foreground">다섯 등급의 원 색입니다.</p>
                        <RatingMatrix ariaLabel="모든 등급" rows={ALL_LEVEL_ROWS} className="max-w-96" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">긴 항목명</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            항목 칸 안에서 어절 단위로 줄바꿈되고 같은 줄의 칸 높이도 함께 늘어납니다.
                        </p>
                        <RatingMatrix ariaLabel="긴 항목명" rows={LONG_LABEL_ROWS} className="max-w-96" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">좁은 폭</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            항목 칸은 모바일 폭에서 줄어들고 등급 칸이 나머지 폭을 똑같이 나눕니다.
                        </p>
                        <RatingMatrix ariaLabel="좁은 폭" rows={REPORT_ROWS} className="max-w-70" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-loading" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rm-loading" className="typo-h4-bold">
                        로딩
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        데이터를 기다리는 동안에는 같은 자리에 <code>ChartSkeleton type=&quot;matrix&quot;</code> 를
                        둡니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중</h3>
                        <ChartSkeleton type="matrix" label="재무비율진단을 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="typo-title-m-bold text-foreground">불러온 뒤</h3>
                        <RatingMatrix ariaLabel="재무비율진단 — 항목별 수준" rows={REPORT_ROWS} />
                    </div>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rm-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        API 의 등급 이름을 <code>rating</code> 값으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rm-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        표 구조와 대체 텍스트는 컴포넌트가 처리합니다. 사용처는 <code>ariaLabel</code> 만 알맞게 넘기면
                        됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>caption</code> 과 <code>th scope=&quot;col|row&quot;</code> 로 구조화한 데이터 표입니다
                        [7.3.2].
                    </li>
                    <li>
                        색 원은 장식이라 숨기고 표시 칸마다 &quot;항목: 등급&quot; 글자를 스크린리더용으로 둡니다.
                        색만으로 등급을 전하지 않습니다[5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rm-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>rows</code> 와 <code>ariaLabel</code> 이 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="RatingMatrix Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RatingMatrixGuidePage
