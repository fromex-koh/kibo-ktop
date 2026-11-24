// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {PeerItemBarTable, type PeerItemBarColumn} from '@/components/custom/peer-item-bar-table'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '항목별 막대 표 (PeerItemBarTable)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
// 예시 표는 보고서 본문 폭(A4 794 - 좌우 여백 40 × 2 = 714)까지만 늘린다 — 가이드 카드 폭으로 늘리면
// 칸이 넓어져 막대가 왼쪽으로 쏠려 보이고, 실제 화면(칸 약 81)과 모양이 달라진다.
const REPORT_WIDTH_CLASS = 'max-w-[calc(var(--container-report)-var(--spacing)*20)]'

const USAGE_CODE = `import {PeerItemBarTable} from '@/components/custom/peer-item-bar-table'

<PeerItemBarTable
  caption="PEER GROUP(업종) 세부항목비교 — 항목별 신청기업과 PEER 평균"
  columns={[
    {id: 'industry-experience', label: '동업종 경험수준', unit: '년', ticks: [0, 10, 20, 30], applicant: 16.3, average: 10.5, fractionDigits: 1},
    {id: 'executives', label: '경영진수', unit: '명', ticks: [0, 5, 10], applicant: 4, average: 3.2, fractionDigits: 0},
    // …항목 수만큼
  ]}
/>`

const COLUMNS: readonly PeerItemBarColumn[] = [
    {
        id: 'industry-experience',
        label: '동업종 경험수준',
        unit: '년',
        ticks: [0, 10, 20, 30],
        applicant: 16.3,
        average: 10.5,
        fractionDigits: 1,
    },
    {id: 'executives', label: '경영진수', unit: '명', ticks: [0, 5, 10], applicant: 4, average: 3.2, fractionDigits: 0},
    {
        id: 'technical-staff',
        label: '기술인력수',
        unit: '명',
        ticks: [0, 20, 40, 60],
        applicant: 42,
        average: 25.5,
        fractionDigits: 0,
    },
    {
        id: 'patents',
        label: '등록 특허수',
        unit: '건',
        ticks: [0, 5, 10, 15],
        applicant: 6,
        average: 3.5,
        fractionDigits: 0,
    },
    {
        id: 'production-quality',
        label: '생산 및 품질관리',
        unit: '점',
        ticks: [0, 50, 100],
        applicant: 82,
        average: 61.5,
        fractionDigits: 1,
    },
    {
        id: 'market-competition',
        label: '시장경쟁',
        unit: '점',
        ticks: [0, 50, 100],
        applicant: 74,
        average: 58.3,
        fractionDigits: 1,
    },
    {
        id: 'external-funding',
        label: '외부자금',
        unit: '백만원',
        ticks: [0, 1000, 2000, 3000],
        applicant: 1850,
        average: 1120,
        fractionDigits: 0,
    },
    {
        id: 'return-on-investment',
        label: '투자수익률',
        unit: '%',
        ticks: [0, 10, 20, 30],
        applicant: 18.4,
        average: 12.7,
        fractionDigits: 1,
    },
]

