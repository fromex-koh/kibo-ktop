'use client'

import {useEffect, useId, useRef, useState, type FormEvent} from 'react'
import Link from 'next/link'
import {RotateCcw, Search} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {
    DateRangeField,
    SearchFilterActions,
    SearchFilterFields,
    SearchFilterForm,
} from '@/components/composite/search-filter-form'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {TextTabs} from '@/components/composite/text-tabs'
import {Button} from '@/components/ui/button'
import {EVALUATION_REPORT_WINDOW_HEIGHT, EVALUATION_REPORT_WINDOW_WIDTH} from '@/constants/evaluation-report'
import type {EvaluationGradeUnit, EvaluationModelTab, EvaluationResultItem} from '@/constants/evaluation-result'
import {useIsMobile} from '@/hooks/use-mobile'
import {cn} from '@/lib/utils'

// 평가결과 조회 목록 — Figma "마이페이지_평가결과 조회".
// 모형 탭 · 조회 필터 · 건수 · 결과 카드 · 페이지 이동이 한 덩어리로 움직인다.
// 탭과 페이지 상태를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
//
// 데이터는 받아서 그리기만 한다 — 목업과 조회 API 의 교체 지점은 content/service/evaluation-results.ts 다.

// 결과값 배지 — 시안의 "카운트" 묶음(navy.100 면 · navy.200 테두리 · navy.600 글자).
// 값만 크고 단위(등급·점)는 작게 붙는다.
//
// 값과 단위가 한 덩어리("AA 등급")로 읽히도록 읽을 문장을 따로 두고 보이는 두 조각은 감춘다.
// aria-label 로 이름을 주지 않는 이유는 p 처럼 role 이 없는 요소에는 그 속성을 쓸 수 없기 때문이다
// (HTML 검사기 "aria-label must not be specified on any p element" · [8.1.1]).
const GradeBadge = ({grade, unit}: {grade: string; unit: EvaluationGradeUnit}) => (
    <p className="bg-navy-100 border-navy-200 text-navy-600 flex shrink-0 items-center gap-1 rounded-sm border px-3 py-1">
        <span className="sr-only">{`${grade} ${unit}`}</span>
        <span aria-hidden="true" className="typo-h2-bold">
            {grade}
        </span>
        <span aria-hidden="true" className="typo-body-m-medium">
            {unit}
        </span>
    </p>
)

