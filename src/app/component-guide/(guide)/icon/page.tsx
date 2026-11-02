// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    GuideAssetGroup,
    summarizeAssets,
    type GuideAssetGroupData,
    type GuideAssetItem,
} from '@/components/custom/guide-asset-group'
import type {LucideIcon} from 'lucide-react'
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    ArrowUpDown,
    ArrowUpRight,
    Award,
    Blocks,
    Braces,
    BriefcaseBusiness,
    Building2,
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    CircleAlert,
    CircleCheck,
    CircleCheckBig,
    CircleQuestionMark,
    Component,
    Copy,
    CreditCard,
    Download,
    EllipsisVertical,
    ExternalLink,
    Eye,
    EyeOff,
    File,
    FileBadge,
    FileDigit,
    FilePenLine,
    FileSearch,
    FileSearchCorner,
    Folder,
    FolderKanban,
    FolderSearch,
    GitBranch,
    Globe,
    History,
    Home,
    Info,
    Layers,
    LayoutGrid,
    Lightbulb,
    LoaderCircle,
    Menu,
    MessageCircleMore,
    Moon,
    NotepadText,
    Palette,
    Paperclip,
    Pause,
    Pin,
    Play,
    Plus,
    Printer,
    RotateCcw,
    ScrollText,
    Search,
    Sparkles,
    SquareArrowOutUpRight,
    Star,
    Sun,
    ThumbsUp,
    TimerReset,
    TrendingUp,
    Trophy,
    Upload,
    User,
    UserSearch,
    X,
} from 'lucide-react'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {Icon, type IconSymbol} from '@/components/custom/icon'
import packageJson from '@package'
import tokens from '@tokens'
import barChartIcon from '@public/images/icons/bar-chart.webp'
import buildingIcon from '@public/images/icons/building.webp'
import coinsIcon from '@public/images/icons/coins.webp'
import documentCheckIcon from '@public/images/icons/document-check.webp'
import gaugeIcon from '@public/images/icons/gauge.webp'
import documentChartIcon from '@public/images/icons/document-chart.webp'
import lightbulbIcon from '@public/images/icons/lightbulb.webp'
import reportSectionMark from '@public/images/report/section-mark.webp'
import faqQuestionMark from '@public/images/faq/faq-question-mark.webp'
import faqQuestionMarkDark from '@public/images/faq/faq-question-mark-dark.webp'
import faqAnswerMark from '@public/images/faq/faq-answer-mark.webp'
import faqAnswerMarkDark from '@public/images/faq/faq-answer-mark-dark.webp'
import wonIconLight from '@public/images/pricing/icon-won-light.webp'
import wonIconDark from '@public/images/pricing/icon-won-dark.webp'
import ticketGradeMinimum from '@public/images/ticket-grade/ticket-grade-minimum.webp'
import ticketGradeBasic from '@public/images/ticket-grade/ticket-grade-basic.webp'
import ticketGradeStandard from '@public/images/ticket-grade/ticket-grade-standard.webp'
import ticketGradePremium from '@public/images/ticket-grade/ticket-grade-premium.webp'
import crownImage from '@public/images/rank-pyramid/crown.webp'
import crownPurpleImage from '@public/images/rank-pyramid/crown-purple.webp'
import emblemGovernment from '@public/images/emblem-government.webp'
import chromeLogo from '@public/images/browser/chrome.webp'
import microsoftEdgeLogo from '@public/images/browser/microsoft-edge.webp'
import naverWhaleLogo from '@public/images/browser/naver-whale.webp'
import safariLogo from '@public/images/browser/safari.webp'
import medalAaa from '@public/images/grade-medal/aaa.webp'
import medalAa from '@public/images/grade-medal/aa.webp'
import medalA from '@public/images/grade-medal/a.webp'
import medalBbb from '@public/images/grade-medal/bbb.webp'
import medalBb from '@public/images/grade-medal/bb.webp'
import medalB from '@public/images/grade-medal/b.webp'
import medalCcc from '@public/images/grade-medal/ccc.webp'
import medalCc from '@public/images/grade-medal/cc.webp'
import medalC from '@public/images/grade-medal/c.webp'
import ktrsFmIcon from '@public/images/platform-technology-evaluation/ktrs-fm-icon.webp'
import economicUseIcon from '@public/images/platform-patent-evaluation/economic-use.webp'
import patentTradeIcon from '@public/images/platform-patent-evaluation/patent-trade.webp'
import patentedKnowledgeIcon from '@public/images/platform-patent-evaluation/patented-knowledge.webp'
import kbigxAiAnalysisReportDarkIcon from '@public/images/platform-k-bigx-report/ai-analysis-report-dark.webp'
import kbigxPeerComparisonDarkIcon from '@public/images/platform-k-bigx-report/peer-comparison-dark.webp'
import kbigxIndustryTrendDarkIcon from '@public/images/platform-k-bigx-report/industry-trend-dark.webp'
import kbigxInsightDarkIcon from '@public/images/platform-k-bigx-report/insight-dark.webp'
import kbigxApplicantDarkIcon from '@public/images/platform-k-bigx-report/applicant-dark.webp'
import kbigxPatentInfoDarkIcon from '@public/images/platform-k-bigx-report/patent-info-dark.webp'
import kbigxCompanyInfoDarkIcon from '@public/images/platform-k-bigx-report/company-info-dark.webp'
import kbigxLlmDarkIcon from '@public/images/platform-k-bigx-report/llm-dark.webp'
import kbigxReportDarkIcon from '@public/images/platform-k-bigx-report/k-bigx-report-dark.webp'
import carbonEmissionDiagnosisDarkIcon from '@public/images/platform-carbon-neutrality/emission-diagnosis-dark.webp'
import carbonReductionPlanDarkIcon from '@public/images/platform-carbon-neutrality/reduction-plan-dark.webp'
import carbonKeywordSearchDarkIcon from '@public/images/platform-carbon-neutrality/keyword-search-dark.webp'
import carbonSelfDiagnosisDarkIcon from '@public/images/platform-carbon-neutrality/self-diagnosis-dark.webp'
import patentedKnowledgeDarkIcon from '@public/images/platform-patent-evaluation/patented-knowledge-dark.webp'
import patentTradeDarkIcon from '@public/images/platform-patent-evaluation/patent-trade-dark.webp'
import economicUseDarkIcon from '@public/images/platform-patent-evaluation/economic-use-dark.webp'
import kbigxAiAnalysisReportIcon from '@public/images/platform-k-bigx-report/ai-analysis-report.webp'
import carbonEmissionDiagnosisIcon from '@public/images/platform-carbon-neutrality/emission-diagnosis.webp'
import carbonReductionPlanIcon from '@public/images/platform-carbon-neutrality/reduction-plan.webp'
import carbonKeywordSearchIcon from '@public/images/platform-carbon-neutrality/keyword-search.webp'
import carbonSelfDiagnosisIcon from '@public/images/platform-carbon-neutrality/self-diagnosis.webp'
import kbigxApplicantIcon from '@public/images/platform-k-bigx-report/applicant.webp'
import kbigxCompanyInfoIcon from '@public/images/platform-k-bigx-report/company-info.webp'
import kbigxIndustryTrendIcon from '@public/images/platform-k-bigx-report/industry-trend.webp'
import kbigxInsightIcon from '@public/images/platform-k-bigx-report/insight.webp'
import kbigxReportIcon from '@public/images/platform-k-bigx-report/k-bigx-report.webp'
import kbigxLlmIcon from '@public/images/platform-k-bigx-report/llm.webp'
import kbigxPatentInfoIcon from '@public/images/platform-k-bigx-report/patent-info.webp'
import kbigxPeerComparisonIcon from '@public/images/platform-k-bigx-report/peer-comparison.webp'

