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
// 등록하므로 간격과 같은 유틸리티 문법을 쓴다(h-control-h-lg · size-icon-md · w-sidebar-w).
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
        description={<>padding·margin·gap에 공통으로 사용하는 base {tokens.spacingBase}px × N 간격 스케일입니다.</>}
    >
        <BaseCard>
            <section aria-labelledby="spacing-scale" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="spacing-scale" className="typo-h4-bold text-foreground">
                        Spacing scale
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        아래 표는 자주 사용하는 1~20 구간을 큐레이션합니다. 같은 숫자를 padding·margin·gap과 방향별
                        유틸리티에 공통 적용합니다.
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
                <div className="flex flex-col gap-1">
                    <h2 id="size-scale" className="typo-h4-bold text-foreground">
                        명명 크기 (size)
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        배수가 아니라 이름으로 부르는 고정 크기입니다. 간격과 같은 스케일에 등록되어 어떤 크기·간격
                        유틸리티에나 이름을 붙여 씁니다 — <code>size-icon-md</code> · <code>h-control-h-lg</code> ·{' '}
                        <code>w-sidebar-w</code>. CSS 에서 직접 참조할 때의 변수명은{' '}
                        <code>--ds-spacing-&lt;이름&gt;</code>입니다.
                    </p>
                </div>
                <dl className="bg-background border-border grid gap-3 rounded-md border p-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                        <dt className="typo-body-l-medium text-foreground font-mono">action-check</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            ActionCheck의 기본 크기 150px입니다. 단독 사용과 ViewportFitLayout의 최대 장식 크기가
                            공유합니다.
                        </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                        <dt className="typo-body-l-medium text-foreground font-mono">viewport-fit-decorative-min</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            낮은 화면에서 완료 애니메이션 같은 장식 요소가 줄어들 수 있는 최소 크기 96px입니다.
                        </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                        <dt className="typo-body-l-medium text-foreground font-mono">modal-max-h</dt>
                        <dd className="typo-body-l-regular text-foreground-subtle">
                            다이얼로그의 최대 높이 <code>80dvh</code>입니다. 시안의 &ldquo;화면 높이 기준 20%
                            여백&rdquo; 을 그대로 옮긴 값으로, 내용이 더 길면 모달이 화면 밖으로 나가는 대신 안에서
                            스크롤됩니다. 화면 기준 값이라 px 로 환산되지 않고 표에도 값 그대로 표시됩니다.
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
