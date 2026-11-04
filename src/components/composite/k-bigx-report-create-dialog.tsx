'use client'

// 'use client' — 특허 정보 제목 id(useId)를 쓰고, 다른 K-BIGx 모달과 같이 클라이언트에서 그린다.

import {useId, type ReactNode} from 'react'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {ListMarker} from '@/components/custom/list-marker'
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
    REPORT_CREATE_NO_PATENT_NOTICE,
    REPORT_CREATE_PAID_NOTICE,
    REPORT_CREATE_PATENT_TITLE,
    REPORT_CREATE_TITLE,
    type ReportCreatePatent,
} from '@/content/service/k-bigx-report-create'
import {getNameBreakClassName} from '@/lib/name-break'
import {cn} from '@/lib/utils'

// 기업혁신성장 보고서 생성 모달 — 확인 질문(기업명만 파란색) → 특허 정보(테두리 상자) → 안내 상자(회색) → [아니요] [보고서 생성].
// 특허수가 없는 기업은 patent 를 비워 넘긴다 — 특허 정보 상자 없이 안내 상자만 온다. 안내 내용은 notice 로 바꿀 수 있다(차감 케이스별).
// 규격: 폭 588 · 반경 24 · 여백 32(sm 미만 24, 특허 상자 16) · 질문 18 Bold · 질문과 특허 정보 24 · 상자와 안내 20 · 두 버튼 사이 8.

type KbigxReportCreateDialogProps = {
    /** 보고서를 만들 기업명 — 질문 문장에서 파란색으로 강조된다. */
    companyName: string
    /** 고른 특허의 정보(항목명 · 값). 특허수가 없는 기업이면 비워 넘긴다 — 특허 없음 안내로 바뀐다. */
    patent?: ReportCreatePatent
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [보고서 생성]을 눌렀을 때. [프론트엔드 연동] 보고서 생성 요청(이용횟수 차감)을 연결한다.
     *  reportWindow 를 함께 주면 같은 클릭에 창이 열리므로 요청 결과를 기다리지 못한다. */
    onCreate?: () => void
    /** 안내 상자의 내용 — 없으면 특허 유무에 맞는 기본 안내다. 자사조회 · 기관회원처럼 차감 조건이 다를 때 넘긴다. */
    notice?: {title: string; items: readonly string[]}
    /** [보고서 생성]이 새 창으로 열 보고서. 주면 버튼이 새 창 링크가 된다. */
    reportWindow?: {href: string; width: number; height: number; windowName?: string}
}

const KbigxReportCreateDialog = ({
    companyName,
    patent,
    children,
    defaultOpen,
    onCreate,
    notice,
    reportWindow,
}: KbigxReportCreateDialogProps) => {
    const patentTitleId = useId()
    const hasPatent = patent !== undefined && patent.length > 0
    const noticeContent = notice ?? (hasPatent ? REPORT_CREATE_PAID_NOTICE : REPORT_CREATE_NO_PATENT_NOTICE)

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
                제목 줄과 맞춘다(오른쪽·위 32). */}
            <DialogContent className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8">
                <DialogHeader className="sm:px-8 sm:pt-8">
                    <DialogTitle className="text-balance break-keep">{REPORT_CREATE_TITLE}</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogInfoBodyClassName, 'break-keep sm:px-8')}>
                    {/* 기업명 뒤에서 줄을 바꾼다 — 기업명이 길어도 질문이 한 덩어리로 읽힌다.
                        긴 이름도 태블릿 이상에서는 되도록 한 줄에 들어오도록 18 로 둔다. 넘치면 폭을 채운 뒤 줄을 바꾸고,
                        "의" 나 이름 끝만 한 줄에 남지 않게 한다(text-pretty). 긴 낱말은 모달 폭을 밀지 않도록 끊는다
                        (wrap-anywhere). 말줄임은 쓰지 않는다 — 어느 기업인지 모두 보여야 한다. */}
                    {/* 질문은 모달 설명(DialogDescription)이다 — 18 Bold 라 <p> 로 두면 WAVE 가 "Possible heading" 으로
                        잡는다. 설명으로 이어 두면 모달이 열릴 때 제목 다음에 읽히고, 블록 span 이라 제목으로 오인되지 않는다. */}
                    <DialogDescription asChild>
                        <span className="typo-title-m-bold text-foreground block">
                            <span className={cn('block text-pretty wrap-anywhere', getNameBreakClassName(companyName))}>
                                <span className="text-primary">{companyName}</span>의
                            </span>
                            {/* 고정 문구는 낱말 단위로만 줄을 바꾼다("생성하시겠습니 / 까?" 방지). */}
                            <span className="block text-balance break-keep">K-BIGx 보고서를 생성하시겠습니까?</span>
                        </span>
                    </DialogDescription>

                    {hasPatent ? (
                        <section aria-labelledby={patentTitleId} className="mt-6 flex flex-col gap-2">
                            <h2 id={patentTitleId} className="typo-title-m-bold text-foreground">
                                {REPORT_CREATE_PATENT_TITLE}
                            </h2>
                            <dl className="border-subtle-3 flex flex-col gap-3 rounded-md border p-4 sm:p-6">
                                {patent?.map((row) => (
                                    <div
                                        key={row.label}
                                        className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1"
                                    >
                                        {/* 값이 항목명 옆에 들어오면 오른쪽 끝에 붙고, 못 들어오면 항목명 아래 전체 폭으로 내려와 왼쪽부터 읽힌다(말줄임 없음). */}
                                        <dt className="typo-body-xl-regular text-foreground-subtle shrink-0">
                                            {row.label}
                                        </dt>
                                        <dd className="typo-body-xl-medium text-label-foreground m-0 max-w-full min-w-0 wrap-anywhere">
                                            {row.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    ) : null}

                    <section
                        className={cn(
                            'bg-surface-subtle flex flex-col gap-2 rounded-sm p-5',
                            hasPatent ? 'mt-5' : 'mt-6',
                        )}
                    >
                        <h2 className="typo-body-xl-bold text-foreground">{noticeContent.title}</h2>
                        <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2">
                            {noticeContent.items.map((item) => (
                                <li key={item} className="flex">
                                    <ListMarker type="unordered-small" />
                                    <span className="min-w-0">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <DialogFooter className="sm:gap-2 sm:px-8">
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl">
                            아니요
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        {reportWindow ? (
                            <Button asChild size="xl" onClick={onCreate}>
                                <NewWindowLink
                                    href={reportWindow.href}
                                    width={reportWindow.width}
                                    height={reportWindow.height}
                                    windowName={reportWindow.windowName}
                                >
                                    보고서 생성
                                </NewWindowLink>
                            </Button>
                        ) : (
                            <Button type="button" size="xl" onClick={onCreate}>
                                보고서 생성
                            </Button>
                        )}
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {KbigxReportCreateDialog}
export type {KbigxReportCreateDialogProps}
