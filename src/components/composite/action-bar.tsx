import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 액션 바(ActionBar) — 버튼들을 왼쪽/가운데/오른쪽 3구역에 배치하는 하단 액션 레이아웃(L2 composite).
// Figma "CTA" 반영("이전"/"다음" 가운데 정렬 페어가 실제 사용례). shadcn/radix 에 이 정렬 전용 프리미티브가
// 없어(Card 의 CardFooter 는 단순 flex 뿐 3구역 정렬이 없다) 직접 합성했다.
//
// 왜 grid-cols-[1fr_auto_1fr] 인가 — flex justify-between 은 Start/End 폭이 다르면 Center 가 시각 중앙에서
// 어긋난다. 양 끝 컬럼을 동일한 1fr 로 두면 Start/End 내용과 무관하게 (컨테이너 폭 − Center 폭) 이 항상
// 반씩 나뉘어, Center 하나만 써도(Start/End 를 안 넣어도) 정확히 컨테이너 정중앙에 온다 — 그래서
// "이전 / 다음(중앙정렬)"과 "목록(왼쪽) / 수정·저장(오른쪽)"을 같은 루트로 표현할 수 있다.
// absolute 로 중앙 배치하지 않는다([ST-005] 지양 지침과도 맞음 — grid 로 충분하다).
//
// gap-x-4(16px) — 컬럼 간 최소 간격. 좁은 화면에서 3구역(1fr 이 0 에 수렴)이 서로 맞붙지 않도록 기본 여백을
// 준다. column-gap 은 양쪽 대칭이라 Center 정중앙 정렬은 유지된다(구역 내부 버튼 간격 gap-2 보다 커서 구역이
// 서로 구분돼 보인다). 넓은 화면에선 1fr 이 공간을 흡수해 이 값은 사실상 눈에 안 띈다.

const ActionBar = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar"
        className={cn('grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-4', className)}
        {...props}
    />
)

// 왼쪽 구역 — 예: "목록". 없으면 Center/End 배치에 영향을 주지 않는다(빈 1fr 컬럼).
const ActionBarStart = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar-start"
        className={cn('col-start-1 flex items-center justify-start gap-2', className)}
        {...props}
    />
)

// 가운데 구역 — 예: "이전"/"다음" 페어. Start/End 유무와 무관하게 컨테이너 정중앙에 고정된다.
const ActionBarCenter = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar-center"
        className={cn('col-start-2 flex items-center justify-center gap-2', className)}
        {...props}
    />
)

// 오른쪽 구역 — 예: "수정"/"저장".
const ActionBarEnd = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar-end"
        className={cn('col-start-3 flex items-center justify-end gap-2', className)}
        {...props}
    />
)

export {ActionBar, ActionBarStart, ActionBarCenter, ActionBarEnd}
