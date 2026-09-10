'use client'

import {useEffect, useRef, useState, type FormEvent} from 'react'
import {useRouter} from 'next/navigation'
import {ArrowDown, ArrowUp, ArrowUpDown, RotateCcw, Search} from 'lucide-react'
import {SubAccountCreateDialog} from '@/components/composite/sub-account-create-dialog'
import {SubAccountDeleteDialog} from '@/components/composite/sub-account-delete-dialog'
import {SubAccountPasswordResetDialog} from '@/components/composite/sub-account-password-reset-dialog'
import {SubAccountStatusChangeDialog} from '@/components/composite/sub-account-status-change-dialog'
import {EmptyState} from '@/components/composite/empty-state'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Pagination} from '@/components/composite/pagination'
import {
    KeywordSearchField,
    SearchFilterActions,
    SearchFilterFields,
    SearchFilterForm,
    SelectFilterField,
} from '@/components/composite/search-filter-form'
import {SubAccountCard} from '@/components/custom/sub-account-card'
import {showCheckToast} from '@/components/custom/check-toast'
import {Button} from '@/components/ui/button'
import {
    SUB_ACCOUNT_SEARCH_TARGETS,
    SUB_ACCOUNT_SORT_LABEL,
    SUB_ACCOUNT_SORT_ORDER_LABEL,
    SUB_ACCOUNT_STATUS_FILTERS,
    SUB_ACCOUNT_STATUS_PLACEHOLDER,
    SUB_ACCOUNT_TOAST,
    nextSubAccountSortOrder,
    nextSubAccountStatus,
    type SubAccountItem,
    type SubAccountMenuAction,
    type SubAccountSortOrder,
} from '@/constants/sub-account'
import {SUB_ACCOUNT_ROUTES} from '@/content/service/org-sub-accounts'
import {useIsMobile} from '@/hooks/use-mobile'

// 기관 하위계정 목록 — Figma "마이페이지_하위계정 현황".
// 조회 필터 · 건수와 정렬·등록 · 계정 카드 · 페이지 이동이 한 덩어리로 움직인다.
//
// 고른 값과 정렬 방향을 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
// 데이터는 받아서 그리기만 한다 — 목업과 조회 API 의 교체 지점은 content/service/org-sub-accounts.ts 다.

// [⋮] 에서 화면으로 가는 일. 어느 계정인지는 쿼리(id)로 넘긴다.
// 비밀번호 초기화·상태 변경·삭제는 여기 없다 — 화면 이동이 아니라 이 화면에서 되묻는 모달이다.
const MENU_ROUTES = {
    edit: SUB_ACCOUNT_ROUTES.edit,
} as const satisfies Partial<Record<SubAccountMenuAction, string>>

// [⋮] 에서 고르면 되묻는 모달이 뜨는 일 — 되묻는 대상 계정을 상태 하나로 들고 있는다.
type SubAccountConfirmAction = Exclude<SubAccountMenuAction, keyof typeof MENU_ROUTES>

type OrgSubAccountListProps = {
    /** 조회된 하위계정 전체. 정렬·페이지 나누기는 이 목록 안에서 처리한다. */
    items: readonly SubAccountItem[]
    pageSize?: number
}

