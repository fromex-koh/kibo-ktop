'use client'

import {useEffect, useRef, useState, type FormEvent} from 'react'
import {RotateCcw, Search} from 'lucide-react'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {
    CompanyNameField,
    DateRangeField,
    KeywordSearchField,
    SearchFilterActions,
    SearchFilterFields,
    SearchFilterForm,
    SelectFilterField,
} from '@/components/composite/search-filter-form'
import {KBigxReportCard} from '@/components/custom/k-bigx-report-card'
import {Button} from '@/components/ui/button'
import {
    K_BIGX_REPORT_FILTER_ALL_PLACEHOLDER,
    K_BIGX_REPORT_INQUIRY_TYPE_FILTERS,
    K_BIGX_REPORT_INQUIRY_TYPE_PLACEHOLDER,
    K_BIGX_REPORT_SEARCH_TARGETS,
    K_BIGX_REPORT_TYPE_FILTERS,
    type KBigxReportHistoryItem,
} from '@/constants/k-bigx-report-history'
import {K_BIGX_REPORT_ROUTES} from '@/content/service/k-bigx-report-history'
import {useIsMobile} from '@/hooks/use-mobile'

// K-BIGx 보고서 이력 목록 — Figma "SB-FOTA-CM0-0017_마이페이지_K-BIGx 보고서 이력"(기업)·
// "마이페이지_K-BIGx 보고서 이력"(기관). 조회 필터 · 건수 · 보고서 카드 · 페이지 이동이 한 덩어리로 움직인다.
// 기업과 기관은 조회 필터의 칸만 다르다(아래 CorpFilterFields · OrgFilterFields). 카드는 데이터에 따라 모양이 갈린다.
//
// 고른 값과 정렬을 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
// 데이터는 받아서 그리기만 한다 — 목업과 조회 API 의 교체 지점은 content/service/*k-bigx-report-history.ts 다.

// 시안의 기간 칩은 [전체] 가 골라져 있다.
const DEFAULT_PERIOD_PRESET = 'all'

// 기업 조회 필터 — 조회기간(라벨 보임) · [조회유형 | 기업명] 한 줄(시안 352·352).
const CorpFilterFields = () => (
    <>
        <DateRangeField name="inquiryPeriod" defaultPreset={DEFAULT_PERIOD_PRESET} size="lg" />
        <div className="grid gap-2 sm:grid-cols-2">
            <SelectFilterField
                label="조회유형"
                name="inquiryType"
                options={K_BIGX_REPORT_INQUIRY_TYPE_FILTERS}
                placeholder={K_BIGX_REPORT_INQUIRY_TYPE_PLACEHOLDER}
                labelHidden
                size="lg"
            />
            <CompanyNameField name="companyName" label="기업명" placeholder="기업명 입력" labelHidden size="lg" />
        </div>
    </>
)

// 기관 조회 필터 — 시안은 라벨이 하나도 보이지 않는다(조회기간 포함). 감추되 스크린리더에는 남긴다.
//   · 조회기간
//   · [조회유형 | 보고서 유형] 한 줄 — 둘 다 고르지 않은 상태가 전체 조회이고, 칸에는 [전체] 가 보인다(시안).
//   · 검색어 — 검색 대상(기업명 등) + 검색어 한 줄. 입력칸 안내 글은 고른 대상을 따라간다("기업명 입력").
const OrgFilterFields = () => (
    <>
        <DateRangeField name="inquiryPeriod" defaultPreset={DEFAULT_PERIOD_PRESET} size="lg" labelHidden />
        <div className="grid gap-2 sm:grid-cols-2">
            <SelectFilterField
                label="조회유형"
                name="inquiryType"
                options={K_BIGX_REPORT_INQUIRY_TYPE_FILTERS}
                placeholder={K_BIGX_REPORT_FILTER_ALL_PLACEHOLDER}
                labelHidden
                size="lg"
            />
            <SelectFilterField
                label="보고서 유형"
                name="reportType"
                options={K_BIGX_REPORT_TYPE_FILTERS}
                placeholder={K_BIGX_REPORT_FILTER_ALL_PLACEHOLDER}
                labelHidden
                size="lg"
            />
        </div>
        <KeywordSearchField name="search" label="검색어" options={K_BIGX_REPORT_SEARCH_TARGETS} labelHidden />
    </>
)

type KBigxReportHistoryListProps = {
    /** 조회된 보고서 전체. 정렬·페이지 나누기는 이 목록 안에서 처리한다. */
    items: readonly KBigxReportHistoryItem[]
    pageSize?: number
    /** 어느 화면의 목록인지 — 조회 필터의 칸이 달라진다. 기본은 기업이다. */
    userType?: 'corp' | 'org'
}

