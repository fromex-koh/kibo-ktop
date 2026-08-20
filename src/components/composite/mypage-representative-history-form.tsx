'use client'

import {useMemo, useRef, useState} from 'react'
import {CircleQuestionMark, Plus} from 'lucide-react'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {CareerInputHelpDialog} from '@/components/composite/career-input-help-dialog'
import {DateField} from '@/components/composite/date-field'
import {EditCancelConfirmDialog} from '@/components/composite/edit-cancel-confirm-dialog'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {Field, FieldGrid, FieldRow3} from '@/components/composite/form-fields'
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {
    ClearableInput,
    FormCardScope,
    FormValuesProvider,
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
import {MypageFormCard} from '@/components/composite/mypage-form-card'
import {SaveConfirmDialog} from '@/components/composite/save-confirm-dialog'
import {Button} from '@/components/ui/button'
import {
    CAREER_DUTY,
    CAREER_END,
    CAREER_INDUSTRY,
    CAREER_PREFIX,
    CAREER_RANK,
    CAREER_SAME_INDUSTRY,
    CAREER_START,
    CAREER_WORKPLACE,
    careerField,
    EDUCATION_FIELD,
    MAJOR_FIELD,
    REGISTERED_CAREER_COUNT,
    SAME_INDUSTRY_OPTIONS,
    withoutEmptyCareers,
} from '@/constants/mypage-representative-history'
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

// 기업 마이페이지 (2) 대표자(경영자) 역량 및 경력 — Figma "[마이페이지] 내 정보"(대표자 이력).
// 평가 신청 때 받아 둔 대표자 이력을 이 화면에서 확인하고 고친다.
//
// 같은 칸이 기술평가 신청의 [대표자 역량 및 경력사항] 탭에도 있지만 화면이 다르다 — 탭이 없고,
// 두 구획이 각각 카드가 되며(내 정보와 같은 MypageFormCard), 총 경력 연수를 세지 않는다.
// 그래서 낮은 조각(Field·FieldGrid·RepeatCard)만 함께 쓰고 배치는 이 화면이 갖는다.
//
// [필수] 두 구획의 모든 칸이 필수다. 시안은 [대표자 경력사항] 쪽에 * 를 두지 않았지만, 반쯤 적힌
// 경력은 그 자체로 쓸 수 없는 값이라 화면에도 필수로 표시하고 제출도 막는다.
//
// 줄 구성(콘텐츠 폭 792, 칸 사이 24 — 2열 384):
//   경영자 역량   최종학력 · 졸업년도 / 학교명(입력+구분) · 전공 / 수학상태 · 학위 취득
//   대표자 경력사항 [경력N] 카드마다 근무시작 년월 · 근무종료 년월 / 근무지 · 업종 /
//                  동업종 여부 · 담당업무 · 최종직급(3열)

// [경영자 역량] — 대표자의 최종학력.
const CapabilitySection = () => {
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
        <MypageFormCard title="경영자 역량" subtitle="대표자의 최종학력을 기입해주세요.">
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

                {/* 졸업년도 — 단위 "년" 은 자리 안내(placeholder)가 아니라 상자 안 오른쪽 단위로 둔다.
                placeholder 는 값을 넣는 순간 사라져 "2008" 만 남고 무엇의 네 자리인지 알 수 없게 된다.
                숫자·자릿수 처리는 representative-capability 의 formatGraduationYear 참고. */}
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
                            placeholder="학교명을 입력해 주세요"
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
            최종학력에서 이미 고른 값이라 같은 사실을 두 번 묻는 자리가 된다(신청 화면과 같은 규칙). */}
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
        </MypageFormCard>
    )
}

