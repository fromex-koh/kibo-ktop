// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Link from 'next/link'
import {GuideAssetGroup, summarizeAssets, type GuideAssetItem} from '@/components/custom/guide-asset-group'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import logoKtop from '@public/images/logo-ktop.svg'
import logoKtopWhite from '@public/images/logo-ktop-white.svg'
import logoKibo from '@public/images/logo-kibo.svg'
import logoKiboWhite from '@public/images/logo-kibo-white.svg'
import logoKiboOnDark from '@public/images/logo-kibo-on-dark.svg'
import speedGauge from '@public/images/option-card/speed-gauge.webp'
import rocketGrowth from '@public/images/option-card/rocket-growth.webp'
import buildingCoins from '@public/images/option-card/building-coins.webp'
import buildingLightbulb from '@public/images/option-card/building-lightbulb.webp'
import documentChartMagnifier from '@public/images/option-card/document-chart-magnifier.webp'
import clipboardCheckChart from '@public/images/option-card/clipboard-check-chart.webp'
import kbigxHeroAiReport from '@public/images/platform-k-bigx-report/hero-ai-report.webp'
import kbigxHeroSmeTarget from '@public/images/platform-k-bigx-report/hero-sme-target.webp'
import carbonHeroLeadingSme from '@public/images/platform-carbon-neutrality/hero-leading-sme.webp'
import carbonHeroSmeUse from '@public/images/platform-carbon-neutrality/hero-sme-use.webp'
import carbonHeroTaxonomy from '@public/images/platform-carbon-neutrality/hero-taxonomy.webp'
import carbonHeroPublicUse from '@public/images/platform-carbon-neutrality/hero-public-use.webp'
import officeBuilding from '@public/images/login/office-building.webp'
import bankBuilding from '@public/images/login/bank-building.webp'
import searchWindowGradeBadge from '@public/images/service-intro/search-window-grade-badge.webp'
import aiRobotDonutChart from '@public/images/service-intro/ai-robot-donut-chart.webp'
import serviceStatusIllustration from '@public/images/service-status/service-status-illustration.webp'
import zoomMenuEdge from '@public/images/browser/zoom-menu-edge.webp'
import zoomMenuChrome from '@public/images/browser/zoom-menu-chrome.webp'
import citationStep1 from '@public/images/citation-manual/step-1-kipris-search-menu.webp'
import citationStep2 from '@public/images/citation-manual/step-2-patent-number-search.webp'
import citationStep3 from '@public/images/citation-manual/step-3-citation-count.webp'
import kbigxCover from '@public/images/report/kbigx-cover.webp'
import kbigxToc from '@public/images/report/kbigx-toc.webp'
import kbigxTocStarLarge from '@public/images/report/kbigx-toc-star-large.svg'
import kbigxTocStarSmall from '@public/images/report/kbigx-toc-star-small.svg'
import heroBg1 from '@public/images/main-hero/hero-bg-1.webp'
import heroBg2 from '@public/images/main-hero/hero-bg-2.webp'
import techEvaluation from '@public/images/main-hero/tech-evaluation.webp'
import patentEvaluation from '@public/images/main-hero/patent-evaluation.webp'
import serviceIntroConsulting from '@public/images/main-hero/service-intro-consulting.webp'
import serviceIntroSelfDiagnosis from '@public/images/main-hero/service-intro-self-diagnosis.webp'
import businessHandshake from '@public/images/platform-technology-evaluation/business-handshake.webp'
import officeCityView from '@public/images/platform-technology-evaluation/office-city-view.webp'
import reportChartsDesk from '@public/images/platform-technology-evaluation/report-charts-desk.webp'
import aiChipCircuit from '@public/images/platform-intro/ai-chip-circuit.webp'
import aiDatabaseServer from '@public/images/platform-intro/ai-database-server.webp'
import aiDonutChart from '@public/images/platform-intro/ai-donut-chart.webp'
import chartReviewMeeting from '@public/images/platform-intro/chart-review-meeting.webp'
import lightbulbLeaf from '@public/images/platform-intro/lightbulb-leaf.webp'
import officeBankBuildings from '@public/images/platform-intro/office-bank-buildings.webp'

export const metadata: Metadata = {title: '이미지 (Image)'}

// 서비스 화면이 쓰는 public/images 의 이미지 중 아이콘이 아닌 것(로고 · 일러스트 · 스크린샷 · 배경 · 사진)을 정리한다.
// 작은 상징 그림(이미지 아이콘)은 아이콘 가이드(/component-guide/icon)의 '2. 이미지 아이콘' 에서 다룬다.
// 이미지를 추가 · 교체 · 삭제하면 아래 IMAGE_SECTIONS 와 맨 아래 '서비스 화면에서 쓰지 않는 이미지' 표를 함께 고친다.
// className 은 Tailwind 가 읽도록 리터럴로 적는다(조합하면 스타일이 생성되지 않는다).

