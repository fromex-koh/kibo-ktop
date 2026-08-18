'use client'

import {CircleCheck} from 'lucide-react'
import type {ReactNode} from 'react'
import {DateField} from '@/components/composite/date-field'
import {Field, FieldGrid, LockedField, LookupField, RequiredFieldsNotice} from '@/components/composite/form-fields'
import {FormCard} from '@/components/composite/form-card'
import {
    ClearableInput,
    Input,
    RadioGroup,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    TelInput,
    useFieldError,
    useFormValues,
} from '@/components/composite/form-values'
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import {TechnologyCategoryDialog} from '@/components/composite/technology-category-dialog'
import {SubSectionHeader, SubSectionHeaderTitle} from '@/components/composite/sub-section-header'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {FieldError} from '@/components/ui/field'
import {Label} from '@/components/ui/label'
import {RadioGroupItem} from '@/components/ui/radio-group'
import {Separator} from '@/components/ui/separator'
import {cn} from '@/lib/utils'

// Tech-Index 일반용 기업정보 탭 본문 — Figma "[혁신성장지수 (일반) Tech-Index] 2단계_기업정보".
// KTRS-FM 의 기업정보 탭(company-info-form)과 앞 두 구획(기업정보 · 기업 담당자 정보)은 같은 구성이지만
// 아래 두 가지가 달라 별도 파일로 둔다 — 공용 폼에 분기를 넣으면 두 모형의 시안이 바뀔 때마다 서로를 건드린다.
//   · 필수 항목이 다르다: 설립일·대표자명·회사전화번호·주소가 이 모형에서는 선택이다.
//   · [기업 상세 정보] 구획이 통째로 더 있다(기업규모 · 상장구분 · 산업분야 코드 · 기업형태 · 기술분류 ·
//     대표기술 · 대표기술제품).
//
// [분기 규칙] 기관 개별평가 기업정보(org-company-info-form)와 같은 방식으로, 기업형태가 아래 칸 구성을 가른다.
//   개인·기타: 기업형태 · 기업명 · 사업자번호 + 설립일 · 대표자명 · 회사전화번호 · 업종코드 · 주소
//   법인:      위 항목 + 법인번호
// 기업형태를 고르기 전에는 공통 칸만 보여 준다 — 법인 전용 칸은 법인을 골랐을 때만 나타난다.
// 기관 화면과 달리 법인 전용 칸의 값을 따로 지우지 않는다 — 여기서는 회원정보에서 잠겨 오는 읽기 전용 값이라
// 사용자가 적은 내용이 없고, 칸이 사라지면 입력 자체가 문서에서 빠져 제출에도 담기지 않는다.

const CORP_TYPE_FIELD = 'corpType'
const CORP_TYPE_CORPORATION = '법인'

// 마이페이지(회원정보)에서 그대로 받아 오는 값 — 읽기 전용으로 보여 주기만 한다.
// 아래 value 는 목업이다. 연동할 때 마이페이지 응답으로 바꾸면 된다.
//
// 기업형태도 로그인한 기업 회원의 정보라 여기서 함께 잠근다 — 고르는 값이 아니라 받아 오는 값이다.
// (기관 개별평가는 평가 대상 기업을 직접 입력하므로 그쪽만 셀렉트로 고른다.)
const MEMBER_COMMON_FIELDS = [
    {id: CORP_TYPE_FIELD, label: '기업형태', value: CORP_TYPE_CORPORATION, required: true},
    {id: 'corp-name', label: '기업명', value: '(주)테크놀로지', required: true, autoComplete: 'organization'},
    {id: 'biz-no', label: '사업자번호', value: '123-45-67890', required: true},
] as const

// 법인 전용 — 법인이 아닌 기업은 이 값 자체가 없어 칸을 아예 두지 않는다.
// 노출될 때는 법인의 필수 정보라 다른 잠긴 칸과 같이 필수로 표시한다.
// [미노출 규칙] 법인이어도 마이페이지에 값이 없으면 빈 칸으로 남기지 않고 아예 빼며(아래 filter),
// 위쪽 안내 문구도 실제로 노출된 항목만 나열한다.
const MEMBER_CORPORATION_FIELDS = [{id: 'corp-no', label: '법인번호', value: '11222-1234567', required: true}] as const

