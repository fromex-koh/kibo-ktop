'use client'

import {ChevronRight} from 'lucide-react'
import {ConsentTermsSectionDialogContent} from '@/components/composite/consent-terms-dialog'
import {Button} from '@/components/ui/button'
import {Dialog, DialogTrigger} from '@/components/ui/dialog'
import {findConsentSection, type ConsentSectionId} from '@/content/service/consent-terms'

// 항목별 약관 전문을 Dialog로 열고, 모달의 동의 결과를 상위 상태로 전달한다.
const ConsentTermsDetailButton = ({
    termsId,
    label,
    headingNumber,
    onAgree,
    onDecline,
}: {
    termsId?: ConsentSectionId
    label: string
    // 모달 안 절 제목에 사용할 화면 항목 번호.
    headingNumber?: number
    // 모달에서 동의·비동의를 선택했을 때 실행할 처리.
    onAgree?: () => void
    onDecline?: () => void
}) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="text-underline" size="md" aria-label={`${label} 내용보기`}>
                내용보기
                <ChevronRight aria-hidden="true" />
            </Button>
        </DialogTrigger>
        <ConsentTermsSectionDialogContent
            section={termsId ? findConsentSection(termsId) : undefined}
            headingNumber={headingNumber}
            onAgree={onAgree}
            onDecline={onDecline}
        />
    </Dialog>
)

export {ConsentTermsDetailButton}