// 미리보기 바탕 — 흰 로고처럼 바탕에 따라 안 보이는 그림은 실제로 놓이는 면 위에 보여야 정확하다.
//   card  : 가이드 카드 바탕 그대로(테마를 따라 바뀜).
//   light : 'light' 범위 클래스로 늘 라이트 테마의 카드 면.
//   dark  : 'dark' 범위 클래스로 늘 다크 테마의 카드 면.
//   navy  : 특허 보고서 머리글 바탕(bg-navy-500).
type ImageSurface = 'card' | 'light' | 'dark' | 'navy'
const IMAGE_SURFACE_CLASS: Record<ImageSurface, string> = {
    card: '',
    light: 'light border-subtle-3 bg-card flex items-center justify-center rounded-sm border p-4',
    dark: 'dark border-subtle-3 bg-card flex items-center justify-center rounded-sm border p-4',
    navy: 'flex items-center justify-center rounded-sm bg-navy-500 p-4',
}
// 미리보기 아래에 적는 바탕 이름 — 테마를 바꿔도 어느 바탕용인지 글로 알 수 있게.
const IMAGE_SURFACE_NOTE: Partial<Record<ImageSurface, string>> = {
    light: '라이트 화면 고정',
    dark: '다크 화면 고정',
    navy: '남색 머리글 위',
}

// 목록 칸 폭 — 작은 그림은 여러 칸, 넓은 그림은 두세 칸.
type ImageGridSize = 'narrow' | 'wide'
const IMAGE_GRID_CLASS: Record<ImageGridSize, string> = {
    narrow: 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4',
    wide: 'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3',
}

type ImageItem = Omit<GuideAssetItem, 'surfaceClassName' | 'surfaceNote'> & {surface?: ImageSurface}

type ImageGroup = {
    key: string
    title: string
    description: string
    folder: string
    usedIn: string
    size: string
    grid: ImageGridSize
    items: readonly ImageItem[]
}

type ImageSection = {
    id: string
    number: string
    title: string
    description: string
    groups: readonly ImageGroup[]
}

