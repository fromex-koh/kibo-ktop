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
import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'
import {FormCard} from '@/components/composite/form-card'
import {ConsentItem, ConsentList} from '@/components/composite/consent-list'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Field, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {cn} from '@/lib/utils'

export const metadata: Metadata = {title: '고객 정보 활용 동의'}

const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#main', label: '본문 바로가기'},
    {href: '#consent-forms', label: '동의서 바로가기'},
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

// 단계 제목 배열 하나가 전체 단계 수·현재 제목·다음 제목의 단일 소스다(StepHeader/StepProgress 규약).
const STEPS = ['고객 정보 활용 동의', '기업·기술정보 입력', '체크리스트 입력', '제출 전 최종 확인', '제출 완료']

// [기업] 동의서 — 안내 문구 없이 제목만 있는 행이다.
const CORP_CONSENTS = [
    {name: 'corpCollect', title: '1. 수집·이용에 관한 사항', requirement: 'required'},
    {name: 'corpProvide', title: '2. 제공에 관한 사항', requirement: 'required'},
    {name: 'corpInquiry', title: '3. 조회에 관한 사항', requirement: 'required'},
    {name: 'corpTax', title: '4. 세무회계자료의 온라인 제출에 관한 사항', requirement: 'optional'},
] as const

// [개인] 동의서 — 제목 아래 확인 문구가 함께 온다.
const PERSONAL_CONSENTS = [
    {
        name: 'personalCollect',
        title: '1. 수집·이용에 관한 사항',
        description: '위 고유식별정보 수집·이용에 동의하십니까?',
    },
    {
        name: 'personalProvide',
        title: '2. 제공에 관한 사항',
        description: '위 고유식별정보 제공에 동의하십니까? (단, ①②⑤에 한함)',
    },
    {name: 'personalInquiry', title: '3. 조회에 관한 사항', description: '위 고유식별정보 조회에 동의하십니까?'},
] as const

const EMAIL_DOMAINS = [
    {value: 'direct', label: '직접입력'},
    {value: 'naver.com', label: 'naver.com'},
    {value: 'gmail.com', label: 'gmail.com'},
    {value: 'daum.net', label: 'daum.net'},
] as const

// "내용보기" — 약관 전문을 여는 인라인 텍스트 버튼(실제 화면에서는 모달을 연다).
const DetailAction = () => (
    <Button variant="text" size="lg">
        내용보기
        <ChevronRight aria-hidden="true" />
    </Button>
)

// 동의/비동의 라디오 — 항목마다 name 이 달라야 서로 독립적으로 선택된다.
const ConsentRadio = ({name, label}: {name: string; label: string}) => (
    <RadioGroup name={name} aria-label={`${label} 동의 여부`} className="flex w-fit flex-row gap-6">
        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
            <RadioGroupItem value="agree" id={`${name}-agree`} aria-labelledby={`${name}-agree-label`} />
            <FieldLabel id={`${name}-agree-label`} htmlFor={`${name}-agree`}>
                동의
            </FieldLabel>
        </Field>
        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
            <RadioGroupItem value="disagree" id={`${name}-disagree`} aria-labelledby={`${name}-disagree-label`} />
            <FieldLabel id={`${name}-disagree-label`} htmlFor={`${name}-disagree`}>
                비동의
            </FieldLabel>
        </Field>
    </RadioGroup>
)

const RequirementBadge = ({requirement}: {requirement: 'required' | 'optional'}) =>
    requirement === 'required' ? (
        <Badge variant="outline" color="info" shape="round">
            필수
        </Badge>
    ) : (
        <Badge variant="outline" color="neutral" shape="round">
            선택
        </Badge>
    )

// 동의서 카드 — 같은 번호·제목이 [기업]·[개인] 두 장에 반복되므로 라디오 이름표에 문서 구분을 함께 넣는다.
const ConsentCard = ({title, children}: {title: string; children: ReactNode}) => (
    <FormCard title={title}>
        <ConsentList>{children}</ConsentList>
    </FormCard>
)