const OrgSubAccountList = ({items, pageSize = 10}: OrgSubAccountListProps) => {
    const router = useRouter()
    const [page, setPage] = useState(1)
    // 지운 계정은 목록에서 사라진다.
    // [프론트엔드 연동] 연동 후에는 삭제 요청을 보내고 목록을 다시 받아 오면 되므로 이 상태는 없어진다.
    const [accounts, setAccounts] = useState<readonly SubAccountItem[]>(items)
    // 되묻는 중인 계정과 그 일 — 없으면 세 모달이 모두 닫혀 있다.
    // 카드마다 모달을 두지 않고 목록이 하나씩만 들고 있는다(지운 카드가 사라지면 그 카드의 모달도 사라진다).
    const [confirmTarget, setConfirmTarget] = useState<{action: SubAccountConfirmAction; item: SubAccountItem}>()
    // 정렬 — 누를 때마다 오름차순 → 내림차순 → 기본으로 돌아간다. 기본은 받은 순서 그대로라 정렬하지 않는다.
    const [sortOrder, setSortOrder] = useState<SubAccountSortOrder>('none')

    const sortedItems =
        sortOrder === 'none'
            ? accounts
            : [...accounts].sort((a, b) =>
                  sortOrder === 'desc' ? b.reportCount - a.reportCount : a.reportCount - b.reportCount,
              )

    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(sortedItems.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = sortedItems.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    const isMobile = useIsMobile()

    // 페이지를 넘기면 목록의 맨 위로 되돌린다 — 화면 맨 위까지 올라가면 조회 조건을 다시 지나쳐야 해서
    // 방금 넘긴 목록이 어디서 시작하는지 찾기 어렵다. 자리 확보는 아래 scroll-mt-* 가 한다.
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

    // [프론트엔드 연동] 조회를 서버로 넘길 자리. 상태·검색 대상·검색어는 폼이 들고 있으므로 FormData 로
    // 받는다(status · searchType · searchKeyword). 정렬은 아래 sortOrder 다.
    // 지금은 넘겨받은 목록을 그대로 그리므로 조건만 확인하고 페이지를 처음으로 되돌린다.
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const filters = Object.fromEntries(new FormData(event.currentTarget).entries())
        console.log('[기관 하위계정 현황] 조회 조건', {...filters, sortOrder})
        setPage(1)
    }

    // [초기화] — 폼이 조회 조건을 기본값으로 되돌리고, 목록은 첫 페이지로 돌아간다.
    const handleReset = () => setPage(1)

    // [⋮] 에서 고른 일 — 수정만 그 일을 하는 화면으로 보내고, 나머지는 이 화면에서 되묻는다.
    // 아직 자리만 잡은 화면은 주소가 비어 있어 움직이지 않는다.
    const handleMenuSelect = (action: SubAccountMenuAction, item: SubAccountItem) => {
        if (action === 'edit') {
            const href = MENU_ROUTES[action]
            if (href === '#') return

            router.push(`${href}?id=${item.id}`)

            return
        }

        setConfirmTarget({action, item})
    }

    // 되묻는 모달이 닫힐 때 — 어느 모달이 닫히든 들고 있던 대상을 놓는다.
    const closeConfirm = (open: boolean) => {
        if (!open) setConfirmTarget(undefined)
    }

    // [확인] — 그 계정을 목록에서 지우고 모달을 닫는다. 마지막 장의 하나를 지우면 남은 마지막 장으로
    // 내려간다(currentPage 가 totalPages 를 넘지 않도록 아래에서 이미 좁혀 준다).
    const handleDeleteConfirm = () => {
        if (!confirmTarget) return

        const {item} = confirmTarget
        setAccounts((current) => current.filter((account) => account.id !== item.id))
        setConfirmTarget(undefined)
    }

    // [확인] — 그 계정의 상태를 반대로 뒤집는다(사용 ↔ 사용정지). 카드의 배지와 [⋮] 메뉴 이름이 함께 바뀐다.
    // [프론트엔드 연동] 연동 후에는 변경 요청을 보내고 목록을 다시 받아 오면 된다.
    const handleStatusChangeConfirm = () => {
        if (!confirmTarget) return

        const {item} = confirmTarget
        setAccounts((current) =>
            current.map((account) =>
                account.id === item.id ? {...account, status: nextSubAccountStatus(account.status)} : account,
            ),
        )
        setConfirmTarget(undefined)
        showCheckToast(SUB_ACCOUNT_TOAST.statusChange.message(nextSubAccountStatus(item.status)), {
            id: SUB_ACCOUNT_TOAST.statusChange.id,
        })
    }

    // [확인] — 임시 비밀번호를 보내는 일이라 목록은 그대로다. 바뀐 것이 화면에 없으므로 끝났다는 것은
    // 토스트만 알린다.
    // [프론트엔드 연동] 연동 후에는 초기화 요청을 보내고, 성공했을 때만 토스트를 띄운다.
    const handlePasswordResetConfirm = () => {
        setConfirmTarget(undefined)
        showCheckToast(SUB_ACCOUNT_TOAST.passwordReset.message, {id: SUB_ACCOUNT_TOAST.passwordReset.id})
    }

    // [저장하기] — 등록은 아직 목록에 넣지 않는다(새 계정의 상세값은 서버가 만든다). 끝났다는 것만 알린다.
    // [프론트엔드 연동] 등록 API 가 붙으면 목록을 다시 받아 온 뒤 이 토스트를 띄운다.
    const handleCreateSubmit = () => {
        showCheckToast(SUB_ACCOUNT_TOAST.create.message, {id: SUB_ACCOUNT_TOAST.create.id})
    }

    return (
        // 세로 간격은 시안 기준이다 — 조회 카드와 리스트 사이가 40.
        <div className="flex flex-col gap-10">
            {/* 조회 필터 — 상태·검색 대상·검색어 세 칸이 한 줄을 고르게 나눈다(시안 232·232·232).
                시안에는 라벨이 보이지 않아 감추되(labelHidden) 스크린리더에는 남긴다. */}
            <SearchFilterForm
                aria-label="하위계정 조회 필터"
                layout="stack"
                surface="card"
                onSubmit={handleSearch}
                onReset={handleReset}
            >
                <SearchFilterFields className="gap-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                        {/* 고를 수 있는 값은 사용·사용정지 둘이고, 고르지 않은 상태가 전체 조회다 —
                            그때 칸에는 [전체 상태] 가 보인다. [초기화] 를 누르면 이 자리로 돌아온다. */}
                        <SelectFilterField
                            label="상태"
                            name="status"
                            options={SUB_ACCOUNT_STATUS_FILTERS}
                            placeholder={SUB_ACCOUNT_STATUS_PLACEHOLDER}
                            labelHidden
                            size="lg"
                        />
                        {/* 검색 대상과 검색어는 짝이라 한 조각이 함께 그린다 — 남는 두 칸을 채운다. */}
                        <div className="sm:col-span-2">
                            <KeywordSearchField
                                name="search"
                                label="검색어"
                                options={SUB_ACCOUNT_SEARCH_TARGETS}
                                labelHidden
                            />
                        </div>
                    </div>
                </SearchFilterFields>
                <SearchFilterActions className="gap-2 max-sm:*:min-w-0 max-sm:*:flex-1">
                    <Button id="org-sub-account-search-reset" type="reset" variant="tertiary" size="md">
                        초기화
                        <RotateCcw aria-hidden="true" />
                    </Button>
                    <Button id="org-sub-account-search-submit" type="submit" size="md">
                        조회
                        <Search aria-hidden="true" />
                    </Button>
                </SearchFilterActions>
            </SearchFilterForm>

            <div className="flex flex-col gap-10">
                {/* 붙어 있는 상단 바 높이만큼 자리를 비워 둔다 — 페이지를 넘겨 이 자리로 굴러올 때
                    목록 머리가 바 아래에 가려지지 않는다(좁은 화면 56, xl 최대 112). */}
                <div ref={listRef} className="flex scroll-mt-20 flex-col gap-4 xl:scroll-mt-32">
                    {/* 건수 왼쪽, 정렬·등록 오른쪽(시안). 좁아지면 아래로 내려가 줄을 나눈다. */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <p className="typo-body-xl-regular text-foreground">
                            총 <span className="typo-body-xl-bold text-primary-strong">{accounts.length}</span>건
                        </p>

                        <div className="flex items-center gap-2">
                            {/* 정렬 — 누를 때마다 오름차순 → 내림차순 → 기본으로 돌아간다.
                                지금 어느 순서인지는 화살표 방향으로 보이고, 읽어 주기에는 이름에 붙는다[6.4.3].
                                시안 아이콘은 기본 상태의 ⇅ 이고, 정렬 중일 때만 그 방향을 가리킨다. */}
                            <Button
                                type="button"
                                variant="text"
                                size="md"
                                className="text-foreground font-medium"
                                onClick={() => setSortOrder(nextSubAccountSortOrder)}
                            >
                                {SUB_ACCOUNT_SORT_LABEL}
                                <span className="sr-only">{` (${SUB_ACCOUNT_SORT_ORDER_LABEL[sortOrder]})`}</span>
                                {sortOrder === 'asc' ? (
                                    <ArrowUp aria-hidden="true" />
                                ) : sortOrder === 'desc' ? (
                                    <ArrowDown aria-hidden="true" />
                                ) : (
                                    <ArrowUpDown aria-hidden="true" />
                                )}
                            </Button>
                            {/* 줄의 gap(8)과 합쳐 좌우 16 이 되도록 구분선 자신의 여백을 8 로 둔다(시안). */}
                            <InlineSeparator className="mx-2" />
                            {/* 시안의 [하위계정 등록] 은 글자만 있는 파란 외곽선 버튼이다(아이콘 없음).
                                화면으로 가지 않고 등록 모달을 연다. */}
                            <SubAccountCreateDialog onSubmit={handleCreateSubmit}>
                                <Button type="button" variant="secondary" size="xs">
                                    하위계정 등록
                                </Button>
                            </SubAccountCreateDialog>
                        </div>
                    </div>

                    {visibleItems.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {visibleItems.map((item) => (
                                <li key={item.id}>
                                    <SubAccountCard item={item} onMenuSelect={handleMenuSelect} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // 빈 상태는 결과 카드와 같은 흰 면·모서리로 그 자리를 대신한다.
                        // "검색내역이 없습니다" 가 아닌 이유 — 이 자리는 조회 결과가 없을 때만 비는 게
                        // 아니다. 아직 하나도 등록하지 않았을 때와 마지막 계정을 지웠을 때도 같은 자리가
                        // 비므로, 세 경우에 모두 맞는 말로 둔다(상세정보 모달의 빈 내역과 같은 말투).
                        <EmptyState title="하위계정 내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
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

            {/* [⋮] 가 여는 세 모달 — 셋 다 같은 확인 모달(ConfirmDialog)이라 생김새가 같고, 고른 일에
                따라 하나만 열린다. 어느 계정인지는 위 confirmTarget 하나가 들고 있다. */}
            <SubAccountPasswordResetDialog
                open={confirmTarget?.action === 'password-reset'}
                onOpenChange={closeConfirm}
                item={confirmTarget?.item}
                onConfirm={handlePasswordResetConfirm}
            />
            <SubAccountStatusChangeDialog
                open={confirmTarget?.action === 'status-change'}
                onOpenChange={closeConfirm}
                item={confirmTarget?.item}
                onConfirm={handleStatusChangeConfirm}
            />
            <SubAccountDeleteDialog
                open={confirmTarget?.action === 'delete'}
                onOpenChange={closeConfirm}
                item={confirmTarget?.item}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

export {OrgSubAccountList}
export type {OrgSubAccountListProps}
