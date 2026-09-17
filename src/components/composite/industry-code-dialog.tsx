'use client'

import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react'
import {ChevronRight} from 'lucide-react'
import {ClearableInput} from '@/components/composite/clearable-input'
import {EmptyState} from '@/components/composite/empty-state'
import {LoadingState} from '@/components/composite/loading-state'
import {NoticeAccordion, NoticeAccordionItem} from '@/components/composite/notice-accordion'
import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {
    fetchIndustryCodeGroups,
    fetchIndustrySubCodes,
    INDUSTRY_CODE_GROUP_LIST,
    type IndustryCode,
} from '@/content/service/industry-codes'
import {cn} from '@/lib/utils'

// 업종코드 조회 모달 — 기업정보의 업종코드 [조회] 버튼이 연다.
// Figma "SB-FOTA-CP4-0003_업종코드 조회"(40007524:144439) · "…_내역없음"(40007524:144400) · 모바일(40007524:144619).
//
// 고르는 순서 — 두 단계다.
//   1. 중분류 목록(전체 N건)에서 한 줄을 누르면 그 중분류의 세분류 목록으로 넘어간다.
//   2. 세분류 목록에서 라디오로 하나를 고르고 [선택]을 누르면 onSelect 로 넘기고 닫는다.
//   [이전]은 세분류 단계에서 중분류 목록(앞서 검색한 결과 그대로)으로 돌아간다. 중분류 단계에서는 막혀 있다.
//
// 검색·초기화 — 단계마다 그 단계의 목록을 거른다(중분류명·코드 / 세분류명·코드).
//   [검색]·Enter 는 검색어로 다시 조회하고, [초기화]는 검색 결과에서 그 단계의 처음 목록으로 돌아간다
//   (검색어 칸도 비워 목록과 칸이 어긋나지 않게 한다).
//   응답이 LOADING_DELAY_MS 넘게 걸리면 목록 자리에 로딩 안내를, 결과가 없으면 "검색내역이 없습니다." 를 둔다.
//
// [프론트엔드 연동] 조회는 content/service/industry-codes.ts 의 두 함수 한 곳이다. 지금은 목업이 0.8초 뒤에
// 돌려준다 — 그동안 로딩 안내가 보인다.

const NOTICES = [
    '실제 영위중인 업종이 법인등기부등본, 사업자등록증상의 업종과 상이할 경우 실제 영위중인 업종선택',
    '2개 이상 업종 겸영하는 경우에는 매출액이 큰 업종선택',
    '업종을 전환하는 기업은 현재 실제로 영위중인 업종선택',
]

// 로딩 안내를 띄우기까지 기다리는 시간 — 이보다 빨리 온 응답에는 안내를 보이지 않는다.
const LOADING_DELAY_MS = 300
const KEYWORD_FIELD_ID = 'industry-code-keyword'

type IndustryCodeStep = 'group' | 'sub'

// 단계별 문구 — 검색 칸 안내와 건수 앞 글자.
const STEP_TEXT: Record<IndustryCodeStep, {placeholder: string; countLabel: string}> = {
    group: {placeholder: '중분류명 또는 코드 검색', countLabel: '전체 중분류'},
    sub: {placeholder: '세분류명 또는 코드 검색', countLabel: '세분류'},
}

// 줄 한 칸의 글자 — 이름(16) 위, 코드(14) 아래.
const CodeText = ({code}: {code: IndustryCode}) => (
    <span className="flex min-w-0 flex-1 flex-col">
        <span className="typo-body-xl-regular text-label-foreground break-keep">{code.name}</span>
        <span className="typo-body-l-regular text-foreground-subtle">{code.code}</span>
    </span>
)

// 목록 줄 — 높이 77(위아래 16 + 이름 24 + 코드 21 + 아래 옅은 선).
const codeRowClassName = 'border-subtle-3 flex items-center gap-2 border-b py-4'

type IndustryCodeDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 자체를 확인하는 화면). */
    defaultOpen?: boolean
    /** [선택]을 눌렀을 때 고른 세분류를 넘긴다. 넘기지 않으면 닫히기만 한다. */
    onSelect?: (value: {code: string; name: string; label: string}) => void
}

