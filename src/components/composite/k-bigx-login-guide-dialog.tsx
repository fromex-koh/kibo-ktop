'use client'

// 'use client' — 다른 K-BIGx 모달과 같이 클라이언트에서 그린다(서버에서 넘긴 undefined 속성이 빠지는 문제를 피한다).

import type {ReactNode} from 'react'
import Link from 'next/link'
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
import {LOGIN_GUIDE_MESSAGE, LOGIN_GUIDE_TITLE} from '@/content/service/k-bigx-login-guide'
import {cn} from '@/lib/utils'

// K-BIGx 보고서 이용 안내 — 시안 "K-BIGx 보고서_K-BIGx 보고서 이용 안내"(40007590:12034).
// 로그인하지 않은 채 기술혁신정보를 이용하려 할 때 뜬다. 안내(20 Bold, 두 줄) → [닫기] [로그인하기].
//
// 시안 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목과 안내 24 · 안내와 버튼 24 ·
// 두 버튼 사이 8 · 아래 24. 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type KbigxLoginGuideDialogProps = {
    /** [로그인하기]가 향할 로그인 화면. */
    loginHref: string
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const KbigxLoginGuideDialog = ({loginHref, children, defaultOpen}: KbigxLoginGuideDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
            제목 줄과 맞춘다(오른쪽·위 32). */}
        <DialogContent className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8">
            <DialogHeader className="sm:px-8 sm:pt-8">
                <DialogTitle className="break-keep">{LOGIN_GUIDE_TITLE}</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'break-keep sm:px-8')}>
                {/* 안내 문장은 모달 설명(DialogDescription)이다 — 20 Bold 라 <p> 로 두면 WAVE 가 "Possible heading" 으로
                    잡는다. 설명으로 이어 두면 모달이 열릴 때 제목 다음에 읽히고, 블록 span 이라 제목으로 오인되지 않는다. */}
                <DialogDescription asChild>
                    <span className="typo-title-l-bold text-foreground block">
                        {LOGIN_GUIDE_MESSAGE.map((line) => (
                            <span key={line} className="block">
                                {line}
                            </span>
                        ))}
                    </span>
                </DialogDescription>
            </div>
            <DialogFooter className="sm:gap-2 sm:px-8">
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        닫기
                    </Button>
                </DialogClose>
                <Button asChild size="xl">
                    <Link href={loginHref}>로그인하기</Link>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {KbigxLoginGuideDialog}
export type {KbigxLoginGuideDialogProps}
