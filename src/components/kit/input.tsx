import * as React from 'react'
import {cn} from '@/lib/utils'

// 프로젝트 Input (styled copy) — 원본 src/components/ui/input.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 원본과의 차이는 className(스타일) 뿐이고, 셸(함수·data-slot·props·export)은 동일하다.
//
// Figma text_input 반영 — 높이 48px(control-h-lg), radius 8px(rounded-sm), padding 16px, 16px 텍스트. Select 와 통일.
// 폭: w-full 로 부모(폼 필드 wrapper)를 채운다. Figma 폭 360 은 컴포넌트가 아니라 label+input 을
// 감싸는 폼 필드 wrapper 에서 max-w-90(상한) 으로 잡는다(min-w-0 은 flex 오버플로 방지용으로 유지).
// 배경은 bg-surface(흰 배경) — Select 와 통일. disabled/read-only 는 bg-muted 로 덮는다.
// 그 외 색은 shadcn 슬롯(border/input/ring/destructive)에 연결 — 다크는 --ds-* 가 자동 반사(dark: 분기 없음, PB-06).
function Input({className, type, ...props}: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'h-control-h-lg border-input bg-surface w-full min-w-0 rounded-sm border px-4 text-base transition-colors outline-none',
                'placeholder:text-muted-foreground',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
                'read-only:bg-muted',
                'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
                'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
                className,
            )}
            {...props}
        />
    )
}

export {Input}
