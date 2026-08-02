import type {ComponentPropsWithoutRef} from 'react'
import {Slot} from 'radix-ui'
import {cn} from '@/lib/utils'

// 섹션 상단의 제목+설명(+선택적 액션) 묶음 — Card 와 같은 합성(compound) 컴포넌트 API.
// 페이지 안의 섹션 타이틀에 쓰므로 h2 로 렌더한다. 텍스트 색은
// text-foreground(제목)·text-foreground-subtle(설명)을 사용한다.
// SectionHeaderAction 유무는 CardHeader/CardAction 과 같은 방식(has-data-[slot=...] CSS 선택자)으로
// 처리한다 — JS 분기 없이, 액션을 넣으면 자동으로 title/description 왼쪽 + action 오른쪽 2열 그리드가 되고
// 넣지 않으면 title/description 만 세로로 쌓인다.

const SectionHeader = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="section-header"
        className={cn(
            'grid auto-rows-min items-start gap-y-2 has-data-[slot=section-header-action]:grid-cols-[1fr_auto] has-data-[slot=section-header-description]:grid-rows-[auto_auto]',
            className,
        )}
        {...props}
    />
)

const SectionHeaderTitle = ({className, children, ...props}: ComponentPropsWithoutRef<'h2'>) => (
    <h2
        data-slot="section-header-title"
        className={cn('typo-h4-bold text-foreground text-balance', className)}
        {...props}
    >
        {children}
    </h2>
)

// asChild 로 <ul> 등 다른 요소에 설명 스타일을 씌운다 — 여러 줄 안내가 필요하면
// ul + ListMarker 리스트로 조합한다(Figma "리스트형 설명"). 기본은 <p>.
const SectionHeaderDescription = ({
    className,
    asChild = false,
    ...props
}: ComponentPropsWithoutRef<'p'> & {asChild?: boolean}) => {
    const Comp = asChild ? Slot.Root : 'p'

    return (
        <Comp
            data-slot="section-header-description"
            className={cn('typo-body-xl-regular text-foreground-subtle', className)}
            {...props}
        />
    )
}

// 제목 오른쪽에 배치하는 선택적 액션 영역(버튼 등). 넣지 않으면 SectionHeader 는 그냥 세로 스택.
const SectionHeaderAction = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="section-header-action"
        className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
        {...props}
    />
)

export {SectionHeader, SectionHeaderTitle, SectionHeaderDescription, SectionHeaderAction}
