'use client'

import {useEffect, useSyncExternalStore} from 'react'
import {isAfter, isBefore, isSameDay, isSameMonth, parseISO, startOfDay, startOfMonth} from 'date-fns'
import {DatePicker, useClearFieldError, useFieldValue} from '@/components/composite/form-values'
import {Field} from '@/components/composite/form-fields'

// 날짜 한 칸 — 지난 일을 적는 입력(설립일·근무 시작·종료)에 쓴다. 규칙을 두 가지로 나눠 다룬다.
//
//   1. 지금 이후 — 달력에서 아예 고를 수 없게 막는다. "지난 일을 적는 칸에 미래가 없다" 는 설명이
//      필요 없는 제약이라, 회색으로 비활성인 것만 봐도 이유가 통한다.
//   2. 짝이 되는 칸과의 관계(앞뒤 순서 · 기간) — 고를 수 있게 열어 두고, 고른 뒤에 무엇이 어긋났는지
//      알려 준다. 달력에서 막아 버리면 사용자는 왜 안 눌리는지 모른 채 고장으로 읽는다. 스스로 잘못 넣은
//      것을 알아채고 고칠 수 있어야 한다[7.4.2]. 제출도 함께 막는다(DatePicker 의 validationMessage).
//
// 고르는 단위에 따라 "지금" 이 가리키는 범위가 달라진다 — 일 단위는 오늘 하루, 월 단위는 이번 달이다.
const FUTURE_MESSAGE = {
    day: '오늘 이후 날짜는 선택할 수 없습니다.',
    month: '이번 달 이후는 선택할 수 없습니다.',
} as const
// 시작과 종료가 같으면 기간이 한 단위에 못 미친다 — 어느 달이냐와 상관없이 성립하지 않는 기간이다.
const SAME_UNIT_MESSAGE = {
    day: '시작과 종료가 같은 날이면 기간이 없습니다. 다른 날로 선택해 주세요.',
    month: '시작과 종료가 같은 연월이면 기간이 1개월 미만입니다. 다른 연월로 선택해 주세요.',
} as const

// 오늘은 브라우저 기준으로 잡는다 — 서버 시간대와 사용자 시간대가 다르면 날짜가 하루 어긋난다.
// 서버 렌더에서는 값이 없어 제한을 걸지 않고, 하이드레이션 직후 실제 오늘로 채워진다(FormTabs 와 같은 방식).
const subscribeToNothing = () => () => undefined
let cachedToday: Date | undefined
const getToday = () => {
    if (!cachedToday) cachedToday = startOfDay(new Date())

    return cachedToday
}
const getNoToday = () => undefined
const useToday = () => useSyncExternalStore(subscribeToNothing, getToday, getNoToday)

const toDate = (value?: string) => (value ? parseISO(value) : undefined)

// 짝이 되는 칸 — 그 칸의 값이 경계가 되고, 어긋나면 message 를 이 칸 밑에 띄운다.
// 문구를 여기서 만들지 않고 받는 이유 — "무엇을 어떻게 고쳐야 하는지" 는 두 칸의 관계를 아는 화면이
// 가장 정확하게 쓸 수 있다(라벨을 이어 붙이면 "근무시작 년월보다 이후 날짜는…" 처럼 딱딱해진다).
type PairedField = {name: string; message: string}

// 짝과 어긋나는 값을 "고른 순간" 알리는 이유 — 어느 쪽이 잘못됐는지는 화면이 문구로 정하고,
// 여기서는 무엇이 어긋났는지만 알린다.
type RangeViolation = 'order' | 'same'

