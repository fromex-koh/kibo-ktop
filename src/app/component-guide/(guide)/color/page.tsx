import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
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

// hue가 속한 그룹(brand/system) 라벨 — Figma의 "brand / blue" 표기를 재현한다. 미정의면 hue명으로 대체.
const groupOf = (hue: string): string =>
    Object.entries(tokens.primitiveGroups).find(([, hues]) => hues.includes(hue))?.[0] ?? hue

// Figma "01 Primitive" 팔레트 스트립의 용도 표식(프레임 40006650:29062·29142·29189·29344)을 그대로 옮긴다.
// 각 hue 에서 시맨틱 계층이 참조하는 대표 단계 안내이며, 그레이의 background·surface(white~100)와
// disabled(200~300)는 시안이 구간 브래킷으로 묶어 표시하므로 구간의 모든 단계에 같은 표식을 단다.
// 시안 스트립에 없는 단계(각 hue 의 10 등)는 표식이 없다.
const USAGE_MARKS: Record<string, Record<string, string>> = {
    blue: {'50': 'surface', '500': 'base', '600': 'text'},
    navy: {'50': 'surface', '500': 'base', '600': 'text'},
    green: {'50': 'surface', '500': 'base', '800': 'text'},
    orange: {'50': 'surface', '500': 'base', '700': 'text'},
    purple: {'50': 'surface', '500': 'base', '600': 'text'},
    mint: {'50': 'surface', '500': 'base', '800': 'text'},
    gray: {
        '50': 'background, surface',
        '100': 'background, surface',
        '200': 'disabled',
        '300': 'disabled',
        '500': 'subtle',
        '700': 'base',
        '900': 'bolder',
    },
    error: {'500': 'base'},
    warning: {'300': 'base'},
    success: {'500': 'base'},
    info: {'500': 'base'},
}

// 그레이 스트립의 background·surface 구간은 common.white 에서 시작한다 — common 표에도 같은 표식을 단다.
const COMMON_USAGE_MARKS: Record<string, string> = {white: 'background, surface'}

type SwatchRow = {name: string; cssVar: string; value: string; usage?: string}

const COLOR_TABLE_COLUMNS = [
    {key: 'variable', header: '변수', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
    {key: 'usage', header: '용도', align: 'start'},
] as const

// 팔레트 하나 = 공용 Table의 sm 크기. 투명 값도 보이도록 스와치 뒤에 체커보드를 둔다.
const ColorTable = ({title, caption, rows}: {title: ReactNode; caption: string; rows: SwatchRow[]}) => (
    <section className="flex flex-col gap-2">
        <h3 className="typo-body-l-medium">{title}</h3>
        <Table
            size="sm"
            caption={`${caption} 원시 색상 변수와 값`}
            columns={COLOR_TABLE_COLUMNS}
            rows={rows.map((row) => ({
                key: row.name,
                // 용도가 있는 행만 옅은 포인트 면으로 표시한다 — primary-subtle 은 light 에서 blue.50,
                // dark 에서 반사값이라 본문 대비를 해치지 않는다([PB-06]).
                className: row.usage ? 'bg-primary-subtle/60' : undefined,
                cells: [
                    <span key="variable" className="text-foreground font-mono">
                        {row.cssVar.slice(4, -1)}
                    </span>,
                    <span key="value" className="flex items-center gap-3">
                        <span
                            aria-hidden="true"
                            className="border-border size-icon-md relative shrink-0 overflow-hidden rounded border"
                            style={{background: CHECKERBOARD}}
                        >
                            <span className="absolute inset-0" style={{background: row.cssVar}} />
                        </span>
                        <span className="text-muted-foreground font-mono whitespace-nowrap">{row.value}</span>
                    </span>,
                    <span key="usage" className="text-muted-foreground whitespace-nowrap">
                        {row.usage}
                    </span>,
                ],
            }))}
        />
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
        description={
            <>
                Figma 변수 정의를 JSON으로 추출해 <code className="font-mono">tokens.json</code>에 반영하고, primitive{' '}
                {PRIMITIVE_COLOR_COUNT}개·common {COMMON_COLOR_COUNT}개·alpha {ALPHA_COLOR_COUNT}개를 자동
                큐레이션합니다. 화면에서는 원시값 대신 역할이 드러나는 시맨틱 색상 유틸리티를 우선하세요.
            </>
        }
    >
        <div className="flex flex-col gap-12">
            <BaseCard>
                <section aria-labelledby="primitive-rule-title" className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 id="primitive-rule-title" className="typo-h4-bold text-foreground">
                            구조와 사용 원칙
                        </h2>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            원시값은 시맨틱 토큰이 참조하는 기반 값이며, 화면에서는 bg-primary·text-foreground처럼
                            용도가 드러나는 클래스를 사용합니다.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">단일 원본</strong>
                            <p className="text-foreground-subtle">
                                값 변경은 <code className="font-mono">tokens.json</code>에서만 진행합니다.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <strong className="text-foreground">생성 과정</strong>
                            <p className="text-foreground-subtle">
                                <code className="font-mono">yarn tokens</code>가 raw·ds 변수와 색상 유틸리티를
                                생성합니다.
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
            </BaseCard>

            {Object.entries(primitiveGroups).map(([group, hues]) => (
                <BaseCard key={group}>
                    <section aria-labelledby={`primitive-${group}`} className="flex flex-col gap-6">
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
                                    caption={`${groupOf(hue)} / ${hue}`}
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
                                        usage: USAGE_MARKS[hue]?.[step],
                                    }))}
                                />
                            ))}
                        </div>
                    </section>
                </BaseCard>
            ))}

            <BaseCard>
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
                            caption="common"
                            title={<span className="text-foreground font-semibold">common</span>}
                            rows={Object.entries(common).map(([name, value]) => ({
                                name,
                                cssVar: `var(--raw-common-${name})`,
                                value: display(value),
                                usage: COMMON_USAGE_MARKS[name],
                            }))}
                        />
                        <ColorTable
                            caption="alpha"
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
            </BaseCard>
        </div>
    </GuidePageShell>
)

export default ColorGuidePage
