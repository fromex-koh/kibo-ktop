import {cn} from '@/lib/utils'
import {buttonVariants} from '@/components/theme/button.variants'

export const dialogOverlayClassName =
    'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 bg-overlay-xl fixed inset-0 isolate z-modal duration-100'
// max-h-modal-max-h(= size.modal-max-h, 80dvh) + overflow-y-auto — 시안 주석 "모달 최대 높이 :
// 디바이스 화면 높이 기준 20% 여백". 세로 가운데 정렬이라 위아래 10% 씩 남는다. 내용이 그보다 길면
// 모달이 화면 밖으로 잘리는 대신 안에서 스크롤된다.
// %(max-h-4/5)가 아니라 dvh 인 이유 — % 는 초기 컨테이닝 블록 기준이라 가로 스크롤바가 있으면 화면
// 높이보다 작게 잡히고(500 화면에서 380), 모바일 주소창 개폐에도 흔들린다.
export const dialogContentClassName =
    'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed inset-x-4 top-1/2 z-modal grid max-h-modal-max-h w-auto -translate-y-1/2 gap-6 overflow-y-auto rounded-2xl p-10 pb-6 text-base duration-100 outline-none sm:left-1/2 sm:w-full sm:max-w-modal sm:-translate-x-1/2'
// display:contents — 헤더 상자를 없애 제목·설명이 Content 의 grid 행으로 직접 올라간다. 그래야 닫기(X)를
// 제목과 같은 행에 놓아 세로 중앙 정렬을 grid 가 계산해 준다(absolute 로 띄우지 않아도 된다).
// 제목↔설명 간격 24 는 헤더의 gap 대신 Content 의 gap-6 이 만든다(값은 같다).
// 예외: sr-only 로 감추는 헤더(ui/command.tsx)는 상자가 있어야 숨겨지므로 display 를 되돌린다.
export const dialogHeaderClassName = 'contents [&.sr-only]:block'
// 시안 CTA — 버튼이 본문 폭을 나눠 채운다(둘이면 246+246·간격 16, 하나면 508 전체).
// 본문과의 간격 24 는 Content 의 grid gap 이 만들므로 여기서 pt 를 더하지 않는다.
// 모바일에서는 세로로 쌓고 주 동작을 위에 둔다(flex-col-reverse).
export const dialogFooterClassName = 'flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1'

// 본문만 스크롤하는 모달(약관 등)의 본문 상자 — 시안의 스크롤 높이 440(=max-h-110),
// 스크롤바 자리 12(=pr-3).
//
// 화면이 낮아도 이 높이를 줄이지 않는다. 한때 Content 에 grid-rows-[auto_minmax(0,1fr)_auto] 를 얹어
// 가운데 행만 줄였는데, 화면 높이에 따라 본문 상자가 늘었다 줄었다 하면서 스크롤이 생겼다 사라져
// 예측이 안 됐다. 지금은 모달이 자기 콘텐츠 높이를 그대로 유지하고, 화면이 그보다 낮으면 Content 의
// max-h-modal-max-h + overflow-y-auto 가 제목·본문·CTA 를 한 번에 스크롤한다(스크롤바 하나).
export const dialogScrollBodyClassName = 'flex max-h-110 flex-col gap-6 overflow-y-auto pr-3'
// PROJECT-STYLE: shadcn 원본은 text-lg leading-none font-semibold 이지만,
// 시안 모달 제목은 24px Bold·행간 36 이므로
// typo-h4-bold 를 사용한다.
// row-start-1 은 닫기(X)와 같은 행을 쓰기 위한 것이다 — 둘 다 명시하지 않으면 자동 배치가 서로 다른
// 행으로 밀어낸다(먼저 배치된 X 가 1행을 차지하고 제목이 2행으로 내려간다).
// pe-14 는 X 자리(아이콘 32 + 간격 24)를 비워 둔다 — 같은 셀을 겹쳐 쓰므로 이게 없으면 제목이 길어질 때
// 글자가 X 밑으로 파고든다. 남는 글자 폭 452 는 시안의 제목 텍스트 폭과 같다.
export const dialogTitleClassName = 'typo-h4-bold text-foreground col-start-1 row-start-1 pe-14'
// PROJECT-STYLE: shadcn 원본은 text-muted-foreground text-sm 이지만,
// 시안의 모달 소제목은 20px Bold·본문색(gray.900)이므로
// typo-title-l-bold 와 text-foreground 를 사용한다.
export const dialogDescriptionClassName = 'typo-title-l-bold text-foreground *:[a]:underline *:[a]:underline-offset-3'

// 닫기(X) — 시안은 32px 아이콘만 두고 배경·테두리·호버 면이 없다(모달 우상단, 아이콘 오른쪽 여백 40).
// 배경 없이 상자를 아이콘 크기로 두는 규칙은 Button 의 plain variant 가 공통으로 관리한다.
//
// 시안의 '타이틀' 프레임처럼 제목과 같은 행에 놓는다 — Content 가 grid 이고 헤더가 display:contents 라
// row-start-1 로 제목 행에 들어가고, justify-self-end 가 오른쪽 끝(콘텐츠 여백 40)을 잡는다.
//
// self-start + h-9 는 '제목 첫 줄'에 맞추기 위한 조합이다. h-9(36)는 제목 한 줄의 높이(24px 의 행간)이고,
// 그 상자 안에서 아이콘이 세로 중앙에 놓여 위 42 가 된다. 제목이 두 줄 이상으로 늘어나도 X 는 첫 줄에
// 그대로 남는다 — self-center 로 두면 행 전체(두 줄)의 한가운데로 내려간다.
export const dialogCloseClassName = cn(
    buttonVariants({variant: 'plain', size: 'icon-xl'}),
    'col-start-1 row-start-1 h-9 self-start justify-self-end',
)
