'use client'

import type {ReactNode} from 'react'
import {EllipsisVertical} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {SubAccountDetailDialog} from '@/components/composite/sub-account-detail-dialog'
import {SubAccountStatusBadge} from '@/components/composite/sub-account-status-badge'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import {Button} from '@/components/ui/button'
import {subAccountStatusChangeLabel, type SubAccountItem, type SubAccountMenuAction} from '@/constants/sub-account'

// 하위계정 카드 — Figma "마이페이지_하위계정 현황" 의 리스트 한 장.
// 상태 배지 + 계정 이름 / [⋮] 메뉴 · 계정 ID·담당자 이름·보고서 출력 / [상세정보] 로 이루어진다.

// 카드의 상세 한 칸 — 넓은 화면에서는 라벨과 값이 한 줄에 붙어 나란히 놓인다(시안 사이 4).
// 좁은 화면에서는 칸이 한 줄씩 쌓이는데, 그때는 상자를 지워(contents) 라벨과 값이 바깥 dl 의 두 칸
// 그리드에 직접 놓이게 한다 — 라벨 칸이 가장 긴 라벨(담당자 이름) 폭으로 잡혀 값이 모두 같은 세로선에서
// 시작한다. 상자를 둔 채로는 칸마다 라벨 길이가 달라 값의 시작점이 들쭉날쭉해진다.
// 상세 줄 전체는 라벨-값 쌍이라 정의 목록으로 둔다[7.3.2].
const SubAccountDetail = ({label, children}: {label: string; children: ReactNode}) => (
    <div className="contents sm:flex sm:min-w-0 sm:gap-1">
        <dt className="typo-body-l-regular text-foreground-subtle shrink-0">{label}</dt>
        <dd className="typo-body-l-regular text-foreground m-0 min-w-0 break-words">{children}</dd>
    </div>
)

// [⋮] 메뉴에 담기는 일 — 시안 순서 그대로다. 삭제만 지우는 일이라 색을 달리한다.
const MENU_ITEMS: readonly {action: SubAccountMenuAction; label: string; destructive?: boolean}[] = [
    {action: 'edit', label: '수정'},
    {action: 'password-reset', label: '비밀번호 초기화'},
    {action: 'status-change', label: '상태 변경'},
    {action: 'delete', label: '삭제', destructive: true},
]

type SubAccountCardProps = {
    item: SubAccountItem
    /** [⋮] 에서 고른 일. 화면이 그 일에 맞는 곳으로 보낸다. */
    onMenuSelect?: (action: SubAccountMenuAction, item: SubAccountItem) => void
}

const SubAccountCard = ({item, onMenuSelect}: SubAccountCardProps) => {
    // 상태 변경은 지금 상태의 반대를 이름에 담는다(시안 "사용정지로 변경") — 무엇으로 바뀌는지가 이름에서
    // 읽혀야 누르기 전에 알 수 있다[6.4.3].
    const statusChangeLabel = subAccountStatusChangeLabel(item.status)

    return (
        <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        {/* 배지는 이름 앞에 글자처럼 흘려 넣는다 — 칸으로 나누면 이름이 두 줄이 될 때
                            배지만 남은 줄이 생긴다. */}
                        <h3 className="typo-title-l-bold text-foreground min-w-0">
                            <SubAccountStatusBadge status={item.status} className="me-2 align-middle" />
                            {item.name}
                        </h3>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {/* 아이콘만 있는 버튼이라 어느 계정의 메뉴인지 이름에 담는다[5.1.1]. */}
                                <Button
                                    type="button"
                                    variant="plain"
                                    size="icon"
                                    aria-label={`${item.name} 관리 메뉴`}
                                    className="shrink-0"
                                >
                                    <EllipsisVertical aria-hidden="true" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-45">
                                {MENU_ITEMS.map((menu) => (
                                    <DropdownMenuItem
                                        key={menu.action}
                                        variant={menu.destructive ? 'destructive' : 'default'}
                                        onSelect={() => onMenuSelect?.(menu.action, item)}
                                    >
                                        {menu.action === 'status-change' ? statusChangeLabel : menu.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* 좁은 화면: 라벨 칸(가장 긴 라벨 폭) + 값 칸 두 줄 그리드. sm 이상: 시안대로 한 줄에
                        이어 붙이고 칸 사이를 24 로 벌린다. */}
                    <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 sm:flex sm:flex-wrap sm:gap-x-6">
                        <SubAccountDetail label="계정 ID">{item.accountId}</SubAccountDetail>
                        <SubAccountDetail label="담당자 이름">{item.managerName}</SubAccountDetail>
                        <SubAccountDetail label="보고서 출력">{`${item.reportCount}건`}</SubAccountDetail>
                    </dl>
                </div>

                {/* 시안: 카드 오른쪽 끝에 180 짜리 버튼 하나. 좁은 화면에서는 줄을 가득 채운다.
                    화면으로 가지 않고 상세정보 모달을 연다 — 어느 계정인지 이름에 담는다[6.4.3]. */}
                <div className="flex justify-end">
                    <SubAccountDetailDialog item={item}>
                        <Button type="button" variant="tertiary" size="sm" className="max-sm:w-full sm:w-45">
                            상세정보
                            <span className="sr-only">{` (${item.name})`}</span>
                        </Button>
                    </SubAccountDetailDialog>
                </div>
            </div>
        </BaseCard>
    )
}

export {SubAccountCard}
export type {SubAccountCardProps}
