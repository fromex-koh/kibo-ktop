import {cva} from 'class-variance-authority'

// PROJECT-STYLE: Figma "탭 타이틀" — 폼 섹션 한 칸을 나타내는 카드형 탭이다(FormTabs 의 한 항목).
// 시안 섹션에 나열된 모든 경우가 [작성 상태 3종 × 선택 여부 2종 × 제목 1~2줄] 조합이라, 그 조합만으로
// 전부 표현되도록 한 벌로 정의한다.
//   · 선택   : 흰 카드(card) · 테두리 없음 · 제목 Bold(foreground) · 좌측 primary 액센트 바(4px)
//   · 비선택 : 옅은 면(surface-subtle) · subtle-3 테두리 · 제목 Medium(label-foreground)
// 여백은 시안 실측대로 위 20 · 좌우 20 · 아래 40 이다. 아래만 넓은 이유는 폼 카드가 탭 아래쪽 32px 을
// 덮고 올라오기 때문이며(FormTabs 의 -mt-8), 제목이 두 줄로 늘어나도 상태 문구가 가려지지 않는다.
// 높이는 고정하지 않는다 — 목록이 items-stretch 라 가장 높은 칸(제목 2줄)에 나머지가 맞춰진다[ST-004].
// 선택 표시는 data-active 변형으로 읽는다 — Radix 가 붙이는 data-state="active" 와 단독 사용 시의
// data-active 를 모두 받으므로(shadcn/tailwind.css) 탭 안팎에서 같은 클래스가 그대로 동작한다.
// 화면 폭에 따라 같은 내용이 세 가지 모양으로 놓인다 — 면·여백·폭만 다르고 안쪽 구성은 같다.
//   · tab : 가로 탭 한 칸(xl 이상)
//   · row : 세로 펼침 목록의 흰 카드 행(태블릿, Figma "Tablet_2단계_기업정보" 792×104 · 좌우 여백 40)
//   · bar : 면도 여백도 없는 한 줄(모바일 sticky 헤더, Figma "Mobile_…" 328×44)
const formTabTitleVariants = cva(
    'group/form-tab text-label-foreground outline-ring focus-visible:outline-ring data-active:text-foreground relative flex flex-col items-start justify-start text-left whitespace-normal transition-colors focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-solid data-active:[&_[data-slot=form-tab-title-text]]:font-bold',
    {
        variants: {
            variant: {
                tab: 'bg-surface-subtle border-subtle-3 data-active:bg-card data-active:border-transparent min-w-0 flex-1 rounded-t-sm border border-b-0 px-5 pt-5 pb-10',
                row: 'bg-card w-full flex-none rounded-lg border border-transparent px-10 pt-5 pb-10',
                bar: 'w-full flex-none',
            },
        },
        defaultVariants: {variant: 'tab'},
    },
)

// 본문 — [액센트 바] [제목+상태] [상태 아이콘] 한 줄. 아이콘과 제목 사이 간격은 시안 실측 24다.
// 선택일 때만 본문을 12px(바 4 + 간격 8) 들여쓴다 — 비선택 칸은 바 자리를 비워두지 않는 시안이다.
const formTabTitleBodyClassName = 'relative flex w-full items-start gap-6 group-data-active/form-tab:pl-3'

// 액센트 바 — 제목 윗선에서 상태 문구 아랫선까지 이어진다(h-full = 본문 높이). 비선택일 때 자리를
// 차지하지 않도록 absolute 로 두고 투명도로만 켠다.
const formTabTitleAccentClassName =
    'bg-primary absolute top-0 left-0 h-full w-1 rounded-full opacity-0 group-data-active/form-tab:opacity-100'

// 펼침 아이콘 — 행 오른쪽 끝에서 제목+상태 묶음의 세로 가운데에 놓인다(시안 실측 24px).
const formTabTitleChevronClassName =
    'text-label-foreground size-icon-lg group-data-active/form-tab:text-foreground ml-auto shrink-0 self-center'

// 제목 묶음 — 가로 탭에서는 남는 폭을 채워 상태 아이콘을 칸 오른쪽 끝으로 밀고(flex-1),
// 세로 목록·한 줄에서는 내용만큼만 차지해 아이콘이 제목 바로 옆에 붙는다(시안과 동일).
const formTabTitleColumnVariants = cva('flex min-w-0 flex-col', {
    variants: {
        variant: {
            tab: 'flex-1',
            row: 'flex-initial',
            bar: 'flex-initial',
        },
    },
    defaultVariants: {variant: 'tab'},
})

// 제목 굵기는 typo-* 가 variant 를 못 받아(생성기가 찍는 plain 클래스) 루트에서 슬롯을 내려 찍는다
// (선택자 특정성이 typo-* 보다 높아 순서와 무관하게 이긴다 — selectable-card 와 같은 방식).
// 줄바꿈은 시안대로 띄어쓰기 단위다(break-keep) — 기본값은 한글을 글자 단위로 끊어 "핵심 기술 인 / 력 현황"
// 처럼 갈라진다. 띄어쓰기가 없어 한 줄에 못 담는 긴 말만 글자 단위로 넘긴다(wrap-anywhere).
const formTabTitleTextClassName = 'typo-body-xl-medium break-keep wrap-anywhere'

// 아이콘 상자 — 시안에서 20px 아이콘이 24px(제목 한 줄 높이) 안에 세로 가운데로 놓인다.
const formTabTitleIconBoxClassName = 'flex h-6 shrink-0 items-center'

const formTabTitleIconClassName = 'text-label-foreground size-icon-md group-data-active/form-tab:text-foreground'

const formTabTitleStatusVariants = cva('group-data-active/form-tab:text-foreground', {
    variants: {
        status: {
            done: 'typo-body-m-medium text-foreground-subtle',
            writing: 'typo-body-m-medium text-foreground-subtle',
            todo: 'typo-body-m-regular text-disabled',
        },
    },
    defaultVariants: {status: 'todo'},
})

export {
    formTabTitleAccentClassName,
    formTabTitleBodyClassName,
    formTabTitleChevronClassName,
    formTabTitleColumnVariants,
    formTabTitleIconBoxClassName,
    formTabTitleIconClassName,
    formTabTitleStatusVariants,
    formTabTitleTextClassName,
    formTabTitleVariants,
}