const PROPS_ITEMS = [
    ['PeerItemBarTable', 'columns', '항목(열) 목록입니다. 적힌 순서대로 섭니다.', '-', 'readonly PeerItemBarColumn[]'],
    ['PeerItemBarTable', 'caption', '표 이름입니다. 화면에는 숨기고 스크린리더가 읽습니다.', '-', 'string'],
    ['PeerItemBarTable', 'applicantLabel', '진한 막대 · 셋째 줄 이름입니다.', "'신청기업'", 'string'],
    ['PeerItemBarTable', 'averageLabel', '옅은 막대 · 넷째 줄 이름입니다.', "'PEER 평균'", 'string'],
    ['PeerItemBarTable', 'isLoading', '불러오는 중입니다. 막대 칸과 수치 칸에 스켈레톤이 섭니다.', 'false', 'boolean'],
    ['PeerItemBarTable', 'className', 'table 에 덧붙일 클래스입니다. 그 밖의 table 속성도 받습니다.', '-', 'string'],
    ['PeerItemBarColumn', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['PeerItemBarColumn', 'label', '머리 칸 첫 줄 이름입니다.', '-', 'string'],
    [
        'PeerItemBarColumn',
        'unit',
        "머리 칸 둘째 줄 단위입니다. 괄호는 컴포넌트가 붙입니다('년' → (년)).",
        '-',
        'string',
    ],
    [
        'PeerItemBarColumn',
        'ticks',
        '그 칸의 눈금입니다. 0 부터 오름차순으로 적고, 마지막 값이 막대 칸 꼭대기(100%)입니다.',
        '-',
        'readonly number[]',
    ],
    ['PeerItemBarColumn', 'applicant', '신청기업 값입니다.', '-', 'number'],
    ['PeerItemBarColumn', 'average', 'PEER 평균 값입니다.', '-', 'number'],
    [
        'PeerItemBarColumn',
        'fractionDigits',
        '수치의 최소 소수 자릿수입니다. 1 이면 82 를 82.0 으로 적습니다. 소수는 최대 한 자리입니다.',
        '-',
        'number',
    ],
] as const

const PeerItemBarTableGuidePage = () => (
    <GuidePageShell
        title="항목별 막대 표 (PeerItemBarTable)"
        description="단위가 서로 다른 항목들을 열마다 따로 눈금을 둔 막대와 수치로 견주는 표입니다."
    >
        <BaseCard>
            <section aria-labelledby="pibt-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pibt-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        투자모형 심층분석의 PEER GROUP(업종) 세부항목비교에 씁니다. 줄은 위에서부터 평가항목(이름 ·
                        단위) · 항목별 비교(막대) · 신청기업 · PEER 평균입니다. 항목마다 단위와 크기가 달라 눈금(
                        <code>ticks</code>)을 열마다 따로 주고, 가로 구분선 없이 숫자만 적습니다.
                    </p>
                </div>
                <PeerItemBarTable
                    caption="PEER GROUP(업종) 세부항목비교 예시"
                    columns={COLUMNS}
                    className={REPORT_WIDTH_CLASS}
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pibt-rules" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pibt-rules" className="typo-h4-bold">
                        막대 칸 규칙 · 로딩
                    </h2>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">막대 칸</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>막대는 칸 바닥선에 붙고, 높이는 그 칸의 마지막 눈금을 100% 로 잡습니다.</li>
                            <li>
                                눈금 숫자는 칸 왼쪽에서 3 띄우고 가장 긴 숫자에 맞춰 오른쪽 정렬합니다. 0 은 바닥선 위에
                                앉습니다.
                            </li>
                            <li>막대는 숫자에서 10 띄우고, 칸이 좁으면 4 까지 줄어듭니다. 막대 두께 12 · 사이 6.</li>
                            <li>
                                색은 신청기업 <code>bg-primary</code> · PEER 평균 <code>bg-navy-200</code> 입니다.
                                범례는 포함되지 않아 구획 제목 줄에 따로 둡니다.
                            </li>
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 을 켜면 머리 줄은 그대로 두고 막대 칸과 수치 칸에 스켈레톤이 섭니다.
                        </p>
                        <PeerItemBarTable
                            caption="로딩 예시"
                            columns={COLUMNS}
                            isLoading
                            className={REPORT_WIDTH_CLASS}
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pibt-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pibt-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        데이터 표라 숨김 <code>caption</code> 과 <code>th scope</code>(열 · 줄)를 씁니다[7.3.2].
                    </li>
                    <li>
                        막대와 눈금은 그림이라 읽지 않고, 같은 값을 아래 두 줄의 수치로 읽습니다. 색만으로 구분하지
                        않도록 줄 이름(신청기업 · PEER 평균)을 함께 둡니다[5.3.1].
                    </li>
                    <li>
                        단위가 같은 값을 점수 눈금 하나에 견줄 때는{' '}
                        <Link href="/component-guide/peer-column-chart" className={LINK_CLASS}>
                            PeerColumnChart
                        </Link>{' '}
                        를 씁니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pibt-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pibt-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>columns</code> 와 <code>caption</code> 만 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PeerItemBarTable Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PeerItemBarTableGuidePage
