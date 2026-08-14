'use client'

import {useEffect, useRef, useState, type ComponentProps, type ReactNode} from 'react'
import {ChevronDown, ChevronUp, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible'
import {
    repeatCardActionsClassName,
    repeatCardClassName,
    repeatCardContentClassName,
    repeatCardDeleteClassName,
    repeatCardHeaderClassName,
    repeatCardTitleClassName,
    repeatCardToggleClassName,
    repeatCardToggleClosedOnlyClassName,
    repeatCardToggleOpenOnlyClassName,
} from '@/components/theme/repeat-card.variants'
import {cn} from '@/lib/utils'

// 카드를 더하거나 지우면 바뀐 자리를 눈으로 따라갈 수 있어야 한다. 브라우저 기본 포커스 스크롤은 제목 줄만
// 겨우 걸치게 해서 정작 채워야 할 입력이 화면 밖에 남으므로, 보여 줄 범위를 직접 계산해 한 번만 움직인다.
//
// 범위는 [위 요소의 윗변 ~ 아래 요소의 아랫변] 이다. 칸을 더할 때는 새 카드부터 "행추가" 버튼까지를 함께
// 보여 준다 — 이어서 한 칸 더 더하려면 버튼도 보여야 한다. 한 화면에 다 담기지 않으면 카드 위쪽을
// 우선한다(먼저 채워야 할 칸이 거기 있다).
const SCROLL_MARGIN_PX = 16

const scrollRangeIntoView = (top: Element | null | undefined, bottom?: Element | null) => {
    if (!top) return

    const topRect = top.getBoundingClientRect()
    const bottomRect = (bottom ?? top).getBoundingClientRect()
    // 위로 올릴 양(음수) — 위쪽이 화면 밖으로 잘린 만큼.
    const up = Math.min(0, topRect.top - SCROLL_MARGIN_PX)
    // 내릴 양(양수) — 아래쪽이 화면 밖으로 넘친 만큼. 단 위쪽이 잘리지 않는 선까지만 내린다.
    const down = Math.max(0, bottomRect.bottom + SCROLL_MARGIN_PX - window.innerHeight)
    const room = Math.max(0, topRect.top - SCROLL_MARGIN_PX)
    const delta = up < 0 ? up : Math.min(down, room)
    if (!delta) return

    // 동작을 줄이도록 설정한 사용자에게는 즉시 이동한다([6.3.1] · ScrollToTopButton 과 같은 방식).
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollBy({top: delta, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
}

// 반복 입력 카드(RepeatCard) — "경력1" 처럼 번호가 붙는 입력 묶음 한 장(L2 composite). Figma "경력사항" 반영.
// 머리에 접기/열기와 삭제가 오고, 본문에는 그 묶음의 필드가 들어간다. 경력·인력·특허처럼 같은 모양이
// 여러 화면에서 반복되므로 스타일은 theme/repeat-card.variants.ts 가 갖는다[SC-04].
// 접었다 펴도 입력한 값이 남는다 — 접힌 동안에도 내용을 마운트한 채 감추기만 하기 때문이다.
type RepeatCardProps = {
    // 묶음 제목. 삭제 버튼의 이름("{title} 삭제")에도 쓰인다.
    title: string
    // 처음부터 펼쳐 둘지. 시안은 마지막 칸을 접어 둔다.
    defaultOpen?: boolean
    // 삭제 버튼을 눌렀을 때. 넘기지 않으면 버튼은 그대로 두되 아무 일도 하지 않는다(퍼블리싱 목업).
    onDelete?: () => void
    // 마지막 한 칸처럼 지울 수 없는 상태 — 자리를 지키도록 감추지 않고 비활성으로 둔다.
    deleteDisabled?: boolean
    // 지워도 칸이 사라지지 않고 값만 비워지는 상태(마지막 한 칸). 버튼 이름이 하는 일에 맞게 바뀐다.
    // 카드가 하나도 없는 화면을 만들지 않으면서, 사용자가 "이 칸은 안 쓴다" 로 되돌아갈 수 있게 한다.
    clearOnly?: boolean
    // 제목의 헤딩 레벨. 카드 위에 소제목(h3)이 있으면 기본값 4 를 그대로 두고, 폼 카드 제목(h2) 아래에
    // 카드가 바로 오면 3 을 준다 — 레벨을 건너뛰면 스크린리더의 제목 목록에서 한 단계가 비어 보인다[6.4.2].
    headingLevel?: 3 | 4
    // 방금 추가된 칸 — 눌렀던 "행추가" 버튼이 아니라 새로 생긴 칸으로 포커스를 옮긴다[6.1.2].
    // (DOM 의 autoFocus 가 아니라 이 컴포넌트가 마운트 직후 한 번 제목에 포커스를 준다.)
    focusOnMount?: boolean
    children: ReactNode
} & Omit<ComponentProps<typeof Collapsible>, 'children' | 'title' | 'defaultOpen'>

const RepeatCard = ({
    title,
    defaultOpen = true,
    onDelete,
    deleteDisabled,
    clearOnly,
    headingLevel = 4,
    focusOnMount,
    className,
    children,
    ...props
}: RepeatCardProps) => {
    const titleRef = useRef<HTMLHeadingElement>(null)
    const Heading = headingLevel === 3 ? 'h3' : 'h4'

    useEffect(() => {
        if (!focusOnMount) return

        // 스크롤은 목록 전체를 아는 useRepeatCards 가 맡는다 — "행추가" 버튼 자리까지 알아야 하기 때문이다.
        titleRef.current?.focus({preventScroll: true})
        // 추가된 직후 한 번만 — 이후 다시 그려질 때 포커스를 빼앗지 않는다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Collapsible
            data-slot="repeat-card"
            defaultOpen={defaultOpen}
            className={cn(repeatCardClassName, className)}
            {...props}
        >
            <div className={repeatCardHeaderClassName}>
                {/* 칸을 지웠을 때 사용처가 이웃 칸으로 포커스를 옮길 수 있도록 표식과 tabIndex 를 둔다. */}
                <Heading
                    ref={titleRef}
                    data-slot="repeat-card-title"
                    tabIndex={-1}
                    className={repeatCardTitleClassName}
                >
                    {title}
                </Heading>
                <div className={repeatCardActionsClassName}>
                    <CollapsibleTrigger className={repeatCardToggleClassName}>
                        <span className={repeatCardToggleOpenOnlyClassName}>접기</span>
                        <span className={repeatCardToggleClosedOnlyClassName}>열기</span>
                        <ChevronUp
                            aria-hidden="true"
                            className={cn('size-icon-sm', repeatCardToggleOpenOnlyClassName)}
                        />
                        <ChevronDown
                            aria-hidden="true"
                            className={cn('size-icon-sm', repeatCardToggleClosedOnlyClassName)}
                        />
                        {/* 여러 칸이 같은 "접기/열기" 문구를 쓰므로 어느 묶음인지 이름에 붙인다[6.4.3]. */}
                        <span className="sr-only">{title}</span>
                    </CollapsibleTrigger>
                    <Button
                        type="button"
                        variant="tertiary"
                        size="icon-xs"
                        aria-label={clearOnly ? `${title} 입력 내용 비우기` : `${title} 삭제`}
                        className={repeatCardDeleteClassName}
                        disabled={deleteDisabled}
                        onClick={onDelete}
                    >
                        <X aria-hidden="true" />
                    </Button>
                </div>
            </div>
            <CollapsibleContent forceMount className={repeatCardContentClassName}>
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}

// 반복 카드 목록 상태 — 추가·삭제·최소 개수·포커스 이동을 한 벌로 묶는다.
// 값의 키는 화면 번호가 아니라 여기서 주는 고유 번호로 만든다 — 가운데 칸을 지워도 아래 칸의 값이
// 위로 밀려 올라가지 않는다. 보이는 번호(경력1·구분1…)는 사용처가 순서대로 다시 매긴다.
const useRepeatCards = ({
    initialCount = 1,
    minCount = 1,
    maxCount = Number.POSITIVE_INFINITY,
    onRemove,
}: {
    initialCount?: number
    minCount?: number
    // 넣을 수 있는 최대 칸 수 — 다 채우면 "행추가" 를 비활성으로 둔다. 기본은 제한 없음.
    maxCount?: number
    // 칸을 지울 때 함께 정리할 것 — 보통 그 칸의 입력값을 버린다.
    onRemove?: (id: number, isLastCard: boolean) => void
} = {}) => {
    const [ids, setIds] = useState<readonly number[]>(() => Array.from({length: initialCount}, (_, index) => index + 1))
    // 방금 추가한 칸 — 그 칸으로 포커스를 넘기는 데만 쓴다.
    const [addedId, setAddedId] = useState<number | null>(null)
    const nextIdRef = useRef(initialCount + 1)
    const addButtonRef = useRef<HTMLButtonElement>(null)
    const cardRefs = useRef(new Map<number, HTMLDivElement | null>())
    const pendingFocusId = useRef<number | null>(null)
    const pendingAddedId = useRef<number | null>(null)

    // 화면이 다시 그려진 다음(커밋 후)에 옮긴다 — 그래야 새 칸이 이미 그려져 있고, 지운 경우에는 이웃 칸이
    // 지운 자리로 올라와 있어 필요 없는 스크롤이 생기지 않는다.
    useEffect(() => {
        const addedId = pendingAddedId.current
        if (addedId !== null) {
            pendingAddedId.current = null
            // 더한 칸은 "행추가" 버튼까지 함께 보여 준다(포커스는 RepeatCard 가 새 칸 제목으로 옮긴다).
            scrollRangeIntoView(cardRefs.current.get(addedId), addButtonRef.current)

            return
        }

        const id = pendingFocusId.current
        if (id === null) return

        pendingFocusId.current = null
        const card = cardRefs.current.get(id)
        const title = card?.querySelector<HTMLElement>('[data-slot="repeat-card-title"]')
        if (!title) {
            addButtonRef.current?.focus()

            return
        }

        // 지울 때는 이웃 칸만 보이면 된다 — 버튼까지 맞추면 목록 가운데를 지웠을 때 화면이 크게 움직인다.
        scrollRangeIntoView(card)
        title.focus({preventScroll: true})
    })

    const addCard = () => {
        if (ids.length >= maxCount) return

        const id = nextIdRef.current
        nextIdRef.current += 1
        pendingAddedId.current = id
        setIds((previous) => [...previous, id])
        setAddedId(id)
    }

    const removeCard = (id: number) => {
        // 마지막 한 칸은 없애지 않고 값만 비운다 — 지울 칸이 없어서 처음 상태로 못 돌아가는 일을 막는다.
        // (DatePicker·Select 는 한 번 고르면 스스로 플레이스홀더로 돌아갈 수단이 없다.)
        if (ids.length <= minCount) {
            onRemove?.(id, true)

            return
        }

        // 누른 버튼이 사라지므로 그 자리를 대신할 칸(아래 칸, 없으면 위 칸)으로 포커스를 옮긴다[6.1.2].
        const index = ids.indexOf(id)
        pendingFocusId.current = ids[index + 1] ?? ids[index - 1] ?? null

        setIds((previous) => previous.filter((currentId) => currentId !== id))
        cardRefs.current.delete(id)
        onRemove?.(id, false)
    }

    const setCardRef = (id: number) => (node: HTMLDivElement | null) => {
        cardRefs.current.set(id, node)
    }

    return {
        ids,
        addedId,
        addCard,
        removeCard,
        setCardRef,
        addButtonRef,
        // 마지막 한 칸은 지울 수 없다 — 삭제 버튼을 감추지 않고 비활성으로 둔다.
        isDeleteDisabled: ids.length <= minCount,
        // 마지막 한 칸 — 비활성 대신 "값 비우기" 로 쓰려는 화면이 RepeatCard 의 clearOnly 에 그대로 넘긴다.
        isLastCard: ids.length <= minCount,
        // 최대 칸 수를 채우면 "행추가" 도 같은 방식으로 비활성이다.
        isAddDisabled: ids.length >= maxCount,
    }
}

export {RepeatCard, useRepeatCards}
export type {RepeatCardProps}
