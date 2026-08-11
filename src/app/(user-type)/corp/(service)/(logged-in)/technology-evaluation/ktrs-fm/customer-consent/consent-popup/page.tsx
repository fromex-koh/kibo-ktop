import type {Metadata} from 'next'
import CustomerConsentPopup from './customer-consent-popup'

export const metadata: Metadata = {title: '필수/선택 동의 팝업'}

const CorpKtrsFmCustomerConsentPopupPage = () => <CustomerConsentPopup />

export default CorpKtrsFmCustomerConsentPopupPage
