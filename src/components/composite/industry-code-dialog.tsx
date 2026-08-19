'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import INDUSTRY_CODE_GROUPS from '@/content/technology-evaluation/industry-codes.json'
import {ListMarker} from '@/components/custom/list-marker'
import {EmptyState} from '@/components/composite/empty-state'
import {Button} from '@/components/ui/button'
import {ClearableInput} from '@/components/composite/clearable-input'
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
import {cn} from '@/lib/utils'

// 업종코드 조회 모달 — 자가진단 기업정보의 [조회] 버튼이 연다.
// Figma "m_업종코드 조회"(40006919:33045) · "…_내역없음"(40006919:33014).
//
// 고르는 순서 — 검색 → 중분류 한 줄 → 그 아래 업종 한 줄 → 선택저장.
//   1. 검색하면 중분류 표가 뜬다(맞는 것이 없으면 빈 상태).
//   2. 중분류 한 줄을 고르면 그 줄이 선택 표시되고, 아래에 그 중분류에 속한 업종 표가 열린다.
//   3. 아래 표에서 한 줄을 고르면 두 줄 모두 선택 표시가 남는다.
//   4. [선택저장] 을 누르면 고른 값을 onSelect 로 넘기고 닫는다.
//
// 연동할 때 — INDUSTRY_CODES(목업)를 API 응답으로 바꾸고, searchIndustryCodes 를 검색 요청으로 바꾼다.
// 화면 쪽은 손댈 것이 없다.

type IndustrySubCode = {code: string; name: string}
type IndustryCode = IndustrySubCode & {items: IndustrySubCode[]}

// 목업 — 한국표준산업분류(KSIC)의 중분류와 그 아래 세세분류 전체(중분류 77 · 하위 1205).
// 실제 목록은 API 가 준다 — 응답이 같은 모양이면 이 import 만 호출로 바꾸면 화면은 그대로다.
const INDUSTRY_CODES: IndustryCode[] = INDUSTRY_CODE_GROUPS

// 검색 — 중분류나 그 아래 업종 중 하나라도 코드·이름이 맞으면 그 중분류를 결과에 담는다.
// 검색어가 비면 전체를 보여 준다(무엇이 있는지 훑어볼 수 있어야 한다).
const matches = (target: IndustrySubCode, keyword: string) =>
    target.code.startsWith(keyword) || target.name.includes(keyword)

const searchIndustryCodes = (keyword: string) => {
    const trimmed = keyword.trim()
    if (!trimmed) return INDUSTRY_CODES

    return INDUSTRY_CODES.filter(
        (group) => matches(group, trimmed) || group.items.some((item) => matches(item, trimmed)),
    )
}

const NOTICES = [
    '실제 영위중인 업종이 법인등기부등본, 사업자등록증상의 업종과 상이할 경우 실제 영위중인 업종선택',
    '2개 이상 업종 겸영하는 경우에는 매출액이 큰 업종선택',
    '업종을 전환하는 기업은 현재 실제로 영위중인 업종선택',
]

// 안내 패널 — 페이지 하단의 InfoBox 와 같은 "회색 면 + 불릿" 이지만 모달 규격이 달라 여기서 만든다.
// (시안: 반경 8 · 여백 20 · 본문 14/21 · 제목 없음 / InfoBox: 반경 16 · 여백 40·32 · 본문 16/24 · 제목 있음)
// 같은 규격이 다른 모달에도 나오면 그때 InfoBox 에 크기를 더한다.
const IndustryCodeNotice = () => (
    <ul className="bg-background flex list-none flex-col gap-2 rounded-sm p-5">
        {NOTICES.map((notice) => (
            <li key={notice} className="flex">
                <ListMarker type="unordered" level={1} />
                <span className="typo-body-l-regular text-foreground-subtle min-w-0">{notice}</span>
            </li>
        ))}
    </ul>
)

// 표 한 벌 — 생김새는 표지만 하는 일은 "여럿 중 하나 고르기" 라서 라디오 묶음으로 만든다.
// <table> 대신 라디오를 쓰는 이유 — 줄 전체가 눌리는 표를 <table> 로 만들면 tr 에 클릭을 달아야 하고
// 키보드 조작을 직접 구현해야 한다. 라벨로 감싼 라디오는 클릭·화살표 이동·읽어 주기가 전부 기본 동작이다
// [6.1.1 · 8.2.1]. 머리 줄은 각 줄의 이름("01 농업")이 이미 코드와 업종명을 담고 있어 장식으로 둔다.
//
// 격자 — 코드 칸 100(=--spacing(25)) 고정, 업종명이 남는 폭. 줄 높이 45 는 py-3 + 본문 21 로 나온다(시안).
const codeTableRowClassName =
    'grid grid-cols-[--spacing(25)_1fr] border-subtle-3 cursor-pointer border-b ' +
    'has-[:focus-visible]:outline-ring has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-2'

