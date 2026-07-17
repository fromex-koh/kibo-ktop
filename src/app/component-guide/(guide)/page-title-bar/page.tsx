import type {Metadata} from 'next'
import {ChevronRightIcon} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {Badge} from '@/components/ui/badge'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'

export const metadata: Metadata = {title: '페이지 타이틀 바 (PageTitleBar)'}

const USAGE_CODE = `<PageTitleBar
  title="자가진단"
  badge={
    <Badge variant="solid" color="navy" shape="round" size="lg">
      KTRS-FM 평가
    </Badge>
  }
  breadcrumb={
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
          <ChevronRightIcon aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
/>`

const STYLE_CODE = `<header
  data-slot="page-title-bar"
  className={cn('flex flex-wrap items-center justify-between gap-4', className)}
  {...props}
>
  <div data-slot="page-title-bar-heading" className="flex items-center gap-4">
    <h1 className="typo-display-xl-bold text-foreground text-balance">{title}</h1>
    {badge}
  </div>
  {breadcrumb ? (
    <div
      data-slot="page-title-bar-nav"
      className="inline-flex items-center rounded-full bg-surface px-10 py-4 shadow-1"
    >
      {breadcrumb}
    </div>
  ) : null}
</header>`

const PROPS_ITEMS = [
    {
        name: 'title',
        type: 'ReactNode',
        defaultValue: '-',
        required: true,
        description: '페이지 제목입니다. 내부 h1 요소의 콘텐츠로 렌더링됩니다.',
    },
    {
        name: 'badge',
        type: 'ReactNode',
        defaultValue: '-',
        required: false,
        description: '제목 오른쪽에 배치할 선택 슬롯입니다. 일반적으로 Badge를 조합합니다.',
    },
    {
        name: 'breadcrumb',
        type: 'ReactNode',
        defaultValue: '-',
        required: false,
        description: '오른쪽 알약 컨테이너에 배치할 선택 슬롯입니다. 일반적으로 Breadcrumb를 조합합니다.',
    },
    {
        name: 'className',
        type: 'string',
        defaultValue: '-',
        required: false,
        description: '최상위 header 요소에 병합할 추가 클래스입니다.',
    },
    {
        name: '...props',
        type: "Omit<ComponentPropsWithoutRef<'header'>, 'title'>",
        defaultValue: '-',
        required: false,
        description: 'title 충돌을 제외한 header 네이티브 속성을 최상위 요소에 전달합니다.',
    },
] as const

const DemoBreadcrumb = () => (
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
                <ChevronRightIcon aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
)

const PageTitleBarGuidePage = () => (
    <GuidePageShell
        title="페이지 타이틀 바 (PageTitleBar)"
        description="페이지 최상단의 가로 스트립입니다. 큰 페이지 제목과 분류 배지를 좌측에, 현재 위치를 알려주는 브레드크럼을 우측에 배치합니다."
    >
        <section aria-labelledby="ptb-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="ptb-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">title</code> 옆에 <code className="font-mono">Badge</code> 를,{' '}
                    <code className="font-mono">breadcrumb</code> 슬롯에 <code className="font-mono">Breadcrumb</code>{' '}
                    를 꽂아 조합합니다. 브레드크럼은 bg-surface + shadow-1 알약 컨테이너로 감싸 렌더됩니다.
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <PageTitleBar
                    title="자가진단"
                    badge={
                        <Badge variant="solid" color="navy" shape="round" size="lg">
                            KTRS-FM 평가
                        </Badge>
                    }
                    breadcrumb={<DemoBreadcrumb />}
                />
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="ptb-compose" className="flex flex-col gap-4">
            <div>
                <h2 id="ptb-compose" className="typo-h4-bold">
                    조합 (Composition)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    슬롯에 넣는 컴포넌트를 바꿔 다양하게 구성합니다. 예: 동일한 <code className="font-mono">Badge</code>{' '}
                    조합 + 배지 없는 페이지.
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <div className="flex flex-col gap-8">
                    <PageTitleBar
                        title="평가 현황"
                        badge={
                            <Badge variant="solid" color="navy" shape="round" size="lg">
                                KTRS-FM 평가
                            </Badge>
                        }
                        breadcrumb={<DemoBreadcrumb />}
                    />
                    <PageTitleBar title="마이 페이지" breadcrumb={<DemoBreadcrumb />} />
                </div>
            </div>
        </section>

        <section aria-labelledby="ptb-style" className="flex flex-col gap-4">
            <div>
                <h2 id="ptb-style" className="typo-h4-bold">
                    스타일
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    최상위 영역은 줄바꿈 가능한 flex 레이아웃이며, 제목은 프로젝트 타이포그래피와 표준 foreground 슬롯을
                    사용합니다. 브레드크럼이 있을 때만 surface·shadow 토큰 기반의 알약 컨테이너를 렌더링합니다.
                </p>
            </div>
            <CodeBlock code={STYLE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="ptb-accessibility" className="flex flex-col gap-4">
            <div>
                <h2 id="ptb-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    페이지 제목과 현재 위치 정보를 문서 구조에 맞게 조합합니다.
                </p>
            </div>
            <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                <li>
                    <code>title</code>은 <code>h1</code>으로 렌더링되므로 페이지의 대표 제목을 전달합니다.
                </li>
                <li>한 페이지에서 PageTitleBar를 여러 개 사용해 h1이 중복되지 않도록 합니다.</li>
                <li>
                    <code>breadcrumb</code> 슬롯에는 현재 위치를 알리는 <code>Breadcrumb</code>를 조합합니다.
                </li>
                <li>
                    장식용 아이콘은 예시처럼 <code>aria-hidden=&quot;true&quot;</code>로 접근성 트리에서 제외합니다.
                </li>
                <li>
                    최상위 요소는 <code>header</code> 네이티브 속성을 전달받으므로 필요한 경우 <code>aria-label</code>
                    이나 <code>id</code>를 지정할 수 있습니다.
                </li>
            </ul>
        </section>

        <section aria-labelledby="ptb-props" className="flex flex-col gap-4">
            <div>
                <h2 id="ptb-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">PageTitleBar 에 넘기는 속성입니다.</p>
            </div>
            <div className="border-border overflow-x-auto rounded-md border">
                <table className="w-full border-collapse text-left">
                    <caption className="sr-only">PageTitleBar Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
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
                        {PROPS_ITEMS.map(({name, type, defaultValue, required, description}) => (
                            <tr key={name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular text-primary px-4 py-3 text-left font-mono font-normal whitespace-nowrap"
                                >
                                    {name}
                                    {required ? (
                                        <>
                                            <span aria-hidden="true" className="text-destructive">
                                                *
                                            </span>
                                            <span className="sr-only"> (필수)</span>
                                        </>
                                    ) : null}
                                </th>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                    {type}
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {defaultValue}
                                </td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default PageTitleBarGuidePage
