// 라디오 칩(RadioChip) 스타일 — Figma "[일괄평가] Tech-Index 선택"의 "진행할 업무 선택" 칩(chip_single).
// 제목과 설명을 가운데 정렬로 담은 낮은 상자다. hover 와 선택이 같은 강조다 — 파란 테두리 + 옅은 파란 면 +
// 파란 글자(제목 Bold). 올려 본 모습이 곧 고른 모습이라 무엇이 바뀔지 미리 보인다(RadioCard 와 같은 규칙).
//
// 색: 테두리 rest = subtle-3(gray.100 #e6e8ea) → hover·선택 primary(blue.500 #3f7deb), 선택 면 blue-10 —
// 시안의 rest 테두리는 control(gray.200 #b7bbbf)이고 선택 면도 흰색이지만, 같은 화면 위 평가모형 카드
// (RadioCard)와 hover·선택 상태가 같은 색으로 읽히도록 맞춘 프로젝트 결정이다.
// 배경 = surface(컨트롤 표면), 제목 rest = label-foreground(gray.700 #32363b),
// 설명 rest = foreground-subtle(gray.500 #585e65), 선택 시 제목·설명 모두 primary-strong(blue.600 #3568d6)이고
// 제목은 Bold 가 된다. 작은 칩(composite/chip)의 선택 상태와 같은 색 규칙이다.
// 간격(Figma): px-6/py-4, 제목↔설명 gap-1.
//
// PROJECT-STYLE: 상자 높이(시안 102)를 고정값으로 잠그지 않는다([ST-004]). 묶음의 grid 가 나란한 칩을 같은
// 높이로 늘리고 내용은 세로 가운데 정렬이라, 설명이 두 줄인 칩이 높이를 정해 시안과 같아진다.
// PROJECT-STYLE: 선택 시 제목 굵기가 바뀌는데 typo-* 는 생성기가 찍는 plain 클래스라 상태 변형을 받지
// 못한다. 그래서 작은 칩(chip.variants.ts)과 같이 theme 레이어에서 text-*/font-* 로 적는다
// (SHADCN.md "타이포 유틸 예외"). 행간은 시안(16/24 · 14/21)과 같은 1.5 배수라 leading-normal 을 붙인다.
// PROJECT-STYLE: 테두리는 항상 border-2 로 두께를 고정하고 색만 전환한다 — 고를 때 두께가 바뀌면
// 칩이 커지며 옆 칩까지 밀린다(RadioCard·OptionCard 와 같은 이유).

// 칩 묶음 — md 부터 2단. 글만 들어가는 낮은 상자라 카드(xl)보다 일찍 나눠도 글이 접히지 않는다.
const radioChipGroupClassName = 'grid w-full gap-4 md:grid-cols-2'

// 칩 = 라디오 버튼 자체다. 고른 상태는 Radix 가 data-state=checked 로 주고, 프로젝트에 등록된
// data-checked 변형(shadcn/tailwind.css)이 그 선택자를 가리킨다.
const radioChipClassName =
    'group border-subtle-3 bg-surface text-label-foreground interactive:hover:border-primary interactive:hover:bg-blue-10 interactive:hover:text-primary-strong data-checked:border-primary data-checked:bg-blue-10 data-checked:text-primary-strong flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 px-6 py-4 text-center transition-colors outline-none outline-ring focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2'
const radioChipTitleClassName =
    'block text-base leading-normal font-normal text-current group-hover:font-bold group-data-checked:font-bold'
// break-keep — 한국어 문장이 좁은 폭에서 단어 중간("신청/합니다")에서 쪼개지지 않게 한다.
const radioChipDescriptionClassName =
    'text-foreground-subtle group-hover:text-current group-data-checked:text-current block text-sm leading-normal break-keep'

export {radioChipGroupClassName, radioChipClassName, radioChipTitleClassName, radioChipDescriptionClassName}
