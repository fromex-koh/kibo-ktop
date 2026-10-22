import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {
    infoTableCellLineClassName,
    infoTableHeadSurfaceClassName,
    infoTableTopLineClassName,
    infoTableValueSurfaceClassName,
    infoTableWrapClassName,
} from '@/components/theme/info-table.variants'
import {cn} from '@/lib/utils'

// 정보 표(InfoTable) — '이름: 값' 쌍을 촘촘히 보여 주는 조회용 표(기업 정보 등). 카드형 목록은 SummaryList,
// 열 머리 · 칸 합치기가 필요한 표는 ui/table + theme/info-table.variants.ts(/component-guide/info-table 참고).
//
// 배치: xl 이상 한 줄에 두 쌍, 그 아래 한 쌍씩 쌓는다. layout="pairs" 는 폭과 무관하게 늘 두 쌍이다.
//   줄 수가 폭마다 달라져 <table> 대신 <dl> + CSS grid 로 그린다. 쌍마다 <div className="contents"> 로
//   dt · dd 를 묶어 grid 칸에 풀어 놓고, 스크린리더는 '이름: 값' 으로 읽는다[7.3.2][8.1.1].
// 칸: 이름 칸 폭 w-28(md 이상 w-40) · 가운데 정렬, 값 칸은 남은 폭 · 왼쪽 정렬. 긴 값은 칸 안에서 접히고
//   같은 줄 칸이 함께 높아진다.
// 스타일: 선 · 여백 · 면 · 글자는 theme/info-table.variants.ts 의 공용 값이다. 값을 바꿀 때는 그 파일만 고친다.

type InfoTableItem = {
    /** 이름 칸(dt) */
    label: ReactNode
    /** 값 칸(dd) */
    value: ReactNode
}

type InfoTableProps = Omit<ComponentPropsWithoutRef<'dl'>, 'children'> & {
    items: readonly (InfoTableItem & {key?: string})[]
    /**
     * 'responsive'(기본)는 PC(xl) 두 쌍 · 그 아래 한 쌍. 'pairs' 는 폭과 무관하게 늘 두 쌍(이름 칸 160)이다 —
     * 화면 전체가 PC 폭을 지키고 좁으면 가로로 넘기는 곳(보고서 기업현황 탭)에서 쓴다.
     */
    layout?: 'responsive' | 'pairs'
}

const InfoTable = ({items, layout = 'responsive', className, ...props}: InfoTableProps) => (
    <dl
        data-slot="info-table"
        className={cn(
            infoTableTopLineClassName,
            'grid',
            layout === 'pairs'
                ? 'grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]'
                : 'grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]',
            className,
        )}
        {...props}
    >
        {items.map((item, index) => (
            <div key={item.key ?? index} className="contents">
                <dt
                    className={cn(
                        infoTableCellLineClassName,
                        infoTableHeadSurfaceClassName,
                        infoTableWrapClassName,
                        'flex items-center justify-center text-center',
                        layout === 'pairs' ? 'w-40' : 'w-28 md:w-40',
                    )}
                >
                    {item.label}
                </dt>
                <dd
                    className={cn(
                        infoTableCellLineClassName,
                        infoTableValueSurfaceClassName,
                        infoTableWrapClassName,
                        'm-0 flex items-center',
                    )}
                >
                    {item.value}
                </dd>
            </div>
        ))}
    </dl>
)

export {InfoTable}
export type {InfoTableItem, InfoTableProps}
