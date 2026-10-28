'use client'

// 'use client' — [인쇄하기]가 브라우저의 인쇄 대화상자를 열고, [PDF 다운로드]가 PDF 파일을 만들고, [닫기]가 창을 닫는다.
import {useEffect, useLayoutEffect, useRef, useState, type ReactNode} from 'react'
import {Download, Info, LoaderCircle, Printer, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {downloadReportPdf} from '@/lib/download-report-pdf'
import {REPORT_AUTO_PRINT_QUERY} from '@/lib/open-report-print-tab'

// 인쇄용 보고서를 감싸는 껍데기 — 위쪽 도구 막대와 용지를 놓는 보고서 영역으로 이루어진다.
// 보고서 화면이 모두 같은 껍데기를 쓴다(특허평가 결과 보고서 등).
//
// 주소에 ?print=1 이 붙으면 문서가 다 그려진 뒤 스스로 인쇄 대화상자를 연다 — 화면의 [출력] 버튼이 이 값을 붙여 열므로
// 미리보기 화면을 거치지 않는다. 특허평가 보고서는 숨긴 프레임으로(patent-grade-lookup.tsx), K-BIGx 보고서는 새 탭으로
// 연다(lib/open-report-print-tab.ts — 새 탭은 인쇄가 끝나면 스스로 닫힌다). 주소를 그대로 열면 대화상자 없이 문서만 보인다.
//
// 도구 막대는 화면에서만 보이고 인쇄물에는 나오지 않는다 — .report-toolbar 규칙은 styles/report-print.css 에 있다.
// 용지 규격(A4 비율 · 배율)도 같은 CSS 가 갖는다 — 쓰는 쪽은 .report-sheet 안에 내용만 그린다.

// 차트는 브라우저가 크기를 잰 뒤에 그려진다 — 스켈레톤이 남아 있으면 그 상태로 인쇄된다.
// 다 그려질 때까지 짧게 기다렸다가 열고, 그래도 안 끝나면 더 기다리지 않는다(문서가 없는 화면도 있다).
const PRINT_READY_INTERVAL_MS = 100
const PRINT_READY_TIMEOUT_MS = 5000

const CLOSE_LABEL = '닫기'

// 도구 막대의 주된 버튼 — 보고서마다 고른다(primaryAction).
//   · print(기본) — [인쇄하기] · 브라우저 인쇄 대화상자를 연다(특허평가 결과 보고서).
//   · pdf-download — [PDF 다운로드] · 화면의 쪽들을 PDF 한 파일로 바로 내려받는다(K-BIGx 보고서). 인쇄 대화상자는 열지 않는다.
//     브라우저에서 쪽을 그림으로 떠 만든다(lib/download-report-pdf.ts). 만드는 동안 버튼이 '만드는 중'으로 바뀌고 눌리지 않는다.
//     [프론트엔드 연동] 서버에서 PDF 를 만들어 주게 되면 handlePrimaryAction 의 downloadReportPdf 자리를 그 다운로드로 바꾼다.
type ReportPrintPrimaryAction = 'print' | 'pdf-download'
const PRIMARY_ACTIONS = {
    print: {label: '인쇄하기', icon: Printer},
    'pdf-download': {label: 'PDF 다운로드', icon: Download},
} as const satisfies Record<ReportPrintPrimaryAction, {label: string; icon: typeof Printer}>
const PDF_DOWNLOADING_LABEL = 'PDF 만드는 중…'
const PDF_ERROR_MESSAGE = 'PDF 파일을 만들지 못했습니다. 잠시 뒤 다시 시도해 주세요.'
const PDF_FILE_EXTENSION = '.pdf'

// 이 주소는 서비스 흐름에 들어가지 않는다 — 보고서 템플릿을 눈으로 확인하는 자리다.
// 기본 문구는 특허평가 결과 보고서 흐름이다. 흐름이 다른 보고서는 notice 로 문구를 넘긴다.
const DEFAULT_TEMPLATE_NOTICE =
    '이 화면은 서비스 화면이 아니라 결과 보고서 템플릿을 확인하는 용도입니다. 서비스에서는 [결과 보고서 출력]을 누르면 이 화면 없이 인쇄 대화상자가 바로 열립니다.'

// 용지 폭(styles/report-print.css 의 --report-sheet-width)과 보고서 영역 좌우 여백(p-10 × 2).
const SHEET_WIDTH = 1360
const STAGE_PADDING = 80
// 화면에서 용지가 커지는 한계 — 다른 화면의 콘텐츠 폭(max-w-content 1200)과 같게 맞춘다.
const MAX_SHEET_DISPLAY_WIDTH = 1200

// 화면 배율 — 보고서 영역이 좁으면 그만큼 용지를 줄이고, 넓어도 콘텐츠 폭(1200)까지만 키운다.
// CSS 만으로는 길이를 길이로 나눠 배율을 만들 수 없어 여기서 재서 --report-scale 에 넣는다.
// 첫 그림은 CSS 기본값(1200 ÷ 1360)으로 이미 맞춰져 있고, 여기서는 좁은 화면일 때만 더 줄인다 —
// 그려진 뒤에 값을 바꾸면 크기가 한 번 튀므로 그리기 전에 재도록 useLayoutEffect 를 쓴다.
// 인쇄 배율은 styles/report-print.css 가 따로 정하므로 이 값은 인쇄물에 영향을 주지 않는다.
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

// Safari 전용 — 인쇄 직전에만 용지를 A4 한 쪽으로 접는다(styles/report-print.css 의 data-print-fit).
// Safari 는 쪽을 나눌 때 화면 레이아웃을 보므로 화면에서도 A4 여야 하는데, 처음부터 접어 두면
// 차트가 줄어든 폭을 재서 작게 그려진다. 차트가 다 그려진 뒤인 인쇄 직전에 접으면 둘 다 맞는다.
const PRINT_FIT_ATTRIBUTE = 'data-print-fit'
const fitForPrint = () => document.documentElement.setAttribute(PRINT_FIT_ATTRIBUTE, '')
const unfitAfterPrint = () => document.documentElement.removeAttribute(PRINT_FIT_ATTRIBUTE)

// beforeprint 만으로는 늦을 수 있다 — Safari 는 beforeprint 에서 바꾼 배치가 그려지기 전에 첫 쪽 나눔을 하는 경우가 있어,
// 접히기 전 높이(1924px)로 나뉜 쪽 사이사이에 빈 쪽이 낀다. 인쇄 설정을 바꿔 다시 나누면 그때는 접힌 배치를 봐서 빈 쪽이
// 사라진다. 그래서 대화상자를 여는 쪽(자동 인쇄 · [인쇄하기])은 글꼴이 다 받아지고 접힌 배치가 화면에 그려진 뒤(두 프레임)에
// print() 를 부른다. 메뉴 · 단축키로 여는 인쇄는 아래 beforeprint 가 그대로 맡는다.
const printWhenFitted = async () => {
    await document.fonts.ready
    fitForPrint()
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    window.print()
}

const usePrintFit = () => {
    useEffect(() => {
        window.addEventListener('beforeprint', fitForPrint)
        window.addEventListener('afterprint', unfitAfterPrint)

        return () => {
            window.removeEventListener('beforeprint', fitForPrint)
            window.removeEventListener('afterprint', unfitAfterPrint)
        }
    }, [])
}

// 주소에 ?print=1 이 붙었을 때만 — 문서가 다 그려지면 인쇄 대화상자를 연다.
const useAutoPrint = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get(REPORT_AUTO_PRINT_QUERY) !== '1') return

        const startedAt = Date.now()
        const isReady = () =>
            !document.querySelector('[data-slot="chart-skeleton"]') || Date.now() - startedAt > PRINT_READY_TIMEOUT_MS

        const timer = window.setInterval(() => {
            if (!isReady()) return

            window.clearInterval(timer)
            // 새 탭으로 열린 문서(openReportPrintTab)는 인쇄가 끝나거나 취소되면 스스로 닫는다. 숨긴 프레임 · 직접 연 주소는
            // 여는 창(opener)이 없어 그대로 둔다.
            if (window.opener) window.addEventListener('afterprint', () => window.close(), {once: true})
            void printWhenFitted()
        }, PRINT_READY_INTERVAL_MS)

        return () => window.clearInterval(timer)
    }, [])
}

