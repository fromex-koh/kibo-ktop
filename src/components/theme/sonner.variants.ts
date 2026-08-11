import type {CSSProperties} from 'react'

type SonnerStyle = CSSProperties & Record<`--${string}`, string>

// 모바일에서 토스터 상자가 화면 오른쪽으로 넘치는 sonner 자체 규칙은 유틸리티로 덮을 수 없어
// globals.css 의 "§ 5 유틸리티로 못 쓰는 규칙"에서 바로잡는다(레이어 밖 규칙끼리 맞서야 해서).
export const sonnerClassName = 'toaster group'

// sonner 가 자체 스타일에 쓰는 CSS 변수. 셸이 unstyled 로 두므로 실제 렌더에는 쓰이지 않지만,
// 라이브러리 기본 경로가 살아나도 시안과 같은 면이 나오도록 프로젝트 토큰을 가리켜 둔다.
export const sonnerStyle: SonnerStyle = {
    '--normal-bg': 'var(--color-toast)',
    '--normal-text': 'var(--color-toast-foreground)',
    '--normal-border': 'transparent',
    '--border-radius': 'var(--radius-full)',
    zIndex: 'var(--ds-z-toast)',
}

export const sonnerToastClassNames = {
    // PROJECT-STYLE: shadcn 원본은 popover 면 + 테두리 + 그림자의 카드형이지만,
    // Figma 토스트는 반투명 검정(black 75%) 알약에 흰 글자 한 줄이므로
    // bg-toast/text-toast-foreground + rounded-full 을 쓴다.
    // 시안(1920 기준) 189×45 = 좌우 여백 24 + 아이콘 20 + 간격 8 + 글자 + 위아래 여백 12.
    // w-fit — 시안은 폭이 내용만큼이다. 긴 문구는 토스터 폭(max-w-full)에서 줄바꿈한다.
    // 가운데 위치(top-center·bottom-center)에서는 그 폭을 토스터 안에서 가운데로 모은다 — sonner 의 토스터는
    // 위치와 무관하게 늘 같은 폭(--width)이라, 내용만큼만 차지하는 알약을 그냥 두면 화면 가운데가 아니라
    // 그 상자의 왼쪽 끝에 붙는다. 좌우 위치의 토스트는 그 끝에 붙어야 하므로 가운데일 때만 적용한다.
    // 토스트는 sonner 가 absolute 로 쌓으므로 좌우를 함께 0 으로 묶어야 auto 여백이 가운데로 민다.
    toast: 'bg-toast text-toast-foreground group-data-[x-position=center]:inset-x-0 group-data-[x-position=center]:mx-auto flex w-fit max-w-full items-center gap-2 rounded-full px-6 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    content: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'typo-body-l-medium text-toast-foreground',
    // 시안에 서브텍스트가 없어 별도 톤을 만들지 않고 크기·굵기로만 구분한다.
    description: 'typo-body-m-regular text-toast-foreground',
    // PROJECT-STYLE: 시안 아이콘은 20px 흰색이다. 셸이 아이콘에 박아 둔 size-4 를 후손 선택자로 덮는다
    // (셸을 고치지 않기 위한 방법 — [SC-02]).
    icon: 'text-toast-foreground flex size-icon-md shrink-0 items-center justify-center [&_svg]:size-icon-md',
    closeButton:
        'text-toast-foreground interactive:hover:bg-toast-foreground/10 order-last flex size-icon-md shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-icon-sm',
    actionButton:
        'typo-caption-bold bg-primary text-primary-foreground interactive:hover:bg-primary-hover interactive:active:bg-primary-pressed ml-auto inline-flex h-control-h-xs shrink-0 items-center justify-center rounded-2xs px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    cancelButton:
        'typo-caption-bold bg-secondary text-secondary-foreground interactive:hover:bg-secondary-hover ml-auto inline-flex h-control-h-xs shrink-0 items-center justify-center rounded-2xs px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    // 상태별 아이콘 색을 두지 않는다 — 면이 어두워 라이트 테마용 상태색(success.700 등)은 대비가 모자라고,
    // 시안도 흰 아이콘 한 벌이다. 종류는 색이 아니라 아이콘 모양이 전한다. [KWCAG 5.3.1]
} as const
