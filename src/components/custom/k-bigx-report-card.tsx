import type {ReactNode} from 'react'
import {FileDigit, FolderOpen, type LucideIcon} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {CardActionBar, CardActionBarStart} from '@/components/composite/card-action-bar'
import {Badge} from '@/components/ui/badge'
import {KBigxReportDownloadButton} from '@/components/custom/k-bigx-report-download-button'
import {Button} from '@/components/ui/button'
import {
    K_BIGX_BULK_REPORT_ACTION,
    K_BIGX_REPORT_INQUIRY_TYPE,
    K_BIGX_REPORT_TYPE,
    TICKET_DEDUCTION_BADGE,
    type KBigxBulkReportAction,
    type KBigxReportHistoryItem,
} from '@/constants/k-bigx-report-history'
import {cn} from '@/lib/utils'

// K-BIGx 보고서 이력 카드 — Figma "SB-FOTA-CM0-0017_마이페이지_K-BIGx 보고서 이력"(기업)·
// "기관 - K-BIGx 보고서 이력" 조회결과 case(기관)의 리스트 한 장.
// 기업명 / 이용권 배지 · 상세 · 버튼 하나로 이루어진다. 기관 카드에는 두 가지가 더 붙는다.
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

// 이용권 배지 — 시안 '카운트'(높이 28 · 좌우 12 · 반경 8 · 면 navy.100 · 테두리 navy.200 · 글자 13 Medium navy.600).
// 공용 Badge 는 면(navy.50)과 글자 크기(12 · 14)가 시안과 달라, 덮어쓰면 typo-* 가 겹치므로[PB-08] 이 카드에서만 쓰는 모양으로 둔다.
const TICKET_BADGE_CLASS_NAME =
    'typo-body-m-medium bg-navy-100 border-navy-200 text-navy-600 inline-flex h-7 shrink-0 items-center rounded-sm border px-3 whitespace-nowrap'

type KBigxReportCardProps = {
    item: KBigxReportHistoryItem
    /** 대량정보조회 [엑셀 결과]·[HTML 압축파일] 이 가는 곳(결과 파일). */
    routes: Record<KBigxBulkReportAction, string>
    /** [보고서 다운로드] 의 보고서 문서 화면 주소 — 기업 · 기관 report-print(k-bigx-print-report.ts 의 KBIGX_PRINT_*_PATH). */
    printPath: string
}

const BULK_REPORT_ACTIONS: readonly {action: KBigxBulkReportAction; label: string; icon: LucideIcon}[] = [
    {action: 'excel', label: K_BIGX_BULK_REPORT_ACTION.excel, icon: FileDigit},
    {action: 'htmlArchive', label: K_BIGX_BULK_REPORT_ACTION.htmlArchive, icon: FolderOpen},
]

const KBigxReportCard = ({item, routes, printPath}: KBigxReportCardProps) => {
    const inquiryType = K_BIGX_REPORT_INQUIRY_TYPE[item.inquiryType]
    const reportType = item.reportType ? K_BIGX_REPORT_TYPE[item.reportType] : undefined
    // 버튼 — 대량정보조회만 결과 파일 둘이고, 나머지(기업 카드·기업혁신성장)는 [보고서 다운로드] 하나다.
    const isBulkReport = item.reportType === 'bulk-info'
    // 이 건에 이용권이 깎였는지만 알린다 — 수가 아니라 차감 · 미차감 두 가지다.
    const deductionLabel = item.isTicketDeducted ? TICKET_DEDUCTION_BADGE.deducted : TICKET_DEDUCTION_BADGE.notDeducted

    return (
        <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    {/* 기업명 · 이용권 배지: 들어가면 한 줄(배지 세로 가운데), 모자라면 배지가 다음 줄 */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <div className="flex min-w-0 grow flex-col items-start gap-1">
                            {reportType ? (
                                <Badge variant="outline" color={reportType.color} shape="round" size="xs">
                                    {reportType.label}
                                </Badge>
                            ) : null}
                            <h3 className="typo-title-l-bold text-foreground min-w-0">{item.companyName}</h3>
                        </div>

                        {/* 이용권 배지 — 기업명 줄 오른쪽 끝(현업 요청: 여/부 상자 대신 '이용권 차감' · '이용권 미차감').
                            두 값은 글자로 갈리고 색은 같다 — 색만으로 뜻을 나르지 않는다[5.3.1]. */}
                        <p className={TICKET_BADGE_CLASS_NAME}>{deductionLabel}</p>
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
                        {/* 조회일시 — 날짜 + 시각(HH:mm). 한 묶음이라 줄이 바뀌지 않는다. */}
                        <ReportDetail
                            label="조회일시"
                            className="sm:shrink-0"
                            valueClassName="typo-body-l-regular text-foreground whitespace-nowrap"
                        >
                            {item.inquiredTime ? `${item.inquiredAt} ${item.inquiredTime}` : item.inquiredAt}
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

                {/* 버튼: 보조 · 아이콘 · 왼쪽(CardActionBar). 대량정보조회는 결과 파일 둘, 나머지는 [보고서 다운로드].
                    sr-only 기업명으로 어느 건의 버튼인지 알린다[6.4.3]. */}
                <CardActionBar>
                    <CardActionBarStart>
                        {isBulkReport ? (
                            BULK_REPORT_ACTIONS.map(({action: bulkAction, label, icon: BulkIcon}) => (
                                <Button key={bulkAction} asChild variant="secondary" size="sm">
                                    <a href={routes[bulkAction]}>
                                        <BulkIcon aria-hidden="true" />
                                        {label}
                                        <span className="sr-only">{` (${item.companyName})`}</span>
                                    </a>
                                </Button>
                            ))
                        ) : (
                            // 웹 보고서와 같은 흐름 — 보고서 내용 선택 모달 → 새 탭 미리보기 → [PDF 다운로드](k-bigx-report-download-button.tsx).
                            <KBigxReportDownloadButton item={item} printPath={printPath} />
                        )}
                    </CardActionBarStart>
                </CardActionBar>
            </div>
        </BaseCard>
    )
}

export {KBigxReportCard}
export type {KBigxReportCardProps}
