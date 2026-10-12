import type {ReactNode} from 'react'
import {ReportThemeScope} from '@/components/custom/report-theme-scope'

// 기업 리포트(새 창) 공통 상자. 경로별 테마 범위(라이트 고정 · 화면 테마 따름)는 ReportThemeScope 가 정한다.
export default function ReportLayout({children}: {children: ReactNode}) {
    return <ReportThemeScope>{children}</ReportThemeScope>
}