export const metadata: Metadata = {title: '아이콘 (Icon)'}

// ── 이미지 아이콘 ───────────────────────────────────────────────────────────────────────────────────
// lucide 에 없는 그림(브랜드 · 상징 · 등급 그림)만 webp 로 둔다. 새 이미지 아이콘을 쓰면 이 목록에 묶음째 추가한다.
// 아이콘이 아닌 큰 그림(로고 · 일러스트 · 스크린샷 · 배경)은 이미지 가이드(/component-guide/image)에서 다룬다.
// className 은 Tailwind 가 읽도록 리터럴로 적는다(조합하면 스타일이 생성되지 않는다).

// 미리보기 바탕 — 라이트 · 다크 짝은 GuideAssetGroup 이 각 테마로 고정해 그린다. 아래는 짝이 없는 그림과 쓰는 법 표에 쓴다.
//   light · dark : 그 테마의 카드 면으로 고정(원시 색 bg-gray-* 는 다크에서 반전되어 쓰지 않는다).
//   blue · purple : 흰 그림이 놓이는 칸 색.
type ImageIconSurface = 'card' | 'light' | 'dark' | 'blue' | 'purple'
const IMAGE_ICON_SURFACE_CLASS: Record<ImageIconSurface, string> = {
    card: '',
    light: 'light border-subtle-3 bg-card flex size-14 items-center justify-center rounded-sm border',
    dark: 'dark border-subtle-3 bg-card flex size-14 items-center justify-center rounded-sm border',
    blue: 'flex size-10 items-center justify-center rounded-sm bg-blue-500',
    purple: 'flex size-10 items-center justify-center rounded-sm bg-purple-500',
}

type ImageIconItem = Omit<GuideAssetItem, 'surfaceClassName' | 'surfaceNote'> & {surface?: ImageIconSurface}

// 문서 위계 — 분류 > 묶음 > 그림 카드.
const IMAGE_ICON_CATEGORIES = ['서비스 소개', '보고서', '요금 · 공통'] as const

type ImageIconGroup = Omit<GuideAssetGroupData, 'items'> & {
    category: (typeof IMAGE_ICON_CATEGORIES)[number]
    items: readonly ImageIconItem[]
}

