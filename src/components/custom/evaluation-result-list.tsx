'use client'

import {useEffect, useRef, useState, type FormEvent} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {ChartArea, FolderSearch} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {HistoryAction, HistoryItem, HistoryList} from '@/components/composite/history-list'
import {Pagination} from '@/components/composite/pagination'
import {DateRangeField, SearchFilterFields, SearchFilterForm} from '@/components/composite/search-filter-form'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Button} from '@/components/ui/button'
import {
    EVALUATION_RESULT_STATUS,
    type AnalysisKind,
    type EvaluationResultStatus,
    type EvaluationSelectOption,
} from '@/constants/evaluation-result'
import {useIsMobile} from '@/hooks/use-mobile'

// 평가결과 조회 목록 — Figma "[마이페이지] 평가이력 조회".
// 조회 필터(조회기간) · 건수와 정렬 · 결과 목록 · 페이지 이동이 한 덩어리로 움직인다.
// 필터와 페이지 상태를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
//
// 조회 필터는 공통 SearchFilterForm 을 그대로 쓴다 — 이 화면 때문에 그쪽에 배치(layout)와 면(surface)
// 축을 더했고, [조회] 버튼은 날짜 줄 오른쪽 슬롯(action)으로 받는다.

// 분석 버튼의 아이콘 — 컴포넌트(함수)라 화면(page)에서 넘길 수 없어 여기서 종류에 붙인다.
const ANALYSIS_BUTTONS: Record<AnalysisKind, {label: string; icon: typeof ChartArea}> = {
    general: {label: '일반분석', icon: ChartArea},
    deep: {label: '심층분석', icon: FolderSearch},
}

type EvaluationAnalysis = {
    kind: AnalysisKind
    href: string
}

type EvaluationResultAction = {
    label: string
    /** 그 동작이 여는 화면. 퍼블리싱에서는 눌렀을 때 이 화면으로 옮겨 결과를 보여 준다. */
    href: string
}

type EvaluationResultItem = {
    id: string
    /** 평가 일시(YYYY.MM.DD HH:mm — 시안 표기). */
    evaluatedAt: string
    status: EvaluationResultStatus
    /** 등급·점수(AA · 6.6). 아직 나오지 않았으면 넘기지 않는다. */
    grade?: string
    /** 모형 이름의 앞머리(굵게). 예: 자가진단 · Tech-Index */
    title: string
    /** 앞머리 뒤에 붙는 모형 코드(보통 굵기). 예: KTRS-FM */
    model?: string
    /** 오른쪽 분석 버튼. 모형에 따라 하나만 나오기도 한다. */
    analyses: readonly EvaluationAnalysis[]
    /** 아래 줄의 동작 버튼(은행전송·기관전송·전송내역·보증신청). */
    actions: readonly EvaluationResultAction[]
    /** 아직 결과가 나오지 않아 눌러도 볼 것이 없는 건 — 버튼과 링크를 모두 잠근다. */
    disabled?: boolean
}

// 결과 한 건 — 이력 목록의 한 항목이다. 줄 구성(메타·제목·액션·링크)은 HistoryItem 이 갖고,
// 이 화면은 무엇을 그 자리에 넣을지만 정한다.
const EvaluationResultRow = ({item}: {item: EvaluationResultItem}) => {
    const router = useRouter()
    const status = EVALUATION_RESULT_STATUS[item.status]
    // 잠긴 건은 상태·등급까지 흐리게 둔다 — 줄 전체가 아직 볼 것이 없다는 뜻이다.
    const statusClassName = item.disabled ? 'text-disabled' : status.className
    const gradeClassName = item.disabled ? 'text-disabled' : 'text-purple-600'

    return (
        <HistoryItem
            // 구분선은 일시와 결과 사이에만 둔다(시안) — 상태와 등급은 같은 결과라 간격(12)만 두고 붙는다.
            meta={[
                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                    {item.evaluatedAt}
                </span>,
                <span key="result" className="flex items-center gap-3">
                    <span className={`typo-body-l-bold ${statusClassName}`}>{status.label}</span>
                    {item.grade ? <span className={`typo-body-l-bold ${gradeClassName}`}>{item.grade}</span> : null}
                </span>,
            ]}
            title={
                // 모형 이름 — 앞머리는 굵고 뒤에 붙는 모형 코드는 보통 굵기다(시안).
                <h3 className="typo-title-m-bold text-foreground min-w-0">
                    {item.title}
                    {/* 앞머리와 모형 코드 사이 8 — 낱말 사이 공백(4)으로는 시안만큼 떨어지지 않는다. */}
                    {item.model ? <span className="typo-title-m-regular ms-2">{item.model}</span> : null}
                </h3>
            }
            action={item.analyses.map((analysis) => {
                const {label, icon: Icon} = ANALYSIS_BUTTONS[analysis.kind]

                if (item.disabled) {
                    return (
                        <Button key={analysis.kind} type="button" variant="secondary" size="xs" disabled>
                            <Icon aria-hidden="true" />
                            {label}
                        </Button>
                    )
                }

                return (
                    <Button key={analysis.kind} asChild variant="secondary" size="xs">
                        <Link href={analysis.href}>
                            <Icon aria-hidden="true" />
                            {label}
                        </Link>
                    </Button>
                )
            })}
        >
            {/* [프론트엔드 연동] 지금은 그 동작이 여는 화면으로 옮기기만 한다 — 전송 API 가 붙으면
                이 자리에서 호출하고 결과에 따라 화면을 띄운다. */}
            {item.actions.map((action) => (
                <HistoryAction key={action.label} disabled={item.disabled} onClick={() => router.push(action.href)}>
                    {action.label}
                </HistoryAction>
            ))}
        </HistoryItem>
    )
}

