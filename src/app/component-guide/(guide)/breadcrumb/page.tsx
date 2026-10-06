// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

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
import {Table} from '@/components/custom/table'
import {breadcrumbPillClassName} from '@/components/theme/breadcrumb.variants'

export const metadata: Metadata = {title: '브레드크럼 (Breadcrumb)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const USAGE_CODE = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'

<PageTitleBar
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

const STANDALONE_CODE = `import {breadcrumbPillClassName} from '@/components/theme/breadcrumb.variants'

<div className={breadcrumbPillClassName}>
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

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    ['Breadcrumb', '전체를 감싸는 nav 입니다.'],
    ['BreadcrumbList', '경로 항목과 구분자를 순서대로 담는 ol 입니다.'],
    ['BreadcrumbItem', '링크 또는 현재 위치 하나를 감싸는 li 입니다.'],
    [
        'BreadcrumbLink',
        '이동할 수 있는 상위 경로입니다. href="/" 이면 전역 Header·Sidebar 가 홈 링크를 이미 제공하므로 링크 없이 텍스트로 렌더링됩니다.',
    ],
    ['BreadcrumbPage', '마지막 항목(현재 위치)입니다. 굵은 글자로 표시되고 링크가 아닙니다.'],
    ['BreadcrumbDotSeparator', '항목 사이에 넣는 점 구분자입니다.'],
    ['BreadcrumbSeparator · BreadcrumbEllipsis', 'composite 가 함께 내보내지만 표준 구성에서는 쓰지 않습니다.'],
] as const

const PROPS_ITEMS = [
    [
        'Breadcrumb',
        'nav 속성',
        'className · aria-* 등 nav 속성을 전달합니다.',
        'aria-label="breadcrumb"',
        "ComponentProps<'nav'>",
    ],
    ['BreadcrumbList', 'ol 속성', 'className 등 ol 속성을 전달합니다.', '-', "ComponentProps<'ol'>"],
    ['BreadcrumbItem', 'li 속성', 'className 등 li 속성을 전달합니다.', '-', "ComponentProps<'li'>"],
    ['BreadcrumbLink', 'href', '이동할 경로입니다. "/" 이면 링크를 만들지 않습니다.', '-', 'string'],
    ['BreadcrumbLink', 'asChild', 'Next Link 등 자식 요소를 링크로 씁니다.', 'undefined', 'boolean'],
    ['BreadcrumbLink', 'a 속성', 'target · className 등 a 속성을 전달합니다.', '-', "ComponentProps<'a'>"],
    [
        'BreadcrumbPage',
        'span 속성',
        'className 등 span 속성을 전달합니다.',
        'aria-current="page"',
        "ComponentProps<'span'>",
    ],
    [
        'BreadcrumbDotSeparator',
        'li 속성',
        '구분자 li 에 속성을 전달합니다.',
        'aria-hidden="true"',
        "ComponentProps<'li'>",
    ],
] as const

const BreadcrumbGuidePage = () => (
    <GuidePageShell
        title="브레드크럼 (Breadcrumb)"
        description="현재 위치와 상위 경로를 최대 3뎁스로 보여주는 위치 내비게이션입니다."
    >
        <BaseCard>
            <section aria-labelledby="breadcrumb-preview" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="breadcrumb-preview" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        보통 <code>PageTitleBar</code> 의 <code>breadcrumb</code> 에 넘깁니다. 상위 경로는{' '}
                        <code>BreadcrumbLink</code>, 마지막 항목은 <code>BreadcrumbPage</code> 로 넣습니다.
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
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">2뎁스</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            경로는 2뎁스 또는 3뎁스로 구성합니다. 4뎁스 이상은 줄임 표시 대신 항목을 3개 이내로
                            정리합니다.
                        </p>
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
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">단독 배치</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>PageTitleBar</code> 밖에 둘 때만 <code>breadcrumbPillClassName</code> 으로 직접
                            감쌉니다.
                        </p>
                        <CodeBlock code={STANDALONE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="breadcrumb-composition" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="breadcrumb-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        첫 항목은 홈, 중간 항목은 이동할 수 있는 상위 경로, 마지막 항목은 현재 위치입니다. 항목 사이에는
                        점 구분자만 넣고 현재 위치 뒤에는 아이콘을 붙이지 않습니다.
                    </p>
                </div>
                <Table
                    caption="브레드크럼 구성 요소 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION.map(([name, description]) => ({
                        key: name,
                        cells: [<code key="name">{name}</code>, description],
                    }))}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="breadcrumb-accessibility" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="breadcrumb-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        구조와 상태 속성은 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>nav</code>(<code>aria-label=&quot;breadcrumb&quot;</code>) 안의 <code>ol</code> 로
                        렌더링되어 위치 안내 랜드마크가 됩니다[6.4.2].
                    </li>
                    <li>
                        현재 위치에 <code>aria-current=&quot;page&quot;</code> 가 붙고, 구분자는{' '}
                        <code>aria-hidden</code> 이라 스크린리더가 읽지 않습니다[8.2.1].
                    </li>
                    <li>
                        링크 텍스트는 이동할 화면의 이름(&quot;기술평가&quot;)을 그대로 씁니다[6.4.3]. 현재 위치는 굵은
                        글자로도 구분해 색에만 의존하지 않습니다[5.3.1].
                    </li>
                    <li>마지막 항목은 링크로 만들지 않고, 링크의 포커스 표시를 지우지 않습니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="breadcrumb-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="breadcrumb-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모든 컴포넌트는 해당 HTML 요소의 속성을 그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Breadcrumb 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BreadcrumbGuidePage
