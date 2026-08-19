'use client'

import type {ReactNode} from 'react'
import Link from 'next/link'
import {DateField} from '@/components/composite/date-field'
import {
    Field,
    FieldGrid,
    FieldLabel,
    FieldRow3,
    LookupField,
    RequiredFieldsNotice,
} from '@/components/composite/form-fields'
import {FormCard} from '@/components/composite/form-card'
import {
    BusinessNumberInput,
    ClearableInput,
    CorporateNumberInput,
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
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import {SELECTED_INDUSTRY_CODE_FIELD} from '@/constants/technology-evaluation'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import {SubSectionHeader, SubSectionHeaderTitle} from '@/components/composite/sub-section-header'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Field as BaseField, FieldError} from '@/components/ui/field'
import {RadioGroupItem} from '@/components/ui/radio-group'
import {Separator} from '@/components/ui/separator'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {cn} from '@/lib/utils'

// 기관 개별평가 기업정보 탭 — Figma "[신속표준모형 KTRS-FM] 2단계_기업정보"(기관).
// 기업 화면(company-info-form)과 다른 점은 두 가지다.
//   · 기관은 평가 대상 기업의 정보를 직접 입력한다 — 기업명·사업자번호가 회원정보에서 잠겨 오지 않는다.
//   · 기업형태(개인·법인·기타)에 따라 보이는 칸이 달라진다 — 아래 [분기 규칙].
//
// [분기 규칙]
//   개인·기타: 기업형태 · 사업자번호 · 기업명 · 설립일 · 대표자명 · 회사전화번호 · 업종코드 · 주소
//   법인:      위 항목 + 기업명 표기(라디오) · 법인번호
// 기업형태를 고르기 전에는 공통 칸만 보여 준다 — 법인 전용 칸은 법인을 골랐을 때만 나타난다.
// 법인에서 다른 형태로 되돌리면 법인 전용 칸에 적은 값을 지운다. 화면에서 사라진 칸의 값이 그대로 제출되면
// 개인사업자인데 법인번호가 담기는 일이 생긴다.
//
// 줄 구성(카드 안쪽 폭 996, 칸 사이 24) — 법인일 때가 시안 실측 그대로이고, 나머지는 빈 칸이 생기지 않게
// 같은 2열에 이어서 흘린다.
//   법인      1줄 486+486  기업형태 · 기업명 표기
//             2줄 316×3    사업자번호 · 법인번호 · 기업명
//             3줄 486+486  설립일(개업일) · 대표자명
//             4줄 486+486  회사전화번호 · 업종코드
//   개인·기타  2열로 이어 흘린다 — 기업명 표기·법인번호가 빠진 자리를 뒤 칸이 당겨 채우고,
//             남는 한 칸은 마지막 줄 끝(업종코드 오른쪽)에 온다. 줄 중간이 비면 읽는 순서가 끊긴다.
//   공통      마지막 줄 996  주소(+상세주소)

const CORP_TYPE_FIELD = 'corpType'
const CORP_TYPE_CORPORATION = 'corporation'
const CORP_TYPES = [
    {value: 'individual', label: '개인'},
    {value: CORP_TYPE_CORPORATION, label: '법인'},
    {value: 'etc', label: '기타'},
] as const

const COMPANY_NAME_FIELD = 'companyName'
const COMPANY_NAME_MARK_FIELD = 'companyNameMark'
const CORP_NO_FIELD = 'corpNo'
const INDUSTRY_CODE_FIELD = 'industry-code'
const ADDRESS_FIELD = 'address'
const ADDRESS_DETAIL_FIELD = 'address-detail'

// 법인 전용 칸 — 개인·기타로 되돌릴 때 이 이름들의 값을 지운다.
const CORPORATION_ONLY_FIELDS = [COMPANY_NAME_MARK_FIELD, CORP_NO_FIELD] as const

// 기업명 표기 — 법인 접두어를 기업명 앞에 붙일지 뒤에 붙일지 고른다.
const COMPANY_NAME_MARKS = [
    {value: 'prefix', label: '앞'},
    {value: 'suffix', label: '뒤'},
] as const
const DEFAULT_COMPANY_NAME_MARK = COMPANY_NAME_MARKS[0].value
const CORPORATION_PREFIX = '(주)'
// 기업명을 아직 적지 않았을 때 미리보기에 대신 넣는 말.
const COMPANY_NAME_PLACEHOLDER = '기업명'

