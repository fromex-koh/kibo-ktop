import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Link from 'next/link'
import {ChevronRight, CircleCheck, Lock, Plus, X} from 'lucide-react'
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
import {FormTabs, type FormTabItem} from '@/components/composite/form-tabs'
import {FormCard} from '@/components/composite/form-card'
import {DatePicker} from '@/components/composite/date-picker'
import {
    SubSectionHeader,
    SubSectionHeaderAction,
    SubSectionHeaderTitle,
} from '@/components/composite/sub-section-header'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '기업·기술정보 입력'}

const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#main', label: '본문 바로가기'},
    {href: '#company-form', label: '입력 폼 바로가기'},
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

const CONSENT_PATH = '/component-guide/self-diagnosis/customer-consent'

// 필수 표시 라벨 — 별표는 장식이라 aria-hidden, 스크린리더에는 "(필수)" 문구를 준다[5.3.1 · 7.4.1].
const FieldLabel = ({htmlFor, children, required}: {htmlFor: string; children: string; required?: boolean}) => (
    <Label htmlFor={htmlFor} className="text-foreground gap-1 font-bold">
        {children}
        {required ? (
            <>
                <span aria-hidden="true" className="text-error-500">
                    *
                </span>
                <span className="sr-only"> (필수)</span>
            </>
        ) : null}
    </Label>
)

// 라벨 + 입력 한 칸. helper 는 입력 아래 보조 안내(※ 문구)로 입력과 aria-describedby 로 연결한다[7.4.1].
const Field = ({
    id,
    label,
    required,
    helper,
    className,
    children,
}: {
    id: string
    label: string
    required?: boolean
    helper?: string
    className?: string
    children: ReactNode
}) => (
    <div className={className ? `flex flex-col gap-1.5 ${className}` : 'flex flex-col gap-1.5'}>
        <FieldLabel htmlFor={id} required={required}>
            {label}
        </FieldLabel>
        {children}
        {helper ? (
            <p id={`${id}-helper`} className="typo-caption-regular text-foreground-subtle">
                {helper}
            </p>
        ) : null}
    </div>
)

// 회원정보에서 자동 입력되는 값 — readOnly + 자물쇠 애드온(FormData 에는 그대로 포함된다).
const LockedField = ({
    id,
    label,
    value,
    required,
    autoComplete = 'off',
}: {
    id: string
    label: string
    value: string
    required?: boolean
    autoComplete?: string
}) => (
    <Field id={id} label={label} required={required}>
        <InputGroup>
            <InputGroupInput id={id} name={id} readOnly defaultValue={value} autoComplete={autoComplete} />
            <InputGroupAddon align="inline-end" className="text-foreground">
                <Lock aria-hidden="true" className="size-icon-md" />
            </InputGroupAddon>
        </InputGroup>
    </Field>
)

// 조회·검색 버튼이 붙는 입력 — 값은 버튼으로 채워지므로 입력 자체는 readOnly 다.
const LookupField = ({
    id,
    label,
    placeholder,
    action,
    className,
    helper,
}: {
    id: string
    label: string
    placeholder: string
    action: string
    className?: string
    helper?: string
}) => (
    <Field id={id} label={label} className={className} helper={helper}>
        <div className="flex items-start gap-2">
            <Input
                id={id}
                name={id}
                readOnly
                autoComplete="off"
                placeholder={placeholder}
                aria-describedby={helper ? `${id}-helper` : undefined}
                className="min-w-0 flex-1"
            />
            <Button variant="tertiary" size="lg" className="shrink-0">
                {action}
            </Button>
        </div>
    </Field>
)

// 2열 필드 그리드 — 시안의 리스트 영역(가로 486px 두 칸 + 24px 거터).
const FieldGrid = ({children}: {children: ReactNode}) => (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">{children}</div>
)

// 3열 필드 행 — 시안의 [동업종 여부 · 담당업무 · 최종직급] 처럼 한 줄에 세 칸이 오는 구성(316px × 3).
const FieldRow3 = ({children}: {children: ReactNode}) => (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">{children}</div>
)

// 카드 안내 문구 — FormCard 의 subtitle 은 <p> 라 리스트 대신 인라인 불릿으로 둔다[8.1.1].
const BulletNote = ({children}: {children: string}) => (
    <span className="flex">
        <ListMarker />
        <span>{children}</span>
    </span>
)

