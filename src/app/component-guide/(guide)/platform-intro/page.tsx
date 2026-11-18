// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {
    Award,
    Building2,
    ChartNoAxesCombined,
    Coins,
    FileBadge,
    FileChartColumn,
    FileText,
    Gauge,
    Layers,
    Leaf,
    Scale,
    UserCheck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {PlatformQuestionTabs} from '@/components/composite/platform-question-tabs'
import {PlatformTabsList, PlatformTabsTrigger} from '@/components/composite/platform-tabs'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {PlatformCompareTable} from '@/components/custom/platform-compare-table'
import {PlatformDefinitionPanel} from '@/components/custom/platform-definition-panel'
import {PlatformDiagramBadge} from '@/components/custom/platform-diagram-badge'
import {PlatformFlowDiagram} from '@/components/custom/platform-flow-diagram'
import {PlatformHeroCardStack} from '@/components/custom/platform-hero-card-stack'
import {PlatformHubOrbit} from '@/components/custom/platform-hub-orbit'
import {
    PlatformAudiencePanels,
    PlatformCtaBanner,
    PlatformFeatureCards,
    PlatformFeatureImage,
    PlatformHero,
    PlatformHeroEmphasis,
    PlatformIconPanels,
    PlatformIconTiles,
    PlatformRuleList,
} from '@/components/custom/platform-intro-blocks'
import {PlatformExternalLinkButton} from '@/components/custom/platform-external-link-button'
import {PlatformServiceHeroCards} from '@/components/custom/platform-service-hero-cards'
import {
    PlatformServicePanel,
    PlatformServiceSwitchProvider,
    PlatformServiceSwitchTabs,
} from '@/components/custom/platform-service-switch'
import {PlatformKBigxReportCover} from '@/components/custom/platform-k-bigx-report-cover'
import {PlatformModelDetailTabs} from '@/components/custom/platform-model-detail-tabs'
import {PlatformNotice} from '@/components/custom/platform-notice'
import {PlatformPatentGradeCard} from '@/components/custom/platform-patent-grade-card'
import {PlatformProcessSteps} from '@/components/custom/platform-process-steps'
import {PlatformReportPreview} from '@/components/custom/platform-report-preview'
import {PlatformReportViewer} from '@/components/custom/platform-report-viewer'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {PlatformServiceCards} from '@/components/custom/platform-service-cards'
import {PlatformStats} from '@/components/custom/platform-stats'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {platformServiceIconVariants} from '@/components/theme/platform-intro.variants'
import {Button} from '@/components/ui/button'
import {Tabs, TabsContent} from '@/components/ui/tabs'
import {
    MODEL_DETAILS,
    PLATFORM_TECH_COMPARE,
    PLATFORM_TECH_HERO,
    PLATFORM_TECH_REPORT,
} from '@/content/service/platform-technology-evaluation'
import reportKtrsFmDeep from '@public/images/platform-technology-evaluation/report-ktrs-fm-deep.webp'
import reportKtrsFmGeneral from '@public/images/platform-technology-evaluation/report-ktrs-fm-general.webp'
import speedGauge from '@public/images/option-card/speed-gauge.webp'
import {PLATFORM_PATENT_HERO, PLATFORM_PATENT_PRINCIPLE} from '@/content/service/platform-patent-evaluation'
import {PLATFORM_K_BIGX_HERO, PLATFORM_K_BIGX_PREVIEW} from '@/content/service/platform-k-bigx-report'
import {
    PLATFORM_CARBON_HERO,
    PLATFORM_CARBON_MOVE_DIALOG,
    PLATFORM_CARBON_SWITCH,
} from '@/content/service/platform-carbon-neutrality'
import kbigxAiAnalysisReportDarkIcon from '@public/images/platform-k-bigx-report/ai-analysis-report-dark.webp'
import kbigxAiAnalysisReportIcon from '@public/images/platform-k-bigx-report/ai-analysis-report.webp'
import kbigxInsightDarkIcon from '@public/images/platform-k-bigx-report/insight-dark.webp'
import kbigxInsightIcon from '@public/images/platform-k-bigx-report/insight.webp'
import kbigxReportBriefingDark from '@public/images/platform-k-bigx-report/report-briefing-dark.webp'
import kbigxReportBriefing from '@public/images/platform-k-bigx-report/report-briefing.webp'
import kbigxReportCompanyDark from '@public/images/platform-k-bigx-report/report-company-dark.webp'
import kbigxReportCompany from '@public/images/platform-k-bigx-report/report-company.webp'
import {ThemeImage} from '@/components/custom/theme-image'
import platformData from '@public/images/platform-intro/platform-data.webp'
import platformExpertise from '@public/images/platform-intro/platform-expertise.webp'

export const metadata: Metadata = {title: '플랫폼 소개 블록 (PlatformIntro)'}

// 기술평가 블록 예시 — 실제 화면 원고(content/service/platform-technology-evaluation.ts)를 그대로 쓴다.
const DEMO_HERO_ICONS = {'ktrs-fm': Gauge, 'tech-index': ChartNoAxesCombined, 'investment-model': Coins} as const
const DEMO_HERO_CARDS = PLATFORM_TECH_HERO.cards.map((card) => {
    const Icon = DEMO_HERO_ICONS[card.id]
    return {...card, icon: <Icon aria-hidden="true" />}
})
const DEMO_MODEL_DETAIL = [
    {
        value: 'ktrs-fm',
        ...MODEL_DETAILS['ktrs-fm'],
        image: <Image src={speedGauge} alt="" sizes="96px" className="size-full object-contain object-left-top" />,
    },
]
// 특허평가 블록 예시 — 실제 화면 원고(content/service/platform-patent-evaluation.ts).
const DEMO_FLOW_COLUMNS = [
    {
        id: 'source',
        icon: <Layers />,
        title: '활용 정보',
        items: [
            {icon: <FileText />, title: '내재적 지표', description: '특허 자체의 특성'},
            {icon: <FileText />, title: '외재적 지표', description: '특허가 속한 기술환경의 특성'},
        ],
    },
    {
        id: 'basis',
        icon: <Scale />,
        title: '분석 기준',
        items: [
            {
                icon: <UserCheck />,
                title: '전문가 평가사례 기반 분석',
                description: '기술보증기금 고유의 특허등급산출 시스템',
            },
        ],
    },
]
const DEMO_DEFINITION_ITEMS = PLATFORM_PATENT_PRINCIPLE.definition.items.map((item) => ({
    ...item,
    icon: <Gauge className="text-platform-accent-foreground size-8" />,
}))

const DEMO_COMPARE_TONES = {'ktrs-fm': 'blue', 'tech-index': 'mint', 'investment-model': 'orange'} as const
const DEMO_COMPARE_ROWS = PLATFORM_TECH_COMPARE.rows.map((row) => ({
    ...row,
    tone: DEMO_COMPARE_TONES[row.modelId],
    href: '#pi-tech',
}))
const DEMO_REPORT_MODELS = [
    {
        value: 'ktrs-fm',
        name: PLATFORM_TECH_REPORT.models['ktrs-fm'].name,
        images: {general: reportKtrsFmGeneral, deep: reportKtrsFmDeep},
        items: {
            general: PLATFORM_TECH_REPORT.models['ktrs-fm'].general,
            deep: [...PLATFORM_TECH_REPORT.models['ktrs-fm'].general, ...PLATFORM_TECH_REPORT.models['ktrs-fm'].deep],
        },
    },
]

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'
const DEMO_CLASS = 'border-subtle-3 rounded-lg border p-6'

