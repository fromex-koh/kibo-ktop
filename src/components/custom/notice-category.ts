// 공지 분류·표시 — 목록(NoticeList)과 상세(NoticeDetail)가 함께 쓴다.
//
// 목록이 client 컴포넌트라 이 상수를 그 파일에 두면 server 컴포넌트(상세)에서 가져올 때 값이 아니라
// client 참조가 넘어와 undefined 가 된다. 그래서 'use client' 가 없는 이 파일에 따로 둔다.

// 분류 — 시안이 배지가 아니라 제목 앞의 글자로 두므로 색 없이 이름만 갖는다.
const NOTICE_CATEGORY = {
    system: '시스템',
    etc: '기타',
    service: '서비스',
    payment: '결제',
    evaluation: '평가',
} as const satisfies Record<string, string>

type NoticeCategory = keyof typeof NOTICE_CATEGORY

type NoticeItem = {
    id: string
    category: NoticeCategory
    title: string
    /** 중요공지 표시 — 분류와는 다른 축이라 어느 분류에나 붙을 수 있다. */
    isImportant?: boolean
    /** 새 글 표시(N) — 시안은 가장 최신 글에만 붙인다. */
    isNew?: boolean
    /** 이 공지를 눌렀을 때 가는 상세 화면. 글마다 다르므로 목록이 아니라 항목이 들고 있는다. */
    href: string
}

export {NOTICE_CATEGORY}
export type {NoticeCategory, NoticeItem}
