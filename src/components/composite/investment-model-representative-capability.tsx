'use client'

import {Field, FieldGrid} from '@/components/composite/form-fields'
import {
    ClearableInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useFormValues,
} from '@/components/composite/form-values'
import {
    SubSectionHeader,
    SubSectionHeaderDescription,
    SubSectionHeaderTitle,
} from '@/components/composite/sub-section-header'

// 투자모형 [대표자 역량] 구획 — Figma "투자모형_2단계_기업·기술정보 입력_대표자 역량 및 경력사항".
// 경력사항 본문(career-form)의 leading 으로 들어가는 조각이다. 경력 카드·행추가·총 경력 연수는 그쪽이 갖는다.
//
// Tech-Index 의 같은 이름 구획(tech-index-representative-capability)과 칸이 전혀 달라 모형별로 따로 둔다.
//   Tech-Index  최종학력 · 졸업년도 · 학교명(+구분) · 전공 · 수학상태 · 학위 취득
//   투자모형     최종학력(취득학위) · 전공 · 전공과 평가대상 기술분야 일치여부 · 기술자격증
//
// 시안의 전공 칸 옆에는 [해당없음] 체크박스가 있지만 두지 않는다 — 전공이 없는 경우는 곧 고졸이고,
// 그것은 최종학력에서 이미 고른 값이라 같은 사실을 두 번 묻는 자리가 된다(Tech-Index 와 같은 처리).
// 대신 최종학력이 전공의 필수 여부를 가른다(아래 isMajorRequired).

// 아래 select 항목은 시안에 [선택] 자리만 있어 별도로 확인한 값이다. value 는 화면에 보이지 않는 제출용
// 키라 영문 소문자로 둔다 — 실제 코드값이 정해지면 이 키만 바꾼다.
const EDUCATION_OPTIONS = [
    {value: 'high-school-or-below', label: '고졸'},
    {value: 'associate', label: '전문학사'},
    {value: 'bachelor', label: '학사'},
    {value: 'master', label: '석사'},
    {value: 'doctor', label: '박사'},
] as const

// [전공과 평가대상 기술분야 일치여부] — 기술 인력 현황(tech-staff-form)의 같은 칸과 항목을 맞춘다.
const MAJOR_MATCH_OPTIONS = [
    {value: 'match', label: '일치함'},
    {value: 'mismatch', label: '일치하지 않음'},
] as const

// 기술자격증 — 경영진 역량 및 구성(tech-index-management-form)의 [자격증] 과 같은 값을 쓴다.
// 기존 시스템의 셀렉트 옵션 그대로다(기술사·기능장·기사·산업기사·기능사·없음).
const TECH_CERTIFICATE_OPTIONS = [
    {value: 'professionalEngineer', label: '기술사'},
    {value: 'masterCraftsman', label: '기능장'},
    {value: 'engineer', label: '기사'},
    {value: 'industrialEngineer', label: '산업기사'},
    {value: 'craftsman', label: '기능사'},
    {value: 'none', label: '없음'},
] as const

const MAJOR_FIELD = 'major'
const EDUCATION_FIELD = 'finalEducation'
// 고졸은 전공이라 부를 것이 없다 — 이 학력일 때만 전공이 선택 항목이 된다.
// 나머지(전문학사 포함)는 학교에서 전공을 정해 마치는 과정이라 필수로 받는다.
const EDUCATION_WITHOUT_MAJOR = 'high-school-or-below'

const InvestmentModelRepresentativeCapability = () => {
    const {values, clearFieldError} = useFormValues()
    // 최종학력이 전공의 필수 여부를 가른다. 아직 고르지 않았다면 필수로 둔다 — 대부분의 학력이 그렇고,
    // 고졸을 고르는 순간 풀린다.
    const isMajorRequired = values[EDUCATION_FIELD] !== EDUCATION_WITHOUT_MAJOR

    // 학력을 고졸로 바꾸면 전공은 더 이상 필수가 아니다 — 앞서 제출에서 걸린 "필수" 메시지가
    // 남아 있으면 고칠 것이 없는데도 오류로 보이므로 함께 지운다.
    const handleEducationChange = (value: string) => {
        if (value === EDUCATION_WITHOUT_MAJOR) clearFieldError(MAJOR_FIELD)
    }

    return (
        <div className="flex flex-col gap-4">
            <SubSectionHeader>
                <SubSectionHeaderTitle>대표자 역량</SubSectionHeaderTitle>
                <SubSectionHeaderDescription>대표자의 최종학력을 기입해주십시오.</SubSectionHeaderDescription>
            </SubSectionHeader>

            <FieldGrid>
                <Field id="final-education" label="최종학력 (취득학위)" required>
                    <Select name={EDUCATION_FIELD} required onValueChange={handleEducationChange}>
                        <SelectTrigger id="final-education" className="w-full">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {EDUCATION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field id={MAJOR_FIELD} label="전공" required={isMajorRequired}>
                    <ClearableInput
                        id={MAJOR_FIELD}
                        name={MAJOR_FIELD}
                        required={isMajorRequired}
                        placeholder="전공"
                        autoComplete="off"
                    />
                </Field>
                <Field id="major-match" label="전공과 평가대상 기술분야 일치여부" required>
                    <Select name="majorMatch" required>
                        <SelectTrigger id="major-match" className="w-full">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {MAJOR_MATCH_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field id="tech-certificate" label="기술자격증" required>
                    <Select name="techCertificate" required>
                        <SelectTrigger id="tech-certificate" className="w-full">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {TECH_CERTIFICATE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGrid>
        </div>
    )
}

export default InvestmentModelRepresentativeCapability
