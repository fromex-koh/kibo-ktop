import {cva} from 'class-variance-authority'

// 평가모형 비교표(PlatformCompareTable)의 모형 색 스타일 — tone: blue(KTRS-FM) · mint(Tech-Index) · orange(투자모형).
// 모형 색 = model-compare-<tone>(이름 · 점 · 배지 글자 · 신청 링크), 옅은 면 = model-compare-<tone>-surface(머리 칸 · 배지 · 호버).
// 평가모형 카드 토큰(model-card-*)보다 면이 옅다 — 표 칸 위에 넓게 깔리기 때문이다. 사용처: custom/platform-compare-table.tsx.

// 줄 — PC 는 마우스를 올리면 칸(td)이 모형 옅은 면 55% 로 물든다(0.15초). 1280 미만은 카드 테두리가 모형 색 35%.
export const platformCompareRowVariants = cva('xl:[&>td]:transition-colors xl:[&>td]:duration-150', {
    variants: {
        tone: {
            blue: 'xl:hover:[&>td]:bg-model-compare-blue-surface/55 max-xl:border-model-compare-blue/35',
            mint: 'xl:hover:[&>td]:bg-model-compare-mint-surface/55 max-xl:border-model-compare-mint/35',
            orange: 'xl:hover:[&>td]:bg-model-compare-orange-surface/55 max-xl:border-model-compare-orange/35',
        },
    },
})

// 모형 머리 칸 — 모형 옅은 면.
export const platformCompareHeadVariants = cva('', {
    variants: {
        tone: {
            blue: 'bg-model-compare-blue-surface',
            mint: 'bg-model-compare-mint-surface',
            orange: 'bg-model-compare-orange-surface',
        },
    },
})

// 모형 이름 · 목록 점 — 모형 색.
export const platformCompareNameVariants = cva('whitespace-nowrap', {
    variants: {
        tone: {
            blue: 'text-model-compare-blue',
            mint: 'text-model-compare-mint',
            orange: 'text-model-compare-orange',
        },
    },
})

export const platformCompareDotVariants = cva("before:font-bold before:content-['·']", {
    variants: {
        tone: {
            blue: 'before:text-model-compare-blue',
            mint: 'before:text-model-compare-mint',
            orange: 'before:text-model-compare-orange',
        },
    },
})

// 제공 유형 배지 — 높이 24 · 둥근 6 · 모형 옅은 면 · 모형 색 글자 · 모형 색 30% 테두리.
export const platformCompareBadgeVariants = cva(
    'typo-body-m-bold inline-flex h-6 items-center rounded-xs border px-2.25',
    {
        variants: {
            tone: {
                blue: 'bg-model-compare-blue-surface text-model-compare-blue border-model-compare-blue/30',
                mint: 'bg-model-compare-mint-surface text-model-compare-mint border-model-compare-mint/30',
                orange: 'bg-model-compare-orange-surface text-model-compare-orange border-model-compare-orange/30',
            },
        },
    },
)

// 평가 신청 링크 — 카드 면 위 모형 색 테두리 · 글자(14 Bold), 높이 40 이상 · 칸 폭을 채움 · 글이 길면 줄바꿈.
// 마우스를 올리면 모형 옅은 면. 둥근 8 — 시안 10 에 가장 가까운 radius 토큰(rounded-sm).
// PROJECT-STYLE: 버튼 variant 대신 모형 색 외곽선 — 시안이 줄마다 모형 색으로 버튼을 구분한다.
export const platformCompareActionVariants = cva(
    'typo-body-l-bold bg-platform-panel outline-ring focus-visible:outline-ring flex min-h-10 w-full items-center justify-center rounded-sm border px-2 py-1.5 text-center break-keep transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
    {
        variants: {
            tone: {
                blue: 'border-model-compare-blue text-model-compare-blue hover:bg-model-compare-blue-surface',
                mint: 'border-model-compare-mint text-model-compare-mint hover:bg-model-compare-mint-surface',
                orange: 'border-model-compare-orange text-model-compare-orange hover:bg-model-compare-orange-surface',
            },
        },
    },
)
