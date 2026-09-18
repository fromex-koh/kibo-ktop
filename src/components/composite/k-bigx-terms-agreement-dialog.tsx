'use client'

import {useId, useState, type ReactNode} from 'react'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {KbigxMarketingConsentDialog} from '@/components/composite/k-bigx-marketing-consent-dialog'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {Separator} from '@/components/ui/separator'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {
    TERMS_AGREEMENT_ALL,
    TERMS_AGREEMENT_ITEMS,
    TERMS_AGREEMENT_NOTICE,
    TERMS_AGREEMENT_TITLE,
    type TermsAgreementItemId,
} from '@/content/service/k-bigx-terms-agreement'
import {cn} from '@/lib/utils'

// K-BIGx 보고서 이용약관 동의 — 시안 "K-BIGx 보고서_K-BIGx 보고서 이용약관 동의"(40007590:12048).
// 안내(회색 상자) → 동의 상자[이용약관 전체 동의 / 구분선 / 항목별 동의 + 자세히] → [동의안함] [동의 후 이용].
// 전체 동의는 두 항목을 함께 켜고 끄며, 한 항목만 켜지면 '일부'(indeterminate) 상태가 된다.
// [자세히] — 이용약관은 K-BIGx 이용약관 화면을 새 창으로, 마케팅은 마케팅 정보 수신 동의 모달을 연다.
//
// 시안 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목과 안내 24 · 안내와 동의 상자 24 ·
// 동의 상자(테두리 gray.100 · 반경 16 · 여백 위아래·왼쪽 24, 오른쪽 40) · 전체 동의와 구분선 16 · 구분선과 항목 16 · 항목 줄 32 · 줄 사이 8 ·
// 두 버튼 사이 8. 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type AgreementState = Record<TermsAgreementItemId, boolean>

const INITIAL_AGREEMENT: AgreementState = {terms: false, marketing: false}

type KbigxTermsAgreementDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [동의안함] · [동의 후 이용]을 눌렀을 때. [프론트엔드 연동] 동의 결과를 저장하고 다음 단계로 넘긴다. */
    onDecline?: () => void
    onAgree?: (agreement: AgreementState) => void
}

const KbigxTermsAgreementDialog = ({children, defaultOpen, onDecline, onAgree}: KbigxTermsAgreementDialogProps) => {
    const [agreement, setAgreement] = useState<AgreementState>(INITIAL_AGREEMENT)
    const idPrefix = useId()
    const isAllChecked = TERMS_AGREEMENT_ITEMS.every((item) => agreement[item.id])
    const isSomeChecked = TERMS_AGREEMENT_ITEMS.some((item) => agreement[item.id])

    const setAll = (checked: boolean) => setAgreement({terms: checked, marketing: checked})
    const setItem = (id: TermsAgreementItemId, checked: boolean) =>
        setAgreement((current) => ({...current, [id]: checked}))

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
                제목 줄과 맞춘다(오른쪽·위 32). */}
            <DialogContent
                aria-describedby={undefined}
                className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8"
            >
                <DialogHeader className="sm:px-8 sm:pt-8">
                    <DialogTitle className="break-keep">{TERMS_AGREEMENT_TITLE}</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogInfoBodyClassName, 'gap-6 break-keep sm:px-8')}>
                    <ul className="bg-surface-subtle typo-body-l-regular text-foreground-subtle flex list-none flex-col rounded-sm p-5">
                        <li className="flex">
                            <ListMarker type="unordered-small" />
                            <span className="min-w-0">{TERMS_AGREEMENT_NOTICE}</span>
                        </li>
                    </ul>

                    {/* 체크박스는 radix 가 <button> 으로 그린다 — <label for> 만으로는 WAVE 가 이름 없는 버튼으로
                        보므로 aria-labelledby 로 글자를 이름에 직접 잇는다[5.1.1]. */}
                    {/* 시안 — 동의 상자 안쪽은 왼쪽 24 · 오른쪽 40 이다(구분선·[자세히]가 오른쪽 끝에서 40 떨어진다).
                        좁은 화면(sm 미만)에서는 그 여백이 항목 이름 자리를 빼앗아 이름이 세 줄로 눌리므로 사방 20 으로 둔다. */}
                    <div className="border-subtle-3 flex flex-col gap-4 rounded-lg border p-5 sm:py-6 sm:ps-6 sm:pe-10">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id={`${idPrefix}-all`}
                                checked={isAllChecked ? true : isSomeChecked ? 'indeterminate' : false}
                                onCheckedChange={(checked) => setAll(checked === true)}
                                aria-labelledby={`${idPrefix}-all-label`}
                            />
                            <label
                                id={`${idPrefix}-all-label`}
                                htmlFor={`${idPrefix}-all`}
                                className="typo-body-xl-bold text-foreground"
                            >
                                {TERMS_AGREEMENT_ALL}
                            </label>
                        </div>
                        <Separator />
                        <ul className="flex list-none flex-col gap-2">
                            {TERMS_AGREEMENT_ITEMS.map((item) => {
                                const checkboxId = `${idPrefix}-${item.id}`
                                const detailButton = (
                                    <Button variant="text-underline" size="md" className="shrink-0 font-normal">
                                        자세히
                                        <span className="sr-only"> ({item.label})</span>
                                        <ChevronRight aria-hidden="true" className="size-4" />
                                    </Button>
                                )

                                return (
                                    <li
                                        key={item.id}
                                        className="flex min-h-8 items-start justify-between gap-3 sm:items-center sm:gap-4"
                                    >
                                        {/* 좁은 화면에서 이름이 두 줄로 접히면 체크박스·[자세히]는 첫 줄에 맞춘다(items-start). */}
                                        <div className="flex min-w-0 items-start gap-2 sm:items-center">
                                            <Checkbox
                                                id={checkboxId}
                                                checked={agreement[item.id]}
                                                onCheckedChange={(checked) => setItem(item.id, checked === true)}
                                                aria-labelledby={`${checkboxId}-label`}
                                            />
                                            <label
                                                id={`${checkboxId}-label`}
                                                htmlFor={checkboxId}
                                                className="typo-body-xl-bold text-foreground min-w-0 break-keep"
                                            >
                                                {item.label}
                                            </label>
                                        </div>
                                        {/* 어느 약관의 [자세히]인지 읽을 때 구분되도록 이름을 덧붙인다. */}
                                        {item.id === 'terms' ? (
                                            <Button
                                                asChild
                                                variant="text-underline"
                                                size="md"
                                                className="shrink-0 font-normal"
                                            >
                                                <Link
                                                    href="/corp/terms/k-bigx"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    자세히
                                                    <span className="sr-only"> ({item.label}, 새 창)</span>
                                                    <ChevronRight aria-hidden="true" className="size-4" />
                                                </Link>
                                            </Button>
                                        ) : (
                                            <KbigxMarketingConsentDialog
                                                onAgree={() => setItem('marketing', true)}
                                                onDecline={() => setItem('marketing', false)}
                                            >
                                                {detailButton}
                                            </KbigxMarketingConsentDialog>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <DialogFooter className="sm:gap-2 sm:px-8">
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl" onClick={onDecline}>
                            동의안함
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" size="xl" onClick={() => onAgree?.(agreement)}>
                            동의 후 이용
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {KbigxTermsAgreementDialog}
export type {KbigxTermsAgreementDialogProps}
