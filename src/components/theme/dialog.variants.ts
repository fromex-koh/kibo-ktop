import {cn} from '@/lib/utils'
import {buttonVariants} from '@/components/theme/button.variants'

export const dialogOverlayClassName =
    'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 bg-overlay-xl fixed inset-0 isolate z-modal duration-100'
// 모달은 머리(제목+닫기) · 본문 · CTA 세 구획이다. grid-rows 로 그 세 행을 고정하고 가운데 행만
// minmax(0,1fr) 로 둔다 — 카드가 화면보다 짧으면 1fr 이 max-content 로 풀려 자기 높이 그대로 나오고,
// 화면이 더 낮아 max-h 에 걸리면 가운데 행만 줄어 머리와 CTA 는 제자리에 남는다(본문만 스크롤).
// 제목과 본문은 row-start 로 직접 배치하고 CTA 는 자동 배치에 맡긴다. overflow-clip 은 줄어든
// 가운데 행의 내용이 카드 밖으로 비어져 나오지 않게 한다.
//
// hidden 이 아니라 clip 인 이유 — overflow:hidden 은 화면에 스크롤바가 없을 뿐 스크롤 컨테이너다.
// 그래서 카드 안에서 포커스가 옮겨 가거나 scrollIntoView 가 불리면 브라우저가 카드까지 굴려, 제목이
// 위로 잘리고 CTA 아래에 그만큼 빈 자리가 생긴다. clip 은 스크롤 컨테이너를 만들지 않으므로 그런 일이
// 없고, 스크롤은 본문 구획에서만 일어난다(잘라내는 효과와 라운드 처리는 hidden 과 같다).
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
    'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed inset-x-4 top-1/2 z-modal grid max-h-modal-max-h w-auto -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-clip rounded-2xl p-0 text-base duration-100 outline-none sm:left-1/2 sm:w-full sm:max-w-modal sm:-translate-x-1/2'
// 머리 구획 — 제목이 사는 첫 행이자 자기 여백(모바일 위·좌우 24, sm 이상 40 · 아래 20)의 주인.
// 닫기(X)는 셸이 Content 직속으로 렌더하므로 이 상자 안에 들어오지 못한다. 같은 행·같은 칸에 겹쳐
// 두고 오른쪽 끝으로 밀어 배치한다(dialogCloseClassName).
export const dialogHeaderClassName = 'col-start-1 row-start-1 flex flex-col gap-6 px-6 pt-6 pb-5 sm:px-10 sm:pt-10'
// CTA 구획 — 버튼이 본문 폭을 나눠 채운다(둘이면 246+246·간격 16, 하나면 508 전체).
// 자기 여백(위 20 · 모바일 좌우 24, sm 이상 40 · 아래 24)을 갖는다. 위 20 가 본문과의 간격이고, 스크롤 영역 바깥이라
// 본문이 이 여백 아래로 들어가며 잘린다. 모바일에서는 세로로 쌓고 주 동작을 위에 둔다.
// 행은 지정하지 않는다 — 제목(row 1)·본문(row 2)이 자리를 잡고 나면 자동 배치가 마지막 행에 놓는다.
// row-start-3 을 박으면 머리가 없는 모달(grid-rows-none)에서도 3행이 생겨 빈 행이 남는다.
// 폭을 나누는 대상은 button 이 아니라 '직속 자식 전체'다 — CTA 가 이동이면 Button asChild 로 <a> 가
// 렌더되는데(예: "나가기"), button 만 노리면 그 링크만 내용 폭으로 남아 두 버튼 폭이 어긋난다.
export const dialogFooterClassName = 'flex flex-col-reverse gap-4 px-6 pt-5 pb-6 sm:flex-row sm:px-10 sm:*:flex-1'

// 본문 구획 — 머리와 CTA 사이의 가운데 행. 화면이 낮아 카드가 max-h 에 걸리면 이 상자만 줄어들고
// 스크롤이 여기 생긴다(머리·CTA 는 고정). min-h-0 이 없으면 grid 행이 줄어도 상자가 따라 줄지 않는다.
// 안쪽 간격(소제목↔본문 등)은 사용처가 flex + gap 으로 정한다 — 케이스마다 16·24 로 다르다.
//
// py-1(4)은 포커스 링 자리다. overflow 컨테이너는 자기 상자 밖을 그려주지 않아서, 맨 위·맨 아래 요소에
// 포커스가 가면 링(outline 2 + offset 2 = 4)이 잘린다. 그만큼 머리의 pb 와 CTA 의 pt 에서 덜어내
// 구획 사이 24 는 그대로 둔다(머리 pb-5 + 본문 py-1 = 24). scroll-py-1 은 브라우저가 탭 이동으로
// 요소를 보이게 스크롤할 때 그 4 를 남기도록 알려준다 — 없으면 요소가 가장자리에 딱 붙어 링이 잘린다.
export const dialogBodyClassName = 'row-start-2 flex min-h-0 flex-col overflow-y-auto scroll-py-1 px-6 py-1 sm:px-10'
// 안내 모달(설명·표·그림만 있는 모달)의 본문 — 아이 요소가 줄어들지 않게 막는다.
// 세로 flex 안에서 아이 요소는 남는 높이에 맞춰 찌그러진다. 표 상자(ui/table 의 overflow-x-auto)나
// 그림처럼 자기 안에서 스크롤될 수 있는 요소가 그렇게 눌리면, 본문 대신 그 안이 스크롤돼 표가 중간에
// 잘리고 아래 여백도 사라진 것처럼 보인다. 줄어들지 않게 두면 본문이 넘쳐 본문 구획이 스크롤된다.
export const dialogInfoBodyClassName = cn(dialogBodyClassName, '*:shrink-0')
// 표가 있는 안내 모달의 본문 — 좁은 화면에서는 표(min-w-125)가 본문보다 넓어져 좌우 스크롤이 필요하다.
// 그 스크롤을 표 상자가 맡으면 가로 막대가 긴 표의 맨 아래에 붙어, 위쪽을 보고 있는 동안에는 좌우로 볼
// 수 있다는 것 자체가 화면에 드러나지 않는다. 그래서 셸(ui/table)이 표 상자에 주는 overflow-x-auto 를
// 여기서만 끄고 본문이 좌우 스크롤을 맡는다 — 막대가 늘 화면 안(세로 막대와 같은 상자)에 보인다.
//
// 스크롤 막대는 스크롤 상자의 가장자리에 그려지므로, 카드 여백을 본문의 padding 으로 주면 막대가 그
// 여백을 지나 카드 끝에 붙는다. 그래서 좌우·아래 여백을 본문 바깥(margin)으로 옮겨 상자 자체를 안쪽으로
// 들여놓는다 — 막대가 여백 안쪽에 생겨 내용과 같은 세로선에서 시작하고 끝난다.
// 좌우 24(sm 40) = mx-5(20)+px-1(4) · sm mx-9(36)+px-1(4). px-1 은 맨 왼쪽·오른쪽 요소의 포커스 링
// (outline 2 + offset 2)이 상자에 잘리지 않게 남기는 자리다(위아래 py-1 과 같은 이유).
// 아래 40 = pb-5(20) + mb-5(20) — 가로 막대가 내용에도 카드 끝에도 붙지 않고 그 사이에 뜬다.
// 이 여백을 본문이 직접 가지므로 표 모달에는 아래 여백 구획(dialogBodyEndClassName)을 두지 않는다.
// 표가 본문보다 넓으면 그 px-1 은 그냥 두면 사라진다(넘친 표가 padding-right 를 밀고 나간다) —
// 표 상자를 w-fit 으로 두면 상자 자체가 넘치는 아이가 되어 오른쪽 여백이 스크롤 끝에 그대로 남는다.
// 표는 여전히 min-w-125(500)이라 폭은 달라지지 않는다.
export const dialogTableBodyClassName = cn(
    dialogInfoBodyClassName,
    'mx-5 mb-5 overflow-x-auto px-1 pb-5 sm:mx-9 sm:px-1 [&_[data-slot=table-container]]:w-fit [&_[data-slot=table-container]]:overflow-visible',
)
// 아래 여백 구획 — CTA 가 없는 안내 모달이 CTA 자리에 두는 빈 자리(시안 카드 아래 여백 40 에서 본문이
// 이미 가진 py-1 의 4 를 뺀 36). 이 여백을 본문의 pb 로 주면 여백까지 함께 스크롤돼, 스크롤 도중에는
// 글이 카드 맨 가장자리에서 뚝 끊긴다. 스크롤 영역 밖에 두면 CTA 가 있는 모달과 똑같이 글이 이 여백
// 아래로 들어가며 잘리고, 가운데 본문만 줄어든다(세 행 그리드의 마지막 행).
export const dialogBodyEndClassName = 'h-9'
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

// 닫기(X) — 시안은 32px 아이콘만 두고 배경·테두리·호버 면이 없다(모바일 오른쪽 여백 24, sm 이상 40).
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
    'col-start-1 row-start-1 mt-6 me-6 h-9 self-start justify-self-end sm:mt-10 sm:me-10',
)
