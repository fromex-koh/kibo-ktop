import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '간격'}

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
    <GuidePage title="간격 (Spacing)" description={<>base {tokens.spacingBase}px × N 스케일의 간격 토큰입니다.</>}>
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-gray-subtle-2 border-b">
                        <th scope="col" className="typo-body-l-medium text-subtle px-3 py-3 whitespace-nowrap">
                            미리보기
                        </th>
                        <th scope="col" className="typo-body-l-medium text-subtle px-3 py-3 whitespace-nowrap">
                            클래스 (클릭 복사)
                        </th>
                        <th scope="col" className="typo-body-l-medium text-subtle px-3 py-3 whitespace-nowrap">
                            값
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {multiples.map((n) => (
                        <tr key={n} className="border-gray-subtle-2 hover:bg-surface border-b transition-colors">
                            <td className="px-3 py-3">
                                <span
                                    aria-hidden="true"
                                    className="bg-element-primary block h-3 rounded-sm"
                                    style={{width: `calc(var(--spacing) * ${n})`}}
                                />
                            </td>
                            <th scope="row" className="px-3 py-3 text-left align-top font-normal">
                                <div className="flex flex-col gap-2">
                                    {SPACING_GROUPS.map((group) => (
                                        <div key={group.label} className="flex flex-wrap items-center gap-2">
                                            <span className="typo-caption-regular text-subtle w-14 shrink-0">
                                                {group.label}
                                            </span>
                                            {group.prefixes.map((prefix) => (
                                                <CopyChip key={prefix} value={`${prefix}-${n}`} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </th>
                            <td className="typo-caption-regular text-subtle px-3 py-3 font-mono whitespace-nowrap">
                                {n * tokens.spacingBase}px
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </GuidePage>
)

export default SpacingGuidePage
