import * as React from 'react'
import {cn} from '@/lib/utils'

// 프로젝트 Textarea (styled copy) — 원본 src/components/ui/textarea.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 셸(구성·props·data-slot·export)은 원본과 동일하고, className 만 Figma 에 맞춘다.
//
// Figma text_area 반영 — Input 과 통일하되 멀티라인: radius 8px(rounded-sm), padding 16px(px-4 py-3), 16px 텍스트.
// 배경 bg-surface(흰 배경), placeholder text-placeholder(gray.700). disabled/read-only 는 bg-muted.
// 폭은 컴포넌트가 아니라 label+textarea 를 감싸는 폼 필드 wrapper 에서 max-w-90(상한) 으로 잡는다.
// focus 는 점선 outline(outline-2 dotted outline-ring outline-offset-2), 에러는 테두리(border-destructive)만
// — Input 등 다른 폼 컨트롤과 동일(다크 자동 반사, dark: 분기 없음, PB-06).
//
// 높이: Figma 는 120px 고정이다. 손잡이 리사이즈(resize-none)·내용 자동확장(field-sizing-content 미사용)을 막고,
// min-h-30(=120px) 로 높이를 낸다 — 전부 className(스타일)이라 셸은 바닐라 그대로. 줄 수를 바꾸려면 사용처에서
// <Textarea rows={n} /> 로 넘긴다(원본 textarea 의 표준 prop).
function Textarea({className, ...props}: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'border-input bg-surface min-h-30 w-full min-w-0 resize-none rounded-sm border px-4 py-3 text-base transition-colors outline-none',
                'placeholder:text-placeholder',
                'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted',
                'aria-invalid:border-destructive',
                'read-only:bg-muted',
                'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        />
    )
}

export {Textarea}
