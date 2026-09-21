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
import {
    MARKETING_CONSENT_FOOTNOTES,
    MARKETING_CONSENT_NOTICE,
    MARKETING_CONSENT_SECTIONS,
    MARKETING_CONSENT_TITLE,
} from '@/content/service/k-bigx-marketing-consent'
import {cn} from '@/lib/utils'

// 마케팅 정보 수신 동의 — 시안 "K-BIGx 보고서_K-BIGx 이용약관 (필수)/마케팅 알림 수신 동의 (선택)"(40007590:12112).
// [선택] 안내(회색 상자) → 1·2 항목(점 목록) → ※ 안내 → [동의안함] [동의 후 이용].
// 내용이 화면보다 길면 본문 구획이 모달 안에서 스크롤된다.
//
// 시안 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목(24 Bold, 두 줄)과 내용 24 ·
// 묶음 사이 24 · 묶음 제목(18 Bold)과 내용 8 · 목록 줄 사이 8 · 본문 16 · 안내 상자(gray.10 · 반경 8 · 여백 20 · 14) ·
// ※ 안내 13 · 두 버튼 사이 8.
// 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type KbigxMarketingConsentDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [동의안함] · [동의 후 이용]을 눌렀을 때. [프론트엔드 연동] 동의 여부를 저장하고 다음 단계로 넘긴다. */
    onDecline?: () => void
    onAgree?: () => void
}

const KbigxMarketingConsentDialog = ({children, defaultOpen, onDecline, onAgree}: KbigxMarketingConsentDialogProps) => (
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
                <DialogTitle className="wrap-anywhere break-keep">{MARKETING_CONSENT_TITLE}</DialogTitle>
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
                        동의안함
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" size="xl" onClick={onAgree}>
                        동의 후 이용
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {KbigxMarketingConsentDialog}
export type {KbigxMarketingConsentDialogProps}
