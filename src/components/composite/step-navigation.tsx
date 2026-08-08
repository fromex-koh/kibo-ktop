import type {ComponentProps, ComponentPropsWithoutRef} from 'react'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 스텝 내비게이션(StepNavigation) — 단계형 화면 하단에서 이전·다음 CTA를 가운데 한 묶음으로 배치한다.
// bar는 전체폭 반투명 배경과 상단 구분선을, plain은 부모 화면의 배경을 그대로 사용한다.
// 정렬은 기존 ActionBar의 가운데 영역을, 버튼은 기존 Button(size 2xl — 이전 tertiary · 다음 primary)을 재사용한다.
//
// 버튼은 prev·next 에 Button props 를 넘겨 만든다 — children(라벨)·onClick·disabled·asChild 등 Button 의 모든
// 속성을 그대로 쓸 수 있고, variant·size 기본값(tertiary/default · 2xl)은 넘긴 값으로 덮을 수 있다.
// 위치는 문서 흐름 그대로다 — 본문 끝에 붙는 일반 블록이라 sticky/fixed 로 띄우지 않는다(시안 CTA 배치).
// 본문을 가리지 않고, 짧은 화면에서도 스크롤 없이 버튼이 보인다.
// 배경은 bg-cta-surface(반투명 토큰) — 테마별로 알맞은 값을 담는다: light=흰색 75%(시안), dark·mainpage=화이트
// 10% 프로스트(어두운 표면을 살짝 밝혀 바가 떠 보이게, Material 식 dark elevation). /opacity 수정자 없이 토큰 유틸만 쓴다.

type StepButtonProps = ComponentProps<typeof Button>
type StepNavigationAppearance = 'bar' | 'plain'

type StepNavigationProps = {
    // bar는 배경·상단 구분선이 있는 기본 CTA 바, plain은 페이지 배경 위에 버튼만 배치한다.
    appearance?: StepNavigationAppearance
    // 이전 버튼(기본 tertiary · size 2xl). 생략하면 다음 버튼만 가운데 표시한다.
    prev?: StepButtonProps
    // 다음 버튼(기본 primary · size 2xl).
    next?: StepButtonProps
} & ComponentPropsWithoutRef<'div'>

const StepNavigation = ({appearance = 'bar', prev, next, className, ...props}: StepNavigationProps) => (
    <div
        data-slot="step-navigation"
        data-appearance={appearance}
        className={cn(
            'w-full',
            appearance === 'bar' ? 'border-subtle-3 bg-cta-surface border-t' : 'bg-transparent',
            className,
        )}
        {...props}
    >
        {/* 시안: 마지막 콘텐츠와 버튼 사이 40px, 버튼 아래 60px. bar 는 상단 경계선이 있어 24px 를 유지한다. */}
        <div className={cn('content-layout', appearance === 'bar' ? 'py-6' : 'pt-10 pb-15')}>
            <ActionBar>
                {prev || next ? (
                    // 시안의 CTA 짝은 16 간격이다(ActionBar 기본 8보다 넓다).
                    <ActionBarCenter className="col-span-3 col-start-1 w-full flex-col gap-4 md:col-span-1 md:col-start-2 md:w-auto md:flex-row">
                        {prev ? (
                            <Button
                                variant="tertiary"
                                size="xl"
                                {...prev}
                                className={cn('w-full md:w-auto', prev.className)}
                            />
                        ) : null}
                        {next ? (
                            <Button
                                variant="default"
                                size="xl"
                                {...next}
                                className={cn('w-full md:w-auto', next.className)}
                            />
                        ) : null}
                    </ActionBarCenter>
                ) : null}
            </ActionBar>
        </div>
    </div>
)

export {StepNavigation}
export type {StepNavigationAppearance, StepNavigationProps}
