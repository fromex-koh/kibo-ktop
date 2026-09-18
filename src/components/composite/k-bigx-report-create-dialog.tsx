'use client'

// 'use client' — 특허 정보 제목 id(useId)를 쓰고, 다른 K-BIGx 모달과 같이 클라이언트에서 그린다.

import {useId, type ReactNode} from 'react'
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
import {cn} from '@/lib/utils'

// 기업혁신성장 보고서 생성 — 시안 "K-BIGx 보고서_기업혁신성장 보고서 생성"(40007590:14037).
// 확인 질문(기업명만 파란색) → 특허 정보(테두리 상자) → 유료 서비스 안내(회색 상자) → [아니요] [보고서 생성].
// 특허수가 없는 기업(patent 를 비워 넘김) — 시안 "…_특허수가 없는 기업"(40007590:13996): 특허 정보 상자 없이
// 질문 아래 24 에 '보유 특허 정보가 확인되지 않습니다' 안내만 온다.
//
// 시안 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목과 질문 24 · 질문(20 Bold)과 특허 정보 24 ·
// 특허 정보 제목(18 Bold)과 상자 8 · 상자(테두리 gray.100 · 반경 12 · 여백 24 · 줄 사이 12) · 상자와 안내 20 ·
// 안내 상자(gray.10 · 반경 8 · 여백 20 · 제목 16 Bold · 목록 14 · 제목과 목록 8) · 두 버튼 사이 8.
// 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type KbigxReportCreateDialogProps = {
    /** 보고서를 만들 기업명 — 질문 문장에서 파란색으로 강조된다. */
    companyName: string
    /** 고른 특허의 정보(항목명 · 값). 특허수가 없는 기업이면 비워 넘긴다 — 특허 없음 안내로 바뀐다. */
    patent?: ReportCreatePatent
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [보고서 생성]을 눌렀을 때. [프론트엔드 연동] 보고서 생성 요청(이용권 차감)을 연결한다. */
    onCreate?: () => void
}

const KbigxReportCreateDialog = ({
    companyName,
    patent,
    children,
    defaultOpen,
    onCreate,
}: KbigxReportCreateDialogProps) => {
    const patentTitleId = useId()
    const hasPatent = patent !== undefined && patent.length > 0

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
                제목 줄과 맞춘다(오른쪽·위 32). */}
            <DialogContent className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8">
                <DialogHeader className="sm:px-8 sm:pt-8">
                    <DialogTitle className="break-keep">{REPORT_CREATE_TITLE}</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogInfoBodyClassName, 'break-keep sm:px-8')}>
                    {/* 기업명 뒤에서 줄을 바꾼다(시안) — 기업명이 길어도 질문이 한 덩어리로 읽힌다.
                        긴 텍스트 — 기업·기관명은 띄어쓰기 없이 길어지므로 이 문장만 낱말 단위 줄바꿈(break-keep)을 풀어
                        한글 기본 줄바꿈으로 흐르게 한다("(주)" · 이름 · "의" 가 따로 떨어지지 않는다). 영문·숫자가 길게
                        이어져도 모달 폭을 밀지 않도록 넘칠 때는 끊는다(wrap-anywhere). 말줄임은 쓰지 않는다 — 모두 보여야 한다. */}
                    {/* 질문은 모달 설명(DialogDescription)이다 — 20 Bold 라 <p> 로 두면 WAVE 가 "Possible heading" 으로
                        잡는다. 설명으로 이어 두면 모달이 열릴 때 제목 다음에 읽히고, 블록 span 이라 제목으로 오인되지 않는다. */}
                    <DialogDescription asChild>
                        <span className="typo-title-l-bold text-foreground block break-normal wrap-anywhere">
                            <span className="text-primary">{companyName}</span>의
                            <br />
                            {/* 고정 문구는 낱말 단위로만 줄을 바꾼다("생성하시겠습니 / 까?" 방지). */}
                            <span className="break-keep">K-BIGx 보고서를 생성하시겠습니까?</span>
                        </span>
                    </DialogDescription>

                    {hasPatent ? (
                        <>
                            <section aria-labelledby={patentTitleId} className="mt-6 flex flex-col gap-2">
                                <h2 id={patentTitleId} className="typo-title-m-bold text-foreground">
                                    {REPORT_CREATE_PATENT_TITLE}
                                </h2>
                                <dl className="border-subtle-3 flex flex-col gap-3 rounded-md border p-6">
                                    {patent?.map((row) => (
                                        <div key={row.label} className="flex items-start justify-between gap-4">
                                            {/* 항목명은 줄지 않고, 값이 길면 오른쪽 칸 안에서 여러 줄로 접힌다(오른쪽 정렬 유지, 말줄임 없음). */}
                                            <dt className="typo-body-xl-regular text-foreground-subtle shrink-0">
                                                {row.label}
                                            </dt>
                                            <dd className="typo-body-xl-medium text-label-foreground m-0 min-w-0 text-right wrap-anywhere">
                                                {row.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <section className="bg-surface-subtle mt-5 flex flex-col gap-2 rounded-sm p-5">
                                <h2 className="typo-body-xl-bold text-foreground">{REPORT_CREATE_PAID_NOTICE.title}</h2>
                                <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2">
                                    {REPORT_CREATE_PAID_NOTICE.items.map((item) => (
                                        <li key={item} className="flex">
                                            <ListMarker type="unordered-small" />
                                            <span className="min-w-0">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </>
                    ) : (
                        <section className="bg-surface-subtle mt-6 flex flex-col gap-2 rounded-sm p-5">
                            <h2 className="typo-body-xl-bold text-foreground">
                                {REPORT_CREATE_NO_PATENT_NOTICE.title}
                            </h2>
                            <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2">
                                {REPORT_CREATE_NO_PATENT_NOTICE.items.map((item) => (
                                    <li key={item} className="flex">
                                        <ListMarker type="unordered-small" />
                                        <span className="min-w-0">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
                <DialogFooter className="sm:gap-2 sm:px-8">
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl">
                            아니요
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" size="xl" onClick={onCreate}>
                            보고서 생성
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {KbigxReportCreateDialog}
export type {KbigxReportCreateDialogProps}
