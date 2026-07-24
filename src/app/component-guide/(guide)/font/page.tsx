import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '폰트 (Primitive)'}

// 폰트 원시값 — 굵기·행간·자간·크기의 raw 값. 색상 primitive(--raw-blue-*)와 같은 티어로, 직접 쓰지
// 않고 typo-* 클래스(semantic)가 이 원시들을 묶어 참조한다. 미리보기 표본.
const PREVIEW_SAMPLE = '가나다 Ag 12'

// 크기 tier — typo 이름 <tier>-<weight> 에서 굵기 접미사를 뗀다(생성기 tierOf 와 동일 규칙). 굵기와
// 무관해 tier 하나가 한 --raw-font-size-<tier> 를 공유하므로, tier 별 첫 항목의 크기만 큐레이션한다.
const WEIGHT_KEYS = Object.keys(tokens.fontWeight)
const tierOf = (name: string): string => {
    const w = WEIGHT_KEYS.find((key) => name.endsWith(`-${key}`))
    return w ? name.slice(0, -(w.length + 1)) : name
}
const FONT_SIZE_TIERS: {tier: string; mobile: number; pc: number}[] = []
for (const [name, t] of Object.entries(tokens.typography)) {
    const tier = tierOf(name)
    if (!FONT_SIZE_TIERS.some((item) => item.tier === tier)) {
        FONT_SIZE_TIERS.push({tier, mobile: t.size.mobile, pc: t.size.pc})
    }
}

type PrimitiveRow = {cssVar: string; value: ReactNode; preview?: ReactNode}

const PRIMITIVE_TABLE_COLUMNS = [
    {key: 'variable', header: '변수', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
    {key: 'preview', header: '미리보기', align: 'start'},
] as const

// 한 원시 그룹 = 독립 테이블(변수·값·미리보기). 변수 칩을 클릭하면 이름이 복사된다.
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
    {key: 'pc', header: 'PC 변수·값', align: 'start'},
    {key: 'preview', header: '미리보기', align: 'start'},
] as const

// font-size는 모바일·PC 변수가 한 쌍이다. 값이 같아도 -pc 변수를 생성해 typo-*가 같은 구조로 참조하며,
// 생성 CSS에서는 중복 리터럴 대신 모바일 변수를 다시 가리킨다.
const FontSizeTable = () => (
    <BaseCard>
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="typo-h4-bold">크기 (font-size)</h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    tier별 모바일·PC 원시 변수를 생성합니다. tokens.json에는 px 숫자로 입력하고 CSS에는 rem으로
                    출력합니다.
                </p>
            </div>
            <Table
                size="md"
                caption="font-size tier별 모바일·PC 원시 변수와 값"
                columns={FONT_SIZE_TABLE_COLUMNS}
                rows={FONT_SIZE_TIERS.map(({tier, mobile, pc}) => ({
                    key: tier,
                    cells: [
                        <span key="tier" className="text-foreground font-mono">
                            {tier}
                        </span>,
                        <span key="mobile" className="text-muted-foreground font-mono whitespace-nowrap">
                            <span className="text-foreground">--raw-font-size-{tier}</span>
                            <br />
                            {mobile}px → {mobile / tokens.remBase}rem
                        </span>,
                        <span key="pc" className="text-muted-foreground font-mono whitespace-nowrap">
                            <span className="text-foreground">--raw-font-size-{tier}-pc</span>
                            <br />
                            {pc}px → {pc / tokens.remBase}rem
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

const TYPOGRAPHY_COUNT = Object.keys(tokens.typography).length
const FONT_SIZE_TIER_COUNT = FONT_SIZE_TIERS.length

// 폰트 (Primitive) — Tier 1 원시 하위값(굵기·행간·자간·크기). typo-* 가 이들을 묶어 참조한다.
const FontPrimitiveGuidePage = () => (
    <GuidePageShell
        title="폰트 (Primitive)"
        description="tokens.json의 폰트 원시값입니다. 일반 UI에서는 개별 값을 조합하지 말고 크기·굵기·행간·자간을 묶은 typo-* 클래스를 우선하세요."
    >
        <div className="flex flex-col gap-12">
            <BaseCard>
                <section aria-labelledby="font-primitive-rule" className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 id="font-primitive-rule" className="typo-h4-bold text-foreground">
                            구조와 사용 원칙
                        </h2>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            font-size·font-weight·line-height·letter-spacing 원시값을 조합해 하나의 typo-* 복합
                            유틸리티를 생성합니다.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">단일 원본</strong>
                            <p className="text-foreground-subtle">
                                값과 조합은 <code className="font-mono">tokens.json</code>에서 관리합니다.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">단위 변환</strong>
                            <p className="text-foreground-subtle">
                                크기·자간의 px 입력값은 <code className="font-mono">yarn tokens</code>에서 rem으로
                                변환됩니다.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">사용 계층</strong>
                            <p className="text-foreground-subtle">
                                원시 변수 → <code className="font-mono">typo-*</code> → 컴포넌트 순서로 적용합니다.
                            </p>
                        </div>
                    </div>
                </section>
            </BaseCard>

            <PrimitiveTable
                title="굵기 (font-weight)"
                hint="typo-* 이름의 -regular/-medium/-semibold/-bold 접미사가 아래 원시값을 참조합니다."
                rows={Object.entries(tokens.fontWeight).map(([name, weight]) => ({
                    cssVar: `var(--raw-font-weight-${name})`,
                    value: weight,
                    preview: <span style={{fontWeight: weight}}>{PREVIEW_SAMPLE}</span>,
                }))}
            />
            <PrimitiveTable
                title="행간 (line-height)"
                hint={`현재 ${Object.keys(tokens.lineHeight).length}개의 공유 원시값을 typography 조합에서 이름으로 참조합니다.`}
                rows={Object.entries(tokens.lineHeight).map(([name, value]) => ({
                    cssVar: `var(--raw-line-height-${name})`,
                    value,
                }))}
            />
            <PrimitiveTable
                title="자간 (letter-spacing)"
                hint={`현재 ${Object.keys(tokens.letterSpacing).length}개의 공유 원시값을 typography 조합에서 이름으로 참조합니다.`}
                rows={Object.entries(tokens.letterSpacing).map(([name, value]) => ({
                    cssVar: `var(--raw-letter-spacing-${name})`,
                    value,
                }))}
            />
            <FontSizeTable />

            <p className="typo-caption-regular text-muted-foreground">
                현재 font-size tier {FONT_SIZE_TIER_COUNT}개와 typo-* 조합 {TYPOGRAPHY_COUNT}개를{' '}
                <code className="font-mono">tokens.json</code>에서 자동 큐레이션합니다. 실제 복합 클래스와 프로젝트 전용{' '}
                <code className="font-mono">tracking-control-label</code>은 타이포그래피 가이드에서 확인합니다.
            </p>
        </div>
    </GuidePageShell>
)

export default FontPrimitiveGuidePage