const IMAGE_SECTIONS: readonly ImageSection[] = [
    {
        id: 'image-logo',
        number: '2-1',
        title: '로고',
        description: '헤더 · 푸터는 라이트 · 다크 두 장 중 테마에 맞는 한 장만 보입니다.',
        groups: [
            {
                key: 'logo-ktop',
                title: 'K-TOP 로고 (헤더)',
                description: '메인페이지 헤더는 흰 로고, 서비스 헤더는 테마에 맞는 한 장입니다.',
                folder: 'public/images/',
                usedIn: 'composite/header.tsx',
                size: 'h-8 w-35 (140×32)',
                grid: 'wide',
                items: [
                    {
                        file: 'logo-ktop.svg',
                        label: 'K-TOP',
                        src: logoKtop,
                        className: 'h-8 w-35',
                        dark: {file: 'logo-ktop-white.svg', src: logoKtopWhite},
                    },
                ],
            },
            {
                key: 'logo-kibo',
                title: '기술보증기금 로고 (푸터 · 보고서)',
                description: '푸터는 테마에 맞는 한 장, 특허 보고서는 머리글 전용 한 장입니다.',
                folder: 'public/images/',
                usedIn: 'composite/footer.tsx · custom/patent-report-document.tsx · custom/kbigx-print-cover.tsx',
                size: '푸터 w-45 md:w-60 · 보고서 h-8 w-auto',
                grid: 'wide',
                items: [
                    {
                        file: 'logo-kibo.svg',
                        label: '푸터',
                        src: logoKibo,
                        className: 'h-auto w-45',
                        dark: {file: 'logo-kibo-white.svg', src: logoKiboWhite},
                    },
                    {
                        file: 'logo-kibo-on-dark.svg',
                        label: '특허 보고서 머리글',
                        src: logoKiboOnDark,
                        className: 'h-8 w-auto',
                        surface: 'navy',
                    },
                ],
            },
        ],
    },
    {
        id: 'image-illustration',
        number: '2-2',
        title: '일러스트',
        description: '제목 · 설명이 뜻을 전하므로 모두 alt="" 입니다.',
        groups: [
            {
                key: 'kbigx-print',
                title: 'K-BIGx 보고서 PDF 템플릿',
                description: 'PDF 템플릿의 표지 · 목차 그림입니다.',
                folder: 'public/images/report/',
                usedIn: 'custom/kbigx-print-cover.tsx',
                size: '표지 1028×771 · 목차 493×349 · 별 28 · 22 (용지 1360 기준)',
                grid: 'narrow',
                items: [
                    {
                        file: 'kbigx-cover.webp',
                        label: '표지 일러스트',
                        src: kbigxCover,
                        className: 'h-20 w-auto',
                    },
                    {
                        file: 'kbigx-toc.webp',
                        label: '목차 일러스트',
                        src: kbigxToc,
                        className: 'h-20 w-auto',
                    },
                    {
                        file: 'kbigx-toc-star-large.svg',
                        label: '목차 제목 별 (큰)',
                        src: kbigxTocStarLarge,
                        className: 'size-7',
                    },
                    {
                        file: 'kbigx-toc-star-small.svg',
                        label: '목차 제목 별 (작은)',
                        src: kbigxTocStarSmall,
                        className: 'size-6',
                    },
                ],
            },
            {
                key: 'option-card',
                title: '선택 카드',
                description: '평가모형 선택 등 선택 카드 그림입니다. 경로 · 크기는 화면별 목록 데이터에 있습니다.',
                folder: 'public/images/option-card/',
                usedIn: 'content/service/evaluation-model-selection.ts(평가모형 선택 · 플랫폼 소개 > 기술평가 카드) · tech-index-model-form.tsx · evaluation-method-form.tsx · batch-evaluation-form.tsx · custom/platform-intro.tsx · custom/platform-k-bigx-report.tsx · custom/platform-carbon-neutrality.tsx',
                size: '평가모형 선택: 높이 144 자리(예: 225×150) · 그 밖: 148×100 자리(예: 95×92)',
                grid: 'narrow',
                items: [
                    {
                        file: 'speed-gauge.webp',
                        label: '평가모형 선택 · KTRS-FM(플랫폼 소개 > 기술평가 포함) · 플랫폼 소개 05',
                        src: speedGauge,
                        className: 'h-20 w-auto',
                    },
                    {
                        file: 'rocket-growth.webp',
                        label: '평가모형 선택 Tech-Index(플랫폼 소개 > 기술평가 포함) · Tech-Index 선택 (일반) · 일괄평가 (일반)',
                        src: rocketGrowth,
                        className: 'h-20 w-auto',
                    },
                    {
                        file: 'building-coins.webp',
                        label: '평가모형 선택 · 투자모형(플랫폼 소개 > 기술평가 포함)',
                        src: buildingCoins,
                        className: 'h-20 w-auto',
                    },
                    {
                        file: 'building-lightbulb.webp',
                        label: 'Tech-Index 선택 (창업) · 일괄평가 (창업)',
                        src: buildingLightbulb,
                        className: 'h-20 w-auto',
                    },
                    {
                        file: 'document-chart-magnifier.webp',
                        label: '평가진행방식 · 평가검증 하기 · 플랫폼 소개 02',
                        src: documentChartMagnifier,
                        className: 'h-20 w-auto',
                    },
                    {
                        file: 'clipboard-check-chart.webp',
                        label: '평가진행방식 · 개별평가 하기 · 플랫폼 소개 > K-BIGx 보고서 · 탄소중립 카드(차별점)',
                        src: clipboardCheckChart,
                        className: 'h-20 w-auto',
                    },
                ],
            },
            {
                key: 'platform-k-bigx-hero',
                title: '플랫폼 소개 > K-BIGx 보고서 카드 그림',
                description: 'K-BIGx 소개 히어로 카드 그림입니다.',
                folder: 'public/images/platform-k-bigx-report/',
                usedIn: 'custom/platform-k-bigx-report.tsx (기업 /platform/k-bigx-report)',
                size: '높이 88 · h-22 w-auto',
                grid: 'narrow',
                items: [
                    {
                        file: 'hero-ai-report.webp',
                        label: 'AI 기반의 맞춤형 보고서 (264×264)',
                        src: kbigxHeroAiReport,
                        className: 'h-22 w-auto',
                    },
                    {
                        file: 'hero-sme-target.webp',
                        label: '중소·벤처기업 대상 (315×264)',
                        src: kbigxHeroSmeTarget,
                        className: 'h-22 w-auto',
                    },
                ],
            },
            {
                key: 'platform-carbon-hero',
                title: '플랫폼 소개 > 탄소중립 카드 그림',
                description: '탄소중립 소개 히어로 카드 그림입니다.',
                folder: 'public/images/platform-carbon-neutrality/',
                usedIn: 'custom/platform-carbon-neutrality.tsx (기업 /platform/carbon-neutrality)',
                size: '높이 88 · h-22 w-auto',
                grid: 'narrow',
                items: [
                    {
                        file: 'hero-leading-sme.webp',
                        label: '탄소중립 선도중소기업확인 (264×264)',
                        src: carbonHeroLeadingSme,
                        className: 'h-22 w-auto',
                    },
                    {
                        file: 'hero-sme-use.webp',
                        label: '중소기업에서 활용 가능 (264×264)',
                        src: carbonHeroSmeUse,
                        className: 'h-22 w-auto',
                    },
                    {
                        file: 'hero-taxonomy.webp',
                        label: '개방형 K-택소노미 (264×264)',
                        src: carbonHeroTaxonomy,
                        className: 'h-22 w-auto',
                    },
                    {
                        file: 'hero-public-use.webp',
                        label: '국민 누구나 활용 가능 (264×264)',
                        src: carbonHeroPublicUse,
                        className: 'h-22 w-auto',
                    },
                ],
            },
            {
                key: 'platform-intro-overview',
                title: '플랫폼 소개 개요 카드',
                description: '플랫폼 소개 파랑 카드(CardCarousel) 오른쪽 아래 그림입니다.',
                folder: 'public/images/platform-intro/',
                usedIn: 'custom/platform-intro.tsx (기업 · 기관 /platform)',
                size: '100×100 자리 · sizes 100px',
                grid: 'narrow',
                items: [
                    {
                        file: 'ai-donut-chart.webp',
                        label: '01 어떤 플랫폼인가요',
                        src: aiDonutChart,
                        className: 'size-20',
                    },
                    {
                        file: 'ai-database-server.webp',
                        label: '03 무엇으로 만들어졌나요',
                        src: aiDatabaseServer,
                        className: 'size-20',
                    },
                    {
                        file: 'office-bank-buildings.webp',
                        label: '04 누가 활용하나요',
                        src: officeBankBuildings,
                        className: 'size-20',
                    },
                    {
                        file: 'lightbulb-leaf.webp',
                        label: '06 어떻게 활용하나요',
                        src: lightbulbLeaf,
                        className: 'size-20',
                    },
                ],
            },
            {
                key: 'login',
                title: '로그인 회원 구분 탭',
                description: '로그인 회원 구분 탭 그림입니다. md 이상에서만 보입니다.',
                folder: 'public/images/login/',
                usedIn: 'custom/login-screen.tsx (theme/member-type-tabs.variants.ts)',
                size: 'size-24 object-contain',
                grid: 'narrow',
                items: [
                    {
                        file: 'office-building.webp',
                        label: '기업회원',
                        src: officeBuilding,
                        className: 'size-24 object-contain',
                    },
                    {
                        file: 'bank-building.webp',
                        label: '기관회원',
                        src: bankBuilding,
                        className: 'size-24 object-contain',
                    },
                ],
            },
            {
                key: 'service-intro',
                title: '서비스 소개 띠',
                description: '서비스 소개 띠(ServiceIntroBanner) 그림입니다.',
                folder: 'public/images/service-intro/',
                usedIn: 'custom/patent-grade-sections.tsx · custom/k-bigx-report-sections.tsx',
                size: 'h-auto w-full (최대 440)',
                grid: 'wide',
                items: [
                    {
                        file: 'search-window-grade-badge.webp',
                        label: '특허 등급조회',
                        src: searchWindowGradeBadge,
                        className: 'h-auto w-full max-w-80',
                    },
                    {
                        file: 'ai-robot-donut-chart.webp',
                        label: 'K-BIGx 보고서',
                        src: aiRobotDonutChart,
                        className: 'h-auto w-full max-w-80',
                    },
                ],
            },
            {
                key: 'service-status',
                title: '서비스 상태 · 인증 흐름',
                description: '서비스 상태 · 인증 흐름 화면이 함께 쓰는 그림입니다.',
                folder: 'public/images/service-status/',
                usedIn: 'custom/full-page-service-status.tsx · custom/auth-flow-page.tsx',
                size: 'h-auto w-full max-w-80',
                grid: 'wide',
                items: [
                    {
                        file: 'service-status-illustration.webp',
                        label: '서비스 상태',
                        src: serviceStatusIllustration,
                        className: 'h-auto w-full max-w-80',
                    },
                ],
            },
        ],
    },
    {
        id: 'image-screenshot',
        number: '2-3',
        title: '스크린샷',
        description: '그림이 내용을 전하므로 alt 에 캡처 내용을 적습니다.',
        groups: [
            {
                key: 'zoom-menu',
                title: '브라우저 확대 메뉴',
                description: '이용 안내의 브라우저 확대 메뉴 캡처입니다.',
                folder: 'public/images/browser/',
                usedIn: 'custom/service-guide.tsx',
                size: 'w-full aspect-[7/8] object-cover · sizes(최대 588)',
                grid: 'wide',
                items: [
                    {
                        file: 'zoom-menu-edge.webp',
                        label: 'Microsoft Edge',
                        src: zoomMenuEdge,
                        className: 'h-48 w-auto',
                    },
                    {
                        file: 'zoom-menu-chrome.webp',
                        label: 'Chrome',
                        src: zoomMenuChrome,
                        className: 'h-48 w-auto',
                    },
                ],
            },
            {
                key: 'citation-manual',
                title: '피인용 확인 방법',
                description: '피인용 확인 방법(CitationManualDialog) 단계별 캡처입니다.',
                folder: 'public/images/citation-manual/',
                usedIn: 'composite/citation-manual-dialog.tsx',
                size: 'h-auto w-full (모달 폭 · sizes 508px)',
                grid: 'wide',
                items: [
                    {
                        file: 'step-1-kipris-search-menu.webp',
                        label: '1단계 · KIPRIS 검색 메뉴',
                        src: citationStep1,
                        className: 'h-auto w-full',
                    },
                    {
                        file: 'step-2-patent-number-search.webp',
                        label: '2단계 · 특허번호 검색',
                        src: citationStep2,
                        className: 'h-auto w-full',
                    },
                    {
                        file: 'step-3-citation-count.webp',
                        label: '3단계 · 피인용 횟수',
                        src: citationStep3,
                        className: 'h-auto w-full',
                    },
                ],
            },
        ],
    },
    {
        id: 'image-background',
        number: '2-4',
        title: '배경 · 사진',
        description: '메인페이지 · 플랫폼 소개 사진입니다. 칸에 맞춰 잘리고(object-cover) 모두 alt="" 입니다.',
        groups: [
            {
                key: 'hero-bg',
                title: '첫 화면 배경',
                description: '메인페이지 첫 화면 배경입니다. 7초마다 바뀌고, 전체 화면용이라 2배로 만듭니다.',
                folder: 'public/images/main-hero/',
                usedIn: 'custom/hero-section.tsx (HERO_BACKGROUNDS) · custom/hero-background.tsx',
                size: '화면 전체 · fill · sizes="100vw" · object-cover',
                grid: 'wide',
                items: [
                    {file: 'hero-bg-1.webp', label: '배경 1', src: heroBg1, className: 'h-auto w-full'},
                    {file: 'hero-bg-2.webp', label: '배경 2', src: heroBg2, className: 'h-auto w-full'},
                ],
            },
            {
                key: 'tech-eval',
                title: '기술평가 서비스 소개',
                description: '메인페이지 기술평가 서비스 소개 그림입니다.',
                folder: 'public/images/main-hero/',
                usedIn: 'custom/tech-eval-services.tsx',
                size: '컬럼 폭 · 590:380 object-cover',
                grid: 'wide',
                items: [
                    {
                        file: 'tech-evaluation.webp',
                        label: '기술평가',
                        src: techEvaluation,
                        className: 'h-auto w-full',
                    },
                    {
                        file: 'patent-evaluation.webp',
                        label: '특허평가',
                        src: patentEvaluation,
                        className: 'h-auto w-full',
                    },
                ],
            },
            {
                key: 'second-section',
                title: '서비스 소개 사진',
                description: '메인페이지 서비스 소개 사진입니다. 원본이 그대로 나가 용량을 작게 유지합니다.',
                folder: 'public/images/main-hero/',
                usedIn: 'custom/main-second-section.tsx',
                size: '칸 전체 · fill · object-cover · unoptimized',
                grid: 'wide',
                items: [
                    {
                        file: 'service-intro-consulting.webp',
                        label: '컨설팅',
                        src: serviceIntroConsulting,
                        className: 'h-48 w-auto',
                    },
                    {
                        file: 'service-intro-self-diagnosis.webp',
                        label: '자가진단',
                        src: serviceIntroSelfDiagnosis,
                        className: 'h-48 w-auto',
                    },
                ],
            },
            {
                key: 'platform-intro',
                title: '플랫폼 소개 대표 사진',
                description: '플랫폼 소개 맨 위 대표 사진입니다.',
                folder: 'public/images/platform-intro/',
                usedIn: 'custom/platform-intro.tsx (기업 · 기관 /platform)',
                size: '1200×400 (태블릿 792×264 · 모바일 328×180) · 칸 전체 object-cover · sizes(1200 · 792 · 100vw−32) · preload',
                grid: 'wide',
                items: [
                    {
                        file: 'chart-review-meeting.webp',
                        label: '차트 보고서 검토',
                        src: chartReviewMeeting,
                        className: 'h-auto w-full',
                    },
                ],
            },
            {
                key: 'platform-intro-banner',
                title: '플랫폼 소개 배너 사진',
                description: '플랫폼 소개 전체 폭 배너 사진입니다.',
                folder: 'public/images/platform-intro/',
                usedIn: 'custom/platform-intro.tsx (기업 · 기관 /platform)',
                size: '화면 전체 폭 × 280 · object-cover 가운데 · sizes(1920 이상 100vw · 그 아래 1920px — 높이에 맞춰 늘 1920 폭으로 그려짐)',
                grid: 'wide',
                items: [
                    {
                        file: 'ai-chip-circuit.webp',
                        label: '회로망 속 AI 칩',
                        src: aiChipCircuit,
                        className: 'h-auto w-full',
                    },
                ],
            },
            {
                key: 'platform-technology-evaluation',
                title: '플랫폼 소개 > 기술평가 항목 사진',
                description: '기술평가 소개 아코디언 옆 사진입니다. 세 모형이 같은 사진을 씁니다.',
                folder: 'public/images/platform-technology-evaluation/',
                usedIn: 'custom/evaluation-model-tabs.tsx (기업 /platform/technology-evaluation)',
                size: '690×428 (태블릿 792×492 · 모바일 328×204 — 세 폭 같은 비율) · 칸 전체 object-cover · sizes(690 · 792 · 100vw−32)',
                grid: 'wide',
                items: [
                    {
                        file: 'report-charts-desk.webp',
                        label: '결과정보',
                        src: reportChartsDesk,
                        className: 'h-auto w-full',
                    },
                    {
                        file: 'business-handshake.webp',
                        label: '기대효과',
                        src: businessHandshake,
                        className: 'h-auto w-full',
                    },
                    {file: 'office-city-view.webp', label: '활용분야', src: officeCityView, className: 'h-auto w-full'},
                ],
            },
        ],
    },
]