// 경력사항 반복 구획 — 번호가 붙는 하위 구획으로, 우측에 그 구획을 지우는 삭제 버튼이 온다.
const CareerSection = ({index}: {index: number}) => {
    const field = (name: string) => `career-${index}-${name}`

    return (
        <div className="flex flex-col gap-4">
            <SubSectionHeader>
                <SubSectionHeaderTitle>경력사항 {index}</SubSectionHeaderTitle>
                <SubSectionHeaderAction>
                    <Button variant="secondary" size="xs">
                        삭제
                        <X aria-hidden="true" />
                    </Button>
                </SubSectionHeaderAction>
            </SubSectionHeader>
            <FieldGrid>
                <Field id={field('start')} label="근무시작 년월">
                    <DatePicker id={field('start')} name={field('start')} placeholder="연도-월-일" />
                </Field>
                <Field id={field('end')} label="근무종료 년월">
                    <DatePicker id={field('end')} name={field('end')} placeholder="연도-월-일" />
                </Field>
                <Field id={field('company')} label="근무처">
                    <Input id={field('company')} name={field('company')} autoComplete="off" placeholder="근무처" />
                </Field>
                <Field id={field('industry')} label="업종">
                    <Input id={field('industry')} name={field('industry')} autoComplete="off" placeholder="업종" />
                </Field>
            </FieldGrid>
            <FieldRow3>
                <Field id={field('same-industry')} label="동업종 여부">
                    <Select name={field('same-industry')}>
                        <SelectTrigger id={field('same-industry')} className="w-full">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">동업종</SelectItem>
                            <SelectItem value="no">이업종</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <Field id={field('duty')} label="담당업무">
                    <Input id={field('duty')} name={field('duty')} autoComplete="off" placeholder="담당업무" />
                </Field>
                <Field id={field('rank')} label="최종직급">
                    <Input id={field('rank')} name={field('rank')} autoComplete="off" placeholder="최종직급" />
                </Field>
            </FieldRow3>
        </div>
    )
}

// 대표자 경력사항 탭 본문 — 시안 "대표자 경력사항" 카드 전체.
const CareerForm = () => (
    <FormCard
        title="대표자 경력사항"
        subtitle={
            <BulletNote>
                대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로 차례대로 입력해주십시오.
            </BulletNote>
        }
        action={
            <Button variant="secondary" size="md">
                입력도우미
            </Button>
        }
    >
        <div className="flex flex-col gap-10">
            <CareerSection index={1} />
            <Separator />
            <CareerSection index={2} />
            {/* 행추가 — 시안은 카드 폭 전체를 채우는 primary 버튼이다. */}
            <Button size="md" className="w-full">
                행추가
                <Plus aria-hidden="true" />
            </Button>
        </div>
    </FormCard>
)

// 기업정보 탭 본문 — 시안 "기업정보" 카드 전체.
const CompanyInfoForm = () => (
    <FormCard title="기업정보" subtitle="* 표시 항목은 필수 입력 항목입니다.">
        <div id="company-form" className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
                <FieldGrid>
                    <Field id="corp-type" label="기업형태" required>
                        <Select name="corpType" required>
                            <SelectTrigger id="corp-type" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="corp">주식회사</SelectItem>
                                <SelectItem value="llc">유한회사</SelectItem>
                                <SelectItem value="individual">개인사업자</SelectItem>
                                <SelectItem value="etc">기타</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <LockedField
                        id="corp-name"
                        label="기업명"
                        value="(주)테크놀로지"
                        required
                        autoComplete="organization"
                    />
                    <LockedField id="biz-no" label="사업자번호" value="123-45-67890" required />
                    <LockedField id="corp-no" label="법인번호" value="11222-1234567" />
                </FieldGrid>

                <Alert variant="solid" color="info">
                    <CircleCheck aria-hidden="true" />
                    <AlertDescription>
                        기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.
                    </AlertDescription>
                </Alert>

                <FieldGrid>
                    <Field id="found-date" label="설립일">
                        <DatePicker id="found-date" name="foundDate" placeholder="연도-월-일" />
                    </Field>
                    <Field id="ceo-name" label="대표자명">
                        {/* 회사 대표자 이름이라 사용자 본인 정보 자동완성 대상이 아니다. */}
                        <Input id="ceo-name" name="ceoName" placeholder="대표자명을 입력해주세요" autoComplete="off" />
                    </Field>
                    <Field id="company-tel" label="회사전화번호">
                        <Input
                            id="company-tel"
                            name="companyTel"
                            placeholder="02-1234-0000"
                            inputMode="tel"
                            autoComplete="off"
                        />
                    </Field>
                    <LookupField
                        id="industry-code"
                        label="업종코드"
                        placeholder="[조회] 버튼으로 자동 입력됩니다"
                        action="조회"
                    />
                    {/* 주소 — 검색 결과 입력과 상세주소가 한 라벨 아래 두 줄로 묶인다(시안 "input 2줄").
                        상세주소는 시안에 별도 라벨이 없어 aria-label 로 이름을 준다[7.4.1]. */}
                    <Field
                        id="address"
                        label="주소"
                        className="md:col-span-2"
                        helper="※ 도로명 건물번호를 모를 경우 도로명주소시스템에서 확인하시기 바랍니다."
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <Input
                                    id="address"
                                    name="address"
                                    readOnly
                                    autoComplete="off"
                                    placeholder="[주소 검색] 버튼으로 자동 입력됩니다."
                                    className="min-w-0 flex-1"
                                />
                                <Button variant="tertiary" size="lg" className="shrink-0">
                                    주소 검색
                                </Button>
                            </div>
                            <Input
                                name="addressDetail"
                                aria-label="상세주소"
                                placeholder="상세주소"
                                aria-describedby="address-helper"
                                autoComplete="off"
                            />
                        </div>
                    </Field>
                </FieldGrid>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
                <SubSectionHeader>
                    <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                </SubSectionHeader>
                <FieldGrid>
                    <Field id="manager-name" label="담당자명" required>
                        <Input
                            id="manager-name"
                            name="managerName"
                            placeholder="담당자명"
                            required
                            autoComplete="name"
                        />
                    </Field>
                    <Field id="manager-position" label="직위" required>
                        <Input
                            id="manager-position"
                            name="managerPosition"
                            placeholder="직위"
                            required
                            autoComplete="organization-title"
                        />
                    </Field>
                    <Field
                        id="manager-tel"
                        label="연락처"
                        required
                        helper="※ 서류안내, 현장실사 협의 등 평가 진행사항을 안내받을 담당자 정보(휴대폰)를 입력해 주십시오."
                    >
                        <Input
                            id="manager-tel"
                            name="managerTel"
                            placeholder="010-0000-0000"
                            inputMode="tel"
                            required
                            autoComplete="tel"
                            aria-describedby="manager-tel-helper"
                        />
                    </Field>
                    <Field id="manager-email" label="이메일" required>
                        <Input
                            id="manager-email"
                            name="managerEmail"
                            type="email"
                            placeholder="example@email.com"
                            autoComplete="email"
                            required
                        />
                    </Field>
                </FieldGrid>
            </div>
        </div>
    </FormCard>
)

