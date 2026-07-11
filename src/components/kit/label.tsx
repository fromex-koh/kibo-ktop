'use client'

import * as React from 'react'
import {Label as LabelPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 Label (styled copy)
//
// 이 파일은 `src/components/ui/label.tsx`(shadcn 갓 다운로드 바닐라 원본)를 **그대로 복사**한 것으로,
// 원본과의 유일한 차이는 아래 className(스타일 정의)뿐이다. 함수 셸(Label·data-slot·props·export)은
// 원본과 100% 동일하게 유지한다.
//
// 책임 분리:
//   • ui/label.tsx (원본) … 동작·접근성·라이브러리 업데이트를 책임진다. 손대지 않는다(항상 재다운로드 가능).
//   • kit/label.tsx (복사본) … 스타일(className)만 프로젝트 Figma 값으로 책임진다.
//   • 화면·도메인 코드는 항상 이 파일(@/components/kit/label)을 import 한다([SC-04]).
//
// Figma 반영:
//   • 폼 라벨 크기를 16px(text-base)로 통일(바닐라 text-sm=14px 에서 상향).
//   • cursor-pointer — 라벨 클릭으로 연결 컨트롤을 토글할 수 있음을 커서로 알린다.
//   • text-*/font-* 유틸은 ui/ 원본·그 kit 창구에 한해 허용되는 예외다([SHADCN.md 타이포 유틸 예외]).
// ─────────────────────────────────────────────────────────────────────────────
function Label({className, ...props}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                'flex cursor-pointer items-center gap-2 text-base leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                className,
            )}
            {...props}
        />
    )
}

export {Label}