const iconTile = (
    service: 'tech' | 'patent' | 'bigx' | 'carbon' | 'neutral',
    Icon: typeof Gauge,
    size?: 'md' | 'sm',
) => (
    <span className={platformServiceIconVariants({service, size})}>
        <Icon aria-hidden="true" />
    </span>
)

const DEMO_HUB_NODES = [
    {label: '기술평가', service: 'tech' as const, icon: <Gauge aria-hidden="true" />},
    {label: '특허평가', service: 'patent' as const, icon: <FileBadge aria-hidden="true" />},
    {label: 'K-BIGx 보고서', service: 'bigx' as const, icon: <FileChartColumn aria-hidden="true" />},
    {label: '탄소중립', service: 'carbon' as const, icon: <Leaf aria-hidden="true" />},
]

const DEMO_FEATURES = [
    {
        id: 'a',
        title: '기능 이름',
        description: '기능을 한두 줄로 설명합니다. 길면 줄바꿈됩니다.',
        image: <PlatformFeatureImage src={platformExpertise} />,
    },
    {
        id: 'b',
        title: '기능 이름',
        description: '그림이 없는 카드는 제목부터 시작합니다.',
        image: <PlatformFeatureImage src={platformData} />,
    },
    {id: 'c', title: '그림 없는 카드', description: '모바일(768 미만)에서는 그림을 모두 숨깁니다.'},
]

const DEMO_STATS = [
    {label: '업력', value: '25', unit: '년', description: '숫자는 0부터 올라갑니다'},
    {label: '데이터', value: '86', unit: '만 건', description: '화면에 60% 들어올 때 시작'},
    {label: '모형', value: 'AI', unit: '모델', description: '숫자가 아니면 그대로'},
]

const DEMO_QUESTIONS = [
    {
        id: 'q1',
        question: '첫 번째 질문인가요?',
        answers: ['답변 한 줄입니다.', '답변은 점검 표시와 함께 줄마다 섭니다.'],
    },
    {id: 'q2', question: '두 번째 질문인가요?', answers: ['질문을 고르면 답변 칸이 바뀝니다.']},
    {id: 'q3', question: '세 번째 질문인가요?', answers: ['방향키 · Home · End 로도 고릅니다.']},
]

const DEMO_SERVICES = [
    {
        id: 'tech',
        order: '01',
        name: '기술평가',
        description: '카드 어디를 눌러도 이동합니다. 마우스를 올리면 렌즈가 따라옵니다.',
        service: 'tech' as const,
        icon: <Gauge aria-hidden="true" />,
        chips: ['칩 1', '칩 2'],
        chipsLabel: '주요 기능',
        linkLabel: '기술평가 알아보기',
        href: '/corp/platform/technology-evaluation',
    },
    {
        id: 'carbon',
        order: '02',
        name: '탄소중립',
        description: '서비스마다 아이콘 칸 색이 다릅니다.',
        service: 'carbon' as const,
        icon: <Leaf aria-hidden="true" />,
        chips: ['칩 1'],
        chipsLabel: '주요 기능',
        linkLabel: '탄소중립 알아보기',
        href: '/corp/platform/carbon-neutrality',
    },
]

const DEMO_AUDIENCE = [
    {
        id: 'a',
        icon: iconTile('neutral', Building2),
        title: '이용자 묶음',
        subtitle: '부제',
        description: '패널 위쪽에 짧은 파랑 막대가 붙습니다.',
        users: [{name: '이용 주체', uses: '활용 1 · 활용 2'}],
    },
    {
        id: 'b',
        icon: iconTile('neutral', Building2),
        title: '이용자 묶음',
        description: '부제 없이도 씁니다.',
        users: [
            {name: '이용 주체 A', uses: '활용 1 · 활용 2'},
            {name: '이용 주체 B', uses: '활용 3'},
        ],
    },
]

const DEMO_STEPS = [
    {title: '첫 단계', description: '단계 설명입니다.', tags: ['태그 1', '태그 2'], tagsLabel: '선택 항목'},
    {title: '둘째 단계', description: '선이 1 → 2 순서로 그려집니다.'},
    {title: '마지막 단계', description: '마지막 단계 뒤에는 선이 없습니다.'},
]

const USAGE_CODE = `import {PlatformHero, PlatformHeroEmphasis, PlatformSection, PlatformFeatureCards} from '@/components/custom/platform-intro-blocks'
import {PlatformSectionNav} from '@/components/custom/platform-section-nav'
import {PlatformAnchorScroll} from '@/components/custom/platform-anchor-scroll'

<main id="main" tabIndex={-1} className="bg-page flex-1 [--platform-header-h:--spacing(28)] [--platform-section-nav-h:--spacing(14)]">
  <div className="grid-layout gap-10 pt-10 *:col-span-full">
    <PageTitleBar title="오픈 플랫폼 소개" breadcrumb={…} />
    <PlatformHero
      headingId="platform-hero-title"
      eyebrow="Korea Technology-rating Open Platform"
      title={<>개방형 기술평가 플랫폼 <PlatformHeroEmphasis>K-TOP</PlatformHeroEmphasis></>}
      lead={<p>…</p>}
      actions={<Button asChild size="lg"><a href="#services">주요 서비스 살펴보기</a></Button>}
      visual={<PlatformHubOrbit nodes={…} label="…" className="justify-self-end" />}
      className="lg:grid-cols-2" // 플랫폼 소개만 글:그림 1:1(궤도 그림 칸을 넓힌다)
      tone="blue" // 기술평가 teal · 특허평가 violet · K-BIGx navy · 탄소중립 green
    />
  </div>
  <PlatformSectionNav items={[{id: 'value', label: '핵심 가치'}, …]} />
  <PlatformAnchorScroll /> {/* 화면 안 #섹션 링크를 부드럽게 스크롤 — 한 번만 둔다 */}
  <PlatformSection id="value" title={['첫 줄', '둘째 줄']}>
    <PlatformFeatureCards items={…} />
  </PlatformSection>
  <PlatformSection id="about" tone="muted" title="…" description="…">…</PlatformSection>
</main>`

const BLOCK_COLUMNS = [
    {key: 'name', header: '블록', align: 'start', rowHeader: true},
    {key: 'file', header: '파일', align: 'start'},
    {key: 'role', header: '역할', align: 'start', wrap: true},
] as const

