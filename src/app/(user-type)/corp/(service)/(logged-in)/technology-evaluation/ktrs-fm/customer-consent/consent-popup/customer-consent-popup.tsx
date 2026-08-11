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
        <main className="bg-background flex-1">
            <div className="grid-layout gap-2 py-10">
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
