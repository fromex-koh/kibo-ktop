import type {Metadata} from 'next'
import {LoginFindAccountDialog} from '@/components/composite/login-find-account-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '아이디 · 비밀번호 찾기'}

// 로그인(기관회원 탭)에서 여는 모달만 확인하는 화면 — 다른 모달 단독 화면처럼 뒤 배경을 비운다.
const CorpAuthFindAccountPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="아이디 · 비밀번호 찾기">
                기관회원 로그인의 [아이디 · 비밀번호 찾기]에서 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <LoginFindAccountDialog defaultOpen>
            <button type="button" className="sr-only">
                아이디 · 비밀번호 찾기
            </button>
        </LoginFindAccountDialog>
    </>
)

export default CorpAuthFindAccountPage
