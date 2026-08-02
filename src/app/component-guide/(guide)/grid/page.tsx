import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import ActiveBreakpointTag from '@/components/custom/active-breakpoint-tag'
import {Table} from '@/components/custom/table'
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
// 키 타입이 tokens.grid 라, grid 티어를 추가하고 여기 빠뜨리면 typecheck 가 실패한다.
const REFERENCE_VIEWPORT: Record<keyof typeof tokens.grid, number> = {mobile: 360, md: 1200, xl: 1920}
const REFERENCE_VIEWPORT_BY_KEY = new Map<string, number>(Object.entries(REFERENCE_VIEWPORT))

const GRID_RANGE_LABELS: Record<keyof typeof tokens.grid, string> = {
    mobile: 'Mobile',
    md: 'Tablet (md)',
    xl: 'PC (xl)',
}
const GRID_RANGE_LABELS_BY_KEY = new Map<string, string>(Object.entries(GRID_RANGE_LABELS))

// grid.container 가 container 토큰 키(예: "content")면 실제 px 로 되찾아 표에 보여준다(값 단일 소스).
const CONTAINER_PX: Record<string, number> = tokens.container

const GRID_COLUMNS = [
    {key: 'range', header: '구간', align: 'start', rowHeader: true},
    {key: 'columns', header: 'columns', align: 'start'},
    {key: 'gutter', header: 'gutter', align: 'start'},
    {key: 'container', header: 'container', align: 'start'},
    {key: 'margin', header: 'margin (최소)', align: 'start'},
] as const

// 레이아웃 그리드 — 가이드 사이드바 안에서 본문 폭을 기준으로 컬럼·거터·여백을 확인한다.
// main 과 테마 토글은 가이드 레이아웃이 제공하므로 페이지에서 다시 만들지 않는다.
const GridPreviewPage = () => (
    <div className="flex flex-col gap-10 py-12 md:py-16">
        {/* 제목·설명 + 테마 토글 (읽기 좋은 폭으로 제한) */}
        <div className="max-w-content mx-auto w-full px-6">
            <BaseCard>
                <section aria-labelledby="grid-title" className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                        <h1 id="grid-title" className="typo-display-s-bold">
                            레이아웃 그리드 (Grid)
                        </h1>
                    </div>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        일반 콘텐츠는 <code className="font-mono">grid-layout</code>을 사용합니다. 컬럼 없이 최대 폭만
                        필요한 풀블리드 요소는 <code className="font-mono">content-layout</code>을 사용합니다.
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
                            구간별 설정
                        </h2>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            컬럼·거터·컨테이너·최소 여백은 <code className="font-mono">tokens.json</code>에서
                            관리합니다.
                        </p>
                    </div>
                    <Table
                        size="md"
                        caption="브레이크포인트별 그리드 columns·gutter·container·margin"
                        columns={GRID_COLUMNS}
                        rows={(() => {
                            const order = ['mobile', ...Object.keys(tokens.breakpoint)]
                            return Object.entries(tokens.grid)
                                .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
                                .map(([key, g]) => ({
                                    key,
                                    cells: [
                                        <span key="range" className="inline-flex items-center gap-2">
                                            {GRID_RANGE_LABELS_BY_KEY.get(key) ?? key}
                                            <ActiveBreakpointTag targetKey={key} />
                                        </span>,
                                        <span key="columns" className="text-muted-foreground font-mono">
                                            {g.columns}
                                        </span>,
                                        <span key="gutter" className="text-muted-foreground font-mono">
                                            {g.gutter}px
                                        </span>,
                                        <span
                                            key="container"
                                            className="text-muted-foreground font-mono whitespace-nowrap"
                                        >
                                            {key === 'mobile'
                                                ? `${REFERENCE_VIEWPORT.mobile - 2 * g.margin}px (${REFERENCE_VIEWPORT.mobile}px 기준)`
                                                : `${typeof g.container === 'number' ? g.container : CONTAINER_PX[g.container]}px (${REFERENCE_VIEWPORT_BY_KEY.get(key)}px 기준)`}
                                        </span>,
                                        <span key="margin" className="text-muted-foreground font-mono">
                                            {g.margin}px
                                        </span>,
                                    ],
                                }))
                        })()}
                    />
                    <p className="typo-body-l-regular text-foreground-subtle">
                        <code className="font-mono">content-layout</code>은 컬럼 없이 콘텐츠 최대 폭과 최소 여백만
                        적용합니다. 헤더처럼 그리드보다 넓게 유지할 요소에 사용합니다.
                    </p>
                </section>
            </BaseCard>
        </div>
    </div>
)

export default GridPreviewPage
