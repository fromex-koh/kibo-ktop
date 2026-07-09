import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 섹션 안의 더 작은 하위 구획 제목+설명(+선택적 액션) 묶음 — SectionHeader 와 구조·색상·액션 유무
// 조건은 동일하고 타이포만 다르다(SectionHeader: Heading/H4/bold → SubSectionHeader: Title/L/bold,
// 한 단계 더 작음). 헤딩 레벨도 SectionHeader(h2) 보다 한 단계 아래인 h3. 텍스트 색은 동일하게
// text-foreground(제목)·text-foreground-subtle(설명). SubSectionHeaderAction 유무는 SectionHeader
// 와 같은 방식(has-data-[slot=...] CSS 선택자)으로 처리한다.

const SubSectionHeader = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="sub-section-header"
        className={cn(
            'grid auto-rows-min items-start gap-y-1.5 has-data-[slot=sub-section-header-action]:grid-cols-[1fr_auto] has-data-[slot=sub-section-header-description]:grid-rows-[auto_auto]',
            className,
        )}
        {...props}
    />
)

const SubSectionHeaderTitle = ({className, children, ...props}: ComponentPropsWithoutRef<'h3'>) => (
    <h3
        data-slot="sub-section-header-title"
        className={cn('typo-title-l-bold text-foreground text-balance', className)}
        {...props}
    >
        {children}
    </h3>
)

const SubSectionHeaderDescription = ({className, ...props}: ComponentPropsWithoutRef<'p'>) => (
    <p
        data-slot="sub-section-header-description"
        className={cn('typo-body-xl-regular text-foreground-subtle', className)}
        {...props}
    />
)

// 제목 오른쪽에 배치하는 선택적 액션 영역(버튼 등). 넣지 않으면 SubSectionHeader 는 그냥 세로 스택.
const SubSectionHeaderAction = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="sub-section-header-action"
        className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
        {...props}
    />
)

export {SubSectionHeader, SubSectionHeaderTitle, SubSectionHeaderDescription, SubSectionHeaderAction}
