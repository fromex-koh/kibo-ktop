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

// 크기 — 기본은 섹션 제목(24). lg 는 화면 제목(32)으로, 마이페이지처럼 페이지 제목 아래에 화면 제목이
// 한 단계 더 있는 구성에서 쓴다(단계형 화면의 StepHeader 와 같은 타이포 짝이다).
type SectionHeaderSize = 'md' | 'lg'

const SECTION_HEADER_TITLE_TYPO: Record<SectionHeaderSize, string> = {
    md: 'typo-h4-bold',
    lg: 'typo-h1-bold',
}

const SECTION_HEADER_DESCRIPTION_TYPO: Record<SectionHeaderSize, string> = {
    md: 'typo-body-xl-regular',
    lg: 'typo-title-m-regular',
}

const SectionHeaderTitle = ({
    size = 'md',
    className,
    children,
    ...props
}: ComponentPropsWithoutRef<'h2'> & {size?: SectionHeaderSize}) => (
    <h2
        data-slot="section-header-title"
        className={cn(SECTION_HEADER_TITLE_TYPO[size], 'text-foreground', className)}
        {...props}
    >
        {children}
    </h2>
)

// asChild 로 <ul> 등 다른 요소에 설명 스타일을 씌운다 — 여러 줄 안내가 필요하면
// ul + ListMarker 리스트로 조합한다(Figma "리스트형 설명"). 기본은 <p>.
const SectionHeaderDescription = ({
    size = 'md',
    className,
    asChild = false,
    ...props
}: ComponentPropsWithoutRef<'p'> & {asChild?: boolean; size?: SectionHeaderSize}) => {
    const Comp = asChild ? Slot.Root : 'p'

    return (
        <Comp
            data-slot="section-header-description"
            className={cn(SECTION_HEADER_DESCRIPTION_TYPO[size], 'text-foreground-subtle', className)}
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
export type {SectionHeaderSize}
