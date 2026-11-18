'use client'

import {useState, type ReactNode} from 'react'
import {ExternalLink} from 'lucide-react'
import {ConfirmDialog, ConfirmTarget} from '@/components/composite/confirm-dialog'
import {Button} from '@/components/ui/button'

// 외부 사이트 이동 버튼 — 누르면 이동 확인 모달이 열리고(Radix 가 aria-haspopup · 포커스 복귀를 맡는다[8.2.1]), [확인] 을 누를 때만
// 새 탭으로 연다 — 누르자마자 다른 사이트로 넘어가지 않게 한 번 묻는다[7.2.1]. 버튼 끝에 외부 링크 아이콘(꾸밈)이 붙는다.
// 쓰는 곳: custom/platform-carbon-neutrality.tsx(탄소중립 플랫폼 · 진단 시작하기).

type PlatformExternalLinkDialog = {
    /** 모달 제목(예: 탄소중립 플랫폼 이동). */
    title: string
    /** 이동할 사이트 이름 — 물음에서 굵게 드러난다. */
    siteName: string
    /** 물음 끝 문장(예: 페이지로 이동하시겠습니까?). */
    question: string
}

const PlatformExternalLinkButton = ({
    href,
    dialog,
    children,
    variant = 'default',
}: {
    href: string
    dialog: PlatformExternalLinkDialog
    children: ReactNode
    variant?: 'default' | 'secondary'
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const openSite = () => {
        window.open(href, '_blank', 'noopener,noreferrer')
        setIsOpen(false)
    }

    return (
        <ConfirmDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            title={dialog.title}
            question={
                // 좁은 화면에서 낱말 중간('제공됩니|다.')이 끊기지 않게 낱말 단위로 줄을 바꾼다.
                <span className="break-keep">
                    해당 서비스는 &lsquo;<ConfirmTarget>{dialog.siteName}</ConfirmTarget>&rsquo;에서 제공됩니다.
                    <br />
                    {dialog.question}
                    <span className="sr-only"> (확인을 누르면 새 창에서 열림)</span>
                </span>
            }
            onConfirm={openSite}
        >
            <Button type="button" size="lg" variant={variant}>
                {children}
                <ExternalLink aria-hidden="true" />
            </Button>
        </ConfirmDialog>
    )
}

export {PlatformExternalLinkButton}
export type {PlatformExternalLinkDialog}
