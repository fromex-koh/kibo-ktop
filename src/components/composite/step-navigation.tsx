import type {ComponentProps, ComponentPropsWithoutRef} from 'react'
import {ActionBar, ActionBarEnd, ActionBarStart} from '@/components/composite/action-bar'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 스텝 내비게이션(StepNavigation) — 단계형 화면 하단에 두는 CTA 바. Figma "CTA" 반영.
// 전체폭 반투명 바(상단 테두리) 안에서 좌측 보조 버튼(이전 등)과 우측 주요 버튼(다음·결과조회 등)을
// 콘텐츠 폭(content-layout) 양 끝에 배치한다. 3구역 정렬은 기존 ActionBar 를, 버튼은 기존 Button(size 2xl —
// 좌 tertiary(흰 배경·회색 테두리) · 우 primary)을 그대로 재사용한다(Figma "이전"/"다음" 버튼과 색까지 일치).
//
// 버튼은 prev·next 에 Button props 를 넘겨 만든다 — children(라벨)·onClick·disabled·asChild 등 Button 의 모든
// 속성을 그대로 쓸 수 있고, variant·size 기본값(tertiary/default · 2xl)은 넘긴 값으로 덮을 수 있다.
// 위치(sticky/fixed)는 화면 문맥마다 달라 컴포넌트에서 고정하지 않고 사용처 className 으로 지정한다.
// 반투명 배경은 스크롤되는 본문 위에 겹쳐 뜰 때만 의미가 있다.

type StepButtonProps = ComponentProps<typeof Button>

type StepNavigationProps = {
    // 좌측 버튼(기본 tertiary · size 2xl). 생략하면 좌측을 비운다(첫 단계 등). children 에 라벨을 넘긴다.
    prev?: StepButtonProps
    // 우측 버튼(기본 primary · size 2xl).
    next?: StepButtonProps
} & ComponentPropsWithoutRef<'div'>

const StepNavigation = ({prev, next, className, ...props}: StepNavigationProps) => (
    <div
        data-slot="step-navigation"
        className={cn('border-subtle-3 bg-surface/75 w-full border-t', className)}
        {...props}
    >
        <div className="content-layout py-6">
            <ActionBar>
                {prev ? (
                    <ActionBarStart>
                        <Button variant="tertiary" size="2xl" {...prev} />
                    </ActionBarStart>
                ) : null}
                {next ? (
                    <ActionBarEnd>
                        <Button variant="default" size="2xl" {...next} />
                    </ActionBarEnd>
                ) : null}
            </ActionBar>
        </div>
    </div>
)

export {StepNavigation}
export type {StepNavigationProps}
