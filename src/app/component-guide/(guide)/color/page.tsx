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

// 팔레트 하나 = 독립 테이블. 투명 값도 보이도록 스와치 뒤에 체커보드를 둔다.
const ColorTable = ({title, rows}: {title: ReactNode; rows: SwatchRow[]}) => (
    <section className="flex flex-col gap-2">
        <h3 className="typo-body-l-medium">{title}</h3>
        <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full text-left">
                <caption className="sr-only">{title} 원시 색상 변수와 값</caption>
                <thead>
                    <tr className="border-border bg-card border-b">
                        <th scope="col" className="typo-body-l-medium px-4 py-3 whitespace-nowrap">
                            변수
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3 whitespace-nowrap">
                            값
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.name} className="border-border border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-caption-regular text-foreground w-1/3 px-4 py-3 font-mono font-normal whitespace-nowrap"
                            >
                                {row.cssVar.slice(4, -1)}
                            </th>
                            <td className="px-4 py-3">
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

const primitive: Record<string, Record<string, string>> = tokens.primitive
const primitiveGroups: Record<string, string[]> = tokens.primitiveGroups
const common: Record<string, string> = tokens.common
const alpha: Record<string, number[]> = tokens.alpha
const PRIMITIVE_COLOR_COUNT = Object.values(primitive).reduce((count, steps) => count + Object.keys(steps).length, 0)
const COMMON_COLOR_COUNT = Object.keys(common).length
const ALPHA_COLOR_COUNT = Object.values(alpha).reduce((count, steps) => count + steps.length, 0)

// 색상 — Tier 1 프리미티브 팔레트. Figma(Mode 1) 의 "01 Primitive" 정의를 그룹별 표로 옮긴다.
const ColorGuidePage = () => (
    <GuidePageShell
        title="색상 (Primitive)"
        description="tokens.json의 원시 색상 팔레트입니다. 일반 UI에서는 직접 사용하지 말고 역할이 드러나는 시맨틱 색상 유틸리티를 우선하세요."
    >
        <div className="flex flex-col gap-12">
            <section aria-labelledby="primitive-rule-title" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="primitive-rule-title" className="typo-h4-bold text-foreground">
                        구조와 사용 원칙
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        원시값은 시맨틱 토큰이 참조하는 기반 값이며, 화면에서는 bg-primary·text-foreground처럼 용도가
                        드러나는 클래스를 사용합니다.
                    </p>
                </div>
                <div className="border-border bg-card grid gap-4 rounded-xl border p-5 md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                        <strong className="text-foreground">단일 원본</strong>
                        <p className="text-foreground-subtle">
                            값 변경은 <code className="font-mono">tokens.json</code>에서만 진행합니다.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <strong className="text-foreground">생성 과정</strong>
                        <p className="text-foreground-subtle">
                            <code className="font-mono">yarn tokens</code>가 raw·ds 변수와 색상 유틸리티를 생성합니다.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <strong className="text-foreground">다크 모드</strong>
                        <p className="text-foreground-subtle">
                            raw 값은 고정되고 ds 스케일은 단계 위치를 반사합니다. 시맨틱 페이지에서 실제 매핑을
                            확인합니다.
                        </p>
                    </div>
                </div>
            </section>

            {Object.entries(primitiveGroups).map(([group, hues]) => (
                <section key={group} aria-labelledby={`primitive-${group}`} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h2 id={`primitive-${group}`} className="typo-h4-bold text-foreground capitalize">
                            {group}
                        </h2>
                        <p className="typo-caption-regular text-muted-foreground">
                            {group === 'brand'
                                ? '브랜드와 중립 UI에 사용하는 원시 팔레트입니다.'
                                : '성공·경고·오류·정보 상태의 기반 원시 팔레트입니다.'}
                        </p>
                    </div>
                    <div className="grid gap-8 xl:grid-cols-2">
                        {hues.map((hue) => (
                            <ColorTable
                                key={hue}
                                title={
                                    <>
                                        <span className="text-muted-foreground">{groupOf(hue)} / </span>
                                        <span className="text-foreground font-semibold">{hue}</span>
                                    </>
                                }
                                rows={Object.entries(primitive[hue]).map(([step, hex]) => ({
                                    name: step,
                                    cssVar: `var(--raw-${hue}-${step})`,
                                    value: hexToRgba(hex),
                                }))}
                            />
                        ))}
                    </div>
                </section>
            ))}

            <section aria-labelledby="primitive-common" className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h2 id="primitive-common" className="typo-h4-bold text-foreground">
                        Common · Alpha
                    </h2>
                    <p className="typo-caption-regular text-muted-foreground">
                        스케일 밖의 고정 앵커와 오버레이·그림자 등에 사용하는 투명도 원시값입니다.
                    </p>
                </div>
                <div className="grid gap-8 xl:grid-cols-2">
                    <ColorTable
                        title={<span className="text-foreground font-semibold">common</span>}
                        rows={Object.entries(common).map(([name, value]) => ({
                            name,
                            cssVar: `var(--raw-common-${name})`,
                            value: display(value),
                        }))}
                    />
                    <ColorTable
                        title={<span className="text-foreground font-semibold">alpha</span>}
                        rows={Object.entries(alpha).flatMap(([color, steps]) =>
                            steps.map((step) => ({
                                name: `${color}${step}`,
                                cssVar: `var(--raw-${color}-a${step})`,
                                value: alphaRgba(color, step),
                            })),
                        )}
                    />
                </div>
            </section>

            <p className="typo-caption-regular text-muted-foreground">
                현재 primitive {PRIMITIVE_COLOR_COUNT}개, common {COMMON_COLOR_COUNT}개, alpha {ALPHA_COLOR_COUNT}개를{' '}
                <code className="font-mono">tokens.json</code>에서 자동 큐레이션합니다.
            </p>
        </div>
    </GuidePageShell>
)

export default ColorGuidePage
