import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {ListMarker} from '@/components/custom/list-marker'
import {cn} from '@/lib/utils'

// 인포박스(InfoBox) — 화면 하단 안내·유의사항을 담는 "제목 + 불릿 목록" 패널. Figma "하단인포"·"타이틀 2줄" 반영.
// 외형(variant)을 둘로 나눈다:
//   · filled  = 옅은 회색 채움(gray.50) + 테두리 없음 (Figma "하단인포")
//   · outline = 흰 패널 + 옅은 테두리(gray.100)  (Figma "타이틀 2줄")
//
// 본문 불릿은 기존 ListMarker(custom/list-marker)를 그대로 재사용한다 — 같은 점 마커를 새로 만들지 않는다.
// 항목 목록이므로 <ul>/<li> 로 마크업하고(스크린리더가 항목 수·구조 전달), 제목은 목록 위에 먼저 읽힌다.
// 복합(compound) API — 이 프로젝트 표준(ReviewList·SummaryList 등)대로 컨테이너(InfoBox)와 항목(InfoBoxItem)을 나눈다.
//
// 색·타이포(Figma): 제목 = title-l-bold(20px)·foreground(gray.900), 본문·불릿 = body-xl-regular(16px)·
// foreground-subtle(gray.500, ListMarker 점 색과 동일). 전부 기존 토큰이라 커스텀 색이 없다([PB-04]).
// 규격(Figma): radius 16(rounded-lg), 패딩 px-10 py-8(40·32), 제목↔목록 gap-4(16), 항목 사이 gap-2(8),
// 마커↔본문 gap-1.5(6, ListMarker 표준 사용 간격).

type InfoBoxVariant = 'filled' | 'outline'

const infoBoxBaseClassName = 'flex w-full flex-col gap-4 rounded-lg px-10 py-8'

const INFO_BOX_VARIANT: Record<InfoBoxVariant, string> = {
    // filled — gray.50 채움(=background 토큰, Figma 하단인포 배경과 동일 값). 테두리 없음.
    filled: 'bg-background',
    // outline — 흰 패널(card) + gray.100 테두리(subtle-3). 형제 SummaryList 와 같은 테두리 계열.
    outline: 'bg-card border-subtle-3 border',
}

type InfoBoxProps = {
    // 외형 스타일. filled(회색 채움)·outline(테두리). 기본 filled.
    variant?: InfoBoxVariant
    // 상단 제목. 생략하면 목록만 렌더한다.
    title?: ReactNode
    // 제목 앞 선택적 아이콘(Figma "아이콘+타이틀" 슬롯). size-6(24px) 아이콘을 넘긴다.
    icon?: ReactNode
    // 목록 항목(InfoBoxItem) 들.
    children: ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'title'>

const InfoBox = ({variant = 'filled', title, icon, className, children, ...props}: InfoBoxProps) => (
    <div data-slot="info-box" className={cn(infoBoxBaseClassName, INFO_BOX_VARIANT[variant], className)} {...props}>
        {title != null ? (
            <div data-slot="info-box-header" className="flex items-center gap-2">
                {icon != null ? (
                    <span data-slot="info-box-icon" aria-hidden="true" className="shrink-0 [&_svg]:size-6">
                        {icon}
                    </span>
                ) : null}
                <p className="typo-title-l-bold text-foreground">{title}</p>
            </div>
        ) : null}
        <ul data-slot="info-box-list" className="flex list-none flex-col gap-2">
            {children}
        </ul>
    </div>
)

const InfoBoxItem = ({className, children, ...props}: ComponentPropsWithoutRef<'li'>) => (
    <li data-slot="info-box-item" className={cn('flex gap-1.5', className)} {...props}>
        <ListMarker type="unordered" level={1} />
        <span className="typo-body-xl-regular text-foreground-subtle min-w-0">{children}</span>
    </li>
)

export {InfoBox, InfoBoxItem}
export type {InfoBoxProps, InfoBoxVariant}
