import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {StepHeader} from '@/components/composite/step-header'
import {StepNavigation} from '@/components/composite/step-navigation'
import {FormCard} from '@/components/composite/form-card'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {ReviewItem, ReviewList, ReviewSubItem} from '@/components/composite/review-list'
import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '제출 전 최종 확인'}

const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#main', label: '본문 바로가기'},
    {href: '#review-checklist', label: '체크리스트 확인 결과 바로가기'},
]

// 메인페이지 목업과 같은 주 메뉴 구성(시안 GNB). 실제 경로는 화면 목업이라 '#' 로 둔다.
const PLATFORM_NAVIGATION = {
    corp: [
        {label: '플랫폼 소개', href: '#'},
        {label: '기술평가', href: '#'},
        {label: '특허평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
    org: [
        {label: '플랫폼 소개', href: '#'},
        {label: '개별평가', href: '#'},
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '특허평가', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
} satisfies HeaderNavigationByUserType

const STEPS = ['고객 정보 활용 동의', '기업·기술정보 입력', '체크리스트 입력', '제출 전 최종 확인', '제출 완료']

const CHECKLIST_PATH = '/component-guide/self-diagnosis/checklist'

// 요약 행 데이터 — [라벨, 값]. 값이 '미입력'이면 흐린 색으로 표시한다(SummaryList empty).
const EMPTY_VALUE = '미입력'

type SummaryRow = readonly [string, string]

const COMPANY_ROWS: readonly SummaryRow[] = [
    ['기업형태', '법인'],
    ['기업명', '㈜테크놀로지'],
    ['사업자번호', '123-45-67890'],
    ['법인번호', '110111-1234567'],
    ['설립일', '2020-03-15'],
    ['대표자명', '홍길동'],
    ['회사전화번호', '02-1234-5678'],
    ['업종코드', EMPTY_VALUE],
    ['주소', EMPTY_VALUE],
    ['담당자명', '김민수'],
    ['직위', '책임연구원'],
    ['연락처', '02-1234-5678'],
    ['이메일', 'example@email.com'],
    ['기업규모', 'over'],
    ['상장구분', 'none'],
    ['산업분야 코드', EMPTY_VALUE],
    ['기업형태', 'on'],
    ['기술분류', EMPTY_VALUE],
    ['대표기술', EMPTY_VALUE],
    ['대표기술제품 (서비스)', EMPTY_VALUE],
]

const CAREER_ROWS: readonly (readonly SummaryRow[])[] = [
    [
        ['근무시작 년월', '2018-01'],
        ['근무종료 년월', '2020-02'],
        ['근무처', 'ABC테크'],
        ['업종', 'IT서비스'],
        ['동업종 여부', '예'],
        ['담당업무', '기술개발'],
        ['최종직급', '팀장'],
    ],
    [
        ['근무시작 년월', '2018-01'],
        ['근무종료 년월', '2020-02'],
        ['근무처', 'ABC테크'],
        ['업종', 'IT서비스'],
        ['동업종 여부', '예'],
        ['담당업무', '기술개발'],
        ['최종직급', '팀장'],
    ],
]

const ETC_ROWS: readonly SummaryRow[] = [
    ['기술인력', EMPTY_VALUE],
    ['기술인력', '1, 4, 2, 1'],
    ['지식재산권', '2, 1, 0, 0, 0, 3'],
    ['지식재산권', '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0'],
    ['매출현황', EMPTY_VALUE],
    ['거래유형 및 매출처', 'B2B, B2C, B2G, 15'],
    ['상시근로자수', '12, Y, N'],
    ['현재 고용인원', 'Y, N'],
    ['1년 전 고용인원 수', EMPTY_VALUE],
    ['신청기술 구분', '전문, 숙련'],
    ['평가기술명', 'AI 기반 기업 평가 분석 플랫폼'],
    ['신청기술 개요 (3줄 이상 작성권장)', EMPTY_VALUE],
    ['평가기술 IPC', 'G : 물리학'],
    ['생산 방식', 'self, outsource'],
]

const STAFF_ROWS: readonly (readonly SummaryRow[])[] = [
    [
        ['구분', '개발'],
        ['이름', '김민수'],
        ['역할', 'AI모델 개발'],
        ['직위', '책임연구원'],
        ['최종학력', '석사'],
        ['전공', '컴퓨터공학'],
        ['전공과 평가대상기술 분야 일치여부', '7년'],
        ['동업종 종사경력', '-'],
    ],
    [
        ['구분', '개발'],
        ['이름', '이지은'],
        ['역할', '플랫폼 기획'],
        ['직위', '팀장'],
        ['최종학력', '학사'],
        ['전공', '산업공학'],
        ['전공과 평가대상기술 분야 일치여부', '5년'],
        ['동업종 종사경력', '-'],
    ],
]

const RND_ROWS: readonly SummaryRow[] = [
    ['순번', '1'],
    ['구분', '-'],
    ['시제품제작 여부', '-'],
    ['매출발생 여부', '-'],
    ['지식재산권 여부', '-'],
    ['기술명', '-'],
]

// 체크리스트 확인 결과 — 배지 문구는 확인·미응답(상태)과 선택값(3단계 등) 세 가지다.
const CONFIRMED = '확인'
const UNANSWERED = '미응답'

// 미응답 배지 — 상태만 다르고 모양은 확인 배지와 같은 계열(중립 색).
const UnansweredBadge = () => (
    <Badge variant="outline" color="neutral" shape="round" size="sm">
        {UNANSWERED}
    </Badge>
)

// 선택값 배지 — 사용자가 고른 값(3단계·성장초기)을 그대로 보여준다.
const ValueBadge = ({children}: {children: string}) => (
    <Badge variant="outline" color="secondary-grape" shape="round" size="sm">
        {children}
    </Badge>
)

const SECTOR_BADGE = {
    manufacturing: (
        <Badge variant="solid-pastel" color="secondary-green" shape="round">
            제조
        </Badge>
    ),
    service: (
        <Badge variant="solid-pastel" color="secondary-grape" shape="round">
            서비스
        </Badge>
    ),
} as const

// 요약 카드 — [제목 + 건수 배지 + 안내 문구 + 수정 버튼] 헤더에 읽기 전용 목록이 붙는다.
const ReviewCard = ({count, title, children}: {count?: number; title: string; children: ReactNode}) => (
    <FormCard
        title={
            count == null ? (
                title
            ) : (
                <span className="flex items-center gap-2">
                    {title}
                    <Badge type="number" color="primary">
                        {count}
                    </Badge>
                </span>
            )
        }
        subtitle={
            <>
                <span aria-hidden="true" className="text-error-500">
                    *
                </span>
                <span className="sr-only">별표</span> 표시 항목은 필수 입력 항목입니다.
            </>
        }
        action={
            <Button variant="secondary" size="md">
                수정
            </Button>
        }
    >
        {children}
    </FormCard>
)

// 요약 목록 한 상자 — 라벨/값 쌍을 나열한다.
const SummaryBox = ({rows}: {rows: readonly SummaryRow[]}) => (
    <SummaryList>
        {rows.map(([term, value], index) => (
            <SummaryListItem key={`${term}-${index}`} term={term} empty={value === EMPTY_VALUE}>
                {value}
            </SummaryListItem>
        ))}
    </SummaryList>
)

// 2단 배치 — 반복 입력(경력사항·핵심 인력)은 상자를 두 칸으로 나눈다(시안 486px × 2 + 거터 24).
const SummaryColumns = ({columns}: {columns: readonly (readonly SummaryRow[])[]}) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {columns.map((rows, index) => (
            <SummaryBox key={index} rows={rows} />
        ))}
    </div>
)

// 자가진단 4단계 목업 — Figma "[자가진단] 4단계_제출 전 최종 확인".
// 3단계(체크리스트 입력)의 "다음" 버튼으로 진입한다. 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · StepHeader(progress) · FormCard · SummaryList · ReviewList ·
// Badge · InfoBox · StepNavigation.
const FinalReviewPage = () => (
    <div className="bg-background flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <Header overlay={false} showThemeToggle navigationByUserType={PLATFORM_NAVIGATION} />

        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다. */}
        <main id="main" tabIndex={-1} className="content-layout flex flex-1 flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="KTRS-FM"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/component-guide/self-diagnosis/evaluation-model">
                                    기술평가
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/component-guide/self-diagnosis/evaluation-model">
                                    KTRS-FM
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>제출 전 최종 확인</BreadcrumbPage>
                                <ChevronRight aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <StepHeader
                variant="progress"
                title="제출 전 최종 확인"
                description="입력하신 내용을 확인하고 이상이 없으면 제출해 주세요."
                steps={STEPS}
                current={4}
            />

            {/* 요약 카드와 체크리스트는 한 묶음이라 24px 간격이다. 위 스텝 헤더와는 60px 떨어진다(시안). */}
            <div className="mt-5 flex flex-col gap-6">
                <ReviewCard title="기업정보">
                    <SummaryBox rows={COMPANY_ROWS} />
                </ReviewCard>

                <ReviewCard title="대표자 경력사항" count={CAREER_ROWS.length}>
                    <SummaryColumns columns={CAREER_ROWS} />
                </ReviewCard>

                <ReviewCard title="기업 기타 정보">
                    <SummaryBox rows={ETC_ROWS} />
                </ReviewCard>

                <ReviewCard title="핵심 기술 인력 현황" count={STAFF_ROWS.length}>
                    <SummaryColumns columns={STAFF_ROWS} />
                </ReviewCard>

                <ReviewCard title="기술 개발 실적" count={1}>
                    <SummaryBox rows={RND_ROWS} />
                </ReviewCard>

                <FormCard title="체크리스트">
                    <ReviewList id="review-checklist">
                        <ReviewItem badge={CONFIRMED}>
                            경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만
                            해당함)
                        </ReviewItem>
                        <ReviewItem>
                            <ReviewSubItem badge={CONFIRMED}>
                                (1) 경영주는 과거 사업자 대표자로 창업한 경력 또는 업력 1년 미만 창업기업의 임직원으로
                                근무한 경력이 있고,
                            </ReviewSubItem>
                            <ReviewSubItem badge={CONFIRMED}>(2) 해당 경력 중 매출을 시현한 경험이 있다.</ReviewSubItem>
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            동사는 기술개발, 마케팅, 재무 영역을 전문적으로 담당하는 경영진을 한 명 이상 보유하고 있다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            경영주는 기관 투자를 유치한 실적이 있다. (엔젤투자 포함)
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            신제품(서비스)이 아니더라도 기술개발을 통해 명확한 기존 제품(서비스)의 새로운 기능 추가 또는
                            성능 향상 실적이 있다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            보유 특허 중 피인용 횟수가 2회 이상인 특허가 존재한다.
                        </ReviewItem>
                        <ReviewItem badge={<ValueBadge>3단계</ValueBadge>}>
                            신청기술의 기술성숙도(TRL)는 [3] 단계에 해당한다.
                        </ReviewItem>
                        <ReviewItem>
                            <ReviewSubItem badge={CONFIRMED}>
                                (1) 신청기술은 동사가 지식재산권을 등록한 기술
                            </ReviewSubItem>
                            <ReviewSubItem badge={CONFIRMED}>
                                (2) 또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.
                            </ReviewSubItem>
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            신청기술은 기존 제품(서비스) 대비 더 나은 기능/성능/사양 등을 구현할 수 있는 기술이거나,
                            시장수요에 적합한 디자인/비용 효율성/서비스 경쟁력을 갖춘 기술로, 명확하게 제시 가능한
                            기술의 차별성이 존재한다.
                        </ReviewItem>
                        <ReviewItem badge={<ValueBadge>성장초기</ValueBadge>}>
                            신청기술은 [성장초기] 기술이다.
                        </ReviewItem>
                        <ReviewItem
                            badge={<UnansweredBadge />}
                            description="* ‘타 분야의 제품/서비스/산업에 적용’ 또는 ‘글로벌 시장으로의 확장(수출)’"
                        >
                            신청기술은 확장성*이 구체적으로 존재한다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            동사의 매출·매입채권 및 현금수지를 한눈에 파악할 수 있는 자금일보를 체계적으로 관리하고
                            있다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            동사는 자가사업장 또는 동사 소유의 등록된 특허권(KPAS1 평가등급 BB등급 이상)을 보유하고
                            있다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            동사는 최근 1년 이내 정부, 지자체, 공공기관 등의 정책자금(출연/보조/융자/보증)을 지원받은
                            실적이 있다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            동사는 크라우드 펀딩 또는 기관 투자를 유치한 실적이 있다. (엔젤투자 제외)
                        </ReviewItem>
                        <ReviewItem>
                            <ReviewSubItem badge={CONFIRMED} category={SECTOR_BADGE.manufacturing}>
                                신청기술이 적용된 제품 생산 시, 생산과정이 외주가공 또는 자체제작 을 통해 이루어진다.
                            </ReviewSubItem>
                            <ReviewSubItem badge={CONFIRMED} category={SECTOR_BADGE.service}>
                                신청기술이 적용된 제품/서비스 제작 시, 제작과정이 외주인력 또는 자체인력을 통해
                                이루어진다.
                            </ReviewSubItem>
                        </ReviewItem>
                        <ReviewItem>
                            <ReviewSubItem badge={CONFIRMED} category={SECTOR_BADGE.manufacturing}>
                                원자재에 석유·화학 원료(가격 변동성), 금속/광물 원자재(희토류 포함 중금속 등),
                                농산물(기후조건 등에 의한 생산량 변동) 등 수급에 크게 영향을 받는 비품/품목이 있다.
                            </ReviewSubItem>
                            <ReviewSubItem badge={CONFIRMED} category={SECTOR_BADGE.service}>
                                원자재에 미디어 콘텐츠, 소프트웨어 제품, IT서비스 등 가격·수량 측면에서 수급에 크게
                                영향을 받는 비품/품목이 있다.
                            </ReviewSubItem>
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            품질관리 매뉴얼이 기록·관리 되어오고 있으며, 매뉴얼의 제시가 가능하다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            A/S 등 제품 판매 후 관리 시스템이 구축되어 있고, 고객과의 사후관리 사례 제시가 가능하다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            HACCP, ISO, KC 인증 등 공인규격 또는 품질/기술인증 실적을 보유하고 있다.
                        </ReviewItem>
                        <ReviewItem badge={<UnansweredBadge />}>
                            온라인과 오프라인 분야 모두 자체 유통 채널을 보유하고 있다.
                        </ReviewItem>
                        <ReviewItem badge={CONFIRMED}>
                            ① 신청기술은 경쟁사간 기술적 차별화 또는 기술격차로 인해 안정적인 거래처를 확보할 수 있고
                            영업적 리스크가 낮다.
                        </ReviewItem>
                        <ReviewItem badge={CONFIRMED}>
                            신청기술의 사업화 모델은 매출시현을 위한 초기 자본적 투자(인력, 설비 등)가 동사의
                            자금조달능력으로 가능하고, 매출증가에 따른 추가 투자가 적은 편이다.
                        </ReviewItem>
                        <ReviewItem badge={CONFIRMED}>
                            재료비, 노무비, 제조경비, 판매 및 일반관리비 등 판매단가 절감 방법(기술전략, 비용관리,
                            파트너쉽 체결, 디지털 적용 등)을 보유하고 있으며, 객관적인 자료의 제시가 가능하다.
                        </ReviewItem>
                        <ReviewItem badge={CONFIRMED}>
                            전년도 및 평가기준일이 속한 연도에 걸쳐 2년 연속 매출을 시현하고 있는 매출처가 있다.
                        </ReviewItem>
                    </ReviewList>
                </FormCard>
            </div>

            {/* 시안의 하단 안내는 회색 채움이 아니라 흰 카드 + 테두리(radius 16)다 — outline 변형을 쓴다. */}
            <InfoBox variant="outline" title="꼭 확인해 주세요">
                <InfoBoxItem>
                    제출 이후에는 수정할 수 없습니다. 입력하신 내용을 다시 한번 확인해 주시고, 이상이 없을 경우
                    [제출하기]를 클릭해 주세요.
                </InfoBoxItem>
                <InfoBoxItem>진단 결과발송은 &lsquo;진행현황&rsquo; 화면을 통해 진행하실 수 있습니다.</InfoBoxItem>
            </InfoBox>
        </main>

        {/* 하단 CTA — 본문 끝에 그대로 붙는 블록이다. */}
        <StepNavigation
            prev={{asChild: true, children: <Link href={CHECKLIST_PATH}>이전</Link>}}
            next={{
                asChild: true,
                children: <Link href="/component-guide/self-diagnosis/complete">제출하기</Link>,
            }}
        />
    </div>
)

export default FinalReviewPage
