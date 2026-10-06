import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import ActiveBreakpointTag from '@/components/custom/active-breakpoint-tag'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '브레이크포인트 (Breakpoint)'}

const BREAKPOINT_COLUMNS = [
    {key: 'name', header: '구간', align: 'start'},
    {key: 'range', header: '범위', align: 'start'},
    {key: 'prefix', header: '프리픽스', align: 'start'},
    {key: 'device', header: '포함 기기', align: 'start', wrap: true},
] as const

const HEIGHT_VARIANT_COLUMNS = [
    {key: 'prefix', header: '프리픽스', align: 'start'},
    {key: 'condition', header: '조건', align: 'start'},
    {key: 'usage', header: '쓰임', align: 'start', wrap: true},
] as const

// 높이 축 변형 — 조건은 tokens.json 의 breakpoint.md · breakpointHeight 에서 생성되므로 여기서도 그 값을 읽는다.
const HEIGHT_VARIANTS = [
    {
        prefix: 'pager-on:',
        condition: `너비 ≥ ${tokens.breakpoint.md}px 그리고 높이 ≥ ${tokens.breakpointHeight.stack}px`,
        usage: '스택 페이저가 켜져 섹션이 고정 레이어로 전환되는 화면',
    },
    {
        prefix: 'pager-off:',
        condition: `너비 < ${tokens.breakpoint.md}px 또는 높이 < ${tokens.breakpointHeight.stack}px`,
        usage: '페이저가 꺼져 자연 스크롤 + 스크롤 스냅으로 넘어가는 화면',
    },
    {
        prefix: 'short:',
        condition: `높이 < ${tokens.breakpointHeight.stack}px`,
        usage: '초소형 모바일·낮은 데스크톱 창에서 세로 밀도를 한 단계 낮출 때',
    },
    {
        prefix: 'landscape:',
        condition: `높이 < ${tokens.breakpointHeight.landscape}px`,
        usage: '모바일 가로. 너비 조건이 없어 가로 모드 폭이 768px 이상인 기기도 포함한다',
    },
    {
        prefix: 'stack-fallback:',
        condition: `너비 ≥ ${tokens.breakpoint.md}px 그리고 ${tokens.breakpointHeight.landscape}px ≤ 높이 < ${tokens.breakpointHeight.stack}px`,
        usage: '페이저는 꺼졌지만 모바일도 아닌 띠 — 섹션이 최소 설계 높이를 유지해야 하는 구간',
    },
] as const

// 브레이크포인트 — Tailwind 기본 프리픽스를 그대로 쓰고, 프로젝트 주 티어는 md(768)·xl(1280).
// 적용 규칙 카드 — 규칙마다 제목 · 핵심 코드 · 설명을 같은 자리에 둔다.
const BREAKPOINT_RULES = [
    {
        title: '주 구간',
        code: 'md: · xl:',
        description:
            '프리픽스 없는 클래스는 모든 폭에 적용되고, md: · xl: 은 그 폭 이상에서 덮어씁니다. 레이아웃은 이 두 구간을 기준으로 잡습니다.',
    },
    {
        title: '보조 구간',
        code: 'sm: (640) · lg: (1024) · 2xl: (1536)',
        description: 'Tailwind 기본 구간도 쓸 수 있습니다. 두 주 구간만으로 맞추기 어려운 세부 조정에 씁니다.',
    },
    {
        title: '값 변경',
        code: 'tokens.json breakpoint',
        description: 'md · xl 값은 여기에서만 바꿉니다. 타이포그래피와 그리드도 같은 값을 따릅니다.',
    },
    {
        title: '스크립트',
        code: `(min-width: ${tokens.breakpoint.md / tokens.remBase}rem)`,
        description: '스크립트에서 화면 폭을 볼 때(matchMedia)도 같은 값을 씁니다.',
    },
]

