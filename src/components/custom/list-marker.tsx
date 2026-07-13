import {cn} from '@/lib/utils'

// 리스트 마커 — 리스트 항목 앞에 붙는 표식(웹 표준 ::marker 에 대응). Figma "list_atomic_bullet" 반영.
// unordered(점·대시) 와 ordered(번호·문자)를 level(1·2) 로 나눈다:
//   · unordered level 1 = 점(•)      · unordered level 2 = 대시(–)
//   · ordered   level 1 = 숫자(1.)   · ordered   level 2 = 문자(a.)
// 순수 시각 표식이라 항상 장식용(aria-hidden)이다 — 목록 구조/순서의 의미는 감싸는 <ul>/<ol> 이나
// 본문 텍스트가 전달한다(icon.tsx 와 같은 원칙). 본문 텍스트(body-xl, 16px·행간 24px) 옆에 오도록
// 24px 높이 칸에 글리프를 세로 중앙 정렬한다. 색은 마커=foreground-subtle, 순번=label-foreground(Figma).

type ListMarkerType = 'unordered' | 'ordered'
type ListMarkerLevel = 1 | 2

type ListMarkerProps = {
    type?: ListMarkerType
    level?: ListMarkerLevel
    // ordered 일 때의 순번(1부터). level 1 은 숫자("3."), level 2 는 문자("c.")로 표기한다. unordered 는 무시.
    index?: number
    className?: string
}

// 순번(1부터) → 소문자 문자(a·b·c…). 26 을 넘으면 그대로 순번 숫자로 폴백한다.
const ALPHABET_START = 96 // 'a' 직전(97='a')
const ALPHABET_SIZE = 26
const toAlpha = (index: number): string =>
    index >= 1 && index <= ALPHABET_SIZE ? String.fromCharCode(ALPHABET_START + index) : String(index)

const ListMarker = ({type = 'unordered', level = 1, index = 1, className}: ListMarkerProps) => {
    // 24px(본문 행간) 높이 칸 — 글리프를 세로 중앙에 두어 옆 본문과 정렬한다.
    const box = 'inline-flex h-6 shrink-0 items-center select-none'

    if (type === 'ordered') {
        const label = level === 1 ? `${index}.` : `${toAlpha(index)}.`
        return (
            <span aria-hidden="true" className={cn(box, 'typo-body-xl-regular text-label-foreground', className)}>
                {label}
            </span>
        )
    }

    // unordered — 12px 칸(Figma 마커 폭)에 글리프를 가운데 두어 뒤따르는 본문과 간격을 만든다.
    return (
        <span aria-hidden="true" className={cn(box, 'w-3 justify-center', className)}>
            {level === 1 ? (
                <span className="bg-foreground-subtle size-1 rounded-full" /> // 점 4×4
            ) : (
                <span className="bg-foreground-subtle h-0.5 w-1.5 rounded-full" /> // 대시 6×2
            )}
        </span>
    )
}

export {ListMarker}
export type {ListMarkerProps, ListMarkerType, ListMarkerLevel}
