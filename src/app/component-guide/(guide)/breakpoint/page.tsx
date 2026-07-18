import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import ActiveBreakpointTag from '@/components/guide/active-breakpoint-tag'
import CopyChip from '@/components/guide/copy-chip'
import GuidePageShell from '@/components/guide/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '브레이크포인트 (Breakpoint)'}

// 브레이크포인트 — 모바일 퍼스트. Tailwind 기본 프리픽스를 그대로 쓰고, 프로젝트 주 티어는 md(768)·xl(1280).
const BreakpointGuidePage = () => (
    <GuidePageShell
        title="브레이크포인트 (Breakpoint)"
        description={
            <>
                모바일 퍼스트입니다. <strong>Tailwind 기본 브레이크포인트</strong>를 그대로 쓰고, 프로젝트의 주 티어는{' '}
                <code>md:</code>(≥{tokens.breakpoint.md}px) · <code>xl:</code>(≥{tokens.breakpoint.xl}px)입니다.
            </>
        }
    >
        <BaseCard>
            <section aria-labelledby="s-bp-rule" className="flex flex-col gap-2">
                <h2 id="s-bp-rule" className="typo-h4-bold text-foreground">
                    사용 원칙
                </h2>
                <p className="typo-body-l-regular text-foreground-subtle">
                    기본 스타일은 모바일 구간에 작성하고 md·xl에서 확장합니다. Tailwind 기본 sm·lg·2xl도 사용할 수
                    있지만 공통 레이아웃은 프로젝트 주 티어를 우선합니다.
                </p>
            </section>
        </BaseCard>

        {/* 라이브 데모 — 브라우저 폭을 줄였다 늘리면 실제로 재배치된다. 프리픽스 동작을 그대로 보여주려
            grid-cols-* 를 직접 조합했다(실제 콘텐츠 그리드는 PB-15 대로 .grid-layout 사용). */}
        <BaseCard>
            <section aria-labelledby="s-bp-demo" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="s-bp-demo" className="typo-h4-bold">
                        라이브 데모
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        브라우저 폭을 줄였다 늘리면 아래 카드가 <code>1 → 2 → 3</code>열로 재배치되고, 현재 구간 표시도
                        함께 바뀝니다.
                    </p>
                </div>

                {/* 현재 구간 — CSS 프리픽스만으로 구간별 하나만 보이게 토글(그 자체가 프리픽스 동작 예시). */}
                <p className="typo-body-l-regular">
                    현재 활성 구간:{' '}
                    <span className="text-primary-strong font-semibold">
                        <span className="md:hidden">mobile (기본)</span>
                        <span className="hidden md:inline xl:hidden">md (≥768px)</span>
                        <span className="hidden xl:inline">xl (≥1280px)</span>
                    </span>
                </p>

                <code className="typo-body-l-regular text-muted-foreground bg-card border-border w-fit rounded-md border px-3 py-1 font-mono">
                    grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
                </code>

                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({length: 6}, (_, i) => i + 1).map((n) => (
                        <li
                            key={n}
                            className="bg-card border-border text-foreground typo-body-l-medium flex min-h-24 items-center justify-center rounded-lg border"
                        >
                            카드 {n}
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="s-bp-reference" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="s-bp-reference" className="typo-h4-bold text-foreground">
                        Breakpoint reference
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        범위와 대표 기기는 레이아웃 검수 기준이며 실제 기기에서는 CSS viewport를 기준으로 확인합니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">브레이크포인트 구간과 프리픽스, 포함 기기</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    구간
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    범위
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    프리픽스
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    포함 기기
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                // 구간명은 기기 하나를 가리키지 않으므로(예: md = 태블릿·노트북이 함께 걸치는 폭),
                                // 실제 포함 기기는 여기서 별도 안내한다. 새 브레이크포인트 키 추가 시 함께 갱신.
                                const DEVICE_HINT: Record<string, string> = {
                                    mobile: 'Galaxy S24(360px)·iPhone 15(393px)',
                                    md: 'iPad 10세대 세로(820px)·가로(1180px)',
                                    xl: 'Full HD 1920×1080(스케일 125%→1536px)',
                                }
                                const entries = Object.entries(tokens.breakpoint).sort((a, b) => a[1] - b[1])
                                const rows = [
                                    {
                                        key: 'mobile',
                                        name: 'mobile (기본)',
                                        range: `0 ~ ${entries[0][1] - 1}px`,
                                        prefix: null,
                                        device: DEVICE_HINT['mobile'],
                                    },
                                    ...entries.map(([k, v], i) => ({
                                        key: k,
                                        name: k,
                                        range:
                                            i + 1 < entries.length ? `${v} ~ ${entries[i + 1][1] - 1}px` : `${v}px ~`,
                                        prefix: `${k}:`,
                                        device: DEVICE_HINT[k] ?? '—',
                                    })),
                                ]
                                return rows.map((r) => (
                                    <tr key={r.name} className="border-border border-b last:border-b-0">
                                        <td className="typo-body-l-regular px-4 py-3">
                                            <span className="inline-flex items-center gap-2">
                                                {r.name}
                                                <ActiveBreakpointTag targetKey={r.key} />
                                            </span>
                                        </td>
                                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                            {r.range}
                                        </td>
                                        <td className="px-4 py-3">
                                            {r.prefix ? (
                                                <CopyChip value={r.prefix} />
                                            ) : (
                                                <span className="typo-body-l-regular text-muted-foreground font-mono">
                                                    없음
                                                </span>
                                            )}
                                        </td>
                                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                            {r.device}
                                        </td>
                                    </tr>
                                ))
                            })()}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BreakpointGuidePage
