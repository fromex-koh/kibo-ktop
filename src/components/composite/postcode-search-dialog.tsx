'use client'

import type {ReactNode} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 우편번호 검색 모달 — 주소를 받는 화면이 함께 쓴다(회원가입 흐름의 우편번호 검색 · 자가진단의 기업 주소).
// 본문은 Kakao(다음) 우편번호 위젯이 들어올 자리다. 연동할 때는 이 안만 바꾸면 쓰는 화면은 그대로다.
//
// 여는 방법 두 가지 — 버튼을 children 으로 넘기면 그 버튼이 트리거가 되고(실제 화면),
// defaultOpen 만 주면 트리거 없이 열린 모습을 보여준다(모달 자체를 확인하는 목업 화면).
type PostcodeSearchDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때. */
    defaultOpen?: boolean
    /** 모달 제목. 부르는 버튼과 같은 말을 쓴다(주소 검색 버튼 → "주소 검색"). */
    title?: string
}

const PostcodeSearchDialog = ({children, defaultOpen, title = '우편번호 검색'}: PostcodeSearchDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 위젯이 들어올 자리라 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {/* CTA 가 없으므로 아래 여백 40 은 본문이 갖는다. */}
            <div className={cn(dialogBodyClassName, 'pb-10')}>
                <p className="bg-accent-subtle typo-title-l-bold text-foreground flex min-h-100 items-center justify-center text-center">
                    Kakao(다음) 우편번호 검색 영역
                </p>
            </div>
        </DialogContent>
    </Dialog>
)

export {PostcodeSearchDialog}
