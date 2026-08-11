'use client'

import type {ReactNode} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyEndClassName, dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 전문기술/숙련기술 정의 모달 — 신청기술 구분에서 고를 두 기술이 각각 무엇인지 알려 준다
// (Figma "[신속표준모형 KTRS-FM] m_전문기술/숙련기술 정의"). 기업 기타 정보의 [전문기술/숙련기술 정의] 버튼이 연다.
//
// 기술마다 [이름 + 정의 + 예시] 한 묶음이라, 이름을 h3 으로 두고 그 아래 문장을 붙인다 — 모달 제목(h2)
// 아래 단계라 건너뛰지 않는다[6.4.2].

const TECHNOLOGY_DEFINITIONS: readonly {title: string; definition: string; example: string}[] = [
    {
        title: '전문기술',
        definition:
            '과학적 원리, 이론적 배경 및 체계적 방법론 등을 바탕으로하는 전문지식으로서, 연구개발을 통한 신제품(서비스) 개발 및 고도화된 시스템 설계 등에 중점을 둔 기술을 의미한다.',
        example: '(※ 공학적기술 예시: 하드웨어 설계, 기기 설계, 장비 제조, SW 개발, 신약 개발, 신소재 개발 등)',
    },
    {
        title: '숙련기술',
        definition:
            '산업 현장에서 업무를 작업의 효과적인 수행을 위해 필요한 기술로서 지속적인 경험과 학습을 통하여 얻어지는 능숙함, 노하우, 기법 등의 기술을 의미한다.',
        example:
            '(※ 숙련기술 예시: 절삭·가공, 용접, 밀링, 주조, 금형 제작, 단순 설계(CAD), 표면처리, 검사, 공예품 제조 등)',
    },
]

type TechnologyDefinitionDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const TechnologyDefinitionDialog = ({children, defaultOpen}: TechnologyDefinitionDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 설명 묶음이 본문 전체라 별도 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>전문기술/숙련기술 정의</DialogTitle>
            </DialogHeader>
            {/* 기술 사이 24 · 이름과 문장 사이 8(시안). */}
            <div className={cn(dialogInfoBodyClassName, 'gap-6')}>
                {TECHNOLOGY_DEFINITIONS.map((technology) => (
                    <section key={technology.title} className="flex flex-col gap-2">
                        <h3 className="typo-title-m-bold text-foreground">{technology.title}</h3>
                        {/* 시안은 정의 문장 중간에도 줄바꿈이 있으나 화면 폭에 따라 달라지는 자리라 그대로 흘린다.
                            예시는 문장과 별개 안내라 줄을 나눈다. */}
                        <p className="typo-body-xl-regular text-foreground">{technology.definition}</p>
                        <p className="typo-body-xl-regular text-foreground">{technology.example}</p>
                    </section>
                ))}
            </div>
            {/* CTA 가 없어도 아래 여백은 스크롤 영역 밖에 둔다 — 본문이 카드 맨 가장자리에서 끊기지 않는다. */}
            <div aria-hidden="true" className={dialogBodyEndClassName} />
        </DialogContent>
    </Dialog>
)

export {TechnologyDefinitionDialog}
export type {TechnologyDefinitionDialogProps}
