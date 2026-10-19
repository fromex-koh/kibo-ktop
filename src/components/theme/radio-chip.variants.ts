// 라디오 칩(RadioChip) 스타일. 사용법은 composite/radio-chip.tsx · /component-guide/radio-chip 참고.
//
// 상태별 모양
//   미선택          테두리 subtle-3 · 면 surface · 제목 label-foreground(Regular) · 설명 foreground-subtle
//   선택 · hover    테두리 primary · 면 blue-10 · 제목 · 설명 primary-strong(제목 Bold)
//                   hover 를 선택과 같게 두어 고르기 전에 결과가 보인다(RadioCard 와 같은 규칙).
//   비활성          테두리 disabled-subtle · 면 control-disabled · 글자 disabled · hover 강조 없음(Chip 비활성과 같은 색)
//   선택 · 비활성   비활성 + 테두리 disabled(한 단계 진하게) + 제목 Bold — 색이 같아도 고른 칩이 보인다[5.3.1]
//
// 구현 메모
// - 테두리는 늘 border-2 로 두고 색만 바꾼다. 두께가 바뀌면 칩 크기가 변해 옆 칩이 밀린다.
// - 높이를 고정하지 않는다[ST-004]. 묶음 grid 가 나란한 칩 높이를 맞추고, 내용은 세로 가운데에 놓인다.
// - 제목 굵기가 상태마다 바뀌어 typo-* 대신 text-* · font-* 를 쓴다(typo-* 는 hover · checked 같은 상태 변형을
//   받지 못한다 — SHADCN.md "타이포 유틸 예외"). 행간은 leading-normal(1.5).
// - 미선택 테두리 · 선택 면 색은 같은 화면의 RadioCard 와 맞춘 값이다. 바꿀 때는 RadioCard 도 함께 확인한다.

// 칩 묶음 — md 부터 2열.
const radioChipGroupClassName = 'grid w-full gap-4 md:grid-cols-2'

// 칩 = 라디오 버튼(<button role="radio">). data-checked: = Radix 의 data-state="checked",
// disabled: = 칩 또는 묶음의 disabled.
const radioChipClassName =
    'group border-subtle-3 bg-surface text-label-foreground interactive:hover:border-primary interactive:hover:bg-blue-10 interactive:hover:text-primary-strong data-checked:border-primary data-checked:bg-blue-10 data-checked:text-primary-strong disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:data-checked:border-disabled flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 px-6 py-4 text-center transition-colors outline-none outline-ring focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2'
const radioChipTitleClassName =
    'block text-base leading-normal font-normal text-current group-hover:group-enabled:font-bold group-data-checked:font-bold'
// break-keep — 좁은 폭에서 한글 단어 중간이 끊기지 않게 한다.
const radioChipDescriptionClassName =
    'text-foreground-subtle group-hover:text-current group-data-checked:text-current group-disabled:text-current block text-sm leading-normal break-keep'

export {radioChipGroupClassName, radioChipClassName, radioChipTitleClassName, radioChipDescriptionClassName}