const BLOCK_ROWS = [
    {
        key: 'hero',
        cells: [
            'PlatformHero',
            'custom/platform-intro-blocks.tsx',
            '서비스 색 바탕 띠 · 제목 · 설명 · 버튼 · 그림(1024↑). tone = blue · teal · navy · green',
        ],
    },
    {
        key: 'nav',
        cells: [
            'PlatformSectionNav',
            'custom/platform-section-nav.tsx',
            '사이트 헤더 밑에 붙는 섹션 이동 탭. 지금 섹션 표시(aria-current) · 헤더 높이 측정',
        ],
    },
    {
        key: 'anchor',
        cells: [
            'PlatformAnchorScroll',
            'custom/platform-anchor-scroll.tsx',
            '본문 안 #섹션 링크(탭 · 서비스 살펴보기)를 부드럽게 스크롤하고 도착한 섹션 제목에 포커스. 그리는 것 없음',
        ],
    },
    {
        key: 'section',
        cells: [
            'PlatformSection',
            'custom/platform-intro-blocks.tsx',
            '섹션 틀 + 제목(h2) · 설명. tone = default · muted',
        ],
    },
    {
        key: 'feature',
        cells: ['PlatformFeatureCards', 'custom/platform-intro-blocks.tsx', '그림 · 제목 · 설명 카드 3장'],
    },
    {key: 'stats', cells: ['PlatformStats', 'custom/platform-stats.tsx', '정량 지표 — 숫자가 0부터 올라감']},
    {
        key: 'question',
        cells: ['PlatformQuestionTabs', 'composite/platform-question-tabs.tsx', '질문 카드 탭 + 답변 칸'],
    },
    {
        key: 'service',
        cells: ['PlatformServiceCards', 'custom/platform-service-cards.tsx', '서비스 카드 2 × 2 + 호버 렌즈'],
    },
    {key: 'audience', cells: ['PlatformAudiencePanels', 'custom/platform-intro-blocks.tsx', '이용 대상 패널']},
    {key: 'steps', cells: ['PlatformProcessSteps', 'custom/platform-process-steps.tsx', '번호 원 · 연결선 절차']},
    {
        key: 'cta',
        cells: ['PlatformCtaBanner', 'custom/platform-intro-blocks.tsx', '화면 끝 행동 유도 띠(히어로와 같은 tone)'],
    },
    {
        key: 'hub',
        cells: ['PlatformHubOrbit', 'custom/platform-hub-orbit.tsx', '플랫폼 소개 히어로 그림 — 서비스 칸이 궤도를 돎'],
    },
    {
        key: 'reveal',
        cells: [
            'PlatformReveal · usePlatformReveal',
            'custom/platform-reveal.tsx',
            '순서대로 나타나기 — 20px 아래에서 0.8초에 떠오름, 같이 들어온 요소끼리 0.14초 간격. 제목 · 설명 · 카드 · 절차 칸 하나하나와 표 · 탭 · 배너 덩어리에 씀',
        ],
    },
    {
        key: 'card-stack',
        cells: [
            'PlatformHeroCardStack',
            'custom/platform-hero-card-stack.tsx',
            '기술평가 히어로 그림 — 계단식 카드 3장이 6초마다 8px 떠다님(2초씩 엇갈림)',
        ],
    },
    {
        key: 'tabs',
        cells: [
            'PlatformTabsList · PlatformTabsTrigger',
            'composite/platform-tabs.tsx',
            '회색 트랙 탭(글자 폭 칸 · 고른 칸 카드 면 + 강조 글자). size md · sm',
        ],
    },
    {
        key: 'model-detail',
        cells: [
            'PlatformModelDetailTabs',
            'custom/platform-model-detail-tabs.tsx',
            '모형 상세 탭 — 머리(그림 · 제목 · 설명 · 회색 태그) · 점 목록 · 구조도 · 결과 카드 3장',
        ],
    },
    {
        key: 'diagram-badge',
        cells: ['PlatformDiagramBadge', 'custom/platform-diagram-badge.tsx', '구조도 소제목 앞 그라데이션 아이콘 배지'],
    },
    {
        key: 'compare',
        cells: [
            'PlatformCompareTable',
            'custom/platform-compare-table.tsx',
            '모형 비교표 — PC(1280↑) 표 · 그 아래 줄 카드. 모형 색(model-compare-*) 이름 · 점 · 배지 · 신청 링크 · 호버',
        ],
    },
    {
        key: 'patent-grade',
        cells: [
            'PlatformPatentGradeCard',
            'custom/platform-patent-grade-card.tsx',
            '특허평가 히어로 그림 — 항목별 등급 + 방사형 차트(평균 · 대상 면이 퍼지며 나타남) + 기울어진 배지(뒤에 배지색 번짐). 카드가 떠다님',
        ],
    },
    {
        key: 'flow',
        cells: [
            'PlatformFlowDiagram',
            'custom/platform-flow-diagram.tsx',
            '흐름 도식 — 칸(배지 · 항목) → 화살표 → … → 결과 칸(강조색 채움). PC(1280↑) 가로 · 그 아래 세로. 색은 --platform-flow-*',
        ],
    },
    {
        key: 'definition',
        cells: [
            'PlatformDefinitionPanel',
            'custom/platform-definition-panel.tsx',
            '정의 패널 — 제목 · 칸 3개(동그란 아이콘 · 이름 · 설명) · 결론 한 줄(방패 배지 · 강조 낱말). 색은 --platform-flow-*',
        ],
    },
    {
        key: 'notice',
        cells: [
            'PlatformNotice',
            'custom/platform-notice.tsx',
            '안내 상자 — 옅은 강조 면 + 정보 아이콘 + 안내 줄(점 없음)',
        ],
    },
    {
        key: 'report-frame',
        cells: [
            'PlatformReportFrame · PlatformReportItemList',
            'custom/platform-report-preview.tsx',
            '보고서 미리보기 조각 — 탭 없이 보고서 1장(특허평가)일 때 틀 · 번호 목록만 쓴다. 번호 색은 --platform-tone-step',
        ],
    },
    {
        key: 'icon-panels',
        cells: [
            'PlatformIconPanels',
            'custom/platform-intro-blocks.tsx',
            '아이콘 패널 — 흰 패널 + 위쪽 서비스 색 막대(--platform-tone-fill) · 아이콘 칸 옆 제목 · 설명. 모바일 1열 · 태블릿 2열 · PC(1280↑) 4열',
        ],
    },
    {
        key: 'kbigx-cover',
        cells: [
            'PlatformKBigxReportCover',
            'custom/platform-k-bigx-report-cover.tsx',
            'K-BIGx 히어로 그림 — 기울어진 보고서 표지(두 겹 그림자 shadow-float) + 반원 게이지(값 호가 올라감 · 강조색 번짐). 표지가 기울며 떠다님',
        ],
    },
    {
        key: 'viewer',
        cells: [
            'PlatformReportViewer',
            'custom/platform-report-viewer.tsx',
            '보고서 뷰어 — 항목 메뉴(PC 왼쪽 260 세로 · 그 아래 가로 스크롤) | 패널(이름 · n / 전체 칩 · 설명 · 라이트/다크 캡처 틀 · 주요 제공 정보 2열). 항목 이동은 메뉴 모양과 관계없이 왼 · 오른 방향키',
        ],
    },
    {
        key: 'service-switch',
        cells: [
            'PlatformServiceSwitchProvider · PlatformServiceSwitchTabs · PlatformServicePanel',
            'custom/platform-service-switch.tsx',
            '서비스 토글 — 고른 서비스의 패널만 여러 섹션에 걸쳐 보임(탭 역할 · aria-controls = 그 서비스 패널 전부 · ← → Home End). 섹션 탭 줄 앞(PlatformSectionNav leading)에 붙인다',
        ],
    },
    {
        key: 'service-hero-cards',
        cells: [
            'PlatformServiceHeroCards',
            'custom/platform-service-hero-cards.tsx',
            '히어로 서비스 카드 2장 — 아이콘 칸 · 이름 · 기능 태그, 떠다님(둘째는 3초 엇갈림 · PC 에서 오른쪽으로 40)',
        ],
    },
    {
        key: 'icon-tiles',
        cells: [
            'PlatformIconTiles',
            'custom/platform-intro-blocks.tsx',
            '아이콘 타일 — 아이콘 칸(44) + 굵은 이름 한 줄, 위쪽 서비스 색 막대. 모바일 1 · 태블릿 2 · 1024↑ 3열',
        ],
    },
    {
        key: 'rule-list',
        cells: [
            'PlatformRuleList',
            'custom/platform-intro-blocks.tsx',
            '아이콘 줄 목록 — 순서 없는 기능 나열. 위 굵은 선 · 아이콘 칸(48) 옆 제목 · 설명. 태블릿 이상 3열',
        ],
    },
    {
        key: 'external-link',
        cells: [
            'PlatformExternalLinkButton',
            'custom/platform-external-link-button.tsx',
            '외부 사이트 이동 버튼 — 이동 확인 모달 [확인] 때만 새 탭으로 연다[7.2.1]. 끝에 외부 링크 아이콘',
        ],
    },
    {
        key: 'report',
        cells: [
            'PlatformReportPreview',
            'custom/platform-report-preview.tsx',
            '보고서 미리보기 — 모형 탭 · 유형 눌림 단추 · 스크롤 틀(그림 0.4초 페이드인 · 바꾸면 스크롤 맨 위로 · 늦을 때만 불러오는 중 자리) · 구성 번호 목록. 첫 그림이 뜨면 나머지 그림을 미리 받음',
        ],
    },
]

