'use client'

import {useEffect} from 'react'
import {toast} from 'sonner'
import {CircleCheck} from 'lucide-react'

// 시안([자가진단] 2단계 기업정보·기술정보 입력)의 자동저장 토스트를 화면 진입 시 한 번 보여 준다.
// 목업이라 실제 저장 시각이 아니라 시안 문구를 그대로 쓴다 — 현재 시각을 렌더하면 서버와
// 클라이언트가 다른 값을 그려 hydration 이 어긋난다.
const AUTOSAVE_MESSAGE = '오전 11:20 자동저장'

// 시안 위치는 콘텐츠 가운데(제목 줄 높이)라 여섯 위치 중 top-center 를 쓴다.
const AUTOSAVE_POSITION = 'top-center'

// 같은 id 를 주어 개발 모드의 이중 마운트에서도 토스트가 두 개 쌓이지 않게 한다.
const AUTOSAVE_TOAST_ID = 'self-diagnosis-autosave'

const AutosaveToast = () => {
    useEffect(() => {
        toast(AUTOSAVE_MESSAGE, {
            id: AUTOSAVE_TOAST_ID,
            position: AUTOSAVE_POSITION,
            icon: <CircleCheck aria-hidden="true" />,
        })

        return () => {
            toast.dismiss(AUTOSAVE_TOAST_ID)
        }
    }, [])

    return null
}

export default AutosaveToast
