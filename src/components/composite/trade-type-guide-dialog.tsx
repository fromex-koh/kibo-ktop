'use client'

import type {ReactNode} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyEndClassName, dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 거래유형 설명 모달 — 거래유형(B2B·B2C·B2G)이 각각 무엇인지 알려 준다
// (Figma "[신속표준모형 KTRS-FM] m_거래유형 설명"). 기업 기타 정보의 [거래유형 설명] 버튼이 연다.
//
// 유형마다 [제목 + 정의 + 설명] 한 묶음이라, 제목을 h3 으로 두고 그 아래 문장을 붙인다 — 모달 제목(h2)
// 아래 단계라 건너뛰지 않는다[6.4.2].

const TRADE_TYPES: readonly {title: string; definition: string; description: string}[] = [
    {
        title: '1. 기업간 거래(B2B, Business-to-Business)',
        definition: '정의: 기업 간 거래를 나타냅니다.',
        description: '설명: 한 기업이 다른 기업에게 제품이나 서비스를 판매하거나 구매하는 상거래 형태를 의미합니다.',
    },
    {
        title: '2. 개인 소비자와 거래(B2C, Business-to-Consumer)',
        definition: '정의: 기업이 개인 소비자에게 직접 상품이나 서비스를 제공하는 거래를 나타냅니다.',
        description: '설명: 일반 소매 상거래로, 기업이 최종 소비자에게 제품이나 서비스를 판매합니다.',
    },
    {
        title: '3. 정부기관과 거래(B2G, Business-to-Government)',
        definition: '정의: 기업이 정부 기관에 제품이나 서비스를 제공하는 거래를 나타냅니다.',
        description:
            '설명: 기업이 정부 기관과 계약을 맺고 그들에게 필요한 제품이나 서비스를 제공하는 형태로, 정부와 기업 간의 상호 작용을 나타냅니다.',
    },
]

type TradeTypeGuideDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const TradeTypeGuideDialog = ({children, defaultOpen}: TradeTypeGuideDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 설명 묶음이 본문 전체라 별도 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>거래유형 설명</DialogTitle>
            </DialogHeader>
            {/* 유형 사이 24 · 제목과 문장 사이 8(시안). */}
            <div className={cn(dialogInfoBodyClassName, 'gap-6')}>
                {TRADE_TYPES.map((type) => (
                    <section key={type.title} className="flex flex-col gap-2">
                        <h3 className="typo-title-m-bold text-foreground">{type.title}</h3>
                        <p className="typo-body-xl-regular text-foreground">{type.definition}</p>
                        <p className="typo-body-xl-regular text-foreground">{type.description}</p>
                    </section>
                ))}
            </div>
            {/* CTA 가 없어도 아래 여백은 스크롤 영역 밖에 둔다 — 본문이 카드 맨 가장자리에서 끊기지 않는다. */}
            <div aria-hidden="true" className={dialogBodyEndClassName} />
        </DialogContent>
    </Dialog>
)

export {TradeTypeGuideDialog}
export type {TradeTypeGuideDialogProps}
