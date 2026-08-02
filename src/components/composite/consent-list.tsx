import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {Badge} from '@/components/ui/badge'
import {ListMarker} from '@/components/custom/list-marker'
import {
    consentBadgeClassName,
    consentContentClassName,
    consentControlClassName,
    consentDescriptionClassName,
    consentItemClassName,
    consentListClassName,
    consentTitleClassName,
    consentTitleRowClassName,
} from '@/components/theme/consent-list.variants'
import {cn} from '@/lib/utils'

// 동의 목록(ConsentList) — 약관·정보제공 동의 항목을 한 줄씩 나열하는 목록(L2 composite).
// Figma "동의" 행 반영: [필수/선택 배지] [항목 제목 + 내용보기] [동의/비동의 컨트롤], 제목 아래 안내 문구(선택).
// 기존 컴포넌트 조합 — Badge(ui) · ListMarker(custom) · 컨트롤은 사용처가 RadioGroup 등으로 넣는다.
// 자가진단 문항(QuestionList)과 달리 번호 원·하위 보기가 없고 제목이 20px 라 별도 컴포넌트로 둔다.
type ConsentRequirement = 'required' | 'optional'

// 필수/선택 배지는 시안 고정값이다 — 필수는 info 아웃라인, 선택은 중립(gray) 아웃라인.
const REQUIREMENT_BADGE: Record<ConsentRequirement, {label: string; color: 'info' | 'neutral'}> = {
    required: {label: '필수', color: 'info'},
    optional: {label: '선택', color: 'neutral'},
}

type ConsentListProps = ComponentPropsWithoutRef<'ul'>

// 동의 항목 목록 — 항목 간 간격만 담당한다.
const ConsentList = ({className, ...props}: ConsentListProps) => (
    <ul data-slot="consent-list" className={cn(consentListClassName, className)} {...props} />
)

type ConsentItemProps = {
    // 항목 제목(예: "1. 수집·이용에 관한 사항").
    title: ReactNode
    // 필수·선택 여부. 배지 문구와 색이 함께 정해진다.
    requirement?: ConsentRequirement
    // 제목 아래 안내 문구(선택). 대시 마커가 함께 붙는다.
    description?: ReactNode
    // 제목 옆 인라인 액션(선택) — 보통 "내용보기" 텍스트 버튼이 온다.
    action?: ReactNode
    // 우측 컨트롤(선택) — 동의/비동의 RadioGroup 등. 항목 전체 높이 기준 중앙에 놓인다.
    control?: ReactNode
} & Omit<ComponentPropsWithoutRef<'li'>, 'title'>

const ConsentItem = ({
    title,
    requirement = 'required',
    description,
    action,
    control,
    className,
    ...props
}: ConsentItemProps) => {
    const badge = REQUIREMENT_BADGE[requirement]

    return (
        <li data-slot="consent-item" className={cn(consentItemClassName, className)} {...props}>
            <span className={consentBadgeClassName}>
                <Badge variant="outline" color={badge.color} shape="round">
                    {badge.label}
                </Badge>
            </span>
            <div className={consentContentClassName}>
                <div className={consentTitleRowClassName}>
                    <span data-slot="consent-item-title" className={consentTitleClassName}>
                        {title}
                    </span>
                    {action}
                </div>
                {description ? (
                    <p data-slot="consent-item-description" className={consentDescriptionClassName}>
                        <ListMarker level={2} />
                        <span>{description}</span>
                    </p>
                ) : null}
            </div>
            {control ? <div className={consentControlClassName}>{control}</div> : null}
        </li>
    )
}

export {ConsentList, ConsentItem}
export type {ConsentListProps, ConsentItemProps, ConsentRequirement}
