import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '간격 (Spacing)'}

// 간격 — base(4px) × N 무한 스케일. Figma '04 Spacing' 이 보여준 최소(4px)~최대(80px) 구간을
// base 배수(N=1~20)로 빠짐없이 큐레이션한다(Figma 표본값 4·8·12·16·20·24·32·40·48·64·80 포함).
// padding·margin·gap 어디에나 같은 N 이 적용되므로, 축약형(p-*/m-*/gap-*)뿐 아니라 방향별
// 클래스(px-*·py-*·pt-*·pr-*·pb-*·pl-* 등)도 개발자가 바로 찾아 복사할 수 있게 그룹으로 나눠 노출한다.
const MAX_MULTIPLE = 20
const multiples = Array.from({length: MAX_MULTIPLE}, (_, i) => i + 1)
const SPACING_GROUPS = [
    {label: 'Padding', prefixes: ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl']},
    {label: 'Margin', prefixes: ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml']},
    {label: 'Gap', prefixes: ['gap', 'gap-x', 'gap-y']},
]

const SPACING_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스 (클릭 복사)', align: 'start', wrap: true, rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
] as const

// 명명 크기(size) — base 배수가 아니라 이름으로 부르는 고정 크기다. 생성기가 --spacing-<이름> 으로
// 등록하므로 간격과 같은 유틸리티 문법을 쓴다(h-control-h-md · size-icon-md · w-sidebar-w).
// tokens.json 에서 직접 그리므로 토큰을 추가하면 이 표에 자동으로 나온다.
// 변수명은 토큰명에서 그대로 유도되므로(--ds-spacing-<이름>) 컬럼으로 두지 않고 설명에 적는다.
const SIZE_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'token', header: '토큰 (클릭 복사)', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
] as const

// 값이 숫자면 px, 문자열이면 둘 중 하나다 — 단위가 붙었으면 px 로 환산할 수 없는 CSS 리터럴(예: 80dvh),
// 아니면 다른 size 키 참조(예: header-top → header-h). 참조는 따라가 실제 px 로 보여준다.
const SIZE_VALUES: Record<string, number | string> = tokens.size
const isCssLiteral = (value: string) => /^-?(\d+\.?\d*|\.\d+)[a-z%]+$/i.test(value)
const resolveSizePx = (value: number | string, depth = 0): number | undefined => {
    if (typeof value === 'number') return value
    if (depth > 4 || isCssLiteral(value)) return undefined
    const referenced = SIZE_VALUES[value]
    return referenced === undefined ? undefined : resolveSizePx(referenced, depth + 1)
}

