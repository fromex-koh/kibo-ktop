'use client'

import {useEffect, useId, useRef, useState, type FormEvent, type ReactNode} from 'react'
import Link from 'next/link'
import {RotateCcw, Search} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {GuaranteeHistoryDialog} from '@/components/composite/guarantee-history-dialog'
import {GuaranteeRecommendationDialog} from '@/components/composite/guarantee-recommendation-dialog'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {
    DateRangeField,
    KeywordSearchField,
    SearchFilterActions,
    SearchFilterFields,
    SearchFilterForm,
} from '@/components/composite/search-filter-form'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {TextTabs} from '@/components/composite/text-tabs'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {EVALUATION_REPORT_WINDOW_HEIGHT, EVALUATION_REPORT_WINDOW_WIDTH} from '@/constants/evaluation-report'
import {
    getOrgEvaluationRequestActions,
    GUARANTEE_HISTORY_LABEL,
    GUARANTEE_RECOMMENDATION_FIELD,
    ORG_EVALUATION_REQUEST_STATUS,
    ORG_EVALUATION_SEARCH_TARGETS,
    ORG_EVALUATION_TYPES,
    ORG_EVALUATION_TYPE_MODELS,
    type EvaluationResultAction,
    type EvaluationModelTab,
    type OrgEvaluationHistoryItem,
    type OrgEvaluationRequestItem,
    type OrgIndividualEvaluationItem,
} from '@/constants/evaluation-result'
import {useIsMobile} from '@/hooks/use-mobile'

// 기관 평가결과 조회 목록 — Figma "마이페이지_평가결과 조회 (KTRS-FM, 투자모형)"·"(Tech-Index, 창업용 Tech-Index)".
// 모형 탭(1depth) · 평가 방식(2depth) · 조회 필터 · 건수 · 결과 카드 · 페이지 이동이 한 덩어리로 움직인다.
// 고른 값들을 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
//
// 데이터는 받아서 그리기만 한다 — 목업과 조회 API 의 교체 지점은 content/service/org-evaluation-history.ts 다.

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
const EvaluationDetail = ({label, value}: {label: string; value: string}) => (
    <div className="flex max-w-40 flex-col gap-1">
        <dt className="typo-body-l-regular text-foreground-subtle">{label}</dt>
        <dd className="typo-body-l-regular text-foreground">{value}</dd>
    </div>
)

const EvaluationDetailList = ({children}: {children: ReactNode}) => (
    <dl className="flex flex-wrap gap-x-6 gap-y-4">{children}</dl>
)

// 카드 버튼 — 잠긴 것(done)은 링크가 아니라 button 으로 그려 키보드로도 눌리지 않게 한다.
// [접수취소] 만 강조 외곽선(secondary)이고 나머지는 일반(tertiary)이다(시안).
const CANCEL_ACTION_LABEL = '접수취소'

