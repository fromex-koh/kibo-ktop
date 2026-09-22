'use client'

import {useId, type ReactNode} from 'react'
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
    VIEW_COUNT_DEDUCTION_NOTICE,
    VIEW_COUNT_DEDUCTION_PASS_TITLE,
    VIEW_COUNT_DEDUCTION_QUESTION,
    VIEW_COUNT_DEDUCTION_TITLE,
} from '@/content/service/k-bigx-view-count-deduction'
import {cn} from '@/lib/utils'

// 조회횟수 차감안내 모달.
// 이용권이 있는 상태에서 다른 기업의 보고서를 조회할 때 뜬다. 확인 질문(기업명만 파란색, 3줄) → 이용권 현황
// (테두리 상자, 잔여 횟수만 파란색) → [취소] [이용권 사용]. 짜임은 보고서 생성 모달과 같다.
//
// 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목과 질문 24 · 질문(20 Bold)과 이용권 현황 24 ·
// 현황 제목(18 Bold)과 상자 8 · 상자(테두리 gray.100 · 반경 12 · 여백 24 · 줄 사이 12) · 두 버튼 사이 8.
// 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type KbigxViewCountDeductionDialogProps = {
    /** 조회할 기업명 — 질문 문장에서 파란색으로 강조된다. */
    companyName: string
    /** 이용중인 플랜 이름. */
    planName: string
    /** 잔여 이용권(회) · 월 조회한도(회). [프론트엔드 연동] planName 과 함께 사용자의 이용권 현황으로 채운다. */
    remainingCount: number
    monthlyLimit: number
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 바깥에서 열고 닫을 때(보고서 생성 모달의 [보고서 생성] 뒤에 이어 열기). */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [이용권 사용]을 눌렀을 때. [프론트엔드 연동] 이용권 1회 차감 후 보고서 조회를 연결한다. */
    onUse?: () => void
    /**
     * [이용권 사용]이 새 창으로 열 보고서. 주면 버튼이 새 창 링크가 된다 — 이용권 차감 뒤 보고서 문서(보고서 출력)가
     * 지정한 크기의 창으로 열린다. 없으면 onUse 만 부른다.
     */
    reportWindow?: {href: string; width: number; height: number; windowName?: string}
}

const KbigxViewCountDeductionDialog = ({
    companyName,
    planName,
    remainingCount,
    monthlyLimit,
    children,
    defaultOpen,
    open,
    onOpenChange,
    onUse,
    reportWindow,
}: KbigxViewCountDeductionDialogProps) => {
    const passTitleId = useId()

    return (
        <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
                제목 줄과 맞춘다(오른쪽·위 32). */}
            <DialogContent className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8">
                <DialogHeader className="sm:px-8 sm:pt-8">
                    <DialogTitle className="break-keep">{VIEW_COUNT_DEDUCTION_TITLE}</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogInfoBodyClassName, 'break-keep sm:px-8')}>
                    {/* 질문은 모달 설명(DialogDescription)이다 — 20 Bold 라 <p> 로 두면 WAVE 가 "Possible heading" 으로
                        잡는다. 긴 기업·기관명은 한글 기본 줄바꿈으로 흐르고(break-normal), 넘칠 때는 끊는다(wrap-anywhere).
                        고정 문구는 낱말 단위로만 줄을 바꾼다. 말줄임은 쓰지 않는다 — 모두 보여야 한다. */}
                    <DialogDescription asChild>
                        <span className="typo-title-l-bold text-foreground block break-normal wrap-anywhere">
                            <span className="text-primary">{companyName}</span>의
                            <br />
                            <span className="break-keep">{VIEW_COUNT_DEDUCTION_QUESTION}</span>
                            <br />
                            <span className="break-keep">{VIEW_COUNT_DEDUCTION_NOTICE}</span>
                        </span>
                    </DialogDescription>

                    <section aria-labelledby={passTitleId} className="mt-6 flex flex-col gap-2">
                        <h2 id={passTitleId} className="typo-title-m-bold text-foreground">
                            {VIEW_COUNT_DEDUCTION_PASS_TITLE}
                        </h2>
                        {/* 항목명과 값이 한 줄에 서고, 좁은 화면에서 길어지면 각자 칸 안에서 접힌다(말줄임 없음).
                            짧은 항목명(이용중인 플랜)은 줄지 않고, 플랜명은 낱말 단위로 줄을 바꾼다(넘칠 때만 낱말 안에서 끊음). */}
                        <dl className="border-subtle-3 flex flex-col gap-3 rounded-md border p-6">
                            <div className="flex items-start justify-between gap-4">
                                <dt className="typo-body-xl-regular text-foreground-subtle shrink-0">이용중인 플랜</dt>
                                <dd className="typo-body-xl-medium text-label-foreground m-0 min-w-0 text-right wrap-anywhere">
                                    {planName}
                                </dd>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <dt className="typo-body-xl-regular text-foreground-subtle min-w-0">
                                    잔여 이용권 / 월 조회한도
                                </dt>
                                <dd className="typo-body-xl-medium text-label-foreground m-0 shrink-0 text-right">
                                    <span className="text-primary">{`${remainingCount}회`}</span>
                                    {` / ${monthlyLimit}회`}
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>
                <DialogFooter className="sm:gap-2 sm:px-8">
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl">
                            취소
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        {reportWindow ? (
                            <Button asChild size="xl" onClick={onUse}>
                                <NewWindowLink
                                    href={reportWindow.href}
                                    width={reportWindow.width}
                                    height={reportWindow.height}
                                    windowName={reportWindow.windowName}
                                >
                                    이용권 사용
                                </NewWindowLink>
                            </Button>
                        ) : (
                            <Button type="button" size="xl" onClick={onUse}>
                                이용권 사용
                            </Button>
                        )}
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {KbigxViewCountDeductionDialog}
export type {KbigxViewCountDeductionDialogProps}
