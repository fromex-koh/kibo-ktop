import {addDays, differenceInCalendarDays, isSameDay, subDays} from 'date-fns'

// 이용중지 정책 계산 — 입력 팝업 요약과 목업 카드 갱신이 같은 식을 쓴다(기준: 기획 노트).
//   · 시작일 = 팝업에 진입한 날(오늘, 읽기 전용). 사용자는 종료일만 고른다.
//   · 종료일 범위: 신청 = 다음 날 ~ 365일 후 / 변경 = 오늘 ~ 기존 종료일 전날(앞당기기만, 연장 불가).
//   · 이용중지 일수 = 종료일 − 시작일(시작일 제외). 재개일 = 종료일 다음 날.
//   · 만료일 = 원래 만료일(이용중지 없을 때) + 실제 이용중지 일수. 적용 후 이용기간 = 재개일 ~ 만료일.
//       예) 10-10 신청 · 종료 10-16 → 6일, 재개 10-17, 만료일 +6일
//   · 예외: 변경에서 종료일을 오늘로 고르면 즉시 해제 — 재개일이 오늘이고, 이용중지 일수는 처음 신청한 날부터 오늘까지다.
// [프론트엔드 연동] 서버가 같은 값을 계산해 주면 응답으로 대체한다(이 파일은 화면 미리보기 용도로만 남기거나 삭제).

const MIN_SUSPEND_DAYS = 1
const MAX_SUSPEND_DAYS = 365

type SuspendPeriod = {startDate: Date; endDate: Date}

/** 종료일로 고를 수 있는 범위. 신청은 다음 날 ~ 1년, 변경(current 있음)은 오늘 ~ 기존 종료일 전날(앞당기기만). */
const getSelectableEndRange = (today: Date, current?: SuspendPeriod) => ({
    min: current ? today : addDays(today, MIN_SUSPEND_DAYS),
    max: current ? subDays(current.endDate, 1) : addDays(today, MAX_SUSPEND_DAYS),
})

/** 원래 만료일(이용중지 없을 때) — 이용중지 중이면 현재 만료일에서 기존 이용중지 일수를 뺀다. */
const getBaseExpiry = (currentExpiry: Date, current?: SuspendPeriod) =>
    current ? subDays(currentExpiry, differenceInCalendarDays(current.endDate, current.startDate)) : currentExpiry

type SuspendResultInput = {
    /** 이용중지가 없을 때의 만료일(원래 만료일). 변경이면 현재 만료일에서 기존 이용중지 일수를 뺀 값이다. */
    baseExpiry: Date
    /** 실제 이용중지가 시작된 날 — 신청은 오늘, 변경은 처음 신청한 날. */
    pauseStart: Date
    /** 변경이면 true(종료일을 오늘로 고르면 즉시 해제). */
    isChange: boolean
    /** 사용자가 고른 기간(시작일은 오늘). */
    period: SuspendPeriod
    today: Date
}

/** 고른 기간을 적용했을 때의 총 이용중지 일수 · 재개일 · 적용 후 이용기간의 끝(변경 만료일). */
const calculateSuspendResult = ({baseExpiry, pauseStart, isChange, period, today}: SuspendResultInput) => {
    const isReleasedToday = isChange && isSameDay(period.endDate, today)
    const resumeDate = isReleasedToday ? today : addDays(period.endDate, 1)

    return {
        days: Math.max(differenceInCalendarDays(period.endDate, period.startDate), 0),
        isReleasedToday,
        resumeDate,
        expiresAt: addDays(baseExpiry, differenceInCalendarDays(isReleasedToday ? today : period.endDate, pauseStart)),
    }
}

export {calculateSuspendResult, getBaseExpiry, getSelectableEndRange}
export type {SuspendPeriod}
