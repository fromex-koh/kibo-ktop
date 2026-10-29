// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {InvestmentModelStructureDiagram} from '@/components/custom/investment-model-structure-diagram'
import {KBigxReportFlowDiagram} from '@/components/custom/k-bigx-report-flow-diagram'
import {KtrsFmStructureDiagram} from '@/components/custom/ktrs-fm-structure-diagram'
import {PatentEvaluationDiagram} from '@/components/custom/platform-patent-evaluation'
import {Table} from '@/components/custom/table'
import {TechIndexStructureDiagram} from '@/components/custom/tech-index-structure-diagram'

export const metadata: Metadata = {title: '평가모형 구조도 (ModelStructureDiagram)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const USAGE_CODE = `import {InvestmentModelStructureDiagram} from '@/components/custom/investment-model-structure-diagram'
import {KtrsFmStructureDiagram} from '@/components/custom/ktrs-fm-structure-diagram'
import {TechIndexStructureDiagram} from '@/components/custom/tech-index-structure-diagram'

// 모형 소개(제목 · 소개 목록) 아래 40 — 글은 content/service/platform-technology-evaluation.ts 의
// KTRS_FM_DIAGRAM · TECH_INDEX_DIAGRAM · INVESTMENT_MODEL_DIAGRAM 에서 읽는다(props 없음).
const MODEL_DIAGRAMS = {
  'ktrs-fm': KtrsFmStructureDiagram,
  'tech-index': TechIndexStructureDiagram,
  'investment-model': InvestmentModelStructureDiagram,
}
const Diagram = MODEL_DIAGRAMS[modelId]

<div className="mt-10">
  <Diagram />
</div>`

const DIAGRAM_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'parts', header: '구성(위 → 아래)', align: 'start', wrap: true},
    {key: 'size', header: '시안 크기(PC)', align: 'start', wrap: true},
] as const

const DIAGRAM_ROWS = [
    {
        key: 'ktrs-fm',
        cells: [
            'KtrsFmStructureDiagram',
            '모형 머리(아이콘 칸 120 · 모형명 · 설명) → 흰 판(744: 평가 항목수 막대 · 구분선 · 10개 소항목 체크리스트 · 실시간 등급산출) → 예상 평가 시간(흰 알약 388 × 188 안 두 원 · 점 목록)',
            '1200 × 1604',
        ],
    },
    {
        key: 'tech-index',
        cells: [
            'TechIndexStructureDiagram',
            '혁신성장 역량지표(228) → 기술사업평가등급 | 인공지능(228 · 사이 24) → 4대 부문(흰 칸 2 × 2) → 혁신성장역량지수(228) · 칸 사이 연결선 → 안내 상자(744)',
            '1200 × 692',
        ],
    },
    {
        key: 'investment-model',
        cells: [
            'InvestmentModelStructureDiagram',
            '기술사업성장모형 카드 | 결합평가(+ 원 · 양쪽 화살표) | 투자 회수모형 카드(320 × 316 · 사이 104). 카드 = 머리 56 + 투입지표 묶음(점선 · 배지 · 칸 2 × 2) + 결과 칸(파랑 테두리 · 종속변수 배지)',
            '1200 × 412',
        ],
    },
    {
        key: 'patent',
        cells: [
            'PatentEvaluationDiagram',
            '특허평가 머리(480) → 회색 묶음 3열(아이콘 60 · 제목 14 Bold · 설명 13 두 줄) → 아래 화살표 → 결론 두 줄(14 Bold)',
            '1200 × 419',
        ],
    },
    {
        key: 'k-bigx',
        cells: [
            'KBigxReportFlowDiagram',
            '신청기업(228 · 파랑) → 흰 판(744): DB 두 칸(320) → 기술혁신정보 묶음(점선 묶음 특허정보 + 기업정보 · + · LLM → 모이는 연결선 → 기술혁신정보 DB 384) → 보고서(아이콘 칸 120)',
            '1200 × 1156',
        ],
    },
]

const COLOR_COLUMNS = [
    {key: 'part', header: '부분', align: 'start', rowHeader: true},
    {key: 'token', header: '토큰 · 클래스', align: 'start', wrap: true},
    {key: 'dark', header: '다크', align: 'start', wrap: true},
] as const

const COLOR_ROWS = [
    {key: 'stage', cells: ['구조도 판(바탕)', 'bg-panel-subtle (gray.10)', 'gray.800 — 본문 바탕보다 한 단계 밝음']},
    {
        key: 'raised',
        cells: ['판 위 흰 판 · 흰 칸', 'bg-panel-raised (흰색)', 'gray.900 — 회색 판과 번갈아 겹쳐도 구분됨'],
    },
    {key: 'inset', cells: ['판 위 회색 묶음(Tech-Index 4대 부문)', 'bg-panel-inset (gray.50)', 'gray.700']},
    {
        key: 'icon',
        cells: [
            '모형 아이콘 칸(KTRS-FM)',
            'bg-model-icon-surface (navy.100 #e8eff8 — 시안 값)',
            'navy.500 — 판 위에서 또렷하게',
        ],
    },
    {
        key: 'head',
        cells: [
            '칸 머리(진한 면 + 밝은 글자)',
            'bg-primary · bg-gray-500 + text-gray-10 · bg-purple-600 + text-purple-10 · bg-navy-500 + text-navy-10',
            '팔레트 단계가 짝으로 반사돼 대비 유지',
        ],
    },
    {
        key: 'badge',
        cells: [
            '배지(투자모형)',
            '공용 Badge xs · round · info — outline(공통지표 · 특성화지표) · solid-pastel(종속변수)',
            '배지 토큰을 따름',
        ],
    },
    {
        key: 'line',
        cells: [
            '연결선 · 화살촉(Tech-Index · 투자모형)',
            'stroke-foreground-subtle/50 (Tech-Index 두께 2) · stroke-foreground-subtle (투자모형 두께 1) · fill-foreground-subtle',
            '같은 토큰',
        ],
    },
]

const MOTION_COLUMNS = [
    {key: 'when', header: '때', align: 'start', rowHeader: true},
    {key: 'what', header: '움직임', align: 'start', wrap: true},
] as const

const MOTION_ROWS = [
    {
        key: 'reveal',
        cells: [
            '덩어리가 화면에 들어옴',
            'ScrollReveal — 아래에서 떠오르며 나타남(0.9초 · ease-roll, 한 번만). KTRS-FM 은 머리 · 흰 판 · 예상 평가 시간, Tech-Index 는 흐름도 · 안내 상자가 각각 나타납니다.',
        ],
    },
    {
        key: 'bar',
        cells: ['KTRS-FM 흰 판', '평가 항목수 막대가 왼쪽부터 자람(animate-chart-wipe-right).'],
    },
    {
        key: 'ring',
        cells: [
            'KTRS-FM 예상 평가 시간',
            '호가 12시부터 시계 방향으로 그려지고(animate-chart-draw) · 두 원 사이 띠가 왼쪽부터 펼쳐지며 · 호 끝 점은 다 그려진 뒤 나타남(animate-chart-label).',
        ],
    },
    {
        key: 'line',
        cells: [
            'Tech-Index 흐름도',
            '연결선이 위에서 아래로 그려지고(animate-chart-draw) 화살촉이 이어서 나타남(animate-chart-label).',
        ],
    },
    {
        key: 'combine',
        cells: [
            '투자모형 결합평가',
            '+ 원이 커지며 나타나고(animate-chart-pop) 양쪽 화살표가 그려진 뒤(animate-chart-draw) 화살촉이 나타남(animate-chart-label).',
        ],
    },
]

const ModelStructureDiagramGuidePage = () => (
    <GuidePageShell
        title="평가모형 구조도 (ModelStructureDiagram)"
        description="플랫폼 소개 > 기술평가의 모형별 구조도입니다. 시안 그림을 이미지 대신 글 · 도형으로 옮겨 화면 낭독기가 읽고, 모바일에서도 글자가 줄지 않습니다."
    >
        <BaseCard>
            <section aria-labelledby="model-structure-diagram-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="model-structure-diagram-usage" className="typo-h4-bold">
                        기본 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모형마다 구조가 달라 컴포넌트가 따로 있고, 글은 콘텐츠 파일이 단일 소스입니다. 실제 화면 —{' '}
                        <Link href="/corp/platform/technology-evaluation" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 기술평가
                        </Link>
                        (카드를 고르면 그 모형의 구조도가 나옵니다).
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">KTRS-FM (KtrsFmStructureDiagram)</h3>
                        <KtrsFmStructureDiagram />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">Tech-Index (TechIndexStructureDiagram)</h3>
                        <TechIndexStructureDiagram />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">
                            투자모형 (InvestmentModelStructureDiagram)
                        </h3>
                        <InvestmentModelStructureDiagram />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">특허평가 (PatentEvaluationDiagram)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            같은 틀(회색 판 · 파랑 머리 · 회색 묶음 · 화살표)로 그린 특허평가 화면의 구조도입니다 —{' '}
                            <Link href="/corp/platform/patent-evaluation" className={LINK_CLASS}>
                                플랫폼 소개 &gt; 특허평가
                            </Link>
                            .
                        </p>
                        <PatentEvaluationDiagram />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">K-BIGx 보고서 (KBigxReportFlowDiagram)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            보고서가 만들어지는 흐름도입니다 —{' '}
                            <Link href="/corp/platform/k-bigx-report" className={LINK_CLASS}>
                                플랫폼 소개 &gt; K-BIGx 보고서
                            </Link>
                            .
                        </p>
                        <KBigxReportFlowDiagram />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">구성</h3>
                        <Table
                            caption="평가모형 구조도 컴포넌트 구성"
                            columns={DIAGRAM_COLUMNS}
                            rows={DIAGRAM_ROWS}
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="model-structure-diagram-spec" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="model-structure-diagram-spec" className="typo-h4-bold">
                        규격 · 색
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        판 여백 위아래 48 · 덩어리 사이 24. 칸 높이 53(여백 위아래 16) · 칸 글 14(머리 Bold · 몸
                        Medium).
                    </li>
                    <li>
                        흰 판 · 흰 칸 · 회색 묶음이 번갈아 겹치므로 panel-subtle · panel-raised · panel-inset 을 번갈아
                        써 다크에서도 칸이 구분됩니다.
                    </li>
                    <li>
                        모바일 — KTRS-FM 은 두 칸 묶음 · 등급 칸을 세로로 쌓고 막대 줄은 이름을 막대 위로 올립니다.
                        Tech-Index 흐름도는 폭에 맞춰 줄어들고, 두 칸 · 연결선을 같은 비율(228 : 24 : 228)로 두어
                        연결선이 칸 가운데에 계속 닿습니다. 투자모형은 카드 · 결합평가 · 카드를 세로로 쌓고, 화살표
                        그림을 90° 돌려 위 · 아래 카드를 가리킵니다.
                    </li>
                </ul>
                <Table caption="평가모형 구조도 색" columns={COLOR_COLUMNS} rows={COLOR_ROWS} size="md" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="model-structure-diagram-motion" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="model-structure-diagram-motion" className="typo-h4-bold">
                        모션
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        동작 줄이기 설정이면 모두 없이 처음부터 제자리 · 다 그려진 모습입니다[6.3.1]. 값은{' '}
                        <Link href="/component-guide/motion" className={LINK_CLASS}>
                            모션 가이드
                        </Link>
                        를 따릅니다.
                    </p>
                </div>
                <Table caption="평가모형 구조도 모션" columns={MOTION_COLUMNS} rows={MOTION_ROWS} size="md" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="model-structure-diagram-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="model-structure-diagram-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>모든 글이 실제 글이라 대체 텍스트가 따로 필요 없습니다[5.1.1].</li>
                    <li>
                        제목 단계는 모형 제목(h3) 아래 h4 → h5 → h6 로 이어집니다. Tech-Index 흐름은 순서 목록(ol)이라
                        위에서 아래 순서대로 읽힙니다[7.3.1].
                    </li>
                    <li>
                        막대 · 원 · 연결선 · 아이콘은 꾸밈이라 읽지 않습니다(aria-hidden · alt=&quot;&quot;). 값(31개 ·
                        30분 등)은 글로 함께 둡니다.
                    </li>
                    <li>
                        짧고 큰 굵은 글(등급 AA · 원 안의 분)은 문단(p)이 아니라 span 으로 둡니다 — WAVE 가 제목 같은
                        문단(Possible heading)으로 보지 않게 합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ModelStructureDiagramGuidePage