// 카드 상단 버튼. 시안 메모("버튼은 case별로 노출됨")대로 노출 조건은 연동 시 정해진다 —
// 지금은 두 버튼을 모두 보여 준다.
//
// [기업정보 관리] 는 화면 이동이 아니라 이 화면에서 처리하는 동작이라 <button> 이다 — 붙일 동작이
// 정해지기 전까지는 아무 일도 하지 않는다. [기업 자가진단 결과보기] 는 다른 화면으로 나가므로 링크다[NA-006].
const COMPANY_MANAGEMENT_LABEL = '기업정보 관리'
const SELF_DIAGNOSIS_RESULT_ACTION = {
    label: '기업 자가진단 결과보기',
    href: '/org/individual-evaluation/ktrs-fm/company-technology-info/self-diagnosis-result',
} as const

// 각 버튼이 언제 나오는지 — 화면만 봐서는 알 수 없어 버튼 아래에 그대로 적어 둔다.
const BUTTON_CASE_NOTES = [
    {label: COMPANY_MANAGEMENT_LABEL, when: '기업·기술정보 입력 > 기업정보 화면에서 노출'},
    {
        label: SELF_DIAGNOSIS_RESULT_ACTION.label,
        when: '평가진행방식 선택에서 [평가검증 하기] → 평가검증 신청 조회의 회사별 [평가검증 하기]로 들어왔을 때 노출',
    },
] as const

// 상세주소의 검사 메시지 — 주소 Field 안에 있지만 id 가 달라 Field 가 대신 그려 주지 못한다.
const AddressDetailError = () => {
    const message = useFieldError(ADDRESS_DETAIL_FIELD)

    return message ? <FieldError id={`${ADDRESS_DETAIL_FIELD}-error`}>{message}</FieldError> : null
}

