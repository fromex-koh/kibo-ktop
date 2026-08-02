import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
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
const PrimitiveTable = ({title, hint, rows}: {title: string; hint: string; rows: PrimitiveRow[]}) => (
    <BaseCard>
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="typo-h4-bold">{title}</h2>
                <p className="typo-body-l-regular text-muted-foreground">{hint}</p>
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
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="typo-h4-bold">크기 (font-size)</h2>
                <p className="typo-body-l-regular text-muted-foreground">
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
const FontPrimitiveGuidePage = () => (
    <GuidePageShell
        title="폰트 (Primitive)"
        description="typo-* 유틸리티의 기반 값입니다. 앱 코드에서는 원시값 대신 역할에 맞는 typo-* 클래스 하나를 사용합니다."
    >
        <div className="flex flex-col gap-12">
            <BaseCard>
                <section aria-labelledby="font-primitive-rule" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 id="font-primitive-rule" className="typo-h4-bold text-foreground">
                            개발자 사용 기준
                        </h2>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            텍스트에는 <code className="font-mono">typo-body-xl-regular</code>처럼 크기·굵기·행간·자간을
                            묶은 복합 유틸리티 하나를 사용합니다.
                        </p>
                        <Link
                            href="/component-guide/typography"
                            className="text-primary focus-visible:ring-ring w-fit rounded-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                        >
                            타이포그래피 클래스와 실제 미리보기 보기
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="flex flex-col gap-2">
                            <strong className="text-foreground">기본 원칙</strong>
                            <p className="text-foreground-subtle">
                                기존 <code className="font-mono">typo-*</code>가 있으면 font-size·font-weight·
                                line-height·letter-spacing을 개별 유틸리티로 다시 조합하지 않습니다.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <strong className="text-foreground">Raw 허용 범위</strong>
                            <p className="text-foreground-subtle">
                                <code className="font-mono">--raw-font-*</code>는 토큰 생성기·문서·검증에서만
                                사용합니다. 새 조합이 필요하면 <code className="font-mono">typo-*</code> 토큰을
                                추가합니다.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <strong className="text-foreground">금지 사항</strong>
                            <p className="text-foreground-subtle">
                                컴포넌트에 px/rem 리터럴을 직접 넣거나 자동 생성 파일인{' '}
                                <code className="font-mono">src/app/tokens.css</code>를 수정하지 않습니다.
                            </p>
                        </div>
                    </div>

                    <div className="border-border grid gap-4 border-t pt-6 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <strong className="text-foreground">토큰 변경 절차</strong>
                            <ol className="text-foreground-subtle list-decimal space-y-1 pl-5">
                                <li>
                                    <code className="font-mono">tokens.json</code>에서 원시값 또는 조합을 변경합니다.
                                </li>
                                <li>
                                    <code className="font-mono">yarn tokens</code>로 CSS를 다시 생성합니다.
                                </li>
                                <li>
                                    <code className="font-mono">yarn verify</code>로 참조·포맷·타입을 검증합니다.
                                </li>
                            </ol>
                        </div>
                        <div className="flex flex-col gap-2">
                            <strong className="text-foreground">크기와 반응형 규칙</strong>
                            <p className="text-foreground-subtle">
                                크기는 px로 입력하고 CSS에는 rem으로 생성합니다. 모바일 기본값에서{' '}
                                <code className="font-mono">
                                    {TYPO_TABLET_BREAKPOINT} ({BREAKPOINTS[TYPO_TABLET_BREAKPOINT]}px)
                                </code>
                                부터 태블릿,{' '}
                                <code className="font-mono">
                                    {TYPO_PC_BREAKPOINT} ({BREAKPOINTS[TYPO_PC_BREAKPOINT]}px)
                                </code>
                                부터 PC 값을 적용합니다.
                            </p>
                        </div>
                    </div>
                </section>
            </BaseCard>

            <FontSizeTable />
            <PrimitiveTable
                title="굵기 (font-weight)"
                hint="typo-* 이름의 regular·medium·semibold·bold 접미사와 연결됩니다."
                rows={Object.entries(tokens.fontWeight).map(([name, weight]) => ({
                    cssVar: `var(--raw-font-weight-${name})`,
                    value: weight,
                    preview: <span style={{fontWeight: weight}}>{PREVIEW_SAMPLE}</span>,
                }))}
            />
            <PrimitiveTable
                title="행간 (line-height)"
                hint="여러 typo-* 조합이 같은 행간 값을 이름으로 공유합니다."
                rows={Object.entries(tokens.lineHeight).map(([name, value]) => ({
                    cssVar: `var(--raw-line-height-${name})`,
                    value,
                }))}
            />
            <PrimitiveTable
                title="자간 (letter-spacing)"
                hint="여러 typo-* 조합이 같은 자간 값을 이름으로 공유합니다."
                rows={Object.entries(tokens.letterSpacing).map(([name, value]) => ({
                    cssVar: `var(--raw-letter-spacing-${name})`,
                    value,
                }))}
            />
        </div>
    </GuidePageShell>
)

export default FontPrimitiveGuidePage
