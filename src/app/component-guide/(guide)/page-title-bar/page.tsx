// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
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

const USAGE_CODE = `import {PageTitleBar} from '@/components/composite/page-title-bar'
import {Badge} from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'

<PageTitleBar
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
          <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbDotSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/component-guide/self-diagnosis/evaluation-model">
            자가진단
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbDotSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>제출 완료</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
/>`

const PROPS_ITEMS = [
    ['PageTitleBar', 'title', '페이지 제목입니다(필수). h1 으로 렌더링됩니다.', '-', 'ReactNode'],
    ['PageTitleBar', 'badge', '제목 옆에 붙는 배지 자리입니다. 보통 Badge 를 넣습니다.', 'undefined', 'ReactNode'],
    [
        'PageTitleBar',
        'breadcrumb',
        '알약 컨테이너 안에 놓이는 자리입니다. Breadcrumb 를 넣습니다.',
        'undefined',
        'ReactNode',
    ],
    ['PageTitleBar', 'className', '최상위 header 요소에 덧붙일 클래스입니다.', 'undefined', 'string'],
    [
        'PageTitleBar',
        'header 속성',
        'id · aria-label 등 네이티브 header 속성을 전달합니다(title 제외).',
        '-',
        "Omit<ComponentPropsWithoutRef<'header'>, 'title'>",
    ],
] as const

type DemoBreadcrumbProps = {
    current: string
    parent?: {
        href: string
        label: string
    }
}

const DemoBreadcrumb = ({current, parent}: DemoBreadcrumbProps) => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
            </BreadcrumbItem>
            {parent ? (
                <>
                    <BreadcrumbDotSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={parent.href}>{parent.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                </>
            ) : null}
            <BreadcrumbDotSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
)

const PageTitleBarGuidePage = () => (
    <GuidePageShell
        title="페이지 타이틀 바 (PageTitleBar)"
        description="서비스 페이지 맨 위에 페이지 제목 · 분류 배지 · 브레드크럼을 한 줄로 놓는 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="ptb-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ptb-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">title</code>에 제목을,{' '}
                        <code className="text-foreground font-mono">badge</code>에{' '}
                        <code className="text-foreground font-mono">Badge</code>를,{' '}
                        <code className="text-foreground font-mono">breadcrumb</code>에{' '}
                        <code className="text-foreground font-mono">Breadcrumb</code>를 넘깁니다. 브레드크럼의 알약
                        컨테이너는 자동으로 감싸집니다. 반응형은 <code>md</code>(768) 기준입니다. <code>md</code> 이상은
                        제목과 배지가 왼쪽, 브레드크럼이 오른쪽이고 미만은 배지 · 제목 · 브레드크럼이 세로로 쌓입니다.
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
                        breadcrumb={
                            <DemoBreadcrumb
                                current="제출 완료"
                                parent={{
                                    href: '/component-guide/self-diagnosis/evaluation-model',
                                    label: '자가진단',
                                }}
                            />
                        }
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ptb-compose" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ptb-compose" className="typo-h4-bold">
                        조합 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">badge</code>와{' '}
                        <code className="text-foreground font-mono">breadcrumb</code>는 선택입니다. 넘기지 않으면 그
                        자리는 렌더링되지 않습니다.
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
                            breadcrumb={
                                <DemoBreadcrumb
                                    current="평가 현황"
                                    parent={{
                                        href: '/component-guide/self-diagnosis/evaluation-model',
                                        label: '자가진단',
                                    }}
                                />
                            }
                        />
                        <PageTitleBar title="마이 페이지" breadcrumb={<DemoBreadcrumb current="마이 페이지" />} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ptb-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ptb-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        제목 레벨과 읽는 순서는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>title</code>은 <code>h1</code>으로, 전체는 <code>header</code> 요소로 렌더링됩니다
                        [6.4.2]. 한 페이지에 하나만 두어 <code>h1</code>이 겹치지 않게 합니다.
                    </li>
                    <li>
                        좁은 화면에서 배지가 제목 위에 보여도 DOM 순서는 제목 → 배지라 읽는 순서가 유지됩니다[7.3.1].
                    </li>
                    <li>
                        브레드크럼의 접근성(<code>nav</code> 이름 · 현재 페이지 표시)은 Breadcrumb 컴포넌트가
                        처리합니다. 배지에는 색만으로 뜻을 전하지 않도록 글자를 넣습니다[5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ptb-props" className="flex flex-col gap-6">
                <h2 id="ptb-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="PageTitleBar Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PageTitleBarGuidePage
