'use client'

import type {ReactNode} from 'react'
import {ListMarker} from '@/components/custom/list-marker'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyEndClassName, dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 입력 도움말 모달 — 대표자 경력사항을 어떤 순서·형식으로 적는지 예시로 보여준다
// (Figma "[신속표준모형 KTRS-FM] m_입력 도움말"). 폼의 [입력 도움말] 버튼이 연다.
//
// 예시가 본문 전부라 CTA 가 없다 — 닫기는 모달 헤더의 X 와 Esc·바깥 클릭(Radix)이 맡는다[8.2.1].

// 시안의 예시 — 순서가 뜻을 가지므로(최근 경력부터 과거순) 번호 목록으로 둔다.
const EXAMPLE_TITLE = '예) 2018.1월 창업하여 현재까지 운영중인 경우'

const EXAMPLE_ITEMS: readonly {period: string; note?: string}[] = [
    {period: '201801 ~ 202209', note: '현직장 창업년월 ~ 최근월말'},
    {period: '201503 ~ 201712', note: '최근 경력부터 차례대로 입력'},
    {period: '200501 ~ 201502'},
]

type CareerInputHelpDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const CareerInputHelpDialog = ({children, defaultOpen}: CareerInputHelpDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 예시 목록이 본문 전체라 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>입력 도움말</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogInfoBodyClassName, 'gap-2')}>
                {/* 예시 제목은 아래 목록을 이끄는 머리라 heading 으로 둔다 — 크기·굵기만 제목처럼인 문단으로
                    두면 "제목처럼 보이는데 제목이 아닌 글"이 된다(WAVE "Possible heading").
                    모달 제목(DialogTitle=h2) 아래 단계라 h3 이다[6.4.2]. */}
                <h3 className="typo-title-m-bold text-foreground">{EXAMPLE_TITLE}</h3>
                {/* 항목 사이 8 — 시안 실측(줄 높이 24 · 줄 간격 32). */}
                <ol className="flex list-none flex-col gap-2">
                    {EXAMPLE_ITEMS.map((item, index) => (
                        <li key={item.period} className="flex">
                            <ListMarker type="ordered" level={1} index={index + 1} />
                            {/* 기간과 설명 사이는 시안 실측 8 — 좁은 화면에서는 설명이 다음 줄로 내려간다. */}
                            <span className="typo-body-xl-regular text-foreground flex min-w-0 flex-wrap gap-x-2">
                                <span className="tabular-nums">{item.period}</span>
                                {item.note ? <span>{item.note}</span> : null}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
            {/* CTA 가 없어도 아래 여백은 스크롤 영역 밖에 둔다 — 본문이 카드 맨 가장자리에서 끊기지 않는다. */}
            <div aria-hidden="true" className={dialogBodyEndClassName} />
        </DialogContent>
    </Dialog>
)

export {CareerInputHelpDialog}
export type {CareerInputHelpDialogProps}
