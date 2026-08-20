'use client'

import {Field, FieldGrid} from '@/components/composite/form-fields'
import {
    ClearableInput,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
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
import {
    DEGREE_OPTIONS,
    EDUCATION_OPTIONS,
    EDUCATION_WITHOUT_MAJOR,
    formatGraduationYear,
    GRADUATION_YEAR_MESSAGE,
    GRADUATION_YEAR_PATTERN,
    SCHOOL_TYPE_OPTIONS,
    STUDY_STATUS_OPTIONS,
} from '@/constants/representative-capability'

// Tech-Index 일반용 [대표자 역량] 구획 — Figma "[혁신성장지수 (일반) Tech-Index] 2단계_대표자 역량 및 경력사항".
// KTRS-FM 의 대표자 경력사항 탭에는 없고 이 모형에만 있는 구획이라, 경력사항 본문(career-form)에 끼워 넣는
// 조각으로 따로 둔다. 경력 카드·행추가·총 경력 연수는 그쪽이 그대로 갖는다.
//
// 줄 구성(카드 안쪽 폭 996, 칸 사이 24 — 시안 실측):
//   1줄 486+486  최종학력 · 졸업년도
//   2줄 486+486  학교명(입력 239 + 구분 239) · 전공(입력 390 + [해당없음] 체크 88)
//   3줄 486+486  수학상태 · 학위 취득
//
const MAJOR_FIELD = 'major'
const EDUCATION_FIELD = 'finalEducation'

const TechIndexRepresentativeCapability = () => {
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
                <Field id="final-education" label="최종학력" required>
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

                {/* 졸업년도 — 시안이 값을 오른쪽에 붙여 두어 숫자 자릿수를 맞춰 읽게 한다
                (기업 기타 정보의 수량 칸과 같은 처리). 숫자·자릿수 처리는 위 formatGraduationYear 참고.
                단위 "년" 은 자리 안내(placeholder)가 아니라 상자 안 오른쪽 단위로 둔다 — placeholder 는
                값을 넣는 순간 사라지므로 "2020" 만 남아 무엇의 네 자리인지 알 수 없게 된다. */}
                <Field id="graduation-year" label="졸업년도" required>
                    <InputGroup>
                        <InputGroupInput
                            id="graduation-year"
                            name="graduationYear"
                            required
                            inputMode="numeric"
                            format={formatGraduationYear}
                            pattern={GRADUATION_YEAR_PATTERN}
                            data-pattern-message={GRADUATION_YEAR_MESSAGE}
                            placeholder="YYYY"
                            autoComplete="off"
                            className="text-right"
                        />
                        <InputGroupAddon align="inline-end" className="text-foreground">
                            년
                        </InputGroupAddon>
                    </InputGroup>
                </Field>

                {/* 학교명 — 이름과 학교구분이 한 라벨 아래 두 칸으로 나뉜다(시안 "input+selectbox").
                학교구분 select 는 시안에 별도 라벨이 없어 aria-label 로 이름을 준다[7.4.1]. */}
                <Field id="school-name" label="학교명" required>
                    <div className="flex items-start gap-2">
                        <ClearableInput
                            id="school-name"
                            name="schoolName"
                            required
                            placeholder="학교명을 입력해주세요"
                            autoComplete="off"
                            className="min-w-0 flex-1"
                        />
                        <Select name="schoolType" required>
                            <SelectTrigger id="school-type" aria-label="학교구분" className="min-w-0 flex-1">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {SCHOOL_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </Field>

                {/* 전공 — 필수 여부가 최종학력에 달려 있다(위 isMajorRequired 참고).
                시안에 있던 [해당없음] 체크는 두지 않는다 — 전공이 없는 경우는 곧 고졸이고, 그것은
                최종학력에서 이미 고른 값이라 같은 사실을 두 번 묻는 자리가 된다. */}
                <Field id={MAJOR_FIELD} label="전공" required={isMajorRequired}>
                    <ClearableInput
                        id={MAJOR_FIELD}
                        name={MAJOR_FIELD}
                        required={isMajorRequired}
                        placeholder="전공"
                        autoComplete="off"
                    />
                </Field>

                <Field id="study-status" label="수학상태" required>
                    <Select name="studyStatus" required>
                        <SelectTrigger id="study-status" className="w-full">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {STUDY_STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field id="degree" label="학위 취득" required>
                    <Select name="degree" required>
                        <SelectTrigger id="degree" className="w-full">
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {DEGREE_OPTIONS.map((option) => (
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

export default TechIndexRepresentativeCapability
