import type {Metadata} from 'next'
import CustomerConsentDetailContent from './customer-consent-detail-content'

export const metadata: Metadata = {title: '개별 상세 보기'}

const CorpKtrsFmCustomerConsentDetailPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 py-10">
            {/* 모달만 확인하는 화면이라 시안에 보이는 제목이 없다 — 제목이 하나도 없으면 제목 구조가 없는
                페이지가 되므로(WAVE "Missing first level heading") 화면 이름을 h1 으로 두되 sr-only 로
                감춘다[6.4.2]. 아래 카드 제목(h2)과 단계가 이어진다. */}
            <h1 className="sr-only">개별 상세 보기</h1>
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
