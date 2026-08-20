'use client'

import {useMemo, useRef, useState, type ReactNode} from 'react'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {DateField} from '@/components/composite/date-field'
import {EditCancelConfirmDialog} from '@/components/composite/edit-cancel-confirm-dialog'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {SaveConfirmDialog} from '@/components/composite/save-confirm-dialog'
import {Field, FieldGrid, FieldLabel, LookupField} from '@/components/composite/form-fields'
import {
    BusinessNumberInput,
    ClearableInput,
    CorporateNumberInput,
    FormValuesProvider,
    Input,
    RadioGroup,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    TelInput,
    useFieldError,
    useFieldValue,
    useFormValues,
} from '@/components/composite/form-values'
import {MypageFormCard} from '@/components/composite/mypage-form-card'
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Field as BaseField, FieldError} from '@/components/ui/field'
import {RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {
    ADDRESS_DETAIL_FIELD,
    ADDRESS_FIELD,
    COMPANY_NAME_FIELD,
    COMPANY_NAME_MARK_FIELD,
    COMPANY_NAME_MARKS,
    COMPANY_NAME_PLACEHOLDER,
    CORPORATION_ONLY_FIELDS,
    CORPORATION_PREFIX,
    CORP_NO_FIELD,
    CORP_TYPE_CORPORATION,
    CORP_TYPE_FIELD,
    CORP_TYPES,
    DEFAULT_COMPANY_NAME_MARK,
    INDUSTRY_CODE_FIELD,
} from '@/constants/mypage-profile'
import {cn} from '@/lib/utils'

// 마이페이지 내 정보 입력 묶음 — Figma "[마이페이지] 내 정보".
// 회원가입 때 받은 기업정보·담당자 정보를 이 화면에서 확인하고 고친다.
//
// 기업정보 칸은 기관 개별평가 2단계(org-company-info-form)와 겹치지만 화면이 다르다 — 카드가 없고,
// 줄 구성이 2열로만 흐르며(그쪽은 3열 줄이 하나 있다), 필수 표시도 다르다(아래 [필수]).
// 그래서 낮은 조각(Field·FieldGrid·각 Input)만 함께 쓰고 배치는 이 화면이 갖는다.
//
// [필수] 시안에서 * 가 없는 칸은 법인번호·기업명 표기 두 개지만, 법인번호는 평가 신청 흐름의
// 기업정보 탭과 같이 필수로 받는다(법인일 때만 나오는 칸이라 그때는 값이 있어야 한다).
// 기업명 표기는 기본값이 늘 잡혀 있어 비어 있을 수 없으므로 시안대로 * 를 두지 않는다.
//
// 줄 구성(콘텐츠 폭 792, 칸 사이 24 — 2열 384) — 법인일 때가 시안 실측이다.
//   법인      기업형태 · 기업명 표기 / 법인번호 · 기업명 / 사업자번호 · 설립일 / 대표자명 · 업종코드
//   개인·기타  법인 전용 두 칸이 빠진 자리를 뒤 칸이 당겨 채운다
//   공통      회사전화번호(전체 폭) · 주소(전체 폭, 상세주소 포함)

// 상세주소의 검사 메시지 — 주소 Field 안에 있지만 id 가 달라 Field 가 대신 그려 주지 못한다.
const AddressDetailError = () => {
    const message = useFieldError(ADDRESS_DETAIL_FIELD)

    return message ? <FieldError id={`${ADDRESS_DETAIL_FIELD}-error`}>{message}</FieldError> : null
}

// 고른 표기 위치대로 기업명이 어떻게 보이는지 알려 주는 미리보기 배지(시안 "(주)기업명").
// 제출에는 원본 기업명과 표기 위치가 따로 실린다 — 완성형은 보여 주는 쪽에서 만든다.
const CompanyNameMarkPreview = () => {
    const mark = useFieldValue(COMPANY_NAME_MARK_FIELD)?.value || DEFAULT_COMPANY_NAME_MARK
    const companyName = useFieldValue(COMPANY_NAME_FIELD)?.value || COMPANY_NAME_PLACEHOLDER

    return (
        <Badge variant="solid-pastel" color="info" shape="round">
            {mark === 'prefix' ? `${CORPORATION_PREFIX}${companyName}` : `${companyName}${CORPORATION_PREFIX}`}
        </Badge>
    )
}

// 기업명 표기 — 라디오 묶음의 이름은 개별 라디오 라벨(앞·뒤)이 아니라 그룹에 준다[7.4.1].
const CompanyNameMarkField = () => (
    <BaseField>
        <FieldLabel htmlFor={`${COMPANY_NAME_MARK_FIELD}-${DEFAULT_COMPANY_NAME_MARK}`}>기업명 표기</FieldLabel>
        <div className="flex flex-wrap items-center gap-6">
            <RadioGroup name={COMPANY_NAME_MARK_FIELD} aria-label="기업명 표기" className="flex w-fit flex-row gap-6">
                {COMPANY_NAME_MARKS.map((mark) => (
                    <BaseField key={mark.value} orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <RadioGroupItem id={`${COMPANY_NAME_MARK_FIELD}-${mark.value}`} value={mark.value} />
                        <FieldLabel htmlFor={`${COMPANY_NAME_MARK_FIELD}-${mark.value}`}>{mark.label}</FieldLabel>
                    </BaseField>
                ))}
            </RadioGroup>
            <CompanyNameMarkPreview />
        </div>
    </BaseField>
)

// 기업형태 — 이 값이 아래 칸 구성을 가른다.
const CorpTypeField = () => {
    const {setValue} = useFormValues()
    const handleChange = (value: string) => {
        if (value === CORP_TYPE_CORPORATION) {
            setValue(COMPANY_NAME_MARK_FIELD, DEFAULT_COMPANY_NAME_MARK)

            return
        }
        CORPORATION_ONLY_FIELDS.forEach((field) => setValue(field, ''))
    }

    return (
        <Field id={CORP_TYPE_FIELD} label="기업형태" required>
            <Select name={CORP_TYPE_FIELD} required onValueChange={handleChange}>
                <SelectTrigger id={CORP_TYPE_FIELD} className="w-full">
                    <SelectValue placeholder="선택해 주세요" />
                </SelectTrigger>
                <SelectContent>
                    {CORP_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                            {type.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    )
}

// 법인번호 — 형식은 입력하는 동안 6-7 로 맞춘다. 법인일 때만 나오는 칸이라 그때는 반드시 받는다.
const CorpNoField = () => (
    <Field id="corp-no" label="법인번호" required>
        <CorporateNumberInput
            id="corp-no"
            name={CORP_NO_FIELD}
            placeholder="110111-1234567"
            required
            autoComplete="off"
        />
    </Field>
)

const CompanyNameField = () => (
    <Field id="company-name" label="기업명" required>
        <ClearableInput
            id="company-name"
            name={COMPANY_NAME_FIELD}
            placeholder="기업명을 입력해 주세요"
            required
            autoComplete="organization"
        />
    </Field>
)

const BusinessNumberField = () => (
    <Field id="biz-no" label="사업자번호" required>
        <BusinessNumberInput id="biz-no" name="bizNo" placeholder="123-45-67890" required autoComplete="off" />
    </Field>
)

// 설립일은 지난 일이라 오늘 이후를 고를 수 없다 — 달력에서 막으므로 안내 문구는 두지 않는다.
const FoundDateField = () => <DateField id="found-date" name="foundDate" label="설립일(개업일)" required />

const CeoNameField = () => (
    <Field id="ceo-name" label="대표자명" required>
        {/* 회사 대표자 이름이라 사용자 본인 정보 자동완성 대상이 아니다. */}
        <ClearableInput
            id="ceo-name"
            name="ceoName"
            placeholder="대표자명을 입력해 주세요"
            required
            autoComplete="off"
        />
    </Field>
)

const CompanyTelField = () => (
    <Field id="company-tel" label="회사전화번호" required className="md:col-span-2">
        {/* 전화번호는 숫자만 받아 하이픈을 자동으로 넣는다 — 사람마다 다르게 적은 값이
            그대로 제출되면 뒤에서 다시 정리해야 한다. */}
        <TelInput
            id="company-tel"
            name="companyTel"
            placeholder="회사전화번호를 입력해 주세요"
            required
            autoComplete="off"
        />
    </Field>
)

// 업종코드 — 직접 입력하지 않고 [조회] 모달에서 고른 값만 채운다.
const IndustryCodeField = ({fullWidth = false}: {fullWidth?: boolean}) => {
    const {setValue, clearFieldError} = useFormValues()
    const handleSelect = ({label}: {code: string; label: string}) => {
        setValue(INDUSTRY_CODE_FIELD, label)
        clearFieldError(INDUSTRY_CODE_FIELD)
    }

    return (
        <LookupField
            id={INDUSTRY_CODE_FIELD}
            label="업종코드"
            placeholder="[조회] 버튼을 눌러 선택해 주세요"
            action="조회"
            readOnly
            required
            className={fullWidth ? 'md:col-span-2' : undefined}
            wrapAction={(button) => <IndustryCodeDialog onSelect={handleSelect}>{button}</IndustryCodeDialog>}
        />
    )
}

// 주소 — 검색 결과 입력과 상세주소가 한 라벨 아래 두 줄로 묶인다(시안 "input 2줄").
const AddressField = () => {
    const {setValue, clearFieldError} = useFormValues()
    const handleSelect = ({zonecode, roadAddress}: {zonecode: string; roadAddress: string}) => {
        setValue(ADDRESS_FIELD, `(${zonecode}) ${roadAddress}`)
        clearFieldError(ADDRESS_FIELD)
        document.getElementById(ADDRESS_DETAIL_FIELD)?.focus()
    }

    return (
        <Field
            id={ADDRESS_FIELD}
            label="주소"
            required
            className="md:col-span-2"
            helper="※ 도로명 건물번호를 모를 경우 도로명주소시스템에서 확인하시기 바랍니다."
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                    <Input
                        id={ADDRESS_FIELD}
                        name={ADDRESS_FIELD}
                        readOnly
                        required
                        autoComplete="off"
                        placeholder="[주소 검색] 버튼으로 자동 입력됩니다"
                        className="min-w-0 flex-1"
                    />
                    <PostcodeSearchDialog mockSearch title="주소 검색" onSelect={handleSelect}>
                        <Button type="button" variant="tertiary" size="md" className="shrink-0">
                            주소 검색
                        </Button>
                    </PostcodeSearchDialog>
                </div>
                {/* 주소와 라벨을 공유하지만 값은 따로 담기는 칸이라, 검사 메시지도 이 자리에 따로 붙인다. */}
                <ClearableInput
                    id={ADDRESS_DETAIL_FIELD}
                    name="addressDetail"
                    required
                    aria-label="상세주소"
                    placeholder="상세주소"
                    aria-describedby="address-helper"
                    autoComplete="off"
                />
                <AddressDetailError />
            </div>
        </Field>
    )
}

const CompanyInfoSection = () => {
    const corpType = useFieldValue(CORP_TYPE_FIELD)?.value ?? ''
    const isCorporation = corpType === CORP_TYPE_CORPORATION

    return (
        <MypageFormCard title="기업정보">
            <FieldGrid>
                <CorpTypeField />
                {isCorporation ? (
                    <>
                        <CompanyNameMarkField />
                        <CorpNoField />
                    </>
                ) : null}
                <CompanyNameField />
                <BusinessNumberField />
                <FoundDateField />
                <CeoNameField />
                <IndustryCodeField />
                <CompanyTelField />
                <AddressField />
            </FieldGrid>
        </MypageFormCard>
    )
}

const ManagerInfoSection = () => (
    <MypageFormCard title="기업 담당자 정보">
        <FieldGrid>
            <Field id="manager-name" label="이름" required>
                <ClearableInput
                    id="manager-name"
                    name="managerName"
                    placeholder="담당자명"
                    required
                    autoComplete="name"
                />
            </Field>
            <Field id="manager-position" label="직위" required>
                <ClearableInput
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
                <TelInput
                    id="manager-tel"
                    name="managerTel"
                    placeholder="담당자 연락처를 입력해 주세요"
                    required
                    autoComplete="tel"
                    aria-describedby="manager-tel-helper"
                />
            </Field>
            <Field id="manager-email" label="이메일" required>
                <ClearableInput
                    id="manager-email"
                    name="managerEmail"
                    type="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    required
                />
            </Field>
        </FieldGrid>
    </MypageFormCard>
)

// 화면에 들어올 때 꽂힌 값과 지금 값이 다른지 — [취소]·[저장] 이 함께 쓴다.
// 고쳤다가 되돌리면 다시 false 다.
const useIsDirty = () => {
    const {values, defaultValues} = useFormValues()

    return useMemo(
        () =>
            [...new Set([...Object.keys(defaultValues), ...Object.keys(values)])].some(
                (name) => (values[name] ?? '') !== (defaultValues[name] ?? ''),
            ),
        [values, defaultValues],
    )
}

// 저장 버튼 — 고친 것이 있으면 연다. 값이 규칙에 맞는지는 여기서 보지 않는다.
//
// 검사에 걸렸다고 버튼을 닫아 두면, 사용자는 무엇이 잘못됐는지 모른 채 눌리지 않는 버튼만 보게 된다
// (고장으로 읽힌다). 대신 눌렀을 때 검사해서 걸린 칸에 문구를 띄우고 그 칸으로 데려간다 —
// 무엇을 고쳐야 하는지가 화면에 남는다[7.4.2].
const SaveButton = () => {
    const isDirty = useIsDirty()

    return (
        <Button type="submit" size="xl" disabled={!isDirty}>
            저장
        </Button>
    )
}

// 취소 버튼 — 고치던 내용을 화면에 들어올 때의 값으로 되돌린다(화면을 떠나지 않는다).
// 되돌리면 되살릴 방법이 없어 확인 모달을 한 번 거친다.
const CancelButton = () => {
    const {values, defaultValues, setValue, setFieldErrors} = useFormValues()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    // 되돌릴 것이 없으면 열지 않는다 — 바뀐 게 없는데 "변경한 내용은 저장되지 않습니다" 를 묻게 된다.
    const isDirty = useIsDirty()

    const handleConfirm = () => {
        // 지금 값과 처음 값의 이름을 모두 훑는다 — 처음에 없던 칸(사용자가 새로 채운 칸)도 비워야 한다.
        new Set([...Object.keys(defaultValues), ...Object.keys(values)]).forEach((name) =>
            setValue(name, defaultValues[name] ?? ''),
        )
        // 되돌린 값에는 더 이상 맞지 않는 검사 메시지도 함께 거둔다.
        setFieldErrors({})
        setIsConfirmOpen(false)
    }

    return (
        <EditCancelConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onConfirm={handleConfirm}>
            <Button type="button" variant="tertiary" size="xl" disabled={!isDirty}>
                취소
            </Button>
        </EditCancelConfirmDialog>
    )
}

// defaultValues — 화면(page)이 회원정보를 읽어 내려 준다. 폼은 값의 출처를 알지 않는다.
// 이 폼은 탭이 없어 섹션이 하나다 — 공통 관문이 요구하는 이름만 채운다.
const PROFILE_SECTION = 'profile'

// 검사와 제출 — 탭 폼이 쓰는 공통 관문을 그대로 쓴다. 걸린 칸에 문구를 띄우고 그 칸으로 옮겨 주는
// 일까지 그쪽이 맡아, 오류 문구의 말투가 다른 화면과 같아진다(라벨을 넣은 "…을 입력해 주세요.").
// 이 화면은 탭이 없어 섹션 전환은 일어나지 않는다.
const ProfileFormBody = ({children}: {children: ReactNode}) => {
    const {handleSubmit} = useFormTabsSubmit({defaultTab: PROFILE_SECTION})
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    // 검사를 통과한 값 — 모달에서 [저장] 을 누를 때까지 들고 있는다. 화면을 다시 그리게 할 값이
    // 아니라서 상태가 아니라 ref 다.
    const submittedValues = useRef<Record<string, string>>({})

    // 검사에 걸리면 handleSubmit 이 각 칸에 문구를 띄우고 이 콜백을 부르지 않는다 —
    // 모달은 통과했을 때만 열린다.
    const handleValid = (values: Record<string, string>) => {
        submittedValues.current = values
        setIsConfirmOpen(true)
    }

    const handleSave = () => {
        // [프론트엔드 연동][저장] 회원정보 수정 API 는 이 자리에서 호출한다.
        console.log('[프론트엔드 연동][저장] 마이페이지 내 정보', submittedValues.current)
        setIsConfirmOpen(false)
    }

    return (
        // id 는 화면의 "입력 폼 바로가기" 스킵 링크가 가리키는 자리다[6.4.1].
        <form
            id="profile-form"
            noValidate
            onSubmit={(event) => handleSubmit(event, handleValid)}
            className="flex flex-col"
        >
            {children}
            <SaveConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onSave={handleSave} />
        </form>
    )
}

const MypageProfileForm = ({defaultValues}: {defaultValues: Record<string, string>}) => (
    <FormValuesProvider defaultValues={defaultValues}>
        <ProfileFormBody>
            {/* 구획 사이 60 — 시안 실측. */}
            <div className="flex flex-col gap-15">
                <CompanyInfoSection />
                <ManagerInfoSection />
            </div>

            {/* 시안: 마지막 칸과 CTA 사이 100(=구획 간격 60 + 40), 버튼 짝은 16 간격이다. */}
            <ActionBar className="mt-25">
                <ActionBarCenter className="gap-4">
                    <CancelButton />
                    <SaveButton />
                </ActionBarCenter>
            </ActionBar>
        </ProfileFormBody>
    </FormValuesProvider>
)

export default MypageProfileForm