// K-BIGx 블록 예시 — 화면 <main> 이 넘기는 K-BIGx 색 변수를 감싼다(가이드에는 <main> 이 없다).
const KBIGX_TONE_CLASS =
    '[--platform-tone-fill:var(--color-service-bigx-fill)] [--platform-tone-step:var(--color-service-hero-navy-emphasis)]'
const DEMO_ICON_PANELS = [
    {
        id: 'ai-analysis-report',
        title: 'AI 기반 종합 분석 보고서',
        description: 'AI 기반의 기술정보에 재무정보와 활동성정보 등이 결합된 종합 분석 보고서를 제공합니다.',
        icon: <ThemeImage light={kbigxAiAnalysisReportIcon} dark={kbigxAiAnalysisReportDarkIcon} />,
    },
    {
        id: 'insight',
        title: '인사이트 제공',
        description:
            '고성장 기업정보, R&D 전문기관, 정부 R&D 사업정보 등을 통해 기업에 기술혁신 인사이트를 제공합니다.',
        icon: <ThemeImage light={kbigxInsightIcon} dark={kbigxInsightDarkIcon} />,
    },
]
const DEMO_VIEWER_IMAGES = {
    briefing: {light: kbigxReportBriefing, dark: kbigxReportBriefingDark},
    company: {light: kbigxReportCompany, dark: kbigxReportCompanyDark},
} as const
const DEMO_VIEWER_SECTIONS = PLATFORM_K_BIGX_PREVIEW.sections
    .filter((section) => section.id === 'briefing' || section.id === 'company')
    .map((section) => ({...section, image: DEMO_VIEWER_IMAGES[section.id === 'briefing' ? 'briefing' : 'company']}))

// 탄소중립 블록 예시 — 화면 <main> 이 넘기는 탄소중립 색 변수를 감싼다(가이드에는 <main> 이 없다).
const CARBON_TONE_CLASS =
    '[--platform-icon-color:var(--color-platform-carbon-accent)] [--platform-icon-surface:var(--color-platform-accent-carbon-surface)] [--platform-switch-accent:var(--color-platform-carbon-accent)] [--platform-switch-on-accent:var(--color-platform-carbon-on-accent)] [--platform-tone-fill:var(--color-service-carbon-fill)]'
const DEMO_CARBON_HERO_CARDS = [
    {title: PLATFORM_CARBON_HERO.cards[0].title, tags: PLATFORM_CARBON_HERO.cards[0].tags, icon: <Building2 />},
    {title: PLATFORM_CARBON_HERO.cards[1].title, tags: PLATFORM_CARBON_HERO.cards[1].tags, icon: <Leaf />},
]
const DEMO_ICON_TILES = [
    {id: 'green-finance', label: '녹색금융 수혜기업', icon: <Building2 />},
    {id: 'reviewer', label: '택소노미 평가 외부검토기관', icon: <UserCheck />},
    {id: 'esg', label: 'ESG 공시기업', icon: <FileText />},
]
const DEMO_RULE_ITEMS = [
    {
        id: 'a',
        title: '키워드 검색',
        description: '생산 제품, 도입 시설, 업종코드 등 기업활동과 관련된 키워드 검색',
        icon: <Layers />,
    },
    {
        id: 'b',
        title: '전문평가',
        description: '전문평가자격을 보유한 외부검토기관은 평가 수행 후 보고서 출력',
        icon: <UserCheck />,
    },
]

