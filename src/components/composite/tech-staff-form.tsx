'use client'

import {Plus} from 'lucide-react'
import {FormCard} from '@/components/composite/form-card'
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {Button} from '@/components/ui/button'
import {
    ClearableInput,
    FormCardScope,
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
}

const StaffEntry = ({id, label, isAdded, focusOnMount, isLastCard, onDelete, cardRef}: StaffEntryProps) => {
    const field = (name: string) => staffField(id, name)

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
                                {STAFF_CATEGORIES.map((category) => (
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
                        <Select name={field('education')} required>
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
                    <Field id={field('major')} label="전공" required>
                        <ClearableInput
                            id={field('major')}
                            name={field('major')}
                            required
                            autoComplete="off"
                            placeholder="전공"
                        />
                    </Field>
                    <Field id={field('industryCareer')} label="동업종 종사경력" required>
                        <ClearableInput
                            id={field('industryCareer')}
                            name={field('industryCareer')}
                            required
                            autoComplete="off"
                            placeholder="동업종 종사경력"
                        />
                    </Field>
                </FieldGrid>
            </FormCardScope>
        </RepeatCard>
    )
}

const TechStaffForm = () => {
    const {clearValues} = useFormValues()
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard, isAddDisabled} = useRepeatCards({
        maxCount: MAX_STAFF_COUNT,
        // 지운 칸의 값도 함께 버린다 — 남겨두면 제출 데이터에 유령 값이 섞인다.
        onRemove: (id) => clearValues(`staff-${id}-`),
    })

    return (
        <FormCard title="핵심 기술 인력 현황" subtitle="대표자 제외 최대 2명 입력">
            <div className="flex flex-col gap-6">
                {ids.map((id, index) => (
                    <StaffEntry
                        key={id}
                        id={id}
                        cardRef={setCardRef(id)}
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