type CodeTableProps = {
    /** 라디오 묶음 이름 — 두 표가 서로 다른 묶음이어야 각각 하나씩 고를 수 있다. */
    name: string
    /** 묶음의 이름. 화면에는 머리 줄로, 스크린리더에는 legend 로 전달한다. */
    legend: string
    /** 코드 열 머리 문구(중분류 · 중분류 이하). */
    codeHeader: string
    rows: IndustrySubCode[]
    selectedCode?: string
    onSelect: (row: IndustrySubCode) => void
}

const CodeTable = ({name, legend, codeHeader, rows, selectedCode, onSelect}: CodeTableProps) => (
    <fieldset className="flex min-w-0 flex-col">
        <legend className="sr-only">{legend}</legend>
        {/* 머리 줄 — 시안의 표 위 진한 선(1px gray.500)과 옅은 파랑 배경. */}
        <div
            aria-hidden="true"
            className="border-foreground-subtle bg-primary-subtle typo-body-l-bold text-foreground border-subtle-3 grid grid-cols-[--spacing(25)_1fr] border-t border-b"
        >
            <span className="px-4 py-3 text-center">{codeHeader}</span>
            <span className="px-4 py-3 text-center">업종명</span>
        </div>
        {/* 다섯 줄까지 보이고 그 아래는 이 안에서 스크롤한다 — 시안 225(45×5)를 간격 스케일에 맞춰 224 로 둔다. */}
        <div className="max-h-56 overflow-y-auto">
            {rows.map((row) => (
                <label
                    key={row.code}
                    className={cn(
                        codeTableRowClassName,
                        // 고른 줄 — 시안은 옅은 파랑 면으로만 구분한다(글자색은 그대로).
                        row.code === selectedCode ? 'bg-secondary' : 'interactive:hover:bg-surface-subtle',
                    )}
                >
                    <input
                        type="radio"
                        name={name}
                        value={row.code}
                        checked={row.code === selectedCode}
                        onChange={() => onSelect(row)}
                        className="sr-only"
                    />
                    <span className="typo-body-l-regular text-label-foreground px-4 py-3 text-center">{row.code}</span>
                    <span className="typo-body-l-regular text-label-foreground px-4 py-3">{row.name}</span>
                </label>
            ))}
        </div>
    </fieldset>
)

// 아래 표가 열린 자리로 본문을 내린다 — 새 표는 고른 줄 밑에 생겨 화면 밖에 있을 수 있고,
// 그러면 사용자는 아무 일도 일어나지 않은 것으로 본다. 표가 통째로 보이도록 최소한만 움직인다.
//
// element.scrollIntoView() 를 쓰지 않는 이유 — 그 함수는 스크롤 가능한 조상을 전부 움직인다.
// 모달 카드는 overflow-hidden 이라 화면에는 스크롤바가 없지만 스크립트로는 스크롤되므로, 카드까지 밀려
// 올라가 제목이 잘리고 아래에 빈 자리가 생긴다. 그래서 본문 상자 하나만 직접 굴린다.
//
// 동작을 줄이도록 설정한 사용자에게는 즉시 이동한다[6.3.1] — 프로젝트의 다른 자동 스크롤과 같은 방식이다.
// 표 아랫변이 상자 끝에 딱 붙지 않도록 남기는 여백(반복 카드 스크롤과 같은 값).
const SCROLL_MARGIN_PX = 16

const scrollIntoViewInside = (container: HTMLElement, target: HTMLElement) => {
    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    // 아래로 넘친 만큼 내리되, 표의 윗변이 상자 위로 올라가지 않는 선까지만 내린다.
    const overflow = targetRect.bottom + SCROLL_MARGIN_PX - containerRect.bottom
    const room = targetRect.top - containerRect.top
    const delta = Math.max(0, Math.min(overflow, room))
    if (!delta) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    container.scrollBy({top: delta, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
}

type IndustryCodeDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 자체를 확인하는 화면). */
    defaultOpen?: boolean
    /** [선택저장] 을 눌렀을 때 고른 업종을 넘긴다. 넘기지 않으면 닫히기만 한다. */
    onSelect?: (value: {code: string; name: string; label: string}) => void
}

