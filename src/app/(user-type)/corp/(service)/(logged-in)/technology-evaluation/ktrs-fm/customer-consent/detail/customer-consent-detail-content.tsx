'use client'

import {useState} from 'react'
import {ChevronRight} from 'lucide-react'
import {ConsentTermsSectionDialogContent} from '@/components/composite/consent-terms-dialog'
import {ConsentItem, ConsentList} from '@/components/composite/consent-list'
import {FormCard} from '@/components/composite/form-card'
import {Button} from '@/components/ui/button'
import {Dialog, DialogTrigger} from '@/components/ui/dialog'
import {findConsentSection, type ConsentSectionId} from '@/content/service/consent-terms'

// 퍼블리싱 확인용 페이지에서 각 약관 모달의 초기 노출·열기·닫기를 재현하는 Client Component다.
// 실제 서비스 페이지의 동의 상태 관리나 제출 흐름과는 무관하다.
const CORP_CONSENTS = [
    {name: 'corp-collect', title: '1. 수집·이용에 관한 사항', requirement: 'required', termsId: 'corp-collect'},
    {name: 'corp-provide', title: '2. 제공에 관한 사항', requirement: 'required', termsId: 'corp-provide'},
    {name: 'corp-inquiry', title: '3. 조회에 관한 사항', requirement: 'required', termsId: 'corp-inquiry'},
    {
        name: 'corp-tax',
        title: '4. 세무회계자료의 온라인 제출에 관한 사항',
        requirement: 'optional',
        termsId: 'corp-tax',
    },
] as const

const PERSONAL_CONSENTS = [
    {
        name: 'personal-collect',
        title: '1. 수집·이용에 관한 사항',
        description: '위 고유식별정보 수집·이용에 동의하십니까?',
        termsId: 'personal-collect',
    },
    {
        name: 'personal-provide',
        title: '2. 제공에 관한 사항',
        description: '위 고유식별정보 제공에 동의하십니까? (단, ①②⑤에 한함)',
        termsId: 'personal-provide',
    },
    {
        name: 'personal-inquiry',
        title: '3. 조회에 관한 사항',
        description: '위 고유식별정보 조회에 동의하십니까?',
        termsId: 'personal-inquiry',
    },
] as const

const ConsentDetailButton = ({
    label,
    termsId,
    headingNumber,
    initialOpen = false,
}: {
    label: string
    termsId: ConsentSectionId
    headingNumber: number
    initialOpen?: boolean
}) => {
    const [open, setOpen] = useState(initialOpen)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="text-underline" size="md" aria-label={`${label} 내용보기`}>
                    내용보기
                    <ChevronRight aria-hidden="true" />
                </Button>
            </DialogTrigger>
            <ConsentTermsSectionDialogContent section={findConsentSection(termsId)} headingNumber={headingNumber} />
        </Dialog>
    )
}

const ConsentCard = ({title, children}: {title: string; children: React.ReactNode}) => (
    <FormCard title={title}>
        <ConsentList>{children}</ConsentList>
    </FormCard>
)

const CustomerConsentDetailContent = () => (
    <div className="col-span-full flex flex-col gap-6">
        <ConsentCard title="[기업] 정보 수집·이용·제공·조회 동의서">
            {CORP_CONSENTS.map((consent, index) => (
                <ConsentItem
                    key={consent.name}
                    requirement={consent.requirement}
                    title={consent.title}
                    action={
                        <ConsentDetailButton
                            label={`[기업] ${consent.title}`}
                            termsId={consent.termsId}
                            headingNumber={index + 1}
                            initialOpen={index === 0}
                        />
                    }
                />
            ))}
        </ConsentCard>

        <ConsentCard title="[개인] 정보 수집·이용·제공·조회 동의서">
            {PERSONAL_CONSENTS.map((consent, index) => (
                <ConsentItem
                    key={consent.name}
                    title={consent.title}
                    description={consent.description}
                    action={
                        <ConsentDetailButton
                            label={`[개인] ${consent.title}`}
                            termsId={consent.termsId}
                            headingNumber={index + 1}
                        />
                    }
                />
            ))}
        </ConsentCard>
    </div>
)

export default CustomerConsentDetailContent
