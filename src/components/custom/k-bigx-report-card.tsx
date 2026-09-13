import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    K_BIGX_REPORT_ACTION,
    K_BIGX_BULK_REPORT_ACTION,
    K_BIGX_REPORT_INQUIRY_TYPE,
    K_BIGX_REPORT_TYPE,
    TICKET_DEDUCTION_LABEL,
    TICKET_DEDUCTION_MARK,
    type KBigxReportAction,
    type KBigxBulkReportAction,
    type KBigxReportHistoryItem,
} from '@/constants/k-bigx-report-history'
import {cn} from '@/lib/utils'

// K-BIGx 보고서 이력 카드 — Figma "SB-FOTA-CM0-0017_마이페이지_K-BIGx 보고서 이력"(기업)·
// "기관 - K-BIGx 보고서 이력" 조회결과 case(기관)의 리스트 한 장.
// 기업명 / 이용권 상자 · 상세 · 버튼 하나로 이루어진다. 기관 카드에는 두 가지가 더 붙는다.
//   · 기업명 위의 보고서 유형 배지(기업혁신성장·대량정보조회) — 유형에 따라 버튼이 [보고서 다운로드] 하나 · [엑셀 결과]·[HTML 압축파일] 둘로 갈린다.
//   · 상세 네 번째 칸 [조회 기관] — 누가 조회했는지.
// 두 값은 기관 데이터에만 있어, 값이 없으면(기업) 그 자리도 그리지 않는다.

// 상세 한 칸 — 시안은 라벨이 값 위에 오는 두 줄이다(라벨 14 · 값 14, 줄 사이 4).
// 칸 전체는 라벨-값 쌍이라 정의 목록으로 둔다[7.3.2].
// valueClassName — 조회유형만 값이 색·굵기가 다르다(시안 Medium). 색만으로 뜻을 나르지 않고 글자가 그대로 말한다[5.3.1].
const ReportDetail = ({
    label,
    children,
    className,
    valueClassName = 'typo-body-l-regular text-foreground',
}: {
    label: string
    children: ReactNode
    className?: string
    valueClassName?: string
}) => (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
        <dt className="typo-body-l-regular text-foreground-subtle">{label}</dt>
        <dd className={cn('m-0 min-w-0 break-words', valueClassName)}>{children}</dd>
    </div>
)

type KBigxReportCardProps = {
    item: KBigxReportHistoryItem
    /** 버튼이 가는 곳 — [보고서 다운로드] 는 보고서 파일, [엑셀 결과]·[HTML 압축파일] 은 대량정보조회 결과 파일이다. */
    routes: Record<KBigxReportAction | KBigxBulkReportAction, string>
}

const BULK_REPORT_ACTIONS: readonly {action: KBigxBulkReportAction; label: string}[] = [
    {action: 'excel', label: K_BIGX_BULK_REPORT_ACTION.excel},
    {action: 'htmlArchive', label: K_BIGX_BULK_REPORT_ACTION.htmlArchive},
]