const INDUSTRY_CODE_FIELD = 'industry-code'
const ADDRESS_FIELD = 'address'
const ADDRESS_DETAIL_FIELD = 'address-detail'
const TECH_CATEGORY_FIELD = 'tech-category'

// 시안 값 그대로. 값(value)은 화면에 보이지 않는 제출용 키라 영문 소문자로 둔다.
const COMPANY_SIZE_OPTIONS = [
    {value: 'over-sme', label: '중소기업기준초과'},
    {value: 'medium', label: '중기업'},
    {value: 'small', label: '소기업'},
] as const

const LISTING_OPTIONS = [
    {value: 'none', label: '해당없음'},
    {value: 'kospi', label: '유가증권'},
    {value: 'kosdaq', label: '코스닥'},
    {value: 'third', label: '제3시장'},
    {value: 'konex', label: '코스넥'},
] as const

// 여러 개를 함께 고를 수 있어 라디오가 아니라 체크박스다(시안 "check 다중").
const COMPANY_TYPE_OPTIONS = [
    {value: 'venture', label: '벤처기업'},
    {value: 'innobiz', label: '이노비즈기업'},
    {value: 'external-audit', label: '외부감사'},
    {value: 'investment', label: '외부투자이력보유'},
] as const

// 산업분야 코드 앞의 분류 선택 — 시안에는 [선택] 자리만 있어, 항목은 현행 시스템의 select 를 그대로 옮겼다.
// value 는 화면에 보이지 않는 제출용 키라 영문 소문자로 둔다 — 실제 코드값이 정해지면 이 키만 바꾼다.
const INDUSTRY_FIELD_OPTIONS = [
    {value: 'metal', label: '금속'},
    {value: 'machinery', label: '기계'},
    {value: 'electronics', label: '전기전자'},
    {value: 'ict', label: '정보통신'},
    {value: 'chemical', label: '화학'},
    {value: 'bio', label: '바이오'},
    {value: 'environment-energy', label: '환경에너지'},
    {value: 'etc', label: '기타'},
] as const

// 기술분류는 기획·개발 확정 전 임시 규칙을 쓴다.
// 1번에는 임시 숫자 코드 0000을 넣고, 모달에서 고른 품목명은 2~4번에 앞에서부터 담는다.
const TECH_CATEGORY_EXTRA_FIELDS = [2, 3, 4] as const
const TECH_CATEGORY_TEMP_CODE = '0000'
const TECH_CATEGORY_LABEL_FIELDS = TECH_CATEGORY_EXTRA_FIELDS.map((order) => `${TECH_CATEGORY_FIELD}-${order}`)

// 상세주소의 검사 메시지 — 주소 Field 안에 있지만 id 가 달라 Field 가 대신 그려 주지 못한다.
const AddressDetailError = () => {
    const message = useFieldError(ADDRESS_DETAIL_FIELD)

    return message ? <FieldError id={`${ADDRESS_DETAIL_FIELD}-error`}>{message}</FieldError> : null
}

// 선택지 줄의 배치.
//
// 세로 — 줄의 높이를 입력칸과 같은 48(control-h-md)로 잡고 그 안에서 가운데에 둔다. 시안에서 선택지 줄은
// 24 짜리 컨트롤이 48 짜리 칸 안에 rel y=12 로 놓여 있다. 높이를 주지 않으면 줄이 24 로 줄어들어, 옆에
// 나란히 오는 입력칸(산업분야 코드 48)보다 12 올라가 두 칸의 컨트롤이 어긋난다.
//
// 가로 — 시안이 줄마다 다르다.
//   기본(왼쪽 정렬 + 40 간격): 항목이 적어 한 줄에 여유가 남는 줄(기업규모).
//   spread(양끝 정렬):         항목이 많아 칸 폭(486)을 꽉 채우는 줄(상장구분 5개 · 기업형태 4개).
//     시안 실측 간격이 19.5·17.3 처럼 딱 떨어지지 않는데, 남는 폭을 항목 수로 나눈 값이라 고정값이 아니다.
//     그래서 간격을 숫자로 적지 않고 justify-between 으로 같은 결과를 만든다. gap-x 는 줄바꿈됐을 때의 최소값이다.
const optionRowClassName = (spread?: boolean) =>
    cn('flex min-h-control-h-md flex-wrap items-center gap-y-4', spread ? 'justify-between gap-x-4' : 'gap-x-10')

