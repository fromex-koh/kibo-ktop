'use client'

import {useState, type ReactNode} from 'react'
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
// [예] 를 누르면 이 모달이 닫히고 완료 모달이 이어서 뜬다 — 은행전송 완료 모달과 같은 방식이다
// (원래는 완료 토스트였으나 모달로 바꾸기로 결정됨). 신청 API 는 handleConfirm 에 붙인다.

const GUARANTEE_DONE_MESSAGE = '보증신청이 완료되었습니다.'

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
    /** [예] 를 눌렀을 때 함께 부를 동작(신청 API 등). 모달 닫기와 완료 모달 열기는 이 컴포넌트가 한다. */
    onConfirm?: () => void
}

type GuaranteeApplicationCompleteDialogProps = {
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

// 보증신청 완료 — 위 보증신청 모달에서 [예] 를 누르면 이어서 뜨고, 화면정의서의 하위 화면(단독 확인
// 화면)에서도 쓴다. 은행 전송완료 모달(BankTransferResultDialog)과 같은 구성이다 —
// 물음이 아니라 알림이라 닫기(X)를 두지 않고, 버튼은 [확인] 하나가 전체 폭을 쓴다.
// 화면에 보이는 알림 문구가 곧 이 대화상자의 이름이다(DialogTitle) — 대화상자에는 이름이 있어야 한다[8.2.1].
const GuaranteeApplicationCompleteDialog = ({
    defaultOpen,
    open,
    onOpenChange,
}: GuaranteeApplicationCompleteDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {/* 은행 전송완료와 같은 카드 높이(시안 273 ≈ min-h-68)를 지킨다 — 알림 문구 한 줄이어도
            모달 크기가 다른 완료 알림과 달라 보이지 않게 한다. */}
        {/* 알림 문구가 곧 제목이고 다른 본문이 없다 — aria-describedby 를 비우지 않으면 Radix 가
            설명이 빠졌다고 경고한다. */}
        <DialogContent showCloseButton={false} className="min-h-68" aria-describedby={undefined}>
            {/* 머리 구획은 비워 둔다 — 시안의 위쪽 여백이자, CTA 가 자동 배치라 첫 행을 채워 두어야
                버튼이 본문 위로 올라오지 않는다(dialog.variants 참고). */}
            <DialogHeader />
            {/* justify-center — 본문이 알림 한 줄뿐이라 가운데 행(1fr)의 남는 높이 안에서 세로 가운데에
                둔다(이 모달에서만 — 은행 전송완료는 문구가 위에 붙는 시안 그대로 둔다). */}
            <div className={cn(dialogBodyClassName, 'justify-center')}>
                {/* 이 문구가 곧 모달의 제목이라 DialogTitle(h2)로 둔다. pe-0 은 닫기(X) 자리를 비우는
                    기본 여백을 되돌린다(이 모달은 X 를 두지 않는다). */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {GUARANTEE_DONE_MESSAGE}
                </DialogTitle>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button size="xl" className="w-full">
                        확인
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

const GuaranteeApplicationDialog = ({children, defaultOpen, onConfirm}: GuaranteeApplicationDialogProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false)
    const [isCompleteOpen, setIsCompleteOpen] = useState(false)

    // [예] 를 누르면 도는 흐름 — ① 신청 요청 ② 모달 닫기 ③ 완료 모달 열기.
    // [프론트엔드 연동] 아래 console.log 자리를 보증신청 API 호출로 바꾸고, 성공했을 때만 ②③ 을 실행한다.
    const handleConfirm = () => {
        console.log('[보증신청] 신청 요청', {doneMessage: GUARANTEE_DONE_MESSAGE})
        onConfirm?.()
        setIsOpen(false)
        setIsCompleteOpen(true)
    }

    return (
        <>
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

            {/* [예] 를 누르면 이어서 뜨는 완료 알림 — 열림 상태만 이 컴포넌트가 쥔다. */}
            <GuaranteeApplicationCompleteDialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen} />
        </>
    )
}

// 완료 모달은 신청 완료 단독 화면(complete/guarantee-application/application-complete)도
// 그대로 쓴다 — 같은 완료 안내를 두 곳에서 따로 만들지 않는다.
export {GUARANTEE_DONE_MESSAGE, GuaranteeApplicationCompleteDialog, GuaranteeApplicationDialog}
export type {GuaranteeApplicationCompleteDialogProps, GuaranteeApplicationDialogProps}
