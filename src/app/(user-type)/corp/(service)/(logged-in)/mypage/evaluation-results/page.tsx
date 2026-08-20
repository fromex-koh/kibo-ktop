import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {MypageSidebar} from '@/components/composite/mypage-sidebar'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'
import {EvaluationResultList, type EvaluationResultItem} from '@/components/custom/evaluation-result-list'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'
import {
    DEFAULT_EVALUATION_PERIOD,
    EVALUATION_MODEL_FILTERS,
    EVALUATION_STATUS_FILTERS,
} from '@/constants/evaluation-result'

export const metadata: Metadata = {title: '평가결과 조회'}

// [프론트엔드 연동] 이 화면이 쓰는 값은 아래 두 상수뿐이고, 목록 컴포넌트(EvaluationResultList)는
// 넘겨받은 것만 그린다 — 조회 코드를 화면 안에서 찾아다닐 필요가 없다.
//   · MOCK_EVALUATION_RESULTS → 평가결과 조회 응답으로 교체한다. status 는 'evaluated'(평가완료) ·
//                               'analyzed'(분석완료) · 'inProgress'(진행중) 세 가지다.
//   · MOCK_EVALUATION_PAGE_SIZE → 한 페이지에 보여 줄 건수.
//   · 조회 조건(모형·진행상태 선택지, 기본 조회기간) → 이 화면이 읽어 목록에 내려 준다.
// 결과가 아직 나오지 않아 눌러도 볼 것이 없는 건은 disabled 로 넘긴다 — 버튼과 링크가 함께 잠긴다.
// 빈 배열을 넘기면 목록 자리에 빈 상태 안내가 나온다.
//
// 각 동작이 여는 화면도 건마다 다르므로 항목이 들고 있다. 아직 만들지 않은 화면은 '#' 으로 둔다
// (없는 주소를 미리 적을 수 없다 — 마이페이지 LNB 의 미구현 메뉴와 같은 처리).
const BANK_TRANSFER_PATH = '/corp/mypage/evaluation-results/bank-transfer'
const GUARANTEE_PATH = '/corp/mypage/evaluation-results/guarantee-application'
const NOT_READY_PATH = '#'

const MOCK_EVALUATION_RESULTS: readonly EvaluationResultItem[] = [
    {
        id: 'corp-evaluation-001',
        evaluatedAt: '2026.05.15 14:30',
        status: 'evaluated',
        grade: 'AA',
        title: '자가진단',
        model: 'KTRS-FM',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '기관전송', href: NOT_READY_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-002',
        evaluatedAt: '2026.05.14 11:02',
        status: 'analyzed',
        grade: '6.6',
        title: 'Tech-Index',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '기관전송', href: NOT_READY_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-003',
        evaluatedAt: '2026.05.12 09:47',
        status: 'inProgress',
        grade: 'AA',
        title: '창업용 Tech-Index',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '기관전송', href: NOT_READY_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-004',
        evaluatedAt: '2026.05.11 16:20',
        status: 'analyzed',
        grade: 'AA',
        title: '투자모형',
        analyses: [{kind: 'general', href: NOT_READY_PATH}],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '기관전송', href: NOT_READY_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-005',
        evaluatedAt: '2026.05.08 10:15',
        status: 'inProgress',
        title: '자가진단',
        model: 'KTRS-FM',
        disabled: true,
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: NOT_READY_PATH},
            {label: '기관전송', href: NOT_READY_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
            {label: '보증신청', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-006',
        evaluatedAt: '2026.05.04 13:41',
        status: 'evaluated',
        grade: 'A',
        title: '자가진단',
        model: 'KTRS-FM',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '기관전송', href: NOT_READY_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-007',
        evaluatedAt: '2026.04.29 15:08',
        status: 'analyzed',
        grade: '7.1',
        title: 'Tech-Index',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-008',
        evaluatedAt: '2026.04.27 09:22',
        status: 'evaluated',
        grade: 'BBB',
        title: '투자모형',
        analyses: [{kind: 'general', href: NOT_READY_PATH}],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-009',
        evaluatedAt: '2026.04.22 17:55',
        status: 'analyzed',
        grade: '5.8',
        title: '창업용 Tech-Index',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-010',
        evaluatedAt: '2026.04.18 08:30',
        status: 'inProgress',
        title: 'Tech-Index',
        disabled: true,
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: NOT_READY_PATH},
            {label: '전송내역', href: NOT_READY_PATH},
        ],
    },
    {
        id: 'corp-evaluation-011',
        evaluatedAt: '2026.04.15 12:11',
        status: 'evaluated',
        grade: 'AA',
        title: '자가진단',
        model: 'KTRS-FM',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [
            {label: '은행전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-012',
        evaluatedAt: '2026.04.11 14:03',
        status: 'analyzed',
        grade: '6.2',
        title: '투자모형',
        analyses: [{kind: 'general', href: NOT_READY_PATH}],
        actions: [{label: '전송내역', href: NOT_READY_PATH}],
    },
    {
        id: 'corp-evaluation-013',
        evaluatedAt: '2026.04.08 10:44',
        status: 'evaluated',
        grade: 'A',
        title: 'Tech-Index',
        analyses: [
            {kind: 'general', href: NOT_READY_PATH},
            {kind: 'deep', href: NOT_READY_PATH},
        ],
        actions: [{label: '전송내역', href: NOT_READY_PATH}],
    },
]

// 한 페이지 5건(시안) — 목업이 13건이라 3페이지가 만들어진다.
const MOCK_EVALUATION_PAGE_SIZE = 5

// 기업 마이페이지 (3) 평가결과 조회 — Figma "[마이페이지] 평가이력 조회".
// 두 열 배치·간격은 마이페이지의 다른 화면과 같다(사이드바 344 + 64 + 본문 792 = 1200).
const CorpMypageEvaluationResultsPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
            <PageTitleBar
                title="마이페이지"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>마이페이지</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>평가결과 조회</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                <MypageSidebar
                    userType="corp"
                    current="평가결과 조회"
                    companyName={MYPAGE_MEMBER.companyName}
                    memberType={MYPAGE_MEMBER.memberType}
                />

                <div className="flex min-w-0 flex-1 flex-col gap-10">
                    {/* 시안에는 화면 제목 아래 설명이 없다 — 조회 필터가 바로 이어진다. */}
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">평가결과 조회</SectionHeaderTitle>
                    </SectionHeader>

                    <EvaluationResultList
                        items={MOCK_EVALUATION_RESULTS}
                        modelFilters={EVALUATION_MODEL_FILTERS}
                        statusFilters={EVALUATION_STATUS_FILTERS}
                        defaultPeriod={DEFAULT_EVALUATION_PERIOD}
                        pageSize={MOCK_EVALUATION_PAGE_SIZE}
                    />
                </div>
            </div>
        </div>
    </main>
)

export default CorpMypageEvaluationResultsPage
