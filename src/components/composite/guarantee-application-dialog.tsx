'use client'

import {useState, type ReactNode} from 'react'
import {showCheckToast} from '@/components/custom/check-toast'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 보증신청 모달 — 보증신청으로 넘어갈지 묻고, 넘어간 뒤 무엇이 일어나는지 함께 알린다
// (Figma "[신속표준모형 KTRS-FM] m_보증신청"). 5단계 완료 화면의 [보증신청] 이 연다.
//
// [예] 를 누르면 모달이 닫히고 완료 토스트가 뜬다(자동저장 토스트와 같은 체크 동그라미·자리).
// 신청 API 는 handleConfirm 에 붙인다.

const GUARANTEE_DONE_MESSAGE = '보증 신청이 완료되었습니다'
// 같은 id 를 주어 여러 번 눌러도 토스트가 쌓이지 않게 한다.
const GUARANTEE_TOAST_ID = 'guarantee-application-done'

// 물음 뒤에 붙는 안내 — 시안은 두 줄이고, 두 문장이 각각 다른 사실을 말하므로 줄을 나눠 둔다.
// 모달의 설명이 되는 안내 상자의 id — 한 화면에 이 모달은 하나뿐이라 고정값으로 둔다.
const GUARANTEE_NOTES_ID = 'guarantee-application-notes'

const GUARANTEE_NOTES: readonly string[] = [
    '관할 기술평가 센터에서 평가를 진행합니다.',
    "평가 완료 시, '보증신청 결과' 탭에서 결과를 확인 할 수 있습니다.",
]

type GuaranteeApplicationDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [예] 를 눌렀을 때 함께 부를 동작(신청 API 등). 모달 닫기와 완료 토스트는 이 컴포넌트가 한다. */
    onConfirm?: () => void
}

const GuaranteeApplicationDialog = ({children, defaultOpen, onConfirm}: GuaranteeApplicationDialogProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false)

    // [예] 를 누르면 도는 흐름 — ① 신청 요청 ② 모달 닫기 ③ 완료 토스트.
    // [프론트엔드 연동] 아래 console.log 자리를 보증신청 API 호출로 바꾸고, 성공했을 때만 ②③ 을 실행한다.
    // 완료 토스트의 문구는 GUARANTEE_DONE_MESSAGE, 모양·위치는 공통 완료 토스트(showCheckToast)가 갖는다.
    const handleConfirm = () => {
        console.log('[보증신청] 신청 요청', {doneMessage: GUARANTEE_DONE_MESSAGE})
        onConfirm?.()
        setIsOpen(false)
        showCheckToast(GUARANTEE_DONE_MESSAGE, {id: GUARANTEE_TOAST_ID})
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 물음이 제목이 되므로 설명은 그 아래 안내 두 줄이 맡는다 — 그 상자를 aria-describedby 로 잇는다. */}
            <DialogContent aria-describedby={GUARANTEE_NOTES_ID}>
                <DialogHeader>
                    <DialogTitle>보증신청</DialogTitle>
                </DialogHeader>
                {/* 물음과 안내 사이 16(시안). 안내 두 줄은 붙여 둔다. */}
                <div className={cn(dialogBodyClassName, 'gap-4')}>
                    {/* 물음은 아래 안내와 [예]·[아니오] 를 이끄는 머리라 heading 으로 둔다 — 크기·굵기만
                        제목처럼인 문단으로 두면 "제목처럼 보이는데 제목이 아닌 글"이 된다
                        (WAVE "Possible heading"). 모달 제목(h2) 아래 단계라 h3 이다[6.4.2]. */}
                    <h3 className="typo-title-l-bold text-foreground">보증신청을 진행하시겠습니까?</h3>
                    <div id={GUARANTEE_NOTES_ID} className="flex flex-col">
                        {GUARANTEE_NOTES.map((note) => (
                            <p key={note} className="typo-body-xl-regular text-foreground">
                                {note}
                            </p>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="tertiary" size="xl">
                            아니오
                        </Button>
                    </DialogClose>
                    <Button size="xl" onClick={handleConfirm}>
                        예
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// 완료 문구·토스트 id 는 신청 완료 단독 화면(complete/guarantee-application/application-complete)도
// 그대로 쓴다 — 같은 완료 안내를 두 곳에서 따로 적지 않는다.
export {GUARANTEE_DONE_MESSAGE, GUARANTEE_TOAST_ID, GuaranteeApplicationDialog}
export type {GuaranteeApplicationDialogProps}