const PROPS_ITEMS = [
    ['PlatformHero', 'headingId', '제목(h2) id — section 이름(aria-labelledby).', '-', 'string'],
    [
        'PlatformHero',
        'eyebrow · title · lead',
        '제목 위 한 줄(굵기 800 · 자간 0.12em · tone 강조색) · 제목 · 설명(최대 폭 612 = 18px 의 34em — 더 작은 글자의 둘째 문단은 사용처가 폭을 준다). 강조 낱말은 PlatformHeroEmphasis.',
        '-',
        'ReactNode',
    ],
    ['PlatformHero', 'actions · note', '버튼 줄 · 버튼 아래 작은 안내(아이콘 + 한 줄).', '-', 'ReactNode'],
    ['PlatformHero', 'visual', '오른쪽 그림 — 1024 미만에서 숨김.', '-', 'ReactNode'],
    [
        'PlatformHero · PlatformCtaBanner',
        'tone',
        '바탕 띠 · 번진 원 색 · 히어로 강조 글자색(--platform-tone-emphasis).',
        "'blue'",
        "'blue' | 'teal' | 'violet' | 'navy' | 'green'",
    ],
    ['PlatformSectionNav', 'items', '섹션 id · 이름. id 는 PlatformSection 의 id 와 같다.', '-', '{id; label}[]'],
    ['PlatformSection', 'id', 'section id(이동 도착 지점). 제목 id 는 `${id}-title`.', '-', 'string'],
    ['PlatformSection', 'title', '제목 — 배열이면 모든 폭에서 줄마다 끊는다.', '-', 'ReactNode | string[]'],
    [
        'PlatformSection',
        'tone',
        '바탕 — 흰색 · 옅은 회색 띠(platform-section-band).',
        "'default'",
        "'default' | 'muted'",
    ],
    [
        'PlatformFeatureCards',
        'items',
        '카드 — 그림은 PlatformFeatureImage(높이 88 · 폭은 그림 비율, 원본 비율을 CSS 로도 둬 지연 로딩 크기 경고가 없다). 설명이 목록 등 요소이면 <div> 로 감싼다.',
        '-',
        '{id; title; description: ReactNode; image?}[]',
    ],
    ['PlatformStats', 'items', '지표 — value 가 숫자면 올라간다.', '-', '{label; value; unit?; description}[]'],
    [
        'PlatformQuestionTabs',
        'items · label',
        '질문 · 답변 목록 · 목록 이름(낭독기).',
        '-',
        '{id; question; answers}[]',
    ],
    ['PlatformServiceCards', 'items', '서비스 카드 — service 가 아이콘 칸 색을 고른다.', '-', 'PlatformServiceCard[]'],
    [
        'PlatformAudiencePanels',
        'items',
        '패널 — 아이콘 칸 · 제목 · 부제 · 설명 · 이용 주체.',
        '-',
        'PlatformAudiencePanel[]',
    ],
    ['PlatformProcessSteps', 'steps', '단계 — 제목 · 설명 · 태그.', '-', '{title; description?; tags?; tagsLabel?}[]'],
    [
        'PlatformHubOrbit',
        'nodes · label',
        '궤도 칸(아이콘 · 이름) · 그림 전체 설명(role="img"). 히어로 칸 오른쪽에 붙이려면 className="justify-self-end".',
        '-',
        '{label; icon}[] · string',
    ],
    ['PlatformReveal', 'as', '감싸는 태그(h2 · p · li 등). 나머지 props 는 그 태그로 넘긴다.', "'div'", 'ElementType'],
    [
        'PlatformHeroCardStack',
        'items · label',
        '카드(아이콘 · 이름 · 제목 · 설명) · 목록 이름.',
        '-',
        'PlatformHeroCard[] · string',
    ],
    [
        'PlatformPatentGradeCard',
        'title · grades · label',
        '카드 제목 · 항목별 등급 · 그림 전체 설명(role="img").',
        '-',
        'string · {label; grade}[] · string',
    ],
    [
        'PlatformFlowDiagram',
        'columns · result · note · label',
        '칸(배지 아이콘 · 제목 · 항목) · 결과 칸 · 아래 안내 · 도식 이름(role="group").',
        '-',
        'PlatformFlowColumn[] · PlatformFlowResult · string · string',
    ],
    [
        'PlatformDefinitionPanel',
        'title · items · conclusion',
        '제목 · 칸(아이콘 · 이름 · 설명) · 결론(<b> 는 강조 낱말).',
        '-',
        'string · PlatformDefinitionItem[] · ReactNode',
    ],
    ['PlatformNotice', 'items', '안내 줄(<b> 는 굵게).', '-', 'ReactNode[]'],
    [
        'PlatformReportFrame',
        'label · image · alt · regionKey',
        '보고서 이름 · 캡처 · 대체 텍스트 · 바뀌면 스크롤을 맨 위로 되돌리는 키.',
        '-',
        'string · StaticImageData · string · string?',
    ],
    ['PlatformTabsList', 'size', '칸 높이 42(md) · 36(sm).', "'md'", "'md' | 'sm'"],
    [
        'PlatformModelDetailTabs',
        'items · label · heading · chipsLabel',
        '모형 상세(그림 · 구조도 ReactNode 포함) · 탭 목록 이름 · 낭독기 전용 h3 · 태그 목록 이름.',
        '-',
        'PlatformModelDetail[] · string',
    ],
    [
        'PlatformDiagramBadge',
        'tone · size',
        '그라데이션 색 · 크기(30 · 34).',
        "'accent' · 'sm'",
        "'accent' | 'growth' · 'sm' | 'md'",
    ],
    [
        'PlatformCompareTable',
        'rows · columns · caption',
        '줄(모형 색 tone · 그림 · href 포함) · 칸 이름 · 표 이름(sr-only).',
        '-',
        'PlatformCompareRow[] · PlatformCompareColumns · string',
    ],
    [
        'PlatformIconPanels',
        'items · columns',
        '패널 — 아이콘(그림, 꾸밈) · 제목 · 설명 · 열 수(3: 1024↑ 3열 · 4: 1280↑ 4열 — 칸이 좁아 칸 사이 16 · 좌우 안쪽 여백 16).',
        '- · 4',
        'PlatformIconPanel[] · 3 | 4',
    ],
    ['PlatformIconTiles', 'items · label', '타일(아이콘 · 이름) · 목록 이름.', '-', 'PlatformIconTile[] · string?'],
    ['PlatformRuleList', 'items', '칸(아이콘 · 제목 · 설명).', '-', 'PlatformRuleItem[]'],
    [
        'PlatformServiceSwitchProvider',
        'options · panelKeys · defaultValue',
        '서비스(value · 이름) · 서비스별 패널을 둔 섹션 이름(패널 id = 섹션-서비스) · 처음 고른 서비스.',
        '- · - · 첫 서비스',
        'PlatformServiceOption[] · string[] · string?',
    ],
    ['PlatformServicePanel', 'value · panelKey', '어느 서비스의 · 어느 섹션 패널인지.', '-', 'string · string'],
    [
        'PlatformSectionNav',
        'leading',
        '탭 줄 앞에 붙는 것(서비스 토글). PC 한 줄 · 그 아래 두 단(사이 8).',
        '-',
        'ReactNode?',
    ],
    [
        'PlatformSection',
        'eyebrow · label',
        '제목 위 머리글 · 제목 없이 쓸 때 섹션 이름(서비스별 제목은 PlatformSectionHeading 을 패널 안에).',
        '-',
        'ReactNode? · string?',
    ],
    [
        'PlatformHero',
        'titleSize',
        '제목 크기 — default(PC 50) · compact(PC 40, 문구가 긴 화면).',
        "'default'",
        "'default' | 'compact'",
    ],
    [
        'PlatformExternalLinkButton',
        'href · dialog · variant',
        '갈 주소 · 확인 모달 문구(제목 · 사이트 이름 · 물음) · 버튼 모양.',
        "- · - · 'default'",
        "string · PlatformExternalLinkDialog · 'default' | 'secondary'",
    ],
    [
        'PlatformKBigxReportCover',
        'brand · title · contents · publisher · label',
        '표지 브랜드 · 제목 · 목차 줄 · 발행처 · 그림 전체 설명(role="img").',
        '-',
        'string · string · string[] · string · string',
    ],
    [
        'PlatformReportViewer',
        'sections · listLabel · reportName · infoTitle',
        '항목(id · 이름 · 설명 · 라이트/다크 캡처 · 주요 제공 정보) · 메뉴 이름 · 대체 텍스트 앞부분 · 목록 제목.',
        '-',
        'PlatformReportViewerSection[] · string · string · string',
    ],
    [
        'PlatformReportFrame',
        'darkImage · isBare · frameHeightClassName',
        '다크 캡처 · 카드 없이 틀만 · 틀 높이.',
        "- · false · 'h-110 lg:h-140'",
        'StaticImageData? · boolean · string',
    ],
    [
        'PlatformReportPreview',
        'models · types',
        '모형별 유형 캡처 · 구성 목록 · 유형(id · 이름 · 안내).',
        '-',
        'PlatformReportModel[] · PlatformReportType[]',
    ],
] as const