const {count: IMAGE_COUNT, totalSize: TOTAL_IMAGE_SIZE} = summarizeAssets(
    IMAGE_SECTIONS.flatMap((section) => section.groups),
)

// 어떤 이미지인가 — 문서 맨 위 고르기 표.
const KIND_COLUMNS = [
    {key: 'kind', header: '종류', align: 'start', rowHeader: true},
    {key: 'what', header: '무엇', align: 'start', wrap: true},
    {key: 'alt', header: '대체 텍스트', align: 'start', wrap: true},
] as const

const KIND_ROWS = [
    {
        key: 'logo',
        cells: [
            '2-1. 로고',
            '헤더 · 푸터 · 보고서 로고',
            '헤더 · 푸터는 sr-only 글자가 이름을 전해 alt="" · 보고서는 alt="기술보증기금"',
        ],
    },
    {
        key: 'illustration',
        cells: ['2-2. 일러스트', '선택 카드 · 로그인 · 서비스 소개 · 상태 화면 그림', 'alt="" (장식)'],
    },
    {key: 'screenshot', cells: ['2-3. 스크린샷', '사용 방법 화면 캡처', 'alt 에 캡처 내용']},
    {
        key: 'background',
        cells: ['2-4. 배경 · 사진', '메인페이지 배경 · 소개 사진, 플랫폼 소개 대표 사진', 'alt="" (장식)'],
    },
    {
        key: 'icon',
        cells: [
            '이미지 아이콘',
            '원화 · 왕관 · 브라우저 로고 · 등급 메달 등 작은 상징 그림',
            <Link
                key="alt"
                href="/component-guide/icon#icon-image-group"
                className="text-primary-strong focus-visible:ring-ring outline-ring rounded underline underline-offset-4 focus:outline-none focus-visible:ring-2"
            >
                아이콘 가이드 2. 이미지 아이콘
            </Link>,
        ],
    },
] as const

