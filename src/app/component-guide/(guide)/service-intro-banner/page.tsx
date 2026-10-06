// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import {ServiceIntroBanner} from '@/components/composite/service-intro-banner'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '서비스 소개 띠 (ServiceIntroBanner)'}

const USAGE_CODE = `import {ServiceIntroBanner} from '@/components/composite/service-intro-banner'

<ServiceIntroBanner
  eyebrow="KPAS (KIBO PATENT APPRAISAL SYSTEM)"
  title="특허등급, 이제 쉽고 편리하게 확인하세요!"
  descriptions={[
    '온라인 특허평가시스템(K-PAS)은 쉽고 빠른 특허평가 서비스를 제공합니다.',
    '특허출원번호 또는 특허등록번호를 입력 후 찾고자 하는 특허결과를 검색합니다.',
  ]}
  illustration={
    <Image src="/images/service-intro/robot-donut-chart.webp" alt="" width={1338} height={726} sizes="440px" className="h-auto w-full" />
  }
/>`

const LAYOUT_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'layout', header: '배치', align: 'start', wrap: true},
] as const

const LAYOUT_ROWS = [
    {key: 'lg', cells: ['1024px 이상', '글은 왼쪽, 그림은 오른쪽에 나란히 놓입니다.']},
    {key: 'base', cells: ['1024px 미만', '그림이 글 아래 가운데로 내려갑니다.']},
]

const PROPS_ITEMS = [
    ['ServiceIntroBanner', 'title', '소개 제목입니다. 필수입니다.', '-', 'string'],
    ['ServiceIntroBanner', 'eyebrow', '제목 위 한 줄입니다. 서비스 약칭처럼 짧은 말에 씁니다.', '-', 'string'],
    [
        'ServiceIntroBanner',
        'descriptions',
        '설명입니다. 배열의 항목 하나가 한 문단(p)이 됩니다.',
        '-',
        'readonly string[]',
    ],
    [
        'ServiceIntroBanner',
        'illustration',
        '그림입니다. 최대 폭 440px 안에서 줄어듭니다. next/image 에 width·height 를 주어 넘깁니다.',
        '-',
        'ReactNode',
    ],
    ['ServiceIntroBanner', 'action', '설명 아래 24px 띄워 놓이는 버튼 등 액션입니다.', '-', 'ReactNode'],
    ['ServiceIntroBanner', 'headingLevel', '제목의 헤딩 레벨입니다. 2 는 h2, 3 은 h3 입니다.', '2', '2 | 3'],
    ['ServiceIntroBanner', 'className', '바깥 section 에 클래스를 추가합니다.', '-', 'string'],
] as const

const ServiceIntroBannerGuidePage = () => (
    <GuidePageShell
        title="서비스 소개 띠 (ServiceIntroBanner)"
        description="화면 제목 아래에서 서비스를 소개하는 영역입니다. 분류어·제목·설명과 일러스트로 구성됩니다."
    >
        <BaseCard>
            <section aria-labelledby="sib-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sib-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>title</code>은 필수이고 나머지는 넘긴 것만 표시됩니다. 배경색이 없으므로 화면 배경 위에
                        그대로 둡니다.
                    </p>
                </div>
                <ServiceIntroBanner
                    eyebrow="KPAS (KIBO PATENT APPRAISAL SYSTEM)"
                    title="특허등급, 이제 쉽고 편리하게 확인하세요!"
                    descriptions={[
                        '온라인 특허평가시스템(K-PAS)은 쉽고 빠른 특허평가 서비스를 제공합니다.',
                        '특허출원번호 또는 특허등록번호를 입력 후 찾고자 하는 특허결과를 검색합니다.',
                    ]}
                    illustration={
                        <Image
                            src="/images/service-intro/robot-donut-chart.webp"
                            alt=""
                            loading="eager"
                            width={1338}
                            height={726}
                            sizes="440px"
                            className="h-auto w-full"
                        />
                    }
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">화면 폭별 배치</h3>
                        <Table
                            caption="화면 폭별 글과 그림의 배치"
                            columns={LAYOUT_COLUMNS}
                            rows={LAYOUT_ROWS}
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sib-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sib-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그림 숨김은 컴포넌트가 처리합니다. 제목 레벨만 사용처가 맞춥니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림 영역에는 <code>aria-hidden</code>이 적용되어 보조기기가 읽지 않습니다[5.1.1]. 정보를 담은
                        그림은 넣지 않고, 그림의 <code>alt</code> 는 빈 문자열로 둡니다.
                    </li>
                    <li>
                        제목은 기본 <code>h2</code>로 렌더링됩니다. 사용처는 화면의 헤딩 순서에 맞춰{' '}
                        <code>headingLevel</code>을 고릅니다[6.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sib-props" className="flex flex-col gap-6">
                <h2 id="sib-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ServiceIntroBanner Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ServiceIntroBannerGuidePage
