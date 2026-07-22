import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
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
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Spacing 1~20의 미리보기, 유틸리티와 px 값</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3 whitespace-nowrap">
                                    미리보기
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3 whitespace-nowrap">
                                    클래스 (클릭 복사)
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3 whitespace-nowrap">
                                    값
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {multiples.map((n) => (
                                <tr key={n} className="border-border border-b last:border-b-0">
                                    <td className="px-4 py-3">
                                        <span
                                            aria-hidden="true"
                                            className="bg-primary block h-3 rounded-sm"
                                            style={{width: `calc(var(--spacing) * ${n})`}}
                                        />
                                    </td>
                                    <th scope="row" className="px-4 py-3 text-left align-top font-normal">
                                        <div className="flex flex-col gap-2">
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
                                        </div>
                                    </th>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                        {n * tokens.spacingBase}px
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SpacingGuidePage
