'use client'

import {useEffect} from 'react'
import {toast} from 'sonner'
import {Check} from 'lucide-react'

// 완료 안내 토스트 — 체크 동그라미 + 화면 위(헤더 아래) 자리를 담는다.
// 시안의 자동저장 토스트([신속표준모형 KTRS-FM] 2단계)와 같은 모양이라, 완료를 알리는 다른 자리도
// 이 함수를 쓸 수 있다. 부르는 쪽은 문구만 넘긴다. (보증신청 완료는 토스트에서 모달로 바뀌어
// 지금은 자동저장 토스트만 쓴다 — guarantee-application-dialog.tsx 참조.)
//
//   showCheckToast('임시저장 되었습니다')

// 시안 위치는 콘텐츠 가운데(제목 줄 높이)라 여섯 위치 중 top-center 를 쓴다.
const CHECK_TOAST_POSITION = 'top-center'

// 노출 시간 — 라이브러리(sonner)와 Material Design 스낵바가 함께 쓰는 기본값 4초를 그대로 둔다.
const CHECK_TOAST_DURATION_MS = 4_000

// 시안은 헤더 아래 40 자리에 토스트가 온다. 화면 위에 붙어 있는 것의 높이는 화면마다 다르므로
// (로그인 상태에 따라 헤더에 유틸리티 줄이 붙고, 모바일에서는 그 아래 폼 탭 한 줄이 더 붙는다)
// 클래스로 못 박지 않고 부를 때 실제 값을 재서 맞춘다. 헤더·탭 줄 모두 sticky 라 스크롤해도 자리가
// 그대로여서, 한 번 잰 값이 계속 맞는다.
// Sonner 는 토스트를 자기 컨테이너 안에 넣으므로, 그 컨테이너 윗변에서 얼마나 더 내릴지를 계산한다.
// 모바일은 이 간격을 좁힌다 — 고정 영역이 [단계·제목 + 섹션 줄] 두 단이라 화면 위쪽을 이미 많이 쓰고,
// 넓은 화면과 같은 40 을 두면 토스트가 본문 한가운데까지 내려와 멀어 보인다.
const HEADER_GAP_PX = 40
const MOBILE_HEADER_GAP_PX = 16

// 화면 맨 위에 붙어 있는 것의 아래끝 — 헤더, 그리고 모바일에서 스크롤하면 헤더 밑에 와 붙는 폼 탭 한 줄.
// 그 아래에 토스트를 두어야 가리지도, 가려지지도 않는다.
// 탭 줄은 '헤더 밑에 붙었을 때만' 기준으로 삼는다 — 아직 본문 자리에 있으면 토스트와 겹치지 않는다.
const STUCK_TOLERANCE_PX = 1

const getTopAnchorBottom = () => {
    const headerRect = document.querySelector('header')?.getBoundingClientRect()
    if (!headerRect) return undefined

    const barRect = document.querySelector('[data-slot="form-tabs-sticky-bar"]')?.getBoundingClientRect()
    const isBarStuckUnderHeader =
        barRect !== undefined && barRect.height > 0 && barRect.top <= headerRect.bottom + STUCK_TOLERANCE_PX

    return isBarStuckUnderHeader ? barRect.bottom : headerRect.bottom
}

// Sonner 가 토스트 컨테이너에 주는 기본 위쪽 여백. 첫 호출 시점에는 그 컨테이너가 아직 만들어지지 않아
// 실측할 수 없어 상수로 둔다(라이브러리 기본값 — Toaster 에 offset 을 지정하면 이 값도 함께 맞춘다).
const TOASTER_TOP_OFFSET_PX = 24
const TOASTER_MOBILE_TOP_OFFSET_PX = 16
const MOBILE_QUERY = '(max-width: 639px)'

const getHeaderOffsetStyle = () => {
    const anchorBottom = getTopAnchorBottom()
    if (anchorBottom === undefined) return undefined

    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    const toasterOffset = isMobile ? TOASTER_MOBILE_TOP_OFFSET_PX : TOASTER_TOP_OFFSET_PX
    const gap = isMobile ? MOBILE_HEADER_GAP_PX : HEADER_GAP_PX

    return {marginTop: `${Math.max(0, Math.round(anchorBottom + gap - toasterOffset))}px`}
}

// 시안의 체크 표식 — 파란 원 안에 흰 체크. 문구가 완료를 이미 알리므로 장식으로 둔다[5.1.1].
const CheckToastIcon = (
    <span
        aria-hidden="true"
        className="bg-primary text-primary-foreground size-icon-md flex shrink-0 items-center justify-center rounded-full"
    >
        <Check className="scale-75" strokeWidth={3} />
    </span>
)

type CheckToastOptions = {
    // 같은 자리에서 반복해 띄울 때 토스트가 쌓이지 않도록 하는 식별자.
    id?: string
    duration?: number
}

const showCheckToast = (message: string, {id, duration = CHECK_TOAST_DURATION_MS}: CheckToastOptions = {}) =>
    toast(message, {
        id,
        position: CHECK_TOAST_POSITION,
        duration,
        icon: CheckToastIcon,
        style: getHeaderOffsetStyle(),
    })

// 루트 Toaster 가 children 뒤에서 마운트되므로, 전체 새로고침에서도 구독이 준비된 뒤 호출한다.
// requestAnimationFrame 한 번만 기다리면 느린 환경에서는 Toaster 보다 먼저 실행될 수 있다.
const TOASTER_MOUNT_DELAY_MS = 100

type CheckToastOnMountProps = CheckToastOptions & {
    /** 띄울 문구. */
    message: string
}

// 화면에 들어오자마자 완료 토스트를 한 번 띄우는 조각 — 렌더 결과는 없다.
// 실제 서비스 흐름에서는 저장·신청이 끝난 자리에서 showCheckToast 를 부르면 된다. 이 조각은 그 흐름이
// 붙기 전, 또는 토스트만 확인하는 단독 화면(화면정의서의 하위 화면)에서 토스트를 보여 주려고 쓴다.
// duration 에 Number.POSITIVE_INFINITY 를 넘기면 사라지지 않는다.
const CheckToastOnMount = ({message, id, duration}: CheckToastOnMountProps) => {
    useEffect(() => {
        let timer = 0
        let isCancelled = false
        const show = () => {
            if (isCancelled) return

            timer = window.setTimeout(() => showCheckToast(message, {id, duration}), TOASTER_MOUNT_DELAY_MS)
        }

        // 글꼴을 기다린 뒤에 띄운다 — 웹폰트가 늦게 오면 위쪽 제목의 높이가 달라져, 그 전에 잰 고정 영역의
        // 아래끝이 실제와 어긋난다(토스트가 고정 영역을 파고든다). 완료 후 호출은 화면이 이미 자리를 잡은
        // 뒤라 이 대기가 필요 없다 — 진입 시 한 번 띄우는 이 조각에만 둔다.
        if (document.fonts) document.fonts.ready.then(show)
        else show()

        return () => {
            isCancelled = true
            window.clearTimeout(timer)
            if (id) toast.dismiss(id)
        }
    }, [message, id, duration])

    return null
}

export {CheckToastOnMount, showCheckToast}
export type {CheckToastOnMountProps, CheckToastOptions}
