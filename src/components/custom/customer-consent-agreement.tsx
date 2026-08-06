'use client'

import {createContext, useContext, useRef, useState, type ReactNode} from 'react'
import {ConsentItem, ConsentList} from '@/components/composite/consent-list'
import {ConsentTermsDetailButton} from '@/components/composite/consent-terms-detail-button'
import {ConsentTermsDialogContent, OptionalConsentTermsDialogContent} from '@/components/composite/consent-terms-dialog'
import {FormCard} from '@/components/composite/form-card'
import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'
import {StepNavigation} from '@/components/composite/step-navigation'
import {Badge} from '@/components/ui/badge'
import {Dialog} from '@/components/ui/dialog'
import {Field, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {cn} from '@/lib/utils'

// 동의 범위·항목별 응답·동의 모달 단계를 관리하는 Client Component.
// 범위 선택 후 필수 동의, 전체 동의 시 선택 동의까지 완료해야 항목을 확정한다.

// termsId는 항목별 내용보기 모달의 약관 원문을 연결한다.
const CORP_CONSENTS = [
    {name: 'corpCollect', title: '1. 수집·이용에 관한 사항', requirement: 'required', termsId: 'corp-collect'},
    {name: 'corpProvide', title: '2. 제공에 관한 사항', requirement: 'required', termsId: 'corp-provide'},
    {name: 'corpInquiry', title: '3. 조회에 관한 사항', requirement: 'required', termsId: 'corp-inquiry'},
    {name: 'corpTax', title: '4. 세무회계자료의 온라인 제출에 관한 사항', requirement: 'optional', termsId: 'corp-tax'},
] as const

const PERSONAL_CONSENTS = [
    {
        name: 'personalCollect',
        title: '1. 수집·이용에 관한 사항',
        description: '위 고유식별정보 수집·이용에 동의하십니까?',
        termsId: 'personal-collect',
    },
    {
        name: 'personalProvide',
        title: '2. 제공에 관한 사항',
        description: '위 고유식별정보 제공에 동의하십니까? (단, ①②⑤에 한함)',
        termsId: 'personal-provide',
    },
    {
        name: 'personalInquiry',
        title: '3. 조회에 관한 사항',
        description: '위 고유식별정보 조회에 동의하십니까?',
        termsId: 'personal-inquiry',
    },
] as const

// 동의 범위 — 필수 항목만 또는 선택 항목까지 동의한다.
const REQUIRED_ONLY_SCOPE = 'required-only'
const ALL_SCOPE = 'all'

const REQUIRED_CONSENT_NAMES = [
    ...CORP_CONSENTS.filter((consent) => consent.requirement === 'required').map((consent) => consent.name),
    ...PERSONAL_CONSENTS.map((consent) => consent.name),
]
const OPTIONAL_CONSENT_NAMES = CORP_CONSENTS.filter((consent) => consent.requirement === 'optional').map(
    (consent) => consent.name,
)
const ALL_CONSENT_NAMES = [...REQUIRED_CONSENT_NAMES, ...OPTIONAL_CONSENT_NAMES]

const AGREE = 'agree'
const DISAGREE = 'disagree'

// 동의서 하단 확인 항목. 범위 동의를 완료하면 함께 체크된다.
const CONFIRMATIONS = [
    {
        name: 'agreementUnderstood',
        label: '본인은 기술보증기금과 동의서를 작성함에 이 동의서의 중요한 내용에 대한 설명을 읽고 이해하였음을 확인합니다.',
    },
    {
        name: 'noticeEmail',
        label: '본인은 회원정보(마이페이지)상 이메일정보를 확인하였으며, 해당 이메일로 정보 수집·이용·제공·조회 관련 『고객관리안내문』과 작성하신 동의서가 발송됨에 동의합니다.',
    },
] as const

type ConsentAnswers = Record<string, string>

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

const ConsentRadio = ({
    name,
    label,
    value,
    onValueChange,
}: {
    name: string
    label: string
    value?: string
    onValueChange: (value: string) => void
}) => (
    <RadioGroup
        name={name}
        aria-label={`${label} 동의 여부`}
        value={value ?? ''}
        onValueChange={onValueChange}
        className="flex w-fit flex-row gap-10"
    >
        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
            <RadioGroupItem value={AGREE} id={`${name}-agree`} aria-labelledby={`${name}-agree-label`} />
            <FieldLabel id={`${name}-agree-label`} htmlFor={`${name}-agree`}>
                동의
            </FieldLabel>
        </Field>
        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
            <RadioGroupItem value={DISAGREE} id={`${name}-disagree`} aria-labelledby={`${name}-disagree-label`} />
            <FieldLabel id={`${name}-disagree-label`} htmlFor={`${name}-disagree`}>
                비동의
            </FieldLabel>
        </Field>
    </RadioGroup>
)

const ConsentCard = ({title, children}: {title: string; children: React.ReactNode}) => (
    <FormCard title={title}>
        <ConsentList>{children}</ConsentList>
    </FormCard>
)

// 동의 범위를 선택하지 않은 초기 상태.
const NO_SCOPE = ''

// 동의 모달 단계. 전체 동의는 필수 → 선택 순서로 진행한다.
const REQUIRED_STEP = 'required'
const OPTIONAL_STEP = 'optional'
type TermsStep = typeof REQUIRED_STEP | typeof OPTIONAL_STEP

// 동의서와 하단 CTA가 공유하는 상태.
type CustomerConsentContextValue = {
    scope: string
    requestScope: (scope: string) => void
    answers: ConsentAnswers
    setAnswer: (name: string, value: string) => void
    confirmations: Record<string, boolean>
    setConfirmation: (name: string, checked: boolean) => void
    termsStep: TermsStep | null
    isAllScopePending: boolean
    handleRequiredAgree: () => void
    handleOptionalAgree: () => void
    handleDecline: () => void
    handleTermsOpenChange: (open: boolean) => void
    // 필수 항목과 하단 확인 항목을 모두 동의했는지 여부.
    isComplete: boolean
}

const CustomerConsentContext = createContext<CustomerConsentContextValue | null>(null)

const useCustomerConsent = () => {
    const value = useContext(CustomerConsentContext)
    if (!value) throw new Error('CustomerConsentProvider 안에서만 사용할 수 있습니다.')
    return value
}

const CustomerConsentProvider = ({children}: {children: ReactNode}) => {
    // 동의 범위는 사용자가 모달에서 동의하기 전까지 선택하지 않는다.
    const [scope, setScope] = useState<string>(NO_SCOPE)
    // pendingScope는 모달에서 확인 중인 범위이며, termsStep이 모달 단계를 나타낸다.
    const [pendingScope, setPendingScope] = useState<string | null>(null)
    const [termsStep, setTermsStep] = useState<TermsStep | null>(null)
    // 모달을 동의로 닫았는지 확인해 일반 닫기와 구분한다.
    const hasAgreedRef = useRef(false)
    const [answers, setAnswers] = useState<ConsentAnswers>({})
    // 하단 확인 항목의 체크 상태.
    const [confirmations, setConfirmations] = useState<Record<string, boolean>>({})

    // 범위 선택 시 필수 동의 모달을 연다.
    const requestScope = (nextScope: string) => {
        setPendingScope(nextScope)
        setTermsStep(REQUIRED_STEP)
    }

    const setAnswer = (name: string, value: string) => setAnswers((prev) => ({...prev, [name]: value}))

    // 모달 동의가 완료된 범위를 항목과 확인 체크에 반영한다.
    const applyScope = (nextScope: string) => {
        const isAllScope = nextScope === ALL_SCOPE
        setAnswers((prev) => ({
            ...prev,
            ...Object.fromEntries(REQUIRED_CONSENT_NAMES.map((name) => [name, AGREE])),
            ...Object.fromEntries(OPTIONAL_CONSENT_NAMES.map((name) => [name, isAllScope ? AGREE : ''])),
        }))
        setConfirmations(Object.fromEntries(CONFIRMATIONS.map((confirmation) => [confirmation.name, true])))
        setScope(nextScope)
    }

    // 필수 동의 완료. 전체 동의는 선택 동의 모달로 이어진다.
    const handleRequiredAgree = () => {
        if (pendingScope === ALL_SCOPE) {
            setTermsStep(OPTIONAL_STEP)
            return
        }
        hasAgreedRef.current = true
        if (pendingScope) applyScope(pendingScope)
    }

    // 동의 거부 시 모든 항목을 비동의로 처리하고 확인 항목을 해제한다.
    const handleDecline = () => {
        setAnswers(Object.fromEntries(ALL_CONSENT_NAMES.map((name) => [name, DISAGREE])))
        setConfirmations({})
    }

    // 선택 동의 완료 후 전체 항목을 확정한다.
    const handleOptionalAgree = () => {
        hasAgreedRef.current = true
        applyScope(ALL_SCOPE)
    }

    // 동의하지 않고 모달을 닫으면 범위와 진행 단계를 초기화한다.
    const handleTermsOpenChange = (open: boolean) => {
        if (open) return
        if (!hasAgreedRef.current) setScope(NO_SCOPE)
        hasAgreedRef.current = false
        setPendingScope(null)
        setTermsStep(null)
    }

    const setConfirmation = (name: string, checked: boolean) => setConfirmations((prev) => ({...prev, [name]: checked}))

    const isComplete =
        REQUIRED_CONSENT_NAMES.every((name) => answers[name] === AGREE) &&
        CONFIRMATIONS.every((confirmation) => confirmations[confirmation.name])

    return (
        <CustomerConsentContext.Provider
            value={{
                scope,
                requestScope,
                answers,
                setAnswer,
                confirmations,
                setConfirmation,
                termsStep,
                isAllScopePending: pendingScope === ALL_SCOPE,
                handleRequiredAgree,
                handleOptionalAgree,
                handleDecline,
                handleTermsOpenChange,
                isComplete,
            }}
        >
            {children}
        </CustomerConsentContext.Provider>
    )
}

const CustomerConsentAgreement = () => {
    const {
        scope,
        requestScope,
        answers,
        setAnswer,
        confirmations,
        setConfirmation,
        termsStep,
        isAllScopePending,
        handleRequiredAgree,
        handleOptionalAgree,
        handleDecline,
        handleTermsOpenChange,
    } = useCustomerConsent()

    return (
        <div className="flex flex-col gap-10">
            <SelectableCardGroup
                name="consentScope"
                value={scope}
                onValueChange={requestScope}
                aria-label="동의 범위 선택"
                className="mt-5 grid gap-4 md:grid-cols-2"
            >
                {/* 이미 선택된 카드를 다시 눌러도 동의 모달을 열 수 있도록 onClick을 함께 처리한다. */}
                <SelectableCard
                    control="radio"
                    value={REQUIRED_ONLY_SCOPE}
                    onClick={() => requestScope(REQUIRED_ONLY_SCOPE)}
                    badges={<RequirementBadge requirement="required" />}
                >
                    필수항목만 동의
                </SelectableCard>
                <SelectableCard
                    control="radio"
                    value={ALL_SCOPE}
                    onClick={() => requestScope(ALL_SCOPE)}
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

            <div className="flex flex-col gap-6">
                <ConsentCard title="[기업] 정보 수집·이용·제공·조회 동의서">
                    {CORP_CONSENTS.map((consent) => (
                        <ConsentItem
                            key={consent.name}
                            requirement={consent.requirement}
                            title={consent.title}
                            action={
                                <ConsentTermsDetailButton
                                    termsId={consent.termsId}
                                    label={`[기업] ${consent.title}`}
                                    headingNumber={Number.parseInt(consent.title, 10)}
                                    onAgree={() => setAnswer(consent.name, AGREE)}
                                    onDecline={() => setAnswer(consent.name, DISAGREE)}
                                />
                            }
                            control={
                                <ConsentRadio
                                    name={consent.name}
                                    label={`[기업] ${consent.title}`}
                                    value={answers[consent.name]}
                                    onValueChange={(value) => setAnswer(consent.name, value)}
                                />
                            }
                        />
                    ))}
                </ConsentCard>

                <ConsentCard title="[개인] 정보 수집·이용·제공·조회 동의서">
                    {PERSONAL_CONSENTS.map((consent) => (
                        <ConsentItem
                            key={consent.name}
                            title={consent.title}
                            description={consent.description}
                            action={
                                <ConsentTermsDetailButton
                                    termsId={consent.termsId}
                                    label={`[개인] ${consent.title}`}
                                    headingNumber={Number.parseInt(consent.title, 10)}
                                    onAgree={() => setAnswer(consent.name, AGREE)}
                                    onDecline={() => setAnswer(consent.name, DISAGREE)}
                                />
                            }
                            control={
                                <ConsentRadio
                                    name={consent.name}
                                    label={`[개인] ${consent.title}`}
                                    value={answers[consent.name]}
                                    onValueChange={(value) => setAnswer(consent.name, value)}
                                />
                            }
                        />
                    ))}
                </ConsentCard>
            </div>

            {/* 사용자가 직접 체크하거나 동의 범위 완료 시 체크된다. */}
            <div className="flex flex-col gap-6">
                {CONFIRMATIONS.map((confirmation) => (
                    <SelectableCard
                        key={confirmation.name}
                        name={confirmation.name}
                        value="yes"
                        checked={Boolean(confirmations[confirmation.name])}
                        onCheckedChange={(checked) => setConfirmation(confirmation.name, checked)}
                    >
                        {confirmation.label}
                    </SelectableCard>
                ))}
            </div>

            {/* 전체 동의는 하나의 Dialog에서 필수 → 선택 단계로 이어진다. */}
            <Dialog open={termsStep !== null} onOpenChange={handleTermsOpenChange}>
                {termsStep === OPTIONAL_STEP ? (
                    <OptionalConsentTermsDialogContent onAgree={handleOptionalAgree} onDecline={handleDecline} />
                ) : (
                    <ConsentTermsDialogContent
                        onAgree={handleRequiredAgree}
                        onDecline={handleDecline}
                        closeOnAgree={!isAllScopePending}
                    />
                )}
            </Dialog>
        </div>
    )
}

// 필수 항목과 확인 항목을 모두 동의한 경우에만 다음 단계로 이동할 수 있다.
const CustomerConsentStepNavigation = () => {
    const {isComplete} = useCustomerConsent()

    return (
        <StepNavigation
            appearance="plain"
            prev={{children: '이전'}}
            next={{children: '동의 후 인증서명', disabled: !isComplete}}
        />
    )
}

export {CustomerConsentAgreement, CustomerConsentProvider, CustomerConsentStepNavigation}
