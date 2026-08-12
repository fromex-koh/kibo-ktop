'use client'

import type {ReactNode} from 'react'
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

// 제출 전 최종 확인 모달 — 제출을 되돌릴 수 없으므로 한 번 더 묻는다
// (Figma "[신속표준모형 KTRS-FM] m_제출 전 최종 확인"). 4단계 최종 확인 화면의 [제출] 이 연다.
//
// 물음 하나와 버튼 둘뿐이라 보이는 제목과 닫기(X)를 두지 않는다 — 대표자 경력사항의 근무기간 알림,
// 로그인 안내 모달과 같은 구성이다. 제목은 화면에서 빼되 스크린리더에는 남긴다: 대화상자에는 이름이
// 있어야 한다[8.2.1].

const SUBMIT_QUESTION = '제출하시겠습니까?'

type SubmitConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때(폼 검사를 통과한 뒤 등). open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [제출] 을 눌렀을 때. 넘기지 않으면 아무 일도 하지 않는다(제출 연동 전). */
    onSubmit?: () => void
}

const SubmitConfirmDialog = ({children, defaultOpen, open, onOpenChange, onSubmit}: SubmitConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 설명 없이 제목(물음)과 버튼뿐이라 aria-describedby 를 비운다 — 넘기지 않으면 Radix 가 설명이
            빠졌다고 경고한다. */}
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
            {/* 물음은 머리 구획(첫 행)에 둔다 — CTA 는 행을 지정하지 않고 자동 배치라(dialog.variants 참고),
                머리를 빼면 CTA 가 첫 행으로 올라와 버튼이 물음 위에 놓인다.
                여백은 시안의 물음 블록(위아래 32)에 맞춘다. */}
            <DialogHeader className="px-6 py-8 sm:px-10">
                {/* 시안의 물음은 20px Bold 가운데 정렬이다 — 안내 문장이 아니라 물음이라 본문색을 쓴다.
                    이 물음이 곧 모달의 제목이라 DialogTitle(h2)로 둔다 — 크기·굵기만 제목처럼인 문단으로
                    두면 "제목처럼 보이는데 제목이 아닌 글"이 된다(WAVE "Possible heading").
                    pe-0 은 닫기(X) 자리를 비우는 기본 여백을 되돌린다(이 모달은 X 를 두지 않는다). */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {SUBMIT_QUESTION}
                </DialogTitle>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                {/* 제출 흐름(저장 API · 완료 화면 이동)은 아직 없다 — 붙일 때 onSubmit 을 넘긴다. */}
                <Button size="xl" onClick={onSubmit}>
                    제출
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {SubmitConfirmDialog}
export type {SubmitConfirmDialogProps}
