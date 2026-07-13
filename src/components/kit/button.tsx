import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'

import {cn} from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 Button (styled copy)
//
// 이 파일은 `src/components/ui/button.tsx`(shadcn 갓 다운로드 바닐라 원본)를 **그대로 복사**한 것으로,
// 원본과의 유일한 차이는 아래 `buttonVariants`(스타일 정의)뿐이다. 함수 셸(Button·Slot·asChild·
// data-slot·props·export)은 원본과 100% 동일하게 유지한다.
//
// 책임 분리:
//   • ui/button.tsx (원본) … 동작·접근성·라이브러리 업데이트를 책임진다. 손대지 않는다(항상 재다운로드 가능).
//   • components/button.tsx (복사본) … 스타일(buttonVariants)만 프로젝트 Figma 값으로 책임진다.
//   • 화면·도메인 코드는 항상 이 파일(@/components/button)을 import 한다([SC-04]).
//
// 라이브러리 업데이트 흐름:
//   1) 원본을 `npx shadcn add button` 으로 다시 받는다(원본만 갱신).
//   2) 원본의 셸 변경분만 이 복사본에 그대로 옮긴다(diff = 셸 뿐, buttonVariants 는 건드리지 않음).
//   → 스타일 정의는 업데이트 영향을 받지 않으므로 그대로 유지된다.
//
// 왜 감싸지(compose) 않고 복사하나:
//   `cn` 이 순정 twMerge(확장 없음)라, 원본 프리미티브에 className 으로 덮어쓰면 커스텀 색 유틸
//   (bg-button-primary-fill)이 원본의 bg-primary 와 중복제거되지 않아 두 색이 함께 남는다. 색·사이즈를
//   전면 재스킨하는 이 프로젝트에선 "복사 후 buttonVariants 만 교체"가 충돌 없는 정석이다.
//
// 색/반경/포커스는 프로젝트 디자인 토큰(--ds-*) 브릿지 유틸을 사용한다.
// variant 는 전용 버튼 토큰(button-*-fill / -hover / -pressed)에 정밀 연결한다.
// size 는 control-h 토큰을 쓰되, 상호작용 타깃은 min-h-11(44px, KWCAG 6.1.3)로 보정한다.
// ─────────────────────────────────────────────────────────────────────────────
const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-2 focus-visible:outline-dotted focus-visible:outline-ring focus-visible:outline-offset-2 not-disabled:active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'bg-button-primary-fill text-button-primary-text not-disabled:hover:bg-button-primary-fill-hover not-disabled:active:bg-button-primary-fill-pressed disabled:bg-button-primary-disabled-fill disabled:text-button-primary-disabled-text disabled:opacity-100',
                secondary:
                    'bg-button-secondary-fill text-button-secondary-text border-button-secondary-border not-disabled:hover:bg-button-secondary-fill-hover not-disabled:hover:text-button-secondary-text-hover not-disabled:active:bg-button-secondary-fill-hover not-disabled:active:text-button-secondary-text-pressed disabled:bg-button-secondary-disabled-fill disabled:border-button-secondary-disabled-border disabled:text-button-secondary-disabled-text disabled:opacity-100',
                tertiary:
                    'bg-button-tertiary-fill text-button-tertiary-text border-button-tertiary-border not-disabled:hover:bg-button-tertiary-fill-hover not-disabled:active:bg-button-tertiary-fill-hover disabled:border-button-tertiary-disabled-border disabled:text-button-tertiary-disabled-text disabled:opacity-100',
                outline:
                    'border-input bg-background text-foreground not-disabled:hover:bg-accent aria-expanded:bg-accent',
                ghost: 'text-foreground not-disabled:hover:bg-accent aria-expanded:bg-accent',
                destructive:
                    'bg-destructive text-destructive-foreground not-disabled:hover:bg-destructive/90 not-disabled:active:bg-destructive/80',
                // link 는 인라인 텍스트 링크 — size 의 버튼 박스모델(높이·최소폭·패딩)은 아래 compoundVariants 에서 리셋한다.
                link: 'text-primary underline-offset-4 not-disabled:hover:underline',
                // text 는 Figma "button_text" — 채움·테두리 없는 텍스트 버튼(gray.700 = label-foreground). 아이콘+텍스트.
                // 타이포는 Figma 타입 그대로 typo-body-l-regular(14px·행간 150%·Regular)로 지정한다 — text-sm(행간
                // 20px)과 달리 행간 150%(21px)라 h-auto 인 이 변형의 높이가 Figma 와 맞는다. 박스모델(높이·최소폭·
                // 패딩)은 아래 compoundVariants 에서 리셋한다.
                text: 'typo-body-l-regular text-label-foreground not-disabled:hover:text-foreground aria-expanded:text-foreground',
            },
            size: {
                // 기본/큰 사이즈 + 아이콘 버튼은 44px 터치 타깃 보장
                default: 'h-control-h-md min-h-11 gap-2 px-4',
                lg: 'h-control-h-lg min-h-11 gap-2 px-6',
                // 정사각 아이콘 전용 — 버튼 높이는 텍스트 스케일에 대응(2xl=60·xl=52·lg=48·icon=44·sm=36·xs=32).
                // 아이콘 글리프는 icon-sm=24px 를 기준으로 4px 스텝 스케일(xs20·sm24·icon28·lg32·xl36·2xl40).
                'icon-2xl': "size-control-h-2xl min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-10",
                'icon-xl': "size-control-h-xl min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-9",
                icon: "size-control-h-md min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-7",
                'icon-lg': "size-control-h-lg min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-8",
                // 컴팩트 변형(밀도 높은 UI용) — 44px 미만, 인접 간격 확보 전제하에 제한적으로 사용
                sm: 'h-control-h-sm gap-1.5 rounded-md px-3 text-xs',
                xs: "h-control-h-xs gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
                // 아이콘 버튼 모서리는 텍스트 버튼과 맞춘다 — sm 계열=rounded-sm(8px), xs=rounded-2xs(4px, 2xsmall 과 동일).
                'icon-sm': "size-control-h-sm rounded-sm [&_svg:not([class*='size-'])]:size-6",
                'icon-xs': "size-control-h-xs rounded-2xs [&_svg:not([class*='size-'])]:size-5",
                // Figma 버튼 사이즈 스케일 — xlarge/large/medium 은 44px 터치 타깃 보장, small/xsmall/2xsmall 은
                // 컴팩트 예외(44px 미만, 인접 간격 확보 전제). min-w 는 Figma 컴포넌트의 실측 폭(텍스트 "버튼명"
                // 기준 hug 폭)이다. large 는 primary 만 폰트가 18px(다른 type 은 16px)라 실측 폭도 달라 아래
                // compoundVariants 에서 별도로 보정한다.
                xlarge: "h-control-h-2xl min-h-11 min-w-control-min-w-lg gap-2 rounded-sm px-6 text-lg font-bold [&_svg:not([class*='size-'])]:size-6",
                // large 는 min-w 를 여기 두지 않는다 — primary(95px)/secondary·tertiary(90px)가 갈려
                // compoundVariants 에서만 지정한다(같은 클래스 문자열 안에 min-w-* 두 개가 동시에 들어가면
                // tailwind-merge 가 커스텀 스케일 키를 같은 그룹으로 인식하지 못해 중복 제거가 안 된다).
                large: "h-control-h-xl min-h-11 gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                medium: "h-control-h-lg min-h-11 min-w-control-min-w-sm gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                small: "h-control-h-md min-w-control-min-w-sm gap-1.5 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-5",
                // xsmall(36px)은 Figma 스케일에 없던 값을 2xsmall(32)과 small(40) 사이에 끼운 프로젝트 보간 사이즈다.
                xsmall: "h-control-h-sm min-w-control-min-w-xs gap-1.5 rounded-sm px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
                '2xsmall':
                    "h-control-h-xs min-w-control-min-w-xs gap-1 rounded-2xs px-3 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
            },
        },
        // Figma 상 primary(variant=default) 만 갖는 예외 — 다른 type 과 폰트가 달라 size 축만으로는 표현 불가:
        //  - large: primary 는 18px(다른 size 와 달리 large 안에서도 type 별 폰트가 갈린다), 실측 폭도 95px(나머지는 90px).
        //  - medium/small: primary 만 font-bold(다른 type 은 medium). hover/pressed 도 700 을 유지해 텍스트
        //    폭이 흔들리지 않게 하고, 비활성만 Figma 대로 font-medium 으로 둔다.
        compoundVariants: [
            {variant: 'default', size: 'large', class: 'min-w-control-min-w-md text-lg'},
            {variant: 'secondary', size: 'large', class: 'min-w-control-min-w-sm'},
            {variant: 'tertiary', size: 'large', class: 'min-w-control-min-w-sm'},
            {variant: 'default', size: 'medium', class: 'font-bold disabled:font-medium'},
            {variant: 'default', size: 'small', class: 'font-bold disabled:font-medium'},
            // link 는 인라인 텍스트 링크라 size 의 버튼 박스모델(높이·최소크기·패딩)을 모두 리셋한다.
            {variant: 'link', class: 'h-auto min-h-0 min-w-0 gap-1 p-0'},
            // text 도 채움 없는 텍스트 버튼이라 박스모델을 리셋한다. size 의 text-*/svg 크기·gap 은 유지하고
            // (예: xsmall = text-sm 14px + svg 16px), 높이·최소폭·패딩만 지우고 굵기는 Figma 대로 Regular 로 둔다.
            {variant: 'text', class: 'h-auto min-h-0 min-w-0 p-0 font-normal'},
        ],
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

function Button({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot.Root : 'button'

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({variant, size, className}))}
            {...props}
        />
    )
}

export {Button, buttonVariants}
