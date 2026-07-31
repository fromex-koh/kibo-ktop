import {cva} from 'class-variance-authority'

// PROJECT-STYLE: shadcn Button 함수 셸은 ui/button.tsx에 유지하고 프로젝트 스타일만 이 파일에서 관리한다.
// outline-ring 은 평상시에도 지정한다 — outline-color 기본값은 currentColor 라 transition-all 이
// 포커스 순간 '글자색 → ring 색'을 애니메이션해 포커스링이 검정→파랑으로 번지듯 보인다(캘린더 키보드 이동에서 확인).
// outline-style 이 none 이라 평상시엔 보이지 않고, 포커스 때 두께·offset 만 전환된다.
const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-ring outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2 interactive:active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-100 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'border-primary bg-primary text-primary-foreground interactive:hover:bg-primary-hover interactive:active:bg-primary-pressed disabled:border-control-disabled disabled:bg-control-disabled disabled:text-disabled disabled:opacity-100',
                secondary:
                    'bg-secondary text-secondary-foreground border-secondary-strong interactive:hover:bg-secondary-hover interactive:hover:text-secondary-foreground-hover interactive:active:bg-secondary-pressed interactive:active:text-secondary-foreground-pressed disabled:bg-control-disabled disabled:border-disabled-subtle disabled:text-disabled disabled:opacity-100',
                // PROJECT-STYLE: tertiary 의 disabled 글자만 시안이 gray.200(#b7bbbf) 이다 — 면이 흰색이라
                // primary·secondary 의 회색 면(gray.100) 위 gray.300 보다 한 단계 더 옅게 둔다.
                tertiary:
                    'bg-tertiary text-tertiary-foreground border-tertiary-strong interactive:hover:bg-tertiary-hover interactive:active:bg-tertiary-pressed disabled:bg-control-disabled-subtle disabled:border-disabled-subtle disabled:text-disabled-subtle disabled:opacity-100',
                outline:
                    'border-input bg-background text-foreground interactive:hover:bg-accent aria-expanded:bg-accent disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled',
                ghost: 'text-foreground interactive:hover:bg-accent aria-expanded:bg-accent disabled:bg-control-disabled disabled:text-disabled',
                // PROJECT-STYLE: 시안의 모달 닫기·헤더 아이콘 버튼은 배경·테두리·여백 없이 아이콘만 놓고
                // hover 에서 아이콘 색만 바꾼다. ghost 를 쓰면 호버 면과 컨트롤 높이 상자가 따라와 시안과 달라진다.
                // 상자는 size 축이 정한 아이콘 크기와 같다(아래 compoundVariants) — 보이는 크기와 눌리는 범위가
                // 일치하고, 인접 컨트롤 간격만 확보하면 된다([6.1.3]).
                // 눌림 시 1px 내려가는 기본 동작은 되돌린다 — 면이 없어 아이콘만 흔들리는 것처럼 보인다.
                plain: 'border-0 text-current interactive:hover:text-icon-interactive-hover interactive:active:not-aria-[haspopup]:translate-y-0 focus-visible:outline-offset-4 disabled:text-disabled disabled:opacity-100',
                destructive:
                    'bg-destructive text-destructive-foreground interactive:hover:bg-destructive/90 interactive:active:bg-destructive/80 disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled',
                // hover 밑줄도 text-underline 과 같은 방식(버튼 폭 전체 1px 선)이라 아이콘 아래에서 끊기지 않는다.
                // 평상시엔 선을 감춰 두고(opacity-0) hover 에서만 드러낸다 — 표시/숨김만 바뀌어 레이아웃은 그대로다.
                link: 'text-label-foreground relative after:absolute after:inset-x-0 after:top-1/2 after:h-px after:translate-y-[0.5lh] after:bg-current after:opacity-0 interactive:hover:after:opacity-100 disabled:text-disabled-subtle disabled:opacity-100',
                // 밑줄 없는 기본 텍스트 버튼 — 헤더 유틸 링크·"내용보기"처럼 본문에 얹히는 인라인 액션에 쓴다.
                text: 'text-label-foreground no-underline disabled:text-disabled-subtle disabled:opacity-100',
                // PROJECT-STYLE: Figma button_text 는 default·hover·pressed·disabled 네 상태 모두 1px 밑줄이 있다.
                // 밑줄 유무는 사용처마다 갈려서 text(없음)/text-underline(있음) 두 값으로 나눈다.
                // 밑줄은 text-decoration 이 아니라 1px 가상요소로 그린다 — 버튼은 inline-flex 라 아이콘(flex 아이템)에는
                // text-decoration 이 전파되지 않아 시안과 달리 아이콘 밑에서 밑줄이 끊긴다. 가상요소는 버튼 폭 전체를 덮어
                // 시안처럼 아이콘까지 이어진다.
                // 위치 = 세로 중앙(top-1/2)에서 글자 줄 높이의 절반(translate-y 0.5lh)만큼 내린 지점 = 글자 줄 아랫변.
                // [SC-01] 예외: 줄 높이는 사이즈마다 다른 런타임 값이라 토큰·기존 유틸로 표현할 수 없어 lh 단위를 쓴다.
                'text-underline':
                    'text-label-foreground relative after:absolute after:inset-x-0 after:top-1/2 after:h-px after:translate-y-[0.5lh] after:bg-current disabled:text-disabled-subtle disabled:opacity-100',
            },
            size: {
                default: 'h-control-h-sm min-h-11 gap-2 px-4',
                xl: "h-control-h-xl min-h-11 min-w-control-min-w-lg gap-2 rounded-sm px-6 text-lg font-bold [&_svg:not([class*='size-'])]:size-6",
                lg: "h-control-h-lg min-h-11 gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                md: "h-control-h-md min-h-11 min-w-control-min-w-sm gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                sm: "h-control-h-sm min-w-control-min-w-sm gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-5",
                xs: "h-control-h-xs min-w-control-min-w-xs gap-1 rounded-2xs px-3 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
                'icon-xl': "size-control-h-xl min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-xl",
                'icon-lg': "size-control-h-lg min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-xl",
                'icon-md': "size-control-h-md min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-lg",
                icon: "size-control-h-sm min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-lg",
                'icon-sm': "size-control-h-sm rounded-sm [&_svg:not([class*='size-'])]:size-icon-md",
                'icon-xs': "size-control-h-xs rounded-2xs [&_svg:not([class*='size-'])]:size-icon-sm",
            },
        },
        compoundVariants: [
            {variant: 'default', size: 'lg', class: 'min-w-control-min-w-md text-lg'},
            {variant: 'secondary', size: 'lg', class: 'min-w-control-min-w-sm'},
            {variant: 'tertiary', size: 'lg', class: 'min-w-control-min-w-sm'},
            {variant: 'default', size: 'md', class: 'font-bold disabled:font-medium'},
            {variant: 'default', size: 'sm', class: 'font-bold disabled:font-medium'},
            // PROJECT-STYLE: button_text 의 텍스트↔아이콘 간격은 네 size 모두 4px 이다(medium·large 확인).
            // size 축이 8px 를 얹으므로 여기서 gap-1 로 되돌린다.
            {variant: ['text', 'text-underline', 'link'], class: 'min-h-0 min-w-0 gap-1 p-0 font-normal'},
            // variant plain — 컨트롤 높이·최소 크기·패딩·라운드를 걷어내고 상자를 아이콘 크기에 맞춘다.
            // size 축이 rounded-sm 등을 뒤에 얹으므로 이 되돌림은 variant 가 아니라 여기(compound)에 둔다.
            // size 는 아이콘 전용 값만 의미가 있다(각 size 가 정한 아이콘 크기 = 상자 크기).
            {variant: 'plain', class: 'min-h-0 min-w-0 gap-0 rounded-none p-0'},
            {variant: 'plain', size: 'icon-xl', class: 'size-icon-2xl'},
            {variant: 'plain', size: 'icon-lg', class: 'size-icon-xl'},
            {variant: 'plain', size: ['icon', 'icon-md'], class: 'size-icon-lg'},
            {variant: 'plain', size: 'icon-sm', class: 'size-icon-md'},
            {variant: 'plain', size: 'icon-xs', class: 'size-icon-sm'},
            // PROJECT-STYLE: Figma button_text(40006516:20290)는 xsmall 12 · small 14 · medium 16 · large 18
            // 네 단계이고, 높이는 상자가 아니라 행간(18·21·24·27)이 정한다 — 문장 안에 섞이는 인라인 버튼이라
            // 컨트롤 높이를 주면 줄 높이가 어긋난다. 아이콘은 12px 단계만 12, 나머지는 16 이다.
            // xl 은 시안에 없어 large 와 같은 값으로 둔다(다른 variant 와 size 축을 맞추기 위한 자리).
            {
                variant: ['text', 'text-underline', 'link'],
                size: ['xl', 'lg'],
                class: "h-[--spacing(6.75)] text-lg [&_svg:not([class*='size-'])]:size-icon-sm",
            },
            {
                variant: ['text', 'text-underline', 'link'],
                size: ['default', 'md'],
                class: "h-6 text-base [&_svg:not([class*='size-'])]:size-icon-sm",
            },
            {
                variant: ['text', 'text-underline', 'link'],
                size: 'sm',
                class: "h-[--spacing(5.25)] text-sm [&_svg:not([class*='size-'])]:size-icon-sm",
            },
            {
                variant: ['text', 'text-underline', 'link'],
                size: 'xs',
                class: "h-[--spacing(4.5)] text-xs [&_svg:not([class*='size-'])]:size-icon-xs",
            },
        ],
        defaultVariants: {variant: 'default', size: 'default'},
    },
)

export {buttonVariants}
