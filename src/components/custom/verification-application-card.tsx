'use client'

import {useEffect, useId, useRef, useState} from 'react'
import Link from 'next/link'
import {ArrowUpRight, ChevronDown, ChevronUp} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {CardActions, CountBadge, EvaluationDetail, EvaluationDetailList} from '@/components/custom/evaluation-card'
import {Button} from '@/components/ui/button'
import {EVALUATION_MODEL_TABS, GUARANTEE_HISTORY_LABEL} from '@/constants/evaluation-result'
import {
    DEFAULT_VERIFICATION_GRADE_UNIT,
    verificationHistoryToggleLabel,
    type VerificationApplicationItem,
    type VerificationHistoryItem,
} from '@/constants/verification-application'
import {getGuaranteeDefaults} from '@/content/service/org-verification-applications'

// 평가검증 신청 카드 — Figma "마이페이지_평가검증 신청 조회" 의 리스트 한 장.
// 모형명·자가진단 결과값 / 접수일·기업명·사업자번호 · [평가검증 하기] / 결과를 여는 버튼 /
// 이 기관이 검증한 이력 펼침으로 이루어진다.
//
// 펼침 상태를 카드마다 따로 들고 있어야 해서 client 로 둔다. 값은 넘겨받은 것만 그린다 —
// 어느 건인지·무슨 버튼이 붙는지는 데이터(content/service/org-verification-applications.ts)가 정한다.

// 모형 코드로 화면에 보일 이름과 결과값 단위를 찾는다 — 응답이 주는 것은 코드와 값뿐이다.
const MODEL_TAB_BY_VALUE = new Map(EVALUATION_MODEL_TABS.map((tab) => [tab.value, tab]))

// 검증 이력 한 줄 — 팀 이름·검증일 / 결과값 / 결과를 여는 버튼(시안 "펼침").
const VerificationHistoryRow = ({item, unit}: {item: VerificationHistoryItem; unit: string}) => (
    <li className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
            {/* 팀 이름과 검증일은 한 줄에 붙는다(시안 사이 8) — 좁아지면 날짜가 다음 줄로 내려간다. */}
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                {/* 펼침 묶음의 제목(h4) 아래라 팀 이름은 h5 다 — 제목 단계를 건너뛰지 않는다[6.4.2]. */}
                <h5 className="typo-body-xl-bold text-foreground min-w-0 break-words">{item.team}</h5>
                <p className="typo-body-l-regular text-foreground">{item.verifiedAt}</p>
            </div>
            <CountBadge value={item.grade} unit={unit} />
        </div>
        <CardActions actions={item.actions} />
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

    const actions = isGuaranteeRecommended
        ? item.actions.map((action) =>
              action.opens === 'guarantee-recommendation'
                  ? {...action, label: GUARANTEE_HISTORY_LABEL, opens: 'guarantee-history' as const}
                  : action,
          )
        : item.actions

    return (
        <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="typo-title-l-bold text-foreground min-w-0 truncate">{modelLabel}</h3>
                        <CountBadge value={item.grade} unit={unit} />
                    </div>

                    {/* 상세 줄 오른쪽 끝에 [평가검증 하기] 가 붙고, 상세 두 줄(라벨·값)의 한가운데에 선다(시안).
                        좁아지면 아래로 내려간다. */}
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                        <EvaluationDetailList>
                            <EvaluationDetail label="접수일" value={item.receivedAt} />
                            <EvaluationDetail label="기업명" value={item.companyName} />
                            <EvaluationDetail label="기업 사업자번호" value={item.businessNumber} />
                        </EvaluationDetailList>
                        {/* 시안 button_text(small) — 밑줄 글자 + 오른쪽 위로 향하는 화살표(icon-line/arrow-up-right).
                            상자에 둘러싸인 화살표가 아니다.
                            [프론트엔드 연동] 검증 화면이 생기면 verifyHref 만 채우면 된다. */}
                        <Button asChild variant="text-underline" size="sm" className="shrink-0">
                            <Link href={item.verifyHref}>
                                평가검증 하기
                                <ArrowUpRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <CardActions
                    actions={actions}
                    onGuaranteeCompleted={onGuaranteeCompleted}
                    guaranteeDefaults={getGuaranteeDefaults(item)}
                />

                {historyCount > 0 ? (
                    <>
                        {/* 펼침 줄 — 카드 아래 가운데에 놓인다(시안 select_text). */}
                        <Button
                            type="button"
                            variant="text"
                            size="lg"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setIsOpen((open) => !open)}
                            className="text-foreground w-full justify-center font-medium"
                        >
                            {verificationHistoryToggleLabel(historyCount, isOpen)}
                            {isOpen ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                        </Button>

                        {/* 펼친 이력 — 카드 아래를 가득 채우는 옅은 면이다(시안 792 폭 · 윗선 있음).
                            카드 안쪽 여백(32·xl 40)과 아래 여백(32)을 음수 여백으로 되돌려 카드 끝까지 닿게 한다. */}
                        {isOpen ? (
                            <div
                                id={panelId}
                                ref={panelRef}
                                className="border-subtle-3 bg-surface-subtle -mx-8 -mb-8 scroll-mt-20 border-t px-8 pt-6 pb-8 xl:-mx-10 xl:scroll-mt-32 xl:px-10"
                            >
                                <h4 className="sr-only">평가검증 이력</h4>
                                <ul className="flex flex-col gap-6">
                                    {item.history.map((history) => (
                                        <VerificationHistoryRow key={history.id} item={history} unit={unit} />
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </>
                ) : null}
            </div>
        </BaseCard>
    )
}

export {VerificationApplicationCard}
