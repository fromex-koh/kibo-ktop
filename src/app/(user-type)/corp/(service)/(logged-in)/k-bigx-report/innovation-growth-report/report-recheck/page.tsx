import {Fragment} from 'react'
import type {Metadata} from 'next'
import {KbigxReportRecheckDialog} from '@/components/composite/k-bigx-report-recheck-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {REPORT_RECHECK_FLOW} from '@/content/service/k-bigx-report-recheck'
import {cn} from '@/lib/utils'

export const metadata: Metadata = {title: '보고서 재조회 안내'}

// [퍼블리싱 확인용] K-BIGx 기업혁신성장 조회의 [보고서 재조회 안내] 모달만 띄워 보는 화면 — 다른 모달 단독 화면과
// 같은 방식이다. 서비스에서는 이 주소가 아니라 조회 화면 [보고서 생성]이 이 모달을 연다
// (innovation-growth-report-lookup 의 [프론트엔드 연동] 3).
const CorpKbigxReportRecheckPage = () => (
    <>
        {/* 설명이 네 줄이라 위 여백을 줄여(60 → 16) PC 에서 모달에 가리지 않게 한다. 항목명 칸을 맞춰 왼쪽 정렬한다. */}
        <main id="main" tabIndex={-1} className={cn(popupPreviewMainClassName, 'py-4')}>
            <PopupPreviewNote
                title="보고서 재조회 안내"
                className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-left"
            >
                {REPORT_RECHECK_FLOW.map(({label, value}) => (
                    <Fragment key={label}>
                        <strong className="typo-body-xl-bold text-foreground">{label}</strong>
                        <span>{value}</span>
                    </Fragment>
                ))}
            </PopupPreviewNote>
        </main>
        <KbigxReportRecheckDialog defaultOpen />
    </>
)

export default CorpKbigxReportRecheckPage
