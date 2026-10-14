'use client'

import type {ReactNode} from 'react'
import {usePathname} from 'next/navigation'
import {cn} from '@/lib/utils'

// 기업 · 기관 리포트(새 창) 바깥 상자의 테마 범위.
// 평가결과 · 특허 등급 리포트는 라이트 토큰으로 고정하고(.light), K-BIGx 보고서는 고정하지 않아
// 기존 화면의 테마(html 의 light · dark — 같은 저장소 값을 새 창도 읽는다)를 그대로 따른다.
// usePathname 은 서버 렌더링에서도 값이 있어 첫 화면부터 맞는 테마로 그려진다(깜빡임 없음).
// 인쇄는 테마와 관계없이 라이트로 찍는다(.print-light — tokens.css 의 @media print 블록). 종이에 어두운 면을 찍지 않는다.
const THEME_FOLLOWING_REPORT_PREFIXES = ['/corp/k-bigx-report/', '/org/k-bigx-report/'] as const

const ReportThemeScope = ({children}: {children: ReactNode}) => {
    const pathname = usePathname()
    const isThemeFollowing = THEME_FOLLOWING_REPORT_PREFIXES.some((prefix) => pathname.startsWith(prefix))

    return (
        <div
            className={cn(
                'bg-background text-foreground min-h-dvh w-fit min-w-full',
                isThemeFollowing ? 'print-light' : 'light',
            )}
        >
            {children}
        </div>
    )
}

export {ReportThemeScope}
