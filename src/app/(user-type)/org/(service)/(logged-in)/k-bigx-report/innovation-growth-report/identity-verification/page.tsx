import type {Metadata} from 'next'
import {IdentityVerificationDialog} from '@/components/composite/identity-verification-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '본인확인(인증번호)'}

// K-BIGx 기업혁신성장보고서 조회의 [본인 확인] 모달 — 가입 정보 목록 없이 비밀번호 한 칸만 받는다(items 생략).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다.
const OrgKbigxInnovationGrowthReportIdentityVerificationPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="본인확인(인증번호)">
                &quot;기업혁신성장보고서 조회&quot; 화면 진입시 노출되는 모달
            </PopupPreviewNote>
        </main>
        <IdentityVerificationDialog defaultOpen />
    </>
)

export default OrgKbigxInnovationGrowthReportIdentityVerificationPage