const IndustryCodeDialog = ({children, defaultOpen, onSelect}: IndustryCodeDialogProps) => {
    const [open, setOpen] = useState(Boolean(defaultOpen))
    const [keyword, setKeyword] = useState('')
    // null = 아직 검색하지 않음. 빈 배열 = 검색했지만 결과 없음 — 둘 다 같은 빈 상태를 보여 준다.
    const [results, setResults] = useState<IndustryCode[] | null>(null)
    const [selectedGroup, setSelectedGroup] = useState<IndustryCode | null>(null)
    const [selectedItem, setSelectedItem] = useState<IndustrySubCode | null>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const subTableRef = useRef<HTMLDivElement>(null)

    // 중분류를 고르거나 다른 중분류로 바꿀 때마다 그 아래 표가 보이는 자리로 내린다.
    useEffect(() => {
        if (!selectedGroup || !bodyRef.current || !subTableRef.current) return

        scrollIntoViewInside(bodyRef.current, subTableRef.current)
    }, [selectedGroup])

    const search = () => {
        setResults(searchIndustryCodes(keyword))
        // 결과가 바뀌면 앞서 고른 줄은 더 이상 화면에 없을 수 있다 — 함께 비운다.
        setSelectedGroup(null)
        setSelectedItem(null)
    }

    // 닫을 때 처음 상태로 되돌린다 — 다음에 열었을 때 지난 검색과 선택이 남아 있으면 혼란스럽다.
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (nextOpen) return

        setKeyword('')
        setResults(null)
        setSelectedGroup(null)
        setSelectedItem(null)
    }

    const save = () => {
        if (!selectedItem) return

        onSelect?.({...selectedItem, label: `${selectedItem.code} ${selectedItem.name}`})
        handleOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>업종코드 조회</DialogTitle>
                </DialogHeader>
                <div ref={bodyRef} className={cn(dialogBodyClassName, 'gap-6')}>
                    <IndustryCodeNotice />
                    {/* 검색 줄 — 입력이 남는 폭을 갖고 버튼은 글자 폭 그대로다(시안 404 + 76).
                        Enter 로도 검색되게 한다 — 검색창에서 가장 먼저 눌러 보는 키다. */}
                    <div className="flex items-start gap-2">
                        <ClearableInput
                            id="industry-code-keyword"
                            name="industryCodeKeyword"
                            autoComplete="off"
                            aria-label="업종명 또는 코드"
                            placeholder="업종명 또는 코드 입력"
                            value={keyword}
                            onChange={(event) => setKeyword(event.currentTarget.value)}
                            onKeyDown={(event) => {
                                if (event.key !== 'Enter') return

                                event.preventDefault()
                                search()
                            }}
                            className="min-w-0 flex-1"
                        />
                        <Button type="button" size="md" className="shrink-0" onClick={search}>
                            검색
                        </Button>
                    </div>
                    {results?.length ? (
                        <>
                            <CodeTable
                                name="industry-code-group"
                                legend="중분류 선택"
                                codeHeader="중분류"
                                rows={results}
                                selectedCode={selectedGroup?.code}
                                onSelect={(row) => {
                                    setSelectedGroup(results.find((group) => group.code === row.code) ?? null)
                                    // 중분류를 바꾸면 아래 표의 내용이 통째로 바뀐다 — 이전 선택은 버린다.
                                    setSelectedItem(null)
                                }}
                            />
                            {/* 중분류를 고른 뒤에만 아래 표가 열린다(시안 주석 "selected 시에 하단 테이블 노출"). */}
                            {selectedGroup ? (
                                <div ref={subTableRef} className="flex min-w-0 flex-col">
                                    <CodeTable
                                        name="industry-code-item"
                                        legend={`${selectedGroup.name} 아래 업종 선택`}
                                        codeHeader="중분류 이하"
                                        rows={selectedGroup.items}
                                        selectedCode={selectedItem?.code}
                                        onSelect={setSelectedItem}
                                    />
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <EmptyState title="검색내역이 없습니다." className="min-h-36" />
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="tertiary" size="xl">
                            닫기
                        </Button>
                    </DialogClose>
                    {/* 업종은 마지막 표까지 골라야 정해진다 — 그 전에는 저장할 값이 없다. */}
                    <Button size="xl" disabled={!selectedItem} onClick={save}>
                        선택저장
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {IndustryCodeDialog}
