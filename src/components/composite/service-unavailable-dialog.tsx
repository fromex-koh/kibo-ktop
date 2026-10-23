'use client'

import type {ReactNode} from 'react'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {
    SERVICE_UNAVAILABLE_CONTACT,
    getServiceUnavailableMessages,
    getServiceUnavailableTitle,
    type UnavailableService,
} from '@/content/service/service-unavailable'
import {cn} from '@/lib/utils'

// 서비스 이용 불가 안내 — 기관 회원은 서비스별로 계정이 따로라, 할당되지 않은 서비스의 GNB 메뉴에 들어오면 뜬다.
// 제목 → 안내 문구 → 문의전화(가운데) → 풀폭 [확인]. 닫기(X) 없이 [확인]으로만 닫는다.
// 서비스(service)마다 이름만 바뀐다 — 기관 개별평가(기술평가) · 기관 K-BIGx 보고서(K-BIGx).
//
// [프론트엔드 연동]
//   · 여는 조건(그 서비스 이용 권한이 없는 계정)은 로그인 정보로 판단해 open 으로 연다.
//   · [확인] 뒤 이동할 곳이 있으면 onConfirm 에서 처리한다. 넘기지 않으면 모달만 닫힌다.
//   · 문구는 content/service/service-unavailable.ts 에만 있다.

export type ServiceUnavailableDialogProps = {
    /** 안내할 서비스 — 'technology-evaluation'(기술평가) · 'k-bigx'(K-BIGx). */
    service: UnavailableService
    /** 모달을 여는 버튼. 넘기지 않으면 defaultOpen · open 으로만 연다. */
    children?: ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [확인]을 눌렀을 때. 모달은 스스로 닫힌다. */
    onConfirm?: () => void
}

const ServiceUnavailableDialog = ({
    service,
    children,
    defaultOpen,
    open,
    onOpenChange,
    onConfirm,
}: ServiceUnavailableDialogProps) => {
    const [message, guide] = getServiceUnavailableMessages(service)

    return (
        <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>{getServiceUnavailableTitle(service)}</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogBodyClassName, 'gap-6')}>
                    {/* 큰 Bold 글자를 <p> 로 두면 WAVE 가 "Possible heading" 으로 잡아 블록 span 으로 그린다(설명 연결은 그대로). */}
                    <DialogDescription asChild>
                        <span className="block break-keep">
                            {message}
                            <br className="max-sm:hidden" /> {guide}
                        </span>
                    </DialogDescription>
                    <p className="typo-body-xl-medium text-foreground text-center">{SERVICE_UNAVAILABLE_CONTACT}</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" size="xl" onClick={onConfirm}>
                            확인
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {ServiceUnavailableDialog}
