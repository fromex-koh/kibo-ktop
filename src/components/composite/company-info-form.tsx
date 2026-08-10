'use client'

import {CircleCheck} from 'lucide-react'
import {FormCard} from '@/components/composite/form-card'
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import {SubSectionHeader, SubSectionHeaderTitle} from '@/components/composite/sub-section-header'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {FieldError} from '@/components/ui/field'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {
    ClearableInput,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    TelInput,
    useFieldError,
    useFormValues,
} from '@/components/composite/form-values'
import {Field, FieldGrid, LockedField, LookupField} from '@/components/composite/form-fields'
import {DateField} from '@/components/composite/date-field'

// 마이페이지(회원정보)에서 그대로 받아 오는 값 — 읽기 전용으로 보여 주기만 한다.
// 아래 value 는 목업이다. 연동할 때 마이페이지 응답으로 바꾸면 된다.
//
// [미노출 규칙] 법인번호가 마이페이지에 없는 경우 해당 필드를 노출하지 않는다.
// 값이 없는 항목은 빈 칸으로 남기지 않고 목록에서 아예 빼며(filledMemberFields), 위쪽 안내 문구도
// 실제로 노출된 항목만 나열한다. 빈 칸을 잠긴 채 두면 "있는데 안 채운 칸" 으로 읽히고 필수 표시(*)까지
// 붙어, 사용자가 채우려다 막힌다.
const MEMBER_COMPANY_FIELDS = [
    {id: 'corp-name', label: '기업명', value: '(주)테크놀로지', autoComplete: 'organization'},
    {id: 'biz-no', label: '사업자번호', value: '123-45-67890'},
    // 법인이 아닌 기업(개인사업자 등)은 이 값이 비어 오고, 그때는 이 칸이 화면에 나오지 않는다.
    {id: 'corp-no', label: '법인번호', value: '11222-1234567'},
] as const

// 값이 있는 항목만 화면에 둔다 — 위 [미노출 규칙].
const filledMemberFields = MEMBER_COMPANY_FIELDS.filter((field) => field.value)

// 상세주소의 검사 메시지 — 주소 Field 안에 있지만 id 가 달라 Field 가 대신 그려 주지 못한다.
const AddressDetailError = () => {
    const message = useFieldError('address-detail')

    return message ? <FieldError id="address-detail-error">{message}</FieldError> : null
}

const INDUSTRY_CODE_FIELD = 'industry-code'

// 기업정보 탭 본문 — Figma "기업정보" 탭 컨텐츠(1200×1274) 전체.
// 자가진단 입력 화면과 FormTabs 컴포넌트 가이드가 같은 것을 보도록 여기 한 벌만 둔다.
const CompanyInfoForm = () => {
    const {setValue, clearFieldError} = useFormValues()
    // 모달에서 고른 업종을 읽기 전용 칸에 담는다. 값의 키와 칸의 id 가 같아 메시지도 같은 키로 거둔다.
    const handleIndustryCodeSelect = ({label}: {label: string}) => {
        setValue(INDUSTRY_CODE_FIELD, label)
        clearFieldError(INDUSTRY_CODE_FIELD)
    }

    return (
        <FormCard title="기업정보" subtitle="* 표시 항목은 필수 입력 항목입니다.">
            {/* id 는 화면의 "입력 폼 바로가기" 스킵 링크가 가리키는 자리다[6.4.1]. */}
            <div id="company-form" className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                    <FieldGrid>
                        <Field id="corp-type" label="기업형태" required>
                            <Select name="corpType" required>
                                <SelectTrigger id="corp-type" className="w-full">
                                    <SelectValue placeholder="선택해 주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="corp">주식회사</SelectItem>
                                    <SelectItem value="llc">유한회사</SelectItem>
                                    <SelectItem value="individual">개인사업자</SelectItem>
                                    <SelectItem value="etc">기타</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        {filledMemberFields.map((field) => (
                            <LockedField
                                key={field.id}
                                id={field.id}
                                label={field.label}
                                value={field.value}
                                required
                                autoComplete={'autoComplete' in field ? field.autoComplete : undefined}
                            />
                        ))}
                    </FieldGrid>

                    <Alert variant="solid" color="info">
                        <CircleCheck aria-hidden="true" />
                        <AlertDescription>
                            {filledMemberFields.map((field) => field.label).join(', ')}는 회원정보 기준으로 자동
                            입력되며 수정할 수 없습니다.
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
                        {/* 주소 — 검색 결과 입력과 상세주소가 한 라벨 아래 두 줄로 묶인다(시안 "input 2줄").
                        상세주소는 시안에 별도 라벨이 없어 aria-label 로 이름을 준다[7.4.1]. */}
                        <Field
                            id="address"
                            label="주소"
                            required
                            className="md:col-span-2"
                            helper="※ 도로명 건물번호를 모를 경우 도로명주소시스템에서 확인하시기 바랍니다."
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-start gap-2">
                                    <Input
                                        id="address"
                                        name="address"
                                        readOnly
                                        required
                                        autoComplete="off"
                                        placeholder="[주소 검색] 버튼으로 자동 입력됩니다"
                                        className="min-w-0 flex-1"
                                    />
                                    {/* 실제 주소는 이 모달(Kakao 우편번호)에서 고른다 — 회원가입 흐름과 같은 모달이다. */}
                                    <PostcodeSearchDialog title="주소 검색">
                                        <Button type="button" variant="tertiary" size="md" className="shrink-0">
                                            주소 검색
                                        </Button>
                                    </PostcodeSearchDialog>
                                </div>
                                {/* 주소와 라벨을 공유하지만 값은 따로 담기는 칸이라, 검사 메시지도 이 자리에 따로 붙인다.
                                Field 는 자기 id(address) 의 메시지만 그리기 때문이다. */}
                                <ClearableInput
                                    id="address-detail"
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
            </div>
        </FormCard>
    )
}

export default CompanyInfoForm