// 카드가 비었는지 — 그 카드에 속한 값이 하나라도 차 있으면 "쓰기 시작한 카드" 다.
//
// 판정을 "처음 값과 달라졌는지" 가 아니라 "값이 있는지" 로 하는 이유 — 이 화면은 등록된 경력을 서버에서
// 채워 내려받는다. 달라졌는지로 보면, 채워져 내려온 카드에서 한 칸만 지웠을 때 그 칸은 빈값이고 나머지는
// 처음 값 그대로라 "손대지 않은 카드" 로 잡혀, 한 칸이 빈 채로 제출된다.
const useIsCardFilled = (namePrefix: string) => {
    const {values} = useFormValues()

    return Object.entries(values).some(([name, value]) => name.startsWith(namePrefix) && value !== '')
}

// 경력 한 건 — 카드 한 장이다. 값의 이름은 카드 고유 번호로 만들어(career-2-start) 가운데 카드를
// 지워도 아래 카드의 값이 위로 밀려 올라가지 않는다.
//
// [필수] 카드 단위로 본다 — 전부 비우거나 전부 채우거나 둘 중 하나다(신청 화면의 경력사항과 같은 규칙).
//   · 완전히 빈 카드는 검사하지 않는다. 적을 경력이 없는 대표자가 빈 카드 한 장 때문에 저장하지 못하면
//     안 되고, 등록된 경력을 모두 지운 경우도 같은 상태다.
//   · 한 칸이라도 채우면 그때부터 그 카드의 나머지 칸이 모두 필수가 된다 — 반쯤 적힌 경력은 그 자체로
//     쓸 수 없는 값이다.
//   · 라벨의 * 는 늘 보인다. 카드를 채우기 시작하면 필수가 되는 칸이 무엇인지 미리 알려 준다.
// 판정과 적용은 FormCardScope 가 맡는다 — 카드가 찼는지를 alwaysRequired 로 넘기면 그 안의 모든 입력이
// 같은 답을 쓴다(입력마다 조건을 따로 적지 않는다).
const CareerEntry = ({
    id,
    label,
    focusOnMount,
    isLastCard,
    onDelete,
    cardRef,
}: {
    id: number
    label: string
    focusOnMount?: boolean
    /** 마지막 한 장 — 지우면 카드가 사라지는 대신 값만 비워진다. */
    isLastCard?: boolean
    onDelete: () => void
    cardRef: (node: HTMLDivElement | null) => void
}) => {
    const namePrefix = `${CAREER_PREFIX}-${id}-`
    const field = (name: string) => careerField(id, name)
    const isFilled = useIsCardFilled(namePrefix)

    return (
        // 카드 제목(h2) 아래 바로 오는 카드라 제목은 h3 다 — 레벨을 건너뛰지 않는다[6.4.2].
        <RepeatCard
            ref={cardRef}
            title={label}
            headingLevel={3}
            focusOnMount={focusOnMount}
            clearOnly={isLastCard}
            onDelete={onDelete}
        >
            <FormCardScope namePrefix={namePrefix} alwaysRequired={isFilled}>
                <FieldGrid>
                    {/* 지난 경력을 적는 칸이라 오늘 이후를 고를 수 없고, 두 칸의 앞뒤 순서도 서로를 막는다. */}
                    <DateField
                        id={field(CAREER_START)}
                        name={field(CAREER_START)}
                        label="근무시작 년월"
                        granularity="month"
                        required
                        rangeEnd={{
                            name: field(CAREER_END),
                            message: '근무시작연월은 근무종료연월 이전으로 선택해 주세요.',
                        }}
                    />
                    <DateField
                        id={field(CAREER_END)}
                        name={field(CAREER_END)}
                        label="근무종료 년월"
                        granularity="month"
                        required
                        rangeStart={{
                            name: field(CAREER_START),
                            message: '근무종료연월은 근무시작연월 이후로 선택해 주세요.',
                        }}
                    />
                    <Field id={field(CAREER_WORKPLACE)} label="근무지" required>
                        <ClearableInput
                            id={field(CAREER_WORKPLACE)}
                            name={field(CAREER_WORKPLACE)}
                            required
                            placeholder="근무지"
                            autoComplete="off"
                        />
                    </Field>
                    <Field id={field(CAREER_INDUSTRY)} label="업종" required>
                        <ClearableInput
                            id={field(CAREER_INDUSTRY)}
                            name={field(CAREER_INDUSTRY)}
                            required
                            placeholder="업종"
                            autoComplete="off"
                        />
                    </Field>
                </FieldGrid>
                <FieldRow3>
                    <Field id={field(CAREER_SAME_INDUSTRY)} label="동업종 여부" required>
                        <Select name={field(CAREER_SAME_INDUSTRY)} required>
                            <SelectTrigger id={field(CAREER_SAME_INDUSTRY)} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {SAME_INDUSTRY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id={field(CAREER_DUTY)} label="담당업무" required>
                        <ClearableInput
                            id={field(CAREER_DUTY)}
                            name={field(CAREER_DUTY)}
                            required
                            placeholder="담당업무"
                            autoComplete="off"
                        />
                    </Field>
                    <Field id={field(CAREER_RANK)} label="최종직급" required>
                        <ClearableInput
                            id={field(CAREER_RANK)}
                            name={field(CAREER_RANK)}
                            required
                            placeholder="최종직급"
                            autoComplete="off"
                        />
                    </Field>
                </FieldRow3>
            </FormCardScope>
        </RepeatCard>
    )
}

// [대표자 경력사항] — 등록된 경력 건수만큼 카드가 그려지고, [행추가] 로 늘린다(신청 화면과 같은 틀).
//
// 제목 옆의 물음표는 어떤 순서·형식으로 적는지 보여 주는 도움말을 연다. 시안은 아이콘만 두었지만,
// 마우스를 올려야만 뜨는 툴팁으로 두면 키보드·터치에서 볼 방법이 없어 신청 화면이 이미 쓰고 있는
// [입력 도움말] 모달을 그대로 연다[6.1.1].
const CareerSection = () => {
    const {clearValues} = useFormValues()
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard} = useRepeatCards({
        // 등록된 경력이 없으면 빈 카드 한 장으로 연다 — 카드가 하나도 없으면 어디에 적어야 할지
        // 알 수 없고, [행추가] 를 먼저 눌러야 시작되는 화면이 된다.
        initialCount: Math.max(1, REGISTERED_CAREER_COUNT),
        // 지운 칸의 값도 함께 버린다 — 남겨두면 제출 데이터에 유령 값이 섞인다.
        onRemove: (id) => clearValues(`${CAREER_PREFIX}-${id}-`),
    })

    return (
        <MypageFormCard
            // 제목 옆 물음표는 카드 제목(h2) 안에 함께 놓인다 — 시안의 "툴팁" 묶음 그대로다.
            title={
                <span className="flex flex-wrap items-center gap-2">
                    대표자 경력사항
                    <CareerInputHelpDialog>
                        <Button type="button" variant="plain" size="icon-md" aria-label="경력 입력 도움말">
                            <CircleQuestionMark aria-hidden="true" />
                        </Button>
                    </CareerInputHelpDialog>
                </span>
            }
            subtitle="대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로 차례대로 입력해주십시오."
        >
            <div className="flex flex-col gap-6">
                {ids.map((id, index) => (
                    <CareerEntry
                        key={id}
                        id={id}
                        cardRef={setCardRef(id)}
                        label={`경력${index + 1}`}
                        focusOnMount={id === addedId}
                        isLastCard={isLastCard}
                        onDelete={() => removeCard(id)}
                    />
                ))}
                {/* 행추가 — 신청 화면과 같이 카드 폭 전체를 채우는 primary 버튼이다. */}
                <Button type="button" ref={addButtonRef} size="sm" className="w-full" onClick={addCard}>
                    행추가
                    <Plus aria-hidden="true" />
                </Button>
            </div>
        </MypageFormCard>
    )
}

