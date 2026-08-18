'use client'

import {Plus} from 'lucide-react'
import {Fragment, type ReactNode} from 'react'
import {FormCard} from '@/components/composite/form-card'
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {Button} from '@/components/ui/button'
import {
    ClearableInput,
    FormCardScope,
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
import {Field, FieldGrid, FieldRow3} from '@/components/composite/form-fields'

// 핵심 기술 인력 현황 탭 본문 — Figma "핵심 기술 인력 현황" 탭 컨텐츠(1200×1206) 전체.
// 자가진단 입력 화면과 FormTabs 컴포넌트 가이드가 같은 것을 보도록 여기 한 벌만 둔다.
//
// 카드 안의 칸은 모두 필수다 — 라벨의 빨간 `*` 와 컨트롤의 required 를 함께 붙인다.
// 시안에는 `*` 레이어가 꺼져 있었지만 필수 처리는 업무 규칙으로 확정된 것이다(카드 안내 문구의 불릿은
// 시안대로 두지 않는다).
// 대표자를 제외한 핵심 인력은 시안 안내대로 최대 2명까지다 — 다 채우면 "행추가" 가 비활성이 된다.
const MAX_STAFF_COUNT = 2

// 구분 — 기존 시스템의 셀렉트 옵션 그대로다(연구·개발·기타). "선택" 은 옵션이 아니라 placeholder 로 둔다.
const STAFF_CATEGORIES = [
    {value: 'research', label: '연구'},
    {value: 'development', label: '개발'},
    {value: 'etc', label: '기타'},
] as const

// Tech-Index 의 구분 — 이 모형은 같은 탭의 인원 요약(연구개발 인력 · 생산기술인력)과 같은 두 갈래로 받는다.
// KTRS-FM 과 항목이 달라 기본값을 바꾸지 않고 사용처가 골라 넘긴다(제목·카드 수와 같은 방식).
const TECH_INDEX_STAFF_CATEGORIES = [
    {value: 'researchDevelopment', label: '연구개발'},
    {value: 'productionTech', label: '생산기술'},
] as const

// 최종학력 — 기존 시스템의 셀렉트 옵션 그대로다. 낮은 학력부터 높은 학력 순으로 늘어놓는다.
// "기업 기타 정보" 탭의 학력별 인원수(박사/기술사·석사/학사/기사 …)는 자격증까지 묶은 다른 구분이라
// 여기와 항목이 일치하지 않는다.
const EDUCATION_LEVELS = [
    {value: 'highSchool', label: '고졸'},
    {value: 'associate', label: '전문학사'},
    {value: 'bachelor', label: '학사'},
    {value: 'master', label: '석사'},
    {value: 'doctor', label: '박사'},
] as const

// 고졸은 전공이라 부를 것이 없다 — 이 학력일 때만 전공이 선택 항목이 된다. 나머지(전문학사 포함)는
// 학교에서 전공을 정해 마치는 과정이라 필수로 받는다(대표자 역량 구획과 같은 규칙).
const EDUCATION_WITHOUT_MAJOR = 'highSchool'

// [전공과 평가대상 기술 분야 일치여부] 의 항목 — Tech-Index 창업용 시안에만 있는 칸이다.
// 시안에는 고른 뒤의 모습(일치함)만 그려져 있어 항목은 두 갈래로 둔다. value 는 화면에 보이지 않는
// 제출용 키라 영문 소문자로 둔다 — 실제 코드값이 정해지면 이 키만 바꾼다.
const MAJOR_MATCH_OPTIONS = [
    {value: 'match', label: '일치함'},
    {value: 'mismatch', label: '일치하지 않음'},
] as const

// 동업종 종사경력을 햇수로 받을 때 쓰는 정리 — 숫자가 아닌 것을 걷어내고 앞자리 0 도 정리한다
// (모바일 키보드를 숫자판으로 바꾸는 inputMode 만으로는 글자 입력·붙여넣기를 막지 못한다).
const formatYears = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
const YEARS_PLACEHOLDER = '0'

const staffField = (id: number, name: string) => `staff-${id}-${name}`

type StaffEntryProps = {
    id: number
    label: string
    /** "행추가" 로 늘린 카드인지 — 그 카드는 비어 있어도 처음부터 모두 필수다. */
    isAdded: boolean
    focusOnMount?: boolean
    /** 마지막 한 장 — 지우면 카드가 사라지는 대신 값만 비워진다. */
    isLastCard?: boolean
    onDelete: () => void
    cardRef: (node: HTMLDivElement | null) => void
    /** 구분 셀렉트의 항목 — 모형마다 다르다. */
    categories: readonly {value: string; label: string}[]
    /** [전공과 평가대상 기술 분야 일치여부] 칸을 둘지 — Tech-Index 창업용 시안에만 있다. */
    showMajorMatch?: boolean
    /** 동업종 종사경력의 단위 — 주면 그 칸이 숫자 칸이 되고 단위가 상자 안 오른쪽에 붙는다("년"). */
    industryCareerUnit?: string
}

const StaffEntry = ({
    id,
    label,
    isAdded,
    focusOnMount,
    isLastCard,
    onDelete,
    cardRef,
    categories,
    showMajorMatch,
    industryCareerUnit,
}: StaffEntryProps) => {
    const field = (name: string) => staffField(id, name)
    const {values, clearFieldError, setValue} = useFormValues()
    // 최종학력이 전공의 필수 여부를 가른다. 아직 고르지 않았다면 필수로 둔다 — 대부분의 학력이 그렇고,
    // 고졸을 고르는 순간 풀린다.
    const isMajorRequired = values[field('education')] !== EDUCATION_WITHOUT_MAJOR

    // 학력을 고졸로 바꾸면 전공은 더 이상 필수가 아니다 — 앞서 제출에서 걸린 "필수" 메시지가 남아 있으면
    // 고칠 것이 없는데도 오류로 보이므로 함께 지운다.
    const handleEducationChange = (value: string) => {
        if (value === EDUCATION_WITHOUT_MAJOR) clearFieldError(field('major'))
    }

    // 이 두 칸은 모형에 따라 놓이는 줄이 다르다(아래 showMajorMatch) — 같은 칸을 두 번 적지 않도록 여기서 만든다.
    // 전공 — 필수 여부가 이 카드의 최종학력에 달려 있다(위 isMajorRequired 참고).
    const majorEntry = (
        <Field id={field('major')} label="전공" required={isMajorRequired}>
            <ClearableInput
                id={field('major')}
                name={field('major')}
                required={isMajorRequired}
                autoComplete="off"
                placeholder="전공"
            />
        </Field>
    )
    // 동업종 종사경력 — 단위를 받으면 햇수를 적는 숫자 칸이 된다(시안은 값을 오른쪽에 붙이고 단위를 안에 둔다).
    // 그때는 지워서 비운 칸을 벗어날 때 0 으로 돌려놓는다 — 자리 안내가 "0" 이라 비워 두면 화면에는 0 으로
    // 보이는데 값은 비어 있어, 다 채운 것처럼 보이는데도 탭이 [작성중] 으로 남는다.
    const industryCareerEntry = (
        <Field id={field('industryCareer')} label="동업종 종사경력" required>
            {industryCareerUnit ? (
                <InputGroup>
                    <InputGroupInput
                        id={field('industryCareer')}
                        name={field('industryCareer')}
                        required
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder={YEARS_PLACEHOLDER}
                        format={formatYears}
                        onBlur={(event) => {
                            if (!event.currentTarget.value) setValue(field('industryCareer'), YEARS_PLACEHOLDER)
                        }}
                        className="text-right"
                    />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        {industryCareerUnit}
                    </InputGroupAddon>
                </InputGroup>
            ) : (
                <ClearableInput
                    id={field('industryCareer')}
                    name={field('industryCareer')}
                    required
                    autoComplete="off"
                    placeholder="동업종 종사경력"
                />
            )}
        </Field>
    )

    return (
        <RepeatCard
            ref={cardRef}
            title={label}
            // 이 탭은 폼 카드 제목(h2) 아래에 카드가 바로 온다 — 소제목이 없으므로 카드 제목이 h3 다.
            headingLevel={3}
            focusOnMount={focusOnMount}
            clearOnly={isLastCard}
            onDelete={onDelete}
        >
            <FormCardScope namePrefix={`staff-${id}-`} alwaysRequired={isAdded}>
                <FieldRow3>
                    <Field id={field('category')} label="구분" required>
                        <Select name={field('category')} required>
                            <SelectTrigger id={field('category')} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id={field('name')} label="이름" required>
                        <ClearableInput
                            id={field('name')}
                            name={field('name')}
                            required
                            autoComplete="off"
                            placeholder="이름"
                        />
                    </Field>
                    <Field id={field('role')} label="역할" required>
                        <ClearableInput
                            id={field('role')}
                            name={field('role')}
                            required
                            autoComplete="off"
                            placeholder="역할"
                        />
                    </Field>
                </FieldRow3>
                <FieldGrid>
                    <Field id={field('position')} label="직위" required>
                        <ClearableInput
                            id={field('position')}
                            name={field('position')}
                            required
                            autoComplete="off"
                            placeholder="직위"
                        />
                    </Field>
                    <Field id={field('education')} label="최종학력" required>
                        <Select name={field('education')} required onValueChange={handleEducationChange}>
                            <SelectTrigger id={field('education')} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {EDUCATION_LEVELS.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    {/* 일치여부 칸이 없는 모형은 시안대로 [전공 · 동업종 종사경력] 이 이 2열 줄에 이어 붙는다. */}
                    {showMajorMatch ? null : majorEntry}
                    {showMajorMatch ? null : industryCareerEntry}
                </FieldGrid>
                {/* 일치여부 칸이 있는 모형은 시안대로 마지막 줄이 [전공 · 일치여부 · 동업종 종사경력] 세 칸이다. */}
                {showMajorMatch ? (
                    <FieldRow3>
                        {majorEntry}
                        <Field id={field('majorMatch')} label="전공과 평가대상 기술 분야 일치여부" required>
                            <Select name={field('majorMatch')} required>
                                <SelectTrigger id={field('majorMatch')} className="w-full">
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
                        {industryCareerEntry}
                    </FieldRow3>
                ) : null}
            </FormCardScope>
        </RepeatCard>
    )
}

type TechStaffFormProps = {
    /** 카드 제목. 모형마다 이름이 다르다(Tech-Index "기술 인력 현황"). */
    title?: string
    /** 카드 제목 아래 안내. */
    subtitle?: string
    /** 인력 카드 앞에 오는 내용. Tech-Index 는 인원 요약 줄이 먼저 온다. */
    leading?: ReactNode
    /** 입력할 수 있는 카드 수. 넘기지 않으면 KTRS-FM 규칙(대표자 제외 2명)을 그대로 쓴다. */
    maxCount?: number
    /** 구분 셀렉트의 항목. 넘기지 않으면 KTRS-FM 항목(연구·개발·기타)을 그대로 쓴다. */
    categories?: readonly {value: string; label: string}[]
    /** 카드에 [전공과 평가대상 기술 분야 일치여부] 칸을 둘지 — Tech-Index 창업용 시안에만 있다. */
    showMajorMatch?: boolean
    /** 동업종 종사경력의 단위. 주면 그 칸이 숫자 칸이 된다(Tech-Index 창업용 시안은 "년"). */
    industryCareerUnit?: string
}

const TechStaffForm = ({
    title = '핵심 기술 인력 현황',
    subtitle = '대표자 제외 최대 2명 입력',
    leading,
    maxCount = MAX_STAFF_COUNT,
    categories = STAFF_CATEGORIES,
    showMajorMatch,
    industryCareerUnit,
}: TechStaffFormProps) => {
    const {clearValues} = useFormValues()
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard, isAddDisabled} = useRepeatCards({
        maxCount,
        // 지운 칸의 값도 함께 버린다 — 남겨두면 제출 데이터에 유령 값이 섞인다.
        onRemove: (id) => clearValues(`staff-${id}-`),
    })

    return (
        <FormCard title={title} subtitle={subtitle}>
            <div className="flex flex-col gap-6">
                {/* 모형에 따라 앞에 오는 줄(Tech-Index 의 인원 요약). 넘기지 않으면 카드만 그린다. */}
                {leading ? <Fragment key="staff-leading">{leading}</Fragment> : null}
                {ids.map((id, index) => (
                    <StaffEntry
                        key={id}
                        id={id}
                        cardRef={setCardRef(id)}
                        categories={categories}
                        showMajorMatch={showMajorMatch}
                        industryCareerUnit={industryCareerUnit}
                        label={`구분${index + 1}`}
                        isAdded={index > 0}
                        focusOnMount={id === addedId}
                        isLastCard={isLastCard}
                        onDelete={() => removeCard(id)}
                    />
                ))}
                {/* 행추가 — 시안은 카드 폭 전체를 채우는 primary 버튼이다. */}
                <Button
                    type="button"
                    ref={addButtonRef}
                    size="sm"
                    className="w-full"
                    disabled={isAddDisabled}
                    onClick={addCard}
                >
                    행추가
                    <Plus aria-hidden="true" />
                </Button>
            </div>
        </FormCard>
    )
}

export default TechStaffForm
export {TECH_INDEX_STAFF_CATEGORIES}
export type {TechStaffFormProps}
