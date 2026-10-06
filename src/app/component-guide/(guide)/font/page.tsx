// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '폰트 (Primitive)'}

// 폰트 원시값 — 굵기·행간·자간·크기의 raw 값. 색상 primitive(--raw-blue-*)와 같은 티어로, 직접 쓰지
// 않고 typo-* 클래스(semantic)가 이 원시들을 묶어 참조한다. 미리보기 표본.
const PREVIEW_SAMPLE = '가나다 Ag 12'
const TYPO_TABLET_BREAKPOINT = tokens.typographyBreakpoints.tablet
const TYPO_PC_BREAKPOINT = tokens.typographyBreakpoints.pc
const BREAKPOINTS: Record<string, number> = tokens.breakpoint

// 크기 tier — typo 이름 <tier>-<weight> 에서 굵기 접미사를 뗀다(생성기 tierOf 와 동일 규칙). 굵기와
// 무관해 tier 하나가 한 --raw-font-size-<tier> 를 공유하므로, tier 별 첫 항목의 크기만 큐레이션한다.
const WEIGHT_KEYS = Object.keys(tokens.fontWeight)
const tierOf = (name: string): string => {
    const w = WEIGHT_KEYS.find((key) => name.endsWith(`-${key}`))
    return w ? name.slice(0, -(w.length + 1)) : name
}
// tokens.json의 px 숫자가 생성 시 어떤 rem 값이 되는지 함께 보여준다.
const formatFontSize = (value: number): string => `${value}px → ${value / tokens.remBase}rem`
const FONT_SIZE_TIERS: {tier: string; mobile: number; tablet: number; pc: number}[] = []
for (const [name, t] of Object.entries(tokens.typography)) {
    const tier = tierOf(name)
    if (!FONT_SIZE_TIERS.some((item) => item.tier === tier)) {
        FONT_SIZE_TIERS.push({tier, mobile: t.size.mobile, tablet: t.size.tablet, pc: t.size.pc})
    }
}

type PrimitiveRow = {cssVar: string; value: ReactNode; preview?: ReactNode}

