import {cn} from '@/lib/utils'
import {buttonVariants} from '@/components/theme/button.variants'

export const dialogOverlayClassName =
    'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 bg-overlay-xl fixed inset-0 isolate z-modal duration-100'
// 모달은 머리(제목+닫기) · 본문 · CTA 세 구획이다. grid-rows 로 그 세 행을 고정하고 가운데 행만
// minmax(0,1fr) 로 둔다 — 카드가 화면보다 짧으면 1fr 이 max-content 로 풀려 자기 높이 그대로 나오고,
// 화면이 더 낮아 max-h 에 걸리면 가운데 행만 줄어 머리와 CTA 는 제자리에 남는다(본문만 스크롤).
// 제목과 본문은 row-start 로 직접 배치하고 CTA 는 자동 배치에 맡긴다. overflow-hidden 은 줄어든
// 가운데 행의 내용이 카드 밖으로 비어져 나오지 않게 한다.
//
// 여백은 카드가 통째로 갖지 않고 세 구획이 각자 갖는다(p-0 · gap-0). 그래야 본문이 스크롤될 때 글이
// 머리·CTA 의 여백 아래로 들어가며 잘려, 맨 가장자리에서 뚝 끊기지 않는다. 구획 사이 24 도 gap 이
// 아니라 머리의 pb-6 · CTA 의 pt-6 가 만든다 — 그 여백이 스크롤 영역 바깥이라야 같은 효과가 난다.
//
// max-h-modal-max-h(= size.modal-max-h, 80dvh) — 시안 주석 "모달 최대 높이 : 디바이스 화면 높이 기준
// 20% 여백". 세로 가운데 정렬이라 위아래 10% 씩 남는다.
// %(max-h-4/5)가 아니라 dvh 인 이유 — % 는 초기 컨테이닝 블록 기준이라 가로 스크롤바가 있으면 화면
// 높이보다 작게 잡히고(500 화면에서 380), 모바일 주소창 개폐에도 흔들린다.
export const dialogContentClassName =
    'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed inset-x-4 top-1/2 z-modal grid max-h-modal-max-h w-auto -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl p-0 text-base duration-100 outline-none sm:left-1/2 sm:w-full sm:max-w-modal sm:-translate-x-1/2'
// 머리 구획 — 제목이 사는 첫 행이자 자기 여백(위 40 · 좌우 40 · 아래 24)의 주인.
// 닫기(X)는 셸이 Content 직속으로 렌더하므로 이 상자 안에 들어오지 못한다. 같은 행·같은 칸에 겹쳐
// 두고 오른쪽 끝으로 밀어 배치한다(dialogCloseClassName).
export const dialogHeaderClassName = 'col-start-1 row-start-1 flex flex-col gap-6 px-10 pt-10 pb-5'
// CTA 구획 — 버튼이 본문 폭을 나눠 채운다(둘이면 246+246·간격 16, 하나면 508 전체).
// 자기 여백(위 24 · 좌우 40 · 아래 24)을 갖는다. 위 24 가 본문과의 간격이고, 스크롤 영역 바깥이라
// 본문이 이 여백 아래로 들어가며 잘린다. 모바일에서는 세로로 쌓고 주 동작을 위에 둔다.
// 행은 지정하지 않는다 — 제목(row 1)·본문(row 2)이 자리를 잡고 나면 자동 배치가 마지막 행에 놓는다.
// row-start-3 을 박으면 머리가 없는 모달(grid-rows-none)에서도 3행이 생겨 빈 행이 남는다.
export const dialogFooterClassName = 'flex flex-col-reverse gap-4 px-10 pt-5 pb-6 sm:flex-row sm:[&>button]:flex-1'

// 본문 구획 — 머리와 CTA 사이의 가운데 행. 화면이 낮아 카드가 max-h 에 걸리면 이 상자만 줄어들고
// 스크롤이 여기 생긴다(머리·CTA 는 고정). min-h-0 이 없으면 grid 행이 줄어도 상자가 따라 줄지 않는다.
// 안쪽 간격(소제목↔본문 등)은 사용처가 flex + gap 으로 정한다 — 케이스마다 16·24 로 다르다.
//
// py-1(4)은 포커스 링 자리다. overflow 컨테이너는 자기 상자 밖을 그려주지 않아서, 맨 위·맨 아래 요소에
// 포커스가 가면 링(outline 2 + offset 2 = 4)이 잘린다. 그만큼 머리의 pb 와 CTA 의 pt 에서 덜어내
// 구획 사이 24 는 그대로 둔다(머리 pb-5 + 본문 py-1 = 24). scroll-py-1 은 브라우저가 탭 이동으로
// 요소를 보이게 스크롤할 때 그 4 를 남기도록 알려준다 — 없으면 요소가 가장자리에 딱 붙어 링이 잘린다.
export const dialogBodyClassName = 'row-start-2 flex min-h-0 flex-col overflow-y-auto scroll-py-1 px-10 py-1'
// PROJECT-STYLE: shadcn 원본은 text-lg leading-none font-semibold 이지만,
// 시안 모달 제목은 24px Bold·행간 36 이므로
// typo-h4-bold 를 사용한다.
// pe-14 는 X 자리(아이콘 32 + 간격 24)를 비워 둔다 — X 가 머리 구획 위에 겹쳐 놓이므로 이게 없으면
// 제목이 길어질 때 글자가 X 밑으로 파고든다. 남는 글자 폭 452 는 시안의 제목 텍스트 폭과 같다.
export const dialogTitleClassName = 'typo-h4-bold text-foreground pe-14'
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
    buttonVariants({variant: 'plain', size: 'icon-lg'}),
    'col-start-1 row-start-1 mt-10 me-10 h-9 self-start justify-self-end',
)
