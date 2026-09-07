'use client'

import {useState, type ReactNode} from 'react'
import {Check} from 'lucide-react'
import {ClearableInput} from '@/components/composite/clearable-input'
import {EmptyState} from '@/components/composite/empty-state'
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
import {cn} from '@/lib/utils'

// 검색해서 하나 고르는 모달 — 보증추천의 [지점 검색]·[은행 검색]·[영업점 검색]처럼 목록에서 한 줄을
// 고르는 자리에 함께 쓴다. 고르는 순서는 업종코드 조회(IndustryCodeDialog)와 같다.
//   ① 묶음을 고르고 이름으로 검색 → ② 목록에서 한 줄 → ③ 고른 값 확인 → [선택 완료]
//
// 표처럼 보이지만 하는 일이 "여럿 중 하나 고르기" 라 라디오 묶음으로 만든다 — 줄 클릭·화살표 이동·읽어
// 주기가 모두 기본 동작으로 얻어진다[6.1.1 · 8.2.1].
//
// [프론트엔드 연동] items 를 조회 API 응답으로 바꾸면 이 모달은 그대로 동작한다. 서버에서 검색해야 하면
// 아래 searchItems 자리를 조회 요청으로 바꾼다.

const ALL_GROUPS = 'all'

type SearchSelectItem = {
    /** 줄을 구분하는 값 — 응답의 코드가 있으면 그 값을 쓴다. */
    code: string
    /** 왼쪽 칸(지역본부·은행 등). 없으면 이름 한 칸만 그린다. */
    group?: string
    /** 오른쪽 칸(센터명·영업점명 등). */
    name: string
}

const searchItems = (items: readonly SearchSelectItem[], group: string, keyword: string) => {
    const trimmed = keyword.trim()

    return items.filter(
        (item) => (group === ALL_GROUPS || item.group === group) && (!trimmed || item.name.includes(trimmed)),
    )
}

// 목록 한 줄 — 고른 줄은 옅은 파랑 면으로 구분한다(글자색은 그대로).
const rowClassName =
    'border-subtle-3 cursor-pointer border-b ' +
    'has-[:focus-visible]:outline-ring has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-2'

type SearchSelectDialogProps = {
    /** 모달 제목. */
    title: string
    /** ①② 줄에 적는 안내. */
    steps: {search: string; list: string}
    /** 왼쪽 셀렉트. 묶음이 없는 목록(은행 등)에서는 넘기지 않는다. */
    groupFilter?: {label: string; allLabel: string; options: readonly string[]}
    /** 목록·선택 줄에서 묶음 이름 뒤에 붙일 말(예: " 지역본부"). 셀렉트 항목에는 붙이지 않는다. */
    groupSuffix?: string
    /**
     * 표 머리 줄의 열 이름 — 업종코드 조회와 같은 구성이다(묶음 열이 없으면 name 만 쓴다).
     * nameAlign 은 이름 칸의 정렬이다. 업종코드 조회의 업종명처럼 왼쪽에 붙이려면 'start' 를 준다
     * (기본은 가운데 — 지점명처럼 짧은 이름은 가운데가 열이 곧게 보인다).
     */
    columns: {group?: string; name: string; nameAlign?: 'center' | 'start'}
    /** 검색어 칸의 이름과 안내 문구. */
    keyword: {label: string; placeholder: string}
    items: readonly SearchSelectItem[]
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [선택 완료] 를 눌렀을 때 고른 줄을 넘긴다. label 은 입력칸에 넣을 표기다. */
    onSelect?: (value: SearchSelectItem & {label: string}) => void
}

