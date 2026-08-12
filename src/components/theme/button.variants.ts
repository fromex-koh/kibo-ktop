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
                // 밑줄 없는 기본 텍스트 버튼 — 헤더 유틸 링크처럼 본문에 얹히는 인라인 액션에 쓴다.
                // 같은 "내용보기"라도 화면마다 밑줄 유무가 달라 시안을 보고 text/text-underline 을 고른다.
                // PROJECT-STYLE: 눌림 시 1px 내려가는 base 동작은 되돌린다 — 시안(40006650:30781~30790)의
                // pressed 는 default 와 완전히 같고, 면이 없어 글자만 흔들리는 것처럼 보인다(plain 과 같은 이유).
                text: 'text-label-foreground no-underline interactive:active:not-aria-[haspopup]:translate-y-0 disabled:text-disabled-subtle disabled:opacity-100',
                // PROJECT-STYLE: Figma button_text 는 default·hover·pressed·disabled 네 상태 모두 1px 밑줄이 있다.
                // 밑줄 유무는 사용처마다 갈려서 text(없음)/text-underline(있음) 두 값으로 나눈다.
                // 밑줄은 글자 폭만 덮고 아이콘 아래로는 이어지지 않는다 — 아이콘이 보이는 시안(40006650:30806)의
                // left/right icon 케이스에서 밑줄 사각형 폭이 아이콘·간격을 뺀 글자 폭(47)과 정확히 같다.
                // 그래서 가상요소가 아니라 text-decoration 을 쓴다 — 버튼이 inline-flex 라 아이콘(flex 아이템)에는
                // 전파되지 않고 글자를 감싼 익명 flex 아이템에만 그어져, 폭이 저절로 시안과 같아진다.
                // 세로 위치는 글자 줄 아랫변이다. under 가 baseline+descent 자리에 긋고, 거기서 남은 만큼
                // 더 내리면 줄상자 아랫변이 된다(오프셋은 폰트 메트릭이라 size 축에서 지정).
                // [SC-01] 예외: text-underline-position 은 대응하는 Tailwind 유틸이 없어 arbitrary property 로 쓴다.
                'text-underline':
                    'text-label-foreground underline decoration-1 [text-underline-position:under] interactive:active:not-aria-[haspopup]:translate-y-0 disabled:text-disabled-subtle disabled:opacity-100',
            },
            size: {
                default: 'h-control-h-sm min-h-11 gap-2 px-4',
                xl: "h-control-h-xl min-h-11 min-w-control-min-w-lg gap-2 rounded-sm px-6 text-lg font-bold [&_svg:not([class*='size-'])]:size-6",
                lg: "h-control-h-lg min-h-11 gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                md: "h-control-h-md min-h-11 min-w-control-min-w-sm gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-5",
                // PROJECT-STYLE: 시안 button 컴포넌트셋(40006995:44347)의 small 은 세 type 모두 14px/Medium 이고
                // 아이콘은 16 이다 — 40px 상자에 16px 글자를 넣던 이전 시안에서 바뀐 값이다.
                sm: "h-control-h-sm min-w-control-min-w-sm gap-2 rounded-sm px-6 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
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
            // PROJECT-STYLE: text 계열은 Figma button_text 를 따르므로 컨트롤 상자를 통째로 벗긴다.
            // 높이·최소 크기·패딩·테두리를 걷어내면 아래 size 별 블록의 leading-* 가 상자 높이를 정한다.
            // gap-1 — button_text 의 텍스트↔아이콘 간격은 네 size 모두 4px 인데 size 축이 8px 를 얹는다.
            // border-0 — 면이 없는 버튼이라 테두리가 보이진 않지만, base 의 투명 테두리가 상자를 위아래
            // 1px 씩 키워 줄 높이와 어긋나게 만든다. 문장 안에 섞이는 버튼이라 주변 행간까지 밀린다.
            // size 를 명시해 텍스트 size 조합에만 적용한다 — 아이콘 전용 size(icon-*)는 정사각 상자
            // (size-control-h-*)가 맞으므로 여기에 걸리면 높이만 풀려 가로로 찌그러진다.
            {
                variant: ['text', 'text-underline'],
                size: ['xl', 'lg', 'md', 'sm', 'xs', 'default'],
                class: 'h-auto min-h-0 min-w-0 gap-1 border-0 p-0 font-normal',
            },
            // variant plain — 컨트롤 높이·최소 크기·패딩·라운드를 걷어내고 상자를 아이콘 크기에 맞춘다.
            // size 축이 rounded-sm 등을 뒤에 얹으므로 이 되돌림은 variant 가 아니라 여기(compound)에 둔다.
            // size 는 아이콘 전용 값만 의미가 있다(각 size 가 정한 아이콘 크기 = 상자 크기).
            {variant: 'plain', class: 'min-h-0 min-w-0 gap-0 rounded-none p-0'},
            {variant: 'plain', size: 'icon-xl', class: 'size-icon-2xl'},
            {variant: 'plain', size: 'icon-lg', class: 'size-icon-xl'},
            {variant: 'plain', size: ['icon', 'icon-md'], class: 'size-icon-lg'},
            {variant: 'plain', size: 'icon-sm', class: 'size-icon-md'},
            {variant: 'plain', size: 'icon-xs', class: 'size-icon-sm'},
            // PROJECT-STYLE: Figma button_text(40006650:30813)는 xsmall 12 · small 14 · medium 16 · large 18
            // 네 단계이고, 높이는 상자가 아니라 행간(18·21·24·27)이 정한다 — 문장 안에 섞이는 인라인 버튼이라
            // 컨트롤 높이를 주면 줄 높이가 어긋난다. 아이콘은 12px 단계만 12, 나머지는 16 이다.
            // 행간을 명시하는 이유 — Tailwind 의 text-* 기본 행간(28·20·16)은 시안(27·21·18)과 달라 상자와
            // 줄 높이가 어긋난다. 위 블록이 높이를 h-auto 로 풀어 두므로 여기서 정한 행간이 곧 상자 높이가 된다.
            //
            // underline-offset 은 half-leading = (행간 - 폰트 콘텐츠 높이)/2 다. text-underline-position:under
            // 가 콘텐츠 영역 아랫변에 긋기 때문에, 이만큼 더 내려야 시안 위치인 줄상자 아랫변에 온다.
            // 브라우저가 콘텐츠 높이를 size 마다 정수 px 로 반올림해(Pretendard 실측 21·19·16·14) 폰트 크기에
            // 정비례하지 않는다 — em 하나로 묶으면 최대 0.4px 어긋나므로 size 별로 정확한 값을 둔다.
            // [SC-01] 예외: 폰트 메트릭에서 나온 값이라 디자인 토큰으로 승격할 대상이 아니고, Tailwind 의
            // underline-offset 스케일(0·1·2·4·8px)에 2.5·3 이 없다.
            //
            // xl 은 button_text 에 없다 — 컨트롤 높이 60 이 남아 깨지므로 빼지 않고 large 로 접는다.
            {
                variant: ['text', 'text-underline'],
                size: ['xl', 'lg'],
                class: "text-lg leading-[--spacing(6.75)] underline-offset-[3px] [&_svg:not([class*='size-'])]:size-icon-sm",
            },
            {
                variant: ['text', 'text-underline'],
                size: ['default', 'md'],
                class: "text-base leading-6 underline-offset-[2.5px] [&_svg:not([class*='size-'])]:size-icon-sm",
            },
            {
                variant: ['text', 'text-underline'],
                size: 'sm',
                class: "text-sm leading-[--spacing(5.25)] underline-offset-[2.5px] [&_svg:not([class*='size-'])]:size-icon-sm",
            },
            {
                variant: ['text', 'text-underline'],
                size: 'xs',
                class: "text-xs leading-[--spacing(4.5)] underline-offset-2 [&_svg:not([class*='size-'])]:size-icon-xs",
            },
        ],
        defaultVariants: {variant: 'default', size: 'default'},
    },
)

export {buttonVariants}