// 화면에 들어올 때 꽂힌 값과 지금 값이 다른지 — [취소]·[저장] 이 함께 쓴다.
// 고쳤다가 되돌리면 다시 false 다(내 정보 화면과 같은 규칙).
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
// 검사에 걸렸다고 버튼을 닫아 두면 무엇이 잘못됐는지 모른 채 눌리지 않는 버튼만 보게 되므로,
// 눌렀을 때 검사해서 걸린 칸에 문구를 띄우고 그 칸으로 데려간다[7.4.2].
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
//
// 값만 되돌리면 지운 경력 카드가 돌아오지 않는다 — 카드가 몇 장인지는 값이 아니라 목록의 상태라,
// 그 목록을 처음으로 돌리는 일은 목록을 쥔 쪽(onRestore)에 맡긴다.
const CancelButton = ({onRestore}: {onRestore: () => void}) => {
    const {values, defaultValues, setValue, setFieldErrors} = useFormValues()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const isDirty = useIsDirty()

    const handleConfirm = () => {
        new Set([...Object.keys(defaultValues), ...Object.keys(values)]).forEach((name) =>
            setValue(name, defaultValues[name] ?? ''),
        )
        setFieldErrors({})
        onRestore()
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

// 이 폼은 탭이 없어 섹션이 하나다 — 공통 관문이 요구하는 이름만 채운다.
const HISTORY_SECTION = 'representative-history'

// 검사와 제출 — 탭 폼이 쓰는 공통 관문을 그대로 쓴다. 걸린 칸에 문구를 띄우고 그 칸으로 옮겨 주는
// 일까지 그쪽이 맡아, 오류 문구의 말투가 다른 화면과 같아진다.
const HistoryFormBody = () => {
    const {handleSubmit} = useFormTabsSubmit({defaultTab: HISTORY_SECTION})
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    // [취소] 로 되돌릴 때 경력 카드 목록도 처음으로 돌린다 — 이 값을 바꾸면 구획이 새로 그려지고
    // 카드 수·번호가 등록된 경력 그대로 다시 잡힌다(지운 카드가 돌아온다).
    const [careerResetKey, setCareerResetKey] = useState(0)
    // 검사를 통과한 값 — 모달에서 [저장] 을 누를 때까지 들고 있는다. 화면을 다시 그리게 할 값이
    // 아니라서 상태가 아니라 ref 다.
    const submittedValues = useRef<Record<string, string>>({})

    const handleValid = (values: Record<string, string>) => {
        // 빈 경력 카드는 보내지 않는다 — 화면에는 늘 카드가 한 장 이상 있지만, 아무것도 적지 않은 카드는
        // 등록할 경력이 아니다.
        submittedValues.current = withoutEmptyCareers(values)
        setIsConfirmOpen(true)
    }

    const handleSave = () => {
        // [프론트엔드 연동][저장] 대표자 이력 수정 API 는 이 자리에서 호출한다.
        console.log('[프론트엔드 연동][저장] 마이페이지 대표자 이력', submittedValues.current)
        setIsConfirmOpen(false)
    }

    return (
        <form
            id="representative-history-form"
            noValidate
            onSubmit={(event) => handleSubmit(event, handleValid)}
            className="flex flex-col"
        >
            {/* 구획 사이 60 — 시안 실측. */}
            <div className="flex flex-col gap-15">
                <CapabilitySection />
                <CareerSection key={careerResetKey} />
            </div>

            {/* 시안: 마지막 칸과 CTA 사이 100(=구획 간격 60 + 40), 버튼 짝은 16 간격이다. */}
            <ActionBar className="mt-25">
                <ActionBarCenter className="gap-4">
                    <CancelButton onRestore={() => setCareerResetKey((key) => key + 1)} />
                    <SaveButton />
                </ActionBarCenter>
            </ActionBar>
            <SaveConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onSave={handleSave} />
        </form>
    )
}

const MypageRepresentativeHistoryForm = ({defaultValues}: {defaultValues: Record<string, string>}) => (
    <FormValuesProvider defaultValues={defaultValues}>
        <HistoryFormBody />
    </FormValuesProvider>
)

export default MypageRepresentativeHistoryForm
