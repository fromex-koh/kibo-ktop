'use client'

import {CircleCheck} from 'lucide-react'
import {DateField} from '@/components/composite/date-field'
import {Field, FieldGrid, LockedField, LookupField, RequiredFieldsNotice} from '@/components/composite/form-fields'
import {FormCard} from '@/components/composite/form-card'
import {
    ClearableInput,
    Input,
    TelInput,
    useFieldError,
    useFieldValue,
    useFormValues,
} from '@/components/composite/form-values'
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import {SELECTED_INDUSTRY_CODE_FIELD} from '@/constants/technology-evaluation'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import {FieldError} from '@/components/ui/field'

// 투자모형 [기업정보] 탭 본문 — Figma "투자모형_2단계_기업·기술정보 입력_기업정보".
//
// KTRS-FM·Tech-Index 의 기업정보 탭과 달리 [기업 담당자 정보] 구획이 없다 — 이 모형의 시안은 기업정보
// 한 구획으로 끝난다. 그 차이가 카드 구조까지 갈라놓아 기존 폼에 분기를 더하지 않고 모형별 폼으로 둔다
// (org-company-info-form·tech-index-company-info-form 과 같은 방식).
//
// 필수(*)는 다른 모형의 기업정보 탭과 맞춘다 — 같은 칸이 화면마다 다르게 요구되면 옮겨 다니는 사용자가
// 매번 다시 확인해야 한다. 시안에는 설립일·대표자명·회사전화번호·주소에 * 가 없지만, 세 폼이 모두
// 필수로 받고 있어 이쪽을 따랐다. 법인번호만 이 모형의 규칙(법인일 때만 필수)을 따로 둔다.

// 기업형태도 회원정보에서 정해져 오는 값이라 고를 수 없다. 아래 값은 목업이며, 연동할 때
// 마이페이지 응답으로 바꾸면 법인 여부(IS_CORPORATION)와 법인번호 필수 여부가 함께 따라간다.
const CORP_TYPE_CORPORATION = '법인'
const memberCorpType: string = CORP_TYPE_CORPORATION
const IS_CORPORATION = memberCorpType === CORP_TYPE_CORPORATION

// 마이페이지(회원정보)에서 그대로 받아 오는 값 — 읽기 전용으로 보여 주기만 한다.
// 아래 value 는 목업이다. 연동할 때 마이페이지 응답으로 바꾸면 된다.
const memberCorpNo = '11222-1234567'

// [미노출 규칙] 법인번호는 법인에게만 있는 값이라, 기업형태가 법인이 아니면 화면에 두지 않는다.
// 값이 없는 항목은 빈 칸으로 남기지 않고 목록에서 아예 빼며(filledMemberFields), 위쪽 안내 문구도
// 실제로 노출된 항목만 나열한다. 빈 칸을 잠긴 채 두면 "있는데 안 채운 칸" 으로 읽히고 필수 표시(*)까지
// 붙어, 사용자가 채우려다 막힌다.
const MEMBER_COMPANY_FIELDS = [
    {id: 'corp-name', label: '기업명', value: '(주) 테크놀로지', required: true, autoComplete: 'organization'},
    {id: 'biz-no', label: '사업자번호', value: '123-45-67890', required: true},
    // 법인일 때만 값이 오고, 그때는 필수다. 개인·기타면 값이 비어 위 [미노출 규칙]으로 칸이 사라진다.
    {id: 'corp-no', label: '법인번호', value: IS_CORPORATION ? memberCorpNo : '', required: IS_CORPORATION},
] as const

// 값이 있는 항목만 화면에 둔다 — 위 [미노출 규칙].
const filledMemberFields = MEMBER_COMPANY_FIELDS.filter((field) => field.value)

const CORP_TYPE_FIELD = 'corp-type'
const INDUSTRY_CODE_FIELD = 'industry-code'
const ADDRESS_FIELD = 'address'
const ADDRESS_DETAIL_FIELD = 'address-detail'

// 상세주소의 검사 메시지 — 주소 Field 안에 있지만 id 가 달라 Field 가 대신 그려 주지 못한다.
const AddressDetailError = () => {
    const message = useFieldError(ADDRESS_DETAIL_FIELD)

    return message ? <FieldError id={`${ADDRESS_DETAIL_FIELD}-error`}>{message}</FieldError> : null
}