const KBigxReportCard = ({item, routes}: KBigxReportCardProps) => {
    const inquiryType = K_BIGX_REPORT_INQUIRY_TYPE[item.inquiryType]
    const reportType = item.reportType ? K_BIGX_REPORT_TYPE[item.reportType] : undefined
    // 버튼 — 대량정보조회만 결과 파일 둘이고, 나머지(기업 카드·기업혁신성장)는 [보고서 다운로드] 하나다.
    const isBulkReport = item.reportType === 'bulk-info'
    // 시안의 상자는 수가 아니라 여/부 한 글자다 — 이 건에 이용권이 깎였는지만 알린다.
    const deductionMark = item.isTicketDeducted ? TICKET_DEDUCTION_MARK.deducted : TICKET_DEDUCTION_MARK.notDeducted

    return (
        <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    {/* 기업명(기관은 배지+기업명 묶음)이 오른쪽 이용권 상자 높이의 가운데에 선다(기업·기관 시안 같음). */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-col items-start gap-1">
                            {reportType ? (
                                <Badge variant="outline" color={reportType.color} shape="round" size="xs">
                                    {reportType.label}
                                </Badge>
                            ) : null}
                            <h3 className="typo-title-l-bold text-foreground min-w-0">{item.companyName}</h3>
                        </div>

                        {/* 이용권 상자 — 옅은 남색 면에 여/부 한 글자가 크게 선다(시안 81×71).
                            두 조각이 한 덩어리("이용권차감 여")로 읽히도록 읽을 문장을 따로 두고
                            보이는 것은 감춘다(role 이 없는 요소에는 aria-label 을 쓸 수 없다[8.1.1]). */}
                        <p className="bg-navy-100 border-navy-200 text-navy-600 flex shrink-0 flex-col items-center rounded-sm border px-3 py-2">
                            <span className="sr-only">{`${TICKET_DEDUCTION_LABEL} ${deductionMark}`}</span>
                            <span aria-hidden="true" className="typo-h3-bold">
                                {deductionMark}
                            </span>
                            <span aria-hidden="true" className="typo-caption-medium">
                                {TICKET_DEDUCTION_LABEL}
                            </span>
                        </p>
                    </div>

                    {/* 칸들이 한 줄에 이어 붙는다(시안 칸 사이 24). 조회유형·조회일시는 값의 길이가 정해져 있어
                        글자만큼만 차지하고, 특허명·조회 기관은 넘치면 그 칸 안에서 줄바꿈된다 — 아래로 밀려
                        내려가면 시안의 한 줄 배치가 무너진다. 좁은 화면(sm 미만)에서는 설 자리가 없어 위아래로 쌓는다. */}
                    <dl className="flex flex-col gap-4 sm:flex-row sm:gap-x-6 sm:gap-y-0">
                        <ReportDetail
                            label="조회유형"
                            className="sm:shrink-0"
                            valueClassName={cn('typo-body-l-medium', inquiryType.className)}
                        >
                            {inquiryType.label}
                        </ReportDetail>
                        <ReportDetail label="조회일시" className="sm:shrink-0">
                            {item.inquiredAt}
                        </ReportDetail>
                        <ReportDetail label={isBulkReport ? '데이터 건수' : '특허명'} className="sm:min-w-0">
                            {item.patentName}
                        </ReportDetail>
                        {item.inquiryOrganization ? (
                            <ReportDetail label="조회 기관" className="sm:min-w-0">
                                {item.inquiryOrganization}
                            </ReportDetail>
                        ) : null}
                    </dl>
                </div>

                {/* 시안: 카드 오른쪽 끝에 버튼 하나(180). 대량정보조회는 결과 파일 둘이 같은 폭으로 나란하다.
                    좁은 화면에서는 줄을 가득 채운다(대량정보조회는 위아래로 쌓는다).
                    어느 건의 보고서인지 이름에 담는다[6.4.3]. */}
                <div className={cn('flex justify-end gap-2', isBulkReport && 'max-sm:flex-col')}>
                    {isBulkReport ? (
                        BULK_REPORT_ACTIONS.map(({action: bulkAction, label}) => (
                            <Button key={bulkAction} asChild variant="tertiary" size="sm" className="w-full sm:flex-1">
                                <a href={routes[bulkAction]}>
                                    {label}
                                    <span className="sr-only">{` (${item.companyName})`}</span>
                                </a>
                            </Button>
                        ))
                    ) : (
                        <Button asChild variant="tertiary" size="sm" className="max-sm:w-full sm:w-45">
                            <a href={routes.download}>
                                {K_BIGX_REPORT_ACTION.download}
                                <span className="sr-only">{` (${item.companyName})`}</span>
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </BaseCard>
    )
}

export {KBigxReportCard}
export type {KBigxReportCardProps}
