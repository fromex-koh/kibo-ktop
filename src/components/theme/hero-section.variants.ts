// 히어로 세로 밀도 — 낮은 화면일수록 여백·글자를 줄여 한 화면에 담는다.
//
// 구간은 서로 겹치지 않게 적었다(not-short·not-landscape). 겹치게 두면 어느 쪽이 이길지가
// Tailwind 의 변형 정렬 순서에 달리는데, landscape 가 max-md:short 보다 먼저 출력돼 의도와
// 반대로 적용된다. 조건을 배타적으로 두면 순서와 무관하게 한 구간에는 한 값만 걸린다.
//
//   기본            PC·태블릿 (md 이상, 세로 여유)
//   max-md          모바일 폭
//   short           높이 640px 미만 — 초소형 모바일·낮은 창
//   landscape       높이 480px 미만 — 모바일 가로(폭이 768px 이상인 기기도 포함)
//
// 임계값은 tokens.json 의 breakpoint.md · breakpointHeight 가 단일 소스다. [PB-17]
// 간격 숫자는 JSX 의 p-n 과 같은 단위(1 = 4px) — 옆 px 은 읽는 사람을 위한 환산이다.

export const heroFrameClassName = [
    'h-full min-h-0 py-0',
    'max-md:not-short:pt-[clamp(--spacing(18),12dvh,--spacing(24))] max-md:not-short:pb-28', // 72~96 / 112px
    'max-md:short:not-landscape:pt-17 max-md:short:not-landscape:pb-20', // 68 / 80px
    'landscape:pt-13 landscape:pb-14', // 52 / 56px
].join(' ')

export const heroGridClassName = [
    'gap-y-16', // 64px
    'max-md:not-short:gap-y-[clamp(--spacing(5),4dvh,--spacing(12))]', // 20~48px
    'max-md:short:not-landscape:gap-y-4', // 16px
    'landscape:gap-y-2', // 8px
].join(' ')

export const heroCopyClassName = [
    'gap-6', // 24px
    'max-md:short:not-landscape:gap-3', // 12px
    'landscape:gap-2', // 8px
].join(' ')

// 대표 카피 — 한 컬럼이면 더 줄이고 좌우로 나뉘면 여유를 준다.
// typo-* 는 생성기가 찍는 plain 클래스라 반응형 변형을 못 받는다(SHADCN.md 타이포 유틸 예외).
export const heroTitleClassName = [
    'text-5xl leading-normal', // 48px / 1.5
    'max-lg:not-landscape:text-[clamp(--spacing(8),calc(--spacing(6)+2.1vw),--spacing(11))]', // 32~44px
    'max-md:landscape:text-[clamp(--spacing(5),3.6vw,--spacing(6))]', // 20~24px
    'md:landscape:text-[--spacing(8)]', // 32px
    'max-md:not-short:leading-[1.3] max-md:short:leading-[1.25] md:landscape:leading-[1.3]',
].join(' ')

export const heroDescClassName = [
    'text-xl leading-normal', // 20px / 1.5
    'max-md:not-short:text-base', // 16px
    'max-md:short:not-landscape:text-sm max-md:short:not-landscape:leading-[1.4]', // 14px
    'landscape:text-sm landscape:leading-[1.35]', // 14px
].join(' ')

export const heroScrollIndicatorClassName = [
    'h-28 gap-3', // 112 / 12px
    'max-md:short:not-landscape:h-20', // 80px
    'landscape:h-12 landscape:gap-2', // 48 / 8px
].join(' ')
