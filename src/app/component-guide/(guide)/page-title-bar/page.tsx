import type {Metadata} from 'next'
import {ChevronDownIcon} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {Badge} from '@/components/kit/badge'
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage} from '@/components/kit/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'

export const metadata: Metadata = {title: '페이지 타이틀 바 (PageTitleBar)'}

const USAGE_CODE = `<PageTitleBar
  title="자가진단"
  badge={
    <Badge variant="outline" color="navy" shape="round" size="lg">
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
          <ChevronDownIcon aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
/>`

const PROPS_ITEMS = [
    ['title', '페이지 제목. 최상단 제목이라 h1 로 렌더됩니다.', 'ReactNode'],
    ['badge', '제목 옆 분류 배지 슬롯(<Badge> 조합, 선택).', 'ReactNode'],
    ['breadcrumb', '우측 위치 표시 슬롯(<Breadcrumb> 조합). bg-surface 알약 컨테이너로 감싸 렌더(선택).', 'ReactNode'],
    ['className', '추가 클래스명으로 스타일 확장.', 'string'],
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
                <ChevronDownIcon aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
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
                        <Badge variant="outline" color="navy" shape="round" size="lg">
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
                            <Badge variant="outline" color="navy" shape="round" size="lg">
                                KTRS-FM 평가
                            </Badge>
                        }
                        breadcrumb={<DemoBreadcrumb />}
                    />
                    <PageTitleBar title="마이 페이지" breadcrumb={<DemoBreadcrumb />} />
                </div>
            </div>
        </section>

        <section aria-labelledby="ptb-props" className="flex flex-col gap-4">
            <div>
                <h2 id="ptb-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">PageTitleBar 에 넘기는 속성입니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {PROPS_ITEMS.map(([name, desc, type]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">
                            {name}
                            <span className="text-muted-foreground ml-2 font-normal">{type}</span>
                        </dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default PageTitleBarGuidePage
