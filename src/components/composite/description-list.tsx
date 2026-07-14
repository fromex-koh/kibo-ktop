import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 설명 목록(DescriptionList) — 라벨(좌) + 값(우)으로 읽기 전용 정보를 나열하는 요약 리스트(L2 composite).
// Figma "리스트"(기업정보 요약) 반영. 시맨틱은 HTML 정의 목록 그대로 <dl>(term=<dt>·detail=<dd>)이라,
// 스크린리더가 "라벨: 값" 쌍으로 읽는다([7.3.2]/[8.1.1] 시맨틱 마크업). 값 편집이 아니라 조회용이다
// (편집 폼은 Input/FormCard 를 쓴다).
//
// 색(Figma): 컨테이너 = bg-surface(흰)·border-subtle-3(gray.100)·rounded-md(12px)·p-6(24px),
//   라벨 = text-foreground-subtle(gray.500, Regular), 값 = text-label-foreground(gray.700, Medium),
//   미입력(empty) = 값보다 더 흐린 gray.300. 행 간격 gap-3(12px).
//
// ⚠️ empty 색(gray.300, #848b94)은 흰 배경 대비 약 3.3:1 로 본문 대비 기준([5.3.3] 4.5:1) 미만이다 —
//    Figma "미입력" 플레이스홀더 색을 그대로 반영한 것이라, 본문성 값이 아니라 "값 없음" 상태 표시에만 쓴다.

// 박스 스타일만 분리 export — SelectableDescriptionList 처럼 <dl> 이 아닌 다른 요소(<label>)에 똑같은
// 카드 박스(배경·테두리·라운드·패딩)를 입혀야 할 때, 클래스 문자열을 중복 작성하지 않고 그대로 재사용한다.
const descriptionListBoxClassName = 'bg-surface border-subtle-3 flex w-full flex-col gap-3 rounded-md border p-6'

const DescriptionList = ({className, ...props}: ComponentPropsWithoutRef<'dl'>) => (
    <dl data-slot="description-list" className={cn(descriptionListBoxClassName, className)} {...props} />
)

type DescriptionListItemProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    // 라벨(왼쪽) — <dt> 로 렌더된다.
    term: ReactNode
    // 값(오른쪽) — <dd> 로 렌더된다. 텍스트뿐 아니라 배지·링크 등도 넣을 수 있다.
    children: ReactNode
    // 값이 비었을 때("미입력" 등) — 값을 더 흐린 색으로 표시한다.
    empty?: boolean
}

// 개별 행 — 라벨(dt, 좌) + 값(dd, 우 정렬). <dl> 안에서 <div> 로 dt/dd 쌍을 묶는다(HTML5.2 허용).
const DescriptionListItem = ({term, children, empty = false, className, ...props}: DescriptionListItemProps) => (
    <div
        data-slot="description-list-item"
        className={cn('flex items-start justify-between gap-4', className)}
        {...props}
    >
        <dt className="typo-body-xl-regular text-foreground-subtle">{term}</dt>
        <dd className={cn('typo-body-xl-medium m-0 text-right', empty ? 'text-subtle-1' : 'text-label-foreground')}>
            {children}
        </dd>
    </div>
)

export {DescriptionList, DescriptionListItem, descriptionListBoxClassName}
export type {DescriptionListItemProps}
