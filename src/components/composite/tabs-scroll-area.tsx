'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {HorizontalScrollArea} from '@/components/composite/horizontal-scroll-area'
import {TabsList} from '@/components/ui/tabs'
import {cn} from '@/lib/utils'

// 좌우 스크롤 탭(TabsScrollArea) — 탭이 많아 폭을 넘칠 때, 좌우 화살표 버튼으로 넘겨보는 1뎁스 TabsList
// (variant="line" · "underline" · "text") 래퍼. radix/shadcn 어디에도 없는 동작이라 셸을 건드리지 않고 composite 에서
// 조합해 만든다([SC-04] 기능은 composite 레이어에서).
//
// 스크롤 · 화살표 · 페이드 · 키보드 가운데 맞춤은 HorizontalScrollArea 가 맡는다(세그먼트 필터와 같은 동작).
//
// 폭: TabsList 를 w-max + min-w-full → 실제 폭 = max(내용, 부모 100%). 안 넘칠 땐 부모 풀폭이라 하단 밑줄이
// 끝까지 이어지고(안 그러면 내용 폭까지만 그어져 잘림), 넘칠 땐 내용 폭이라 스크롤이 생긴다. w-max 는 ui line
// variant 기본 w-full 을 이기려 같은 접두사로 특이도를 맞춘다(min-w-full 은 경쟁 규칙이 없어 접두사 불필요).
// 변형별로 접두사가 달라 둘 다 얹는다 — 각 규칙은 자기 variant 목록 안에서만 켜진다.

type TabsScrollAreaProps = ComponentPropsWithoutRef<typeof TabsList>

const TabsScrollArea = ({className, children, variant = 'line', ...props}: TabsScrollAreaProps) => (
    <div data-slot="tabs-scroll-area">
        <HorizontalScrollArea itemSelector='[data-slot="tabs-trigger"]' scrollLabel="탭 목록">
            <TabsList
                variant={variant}
                className={cn(
                    'min-w-full data-[variant=line]:w-max data-[variant=text]:w-max data-[variant=underline]:w-max',
                    className,
                )}
                {...props}
            >
                {children}
            </TabsList>
        </HorizontalScrollArea>
    </div>
)

export {TabsScrollArea}
export type {TabsScrollAreaProps}
