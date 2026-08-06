import type {Metadata} from 'next'
import FinalSubmitNavigation from './final-submit-navigation'
import type {ReactNode} from 'react'
import {ChevronRight} from 'lucide-react'
import SelfDiagnosisInputHeader from '@/app/component-guide/(demo)/self-diagnosis/_components/self-diagnosis-input-header'
import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
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
import {FormCard} from '@/components/composite/form-card'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {
    QuestionGroupHeader,
    QuestionGroupHeaderDescription,
    QuestionGroupHeaderTitle,
} from '@/components/composite/question-group-header'
import {QuestionItem, QuestionList, QuestionOption, QuestionOptionList} from '@/components/composite/question-list'
import {QuestionSelect} from '@/components/composite/question-select'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '체크리스트 입력'}

const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#main', label: '본문 바로가기'},
    {href: '#checklist', label: '체크리스트 바로가기'},
]

const COMPANY_INFO_PATH = '/component-guide/self-diagnosis/company-info'

// 문장 안 [ ] 에는 짧은 표기(token), 목록에는 전체 문구(label)를 쓴다.
const TRL_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((level) => ({
    value: level,
    label: `${level}단계`,
    token: level,
}))

const TECHNOLOGY_TYPE_OPTIONS = [
    {value: 'product', label: '제품'},
    {value: 'service', label: '서비스'},
    {value: 'process', label: '공정'},
] as const

// 문항 체크박스 — 접근 가능한 이름은 문항 번호로 준다(본문이 길어 aria-label 로 반복하지 않는다).
const QuestionCheckbox = ({number}: {number: number}) => (
    <Checkbox name={`q${number}`} value="yes" aria-label={`${number}번 문항 선택`} />
)

// 본문 아래 보조 링크(피인용 확인 메뉴얼·TRL 확인 등) — 시안 button_text 사양:
// 1px 밑줄(text-underline) · 14px 텍스트 · 16px 아이콘 · 높이 24px(= 텍스트 버튼 size md).
// 텍스트↔아이콘 간격은 시안이 4px 라 size md 기본값(6px)을 gap-1 로 좁힌다.
const GuideLink = ({children}: {children: string}) => (
    <Button variant="text-underline" size="md" className="gap-1">
        {children}
        <ChevronRight aria-hidden="true" />
    </Button>
)

// 배지가 붙는 인라인 문항 행(제조·서비스) — 시안 17·18 번 문항.
const SECTOR_BADGE = {
    manufacturing: (
        <Badge variant="solid-pastel" color="secondary-green" shape="round">
            제조
        </Badge>
    ),
    service: (
        <Badge variant="solid-pastel" color="secondary-purple" shape="round">
            서비스
        </Badge>
    ),
} as const

// 단순 체크 문항 — [번호][본문][우측 체크박스] 한 줄. description 은 본문 아래 작은 보조 문구.
// 번호는 QuestionList 의 자동 채번 대신 number 로 직접 넘긴다 — 래퍼 컴포넌트에는 자동 index 가 전달되지 않는다.
const PlainQuestion = ({
    number,
    description,
    children,
}: {
    number: number
    description?: string
    children: ReactNode
}) => (
    <QuestionItem number={number} description={description} control={<QuestionCheckbox number={number} />}>
        {children}
    </QuestionItem>
)