const IMAGE_ICON_GROUPS: readonly ImageIconGroup[] = [
    {
        key: 'report-banner',
        category: '보고서',
        title: '보고서 탭 제목 띠',
        description: 'K-BIGx 보고서 탭 제목 띠의 파란 칸 안 그림입니다.',
        folder: 'public/images/icons/',
        usedIn: 'custom/innovation-growth-report-document.tsx',
        size: 'h-5.5 w-auto (계기판 size-6.5 · 참고자료 h-6)',
        items: [
            {
                file: 'document-check.webp',
                label: '진단브리핑',
                src: documentCheckIcon,
                className: 'h-5.5 w-auto',
                surface: 'blue',
            },
            {file: 'building.webp', label: '기업현황', src: buildingIcon, className: 'h-5.5 w-auto', surface: 'blue'},
            {
                file: 'lightbulb.webp',
                label: '기술혁신정보',
                src: lightbulbIcon,
                className: 'h-5.5 w-auto',
                surface: 'blue',
            },
            {
                file: 'bar-chart.webp',
                label: 'Tech-Index',
                src: barChartIcon,
                className: 'h-5.5 w-auto',
                surface: 'blue',
            },
            {file: 'coins.webp', label: '신용/재무정보', src: coinsIcon, className: 'h-5.5 w-auto', surface: 'blue'},
            {
                file: 'gauge.webp',
                label: '활동성정보',
                src: gaugeIcon,
                className: 'mt-1.5 size-6.5',
                surface: 'blue',
            },
            {
                file: 'document-chart.webp',
                label: '참고자료',
                src: documentChartIcon,
                className: 'h-6 w-auto',
                surface: 'blue',
            },
        ],
    },
    {
        key: 'report-section-mark',
        category: '보고서',
        title: '보고서 구획 표시',
        description: '인쇄형 보고서 구획 제목 앞 표식입니다.',
        folder: 'public/images/report/',
        usedIn: 'custom/report-document.tsx',
        size: 'size-icon-sm',
        items: [{file: 'section-mark.webp', label: '구획 표시', src: reportSectionMark, className: 'size-icon-sm'}],
    },
    {
        key: 'qa-mark',
        category: '요금 · 공통',
        title: '질문 · 답변 표시 (QaMark)',
        description: 'FAQ · 문의 답변의 Q · A 표시입니다.',
        folder: 'public/images/faq/',
        usedIn: 'custom/qa-mark.tsx',
        size: 'size-icon-lg',
        items: [
            {
                file: 'faq-question-mark.webp',
                label: '질문 (Q)',
                src: faqQuestionMark,
                className: 'size-icon-lg',
                dark: {file: 'faq-question-mark-dark.webp', src: faqQuestionMarkDark},
            },
            {
                file: 'faq-answer-mark.webp',
                label: '답변 (A)',
                src: faqAnswerMark,
                className: 'size-icon-lg',
                dark: {file: 'faq-answer-mark-dark.webp', src: faqAnswerMarkDark},
            },
        ],
    },
    {
        key: 'won',
        category: '요금 · 공통',
        title: '원화 표시',
        description: '요금 안내의 금액 앞 원화 표시입니다.',
        folder: 'public/images/pricing/',
        usedIn: 'custom/pricing-policy.tsx',
        size: 'size-8',
        items: [
            {
                file: 'icon-won-light.webp',
                label: '원화',
                src: wonIconLight,
                className: 'size-8',
                dark: {file: 'icon-won-dark.webp', src: wonIconDark},
            },
        ],
    },
    {
        key: 'ticket-grade',
        category: '요금 · 공통',
        title: '이용권 등급',
        description: '이용권 등급 그림입니다. size-13 에서는 원본이 2배입니다(그 외 아이콘은 3배).',
        folder: 'public/images/ticket-grade/',
        usedIn: 'custom/pricing-policy.tsx · custom/paid-service-history.tsx',
        size: 'size-8 · size-13',
        items: [
            {file: 'ticket-grade-minimum.webp', label: '미니멈', src: ticketGradeMinimum, className: 'size-13'},
            {file: 'ticket-grade-basic.webp', label: '베이직', src: ticketGradeBasic, className: 'size-13'},
            {file: 'ticket-grade-standard.webp', label: '스탠다드', src: ticketGradeStandard, className: 'size-13'},
            {file: 'ticket-grade-premium.webp', label: '프리미엄', src: ticketGradePremium, className: 'size-13'},
        ],
    },
    {
        key: 'crown',
        category: '보고서',
        title: '왕관 (순위 피라미드 최상위)',
        description: '순위 피라미드 맨 위 표시입니다. 현재 구간이면 흰 왕관, 아니면 보라 왕관입니다.',
        folder: 'public/images/rank-pyramid/',
        usedIn: 'custom/rank-pyramid-chart.tsx',
        size: '20×18 (보라 왕관 24×24)',
        items: [
            {file: 'crown.webp', label: '흰 왕관', src: crownImage, className: 'h-4.5 w-5', surface: 'purple'},
            {file: 'crown-purple.webp', label: '보라 왕관', src: crownPurpleImage, className: 'size-6'},
        ],
    },
    {
        key: 'evaluation-model',
        category: '서비스 소개',
        title: '평가모형 아이콘',
        description: '기술평가 모형 구조도의 모형 아이콘입니다. 다크 파일은 없습니다.',
        folder: 'public/images/platform-technology-evaluation/',
        usedIn: 'custom/ktrs-fm-structure-diagram.tsx',
        size: 'size-15 · 칸 size-30',
        items: [{file: 'ktrs-fm-icon.webp', label: 'KTRS-FM', src: ktrsFmIcon, className: 'size-15'}],
    },
    {
        key: 'patent-evaluation',
        category: '서비스 소개',
        title: '특허평가 관점 아이콘',
        description: '특허평가 구조도의 세 관점 아이콘입니다. 탄소중립 수준 진단 · 전문평가도 같은 파일을 씁니다.',
        folder: 'public/images/platform-patent-evaluation/',
        usedIn: 'custom/platform-patent-evaluation.tsx · custom/platform-carbon-neutrality.tsx',
        size: 'size-15',
        items: [
            {
                file: 'patented-knowledge.webp',
                label: '특허화된 기술지식',
                src: patentedKnowledgeIcon,
                className: 'size-15',
                tile: 'bg-panel-inset',
                dark: {file: 'patented-knowledge-dark.webp', src: patentedKnowledgeDarkIcon},
            },
            {
                file: 'patent-trade.webp',
                label: '특허 매매',
                src: patentTradeIcon,
                className: 'size-15',
                tile: 'bg-panel-inset',
                dark: {file: 'patent-trade-dark.webp', src: patentTradeDarkIcon},
            },
            {
                file: 'economic-use.webp',
                label: '경제적 활용',
                src: economicUseIcon,
                className: 'size-15',
                tile: 'bg-panel-inset',
                dark: {file: 'economic-use-dark.webp', src: economicUseDarkIcon},
            },
        ],
    },
    {
        key: 'k-bigx-feature',
        category: '서비스 소개',
        title: 'K-BIGx 보고서 분석 기능 아이콘',
        description: 'K-BIGx 소개의 분석 기능 아이콘입니다.',
        folder: 'public/images/platform-k-bigx-report/',
        usedIn: 'custom/platform-k-bigx-report.tsx',
        size: 'size-10 · 칸 size-20',
        items: [
            {
                file: 'ai-analysis-report.webp',
                label: 'AI 기반 종합 분석 보고서',
                src: kbigxAiAnalysisReportIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'ai-analysis-report-dark.webp', src: kbigxAiAnalysisReportDarkIcon},
            },
            {
                file: 'peer-comparison.webp',
                label: '동종업계 비교 분석',
                src: kbigxPeerComparisonIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'peer-comparison-dark.webp', src: kbigxPeerComparisonDarkIcon},
            },
            {
                file: 'industry-trend.webp',
                label: '산업 동향 정보',
                src: kbigxIndustryTrendIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'industry-trend-dark.webp', src: kbigxIndustryTrendDarkIcon},
            },
            {
                file: 'insight.webp',
                label: '인사이트 제공',
                src: kbigxInsightIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'insight-dark.webp', src: kbigxInsightDarkIcon},
            },
        ],
    },
    {
        key: 'k-bigx-flow',
        category: '서비스 소개',
        title: 'K-BIGx 보고서 흐름도 아이콘',
        description: 'K-BIGx 보고서 흐름도 아이콘입니다.',
        folder: 'public/images/platform-k-bigx-report/',
        usedIn: 'custom/k-bigx-report-flow-diagram.tsx',
        size: '신청기업 size-8 · 정보 칸 size-10 · 보고서 size-15',
        items: [
            {
                file: 'applicant.webp',
                label: '신청기업',
                src: kbigxApplicantIcon,
                className: 'size-8',
                tile: 'bg-platform-kbigx-flow-applicant',
                dark: {file: 'applicant-dark.webp', src: kbigxApplicantDarkIcon},
            },
            {
                file: 'patent-info.webp',
                label: '특허정보',
                src: kbigxPatentInfoIcon,
                className: 'size-10',
                tile: 'bg-platform-kbigx-source-icon-surface',
                dark: {file: 'patent-info-dark.webp', src: kbigxPatentInfoDarkIcon},
            },
            {
                file: 'company-info.webp',
                label: '기업정보',
                src: kbigxCompanyInfoIcon,
                className: 'size-10',
                tile: 'bg-platform-kbigx-source-icon-surface',
                dark: {file: 'company-info-dark.webp', src: kbigxCompanyInfoDarkIcon},
            },
            {
                file: 'llm.webp',
                label: 'LLM',
                src: kbigxLlmIcon,
                className: 'size-10',
                tile: 'bg-platform-kbigx-source-icon-surface',
                dark: {file: 'llm-dark.webp', src: kbigxLlmDarkIcon},
            },
            {
                file: 'k-bigx-report.webp',
                label: '보고서',
                src: kbigxReportIcon,
                className: 'size-15',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'k-bigx-report-dark.webp', src: kbigxReportDarkIcon},
            },
        ],
    },
    {
        key: 'carbon-feature',
        category: '서비스 소개',
        title: '탄소중립 분석 기능 아이콘',
        description: '탄소중립 소개의 분석 기능 아이콘입니다. 수준 진단 · 전문평가는 위 특허평가 파일을 함께 씁니다.',
        folder: 'public/images/platform-carbon-neutrality/',
        usedIn: 'custom/platform-carbon-neutrality.tsx',
        size: 'size-10 · 칸 size-20',
        items: [
            {
                file: 'emission-diagnosis.webp',
                label: '배출량 진단',
                src: carbonEmissionDiagnosisIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'emission-diagnosis-dark.webp', src: carbonEmissionDiagnosisDarkIcon},
            },
            {
                file: 'reduction-plan.webp',
                label: '감축계획 수립',
                src: carbonReductionPlanIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'reduction-plan-dark.webp', src: carbonReductionPlanDarkIcon},
            },
            {
                file: 'keyword-search.webp',
                label: '키워드 검색',
                src: carbonKeywordSearchIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'keyword-search-dark.webp', src: carbonKeywordSearchDarkIcon},
            },
            {
                file: 'self-diagnosis.webp',
                label: '자가진단',
                src: carbonSelfDiagnosisIcon,
                className: 'size-10',
                tile: 'bg-platform-icon-surface',
                dark: {file: 'self-diagnosis-dark.webp', src: carbonSelfDiagnosisDarkIcon},
            },
        ],
    },
    {
        key: 'emblem',
        category: '보고서',
        title: '정부 상징 문양',
        description: '진단브리핑 정부 R&D 부처별 건수 앞 문양입니다.',
        folder: 'public/images/',
        usedIn: 'custom/innovation-growth-report-document.tsx',
        size: 'size-icon-lg',
        items: [{file: 'emblem-government.webp', label: '정부 상징', src: emblemGovernment, className: 'size-icon-lg'}],
    },
    {
        key: 'browser',
        category: '요금 · 공통',
        title: '브라우저 로고',
        description: '이용 안내의 권장 브라우저 로고입니다.',
        folder: 'public/images/browser/',
        usedIn: 'custom/service-guide.tsx',
        size: 'size-20',
        items: [
            {
                file: 'microsoft-edge.webp',
                label: 'Microsoft Edge',
                src: microsoftEdgeLogo,
                className: 'size-20 object-contain',
            },
            {file: 'chrome.webp', label: 'Chrome', src: chromeLogo, className: 'size-20 object-contain'},
            {file: 'naver-whale.webp', label: 'Naver Whale', src: naverWhaleLogo, className: 'size-20 object-contain'},
            {file: 'safari.webp', label: 'Safari', src: safariLogo, className: 'size-20 object-contain'},
        ],
    },
    {
        key: 'grade-medal',
        category: '보고서',
        title: '등급 메달',
        description: '특허 보고서 지표 쪽의 등급(AAA ~ C) 메달입니다. 미리보기는 줄인 크기입니다.',
        folder: 'public/images/grade-medal/',
        usedIn: 'custom/patent-report-metric-page.tsx',
        size: 'h-69 w-auto',
        items: [
            {file: 'aaa.webp', label: 'AAA', src: medalAaa, className: 'h-24 w-auto'},
            {file: 'aa.webp', label: 'AA', src: medalAa, className: 'h-24 w-auto'},
            {file: 'a.webp', label: 'A', src: medalA, className: 'h-24 w-auto'},
            {file: 'bbb.webp', label: 'BBB', src: medalBbb, className: 'h-24 w-auto'},
            {file: 'bb.webp', label: 'BB', src: medalBb, className: 'h-24 w-auto'},
            {file: 'b.webp', label: 'B', src: medalB, className: 'h-24 w-auto'},
            {file: 'ccc.webp', label: 'CCC', src: medalCcc, className: 'h-24 w-auto'},
            {file: 'cc.webp', label: 'CC', src: medalCc, className: 'h-24 w-auto'},
            {file: 'c.webp', label: 'C', src: medalC, className: 'h-24 w-auto'},
        ],
    },
]

