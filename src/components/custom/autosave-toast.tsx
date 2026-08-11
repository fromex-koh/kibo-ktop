'use client'

import {useEffect} from 'react'
import {toast} from 'sonner'
import {showCheckToast} from '@/components/custom/check-toast'

// 자동저장 토스트 — 시안([신속표준모형 KTRS-FM] 2단계 기업·기술정보 입력)의 문구·위치를 담는다.
//
// [프론트엔드 연동] 저장 요청이 끝날 때마다 showAutosaveToast(new Date()) 를 부르면 된다.
// 문구·위치·아이콘·노출 시간은 이 파일이 갖고 있으므로 부르는 쪽은 시각만 넘기면 된다.
//   const save = async () => {
//       await saveDraft(values)
//       showAutosaveToast(new Date())
//   }
// 아래 <AutosaveToast /> 는 화면 확인용이다 — 저장 기능이 붙기 전까지 진입 시 한 번만 띄운다.
// 그 컴포넌트에도 시각을 넘길 수 있다: <AutosaveToast savedAt={lastSavedAt} />

// 목업 기본 문구. 실제 저장 시각을 넘기지 않으면 시안 문구를 그대로 쓴다 — 화면이 처음 그려질 때
// 현재 시각을 넣으면 서버와 클라이언트가 다른 값을 그려 hydration 이 어긋난다.
const AUTOSAVE_MESSAGE = '오전 11:20 자동저장'

// 시안 문구 형식 — "오전 11:20 자동저장".
const formatSavedAt = (savedAt: Date) =>
    `${new Intl.DateTimeFormat('ko-KR', {hour: 'numeric', minute: '2-digit'}).format(savedAt)} 자동저장`

// 같은 id 를 주어 개발 모드의 이중 마운트에서도 토스트가 두 개 쌓이지 않게 한다.
const AUTOSAVE_TOAST_ID = 'self-diagnosis-autosave'

// 루트 Toaster가 children 뒤에서 마운트되므로, 전체 새로고침에서도 구독이 준비된 뒤 호출한다.
// requestAnimationFrame 한 번만 기다리면 느린 환경에서는 Toaster보다 먼저 실행될 수 있다.
const TOASTER_MOUNT_DELAY_MS = 100

// 저장이 끝난 시각을 받아 토스트를 띄운다. 시각을 넘기지 않으면 시안 문구를 그대로 쓴다(화면 확인용).
// 체크 동그라미·위치·노출 시간은 공통 완료 토스트(showCheckToast)가 갖는다.
const showAutosaveToast = (savedAt?: Date) =>
    showCheckToast(savedAt ? formatSavedAt(savedAt) : AUTOSAVE_MESSAGE, {id: AUTOSAVE_TOAST_ID})

type AutosaveToastProps = {
    /**
     * 화면에 띄울 저장 시각. 넘기지 않으면 시안 문구("오전 11:20 자동저장")를 그대로 쓴다.
     * 서버 컴포넌트에서 넘겨도 된다 — 그때 정해진 값이 그대로 전달되므로 hydration 이 어긋나지 않는다.
     */
    savedAt?: Date
}

const AutosaveToast = ({savedAt}: AutosaveToastProps) => {
    // Date 는 렌더마다 다른 객체일 수 있어 시각(ms)으로 비교한다 — 같은 시각이면 다시 띄우지 않는다.
    const savedAtTime = savedAt?.getTime()

    useEffect(() => {
        let timer = 0
        let isCancelled = false
        const show = () => {
            if (isCancelled) return

            timer = window.setTimeout(() => {
                showAutosaveToast(savedAtTime === undefined ? undefined : new Date(savedAtTime))
            }, TOASTER_MOUNT_DELAY_MS)
        }

        // 글꼴을 기다린 뒤에 띄운다 — 웹폰트가 늦게 오면 위쪽 제목의 높이가 달라져, 그 전에 잰 고정 영역의
        // 아래끝이 실제와 어긋난다(토스트가 고정 영역을 파고든다). 저장 후 호출은 화면이 이미 자리를 잡은
        // 뒤라 이 대기가 필요 없다 — 진입 시 한 번 띄우는 이 확인용 컴포넌트에만 둔다.
        if (document.fonts) document.fonts.ready.then(show)
        else show()

        return () => {
            isCancelled = true
            window.clearTimeout(timer)
            toast.dismiss(AUTOSAVE_TOAST_ID)
        }
    }, [savedAtTime])

    return null
}

export default AutosaveToast
export {showAutosaveToast}
export type {AutosaveToastProps}
