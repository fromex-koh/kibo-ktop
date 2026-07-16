import {Children, cloneElement, isValidElement} from 'react'
import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {Badge} from '@/components/ui/badge'
import {cn} from '@/lib/utils'

// 검토 목록(ReviewList) — 입력·판정된 항목을 검토·확인하는 읽기 전용 목록. Figma "li"(예: "02. 경영주는 …
// 특허/실용신안이 있다. [확인]") 반영. 각 항목은 [번호 · 확인 내용 · 우측 확인 배지] 한 줄이고, 여러 항목을
// 순번대로 쌓는다. (사용자가 직접 체크하며 답을 채우는 '작성' 목록이 아니라, 이미 입력·판정된 걸 확인하는
// 'read' 목록이라 Checklist 가 아니라 ReviewList 로 명명한다 — 작성형은 Chip 등 폼 컨트롤로 만든다.)
//
// 복합(compound) API — 이 프로젝트 표준(SummaryList·SectionHeader 등)대로 컨테이너(ReviewList)와 항목
// (ReviewItem)을 분리한다. 순번은 ReviewList 가 자식 순서대로 자동 주입(01·02·…, 2자리 zero-pad)하므로
// 사용처에서 번호를 직접 적지 않는다(항목을 추가·재정렬해도 번호가 자동으로 맞는다).
// 우측 배지는 기존 Badge(outline·info·pill·sm = Figma "확인" 배지)를 그대로 재사용한다 — 같은 배지를 새로
// 만들지 않는다. badge 에 문자열을 넘기면 그 기본 확인 배지로, 엘리먼트를 넘기면 그대로 렌더한다.
//
// 색·타이포(Figma): 번호 = body-xl-bold(16px)·foreground(gray.900), 내용 = body-xl-regular(16px)·
// label-foreground(gray.700). 전부 기존 토큰이라 커스텀 색이 없다([PB-04]).
// 간격: 번호↔내용 gap-2(8px), 내용↔배지는 우측 정렬(justify-between), 항목 사이 gap-3(12px).
//
// 순서가 의미 있는 목록이라 <ol>/<li> 로 마크업한다(스크린리더가 항목 위치를 전달). 화면의 "02." 번호는
// Figma 그대로 커스텀 렌더하고(브라우저 기본 마커는 Tailwind preflight 가 이미 제거), 배지는 항목 상태를
// 보조로 나타낸다.

type ReviewItemProps = {
    // 우측 배지. 문자열이면 기본 확인 배지(outline·info·pill·sm)로, 엘리먼트면 그대로 렌더. 생략하면 배지 없음.
    badge?: ReactNode
    // 항목 본문(확인할 내용).
    children: ReactNode
    // 순번(1부터) — ReviewList 가 자동 주입한다. 사용처에서 직접 넘기지 않는다.
    index?: number
} & Omit<ComponentPropsWithoutRef<'li'>, 'children'>

const ReviewItem = ({badge, index = 1, className, children, ...props}: ReviewItemProps) => (
    <li data-slot="review-item" className={cn('flex items-start gap-2', className)} {...props}>
        <span className="typo-body-xl-bold text-foreground shrink-0">{`${String(index).padStart(2, '0')}.`}</span>
        <div className="flex flex-1 items-start justify-between gap-4">
            <span className="typo-body-xl-regular text-label-foreground">{children}</span>
            {badge != null ? (
                <span data-slot="review-item-badge" className="shrink-0">
                    {typeof badge === 'string' ? (
                        <Badge variant="outline" color="info" shape="pill" size="sm">
                            {badge}
                        </Badge>
                    ) : (
                        badge
                    )}
                </span>
            ) : null}
        </div>
    </li>
)

const ReviewList = ({className, children, ...props}: ComponentPropsWithoutRef<'ol'>) => (
    <ol data-slot="review-list" className={cn('flex flex-col gap-3', className)} {...props}>
        {Children.map(children, (child, itemIndex) =>
            isValidElement<ReviewItemProps>(child) ? cloneElement(child, {index: itemIndex + 1}) : child,
        )}
    </ol>
)

export {ReviewList, ReviewItem}
export type {ReviewItemProps}