const {count: IMAGE_ICON_COUNT, totalSize: IMAGE_ICON_TOTAL_SIZE} = summarizeAssets(IMAGE_ICON_GROUPS)

// 이미지 아이콘 쓰는 법 — 경우별 코드(실제 서비스와 같은 파일 · 크기).
const IMAGE_ICON_CODE = `import Image from 'next/image'
import {ThemeImage} from '@/components/custom/theme-image'
import emblemGovernment from '@public/images/emblem-government.webp'
import buildingIcon from '@public/images/icons/building.webp'
import questionMark from '@public/images/faq/faq-question-mark.webp'
import questionMarkDark from '@public/images/faq/faq-question-mark-dark.webp'
import crownImage from '@public/images/rank-pyramid/crown.webp'
import medalAaa from '@public/images/grade-medal/aaa.webp'

{/* ① 정사각 그림 — size-icon-* 토큰. 옆에 같은 뜻의 글자가 있으면 장식이라 alt="" */}
<Image src={emblemGovernment} alt="" sizes="24px" className="size-icon-lg shrink-0" />

{/* ② 비율이 다른 그림 — 높이만 맞추고 폭은 w-auto(원본 비율 유지) */}
<span className="flex size-10 items-center justify-center rounded-sm bg-blue-500">
  <Image src={buildingIcon} alt="" className="h-5.5 w-auto" />
</span>

{/* ③ 라이트 · 다크 두 장 — 테마에 맞는 한 장만 보인다(ThemeImage: custom/theme-image.tsx) */}
<ThemeImage light={questionMark} dark={questionMarkDark} className="size-icon-lg" />

{/* ④ 그림만으로 뜻을 전할 때 — alt 에 그 뜻을 적는다[5.1.1] */}
<Image src={medalAaa} alt="AAA 등급" className="h-24 w-auto" />

{/* ⑤ SVG 안 — next/image 대신 <image>, 경로는 정적 import 의 .src */}
<svg viewBox="0 0 40 40" aria-hidden="true">
  <image href={crownImage.src} x={10} y={11} width={20} height={18} />
</svg>`

