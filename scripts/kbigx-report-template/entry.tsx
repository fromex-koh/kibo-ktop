// 단독 HTML 의 화면 코드 — 문서 안의 JSON(#kbigx-report-data)을 읽어 현행 PDF 템플릿(KbigxPrintDocument)으로 다시 그린다.
// 결과는 #kbigx-report-root 의 속성으로 알린다 — 다 그리면 data-ready="true", 그릴 수 없으면 data-error="<이유>".
// build.mjs 가 esbuild 로 묶어 HTML 안에 넣는다(앱 빌드에는 쓰이지 않는다).
import {ThemeProvider} from 'next-themes'
import {Component, useEffect, type ReactNode} from 'react'
import {createRoot} from 'react-dom/client'
import {KbigxPrintDocument} from '@/components/custom/kbigx-print-document'
import {INNOVATION_REPORT_CASES, type InnovationGrowthReport} from '@/content/service/k-bigx-innovation-report'
import {buildKbigxPrintPages, parseKbigxPrintSections} from '@/content/service/k-bigx-print-report'

const READY_TIMEOUT_MS = 10000
const READY_INTERVAL_MS = 100

const root = document.getElementById('kbigx-report-root')
const dataElement = document.getElementById('kbigx-report-data')

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error))

// 그릴 수 없을 때 — 미리 그린 마크업(목업 값)을 지우고 이유를 남긴다. 목업 값이 실데이터처럼 저장되지 않게.
const fail = (reason: string) => {
    if (!root) return
    root.replaceChildren()
    root.removeAttribute('data-ready')
    root.setAttribute('data-error', reason)
    console.error(`[kbigx-report] ${reason}`)
}

// 그리는 중 오류(데이터 모양이 맞지 않는 등)를 잡아 fail 로 넘긴다. 오류 경계는 클래스 컴포넌트로만 만들 수 있다.
class RenderErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
    state = {hasError: false}
    static getDerivedStateFromError = () => ({hasError: true})
    componentDidCatch = (error: unknown) => fail(`그리는 중 오류: ${errorMessage(error)}`)
    render = () => (this.state.hasError ? null : this.props.children)
}

// 다시 그린 화면이 문서에 반영(커밋)된 뒤에 불린다 — 그 전에는 미리 그린 마크업이 남아 있어 data-ready 를 판단하지 않는다.
const RenderedSignal = ({onRendered}: {onRendered: () => void}) => {
    useEffect(onRendered, [onRendered])
    return null
}

// data-ready 를 붙이는 순서 — 차트 스켈레톤이 사라지고(최대 10초) → 글꼴을 다 받고 → 두 프레임 그려진 뒤.
// 스켈레톤 기준은 프로젝트의 자동 인쇄(report-print-shell.tsx useAutoPrint)와 같다.
const markReadyWhenDrawn = (target: HTMLElement) => {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))
    const startedAt = Date.now()
    const timer = window.setInterval(() => {
        const isChartPending = Boolean(target.querySelector('[data-slot="chart-skeleton"]'))
        if (isChartPending && Date.now() - startedAt < READY_TIMEOUT_MS) return
        window.clearInterval(timer)
        void document.fonts.ready
            .then(nextFrame)
            .then(nextFrame)
            .then(() => {
                if (!target.hasAttribute('data-error')) target.setAttribute('data-ready', 'true')
            })
    }, READY_INTERVAL_MS)
}

// 열람 케이스만 확인한다 — 그 밖의 필드 모양은 InnovationGrowthReport 를 따른다고 보고, 어긋나면 RenderErrorBoundary 가 잡는다.
const hasViewerCase = (data: object): data is InnovationGrowthReport =>
    'viewerCase' in data && INNOVATION_REPORT_CASES.some((item) => item === data.viewerCase)

const readReport = (): InnovationGrowthReport | null => {
    try {
        const data: unknown = JSON.parse(dataElement?.textContent ?? '')
        if (!data || typeof data !== 'object') {
            fail('데이터가 객체(JSON object)가 아닙니다.')
            return null
        }
        // 열람 케이스는 기본값으로 채우지 않는다 — "self"(가림 없음)로 대신 그리면 가려야 할 신용 정보가 찍힌다.
        if (!hasViewerCase(data)) {
            const received = 'viewerCase' in data ? data.viewerCase : undefined
            fail(
                `viewerCase 가 없거나 잘못됐습니다(받은 값: ${JSON.stringify(received)}). ${INNOVATION_REPORT_CASES.join(' | ')} 중 하나를 넣으세요.`,
            )
            return null
        }
        return data
    } catch (error) {
        fail(`JSON 형식 오류: ${errorMessage(error)}`)
        return null
    }
}

// 쪽 나누기 계산처럼 그리기 전에 나는 오류도 fail 로 넘긴다(RenderErrorBoundary 는 그리는 중 오류만 잡는다).
const start = (target: HTMLElement, report: InnovationGrowthReport) => {
    // ?sections=briefing,company — 그 장만 그린다(없으면 전체). 화면 확인용 주소 값(?case= · ?empty=)은 두지 않는다 —
    // 붙여도 무시되므로 넣은 데이터 대신 목업 케이스가 저장될 일이 없다.
    const sections = new URLSearchParams(window.location.search).get('sections') ?? undefined
    const pages = buildKbigxPrintPages(report, parseKbigxPrintSections(sections))

    // 한 번만 — 다시 그려도 data-ready 판단을 겹쳐 시작하지 않는다.
    let isReadyStarted = false
    const handleRendered = () => {
        if (isReadyStarted) return
        isReadyStarted = true
        markReadyWhenDrawn(target)
    }

    // 테마는 라이트로 고정한다 — 프로젝트의 PDF 화면도 라이트로 그리고, 워드 클라우드는 테마를 읽은 뒤에 그린다.
    createRoot(target).render(
        <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false}>
            <RenderErrorBoundary>
                <div className="kbigx-print">
                    <div className="bg-background flex min-h-dvh w-full flex-col">
                        <main className="report-stage flex w-full min-w-0 flex-1 flex-col items-center gap-10 p-10">
                            <KbigxPrintDocument report={report} pages={pages} />
                        </main>
                    </div>
                </div>
                <RenderedSignal onRendered={handleRendered} />
            </RenderErrorBoundary>
        </ThemeProvider>,
    )
}

const report = root ? readReport() : null
if (root && report) {
    try {
        start(root, report)
    } catch (error) {
        fail(`데이터 모양 오류: ${errorMessage(error)}`)
    }
}
