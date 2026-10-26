'use client'

import type {ReactNode} from 'react'
import {FileBadge, ShieldCheck, type LucideIcon} from 'lucide-react'
import {ListMarker} from '@/components/custom/list-marker'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogBodyClassName, dialogBodyEndClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 인증서 선택 모달 — 약정서 전자서명의 [인증서로 인증하기]를 누르면 뜬다.
// 공동인증서 · 금융인증서 중 하나를 누르면 그 인증서로 로그인을 시작한다(누르는 것이 곧 실행 — 아래 CTA 없음).
//
// 안내 문단 아래 점 한 줄로 지금 어떤 인증을 하는지 알린다(target — 예: "법인인증 — 사업장(법인) 인증서로 인증합니다.").
//
// [프론트엔드 연동] 전자서명 모달 안에서는 따로 연결할 것이 없다 — 인증 모듈은 ESignatureDialog 의 onCertify 에 붙인다.
// 이 모달을 단독으로 쓸 때만 onSelect('joint' | 'financial')로 고른 인증서를 받는다.

type CertificateType = 'joint' | 'financial'

const CERTIFICATE_OPTIONS: readonly {value: CertificateType; icon: LucideIcon; title: string; description: string}[] = [
    {
        value: 'joint',
        icon: ShieldCheck,
        title: '공동인증서 로그인',
        description: '개인 컴퓨터, USB 등에 보관되어 있는 인증서로 로그인',
    },
    {
        value: 'financial',
        icon: FileBadge,
        title: '금융인증서 로그인',
        description: '은행앱 또는 인터넷뱅킹에서 발급한 금융결제원 인증서로 로그인',
    },
]

// 항목 버튼 — 평소 회색 테두리, 마우스를 올리거나 누르면 파란 테두리 · 옅은 파랑 면 · 파란 굵은 제목.
// 설명 · 아이콘도 같은 파랑으로 바뀐다(group 으로 안쪽 글자까지 함께 바꾼다).
// 키보드 포커스는 포커스 링만 그린다 — 모달이 열리며 첫 항목에 포커스가 가는데, 누른 모양까지 주면 고른 것처럼 보인다.
const OPTION_CLASS_NAME = cn(
    'group/certificate border-control bg-card text-foreground flex w-full items-center gap-4 rounded-sm border px-6 py-4 text-left transition-colors',
    'outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
    'hover:border-primary hover:bg-secondary hover:text-secondary-foreground',
    'active:border-primary active:bg-secondary active:text-secondary-foreground',
)
const OPTION_TITLE_CLASS_NAME =
    'typo-body-xl-regular group-hover/certificate:font-bold group-active/certificate:font-bold'
const OPTION_DESCRIPTION_CLASS_NAME =
    'typo-body-l-regular text-foreground-subtle group-hover/certificate:text-secondary-foreground group-active/certificate:text-secondary-foreground'

type CertificateSelectDialogProps = {
    /** 모달을 여는 버튼. 넘기지 않으면 defaultOpen · open 으로만 연다. */
    children?: ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 지금 하는 인증 안내 한 줄. 넘기지 않으면 목록을 그리지 않는다. */
    target?: string
    /** 인증서 항목을 눌렀을 때(인증 모듈 연동 자리). */
    onSelect?: (certificate: CertificateType) => void
    /** 닫힌 뒤 포커스를 어디로 돌릴지 바꿀 때 — 부른 모달이 결과 자리로 옮길 때 쓴다(Radix onCloseAutoFocus). */
    onCloseAutoFocus?: (event: Event) => void
}

const CertificateSelectDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    target,
    onSelect,
    onCloseAutoFocus,
}: CertificateSelectDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
            <DialogHeader>
                <DialogTitle>인증서 선택</DialogTitle>
            </DialogHeader>
            {/* 안내 문단 · 인증 안내 · 항목 목록 사이 16 · 항목 사이 8. */}
            <div className={cn(dialogBodyClassName, 'gap-4')}>
                {/* 큰 Bold 글자를 <p> 로 두면 WAVE 가 "Possible heading" 으로 잡아 블록 span 으로 그린다(설명 연결은 그대로). */}
                <DialogDescription asChild>
                    <span className="typo-title-l-bold text-foreground block">
                        약정서 제출을 위한 전자서명이 필요합니다.
                        <br />
                        인증서 방식을 선택해주세요.
                    </span>
                </DialogDescription>
                {target ? (
                    <ul className="list-none">
                        <li className="typo-body-xl-regular text-label-foreground flex">
                            <ListMarker />
                            <span className="min-w-0">{target}</span>
                        </li>
                    </ul>
                ) : null}
                <ul className="flex list-none flex-col gap-2">
                    {CERTIFICATE_OPTIONS.map(({value, icon: OptionIcon, title, description}) => (
                        <li key={value}>
                            <button type="button" className={OPTION_CLASS_NAME} onClick={() => onSelect?.(value)}>
                                <OptionIcon aria-hidden="true" className="size-icon-xl shrink-0" strokeWidth={1.5} />
                                <span className="flex min-w-0 flex-col break-keep">
                                    <span className={OPTION_TITLE_CLASS_NAME}>{title}</span>
                                    <span className={OPTION_DESCRIPTION_CLASS_NAME}>{description}</span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* CTA 가 없는 모달 — 아래 여백 40 은 이 빈 구획이 맡는다. */}
            <div aria-hidden="true" className={dialogBodyEndClassName} />
        </DialogContent>
    </Dialog>
)

export {CertificateSelectDialog}
export type {CertificateSelectDialogProps, CertificateType}