const PRIMITIVE_TABLE_COLUMNS = [
    {key: 'variable', header: '변수', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
    {key: 'preview', header: '미리보기', align: 'start'},
] as const

// 한 원시 그룹 = 독립 테이블(변수·값·미리보기).
const PrimitiveTable = ({id, title, hint, rows}: {id: string; title: string; hint: string; rows: PrimitiveRow[]}) => (
    <BaseCard>
        <section aria-labelledby={`font-${id}`} className="flex flex-col gap-6">
            <div className="flex max-w-4xl flex-col gap-2">
                <h2 id={`font-${id}`} className="typo-h4-bold">
                    {title}
                </h2>
                <p className="typo-body-l-regular text-label-foreground">{hint}</p>
            </div>
            <Table
                size="md"
                caption={`${title} 원시 변수와 값`}
                columns={PRIMITIVE_TABLE_COLUMNS}
                rows={rows.map((row) => ({
                    key: row.cssVar,
                    cells: [
                        <span key="variable" className="text-foreground font-mono">
                            {row.cssVar.slice(4, -1)}
                        </span>,
                        <span key="value" className="text-muted-foreground font-mono whitespace-nowrap">
                            {row.value}
                        </span>,
                        <span key="preview" className="text-foreground whitespace-nowrap">
                            {row.preview ?? '—'}
                        </span>,
                    ],
                }))}
            />
        </section>
    </BaseCard>
)

const TRACKING_COLUMNS = [
    {key: 'class', header: '클래스 (클릭 복사)', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
] as const

const FONT_SIZE_TABLE_COLUMNS = [
    {key: 'tier', header: 'Tier', align: 'start', rowHeader: true},
    {key: 'mobile', header: '모바일 변수·값', align: 'start'},
    {key: 'tablet', header: '태블릿 변수·값', align: 'start'},
    {key: 'pc', header: 'PC 변수·값', align: 'start'},
    {key: 'preview', header: '모바일 미리보기', align: 'start'},
] as const

// font-size는 모바일·태블릿·PC 변수를 한 세트로 생성한다. 인접 구간 값이 같으면 앞 구간 변수를 참조한다.
const FontSizeTable = () => (
    <BaseCard>
        <section aria-labelledby="font-size" className="flex flex-col gap-6">
            <div className="flex max-w-4xl flex-col gap-2">
                <h2 id="font-size" className="typo-h4-bold">
                    크기 (font-size)
                </h2>
                <p className="typo-body-l-regular text-label-foreground">
                    tier별 모바일·태블릿·PC 원시 변수를 생성합니다. px 숫자로 입력하고 CSS에는 rem으로 출력합니다.
                </p>
            </div>
            <Table
                size="md"
                caption="font-size tier별 모바일·태블릿·PC 원시 변수와 값"
                columns={FONT_SIZE_TABLE_COLUMNS}
                rows={FONT_SIZE_TIERS.map(({tier, mobile, tablet, pc}) => ({
                    key: tier,
                    cells: [
                        <span key="tier" className="text-foreground font-mono">
                            {tier}
                        </span>,
                        <span key="mobile" className="text-muted-foreground font-mono whitespace-nowrap">
                            <span className="text-foreground">--raw-font-size-{tier}</span>
                            <br />
                            {formatFontSize(mobile)}
                        </span>,
                        <span key="tablet" className="text-muted-foreground font-mono whitespace-nowrap">
                            <span className="text-foreground">--raw-font-size-{tier}-tablet</span>
                            <br />
                            {formatFontSize(tablet)}
                        </span>,
                        <span key="pc" className="text-muted-foreground font-mono whitespace-nowrap">
                            <span className="text-foreground">--raw-font-size-{tier}-pc</span>
                            <br />
                            {formatFontSize(pc)}
                        </span>,
                        <span key="preview" className="text-foreground whitespace-nowrap">
                            <span style={{fontSize: `var(--raw-font-size-${tier})`}}>{PREVIEW_SAMPLE}</span>
                        </span>,
                    ],
                }))}
            />
        </section>
    </BaseCard>
)

// 폰트 (Primitive) — Tier 1 원시 하위값(굵기·행간·자간·크기). typo-* 가 이들을 묶어 참조한다.
// 두 계층 비교 카드 — 색상 (Primitive) 가이드와 같은 짜임이다.
const FONT_LAYERS = [
    {
        name: 'Primitive',
        usage: '직접 쓰지 않음',
        isUsable: false,
        summary: '크기 · 굵기 · 행간 · 자간의 원시값입니다. typo-* 의 재료입니다.',
        pattern: '--raw-font-* · --raw-line-height-* · --raw-letter-spacing-*',
        example: '--raw-font-size-body-xl · --raw-font-weight-bold',
        where: 'typo-* 정의 · 토큰 문서처럼 원시값 자체가 필요한 코드',
    },
    {
        name: 'typo-*',
        usage: '화면 · 컴포넌트에서 사용',
        isUsable: true,
        summary: '크기 · 굵기 · 행간 · 자간을 한 번에 적용하는 클래스입니다.',
        pattern: 'typo-<단계>-<굵기>',
        example: 'typo-body-xl-regular · typo-h4-bold',
        where: '모든 화면과 컴포넌트의 className',
    },
] as const

const FONT_CHANGE_STEPS = [
    {command: 'tokens.json', description: '원본 값을 바꿉니다.'},
    {command: 'yarn tokens', description: 'CSS 를 다시 생성합니다.'},
    {command: 'yarn verify', description: '참조 · 타입을 검증합니다.'},
] as const

const FontPrimitiveGuidePage = () => (
    <GuidePageShell
        title="폰트 (Primitive)"
        description="typo-* 클래스가 참조하는 폰트 원시 토큰입니다. 컴포넌트에서는 아래 변수를 직접 사용하지 않습니다."
    >
        <div className="flex flex-col gap-12">
            <BaseCard>
                <section aria-labelledby="font-primitive-rule" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 id="font-primitive-rule" className="typo-h4-bold text-foreground">
                            Primitive와 typo-*의 관계
                        </h2>
                        <p className="typo-body-l-regular text-label-foreground">
                            글자 값은 두 계층으로 관리합니다. 화면과 컴포넌트에는{' '}
                            <code className="text-foreground font-mono">typo-*</code> 클래스만 씁니다.
                        </p>
                    </div>

                    {/* 두 계층을 같은 자리에 같은 항목(이름 · 예 · 쓰는 곳)으로 나란히 둔다. */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {FONT_LAYERS.map((layer) => (
                            <div
                                key={layer.name}
                                className="border-foreground-subtle/30 bg-pastel-neutral/40 flex flex-col gap-3 rounded-sm border p-5"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="typo-title-m-bold text-foreground">{layer.name}</h3>
                                    <Badge variant="outline" color={layer.isUsable ? 'info' : 'neutral'} size="sm">
                                        {layer.usage}
                                    </Badge>
                                </div>
                                <p className="text-label-foreground">{layer.summary}</p>
                                <dl className="border-subtle-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t pt-3">
                                    <dt className="typo-body-l-bold text-foreground-subtle">이름</dt>
                                    <dd className="text-label-foreground font-mono text-sm">{layer.pattern}</dd>
                                    <dt className="typo-body-l-bold text-foreground-subtle">예</dt>
                                    <dd className="text-label-foreground font-mono text-sm">{layer.example}</dd>
                                    <dt className="typo-body-l-bold text-foreground-subtle">쓰는 곳</dt>
                                    <dd className="text-label-foreground">{layer.where}</dd>
                                </dl>
                            </div>
                        ))}
                    </div>
                    <p className="border-primary/30 bg-primary-subtle text-foreground overflow-x-auto rounded-sm border p-5 text-center font-mono text-sm font-semibold">
                        tokens.json → Primitive (--raw-font-*) → typo-* (typo-body-xl-regular)
                    </p>
                    <Link
                        href="/component-guide/typography"
                        className="text-primary focus-visible:ring-ring w-fit rounded-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                    >
                        타이포그래피 클래스와 실제 미리보기 보기
                    </Link>

                    <div className="border-subtle-3 flex flex-col gap-4 border-t pt-6">
                        <h3 className="typo-title-m-bold text-foreground">사용 규칙</h3>
                        <ul className="text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                역할에 맞는 <code className="text-foreground font-mono">typo-*</code>를 고릅니다. 필요한
                                조합이 없으면 <code className="text-foreground font-mono">tokens.json</code>에 새 토큰을
                                추가합니다.
                            </li>
                            <li>
                                <code className="text-foreground font-mono">--raw-font-*</code> 변수와 px · rem 리터럴을
                                컴포넌트에 직접 쓰지 않습니다.
                            </li>
                            <li>
                                <code className="text-foreground font-mono">src/app/tokens.css</code>는 자동 생성
                                파일이라 직접 고치지 않습니다.
                            </li>
                            <li>
                                크기는 mobile(기본) · 태블릿(
                                <code className="text-foreground font-mono">
                                    {TYPO_TABLET_BREAKPOINT} {BREAKPOINTS[TYPO_TABLET_BREAKPOINT]}px
                                </code>
                                ) · PC(
                                <code className="text-foreground font-mono">
                                    {TYPO_PC_BREAKPOINT} {BREAKPOINTS[TYPO_PC_BREAKPOINT]}px
                                </code>
                                ) 값을 각각 명시합니다.
                            </li>
                        </ul>
                    </div>

                    <div className="border-subtle-3 flex flex-col gap-4 border-t pt-6">
                        <h3 className="typo-title-m-bold text-foreground">값을 바꿀 때</h3>
                        <ol className="grid gap-4 md:grid-cols-3">
                            {FONT_CHANGE_STEPS.map((step, index) => (
                                <li
                                    key={step.command}
                                    className="border-foreground-subtle/30 bg-pastel-neutral/40 flex items-start gap-3 rounded-sm border p-5"
                                >
                                    <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <code className="typo-body-xl-bold text-foreground font-mono">
                                            {step.command}
                                        </code>
                                        <p className="text-label-foreground">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </BaseCard>

            <FontSizeTable />
            <PrimitiveTable
                id="weight"
                title="굵기 (font-weight)"
                hint="typo-* 이름의 regular·medium·bold·black 접미사와 연결됩니다."
                rows={Object.entries(tokens.fontWeight).map(([name, weight]) => ({
                    cssVar: `var(--raw-font-weight-${name})`,
                    value: weight,
                    preview: <span style={{fontWeight: weight}}>{PREVIEW_SAMPLE}</span>,
                }))}
            />
            <PrimitiveTable
                id="line-height"
                title="행간 (line-height)"
                hint="여러 typo-* 조합이 같은 행간 값을 이름으로 공유합니다."
                rows={Object.entries(tokens.lineHeight).map(([name, value]) => ({
                    cssVar: `var(--raw-line-height-${name})`,
                    value,
                }))}
            />
            <PrimitiveTable
                id="letter-spacing"
                title="자간 (letter-spacing)"
                hint="여러 typo-* 조합이 같은 자간 값을 이름으로 공유합니다."
                rows={Object.entries(tokens.letterSpacing).map(([name, value]) => ({
                    cssVar: `var(--raw-letter-spacing-${name})`,
                    value,
                }))}
            />
            <BaseCard>
                <section aria-labelledby="font-tracking" className="flex flex-col gap-6">
                    <div className="flex max-w-4xl flex-col gap-2">
                        <h2 id="font-tracking" className="typo-h4-bold">
                            역할 기반 자간 (tracking)
                        </h2>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>typo-*</code> 와 별개로 특정 역할에만 붙이는 <code>tracking-*</code> 유틸리티입니다.
                            <code>tokens.json</code> 의 <code>tracking</code> 값을 px 로 입력하고 rem 으로 생성합니다.
                        </p>
                    </div>
                    <Table
                        size="md"
                        caption="tracking-* 유틸리티와 값"
                        columns={TRACKING_COLUMNS}
                        rows={Object.entries(tokens.tracking).map(([name, px]) => ({
                            key: name,
                            cells: [
                                <CopyChip key="class" value={`tracking-${name}`} />,
                                <span key="value" className="text-foreground-subtle font-mono whitespace-nowrap">
                                    {formatFontSize(px)}
                                </span>,
                            ],
                        }))}
                    />
                </section>
            </BaseCard>
        </div>
    </GuidePageShell>
)

export default FontPrimitiveGuidePage
