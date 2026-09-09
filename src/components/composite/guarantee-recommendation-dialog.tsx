'use client'

import {useState, type ReactNode} from 'react'
import {Field, FieldLabel, LookupField} from '@/components/composite/form-fields'
import {
    BusinessNumberInput,
    ClearableInput,
    FormValuesProvider,
    Input,
    RadioGroup,
    TelInput,
    useFormValues,
} from '@/components/composite/form-values'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import {BankBranchSearchDialog} from '@/components/composite/bank-branch-search-dialog'
import {TechEvaluationCenterDialog} from '@/components/composite/guarantee-search-dialogs'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {Field as BaseField, FieldDescription} from '@/components/ui/field'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'
import {RadioGroupItem} from '@/components/ui/radio-group'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {GUARANTEE_RECOMMENDATION_FIELD as FIELD} from '@/constants/evaluation-result'
import type {BankBranch} from '@/content/service/tech-evaluation-centers'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {cn} from '@/lib/utils'

// 보증추천 모달 — 기관 평가결과 조회 카드의 [보증추천] 이 연다(Figma "마이페이지_평가결과 조회_보증추천").
// 네 구획(기업정보 · 기업 담당자 · 보증추천 정보 · 은행담당자)을 한 폼에 담는다. 카드보다 내용이 길어
// 본문만 스크롤되는데, 그 처리는 Dialog 셸이 이미 한다(머리·CTA 고정 · 가운데 행만 스크롤).
//
// [프론트엔드 연동]
//   · 기업정보와 담당자 값은 그 평가 건에서 이미 아는 값이라 defaultValues 로 채워 넣는다.
//   · [보증 추천] 은 handleSubmit 에 신청 API 를 붙이고, [저장 후 닫기] 는 임시저장 API 를 붙인다.
//   · [지점 검색]·[검색] 세 곳은 아직 화면이 없어 버튼만 두었다 — 조회 모달이 생기면 업종코드·주소처럼
//     wrapAction 으로 감싸 고른 값을 setValue 로 넣으면 된다.

const FORM_ID = 'guarantee-recommendation-form'

const ADDRESS_HELPER = '※ 도로명 건물번호를 모를 경우 도로명주소시스템에서 확인하시기 바랍니다.'

// 현재 다른 보증기관 이용 여부 — 시안은 [부]·[여] 두 갈래다.
const OTHER_GUARANTEE_OPTIONS = [
    {value: 'no', label: '부'},
    {value: 'yes', label: '여'},
] as const

// 구획 — 소제목(20 Bold) 아래 칸들이 16 간격으로 선다(시안).
const Section = ({title, children}: {title: string; children: ReactNode}) => (
    <section className="flex flex-col gap-4">
        <h3 className="typo-title-l-bold text-foreground">{title}</h3>
        <div className="flex flex-col gap-4">{children}</div>
    </section>
)

// 업종코드 — 직접 적지 않고 [조회] 모달에서 고른 값만 채운다(마이페이지 내 정보와 같은 방식).
const IndustryCodeField = () => {
    const {setValue, clearFieldError} = useFormValues()

    return (
        <LookupField
            id={FIELD.industryCode}
            label="업종코드"
            placeholder="업종코드를 입력하세요"
            action="조회"
            readOnly
            wrapAction={(button) => (
                <IndustryCodeDialog
                    onSelect={({label}) => {
                        setValue(FIELD.industryCode, label)
                        clearFieldError(FIELD.industryCode)
                    }}
                >
                    {button}
                </IndustryCodeDialog>
            )}
        />
    )
}

