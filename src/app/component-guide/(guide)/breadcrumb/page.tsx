import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChevronRightIcon} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {breadcrumbPillClassName} from '@/components/theme/breadcrumb.variants'

export const metadata: Metadata = {title: '브레드크럼 (Breadcrumb)'}

// Figma "브레드크럼" 알약 컨테이너 — 클래스 정의는 theme/breadcrumb.variants.ts 가 단일 소스다.
const PILL = breadcrumbPillClassName

const USAGE_CODE = `{/* 알약 컨테이너 — PageTitleBar 를 쓰면 breadcrumb 슬롯이 이 외형을 자동으로 씌운다 */}
<div className={breadcrumbPillClassName}>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">홈</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbDotSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/self">자가진단</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbDotSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>고객정보활용동의</BreadcrumbPage>
        {/* 현재 페이지 표시 화살표(›) — Figma icon/line-right */}
        <ChevronRightIcon aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</div>`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    ['Breadcrumb', '<nav aria-label="breadcrumb"> 래퍼.'],
    ['BreadcrumbList', '항목들을 감싸는 <ol>. typo-body-xl-regular·label-foreground·항목 간 12px.'],
    ['BreadcrumbItem', '한 항목 <li>.'],
    ['BreadcrumbLink', '이동 가능한 항목(<a>). hover 시 진해진다.'],
    ['BreadcrumbPage', '현재 페이지(이동 불가). typo-body-xl-bold + foreground, aria-current="page".'],
    ['BreadcrumbSeparator', 'ui primitive의 기본 chevron 구분자. children으로 다른 표식을 주입할 수 있다.'],
    ['BreadcrumbDotSeparator', '프로젝트 표준 점(·) 구분자. BreadcrumbSeparator에 점을 주입한 composite 조합.'],
    ['BreadcrumbEllipsis', '경로가 길 때 중간을 … 로 접는 표시.'],
] as const

type PropItem = {
    component: string
    name: string
    type: string
    defaultValue: string
    description: string
    rowSpan?: number
}

const PROPS_ITEMS: readonly PropItem[] = [
    {
        component: 'Breadcrumb',
        name: 'nav props',
        type: "React.ComponentProps<'nav'>",
        defaultValue: 'aria-label="breadcrumb"',
        description: 'className·aria-* 등 네이티브 nav 속성을 전달합니다.',
    },
    {
        component: 'BreadcrumbList',
        name: 'ol props',
        type: "React.ComponentProps<'ol'>",
        defaultValue: '-',
        description: '프로젝트 타이포·색상·12px 간격 위에 네이티브 ol 속성을 전달합니다.',
    },
    {
        component: 'BreadcrumbItem',
        name: 'li props',
        type: "React.ComponentProps<'li'>",
        defaultValue: '-',
        description: '한 경로 항목을 감싸며 네이티브 li 속성을 전달합니다.',
    },
    {
        component: 'BreadcrumbLink',
        rowSpan: 2,
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description: '자체 a 대신 자식 링크 요소에 속성과 스타일을 합성합니다.',
    },
    {
        component: 'BreadcrumbLink',
        name: 'anchor props',
        type: "React.ComponentProps<'a'>",
        defaultValue: '-',
        description: 'href·target·className 등 네이티브 a 속성을 전달합니다.',
    },
    {
        component: 'BreadcrumbPage',
        name: 'span props',
        type: "React.ComponentProps<'span'>",
        defaultValue: 'aria-current="page"',
        description: '현재 페이지에 role="link"와 aria-disabled="true"도 자동 적용합니다.',
    },
    {
        component: 'BreadcrumbSeparator',
        rowSpan: 2,
        name: 'children',
        type: 'ReactNode',
        defaultValue: '<ChevronRightIcon />',
        description: '기본 chevron 대신 표시할 구분자 콘텐츠입니다.',
    },
    {
        component: 'BreadcrumbSeparator',
        name: 'li props',
        type: "React.ComponentProps<'li'>",
        defaultValue: '-',
        description: '장식용 li에 className 등 네이티브 속성을 전달합니다.',
    },
    {
        component: 'BreadcrumbDotSeparator',
        name: 'separator props',
        type: 'ComponentProps<typeof BreadcrumbSeparator>',
        defaultValue: '4px separator dot',
        description: '프로젝트 점을 고정 children으로 사용하고 나머지 Separator Props를 전달합니다.',
    },
    {
        component: 'BreadcrumbEllipsis',
        name: 'span props',
        type: "React.ComponentProps<'span'>",
        defaultValue: '<MoreHorizontalIcon />',
        description: '접힌 경로를 나타내는 장식 span에 네이티브 속성을 전달합니다.',
    },
]