// 아직 시안이 없는 탭 — 섹션 카드 골격만 두고 안내 문구를 넣는다.
const PlaceholderForm = ({title}: {title: string}) => (
    <FormCard title={title}>
        <p className="typo-body-xl-regular text-foreground-subtle">
            이 섹션의 입력 폼은 별도 시안으로 이어집니다. 탭 전환과 작성 상태 표시만 확인할 수 있습니다.
        </p>
    </FormCard>
)

// 탭 구성 — 제목·작성 상태는 시안 값 그대로다.
const FORM_TABS: readonly FormTabItem[] = [
    {value: 'company', title: '기업정보', status: 'writing', content: <CompanyInfoForm />},
    {value: 'ceo', title: '대표자 경력사항', status: 'done', content: <CareerForm />},
    {
        value: 'staff',
        title: '핵심 기술 인력 현황',
        status: 'todo',
        content: <PlaceholderForm title="핵심 기술 인력 현황" />,
    },
    {value: 'etc', title: '기업 기타 정보', status: 'writing', content: <PlaceholderForm title="기업 기타 정보" />},
    {value: 'rnd', title: '기술 개발 실적', status: 'done', content: <PlaceholderForm title="기술 개발 실적" />},
]

// 자가진단 2단계 목업 — Figma "[자가진단] 2단계_기업정보·기술정보 입력_기업정보".
// 1단계(고객 정보 활용 동의)의 "동의 후 인증서명" 버튼으로 진입한다. 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · StepHeader(progress) · FormTabs · FormCard · Select/Input/DatePicker ·
// Alert · SubSectionHeader · Separator · StepNavigation.
const CompanyInfoPage = () => (
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
                                <BreadcrumbPage>기업정보·기술정보 입력</BreadcrumbPage>
                                <ChevronRight aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <StepHeader
                variant="progress"
                title="기업·기술정보 입력"
                description="평가에 필요한 기업 및 기술 정보를 입력해주세요."
                steps={STEPS}
                current={2}
            />

            {/* 탭과 스텝 헤더 사이는 60px(시안) — main 의 gap-10(40) 에 20 을 더한다. */}
            <FormTabs items={FORM_TABS} className="mt-5" />
        </main>

        {/* 하단 CTA — 본문 끝에 그대로 붙는 블록이다. */}
        <StepNavigation
            prev={{asChild: true, children: <Link href={CONSENT_PATH}>이전</Link>}}
            next={{
                asChild: true,
                children: <Link href="/component-guide/self-diagnosis/checklist">다음</Link>,
            }}
        />
    </div>
)

export default CompanyInfoPage