// 사업장 주소 — 검색으로 채우는 칸과 상세주소가 한 라벨 아래 두 줄로 묶인다(시안 "input 2줄").
const AddressField = () => {
    const {setValue, clearFieldError} = useFormValues()

    return (
        <Field id={FIELD.address} label="사업장 주소" helper={ADDRESS_HELPER}>
            <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                    <Input
                        id={FIELD.address}
                        name={FIELD.address}
                        readOnly
                        autoComplete="off"
                        placeholder="주소를 검색하세요"
                        className="min-w-0 flex-1"
                    />
                    <PostcodeSearchDialog
                        mockSearch
                        title="주소 검색"
                        onSelect={({zonecode, roadAddress}) => {
                            setValue(FIELD.address, `(${zonecode}) ${roadAddress}`)
                            clearFieldError(FIELD.address)
                            document.getElementById(FIELD.addressDetail)?.focus()
                        }}
                    >
                        <Button type="button" variant="tertiary" size="md" className="shrink-0">
                            검색
                        </Button>
                    </PostcodeSearchDialog>
                </div>
                <ClearableInput
                    id={FIELD.addressDetail}
                    name={FIELD.addressDetail}
                    aria-label="상세주소"
                    placeholder="상세주소를 입력하세요"
                />
            </div>
        </Field>
    )
}

// 추천 영업점 — 직접 적지 않고 [지점 검색] 모달에서 고른 기술평가센터만 채운다.
const BranchField = () => {
    const {setValue, clearFieldError} = useFormValues()

    return (
        <LookupField
            id={FIELD.branch}
            label="추천 영업점"
            placeholder="지점을 검색해주세요"
            action="지점 검색"
            readOnly
            required
            wrapAction={(button) => (
                <TechEvaluationCenterDialog
                    onSelect={({label}) => {
                        setValue(FIELD.branch, label)
                        clearFieldError(FIELD.branch)
                    }}
                >
                    {button}
                </TechEvaluationCenterDialog>
            )}
        />
    )
}

// 대출희망 금액 — [운전자금]·[시설자금] 두 칸이다. 다른 칸(이름·연락처)과 같은 모양으로, 라벨이 위에
// 오고 입력이 아래에 온다. 금액이라 값은 오른쪽 정렬하고 단위는 상자 안 오른쪽에 둔다(시안 입력+유닛).
const LoanAmountField = ({id, label}: {id: string; label: string}) => (
    <Field id={id} label={label}>
        <InputGroup>
            <InputGroupInput
                id={id}
                name={id}
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                className="text-right"
            />
            <InputGroupAddon align="inline-end" className="text-foreground">
                백만원
            </InputGroupAddon>
        </InputGroup>
    </Field>
)

// 두 칸을 한 묶음으로 묶는 이름 — 라벨(label)로 두면 칸 하나에만 걸리므로 묶음 이름으로 둔다[7.4.1].
const LOAN_GROUP_LABEL_ID = 'guarantee-loan-amount-label'

const LoanAmountGroup = () => (
    <div role="group" aria-labelledby={LOAN_GROUP_LABEL_ID} className="flex flex-col gap-4">
        <span id={LOAN_GROUP_LABEL_ID} className="typo-body-xl-bold text-foreground">
            대출희망 금액(백만원)
        </span>
        <LoanAmountField id={FIELD.loanWorking} label="운전자금" />
        <LoanAmountField id={FIELD.loanFacility} label="시설자금" />
    </div>
)

// 현재 다른 보증기관 이용 여부 — 라디오 두 개가 한 줄에 선다(시안).
const OTHER_GUARANTEE_QUESTION_ID = `${FIELD.otherGuarantee}-question`