const BreakpointGuidePage = () => (
    <GuidePageShell
        title="브레이크포인트 (Breakpoint)"
        description={
            <>
                화면 폭에 따라 레이아웃을 바꾸는 기준입니다. 주 구간은 <code>md:</code>(≥{tokens.breakpoint.md}px)와{' '}
                <code>xl:</code>(≥{tokens.breakpoint.xl}px)입니다.
            </>
        }
    >
        <BaseCard>
            <section aria-labelledby="s-bp-rule" className="flex flex-col gap-6">
                <h2 id="s-bp-rule" className="typo-h4-bold text-foreground">
                    반응형 적용 방식
                </h2>
                {/* 규칙마다 같은 자리에 같은 항목(제목 · 핵심 코드 · 설명)을 둔다. */}
                <div className="grid gap-4 md:grid-cols-2">
                    {BREAKPOINT_RULES.map((rule) => (
                        <div
                            key={rule.title}
                            className="border-foreground-subtle/30 bg-pastel-neutral/40 flex flex-col gap-3 rounded-sm border p-5"
                        >
                            <h3 className="typo-body-xl-bold text-foreground">{rule.title}</h3>
                            <code className="bg-card text-foreground border-subtle-3 w-fit max-w-full rounded-xs border px-2 py-1 font-mono text-sm break-all">
                                {rule.code}
                            </code>
                            <p className="text-label-foreground">{rule.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        {/* 라이브 데모 — 브라우저 폭을 줄였다 늘리면 실제로 재배치된다. 프리픽스 동작을 그대로 보여주려
            grid-cols-* 를 직접 조합했다(실제 콘텐츠 그리드는 PB-15 대로 .grid-layout 사용). */}
        <BaseCard>
            <section aria-labelledby="s-bp-demo" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="s-bp-demo" className="typo-h4-bold">
                        라이브 데모
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        브라우저 폭을 줄였다 늘리면 아래 카드가{' '}
                        <code className="text-foreground font-mono">1 → 2 → 3</code>열로 재배치되고, 현재 구간 표시도
                        함께 바뀝니다.
                    </p>
                </div>

                {/* 현재 구간 — CSS 프리픽스만으로 구간별 하나만 보이게 토글(그 자체가 프리픽스 동작 예시).
                    데모에서 가장 먼저 봐야 할 값이라 포인트 띠로 세우고, 적용한 클래스를 옆에 둔다. */}
                <div className="border-primary/30 bg-primary-subtle flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-sm border p-5">
                    <p className="typo-body-l-regular text-foreground">
                        현재 활성 구간:{' '}
                        <strong className="typo-body-xl-bold text-primary-strong">
                            <span className="md:hidden">mobile (기본)</span>
                            <span className="hidden md:inline xl:hidden">md (≥768px)</span>
                            <span className="hidden xl:inline">xl (≥1280px)</span>
                        </strong>
                    </p>
                    <code className="text-foreground font-mono text-sm font-semibold">
                        grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
                    </code>
                </div>

                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({length: 6}, (_, i) => i + 1).map((n) => (
                        // 레이아웃 그리드 가이드의 컬럼 칸과 같은 스타일(옅은 빨강 칸 + 번호 원)이다.
                        <li
                            key={n}
                            className="bg-destructive/15 border-destructive/40 flex h-20 items-center justify-center rounded-md border"
                        >
                            <span className="bg-card border-destructive text-destructive typo-body-l-medium flex size-7 items-center justify-center rounded-full border-2">
                                {n}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="s-bp-reference" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="s-bp-reference" className="typo-h4-bold text-foreground">
                        너비 구간
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        기기명이 아니라 CSS viewport 너비를 기준으로 적용됩니다.
                    </p>
                </div>
                <Table
                    caption="브레이크포인트 구간과 프리픽스, 포함 기기"
                    columns={BREAKPOINT_COLUMNS}
                    rows={(() => {
                        // 구간명은 기기 하나를 가리키지 않으므로(예: md = 태블릿·노트북이 함께 걸치는 폭),
                        // 실제 포함 기기는 여기서 별도 안내한다. 새 브레이크포인트 키 추가 시 함께 갱신.
                        // 키 타입이 tokens.breakpoint(+mobile)라, 구간을 추가하고 여기 빠뜨리면 typecheck 가 실패한다.
                        const DEVICE_HINT: Record<keyof typeof tokens.breakpoint | 'mobile', string> = {
                            mobile: 'Galaxy S24(360px)·iPhone 15(393px)',
                            md: 'iPad 10세대 세로(820px)·가로(1180px)',
                            xl: 'Full HD 1920×1080(스케일 125%→1536px)',
                        }
                        const DEVICE_HINT_BY_KEY = new Map<string, string>(Object.entries(DEVICE_HINT))
                        const entries = Object.entries(tokens.breakpoint).sort((a, b) => a[1] - b[1])
                        const rows = [
                            {
                                key: 'mobile',
                                name: 'mobile (기본)',
                                range: `0 ~ ${entries[0][1] - 1}px`,
                                prefix: null,
                                device: DEVICE_HINT.mobile,
                            },
                            ...entries.map(([k, v], i) => ({
                                key: k,
                                name: k,
                                range: i + 1 < entries.length ? `${v} ~ ${entries[i + 1][1] - 1}px` : `${v}px ~`,
                                prefix: `${k}:`,
                                device: DEVICE_HINT_BY_KEY.get(k) ?? '—',
                            })),
                        ]
                        return rows.map((r) => ({
                            key: r.name,
                            cells: [
                                <span key="name" className="inline-flex items-center gap-2">
                                    {r.name}
                                    <ActiveBreakpointTag targetKey={r.key} />
                                </span>,
                                <span key="range" className="font-mono">
                                    {r.range}
                                </span>,
                                r.prefix ? (
                                    <CopyChip key="prefix" value={r.prefix} />
                                ) : (
                                    <span key="prefix" className="font-mono">
                                        없음
                                    </span>
                                ),
                                r.device,
                            ],
                        }))
                    })()}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="s-bp-height" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="s-bp-height" className="typo-h4-bold text-foreground">
                        높이 축 변형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        메인페이지처럼 화면 높이에 맞춰 섹션이 넘어가는 화면에서만 씁니다. 임계값은{' '}
                        <code className="text-foreground font-mono">tokens.json</code>의{' '}
                        <code className="text-foreground font-mono">breakpointHeight</code>에서 바꿉니다.
                    </p>
                </div>

                {/* 코드만 덩그러니 있으면 무엇인지 알 수 없어 이름표(사용 예)를 붙인 포인트 띠로 세운다. */}
                <div className="border-primary/30 bg-primary-subtle flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border p-5">
                    <strong className="typo-body-l-bold text-foreground">사용 예</strong>
                    <code className="text-foreground font-mono text-sm font-semibold">
                        pager-off:h-dvh landscape:pt-13
                    </code>
                </div>

                <Table
                    caption="높이 기준 반응형 변형과 적용 조건"
                    columns={HEIGHT_VARIANT_COLUMNS}
                    rows={HEIGHT_VARIANTS.map((variant) => ({
                        key: variant.prefix,
                        cells: [
                            <CopyChip key="prefix" value={variant.prefix} />,
                            <span key="condition" className="font-mono">
                                {variant.condition}
                            </span>,
                            variant.usage,
                        ],
                    }))}
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BreakpointGuidePage
