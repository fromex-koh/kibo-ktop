'use client'

// 'use client' — 서버 컴포넌트로 두면 DialogContent 에 넘긴 aria-describedby={undefined} 가 서버→클라이언트
// 전달 중에 빠져 Radix 가 없는 설명 id 를 붙인다(WAVE "Broken ARIA reference"). 클라이언트에서 그려 값을 지킨다.
import type {ReactNode} from 'react'
import {ListMarker} from '@/components/custom/list-marker'
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
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {LEGAL_BASIS_NOTICE, LEGAL_BASIS_SECTIONS, LEGAL_BASIS_TITLE} from '@/content/service/k-bigx-legal-basis'
import {cn} from '@/lib/utils'

// 기업정보 제공법적 근거 — 시안 "K-BIGx 보고서_기업혁신성장_기업정보 제공법적 근거"(40007590:14127).
// 회색 안내(근거법령) → 1~6 항목 → [닫기]. 내용이 길어 본문 구획이 모달 안에서 스크롤된다.
//
// 시안 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목과 안내 24 · 항목 사이 24 ·
// 항목 제목(18 Bold)과 내용 8 · 단락 사이 8 · 본문 16(도입 문장만 Medium) · 안내 상자(gray.10 · 반경 8 · 여백 20 · 14).
// 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type KbigxLegalBasisDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const KbigxLegalBasisDialog = ({children, defaultOpen}: KbigxLegalBasisDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
            제목 줄과 맞춘다(오른쪽·위 32). */}
        <DialogContent
            aria-describedby={undefined}
            className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8"
        >
            <DialogHeader className="sm:px-8 sm:pt-8">
                <DialogTitle>{LEGAL_BASIS_TITLE}</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogInfoBodyClassName, 'gap-6 break-keep sm:px-8')}>
                <ul className="bg-surface-subtle typo-body-l-regular text-foreground-subtle flex list-none flex-col rounded-sm p-5">
                    <li className="flex">
                        <ListMarker type="unordered-small" />
                        <span className="min-w-0">{LEGAL_BASIS_NOTICE}</span>
                    </li>
                </ul>
                {LEGAL_BASIS_SECTIONS.map((section) => (
                    <section key={section.title} className="flex flex-col gap-2">
                        <h2 className="typo-title-m-bold text-foreground">{section.title}</h2>
                        {section.paragraphs.map((paragraph) => (
                            <p
                                key={paragraph.lines[0]}
                                className={
                                    paragraph.isLead
                                        ? 'typo-body-xl-medium text-foreground'
                                        : 'typo-body-xl-regular text-label-foreground'
                                }
                            >
                                {paragraph.lines.map((line) => (
                                    <span key={line} className="block">
                                        {line}
                                    </span>
                                ))}
                            </p>
                        ))}
                    </section>
                ))}
            </div>
            <DialogFooter className="sm:px-8">
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        닫기
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {KbigxLegalBasisDialog}
export type {KbigxLegalBasisDialogProps}
