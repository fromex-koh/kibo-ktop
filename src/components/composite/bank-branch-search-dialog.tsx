'use client'

import {useState, type ReactNode} from 'react'
import {ClearableInput} from '@/components/composite/clearable-input'
import {EmptyState} from '@/components/composite/empty-state'
import {Field} from '@/components/composite/form-fields'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {BANKS, BANK_BRANCHES, type BankBranch} from '@/content/service/tech-evaluation-centers'
import {cn} from '@/lib/utils'

// 은행 영업점 조회 — 보증추천의 [은행]·[영업점명] 두 칸이 함께 여는 모달(시안 "은행 영업점 조회").
//
// 예전에는 [은행 검색]·[영업점 검색] 모달이 따로 있어 같은 일을 두 번 해야 했다. 영업점은 어느 은행의
// 것인지가 함께 정해지므로, 목록에서 고른 한 줄이 두 칸을 함께 채운다.
//
// 고르는 순서: 은행을 고르고 → 영업점명으로 좁힌 뒤 → 목록에서 한 줄을 누르면 그대로 담기고 닫힌다.
// 시안의 CTA 가 [닫기] 하나뿐이라 [선택 완료] 를 따로 두지 않는다 — 줄이 곧 버튼이다.
//
// [프론트엔드 연동] BANK_BRANCHES 를 조회 API 응답으로 바꾸면 이 모달은 그대로 동작한다. 서버에서
// 검색해야 하면 아래 searchBranches 자리를 조회 요청으로 바꾼다.

const searchBranches = (bankName: string, keyword: string) => {
    const trimmed = keyword.trim()

    return BANK_BRANCHES.filter(
        (branch) => (!bankName || branch.bankName === bankName) && (!trimmed || branch.name.includes(trimmed)),
    )
}

// 표의 세 칸 — 은행명·지로코드는 가운데, 영업점명은 왼쪽에 붙인다(시안 120·120·나머지).
// 모달이 화면 폭을 따르는 좁은 화면에서는 앞 두 칸을 88 로 줄인다 — 120 씩 두면 영업점명 칸에 남는 자리가
// 없어 지점명이 두 줄로 접힌다(글자 폭은 은행명 네 자·지로코드 일곱 자라 88 이면 한 줄에 들어간다).
const rowGridClassName =
    'grid grid-cols-[--spacing(22)_--spacing(22)_1fr] sm:grid-cols-[--spacing(30)_--spacing(30)_1fr]'
const cellClassName = 'typo-body-l-regular text-label-foreground px-4 py-3'

type BankBranchSearchDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 고른 줄 — 은행명과 영업점명을 함께 넘긴다. */
    onSelect?: (branch: BankBranch) => void
}

const BankBranchSearchDialog = ({children, defaultOpen, onSelect}: BankBranchSearchDialogProps) => {
    const [open, setOpen] = useState(Boolean(defaultOpen))
    const [bankName, setBankName] = useState('')
    const [keyword, setKeyword] = useState('')
    const [results, setResults] = useState<readonly BankBranch[]>(BANK_BRANCHES)

    // 목록은 [검색] 을 눌렀을 때만 바뀐다 — 은행을 고르거나 글자를 치는 동안 목록이 저 혼자 바뀌면
    // 무엇을 눌러 나온 결과인지 알기 어렵다. 찾는 동작이 버튼 하나로 모인다.
    const search = () => setResults(searchBranches(bankName, keyword))

    // 닫을 때 처음 상태로 되돌린다 — 다음에 열었을 때 지난 검색이 남아 있으면 혼란스럽다.
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (nextOpen) return

        setBankName('')
        setKeyword('')
        setResults(BANK_BRANCHES)
    }

    const select = (branch: BankBranch) => {
        onSelect?.(branch)
        handleOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>은행 영업점 조회</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogBodyClassName, 'gap-6 overflow-hidden')}>
                    {/* -mx-1 px-1 은 포커스 링 자리다 — overflow 상자는 자기 밖을 그려 주지 않아 칸 옆에 붙은
                        링(outline 2 + offset 2)이 잘린다. 상자를 4 넓히고 같은 값만큼 안쪽 여백을 준다. */}
                    <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-1">
                        <div className="flex shrink-0 flex-col gap-6">
                            <Field id="bank-branch-search-bank" label="은행">
                                <Select name="bankBranchSearchBank" value={bankName} onValueChange={setBankName}>
                                    <SelectTrigger id="bank-branch-search-bank" size="lg" className="w-full">
                                        <SelectValue placeholder="은행을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BANKS.map((bank) => (
                                            <SelectItem key={bank.code} value={bank.name}>
                                                {bank.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field id="bank-branch-search-keyword" label="영업점명">
                                {/* 찾기는 [검색] 을 눌렀을 때 일어난다. Enter 로도 같은 일이 되게 한다 —
                                    검색창에서 가장 먼저 눌러 보는 키다. */}
                                <div className="flex items-start gap-2">
                                    <ClearableInput
                                        id="bank-branch-search-keyword"
                                        name="bankBranchSearchKeyword"
                                        autoComplete="off"
                                        placeholder="영업점명 입력"
                                        value={keyword}
                                        onChange={(event) => setKeyword(event.currentTarget.value)}
                                        onKeyDown={(event) => {
                                            if (event.key !== 'Enter') return

                                            event.preventDefault()
                                            search()
                                        }}
                                        className="min-w-0 flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        size="md"
                                        className="shrink-0"
                                        onClick={search}
                                    >
                                        검색
                                    </Button>
                                </div>
                            </Field>
                        </div>

                        {/* 목록이 남는 높이를 차지하고 그 안에서 스크롤한다 — 화면이 낮아도 [닫기] 가 잘리지 않는다. */}
                        <section className="flex min-h-0 min-w-0 flex-auto flex-col">
                            <h3 className="sr-only">영업점 목록</h3>
                            {/* 결과 수가 바뀌는 것은 화면을 보지 않으면 알 수 없다 — 바뀔 때마다 읽어 준다[8.2.1]. */}
                            <p role="status" aria-live="polite" className="sr-only">
                                {results.length ? `영업점 ${results.length}건` : '검색된 영업점이 없습니다.'}
                            </p>
                            {results.length ? (
                                <>
                                    {/* 머리 줄 — 진한 윗선 + 옅은 파랑 면(시안). 아래 각 줄의 이름이 세 칸을 모두
                                    담고 있어 읽어 줄 필요가 없으므로 장식으로 둔다. */}
                                    <div
                                        aria-hidden="true"
                                        className={cn(
                                            rowGridClassName,
                                            'border-t-foreground-subtle border-b-subtle-3 bg-primary-subtle typo-body-l-bold text-foreground border-t border-b',
                                        )}
                                    >
                                        <span className="px-4 py-3 text-center">은행명</span>
                                        <span className="px-4 py-3 text-center">지로코드</span>
                                        <span className="px-4 py-3 text-center">영업점명</span>
                                    </div>
                                    {/* 다섯 줄(225)까지 보이고, 화면이 낮으면 세 줄(135)까지 줄어든다. */}
                                    <div className="max-h-56 min-h-32 flex-auto overflow-y-auto">
                                        {results.map((branch) => (
                                            <button
                                                key={branch.code}
                                                type="button"
                                                onClick={() => select(branch)}
                                                className={cn(
                                                    rowGridClassName,
                                                    'border-subtle-3 interactive:hover:bg-surface-subtle w-full border-b text-left',
                                                )}
                                            >
                                                <span className={cn(cellClassName, 'text-center')}>
                                                    {branch.bankName}
                                                </span>
                                                <span className={cn(cellClassName, 'text-center')}>
                                                    {branch.giroCode}
                                                </span>
                                                <span className={cellClassName}>{branch.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <EmptyState title="검색된 영업점이 없습니다." className="min-h-36" />
                            )}
                        </section>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl">
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {BankBranchSearchDialog}
export type {BankBranchSearchDialogProps}
