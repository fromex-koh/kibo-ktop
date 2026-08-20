// 1:1 문의 — 목록과 상세가 함께 쓰는 값.
//
// 서버 컴포넌트(상세 화면)와 클라이언트 컴포넌트(목록)가 같은 표를 봐야 하므로 'use client' 파일이
// 아니라 이 자리에 둔다 — 클라이언트 파일의 상수를 서버에서 import 하면 실제 값이 아니라 빈 참조가
// 넘어온다(mypage-profile.ts 와 같은 이유).

// 답변 상태 — 색은 시안 실측이다(답변대기 purple.50/600 · 답변완료 info.50/600).
// 두 색을 나눈 이유는 "아직 기다리는 것"과 "확인할 것이 생긴 것"을 한눈에 가르기 위해서다.
// 상태는 색만으로 전달하지 않고 글자를 함께 둔다[5.3.1].
export const INQUIRY_STATUS = {
    waiting: {label: '답변대기', color: 'secondary-purple'},
    answered: {label: '답변완료', color: 'info'},
} as const

export type InquiryStatus = keyof typeof INQUIRY_STATUS

// 문의 유형 — 알림마당 > 문의하기의 [유형 선택] 항목이자, 마이페이지 문의 목록·상세에서 제목 앞에
// 붙는 분류다. 두 화면이 같은 목록을 봐야 해서 여기 한 벌만 둔다.
export const INQUIRY_TYPES = [
    {value: '회원정보', label: '회원정보'},
    {value: '유료/결제', label: '유료/결제'},
    {value: '기술평가', label: '기술평가'},
    {value: 'K-BIGx', label: 'K-BIGx'},
    {value: '기타', label: '기타'},
] as const

export type InquiryType = (typeof INQUIRY_TYPES)[number]['value']