const CardActions = ({
    actions,
    guaranteeDefaults,
    onGuaranteeCompleted,
}: {
    actions: readonly EvaluationResultAction[]
    /** [보증추천] 모달이 미리 채울 값 — 그 카드가 들고 있는 기업 정보다. */
    guaranteeDefaults?: Record<string, string>
    /** 보증추천을 마쳤을 때 — 이 카드의 버튼이 [보증이력] 으로 바뀐다. */
    onGuaranteeCompleted?: () => void
}) => (
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

// 개별평가 결과 한 건 — 모형명·결과값 / 평가일·기업명·사업자번호·조회 기관 / 결과를 여는 버튼(시안).
// 버튼 수는 모형마다 다르다 — KTRS-FM 은 [보증추천](입력을 마쳤으면 [보증이력])까지 셋이고,
// 나머지 모형은 결과 둘이다.
const IndividualEvaluationCard = ({
    item,
    modelLabel,
    unit,
    isGuaranteeRecommended,
    onGuaranteeCompleted,
}: {
    item: OrgIndividualEvaluationItem
    modelLabel: string
    unit: string
    /** 이 건의 보증추천 입력이 끝났는지 — 끝났으면 [보증추천] 이 [보증이력] 이 된다(시안 주석). */
    isGuaranteeRecommended: boolean
    onGuaranteeCompleted: () => void
}) => (
    <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="typo-title-l-bold text-foreground min-w-0 truncate">{modelLabel}</h3>
                    <CountBadge value={item.grade} unit={unit} />
                </div>
                <EvaluationDetailList>
                    <EvaluationDetail label="평가일" value={item.evaluatedAt} />
                    <EvaluationDetail label="기업명" value={item.companyName} />
                    <EvaluationDetail label="기업 사업자번호" value={item.businessNumber} />
                    <EvaluationDetail label="조회 기관" value={item.requestedBy} />
                </EvaluationDetailList>
            </div>

            <CardActions
                actions={
                    isGuaranteeRecommended
                        ? item.actions.map((action) =>
                              action.opens === 'guarantee-recommendation'
                                  ? {...action, label: GUARANTEE_HISTORY_LABEL, opens: 'guarantee-history' as const}
                                  : action,
                          )
                        : item.actions
                }
                onGuaranteeCompleted={onGuaranteeCompleted}
                guaranteeDefaults={{
                    [GUARANTEE_RECOMMENDATION_FIELD.companyName]: item.companyName,
                    [GUARANTEE_RECOMMENDATION_FIELD.businessNumber]: item.businessNumber,
                }}
            />
        </div>
    </BaseCard>
)

// 일괄평가·대량정보조회 신청 한 건 — 진행 상태 배지 / 모형명·기업 수 / 신청 정보 / 상태가 정하는 버튼(시안).
// 처리일은 승인·반려된 뒤에 생기므로 승인대기중 카드에는 그 칸이 없다.
const EvaluationRequestCard = ({item, modelLabel}: {item: OrgEvaluationRequestItem; modelLabel: string}) => {
    const status = ORG_EVALUATION_REQUEST_STATUS[item.status]

    return (
        <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* 상태 배지는 모형명 위에 붙는다 — 이 신청이 지금 어느 단계인지가 먼저 읽힌다. */}
                        <div className="flex min-w-0 flex-col gap-1">
                            <Badge size="xs" shape="round" color={status.color}>
                                {status.label}
                            </Badge>
                            <h3 className="typo-title-l-bold text-foreground min-w-0 truncate">{modelLabel}</h3>
                        </div>
                        <CountBadge value={String(item.companyCount)} unit="개 기업" />
                    </div>
                    <EvaluationDetailList>
                        <EvaluationDetail label="신청일" value={item.requestedAt} />
                        {item.processedAt ? <EvaluationDetail label="처리일" value={item.processedAt} /> : null}
                        <EvaluationDetail label="사업/과제명" value={item.projectName} />
                        <EvaluationDetail label="조회 기관" value={item.requestedBy} />
                    </EvaluationDetailList>
                </div>

                <CardActions actions={getOrgEvaluationRequestActions(item.status, item.canCancel)} />
            </div>
        </BaseCard>
    )
}

// 결과 한 건 — 평가 방식에 따라 두 모양 중 하나로 그린다.
const OrgEvaluationHistoryCard = ({
    item,
    modelLabel,
    unit,
    isGuaranteeRecommended,
    onGuaranteeCompleted,
}: {
    item: OrgEvaluationHistoryItem
    modelLabel: string
    unit: string
    isGuaranteeRecommended: boolean
    onGuaranteeCompleted: () => void
}) =>
    item.evaluationType === 'individual' ? (
        <IndividualEvaluationCard
            item={item}
            modelLabel={modelLabel}
            unit={unit}
            isGuaranteeRecommended={isGuaranteeRecommended}
            onGuaranteeCompleted={onGuaranteeCompleted}
        />
    ) : (
        <EvaluationRequestCard item={item} modelLabel={modelLabel} />
    )

