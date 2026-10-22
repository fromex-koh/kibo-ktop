import type {Metadata} from 'next'
import {KbigxMarketingConsentDialog} from '@/components/composite/k-bigx-marketing-consent-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {
    MYPAGE_MARKETING_CONSENT_ACTIONS,
    MYPAGE_MARKETING_CONSENT_TITLE,
} from '@/content/service/k-bigx-marketing-consent'

export const metadata: Metadata = {title: '마케팅 정보 수신 동의'}

// 마이페이지 내 정보의 [마케팅 알림 수신 동의 › 자세히] 모달 — 모달만 확인하는 자리라 뒤 배경을 비우고 열어 둔다.
// 내 정보 화면에서는 [동의] · [비동의]가 체크박스를 켜고 끈다(mypage-profile-form.tsx).
const CorpMypageProfileMarketingConsentPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="마케팅 정보 수신 동의">
                내 정보에서 마케팅 알림 수신 동의의 [자세히]를 누르면 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxMarketingConsentDialog
            defaultOpen
            title={MYPAGE_MARKETING_CONSENT_TITLE}
            actions={MYPAGE_MARKETING_CONSENT_ACTIONS}
        />
    </>
)

export default CorpMypageProfileMarketingConsentPage