// 결과 한 건 — 모형명·결과값 / 평가일 / 버튼(시안 "평가결과 조회 case").
// 응답이 주는 것은 모형 코드뿐이라 화면에 쓸 이름(modelLabel)과 단위(unit)는 탭 표에서 찾아 넘겨받는다.
//
// 버튼 수는 모형마다 다르다 — KTRS-FM 은 [자가진단 결과·은행 전송·보증신청] 셋이고 나머지 모형은
// [자가진단 결과] 하나다(시안). 셋일 때는 카드 폭을 고르게 나누고, 하나일 때는 오른쪽에 세운다.
const EvaluationResultCard = ({
    item,
    modelLabel,
    unit,
}: {
    item: EvaluationResultItem
    modelLabel: string
    unit: EvaluationGradeUnit
}) => {
    const isSingleAction = item.actions.length === 1

    return (
        <BaseCard padding="lg" className="[&_[data-slot=card-content]]:xl:px-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="typo-title-l-bold text-foreground min-w-0 truncate">{modelLabel}</h3>
                        <GradeBadge grade={item.grade} unit={unit} />
                    </div>
                    {/* 평가일은 라벨과 값이 한 줄이다(시안) — 좁은 화면에서 값이 길어지면 다음 줄로 넘어간다. */}
                    <p className="typo-body-l-regular flex flex-wrap gap-x-1">
                        <span className="text-foreground-subtle">평가일</span>
                        <span className="text-foreground">{item.evaluatedAt}</span>
                    </p>
                </div>

                {/* 좁은 화면에서는 버튼이 한 줄에 하나씩 쌓인다. */}
                <div
                    className={cn(
                        'grid gap-2',
                        isSingleAction ? 'sm:flex sm:justify-end' : 'sm:auto-cols-fr sm:grid-flow-col',
                    )}
                >
                    {item.actions.map((action) =>
                        action.done ? (
                            <Button
                                key={action.label}
                                type="button"
                                variant="tertiary"
                                size="sm"
                                disabled
                                className={cn(isSingleAction && 'sm:w-45')}
                            >
                                {action.label}
                            </Button>
                        ) : (
                            <Button
                                key={action.label}
                                asChild
                                variant="tertiary"
                                size="sm"
                                className={cn(isSingleAction && 'sm:w-45')}
                            >
                                {action.newWindow ? (
                                    // 인쇄용 리포트는 시안 폭에 맞춘 새 창으로 연다 — 같은 이름으로 열어
                                    // 여러 번 눌러도 창이 쌓이지 않는다.
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
                        ),
                    )}
                </div>
            </div>
        </BaseCard>
    )
}

type EvaluationResultListProps = {
    /** 조회된 평가결과 전체. 모형 탭·페이지 나누기는 이 목록 안에서 처리한다. */
    items: readonly EvaluationResultItem[]
    /** 모형 탭 — 화면(page)이 읽어 내려 준다. 목록은 값의 출처를 알지 않는다. */
    modelTabs: readonly EvaluationModelTab[]
    /** 처음 고른 상태로 열어 둘 조회기간. */
    defaultPeriod: string
    pageSize?: number
}

const EvaluationResultList = ({items, modelTabs, defaultPeriod, pageSize = 10}: EvaluationResultListProps) => {
    const [model, setModel] = useState<string>(modelTabs[0].value)
    const [page, setPage] = useState(1)
    const panelId = useId()

    // 고른 모형의 건만 남긴다 — 건수·페이지 수도 이 결과를 따른다.
    const filteredItems = items.filter((item) => item.model === model)
    const modelTabByValue = new Map(modelTabs.map((tab) => [tab.value, tab]))

    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(filteredItems.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = filteredItems.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

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

    // [프론트엔드 연동] 조회를 서버로 넘길 자리. 조회기간 값은 폼이 들고 있으므로 FormData 로 받는다
    // (evaluationPeriodPreset · evaluationPeriodFrom · evaluationPeriodTo). 모형은 탭 값(model)이다.
    // 지금은 넘겨받은 목록을 화면 안에서 거르므로 조건만 확인하고 페이지를 처음으로 되돌린다.
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const period = Object.fromEntries(new FormData(event.currentTarget).entries())
        console.log('[평가결과 조회] 조회 조건', {...period, model})
        setPage(1)
    }

    // [초기화] — 폼이 조회 조건(기간 프리셋·시작·종료일)을 기본값으로 되돌리고, 목록은 첫 페이지로 돌아간다.
    const handleReset = () => setPage(1)

    const handleModelChange = (value: string) => {
        setModel(value)
        setPage(1)
    }

    return (
        // 세로 간격은 시안 기준이다 — 탭·조회 카드·리스트 사이가 40, 리스트 안은 아래에서 따로 잡는다.
        <div className="flex flex-col gap-10">
            {/* 모형은 셀렉트가 아니라 탭으로 고른다(시안) — 네 가지뿐이라 펼치지 않고 바로 보여 준다. */}
            <TextTabs
                items={modelTabs}
                value={model}
                onValueChange={handleModelChange}
                label="평가 모형"
                panelId={panelId}
            />

            {/* 조회 필터 — 공통 SearchFilterForm 을 쓴다.
                layout="stack" : 사이드바 옆 폭(792)이라 라벨을 위에 둔다.
                surface="card" : 아래 결과 카드와 같은 흰 면이다.
                시안에는 "조회기간" 라벨이 보이지 않아 감추되(labelHidden) 스크린리더에는 남긴다.
                [초기화]·[조회] 는 날짜 줄 아래 오른쪽에 선다(시안). */}
            <SearchFilterForm
                aria-label="평가결과 조회 필터"
                layout="stack"
                surface="card"
                onSubmit={handleSearch}
                onReset={handleReset}
            >
                <SearchFilterFields>
                    <DateRangeField name="evaluationPeriod" defaultPreset={defaultPeriod} labelHidden size="lg" />
                </SearchFilterFields>
                {/* 좁은 화면에서는 두 버튼이 한 줄을 반씩 나눠 갖는다 — 각 버튼의 최소 폭(120) 탓에
                    카드 안에서 줄바꿈되어 오른쪽에 층지듯 쌓이던 것을 막는다. */}
                {/* 폼 안의 버튼도 id 나 name 을 가져야 한다(HTML 검사기 "A form field element should have
                    an id or name attribute") — 제출·초기화 버튼은 값을 보내지 않으므로 id 만 둔다. */}
                <SearchFilterActions className="gap-2 max-sm:*:min-w-0 max-sm:*:flex-1">
                    <Button id="evaluation-search-reset" type="reset" variant="tertiary" size="md">
                        초기화
                        <RotateCcw aria-hidden="true" />
                    </Button>
                    <Button id="evaluation-search-submit" type="submit" size="md">
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
                                    <EvaluationResultCard
                                        item={item}
                                        modelLabel={modelTabByValue.get(item.model)?.label ?? item.model}
                                        unit={modelTabByValue.get(item.model)?.unit ?? '등급'}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // 빈 상태는 결과 카드와 같은 흰 면·모서리로 그 자리를 대신한다(시안 "내역없음" 792×208).
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

export {EvaluationResultList}
export type {EvaluationResultListProps}
