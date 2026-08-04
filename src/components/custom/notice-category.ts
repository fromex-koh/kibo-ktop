import type {ComponentProps} from 'react'
import type {Badge} from '@/components/ui/badge'

// 공지 분류 — 목록(NoticeList)과 상세(NoticeDetail)가 함께 쓴다.
// 색은 시안 배지와 1:1 로 맞춘 기존 팔레트다(중요공지 error · 일반공고 info · 사업공고 purple).
//
// 목록이 client 컴포넌트라 이 상수를 그 파일에 두면 server 컴포넌트(상세)에서 가져올 때 값이 아니라
// client 참조가 넘어와 undefined 가 된다. 그래서 'use client' 가 없는 이 파일에 따로 둔다.
const NOTICE_CATEGORY = {
    important: {label: '중요공지', color: 'error'},
    general: {label: '일반공고', color: 'info'},
    business: {label: '사업공고', color: 'secondary-purple'},
} as const satisfies Record<string, {label: string; color: NonNullable<ComponentProps<typeof Badge>['color']>}>

type NoticeCategory = keyof typeof NOTICE_CATEGORY

type NoticeItem = {
    id: string
    category: NoticeCategory
    title: string
}

export {NOTICE_CATEGORY}
export type {NoticeCategory, NoticeItem}