// 선택지 묶음의 이름(legend) — 다른 칸의 라벨과 같은 자리·같은 모양으로 보이도록 Field 의 라벨 타이포를
// 그대로 쓴다. 간격은 fieldset 의 flex gap 이 아니라 legend 의 margin 으로 준다 — legend 는 fieldset 의
// flex 레이아웃에 참여하지 않아(브라우저가 테두리 위에 따로 배치한다) gap 이 걸리지 않는다. 그대로 두면
// 이 줄만 라벨에 붙어, 옆 칸(산업분야 코드)보다 16 올라간다.
//
// id 를 두는 이유 — 묶음(radiogroup)과 그 안의 항목이 이 글을 자기 이름으로 가리킨다(aria-labelledby).
const OptionGroupLegend = ({id, children, required}: {id: string; children: string; required?: boolean}) => (
    <legend id={id} className="typo-body-xl-bold text-label-foreground mb-4">
        {children}
        {required ? (
            <>
                <span aria-hidden="true" className="text-error-500">
                    {' '}
                    *
                </span>
                <span className="sr-only"> (필수)</span>
            </>
        ) : null}
    </legend>
)

// 선택지 한 칸 — 라벨과 컨트롤을 잇는다.
//
// aria-labelledby 로 잇는 이유 — Radix 의 라디오·체크박스는 <button role="radio|checkbox"> 로 그려지고
// 안에 글자가 없다. <label for> 는 button 의 이름 계산에 쓰이지 않아, 그것만으로는 이름 없는 버튼이 된다
// (WAVE "Empty button")[5.1.1]. 눈에 보이는 그 글을 그대로 이름으로 가리킨다.
// htmlFor 는 함께 남긴다 — 라벨을 눌러 고르는 동작은 그쪽이 맡는다.
const OptionItem = ({id, label, control}: {id: string; label: string; control: ReactNode}) => (
    <div className="flex items-center gap-2">
        {control}
        <Label id={`${id}-label`} htmlFor={id} className="typo-body-xl-regular text-foreground">
            {label}
        </Label>
    </div>
)

// 하나만 고르는 묶음 — fieldset 으로 묶고 legend 로 이름을 준다[7.4.1].
//
// Field 를 쓰지 않는 이유 — Field 는 라벨을 <label for={id}> 로 그리는데, 그 id 를 받는 것은 Radix 가
// <div role="radiogroup"> 로 그리는 묶음이다. label 은 div 를 가리킬 수 없어 짝 없는 라벨이 된다
// (WAVE "Orphaned form label"). 여러 컨트롤을 하나로 묶는 자리라 fieldset/legend 가 본래 맞는 마크업이고,
// 아래 체크박스 묶음도 같은 방식이다.
//
// 묶음에 id 를 두는 이유 — 값을 나르는 radio input 은 숨어 있어 검사 메시지를 붙일 자리도, 포커스를 보낼
// 자리도 없다. 묶음이 그 역할을 대신한다.
//
// tabIndex 는 주지 않는다. Radix RadioGroup 은 roving tabindex 를 쓴다 — 아무것도 고르지 않은 동안에는
// 묶음(root)이 유일한 탭 정지점이고, 포커스가 들어오면 그때 개별 항목으로 넘긴다. 여기에 tabIndex={-1} 을
// 주면 그 유일한 정지점이 사라져 Tab 으로 라디오에 아예 닿지 못한다[6.1.1].
const RadioField = ({
    name,
    label,
    options,
    required,
    spread,
}: {
    name: string
    label: string
    options: readonly {value: string; label: string}[]
    required?: boolean
    spread?: boolean
}) => {
    const message = useFieldError(name)

    return (
        <fieldset>
            <OptionGroupLegend id={`${name}-label`} required={required}>
                {label}
            </OptionGroupLegend>
            <RadioGroup
                id={name}
                name={name}
                required={required}
                aria-labelledby={`${name}-label`}
                aria-describedby={message ? `${name}-error` : undefined}
                className={optionRowClassName(spread)}
            >
                {options.map((option) => (
                    <OptionItem
                        key={option.value}
                        id={`${name}-${option.value}`}
                        label={option.label}
                        control={
                            <RadioGroupItem
                                id={`${name}-${option.value}`}
                                value={option.value}
                                aria-labelledby={`${name}-${option.value}-label`}
                            />
                        }
                    />
                ))}
            </RadioGroup>
            {message ? <FieldError id={`${name}-error`}>{message}</FieldError> : null}
        </fieldset>
    )
}

