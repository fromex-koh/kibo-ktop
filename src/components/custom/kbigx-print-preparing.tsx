'use client'

// 'use client' — 인쇄 대화상자가 닫히면(afterprint) 안내를 걷는다.
import {useEffect, useState} from 'react'
import {LoadingState} from '@/components/composite/loading-state'

// K-BIGx 인쇄 준비 안내 — [출력하기]로 연 새 탭(?print=1)에서 보고서를 그리고 인쇄 대화상자가 뜰 때까지 화면을 덮는다.
// 빈 탭이나 그려지는 중인 문서가 보이지 않게 한다. 인쇄물에는 나오지 않는다(print:hidden).
// 쓰는 곳: report-print 화면 page.tsx(?print=1 일 때 — 서버 HTML 이 오자마자 보이고, 차트가 그려지는 동안 덮는다).
// 인쇄가 끝나면 탭은 스스로 닫힌다. 팝업 차단으로 같은 탭에서 열린 경우만 남으므로 그때 안내를 걷어 문서를 보인다.
const KBIGX_PRINT_PREPARING_TITLE = '인쇄할 보고서를 준비하고 있습니다.'
const KBIGX_PRINT_PREPARING_HINT = '인쇄 창이 열릴 때까지 이 창을 닫지 말고 기다려 주세요.'

const KbigxPrintPreparing = () => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const hide = () => setIsVisible(false)
        window.addEventListener('afterprint', hide)

        return () => window.removeEventListener('afterprint', hide)
    }, [])

    return isVisible ? (
        <div className="bg-background z-modal fixed inset-0 print:hidden">
            <LoadingState
                title={KBIGX_PRINT_PREPARING_TITLE}
                description={KBIGX_PRINT_PREPARING_HINT}
                className="min-h-dvh"
            />
        </div>
    ) : null
}

export {KbigxPrintPreparing}