type OrgEvaluationHistoryListProps = {
    /** 조회된 평가결과 전체. 모형 탭·평가 방식·페이지 나누기는 이 목록 안에서 처리한다. */
    items: readonly OrgEvaluationHistoryItem[]
    /** 모형 탭 — 화면(page)이 읽어 내려 준다. 목록은 값의 출처를 알지 않는다. */
    modelTabs: readonly EvaluationModelTab[]
    /** 처음 고른 상태로 열어 둘 조회기간. */
    defaultPeriod: string
    pageSize?: number
}

const OrgEvaluationHistoryList = ({items, modelTabs, defaultPeriod, pageSize = 10}: OrgEvaluationHistoryListProps) => {
    const [model, setModel] = useState<string>(modelTabs[0].value)
    const [evaluationType, setEvaluationType] = useState<string>(ORG_EVALUATION_TYPES[0].value)
    const [page, setPage] = useState(1)
    // 보증추천을 마친 건 — 그 카드의 버튼이 [보증이력] 으로 바뀐다(시안 주석).
    // [프론트엔드 연동] 연동 후에는 조회 응답이 알려 주므로 이 상태 없이 item 의 값으로 판단하면 된다.
    const [recommendedIds, setRecommendedIds] = useState<readonly string[]>([])
    const panelId = useId()
    const typeLabelId = useId()

    // 2depth 는 Tech-Index 계열에만 있다 — 없는 모형의 결과는 모두 개별평가라 방식으로 거르지 않는다.
    const hasEvaluationTypes = ORG_EVALUATION_TYPE_MODELS.some((value) => value === model)
    const filteredItems = items.filter(
        (item) => item.model === model && (!hasEvaluationTypes || item.evaluationType === evaluationType),
    )
    const modelTabByValue = new Map(modelTabs.map((tab) => [tab.value, tab]))

    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(filteredItems.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = filteredItems.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    const isMobile = useIsMobile()

    // 페이지를 넘기면 화면 맨 위로 되돌린다 — 목록 화면의 공통 동작이다.
    const isFirstRenderRef = useRef(true)

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false

            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }, [currentPage])

    // [프론트엔드 연동] 조회를 서버로 넘길 자리. 조회기간·검색어는 폼이 들고 있으므로 FormData 로 받는다
    // (evaluationPeriod* · searchType · searchKeyword). 모형과 평가 방식은 탭 값이다.
    // 지금은 넘겨받은 목록을 화면 안에서 거르므로 조건만 확인하고 페이지를 처음으로 되돌린다.
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const filters = Object.fromEntries(new FormData(event.currentTarget).entries())
        console.log('[기관 평가결과 조회] 조회 조건', {...filters, model, evaluationType})
        setPage(1)
    }

    // [초기화] — 폼이 조회 조건을 기본값으로 되돌리고, 목록은 첫 페이지로 돌아간다.
    const handleReset = () => setPage(1)

    const handleModelChange = (value: string) => {
        setModel(value)
        setEvaluationType(ORG_EVALUATION_TYPES[0].value)
        setPage(1)
    }

    const handleEvaluationTypeChange = (value: string) => {
        setEvaluationType(value)
        setPage(1)
    }

    return (
        // 세로 간격은 시안 기준이다 — 탭·조회 카드·리스트 사이가 40.
        <div className="flex flex-col gap-10">
            {/* 모형(1depth)과 평가 방식(2depth) 사이는 32(시안). */}
            <div className="flex flex-col gap-8">
                <TextTabs
                    items={modelTabs}
                    value={model}
                    onValueChange={handleModelChange}
                    label="평가 모형"
                    panelId={panelId}
                />

                {/* 2depth 는 이 모형에 평가 방식이 여럿일 때만 나온다(시안 "2depth 미노출"). */}
                {hasEvaluationTypes ? (
                    <>
                        <span id={typeLabelId} className="sr-only">
                            평가 방식
                        </span>
                        <SegmentedControl
                            type="radio"
                            variant="solid"
                            size="lg"
                            name="evaluationType"
                            value={evaluationType}
                            onValueChange={handleEvaluationTypeChange}
                            aria-labelledby={typeLabelId}
                            // 기간 칩과 달리 글자 수가 제각각이라(개별평가·대량정보조회) 폭을 글자에 맡기고
                            // 좌우 여백만 24 로 준다(시안 104·104·131). 좁은 화면에서는 한 줄을 고르게 나눈다.
                            className="*:w-auto *:px-6 max-sm:w-full max-sm:*:flex-1 max-sm:*:px-0"
                        >
                            {ORG_EVALUATION_TYPES.map((option) => (
                                <SegmentedControlItem key={option.value} value={option.value}>
                                    {option.label}
                                </SegmentedControlItem>
                            ))}
                        </SegmentedControl>
                    </>
                ) : null}
            </div>

            {/* 조회 필터 — 공통 SearchFilterForm 을 쓴다.
                layout="stack" : 사이드바 옆 폭(792)이라 라벨을 위에 둔다.
                surface="card" : 아래 결과 카드와 같은 흰 면이다.
                시안에는 라벨이 보이지 않아 감추되(labelHidden) 스크린리더에는 남긴다. */}
            <SearchFilterForm
                aria-label="평가결과 조회 필터"
                layout="stack"
                surface="card"
                onSubmit={handleSearch}
                onReset={handleReset}
            >
                <SearchFilterFields className="gap-4">
                    <DateRangeField name="evaluationPeriod" defaultPreset={defaultPeriod} labelHidden size="lg" />
                    <KeywordSearchField
                        name="search"
                        label="검색어"
                        options={ORG_EVALUATION_SEARCH_TARGETS}
                        labelHidden
                    />
                </SearchFilterFields>
                {/* 폼 안의 버튼도 id 나 name 을 가져야 한다(HTML 검사기 "A form field element should have
                    an id or name attribute") — 제출·초기화 버튼은 값을 보내지 않으므로 id 만 둔다. */}
                <SearchFilterActions className="gap-2 max-sm:*:min-w-0 max-sm:*:flex-1">
                    <Button id="org-evaluation-search-reset" type="reset" variant="tertiary" size="md">
                        초기화
                        <RotateCcw aria-hidden="true" />
                    </Button>
                    <Button id="org-evaluation-search-submit" type="submit" size="md">
                        조회
                        <Search aria-hidden="true" />
                    </Button>
                </SearchFilterActions>
            </SearchFilterForm>

            <div id={panelId} role="tabpanel" className="flex flex-col gap-10">
                {/* 건수와 목록은 한 덩어리로 붙고(16), 페이지 이동만 멀리 떨어진다(40) — 시안. */}
                <div className="flex flex-col gap-4">
                    {/* 건수만 굵고 브랜드 색이다 — 몇 건인지가 이 줄에서 읽을 값이다. */}
                    <p className="typo-body-xl-regular text-foreground">
                        총 <span className="typo-body-xl-bold text-primary-strong">{filteredItems.length}</span>건
                    </p>

                    {visibleItems.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {visibleItems.map((item) => (
                                <li key={item.id}>
                                    <OrgEvaluationHistoryCard
                                        isGuaranteeRecommended={recommendedIds.includes(item.id)}
                                        onGuaranteeCompleted={() =>
                                            setRecommendedIds((ids) =>
                                                ids.includes(item.id) ? ids : [...ids, item.id],
                                            )
                                        }
                                        item={item}
                                        modelLabel={modelTabByValue.get(item.model)?.label ?? item.model}
                                        unit={modelTabByValue.get(item.model)?.unit ?? '등급'}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // 빈 상태는 결과 카드와 같은 흰 면·모서리로 그 자리를 대신한다(시안 "내역없음").
                        <EmptyState title="검색내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
                    )}
                </div>

                {filteredItems.length > 0 ? (
                    <Pagination
                        page={currentPage}
                        total={totalPages}
                        onPageChange={setPage}
                        siblingCount={isMobile ? 0 : 1}
                        prevLabel={isMobile ? '' : '이전'}
                        nextLabel={isMobile ? '' : '다음'}
                        maxVisibleItems={isMobile ? 5 : 10}
                        compact={isMobile}
                        className="justify-center"
                    />
                ) : null}
            </div>
        </div>
    )
}

export {OrgEvaluationHistoryList}
export type {OrgEvaluationHistoryListProps}
