'use client'

import {useEffect, useId, useRef, useState} from 'react'
import Link from 'next/link'
import {ChevronDown, ChevronUp, PencilLine} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {
    CountBadge,
    EvaluationCardActions,
    EvaluationDetail,
    EvaluationDetailList,
    toGuaranteeCompletedActions,
} from '@/components/custom/evaluation-card'
import {Button} from '@/components/ui/button'
import {EVALUATION_MODEL_TABS} from '@/constants/evaluation-result'
import {cn} from '@/lib/utils'
import {
    DEFAULT_VERIFICATION_GRADE_UNIT,
    verificationHistoryToggleLabel,
    type VerificationApplicationItem,
    type VerificationHistoryItem,
} from '@/constants/verification-application'
import {getGuaranteeDefaults} from '@/content/service/org-verification-applications'

// 평가검증 신청 카드 — Figma "마이페이지_평가검증 신청 조회" 의 리스트 한 장.
// 모형명·자가진단 결과값 / 접수일·기업명·사업자번호 / 버튼(보조: 결과 · 보증 — 왼쪽, 주요: [평가검증 하기] — 오른쪽) /
// 이 기관이 검증한 이력 펼침(카드 안의 박스)으로 이루어진다.
//
// 펼침 상태를 카드마다 따로 들고 있어야 해서 client 로 둔다. 값은 넘겨받은 것만 그린다 —
// 어느 건인지·무슨 버튼이 붙는지는 데이터(content/service/org-verification-applications.ts)가 정한다.

// 모형 코드로 화면에 보일 이름과 결과값 단위를 찾는다 — 응답이 주는 것은 코드와 값뿐이다.
const MODEL_TAB_BY_VALUE = new Map(EVALUATION_MODEL_TABS.map((tab) => [tab.value, tab]))

// 검증 이력 한 줄 — 팀 이름·검증일 / 결과값 / 결과를 여는 버튼(시안 "펼침"). 버튼은 모두 보조 · 왼쪽이다.
// 줄 사이는 가로선으로 가른다(목록의 divide-y).
const VerificationHistoryRow = ({item, unit}: {item: VerificationHistoryItem; unit: string}) => (
    <li className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0">
        {/* 팀 이름 · 배지: 들어가면 한 줄, 모자라면 배지가 다음 줄 */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            {/* 팀 이름 · 검증일은 한 줄(좁으면 날짜가 다음 줄) — 날짜 자체는 끊지 않는다. */}
            <div className="flex min-w-0 grow flex-wrap items-baseline gap-x-2 gap-y-1">
                {/* 펼침 묶음의 제목(h4) 아래라 팀 이름은 h5 다 — 제목 단계를 건너뛰지 않는다[6.4.2]. */}
                <h5 className="typo-body-xl-bold text-foreground min-w-0 break-words">{item.team}</h5>
                <p className="typo-body-l-regular text-foreground whitespace-nowrap">{item.verifiedAt}</p>
            </div>
            <CountBadge value={item.grade} unit={unit} />
        </div>
        <EvaluationCardActions actions={item.actions} hasPrimary={false} />
    </li>
)

// 신청 한 건 = 카드 한 장 — 모형명·자가진단 결과값 / 접수일·기업명·사업자번호 · [평가검증 하기] /
// 결과를 여는 버튼 / 검증 이력 펼침(시안).
const VerificationApplicationCard = ({
    item,
    isGuaranteeRecommended,
    onGuaranteeCompleted,
}: {
    item: VerificationApplicationItem
    /** 이 건의 보증추천 입력이 끝났는지 — 끝났으면 [보증추천] 이 [보증이력] 이 된다. */
    isGuaranteeRecommended: boolean
    /** 보증추천을 마쳤을 때. 넘기지 않으면 버튼이 바뀌는 것을 사용처가 관리하지 않는다(가이드 예시). */
    onGuaranteeCompleted?: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const panelId = useId()
    const panelRef = useRef<HTMLDivElement>(null)
    const modelTab = MODEL_TAB_BY_VALUE.get(item.model)
    const modelLabel = modelTab?.label ?? item.model
    const unit = modelTab?.unit ?? DEFAULT_VERIFICATION_GRADE_UNIT
    const historyCount = item.history.length

    // 이력을 펼치면 그 목록이 화면에 들어오게 한다 — 카드 아래쪽에서 펼치면 새로 생긴 줄이 접힌 화면
    // 밖에 있어 아무 일도 일어나지 않은 것처럼 보인다.
    // block:'nearest' 는 필요한 만큼만 굴린다 — 이미 보이면 그대로 두고, 화면보다 길면 윗변을 맞춘다.
    useEffect(() => {
        if (!isOpen) return

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        panelRef.current?.scrollIntoView({block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }, [isOpen])

    const actions = isGuaranteeRecommended ? toGuaranteeCompletedActions(item.actions) : item.actions

    return (
        <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    {/* 모형명 · 배지: 들어가면 한 줄, 모자라면 배지가 다음 줄(모형명은 말줄임 없이 다 보인다) */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <h3 className="typo-title-l-bold text-foreground min-w-0 grow break-keep">{modelLabel}</h3>
                        <CountBadge value={item.grade} unit={unit} />
                    </div>

                    <EvaluationDetailList>
                        {/* 접수일 — 날짜 + 시각(HH:mm). */}
                        <EvaluationDetail
                            label="접수일"
                            value={item.receivedTime ? `${item.receivedAt} ${item.receivedTime}` : item.receivedAt}
                        />
                        <EvaluationDetail label="기업명" value={item.companyName} />
                        <EvaluationDetail label="기업 사업자번호" value={item.businessNumber} />
                    </EvaluationDetailList>
                </div>

                {/* 결과 · 보증 버튼은 보조 · 왼쪽, [평가검증 하기]는 주요 · 오른쪽.
                    [프론트엔드 연동] 검증 화면이 생기면 item.verifyHref 만 채운다. */}
                <EvaluationCardActions
                    actions={actions}
                    hasPrimary={false}
                    onGuaranteeCompleted={onGuaranteeCompleted}
                    guaranteeDefaults={getGuaranteeDefaults(item)}
                    end={
                        <Button asChild size="sm">
                            <Link href={item.verifyHref}>
                                <PencilLine aria-hidden="true" />
                                평가검증 하기
                            </Link>
                        </Button>
                    }
                />

                {historyCount > 0 ? (
                    // 이력 박스 — 접힘: 옅은 면 + 펼침 줄 / 펼침: 테두리 + 접기 줄 + 이력 목록.
                    <div
                        className={cn(
                            'bg-surface-subtle rounded-md border',
                            isOpen ? 'border-subtle-3' : 'border-transparent',
                        )}
                    >
                        <Button
                            type="button"
                            variant="text"
                            size="lg"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setIsOpen((open) => !open)}
                            className={cn(
                                'w-full justify-center px-4 py-3 font-medium',
                                isOpen ? 'text-primary-strong' : 'text-foreground',
                            )}
                        >
                            {verificationHistoryToggleLabel(historyCount, isOpen)}
                            {isOpen ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                        </Button>

                        {isOpen ? (
                            <div
                                id={panelId}
                                ref={panelRef}
                                className="scroll-mt-20 px-4 pt-2 pb-6 md:px-6 xl:scroll-mt-32"
                            >
                                <h4 className="sr-only">평가검증 이력</h4>
                                <ul className="divide-subtle-3 flex flex-col divide-y">
                                    {item.history.map((history) => (
                                        <VerificationHistoryRow key={history.id} item={history} unit={unit} />
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </BaseCard>
    )
}

export {VerificationApplicationCard}
