'use client'

import * as React from 'react'
import {Checkbox as CheckboxPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'
import {CheckIcon} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 Checkbox (styled copy)
//
// 이 파일은 `src/components/ui/checkbox.tsx`(shadcn 갓 다운로드 바닐라 원본)를 **그대로 복사**한 것으로,
// 원본과의 유일한 차이는 아래 className(스타일 정의)뿐이다. 함수 셸(Checkbox·data-slot·Indicator·
// props·export)은 원본과 100% 동일하게 유지한다.
//
// 책임 분리:
//   • ui/checkbox.tsx (원본) … 동작·접근성·라이브러리 업데이트를 책임진다. 손대지 않는다(항상 재다운로드 가능).
//   • kit/checkbox.tsx (복사본) … 스타일(className)만 프로젝트 Figma 값으로 책임진다.
//   • 화면·도메인 코드는 항상 이 파일(@/components/kit/checkbox)을 import 한다([SC-04]).
//
// Figma 반영:
//   • 크기 size-6(24px)·rounded-xs(4px)·인디케이터 아이콘 size-4.
//   • 색은 전용 checkbox 토큰에 연결 — 체크됨 border/bg-checkbox-checked, 비활성
//     border-checkbox-disabled-border·bg-checkbox-disabled-fill(회색 박스).
//   • dark: 수동 분기는 두지 않는다(토큰이 .dark 에서 자동 반사, [PB-06]).
// ─────────────────────────────────────────────────────────────────────────────
function Checkbox({className, ...props}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer border-input bg-surface focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:aria-checked:border-checkbox-checked data-checked:border-checkbox-checked data-checked:bg-checkbox-checked data-checked:text-primary-foreground disabled:border-checkbox-disabled-border disabled:bg-checkbox-disabled-fill disabled:text-checkbox-disabled-border relative flex size-6 shrink-0 items-center justify-center rounded-xs border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted disabled:cursor-not-allowed disabled:opacity-100',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-4"
            >
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export {Checkbox}
