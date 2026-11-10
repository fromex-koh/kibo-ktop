import type {ComponentPropsWithoutRef} from 'react'
import {
    cardActionBarClassName,
    cardActionBarEndClassName,
    cardActionBarStartClassName,
} from '@/components/theme/card-action-bar.variants'
import {cn} from '@/lib/utils'

// 카드 액션 바 — 목록 카드 아래에 버튼을 왼쪽(보조) · 오른쪽(주요)으로 나눠 놓는다.
//   <CardActionBar>
//     <CardActionBarStart>보조 버튼(variant="secondary")</CardActionBarStart>
//     <CardActionBarEnd>보조 버튼 … 주요 버튼(variant 기본값) — 주요 버튼은 맨 오른쪽</CardActionBarEnd>
//   </CardActionBar>
// 버튼은 글자 폭만큼이고(폭 클래스를 주지 않는다), 모바일에서는 주요 버튼이 맨 위를 가득 채운다.
// [프론트엔드 연동] 구역 안에는 버튼을 바로 넣는다 — div 등으로 감싸면 모바일 배치가 버튼을 못 찾는다.
//   모달 트리거(asChild)로 감싼 버튼은 그대로 된다.
// 배치 규칙 · 이유는 theme/card-action-bar.variants.ts.
// 화면 끝의 이전 · 다음 · 저장처럼 카드 밖의 버튼 줄은 ActionBar 를 쓴다.

const CardActionBar = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div data-slot="card-action-bar" className={cn(cardActionBarClassName, className)} {...props} />
)

const CardActionBarStart = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div data-slot="card-action-bar-start" className={cn(cardActionBarStartClassName, className)} {...props} />
)

const CardActionBarEnd = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div data-slot="card-action-bar-end" className={cn(cardActionBarEndClassName, className)} {...props} />
)

export {CardActionBar, CardActionBarEnd, CardActionBarStart}
