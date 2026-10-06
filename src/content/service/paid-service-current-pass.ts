// 현재 사용중인 이용권의 케이스별 목업 — 기획 와이어프레임의 "케이스 보기"와 같은 정의다.
// 날짜는 오늘 기준 상대값이라 언제 열어도 같은 케이스로 보인다. 카드 모양은 날짜가 아니라
// suspension · suspensionRecord · isFree 같은 상태 값으로 정해진다.
//
// 케이스(결제정보 화면은 ?case=번호, 단독 화면은 suspending · suspension-history 등)
//   1 이용중 · 중지 이력 없음          → [이용중지] → 신청 팝업
//   2 이용중지 중                     → [이용중지 변경] → 변경 팝업
//   3 중지 후 재개 · 이력 있음         → 이용중지 버튼 없음(이용권당 1회)
//   4 잔여 이용기간 1일(만료일 = 오늘)  → [이용중지] → 불가 안내
//   5 무료 지급 이용권                → [이용중지] → 불가 안내
//   6 미사용 · 환불 가능(구매 7일 이내)  → [환불하기] [이용중지] [이용내역]. 이용중지를 하면 환불할 수 없다.
//
// 날짜 규칙
//   · 이용중지 기간의 시작일(pause.start)은 신청한 날이다(케이스 2 · 3 은 과거). 팝업의 시작일(진입한 날)과 별개다.
//   · 만료일 = 원래 만료일 + 이용중지 일수(팝업의 적용 후 이용기간과 같은 식, lib/suspend-policy.ts).
//   · 잔여 이용일수는 이용중지 중에도 줄지 않는다(유효기간 정지).
//
// [프론트엔드 연동]
//   · createCurrentPassCase(목업) → 현재 이용권 조회 응답으로 교체.
//   · applyPassSuspension(신청·변경 직후 카드 갱신) → 신청·변경 응답(또는 재조회)으로 교체.
//   · 서버는 이용중지 중일 때만 suspension 을 채운다(종료일이 오늘 이후). 종료일이 지나면 비우고
//     suspensionRecord · hasSuspendedBefore 만 남기면 카드가 [사용중] + 이력 블록으로 바뀐다.

import {addDays, differenceInCalendarDays, format, parseISO} from 'date-fns'
import type {CurrentPaidServicePass} from '@/components/custom/paid-service-history'
import {calculateSuspendResult, getBaseExpiry} from '@/lib/suspend-policy'

const CURRENT_PASS_CASES = ['1', '2', '3', '4', '5', '6'] as const
type CurrentPassCase = (typeof CURRENT_PASS_CASES)[number]
const DEFAULT_CURRENT_PASS_CASE: CurrentPassCase = '1'

const isCurrentPassCase = (value: unknown): value is CurrentPassCase =>
    typeof value === 'string' && CURRENT_PASS_CASES.some((id) => id === value)

const DATE_FORMAT = 'yyyy-MM-dd'
// 날짜 값은 오늘을 0 으로 센 차이(일) — 와이어프레임의 T(n).
type PassSpec = {
    plan: string
    isFree: boolean
    /** 구매 7일 이내 · 사용 이력 없음 — [환불하기] 노출. */
    isRefundable?: boolean
    quota: number
    used: number
    remain: number
    daysTotal: number
    start: number
    /** 이용중지 신청 전의 만료일. */
    endOrig: number
    purchased: number
    price: number
    gradeImage?: string
    pause?: {start: number; end: number}
}

// 기본 = 스탠다드(사용중, 사용량 89/150).
const BASE_SPEC: PassSpec = {
    plan: '스탠다드',
    isFree: false,
    quota: 150,
    used: 89,
    remain: 61,
    daysTotal: 30,
    start: -22,
    endOrig: 7,
    purchased: -25,
    price: 1000000,
    gradeImage: '/images/ticket-grade/ticket-grade-standard.webp',
}

const CASE_SPECS: Record<CurrentPassCase, Partial<PassSpec>> = {
    '1': {},
    // pause.start = 신청한 날(= 시작일), pause.end = 이용중지 종료일.
    '2': {pause: {start: -2, end: 4}},
    '3': {pause: {start: -12, end: -6}},
    '4': {start: -29, endOrig: 0, purchased: -32, used: 142, remain: 8},
    '5': {
        plan: 'K-BIGx 오픈 기념 이벤트',
        isFree: true,
        quota: 5,
        used: 2,
        remain: 3,
        daysTotal: 14,
        start: -3,
        endOrig: 10,
        purchased: -4,
        price: 0,
        gradeImage: undefined,
    },
    // 구매 3일 전 · 사용 0건 — 환불 가능(구매 7일 이내 + 사용 이력 없음).
    '6': {isRefundable: true, start: -3, endOrig: 26, purchased: -3, used: 0, remain: 150},
}

const toPriceLabel = (price: number) => (price === 0 ? '무료 지급' : `${price.toLocaleString('ko-KR')}원`)

