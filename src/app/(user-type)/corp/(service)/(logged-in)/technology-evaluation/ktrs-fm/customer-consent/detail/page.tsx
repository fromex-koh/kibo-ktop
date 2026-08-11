import type {Metadata} from 'next'
import CustomerConsentDetailContent from './customer-consent-detail-content'

export const metadata: Metadata = {title: '개별 상세 보기'}

const CorpKtrsFmCustomerConsentDetailPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 py-10">
            <p className="typo-body-xl-regular text-label-foreground col-span-full">
                동일 경로의 <code className="font-mono">customer-consent-detail-content.tsx</code> Client Component는
                모달 화면 확인용으로 사용하며, 실제 서비스 페이지와는 무관합니다.
            </p>
            <p className="typo-body-xl-regular text-label-foreground col-span-full">
                각 동의 항목의 &quot;내용보기&quot; 버튼을 클릭하면 해당 모달을 확인할 수 있습니다.
            </p>
            <CustomerConsentDetailContent />
        </div>
    </main>
)

export default CorpKtrsFmCustomerConsentDetailPage
