import type {Metadata} from 'next'
import {LoginAgencySignUpGuideDialog} from '@/components/composite/login-agency-signup-guide-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '기관회원 가입 안내'}

// 로그인(기관회원 탭)에서 여는 모달만 확인하는 화면 — 다른 모달 단독 화면처럼 뒤 배경을 비운다.
const CorpAuthAgencySignUpGuidePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="기관회원 가입 안내">
                기관회원 로그인의 [회원가입]에서 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <LoginAgencySignUpGuideDialog defaultOpen>
            <button type="button" className="sr-only">
                기관회원 가입 안내
            </button>
        </LoginAgencySignUpGuideDialog>
    </>
)

export default CorpAuthAgencySignUpGuidePage
