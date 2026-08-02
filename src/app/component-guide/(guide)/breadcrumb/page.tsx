import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {breadcrumbPillClassName} from '@/components/theme/breadcrumb.variants'

export const metadata: Metadata = {title: '브레드크럼 (Breadcrumb)'}

const USAGE_CODE = `<PageTitleBar
  title="신속표준모형"
  breadcrumb={
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbDotSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/component-guide/self-diagnosis/evaluation-model">
            기술평가
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbDotSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>KTRS-FM</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
/>`

const STANDALONE_CODE = `<div className={breadcrumbPillClassName}>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">홈</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbDotSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>기술평가</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</div>`

const COMPOSITION = [
    ['Breadcrumb', 'nav[aria-label="breadcrumb"]로 렌더링되는 위치 내비게이션입니다.'],
    ['BreadcrumbList', '경로 항목과 구분자를 순서대로 담는 ol 요소입니다.'],
    ['BreadcrumbItem', '링크 또는 현재 위치 하나를 감싸는 li 요소입니다.'],
    ['BreadcrumbLink', '이동 가능한 상위 경로입니다. href 또는 asChild를 사용할 수 있습니다.'],
    ['BreadcrumbPage', '이동하지 않는 마지막 항목이며 aria-current="page"가 적용됩니다.'],
    ['BreadcrumbDotSeparator', '프로젝트 표준 4px 점 구분자이며 접근성 트리에서는 제외됩니다.'],
] as const

const PROPS_ITEMS = [
    [
        'Breadcrumb',
        'nav props',
        'className과 aria-* 등 nav 속성을 전달합니다.',
        'aria-label="breadcrumb"',
        "ComponentProps<'nav'>",
    ],
    [
        'BreadcrumbList',
        'ol props',
        '목록의 className과 네이티브 ol 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'ol'>",
    ],
    [
        'BreadcrumbItem',
        'li props',
        '경로 항목의 className과 네이티브 li 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'li'>",
    ],
    ['BreadcrumbLink', 'asChild', 'Next Link 등 자식 링크에 속성과 스타일을 합성합니다.', 'false', 'boolean'],
    [
        'BreadcrumbLink',
        'anchor props',
        'href, target과 className 등 링크 속성을 전달합니다.',
        'undefined',
        'AnchorHTMLAttributes',
    ],
    [
        'BreadcrumbPage',
        'span props',
        '현재 위치에 필요한 span 속성을 전달합니다.',
        'aria-current="page"',
        "ComponentProps<'span'>",
    ],
    [
        'BreadcrumbDotSeparator',
        'separator props',
        '점 모양은 유지하면서 Separator의 className 등 li 속성을 전달합니다.',
        '4px dot',
        'ComponentProps<typeof BreadcrumbSeparator>',
    ],
] as const

const BreadcrumbGuidePage = () => (
    <GuidePageShell
        title="브레드크럼 (Breadcrumb)"
        description="현재 위치와 상위 경로를 최대 3뎁스로 보여주는 위치 내비게이션입니다."
    >
        <BaseCard>
            <section aria-labelledby="breadcrumb-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="breadcrumb-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        자가진단 입력 화면에서 사용하는 3뎁스 구성입니다. 상위 경로는 링크이며 마지막 항목은 현재 탐색
                        맥락을 나타냅니다.
                    </p>
                </div>
                <div>
                    <div className={breadcrumbPillClassName}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/component-guide/self-diagnosis/evaluation-model">
                                        기술평가
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>KTRS-FM</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="breadcrumb-depth" className="flex flex-col gap-4">
                <div>
                    <h2 id="breadcrumb-depth" className="typo-h4-bold">
                        Depth
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                        <li>경로는 2뎁스 또는 3뎁스로 구성하고 4뎁스 이상은 만들지 않습니다.</li>
                        <li>첫 항목은 홈, 중간 항목은 이동 가능한 서비스 경로, 마지막 항목은 현재 맥락입니다.</li>
                        <li>
                            경로를 줄이는 ellipsis는 사용하지 않으며 화면 IA에 맞춰 항목 자체를 3개 이내로 정리합니다.
                        </li>
                        <li>
                            항목 사이에는 BreadcrumbDotSeparator만 사용하고 현재 위치 뒤에는 아이콘을 붙이지 않습니다.
                        </li>
                    </ul>
                </div>
                <div>
                    <div className={breadcrumbPillClassName}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>기술평가</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="breadcrumb-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="breadcrumb-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        PageTitleBar의 breadcrumb 슬롯을 사용하면 알약 컨테이너가 자동으로 적용됩니다. 단독 배치할 때만
                        breadcrumbPillClassName으로 감쌉니다.
                    </p>
                </div>
                <dl className="border-border divide-border divide-y rounded-md border">
                    {COMPOSITION.map(([name, description]) => (
                        <div key={name} className="grid gap-1 p-4 md:grid-cols-[--spacing(60)_1fr] md:gap-4">
                            <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                            <dd className="typo-body-l-regular text-muted-foreground">{description}</dd>
                        </div>
                    ))}
                </dl>
                <CodeBlock code={STANDALONE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="breadcrumb-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="breadcrumb-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        프로젝트 wrapper는 대응하는 primitive와 네이티브 HTML 속성을 그대로 전달합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Breadcrumb 컴포넌트 Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="breadcrumb-accessibility" className="flex flex-col gap-3">
                <h2 id="breadcrumb-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                    <li>Breadcrumb는 이름이 있는 nav, BreadcrumbList는 순서가 있는 ol로 렌더링됩니다.</li>
                    <li>이동할 수 있는 상위 경로만 BreadcrumbLink로 제공하고 마지막 항목은 링크로 만들지 않습니다.</li>
                    <li>
                        현재 위치는 굵은 글자뿐 아니라 <code className="font-mono">aria-current=&quot;page&quot;</code>
                        로도 전달됩니다.
                    </li>
                    <li>점 구분자는 장식이므로 스크린리더에서 읽히지 않습니다.</li>
                    <li>링크의 기본 키보드 포커스 표시를 제거하지 않습니다.</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BreadcrumbGuidePage
