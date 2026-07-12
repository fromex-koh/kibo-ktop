import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import GuidePageShell from '@/components/guide/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '색상 (Primitive)'}

// 저장은 hex(생성기 규격)지만 Figma 원본이 rgba 라, 큐레이션 화면엔 rgba 문자열로 보여준다(값은 동일).
const hexToRgba = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 1)`
}

// 표시값 — hex 는 rgba 로 변환, 그 외(transparent 등)는 그대로.
const display = (v: string): string => (v.startsWith('#') ? hexToRgba(v) : v)

// alpha 스텝(0~100) → rgba 문자열.
const alphaRgba = (color: string, step: number): string =>
    `rgba(${color === 'black' ? '0, 0, 0' : '255, 255, 255'}, ${step / 100})`

// 투명 값(common transparent·alpha) 뒤에 깔 체커보드 — --raw-* 는 모드 무관 고정.
const CHECKERBOARD =
    'repeating-conic-gradient(var(--raw-gray-300) 0% 25%, var(--raw-common-white) 0% 50%) 0 0 / 8px 8px'

// 휴가 속한 그룹(brand/system) 라벨 — Figma 의 "brand / blue" 표기를 재현한다. 미정의면 휴명으로 대체.
const groupOf = (hue: string): string =>
    Object.entries(tokens.primitiveGroups).find(([, hues]) => hues.includes(hue))?.[0] ?? hue

type SwatchRow = {name: string; cssVar: string; value: string}

// 그룹 하나 = 독립 테이블. 제목(h2) + 이름/값 표. 투명 값도 보이도록 스와치 뒤 체커보드.
const ColorTable = ({title, rows}: {title: ReactNode; rows: SwatchRow[]}) => (
    <section className="flex flex-col gap-2">
        <h2 className="typo-body-l-medium">{title}</h2>
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-border border-b">
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            변수
                        </th>
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            값
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.name} className="border-border hover:bg-card border-b transition-colors">
                            <th
                                scope="row"
                                className="typo-caption-regular text-foreground w-1/3 px-3 py-3 font-mono font-normal whitespace-nowrap"
                            >
                                {row.cssVar.slice(4, -1)}
                            </th>
                            <td className="px-3 py-3">
                                <span className="flex items-center gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="border-border size-icon-md relative shrink-0 overflow-hidden rounded border"
                                        style={{background: CHECKERBOARD}}
                                    >
                                        <span className="absolute inset-0" style={{background: row.cssVar}} />
                                    </span>
                                    <span className="typo-caption-regular text-muted-foreground font-mono whitespace-nowrap">
                                        {row.value}
                                    </span>
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
)

// 색상 — Tier 1 프리미티브 팔레트. Figma(Mode 1) 의 "01 Primitive" 정의를 그룹별 표로 옮긴다.
const ColorGuidePage = () => (
    <GuidePageShell
        title="색상 (Primitive)"
        description="프리미티브 색상 팔레트입니다. 직접 쓰지 말고 시맨틱 토큰을 우선하세요."
    >
        <div className="flex flex-col gap-8">
            {Object.entries(tokens.primitive).map(([hue, steps]) => (
                <ColorTable
                    key={hue}
                    title={
                        <>
                            <span className="text-muted-foreground">{groupOf(hue)} / </span>
                            <span className="text-foreground font-semibold">{hue}</span>
                        </>
                    }
                    rows={Object.entries(steps).map(([step, hex]) => ({
                        name: step,
                        cssVar: `var(--raw-${hue}-${step})`,
                        value: hexToRgba(hex),
                    }))}
                />
            ))}
            <ColorTable
                title={<span className="text-foreground font-semibold">common</span>}
                rows={Object.entries(tokens.common).map(([name, value]) => ({
                    name,
                    cssVar: `var(--raw-common-${name})`,
                    value: display(value),
                }))}
            />
            <ColorTable
                title={<span className="text-foreground font-semibold">alpha</span>}
                rows={Object.entries(tokens.alpha).flatMap(([color, steps]) =>
                    steps.map((step) => ({
                        name: `${color}${step}`,
                        cssVar: `var(--raw-${color}-a${step})`,
                        value: alphaRgba(color, step),
                    })),
                )}
            />
        </div>
    </GuidePageShell>
)

export default ColorGuidePage
