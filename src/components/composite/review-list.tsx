import {Children, cloneElement, isValidElement} from 'react'
import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {Badge} from '@/components/ui/badge'
import {cn} from '@/lib/utils'

// 검토 목록(ReviewList) — 입력·판정된 항목을 검토·확인하는 읽기 전용 목록. Figma "리스트"(예: "02. 경영주는 …
// 특허/실용신안이 있다. [확인]") 반영. 각 항목은 [번호 · 확인 내용 · 우측 상태 배지] 행이고, 여러 항목을
// 순번대로 쌓는다. (사용자가 직접 체크하며 답을 채우는 '작성' 목록이 아니라, 이미 입력·판정된 걸 확인하는
// 'read' 목록이라 Checklist 가 아니라 ReviewList 로 명명한다 — 작성형은 QuestionList + Chip 등 폼 컨트롤로 만든다.)
//
// 복합(compound) API — 이 프로젝트 표준(SummaryList·QuestionList 등)대로 컨테이너(ReviewList)와 항목
// (ReviewItem)을 분리한다. 순번은 ReviewList 가 자식 순서대로 자동 주입(01·02·…, 2자리 zero-pad)하므로
// 사용처에서 번호를 직접 적지 않는다(항목을 추가·재정렬해도 번호가 자동으로 맞는다).
// 우측 배지는 기존 Badge(outline·info·round·sm = Figma "확인" 배지)를 그대로 재사용한다 — 같은 배지를 새로
// 만들지 않는다. badge 에 문자열을 넘기면 그 기본 확인 배지로, 엘리먼트를 넘기면 그대로 렌더한다
// (미응답 = outline·neutral, 응답값 = outline·secondary-grape — Figma 색이 기존 팔레트와 1:1 일치).
//
// 하위 행(ReviewSubItem) — "(1)/(2)" 복수 하위 문장이나 제조/서비스 분류 배지 행처럼 한 번호 아래 여러 행이
// 각자 상태 배지를 갖는 케이스(Figma "li_2줄이상"). ReviewItem 자식으로 ReviewSubItem 을 넣으면 번호는
// 첫 행 상단에 정렬되고 행들은 8px 간격으로 쌓인다. category 는 행 앞 분류 Badge 슬롯(첫 줄 상단 정렬).
//
// 색·타이포(Figma): 번호 = body-xl-bold(16px)·foreground(gray.900), 내용 = body-xl-regular(16px)·
// label-foreground(gray.700), 각주 = caption·foreground-subtle. 전부 기존 토큰이라 커스텀 색이 없다([PB-04]).
// 간격(Figma): 항목 사이 gap-6(24px), 번호↔내용 gap-2(8px), 내용↔배지 gap-10(40px 고정 거터),
// 하위 행 사이 gap-2(8px), 본문↔각주 gap 0. 상태 배지는 내용 블록 세로 중앙, 분류 배지는 첫 줄 상단 정렬.
//
// 순서가 의미 있는 목록이라 <ol>/<li> 로 마크업한다(스크린리더가 항목 위치를 전달). 화면의 "02." 번호는
// Figma 그대로 커스텀 렌더하되 aria-hidden 으로 중복 낭독을 막고, 배지는 항목 상태를 보조로 나타낸다.

// 문자열 badge 의 기본형 — Figma "확인"(border info.500 · text info.600 · radius 8).
const renderReviewBadge = (badge: ReactNode) =>
    typeof badge === 'string' ? (
        <Badge variant="outline" color="info" shape="round" size="sm">
            {badge}
        </Badge>
    ) : (
        badge
    )

type ReviewSubItemProps = {
    // 우측 상태 배지. 문자열이면 기본 확인 배지로, 엘리먼트면 그대로 렌더. 생략하면 배지 없음.
    badge?: ReactNode
    // 행 앞에 붙는 분류 Badge(제조/서비스 등). 첫 줄 상단에 정렬된다.
    category?: ReactNode
    children: ReactNode
} & ComponentPropsWithoutRef<'div'>

const ReviewSubItem = ({badge, category, className, children, ...props}: ReviewSubItemProps) => (
    <div data-slot="review-sub-item" className={cn('flex items-center gap-10', className)} {...props}>
        <div className="flex min-w-0 flex-1 items-start gap-2">
            {category != null ? (
                <span data-slot="review-sub-item-category" className="shrink-0">
                    {category}
                </span>
            ) : null}
            <span className="typo-body-xl-regular text-label-foreground min-w-0">{children}</span>
        </div>
        {badge != null ? (
            <span data-slot="review-item-badge" className="shrink-0">
                {renderReviewBadge(badge)}
            </span>
        ) : null}
    </div>
)

type ReviewItemProps = {
    // 우측 상태 배지. 문자열이면 기본 확인 배지(outline·info·round·sm)로, 엘리먼트면 그대로 렌더. 생략하면 배지 없음.
    badge?: ReactNode
    // 본문 아래 각주 설명(Figma 12번 "* '타 분야의 …'"). 본문과 붙여(간격 0) 렌더한다.
    description?: ReactNode
    // 항목 본문(확인할 내용) 또는 ReviewSubItem 목록.
    children: ReactNode
    // 순번(1부터) — ReviewList 가 자동 주입한다. 사용처에서 직접 넘기지 않는다.
    index?: number
} & Omit<ComponentPropsWithoutRef<'li'>, 'children'>

const ReviewItem = ({badge, description, index = 1, className, children, ...props}: ReviewItemProps) => {
    const hasSubItems = Children.toArray(children).some(
        (child) => isValidElement(child) && child.type === ReviewSubItem,
    )
    const number = (
        <span aria-hidden="true" data-slot="review-item-number" className="typo-body-xl-bold text-foreground shrink-0">
            {`${String(index).padStart(2, '0')}.`}
        </span>
    )

    // 하위 행 모드 — 번호는 첫 행 상단에 정렬되고, 각 ReviewSubItem 이 자기 상태 배지를 가진다.
    if (hasSubItems) {
        return (
            <li data-slot="review-item" className={cn('flex items-start gap-2', className)} {...props}>
                {number}
                <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
            </li>
        )
    }

    // 기본 모드 — 상태 배지는 내용 블록(본문+각주) 세로 중앙에 정렬된다.
    return (
        <li data-slot="review-item" className={cn('flex items-center gap-10', className)} {...props}>
            <div className="flex min-w-0 flex-1 items-start gap-2">
                {number}
                <div className="flex min-w-0 flex-col">
                    <span className="typo-body-xl-regular text-label-foreground">{children}</span>
                    {description != null ? (
                        <span
                            data-slot="review-item-description"
                            className="typo-caption-regular text-foreground-subtle"
                        >
                            {description}
                        </span>
                    ) : null}
                </div>
            </div>
            {badge != null ? (
                <span data-slot="review-item-badge" className="shrink-0">
                    {renderReviewBadge(badge)}
                </span>
            ) : null}
        </li>
    )
}

const ReviewList = ({className, children, ...props}: ComponentPropsWithoutRef<'ol'>) => (
    <ol data-slot="review-list" className={cn('flex flex-col gap-6', className)} {...props}>
        {Children.map(children, (child, itemIndex) =>
            isValidElement<ReviewItemProps>(child) ? cloneElement(child, {index: itemIndex + 1}) : child,
        )}
    </ol>
)

export {ReviewList, ReviewItem, ReviewSubItem}
export type {ReviewItemProps, ReviewSubItemProps}