const KBigxReportHistoryList = ({items, pageSize = 10, userType = 'corp'}: KBigxReportHistoryListProps) => {
    const [page, setPage] = useState(1)
    const isMobile = useIsMobile()

    // 받은 순서를 그대로 그린다 — 정렬은 조회 조건과 함께 서버가 정한다.
    const sortedItems = items

    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(sortedItems.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = sortedItems.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    // 페이지를 넘기면 목록의 맨 위로 되돌린다 — 화면 맨 위까지 올라가면 조회 조건을 다시 지나쳐야 해서
    // 방금 넘긴 목록이 어디서 시작하는지 찾기 어렵다. 자리 확보는 아래 scroll-mt-* 가 한다.
    // 기관 평가결과 조회·하위계정 현황 목록과 같은 방식이다.
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

    // [프론트엔드 연동] 조회를 서버로 넘길 자리. 조회 조건은 폼이 들고 있으므로 FormData 로 받는다 —
    // 기업은 조회기간·조회유형·기업명, 기관은 조회기간·조회유형·보고서 유형·검색 대상·검색어다.
    // 지금은 넘겨받은 목록을 그대로 그리므로 조건만 확인하고 첫 페이지로 돌린다.
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const filters = Object.fromEntries(new FormData(event.currentTarget).entries())
        console.log('[K-BIGx 보고서 이력] 조회 조건', filters)
        setPage(1)
    }

    // [초기화] — 폼이 조회 조건을 기본값으로 되돌리고, 목록은 첫 페이지로 돌아간다.
    const handleReset = () => setPage(1)

    return (
        // 세로 간격은 시안 기준이다 — 조회 카드와 리스트 사이가 40.
        <div className="flex flex-col gap-10">
            <SearchFilterForm
                aria-label="K-BIGx 보고서 이력 조회 필터"
                layout="stack"
                surface="card"
                onSubmit={handleSearch}
                onReset={handleReset}
            >
                <SearchFilterFields className="gap-4">
                    {userType === 'org' ? <OrgFilterFields /> : <CorpFilterFields />}
                </SearchFilterFields>
                <SearchFilterActions className="gap-2 max-sm:*:min-w-0 max-sm:*:flex-1">
                    <Button id="k-bigx-report-search-reset" type="reset" variant="tertiary" size="md">
                        초기화
                        <RotateCcw aria-hidden="true" />
                    </Button>
                    <Button id="k-bigx-report-search-submit" type="submit" size="md">
                        조회
                        <Search aria-hidden="true" />
                    </Button>
                </SearchFilterActions>
            </SearchFilterForm>

            <div className="flex flex-col gap-10">
                {/* 건수와 목록은 한 덩어리로 붙고(16), 페이지 이동만 멀리 떨어진다(40) — 시안.
                    화면 위에 붙어 있는 것들의 높이만큼 자리를 비워 둔다 — 페이지를 넘겨 이 자리로 굴러올 때
                    목록 머리가 그 아래에 가려지지 않는다. 붙어 있는 높이는 폭마다 다르다.
                      · md 미만 — 헤더(56) 아래에 마이페이지 메뉴 드롭다운 줄(152)까지 붙어 208 → 224(scroll-mt-56)
                      · md~xl — 드롭다운 줄은 붙지 않고 헤더(100)만 → 112(scroll-mt-28)
                      · xl 이상 — 헤더(112) → 128(scroll-mt-32) */}
                <div ref={listRef} className="flex scroll-mt-56 flex-col gap-4 md:scroll-mt-28 xl:scroll-mt-32">
                    {/* 건수만 굵고 브랜드 색이다 — 몇 건인지가 이 줄에서 읽을 값이다.
                        시안에는 이 줄 오른쪽에 셀렉트가 더 있지만(기업 최신순 · 기관 조회유형 | 보고서 유형) 위 조회
                        필터와 같은 조건이라 두지 않는다 — 같은 조건을 두 곳에서 고르게 되면 어느 것이 지금 값인지 알 수 없다. */}
                    <p className="typo-body-xl-regular text-foreground">
                        총 <span className="typo-body-xl-bold text-primary-strong">{items.length}</span>건
                    </p>

                    {visibleItems.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {visibleItems.map((item) => (
                                <li key={item.id}>
                                    <KBigxReportCard item={item} routes={K_BIGX_REPORT_ROUTES} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // 빈 상태는 결과 카드와 같은 흰 면·모서리로 그 자리를 대신한다.
                        <EmptyState title="보고서 내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
                    )}
                </div>

                {sortedItems.length > 0 ? (
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

export {KBigxReportHistoryList}
export type {KBigxReportHistoryListProps}