/** 오늘을 기준으로 케이스에 맞는 현재 이용권을 만든다. */
const createCurrentPassCase = (caseId: CurrentPassCase, today: Date): CurrentPaidServicePass => {
    const spec = {...BASE_SPEC, ...CASE_SPECS[caseId]}
    const at = (offset: number) => format(addDays(today, offset), DATE_FORMAT)
    const pausedDays = spec.pause ? spec.pause.end - spec.pause.start : 0
    // 이용중지가 있으면 만료일 = 원래 만료일 + 이용중지 일수.
    const expiresAt = spec.endOrig + pausedDays
    // 시작했고 종료일이 오늘보다 뒤일 때만 이용중지 중이다(종료일 = 오늘이면 변경할 수 없다).
    const isPaused = Boolean(spec.pause && spec.pause.start <= 0 && spec.pause.end > 0)
    // 잔여 일수 — 이용중지 중에는 줄지 않고(재개일부터 만료일까지, 양 끝 포함), 그 밖에는 오늘부터 만료일까지(양 끝 포함)다.
    const remainingDays = isPaused && spec.pause ? expiresAt - (spec.pause.end + 1) + 1 : Math.max(0, expiresAt - 0 + 1)

    // 이용중지 기록 — 중지 중이든 재개했든 카드에 같은 블록으로 보인다. 재개일 = 종료일 다음 날.
    const record = spec.pause
        ? {
              startDate: at(spec.pause.start),
              endDate: at(spec.pause.end),
              days: pausedDays,
              resumeDate: at(spec.pause.end + 1),
          }
        : undefined

    return {
        id: `current-pass-case-${caseId}`,
        grade: spec.plan,
        remaining: spec.remain,
        used: spec.used,
        total: spec.quota,
        startDate: at(spec.start),
        endDate: at(expiresAt),
        // 이용중지 기록이 있으면 "변경된 이용기간" = 재개일 ~ 변경 만료일.
        periodLabel: record ? '변경된 이용기간' : undefined,
        period: record ? `${record.resumeDate} ~ ${at(expiresAt)}` : `${at(spec.start)} ~ ${at(expiresAt)}`,
        periodAccent: `${remainingDays}일 남음`,
        remainingDays,
        purchasedAt: at(spec.purchased),
        purchasedLabel: spec.isFree ? '지급일' : '구매일',
        composition: `${spec.quota}건 / ${spec.daysTotal}일`,
        price: toPriceLabel(spec.price),
        gradeImage: spec.gradeImage,
        isFree: spec.isFree,
        isRefundable: spec.isRefundable,
        suspension: isPaused && spec.pause ? {startDate: at(spec.pause.start), endDate: at(spec.pause.end)} : undefined,
        suspensionRecord: record,
        hasSuspendedBefore: Boolean(spec.pause),
    }
}

const DATE_FIELD_START = 'suspendStartDate'
const DATE_FIELD_END = 'suspendEndDate'

/**
 * 신청·변경 팝업이 검사를 통과한 뒤의 카드 — 목업용이다. 계산은 lib/suspend-policy.ts 를 쓴다.
 * 변경에서 종료일을 오늘로 고르면 즉시 해제되어 suspension 이 비고 [사용중] + 이력 블록이 된다.
 * 이용중지 기록의 시작일은 처음 신청한 날을 유지한다(팝업의 시작일은 진입한 날이라 다르다).
 */
const applyPassSuspension = (
    pass: CurrentPaidServicePass,
    values: Record<string, string>,
    today: Date,
): CurrentPaidServicePass => {
    const startValue = values[DATE_FIELD_START]
    const endValue = values[DATE_FIELD_END]
    if (!startValue || !endValue) return pass

    const current = pass.suspension
    const result = calculateSuspendResult({
        baseExpiry: getBaseExpiry(
            parseISO(pass.endDate),
            current && {startDate: parseISO(current.startDate), endDate: parseISO(current.endDate)},
        ),
        pauseStart: parseISO(current?.startDate ?? startValue),
        isChange: Boolean(current),
        period: {startDate: parseISO(startValue), endDate: parseISO(endValue)},
        today,
    })
    const expiresAt = format(result.expiresAt, DATE_FORMAT)
    const resumeDate = format(result.resumeDate, DATE_FORMAT)
    const recordStartDate = pass.suspension?.startDate ?? startValue
    // 잔여 이용일수 = 재개일부터 만료일까지(양 끝 포함) — 이용중지 중에는 줄지 않는다.
    const remainingDays = differenceInCalendarDays(result.expiresAt, result.resumeDate) + 1

    return {
        ...pass,
        endDate: expiresAt,
        periodLabel: '변경된 이용기간',
        period: `${resumeDate} ~ ${expiresAt}`,
        periodAccent: `${remainingDays}일 남음`,
        remainingDays,
        suspension: result.isReleasedToday ? undefined : {startDate: recordStartDate, endDate: endValue},
        suspensionRecord: {
            startDate: recordStartDate,
            endDate: endValue,
            days: Math.max(differenceInCalendarDays(parseISO(endValue), parseISO(recordStartDate)), 0),
            resumeDate,
        },
        // 이용중지를 하면 사용 이력이 생긴 것으로 보아 환불할 수 없다.
        isRefundable: false,
        hasSuspendedBefore: true,
    }
}

export {applyPassSuspension, createCurrentPassCase, CURRENT_PASS_CASES, DEFAULT_CURRENT_PASS_CASE, isCurrentPassCase}
export type {CurrentPassCase}
