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

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const CODE_CLASS = 'text-foreground font-mono'

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

// hue가 속한 그룹(brand/system) 라벨 — "brand / blue" 표기. 미정의면 hue명으로 대체.
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
// 제목 단계는 놓이는 자리에 맞춘다 — 섹션(h2) 바로 아래면 h3, 소제목(h3) 아래면 h4.
const ColorTable = ({
    title,
    caption,
    rows,
    headingLevel = 3,
}: {
    title: ReactNode
    caption: string
    rows: SwatchRow[]
    headingLevel?: 3 | 4
}) => {
    const Heading = headingLevel === 3 ? 'h3' : 'h4'

    return (
        <section className="flex flex-col gap-2">
            <Heading className="typo-body-l-medium">{title}</Heading>
            <Table
                size="sm"
                caption={`${caption} 원시 색상 변수와 값`}
                columns={COLOR_TABLE_COLUMNS}
                rows={rows.map((row) => ({
                    key: row.name,
                    // 용도가 있는 행만 옅은 포인트 면으로 표시한다([PB-06]).
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
}

const primitive: Record<string, Record<string, string>> = tokens.primitive
const primitiveGroups: Record<string, string[]> = tokens.primitiveGroups
const common: Record<string, string> = tokens.common
const extra: Record<string, string> = tokens.extra
const alpha: Record<string, number[]> = tokens.alpha
// PDF 템플릿 역할 색 — 값은 참조('blue.500') 또는 섞은 색({mix, amount, base}).
const kbxColor: Record<string, string | {mix: string; amount: number; base: string}> = tokens.kbigxPrint.color

// 용도 = 이 색('common.white' · 'extra.cyan')을 참조하는 시맨틱 토큰 이름.
const semanticUsersOf = (reference: string) => {
    const users = Object.entries(tokens.semantic)
        .filter(([, modes]) => typeof modes === 'object' && Object.values(modes).includes(reference))
        .map(([semanticName]) => semanticName)
    return users.length ? users.join(', ') : undefined
}

// K-BIGx PDF 템플릿 역할 색(kbigxPrint.color) 중 이 색을 참조하는 것 → kbx-primary 처럼 보인다.
const kbxUsersOf = (reference: string) => {
    const users = Object.entries(kbxColor)
        .filter(([, value]) => (typeof value === 'string' ? [value] : [value.mix, value.base]).includes(reference))
        .map(([role]) => `kbx-${role}`)
    return users.length ? users.join(', ') : undefined
}

// extra 를 웹 화면용과 K-BIGx PDF 템플릿 전용으로 나눈다 — PDF 템플릿 역할 색만 참조하면 PDF 템플릿 전용이다.
const extraEntries = Object.entries(extra)
const reportExtra = extraEntries.filter(([name]) => kbxUsersOf(`extra.${name}`) && !semanticUsersOf(`extra.${name}`))
const webExtra = extraEntries.filter(([name]) => !reportExtra.some(([reportName]) => reportName === name))

// 1. 한눈에 보기 — 색이 화면까지 오는 길.
const FLOW_STEPS = [
    {label: 'tokens.json', note: '원본 값'},
    {label: 'Primitive', note: '--raw-*'},
    {label: '시맨틱', note: '--ds-*'},
    {label: '유틸리티', note: 'bg-primary'},
] as const

const COLOR_LAYERS = [
    {
        name: 'Primitive',
        usage: '재료',
        isUsable: false,
        summary: '색 이름과 단계로 정한 고정 팔레트입니다. 화면에 직접 쓰지 않고 시맨틱이 가져다 씁니다.',
        variable: '--raw-*',
        example: 'blue.500 · extra.cyan',
    },
    {
        name: '시맨틱 (Semantic)',
        usage: '화면에서 사용',
        isUsable: true,
        summary: '용도에 이름을 붙인 색입니다. 라이트 · 다크 값이 자동으로 바뀝니다.',
        variable: '--ds-*',
        example: 'bg-primary · text-foreground',
    },
] as const

// 2. 사용 규칙
const DO_RULES = [
    <>
        역할이 드러나는 시맨틱 유틸리티를 씁니다(<code className={CODE_CLASS}>bg-surface</code> ·{' '}
        <code className={CODE_CLASS}>text-foreground</code> · <code className={CODE_CLASS}>border-border</code>).
    </>,
    <>
        반투명은 <code className={CODE_CLASS}>alpha</code>(1~99%), 완전 투명 · 불투명은{' '}
        <code className={CODE_CLASS}>common</code> 을 참조합니다.
    </>,
] as const

const DONT_RULES = [
    <>
        hex 값이나 <code className={CODE_CLASS}>--raw-*</code> 변수를 컴포넌트에 직접 넣지 않습니다.
    </>,
    <>
        <code className={CODE_CLASS}>dark:</code> 로 색을 다시 나누지 않습니다. 시맨틱이 모드마다 값을 바꿉니다.
    </>,
    <>
        생성 파일 <code className={CODE_CLASS}>src/app/tokens.css</code> 를 직접 고치지 않습니다.
    </>,
] as const

// 3. 새 색을 넣을 때 — 어디에 넣을지 고르는 기준.
const PLACE_COLUMNS = [
    {key: 'case', header: '이런 색이면', align: 'start', rowHeader: true},
    {key: 'where', header: '넣는 곳', align: 'start'},
    {key: 'example', header: '예', align: 'start', wrap: true},
] as const

const PLACE_ROWS = [
    {
        key: 'scale',
        cells: [
            '밝기 단계가 여럿 필요한 색',
            <code key="w">primitive</code>,
            '50~900 단계 팔레트 하나를 만듭니다(blue.50 ~ blue.900).',
        ],
    },
    {
        key: 'extra',
        cells: [
            '단계 없이 한 가지 값만 필요한 색',
            <code key="w">extra</code>,
            '숫자 없는 색 이름으로 둡니다(cyan). 밝기 버전이 더 필요해지면 단계 팔레트로 옮깁니다.',
        ],
    },
    {
        key: 'alpha',
        cells: ['반투명 흰색 · 검정', <code key="w">alpha</code>, 'white.50 = 흰색 50%'],
    },
    {
        key: 'semantic',
        cells: [
            '화면에서 쓸 용도',
            <code key="w">semantic</code>,
            '위 색을 참조해 light · dark 값을 정합니다(primary = blue.500).',
        ],
    },
    {
        key: 'kbx',
        cells: [
            'K-BIGx 보고서 PDF 템플릿의 역할 색',
            <code key="w">kbigxPrint.color</code>,
            '위 색만 참조합니다(kbx-primary = extra.indigo). PDF 템플릿 밖에서는 값이 없습니다.',
        ],
    },
] as const

const CHANGE_STEPS = [
    {command: 'tokens.json', description: '원본 값을 고칩니다.'},
    {command: 'yarn tokens', description: 'CSS 를 다시 만듭니다. 잘못된 참조는 여기서 멈춥니다.'},
    {command: 'yarn verify', description: '전체 검사를 통과시킵니다.'},
] as const

const SectionHeading = ({id, title, children}: {id: string; title: string; children?: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <h2 id={id} className="typo-h4-bold text-foreground">
            {title}
        </h2>
        {children ? <div className="typo-body-l-regular text-label-foreground">{children}</div> : null}
    </div>
)

const ColorGuidePage = () => (
    <GuidePageShell
        title="색상 (Primitive)"
        description="시맨틱 색상의 재료가 되는 고정 팔레트입니다. 화면에는 시맨틱 색상을 씁니다."
    >
        <div className="flex flex-col gap-12">
            <BaseCard>
                <section aria-labelledby="color-overview" className="flex flex-col gap-6">
                    <SectionHeading id="color-overview" title="1. 한눈에 보기">
                        색은 Primitive(재료)와 시맨틱(용도) 두 층으로 관리합니다.{' '}
                        <Link href="/component-guide/semantic-color" className={LINK_CLASS}>
                            시맨틱 색상
                        </Link>{' '}
                        에서 화면에 쓰는 유틸리티를 고릅니다.
                    </SectionHeading>

                    <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        {FLOW_STEPS.map((step, index) => (
                            <li
                                key={step.label}
                                className="border-subtle-3 bg-surface flex items-center gap-3 rounded-sm border px-4 py-3"
                            >
                                <span className="bg-primary text-primary-foreground typo-caption-bold flex size-6 shrink-0 items-center justify-center rounded-full">
                                    {index + 1}
                                </span>
                                <span className="flex min-w-0 flex-col">
                                    <span className="typo-body-l-bold text-foreground">{step.label}</span>
                                    <code className="typo-caption-regular text-foreground-subtle font-mono">
                                        {step.note}
                                    </code>
                                </span>
                            </li>
                        ))}
                    </ol>

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
                                <p className="typo-body-l-regular text-label-foreground">{layer.summary}</p>
                                <dl className="border-subtle-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t pt-3">
                                    <dt className="typo-body-l-bold text-foreground-subtle">변수</dt>
                                    <dd className="text-label-foreground font-mono text-sm">{layer.variable}</dd>
                                    <dt className="typo-body-l-bold text-foreground-subtle">예</dt>
                                    <dd className="text-label-foreground font-mono text-sm">{layer.example}</dd>
                                </dl>
                            </div>
                        ))}
                    </div>
                </section>
            </BaseCard>

            <BaseCard>
                <section aria-labelledby="color-rules" className="flex flex-col gap-6">
                    <SectionHeading id="color-rules" title="2. 사용 규칙" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border-subtle-3 flex flex-col gap-3 rounded-sm border p-5">
                            <h3 className="typo-title-m-bold text-foreground">이렇게 씁니다</h3>
                            <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                                {DO_RULES.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-subtle-3 flex flex-col gap-3 rounded-sm border p-5">
                            <h3 className="typo-title-m-bold text-foreground">하지 않습니다</h3>
                            <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                                {DONT_RULES.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </BaseCard>

            <BaseCard>
                <section aria-labelledby="color-add" className="flex flex-col gap-6">
                    <SectionHeading id="color-add" title="3. 색을 더하거나 바꿀 때">
                        먼저 어디에 넣을지 고르고, 세 단계로 반영합니다.
                    </SectionHeading>
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-title-m-bold text-foreground">3-1. 넣는 곳 고르기</h3>
                        <Table caption="새 색을 넣는 곳" columns={PLACE_COLUMNS} rows={PLACE_ROWS} size="md" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-title-m-bold text-foreground">3-2. 반영하기</h3>
                        <ol className="grid gap-4 md:grid-cols-3">
                            {CHANGE_STEPS.map((step, index) => (
                                <li
                                    key={step.command}
                                    className="border-foreground-subtle/30 bg-pastel-neutral/40 flex items-start gap-3 rounded-sm border p-5"
                                >
                                    <span className="bg-primary text-primary-foreground typo-caption-bold flex size-6 shrink-0 items-center justify-center rounded-full">
                                        {index + 1}
                                    </span>
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <code className="typo-body-xl-bold text-foreground font-mono">
                                            {step.command}
                                        </code>
                                        <p className="typo-body-l-regular text-label-foreground">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </BaseCard>

            {Object.entries(primitiveGroups).map(([group, hues], groupIndex) => (
                <BaseCard key={group}>
                    <section aria-labelledby={`primitive-${group}`} className="flex flex-col gap-6">
                        <SectionHeading
                            id={`primitive-${group}`}
                            title={`${groupIndex + 4}. ${group === 'brand' ? 'Brand 팔레트' : 'System 팔레트'}`}
                        >
                            {group === 'brand'
                                ? '브랜드와 중립 UI 의 바탕 팔레트입니다. 용도 칸이 있는 단계가 시맨틱이 주로 쓰는 값입니다.'
                                : '성공 · 경고 · 오류 · 정보 상태의 바탕 팔레트입니다.'}
                        </SectionHeading>
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
                <section aria-labelledby="primitive-extra" className="flex flex-col gap-6">
                    <SectionHeading id="primitive-extra" title="6. Extra (단계 없는 단일 색)">
                        단계 팔레트에 없는 색을 숫자 없이 둡니다. 용도 칸이 이 색을 참조하는 토큰입니다.
                    </SectionHeading>
                    <div className="grid gap-8 xl:grid-cols-2">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="typo-title-m-bold text-foreground">6-1. 웹 화면</h3>
                                <Badge variant="outline" color="info" size="sm">
                                    semantic 이 참조
                                </Badge>
                            </div>
                            <ColorTable
                                headingLevel={4}
                                caption="extra 웹 화면"
                                title={<span className="text-foreground font-semibold">extra</span>}
                                rows={webExtra.map(([name, value]) => ({
                                    name,
                                    cssVar: `var(--raw-extra-${name})`,
                                    value: display(value),
                                    usage: semanticUsersOf(`extra.${name}`),
                                }))}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="typo-title-m-bold text-foreground">6-2. K-BIGx PDF 템플릿 전용</h3>
                                <Badge variant="outline" color="neutral" size="sm">
                                    kbigxPrint.color 만 참조
                                </Badge>
                            </div>
                            <ColorTable
                                headingLevel={4}
                                caption="extra K-BIGx PDF 템플릿 전용"
                                title={
                                    <Link href="/component-guide/report-shell" className={LINK_CLASS}>
                                        리포트 공통 · kbx 토큰
                                    </Link>
                                }
                                rows={reportExtra.map(([name, value]) => ({
                                    name,
                                    cssVar: `var(--raw-extra-${name})`,
                                    value: display(value),
                                    usage: kbxUsersOf(`extra.${name}`),
                                }))}
                            />
                        </div>
                    </div>
                </section>
            </BaseCard>

            <BaseCard>
                <section aria-labelledby="primitive-common" className="flex flex-col gap-6">
                    <SectionHeading id="primitive-common" title="7. Common · Alpha">
                        Common 은 불투명 · 완전 투명 값, Alpha 는 오버레이 · 그림자용 1~99% 반투명 값입니다.
                    </SectionHeading>
                    <div className="grid gap-8 xl:grid-cols-2">
                        <ColorTable
                            caption="common"
                            title={<span className="text-foreground font-semibold">common</span>}
                            rows={Object.entries(common).map(([name, value]) => ({
                                name,
                                cssVar: `var(--raw-common-${name})`,
                                value: display(value),
                                usage: COMMON_USAGE_MARKS[name] ?? semanticUsersOf(`common.${name}`),
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
