import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import {Badge} from '@/components/kit/badge'

export const metadata: Metadata = {title: '배지 (Badge)'}

const USAGE_CODE = `<Badge color="success">활성</Badge>
<Badge color="warning" variant="outline">대기</Badge>
<Badge color="error" variant="solid">정지</Badge>`

// Figma badge 의 세 축.
const VARIANTS = [
    {key: 'solid-pastel', label: 'solid-pastel', desc: '연한 배경 + 진한 텍스트. 상태 칩 기본형.'},
    {key: 'outline', label: 'outline', desc: '흰 배경 + 색 테두리·텍스트.'},
    {key: 'solid', label: 'solid', desc: '색 배경 + 흰 텍스트. 강조형.'},
] as const

const COLORS = [
    {key: 'info', label: 'info', desc: '정보·기본(blue)'},
    {key: 'success', label: 'success', desc: '성공·활성(green)'},
    {key: 'warning', label: 'warning', desc: '주의·대기(orange)'},
    {key: 'error', label: 'error', desc: '오류·정지(red)'},
    {key: 'neutral', label: 'neutral', desc: '중립·기타(gray)'},
] as const

const BadgeGuidePage = () => (
    <GuidePage
        title="배지 (Badge)"
        description="shadcn Badge 프리미티브입니다. 상태·분류 라벨을 색과 형태로 구분합니다."
    >
        <section aria-labelledby="badge-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="badge-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">color</code>(info/success/warning/error/neutral)로 의미를,{' '}
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
                    5가지 color 를 행으로, 3가지 variant 를 열로 교차한 전체 조합입니다(shape=pill 기준).
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
                                        <div className="flex flex-col items-start gap-2">
                                            <Badge color={c.key} variant={v.key}>
                                                라벨
                                            </Badge>
                                            <CopyChip value={`color="${c.key}" variant="${v.key}"`} label="복사" />
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
                                desc: '의미(색 계열). 상태 배지에 사용합니다.',
                                def: "'neutral'",
                                control: 'info | success | warning | error | neutral',
                            },
                            {
                                name: 'variant',
                                desc: '강조 스타일.',
                                def: "'solid-pastel'",
                                control: 'solid-pastel | outline | solid',
                            },
                            {
                                name: 'shape',
                                desc: '모서리 형태.',
                                def: "'pill'",
                                control: 'pill | round',
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
    </GuidePage>
)

export default BadgeGuidePage
