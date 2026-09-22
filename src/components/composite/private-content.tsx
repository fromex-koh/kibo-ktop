import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 비공개 정보(PrivateContent · PrivateCell) — 정책상 보여 줄 수 없는 값을 가린다. EmptyState 처럼 "값 대신 안내"를 보이되,
// 뒤에 흐린 자리 표시 값(임의 값)을 깔아 원래 자리의 모양(표 · 그래프 · 카드)은 그대로 남긴다.
// K-BIGx 기업혁신성장 보고서 신용/재무정보 탭에서 열람 케이스(report.viewerCase)별 비공개 정보(기업신용정보 표 · 연체금액 열 ·
// 차입금 현황 카드)를 가린다(innovation-growth-report-credit.tsx).
//
// 짜임: 흐린 자리 표시(blur-sm) 위에 흰 면 80%(bg-card/80)를 덮고, 가운데에 안내 20 Medium(gray.900)을 둔다.
//   PrivateContent — 표 · 카드 같은 덩어리 하나를 통째로 가린다(카드 제목까지 가리려면 카드째 감싼다).
//     격자 칸에서 옆 카드와 높이를 맞추려면 감싼 카드에 h-full 을 준다(자리 표시 상자가 칸 높이를 채운다).
//   PrivateCell — 표의 한 칸만 가린다(열 하나를 가릴 때 그 열의 머리 · 값 칸마다 쓴다). 칸 여백까지 덮는다.
// 자리 표시 값은 화면 낭독기 · 키보드에서 빠진다(aria-hidden · inert) — 읽히는 것은 안내 글뿐이다.
// 서버 · 클라이언트 어디서나 쓸 수 있게 'use client' 없이 둔다(상태 · 이벤트가 없다).
//
// [프론트엔드 연동] 비공개 여부는 API 가 준다. 비공개면 실제 값을 넘기지 말고 임의의 자리 표시 값(모양이 비슷한 가짜 행 · 점)으로
// children 을 채운다 — 흐려도 실제 값이 문서(DOM)에 남으면 복사 · 개발자 도구로 읽힌다.

const PRIVATE_CARD_LABEL = '정책에 따라 비공개 처리된 정보입니다.'
const PRIVATE_SHORT_LABEL = '비공개'

type PrivateContentProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 흐리게 깔 자리 표시(임의 값). 원래 자리의 모양을 남기는 용도다. */
    children?: ReactNode
    /** 안내 글. 기본은 '정책에 따라 비공개 처리된 정보입니다.' — 표처럼 좁은 자리는 '비공개'. */
    label?: string
}

const PrivateContent = ({children, label = PRIVATE_CARD_LABEL, className, ...props}: PrivateContentProps) => (
    <div {...props} className={cn('relative isolate min-h-24', className)}>
        <div aria-hidden="true" inert className="pointer-events-none h-full blur-sm select-none">
            {children}
        </div>
        {/* 가림 면 — 자리 표시 전체를 덮고 안내를 가운데에 둔다. 안내는 긴 문구면 어절 단위로 접힌다. */}
        <div className="bg-card/80 absolute inset-0 flex items-center justify-center p-4">
            <p className="typo-title-l-medium text-foreground text-center break-keep">{label}</p>
        </div>
    </div>
)

type PrivateCellProps = {
    /** 흐리게 깔 자리 표시(임의 값). */
    children?: ReactNode
    /** 칸 가운데 안내. 열 전체에서 한 칸만 보이면 되므로 기본은 비운다(글은 화면 낭독기에만 읽힌다). */
    label?: string
    className?: string
}

// 표 한 칸 — 칸(td · th) 안에 넣는다. 칸 여백(좌우 16 · 위아래 12)까지 덮도록 가림 면을 바깥으로 넓힌다.
const PrivateCell = ({children, label, className}: PrivateCellProps) => (
    <span className={cn('relative isolate block', className)}>
        <span aria-hidden="true" inert className="pointer-events-none block blur-sm select-none">
            {children}
        </span>
        <span className="bg-card/80 absolute -inset-x-4 -inset-y-3 flex items-center justify-center">
            {label ? (
                <span className="typo-title-l-medium text-foreground whitespace-nowrap">{label}</span>
            ) : (
                <span className="sr-only">{PRIVATE_SHORT_LABEL}</span>
            )}
        </span>
    </span>
)

export {PRIVATE_CARD_LABEL, PRIVATE_SHORT_LABEL, PrivateCell, PrivateContent}
export type {PrivateCellProps, PrivateContentProps}
