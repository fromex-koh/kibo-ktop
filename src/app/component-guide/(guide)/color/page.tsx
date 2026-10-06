// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '색상 (Primitive)'}

// tokens.json 은 hex 로 저장하지만 이 화면에는 rgba 문자열로 보여준다(값은 동일).
const hexToRgba = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 1)`
}

// 표시값 — hex 는 rgba 로 변환, 그 외(transparent 등)는 그대로.
const display = (v: string): string => (v.startsWith('#') ? hexToRgba(v) : v)

// alpha 스텝(1~99) → rgba 문자열. 완전 투명/불투명 경계값은 common 에서 관리한다.
const alphaRgba = (color: string, step: number): string =>
    `rgba(${color === 'black' ? '0, 0, 0' : '255, 255, 255'}, ${step / 100})`

// 투명 값(common transparent·alpha) 뒤에 깔 체커보드 — --raw-* 는 모드 무관 고정.
const CHECKERBOARD =
    'repeating-conic-gradient(var(--raw-gray-300) 0% 25%, var(--raw-common-white) 0% 50%) 0 0 / 8px 8px'

// hue가 속한 그룹(brand/system) 라벨 — Figma의 "brand / blue" 표기를 재현한다. 미정의면 hue명으로 대체.
const groupOf = (hue: string): string =>
    Object.entries(tokens.primitiveGroups).find(([, hues]) => hues.includes(hue))?.[0] ?? hue

// 각 hue 에서 시맨틱 계층이 참조하는 대표 단계 안내(큐레이션). 그레이의 background·surface(white~100)와
// disabled(200~300)는 구간의 모든 단계에 같은 표식을 단다. 표식이 없는 단계는 대표 용도가 정해지지 않은 값이다.
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

// background·surface 구간은 common.white 에서 시작하므로 common 표에도 같은 표식을 단다.
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

// 색상 — Tier 1 프리미티브 팔레트를 그룹별 표로 보여준다.
// 두 계층 비교 카드 — 같은 항목을 같은 순서로 둔다.
const COLOR_LAYERS = [
    {
        name: 'Primitive',
        usage: '보조 수단',
        isUsable: false,
        summary:
            '색 이름과 단계로 정의한 고정 팔레트입니다. 시맨틱의 재료입니다. --raw-* 는 모드와 무관한 고정값이고, 팔레트 유틸리티는 다크에서 단계가 반사됩니다.',
        variable: '--raw-*',
        example: 'bg-blue-500 · text-gray-700',
        where: '시맨틱 매핑 · 토큰 문서 · 시맨틱으로 표현할 수 없는 예외 색',
    },
    {
        name: '시맨틱 (Semantic)',
        usage: '화면 · 컴포넌트에서 사용',
        isUsable: true,
        summary: '용도에 이름을 붙인 색입니다. Primitive 를 참조합니다.',
        variable: '--ds-*',
        example: 'bg-primary · text-foreground',
        where: '모든 화면과 컴포넌트의 className',
    },
] as const

const COLOR_CHANGE_STEPS = [
    {command: 'tokens.json', description: '원본 값을 바꿉니다.'},
    {command: 'yarn tokens', description: 'CSS 를 다시 생성합니다.'},
    {command: 'yarn verify', description: '참조 · 타입을 검증합니다.'},
] as const

const ColorGuidePage = () => (
    <GuidePageShell
        title="색상 (Primitive)"
        description={
            <>
                시맨틱 색상의 기반이 되는 고정 팔레트입니다. 화면과 컴포넌트에서는 역할 기반 시맨틱 유틸리티를 먼저
                쓰고, 팔레트는 시맨틱으로 표현할 수 없을 때의 보조 수단으로만 씁니다.
            </>
        }
    >
        <div className="flex flex-col gap-12">
            <BaseCard>
                <section aria-labelledby="primitive-rule-title" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 id="primitive-rule-title" className="typo-h4-bold text-foreground">
                            Primitive와 시맨틱의 역할
                        </h2>
                        <p className="typo-body-l-regular text-label-foreground">
                            색은 두 계층으로 관리합니다. 화면과 컴포넌트에는 시맨틱을 먼저 씁니다.
                        </p>
                    </div>

                    {/* 두 계층을 같은 자리에 같은 항목(변수 · 예 · 쓰는 곳)으로 나란히 둔다. */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {COLOR_LAYERS.map((layer) => (
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
                                    <dt className="typo-body-l-bold text-foreground-subtle">변수</dt>
                                    <dd className="text-label-foreground font-mono text-sm">{layer.variable}</dd>
                                    <dt className="typo-body-l-bold text-foreground-subtle">예</dt>
                                    <dd className="text-label-foreground font-mono text-sm">{layer.example}</dd>
                                    <dt className="typo-body-l-bold text-foreground-subtle">쓰는 곳</dt>
                                    <dd className="text-label-foreground">{layer.where}</dd>
                                </dl>
                            </div>
                        ))}
                    </div>
                    <p className="border-primary/30 bg-primary-subtle text-foreground overflow-x-auto rounded-sm border p-5 text-center font-mono text-sm font-semibold">
                        tokens.json → Primitive (--raw-*) → 시맨틱 (--ds-*) → 유틸리티 (bg-primary)
                    </p>
                    <Link
                        href="/component-guide/semantic-color"
                        className="text-primary focus-visible:ring-ring w-fit rounded-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                    >
                        시맨틱 색상과 사용 가능한 유틸리티 보기
                    </Link>

                    <div className="border-subtle-3 flex flex-col gap-4 border-t pt-6">
                        <h3 className="typo-title-m-bold text-foreground">사용 규칙</h3>
                        <ul className="text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                <code className="text-foreground font-mono">bg-surface</code> ·{' '}
                                <code className="text-foreground font-mono">text-foreground</code> ·{' '}
                                <code className="text-foreground font-mono">border-border</code>처럼 역할이 드러나는
                                시맨틱 유틸리티를 씁니다. light · dark 값은 자동으로 바뀌므로 dark: 접두사로 다시
                                분기하지 않습니다.
                            </li>
                            <li>
                                색상 리터럴(Hex)과 <code className="text-foreground font-mono">--raw-*</code> 변수를
                                컴포넌트에 직접 넣지 않습니다.
                            </li>
                            <li>
                                <code className="text-foreground font-mono">src/app/tokens.css</code>는 자동 생성
                                파일이라 직접 고치지 않습니다.
                            </li>
                            <li>
                                투명도는 <code className="text-foreground font-mono">alpha</code>(1~99%)에서, 완전 투명
                                · 불투명은 <code className="text-foreground font-mono">common</code>에서 관리합니다.{' '}
                                <code className="text-foreground font-mono">a0</code> ·{' '}
                                <code className="text-foreground font-mono">a100</code> 토큰은 만들지 않습니다.
                            </li>
                        </ul>
                    </div>

                    <div className="border-subtle-3 flex flex-col gap-4 border-t pt-6">
                        <h3 className="typo-title-m-bold text-foreground">색을 바꿀 때</h3>
                        <ol className="grid gap-4 md:grid-cols-3">
                            {COLOR_CHANGE_STEPS.map((step, index) => (
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

            {Object.entries(primitiveGroups).map(([group, hues]) => (
                <BaseCard key={group}>
                    <section aria-labelledby={`primitive-${group}`} className="flex flex-col gap-6">
                        <div className="flex max-w-4xl flex-col gap-2">
                            <h2 id={`primitive-${group}`} className="typo-h4-bold text-foreground capitalize">
                                {group}
                            </h2>
                            <p className="typo-body-l-regular text-label-foreground">
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
                    <div className="flex max-w-4xl flex-col gap-2">
                        <h2 id="primitive-common" className="typo-h4-bold text-foreground">
                            Common · Alpha
                        </h2>
                        <p className="typo-body-l-regular text-label-foreground">
                            Common은 불투명·완전 투명 앵커, Alpha는 오버레이·그림자용 1~99% 반투명 값입니다.
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
