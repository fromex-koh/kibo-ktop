import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {ChevronRight} from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {ConsentItem, ConsentList} from '@/components/composite/consent-list'
import {FormCard} from '@/components/composite/form-card'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'
import {StepHeader} from '@/components/composite/step-header'
import {StepNavigation} from '@/components/composite/step-navigation'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Field, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING, SELF_DIAGNOSIS_STEPS} from '@/constants/publishing-guide'
import {cn} from '@/lib/utils'

export const metadata: Metadata = {title: '고객 정보 활용 동의'}

const CORP_CONSENTS = [
    {name: 'corpCollect', title: '1. 수집·이용에 관한 사항', requirement: 'required'},
    {name: 'corpProvide', title: '2. 제공에 관한 사항', requirement: 'required'},
    {name: 'corpInquiry', title: '3. 조회에 관한 사항', requirement: 'required'},
    {name: 'corpTax', title: '4. 세무회계자료의 온라인 제출에 관한 사항', requirement: 'optional'},
] as const

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

// 시안 button_text — 16px(medium) · 글자 폭만 덮는 1px 밑줄 · 오른쪽 16px 화살표.
const DetailAction = () => (
    <Button variant="text-underline" size="md">
        내용보기
        <ChevronRight aria-hidden="true" />
    </Button>
)

const ConsentRadio = ({name, label}: {name: string; label: string}) => (
    // 동의·비동의 사이는 시안 40 이다.
    <RadioGroup name={name} aria-label={`${label} 동의 여부`} className="flex w-fit flex-row gap-10">
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

const ConsentCard = ({title, children}: {title: string; children: ReactNode}) => (
    <FormCard title={title}>
        <ConsentList>{children}</ConsentList>
    </FormCard>
)

const CorpKtrsFmCustomerConsentPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 아래 여백은 StepNavigation 이 갖는다(마지막 카드와 버튼 사이 40) — 여기서 더하면 두 번 벌어진다. */}
        <div className="content-layout flex flex-col gap-10 pt-10">
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
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>기술평가</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                {/* 시안의 마지막 뎁스는 제목(신속표준모형)이 아니라 모형 코드다. */}
                                <BreadcrumbPage>KTRS-FM</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <StepHeader
                title="고객 정보 활용 동의"
                description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해 주세요."
                steps={SELF_DIAGNOSIS_STEPS}
                current={1}
            />

            {/* 동의 범위는 아래 동의서 카드와 40 떨어진다(컨테이너 gap). 스텝 헤더와는 60 이라 mt-5 를 더한다. */}
            <SelectableCardGroup
                name="consentScope"
                defaultValue="required-only"
                aria-label="동의 범위 선택"
                className="mt-5 grid gap-4 md:grid-cols-2"
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

            {/* 두 동의서 카드끼리는 24 로 좁다(시안). */}
            <div className="flex flex-col gap-6">
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

            <div className="flex flex-col gap-6">
                <SelectableCard name="agreementUnderstood" value="yes" defaultChecked>
                    본인은 기술보증기금과 동의서를 작성함에 이 동의서의 중요한 내용에 대한 설명을 읽고 이해하였음을
                    확인합니다.
                </SelectableCard>
                <SelectableCard name="noticeEmail" value="yes">
                    본인은 회원정보(마이페이지)상 이메일정보를 확인하였으며, 해당 이메일로 정보 수집·이용·제공·조회 관련
                    『고객관리안내문』과 작성하신 동의서가 발송됨에 동의합니다.
                </SelectableCard>
            </div>

            <FormCard title="부분발송 이메일등록" subtitle="안내문을 추가로 받으실 이메일 주소를 입력해 주세요.">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
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
                            <SelectValue placeholder="선택해 주세요" />
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
        </div>

        <StepNavigation appearance="plain" prev={{children: '이전'}} next={{children: '동의 후 인증서명'}} />
    </main>
)

export default CorpKtrsFmCustomerConsentPage