// 체크리스트 본문 — Figma "체크리스트" 카드. 문항 번호는 QuestionList 의 start 로 이어 붙인다.
const Checklist = () => (
    <FormCard title="체크리스트">
        <div id="checklist" className="flex flex-col gap-6">
            <QuestionList start={1}>
                <PlainQuestion number={1}>
                    경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.
                </PlainQuestion>
                <PlainQuestion number={2}>
                    경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만 해당함)
                </PlainQuestion>
                <QuestionItem>
                    <QuestionOptionList>
                        <QuestionOption
                            control={<Checkbox name="q3-1" value="yes" aria-label="3번 문항 첫 번째 선택" />}
                        >
                            경영주는 과거 사업자 대표자로 창업한 경력 또는 업력 1년 미만 창업기업의 임직원으로 근무한
                            경력이 있고,
                        </QuestionOption>
                        <QuestionOption
                            control={<Checkbox name="q3-2" value="yes" aria-label="3번 문항 두 번째 선택" />}
                        >
                            해당 경력 중 매출을 시현한 경험이 있다.
                        </QuestionOption>
                    </QuestionOptionList>
                </QuestionItem>
                <PlainQuestion number={4}>
                    동사는 기술개발, 마케팅, 재무 영역을 전문적으로 담당하는 경영진을 한 명 이상 보유하고 있다.
                </PlainQuestion>
                <PlainQuestion number={5}>경영주는 기관 투자를 유치한 실적이 있다. (엔젤투자 포함)</PlainQuestion>
                <PlainQuestion number={6}>
                    신제품(서비스)이 아니더라도 기술개발을 통해 명확한 기존 제품(서비스)의 새로운 기능 추가 또는 성능
                    향상 실적이 있다.
                </PlainQuestion>
                <QuestionItem
                    helper={<GuideLink>피인용 확인 메뉴얼</GuideLink>}
                    control={<QuestionCheckbox number={7} />}
                >
                    보유 특허 중 피인용 횟수가 2회 이상인 특허가 존재한다.
                </QuestionItem>
            </QuestionList>

            {/* 기술 구분 선택 — 아래 문항의 분기 조건이라 문항 목록 사이에 들어간다. */}
            <div className="flex flex-col gap-3">
                <QuestionGroupHeader>
                    <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
                    <QuestionGroupHeaderDescription>
                        선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다
                    </QuestionGroupHeaderDescription>
                </QuestionGroupHeader>
                <ChipRadioGroup
                    name="technologyCategory"
                    defaultValue="expert"
                    aria-label="신청기술 기술 구분"
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                    <ChipRadio size="md" value="expert" className="w-full">
                        전문기술 (R&amp;D·지식재산권·기술성숙도(TRL) 기반)
                    </ChipRadio>
                    <ChipRadio size="md" value="skilled" className="w-full">
                        숙련기술 (생산·품질 등 숙련 노하우 기반)
                    </ChipRadio>
                </ChipRadioGroup>
            </div>

            <QuestionList start={8}>
                <QuestionItem helper={<GuideLink>TRL 확인</GuideLink>}>
                    <QuestionSelect
                        name="trl"
                        label="기술성숙도(TRL) 단계"
                        before="신청기술의 기술성숙도(TRL)는"
                        after="단계에 해당한다"
                        defaultValue="3"
                        options={TRL_OPTIONS}
                    />
                </QuestionItem>
                <QuestionItem>
                    <QuestionOptionList>
                        <QuestionOption
                            control={<Checkbox name="q9-1" value="yes" aria-label="9번 문항 첫 번째 선택" />}
                        >
                            신청기술은 동사가 지식재산권을 등록한 기술
                        </QuestionOption>
                        <QuestionOption
                            control={<Checkbox name="q9-2" value="yes" aria-label="9번 문항 두 번째 선택" />}
                        >
                            또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.
                        </QuestionOption>
                    </QuestionOptionList>
                </QuestionItem>
                <PlainQuestion number={10}>
                    신청기술은 기존 제품(서비스) 대비 더 나은 기능/성능/사양 등을 구현할 수 있는 기술이거나, 시장수요에
                    적합한 디자인/비용 효율성/서비스 경쟁력을 갖춘 기술로, 명확하게 제시 가능한 기술의 차별성이
                    존재한다.
                </PlainQuestion>
                <QuestionItem>
                    <QuestionSelect
                        name="technologyType"
                        label="신청기술 유형"
                        before="신청기술은"
                        after="기술이다."
                        options={TECHNOLOGY_TYPE_OPTIONS}
                    />
                </QuestionItem>
                <PlainQuestion
                    number={12}
                    description="‘타 분야의 제품/서비스/산업에 적용’ 또는 ‘글로벌 시장으로의 확장(수출)’"
                >
                    신청기술은 확장성*이 구체적으로 존재한다.
                </PlainQuestion>
                <PlainQuestion number={13}>
                    동사의 매출·매입채권 및 현금수지를 한눈에 파악할 수 있는 자금일보를 체계적으로 관리하고 있다.
                </PlainQuestion>
                <PlainQuestion number={14}>
                    동사는 자가사업장 또는 동사 소유의 등록된 특허권(KPAS1 평가등급 BB등급 이상)을 보유하고 있다.
                </PlainQuestion>
                <PlainQuestion number={15}>
                    동사는 최근 1년 이내 정부, 지자체, 공공기관 등의 정책자금(출연/보조/융자/보증)을 지원받은 실적이
                    있다.
                </PlainQuestion>
                <PlainQuestion number={16}>
                    동사는 크라우드 펀딩 또는 기관 투자를 유치한 실적이 있다. (엔젤투자 제외)
                </PlainQuestion>
                {/* 17 — 제조·서비스 두 줄이 한 문항이고, 각 줄의 보기는 인라인 칩이다. */}
                <QuestionItem align="control">
                    <QuestionOptionList>
                        <QuestionOption align="control" badge={SECTOR_BADGE.manufacturing}>
                            <ChipCheckboxGroup aria-label="17번 문항 생산과정 선택" className="items-center">
                                신청기술이 적용된 제품 생산 시, 생산과정이
                                <ChipCheckbox size="md" name="q17-manufacturing" value="outsourced" defaultChecked>
                                    외주가공
                                </ChipCheckbox>
                                또는
                                <ChipCheckbox size="md" name="q17-manufacturing" value="inhouse">
                                    자체제작
                                </ChipCheckbox>
                                을 통해 이루어진다.
                            </ChipCheckboxGroup>
                        </QuestionOption>
                        <QuestionOption align="control" badge={SECTOR_BADGE.service}>
                            <ChipCheckboxGroup aria-label="17번 문항 제작과정 선택" className="items-center">
                                신청기술이 적용된 제품/서비스 제작 시, 제작과정이
                                <ChipCheckbox size="md" name="q17-service" value="outsourced">
                                    외주인력
                                </ChipCheckbox>
                                또는
                                <ChipCheckbox size="md" name="q17-service" value="inhouse">
                                    자체인력
                                </ChipCheckbox>
                                을 통해 이루어진다.
                            </ChipCheckboxGroup>
                        </QuestionOption>
                    </QuestionOptionList>
                </QuestionItem>
                {/* 18 — 제조·서비스 두 줄이 각각 자기 체크박스를 가진다. */}
                <QuestionItem>
                    <QuestionOptionList>
                        <QuestionOption
                            badge={SECTOR_BADGE.manufacturing}
                            control={<Checkbox name="q18-manufacturing" value="yes" aria-label="18번 문항 제조 선택" />}
                        >
                            원자재에 석유·화학 원료(가격 변동성), 금속/광물 원자재(희토류 포함 중금속 등),
                            농산물(기후조건 등에 의한 생산량 변동) 등 수급에 크게 영향을 받는 비품/품목이 있다.
                        </QuestionOption>
                        <QuestionOption
                            badge={SECTOR_BADGE.service}
                            control={<Checkbox name="q18-service" value="yes" aria-label="18번 문항 서비스 선택" />}
                        >
                            원자재에 미디어 콘텐츠, 소프트웨어 제품, IT서비스 등 가격·수량 측면에서 수급에 크게 영향을
                            받는 비품/품목이 있다.
                        </QuestionOption>
                    </QuestionOptionList>
                </QuestionItem>
                <PlainQuestion number={19}>
                    품질관리 매뉴얼이 기록·관리 되어오고 있으며, 매뉴얼의 제시가 가능하다.
                </PlainQuestion>
                <PlainQuestion number={20}>
                    A/S 등 제품 판매 후 관리 시스템이 구축되어 있고, 고객과의 사후관리 사례 제시가 가능하다.
                </PlainQuestion>
                <PlainQuestion number={21}>
                    HACCP, ISO, KC 인증 등 공인규격 또는 품질/기술인증 실적을 보유하고 있다.
                </PlainQuestion>
                <PlainQuestion number={22}>온라인과 오프라인 분야 모두 자체 유통 채널을 보유하고 있다.</PlainQuestion>
            </QuestionList>

            {/* 23 — 앞선 응답에 따라 보기가 달라지는 택1 문항이라 그룹 헤더와 한 묶음이다. */}
            <div className="flex flex-col gap-3">
                <QuestionGroupHeader>
                    <QuestionGroupHeaderTitle>
                        아래 중 동사에 해당하는 항목을 선택해 주세요. (택1)
                    </QuestionGroupHeaderTitle>
                    <QuestionGroupHeaderDescription>
                        기술구분(전문/숙련)·[10]·[11] 응답에 따라 위 보기가 자동으로 달라집니다.
                    </QuestionGroupHeaderDescription>
                </QuestionGroupHeader>
                <QuestionList start={23}>
                    <QuestionItem align="control" contentClassName="w-full">
                        <Select name="evaluationItem">
                            <SelectTrigger size="md" aria-label="해당 항목 선택" className="w-full">
                                <SelectValue placeholder="선택해 주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technology">기술성</SelectItem>
                                <SelectItem value="business">사업성</SelectItem>
                            </SelectContent>
                        </Select>
                    </QuestionItem>
                </QuestionList>
            </div>

            <QuestionList start={24}>
                <PlainQuestion number={24}>
                    신청기술의 사업화 모델은 매출시현을 위한 초기 자본적 투자(인력, 설비 등)가 동사의 자금조달능력으로
                    가능하고, 매출증가에 따른 추가 투자가 적은 편이다.
                </PlainQuestion>
                <PlainQuestion number={25}>
                    재료비, 노무비, 제조경비, 판매 및 일반관리비 등 판매단가 절감 방법(기술전략, 비용관리, 파트너쉽
                    체결, 디지털 적용 등)을 보유하고 있으며, 객관적인 자료의 제시가 가능하다.
                </PlainQuestion>
                <PlainQuestion number={26}>
                    전년도 및 평가기준일이 속한 연도에 걸쳐 2년 연속 매출을 시현하고 있는 매출처가 있다.
                </PlainQuestion>
            </QuestionList>
        </div>
    </FormCard>
)

