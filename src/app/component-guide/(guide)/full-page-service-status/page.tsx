// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import FullPageNotFound from '@/components/custom/full-page-not-found'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import LayoutChoiceTable from '../sub-page-layout/layout-choice-table'

export const metadata: Metadata = {title: '전체 화면 서비스 상태 (FullPageServiceStatus)'}

const USAGE_CODE = `import FullPageServiceStatus from '@/components/custom/full-page-service-status'

<FullPageServiceStatus
  titleId="service-status-title"
  title="서비스 상태 안내"
  description={
    <>
      서비스 상태에 맞는 안내 문구를 작성합니다.
      <span className="xl:block">화면 너비에 따라 필요한 줄바꿈을 지정할 수 있습니다.</span>
    </>
  }
/>`

const PRESET_USAGE_CODE = `import FullPageMaintenance from '@/components/custom/full-page-maintenance'
import FullPageNotFound from '@/components/custom/full-page-not-found'
import FullPageServerError from '@/components/custom/full-page-server-error'

<FullPageNotFound />
<FullPageServerError />
<FullPageMaintenance />`

const PANEL_USAGE_CODE = `import FullPageServiceStatus from '@/components/custom/full-page-service-status'

const MaintenancePeriodPanel = () => (
  <div>
    <h2>서비스 점검 기간</h2>
    <p>점검 일정과 문의처를 표시합니다.</p>
  </div>
)

<FullPageServiceStatus
  titleId="maintenance-title"
  title="서비스 점검 안내"
  description="점검 중임을 안내하는 문구입니다."
  panel={<MaintenancePeriodPanel />}
/>`

const PROPS_ITEMS = [
    ['FullPageServiceStatus', 'titleId', '제목의 id 입니다(필수). 화면마다 고유한 값을 넘깁니다.', '-', 'string'],
    ['FullPageServiceStatus', 'title', '상태 제목입니다(필수). h1 로 그립니다.', '-', 'string'],
    [
        'FullPageServiceStatus',
        'description',
        '안내문입니다(필수). span 으로 문장별 줄바꿈을 지정할 수 있습니다.',
        '-',
        'ReactNode',
    ],
    ['FullPageServiceStatus', 'panel', '안내문 아래에 둘 점검 일정 · 문의처 같은 보조 영역입니다.', '-', 'ReactNode'],
] as const

const PRESET_COLUMNS = [
    {key: 'name', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'desc', header: '사용 상황', align: 'start', wrap: true},
] as const

const PRESETS = [
    {name: 'FullPageNotFound', desc: '404. 없는 경로를 안내합니다.'},
    {name: 'FullPageServerError', desc: '500. 일시적인 서버 오류를 안내합니다.'},
    {name: 'FullPageMaintenance', desc: '정기점검. 점검 기간과 문의처 패널을 함께 보여 줍니다.'},
] as const

const PreviewFrame = ({children}: {children: React.ReactNode}) => (
    <div className="bg-background border-border h-128 overflow-y-auto rounded-xl border">{children}</div>
)

const FullPageServiceStatusGuidePage = () => (
    <GuidePageShell
        title="전체 화면 서비스 상태 (FullPageServiceStatus)"
        description="404 · 500 · 정기점검처럼 Header · Footer 없이 서비스 상태를 안내하는 독립 풀페이지 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="full-page-service-status-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="full-page-service-status-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        404 · 500 · 정기점검은 상태별 컴포넌트를 props 없이 그대로 씁니다. 각 파일에서 default 로
                        가져옵니다.
                    </p>
                </div>
                <Table
                    caption="상태별 풀페이지 컴포넌트 목록"
                    columns={PRESET_COLUMNS}
                    rows={PRESETS.map((row) => ({
                        key: row.name,
                        cells: [<code key="name">{row.name}</code>, row.desc],
                    }))}
                    size="md"
                />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <PreviewFrame>
                        <FullPageNotFound />
                    </PreviewFrame>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <Link
                            href="/corp/not-found"
                            className="text-primary focus-visible:ring-ring rounded-xs underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                        >
                            404 화면 확인
                        </Link>
                        <Link
                            href="/corp/server-error"
                            className="text-primary focus-visible:ring-ring rounded-xs underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                        >
                            500 화면 확인
                        </Link>
                        <Link
                            href="/corp/maintenance"
                            className="text-primary focus-visible:ring-ring rounded-xs underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                        >
                            정기점검 화면 확인
                        </Link>
                    </div>
                </div>
                <CodeBlock code={PRESET_USAGE_CODE} language="tsx" copyLabel="상태별 컴포넌트 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-custom" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="full-page-service-status-custom" className="typo-h4-bold">
                        직접 구성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        위 세 가지로 표현할 수 없는 상태는{' '}
                        <code className="text-foreground font-mono">FullPageServiceStatus</code>에 제목과 안내문을 넘겨
                        만듭니다. 일러스트와 [홈으로] 버튼은 항상 함께 나옵니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목과 안내문</h3>
                        <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="기본 사용 코드 복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">보조 패널</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code className="text-foreground font-mono">panel</code>은 안내문 아래, [홈으로] 버튼 위에
                            놓입니다.
                        </p>
                        <CodeBlock code={PANEL_USAGE_CODE} language="tsx" copyLabel="보조 패널 사용 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="full-page-service-status-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        Header · Footer 레이아웃이 적용되지 않는 독립 화면에 씁니다. 그 밖의 화면은 아래 레이아웃을
                        고릅니다.
                    </p>
                </div>
                <LayoutChoiceTable />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        컴포넌트가 <code>main</code>과 <code>h1</code>을 그리므로 다른 <code>main</code> 안에 넣지
                        않습니다. 레이아웃 그룹 밖(<code>(service)</code> 밖)에 둡니다.
                    </li>
                    <li>
                        <code>FullPageMaintenance</code>의 점검 기간과 문의처는 컴포넌트 안의 목업 상수이므로 운영
                        값으로 바꿉니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="full-page-service-status-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        랜드마크와 제목은 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>main</code> 안에 <code>h1</code>이 하나 있고 section 이 <code>titleId</code>로 연결됩니다
                        [6.4.2]. 사용처는 <code>titleId</code>가 화면 안의 다른 id 와 겹치지 않게 합니다[8.1.1].
                    </li>
                    <li>
                        일러스트는 <code>alt=&quot;&quot;</code>인 장식 이미지입니다[5.1.1].
                    </li>
                    <li>
                        Header 가 없어 SkipNav 가 필요 없는 구조입니다. 화면 이름은 <code>metadata.title</code>로
                        지정합니다[6.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-props" className="flex flex-col gap-6">
                <h2 id="full-page-service-status-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="FullPageServiceStatus Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FullPageServiceStatusGuidePage