const IndustryCodeDialog = ({children, defaultOpen, onSelect}: IndustryCodeDialogProps) => {
    const [open, setOpen] = useState(Boolean(defaultOpen))
    const [step, setStep] = useState<IndustryCodeStep>('group')
    const [keyword, setKeyword] = useState('')
    // 중분류 목록 — [이전]으로 돌아왔을 때 앞서 본 목록(검색 결과)을 그대로 보여 주려고 따로 쥔다.
    const [groups, setGroups] = useState<readonly IndustryCode[]>(INDUSTRY_CODE_GROUP_LIST)
    const [groupKeyword, setGroupKeyword] = useState('')
    const [selectedGroup, setSelectedGroup] = useState<IndustryCode | null>(null)
    const [subCodes, setSubCodes] = useState<readonly IndustryCode[]>([])
    const [selectedSub, setSelectedSub] = useState<IndustryCode | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    // 조회 번호 — 앞선 조회의 응답이 늦게 와서 나중 조회의 결과를 덮지 않게, 마지막 조회의 응답만 받는다.
    const requestIdRef = useRef(0)
    // 단계가 바뀌면 건수 줄로 포커스를 옮긴다 — 누른 줄이 사라져 포커스가 body 로 떨어지지 않게 한다.
    const countRef = useRef<HTMLParagraphElement>(null)
    const shouldFocusCountRef = useRef(false)
    // 로딩 안내 자리 — 모바일은 본문이 짧아 [검색] 아래가 화면 밖이라, 안내가 뜨면 본문을 굴려 보이게 한다.
    const loadingRef = useRef<HTMLDivElement>(null)

    const rows = step === 'group' ? groups : subCodes

    useEffect(() => {
        if (isLoading) loadingRef.current?.scrollIntoView({block: 'nearest'})
    }, [isLoading])

    // 단계가 바뀐 뒤 목록(건수 줄)이 나타나면 그 줄로 포커스를 옮긴다 — 로딩 중에는 기다린다.
    useEffect(() => {
        if (!shouldFocusCountRef.current || isLoading || !countRef.current) return
        shouldFocusCountRef.current = false
        countRef.current.focus()
    }, [step, isLoading])

    // 조회를 보내고 응답을 받는다 — 늦으면 로딩 안내를 띄우고, 마지막 조회의 응답만 반영한다.
    const request = async <T,>(fetcher: () => Promise<T>, apply: (result: T) => void) => {
        requestIdRef.current += 1
        const requestId = requestIdRef.current
        const loadingTimer = window.setTimeout(() => setIsLoading(true), LOADING_DELAY_MS)
        try {
            const result = await fetcher()
            if (requestId === requestIdRef.current) apply(result)
        } finally {
            window.clearTimeout(loadingTimer)
            if (requestId === requestIdRef.current) setIsLoading(false)
        }
    }

    const searchGroups = (nextKeyword: string) =>
        request(
            () => fetchIndustryCodeGroups(nextKeyword),
            (result) => {
                setGroups(result)
                setGroupKeyword(nextKeyword)
            },
        )

    const searchSubCodes = (group: IndustryCode, nextKeyword: string) => {
        setSelectedSub(null)
        return request(() => fetchIndustrySubCodes(group.code, nextKeyword), setSubCodes)
    }

    // 중분류 한 줄 — 세분류 단계로 넘어가 그 중분류의 세분류 전체를 부른다.
    const openGroup = (group: IndustryCode) => {
        shouldFocusCountRef.current = true
        setSelectedGroup(group)
        setSubCodes([])
        setKeyword('')
        setStep('sub')
        // 단계가 바뀐 자리는 비어 있으므로 기다리지 않고 바로 로딩 안내를 둔다(빈 상태가 비치지 않게).
        setIsLoading(true)
        void searchSubCodes(group, '')
    }

    // [이전] — 중분류 목록으로 돌아간다. 검색 칸에는 그 목록을 부른 검색어를 되살린다.
    const goBack = () => {
        requestIdRef.current += 1
        setIsLoading(false)
        shouldFocusCountRef.current = true
        setStep('group')
        setKeyword(groupKeyword)
        setSelectedSub(null)
    }

    // 이 모달은 기업정보 입력 폼 안에서도 열린다 — 포털로 그려져도 React 이벤트는 바깥 폼으로 올라가므로,
    // 검색·초기화가 입력 폼의 제출·검사를 부르지 않게 여기서 멈춘다.
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if (step === 'group') void searchGroups(keyword)
        else if (selectedGroup) void searchSubCodes(selectedGroup, keyword)
    }

    const handleReset = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setKeyword('')
        if (step === 'group') void searchGroups('')
        else if (selectedGroup) void searchSubCodes(selectedGroup, '')
    }

    // 닫을 때 처음 상태로 되돌린다 — 다음에 열었을 때 지난 단계·검색·선택이 남아 있으면 혼란스럽다.
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (nextOpen) return

        requestIdRef.current += 1
        setIsLoading(false)
        setStep('group')
        setKeyword('')
        setGroups(INDUSTRY_CODE_GROUP_LIST)
        setGroupKeyword('')
        setSelectedGroup(null)
        setSubCodes([])
        setSelectedSub(null)
    }

    const save = () => {
        if (!selectedSub) return

        onSelect?.({...selectedSub, label: `${selectedSub.code} ${selectedSub.name}`})
        handleOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>업종코드 조회</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogBodyClassName, 'gap-6')}>
                    <NoticeAccordion>
                        {NOTICES.map((notice) => (
                            <NoticeAccordionItem key={notice}>{notice}</NoticeAccordionItem>
                        ))}
                    </NoticeAccordion>

                    {/* 검색 줄 — PC 는 입력 · [초기화] · [검색] 한 줄(간격 8), 모바일은 입력 아래에 두 버튼이 반씩.
                        시안에 라벨이 보이지 않아 감추되 스크린리더에는 남긴다[7.4.1]. */}
                    <form
                        aria-label="업종코드 검색"
                        noValidate
                        onSubmit={handleSearch}
                        onReset={handleReset}
                        className="flex flex-col gap-2 sm:flex-row sm:items-start"
                    >
                        <label htmlFor={KEYWORD_FIELD_ID} className="sr-only">
                            {STEP_TEXT[step].placeholder}어
                        </label>
                        <ClearableInput
                            id={KEYWORD_FIELD_ID}
                            name="industryCodeKeyword"
                            autoComplete="off"
                            placeholder={STEP_TEXT[step].placeholder}
                            value={keyword}
                            onChange={(event) => setKeyword(event.currentTarget.value)}
                            className="h-control-h-md min-w-0 sm:flex-1"
                        />
                        {/* 버튼은 아이콘 없이 글자 폭만큼(90 · 76) — Button md 의 최소 폭을 이 자리에서 푼다. */}
                        <div className="flex gap-2 max-sm:*:flex-1">
                            <Button
                                id="industry-code-reset"
                                type="reset"
                                variant="tertiary"
                                size="md"
                                className="min-w-0"
                            >
                                초기화
                            </Button>
                            <Button id="industry-code-submit" type="submit" size="md" className="min-w-0">
                                검색
                            </Button>
                        </div>
                    </form>

                    {isLoading ? (
                        <div ref={loadingRef}>
                            <LoadingState className="min-h-0 px-0 py-10" />
                        </div>
                    ) : rows.length ? (
                        <div className="flex flex-col gap-4">
                            {/* 건수 — 숫자만 파랗게. 단계가 바뀌면 이 줄로 포커스가 온다. */}
                            <p
                                ref={countRef}
                                tabIndex={-1}
                                aria-live="polite"
                                className="typo-body-xl-regular text-foreground outline-none"
                            >
                                {step === 'sub' && selectedGroup ? (
                                    <span className="sr-only">{selectedGroup.name}의 </span>
                                ) : null}
                                {STEP_TEXT[step].countLabel}{' '}
                                <strong className="typo-body-xl-bold text-primary">{rows.length}</strong>건
                            </p>
                            {/* 목록 상자 — 시안 높이 771(윗선 1 + 줄 77 × 10)에 가깝게 보이고 넘치면 스크롤한다.
                                스크롤 막대(8)는 목록과 4 떨어져 상자 오른쪽 끝에 붙는다(pr-1). */}
                            <div className="max-h-192 overflow-y-auto pr-1">
                                {step === 'group' ? (
                                    <ul className="border-t-foreground-subtle list-none border-t">
                                        {groups.map((group) => (
                                            <li key={group.code}>
                                                {/* 줄 전체가 다음 단계로 가는 버튼이다. */}
                                                <button
                                                    type="button"
                                                    onClick={() => openGroup(group)}
                                                    className={cn(
                                                        codeRowClassName,
                                                        'outline-ring w-full cursor-pointer text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid',
                                                    )}
                                                >
                                                    <CodeText code={group} />
                                                    <ChevronRight
                                                        aria-hidden="true"
                                                        className="text-foreground size-icon-md shrink-0"
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <RadioGroup
                                        aria-label={`${selectedGroup?.name ?? ''} 세분류`}
                                        value={selectedSub?.code ?? ''}
                                        onValueChange={(code) =>
                                            setSelectedSub(subCodes.find((item) => item.code === code) ?? null)
                                        }
                                        className="border-t-foreground-subtle flex flex-col gap-0 border-t"
                                    >
                                        {subCodes.map((item) => (
                                            // label 이라 줄 어디를 눌러도 라디오가 골라진다.
                                            <label
                                                key={item.code}
                                                htmlFor={`industry-sub-code-${item.code}`}
                                                className={cn(
                                                    codeRowClassName,
                                                    'has-[:focus-visible]:outline-ring cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-solid',
                                                )}
                                            >
                                                <RadioGroupItem
                                                    id={`industry-sub-code-${item.code}`}
                                                    value={item.code}
                                                    className="focus-visible:outline-none"
                                                />
                                                <CodeText code={item} />
                                            </label>
                                        ))}
                                    </RadioGroup>
                                )}
                            </div>
                        </div>
                    ) : (
                        // 시안 "…_내역없음" — 목록 자리를 빈 상태가 대신한다.
                        <EmptyState title="검색내역이 없습니다." className="min-h-0 px-0 py-10" />
                    )}
                </div>
                <DialogFooter>
                    {/* [이전] — 세분류 단계에서만 쓸 수 있다. [선택] — 세분류를 골라야 활성된다. */}
                    <Button type="button" variant="tertiary" size="xl" disabled={step === 'group'} onClick={goBack}>
                        이전
                    </Button>
                    <Button type="button" size="xl" disabled={!selectedSub} onClick={save}>
                        선택
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {IndustryCodeDialog}