const SearchSelectDialog = ({
    title,
    steps,
    groupFilter,
    groupSuffix = '',
    columns,
    keyword: keywordField,
    items,
    children,
    defaultOpen,
    onSelect,
}: SearchSelectDialogProps) => {
    const [open, setOpen] = useState(Boolean(defaultOpen))
    const [group, setGroup] = useState(ALL_GROUPS)
    const [keyword, setKeyword] = useState('')
    const [results, setResults] = useState<readonly SearchSelectItem[]>(items)
    const [selected, setSelected] = useState<SearchSelectItem | null>(null)

    // 결과가 바뀌면 앞서 고른 줄은 더 이상 화면에 없을 수 있다 — 함께 비운다.
    const applySearch = (nextGroup: string, nextKeyword: string) => {
        setResults(searchItems(items, nextGroup, nextKeyword))
        setSelected(null)
    }

    const search = () => applySearch(group, keyword)

    // 묶음은 고르는 즉시 걸러진다 — 고른 뒤에도 [검색] 을 눌러야 목록이 바뀌면 고장으로 읽힌다.
    const handleGroupChange = (nextGroup: string) => {
        setGroup(nextGroup)
        applySearch(nextGroup, keyword)
    }

    const handleKeywordChange = (nextKeyword: string) => {
        setKeyword(nextKeyword)
        applySearch(group, nextKeyword)
    }

    // 닫을 때 처음 상태로 되돌린다 — 다음에 열었을 때 지난 검색과 선택이 남아 있으면 혼란스럽다.
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (nextOpen) return

        setGroup(ALL_GROUPS)
        setKeyword('')
        setResults(items)
        setSelected(null)
    }

    const save = () => {
        if (!selected) return

        onSelect?.({
            ...selected,
            label: selected.group ? `${selected.group}${groupSuffix} > ${selected.name}` : selected.name,
        })
        handleOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {/* 선택 줄은 스크롤 밖에 두어 화면이 낮아도 늘 보인다 — 스크롤은 검색·목록만 한다. */}
                <div className={cn(dialogBodyClassName, 'gap-6 overflow-hidden')}>
                    {/* -mx-1 px-1 은 포커스 링 자리다 — overflow 상자는 자기 밖을 그려 주지 않아 칸 옆에
                        붙은 링(outline 2 + offset 2)이 잘린다. 상자를 4 넓히고 같은 값만큼 안쪽 여백을
                        주어 내용 폭은 그대로 두면서 링이 상자 안에 들어온다(dialogBodyClassName 의 py-1 과 같은 이유). */}
                    <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-1">
                        <section className="flex shrink-0 flex-col gap-3">
                            <h3 className="typo-body-xl-bold text-foreground">{steps.search}</h3>
                            {/* 묶음을 고르고 이름으로 좁힌다. Enter 로도 검색되게 한다 —
                            검색창에서 가장 먼저 눌러 보는 키다. */}
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                                {groupFilter ? (
                                    <Select name="searchSelectGroup" value={group} onValueChange={handleGroupChange}>
                                        {/* 옆에 선 입력·[검색] 버튼과 같은 컨트롤 높이(48)를 쓴다 — 한 줄에
                                        선 컨트롤의 높이가 다르면 줄이 어긋나 보인다. */}
                                        <SelectTrigger
                                            id="search-select-group"
                                            size="lg"
                                            aria-label={groupFilter.label}
                                            className="w-full sm:w-45"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ALL_GROUPS}>{groupFilter.allLabel}</SelectItem>
                                            {groupFilter.options.map((name) => (
                                                <SelectItem key={name} value={name}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : null}
                                <div className="flex min-w-0 items-start gap-2 sm:flex-1">
                                    <ClearableInput
                                        id="search-select-keyword"
                                        name="searchSelectKeyword"
                                        autoComplete="off"
                                        aria-label={keywordField.label}
                                        placeholder={keywordField.placeholder}
                                        value={keyword}
                                        onChange={(event) => handleKeywordChange(event.currentTarget.value)}
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
                            </div>
                        </section>

                        {/* 목록만 남는 높이를 차지하고 그 안에서 스크롤한다 — 화면이 낮아도 아래 선택 줄과
                        [선택 완료] 가 잘리지 않는다. 넉넉한 화면에서는 다섯 줄(224)까지만 보인다. */}
                        <section className="flex min-h-0 min-w-0 flex-auto flex-col gap-3">
                            <h3 className="typo-body-xl-bold text-foreground">{steps.list}</h3>
                            {results.length ? (
                                <fieldset className="flex min-h-0 min-w-0 flex-auto flex-col">
                                    <legend className="sr-only">{steps.list}</legend>
                                    {/* 머리 줄 — 업종코드 조회와 같다(진한 윗선 + 옅은 파랑 면). 각 줄의 이름이
                                        이미 두 칸을 담고 있어 읽어 줄 필요가 없으므로 장식으로 둔다. */}
                                    <div
                                        aria-hidden="true"
                                        className={cn(
                                            'border-foreground-subtle bg-primary-subtle typo-body-l-bold text-foreground border-subtle-3 border-t border-b',
                                            columns.group ? 'grid grid-cols-[--spacing(35)_1fr]' : 'flex flex-col',
                                        )}
                                    >
                                        {columns.group ? (
                                            <span className="px-4 py-3 text-center">{columns.group}</span>
                                        ) : null}
                                        <span className="px-4 py-3 text-center">{columns.name}</span>
                                    </div>
                                    {/* 다섯 줄(224)까지 보이고, 화면이 낮으면 세 줄(128)까지 줄어든다. */}
                                    <div className="max-h-56 min-h-32 flex-auto overflow-y-auto">
                                        {results.map((item) => (
                                            <label
                                                key={item.code}
                                                className={cn(
                                                    rowClassName,
                                                    item.group ? 'grid grid-cols-[--spacing(35)_1fr]' : 'flex',
                                                    item.code === selected?.code
                                                        ? 'bg-secondary'
                                                        : 'interactive:hover:bg-surface-subtle',
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name="search-select-item"
                                                    value={item.code}
                                                    checked={item.code === selected?.code}
                                                    onChange={() => setSelected(item)}
                                                    className="sr-only"
                                                />
                                                {item.group ? (
                                                    <span className="typo-body-l-regular text-label-foreground px-4 py-3 text-center">
                                                        {item.group}
                                                        {groupSuffix}
                                                    </span>
                                                ) : null}
                                                <span
                                                    className={cn(
                                                        'typo-body-l-regular text-label-foreground px-4 py-3',
                                                        columns.nameAlign === 'start' ? 'text-start' : 'text-center',
                                                    )}
                                                >
                                                    {item.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            ) : (
                                <EmptyState title="검색내역이 없습니다." className="min-h-36" />
                            )}
                        </section>
                    </div>

                    {/* 고른 값 — 목록이 길어 스크롤하면 어느 줄을 골랐는지 화면에서 사라진다. 목록 아래에
                        한 줄로 남겨 [선택 완료] 를 누르기 전에 무엇이 담기는지 확인하게 한다.
                        고르기 전에는 두지 않는다 — 빈 안내가 자리만 차지해 낮은 화면에서 목록이 눌린다.
                        고른 직후 나타나는 자리라 화면을 보지 않아도 알 수 있게 알림으로 읽힌다[8.2.1]. */}
                    <p role="status" aria-live="polite" className="sr-only">
                        {selected
                            ? `${selected.group ? `${selected.group}${groupSuffix} ` : ''}${selected.name} 선택함`
                            : ''}
                    </p>
                    {selected ? (
                        <p className="bg-primary-subtle border-secondary-strong typo-body-l-bold text-primary-strong flex shrink-0 items-center gap-2 rounded-sm border px-5 py-4">
                            <Check aria-hidden="true" className="size-icon-sm shrink-0" />
                            <span>
                                선택 : {selected.group ? `${selected.group}${groupSuffix} › ` : ''}
                                {selected.name}
                            </span>
                        </p>
                    ) : null}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl">
                            취소
                        </Button>
                    </DialogClose>
                    {/* 고른 줄이 없으면 담을 것이 없다 — 무엇을 먼저 해야 하는지 버튼 상태로 알린다. */}
                    <Button type="button" size="xl" disabled={!selected} onClick={save}>
                        선택 완료
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {SearchSelectDialog}
export type {SearchSelectDialogProps, SearchSelectItem}
