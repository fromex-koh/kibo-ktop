'use client'

import {useEffect, useId, useRef, useState, type FormEvent} from 'react'
import {RotateCcw, Search} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {CardActions, CountBadge, EvaluationDetail, EvaluationDetailList} from '@/components/custom/evaluation-card'
import {Pagination} from '@/components/composite/pagination'
import {
    DateRangeField,
    KeywordSearchField,
    SearchFilterActions,
    SearchFilterFields,
    SearchFilterForm,
} from '@/components/composite/search-filter-form'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {TextTabs} from '@/components/composite/text-tabs'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {
    getOrgEvaluationRequestActions,
    GUARANTEE_HISTORY_LABEL,
    GUARANTEE_RECOMMENDATION_FIELD,
    ORG_EVALUATION_REQUEST_STATUS,
    ORG_EVALUATION_SEARCH_TARGETS,
    ORG_EVALUATION_TYPES,
    ORG_EVALUATION_TYPE_MODELS,
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

    // 페이지를 넘기면 목록의 맨 위로 되돌린다 — 화면 맨 위까지 올라가면 조회 조건을 다시 지나쳐야 해서
    // 방금 넘긴 목록이 어디서 시작하는지 찾기 어렵다. 목록 머리(총 N건)가 상단 바 아래에 오도록 맞춘다
    // (자리 확보는 아래 scroll-mt-* 가 한다).
    const listRef = useRef<HTMLDivElement>(null)
    const isFirstRenderRef = useRef(true)

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false

            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        listRef.current?.scrollIntoView({block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
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
                {/* 붙어 있는 상단 바 높이만큼 자리를 비워 둔다 — 페이지를 넘겨 이 자리로 굴러올 때
                    목록 머리가 바 아래에 가려지지 않는다. 바는 좁은 화면에서 56, xl 에서 상단 메뉴 줄까지
                    최대 112 라 각각 여유를 더해 80·128 로 둔다. */}
                <div ref={listRef} className="flex scroll-mt-20 flex-col gap-4 xl:scroll-mt-32">
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
