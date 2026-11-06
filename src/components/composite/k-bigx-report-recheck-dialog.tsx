'use client'

// 'use client' — 다른 K-BIGx 모달과 같이 클라이언트에서 그린다(서버에서 넘긴 undefined 속성이 빠지는 문제를 피한다).

import type {ReactNode} from 'react'
import {FileClock} from 'lucide-react'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {
    REPORT_RECHECK_CONFIRM_LABEL,
    REPORT_RECHECK_DESCRIPTION,
    REPORT_RECHECK_HEADLINE,
    REPORT_RECHECK_NOTICE,
    REPORT_RECHECK_TITLE,
} from '@/content/service/k-bigx-report-recheck'
import {cn} from '@/lib/utils'

// 보고서 재조회 안내 — 같은 이용자가 금일 이미 조회한 기업을 같은 선택 특허로 다시 조회할 때,
// 조회 화면 [보고서 생성]이 [기업혁신성장 보고서 생성] 모달 대신 연다. 여는 조건은 조회 화면이 정한다
// (innovation-growth-report-lookup 의 [프론트엔드 연동] 3).
// 구성: 아이콘 → 안내 → 설명 2줄 → 차감 안내 상자 → [취소] 닫기 · [조회하기] 신규 보고서 조회.
// 규격은 다른 K-BIGx 모달과 같다(폭 588 · 여백 32, 모바일 24).

type KbigxReportRecheckDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 바깥에서 열고 닫을 때 — 조회 화면이 금일 조회 이력을 확인한 뒤 연다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [조회하기]를 눌렀을 때. [프론트엔드 연동] 생성 모달의 onCreate 와 같은 신규 보고서 생성 요청(이용권 차감)을 잇는다. */
    onConfirm?: () => void
    /** [조회하기]가 새 창으로 열 보고서. 주면 버튼이 새 창 링크가 된다 — 값 · 주의점은 생성 모달의 reportWindow 와 같다. */
    reportWindow?: {href: string; width: number; height: number; windowName?: string}
}

const KbigxReportRecheckDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    onConfirm,
    reportWindow,
}: KbigxReportRecheckDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮긴다. */}
        <DialogContent className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8">
            <DialogHeader className="sm:px-8 sm:pt-8">
                <DialogTitle className="break-keep">{REPORT_RECHECK_TITLE}</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogInfoBodyClassName, 'items-center text-center break-keep sm:px-8')}>
                {/* 안내 아이콘(문서 + 시계 = 이미 조회한 보고서) — 뜻은 아래 문구가 전하므로 꾸밈이다. */}
                <span
                    aria-hidden="true"
                    className="bg-primary-subtle text-primary flex size-15 items-center justify-center rounded-full"
                >
                    <FileClock className="size-icon-xl" strokeWidth={1.75} />
                </span>
                {/* 안내 · 설명은 모달 설명(DialogDescription) — 20 Bold 를 <p> 로 두면 제목으로 오인돼 span 으로 둔다. */}
                <DialogDescription asChild>
                    <span className="mt-4 flex flex-col gap-2">
                        <span className="typo-title-l-bold text-foreground block">{REPORT_RECHECK_HEADLINE}</span>
                        <span className="typo-body-xl-regular text-foreground-subtle flex flex-col gap-1 text-balance">
                            {REPORT_RECHECK_DESCRIPTION.map((line) => (
                                <span key={line} className="block">
                                    {line}
                                </span>
                            ))}
                        </span>
                    </span>
                </DialogDescription>
                {/* 차감 안내 — 위 아이콘과 겹쳐 보이지 않게 아이콘 없이 굵은 글씨로만 강조한다. */}
                <p className="bg-surface-subtle typo-body-xl-regular text-label-foreground mt-6 w-full rounded-sm p-5">
                    {`${REPORT_RECHECK_NOTICE.lead} `}
                    <strong className="typo-body-xl-bold text-foreground whitespace-nowrap">
                        {REPORT_RECHECK_NOTICE.emphasis}
                    </strong>
                </p>
            </div>
            <DialogFooter className="sm:gap-2 sm:px-8">
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    {reportWindow ? (
                        <Button asChild size="xl" onClick={onConfirm}>
                            <NewWindowLink
                                href={reportWindow.href}
                                width={reportWindow.width}
                                height={reportWindow.height}
                                windowName={reportWindow.windowName}
                            >
                                {REPORT_RECHECK_CONFIRM_LABEL}
                            </NewWindowLink>
                        </Button>
                    ) : (
                        <Button type="button" size="xl" onClick={onConfirm}>
                            {REPORT_RECHECK_CONFIRM_LABEL}
                        </Button>
                    )}
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {KbigxReportRecheckDialog}
export type {KbigxReportRecheckDialogProps}