// 쓰는 법 — 경우별 코드(실제 서비스와 같은 파일 · 크기).
const USAGE_CODE = `import Image from 'next/image'
import officeBuilding from '@public/images/login/office-building.webp'
import citationStep1 from '@public/images/citation-manual/step-1-kipris-search-menu.webp'

{/* ① 정적 import — 크기는 자동 */}
<Image src={officeBuilding} alt="" sizes="96px" className="size-24 object-contain" />

{/* ② 경로 문자열 — width · height 필수 */}
<Image src="/images/service-intro/search-window-grade-badge.webp" alt="" width={1320} height={720} sizes="440px" className="h-auto w-full" />

{/* ③ 라이트 · 다크 두 장 — 테마에 맞는 한 장만 보인다 */}
<Image src="/images/logo-ktop.svg" alt="" width={140} height={32} className="[display:var(--logo-on-light)] h-8 w-35" />
<Image src="/images/logo-ktop-white.svg" alt="" width={140} height={32} className="[display:var(--logo-on-dark)] h-8 w-35" />

{/* 그림이 내용을 전하면 alt 에 그 내용[5.1.1] */}
<Image src={citationStep1} alt="KIPRIS 첫 화면의 지식재산정보 검색 영역. 특허·실용신안 메뉴가 첫 번째에 있다." sizes="508px" className="h-auto w-full" />`