// 경우별 미리보기 표 — lucide 1-1 의 형태 표와 같은 짜임.
const IMAGE_USAGE_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'case', header: '경우', align: 'start', rowHeader: true},
    {key: 'how', header: '쓰는 법', align: 'start', wrap: true},
] as const

const IMAGE_USAGE_ROWS = [
    {
        key: 'square',
        cells: [
            <Image key="preview" src={emblemGovernment} alt="" sizes="24px" className="size-icon-lg" />,
            '① 정사각 그림',
            <span key="how">
                <code>size-icon-*</code> 토큰
            </span>,
        ],
    },
    {
        key: 'ratio',
        cells: [
            <span key="preview" className={IMAGE_ICON_SURFACE_CLASS.blue}>
                <Image src={buildingIcon} alt="" className="h-5.5 w-auto" />
            </span>,
            '② 비율이 다른 그림',
            <span key="how">
                높이만 지정, 폭은 <code>w-auto</code>
            </span>,
        ],
    },
    {
        key: 'theme',
        cells: [
            <span key="preview" className="flex gap-2">
                <span className={IMAGE_ICON_SURFACE_CLASS.light}>
                    <Image src={faqQuestionMark} alt="" sizes="24px" className="size-icon-lg" />
                </span>
                <span className={IMAGE_ICON_SURFACE_CLASS.dark}>
                    <Image src={faqQuestionMarkDark} alt="" sizes="24px" className="size-icon-lg" />
                </span>
            </span>,
            '③ 라이트 · 다크 두 장',
            <span key="how">
                <code>ThemeImage</code> 사용, 파일명 끝에 <code>-dark</code>
            </span>,
        ],
    },
    {
        key: 'meaning',
        cells: [
            <Image key="preview" src={medalAaa} alt="" className="h-12 w-auto" />,
            '④ 그림만으로 뜻을 전함',
            <span key="how">
                <code>alt</code> 에 뜻을 적음(예: AAA 등급)
            </span>,
        ],
    },
    {
        key: 'svg',
        cells: [
            <span key="preview" className={IMAGE_ICON_SURFACE_CLASS.purple}>
                <Image src={crownImage} alt="" className="h-4.5 w-5" />
            </span>,
            '⑤ SVG 안',
            <span key="how">
                <code>&lt;image href=&#123;src.src&#125;&gt;</code> 사용(왕관)
            </span>,
        ],
    },
] as const

const IMAGE_RULE_COLUMNS = [
    {key: 'rule', header: '항목', align: 'start', rowHeader: true},
    {key: 'note', header: '규칙', align: 'start', wrap: true},
] as const

const IMAGE_RULE_ROWS = [
    {key: 'when', cells: ['언제', 'lucide 에 없는 그림만 이미지로 둡니다.']},
    {key: 'where', cells: ['위치 · 이름', 'public/images/<묶음>/ · kebab-case · 그림 모양으로 이름 짓기']},
    {key: 'format', cells: ['형식 · 해상도', 'webp · 표시 크기의 3배(22 표시 → 66)']},
    {key: 'file-size', cells: ['용량', '작은 아이콘 3KB 이하, 큰 그림(로고 · 메달) 16KB 이하 — 현재 전체 기준']},
    {key: 'import', cells: ['불러오기', 'next/image + 정적 import[NA-005]']},
    {key: 'size', cells: ['크기', '정사각은 size-icon-*, 비율이 다르면 h-* w-auto']},
    {key: 'dark', cells: ['다크 모드', '파일명-dark.webp 를 두고 ThemeImage 사용 · 글자 · 안쪽은 투명 유지']},
    {key: 'a11y', cells: ['대체 텍스트', '옆 글자와 뜻이 같으면 alt="", 그림만으로 뜻을 전하면 alt 에 적기[5.1.1]']},
] as const

const ICON_SIZE_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스 (클릭 복사)', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
] as const

// lucide-react 버전은 package.json 을 단일 소스로 읽는다 — 패키지를 올리면 이 페이지도 저절로 갱신된다.
const LUCIDE_VERSION = packageJson.dependencies['lucide-react'].replace(/^[\^~]/, '')
const LUCIDE_REPO_URL = 'https://github.com/lucide-icons/lucide'

// 사용법 — 세 형태(outline·solid·symbol)를 한 스니펫에 담아 미리보기와 1:1 로 맞춘다.
const USAGE_CODE = `import {Search, X} from 'lucide-react'
import {Icon} from '@/components/custom/icon'

{/* outline(기본) — 글리프 그대로. 크기는 size-icon-*, 색은 text-* 유틸 */}
<Icon icon={Search} className="size-icon-xl text-foreground" />

{/* solid — 원형 배지 안에 글리프 */}
<Icon icon={X} variant="solid" className="size-icon-xl" />

{/* symbol — lucide 에 채운 글리프가 없는 정보·경고는 문자형 배지(i·!) */}
<Icon symbol="info" variant="solid" className="size-icon-xl" />
<Icon symbol="alert" variant="solid" className="size-icon-xl" />`

