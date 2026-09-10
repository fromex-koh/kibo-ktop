'use client'

import type {ReactNode} from 'react'
import Link from 'next/link'
import {GuaranteeHistoryDialog} from '@/components/composite/guarantee-history-dialog'
import {GuaranteeRecommendationDialog} from '@/components/composite/guarantee-recommendation-dialog'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {Button} from '@/components/ui/button'
import {EVALUATION_REPORT_WINDOW_HEIGHT, EVALUATION_REPORT_WINDOW_WIDTH} from '@/constants/evaluation-report'
import type {EvaluationResultAction} from '@/constants/evaluation-result'

// 평가 결과 카드를 이루는 조각들 — 값 배지 · 상세 줄 · 동작 버튼.
// 평가결과 조회와 평가검증 신청 조회가 같은 카드 언어를 쓰므로 한곳에 두고 두 목록이 함께 쓴다([SC-04]).

// 값 배지 — 시안의 "카운트" 묶음이다(navy.100 면 · navy.200 테두리 · navy.600 글자).
// 개별평가는 등급·점수를, 신청 건은 기업 수를 같은 모양으로 보여 준다. 값만 크고 단위는 작게 붙는다.
// 값과 단위가 한 덩어리("AA 등급")로 읽히도록 읽을 문장을 따로 두고 보이는 두 조각은 감춘다
// (role 이 없는 p 에는 aria-label 을 쓸 수 없다 [8.1.1]).
const CountBadge = ({value, unit}: {value: string; unit: string}) => (
    <p className="bg-navy-100 border-navy-200 text-navy-600 flex shrink-0 items-center gap-1 rounded-sm border px-3 py-1">
        <span className="sr-only">{`${value} ${unit}`}</span>
        <span aria-hidden="true" className="typo-h2-bold">
            {value}
        </span>
        <span aria-hidden="true" className="typo-body-m-medium">
            {unit}
        </span>
    </p>
)

// 카드의 상세 — 라벨 위, 값 아래로 선 네 쌍이 24 간격으로 놓인다(시안). 칸 폭은 값의 길이를 따르되
// 160 에서 멈춘다 — 기업명·기관명이 길 때 그 칸만 넓어지면 뒤따르는 칸들이 밀려 카드마다 간격이
// 달라지므로, 넘치는 글자는 자기 칸 안에서 다음 줄로 내려간다.
// 160 은 네 칸이 모두 최대 폭일 때 딱 한 줄에 서는 값이다(160×4 + 24×3 = 712 = 카드 안쪽 폭).
//
// break-words 는 띄어쓸 곳이 없는 값을 위한 것이다 — 한글은 글자 사이에서 저절로 접히지만 영문 상호나
// 긴 번호는 낱말 하나라 칸을 넘어 옆 칸을 덮는다. 접을 곳이 없을 때만 낱말 안에서 끊는다.
const EvaluationDetail = ({label, value}: {label: string; value: string}) => (
    <div className="flex max-w-40 flex-col gap-1">
        <dt className="typo-body-l-regular text-foreground-subtle">{label}</dt>
        <dd className="typo-body-l-regular text-foreground break-words">{value}</dd>
    </div>
)

const EvaluationDetailList = ({children}: {children: ReactNode}) => (
    <dl className="flex flex-wrap gap-x-6 gap-y-4">{children}</dl>
)

// 카드 버튼 — 잠긴 것(done)은 링크가 아니라 button 으로 그려 키보드로도 눌리지 않게 한다.
// [접수취소] 만 강조 외곽선(secondary)이고 나머지는 일반(tertiary)이다(시안).
const CANCEL_ACTION_LABEL = '접수취소'

type CardActionsProps = {
    actions: readonly EvaluationResultAction[]
    /** [보증추천] 모달이 미리 채울 값 — 그 카드가 들고 있는 기업 정보다. */
    guaranteeDefaults?: Record<string, string>
    /** 보증추천을 마쳤을 때 — 이 카드의 버튼이 [보증이력] 으로 바뀐다. */
    onGuaranteeCompleted?: () => void
}

const CardActions = ({actions, guaranteeDefaults, onGuaranteeCompleted}: CardActionsProps) => (
    // 버튼이 몇 개든 카드 폭을 고르게 나눈다. 좁은 화면에서는 한 줄에 하나씩 쌓인다.
    <div className="grid gap-2 sm:auto-cols-fr sm:grid-flow-col">
        {actions.map((action) => {
            const variant = action.label === CANCEL_ACTION_LABEL ? 'secondary' : 'tertiary'

            if (action.done) {
                return (
                    <Button key={action.label} type="button" variant={variant} size="sm" disabled>
                        {action.label}
                    </Button>
                )
            }

            // 화면으로 가지 않고 모달을 여는 버튼 — 트리거로 감싼다.
            if (action.opens === 'guarantee-recommendation') {
                return (
                    <GuaranteeRecommendationDialog
                        key={action.label}
                        defaultValues={guaranteeDefaults}
                        onCompleted={onGuaranteeCompleted}
                    >
                        <Button type="button" variant={variant} size="sm">
                            {action.label}
                        </Button>
                    </GuaranteeRecommendationDialog>
                )
            }

            if (action.opens === 'guarantee-history') {
                return (
                    <GuaranteeHistoryDialog key={action.label}>
                        <Button type="button" variant={variant} size="sm">
                            {action.label}
                        </Button>
                    </GuaranteeHistoryDialog>
                )
            }

            return (
                <Button key={action.label} asChild variant={variant} size="sm">
                    {action.newWindow ? (
                        // 인쇄용 리포트는 시안 폭에 맞춘 새 창으로 연다 — 같은 이름으로 열어 여러 번
                        // 눌러도 창이 쌓이지 않는다.
                        <NewWindowLink
                            href={action.href}
                            width={EVALUATION_REPORT_WINDOW_WIDTH}
                            height={EVALUATION_REPORT_WINDOW_HEIGHT}
                            windowName="evaluation-report"
                        >
                            {action.label}
                        </NewWindowLink>
                    ) : (
                        <Link href={action.href}>{action.label}</Link>
                    )}
                </Button>
            )
        })}
    </div>
)

export {CountBadge, EvaluationDetail, EvaluationDetailList, CardActions, CANCEL_ACTION_LABEL}
export type {CardActionsProps}