type EvaluationResultListProps = {
    items: readonly EvaluationResultItem[]
    /** 조회 조건 — 화면(page)이 읽어 내려 준다. 목록은 값의 출처를 알지 않는다. */
    modelFilters: readonly EvaluationSelectOption[]
    statusFilters: readonly EvaluationSelectOption[]
    /** 처음 고른 상태로 열어 둘 조회기간. */
    defaultPeriod: string
    pageSize?: number
}

const EvaluationResultList = ({
    items,
    modelFilters,
    statusFilters,
    defaultPeriod,
    pageSize = 10,
}: EvaluationResultListProps) => {
    const [model, setModel] = useState<string>(modelFilters[0].value)
    const [status, setStatus] = useState<string>(statusFilters[0].value)
    const [page, setPage] = useState(1)

    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(items.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = items.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    const isMobile = useIsMobile()

    // 페이지를 넘기면 화면 맨 위로 되돌린다 — 목록 화면의 공통 동작이다(공지사항·1:1 문의와 같은 처리).
    const isFirstRenderRef = useRef(true)

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false

            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }, [currentPage])

    // [프론트엔드 연동] 조회 API 는 이 자리에서 호출한다. 조회기간 값은 폼이 들고 있으므로 FormData 로
    // 받는다(evaluationPeriodPreset · evaluationPeriodFrom · evaluationPeriodTo).
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const period = Object.fromEntries(new FormData(event.currentTarget).entries())
        console.log('[평가결과 조회] 조회 조건', {...period, model, status})
        setPage(1)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* 조회 필터 — 공통 SearchFilterForm 을 쓴다.
                layout="stack" : 사이드바 옆 폭(792)이라 라벨을 위에 둔다. 왼쪽 라벨을 두면 날짜 두 칸에
                                 남는 폭이 모자라 눌린다.
                surface="card" : 아래 결과 카드와 같은 흰 면이다 — 한 화면의 두 덩어리라 면이 서로 다르면
                                 한쪽이 꺼진 영역처럼 읽힌다.
                [조회] 는 폼 아래 액션 줄 대신 날짜 줄 오른쪽에 둔다(시안) — 묻는 것이 조회기간 하나뿐이라
                버튼만 한 줄 내리면 카드가 이유 없이 높아진다. */}
            <SearchFilterForm aria-label="평가결과 조회 필터" layout="stack" surface="card" onSubmit={handleSearch}>
                <SearchFilterFields>
                    <DateRangeField
                        name="evaluationPeriod"
                        defaultPreset={defaultPeriod}
                        action={
                            <Button type="submit" size="sm">
                                조회
                            </Button>
                        }
                    />
                </SearchFilterFields>
            </SearchFilterForm>

            {/* 건수·정렬 줄과 결과 목록이 한 카드에 들어간다(시안) — 건수 줄 아래 구분선이 목록의 위쪽
                선과 이어져, 어디까지가 이번 조회 결과인지 한 덩어리로 보인다.
                안쪽 여백은 BaseCard 가 가진 값(24)을 그대로 쓴다 — 카드 여백은 컴포넌트가 정한다. */}
            <BaseCard>
                {/* 건수와 정렬이 한 줄이다(시안). 좁아지면 정렬이 아래로 내려간다. */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-6">
                    {/* 건수만 굵고 브랜드 색이다 — 몇 건인지가 이 줄에서 읽을 값이다. */}
                    <p className="typo-body-xl-regular text-foreground">
                        총 <span className="typo-body-xl-bold text-primary-strong">{items.length}</span>건
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Select name="evaluationModel" value={model} onValueChange={setModel}>
                            <SelectTrigger aria-label="평가 모형" className="w-30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {modelFilters.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select name="evaluationStatus" value={status} onValueChange={setStatus}>
                            <SelectTrigger aria-label="진행상태" className="w-33">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusFilters.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {visibleItems.length > 0 ? (
                    // 목록 맨 위의 굵은 선이 건수·정렬 줄과 결과를 가른다(시안).
                    <HistoryList>
                        {visibleItems.map((item) => (
                            <EvaluationResultRow key={item.id} item={item} />
                        ))}
                    </HistoryList>
                ) : (
                    <EmptyState title="조회된 평가결과가 없습니다." />
                )}
            </BaseCard>

            {items.length > 0 ? (
                <Pagination
                    page={currentPage}
                    total={totalPages}
                    onPageChange={setPage}
                    siblingCount={isMobile ? 0 : 1}
                    prevLabel={isMobile ? '' : '이전'}
                    nextLabel={isMobile ? '' : '다음'}
                    maxVisibleItems={isMobile ? 5 : 10}
                    compact={isMobile}
                    className="mt-4 justify-center"
                />
            ) : null}
        </div>
    )
}

export {EvaluationResultList}
export type {EvaluationResultItem, EvaluationResultAction, EvaluationAnalysis, EvaluationResultListProps}