const InvestmentModelCompanyInfoForm = () => {
    const {setValue, clearFieldError} = useFormValues()
    // 제출 값은 FormData 로 모으므로, 화면에 칸이 없는 업종코드는 숨은 입력으로 함께 실어 보낸다
    // (이 값이 다음 단계에서 제조·서비스 체크리스트를 가른다).
    const industryCode = useFieldValue(SELECTED_INDUSTRY_CODE_FIELD)?.value ?? ''
    // 모달에서 고른 업종을 읽기 전용 칸에 담는다. 값의 키와 칸의 id 가 같아 메시지도 같은 키로 거둔다.
    const handleIndustryCodeSelect = ({code, label}: {code: string; label: string}) => {
        setValue(INDUSTRY_CODE_FIELD, label)
        // 코드도 함께 담는다 — 다음 단계에서 제조·서비스 체크리스트를 가르는 값이다(화면에는 보이지 않는다).
        setValue(SELECTED_INDUSTRY_CODE_FIELD, code)
        clearFieldError(INDUSTRY_CODE_FIELD)
    }

    // 고른 주소는 "(우편번호) 도로명주소" 로 한 칸에 담는다 — 시안의 주소 칸이 한 줄이다.
    // 주소를 채우고 나면 곧바로 상세주소를 쓰게 되므로 그 칸으로 포커스를 옮긴다.
    const handleAddressSelect = ({zonecode, roadAddress}: {zonecode: string; roadAddress: string}) => {
        setValue(ADDRESS_FIELD, `(${zonecode}) ${roadAddress}`)
        clearFieldError(ADDRESS_FIELD)
        document.getElementById(ADDRESS_DETAIL_FIELD)?.focus()
    }

    return (
        <FormCard title="기업정보" subtitle={<RequiredFieldsNotice />}>
            {/* id 는 화면의 "입력 폼 바로가기" 스킵 링크가 가리키는 자리다[6.4.1]. */}
            <div id="company-form" className="flex flex-col gap-4">
                <FieldGrid>
                    {/* 기업형태도 회원정보에서 정해져 오는 값이라 고를 수 없다. 다만 아래 안내 문구는
                        시안 그대로 세 항목만 나열하므로 filledMemberFields 목록에는 넣지 않는다. */}
                    <LockedField id={CORP_TYPE_FIELD} label="기업형태" value={memberCorpType} required />
                    {filledMemberFields.map((field) => (
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

                <Alert variant="solid" color="info">
                    <CircleCheck aria-hidden="true" />
                    <AlertDescription>
                        {filledMemberFields.map((field) => field.label).join(', ')}는 회원정보 기준으로 자동 입력되며
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
                            required
                            placeholder="대표자명을 입력해 주세요"
                            autoComplete="off"
                        />
                    </Field>
                    <Field id="company-tel" label="회사전화번호" required>
                        {/* 전화번호는 숫자만 받아 하이픈을 자동으로 넣는다 — 사람마다 다르게 적은 값이
                            그대로 제출되면 뒤에서 다시 정리해야 한다. */}
                        {/* 안내 문구(placeholder)는 다른 모형의 기업정보 탭과 같은 문장으로 맞춘다 — 시안이
                            예시 번호(02-1234-0000)나 "업종코드 입력" 처럼 다르게 적은 칸도 마찬가지다.
                            같은 칸이 화면마다 다르게 읽히면 옮겨 다니는 사용자가 매번 다시 읽어야 한다. */}
                        <TelInput
                            id="company-tel"
                            name="companyTel"
                            required
                            placeholder="회사전화번호를 입력해 주세요"
                            autoComplete="off"
                        />
                    </Field>
                    {/* 업종코드 — 첨부 서류(사업자등록증 등) 기준으로 조회해 채우는 값이라 직접 입력하지 않는다.
                        주소와 같은 방식으로 읽기 전용으로 두고 [조회] 버튼으로만 채운다. */}
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
                    <input type="hidden" name={SELECTED_INDUSTRY_CODE_FIELD} value={industryCode} />
                    {/* 주소 — 검색 결과 입력과 상세주소가 한 라벨 아래 두 줄로 묶인다(시안 "input 2줄").
                        상세주소는 시안에 별도 라벨이 없어 aria-label 로 이름을 준다[7.4.1]. */}
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
                                {/* 실제 주소는 이 모달(Kakao 우편번호)에서 고른다 — 회원가입 흐름과 같은 모달이다. */}
                                <PostcodeSearchDialog mockSearch title="주소 검색" onSelect={handleAddressSelect}>
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
                </FieldGrid>
            </div>
        </FormCard>
    )
}

export default InvestmentModelCompanyInfoForm
