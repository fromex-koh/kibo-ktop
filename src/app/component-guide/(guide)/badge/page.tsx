import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Badge, NumberBadge} from '@/components/kit/badge'

export const metadata: Metadata = {title: '배지 (Badge)'}

const USAGE_CODE = `<Badge color="success">활성</Badge>
<Badge color="warning" variant="outline">대기</Badge>
<Badge color="error" variant="solid">정지</Badge>`

const NUMBER_BADGE_CODE = `<NumberBadge>2</NumberBadge>
<NumberBadge variant="new">5</NumberBadge>`

// Figma badge 의 세 축.
const VARIANTS = [
    {key: 'solid-pastel', label: 'solid-pastel', desc: '연한 배경 + 진한 텍스트. 상태 칩 기본형.'},
    {key: 'outline', label: 'outline', desc: '흰 배경 + 색 테두리·텍스트.'},
    {key: 'solid', label: 'solid', desc: '색 배경 + 흰 텍스트. 강조형.'},
] as const

const COLORS = [
    // 상태색(semantic) — Figma blue/green/orange/red/gray 와 값이 동일.
    {key: 'info', label: 'info', desc: '정보·기본(blue)'},
    {key: 'success', label: 'success', desc: '성공·활성(green)'},
    {key: 'warning', label: 'warning', desc: '주의·대기(orange)'},
    {key: 'error', label: 'error', desc: '오류·정지(red)'},
    {key: 'neutral', label: 'neutral', desc: '중립·기타(gray)'},
    // 브랜드 분류색 — 상태색과 동일 스텝 패턴을 navy 팔레트로 적용.
    {key: 'navy', label: 'navy', desc: '브랜드·분류(navy)'},
    // 보조색(Figma secondary-*) — 상태가 아닌 분류용 액센트.
    {key: 'secondary-green', label: 'secondary-green', desc: '보조·녹색(green)'},
    {key: 'secondary-orange', label: 'secondary-orange', desc: '보조·주황(orange)'},
    {key: 'secondary-grape', label: 'secondary-grape', desc: '보조·보라(grape)'},
] as const

// 매트릭스 각 셀에서 두 shape 를 짝지어 보여준다(pill=완전 둥근 / round=8px 라운드).
const SHAPES = ['pill', 'round'] as const

