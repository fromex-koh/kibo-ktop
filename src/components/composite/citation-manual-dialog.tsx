'use client'

import type {ReactNode} from 'react'
import Image, {type StaticImageData} from 'next/image'
import step1Image from '@public/images/citation-manual/step-1-kipris-search-menu.webp'
import step2Image from '@public/images/citation-manual/step-2-patent-number-search.webp'
import step3Image from '@public/images/citation-manual/step-3-citation-count.webp'
import {ListMarker} from '@/components/custom/list-marker'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyEndClassName, dialogInfoBodyClassName} from '@/components/theme/dialog.variants'

// 피인용 확인 메뉴얼 모달 — 특허 피인용 횟수를 KIPRIS 에서 확인하는 순서를 화면 그림과 함께 보여준다
// (Figma "[신속표준모형 KTRS-FM] m_피인용 확인 메뉴얼"). 3단계 체크리스트의 피인용 안내가 연다.
//
// 순서가 뜻을 가지므로 번호 목록(<ol>)으로 둔다. 그림은 글을 보조하는 화면 예시라 alt 로 무엇을 담은
// 그림인지 알린다[5.1.1] — 눌러야 할 자리는 순서 문장이 글로도 전한다[5.3.2].

type ManualStep = {
    instruction: string
    image: StaticImageData
    alt: string
}

const MANUAL_STEPS: readonly ManualStep[] = [
    {
        instruction: 'www.kipris.or.kr에 접속하여 [지식재산권 검색_특허·실용신안] 메뉴를 클릭합니다.',
        image: step1Image,
        alt: 'KIPRIS 첫 화면의 지식재산정보 검색 영역. 특허·실용신안 메뉴가 첫 번째에 있다.',
    },
    {
        instruction: '동사가 보유한 특허등록/출원 번호를 입력하고 검색합니다.',
        image: step2Image,
        alt: 'KIPRIS 특허·실용신안 검색 화면. 위쪽 검색창에 번호를 넣고 오른쪽 검색 버튼을 누른다.',
    },
    {
        instruction: '검색된 특허의 피인용 횟수를 확인합니다.',
        image: step3Image,
        alt: 'KIPRIS 검색 결과 화면. 특허 항목 오른쪽에 피인용 횟수가 표시된다.',
    },
]

type CitationManualDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const CitationManualDialog = ({children, defaultOpen}: CitationManualDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 순서 목록이 본문 전체라 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>피인용 확인 메뉴얼</DialogTitle>
            </DialogHeader>
            <div className={dialogInfoBodyClassName}>
                {/* 순서 사이 24 · 문장과 그림 사이 16(시안). */}
                <ol className="flex list-none flex-col gap-6">
                    {MANUAL_STEPS.map((step, index) => (
                        <li key={step.instruction} className="flex flex-col gap-4">
                            {/* 순서 문장은 그 아래 그림까지 아우르는 단계의 머리라 heading 으로 둔다 —
                                크기·굵기만 제목처럼인 문단으로 두면 "제목처럼 보이는데 제목이 아닌 글"이 되고
                                (WAVE "Possible heading"), 스크린리더에서 단계 사이를 제목으로 건너뛸 수도 없다.
                                모달 제목(DialogTitle=h2) 아래 단계라 h3 이다[6.4.2]. 순번은 장식이라
                                (ListMarker=aria-hidden) 제목 이름에는 문장만 남는다. */}
                            <h3 className="typo-title-m-bold text-foreground flex">
                                <ListMarker type="ordered" level={1} index={index + 1} typography="inherit" />
                                <span className="min-w-0">{step.instruction}</span>
                            </h3>
                            {/* 정해진 폭 안에서 원본 비율대로 줄어든다 — 정적 import 라 크기를 알고 있어
                                레이아웃이 흔들리지 않는다[NA-005]. */}
                            <Image src={step.image} alt={step.alt} sizes="508px" className="h-auto w-full" />
                        </li>
                    ))}
                </ol>
            </div>
            {/* CTA 가 없어도 아래 여백은 스크롤 영역 밖에 둔다 — 본문이 카드 맨 가장자리에서 끊기지 않는다. */}
            <div aria-hidden="true" className={dialogBodyEndClassName} />
        </DialogContent>
    </Dialog>
)

export {CitationManualDialog}
export type {CitationManualDialogProps}
