'use client'

import {useEffect, useRef, useState, type FormEvent} from 'react'
import {RotateCcw, Search} from 'lucide-react'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {
    CompanyNameField,
    DateRangeField,
    SearchFilterActions,
    SearchFilterFields,
    SearchFilterForm,
} from '@/components/composite/search-filter-form'
import {Button} from '@/components/ui/button'
import {VerificationApplicationCard} from '@/components/custom/verification-application-card'
import type {VerificationApplicationItem} from '@/constants/verification-application'
import {useIsMobile} from '@/hooks/use-mobile'

// 기관 평가검증 신청 조회 목록 — Figma "마이페이지_평가검증 신청 조회".
// 조회 필터 · 건수 · 신청 카드 · 페이지 이동이 한 덩어리로 움직인다. 카드마다 이 기관이 지금까지 검증한
// 이력이 접혀 있고, 줄을 눌러 펼친다.
//
// 고른 값과 펼친 카드를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
// 데이터는 받아서 그리기만 한다 — 목업과 조회 API 의 교체 지점은 content/service/org-verification-applications.ts 다.

type OrgVerificationApplicationListProps = {
    /** 조회된 신청 전체. 페이지 나누기는 이 목록 안에서 처리한다. */
    items: readonly VerificationApplicationItem[]
    /** 처음 고른 상태로 열어 둘 조회기간. */
    defaultPeriod: string
    pageSize?: number
}

const OrgVerificationApplicationList = ({items, defaultPeriod, pageSize = 10}: OrgVerificationApplicationListProps) => {
    const [page, setPage] = useState(1)
    // 보증추천을 마친 건 — 그 카드의 버튼이 [보증이력] 으로 바뀐다.
    // [프론트엔드 연동] 연동 후에는 조회 응답이 알려 주므로 이 상태 없이 item 의 값으로 판단하면 된다.
    const [recommendedIds, setRecommendedIds] = useState<readonly string[]>([])

    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(items.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = items.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

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

    // [프론트엔드 연동] 조회를 서버로 넘길 자리. 조회기간·기업명은 폼이 들고 있으므로 FormData 로 받는다
    // (verificationPeriod* · companyName). 지금은 넘겨받은 목록을 그대로 그리므로 조건만 확인하고
    // 페이지를 처음으로 되돌린다.
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const filters = Object.fromEntries(new FormData(event.currentTarget).entries())
        console.log('[기관 평가검증 신청 조회] 조회 조건', filters)
        setPage(1)
    }

    // [초기화] — 폼이 조회 조건을 기본값으로 되돌리고, 목록은 첫 페이지로 돌아간다.
    const handleReset = () => setPage(1)

    return (
        // 세로 간격은 시안 기준이다 — 조회 카드와 리스트 사이가 40.
        <div className="flex flex-col gap-10">
            {/* 조회 필터 — 공통 SearchFilterForm 을 쓴다(평가결과 조회와 같은 짜임).
                시안에는 라벨이 보이지 않아 감추되(labelHidden) 스크린리더에는 남긴다.
                검색 대상 셀렉트 없이 기업명 한 칸이 줄을 가득 채운다. */}
            <SearchFilterForm
                aria-label="평가검증 신청 조회 필터"
                layout="stack"
                surface="card"
                onSubmit={handleSearch}
                onReset={handleReset}
            >
                <SearchFilterFields className="gap-4">
                    <DateRangeField name="verificationPeriod" defaultPreset={defaultPeriod} labelHidden size="lg" />
                    <CompanyNameField name="companyName" label="기업명" placeholder="기업명 입력" labelHidden />
                </SearchFilterFields>
                {/* 폼 안의 버튼도 id 나 name 을 가져야 한다(HTML 검사기 "A form field element should have
                    an id or name attribute") — 제출·초기화 버튼은 값을 보내지 않으므로 id 만 둔다. */}
                <SearchFilterActions className="gap-2 max-sm:*:min-w-0 max-sm:*:flex-1">
                    <Button id="org-verification-search-reset" type="reset" variant="tertiary" size="md">
                        초기화
                        <RotateCcw aria-hidden="true" />
                    </Button>
                    <Button id="org-verification-search-submit" type="submit" size="md">
                        조회
                        <Search aria-hidden="true" />
                    </Button>
                </SearchFilterActions>
            </SearchFilterForm>

            <div className="flex flex-col gap-10">
                {/* 건수와 목록은 한 덩어리로 붙고(16), 페이지 이동만 멀리 떨어진다(40) — 시안. */}
                {/* 붙어 있는 상단 바 높이만큼 자리를 비워 둔다 — 페이지를 넘겨 이 자리로 굴러올 때
                    목록 머리가 바 아래에 가려지지 않는다. 바는 좁은 화면에서 56, xl 에서 상단 메뉴 줄까지
                    최대 112 라 각각 여유를 더해 80·128 로 둔다. */}
                <div ref={listRef} className="flex scroll-mt-20 flex-col gap-4 xl:scroll-mt-32">
                    {/* 건수만 굵고 브랜드 색이다 — 몇 건인지가 이 줄에서 읽을 값이다. */}
                    <p className="typo-body-xl-regular text-foreground">
                        총 <span className="typo-body-xl-bold text-primary-strong">{items.length}</span>건
                    </p>

                    {visibleItems.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {visibleItems.map((item) => (
                                <li key={item.id}>
                                    <VerificationApplicationCard
                                        item={item}
                                        isGuaranteeRecommended={recommendedIds.includes(item.id)}
                                        onGuaranteeCompleted={() =>
                                            setRecommendedIds((ids) =>
                                                ids.includes(item.id) ? ids : [...ids, item.id],
                                            )
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // 빈 상태는 결과 카드와 같은 흰 면·모서리로 그 자리를 대신한다(시안 "내역없음").
                        <EmptyState title="검색내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
                    )}
                </div>

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
                        className="justify-center"
                    />
                ) : null}
            </div>
        </div>
    )
}

export {OrgVerificationApplicationList}
export type {OrgVerificationApplicationListProps}