// 브레드크럼 — 바닐라 shadcn Breadcrumb primitive를 composite wrapper에서 호출하고 프로젝트 theme 스타일을 연결한다.
// Figma 는 bg-surface 알약(rounded-full + shadow-1) 컨테이너에 담고, 현재 페이지에 오른쪽 화살표(›)를 붙인다.
const BreadcrumbGuidePage = () => (
    <GuidePageShell
        title="브레드크럼 (Breadcrumb)"
        description="바닐라 shadcn Breadcrumb primitive를 프로젝트 wrapper로 조합한 위치 내비게이션입니다. bg-surface 알약 안에서 점(·)으로 구분하고 현재 페이지를 강조합니다."
    >
        <BaseCard>
            <section aria-labelledby="bc-main" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="bc-main" className="typo-h4-bold">
                        기본 (Figma)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        알약 컨테이너 · 점 구분자 · 상위 경로 링크 · 강조된 현재 페이지와 오른쪽 화살표(›)까지 Figma
                        사양 그대로입니다. 알약은 <code className="font-mono">PageTitleBar</code>의{' '}
                        <code className="font-mono">breadcrumb</code> 슬롯이 자동으로 씌우므로, 그 안에서 쓸 때는 아래
                        코드의 감싸는 <code className="font-mono">div</code>가 필요 없습니다.
                    </p>
                    <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-1 pl-5">
                        <li>
                            컨테이너 — <code className="font-mono">bg-surface</code> ·{' '}
                            <code className="font-mono">rounded-full</code> ·{' '}
                            <code className="font-mono">px-10 py-4</code>(40·16px) ·{' '}
                            <code className="font-mono">shadow-1</code>
                        </li>
                        <li>
                            경로 항목 — 16px Regular <code className="font-mono">text-label-foreground</code>, 항목 간{' '}
                            <code className="font-mono">gap-3</code>(12px)
                        </li>
                        <li>
                            구분자 — 4px 원 <code className="font-mono">bg-separator-dot</code>
                        </li>
                        <li>
                            현재 페이지 — 16px Bold <code className="font-mono">text-foreground</code>, 오른쪽에 16px
                            화살표를 4px 띄워 붙임
                        </li>
                    </ul>
                </div>
                <div>
                    <div className={PILL}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">자가진단</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>고객정보활용동의</BreadcrumbPage>
                                    <ChevronRightIcon
                                        aria-hidden="true"
                                        className="text-foreground size-icon-sm shrink-0"
                                    />
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bc-separator" className="flex flex-col gap-4">
                <div>
                    <h2 id="bc-separator" className="typo-h4-bold">
                        Separator
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        primitive 기본 chevron과 프로젝트 표준 점 구분자를 모두 사용할 수 있습니다.
                    </p>
                </div>
                <div className="flex flex-wrap gap-8">
                    <div className={PILL}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>자가진단</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className={PILL}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>자가진단</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bc-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="bc-basic" className="typo-h4-bold">
                        2뎁스 (화살표 없음)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        단계가 적으면 현재 페이지의 화살표(›)를 뺍니다.
                    </p>
                </div>
                <div>
                    <div className={PILL}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>자가진단</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bc-ellipsis" className="flex flex-col gap-4">
                <div>
                    <h2 id="bc-ellipsis" className="typo-h4-bold">
                        접힘 (Ellipsis)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        경로가 길면 중간 단계를 <code className="font-mono">BreadcrumbEllipsis</code>(…)로 접습니다.
                    </p>
                </div>
                <div>
                    <div className={PILL}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbEllipsis />
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>고객정보활용동의</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bc-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="bc-composition" className="typo-h4-bold">
                        구성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        브레드크럼은 여러 하위 컴포넌트로 조합합니다.
                    </p>
                </div>
                <dl className="flex flex-col gap-2">
                    {COMPOSITION.map(([name, desc]) => (
                        <div key={name} className="flex flex-col gap-0.5">
                            <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                            <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bc-accessibility" className="flex flex-col gap-4">
                <div>
                    <h2 id="bc-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        현재 위치와 이동 가능한 상위 경로를 내비게이션·목록 구조로 전달합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-1 pl-5">
                    <li>
                        Breadcrumb는 <code>nav[aria-label=&quot;breadcrumb&quot;]</code>, BreadcrumbList는{' '}
                        <code>ol</code>로 렌더링됩니다.
                    </li>
                    <li>
                        현재 페이지에는 aria-current=&quot;page&quot;와 aria-disabled=&quot;true&quot;가 자동
                        적용됩니다.
                    </li>
                    <li>chevron·점·ellipsis 구분 표시는 장식이므로 접근성 트리에서 제외됩니다.</li>
                    <li>이동 가능한 이전 경로만 BreadcrumbLink로 제공하고 현재 페이지는 링크로 만들지 않습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bc-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="bc-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        각 wrapper는 대응하는 ui primitive의 네이티브 Props를 그대로 전달합니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Breadcrumb 구성요소 Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Component
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Type
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Default
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(({component, name, type, defaultValue, description, rowSpan}) => (
                                <tr key={`${component}-${name}`} className="border-border border-b last:border-b-0">
                                    {rowSpan ||
                                    PROPS_ITEMS.filter((item) => item.component === component).length === 1 ? (
                                        <th
                                            scope="rowgroup"
                                            rowSpan={rowSpan}
                                            className="typo-body-l-medium border-border text-primary border-r px-4 py-3 text-left align-top font-mono"
                                        >
                                            {component}
                                        </th>
                                    ) : null}
                                    <th
                                        scope="row"
                                        className="typo-body-l-regular px-4 py-3 text-left font-mono font-normal"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                        {type}
                                    </td>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                        {description}
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

export default BreadcrumbGuidePage
