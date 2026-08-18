'use client'

import {useMemo, useState, type ReactNode} from 'react'
import {ItemDescriptionDialogContent} from '@/components/composite/item-description-dialog'
import {EmptyState} from '@/components/composite/empty-state'
import {FieldLabel} from '@/components/composite/form-fields'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Field as BaseField} from '@/components/ui/field'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {ClearableInput} from '@/components/composite/form-values'
import {SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {dialogBodyEndClassName, dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {
    dialogTableCellClassName,
    dialogTableClassName,
    dialogTableHeaderCellClassName,
} from '@/components/theme/dialog-table.variants'
import type {ItemDescription} from '@/content/service/item-descriptions'
import {TECHNOLOGY_CATEGORY_GROUPS, TECHNOLOGY_CATEGORY_THEMES} from '@/content/service/technology-categories'
import {cn} from '@/lib/utils'

// 혁신성장영위기업 분류근거 모달 — 기업정보의 [기술분류] 옆 [조회]가 여는 표.
// Figma "[신속표준모형 KTRS-FM] m_혁신성장영위기업 분류근거"(modal 588 · 안쪽 508).
//
// 품목명을 누르면 창이 닫히고 고른 이름이 기술분류 칸에 담긴다(시안 메모 "selected 시에 창이 닫히고
// 기술분류 칸에 입력"). 줄마다 붙는 [품목설명]은 같은 품목의 설명 모달을 겹쳐 연다.
//
// 표 규격(시안 실측) — 안쪽 폭 508 기준
//   상단 굵은 구분선 1 · 머리줄 높이 45 · 본문 줄 높이 56
//   칸 폭 80(테마) · 80(분야) · 348(주요품목)
//   테마·분야·머리줄 배경 blue.50(primary-subtle), 가운데 정렬 / 주요품목 칸은 흰 배경, 왼쪽 정렬
// 같은 테마·분야는 세로로 병합한다 — 데이터가 분야 단위로 오므로 rowSpan 으로 그리고, 병합 칸은 그
// 묶음의 첫 줄에만 둔다.
//
// 시안의 하단 CTA(버튼 두 개)는 다른 모달에서 복제된 잔여 레이어라 두지 않는다 — 내보낸 이미지에도 없다.

const ALL_THEMES = 'all'

type TechnologyCategoryRow = {
    theme: string
    field: string
    item: ItemDescription
    /** 0 이면 위 줄과 병합된 칸이라 이 줄에는 그리지 않는다. */
    themeRowSpan: number
    fieldRowSpan: number
}

// 검색·필터를 적용한 뒤 표가 그릴 줄로 편다.
const buildRows = (keyword: string, theme: string): TechnologyCategoryRow[] => {
    const normalized = keyword.trim().toLowerCase()
    const groups = TECHNOLOGY_CATEGORY_GROUPS.filter((group) => theme === ALL_THEMES || group.theme === theme)
        .map((group) => ({
            ...group,
            items: normalized
                ? group.items.filter((item) => item.name.toLowerCase().includes(normalized))
                : group.items,
        }))
        .filter((group) => group.items.length > 0)

    // 테마는 여러 분야에 걸쳐 병합되므로 분야를 다 추린 뒤에 센다.
    const themeCounts = groups.reduce<Record<string, number>>((counts, group) => {
        counts[group.theme] = (counts[group.theme] ?? 0) + group.items.length

        return counts
    }, {})

    const seenThemes = new Set<string>()

    return groups.flatMap((group) =>
        group.items.map((item, index) => {
            const isFirstOfTheme = index === 0 && !seenThemes.has(group.theme)
            if (isFirstOfTheme) seenThemes.add(group.theme)

            return {
                theme: group.theme,
                field: group.field,
                item,
                themeRowSpan: isFirstOfTheme ? themeCounts[group.theme] : 0,
                fieldRowSpan: index === 0 ? group.items.length : 0,
            }
        }),
    )
}

// 표가 240 줄이라 머리줄은 본문 위에 붙박이로 세운다 — 어디까지 내려가도 어느 칸인지 알 수 있다.
//
// 이 표만 border-separate 로 둔다. 기본값 border-collapse 에서는 맞닿은 테두리가 하나로 합쳐지면서
// 그 선의 주인이 칸이 아니라 표·행이 되어, 붙박이가 된 머리줄을 따라오지 않고 제자리에서 굴러
// 올라간다(위 굵은 선이 사라지고, 아래 선도 없어져 파란 머리줄과 파란 테마·분야 칸이 붙어 보인다).
// separate 로 두면 칸이 자기 테두리를 직접 그려 머리줄과 함께 따라온다.
//
// 대신 맞닿은 선이 두 겹이 되므로 칸은 아래·오른쪽만 갖는다(border-0 border-b border-r).
// 표의 왼쪽 끝은 첫 칸(테마)이 border-l 로, 위쪽 굵은 선은 머리줄이 border-t 로 갖는다.
const tableClassName = cn(dialogTableClassName, 'border-separate border-spacing-0')
const cellClassName = cn(dialogTableCellClassName, 'border-0 border-r border-b')
const headerCellClassName = cn(dialogTableHeaderCellClassName, 'border-0 border-r border-b')

// 열 제목 — 시안은 Bold 다. 위 굵은 선(gray.500)도 여기가 갖는다.
const columnHeadClassName = cn(
    headerCellClassName,
    'typo-body-l-bold border-t-foreground-subtle sticky top-0 z-10 border-t',
)
// 병합 칸(테마·분야) — 시안은 Medium 이다. 폭은 각 80. 80 칸에 들어가지 않는 긴 분야명
// ("소프트웨어응용/사이버보안")이 있어 break-all 로 칸 안에서 접는다 — break-keep 은 낱말이 삐져나온다.
const groupCellClassName = cn(headerCellClassName, 'typo-body-l-medium w-20 px-2 break-all')
// 맨 왼쪽 칸(테마)은 표의 왼쪽 끝이라 왼 테두리를 더 갖는다. 테마는 늘 rowSpan 으로 묶음 전체를
// 덮으므로 이 한 칸이 그 묶음의 왼쪽 끝을 모두 그린다.
const themeHeadClassName = cn(columnHeadClassName, 'w-20 border-l px-2')
const themeCellClassName = cn(groupCellClassName, 'border-l')

type TechnologyCategoryDialogProps = {
    children: ReactNode
    defaultOpen?: boolean
    /** 품목명을 눌렀을 때. 창은 이 컴포넌트가 닫는다. */
    onSelect?: (item: string) => void
    /**
     * 이 번호(원문 항목 번호)를 가진 줄의 [품목설명]까지 함께 열어 둔다.
     * 모달 두 겹을 한 화면에서 보여 주는 확인용 화면에서만 쓴다 — 실제 화면에서는 넘기지 않는다.
     */
    defaultOpenItemNo?: number
}

const TechnologyCategoryDialog = ({
    children,
    defaultOpen,
    onSelect,
    defaultOpenItemNo,
}: TechnologyCategoryDialogProps) => {
    const [open, setOpen] = useState(defaultOpen ?? false)
    // 검색어는 치고 있는 값과 [조회]로 확정한 값을 나눈다 — 글자마다 표가 흔들리지 않게 한다.
    // 테마는 나누지 않는다. 고르는 순간이 곧 확정이라 query 를 바로 고치고, 셀렉트도 그 값을 보여 준다.
    const [keywordInput, setKeywordInput] = useState('')
    const [query, setQuery] = useState({keyword: '', theme: ALL_THEMES})

    const rows = useMemo(() => buildRows(query.keyword, query.theme), [query])

    // [전체] — 테마 하나가 아니라 "거르지 않고 다 보기"다. 걸려 있던 검색어까지 함께 푼다.
    // 테마만 풀면 앞서 조회한 검색어가 남아 [전체]인데도 일부만 나온다. 검색어 칸도 함께 비워
    // 무엇이 풀렸는지 화면에 드러낸다.
    const showAll = () => {
        setKeywordInput('')
        setQuery({keyword: '', theme: ALL_THEMES})
    }

    // 테마 고르기 — 목록에서 하나를 고르는 일은 그 자체가 이미 끝난 선택이라 바로 건다.
    // 검색어는 그대로 둔다 — 그 테마 안에서 다시 찾는 것이 하려던 일이다.
    // 바뀐 건수는 "총 N건"의 aria-live 가 읽어 준다. 표만 다시 그릴 뿐 초점이 옮겨 가거나 화면이
    // 바뀌지는 않으므로 포커스·변경만으로 일어나는 뜻밖의 실행이 아니다[7.2.1].
    const selectTheme = (theme: string) => {
        if (theme === ALL_THEMES) {
            showAll()

            return
        }

        setQuery((prev) => ({...prev, theme}))
    }

    // [조회]·Enter — 검색어만 확정한다(테마는 이미 걸려 있다).
    const search = () => setQuery((prev) => ({...prev, keyword: keywordInput}))

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                {/* 머리 구획 — 제목뿐 아니라 안내·검색·건수까지 여기 둔다. 세 행 그리드의 첫 행이라
                    본문이 굴러가도 제자리에 남는다. 건수와 표 사이 여백을 두지 않아 스크롤된 행이
                    붙박이 머리줄 위 틈으로 비치지 않게 한다. */}
                <DialogHeader className="pb-0">
                    <DialogTitle>혁신성장영위기업 분류근거</DialogTitle>

                    {/* 안내 — 시안은 제목 없이 회색 상자에 불릿 한 줄만 둔다(높이 61 = 여백 20 + 줄 21 + 여백 20).
                        상자 안 "알려드려요" 제목 레이어는 목록과 겹쳐 있는 잔여물이라 두지 않는다. */}
                    <div className="bg-background flex rounded-sm p-5">
                        <ListMarker type="unordered" level={1} />
                        <p className="typo-body-l-regular text-foreground-subtle min-w-0 break-keep">
                            품목명을 클릭하면 기술분류 칸에 입력됩니다. (최대 3개)
                        </p>
                    </div>

                    {/* 검색 줄 — 테마 선택(208) + 검색어(208) + [조회](76).
                        테마는 고르는 즉시 걸리고, 검색어는 [조회]나 Enter 로 건다.
                        시안 라벨에는 필수 표시(*)가 없다 — 거르는 조건이라 비워 두고 조회할 수 있다. */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-end">
                        <BaseField className="md:w-52">
                            <FieldLabel htmlFor="technology-category-theme">혁신성장영위기업품목</FieldLabel>
                            <SelectField value={query.theme} onValueChange={selectTheme}>
                                <SelectTrigger id="technology-category-theme" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* 이미 [전체]인 채로 검색어만 걸려 있을 때 다시 [전체]를 골라도
                                        값이 그대로라 onValueChange 가 오지 않는다. 그때도 "다 보기"가
                                        되도록 누름 자체에도 같은 일을 건다(값이 바뀔 때는 두 번 불려도
                                        결과가 같다). */}
                                    <SelectItem value={ALL_THEMES} onClick={showAll}>
                                        전체
                                    </SelectItem>
                                    {TECHNOLOGY_CATEGORY_THEMES.map((theme) => (
                                        <SelectItem key={theme} value={theme}>
                                            {theme}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectField>
                        </BaseField>
                        <BaseField className="min-w-0 flex-1">
                            <FieldLabel htmlFor="technology-category-keyword">주요 품목 및 품목 설명</FieldLabel>
                            <div className="flex items-start gap-2">
                                <ClearableInput
                                    id="technology-category-keyword"
                                    name="technologyCategoryKeyword"
                                    value={keywordInput}
                                    onChange={(event) => setKeywordInput(event.currentTarget.value)}
                                    onKeyDown={(event) => {
                                        if (event.key !== 'Enter') return
                                        // 모달 안이라 Enter 가 폼 제출로 새어 나가지 않게 막는다.
                                        event.preventDefault()
                                        search()
                                    }}
                                    placeholder="검색어 입력"
                                    autoComplete="off"
                                    className="min-w-0 flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    size="md"
                                    className="shrink-0"
                                    onClick={search}
                                >
                                    조회
                                </Button>
                            </div>
                        </BaseField>
                    </div>

                    {/* 건수 — 시안은 숫자만 파랗게 강조한다. 걸러도 "총 0건"처럼 걸린 수만 적는다
                        (전체 건수를 덧붙이지 않는다 — 시안의 빈 결과 화면도 "총 0건" 한 줄이다).
                        값이 바뀌면 스크린리더에도 알린다. */}
                    <p aria-live="polite" className="typo-body-xl-regular text-foreground">
                        총 <strong className="text-primary">{rows.length}</strong>건
                    </p>
                </DialogHeader>

                {/* 본문 — 굴러가는 것은 표뿐이다. 여백을 padding 으로 가지므로 세로 스크롤 막대가 카드의
                    맨 오른쪽 끝에 생긴다(개별 상세 보기 모달과 같은 구획).
                    pt-0 — 위 여백은 머리 구획의 pb-4 가 이미 갖고 있고, 여기 여백이 남으면 굴러 올라온
                    줄이 붙박이 머리줄 위 틈으로 비친다. */}
                {/* 좌우 스크롤은 셸(ui/table)이 표에 두른 상자가 아니라 이 구획이 맡는다 — 상자가 맡으면
                    그 상자가 스크롤 컨테이너가 되어 머리줄의 sticky 가 표 안에 갇혀 붙박이가 되지 않는다. */}
                <div
                    className={cn(
                        dialogInfoBodyClassName,
                        'overflow-x-auto pt-0 [&_[data-slot=table-container]]:overflow-visible',
                    )}
                >
                    {rows.length > 0 ? (
                        <Table className={tableClassName}>
                            <caption className="sr-only">테마·분야별 혁신성장영위기업 주요품목</caption>
                            <TableHeader>
                                <TableRow className="border-0 hover:bg-transparent">
                                    <TableHead scope="col" className={themeHeadClassName}>
                                        테마
                                    </TableHead>
                                    <TableHead scope="col" className={cn(columnHeadClassName, 'w-20 px-2')}>
                                        분야
                                    </TableHead>
                                    <TableHead scope="col" className={columnHeadClassName}>
                                        주요품목
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={`${row.field}-${row.item.no}`}
                                        className="border-0 hover:bg-transparent"
                                    >
                                        {row.themeRowSpan > 0 ? (
                                            <TableHead
                                                scope="rowgroup"
                                                rowSpan={row.themeRowSpan}
                                                className={themeCellClassName}
                                            >
                                                {row.theme}
                                            </TableHead>
                                        ) : null}
                                        {row.fieldRowSpan > 0 ? (
                                            <TableHead
                                                scope="rowgroup"
                                                rowSpan={row.fieldRowSpan}
                                                className={groupCellClassName}
                                            >
                                                {row.field}
                                            </TableHead>
                                        ) : null}
                                        {/* 줄 높이 56(시안) — 품목명과 [품목설명]이 한 줄에 나란히 온다. */}
                                        <TableCell className={cn(cellClassName, 'h-14 py-2')}>
                                            <div className="flex items-center justify-between gap-3">
                                                {/* 품목명 자체가 고르는 버튼이다 — 누르면 창이 닫히고 값이 넘어간다. */}
                                                <button
                                                    type="button"
                                                    className="text-label-foreground focus-visible:outline-ring min-w-0 flex-1 text-left break-keep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                                                    onClick={() => {
                                                        onSelect?.(row.item.name)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {row.item.name}
                                                </button>
                                                {/* 설명은 고르는 것과 다른 일이라 겹쳐 여는 별도 모달이다.
                                                    그 줄의 품목만 넘긴다 — 240개를 한 창에 늘어놓지 않는다. */}
                                                <Dialog defaultOpen={row.item.no === defaultOpenItemNo}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="tertiary"
                                                            size="xs"
                                                            className="shrink-0"
                                                            aria-label={`${row.item.name} 품목설명`}
                                                        >
                                                            품목설명
                                                        </Button>
                                                    </DialogTrigger>
                                                    {/* 설명 모달의 카테고리 경로가 이 줄의 테마·분야를 그대로 받는다. */}
                                                    <ItemDescriptionDialogContent
                                                        item={row.item}
                                                        theme={row.theme}
                                                        field={row.field}
                                                    />
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        // 빈 결과 — 시안은 한 덩이 글이 두 줄로 접힌 모습이라(16/24 Regular · gray.500 한 벌)
                        // 두 문장을 모두 title 로 준다. description 슬롯은 14px·다른 색이라 시안과 어긋난다.
                        // 높이 168 = 위아래 여백 40 + 아이콘 32 + 간격 8 + 두 줄 48(시안 실측).
                        <EmptyState
                            className="min-h-42"
                            title={
                                <>
                                    조회 결과가 없습니다.
                                    <br />
                                    검색 조건을 변경해 주세요.
                                </>
                            }
                        />
                    )}
                </div>
                {/* CTA 가 없는 모달이라 카드 아래 여백을 스크롤 영역 밖의 빈 구획으로 둔다. */}
                <div aria-hidden="true" className={dialogBodyEndClassName} />
            </DialogContent>
        </Dialog>
    )
}

export {TechnologyCategoryDialog}
