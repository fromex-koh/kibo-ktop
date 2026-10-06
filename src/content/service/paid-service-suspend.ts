// 이용중지 팝업 · 불가 안내의 문구와 타입. 계산 정책은 lib/suspend-policy.ts, 케이스별 목업은 paid-service-current-pass.ts 에 있다.

/** 팝업이 보여 주는 이용권. 날짜는 yyyy-MM-dd. */
type PaidServiceSuspendPass = {
    name: string
    /** 이용기간 시작일 · 만료일(이용중지가 있으면 원래 만료일 + 이용중지 일수). */
    startDate: string
    endDate: string
    remainingCount: number
    remainingDays: number
}

/** 이미 신청해 둔 이용중지 기간(yyyy-MM-dd). 변경 팝업의 종료일 범위(기존 종료일 전날까지)와 카드의 이용중지 기록에 쓴다. */
type PaidServiceSuspension = {
    startDate: string
    endDate: string
}

/** 현재 이용권을 팝업이 받는 모양으로 바꾼다. */
const toSuspendPass = (pass: {
    grade: string
    startDate: string
    endDate: string
    remaining: number
    remainingDays: number
}): PaidServiceSuspendPass => ({
    name: pass.grade,
    startDate: pass.startDate,
    endDate: pass.endDate,
    remainingCount: pass.remaining,
    remainingDays: pass.remainingDays,
})

/** 신청·변경이 끝난 결과 — 완료 알림 문구를 정한다. release 는 변경에서 종료일을 오늘로 골라 즉시 해제된 경우다. */
type PaidServiceSuspendOutcome = 'apply' | 'change' | 'release'

/** 확인 팝업에 보여 줄 적용 결과(날짜는 yyyy-MM-dd). */
type PaidServiceSuspendSummary = {
    startDate: string
    endDate: string
    /** 이용중지 일수(종료일 − 시작일). */
    days: number
    resumeDate: string
    /** 적용 후 이용기간의 끝(변경 만료일). */
    expiresAt: string
}

const SUSPEND_APPLY_TITLE = '이용중지 신청'
const SUSPEND_CHANGE_TITLE = '이용중지 변경'

// 제출 뒤 확인 팝업의 문구. 줄 단위로 나눠 적는다.
const SUSPEND_CONFIRM = {
    apply: {
        question: '이용중지를 신청하시겠습니까?',
        lines: [
            '이용중지 신청 후 시작일은 변경할 수 없으며, 중지기간을 연장할 수 없습니다.',
            '필요한 경우 중지 종료일을 앞당겨 변경할 수 있습니다.',
        ],
    },
    change: {
        question: '이용중지를 변경하시겠습니까?',
        lines: [
            '변경 후에는 종료일을 연장하거나 다시 이용중지를 신청할 수 없습니다.',
            '실제 이용중지된 기간을 기준으로 이용권 만료일이 다시 계산됩니다.',
        ],
    },
} as const

// 확인 팝업에서 [확인] 을 누른 뒤의 완료 알림(PaidServiceSuspendOutcome 별) — 안내 모달(NoticeDialog) 한 벌이다. 알림은 카드를 가진 쪽이 띄운다.
// release(변경에서 종료일을 오늘로 골라 즉시 해제): 기획 노트에는 "오늘 선택 = 즉시 해제·이용중" 규칙만 있고 알림 문구는 와이어프레임 코드의 문구를 그대로 썼다.
const SUSPEND_COMPLETE_TITLE = '이용중지 완료 안내'
const SUSPEND_COMPLETE_MESSAGE = {
    apply: '이용중지 신청이 완료되었습니다.',
    change: '이용중지 종료일 변경이 완료되었습니다.',
    release: '이용중지가 해제되어 이용권이 다시 활성화되었습니다.',
} as const

// 이용중지를 신청할 수 없는 이용권 — [이용중지] 버튼은 보이되 누르면 이 안내가 뜬다.
const SUSPEND_UNAVAILABLE_MESSAGE = {
    freePass: '무료로 지급된 이용권은 이용중지를 신청할 수 없습니다.',
    remainingDay: '잔여기간이 1일인 경우 이용중지를 신청할 수 없습니다.',
} as const

const SUSPEND_NOTICE = {
    title: '안내사항',
    items: [
        '실제 이용중지 기간만큼 이용권 만료일이 연장됩니다.',
        '이용중지는 이용권당 1회만 신청할 수 있습니다.',
        '이용중지 이후에는 중지 기간을 연장할 수 없습니다.',
        '이용중지 이후에는 필요한 경우 종료일을 앞당길 수 있습니다.',
        '이용중지 기간 동안 다른 보유 이용권은 활성화되지 않습니다.',
        '이용중지 기간 동안 이용권이 차감되는 서비스를 이용할 수 없습니다.',
    ],
} as const

export {
    SUSPEND_APPLY_TITLE,
    SUSPEND_CHANGE_TITLE,
    SUSPEND_COMPLETE_MESSAGE,
    SUSPEND_COMPLETE_TITLE,
    SUSPEND_CONFIRM,
    SUSPEND_NOTICE,
    SUSPEND_UNAVAILABLE_MESSAGE,
    toSuspendPass,
}
export type {PaidServiceSuspendOutcome, PaidServiceSuspendPass, PaidServiceSuspendSummary, PaidServiceSuspension}
