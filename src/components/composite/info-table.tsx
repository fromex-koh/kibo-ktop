import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 정보 표(InfoTable) — 이름 칸(옅은 파란 면) + 값 칸(흰 면)을 한 줄에 두 쌍씩 늘어놓는 조회용 표.
// 기업 정보처럼 '항목: 값' 쌍을 문서 안에 촘촘히 보여 줄 때 쓴다(카드형 목록은 SummaryList).
//
// 짜임: 위 진한 선 1(foreground-subtle) · 칸 아래 선 1(subtle-3) ·
//   이름 칸 폭 160(모바일 112) · 칸 여백 12/16 · 이름 = 옅은 파란 면(primary-subtle) · 14 Bold 가운데 · 값 = 흰 면(card) · 14 Regular 왼쪽.
// 반응형: PC(xl) 는 한 줄에 두 쌍(이름 · 값 · 이름 · 값), 태블릿 · 모바일은 한 쌍씩 세로로 쌓는다 — 태블릿에서
//   두 쌍을 두면 값 칸이 200 안팎으로 좁아져 긴 값이 너덧 줄로 접히기 때문이다. 가로 스크롤 없이 폭만 줄어든다. 줄 수가 폭마다 달라지므로 <table> 이 아니라 정의 목록(<dl>) + CSS grid 로 그린다.
//   각 쌍은 <div> 로 dt/dd 를 묶고(HTML 허용) display:contents 로 grid 칸에 그대로 풀어 놓는다 —
//   스크린리더는 '이름: 값' 쌍으로 읽는다[7.3.2]/[8.1.1].
// 칸 너비: 이름 열은 auto 로 두고 이름 칸이 제 폭(w-28 · md:w-40)을 가진다 — grid 템플릿에 수치를 적지 않는다.
// 긴 값: 한글은 어절 단위로 접고(break-keep), 띄어쓰기 없는 긴 영문 · 숫자 · 붙여 쓴 말은 칸 안에서 끊는다
//   (wrap-anywhere — flex 칸 안의 글자라 최소 폭 계산에도 끊는 자리가 반영돼야 한다) — 칸 밖으로 넘쳐 문서가 넓어지지 않게. 줄이 늘어나면 같은 줄의 칸이 함께 높아지고,
//   이름 · 값은 칸의 세로 가운데에 놓인다.

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

// 줄 높이 45(글자 줄 21 + 위 12 · 아래 11 + 아래 선 1) — 보고서 표(ReportTable)와 같은 줄 높이.
const cellClassName = 'border-subtle-3 border-b px-4 pt-3 pb-2.75'

const InfoTable = ({items, layout = 'responsive', className, ...props}: InfoTableProps) => (
    <dl
        data-slot="info-table"
        className={cn(
            'border-t-foreground-subtle grid border-t',
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
                        cellClassName,
                        'bg-primary-subtle typo-body-l-bold text-foreground flex items-center justify-center text-center wrap-anywhere break-keep',
                        layout === 'pairs' ? 'w-40' : 'w-28 md:w-40',
                    )}
                >
                    {item.label}
                </dt>
                <dd
                    className={cn(
                        cellClassName,
                        'bg-card typo-body-l-regular text-label-foreground m-0 flex items-center wrap-anywhere break-keep',
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