const SpacingGuidePage = () => (
    <GuidePageShell
        title="간격 (Spacing)"
        description={<>{tokens.spacingBase}px 배수 간격과 의미가 있는 고정 크기 토큰입니다.</>}
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="spacing-usage" className="flex flex-col gap-4">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="spacing-usage" className="typo-h4-bold text-foreground">
                        간격과 크기 구분
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        여백은 숫자 유틸리티, 컴포넌트 크기는 이름이 있는 토큰을 사용합니다.
                    </p>
                </div>
                <dl className="grid gap-3 md:grid-cols-3">
                    <div className="border-border flex flex-col gap-2 rounded-md border p-4">
                        <dt className="typo-body-l-medium text-foreground">여백과 요소 간격</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            <code>p-4</code> · <code>mx-6</code> · <code>gap-8</code>처럼 숫자 유틸리티를 사용합니다.
                        </dd>
                    </div>
                    <div className="border-border flex flex-col gap-2 rounded-md border p-4">
                        <dt className="typo-body-l-medium text-foreground">컴포넌트 고정 크기</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            <code>h-control-h-md</code> · <code>size-icon-md</code>처럼 의미가 있는 토큰을 사용합니다.
                        </dd>
                    </div>
                    <div className="border-border flex flex-col gap-2 rounded-md border p-4">
                        <dt className="typo-body-l-medium text-foreground">CSS 계산</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            복합 계산식에서만 <code>var(--ds-spacing-토큰명)</code>을 참조합니다. px 리터럴은 추가하지
                            않습니다.
                        </dd>
                    </div>
                </dl>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="spacing-scale" className="flex flex-col gap-4">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="spacing-scale" className="typo-h4-bold text-foreground">
                        간격 유틸리티
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        숫자 하나는 {tokens.spacingBase}px입니다. padding·margin·gap에 같은 배수 규칙을 적용합니다.
                    </p>
                </div>
                <Table
                    caption="Spacing 1~20의 미리보기, 유틸리티와 px 값"
                    columns={SPACING_COLUMNS}
                    rows={multiples.map((n) => ({
                        key: String(n),
                        cells: [
                            <span
                                key="preview"
                                aria-hidden="true"
                                className="bg-primary block h-3 rounded-sm"
                                style={{width: `calc(var(--spacing) * ${n})`}}
                            />,
                            <div key="class" className="flex flex-col gap-2">
                                {SPACING_GROUPS.map((group) => (
                                    <div key={group.label} className="flex flex-wrap items-center gap-2">
                                        <span className="typo-body-l-regular text-muted-foreground w-14 shrink-0">
                                            {group.label}
                                        </span>
                                        {group.prefixes.map((prefix) => (
                                            <CopyChip key={prefix} value={`${prefix}-${n}`} />
                                        ))}
                                    </div>
                                ))}
                            </div>,
                            <span key="value" className="font-mono">
                                {n * tokens.spacingBase}px
                            </span>,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="size-scale" className="flex flex-col gap-4">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="size-scale" className="typo-h4-bold text-foreground">
                        고정 크기 토큰
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        아이콘·컨트롤·레이아웃처럼 의미와 값이 함께 유지돼야 하는 크기입니다. 토큰명 앞에{' '}
                        <code>size-</code> · <code>h-</code> · <code>w-</code>를 붙여 사용합니다.
                    </p>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        컨트롤 높이는 Figma와 1:1로 <code>xl 60 · lg 52 · md 48 · sm 40 · xs 32px</code>입니다.
                    </p>
                </div>
                <h3 className="typo-body-l-medium text-foreground">주요 예외 토큰</h3>
                <dl className="bg-background border-border grid gap-3 rounded-md border p-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                        <dt className="typo-body-l-medium text-foreground font-mono">action-check</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            ActionCheck와 ViewportFitLayout 장식의 최대 크기인 150px입니다.
                        </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                        <dt className="typo-body-l-medium text-foreground font-mono">viewport-fit-decorative-min</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            낮은 화면에서 장식 요소가 축소될 수 있는 최소 크기인 96px입니다.
                        </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                        <dt className="typo-body-l-medium text-foreground font-mono">modal-max-h</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            다이얼로그 최대 높이 <code>80dvh</code>입니다. 초과 콘텐츠는 내부에서 스크롤됩니다.
                        </dd>
                    </div>
                </dl>
                <Table
                    caption="명명 크기 토큰의 미리보기와 값"
                    columns={SIZE_COLUMNS}
                    rows={Object.entries(tokens.size).map(([name, value]) => {
                        const px = resolveSizePx(value)

                        return {
                            key: name,
                            cells: [
                                // 미리보기 막대는 px 로 환산되는 값에만 그린다 — 화면 기준 값(80dvh 등)은
                                // 표 안에서 길이를 비교할 기준이 없어 막대가 의미를 갖지 못한다.
                                px === undefined ? (
                                    <span key="preview" className="text-muted-foreground font-mono">
                                        —
                                    </span>
                                ) : (
                                    <span
                                        key="preview"
                                        aria-hidden="true"
                                        className="bg-primary block h-3 max-w-full rounded-sm"
                                        style={{width: `var(--ds-spacing-${name})`}}
                                    />
                                ),
                                <CopyChip key="token" value={name} />,
                                <span key="value" className="font-mono">
                                    {px === undefined ? '' : `${px}px`}
                                    {typeof value === 'string' ? (
                                        <span className={px === undefined ? undefined : 'text-muted-foreground'}>
                                            {isCssLiteral(value) ? value : ` · ${value} 참조`}
                                        </span>
                                    ) : null}
                                </span>,
                            ],
                        }
                    })}
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SpacingGuidePage
