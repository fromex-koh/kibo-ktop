'use client'

import {useState, type ReactNode} from 'react'
import {differenceInMonths, parseISO} from 'date-fns'
import {Plus} from 'lucide-react'
import {CareerInputHelpDialog} from '@/components/composite/career-input-help-dialog'
import {FormCard} from '@/components/composite/form-card'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {SubSectionHeader, SubSectionHeaderTitle} from '@/components/composite/sub-section-header'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
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
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {Field, FieldGrid, FieldRow3} from '@/components/composite/form-fields'
import {DateField} from '@/components/composite/date-field'

// 대표자 경력사항 탭 본문 — Figma "대표자 경력사항" 탭 컨텐츠(1200×1264) 전체.
// 자가진단 입력 화면과 FormTabs 컴포넌트 가이드가 같은 것을 보도록 여기 한 벌만 둔다.
//
// 경력 카드 안의 칸은 카드 단위로 필수다 — 전부 비우거나 전부 채우거나 둘 중 하나다.
// 기본으로 주어지는 첫 카드는 손대지 않으면 검사하지 않고, "행추가" 로 늘린 카드는 처음부터 모두 필수다.
// 판정은 FormCardScope 가 맡는다(그쪽 주석에 규칙을 적어 두었다).
// 시안 파일에는 라벨마다 `*` 레이어와 "대표자 경력사항의 모든 정보는 필수 입력정보입니다." 안내가 들어
// 있지만 이 화면에서는 꺼져 있었다. `*` 는 되살리고 안내 문구는 두지 않는다 — 지금 규칙과 뜻이 달라졌고,
// 문구를 되살리는 것은 디자인 결정이 먼저다.

// 어긋난 연월을 고른 순간 띄우는 알림 문구 — 어느 칸을 고쳤든 "지금 상태" 를 설명한다.
const RANGE_ALERT_MESSAGE = {
    order: '근무종료연월은 근무시작연월 이후로 선택해 주세요.',
    same: '근무시작연월과 근무종료연월은 동일하게 선택할 수 없습니다.',
} as const

type RangeViolation = keyof typeof RANGE_ALERT_MESSAGE

const MONTHS_PER_YEAR = 12
// 처음 화면에는 빈 칸 하나만 둔다 — 나머지는 "행추가" 로 늘린다(시안의 경력1·2·3 은 여러 건 입력 예시).

// 값의 키는 칸이 지워져도 흔들리지 않도록 화면 번호가 아니라 고유 번호로 만든다 —
// 가운데 칸을 지웠을 때 아래 칸의 값이 위로 밀려 올라가지 않는다. 보이는 번호는 순서대로 다시 매긴다.
const careerField = (id: number, name: string) => `career-${id}-${name}`

// 입력한 근무 기간을 모두 더한 개월 수. 시작·종료가 모두 있고 순서가 맞는 칸만 센다.
const getTotalCareerMonths = (ids: readonly number[], values: Record<string, string>) =>
    ids.reduce((total, id) => {
        const start = values[careerField(id, 'start')]
        const end = values[careerField(id, 'end')]
        if (!start || !end) return total

        const months = differenceInMonths(parseISO(end), parseISO(start))

        return months > 0 ? total + months : total
    }, 0)

type CareerEntryProps = {
    id: number
    label: string
    /** "행추가" 로 늘린 카드인지 — 그 카드는 비어 있어도 처음부터 모두 필수다. */
    isAdded: boolean
    onInvalidRange: (violation: RangeViolation) => void
    focusOnMount?: boolean
    /** 마지막 한 장 — 지우면 카드가 사라지는 대신 값만 비워진다. */
    isLastCard?: boolean
    onDelete: () => void
    cardRef: (node: HTMLDivElement | null) => void
}

const CareerEntry = ({
    id,
    label,
    isAdded,
    onInvalidRange,
    focusOnMount,
    isLastCard,
    onDelete,
    cardRef,
}: CareerEntryProps) => {
    const field = (name: string) => careerField(id, name)

    return (
        <RepeatCard ref={cardRef} title={label} focusOnMount={focusOnMount} clearOnly={isLastCard} onDelete={onDelete}>
            <FormCardScope namePrefix={`career-${id}-`} alwaysRequired={isAdded}>
                <FieldGrid>
                    {/* 지난 경력을 적는 칸이라 오늘 이후를 고를 수 없고, 두 칸의 앞뒤 순서도 서로를 막는다. */}
                    <DateField
                        id={field('start')}
                        name={field('start')}
                        label="근무시작 년월"
                        granularity="month"
                        required
                        rangeEnd={{
                            name: field('end'),
                            message: '근무시작연월은 근무종료연월 이전으로 선택해 주세요.',
                        }}
                        onInvalidSelect={onInvalidRange}
                    />
                    <DateField
                        id={field('end')}
                        name={field('end')}
                        label="근무종료 년월"
                        granularity="month"
                        required
                        rangeStart={{
                            name: field('start'),
                            message: '근무종료연월은 근무시작연월 이후로 선택해 주세요.',
                        }}
                        onInvalidSelect={onInvalidRange}
                    />
                    <Field id={field('company')} label="근무처" required>
                        <ClearableInput
                            id={field('company')}
                            name={field('company')}
                            required
                            autoComplete="off"
                            placeholder="근무처"
                        />
                    </Field>
                    <Field id={field('industry')} label="업종" required>
                        <ClearableInput
                            id={field('industry')}
                            name={field('industry')}
                            required
                            autoComplete="off"
                            placeholder="업종"
                        />
                    </Field>
                </FieldGrid>
                <FieldRow3>
                    <Field id={field('same-industry')} label="동업종 여부" required>
                        <Select name={field('same-industry')} required>
                            <SelectTrigger id={field('same-industry')} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">예</SelectItem>
                                <SelectItem value="no">아니오</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id={field('duty')} label="담당업무" required>
                        <ClearableInput
                            id={field('duty')}
                            name={field('duty')}
                            required
                            autoComplete="off"
                            placeholder="담당업무"
                        />
                    </Field>
                    <Field id={field('rank')} label="최종직급" required>
                        <ClearableInput
                            id={field('rank')}
                            name={field('rank')}
                            required
                            autoComplete="off"
                            placeholder="최종직급"
                        />
                    </Field>
                </FieldRow3>
            </FormCardScope>
        </RepeatCard>
    )
}

