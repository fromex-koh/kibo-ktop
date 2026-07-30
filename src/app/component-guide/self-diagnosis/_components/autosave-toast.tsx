'use client'

import {useEffect} from 'react'
import {toast} from 'sonner'
import {Check} from 'lucide-react'

// 시안([자가진단] 2단계 기업정보·기술정보 입력)의 자동저장 토스트를 화면 진입 시 한 번 보여 준다.
// 목업이라 실제 저장 시각이 아니라 시안 문구를 그대로 쓴다 — 현재 시각을 렌더하면 서버와
// 클라이언트가 다른 값을 그려 hydration 이 어긋난다.
const AUTOSAVE_MESSAGE = '오전 11:20 자동저장'

// 시안 위치는 콘텐츠 가운데(제목 줄 높이)라 여섯 위치 중 top-center 를 쓴다.
const AUTOSAVE_POSITION = 'top-center'

// Sonner의 기본 상단 오프셋(모바일 16px·그 외 24px)을 제외한 보정값.
// 헤더 높이(기본 56px·lg 112px) 아래로 40px 떨어진 위치에 토스트 상단을 맞춘다.
const AUTOSAVE_OFFSET_CLASS_NAME = 'mt-20 sm:mt-18 lg:mt-32'

// 같은 id 를 주어 개발 모드의 이중 마운트에서도 토스트가 두 개 쌓이지 않게 한다.
const AUTOSAVE_TOAST_ID = 'self-diagnosis-autosave'

// 루트 Toaster가 children 뒤에서 마운트되므로, 전체 새로고침에서도 구독이 준비된 뒤 호출한다.
// requestAnimationFrame 한 번만 기다리면 느린 환경에서는 Toaster보다 먼저 실행될 수 있다.
const TOASTER_MOUNT_DELAY_MS = 100

// 자동저장 완료 여부를 확인할 수 있으면서 화면을 오래 가리지 않도록 기본 토스트 수준으로 노출한다.
const AUTOSAVE_DURATION_MS = 1_500

const AutosaveToast = () => {
    useEffect(() => {
        const timer = window.setTimeout(() => {
            toast(AUTOSAVE_MESSAGE, {
                id: AUTOSAVE_TOAST_ID,
                position: AUTOSAVE_POSITION,
                duration: AUTOSAVE_DURATION_MS,
                icon: (
                    <span
                        aria-hidden="true"
                        className="bg-primary text-primary-foreground size-icon-md flex shrink-0 items-center justify-center rounded-full"
                    >
                        <Check className="scale-75" strokeWidth={3} />
                    </span>
                ),
                className: AUTOSAVE_OFFSET_CLASS_NAME,
            })
        }, TOASTER_MOUNT_DELAY_MS)

        return () => {
            window.clearTimeout(timer)
            toast.dismiss(AUTOSAVE_TOAST_ID)
        }
    }, [])

    return null
}

export default AutosaveToast
