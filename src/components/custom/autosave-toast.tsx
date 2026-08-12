'use client'

import {CheckToastOnMount, showCheckToast, type CheckToastOptions} from '@/components/custom/check-toast'

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

// 저장이 끝난 시각을 받아 토스트를 띄운다. 시각을 넘기지 않으면 시안 문구를 그대로 쓴다(화면 확인용).
// 체크 동그라미·위치·노출 시간은 공통 완료 토스트(showCheckToast)가 갖는다.
// duration 은 화면 확인용 단독 페이지가 토스트를 띄운 채 두려고 넘긴다 — 실제 저장 호출은 넘기지 않는다.
const showAutosaveToast = (savedAt?: Date, options?: Pick<CheckToastOptions, 'duration'>) =>
    showCheckToast(savedAt ? formatSavedAt(savedAt) : AUTOSAVE_MESSAGE, {...options, id: AUTOSAVE_TOAST_ID})

type AutosaveToastProps = {
    /**
     * 화면에 띄울 저장 시각. 넘기지 않으면 시안 문구("오전 11:20 자동저장")를 그대로 쓴다.
     * 서버 컴포넌트에서 넘겨도 된다 — 그때 정해진 값이 그대로 전달되므로 hydration 이 어긋나지 않는다.
     */
    savedAt?: Date
    /**
     * 노출 시간(ms). 넘기지 않으면 공통 완료 토스트의 기본값(4초)을 쓴다.
     * Number.POSITIVE_INFINITY 를 넘기면 사라지지 않는다 — 토스트만 확인하는 단독 화면에서 쓴다.
     */
    duration?: number
}

// 띄우는 시점(글꼴 대기·Toaster 마운트 대기)과 떠날 때 닫는 처리는 공통 조각이 갖는다 —
// 완료 토스트만 확인하는 다른 단독 화면과 같은 동작이어야 하기 때문이다.
const AutosaveToast = ({savedAt, duration}: AutosaveToastProps) => (
    <CheckToastOnMount
        message={savedAt ? formatSavedAt(savedAt) : AUTOSAVE_MESSAGE}
        id={AUTOSAVE_TOAST_ID}
        duration={duration}
    />
)

export default AutosaveToast
export {showAutosaveToast}
export type {AutosaveToastProps}