// 아이콘 단독 버튼 — 접근 가능한 이름은 감싸는 상호작용 요소가 갖는다([5.1.1]).
const ICON_BUTTON_CODE = `{/* Icon 래퍼: 항상 aria-hidden */}
<Button size="icon" aria-label="검색">
    <Icon icon={Search} />
</Button>

{/* lucide 글리프를 직접 쓸 때: aria-hidden 을 직접 지정 */}
<Button size="icon" aria-label="검색">
    <Search aria-hidden="true" />
</Button>`

// 아이콘 크기 — size.icon-* 토큰(size-icon-* 유틸)만 사용한다. 클래스명은 Tailwind 정적 분석을
// 위해 리터럴로 고정 — 템플릿 문자열(`size-${key}`)로 조합하면 스캐너가 인식하지 못해 스타일이
// 안 나온다(z-index 가이드와 같은 이유). 새 크기를 추가하면 tokens.json 의 size.icon-* 와 함께 갱신.
const ICON_SIZES = [
    {key: 'icon-xs', class: 'size-icon-xs'},
    {key: 'icon-sm', class: 'size-icon-sm'},
    {key: 'icon-md', class: 'size-icon-md'},
    {key: 'icon-lg', class: 'size-icon-lg'},
    {key: 'icon-xl', class: 'size-icon-xl'},
    {key: 'icon-2xl', class: 'size-icon-2xl'},
] as const

// 아이콘 목록 — 서비스 화면(component-guide 제외)이 lucide-react 에서 import 하는 아이콘과 정확히 같게 둔다([NA-008]).
// 별칭(CalendarIcon · CheckIcon)은 원래 이름(Calendar · Check)으로 적는다. 새 아이콘을 쓰거나 안 쓰게 되면 함께 고친다.
// 가이드 화면에서만 쓰는 아이콘(GitBranch 등)은 넣지 않는다.
const CURATED_ICONS = [
    {name: 'ArrowDown', Icon: ArrowDown},
    {name: 'ArrowRight', Icon: ArrowRight},
    {name: 'ArrowUp', Icon: ArrowUp},
    {name: 'ArrowUpDown', Icon: ArrowUpDown},
    {name: 'ArrowUpRight', Icon: ArrowUpRight},
    {name: 'Award', Icon: Award},
    {name: 'Blocks', Icon: Blocks},
    {name: 'Braces', Icon: Braces},
    {name: 'BriefcaseBusiness', Icon: BriefcaseBusiness},
    {name: 'Building2', Icon: Building2},
    {name: 'Calendar', Icon: Calendar},
    {name: 'Check', Icon: Check},
    {name: 'ChevronDown', Icon: ChevronDown},
    {name: 'ChevronLeft', Icon: ChevronLeft},
    {name: 'ChevronRight', Icon: ChevronRight},
    {name: 'ChevronUp', Icon: ChevronUp},
    {name: 'CircleAlert', Icon: CircleAlert},
    {name: 'CircleCheck', Icon: CircleCheck},
    {name: 'CircleCheckBig', Icon: CircleCheckBig},
    {name: 'CircleQuestionMark', Icon: CircleQuestionMark},
    {name: 'Component', Icon: Component},
    {name: 'Copy', Icon: Copy},
    {name: 'CreditCard', Icon: CreditCard},
    {name: 'Download', Icon: Download},
    {name: 'EllipsisVertical', Icon: EllipsisVertical},
    {name: 'ExternalLink', Icon: ExternalLink},
    {name: 'Eye', Icon: Eye},
    {name: 'EyeOff', Icon: EyeOff},
    {name: 'File', Icon: File},
    {name: 'FileBadge', Icon: FileBadge},
    {name: 'FileDigit', Icon: FileDigit},
    {name: 'FilePenLine', Icon: FilePenLine},
    {name: 'FileSearch', Icon: FileSearch},
    {name: 'FileSearchCorner', Icon: FileSearchCorner},
    {name: 'Folder', Icon: Folder},
    {name: 'FolderKanban', Icon: FolderKanban},
    {name: 'FolderSearch', Icon: FolderSearch},
    {name: 'GitBranch', Icon: GitBranch},
    {name: 'Globe', Icon: Globe},
    {name: 'History', Icon: History},
    {name: 'Home', Icon: Home},
    {name: 'Info', Icon: Info},
    {name: 'Layers', Icon: Layers},
    {name: 'LayoutGrid', Icon: LayoutGrid},
    {name: 'Lightbulb', Icon: Lightbulb},
    {name: 'LoaderCircle', Icon: LoaderCircle},
    {name: 'Menu', Icon: Menu},
    {name: 'MessageCircleMore', Icon: MessageCircleMore},
    {name: 'Moon', Icon: Moon},
    {name: 'NotepadText', Icon: NotepadText},
    {name: 'Palette', Icon: Palette},
    {name: 'Paperclip', Icon: Paperclip},
    {name: 'Pause', Icon: Pause},
    {name: 'Pin', Icon: Pin},
    {name: 'Play', Icon: Play},
    {name: 'Plus', Icon: Plus},
    {name: 'Printer', Icon: Printer},
    {name: 'RotateCcw', Icon: RotateCcw},
    {name: 'ScrollText', Icon: ScrollText},
    {name: 'Search', Icon: Search},
    {name: 'Sparkles', Icon: Sparkles},
    {name: 'SquareArrowOutUpRight', Icon: SquareArrowOutUpRight},
    {name: 'Star', Icon: Star},
    {name: 'Sun', Icon: Sun},
    {name: 'ThumbsUp', Icon: ThumbsUp},
    {name: 'TimerReset', Icon: TimerReset},
    {name: 'TrendingUp', Icon: TrendingUp},
    {name: 'Trophy', Icon: Trophy},
    {name: 'Upload', Icon: Upload},
    {name: 'User', Icon: User},
    {name: 'UserSearch', Icon: UserSearch},
    {name: 'X', Icon: X},
] as const