const OtherGuaranteeField = () => (
    <BaseField>
        {/* 물음은 보기 하나가 아니라 묶음 전체의 이름이다 — label 로 두고 첫 보기에 htmlFor 로 이으면
            그 보기의 이름이 "부" 가 아니라 물음 전체가 되고, 나머지 보기는 물음 없이 홀로 읽힌다.
            글자만 두고 묶음(radiogroup)에 aria-labelledby 로 잇는다[7.4.1] — 기관 고객정보활용동의의
            동의 여부 물음과 같은 방식이다. */}
        <p id={OTHER_GUARANTEE_QUESTION_ID} className="typo-body-xl-bold text-foreground flex w-fit items-center gap-1">
            현재 다른 보증기관 이용 여부
            <span aria-hidden="true" className="text-error-500">
                *
            </span>
            <span className="sr-only"> (필수)</span>
        </p>
        <RadioGroup
            name={FIELD.otherGuarantee}
            required
            aria-labelledby={OTHER_GUARANTEE_QUESTION_ID}
            className="flex w-fit flex-row gap-6"
        >
            {OTHER_GUARANTEE_OPTIONS.map((option) => (
                <BaseField key={option.value} orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                    <RadioGroupItem id={`${FIELD.otherGuarantee}-${option.value}`} value={option.value} />
                    <FieldLabel htmlFor={`${FIELD.otherGuarantee}-${option.value}`}>{option.label}</FieldLabel>
                </BaseField>
            ))}
        </RadioGroup>
    </BaseField>
)

const GUARANTEE_RECOMMENDATION_DONE_MESSAGE = '[보증추천] 처리가 완료되었습니다.'

