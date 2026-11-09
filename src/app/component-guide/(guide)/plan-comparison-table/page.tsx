// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {PlanComparisonTable} from '@/components/custom/plan-comparison-table'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '플랜 비교표 (PlanComparisonTable)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const DEMO_COLUMNS = [
    {id: 'self', name: '자사조회', description: '무료'},
    {id: 'minimum', name: '1회권', description: '유료', iconSrc: '/images/ticket-grade/ticket-grade-minimum.webp'},
    {id: 'basic', name: '베이직', description: '유료', iconSrc: '/images/ticket-grade/ticket-grade-basic.webp'},
] as const

const DEMO_ROWS = [
    {label: '이용 요금', isHighlighted: true, cells: ['무료', '₩22,000', '₩330,000']},
    {label: '조회 대상', cells: ['본인 기업', '다른 기업', '다른 기업']},
    {label: '이용 기간', cells: [{status: 'none'}, '1개월', '1개월']},
    {label: '이용권 복수 보유', cells: [{status: 'none'}, {status: 'included'}, {status: 'included'}]},
] as const

const USAGE_CODE = `import {PlanComparisonTable} from '@/components/custom/plan-comparison-table'

<PlanComparisonTable
  caption="플랜별 비교"
  rowHeader="비교 항목"
  columns={[
    {id: 'self', name: '자사조회', description: '무료'},
    {id: 'basic', name: '베이직', description: '유료', iconSrc: '/images/ticket-grade/ticket-grade-basic.webp'},
  ]}
  rows={[
    {label: '이용 요금', isHighlighted: true, cells: ['무료', '₩330,000']},
    {label: '이용 기간', cells: [{status: 'none'}, '1개월']},          // 해당 없음
    {label: '이용권 복수 보유', cells: [{status: 'none'}, {status: 'included'}]}, // 제공(체크)
  ]}
/>`

const PROPS_ITEMS = [
    [
        'PlanComparisonTable',
        'caption',
        '표 이름입니다. 화면에는 숨기고 스크린리더 · 스크롤 상자 이름으로 씁니다.',
        '-',
        'string',
    ],
    ['PlanComparisonTable', 'rowHeader', '항목 이름 열의 제목입니다.', '-', 'string'],
    [
        'PlanComparisonTable',
        'columns',
        '열(플랜) — 이름 · 아래 작은 글자 · 앞 그림(20, 꾸밈).',
        '-',
        'readonly {id; name; description?; iconSrc?}[]',
    ],
    [
        'PlanComparisonTable',
        'rows',
        '행 — 항목 이름 · 강조 여부 · columns 순서의 칸 값.',
        '-',
        'readonly {label; isHighlighted?; cells}[]',
    ],
    [
        'PlanComparisonCell',
        '-',
        "글자, {status: 'included'}(파란 체크 · 제공), {status: 'none'}(줄표 · 해당 없음).",
        '-',
        "string | {status: 'included' | 'none'}",
    ],
] as const

const PlanComparisonTableGuidePage = () => (
    <GuidePageShell
        title="플랜 비교표 (PlanComparisonTable)"
        description="이용권(플랜)을 열로, 비교 항목을 행으로 놓고 조건을 한눈에 견주는 표입니다."
    >
        <BaseCard>
            <section aria-labelledby="plan-comparison-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="plan-comparison-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/pricing?tab=kbigx" className={LINK_CLASS}>
                            가격정책 &gt; K-BIGx 보고서
                        </Link>
                        (기업회원)의 플랜별 비교. 그 화면의 열 · 행은 <code>pricing.ts</code> 의{' '}
                        <code>buildPlanComparison(이용권 목록)</code> 이 만들어 그대로 넘깁니다.
                    </p>
                </div>
                <PlanComparisonTable
                    caption="플랜별 비교 예시"
                    rowHeader="비교 항목"
                    columns={DEMO_COLUMNS}
                    rows={DEMO_ROWS}
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="plan-comparison-spec" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="plan-comparison-spec" className="typo-h4-bold">
                        규격 · 반응형
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>흰 면 · 옅은 테두리(subtle-3) · 반경 16. 머리 행 높이 80, 본문 행 높이 48, 행 사이 1px 선.</li>
                    <li>
                        항목 이름 열은 폭의 1/5, 값은 오른쪽 정렬. 강조 행은 <code>bg-primary-subtle</code> 면에 항목
                        이름이 <code>text-primary-strong</code> 입니다.
                    </li>
                    <li>칸 좌우 여백은 1280 이상 20 · 그 아래 12 입니다(태블릿에서 표가 한 화면에 듭니다).</li>
                    <li>
                        그래도 폭을 넘으면(모바일) 표만 가로로 스크롤되고 항목 이름 열은 왼쪽에 붙어 남습니다. 스크롤
                        상자의 <code>contain-inline-size</code> · <code>relative</code> 는 지우지 않습니다 — 없으면 표
                        폭이나 칸 안 sr-only 글자가 페이지 전체에 가로 스크롤을 만듭니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="plan-comparison-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="plan-comparison-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        <code>caption</code>(sr-only) · 열 제목 <code>th scope=&quot;col&quot;</code> · 항목 이름{' '}
                        <code>th scope=&quot;row&quot;</code> 로 짭니다[7.3.2].
                    </li>
                    <li>
                        체크 아이콘은 꾸밈이고 &ldquo;제공&rdquo;을 sr-only 로 읽힙니다 — 색 · 모양만으로 뜻을 전하지
                        않습니다[5.3.1].
                    </li>
                    <li>가로 스크롤 상자는 탭 순서에 들어가 방향키로 밀 수 있고, 표 이름이 붙습니다[6.1.1].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="plan-comparison-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="plan-comparison-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PlanComparisonTable 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PlanComparisonTableGuidePage
