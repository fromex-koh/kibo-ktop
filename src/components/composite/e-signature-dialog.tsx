'use client'

import type {ReactNode} from 'react'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'

// 약정서 전자서명 모달 — 약정서를 내려면 법인(사업자)인증과 개인인증을 모두 거쳐야 한다고 알린다
// (Figma "[기술평가_공통모달] 약정서 전자서명"). 기술평가 네 모형과 마이페이지 대표자 이력의
// (1) 고객정보활용동의가 같은 모달을 쓴다 — 그래서 화면마다 두지 않고 공통 컴포넌트로 둔다.
//
// 인증 두 가지는 외부 인증 연동 자리라 지금은 눌러도 아무 일도 하지 않는다 —
// 붙일 때 onCorporate·onPersonal 을 넘긴다.

// 시안은 두 문장을 각자 한 줄에 둔다 — 한 문자열로 두면 폭에 따라 문장 중간에서 접힌다.
const SIGNATURE_NOTICE = [
    '약정서 제출을 위한 전자서명이 필요합니다.',
    '법인(사업자)인증과 개인인증을 진행해주시기 바랍니다.',
]

const SIGNATURE_GUIDES = [
    '법인인증은 사업장인증서로, 개인인증은 대표자인증서로 진행이 가능합니다.',
    '법인인증과 개인인증 모두 인증하셔야 완료됩니다.',
]

type ESignatureDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [법인인증]·[개인인증] 을 눌렀을 때(외부 인증 연동 자리). */
    onCorporate?: () => void
    onPersonal?: () => void
}

const ESignatureDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    onCorporate,
    onPersonal,
}: ESignatureDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>약정서 전자서명</DialogTitle>
            </DialogHeader>
            <div className={dialogInfoBodyClassName}>
                {/* 안내 문단과 아래 목록 사이 16(시안). */}
                <div className="flex flex-col gap-4">
                    <DialogDescription className="typo-title-m-bold text-foreground">
                        {SIGNATURE_NOTICE[0]}
                        <br />
                        {SIGNATURE_NOTICE[1]}
                    </DialogDescription>
                    {/* 순서가 뜻을 갖지 않는 안내 두 줄이라 점 목록이다. */}
                    <ul className="flex list-none flex-col">
                        {SIGNATURE_GUIDES.map((guide) => (
                            <li key={guide} className="typo-body-xl-regular text-label-foreground flex">
                                <ListMarker />
                                <span className="min-w-0">{guide}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* 두 인증은 순서가 없고 둘 다 해야 끝난다 — 시안대로 같은 폭으로 나란히 둔다.
                닫히면 안 되므로 DialogClose 로 감싸지 않는다. */}
            <DialogFooter>
                <Button variant="tertiary" size="xl" onClick={onCorporate}>
                    법인인증
                </Button>
                <Button size="xl" onClick={onPersonal}>
                    개인인증
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {ESignatureDialog}
export type {ESignatureDialogProps}