type GuaranteeRecommendationCompleteDialogProps = {
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

// 보증추천 완료 — 위 모달에서 [보증 추천] 을 누르면 이어서 뜨고, 화면정의서의 하위 화면(단독 확인 화면)에서도
// 쓴다. 보증신청 완료 모달과 같은 구성이다 — 물음이 아니라 알림이라 닫기(X)를 두지 않고, 버튼은 [확인]
// 하나가 전체 폭을 쓴다. 화면에 보이는 알림 문구가 곧 이 대화상자의 이름이다(DialogTitle)[8.2.1].
const GuaranteeRecommendationCompleteDialog = ({
    defaultOpen,
    open,
    onOpenChange,
}: GuaranteeRecommendationCompleteDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {/* 다른 완료 알림과 카드 높이를 맞춘다(min-h-68). 알림 문구가 곧 제목이고 다른 본문이 없어
            aria-describedby 를 비운다 — 비우지 않으면 Radix 가 설명이 빠졌다고 경고한다. */}
        <DialogContent showCloseButton={false} className="min-h-68" aria-describedby={undefined}>
            <DialogHeader />
            <div className={cn(dialogBodyClassName, 'justify-center')}>
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {GUARANTEE_RECOMMENDATION_DONE_MESSAGE}
                </DialogTitle>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button size="xl" className="w-full">
                        확인
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

// 은행 · 영업점명 — 두 칸이 같은 [은행 영업점 조회] 모달을 연다. 영업점은 어느 은행의 것인지가 함께
// 정해지므로 고른 한 줄이 두 칸을 함께 채운다 — 어느 칸에서 열어도 결과는 같다.
const useBankBranchSelect = () => {
    const {setValue, clearFieldError} = useFormValues()

    return ({bankName, name}: BankBranch) => {
        setValue(FIELD.bankName, bankName)
        setValue(FIELD.bankBranch, name)
        clearFieldError(FIELD.bankName)
        clearFieldError(FIELD.bankBranch)
    }
}

// 시안은 두 칸을 한 줄에 두고 [검색] 버튼은 영업점명 쪽에만 둔다 — 어차피 한 모달에서 둘을 함께 고르므로
// 버튼이 둘일 이유가 없다. 칸 폭도 시안대로 은행 208 · 영업점명(입력+버튼) 나머지로 나눈다.
// 좁은 화면에서는 한 줄에 세 컨트롤이 들어가지 않아 위아래로 쌓는다.
const BankBranchFields = () => {
    const selectBranch = useBankBranchSelect()

    return (
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[--spacing(52)_1fr] sm:items-start">
            <Field id={FIELD.bankName} label="은행" required>
                <Input
                    id={FIELD.bankName}
                    name={FIELD.bankName}
                    readOnly
                    required
                    autoComplete="off"
                    placeholder="은행을 검색하세요"
                />
            </Field>
            <LookupField
                id={FIELD.bankBranch}
                label="영업점명"
                placeholder="영업점을 검색하세요"
                action="검색"
                readOnly
                required
                wrapAction={(button) => (
                    <BankBranchSearchDialog onSelect={selectBranch}>{button}</BankBranchSearchDialog>
                )}
            />
        </div>
    )
}

type GuaranteeRecommendationDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 이미 아는 값(그 평가 건의 기업·담당자 정보). 칸 이름은 아래 FIELD 를 쓴다. */
    defaultValues?: Record<string, string>
    /** 보증추천을 마쳤을 때 — 목록이 그 건의 버튼을 [보증이력] 으로 바꾼다. */
    onCompleted?: () => void
}

// 이 모달은 구획이 나뉘어 있어도 탭이 없다 — 공통 관문이 요구하는 이름만 채운다.
const FORM_SECTION = 'guarantee-recommendation'

// 본문 + CTA — 검사 관문(useFormTabsSubmit)은 FormValuesProvider 안에서만 쓸 수 있어 따로 둔다.
// 조각(본문·CTA)은 Dialog 셸의 grid 행이라 여기서 감싸지 않고 조각 그대로 돌려준다.
const GuaranteeRecommendationBody = ({onValid}: {onValid: () => void}) => {
    // 검사·메시지 표시·걸린 칸으로 이동까지 다른 폼 화면과 같은 관문이 맡는다 — 오류 문구의 말투가
    // 화면마다 달라지지 않는다("추천 영업점을 [지점 검색] 버튼으로 입력해 주세요.").
    const {handleSubmit} = useFormTabsSubmit({defaultTab: FORM_SECTION})

    // [프론트엔드 연동] 검사를 통과한 값이 온다 — 이 자리를 보증추천 API 호출로 바꾸고, 성공했을 때만
    // onValid 를 부른다(모달이 닫히고 완료 알림이 뜬다).
    const handleValid = (values: Record<string, string>) => {
        console.log('[보증추천] 신청', values)
        onValid()
    }

    return (
        <>
            {/* 구획 사이 40(시안). CTA 는 폼 바깥(CTA 구획)에 있어 form 속성으로 잇는다. */}
            <div className={cn(dialogBodyClassName, 'gap-10')}>
                <form
                    id={FORM_ID}
                    // 브라우저 기본 말풍선 대신 각 칸 밑에 문구를 띄운다 — 어느 칸을 어떻게 고칠지가
                    // 화면에 남는다[7.4.2].
                    noValidate
                    onSubmit={(event) => handleSubmit(event, handleValid)}
                    className="flex flex-col gap-10"
                >
                    <Section title="기업정보">
                        <Field id={FIELD.companyName} label="기업명" required>
                            <Input
                                id={FIELD.companyName}
                                name={FIELD.companyName}
                                readOnly
                                required
                                autoComplete="off"
                                placeholder="기업명"
                            />
                        </Field>
                        <Field id={FIELD.businessNumber} label="사업자번호" required>
                            <BusinessNumberInput
                                id={FIELD.businessNumber}
                                name={FIELD.businessNumber}
                                required
                                placeholder="사업자번호를 입력하세요"
                            />
                        </Field>
                        <IndustryCodeField />
                    </Section>

                    <Section title="기업 담당자">
                        <Field id={FIELD.managerName} label="이름" required>
                            <ClearableInput
                                id={FIELD.managerName}
                                name={FIELD.managerName}
                                required
                                placeholder="담당자 이름"
                            />
                        </Field>
                        <Field id={FIELD.managerTel} label="연락처" required>
                            <TelInput
                                id={FIELD.managerTel}
                                name={FIELD.managerTel}
                                required
                                placeholder="010-0000-0000"
                            />
                        </Field>
                        <Field id={FIELD.managerEmail} label="이메일">
                            <ClearableInput
                                id={FIELD.managerEmail}
                                name={FIELD.managerEmail}
                                type="email"
                                placeholder="example@company.com"
                            />
                        </Field>
                        <Field id={FIELD.managerPosition} label="직위">
                            <ClearableInput
                                id={FIELD.managerPosition}
                                name={FIELD.managerPosition}
                                placeholder="직위를 입력하세요"
                            />
                        </Field>
                        <AddressField />
                        <Field id={FIELD.companyTel} label="회사전화번호" required>
                            <TelInput
                                id={FIELD.companyTel}
                                name={FIELD.companyTel}
                                required
                                placeholder="02-0000-0000"
                            />
                        </Field>
                    </Section>

                    <Section title="보증추천 정보">
                        <BranchField />
                        <LoanAmountGroup />
                        <OtherGuaranteeField />
                    </Section>

                    <Section title="은행담당자">
                        <Field id={FIELD.bankManagerName} label="이름" required>
                            <ClearableInput
                                id={FIELD.bankManagerName}
                                name={FIELD.bankManagerName}
                                required
                                placeholder="담당자이름"
                            />
                        </Field>
                        <Field id={FIELD.bankManagerTel} label="연락처" required>
                            <TelInput
                                id={FIELD.bankManagerTel}
                                name={FIELD.bankManagerTel}
                                required
                                placeholder="010-0000-0000"
                            />
                        </Field>
                        <Field id={FIELD.bankManagerPosition} label="직위">
                            <ClearableInput
                                id={FIELD.bankManagerPosition}
                                name={FIELD.bankManagerPosition}
                                placeholder="직위를 입력하세요"
                            />
                        </Field>
                        <BankBranchFields />
                        {/* 시안이 구획 끝에 두는 안내 — 담당자 칸 전체에 걸리는 말이라 한 칸에 붙이지 않고
                            구획 아래에 한 줄로 둔다(기업정보의 같은 문구와 같은 타이포). */}
                        <FieldDescription>
                            ※ 서류안내, 현장실사 협의 등 평가 진행사항을 안내받을 담당자 정보(휴대폰)를 입력해 주십시오.
                        </FieldDescription>
                    </Section>
                </form>
            </div>
            <DialogFooter>
                {/* [프론트엔드 연동] 임시저장 API 를 붙이는 자리 — 지금은 닫기만 한다. */}
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        저장 후 닫기
                    </Button>
                </DialogClose>
                <Button type="submit" form={FORM_ID} size="xl">
                    보증 추천
                </Button>
            </DialogFooter>
        </>
    )
}

const GuaranteeRecommendationDialog = ({
    children,
    defaultOpen,
    defaultValues,
    onCompleted,
}: GuaranteeRecommendationDialogProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false)
    const [isCompleteOpen, setIsCompleteOpen] = useState(false)

    // 검사를 통과했을 때 — 모달을 닫고 완료 알림을 잇는다.
    const handleValid = () => {
        setIsOpen(false)
        setIsCompleteOpen(true)
        onCompleted?.()
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
                {/* 본문이 폼 칸의 나열이라 따로 설명 문단을 두지 않는다 — radix 에 설명 없음을 알린다. */}
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>보증추천</DialogTitle>
                    </DialogHeader>
                    <FormValuesProvider defaultValues={defaultValues}>
                        <GuaranteeRecommendationBody onValid={handleValid} />
                    </FormValuesProvider>
                </DialogContent>
            </Dialog>

            {/* [보증 추천] 을 누르면 이어서 뜨는 완료 알림 — 열림 상태만 이 컴포넌트가 쥔다. */}
            <GuaranteeRecommendationCompleteDialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen} />
        </>
    )
}

export {GUARANTEE_RECOMMENDATION_DONE_MESSAGE, GuaranteeRecommendationCompleteDialog, GuaranteeRecommendationDialog}
export type {GuaranteeRecommendationCompleteDialogProps, GuaranteeRecommendationDialogProps}
