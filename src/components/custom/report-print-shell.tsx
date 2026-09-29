'use client'

// 'use client' — [인쇄하기]가 브라우저의 인쇄 대화상자를 열고 [닫기]가 창을 닫는다.
import {useEffect, useLayoutEffect, useRef, type ReactNode} from 'react'
import {Info, Printer, X} from 'lucide-react'
import {Button} from '@/components/ui/button'

// 인쇄용 보고서를 감싸는 껍데기 — 위쪽 도구 막대와 용지를 놓는 무대로 이루어진다.
// 보고서 화면이 모두 같은 껍데기를 쓴다(특허평가 결과 보고서 등).
//
// 주소에 ?print=1 이 붙으면 문서가 다 그려진 뒤 스스로 인쇄 대화상자를 연다 —
// 화면에서 [출력]을 누르면 보고서를 숨긴 프레임으로 불러와 이 값을 붙이므로, 미리보기 화면을 거치지 않는다.
// 주소를 그대로 열면(퍼블리싱 확인 · 새 탭) 대화상자 없이 문서만 보인다.
//
// 도구 막대는 화면에서만 보이고 인쇄물에는 나오지 않는다 — .report-toolbar 규칙은 app/globals.css 에 있다.
// 용지 규격(A4 비율 · 배율)도 같은 CSS 가 갖는다 — 쓰는 쪽은 .report-sheet 안에 내용만 그린다.

const AUTO_PRINT_QUERY = 'print'
// 차트는 브라우저가 크기를 잰 뒤에 그려진다 — 스켈레톤이 남아 있으면 그 상태로 인쇄된다.
// 다 그려질 때까지 짧게 기다렸다가 열고, 그래도 안 끝나면 더 기다리지 않는다(문서가 없는 화면도 있다).
const PRINT_READY_INTERVAL_MS = 100
const PRINT_READY_TIMEOUT_MS = 5000

const PRINT_LABEL = '인쇄하기'
const CLOSE_LABEL = '닫기'

// 이 주소는 서비스 흐름에 들어가지 않는다 — 보고서 템플릿을 눈으로 확인하는 자리다.
// 서비스에서는 [결과 보고서 출력]이 이 문서를 숨긴 프레임으로 불러와 인쇄 대화상자만 연다.
const TEMPLATE_NOTICE =
    '이 화면은 서비스 화면이 아니라 결과 보고서 템플릿을 확인하는 용도입니다. 서비스에서는 [결과 보고서 출력]을 누르면 이 화면 없이 인쇄 대화상자가 바로 열립니다.'

// 용지 폭(app/globals.css 의 --report-sheet-width)과 무대 좌우 여백(p-10 × 2).
const SHEET_WIDTH = 1360
const STAGE_PADDING = 80
// 화면에서 용지가 커지는 한계 — 다른 화면의 콘텐츠 폭(max-w-content 1200)과 같게 맞춘다.
const MAX_SHEET_DISPLAY_WIDTH = 1200

// 화면 배율 — 무대가 좁으면 그만큼 용지를 줄이고, 넓어도 콘텐츠 폭(1200)까지만 키운다.
// CSS 만으로는 길이를 길이로 나눠 배율을 만들 수 없어 여기서 재서 --report-scale 에 넣는다.
// 첫 그림은 CSS 기본값(1200 ÷ 1360)으로 이미 맞춰져 있고, 여기서는 좁은 화면일 때만 더 줄인다 —
// 그려진 뒤에 값을 바꾸면 크기가 한 번 튀므로 그리기 전에 재도록 useLayoutEffect 를 쓴다.
// 인쇄 배율은 app/globals.css 가 따로 정하므로 이 값은 인쇄물에 영향을 주지 않는다.
const useSheetScale = () => {
    const stageRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const stage = stageRef.current
        if (!stage) return

        const apply = () => {
            // 창 폭을 잰다 — 보고서 레이아웃((report) 그룹)이 내용 폭만큼 늘어나는 상자라
            // 안쪽 요소를 재면 용지 폭이 그대로 되돌아온다(잰 값이 제자리를 돈다).
            const available = Math.min(document.documentElement.clientWidth - STAGE_PADDING, MAX_SHEET_DISPLAY_WIDTH)
            stage.style.setProperty('--report-scale', String(Math.min(1, available / SHEET_WIDTH)))
        }

        apply()
        window.addEventListener('resize', apply)

        return () => window.removeEventListener('resize', apply)
    }, [])

    return stageRef
}

