import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import ActiveBreakpointTag from '@/components/guide/active-breakpoint-tag'
import ThemeToggle from '@/components/composite/theme-toggle'
import tokens from '@tokens'

export const metadata: Metadata = {title: '레이아웃 그리드 (Grid)'}

// 그리드 데모: 현재 브레이크포인트에서 실제 노출되는 컬럼 수만큼만 보이도록 매핑한다.
// 프리픽스는 Tailwind 정적 분석을 위해 리터럴로 고정 — 새 브레이크포인트 추가 시 함께 갱신.
const GRID_MAX_COLUMNS = Math.max(tokens.grid.mobile.columns, tokens.grid.md.columns, tokens.grid.xl.columns)
const getGridRevealClass = (index: number) => {
    if (index < tokens.grid.mobile.columns) return 'flex'
    if (index < tokens.grid.md.columns) return 'hidden md:flex'
    return 'hidden xl:flex'
}

// container 감을 잡기 위한 기준 뷰포트. 모바일은 고정 상한 없이 유동('100%')이므로
// 360px 예시값을 계산하고, md·xl은 프로젝트 검수 기준 뷰포트를 함께 표기한다.
const REFERENCE_VIEWPORT: Record<string, number> = {mobile: 360, md: 1200, xl: 1920}

const GRID_RANGE_LABELS: Record<string, string> = {
    mobile: 'Mobile',
    md: 'Tablet (md)',
    xl: 'PC (xl)',
}

// grid.container 가 container 토큰 키(예: "content")면 실제 px 로 되찾아 표에 보여준다(값 단일 소스).
const CONTAINER_PX: Record<string, number> = tokens.container

// 레이아웃 그리드 — 사이드바 없는 독립 전체화면. .grid-layout 이 뷰포트 전체 폭을 그대로
// 써서 해상도별 실제 그리드(모바일 328 / 태블릿 792 / 데스크톱 1200)를 정확히 확인할 수 있다.
// (컴포넌트 가이드 사이드 레이아웃 안에 넣으면 xl(≥1280)에서 사이드바 폭만큼 좁아져 값이 어긋난다.)
const GridPreviewPage = () => (
    <main className="bg-background text-foreground flex min-h-screen flex-col gap-10 py-12 md:py-16">
        {/* 제목·설명 + 테마 토글 (읽기 좋은 폭으로 제한) */}
        <div className="max-w-content mx-auto w-full px-6">
            <BaseCard>
                <section aria-labelledby="grid-title" className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                        <h1 id="grid-title" className="typo-display-m-bold">
                            레이아웃 그리드 (Grid)
                        </h1>
                        <ThemeToggle />
                    </div>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        브라우저 폭에 따라 컬럼 수가 4 → 8 → 12로 바뀝니다. 사이드바 없이 뷰포트 전체 폭을 사용해
                        가장자리 여백과 거터를 실제 레이아웃 기준으로 확인합니다.
                    </p>
                </section>
            </BaseCard>
        </div>

        {/* 미리보기 — 뷰포트 전체 폭. .grid-layout 이 스스로 container 고정폭 + 최소 여백으로 제어한다. */}
        <div className="grid-layout">
            {Array.from({length: GRID_MAX_COLUMNS}).map((_, i) => (
                <span
                    key={i}
                    aria-hidden="true"
                    className={`${getGridRevealClass(i)} bg-destructive/15 border-destructive/40 h-20 items-center justify-center rounded-md border`}
                >
                    <span className="bg-card border-destructive text-destructive typo-body-l-medium flex size-7 items-center justify-center rounded-full border-2">
                        {i + 1}
                    </span>
                </span>
            ))}
        </div>

        {/* 표 — 읽기 좋은 폭으로 제한 */}
        <div className="max-w-content mx-auto w-full px-6">
            <BaseCard>
                <section aria-labelledby="grid-reference" className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 id="grid-reference" className="typo-h4-bold text-foreground">
                            Grid reference
                        </h2>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            각 구간의 컬럼 수, 거터, 컨테이너 폭과 최소 바깥 여백을 확인합니다.
                        </p>
                    </div>
                    <div className="border-border overflow-x-auto rounded-xl border">
                        <table className="w-full text-left">
                            <caption className="sr-only">
                                브레이크포인트별 그리드 columns·gutter·container·margin
                            </caption>
                            <thead>
                                <tr className="border-border bg-card border-b">
                                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                                        구간
                                    </th>
                                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                                        columns
                                    </th>
                                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                                        gutter
                                    </th>
                                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                                        container
                                    </th>
                                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                                        margin (최소)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const order = ['mobile', ...Object.keys(tokens.breakpoint)]
                                    const rows = Object.entries(tokens.grid).sort(
                                        ([a], [b]) => order.indexOf(a) - order.indexOf(b),
                                    )
                                    return rows.map(([key, g]) => (
                                        <tr key={key} className="border-border border-b last:border-b-0">
                                            <td className="typo-body-l-regular px-4 py-3">
                                                <span className="inline-flex items-center gap-2">
                                                    {GRID_RANGE_LABELS[key] ?? key}
                                                    <ActiveBreakpointTag targetKey={key} />
                                                </span>
                                            </td>
                                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                                {g.columns}
                                            </td>
                                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                                {g.gutter}px
                                            </td>
                                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                                {key === 'mobile'
                                                    ? `${REFERENCE_VIEWPORT.mobile - 2 * g.margin}px (${REFERENCE_VIEWPORT.mobile}px 기준)`
                                                    : `${typeof g.container === 'number' ? g.container : CONTAINER_PX[g.container]}px (${REFERENCE_VIEWPORT[key]}px 기준)`}
                                            </td>
                                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                                {g.margin}px
                                            </td>
                                        </tr>
                                    ))
                                })()}
                            </tbody>
                        </table>
                    </div>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        컬럼 없이 폭만 공유하는 <code className="font-mono">.content-layout</code> 유틸리티도 제공합니다
                        — 콘텐츠 최대 폭(max-w-content) 상한과 위 margin(최소 바깥 여백)을 그대로 쓰되, 구간별 container
                        캡핑 없이 항상 콘텐츠 폭까지 넓어집니다. 메인페이지 헤더처럼 그리드 티어보다 넓게 유지해야 하는
                        풀블리드 요소에 사용합니다.
                    </p>
                </section>
            </BaseCard>
        </div>
    </main>
)

export default GridPreviewPage