const BadgeGuidePage = () => (
    <GuidePageShell
        title="배지 (Badge)"
        description="shadcn Badge 프리미티브입니다. 상태·분류 라벨과 숫자 배지를 한 컴포넌트 계열에서 관리합니다."
    >
        <section aria-labelledby="badge-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="badge-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">color</code>(상태 5색 + 보조 secondary 3색)로 의미를,{' '}
                    <code className="font-mono">variant</code>(solid-pastel/outline/solid)로 강조를,{' '}
                    <code className="font-mono">shape</code>(pill/round)로 형태를 정합니다.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <Badge color="success">활성</Badge>
                <Badge color="warning" variant="outline">
                    대기
                </Badge>
                <Badge color="error" variant="solid">
                    정지
                </Badge>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="badge-matrix" className="flex flex-col gap-4">
            <div>
                <h2 id="badge-matrix" className="typo-h4-bold">
                    Variant × Color 큐레이션
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    8가지 color(상태 5색 + 보조 3색)를 행으로, 3가지 variant 를 열로 교차한 전체 조합입니다. 각 셀은{' '}
                    <code className="font-mono">pill</code>(왼쪽)·<code className="font-mono">round</code>(오른쪽) 두
                    shape 를 짝지어 보여줍니다.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                {COLORS.map((c) => (
                    <p key={c.key} className="typo-body-l-regular text-muted-foreground">
                        <span className="text-foreground font-medium">{c.label}</span> — {c.desc}
                    </p>
                ))}
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">배지 variant·color 조합 미리보기</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Color
                            </th>
                            {VARIANTS.map((v) => (
                                <th key={v.key} scope="col" className="typo-body-l-medium px-4 py-3">
                                    {v.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {COLORS.map((c) => (
                            <tr key={c.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-middle font-mono font-normal whitespace-nowrap"
                                >
                                    {c.label}
                                </th>
                                {VARIANTS.map((v) => (
                                    <td key={v.key} className="px-4 py-3 align-middle">
                                        <div className="flex items-start gap-4">
                                            {SHAPES.map((s) => (
                                                <div key={s} className="flex flex-col items-start gap-2">
                                                    <Badge color={c.key} variant={v.key} shape={s}>
                                                        라벨
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="badge-shape" className="flex flex-col gap-4">
            <div>
                <h2 id="badge-shape" className="typo-h4-bold">
                    Shape
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">pill</code>(완전 둥근 모서리)과 <code className="font-mono">round</code>
                    (8px 라운드) 두 형태입니다.
                </p>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="typo-caption-regular text-muted-foreground w-16 font-mono">pill</span>
                    <Badge color="info" shape="pill">
                        라벨
                    </Badge>
                    <Badge color="success" variant="outline" shape="pill">
                        라벨
                    </Badge>
                    <Badge color="error" variant="solid" shape="pill">
                        라벨
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <span className="typo-caption-regular text-muted-foreground w-16 font-mono">round</span>
                    <Badge color="info" shape="round">
                        라벨
                    </Badge>
                    <Badge color="success" variant="outline" shape="round">
                        라벨
                    </Badge>
                    <Badge color="error" variant="solid" shape="round">
                        라벨
                    </Badge>
                </div>
            </div>
        </section>

        <section aria-labelledby="badge-size" className="flex flex-col gap-4">
            <div>
                <h2 id="badge-size" className="typo-h4-bold">
                    Size
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Figma 두 크기입니다 — <code className="font-mono">sm</code>(기본, 28px·14px)과{' '}
                    <code className="font-mono">lg</code>(40px·16px). 페이지 타이틀 바처럼 큰 제목 옆에는{' '}
                    <code className="font-mono">lg</code> 를 씁니다.
                </p>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="typo-caption-regular text-muted-foreground w-16 font-mono">sm</span>
                    <Badge color="navy" variant="outline" shape="round" size="sm">
                        KTRS-FM 평가
                    </Badge>
                    <Badge color="info" size="sm">
                        진행중
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <span className="typo-caption-regular text-muted-foreground w-16 font-mono">lg</span>
                    <Badge color="navy" variant="outline" shape="round" size="lg">
                        KTRS-FM 평가
                    </Badge>
                    <Badge color="info" size="lg">
                        진행중
                    </Badge>
                </div>
            </div>
        </section>

        <section aria-labelledby="badge-number" className="flex flex-col gap-4">
            <div>
                <h2 id="badge-number" className="typo-h4-bold">
                    숫자 배지
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    개수·알림처럼 숫자만 표시하는 배지는 같은 Badge 파일의 숫자 변형입니다. 사용처에서는 의미가 더
                    분명하도록 <code className="font-mono">NumberBadge</code> 래퍼를 사용합니다.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <NumberBadge>2</NumberBadge>
                <NumberBadge variant="new">5</NumberBadge>
                <NumberBadge>12</NumberBadge>
                <NumberBadge variant="new">99</NumberBadge>
            </div>
            <CodeBlock code={NUMBER_BADGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="badge-props" className="flex flex-col gap-4">
            <div>
                <h2 id="badge-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Badge 에서 커스터마이징 가능한 속성입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Control
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                name: 'color',
                                desc: '색 계열. 상태 5색 + navy(브랜드 분류) + 분류용 보조 3색.',
                                def: "'neutral'",
                                control:
                                    'info | success | warning | error | neutral | navy | secondary-green | secondary-orange | secondary-grape',
                            },
                            {
                                name: 'variant',
                                desc: '강조 스타일. number 는 NumberBadge 래퍼가 내부에서 사용합니다.',
                                def: "'solid-pastel'",
                                control: 'solid-pastel | outline | solid | number',
                            },
                            {
                                name: 'shape',
                                desc: '모서리 형태.',
                                def: "'pill'",
                                control: 'pill | round',
                            },
                            {
                                name: 'size',
                                desc: '크기. sm=28px·14px, lg=40px·16px.',
                                def: "'sm'",
                                control: 'sm | lg',
                            },
                            {
                                name: 'asChild',
                                desc: 'next/link 등 다른 요소에 배지 스타일만 씌울 때 사용합니다.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'className',
                                desc: '추가 클래스명으로 스타일 확장',
                                def: '""',
                                control: 'string',
                            },
                        ].map((prop) => (
                            <tr key={prop.name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {prop.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{prop.desc}</td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {prop.def}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        {prop.control}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default BadgeGuidePage