// 여러 개를 고르는 묶음 — 각 체크박스가 독립된 값이라 fieldset 으로 묶고 legend 로 이름을 준다[7.4.1].
const CheckboxField = ({
    name,
    label,
    options,
    spread,
}: {
    name: string
    label: string
    options: readonly {value: string; label: string}[]
    spread?: boolean
}) => (
    <fieldset>
        <OptionGroupLegend id={`${name}-label`}>{label}</OptionGroupLegend>
        <div className={optionRowClassName(spread)}>
            {options.map((option) => (
                <OptionItem
                    key={option.value}
                    id={`${name}-${option.value}`}
                    label={option.label}
                    control={
                        <Checkbox
                            id={`${name}-${option.value}`}
                            name={name}
                            value={option.value}
                            aria-labelledby={`${name}-${option.value}-label`}
                        />
                    }
                />
            ))}
        </div>
    </fieldset>
)

// [기업 상세 정보] 구획 — Tech-Index 기업정보 탭의 마지막 구획(기업규모 · 상장구분 · 산업분야 코드 ·
// 기업형태 · 기술분류 · 대표기술 · 대표기술제품). 위 구획과의 구분선까지 한 덩이로 갖는다.
// 기관 개별평가 Tech-Index 기업정보 탭이 KTRS-FM 형 기업정보 카드 아래에 이 구획만 이어 붙여 쓰므로
// 본문에서 떼어 내 공유한다 — 값은 같은 FormValues 보관소에 담겨 어느 카드에서든 함께 제출된다.
const TechIndexCompanyDetailSection = () => {
    const {values, setValue, clearFieldError} = useFormValues()

    // 기술분류 — 1번에는 임시 코드, 고른 품목명은 2번부터 담는다(임시 최대 3개).
    // 이미 담긴 품목은 다시 담지 않는다 — 임시 화면이라 별도 오류 검증은 표시하지 않는다.
    const handleTechCategorySelect = (item: string) => {
        if (TECH_CATEGORY_LABEL_FIELDS.some((name) => values[name] === item)) return

        const emptyField = TECH_CATEGORY_LABEL_FIELDS.find((name) => !values[name])
        if (!emptyField) return

        setValue(TECH_CATEGORY_FIELD, TECH_CATEGORY_TEMP_CODE)
        setValue(emptyField, item)
        clearFieldError(TECH_CATEGORY_FIELD)
        clearFieldError(emptyField)
    }

    return (
        <>
            <Separator />

            <div className="flex flex-col gap-4">
                <SubSectionHeader>
                    <SubSectionHeaderTitle>기업 상세 정보</SubSectionHeaderTitle>
                </SubSectionHeader>
                <FieldGrid>
                    <RadioField name="companySize" label="기업규모" options={COMPANY_SIZE_OPTIONS} required />
                    <RadioField name="listingType" label="상장구분" options={LISTING_OPTIONS} required spread />
                    {/* 산업분야 코드 — 앞의 분류를 고르고 뒤 칸에 코드를 적는다(시안 "input+selectbox"). */}
                    <Field id="industry-field" label="산업분야 코드">
                        <div className="flex items-start gap-2">
                            <Select name="industryField">
                                <SelectTrigger id="industry-field" className="w-full min-w-0 flex-1">
                                    <SelectValue placeholder="선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INDUSTRY_FIELD_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <ClearableInput
                                id="industry-field-code"
                                name="industryFieldCode"
                                aria-label="산업분야 코드"
                                placeholder="산업분야 코드"
                                autoComplete="off"
                                className="min-w-0 flex-1"
                            />
                        </div>
                    </Field>
                    <CheckboxField name="companyType" label="기업형태" options={COMPANY_TYPE_OPTIONS} spread />
                    {/* 기술분류 — 기획·개발 확정 전까지 1번은 임시 코드 0000, 선택 품목명은 2~4번에 담는다.
                        [조회] 는 혁신성장영위기업 분류근거 모달을 열고, 고른 품목명은 2번부터 빈 칸에 담긴다. */}
                    <Field id={TECH_CATEGORY_FIELD} label="기술분류" className="md:col-span-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                                <ClearableInput
                                    id={TECH_CATEGORY_FIELD}
                                    name={TECH_CATEGORY_FIELD}
                                    readOnly
                                    placeholder="기술분류 1"
                                    autoComplete="off"
                                    className="min-w-0 flex-1"
                                />
                                <TechnologyCategoryDialog onSelect={handleTechCategorySelect}>
                                    <Button type="button" variant="tertiary" size="md" className="shrink-0">
                                        조회
                                    </Button>
                                </TechnologyCategoryDialog>
                            </div>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                {TECH_CATEGORY_EXTRA_FIELDS.map((order) => (
                                    <ClearableInput
                                        key={order}
                                        id={`${TECH_CATEGORY_FIELD}-${order}`}
                                        name={`${TECH_CATEGORY_FIELD}-${order}`}
                                        readOnly
                                        aria-label={`기술분류 ${order}`}
                                        placeholder={`기술분류 ${order}`}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>
                        </div>
                    </Field>
                    <Field id="main-tech" label="대표기술" required>
                        <ClearableInput
                            id="main-tech"
                            name="mainTech"
                            placeholder="대표기술을 입력해주세요"
                            required
                            autoComplete="off"
                        />
                    </Field>
                    <Field id="main-tech-product" label="대표기술제품 (서비스)" required>
                        <ClearableInput
                            id="main-tech-product"
                            name="mainTechProduct"
                            placeholder="대표기술제품(서비스)을 입력해주세요"
                            required
                            autoComplete="off"
                        />
                    </Field>
                </FieldGrid>
            </div>
        </>
    )
}

const TechIndexCompanyInfoForm = () => {
    const {setValue, clearFieldError} = useFormValues()
    // 기업형태는 회원정보에서 잠겨 오므로 화면에서 바뀌지 않는다 — 그 값이 법인 전용 칸의 노출을 가른다.
    const isCorporation =
        MEMBER_COMMON_FIELDS.find((field) => field.id === CORP_TYPE_FIELD)?.value === CORP_TYPE_CORPORATION
    // 값이 있는 항목만 화면에 둔다 — 위 [미노출 규칙].
    const memberFields = [...MEMBER_COMMON_FIELDS, ...(isCorporation ? MEMBER_CORPORATION_FIELDS : [])].filter(
        (field) => field.value,
    )

    // 고른 주소는 "(우편번호) 도로명주소" 로 한 칸에 담는다 — 시안의 주소 칸이 한 줄이다.
    // 주소를 채우고 나면 곧바로 상세주소를 쓰게 되므로 그 칸으로 포커스를 옮긴다.
    const handleAddressSelect = ({zonecode, roadAddress}: {zonecode: string; roadAddress: string}) => {
        setValue(ADDRESS_FIELD, `(${zonecode}) ${roadAddress}`)
        clearFieldError(ADDRESS_FIELD)
        document.getElementById(ADDRESS_DETAIL_FIELD)?.focus()
    }

    // 모달에서 고른 업종을 칸에 담는다. 값의 키와 칸의 id 가 같아 메시지도 같은 키로 거둔다.
    const handleIndustryCodeSelect = ({label}: {label: string}) => {
        setValue(INDUSTRY_CODE_FIELD, label)
        clearFieldError(INDUSTRY_CODE_FIELD)
    }

    return (
        <FormCard title="기업정보" subtitle={<RequiredFieldsNotice />}>
            {/* id 는 화면의 "입력 폼 바로가기" 스킵 링크가 가리키는 자리다[6.4.1]. */}
            <div id="company-form" className="flex flex-col gap-10">
                {/* 줄 사이 간격은 칸 사이와 같은 24 다(시안 실측 · 기관 개별평가 기업정보와 동일). */}
                <div className="flex flex-col gap-6">
                    {/* 법인이면 시안 그대로 [기업형태 · 기업명] / [사업자번호 · 법인번호] 두 줄이 되고,
                        개인·기타는 법인번호가 빠진 만큼 뒤 칸이 당겨져 세 칸으로 흐른다. */}
                    <FieldGrid>
                        {memberFields.map((field) => (
                            <LockedField
                                key={field.id}
                                id={field.id}
                                label={field.label}
                                value={field.value}
                                required={field.required}
                                autoComplete={'autoComplete' in field ? field.autoComplete : undefined}
                            />
                        ))}
                    </FieldGrid>

                    {/* 안내 문구는 실제로 노출된 잠긴 칸만 나열한다 — 법인번호는 법인일 때만 들어간다. */}
                    <Alert variant="solid" color="info">
                        <CircleCheck aria-hidden="true" />
                        <AlertDescription>
                            {memberFields.map((field) => field.label).join(', ')}는 회원정보 기준으로 자동 입력되며
                            수정할 수 없습니다.
                        </AlertDescription>
                    </Alert>

                    <FieldGrid>
                        {/* 설립일은 지난 일이라 오늘 이후를 고를 수 없다 — 달력에서 막으므로 안내 문구는 두지 않는다. */}
                        <DateField id="found-date" name="foundDate" label="설립일(개업일)" required />
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
                        {/* 업종코드 — 첨부 서류(사업자등록증 등) 기준으로 조회해 채우는 값이라 직접 입력하지 않는다.
                        주소와 같은 방식으로 읽기 전용으로 두고 [조회] 버튼으로만 채운다(기업·기관 KTRS-FM 과 동일).
                        placeholder 는 시안의 "업종코드 입력" 대신 채우는 방법을 알려 준다 — 읽기 전용 칸에
                        "입력" 이라고 적으면 눌러도 타이핑이 되지 않아 안내와 동작이 어긋난다. */}
                        <LookupField
                            id={INDUSTRY_CODE_FIELD}
                            label="업종코드"
                            placeholder="[조회] 버튼을 눌러 선택해 주세요"
                            action="조회"
                            readOnly
                            required
                            wrapAction={(button) => (
                                <IndustryCodeDialog onSelect={handleIndustryCodeSelect}>{button}</IndustryCodeDialog>
                            )}
                        />
                    </FieldGrid>

                    {/* 주소 — 검색 결과 입력과 상세주소가 한 라벨 아래 두 줄로 묶인다(시안 "input 2줄").
                        카드 안쪽 폭(996)을 통째로 쓰는 마지막 줄이라 그리드 밖에 둔다(기관 개별평가와 같은 구조).
                        상세주소는 시안에 별도 라벨이 없어 aria-label 로 이름을 준다[7.4.1]. */}
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
                                {/* 실제 주소는 이 모달(Kakao 우편번호)에서 고른다 — 회원가입 흐름과 같은 모달이다.
                                        이 화면은 고른 주소가 아래 칸에 채워지는 것까지 보여야 해서 임시 검색 UI를 켠다. */}
                                <PostcodeSearchDialog mockSearch title="주소 검색" onSelect={handleAddressSelect}>
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
                                placeholder="상세주소를 입력해 주세요"
                                aria-describedby={`${ADDRESS_FIELD}-helper`}
                                autoComplete="off"
                            />
                            <AddressDetailError />
                        </div>
                    </Field>
                </div>

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
                                placeholder="담당자명을 입력해 주세요"
                                required
                                autoComplete="name"
                            />
                        </Field>
                        <Field id="manager-position" label="직위" required>
                            <ClearableInput
                                id="manager-position"
                                name="managerPosition"
                                placeholder="직위를 입력해 주세요"
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
                                placeholder="이메일을 입력해 주세요"
                                autoComplete="email"
                                required
                            />
                        </Field>
                    </FieldGrid>
                </div>

                <TechIndexCompanyDetailSection />
            </div>
        </FormCard>
    )
}

export default TechIndexCompanyInfoForm
export {TechIndexCompanyDetailSection}
