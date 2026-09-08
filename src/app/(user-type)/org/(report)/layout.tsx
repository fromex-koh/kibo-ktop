import type {ReactNode} from 'react'

// 경로 등록 없이 모든 기관 리포트를 서버 렌더링부터 라이트 토큰으로 표시한다.
export default function ReportLayout({children}: {children: ReactNode}) {
    return <div className="light bg-background text-foreground min-h-dvh w-fit min-w-full">{children}</div>
}
