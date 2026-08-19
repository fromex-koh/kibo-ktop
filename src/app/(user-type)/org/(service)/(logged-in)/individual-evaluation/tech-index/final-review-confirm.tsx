'use client'

import {useRouter} from 'next/navigation'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'

// 최종 확인 모달의 [제출] — 제출 API 를 부르고 (5) 완료 화면으로 넘어가는 자리다.
// 완료 화면 경로는 갈래(일반/창업)마다 달라 completePath 로 받는다.
// [프론트엔드 연동] 아래 console.log 자리만 제출 API 호출로 바꾸면 된다.
const FinalReviewConfirm = ({completePath}: {completePath: string}) => {
    const router = useRouter()

    const handleSubmit = () => {
        console.log('[프론트엔드 연동][제출] 기관 개별평가 Tech-Index 최종 제출 — 이 자리에서 제출 API 를 호출한다')
        router.push(completePath)
    }

    return <SubmitConfirmDialog defaultOpen onSubmit={handleSubmit} />
}

export {FinalReviewConfirm}