const USAGE_COLUMNS = [
    {key: 'case', header: '경우', align: 'start', rowHeader: true},
    {key: 'how', header: '쓰는 법', align: 'start', wrap: true},
    {key: 'example', header: '예', align: 'start', wrap: true},
] as const

const USAGE_ROWS = [
    {
        key: 'static',
        cells: [
            '① 정적 import',
            <span key="how">
                <code>@public/…</code> 로 import 해 <code>src</code> 에 넘깁니다. 크기는 자동입니다.
            </span>,
            '로그인 · 스크린샷 · 메인페이지 · 플랫폼 소개 사진',
        ],
    },
    {
        key: 'path',
        cells: [
            '② 경로 문자열',
            <span key="how">
                목록 데이터에 경로를 둘 때 씁니다. <code>width</code> · <code>height</code> 가 필수입니다.
            </span>,
            '선택 카드 · 서비스 소개 띠',
        ],
    },
    {
        key: 'theme',
        cells: [
            '③ 라이트 · 다크 두 장',
            <span key="how">
                <code>[display:var(--logo-on-light)]</code> · <code>[display:var(--logo-on-dark)]</code>
            </span>,
            '헤더 · 푸터 로고',
        ],
    },
    {
        key: 'cover',
        cells: [
            '④ 칸을 채우는 사진',
            <span key="how">
                <code>fill</code> 또는 <code>aspect-*</code> + <code>object-cover</code>
            </span>,
            '메인페이지 배경 · 사진 · 플랫폼 소개 대표 사진 · 확대 메뉴 캡처',
        ],
    },
] as const