type DateFieldProps = {
    id: string
    name: string
    label: string
    required?: boolean
    helper?: string
    /** 고르는 단위. 라벨이 "년월" 인 칸은 month 로 두어 일까지 고르지 않게 한다. */
    granularity?: 'day' | 'month'
    /** 이 칸이 시작일일 때 짝이 되는 종료일. 종료일보다 뒤를 고르면 그 message 가 뜨고 제출이 막힌다. */
    rangeEnd?: PairedField
    /** 이 칸이 종료일일 때 짝이 되는 시작일. 시작일보다 앞을 고르면 그 message 가 뜨고 제출이 막힌다. */
    rangeStart?: PairedField
    /** 짝과 어긋나는 값을 고른 직후 한 번 호출된다 — 화면이 팝업 등으로 즉시 알릴 때 쓴다. */
    onInvalidSelect?: (violation: RangeViolation) => void
}

const DateField = ({
    id,
    name,
    label,
    required,
    helper,
    granularity = 'day',
    rangeEnd,
    rangeStart,
    onInvalidSelect,
}: DateFieldProps) => {
    const today = useToday()
    const isMonthly = granularity === 'month'
    // 월 단위에서는 "이번 달 1일" 이 상한이다 — 그 달 안의 날짜는 모두 지금까지로 본다.
    const upperBound = today && isMonthly ? startOfMonth(today) : today
    const isSameUnit = isMonthly ? isSameMonth : isSameDay
    const rawValue = useFieldValue(name)?.value
    const value = toDate(rawValue)
    const endValue = toDate(useFieldValue(rangeEnd?.name)?.value)
    const startValue = toDate(useFieldValue(rangeStart?.name)?.value)

    // 먼저 걸리는 것 하나만 보여 준다 — 한 칸에 메시지 두 줄은 읽기 어렵다.
    // 짝과 함께 봐야 아는 것 — 시작과 종료가 같으면 기간이 성립하지 않는다(두 칸 모두에 같은 메시지가 뜬다).
    const pairValue = endValue ?? startValue
    const isSameUnitRange = Boolean(value && pairValue && isSameUnit(value, pairValue))

    const message = !value
        ? undefined
        : upperBound && isAfter(value, upperBound)
          ? FUTURE_MESSAGE[granularity]
          : isSameUnitRange
            ? SAME_UNIT_MESSAGE[granularity]
            : endValue && isAfter(value, endValue) && rangeEnd
              ? rangeEnd.message
              : startValue && isBefore(value, startValue) && rangeStart
                ? rangeStart.message
                : undefined
    // 고른 순간의 알림은 팝업이 맡는다(onInvalidSelect) — 칸 밑에는 문구를 두지 않고 빨간 테두리만 남긴다.
    // 제출할 때 걸리면 그때는 다른 칸들과 똑같이 칸 밑에 메시지가 붙는다(Field 가 그린다).
    const describedBy = helper ? `${id}-helper` : undefined

    // 짝을 고쳐 이 칸이 함께 맞게 되면 제출 때 남은 메시지를 거둔다 — 이 칸의 값은 그대로라
    // 입력 래퍼의 자동 정리에 걸리지 않는다. 값이 비었을 때는 두어야 한다("필수" 메시지가 지워지면 안 된다).
    // 고른 직후에만 알린다 — 불러온 값으로 화면이 처음 그려질 때는 팝업이 뜨지 않아야 한다.
    const handleSelect = (date?: Date) => {
        const pair = endValue ?? startValue
        if (!date || !pair || !onInvalidSelect) return

        if (isSameUnit(date, pair)) onInvalidSelect('same')
        else if ((rangeEnd && isAfter(date, pair)) || (rangeStart && isBefore(date, pair))) onInvalidSelect('order')
    }

    const clearSubmitError = useClearFieldError(id)
    useEffect(() => {
        if (rawValue && !message) clearSubmitError()
    }, [rawValue, message, clearSubmitError])

    return (
        <Field id={id} label={label} required={required} helper={helper}>
            <DatePicker
                id={id}
                name={name}
                granularity={granularity}
                required={required}
                onChange={handleSelect}
                // 지금 이후만 달력에서 막는다 — 짝과의 순서는 고른 뒤 메시지로 알린다.
                maxDate={upperBound}
                validationMessage={message}
                aria-invalid={message ? true : undefined}
                aria-describedby={describedBy}
            />
        </Field>
    )
}

export {DateField}
