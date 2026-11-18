// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {InvestmentModelStructureDiagram} from '@/components/custom/investment-model-structure-diagram'
import {KtrsFmStructureDiagram} from '@/components/custom/ktrs-fm-structure-diagram'
import {PlatformKBigxAnalysisDiagram} from '@/components/custom/platform-k-bigx-analysis-diagram'
import {Table} from '@/components/custom/table'
import {TechIndexStructureDiagram} from '@/components/custom/tech-index-structure-diagram'
import {PLATFORM_K_BIGX_ANALYSIS} from '@/content/service/platform-k-bigx-report'

export const metadata: Metadata = {title: '평가모형 구조도 (ModelStructureDiagram)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const USAGE_CODE = `import {InvestmentModelStructureDiagram} from '@/components/custom/investment-model-structure-diagram'
import {KtrsFmStructureDiagram} from '@/components/custom/ktrs-fm-structure-diagram'
import {TechIndexStructureDiagram} from '@/components/custom/tech-index-structure-diagram'

// 모형 상세 탭(PlatformModelDetailTabs) 카드의 소개 목록 아래 28 — 글은 content/service/platform-technology-evaluation.ts 의
// KTRS_FM_DIAGRAM · TECH_INDEX_DIAGRAM · INVESTMENT_MODEL_DIAGRAM 에서 읽는다(props 없음).
const MODEL_DIAGRAMS = {
  'ktrs-fm': KtrsFmStructureDiagram,
  'tech-index': TechIndexStructureDiagram,
  'investment-model': InvestmentModelStructureDiagram,
}
const Diagram = MODEL_DIAGRAMS[modelId]

<div className="mt-7">
  <Diagram />
</div>`

const DIAGRAM_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'parts', header: '구성(위 → 아래)', align: 'start', wrap: true},
    {key: 'size', header: '기준 크기(PC)', align: 'start', wrap: true},
] as const

const DIAGRAM_ROWS = [
    {
        key: 'ktrs-fm',
        cells: [
            'KtrsFmStructureDiagram',
            '계승 문구 상자(AI 배지 · 각주) → 두 칸(PC 나란히 · 가운데 세로선, 제목 · 라벨 · 상자 줄을 subgrid 로 맞춤): 핵심 평가항목 선정(평가 항목수 둥근 막대) | 고객 친화적 평가모형(기업정보 · 선택항목 태그) → 두 상자(같은 높이): 실시간 등급산출(예시) 3칸 | 예상 평가 시간(회색 알약 안 두 원)',
            '구조도 판 1128 안 · 1280 미만은 쌓음',
        ],
    },
    {
        key: 'tech-index',
        cells: [
            'TechIndexStructureDiagram',
            '흐름 카드(혁신성장 역량지표 칩 → 연결선 → 4대 혁신역량 2 × 2 → 연결선 → 혁신성장역량지수 알약) | 설명 2줄(태그형 상자). 흐름 카드는 role="img" + aria-label',
            'PC(1280↑) 두 칸(사이 40) · 그 아래는 쌓음',
        ],
    },
    {
        key: 'investment-model',
        cells: [
            'InvestmentModelStructureDiagram',
            '캡션 → 기술사업성장모형 카드(남색) | 결합평가(+ 원 · 위아래 화살표) | 밸류업모형 카드(파랑). 카드 = 머리(배지 · 모형명) → 공통 · 특화지표 2칸 → 교차 연결선 → 전문가 · 인공신경망 2칸 → 연결선 → 평점 알약. 구성도 전체는 role="img" + aria-label',
            '최대 860 · 1280 미만은 쌓음(결합평가는 위아래 곧은 화살표)',
        ],
    },
    {
        key: 'k-bigx',
        cells: [
            'PlatformKBigxAnalysisDiagram',
            'K-BIGx 분석 구조 — 신청기업(그라데이션 칸 · 흰 아이콘) → DB 구축 판(기업정보DB · Tech-Index DB 두 칸 | 점선 묶음 특허정보 + 기업정보 · + · LLM → 모이는 ㄷ자 선 → 기술혁신정보 DB) → 기업 맞춤형 보고서(아이콘 상자 · 제공 정보 태그). 색은 화면 <main> 의 --platform-flow-*(K-BIGx: platform-bigx-accent · -bright · -foreground), 아이콘은 라이트 · 다크 파일이 따로(ThemeImage). 개념도라 role="group" + aria-label',
            'PC(1280↑) 가로 흐름(150 · 판 · 190) · 그 아래 세로(최대 760) · 모바일은 DB · 재료가 한 열',
        ],
    },
]

const COLOR_COLUMNS = [
    {key: 'part', header: '부분', align: 'start', rowHeader: true},
    {key: 'token', header: '토큰 · 클래스', align: 'start', wrap: true},
    {key: 'dark', header: '다크', align: 'start', wrap: true},
] as const

const COLOR_ROWS = [
    {
        key: 'stage',
        cells: [
            '구조도 판(바탕) · 회색 알약',
            'bg-platform-section-band (theme platformDiagramSurfaceClassName)',
            'extra.soot',
        ],
    },
    {
        key: 'box',
        cells: [
            '판 위 흰 상자',
            'bg-platform-panel · border-platform-accent/16 · shadow-sm (theme platformDiagramBoxClassName)',
            'extra.slatenavy 면',
        ],
    },
    {
        key: 'badge',
        cells: [
            '아이콘 배지 · 결과 알약',
            'PlatformDiagramBadge — 135° 그라데이션 platform-accent-bright → platform-accent(기본) · platform-model-growth-bright → platform-model-growth(growth)',
            '같은 토큰(진한 끝만 다크 값)',
        ],
    },
    {
        key: 'accent-text',
        cells: [
            '강조 글자(KTRS-FM 줄 · 흐름 칩 · 특화지표)',
            'text-platform-accent-foreground · text-platform-model-growth-foreground',
            '밝은 파랑',
        ],
    },
    {
        key: 'bar',
        cells: [
            '평가 항목수 막대',
            '바탕 bg-platform-accent/8 · 회색 막대 from-platform-bar-start to-platform-bar-end · 강조 막대 from-platform-accent-bright to-platform-accent',
            '회색 막대 방향이 뒤집힘',
        ],
    },
    {
        key: 'grade',
        cells: [
            '실시간 등급산출 칸 머리',
            'bg-primary · bg-purple-600 + text-purple-10 · bg-gray-500 + text-gray-10 (운영 화면 색)',
            '팔레트 단계가 짝으로 반사돼 대비 유지',
        ],
    },
    {
        key: 'gauge',
        cells: [
            '예상 평가 시간 고리 · 호',
            'stroke-muted(고리) · stroke-chart-5(KTRS) · stroke-primary(KTRS-FM) · 띠 navy.100',
            '같은 토큰',
        ],
    },
    {
        key: 'line',
        cells: [
            '연결선',
            'Tech-Index: from-platform-panel-border to-platform-accent/55 · 투자모형: stroke-platform-accent/45 · stroke-platform-model-growth/45',
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
            '구조도가 화면에 들어옴',
            '구조도는 따로 떠오르지 않습니다 — 감싼 모형 상세 탭 묶음이 통째로 PlatformReveal(20px · 0.8초)로 나타납니다.',
        ],
    },
    {
        key: 'ring',
        cells: [
            'KTRS-FM 예상 평가 시간 상자가 40% 보임(한 번)',
            '호가 12시부터 그려지고(stroke-dashoffset) · 두 원 사이 띠가 왼쪽부터 펼쳐지며(clip-path) 0.9초, 호 끝 점은 0.8초 뒤 0.3초에 걸쳐 나타남.',
        ],
    },
    {
        key: 'combine',
        cells: [
            '투자모형 결합평가(반복 3.2초)',
            '+ 원이 살짝 뛰고(animate-platform-combine-core) 화살표 선이 그려진 뒤(-combine-line) 화살촉이 나타나고 머물렀다 사라짐. PC(1280↑) 꺾인 화살표는 화살촉이 각자 모형 쪽으로 밀려 나타나고(-combine-head-left · -right), 쌓는 폭의 위아래 곧은 화살표는 화살촉도 선과 같이 그려짐(-combine-line).',
        ],
    },
    {key: 'static', cells: ['그 밖', '평가 항목수 막대 · Tech-Index 흐름은 움직이지 않습니다(시안).']},
]

const ModelStructureDiagramGuidePage = () => (
    <GuidePageShell
        title="평가모형 구조도 (ModelStructureDiagram)"
        description="플랫폼 소개 > 기술평가의 모형별 구조도입니다. 이미지 대신 글 · 도형으로 그려 스크린리더가 읽고, 모바일에서도 글자가 줄지 않습니다."
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
                        평가모형 섹션(탭을 고르면 그 모형의 구조도가 나옵니다).
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
                        <h3 className="typo-title-m-bold text-foreground">특허평가 (PlatformFlowDiagram)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            특허평가 화면의 평가 원리 도식은 흐름 도식 블록(PlatformFlowDiagram) · 정의
                            패널(PlatformDefinitionPanel)로 옮겼습니다 —{' '}
                            <Link href="/component-guide/platform-intro" className={LINK_CLASS}>
                                플랫폼 소개 블록 가이드
                            </Link>
                            ·{' '}
                            <Link href="/corp/platform/patent-evaluation" className={LINK_CLASS}>
                                플랫폼 소개 &gt; 특허평가
                            </Link>
                            .
                        </p>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">
                            K-BIGx 분석 구조 (PlatformKBigxAnalysisDiagram)
                        </h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            보고서가 만들어지는 분석 구조입니다 —{' '}
                            <Link href="/corp/platform/k-bigx-report" className={LINK_CLASS}>
                                플랫폼 소개 &gt; K-BIGx 보고서
                            </Link>
                            .
                        </p>
                        {/* 화면에서는 <main> 이 K-BIGx 색을 --platform-flow-* 로 넘긴다 — 가이드에서도 같은 변수를 감싼다. */}
                        <div className="[--platform-flow-accent-bright:var(--color-platform-bigx-accent-bright)] [--platform-flow-accent:var(--color-platform-bigx-accent)] [--platform-flow-foreground:var(--color-platform-bigx-accent-foreground)] [--platform-tone-fill:var(--color-service-bigx-fill)]">
                            <PlatformKBigxAnalysisDiagram analysis={PLATFORM_K_BIGX_ANALYSIS.diagram} />
                        </div>
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
                        KTRS-FM · Tech-Index · 투자모형 — 회색 판(둥근 12 · 여백 모바일 18 · 그 위 28) 위에 흰
                        상자(강조색 16% 테두리 · 그림자 · 둥근 16). 판 · 상자 스타일은 theme/platform-intro.variants.ts
                        의 platformDiagramSurfaceClassName · platformDiagramBoxClassName 입니다.
                    </li>
                    <li>
                        등급 칸 · 원 안 글자는 폭에 따라 크기가 바뀌는 화면 전용 타이포(typo-platform-grade-* ·
                        typo-platform-gauge-*, 모바일 → 768↑)를 씁니다.
                    </li>
                    <li>
                        1280 미만 — 콘텐츠 폭(1024 에서 792)이 좁아 두 칸 · 세 칸 배치를 쌓습니다. KTRS-FM 은 두 칸 · 두
                        상자를 쌓고(모바일은 막대가 이름 아래 줄로), 투자모형은 카드 · 결합평가 · 카드를 쌓고 결합평가는
                        + 원 위아래 곧은 화살표가 위 · 아래 카드를 가리킵니다(글은 오른쪽).
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
                        동작 줄이기 설정이면 움직임 없이 처음부터 제자리에 다 그려진 모습입니다[6.3.1]. 값은{' '}
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
                        제목 단계 — 모형 제목(h4) 아래 구조도 소제목 · 상자 제목이 h5 입니다. Tech-Index 흐름 카드와
                        투자모형 구성도는 한 장의 개념도라 role=&quot;img&quot; + aria-label 로 한 번에 읽습니다.
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