// 주소에 ?print=1 이 붙었을 때만 — 문서가 다 그려지면 인쇄 대화상자를 연다.
const useAutoPrint = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get(AUTO_PRINT_QUERY) !== '1') return

        const startedAt = Date.now()
        const isReady = () =>
            !document.querySelector('[data-slot="chart-skeleton"]') || Date.now() - startedAt > PRINT_READY_TIMEOUT_MS

        const timer = window.setInterval(() => {
            if (!isReady()) return

            window.clearInterval(timer)
            window.print()
        }, PRINT_READY_INTERVAL_MS)

        return () => window.clearInterval(timer)
    }, [])
}

type ReportPrintShellProps = {
    /** 도구 막대 왼쪽에 놓을 문서 이름. 창 제목과 같은 말을 쓴다. */
    title: string
    /** 용지(.report-sheet) 안에 그릴 내용. 장이 여럿이면 장마다 하나씩 넘긴다. */
    children: ReactNode
}

const ReportPrintShell = ({title, children}: ReportPrintShellProps) => {
    const stageRef = useSheetScale()

    useAutoPrint()

    return (
        <div className="bg-background flex min-h-dvh w-full flex-col">
            {/* 도구 막대 — 화면 위에 고정해 긴 문서에서도 [인쇄하기]가 늘 보인다. */}
            <div className="report-toolbar border-subtle-3 bg-card sticky top-0 z-10 border-b">
                <div className="max-w-content mx-auto flex items-center justify-between gap-4 px-6 py-3">
                    <p className="typo-body-xl-bold text-foreground min-w-0 truncate">{title}</p>
                    {/* [인쇄하기]가 이 화면의 주된 행동이라 primary 로 둔다. [닫기]는 보조라 tertiary 다. */}
                    <div className="flex shrink-0 items-center gap-2">
                        <Button type="button" size="md" className="gap-1" onClick={() => window.print()}>
                            <Printer aria-hidden="true" />
                            {PRINT_LABEL}
                        </Button>
                        <Button
                            type="button"
                            variant="tertiary"
                            size="md"
                            className="bg-card gap-1"
                            onClick={() => window.close()}
                        >
                            <X aria-hidden="true" />
                            {CLOSE_LABEL}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 안내 — 화면에서만 보인다(.report-toolbar 규칙으로 인쇄물에서는 빠진다). */}
            <div className="report-toolbar border-subtle-3 bg-background border-b">
                <p className="max-w-content typo-body-l-regular text-foreground-subtle mx-auto flex items-start gap-2 px-6 py-3 break-keep">
                    <Info aria-hidden="true" className="size-icon-sm mt-0.5 shrink-0" />
                    <span className="min-w-0">{TEMPLATE_NOTICE}</span>
                </p>
            </div>

            {/* 무대 — 회색 바탕 가운데에 흰 용지를 놓는다. */}
            <div ref={stageRef} className="report-stage flex w-full min-w-0 flex-1 flex-col items-center gap-10 p-10">
                {children}
            </div>
        </div>
    )
}

// 용지 한 장 — A4 비율의 흰 면이다. 안쪽은 늘 1360px 폭으로 그리고 바깥에서 배율만 바뀐다.
//
// 쪽수는 용지 맨 아래 가운데에 '3 / 5' 로 둔다. 화면과 인쇄물에 같은 자리로 나온다 —
// 브라우저가 찍는 쪽수(인쇄 대화상자의 머리글/바닥글)는 위치 · 모양을 정할 수 없어 쓰지 않는다.
// [프론트엔드 연동] page · total 은 쓰는 쪽이 넘긴다 — 쪽이 늘어나면 그 수가 그대로 따라간다.
const ReportSheet = ({page, total, children}: {page?: number; total?: number; children: ReactNode}) => (
    <div className="report-sheet-box shrink-0">
        <div className="report-sheet bg-surface flex flex-col shadow-lg">
            <div className="min-h-0 flex-1">{children}</div>
            {page && total ? (
                <p className="typo-body-l-regular text-foreground-subtle shrink-0 pb-10 text-center">
                    {page} / {total}
                </p>
            ) : null}
        </div>
    </div>
)

export {ReportPrintShell, ReportSheet}
export type {ReportPrintShellProps}
