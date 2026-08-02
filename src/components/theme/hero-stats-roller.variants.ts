// 지표 롤러 — 5개 행 + 복제 행 1개를 한 칸씩 위로 민다. 트랙 높이가 노출 행 수를 정한다(120%=5행, 300%=2행).
//
// 세로 구간은 히어로 밀도와 같은 규칙으로 서로 겹치지 않게 적는다. [theme/hero-section.variants.ts]
// 이동 중 크기 전환은 조상 상태(트랙의 data-rolling)와 형제 순서(행의 위치)를 같이 봐야 해
// group/track · group/row 두 그룹을 쓴다 — 첫 행은 기본 크기로 줄고 다음 행이 커져 교체 때 튀지 않는다.

export const heroStatsViewportClassName = [
    // 54vh 인 이유 — 히어로가 헤더 아래 유동 여백만큼 내려간 뒤 남는 높이 안에 들어가야 한다.
    // 페이저 최소 높이(640)에서 346px 이 되어 SCROLL 표시 위로 여유가 남고, 1080 이상에서는 상한
    // (544)이 걸려 시안 크기 그대로다. 한 행은 이 높이의 1/5 이라 346 에서도 69px 로,
    // 행 내용(50px)이 들어간다.
    'mt-2.5 h-[clamp(--spacing(86),54vh,--spacing(136))] overflow-hidden', // 10px / 344~544px
    'max-md:not-short:h-[clamp(--spacing(32),21dvh,--spacing(46))]', // 128~184px
    'max-md:short:not-landscape:h-[clamp(--spacing(28),22dvh,--spacing(32))]', // 112~128px
    'landscape:mt-0 landscape:h-[clamp(--spacing(26),31dvh,--spacing(29))]', // 104~116px
].join(' ')

export const heroStatsTrackClassName = [
    'group/track h-[120%] translate-y-0',
    'max-md:h-[300%] landscape:h-[300%]',
    'data-[rolling=true]:ease-roll data-[rolling=true]:-translate-y-1/6 data-[rolling=true]:transition-[translate] data-[rolling=true]:duration-700',
    'motion-reduce:transition-none motion-reduce:data-[rolling=true]:translate-y-0',
].join(' ')

export const heroStatRowClassName = 'group/row h-1/6 max-md:gap-y-2'

// 높이 고정 — 롤링 중 보조 문구와의 간격이 흔들리지 않게.
// typo-title-xl-medium 을 쓰지 않고 풀어 쓴 이유 — 이 줄만 행간이 1이어야 하는데 typo-* 는 생성 순서상
// leading-* 보다 뒤에 나와 행간을 되돌린다. 크기·굵기·자간 값은 title-xl-medium 과 같다.
export const heroStatTitleClassName =
    'h-(--raw-font-size-h1) shrink-0 text-(length:--raw-font-size-title-xl) leading-none font-medium tracking-normal'

export const heroStatValueClassName = [
    'text-foreground text-(length:--raw-font-size-title-xl) leading-none font-medium tracking-normal whitespace-nowrap tabular-nums',
    'ease-roll transition-[color,font-size,font-weight] duration-700',
    'data-[active=true]:text-main-accent-bright data-[active=true]:text-(length:--raw-font-size-h1) data-[active=true]:font-bold',
    'group-data-[rolling=true]/track:group-first/row:text-foreground group-data-[rolling=true]/track:group-first/row:text-(length:--raw-font-size-title-xl) group-data-[rolling=true]/track:group-first/row:font-medium',
    'group-data-[rolling=true]/track:group-[&:nth-child(2)]/row:text-main-accent-bright group-data-[rolling=true]/track:group-[&:nth-child(2)]/row:text-(length:--raw-font-size-h1) group-data-[rolling=true]/track:group-[&:nth-child(2)]/row:font-bold',
].join(' ')
