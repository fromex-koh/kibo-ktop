// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {RatingMatrix, type RatingMatrixRow} from '@/components/custom/rating-matrix'

export const metadata: Metadata = {title: '등급 매트릭스 (RatingMatrix)'}

// K-BIGx 기업혁신성장 보고서 "재무비율진단" 카드와 같은 항목 · 등급이다.
const REPORT_ROWS: RatingMatrixRow[] = [
    {id: 'sales-growth', label: '매출액증가율', rating: 'poor'},
    {id: 'operating-margin', label: '영업이익율', rating: 'normal'},
    {id: 'equity-ratio', label: '자기자본비율', rating: 'good'},
    {id: 'asset-turnover', label: '총자본회전율', rating: 'excellent'},
    {id: 'cash-flow', label: '현금흐름', rating: 'weak'},
]

const USAGE_CODE = `import {RatingMatrix, type RatingMatrixRow} from '@/components/custom/rating-matrix'

// rating: weak(취약) · poor(미흡) · normal(보통) · good(양호) · excellent(우수)
const rows: RatingMatrixRow[] = [
  {id: 'sales-growth', label: '매출액증가율', rating: 'poor'},
  {id: 'operating-margin', label: '영업이익율', rating: 'normal'},
  {id: 'equity-ratio', label: '자기자본비율', rating: 'good'},
  {id: 'asset-turnover', label: '총자본회전율', rating: 'excellent'},
  {id: 'cash-flow', label: '현금흐름', rating: 'weak'},
]

<RatingMatrix ariaLabel="재무비율진단 — 항목별 수준" rows={rows} />`

const DATA_CODE = `// API 의 등급 이름을 rating 값으로 바꿔 넘긴다.
const RATING_BY_NAME = {취약: 'weak', 미흡: 'poor', 보통: 'normal', 양호: 'good', 우수: 'excellent'} as const

const rows: RatingMatrixRow[] = ratiosFromApi.map((item) => ({
  id: item.code,
  label: item.name,
  rating: RATING_BY_NAME[item.levelName],
}))`

const SHAPE_RULES = [
    '항목 칸 100(모바일 80) + 등급 5칸(취약 · 미흡 · 보통 · 양호 · 우수)이 나머지 폭을 똑같이 나눕니다. 세로선 없이 줄마다 아래 선(gray.100)만 둡니다.',
    '머리 줄은 14 Medium 가운데 · 높이 37, 항목 줄은 항목명 14 Medium 가운데 · 높이 40 입니다.',
    '해당 등급 칸에 지름 24 원 + 흰 체크를 둡니다. 원 색은 취약 gray.700 · 미흡 error.500 · 보통 orange.500 · 양호 mint.700 · 우수 blue.500(원호 게이지 범례와 같은 다섯 색)입니다.',
    '색만으로 읽히지 않게 표시 칸마다 화면 낭독기용 글자(항목: 등급)를 함께 둡니다.',
] as const

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

const PROPS_ITEMS = [
    [
        'RatingMatrix',
        'rows',
        '항목별 고유 id · 이름 · 등급입니다. 항목마다 한 칸에만 표시됩니다.',
        '-',
        'RatingMatrixRow[]',
    ],
    ['RatingMatrix', 'ariaLabel', '표 이름입니다. 캡션(화면 낭독기용)으로 쓰입니다.', '-', 'string'],
    [
        'RatingMatrix',
        'className · div props',
        '바깥 여백 등 네이티브 div 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
    [
        'RatingMatrixRow',
        'rating',
        '등급입니다 — weak 취약 · poor 미흡 · normal 보통 · good 양호 · excellent 우수.',
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
            <section aria-labelledby="rm-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="rm-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 재무비율진단 카드와 같은 구성입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-96 rounded-sm border p-6">
                    <RatingMatrix ariaLabel="재무비율진단 — 항목별 수준" rows={REPORT_ROWS} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="rm-shape" className="typo-h4-bold">
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
            <section aria-labelledby="rm-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="rm-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        등급 · 항목명 길이 · 폭이 달라 배치가 흔들릴 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">모든 등급</h3>
                        <p className="typo-body-m-regular text-muted-foreground">다섯 등급의 원 색을 한 번에 봅니다.</p>
                        <RatingMatrix ariaLabel="모든 등급" rows={ALL_LEVEL_ROWS} />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">긴 항목명</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            항목 칸 안에서 어절 단위로 접히고, 같은 줄의 칸이 함께 높아집니다.
                        </p>
                        <RatingMatrix ariaLabel="긴 항목명" rows={LONG_LABEL_ROWS} />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">좁은 폭 (280)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            등급 칸이 좁아져도 원(24)은 그대로이고 항목 칸은 80 으로 줄어듭니다.
                        </p>
                        <RatingMatrix ariaLabel="좁은 폭" rows={REPORT_ROWS} className="max-w-70" />
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="rm-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;matrix&quot;</code>를 같은 자리에 둡니다.
                        머리 줄(37) · 항목 줄(40) · 원(24)의 짜임이 같아 불러온 뒤 자리가 흔들리지 않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="matrix" label="재무비율진단을 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <RatingMatrix ariaLabel="재무비율진단 — 항목별 수준" rows={REPORT_ROWS} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="rm-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 등급 이름을 rating 값으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="RatingMatrix 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rm-props" className="flex flex-col gap-4">
                <h2 id="rm-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="RatingMatrix 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RatingMatrixGuidePage
