import type {ReactNode} from 'react'
import Image from 'next/image'
import reportSectionMark from '@public/images/report/section-mark.webp'
import {cn} from '@/lib/utils'

// 인쇄용 리포트 문서의 뼈대 — 문서 머리 · 구획 제목 · 이름값 표처럼 리포트마다 똑같이 쓰는 조각만 둔다.
// 문서 폭은 A4 794(w-report) · 좌우 여백 40 이다.
//
// 리포트별 파일 (새 리포트를 만들 때도 같은 짝으로 둔다)
//   값 · 문구   content/service/<모형>-report.ts   ← 연동할 때 여기만 고친다
//   문서 그리기 components/custom/<모형>-report.tsx
//   화면        app/.../(report)/.../page.tsx      ← 값을 받아 문서에 넘기기만 한다
// 지금 있는 것: KTRS-FM(evaluation-report) · Tech-Index(tech-index-report).

/** 이름과 값 한 줄짜리 표(평가기업·평가의견)의 한 줄. */
type ReportTableRow = {label: string; value: string}

// 표 칸 — 이름 칸은 옅은 파란 면, 값 칸은 흰 면이다. 표 맨 위의 진한 가로줄은 테두리가 아니라
// 표 위에 얹은 선이다: 칸 테두리와 굵기가 같아 border 로 그리면 칸의 세로 테두리가 이겨
// 교차점마다 회색 점이 찍힌다(테두리 우선순위: 칸 > 줄 > 열 > 표).
const tableClassName =
    'relative w-full table-fixed border-collapse before:bg-foreground-subtle before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[""]'
// 글자 크기를 뺀 칸 모양 — 같은 요소에 typo-* 를 두 개 겹쳐 쓰지 않으려고 갈라 둔다[PB-08].
const cellShapeClassName = 'border-subtle-3 border-b px-4 py-2'
const headCellShapeClassName = `bg-primary-subtle text-foreground ${cellShapeClassName}`
const headCellClassName = `typo-caption-bold ${headCellShapeClassName}`
const bodyCellClassName = `typo-caption-regular text-label-foreground ${cellShapeClassName}`

// 머리 위의 장식 띠 — 높이 4. 사선 틈으로 나뉜 조각 셋이고 왼쪽에서
// 오른쪽으로 갈수록 색이 밝아진다(남색 → 청색 → 파랑).
// 왼쪽부터 남색 36 · 청색 140 · 나머지 파랑이고, 조각 사이는 4 씩 띄운다.
// 틈으로는 머리 상자의 면 색이 그대로 비친다. 띠는 문서 폭을 꽉 채우므로 양 끝을 둥글리지 않는다.
// 뜻을 담지 않는 그림이라 읽어 주지 않는다[5.1.1].
const ReportHeaderStripe = () => (
    <div aria-hidden="true" className="bg-primary-subtle flex h-1 gap-1 overflow-hidden">
        {/* 바깥쪽 조각의 -ml-1·-mr-1 — 기울인 만큼 위아래가 어긋나 생기는 양 끝 빈틈을 덮는다. */}
        <span className="bg-navy-600 -ml-1 w-9 shrink-0 -skew-x-55" />
        <span className="w-35 shrink-0 -skew-x-55 bg-blue-700" />
        <span className="bg-primary -mr-1 flex-1 -skew-x-55" />
    </div>
)

const ReportDocument = ({
    label,
    title,
    action,
    spacing = 'normal',
    startsNewPage = false,
    children,
}: {
    label: string
    title: string
    action?: ReactNode
    /**
     * 인쇄할 때 새 장에서 시작할지. 문서가 여럿 이어지는 리포트(심층분석)에서 두 번째 문서부터 준다 —
     * 화면에서는 이어져 보이고 종이에서만 장이 갈린다.
     */
    startsNewPage?: boolean
    /**
     * 구획 사이 간격 — 리포트마다 다르다(normal 24 · compact 16 · tight 12).
     * 화면과 인쇄물이 같은 값을 쓴다. A4 한 장에 맞춘 문서라 이 간격이 쌓이면 마지막 구획이 다음 장으로 밀린다.
     *   normal  KTRS-FM
     *   compact Tech-Index
     *   tight   창업용 Tech-Index — 각주 한 줄이 더 있어 한 단계 더 좁혀야 두 줄까지 한 장에 들어간다
     */
    spacing?: 'normal' | 'compact' | 'tight'
    children: ReactNode
}) => (
    <section className={cn('flex flex-col print:block', startsNewPage && 'print:break-before-page')}>
        {/* 문서 머리는 뒤따르는 내용과 떨어뜨리지 않는다 — 머리만 쪽 아래에 남으면 읽을 수 없다. */}
        <header className="bg-primary-subtle break-after-avoid">
            <ReportHeaderStripe />
            <div className="flex items-center justify-between gap-4 px-10 pt-4 pb-5">
                <div className="flex flex-col">
                    <p className="typo-body-m-regular text-label-foreground">{label}</p>
                    <h2 className="typo-title-l-bold text-foreground">{title}</h2>
                </div>
                {action}
            </div>
        </header>
        <div
            className={cn(
                // 머리 아래 여백(20)은 문서가 모두 같다 — 구획 사이 간격만 문서별로 갈린다.
                'flex flex-col px-10 pt-5 print:block',
                spacing === 'tight' && 'gap-3 pt-3 print:space-y-3',
                spacing === 'compact' && 'gap-4 pt-4 print:space-y-4',
                spacing === 'normal' && 'gap-6 pt-6 print:space-y-6',
            )}
        >
            {children}
        </div>
    </section>
)

