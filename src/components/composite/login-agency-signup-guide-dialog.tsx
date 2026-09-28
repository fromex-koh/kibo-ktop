'use client'

// 'use client' — DialogContent 에 넘긴 aria-describedby={undefined} 가 서버→클라이언트 전달 중에 빠지면
// Radix 가 없는 설명 id 를 붙인다(접근성 검사 "Broken ARIA reference"). 클라이언트에서 그려 값을 지킨다.
import type {ReactNode} from 'react'
import {CircleAlert} from 'lucide-react'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {DialogTrigger} from '@/components/ui/dialog'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {
    AGENCY_SIGN_UP_ALERT,
    AGENCY_SIGN_UP_NOTICE,
    AGENCY_SIGN_UP_STEPS,
    AGENCY_SIGN_UP_TARGET_HEADER,
    AGENCY_SIGN_UP_TARGETS,
    AGENCY_SIGN_UP_TITLE,
    LOGIN_DIALOG_CLOSE_LABEL,
} from '@/content/service/login'
import {cn} from '@/lib/utils'

// 기관회원 가입 안내 — 기관회원 로그인의 [회원가입]에서 연다. 기관회원은 담당자 확인을 거쳐 계정을 받으므로
// 가입 대상과 절차를 알리는 읽기 전용 모달이다.
//
// 짜임: 안내 상자(옅은 회색 · 목록 3줄) → 가입 대상 표 → 1~5 절차 → 강조 안내(옅은 파랑) → 풀폭 [닫기].
// 내용이 길어 본문 구획이 모달 안에서 스크롤된다. 여백은 모달 공통 32 를 따른다.

// 가입 대상 표 — 첫 칸(기관회원)이 두 줄을 세로로 묶는다. 칸 색은 시안대로 머리 칸만 옅은 파랑이다.
const TABLE_CELL_CLASS_NAME = 'border-subtle-3 typo-body-l-regular text-label-foreground border px-4 py-3 align-middle'
const TABLE_HEAD_CLASS_NAME = 'border-subtle-3 bg-primary-subtle text-foreground border px-4 py-3 text-center'

const AgencySignUpTargetTable = () => (
    <div className="border-t-foreground-subtle border-t">
        <table className="w-full table-fixed border-collapse">
            <caption className="sr-only">{`${AGENCY_SIGN_UP_TARGET_HEADER} 가입 대상`}</caption>
            {/* 열 수를 실제 셀 수(3)와 맞춘다 — 선언한 열보다 셀이 많으면 마크업 오류가 된다[8.1.1]. */}
            <colgroup>
                <col className="w-25" />
                <col className="w-25" />
                <col />
            </colgroup>
            <tbody>
                {AGENCY_SIGN_UP_TARGETS.map((target, index) => (
                    <tr key={target.label}>
                        {index === 0 ? (
                            <th
                                scope="rowgroup"
                                rowSpan={AGENCY_SIGN_UP_TARGETS.length}
                                className={cn(TABLE_HEAD_CLASS_NAME, 'typo-body-l-bold')}
                            >
                                {AGENCY_SIGN_UP_TARGET_HEADER}
                            </th>
                        ) : null}
                        <th scope="row" className={cn(TABLE_HEAD_CLASS_NAME, 'typo-body-l-medium')}>
                            {target.label}
                        </th>
                        <td className={cn(TABLE_CELL_CLASS_NAME, 'bg-card')}>
                            {/* 칸 안은 점 목록이다 — 14 글자 줄(21)에 맞는 작은 점을 쓴다. */}
                            <ul className="flex list-none flex-col">
                                {target.items.map((item) => (
                                    <li key={item} className="flex">
                                        <ListMarker type="unordered-small" />
                                        <span className="min-w-0 break-keep">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

type LoginAgencySignUpGuideDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const LoginAgencySignUpGuideDialog = ({children, defaultOpen}: LoginAgencySignUpGuideDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮긴다. */}
        <DialogContent
            aria-describedby={undefined}
            className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8"
        >
            <DialogHeader className="sm:px-8 sm:pt-8">
                <DialogTitle>{AGENCY_SIGN_UP_TITLE}</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogInfoBodyClassName, 'gap-6 break-keep sm:px-8')}>
                <ul className="bg-surface-subtle typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2 rounded-sm p-5">
                    {AGENCY_SIGN_UP_NOTICE.map((notice) => (
                        <li key={notice} className="flex">
                            <ListMarker type="unordered-small" />
                            <span className="min-w-0">{notice}</span>
                        </li>
                    ))}
                </ul>

                <AgencySignUpTargetTable />

                {/* 절차 — 목록 순서가 곧 단계 번호라 ol 로 적고 번호는 마커가 그린다. */}
                <ol className="flex list-none flex-col gap-6">
                    {AGENCY_SIGN_UP_STEPS.map((step, index) => (
                        <li key={step.title} className="flex flex-col gap-2">
                            <h3 className="typo-title-m-bold text-foreground flex">
                                <ListMarker type="ordered" index={index + 1} typography="inherit" />
                                <span className="min-w-0">{step.title}</span>
                            </h3>
                            {/* 설명 줄에는 점을 두지 않는다 — 번호가 이미 항목을 가른다. */}
                            <p className="typo-body-xl-regular text-label-foreground">{step.description}</p>
                        </li>
                    ))}
                </ol>

                {/* 강조 안내 — 옅은 파랑 면에 경고 아이콘과 한 문단. */}
                <p className="bg-primary-subtle typo-body-l-medium text-label-foreground flex gap-1 rounded-sm p-4">
                    <CircleAlert aria-hidden="true" className="size-icon-sm mt-0.5 shrink-0" />
                    <span className="min-w-0">{AGENCY_SIGN_UP_ALERT}</span>
                </p>
            </div>
            <DialogFooter className="sm:px-8 sm:pb-8">
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl" className="w-full">
                        {LOGIN_DIALOG_CLOSE_LABEL}
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {LoginAgencySignUpGuideDialog}
export type {LoginAgencySignUpGuideDialogProps}