// 자가진단 3단계 목업 — Figma "[자가진단] 3단계_체크리스트 입력".
// 2단계(기업·기술정보 입력)의 "다음" 버튼으로 진입한다. 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · StepHeader(progress) · FormCard · QuestionList · QuestionGroupHeader ·
// Chip · Select · Checkbox · Badge · StepNavigation.
const ChecklistPage = () => (
    <div className="bg-background flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <SelfDiagnosisInputHeader
            overlay={false}
            showThemeToggle
            logoHref="/component-guide/main-page"
            navigationByUserType={DEFAULT_HEADER_NAVIGATION}
        />

        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다. */}
        <main id="main" tabIndex={-1} className="content-layout flex flex-1 flex-col gap-10 pt-10">
            <PageTitleBar
                title="신속표준모형"
                badge={
                    <Badge variant="solid" color="info" shape="round">
                        KTRS-FM
                    </Badge>
                }
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
                                <BreadcrumbPage>KTRS-FM</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <StepHeader
                title="체크리스트 입력"
                description="평가 항목별 체크리스트를 작성해 주세요. 해당사항에 맞게 선택해 주십시오."
                steps={SELF_DIAGNOSIS_STEPS}
                current={3}
            />

            {/* 카드와 스텝 헤더 사이는 60px(시안) — main 의 gap-10(40) 에 20 을 더한다. */}
            <div className="mt-5">
                <Checklist />
            </div>
        </main>

        {/* 하단 CTA — '다음'은 바로 넘어가지 않고 최종 확인 모달을 먼저 띄운다(시안 [자가진단] alert). */}
        <FinalSubmitNavigation prevHref={COMPANY_INFO_PATH} completeHref="/component-guide/self-diagnosis/complete" />
    </div>
)

export default ChecklistPage
