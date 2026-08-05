import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import FullPageNotFound from '@/components/custom/full-page-not-found'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

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

// 퍼블리싱 인덱스 미리보기 또는 실제 fallback 화면에서 사용합니다.
<FullPageNotFound />
<FullPageServerError />
<FullPageMaintenance />`

const PANEL_USAGE_CODE = `const MaintenancePeriodPanel = () => (
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
    [
        'FullPageServiceStatus',
        'titleId',
        'section의 aria-labelledby와 제목에 함께 사용하는 식별자입니다. 페이지마다 고유한 값을 전달합니다.',
        '-',
        'string',
    ],
    ['FullPageServiceStatus', 'title', '화면의 주요 상태 제목입니다.', '-', 'string'],
    [
        'FullPageServiceStatus',
        'description',
        '상태 안내문입니다. ReactNode를 사용해 문장별 줄바꿈이나 강조 요소를 구성할 수 있습니다.',
        '-',
        'ReactNode',
    ],
    [
        'FullPageServiceStatus',
        'panel',
        '점검 일정·문의처처럼 안내문 아래에 추가할 보조 정보 영역입니다.',
        'undefined',
        'ReactNode',
    ],
] as const

const PreviewFrame = ({children}: {children: React.ReactNode}) => (
    <div className="bg-background border-border h-128 overflow-y-auto rounded-xl border">{children}</div>
)

const FullPageServiceStatusGuidePage = () => (
    <GuidePageShell
        title="전체 화면 서비스 상태 (FullPageServiceStatus)"
        description="Header·Footer 없이 404, 500, 정기점검처럼 서비스 상태를 안내하는 공통 풀페이지 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="full-page-service-status-preview" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="full-page-service-status-preview" className="typo-h4-bold">
                        미리보기
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        공통 레이아웃은 <code className="font-mono">FullPageServiceStatus</code>가 담당하고,
                        404·500·정기점검 화면은 제목과 안내문만 달리하는 preset 컴포넌트로 제공합니다.
                    </p>
                </div>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-presets" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="full-page-service-status-presets" className="typo-h4-bold">
                        상태별 preset
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        화면에서 공통 컴포넌트의 제목·문구를 직접 조합하기보다 상태별 preset을 우선 사용합니다. 실제
                        오류와 점검 전환 시에도 같은 풀페이지 UI를 재사용할 수 있습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="font-mono">FullPageNotFound</code>: 존재하지 않는 경로를 안내합니다.
                    </li>
                    <li>
                        <code className="font-mono">FullPageServerError</code>: 일시적인 서버 오류를 안내합니다.
                    </li>
                    <li>
                        <code className="font-mono">FullPageMaintenance</code>: 점검 일정과 서비스 중단을 안내합니다.
                    </li>
                </ul>
                <CodeBlock code={PRESET_USAGE_CODE} language="tsx" copyLabel="상태별 preset 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-composition" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="full-page-service-status-composition" className="typo-h4-bold">
                        공통 컴포넌트 조합
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        기본 preset으로 표현할 수 없는 상태는 <code className="font-mono">panel</code>을 추가해 일정,
                        문의처 등 보조 정보를 표시합니다. Header·Footer는 이 컴포넌트에 포함하지 않습니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="기본 사용 코드 복사" />
                <CodeBlock code={PANEL_USAGE_CODE} language="tsx" copyLabel="보조 패널 사용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-rules" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="full-page-service-status-rules" className="typo-h4-bold">
                        사용 기준
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>일반 서비스 화면의 Header·Footer가 상속되지 않는 독립 상태 화면에 사용합니다.</li>
                    <li>제목과 의미가 중복되는 일러스트는 장식 이미지로 처리되어 보조기기에 읽히지 않습니다.</li>
                    <li>
                        <code className="font-mono">titleId</code>는 화면마다 고유하게 지정해 제목과{' '}
                        <code className="font-mono">section</code>의 관계를 유지합니다.
                    </li>
                    <li>점검 일정과 문의처는 운영 값으로 교체하며, 현재 컴포넌트의 상수는 목업 값입니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="full-page-service-status-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="full-page-service-status-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        공통 레이아웃은 고정하고 화면별 상태 정보만 props로 전달합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="FullPageServiceStatus Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FullPageServiceStatusGuidePage
