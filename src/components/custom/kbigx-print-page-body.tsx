'use client'

// 'use client' — 본문 높이를 브라우저에서 재야 넘침을 알 수 있다.
import {useEffect, useRef, useState, type ReactNode} from 'react'
import {cn} from '@/lib/utils'

// K-BIGx 보고서 인쇄본 — 쪽 본문 상자 + 넘침 표시.
// 쪽은 A4 한 장 높이로 고정이라 본문이 넘치면 다음 쪽으로 흐르지 않고 잘린다.
// 넘치면 빨간 점선 테두리와 넘친 높이(px)를 보여 줘 잘리는 쪽을 바로 찾게 한다. 화면에서만 보인다(인쇄물에는 안 나옴).
//
// 넘침이 보이면: k-bigx-print-report.ts 의 행 높이 어림값(*_PAGE · *_AREA)이 실제 표와 어긋났는지 본다.
// 늦게 그려지는 차트 · 글자를 줄이는 칸도 잡도록 크기가 바뀔 때마다 다시 잰다(ResizeObserver).

type KbigxPrintPageBodyProps = {
    /** 바깥 상자(용지에서 본문 자리)에 붙일 클래스 — 위 여백 등. */
    boxClassName?: string
    /** 안쪽 내용 상자에 붙일 클래스 — 블록 사이 간격 등. */
    className?: string
    children: ReactNode
}

const KbigxPrintPageBody = ({boxClassName, className, children}: KbigxPrintPageBodyProps) => {
    const boxRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    // 넘친 높이(px, 용지 기준). 0 이면 넘치지 않는다.
    const [overflow, setOverflow] = useState(0)

    useEffect(() => {
        const box = boxRef.current
        const content = contentRef.current
        if (!box || !content) return

        // 확인 화면의 용지는 transform 으로만 줄어 clientHeight · scrollHeight 는 늘 용지 기준(1360 폭) 값이다.
        // 내용 상자는 쪽 높이에 맞춰 두므로(h-full) 넘친 자식까지 담는 scrollHeight 로 잰다.
        const measure = () => setOverflow(Math.max(0, content.scrollHeight - box.clientHeight))
        const observer = new ResizeObserver(measure)

        observer.observe(box)
        observer.observe(content)
        // 내용 상자는 높이가 고정이라 안쪽이 바뀌어도 크기가 그대로다 — 바로 아래 자식들도 지켜 본다
        // (예: 개요 값 글자를 줄여 내용이 짧아지면 넘침 표시를 거둔다).
        Array.from(content.children).forEach((child) => observer.observe(child))
        measure()

        return () => observer.disconnect()
    }, [])

    const isOverflowing = overflow > 0

    return (
        <div
            ref={boxRef}
            data-overflow={isOverflowing || undefined}
            className={cn(
                'outline-destructive relative min-h-0 flex-1 overflow-hidden outline-offset-4 data-overflow:outline-4 data-overflow:outline-dashed print:outline-none',
                boxClassName,
            )}
        >
            <div ref={contentRef} className={className}>
                {children}
            </div>
            {isOverflowing ? (
                <p
                    role="status"
                    className="bg-destructive text-destructive-foreground typo-body-l-bold absolute right-0 bottom-0 rounded-sm px-3 py-2 print:hidden"
                >
                    내용이 {overflow}px 넘쳐 인쇄할 때 잘립니다
                </p>
            ) : null}
        </div>
    )
}

export {KbigxPrintPageBody}