// Solid(원형 배지) 스타일은 강조·알림 배지 용도라 실제로 몇 개만 큐레이션한다. lucide에 채운 글리프가
// 없는 Info·CircleAlert는 기존 디자인대로 원형 배지 안에 문자 i·!를 사용한다.
type SolidIconItem = {name: string; icon: LucideIcon; symbol?: never} | {name: string; icon?: never; symbol: IconSymbol}

const SOLID_ICONS: readonly SolidIconItem[] = [
    {name: 'X', icon: X},
    {name: 'Info', symbol: 'info'},
    {name: 'CircleAlert', symbol: 'alert'},
]

const PROPS_ITEMS = [
    ['Icon', 'icon', 'lucide 아이콘 컴포넌트입니다. symbol 과 함께 쓸 수 없습니다.', '조건부 필수', 'LucideIcon'],
    [
        'Icon',
        'symbol',
        '문자형 아이콘입니다. icon 과 함께 쓸 수 없고 variant="solid" 가 필요합니다.',
        '조건부 필수',
        "'info' | 'alert'",
    ],
    [
        'Icon',
        'variant',
        '글리프만 그리는 outline 과 원형 배지 안에 담는 solid 중 고릅니다. symbol 은 solid 만 지원합니다.',
        "'outline'",
        "'outline' | 'solid'",
    ],
    [
        'Icon',
        'symbolClassName',
        'symbol 글자 크기(typo-*)입니다. 배지를 키우면 함께 키웁니다.',
        "'typo-title-l-bold'",
        'string',
    ],
    ['Icon', 'className', '크기(size-icon-*)와 색(text-*) 유틸리티를 추가합니다.', "''", 'string'],
] as const

// 어떤 아이콘을 쓰나 — 문서 맨 위 고르기 표.
const CHOICE_COLUMNS = [
    {key: 'kind', header: '종류', align: 'start', rowHeader: true},
    {key: 'when', header: '언제', align: 'start', wrap: true},
    {key: 'how', header: '쓰는 법', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'lucide',
        cells: [
            '1. lucide 아이콘',
            '기본. 버튼 · 메뉴 · 상태 등 모든 UI 아이콘([NA-008]).',
            <span key="how">
                <code>lucide-react</code> 글리프 · 배지가 필요하면 <code>Icon</code> 래퍼
            </span>,
        ],
    },
    {
        key: 'image',
        cells: [
            '2. 이미지 아이콘',
            'lucide 에 없는 상징 그림(원화 · 왕관 · 브라우저 로고 · 등급 메달 등)만.',
            <span key="how">
                <code>next/image</code> + <code>public/images/…webp</code> 정적 import
            </span>,
        ],
    },
] as const

// lucide 형태 세 가지 — outline(기본) · solid · symbol.
const FORM_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'form', header: '형태', align: 'start', rowHeader: true},
    {key: 'when', header: '언제', align: 'start', wrap: true},
] as const

const FORM_ROWS = [
    {
        key: 'outline',
        cells: [
            <Icon key="preview" icon={Search} className="size-icon-xl text-foreground" />,
            <code key="form">outline (기본)</code>,
            '글리프 그대로. 거의 모든 경우.',
        ],
    },
    {
        key: 'solid',
        cells: [
            <Icon key="preview" icon={X} variant="solid" className="size-icon-xl" />,
            <code key="form">solid</code>,
            '원형 배지 안 글리프: X(닫기)만.',
        ],
    },
    {
        key: 'symbol',
        cells: [
            <span key="preview" className="flex gap-2">
                <Icon symbol="info" variant="solid" className="size-icon-xl" />
                <Icon symbol="alert" variant="solid" className="size-icon-xl" />
            </span>,
            <code key="form">symbol</code>,
            'lucide 에 채운 글리프가 없는 안내 · 경고용 문자형 배지(i · !).',
        ],
    },
] as const

const JUMP_LINK_CLASS =
    'border-border bg-card typo-body-l-bold text-foreground hover:bg-muted focus-visible:ring-ring rounded-md border px-4 py-2 outline-ring focus:outline-none focus-visible:ring-2'

// 섹션 묶음 제목 — 아래 카드들이 이 묶음에 속한다(lucide · 이미지).
const GroupHeading = ({id, title, children}: {id: string; title: string; children: ReactNode}) => (
    <div className="flex scroll-mt-24 flex-col gap-2 pt-4" id={id}>
        <h2 className="typo-h3-bold text-foreground">{title}</h2>
        <p className="typo-body-l-regular text-label-foreground">{children}</p>
    </div>
)