type CareerFormProps = {
    /** 카드 제목. 앞에 구획이 더 붙는 모형은 제목이 달라진다(Tech-Index "대표자 역량 및 경력사항"). */
    title?: string
    /** 경력사항 구획 앞에 오는 내용. Tech-Index 는 [대표자 역량] 구획이 먼저 온다. */
    leading?: ReactNode
}

const CareerForm = ({title = '대표자 경력사항', leading}: CareerFormProps) => {
    const {values, clearValues} = useFormValues()
    // 카드가 여러 개여도 팝업은 한 벌만 둔다 — 한 번에 하나만 뜬다.
    const [rangeViolation, setRangeViolation] = useState<RangeViolation | null>(null)
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard} = useRepeatCards({
        // 지운 칸의 값도 함께 버린다 — 남겨두면 제출 데이터에 유령 값이 섞인다.
        onRemove: (id) => clearValues(`career-${id}-`),
    })

    const totalMonths = getTotalCareerMonths(ids, values)

    return (
        <FormCard
            title={title}
            // 시안은 이 줄에 불릿을 두지 않는다(같은 리스트의 다른 줄과 달리 점 레이어가 꺼져 있다).
            subtitle="대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로 차례대로 입력해주십시오."
            // 버튼 이름은 열리는 모달의 제목과 같게 둔다 — 눌러서 무엇이 나오는지 그대로 읽힌다[6.4.3].
            action={
                <CareerInputHelpDialog>
                    <Button type="button" variant="secondary" size="sm">
                        입력 도움말
                    </Button>
                </CareerInputHelpDialog>
            }
        >
            <div className="flex flex-col gap-6">
                {/* 모형에 따라 앞에 오는 구획(Tech-Index 의 [대표자 역량]). 넘기지 않으면 경력사항만 그린다. */}
                {leading ? (
                    <>
                        {leading}
                        <Separator />
                    </>
                ) : null}
                {/* 구획 제목 옆에 합계가 붙는다 — 입력한 근무 기간을 더한 값이라 입력에 따라 바뀐다. */}
                <SubSectionHeader>
                    <SubSectionHeaderTitle className="flex flex-wrap items-baseline gap-2">
                        경력사항
                        <span aria-live="polite" className="typo-body-xl-regular text-label-foreground">
                            총 경력 연수 {Math.floor(totalMonths / MONTHS_PER_YEAR)}년 {totalMonths % MONTHS_PER_YEAR}
                            개월
                        </span>
                    </SubSectionHeaderTitle>
                </SubSectionHeader>
                {ids.map((id, index) => (
                    <CareerEntry
                        key={id}
                        id={id}
                        cardRef={setCardRef(id)}
                        label={`경력${index + 1}`}
                        isAdded={index > 0}
                        onInvalidRange={setRangeViolation}
                        focusOnMount={id === addedId}
                        isLastCard={isLastCard}
                        onDelete={() => removeCard(id)}
                    />
                ))}
                {/* 행추가 — 시안은 카드 폭 전체를 채우는 primary 버튼이다. */}
                <Button type="button" ref={addButtonRef} size="sm" className="w-full" onClick={addCard}>
                    행추가
                    <Plus aria-hidden="true" />
                </Button>
            </div>
            {/* 어긋난 연월을 고른 순간 알리는 팝업 — 안내만 하고 고를 것이 없어 공용 안내 모달을 쓴다. */}
            <NoticeDialog
                title="근무기간 확인"
                message={rangeViolation ? RANGE_ALERT_MESSAGE[rangeViolation] : null}
                open={rangeViolation !== null}
                onOpenChange={(open) => (open ? undefined : setRangeViolation(null))}
            />
        </FormCard>
    )
}

export default CareerForm
export type {CareerFormProps}