// 모니터마다 조금 다르게 보이는 이유 — 고객사 · 유관부서 안내용(모니터 차이로 생기는 정상 현상).
const DISPLAY_DIFF_COLUMNS = [
    {key: 'cause', header: '원인', align: 'start', rowHeader: true},
    {key: 'look', header: '보이는 차이', align: 'start', wrap: true},
] as const

const DISPLAY_DIFF_ROWS = [
    {
        key: 'resolution',
        cells: ['화면 해상도', '고해상도 모니터일수록 더 선명하고, 일반 모니터는 살짝 부드럽게 보입니다.'],
    },
    {key: 'font', cells: ['글자 표현 방식', '운영체제 · 모니터마다 글자 굵기 · 선명도가 조금씩 다릅니다.']},
    {key: 'color', cells: ['색 설정', '모니터마다 색 범위 · 밝기가 달라 같은 색도 조금 다르게 보입니다.']},
] as const

const RULE_COLUMNS = [
    {key: 'rule', header: '항목', align: 'start', rowHeader: true},
    {key: 'note', header: '규칙', align: 'start', wrap: true},
] as const

const RULE_ROWS = [
    {key: 'where', cells: ['위치 · 이름', 'public/images/<묶음>/ · kebab-case · 그림 모양으로 이름 짓기']},
    {key: 'format', cells: ['형식', '로고는 svg, 그 밖은 webp']},
    {key: 'resolution', cells: ['해상도(webp)', '표시 크기의 3배, 전체 화면 배경은 2배(3840×2160)']},
    {key: 'file-size', cells: ['용량', 'svg · unoptimized 는 원본 그대로 나가므로 작게 유지']},
    {key: 'import', cells: ['불러오기', 'next/image 만 사용(img 금지)[NA-005]']},
    {key: 'sizes', cells: ['sizes', '표시 폭이 정해져 있으면 적기(예: sizes="440px")']},
    {key: 'preload', cells: ['preload', '첫 화면에 바로 보이는 그림에만 사용']},
    {key: 'dark', cells: ['다크 모드', '바탕에 묻히는 그림은 두 장을 두고 테마에 맞는 한 장만 표시']},
    {key: 'a11y', cells: ['대체 텍스트', '옆 글자와 뜻이 같으면 alt="", 그림이 내용을 전하면 그 내용을 적기[5.1.1]']},
] as const