const IconGuidePage = () => (
    <GuidePageShell
        title="아이콘 (Icon)"
        description="아이콘은 lucide 아이콘(기본)과 lucide 에 없는 그림을 담은 이미지 아이콘(webp) 두 가지입니다."
    >
        <BaseCard>
            <section aria-labelledby="icon-choice" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="icon-choice" className="typo-h4-bold">
                        어떤 아이콘을 쓰나
                    </h2>
                </div>
                <Table caption="아이콘 종류 고르기" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
                <nav aria-label="아이콘 종류" className="flex flex-wrap gap-3">
                    <a href="#icon-lucide-group" className={JUMP_LINK_CLASS}>
                        1. lucide 아이콘 ({CURATED_ICONS.length}개)
                    </a>
                    <a href="#icon-image-group" className={JUMP_LINK_CLASS}>
                        2. 이미지 아이콘 ({IMAGE_ICON_COUNT}개)
                    </a>
                </nav>
            </section>
        </BaseCard>

        <GroupHeading id="icon-lucide-group" title="1. lucide 아이콘">
            lucide-react v{LUCIDE_VERSION}(ISC). 글리프는 그대로, 배지 · 문자형은 <code>Icon</code> 래퍼로 씁니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="icon-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-usage" className="typo-h4-bold">
                        1-1. 쓰는 법
                    </h3>
                </div>
                <Table caption="lucide 아이콘 형태" columns={FORM_COLUMNS} rows={FORM_ROWS} size="md" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="typo-body-m-regular text-foreground-subtle flex flex-wrap items-center gap-2">
                    <span>설치</span>
                    <code className="border-border bg-muted text-foreground rounded-sm border px-2 py-1 font-mono text-sm">
                        yarn add lucide-react
                    </code>
                    <a
                        href={LUCIDE_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-strong focus-visible:ring-ring outline-ring inline-flex items-center gap-1.5 rounded underline underline-offset-4 focus:outline-none focus-visible:ring-2"
                    >
                        <GitBranch aria-hidden="true" className="size-icon-sm shrink-0" />
                        lucide-icons/lucide
                        <span className="sr-only"> (새 창에서 열림)</span>
                    </a>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-size" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-size" className="typo-h4-bold">
                        1-2. 크기 · 색
                    </h3>
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>
                            크기는 <code>size-icon-*</code> 토큰(<code>tokens.json</code> 의 <code>size.icon-*</code>)만
                            씁니다.
                        </li>
                        <li>
                            색은 <code>text-*</code> 시맨틱 유틸로 줍니다. solid 배지 색은 <code>variant</code> 가
                            정합니다.
                        </li>
                    </ul>
                </div>
                <Table
                    caption="아이콘 크기 토큰과 클래스"
                    columns={ICON_SIZE_COLUMNS}
                    rows={ICON_SIZES.map(({key, class: sizeClass}) => ({
                        key,
                        cells: [
                            <div key="preview" className="flex items-center gap-3">
                                <Icon icon={X} variant="solid" className={`${sizeClass} shrink-0`} />
                                <Icon icon={Info} className={`${sizeClass} text-foreground shrink-0`} />
                            </div>,
                            <code key="class" className="text-foreground font-mono">
                                {sizeClass}
                            </code>,
                            <span key="value" className="font-mono">
                                {tokens.size[key]}px
                            </span>,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-list" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-list" className="typo-h4-bold">
                        1-3. 목록
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        서비스 화면에서 쓰는 lucide 아이콘 {CURATED_ICONS.length}개입니다(알파벳순). 새 아이콘을 쓰면 이
                        목록에도 추가합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h4 className="typo-title-m-bold text-foreground">Outline</h4>
                        <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
                            {CURATED_ICONS.map(({name, Icon: Glyph}) => (
                                <li
                                    key={name}
                                    className="border-border flex flex-col items-center gap-3 rounded-md border p-4"
                                >
                                    <Icon icon={Glyph} className="size-icon-xl text-foreground" />
                                    <code className="text-foreground font-mono text-sm">{name}</code>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h4 className="typo-title-m-bold text-foreground">Solid · Symbol</h4>
                        <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
                            {SOLID_ICONS.map((item) => (
                                <li
                                    key={item.name}
                                    className="border-border flex flex-col items-center gap-3 rounded-md border p-4"
                                >
                                    {item.icon ? (
                                        <Icon icon={item.icon} variant="solid" className="size-icon-xl" />
                                    ) : (
                                        <Icon symbol={item.symbol} variant="solid" className="size-icon-xl" />
                                    )}
                                    <code className="text-foreground font-mono text-sm">{item.name}</code>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-accessibility" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-accessibility" className="typo-h4-bold">
                        1-4. 접근성
                    </h3>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        아이콘은 장식입니다. <code>Icon</code> 은 늘 <code>aria-hidden</code>, lucide 를 직접 쓰면{' '}
                        <code>aria-hidden=&quot;true&quot;</code> 를 직접 붙입니다.
                    </li>
                    <li>
                        아이콘만 있는 버튼 · 링크는 감싸는 요소에 <code>aria-label</code> 또는 <code>sr-only</code>{' '}
                        글자를 둡니다[5.1.1].
                    </li>
                    <li>상태 · 정보는 색만으로 구분하지 않고 글자를 함께 둡니다[5.3.1].</li>
                </ul>
                <CodeBlock code={ICON_BUTTON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-props" className="typo-h4-bold">
                        1-5. Icon Props
                    </h3>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Icon Props 목록" />
            </section>
        </BaseCard>

        <GroupHeading id="icon-image-group" title="2. 이미지 아이콘">
            lucide 에 없는 그림 {IMAGE_ICON_COUNT}개 · 합계 {IMAGE_ICON_TOTAL_SIZE}입니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="icon-image-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-image-usage" className="typo-h4-bold">
                        2-1. 쓰는 법
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>next/image</code> + 정적 import(<code>@public/…</code>) 기준, 경우별 방법입니다.
                    </p>
                </div>
                <Table
                    caption="이미지 아이콘 쓰는 법"
                    columns={IMAGE_USAGE_COLUMNS}
                    rows={IMAGE_USAGE_ROWS}
                    size="md"
                />
                <CodeBlock code={IMAGE_ICON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-image-rule" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-image-rule" className="typo-h4-bold">
                        2-2. 규칙
                    </h3>
                </div>
                <Table caption="이미지 아이콘 규칙" columns={IMAGE_RULE_COLUMNS} rows={IMAGE_RULE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-image-list" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-image-list" className="typo-h4-bold">
                        2-3. 목록
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        라이트 · 다크 짝은 한 카드에 함께 보입니다. 바탕은 실제 칸 색, 숫자는 원본 픽셀 · 용량입니다.
                    </p>
                </div>
                <div className="flex flex-col gap-12">
                    {IMAGE_ICON_CATEGORIES.map((category) => (
                        <div key={category} className="border-subtle-3 flex flex-col gap-8 border-t pt-6">
                            <h4 className="typo-h5-bold text-foreground">{category}</h4>
                            {IMAGE_ICON_GROUPS.filter((group) => group.category === category).map((group) => (
                                <GuideAssetGroup
                                    key={group.key}
                                    headingLevel="h5"
                                    group={{
                                        ...group,
                                        items: group.items.map(({surface, ...item}) => ({
                                            ...item,
                                            surfaceClassName: surface ? IMAGE_ICON_SURFACE_CLASS[surface] : undefined,
                                        })),
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-image-not" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="icon-image-not" className="typo-h4-bold">
                        2-4. 아이콘이 아닌 이미지
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        로고 · 일러스트 · 스크린샷 · 배경은{' '}
                        <Link
                            href="/component-guide/image"
                            className="text-primary-strong focus-visible:ring-ring outline-ring rounded underline underline-offset-4 focus:outline-none focus-visible:ring-2"
                        >
                            이미지 가이드
                        </Link>
                        에서 봅니다.
                    </p>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default IconGuidePage