// 고른 표기 위치대로 기업명이 어떻게 보이는지 알려 주는 미리보기 배지(시안 "(주)기업명").
//
// [제출값] 조합한 문자열은 담지 않는다 — 제출에는 원본 기업명(companyName)과 표기 위치(companyNameMark)가
// 따로 실리고, "(주)테크놀로지" 같은 완성형은 보여 주는 쪽에서 만든다. 접두어가 (유)·(재) 등으로 늘어나도
// 이미 저장된 값을 고칠 일이 없기 때문이다. 완성형 하나만 받는 API 로 붙일 때는 여기서 만드는 문자열을
// hidden 입력에 함께 실어 보낸다.
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
// 라벨은 첫 라디오를 가리켜, 라벨을 눌렀을 때 묶음의 첫 항목으로 들어가게 한다.
const CompanyNameMarkField = () => (
    <BaseField>
        <FieldLabel htmlFor={`${COMPANY_NAME_MARK_FIELD}-${DEFAULT_COMPANY_NAME_MARK}`} required>
            기업명 표기
        </FieldLabel>
        <div className="flex flex-wrap items-center gap-6">
            <RadioGroup
                name={COMPANY_NAME_MARK_FIELD}
                required
                aria-label="기업명 표기"
                // 기본 RadioGroup 은 세로 목록(w-full)이라, 시안의 가로 배치와 옆의 배지를 위해 폭을 내용만큼 줄인다.
                className="flex w-fit flex-row gap-6"
            >
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

// 사업자번호는 기관이 직접 적는 칸이라 형식을 함께 본다 — 입력하는 동안 3-2-5 로 하이픈이 붙고,
// 10자리를 못 채우면 제출 때 걸린다(BusinessNumberInput 이 pattern 과 안내 문구를 함께 들고 있다).
const BusinessNumberField = () => (
    <Field id="biz-no" label="사업자번호" required>
        <BusinessNumberInput id="biz-no" name="bizNo" placeholder="123-45-67890" required autoComplete="off" />
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

// 법인번호도 기관이 직접 적는 칸이라 사업자번호와 같은 처리를 한다 — 입력하는 동안 6-7 로 하이픈이 붙고,
// 13자리를 못 채우면 제출 때 걸린다(CorporateNumberInput 이 pattern 과 안내 문구를 함께 들고 있다).
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
    <Field id="company-tel" label="회사전화번호" required>
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

// 업종코드 — 기업 화면과 동일하게 직접 입력하지 않고 [조회] 모달에서 선택한 값만 채운다.
const IndustryCodeField = ({fullWidth = false}: {fullWidth?: boolean}) => {
    const {setValue, clearFieldError} = useFormValues()
    // 제출 값은 FormData 로 모으므로, 화면에 칸이 없는 업종코드는 숨은 입력으로 함께 실어 보낸다
    // (이 값이 다음 단계에서 제조·서비스 체크리스트를 가른다).
    const industryCode = useFieldValue(SELECTED_INDUSTRY_CODE_FIELD)?.value ?? ''
    // 모달에서 고른 업종을 입력 칸에 담는다. 값의 키와 칸의 id 가 같아 메시지도 같은 키로 거둔다.
    const handleSelect = ({code, label}: {code: string; label: string}) => {
        setValue(INDUSTRY_CODE_FIELD, label)
        setValue(SELECTED_INDUSTRY_CODE_FIELD, code)
        clearFieldError(INDUSTRY_CODE_FIELD)
    }

    return (
        <>
            <input type="hidden" name={SELECTED_INDUSTRY_CODE_FIELD} value={industryCode} />
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
        </>
    )
}

// 주소 — 검색 결과 입력과 상세주소가 한 라벨 아래 두 줄로 묶인다(시안 "input 2줄").
// 상세주소는 시안에 별도 라벨이 없어 aria-label 로 이름을 준다[7.4.1].
const AddressField = () => {
    const {setValue, clearFieldError} = useFormValues()
    // 고른 주소는 "(우편번호) 도로명주소" 로 한 칸에 담는다 — 시안의 주소 칸이 한 줄이다.
    // 주소를 채우고 나면 곧바로 상세주소를 쓰게 되므로 그 칸으로 포커스를 옮긴다.
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
                    {/* 실제 주소는 이 모달(Kakao 우편번호)에서 고른다 — 회원가입 흐름과 같은 모달이다. */}
                    <PostcodeSearchDialog mockSearch title="주소 검색" onSelect={handleSelect}>
                        <Button type="button" variant="tertiary" size="md" className="shrink-0">
                            주소 검색
                        </Button>
                    </PostcodeSearchDialog>
                </div>
                {/* 주소와 라벨을 공유하지만 값은 따로 담기는 칸이라, 검사 메시지도 이 자리에 따로 붙인다.
                    Field 는 자기 id(address) 의 메시지만 그리기 때문이다. */}
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

// 기업형태 — 이 값이 아래 칸 구성을 가른다(위 [분기 규칙]).
const CorpTypeField = () => {
    const {setValue} = useFormValues()
    // 법인을 고르면 기업명 표기의 기본값(앞)을 보관소에 넣는다 — 라디오 값이 보관소에서 오므로
    // defaultValue 로는 처음 선택이 잡히지 않는다(값이 비어 있으면 둘 다 안 골라진 상태로 보인다).
    // 개인·기타로 되돌리면 법인 전용 칸의 값을 비운다.
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

// trailing — 카드 마지막에 이어 붙는 구획. 기관 Tech-Index 기업정보 탭이 [기업 상세 정보] 구획을
// 이 자리에 넘긴다(넘기지 않으면 지금까지처럼 담당자 정보에서 끝난다).
//
// showManagerInfo·showSelfDiagnosisResult — 모형마다 다른 두 곳만 끈다. 기관 투자모형 시안에는
// [기업 담당자 정보] 구획과 [기업 자가진단 결과보기] 버튼이 없다(기업 투자모형 기업정보 탭에도
// 담당자 정보가 없는 것과 같다). 위쪽 칸 구성·기업형태 분기·주소는 세 모형이 모두 같아 그대로 쓴다.
const OrgCompanyInfoForm = ({
    trailing,
    showManagerInfo = true,
    showSelfDiagnosisResult = true,
}: {trailing?: ReactNode; showManagerInfo?: boolean; showSelfDiagnosisResult?: boolean} = {}) => {
    const corpType = useFieldValue(CORP_TYPE_FIELD)?.value ?? ''
    const isCorporation = corpType === CORP_TYPE_CORPORATION
    // 노출 조건 안내도 실제로 보이는 버튼만 남긴다 — 없는 버튼의 조건이 남으면 화면과 어긋난다.
    const visibleButtonNotes = showSelfDiagnosisResult
        ? BUTTON_CASE_NOTES
        : BUTTON_CASE_NOTES.filter((note) => note.label === COMPANY_MANAGEMENT_LABEL)

    return (
        <FormCard
            title="기업정보"
            subtitle={<RequiredFieldsNotice />}
            // 시안의 이 버튼들은 파란 외곽선(secondary) · 높이 40(small) 이고, 버튼 사이 간격은 제목↔버튼과
            // 같은 24 다 — FormCard 액션 슬롯의 기본 간격(16)보다 넓어 이 줄에서만 다시 묶는다.
            // 폭이 좁아지면 두 줄로 접히게 둔다 — 버튼 이름이 길어 한 줄에 밀어 넣으면 카드 밖으로 나간다.
            action={
                <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap items-center justify-end gap-6">
                        <Button type="button" variant="secondary" size="sm">
                            {COMPANY_MANAGEMENT_LABEL}
                        </Button>
                        {showSelfDiagnosisResult && (
                            <Button asChild variant="secondary" size="sm">
                                <Link href={SELF_DIAGNOSIS_RESULT_ACTION.href}>
                                    {SELF_DIAGNOSIS_RESULT_ACTION.label}
                                </Link>
                            </Button>
                        )}
                    </div>
                    {/* 시안 메모 "버튼은 case별로 노출됨" 을 화면에서 바로 읽을 수 있게 조건을 적어 둔다.
                        노출 조건이 실제로 붙으면 이 안내는 걷어낸다. */}
                    <ul className="flex list-none flex-col gap-1 text-right">
                        {visibleButtonNotes.map((note) => (
                            <li key={note.label} className="typo-body-l-regular text-foreground-subtle break-keep">
                                [{note.label}] {note.when}
                            </li>
                        ))}
                    </ul>
                </div>
            }
        >
            {/* id 는 화면의 "입력 폼 바로가기" 스킵 링크가 가리키는 자리다[6.4.1]. */}
            <div id="company-form" className="flex flex-col gap-10">
                {/* 줄 사이 간격은 칸 사이와 같은 24 다(시안). */}
                <div className="flex flex-col gap-6">
                    {isCorporation ? (
                        <>
                            <FieldGrid>
                                <CorpTypeField />
                                <CompanyNameMarkField />
                            </FieldGrid>
                            <FieldRow3>
                                <BusinessNumberField />
                                <CorpNoField />
                                <CompanyNameField />
                            </FieldRow3>
                            <FieldGrid>
                                <FoundDateField />
                                <CeoNameField />
                                <CompanyTelField />
                                <IndustryCodeField />
                            </FieldGrid>
                        </>
                    ) : (
                        // 법인 전용 두 칸이 빠진 만큼 뒤 칸이 당겨져 채워지고, 홀수로 남는 마지막 업종코드는
                        // 빈 절반 칸을 만들지 않도록 2열 전체를 사용한다.
                        <FieldGrid>
                            <CorpTypeField />
                            <BusinessNumberField />
                            <CompanyNameField />
                            <FoundDateField />
                            <CeoNameField />
                            <CompanyTelField />
                            <IndustryCodeField fullWidth />
                        </FieldGrid>
                    )}

                    <AddressField />
                </div>

                {showManagerInfo && (
                    <>
                        <Separator />

                        <div className="flex flex-col gap-4">
                            <SubSectionHeader>
                                <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                            </SubSectionHeader>
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
                        </div>
                    </>
                )}

                {trailing}
            </div>
        </FormCard>
    )
}

export default OrgCompanyInfoForm