// 서비스 화면에서 쓰지 않는 이미지 — public/images 에 있지만 위 목록에 없는 것.
const UNUSED_COLUMNS = [
    {key: 'file', header: '파일', align: 'start', rowHeader: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const UNUSED_ROWS = [
    {
        key: 'home-notice',
        cells: [
            'home-notice/mock-notice-image-*.webp',
            '공지 팝업 가이드 목업입니다. 실제 그림은 연동 데이터로 받습니다.',
        ],
    },
    {key: 'og-sample', cells: ['og-sample/k-top-service-preview.png', 'Open Graph 가이드 견본입니다.']},
] as const

const JUMP_LINK_CLASS =
    'border-border bg-card typo-body-l-bold text-foreground hover:bg-muted focus-visible:ring-ring rounded-md border px-4 py-2 outline-ring focus:outline-none focus-visible:ring-2'

// 섹션 묶음 제목 — 아래 카드들이 이 묶음에 속한다.
const GroupHeading = ({id, title, children}: {id: string; title: string; children: ReactNode}) => (
    <div className="flex scroll-mt-24 flex-col gap-2 pt-4" id={id}>
        <h2 className="typo-h3-bold text-foreground">{title}</h2>
        <p className="typo-body-l-regular text-label-foreground">{children}</p>
    </div>
)

const ImageGroupList = ({group}: {group: ImageGroup}) => (
    <div className="py-8 first:pt-6 last:pb-0">
        <GuideAssetGroup
            group={{
                ...group,
                items: group.items.map(({surface, ...item}) => ({
                    ...item,
                    surfaceClassName: surface ? IMAGE_SURFACE_CLASS[surface] : undefined,
                    surfaceNote: surface ? IMAGE_SURFACE_NOTE[surface] : undefined,
                })),
            }}
            gridClassName={IMAGE_GRID_CLASS[group.grid]}
            sizes="320px"
        />
    </div>
)

const ImageGuidePage = () => (
    <GuidePageShell
        title="이미지 (Image)"
        description="서비스 화면의 로고 · 일러스트 · 스크린샷 · 배경 이미지입니다. 작은 상징 그림은 아이콘 가이드에서 봅니다."
    >
        <BaseCard>
            <section aria-labelledby="image-kind" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="image-kind" className="typo-h4-bold">
                        어떤 이미지인가
                    </h2>
                </div>
                <Table caption="이미지 종류" columns={KIND_COLUMNS} rows={KIND_ROWS} size="md" />
                <nav aria-label="이미지 문서 구성" className="flex flex-wrap gap-3">
                    <a href="#image-rule-group" className={JUMP_LINK_CLASS}>
                        1. 공통 규칙
                    </a>
                    <a href="#image-list-group" className={JUMP_LINK_CLASS}>
                        2. 목록 ({IMAGE_COUNT}개)
                    </a>
                </nav>
            </section>
        </BaseCard>

        <GroupHeading id="image-rule-group" title="1. 공통 규칙">
            종류와 관계없이 같은 규칙입니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="image-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="image-usage" className="typo-h4-bold">
                        1-1. 쓰는 법
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        코드는 실제 서비스와 같은 파일 · 크기입니다.
                    </p>
                </div>
                <Table caption="이미지 쓰는 법" columns={USAGE_COLUMNS} rows={USAGE_ROWS} size="md" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="image-rule" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="image-rule" className="typo-h4-bold">
                        1-2. 규칙
                    </h3>
                </div>
                <Table caption="이미지 규칙" columns={RULE_COLUMNS} rows={RULE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="image-display-diff" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="image-display-diff" className="typo-h4-bold">
                        1-3. 모니터마다 조금 다르게 보이는 이유
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        모니터 차이로 생기는 정상 현상이며, 파일이나 화면의 오류가 아닙니다.
                    </p>
                </div>
                <Table
                    caption="모니터마다 다르게 보이는 원인"
                    columns={DISPLAY_DIFF_COLUMNS}
                    rows={DISPLAY_DIFF_ROWS}
                    size="md"
                />
                <div className="flex flex-col gap-2">
                    <h4 className="typo-title-m-bold text-foreground">이 프로젝트는 이렇게 대응합니다</h4>
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>표시 크기의 3배로 만들어 고해상도 모니터에서도 선명합니다.</li>
                        <li>모니터에 맞는 크기를 자동으로 골라 보냅니다.</li>
                        <li>화면 비교는 같은 모니터에서 해 주세요.</li>
                    </ul>
                </div>
            </section>
        </BaseCard>

        <GroupHeading id="image-list-group" title="2. 목록">
            {IMAGE_COUNT}개 · 합계 {TOTAL_IMAGE_SIZE}. 미리보기는 줄인 크기이고, 숫자는 원본 픽셀 · 용량입니다.
        </GroupHeading>

        {IMAGE_SECTIONS.map((section) => (
            <BaseCard key={section.id}>
                <section aria-labelledby={section.id} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h3 id={section.id} className="typo-h4-bold">
                            {section.number}. {section.title}
                        </h3>
                        <p className="typo-body-l-regular text-label-foreground">{section.description}</p>
                    </div>
                    <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                        {section.groups.map((group) => (
                            <ImageGroupList key={group.key} group={group} />
                        ))}
                    </div>
                </section>
            </BaseCard>
        ))}

        <BaseCard>
            <section aria-labelledby="image-unused" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="image-unused" className="typo-h4-bold">
                        2-5. 서비스 화면에서 쓰지 않는 이미지
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        public/images 에 있지만 서비스 화면에는 나오지 않습니다. 이식할 때 빼도 됩니다.
                    </p>
                </div>
                <Table
                    caption="서비스 화면에서 쓰지 않는 이미지"
                    columns={UNUSED_COLUMNS}
                    rows={UNUSED_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ImageGuidePage
