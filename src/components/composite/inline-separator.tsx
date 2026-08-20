import type {ComponentPropsWithoutRef} from 'react'
import {Separator} from '@/components/ui/separator'
import {cn} from '@/lib/utils'

// 인라인 구분선(InlineSeparator) — 한 줄 안에서 값과 값을 가르는 세로선(시안 divider 1×12).
// 평가결과 조회의 [일시│상태│등급], 1:1 문의의 [분류│제목]처럼 나란히 놓인 값 사이에 쓴다.
//
// 세로 Separator 를 쓸 때마다 되풀이되던 두 가지 손질을 이 조각이 갖는다.
//   1. 셸이 세로 방향에 self-stretch 를 걸어 두어, 높이를 12 로 묶으면 줄 위쪽에 붙는다 —
//      같은 변형으로 self-center 를 덮어써 글자 가운데에 맞춘다.
//   2. 제목(h3)처럼 글자만 담을 수 있는 자리에는 블록 요소를 넣을 수 없다[8.1.1] —
//      inline 을 켜면 asChild 로 같은 스타일을 span 에 씌워 글 흐름에 놓는다.
//
// 좌우 여백은 기본 12(시안)다. 줄 자체에 gap 이 있는 자리(1:1 문의 목록의 gap-x-1)는 합쳐서 16이 된다.

const inlineSeparatorClassName = 'mx-3 h-3 shrink-0 data-vertical:self-center'
// 글 흐름 안에서는 높이·굵기를 직접 주고 글자 가운데에 맞춘다(flex 가 아니라 정렬 기준이 baseline 이다).
const inlineSeparatorFlowClassName = 'mx-4 inline-block h-3 w-px align-middle'

type InlineSeparatorProps = {
    /** 제목처럼 글자만 담을 수 있는 자리에 놓을 때 켠다 — div 대신 span 으로 그린다. */
    inline?: boolean
} & ComponentPropsWithoutRef<'div'>

const InlineSeparator = ({inline, className, ...props}: InlineSeparatorProps) =>
    inline ? (
        <Separator orientation="vertical" asChild className={cn(inlineSeparatorFlowClassName, className)} {...props}>
            <span />
        </Separator>
    ) : (
        <Separator orientation="vertical" className={cn(inlineSeparatorClassName, className)} {...props} />
    )

export {InlineSeparator}
export type {InlineSeparatorProps}
