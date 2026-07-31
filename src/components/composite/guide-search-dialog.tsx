'use client'

import {useEffect, useMemo, useState, useSyncExternalStore} from 'react'
import Link from 'next/link'
import {ArrowRight, Search} from 'lucide-react'
import type {GuideNavItem, GuideNavItemGroup, GuideNavSection} from '@/constants/guide-nav'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {
    guideSearchBodyClassName,
    guideSearchEmptyClassName,
    guideSearchInputClassName,
    guideSearchInputIconClassName,
    guideSearchInputWrapClassName,
    guideSearchResultCategoryClassName,
    guideSearchResultIconClassName,
    guideSearchResultLinkClassName,
    guideSearchResultListClassName,
    guideSearchResultTitleClassName,
    guideSearchTriggerClassName,
    guideSearchTriggerTextClassName,
} from '@/components/theme/guide-search-dialog.variants'

type GuideSearchItem = GuideNavItem & {
    categories: string[]
    searchText: string
}

type GuideSearchDialogProps = {
    navRootItem?: GuideNavItem
    navSections: readonly GuideNavSection[]
}

const collectGroupItems = (group: GuideNavItemGroup, categories: string[]): GuideSearchItem[] => [
    ...(group.items?.map((item) => createSearchItem(item, [...categories, group.title])) ?? []),
    ...(group.groups?.flatMap((subgroup) => collectGroupItems(subgroup, [...categories, group.title])) ?? []),
]

const createSearchItem = (item: GuideNavItem, categories: string[]): GuideSearchItem => ({
    ...item,
    categories,
    searchText: [...categories, item.label].join(' ').toLocaleLowerCase('ko-KR'),
})

const createSearchItems = (navRootItem: GuideNavItem | undefined, navSections: readonly GuideNavSection[]) => [
    ...(navRootItem ? [createSearchItem(navRootItem, [])] : []),
    ...navSections.flatMap((section) => [
        ...(section.items?.map((item) => createSearchItem(item, [section.title])) ?? []),
        ...(section.groups?.flatMap((group) => collectGroupItems(group, [section.title])) ?? []),
    ]),
]

const subscribeToPlatform = () => () => {}
const getPlatformShortcut = () => (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? '⌘ K' : 'Ctrl K')
const getServerShortcut = () => 'Ctrl K'

const GuideSearchDialog = ({navRootItem, navSections}: GuideSearchDialogProps) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const shortcutLabel = useSyncExternalStore(subscribeToPlatform, getPlatformShortcut, getServerShortcut)
    const searchItems = useMemo(() => createSearchItems(navRootItem, navSections), [navRootItem, navSections])
    const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR')
    const filteredItems = normalizedQuery
        ? searchItems.filter((item) => item.searchText.includes(normalizedQuery))
        : searchItems

    useEffect(() => {
        const openSearch = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase('en-US') === 'k') {
                event.preventDefault()
                setOpen(true)
            }
        }

        document.addEventListener('keydown', openSearch)
        return () => document.removeEventListener('keydown', openSearch)
    }, [])

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) setQuery('')
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={guideSearchTriggerClassName}
                    aria-label="컴포넌트 가이드 검색"
                    aria-keyshortcuts="Meta+K Control+K"
                >
                    <Search aria-hidden="true" className="size-icon-sm shrink-0" />
                    <span className={guideSearchTriggerTextClassName}>컴포넌트 검색</span>
                    <kbd className="typo-caption-regular text-muted-foreground hidden md:block">{shortcutLabel}</kbd>
                </button>
            </DialogTrigger>
            <DialogContent aria-describedby="guide-search-description">
                <DialogHeader>
                    <DialogTitle>컴포넌트 검색</DialogTitle>
                    <DialogDescription id="guide-search-description">
                        컴포넌트 이름이나 분류를 입력하면 해당 가이드로 이동할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <div className={guideSearchBodyClassName}>
                    <div className={guideSearchInputWrapClassName}>
                        <Search aria-hidden="true" className={guideSearchInputIconClassName} />
                        <Input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="예: Button, 폼 요소, Header"
                            aria-label="가이드 검색어"
                            className={guideSearchInputClassName}
                        />
                    </div>

                    {filteredItems.length > 0 ? (
                        <ul
                            aria-label={normalizedQuery ? `"${query}" 검색 결과` : '전체 가이드 목록'}
                            className={guideSearchResultListClassName}
                        >
                            {filteredItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => handleOpenChange(false)}
                                        className={guideSearchResultLinkClassName}
                                        {...(item.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                                    >
                                        <span className="flex min-w-0 flex-1 flex-col">
                                            <span className={guideSearchResultTitleClassName}>{item.label}</span>
                                            {item.categories.length > 0 ? (
                                                <span className={guideSearchResultCategoryClassName}>
                                                    {item.categories.join(' · ')}
                                                </span>
                                            ) : null}
                                        </span>
                                        <ArrowRight aria-hidden="true" className={guideSearchResultIconClassName} />
                                        {item.external ? <span className="sr-only">새 창에서 열림</span> : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p role="status" className={guideSearchEmptyClassName}>
                            일치하는 가이드가 없습니다.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GuideSearchDialog
