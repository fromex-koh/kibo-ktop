import {cva} from 'class-variance-authority'

// 표면 스타일(높이·배경·라운드·여백)은 base 가 아니라 variant 가 가진다 — 그래야 새 모양을 얹을 때
// base 를 되돌리는 override 가 필요 없다(plain 이 그 목적).
const tabsListVariants = cva(
    'group/tabs-list inline-flex items-center justify-center text-muted-foreground group-data-vertical/tabs:flex-col',
    {
        variants: {
            variant: {
                default: 'bg-muted w-fit rounded-lg p-1 group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit',
                // 타이포는 pill 과 같은 이유로 트리거가 아니라 목록에 둔다(바로 아래 pill 주석 참고).
                // 시안 tap_1depth 는 20px/30 이므로 typo-title-l-regular(=title-l · line-height 1.5)를 쓴다.
                line: 'typo-title-l-regular h-tab-line-h border-subtle-2 w-full justify-start gap-4 rounded-none border-b bg-transparent p-0',
                // PROJECT-STYLE: pill — line 탭 아래에 오는 2뎁스 탭이다(Figma "[공통] 개인정보 처리방침"
                // tap_2depth). 트랙 없이 알약 버튼만 12px 간격으로 늘어서고, 항목이 많으면 다음 줄로 넘어간다.
                // 타이포 토큰을 트리거가 아니라 목록에 두는 이유 — typo-* 는 생성기가 찍는 plain 클래스라
                // group-data-[variant=pill]/tabs-list: 같은 variant 접두사를 받지 못한다. 목록에 두면
                // preflight 의 button { font-size:100%; font-weight:inherit } 로 트리거가 그대로 상속받는다.
                pill: 'typo-body-xl-medium h-auto w-full flex-wrap justify-start gap-3 rounded-none bg-transparent p-0',
                // plain — 구조만 남기고 표면 스타일을 비운다. FormTabs 처럼 탭 모양이 전혀 다른
                // composite 가 자기 디자인을 그대로 얹을 때 쓴다(기본 스타일과 싸우지 않게).
                plain: 'h-auto w-full items-stretch rounded-none bg-transparent p-0',
            },
        },
        defaultVariants: {variant: 'default'},
    },
)
// 트리거도 같은 원칙 — 공통(포커스·비활성·아이콘·전환)만 base 에 두고, 기본 탭의 생김새는
// group-data-[variant=default]/tabs-list: 로 한정한다. line 은 아래 tabsTriggerLineClassName 이 담당한다.
const tabsTriggerClassName =
    "focus-visible:-outline-offset-4 outline-ring focus-visible:outline-ring relative inline-flex items-center gap-1.5 whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:outline-2 focus-visible:outline-solid disabled:pointer-events-none disabled:text-disabled disabled:opacity-100 group-data-[variant=default]/tabs-list:text-foreground/60 group-data-[variant=default]/tabs-list:hover:text-foreground group-data-[variant=default]/tabs-list:h-full group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:justify-center group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:px-1.5 group-data-[variant=default]/tabs-list:py-0.5 group-data-[variant=default]/tabs-list:text-sm group-data-[variant=default]/tabs-list:font-medium group-data-[variant=default]/tabs-list:has-data-[icon=inline-end]:pr-1 group-data-[variant=default]/tabs-list:has-data-[icon=inline-start]:pl-1 group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
// PROJECT-STYLE: line 탭은 Figma 스펙에 맞춘다 — 활성 = title-l(20px) Bold · label-foreground(gray.700),
// 비활성 = 20px Regular · foreground-subtle(gray.500), 인디케이터(4px)·활성 텍스트 = label-foreground(gray.700),
// 트랙 = border-subtle-2(gray.200), 높이 = tab-line-h(46px, Figma 전용 size 토큰).
// shadcn 원본의 24px·foreground(gray.900)·normal·h-control-h-lg(52)·2px 인디케이터와 다른 지점이다.
// 글자 크기·기본 굵기·행간은 위 line 목록의 typo-title-l-regular 를 상속받고, 여기서는 굵기만 상태로 덮는다.
const tabsTriggerLineClassName =
    'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent data-active:bg-background data-active:text-foreground after:bg-label-foreground after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-1 group-data-horizontal/tabs:after:h-1 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-1 group-data-[variant=line]/tabs-list:data-active:after:opacity-100 group-data-[variant=line]/tabs-list:h-tab-line-h group-data-[variant=line]/tabs-list:text-foreground-subtle group-data-[variant=line]/tabs-list:data-active:text-label-foreground group-data-[variant=line]/tabs-list:data-active:font-bold group-data-[variant=line]/tabs-list:flex-none group-data-[variant=line]/tabs-list:justify-start group-data-[variant=line]/tabs-list:gap-0 group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:px-6 group-data-[variant=line]/tabs-list:py-0 group-data-[variant=line]/tabs-list:after:bottom-0'
// PROJECT-STYLE: pill 탭은 Figma tap_2depth 사양이다 — 높이 48(control-h-md)·라운드 8(rounded-sm)·
// 좌우 24(px-6). 글자 크기·기본 굵기는 위 pill 목록의 typo-body-xl-medium 을 상속받는다.
// 선택 = navy 면(tab-pill-active) + 흰 굵은 글자, 비선택 = 페이지 배경(bg-background) 면 + foreground-subtle.
// bg-surface 위에 놓이는 내부 탭이므로 다크모드에서도 본문 표면(gray.800)과 겹치지 않게 한다.
// 굵기만 상태로 갈리므로 선택 상태에서 font-bold 로 덮는다(pagination 의 aria-current 처리와 같은 방식).
const tabsTriggerPillClassName =
    'group-data-[variant=pill]/tabs-list:h-control-h-md group-data-[variant=pill]/tabs-list:bg-background group-data-[variant=pill]/tabs-list:text-foreground-subtle group-data-[variant=pill]/tabs-list:flex-none group-data-[variant=pill]/tabs-list:justify-center group-data-[variant=pill]/tabs-list:rounded-sm group-data-[variant=pill]/tabs-list:border-0 group-data-[variant=pill]/tabs-list:px-6 group-data-[variant=pill]/tabs-list:py-0 group-data-[variant=pill]/tabs-list:not-data-[state=active]:hover:text-foreground group-data-[variant=pill]/tabs-list:data-active:bg-tab-pill-active group-data-[variant=pill]/tabs-list:data-active:text-tab-pill-active-foreground group-data-[variant=pill]/tabs-list:data-active:font-bold group-data-[variant=pill]/tabs-list:data-active:shadow-none'
// PROJECT-STYLE: shadcn 원본 패널은 outline-none 만 있어 포커스 표시가 없다. 탭 패널은 ARIA 탭 패턴대로
// 탭 순서에 포함되므로(Radix 가 tabindex=0 부여) 탭 다음 Tab 키에서 여기로 포커스가 온다 —
// 대체 포커스 링이 없으면 키보드 사용자에게 포커스가 사라진 것처럼 보인다[6.1.2].
// outline-ring 을 평상시에도 지정해 색 전환 없이 두께만 나타나게 한다.
const tabsContentClassName =
    'outline-ring flex-1 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'
export {
    tabsContentClassName,
    tabsListVariants,
    tabsTriggerClassName,
    tabsTriggerLineClassName,
    tabsTriggerPillClassName,
}
