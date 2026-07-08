import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
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
const FONT_SIZE_TIERS: {tier: string; px: number}[] = []
for (const [name, t] of Object.entries(tokens.typography)) {
    const tier = tierOf(name)
    if (!FONT_SIZE_TIERS.some((item) => item.tier === tier)) FONT_SIZE_TIERS.push({tier, px: t.size.mobile})
}

type PrimitiveRow = {cssVar: string; value: ReactNode; preview?: ReactNode}

// 한 원시 그룹 = 독립 테이블(변수·값·미리보기). 변수 칩을 클릭하면 이름이 복사된다.
const PrimitiveTable = ({title, hint, rows}: {title: string; hint: string; rows: PrimitiveRow[]}) => (
    <section className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
            <h2 className="typo-h4-bold">{title}</h2>
            <p className="typo-body-l-regular text-muted-foreground">{hint}</p>
        </div>
        <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full text-left">
                <caption className="sr-only">{title} 원시 변수와 값</caption>
                <thead>
                    <tr className="border-border bg-card border-b">
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            변수 (클릭 복사)
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            값
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            미리보기
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.cssVar} className="border-border border-b last:border-b-0">
                            <th scope="row" className="px-4 py-3 text-left font-normal">
                                <CopyChip value={row.cssVar} />
                            </th>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                {row.value}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{row.preview ?? '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
)

// 폰트 (Primitive) — Tier 1 원시 하위값(굵기·행간·자간·크기). typo-* 가 이들을 묶어 참조한다.
const FontPrimitiveGuidePage = () => (
    <GuidePage
        title="폰트 (Primitive)"
        description="폰트의 원시 하위값(굵기·행간·자간·크기)입니다. 색상 primitive 처럼 직접 쓰지 말고 typo-* 클래스를 우선하세요."
    >
        <div className="flex flex-col gap-8">
            <PrimitiveTable
                title="굵기 (font-weight)"
                hint="typo-* 이름의 -regular/-medium/-bold 접미사가 이 원시를 가리킵니다."
                rows={Object.entries(tokens.fontWeight).map(([name, weight]) => ({
                    cssVar: `var(--raw-font-weight-${name})`,
                    value: weight,
                    preview: <span style={{fontWeight: weight}}>{PREVIEW_SAMPLE}</span>,
                }))}
            />
            <PrimitiveTable
                title="행간 (line-height)"
                hint="현재 전 타이포 공용 단일값입니다."
                rows={Object.entries(tokens.lineHeight).map(([name, value]) => ({
                    cssVar: `var(--raw-line-height-${name})`,
                    value,
                }))}
            />
            <PrimitiveTable
                title="자간 (letter-spacing)"
                hint="현재 전 타이포 공용 단일값입니다."
                rows={Object.entries(tokens.letterSpacing).map(([name, value]) => ({
                    cssVar: `var(--raw-letter-spacing-${name})`,
                    value,
                }))}
            />
            <PrimitiveTable
                title="크기 (font-size)"
                hint="크기는 굵기와 무관해 tier(display-xl 등) 로 공유합니다. 굵기 변형 3개가 한 tier 를 참조합니다."
                rows={FONT_SIZE_TIERS.map(({tier, px}) => ({
                    cssVar: `var(--raw-font-size-${tier})`,
                    value: `${px}px`,
                    preview: <span style={{fontSize: `var(--raw-font-size-${tier})`}}>{PREVIEW_SAMPLE}</span>,
                }))}
            />
        </div>
    </GuidePage>
)

export default FontPrimitiveGuidePage