type ReportPrintShellProps = {
    /** 도구 막대 왼쪽에 놓을 문서 이름. 창 제목과 같은 말을 쓴다. */
    title: string
    /** 용지(.report-sheet) 안에 그릴 내용. 장이 여럿이면 장마다 하나씩 넘긴다. */
    children: ReactNode
    /** 도구 막대 아래 안내 문구(화면에서만 보인다). 없으면 특허평가 결과 보고서 문구, null 이면 안내 줄을 뺀다. */
    notice?: string | null
    /** 도구 막대의 주된 버튼. 기본 print([인쇄하기]), K-BIGx 보고서는 pdf-download([PDF 다운로드]). */
    primaryAction?: ReportPrintPrimaryAction
    /** pdf-download 로 받을 파일 이름(확장자 제외). 없으면 title. [프론트엔드 연동] 보고서마다 구분되게 기업명 등을 넣는다. */
    pdfFileName?: string
}

const ReportPrintShell = ({
    title,
    children,
    notice = DEFAULT_TEMPLATE_NOTICE,
    primaryAction = 'print',
    pdfFileName,
}: ReportPrintShellProps) => {
    const stageRef = useSheetScale()
    const {label: primaryLabel, icon: PrimaryIcon} = PRIMARY_ACTIONS[primaryAction]
    const [isPdfDownloading, setIsPdfDownloading] = useState(false)
    const [pdfError, setPdfError] = useState('')

    const downloadPdf = async () => {
        setIsPdfDownloading(true)
        setPdfError('')
        try {
            await downloadReportPdf(`${pdfFileName ?? title}${PDF_FILE_EXTENSION}`)
        } catch {
            setPdfError(PDF_ERROR_MESSAGE)
        } finally {
            setIsPdfDownloading(false)
        }
    }

    const handlePrimaryAction = () => void (primaryAction === 'pdf-download' ? downloadPdf() : printWhenFitted())

    usePrintFit()
    useAutoPrint()

    return (
        <div className="bg-background flex min-h-dvh w-full flex-col">
            {/* 도구 막대 — 화면 위에 고정해 긴 문서에서도 주된 버튼([인쇄하기] · [PDF 다운로드])이 늘 보인다. header · main 은 화면 낭독기의 영역 이동용 랜드마크다. */}
            <header className="report-toolbar border-subtle-3 bg-card sticky top-0 z-10 border-b">
                <div className="max-w-content mx-auto flex items-center justify-between gap-4 px-6 py-3">
                    <div className="typo-body-xl-bold text-foreground min-w-0 truncate">{title}</div>
                    {/* 주된 버튼이 이 화면의 주된 행동이라 primary 로 둔다. [닫기]는 보조라 tertiary 다. */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* PDF 를 만드는 동안(쪽 수에 따라 몇 초) 버튼을 막고 아이콘을 도는 스피너로, 글자를 '만드는 중'으로 바꾼다
                            — aria-busy 로 진행 중임을 알린다(버튼 가이드의 '진행 중' 상태와 같다). */}
                        <Button
                            type="button"
                            size="md"
                            className="gap-1"
                            disabled={isPdfDownloading}
                            aria-busy={isPdfDownloading || undefined}
                            onClick={handlePrimaryAction}
                        >
                            {isPdfDownloading ? (
                                <LoaderCircle aria-hidden="true" className="animate-spin" />
                            ) : (
                                <PrimaryIcon aria-hidden="true" />
                            )}
                            {isPdfDownloading ? PDF_DOWNLOADING_LABEL : primaryLabel}
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
            </header>

            {/* PDF 를 만들지 못했을 때만 — 도구 막대 바로 아래에 알린다(role="alert" 로 바로 읽힌다). */}
            {pdfError ? (
                <div className="report-toolbar border-subtle-3 bg-background border-b">
                    <p
                        role="alert"
                        className="max-w-content typo-body-l-medium text-error mx-auto px-6 py-3 break-keep"
                    >
                        {pdfError}
                    </p>
                </div>
            ) : null}

            {/* 안내 — 화면에서만 보인다(.report-toolbar 규칙으로 인쇄물에서는 빠진다). */}
            {notice === null ? null : (
                <div className="report-toolbar border-subtle-3 bg-background border-b">
                    <p className="max-w-content typo-body-l-regular text-foreground-subtle mx-auto flex items-start gap-2 px-6 py-3 break-keep">
                        <Info aria-hidden="true" className="size-icon-sm mt-0.5 shrink-0" />
                        <span className="min-w-0">{notice}</span>
                    </p>
                </div>
            )}

            {/* 보고서 영역 — 회색 바탕 가운데에 흰 용지를 놓는다. */}
            <main ref={stageRef} className="report-stage flex w-full min-w-0 flex-1 flex-col items-center gap-10 p-10">
                {children}
            </main>
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
                <div className="typo-body-l-regular text-foreground-subtle shrink-0 pb-10 text-center">
                    {page} / {total}
                </div>
            ) : null}
        </div>
    </div>
)

export {ReportPrintShell, ReportSheet}
export type {ReportPrintPrimaryAction, ReportPrintShellProps}