// 인쇄할 때 구획이 쪽 경계에 걸치면 그래프가 반씩 잘려 다음 장에서 다시 그려진다(recharts 는 화면에서
// 잰 크기로 그려 두 번째 조각이 찌그러진다). 그래서 구획 하나는 한 쪽 안에 통째로 들어가게 둔다 —
// 한 쪽보다 큰 구획은 브라우저가 이 지시를 무시하고 원래대로 나눈다.
//
// canSplit 은 그 예외다. 줄만 이어지는 긴 표는 나뉘어도 읽는 데 지장이 없고, 오히려 통째로 묶으면
// 앞 쪽에 큰 빈 자리가 남는다. 표는 나뉘되 줄 하나가 반으로 갈라지지는 않게 한다(아래 DetailTable).
// 구획 제목 앞의 표식 — 16×16 그림이다. 뜻을 담지 않는 장식이라 읽어 주지 않는다[5.1.1].
// 쪽마다 여러 번 되풀이되는 그림이라 늦게 불러오지 않는다 — 인쇄 때 비어 나갈 여지를 없앤다.
const ReportSectionMark = () => (
    <Image
        src={reportSectionMark}
        alt=""
        width={16}
        height={16}
        priority
        className="size-icon-sm shrink-0 self-center"
    />
)

const ReportSection = ({
    title,
    aside,
    canSplit = false,
    children,
}: {
    title: string
    aside?: ReactNode
    /** 쪽 경계에서 나뉘어도 되는 구획인지. 그래프가 든 구획은 나뉘면 찌그러지므로 기본은 나누지 않는다. */
    canSplit?: boolean
    children: ReactNode
}) => (
    <section className={cn('flex flex-col gap-2 print:block print:space-y-2', !canSplit && 'break-inside-avoid')}>
        {/* 제목만 쪽 아래에 남으면 무엇에 대한 표인지 알 수 없다 — 뒤따르는 내용과 떨어뜨리지 않는다. */}
        <div className="flex break-after-avoid items-baseline justify-between gap-4">
            <h3 className="typo-body-xl-bold text-foreground flex items-center gap-2">
                <ReportSectionMark />
                {title}
            </h3>
            {aside}
        </div>
        {children}
    </section>
)

// 이름·값 표 — 가로 구분선만 긋고 세로선은 두지 않는다. 이름 칸의 옅은 파란 면이 값 칸과의 경계를
// 대신하고, 표의 좌우 끝도 열어 둔다.
const LabelValueTable = ({caption, rows}: {caption: string; rows: readonly ReportTableRow[]}) => (
    <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        {/* 이름 칸의 폭은 col 이 정한다 — 감춘 caption(position:absolute)이 있으면 칸에 직접 준 폭이
            table-fixed 계산에서 무시된다. col 은 실제 열 수만큼 둔다 — 모자라면 마크업 오류다[8.1.1]. */}
        <colgroup>
            <col className="w-30" />
            <col />
        </colgroup>
        <tbody>
            {rows.map((row) => (
                <tr key={row.label}>
                    <th scope="row" className={cn(headCellShapeClassName, 'typo-body-l-bold text-center align-middle')}>
                        {row.label}
                    </th>
                    <td className={cn(cellShapeClassName, 'typo-body-l-regular text-label-foreground align-middle')}>
                        {row.value}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)

// 보고서 화면의 인쇄 규칙 — 각 화면의 <main> 안에 <ReportPageStyle /> 로 한 번 둔다.
//
// A4 세로 · 여백 0 — 이 문서들은 A4 한 쪽(210 × 297mm) 크기이고 여백도 문서가 직접 그린다.
// 기본 여백이 붙거나 용지가 A4 가 아니면 폭이 모자라 브라우저가 문서 전체를 줄인다.
// 여백이 0 이면 브라우저가 그 자리에 찍던 머리글 · 바닥글(날짜 · 주소 · 쪽 번호)도 함께 사라진다 —
// 쪽 번호가 필요하면 문서 안에 직접 그린다.
const REPORT_PAGE_STYLE = `
@media print {
    @page { size: A4 portrait; margin: 0; }

    /* 창 높이(dvh) 기준 최소 높이를 푼다 — 인쇄에는 창 높이가 없어 다시 계산될 때마다 쪽 나눔이 흔들린다.
       문서가 이미 A4 크기라 배치는 그대로다. */
    main { min-height: 0; }

    /* 개발 모드에서 Next.js 가 화면에 고정해 띄우는 표시. 인쇄 배치를 건드린다(배포 빌드에는 없다). */
    nextjs-portal { display: none; }
}`

const ReportPageStyle = () => <style dangerouslySetInnerHTML={{__html: REPORT_PAGE_STYLE}} />

export {
    LabelValueTable,
    ReportDocument,
    ReportPageStyle,
    ReportSection,
    bodyCellClassName,
    cellShapeClassName,
    headCellClassName,
    headCellShapeClassName,
    tableClassName,
}
export type {ReportTableRow}