const PlatformIntroGuidePage = () => (
    <GuidePageShell
        title="플랫폼 소개 블록 (PlatformIntro)"
        description="플랫폼 소개 화면(오픈 플랫폼 소개 · 기술평가 · 특허평가 · K-BIGx 보고서 · 탄소중립)이 같이 쓰는 히어로 · 섹션 · 카드 · 절차 · 배너 블록입니다."
    >
        <BaseCard>
            <section aria-labelledby="pi-overview" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-overview" className="typo-h4-bold">
                        구성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/platform" className={LINK_CLASS}>
                            오픈 플랫폼 소개
                        </Link>
                        . 스타일은 <code>theme/platform-intro.variants.ts</code> 한 곳에 있습니다.
                    </p>
                </div>
                <Table caption="플랫폼 소개 블록 목록" columns={BLOCK_COLUMNS} rows={BLOCK_ROWS} size="md" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <ul className={LIST_CLASS}>
                    <li>
                        색은 플랫폼 소개 전용 토큰 한 벌입니다 — 패널 면 · 테두리 platform-panel(-border), 강조색
                        platform-accent(-foreground · -subtle), 회색 섹션 띠 platform-section-band. 제목 · 설명 글자는
                        화면 폭에 따라 커지는 typo-platform-* 를 씁니다.
                    </li>
                    <li>
                        섹션 바탕은 흰색(default)과 옅은 회색 띠(muted)를 번갈아 둡니다. 위아래 여백은 모바일 56 ·
                        태블릿 72 · PC 96 입니다.
                    </li>
                    <li>
                        섹션 탭은 사이트 헤더 높이를 재서 <code>main</code> 에 <code>--platform-header-h</code> ·{' '}
                        <code>--platform-section-nav-h</code> 를 둡니다. 섹션의 <code>scroll-mt</code> 가 이 둘을 써서
                        이동한 섹션 제목이 가리지 않습니다. 처음 값은 <code>main</code> 에 줍니다(위 코드).
                    </li>
                    <li>
                        섹션 제목 · 설명 · 카드 · 절차 칸은 화면에 들어오면 하나씩 떠오르고(PlatformReveal — 20px ·
                        0.8초, 같이 들어온 요소끼리 0.14초 간격), 표 · 탭 · 배너는 덩어리째 떠오릅니다. 동작 줄이기
                        설정이면 모든 움직임이 없습니다[6.3.1].
                    </li>
                    <li>
                        화면마다 바꾸는 색은 <code>main</code> 의 CSS 변수로 넘깁니다 — 기능 카드 강조색{' '}
                        <code>--platform-card-accent</code>, 샘플 배지 · 비교표 머리 줄{' '}
                        <code>--platform-tone-fill</code>, 절차 번호 원 · 선{' '}
                        <code>--platform-tone-step(-foreground)</code>(보고서 구성 번호 포함), 흐름 도식 · 정의 패널{' '}
                        <code>--platform-flow-accent(-bright) · --platform-flow-foreground</code>. 없으면 플랫폼 소개
                        색입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-hero" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-hero" className="typo-h4-bold">
                        히어로 · 허브 궤도 (PlatformHero · PlatformHubOrbit)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        1024 이상에서 글 | 그림 두 칸(최소 높이 504), 그 아래는 그림을 숨기고 글만 둡니다. 궤도는 40초에
                        한 바퀴 돌고(animate-orbit-spin), 마우스를 올리면 멈춥니다. 칸 · 글자 · 아이콘은 그림 폭(최대
                        446)에 비례해 함께 줄어들고, 칸이 돌며 차지하는 지름이 그림 칸 안에 꼭 들어가게 맞춰져 히어로
                        끝에 붙지 않습니다(1024~1279 는 0.7배까지만 줄어든다). 실제 화면은 글:그림 1:1 · 그림을 오른쪽
                        끝에 붙여 오른쪽 여백을 안쪽 여백(56)과 맞춥니다.
                    </p>
                </div>
                <PlatformHero
                    headingId="guide-platform-hero"
                    eyebrow="EYEBROW · 제목 위 한 줄"
                    title={
                        <>
                            서비스를 말하는 제목 <PlatformHeroEmphasis>강조</PlatformHeroEmphasis>
                        </>
                    }
                    lead={<p>설명은 최대 612(34em) 폭에서 줄바꿈됩니다. 버튼은 모바일에서 한 줄씩 꽉 찹니다.</p>}
                    actions={
                        <Button asChild size="lg">
                            <a href="#pi-hero">버튼</a>
                        </Button>
                    }
                    visual={<PlatformHubOrbit nodes={DEMO_HUB_NODES} label="서비스 4개가 K-TOP 둘레를 도는 개념도" />}
                />
                <div className="grid gap-4 md:grid-cols-2">
                    <PlatformCtaBanner
                        headingId="guide-cta-teal"
                        tone="teal"
                        title="tone teal (기술평가)"
                        actions={
                            <Button asChild size="lg">
                                <a href="#pi-hero">버튼</a>
                            </Button>
                        }
                    />
                    <PlatformCtaBanner
                        headingId="guide-cta-navy"
                        tone="navy"
                        title="tone navy (K-BIGx)"
                        actions={
                            <Button asChild size="lg">
                                <a href="#pi-hero">버튼</a>
                            </Button>
                        }
                    />
                    <PlatformCtaBanner
                        headingId="guide-cta-green"
                        tone="green"
                        title="tone green (탄소중립)"
                        actions={
                            <Button asChild size="lg">
                                <a href="#pi-hero">버튼</a>
                            </Button>
                        }
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-cards" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-cards" className="typo-h4-bold">
                        기능 카드 · 정량 지표 (PlatformFeatureCards · PlatformStats)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        카드는 강조색(--platform-card-accent) 9% 가 위에서 아래로 옅어지는 면 · 강조색 18% 를 섞은 옅은
                        테두리입니다. 태블릿(768~1023) 2열에서 카드 수가 홀수면 마지막 카드가 한 줄을 다 씁니다. 지표
                        숫자는 화면에 들어오면 1.6초 동안 0부터 올라갑니다 — 낭독기는 완성된 값을 읽습니다.
                    </p>
                </div>
                <PlatformFeatureCards items={DEMO_FEATURES} />
                <PlatformStats items={DEMO_STATS} label="지표 예시" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-question" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-question" className="typo-h4-bold">
                        질문 탭 (PlatformQuestionTabs)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        ui/tabs(Radix) 위에 카드 모양만 얹은 탭입니다. PC 6칸 · 태블릿 3칸 · 모바일 2칸이고, PC 에서
                        고른 질문 아래에 꼬리가 붙습니다.
                    </p>
                </div>
                <div className={DEMO_CLASS}>
                    <PlatformQuestionTabs items={DEMO_QUESTIONS} label="질문 예시" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-service" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-service" className="typo-h4-bold">
                        서비스 카드 (PlatformServiceCards)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        링크 하나를 카드 전체로 넓혀 어디를 눌러도 이동합니다. 마우스를 올리면 커서를 따라 원 안에서
                        카드가 반전되고, 짙은 남색 면 위로 서비스 예시 그림(PlatformServiceArt)이 비칩니다. 원은 튀듯이
                        커지고(back) 커서를 살짝 늦게 따라옵니다. 터치 · 동작 줄이기에서는 렌즈가 없고, 키보드 포커스는
                        카드 테두리 · 링으로 보입니다. 남색 렌즈 면은 흰 글자를 감싼 요소의 배경으로 두어, 명도 대비
                        검사기가 글자 뒤 배경을 카드의 흰 바탕이 아닌 남색으로 읽습니다[5.3.3].
                    </p>
                </div>
                <PlatformServiceCards items={DEMO_SERVICES} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-audience" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-audience" className="typo-h4-bold">
                        이용 대상 패널 · 절차 (PlatformAudiencePanels · PlatformProcessSteps)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        절차는 PC(1024↑) 가로 · 가운데 정렬, 그 아래는 왼쪽 번호 원 + 세로선입니다. 화면에 들어오면 선이
                        순서대로 하나씩(1초) 그려지고 다 그린 채 멈춥니다(반복 없음, Web Animations API). 화면에서
                        완전히 벗어났다가 다시 보이면 첫 선부터 새로 그립니다.
                    </p>
                </div>
                <PlatformAudiencePanels items={DEMO_AUDIENCE} />
                <div className={DEMO_CLASS}>
                    <PlatformProcessSteps steps={DEMO_STEPS} />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-tech" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-tech" className="typo-h4-bold">
                        기술평가 블록 (HeroCardStack · PlatformTabs · ModelDetailTabs · CompareTable · ReportPreview)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/platform/technology-evaluation" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 기술평가
                        </Link>
                        . 모형 구조도는{' '}
                        <Link href="/component-guide/model-structure-diagram" className={LINK_CLASS}>
                            평가모형 구조도 가이드
                        </Link>
                        를 봅니다.
                    </p>
                </div>
                <h3 className="typo-title-m-bold text-foreground">히어로 카드 묶음 · 순서대로 나타나기</h3>
                <div className={`${DEMO_CLASS} flex flex-col items-center gap-6`}>
                    <PlatformHeroCardStack items={DEMO_HERO_CARDS} label="제공하는 평가모형(예시)" />
                    <div className="grid w-full gap-3 md:grid-cols-3">
                        {['첫째', '둘째', '셋째'].map((order) => (
                            <PlatformReveal
                                key={order}
                                className="bg-platform-panel-inset typo-body-l-bold rounded-md p-4"
                            >
                                {order} — 0.14초씩 늦게
                            </PlatformReveal>
                        ))}
                    </div>
                </div>
                <h3 className="typo-title-m-bold text-foreground">플랫폼 탭 · 구조도 배지</h3>
                <div className={`${DEMO_CLASS} flex flex-wrap items-center gap-4`}>
                    <Tabs defaultValue="a">
                        <PlatformTabsList aria-label="플랫폼 탭 예시">
                            <PlatformTabsTrigger value="a">KTRS-FM</PlatformTabsTrigger>
                            <PlatformTabsTrigger value="b">Tech-Index</PlatformTabsTrigger>
                        </PlatformTabsList>
                        <TabsContent value="a" />
                        <TabsContent value="b" />
                    </Tabs>
                    <Tabs defaultValue="a">
                        <PlatformTabsList size="sm" aria-label="작은 플랫폼 탭 예시">
                            <PlatformTabsTrigger value="a">일반보고서</PlatformTabsTrigger>
                            <PlatformTabsTrigger value="b">심층보고서</PlatformTabsTrigger>
                        </PlatformTabsList>
                        <TabsContent value="a" />
                        <TabsContent value="b" />
                    </Tabs>
                    <PlatformDiagramBadge>
                        <Gauge />
                    </PlatformDiagramBadge>
                    <PlatformDiagramBadge tone="growth" size="md">
                        <Coins />
                    </PlatformDiagramBadge>
                </div>
                <h3 className="typo-title-m-bold text-foreground">모형 상세 탭(구조도 없이)</h3>
                <PlatformModelDetailTabs items={DEMO_MODEL_DETAIL} label="모형 상세 예시" chipsLabel="주요 키워드" />
                <h3 className="typo-title-m-bold text-foreground">모형 비교표</h3>
                <PlatformCompareTable
                    rows={DEMO_COMPARE_ROWS}
                    columns={PLATFORM_TECH_COMPARE.columns}
                    caption="모형 비교표 예시"
                />
                <h3 className="typo-title-m-bold text-foreground">보고서 미리보기</h3>
                <ul className={LIST_CLASS}>
                    <li>
                        모형 탭 · 유형(일반 · 심층)을 바꾸면 스크롤 틀을 새로 그려 스크롤이 맨 위로 돌아가고, 그림은
                        0.4초에 걸쳐 스르르 나타납니다(구성 목록도 함께). 캐시에서 바로 뜬 그림도 매번 같은 페이드를
                        탑니다.
                    </li>
                    <li>
                        불러오는 중 자리(회색 막대 · 빛 띠)는 0.3초 넘게 걸릴 때만 나타나고, 그림이 뜨면 지웁니다 —
                        곧바로 뜨는 그림 앞에서 번쩍이지 않게 합니다.
                    </li>
                    <li>
                        처음 보이는 그림이 뜨면 나머지 모형 · 유형 그림을 화면과 같은 크기 후보(srcSet · sizes)로 한 번
                        미리 받아, 탭을 옮길 때 기다림이 없습니다.
                    </li>
                    <li>
                        그림에는 원본 비율(aspect-ratio)을 CSS 로도 둡니다 — h-auto 가 width · height 속성을 덮어 Chrome
                        이 &apos;Lazy-loaded images should have explicit dimensions&apos; 로 잡기 때문입니다.
                    </li>
                </ul>
                <PlatformReportPreview
                    models={DEMO_REPORT_MODELS}
                    types={PLATFORM_TECH_REPORT.types}
                    modelListLabel="보고서 평가모형(예시)"
                    typeLabel="보고서 유형(예시)"
                    sampleBadge={PLATFORM_TECH_REPORT.sampleBadge}
                    scrollCaption={PLATFORM_TECH_REPORT.scrollCaption}
                    sampleNote={PLATFORM_TECH_REPORT.sampleNote}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-patent" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-patent" className="typo-h4-bold">
                        특허평가 블록 (PatentGradeCard · FlowDiagram · DefinitionPanel · Notice)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/platform/patent-evaluation" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 특허평가
                        </Link>
                        . 흐름 도식 · 정의 패널은 화면 &lt;main&gt; 의 --platform-flow-* 색을 따릅니다(아래 예시는 기본
                        파랑).
                    </p>
                </div>
                <h3 className="typo-title-m-bold text-foreground">특허 평가등급 카드</h3>
                <div className={`${DEMO_CLASS} flex justify-center`}>
                    <PlatformPatentGradeCard {...PLATFORM_PATENT_HERO.gradeCard} />
                </div>
                <h3 className="typo-title-m-bold text-foreground">흐름 도식</h3>
                <PlatformFlowDiagram
                    columns={DEMO_FLOW_COLUMNS}
                    result={{...PLATFORM_PATENT_PRINCIPLE.result, icon: <Award />}}
                    note={PLATFORM_PATENT_PRINCIPLE.note}
                    label="흐름 도식 예시"
                />
                <h3 className="typo-title-m-bold text-foreground">정의 패널</h3>
                <PlatformDefinitionPanel
                    title={PLATFORM_PATENT_PRINCIPLE.definition.title}
                    items={DEMO_DEFINITION_ITEMS}
                    conclusion={
                        <>
                            매매를 통한 가치 실현 가능성이 높은 지식재산을 <b>재산적 가치가 있는 지식재산</b>으로 정의
                            및 평가
                        </>
                    }
                />
                <h3 className="typo-title-m-bold text-foreground">안내 상자</h3>
                <PlatformNotice
                    items={[
                        <>
                            특허번호 조회는 <b>로그인 후</b> 이용할 수 있습니다.
                        </>,
                        '13자리 또는 7자리 등록·출원번호를 입력합니다.',
                    ]}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-kbigx" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-kbigx" className="typo-h4-bold">
                        K-BIGx 블록 (ReportCover · IconPanels · ReportViewer)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/platform/k-bigx-report" className={LINK_CLASS}>
                            플랫폼 소개 &gt; K-BIGx 보고서
                        </Link>
                        . 서비스 색은 화면 &lt;main&gt; 의 --platform-tone-fill · --platform-tone-step 을 따릅니다(아래
                        예시는 K-BIGx 파랑). 분석 구조 도식은{' '}
                        <Link href="/component-guide/model-structure-diagram" className={LINK_CLASS}>
                            평가모형 구조도
                        </Link>{' '}
                        가이드에 있습니다.
                    </p>
                </div>
                <div className={`${KBIGX_TONE_CLASS} flex flex-col gap-6`}>
                    <h3 className="typo-title-m-bold text-foreground">보고서 표지</h3>
                    <div className={`${DEMO_CLASS} flex justify-center`}>
                        <PlatformKBigxReportCover {...PLATFORM_K_BIGX_HERO.cover} className="max-w-120" />
                    </div>
                    <h3 className="typo-title-m-bold text-foreground">아이콘 패널</h3>
                    <PlatformIconPanels items={DEMO_ICON_PANELS} className="xl:grid-cols-2" />
                    <h3 className="typo-title-m-bold text-foreground">보고서 뷰어</h3>
                    <PlatformReportViewer
                        sections={DEMO_VIEWER_SECTIONS}
                        listLabel="보고서 항목(예시)"
                        reportName={PLATFORM_K_BIGX_PREVIEW.reportName}
                        infoTitle={PLATFORM_K_BIGX_PREVIEW.infoTitle}
                        sampleBadge={PLATFORM_K_BIGX_PREVIEW.sampleBadge}
                        scrollCaption={PLATFORM_K_BIGX_PREVIEW.scrollCaption}
                        sampleNote={PLATFORM_K_BIGX_PREVIEW.sampleNote}
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-carbon" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pi-carbon" className="typo-h4-bold">
                        탄소중립 블록 (ServiceSwitch · ServiceHeroCards · IconTiles · RuleList · ExternalLinkButton)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/platform/carbon-neutrality" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 탄소중립
                        </Link>
                        . 서비스 색은 화면 &lt;main&gt; 의 --platform-switch-* · --platform-icon-* ·
                        --platform-tone-fill 을 따릅니다(아래 예시는 탄소중립 초록).
                    </p>
                </div>
                <div className={`${CARBON_TONE_CLASS} flex flex-col gap-6`}>
                    <h3 className="typo-title-m-bold text-foreground">서비스 토글 · 서비스별 패널</h3>
                    <PlatformServiceSwitchProvider options={PLATFORM_CARBON_SWITCH.options} panelKeys={['guide']}>
                        <PlatformServiceSwitchTabs label="서비스 토글(예시)" className="lg:w-fit" />
                        <PlatformServicePanel value="leading-sme" panelKey="guide" className={DEMO_CLASS}>
                            선도중소기업확인을 고르면 보이는 패널
                        </PlatformServicePanel>
                        <PlatformServicePanel value="taxonomy" panelKey="guide" className={DEMO_CLASS}>
                            개방형 K-택소노미를 고르면 보이는 패널
                        </PlatformServicePanel>
                    </PlatformServiceSwitchProvider>
                    <h3 className="typo-title-m-bold text-foreground">히어로 서비스 카드</h3>
                    <div className={`${DEMO_CLASS} flex justify-center`}>
                        <PlatformServiceHeroCards items={DEMO_CARBON_HERO_CARDS} label="탄소중립 서비스 카드 예시" />
                    </div>
                    <h3 className="typo-title-m-bold text-foreground">아이콘 타일</h3>
                    <PlatformIconTiles items={DEMO_ICON_TILES} />
                    <h3 className="typo-title-m-bold text-foreground">아이콘 줄 목록</h3>
                    <PlatformRuleList items={DEMO_RULE_ITEMS} />
                    <h3 className="typo-title-m-bold text-foreground">외부 사이트 이동 버튼</h3>
                    <div>
                        <PlatformExternalLinkButton
                            href={PLATFORM_CARBON_HERO.actionHref}
                            dialog={PLATFORM_CARBON_MOVE_DIALOG}
                        >
                            {PLATFORM_CARBON_HERO.actionLabel}
                        </PlatformExternalLinkButton>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-a11y" className="flex flex-col gap-6">
                <h2 id="pi-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className={LIST_CLASS}>
                    <li>섹션 탭은 앵커 링크이고 지금 섹션에 aria-current 를 둡니다[6.4.1].</li>
                    <li>
                        화면 안 앵커(섹션 탭 · 서비스 살펴보기)는 부드럽게 스크롤한 뒤 도착한 섹션 제목(h2)에 포커스를
                        옮깁니다 — 동작 줄이기 설정이면 바로 이동합니다(PlatformAnchorScroll).
                    </li>
                    <li>
                        허브 궤도는 한 장의 그림(<code>role=img</code> + aria-label)이고 안쪽은 읽지 않습니다[5.1.1].
                    </li>
                    <li>지표 · 절차 번호는 꾸밈이고, 낭독기는 완성된 값 · ‘n단계’를 읽습니다.</li>
                    <li>서비스 카드의 반전 렌즈는 aria-hidden · inert 라 같은 내용을 두 번 읽지 않습니다.</li>
                    <li>
                        모형 비교표는 caption · th scope 로 구조화하고, 1280 미만 카드에서는 칸 이름을 보이는 글로
                        둡니다[7.3.2]. 모형 색은 꾸밈이고 이름이 글로 함께 있습니다[5.3.1].
                    </li>
                    <li>
                        보고서 미리보기 틀은 키보드로 포커스해 방향키로 스크롤합니다(role=region · tabIndex 0)[6.1.1].
                        유형은 눌림 단추(aria-pressed)입니다.
                    </li>
                    <li>
                        움직임(궤도 · 떠다님 · 나타나기 · 숫자 · 선 · 렌즈 · 결합평가 화살표 · 빛 띠)은 동작 줄이기
                        설정에서 모두 멈춥니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pi-props" className="flex flex-col gap-6">
                <h2 id="pi-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="플랫폼 소개 블록 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PlatformIntroGuidePage
