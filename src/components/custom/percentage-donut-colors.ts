// 기업 보유기술 도넛(PercentageDonutChart)의 조각 색 단계 — 항목 수(2~8)에 따라 쓰는 색이 정해져 있다.
// 비중이 큰 항목부터 진한 색을 받는다(첫 항목 = 가장 진한 색 · 12시 오른쪽 조각). 'use client' 없는 순수 파일이라
// 목업 · 서버 컴포넌트 어디서나 쓴다.
// [프론트엔드 연동 · 정렬] API 항목을 비중 내림차순으로 정렬한 뒤 donutColorsFor(항목 수)[index] 를 color 로 넣는다
// (매출 규모별 도넛만 예외 — 매출 규모 순).

const DONUT_MIN_ITEMS = 2
const DONUT_MAX_ITEMS = 8

// 항목 수별 색 단계(진한 순). 쓰는 색: navy.800 · navy.500 · blue.700 · blue.500 · blue.400 · blue.300 · blue.200 · blue.50.
// 고정 색(--raw-*)이라 다크에서도 라이트와 같은 색이다.
const DONUT_COLOR_RAMPS: Record<number, readonly string[]> = {
    2: ['var(--raw-navy-500)', 'var(--raw-blue-500)'],
    3: ['var(--raw-navy-500)', 'var(--raw-blue-500)', 'var(--raw-blue-300)'],
    4: ['var(--raw-navy-500)', 'var(--raw-blue-500)', 'var(--raw-blue-400)', 'var(--raw-blue-300)'],
    5: [
        'var(--raw-navy-500)',
        'var(--raw-blue-700)',
        'var(--raw-blue-500)',
        'var(--raw-blue-400)',
        'var(--raw-blue-300)',
    ],
    6: [
        'var(--raw-navy-800)',
        'var(--raw-navy-500)',
        'var(--raw-blue-700)',
        'var(--raw-blue-400)',
        'var(--raw-blue-300)',
        'var(--raw-blue-200)',
    ],
    7: [
        'var(--raw-navy-800)',
        'var(--raw-navy-500)',
        'var(--raw-blue-700)',
        'var(--raw-blue-500)',
        'var(--raw-blue-400)',
        'var(--raw-blue-300)',
        'var(--raw-blue-200)',
    ],
    8: [
        'var(--raw-navy-800)',
        'var(--raw-navy-500)',
        'var(--raw-blue-700)',
        'var(--raw-blue-500)',
        'var(--raw-blue-400)',
        'var(--raw-blue-300)',
        'var(--raw-blue-200)',
        'var(--raw-blue-50)',
    ],
}

// 항목 수에 맞는 색 단계. 2 미만은 2단계, 8 초과는 8단계를 돌려준다 — 9번째 항목부터는 색이 없으므로(undefined)
// 항목은 8개까지만 넘긴다.
const donutColorsFor = (count: number): readonly string[] => {
    const key = Math.min(DONUT_MAX_ITEMS, Math.max(DONUT_MIN_ITEMS, count))
    return DONUT_COLOR_RAMPS[key]
}

export {DONUT_COLOR_RAMPS, DONUT_MAX_ITEMS, DONUT_MIN_ITEMS, donutColorsFor}
