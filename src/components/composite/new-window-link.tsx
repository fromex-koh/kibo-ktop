'use client'

import type {AnchorHTMLAttributes, MouseEvent, ReactNode} from 'react'

// 새 창 열기 — 지정한 크기(width · height)의 창으로 문서를 띄우는 링크.
//
// 평가결과 리포트처럼 화면 폭이 정해진 인쇄용 문서는 브라우저 창 자체를 그 폭에 맞춰 연다.
// 링크(<a>)로 두는 이유는 두 가지다.
//   · 자바스크립트가 막히거나 창 열기가 차단돼도 같은 주소로 이동할 수 있다.
//   · 마우스 가운데 클릭·새 탭에서 열기 같은 브라우저 기본 동작이 그대로 살아 있다[6.1.1].
// 창이 실제로 열렸을 때만 기본 이동을 막는다 — 팝업 차단으로 실패하면 링크가 원래대로 동작한다.
//
// 링크를 눌렀을 때 새 창이 뜬다는 사실은 눈으로만 알 수 있으므로 읽어 줄 말을 함께 둔다[6.4.3].

const NEW_WINDOW_SUFFIX = ' (새 창에서 열림)'

// 세로 스크롤바가 먹는 폭. 새 창 안쪽 폭은 문서 폭과 같은데 거기서 스크롤바가 자리를 차지하면 문서가
// 그만큼 잘려 가로 스크롤바까지 생긴다 — 그 폭만큼 창을 넓게 연다.
// 여는 쪽과 열리는 쪽이 같은 스타일을 쓰므로 여기서 잰 값이 그대로 맞다. 겹침형 스크롤바면 0 이 나온다.
const measureScrollbarWidth = (): number => {
    const probe = document.createElement('div')
    probe.style.cssText = 'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll'
    document.body.appendChild(probe)
    const scrollbarWidth = probe.offsetWidth - probe.clientWidth
    probe.remove()

    return scrollbarWidth
}

type NewWindowLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
    children: ReactNode
    href: string
    /** 열 창의 폭(문서 폭). 화면보다 넓으면 화면 크기까지 줄인다(fitToScreen). */
    width: number
    /** 열 창의 높이. 문서가 길면 화면 높이까지만 열고 나머지는 창 안에서 스크롤한다. */
    height: number
    /**
     * 창 이름. 같은 이름으로 다시 열면 새 창을 만들지 않고 그 창을 다시 쓴다 —
     * 같은 문서를 여러 번 눌러도 창이 쌓이지 않는다.
     */
    windowName?: string
    /**
     * 창 폭을 화면 폭까지 줄일지. 기본은 줄인다. 모바일 화면에서 PC 화면을 여는 [더보기]처럼 창 폭 자체가 목적이면 끈다 —
     * 개발자도구의 기기 모드에서는 화면 폭(screen.availWidth)이 기기 폭(예: 375)으로 잡혀, 줄이면 창도 그 폭으로 열린다.
     * (실제 휴대폰 브라우저는 창 크기 지정을 무시하고 새 탭으로 연다 — 그때 PC 폭은 열리는 화면의 뷰포트가 맡는다.)
     */
    fitToScreen?: boolean
}

const NewWindowLink = ({
    children,
    href,
    width,
    height,
    windowName = '_blank',
    fitToScreen = true,
    onClick,
    ...props
}: NewWindowLinkProps) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        // 새 탭·새 창으로 열려는 조작(가운데 클릭·⌘/Ctrl+클릭)은 브라우저에 맡긴다.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return

        const screenWidth = window.screen.availWidth
        const screenHeight = window.screen.availHeight
        const requestedWidth = width + measureScrollbarWidth()
        const windowWidth = fitToScreen ? Math.min(requestedWidth, screenWidth) : requestedWidth
        const windowHeight = fitToScreen ? Math.min(height, screenHeight) : height
        // 가운데는 화면이 아니라 지금 보고 있는 창을 기준으로 잡는다 — 화면 기준으로 계산하면 모니터가
        // 여럿일 때 좌표의 출발점이 주 모니터라, 브라우저가 다른 모니터에 있으면 새 창이 엉뚱한 자리
        // (대개 왼쪽 끝)에 열린다. 창 크기를 알 수 없는 드문 경우에만 화면 기준으로 되돌린다.
        const hasOpenerBounds = window.outerWidth > 0 && window.outerHeight > 0
        const left = hasOpenerBounds
            ? Math.round(window.screenX + (window.outerWidth - windowWidth) / 2)
            : Math.max(0, Math.round((screenWidth - windowWidth) / 2))
        const top = hasOpenerBounds
            ? Math.round(window.screenY + (window.outerHeight - windowHeight) / 2)
            : Math.max(0, Math.round((screenHeight - windowHeight) / 2))
        // features 에 noopener 를 넣으면 브라우저가 창 손잡이 대신 null 을 돌려준다 — 그러면 창이 열렸는지
        // 알 수 없어 기본 이동까지 함께 일어나(target="_blank") 창이 둘 열린다. 여는 문서가 같은 출처라
        // 여기서는 넣지 않고, 열기가 막혔을 때만 링크의 rel 이 걸린 기본 이동으로 넘어가게 둔다.
        const features = `width=${windowWidth},height=${windowHeight},left=${left},top=${top},scrollbars=yes,resizable=yes`

        const opened = window.open(href, windowName, features)
        if (!opened) return

        event.preventDefault()
        // 같은 이름의 창을 다시 쓸 때는 브라우저가 크기·자리 지정을 무시하고 그 창을 그대로 다시 보여 준다 —
        // 한 번 왼쪽 끝에 열린 창이 계속 그 자리에 뜨는 이유다. 열고 난 뒤 직접 옮겨 가운데로 돌려놓는다.
        // 창을 옮기지 못하게 막아 둔 브라우저도 있으므로 실패해도 열기 자체는 그대로 둔다.
        try {
            // 다시 쓰는 창은 예전 크기 그대로 뜨므로 크기도 다시 맞춘다(예: 좁게 열렸던 창을 PC 폭으로).
            opened.resizeTo(windowWidth, windowHeight)
            opened.moveTo(left, top)
        } catch {
            // 자리를 옮기지 못해도 창은 이미 열려 있다.
        }
        opened.focus()
    }

    return (
        <a {...props} href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
            {children}
            <span className="sr-only">{NEW_WINDOW_SUFFIX}</span>
        </a>
    )
}

export {NewWindowLink}
export type {NewWindowLinkProps}
