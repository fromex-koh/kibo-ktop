'use client'

// 'use client' — 서버에서 그리면 aria-describedby={undefined} 가 전달 중에 빠져 Radix 가 없는 설명 id 를 붙인다.
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
import {
    MARKETING_CONSENT_ACTIONS,
    MARKETING_CONSENT_FOOTNOTES,
    MARKETING_CONSENT_NOTICE,
    MARKETING_CONSENT_SECTIONS,
    MARKETING_CONSENT_TITLE,
} from '@/content/service/k-bigx-marketing-consent'
import {cn} from '@/lib/utils'

// 마케팅 정보 수신 동의 모달 — [선택] 안내 → 1 · 2 항목 → ※ 안내 → [동의안함] [동의 후 이용].
//
// 쓰는 곳 (본문 · 버튼은 같고 제목만 다르다)
//   · K-BIGx 이용약관 동의 모달의 마케팅 항목 [자세히] — k-bigx-terms-agreement-dialog.tsx
//   · 마이페이지 내 정보의 마케팅 알림 수신 동의 [자세히] — mypage-profile-form.tsx (title 로 제목만 바꾼다)
//
// [프론트엔드 연동]
//   · 문구는 content/service/k-bigx-marketing-consent.ts 에만 있다 — 문구를 서버에서 받게 되면 그 파일만 바꾼다.
//   · 두 버튼은 누르면 모달을 닫고 onAgree / onDecline 을 부른다. 동의 값 저장은 부르는 쪽이 맡는다.
//   · X · Esc · 바깥 클릭으로 닫으면 아무것도 부르지 않는다 — 동의 값은 그대로다.
//
// 시안: "K-BIGx 보고서_K-BIGx 이용약관 (필수)/마케팅 알림 수신 동의 (선택)"(40007590:12112) — 폭 588 · 여백 32.

type KbigxMarketingConsentDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [동의안함]을 눌렀을 때. 모달은 스스로 닫힌다. */
    onDecline?: () => void
    /** [동의 후 이용]을 눌렀을 때. 모달은 스스로 닫힌다. */
    onAgree?: () => void
    /** 제목 — 없으면 K-BIGx 서비스 문구. 마이페이지 내 정보는 MYPAGE_MARKETING_CONSENT_TITLE 을 넘긴다. */
    title?: string
}

const KbigxMarketingConsentDialog = ({
    children,
    defaultOpen,
    onDecline,
    onAgree,
    title = MARKETING_CONSENT_TITLE,
}: KbigxMarketingConsentDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
            제목 줄과 맞춘다(오른쪽·위 32). */}
        <DialogContent
            aria-describedby={undefined}
            className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8"
        >
            <DialogHeader className="sm:px-8 sm:pt-8">
                {/* 좁은 화면에서는 "K-BIGx(기업혁신성장보고서)" 처럼 긴 낱말이 한 줄을 넘는다 — break-keep 은 두되
                    넘칠 때만 낱말 안에서 끊는다. wrap-break-word 는 최소 폭 계산에 들어가지 않아 모달 격자가 그 낱말
                    폭만큼 넓어지므로(360 화면에서 모달 밖으로 넘침) wrap-anywhere 를 쓴다. */}
                <DialogTitle className="wrap-anywhere break-keep">{title}</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogInfoBodyClassName, 'gap-6 break-keep sm:px-8')}>
                <section className="flex flex-col gap-2">
                    <h2 className="typo-title-m-bold text-foreground">{MARKETING_CONSENT_NOTICE.title}</h2>
                    <ul className="bg-surface-subtle typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2 rounded-sm p-5">
                        {MARKETING_CONSENT_NOTICE.items.map((item) => (
                            <li key={item} className="flex">
                                <ListMarker type="unordered-small" />
                                <span className="min-w-0">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
                {MARKETING_CONSENT_SECTIONS.map((section) => (
                    <section key={section.title} className="flex flex-col gap-2">
                        <h2 className="typo-title-m-bold text-foreground">{section.title}</h2>
                        <ul className="typo-body-xl-regular text-label-foreground flex list-none flex-col gap-2">
                            {section.items.map((item) => (
                                <li key={item} className="flex">
                                    <ListMarker type="unordered" />
                                    <span className="min-w-0">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
                <div className="typo-body-m-regular text-foreground-subtle flex flex-col gap-2">
                    {MARKETING_CONSENT_FOOTNOTES.map((note) => (
                        <p key={note}>{note}</p>
                    ))}
                </div>
            </div>
            <DialogFooter className="sm:gap-2 sm:px-8">
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl" onClick={onDecline}>
                        {MARKETING_CONSENT_ACTIONS.decline}
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" size="xl" onClick={onAgree}>
                        {MARKETING_CONSENT_ACTIONS.agree}
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {KbigxMarketingConsentDialog}
export type {KbigxMarketingConsentDialogProps}
