import {cn} from '@/lib/utils'

// 리스트 마커 — 리스트 항목 앞에 붙는 표식(웹 표준 ::marker 에 대응). Figma "list_atomic_bullet" 반영.
// unordered(점·대시) 와 ordered(번호·문자)를 level(1·2) 로 나눈다:
//   · unordered level 1 = 점(•)      · unordered level 2 = 대시(–)
//   · ordered   level 1 = 숫자(1.)   · ordered   level 2 = 문자(a.)
// 순수 시각 표식이라 항상 장식용(aria-hidden)이다 — 목록 구조/순서의 의미는 감싸는 <ul>/<ol> 이나
// 본문 텍스트가 전달한다(icon.tsx 와 같은 원칙). 본문 텍스트(body-xl, 16px·행간 24px) 옆에 오도록
// 24px 높이 칸에 글리프를 세로 중앙 정렬한다. 색은 마커=foreground-subtle, 순번=label-foreground(Figma).
// 간격: Figma 마커 인스턴스는 글리프를 왼쪽에 붙이고 그 뒤 여백까지 자기 폭에 포함한다
// (unordered 12px 칸, ordered 는 순번 글자 + 8px). 본문은 마커 칸 오른쪽에서 바로 시작하므로
// 사용처의 행(li)에는 gap 을 주지 않는다 — 주면 시안보다 들여쓰기가 그만큼 넓어진다.

type ListMarkerType = 'unordered' | 'unordered-small' | 'ordered'
type ListMarkerLevel = 1 | 2

type ListMarkerTypography = 'body' | 'inherit'

type ListMarkerProps = {
    type?: ListMarkerType
    level?: ListMarkerLevel
    // ordered 일 때의 순번(1부터). level 1 은 숫자("3."), level 2 는 문자("c.")로 표기한다. unordered 는 무시.
    index?: number
    // ordered 순번의 글자 사양. 기본 'body' 는 본문(body-xl·regular) 옆에 놓일 때고,
    // 'inherit' 은 감싼 문장의 글자를 그대로 따른다 — 제목처럼 본문이 아닌 줄의 순번에 쓴다
    // (같은 요소에 typo-* 를 두 개 겹치면 어느 쪽이 이길지 알 수 없다[PB-08]). unordered 는 무시.
    typography?: ListMarkerTypography
    className?: string
}

// 순번(1부터) → 소문자 문자(a·b·c…). 26 을 넘으면 그대로 순번 숫자로 폴백한다.
const ALPHABET_START = 96 // 'a' 직전(97='a')
const ALPHABET_SIZE = 26
const toAlpha = (index: number): string =>
    index >= 1 && index <= ALPHABET_SIZE ? String.fromCharCode(ALPHABET_START + index) : String(index)

const ListMarker = ({type = 'unordered', level = 1, index = 1, typography = 'body', className}: ListMarkerProps) => {
    // 24px(본문 행간) 높이 칸 — 글리프를 세로 중앙에 두어 옆 본문과 정렬한다.
    const box = 'inline-flex h-6 shrink-0 items-center select-none'

    if (type === 'ordered') {
        const label = level === 1 ? `${index}.` : `${toAlpha(index)}.`
        // 순번 글자 뒤 8px 여백까지 마커가 가진다(Figma 마커 폭 = 글자 폭 + 8).
        // inherit 이면 글자 사양(크기·굵기·색)을 감싼 문장에서 받는다 — 칸 높이만 유지한다.
        return (
            <span
                aria-hidden="true"
                className={cn(
                    box,
                    typography === 'body' && 'typo-body-xl-regular text-label-foreground',
                    'pr-2',
                    className,
                )}
            >
                {label}
            </span>
        )
    }

    // unordered-small — 작은 본문(13px·행간 20) 옆에 놓이는 점. 칸 높이 20, 점 3×3(Figma
    // list_atomic_bullet 의 type=unordered_small). 폭은 일반 점과 같은 12px 라 들여쓰기가 어긋나지 않는다.
    if (type === 'unordered-small') {
        return (
            <span aria-hidden="true" className={cn('inline-flex h-5 w-3 shrink-0 items-center select-none', className)}>
                <span className="bg-foreground-subtle size-list-dot-sm rounded-full" />
            </span>
        )
    }

    // unordered — 12px 칸의 왼쪽에 글리프를 붙이고, 남는 폭이 본문과의 간격이 된다(Figma 마커 폭 12px).
    return (
        <span aria-hidden="true" className={cn(box, 'w-3', className)}>
            {level === 1 ? (
                <span className="bg-foreground-subtle size-1 rounded-full" /> // 점 4×4
            ) : (
                // 대시 6×1.5 — 시안은 모서리를 굴리지 않은 직사각형이다.
                <span className="bg-foreground-subtle h-list-dash-h w-1.5" />
            )}
        </span>
    )
}

export {ListMarker}
export type {ListMarkerProps, ListMarkerType, ListMarkerLevel, ListMarkerTypography}