// 자가진단 1단계 목업 — Figma "[자가진단] 1단계_고객 정보 활용 동의".
// 평가모형 선택 화면의 "혁신성장지수 평가" 카드로 진입한다. 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · StepHeader(progress) · SelectableCard · FormCard · ConsentList ·
// Input/InputGroup/Select · StepNavigation.
const CustomerConsentPage = () => (
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
                                <BreadcrumbPage>고객 정보 활용 동의</BreadcrumbPage>
                                <ChevronRight aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <StepHeader
                variant="progress"
                title="고객 정보 활용 동의"
                description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
                steps={STEPS}
                current={1}
            />

            {/* 동의 범위 선택 + 동의서 두 장은 한 묶음이라 간격이 24px 다. 위 스텝 헤더와는 60px 떨어진다(시안). */}
            <div id="consent-forms" className="mt-5 flex flex-col gap-6">
                <SelectableCardGroup
                    name="consentScope"
                    defaultValue="required-only"
                    aria-label="동의 범위 선택"
                    className="grid gap-4 md:grid-cols-2"
                >
                    <SelectableCard
                        control="radio"
                        value="required-only"
                        badges={<RequirementBadge requirement="required" />}
                    >
                        필수항목만 동의
                    </SelectableCard>
                    <SelectableCard
                        control="radio"
                        value="all"
                        badges={
                            <>
                                <RequirementBadge requirement="required" />
                                <RequirementBadge requirement="optional" />
                            </>
                        }
                    >
                        전체 항목 동의
                    </SelectableCard>
                </SelectableCardGroup>

                <ConsentCard title="[기업] 정보 수집·이용·제공·조회 동의서">
                    {CORP_CONSENTS.map((consent) => (
                        <ConsentItem
                            key={consent.name}
                            requirement={consent.requirement}
                            title={consent.title}
                            action={<DetailAction />}
                            control={<ConsentRadio name={consent.name} label={`[기업] ${consent.title}`} />}
                        />
                    ))}
                </ConsentCard>

                <ConsentCard title="[개인] 정보 수집·이용·제공·조회 동의서">
                    {PERSONAL_CONSENTS.map((consent) => (
                        <ConsentItem
                            key={consent.name}
                            title={consent.title}
                            description={consent.description}
                            action={<DetailAction />}
                            control={<ConsentRadio name={consent.name} label={`[개인] ${consent.title}`} />}
                        />
                    ))}
                </ConsentCard>
            </div>

            <div className="flex flex-col gap-4">
                <SelectableCard name="agreementUnderstood" value="yes" defaultChecked>
                    본인은 기술보증기금과 동의서를 작성함에 이 동의서의 중요한 내용에 대한 설명을 읽고 이해하였음을
                    확인합니다.
                </SelectableCard>
                <SelectableCard name="noticeEmail" value="yes">
                    본인은 회원정보(마이페이지)상 이메일정보를 확인하였으며, 해당 이메일로 정보 수집·이용·제공·조회 관련
                    『고객관리안내문』과 작성하신 동의서가 발송됨에 동의합니다.
                </SelectableCard>
            </div>

            <FormCard title="부분발송 이메일등록" subtitle="안내문을 추가로 받으실 이메일 주소를 입력해주세요.">
                <div className="flex flex-wrap items-center gap-6">
                    {/* 아이디 @ 도메인 — 시안은 @ 를 입력 칸 안이 아니라 두 칸 사이에 둔다(칸 사이 8px). */}
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        {/* 이메일을 아이디·도메인 두 칸으로 나눠 받으므로 email 자동완성(전체 주소)은 맞지 않는다. */}
                        <Input
                            name="emailId"
                            placeholder="이메일 아이디"
                            aria-label="이메일 아이디"
                            autoComplete="off"
                            className="min-w-0 flex-1"
                        />
                        <span className="typo-body-xl-regular text-label-foreground shrink-0">@</span>
                        <Input
                            name="emailDomain"
                            placeholder="도메인 직접입력"
                            aria-label="이메일 도메인"
                            autoComplete="off"
                            className="min-w-0 flex-1"
                        />
                    </div>
                    <Select name="emailDomainPreset" defaultValue="direct">
                        <SelectTrigger className="w-70" aria-label="이메일 도메인 선택">
                            <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            {EMAIL_DOMAINS.map((domain) => (
                                <SelectItem key={domain.value} value={domain.value}>
                                    {domain.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </FormCard>
        </main>

        {/* 하단 CTA — 본문 끝에 그대로 붙는 블록이다(고정·플로팅 아님). */}
        <StepNavigation
            prev={{
                asChild: true,
                children: <Link href="/component-guide/self-diagnosis/evaluation-model">이전</Link>,
            }}
            next={{
                asChild: true,
                children: <Link href="/component-guide/self-diagnosis/company-info">동의 후 인증서명</Link>,
            }}
        />
    </div>
)

export default CustomerConsentPage
