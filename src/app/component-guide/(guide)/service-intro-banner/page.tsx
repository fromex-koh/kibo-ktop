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
    <Image src="/images/service-intro/search-window-grade-badge.webp" alt="" width={1320} height={720} sizes="440px" className="h-auto w-full" />
  }
  hasIllustrationGlow // 그림 뒤 원 — 감싼 화면 틀에 isolate 필요(특허 등급조회는 PatentGradeLookup 이 준다)
/>`

const GLOW_CODE = `// K-BIGx 화면은 KbigxReportFrame 이 isolate 틀 · 제목 · 이 띠(원 켬)를 함께 그린다 — 화면에서는 이것만 쓴다.
<KbigxReportFrame title="기업혁신성장" homeHref="/corp/home" moreHref="/corp/platform/k-bigx-report">
  <InnovationGrowthReportLookup … />
</KbigxReportFrame>

// 다른 화면에서 직접 켤 때 — 화면 틀에 isolate 를 준다(예: 특허 등급조회 PatentGradeLookup). 원이 틀 맨 뒤(-z-10)에 깔려 제목 줄 · 입력 카드를 덮지 않는다.
// 원이 화면 밖으로 퍼지므로 main 에 overflow-x-clip 을 둔다.
<div className="grid-layout isolate pt-10 pb-15 *:col-span-full">
  <ServiceIntroBanner
    title="어떤 기술분야가 궁금하세요?"
    illustration={<Image src="/images/service-intro/ai-robot-donut-chart.webp" alt="" width={1320} height={720} sizes="440px" className="h-auto w-full" />}
    hasIllustrationGlow
  />
  <SelectSearchForm … />
</div>`

const GLOW_COLUMNS = [
    {key: 'item', header: '항목', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start', wrap: true},
] as const

const GLOW_ROWS = [
    {key: 'size', cells: ['1024 이상', '그림 폭의 140% 원(그림 440 → 원 616)을 그림 가운데 뒤에 둡니다.']},
    {
        key: 'mobile',
        cells: [
            '1024 미만',
            '그림을 숨기고 원(320 · 640 이상 520)만 띠 오른쪽 위에 걸쳐 제목 뒤에 겹칩니다. 그림 자리는 흐름에서 빠집니다.',
        ],
    },
    {
        key: 'color',
        cells: [
            '색',
            '가운데 service-intro-glow → 28% service-intro-glow-soft → 72% 투명. 라이트 · 다크 값은 토큰이 나눕니다.',
        ],
    },
    {
        key: 'layer',
        cells: [
            '층',
            '감싼 화면 틀(isolate)의 맨 뒤입니다. 제목 줄 · 탭 · 입력 카드가 원 위에 오고, 원은 클릭을 막지 않습니다.',
        ],
    },
    {
        key: 'where',
        cells: [
            '쓰는 곳',
            'K-BIGx 보고서 소개 띠(기업혁신성장 기업 · 기관, 기관 대량정보조회 탭) · 특허 등급조회 소개 띠(기업 · 기관 조회 · 결과)',
        ],
    },
]

const LAYOUT_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'layout', header: '배치', align: 'start', wrap: true},
] as const

const LAYOUT_ROWS = [
    {key: 'lg', cells: ['1024px 이상', '글은 왼쪽, 그림은 오른쪽에 나란히 놓입니다.']},
    {
        key: 'base',
        cells: [
            '1024px 미만',
            '그림이 글 아래 가운데로 내려갑니다. hasIllustrationGlow 를 주면 그림 대신 원만 오른쪽 위에 남습니다.',
        ],
    },
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
    [
        'ServiceIntroBanner',
        'hasIllustrationGlow',
        '그림 뒤에 원형 그라데이션을 깝니다. 감싼 화면 틀에 isolate 가 있어야 보입니다.',
        'false',
        'boolean',
    ],
    ['ServiceIntroBanner', 'headingLevel', '제목의 헤딩 레벨입니다. 2 는 h2, 3 은 h3 입니다.', '2', '2 | 3'],
    ['ServiceIntroBanner', 'className', '바깥 section 에 클래스를 추가합니다.', '-', 'string'],
] as const

const ServiceIntroBannerGuidePage = () => (
    <GuidePageShell
        title="서비스 소개 띠 (ServiceIntroBanner)"
        description="화면 제목 아래에서 서비스를 소개하는 영역입니다. 분류어·제목·설명과 일러스트로 구성됩니다."
    >
        <BaseCard>
            {/* isolate — 예시 띠의 그림 뒤 원이 제목 · 설명 글 아래에 깔리게 한다(서비스 화면의 화면 틀과 같은 구조). */}
            <section aria-labelledby="sib-usage" className="isolate flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="sib-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>title</code>은 필수이고 나머지는 넘긴 것만 표시됩니다. 배경색이 없으므로 화면 배경 위에
                        그대로 둡니다. 서비스 화면(특허 등급조회 · K-BIGx 보고서)은 모두 그림 뒤 원(
                        <code>hasIllustrationGlow</code>)을 켭니다.
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
                            src="/images/service-intro/search-window-grade-badge.webp"
                            alt=""
                            loading="eager"
                            width={1320}
                            height={720}
                            sizes="440px"
                            className="h-auto w-full"
                        />
                    }
                    hasIllustrationGlow
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
            {/* isolate 는 제목 · 설명까지 감싼다 — 원이 띠 위로 퍼져도 글 아래에 깔린다(실제 화면의 KbigxReportFrame 과 같은 구조). */}
            <section aria-labelledby="sib-glow" className="isolate flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="sib-glow" className="typo-h4-bold">
                        그림 뒤 원형 그라데이션
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>hasIllustrationGlow</code> 를 주면 그림 뒤에 연한 파랑 원이 깔립니다. 감싼 화면 틀에{' '}
                        <code>isolate</code> 를 줘야 원이 바탕 위 · 다른 내용 아래에 놓입니다. K-BIGx 화면은{' '}
                        <code>KbigxReportFrame</code> 이, 특허 등급조회는 <code>PatentGradeLookup</code> 이 이 틀까지
                        함께 그리므로 따로 챙길 것이 없습니다.
                    </p>
                </div>
                <div>
                    <ServiceIntroBanner
                        eyebrow="KIBO-Business Innovation Growth with AI"
                        title="어떤 기술분야가 궁금하세요?"
                        descriptions={['K-BIGx AI가 기술·시장·특허 데이터를 분석해 드립니다.']}
                        hasIllustrationGlow
                        illustration={
                            <Image
                                src="/images/service-intro/ai-robot-donut-chart.webp"
                                alt=""
                                loading="eager"
                                width={1320}
                                height={720}
                                sizes="440px"
                                className="h-auto w-full"
                            />
                        }
                    />
                </div>
                <CodeBlock code={GLOW_CODE} language="tsx" copyLabel="복사" />
                <Table caption="그림 뒤 원형 그라데이션 규칙" columns={GLOW_COLUMNS} rows={GLOW_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sib-accessibility" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
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
                        그림 뒤 원(<code>hasIllustrationGlow</code>)은 꾸밈이라 보조기기가 읽지 않고 클릭도 막지
                        않습니다.
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
