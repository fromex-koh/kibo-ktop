'use client'

import {useState} from 'react'
import {ConsentTermsDialogContent, OptionalConsentTermsDialogContent} from '@/components/composite/consent-terms-dialog'
import {Dialog} from '@/components/ui/dialog'

// 퍼블리싱 확인용 페이지에서 모달 초기 노출·단계 전환을 재현하는 Client Component다.
// 실제 서비스 페이지의 동의 상태 관리나 제출 흐름과는 무관하다.
type ConsentStep = 'required' | 'optional' | null

const CustomerConsentPopup = () => {
    const [step, setStep] = useState<ConsentStep>('required')

    // 필수 동의 후 같은 Dialog에서 선택 동의 단계로 전환한다.
    const handleRequiredAgree = () => setStep('optional')

    return (
        // id 는 화면 위 "본문 바로가기" 스킵 링크가 가리키는 자리다 — 없으면 그 링크가 갈 곳이 없다[6.4.1].
        <main id="main" tabIndex={-1} className="bg-background flex-1">
            <div className="grid-layout gap-2 py-10">
                {/* 모달만 확인하는 화면이라 시안에 보이는 제목이 없다 — 제목이 하나도 없으면 제목 구조가
                    없는 페이지가 되므로 화면 이름을 h1 으로 두되 sr-only 로 감춘다[6.4.2]. */}
                <h1 className="sr-only">필수/선택 동의 팝업</h1>
                <p className="typo-body-xl-regular text-label-foreground col-span-full">
                    동일 경로의 <code className="font-mono">customer-consent-popup.tsx</code> Client Component는 모달
                    화면 확인용으로 사용하며, 실제 서비스 페이지의 동의 상태 관리와는 무관합니다.
                </p>
                <p className="typo-body-xl-regular text-label-foreground col-span-full">
                    필수 동의사항 모달에서 &quot;동의함&quot; 버튼을 클릭하면 선택 동의사항 모달이 노출됩니다.
                </p>
            </div>
            <Dialog open={step !== null} onOpenChange={(open) => !open && setStep(null)}>
                {step === 'optional' ? (
                    <OptionalConsentTermsDialogContent onAgree={() => setStep(null)} />
                ) : (
                    <ConsentTermsDialogContent onAgree={handleRequiredAgree} closeOnAgree={false} />
                )}
            </Dialog>
        </main>
    )
}

export default CustomerConsentPopup
