// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {
    PlatformServiceHero,
    ServiceFeatureList,
    ServiceGlassCard,
    ServiceGlassCardList,
} from '@/components/custom/platform-service-intro'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '서비스 소개 틀 (PlatformServiceIntro)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

// [아이콘 자리] 예시 — 실제 화면은 next/image(alt="")를 넘긴다.
const ImageSlot = () => <span aria-hidden="true" className="size-22 rounded-lg bg-white/50" />
const IconSlot = () => <span aria-hidden="true" className="bg-primary size-10 rounded-sm" />

const DEMO_FEATURES = [
    {icon: <IconSlot />, title: '기능 이름', description: '기능을 한두 줄로 설명합니다. 길면 줄바꿈됩니다.'},
    {icon: <IconSlot />, title: '기능 이름', description: '기능을 한두 줄로 설명합니다. 길면 줄바꿈됩니다.'},
    {icon: <IconSlot />, title: '기능 이름', description: '기능을 한두 줄로 설명합니다. 길면 줄바꿈됩니다.'},
]

const USAGE_CODE = `import {
  PlatformServiceHero,
  ServiceFeatureList,
  ServiceGlassCard,
  ServiceGlassCardList,
} from '@/components/custom/platform-service-intro'

<PlatformServiceHero
  headingId="platform-k-bigx-hero"
  titleBar={<PageTitleBar title="K-BIGx 보고서" breadcrumb={…} />}
  titleLines={['기술과 재무, 혁신 인사이트', 'K-BIGx AI 분석 보고서']}
  lead="AI가 기업의 기술력·재무현황을 통합 분석하여 …"
  descriptionLines={['첫 줄', '둘째 줄']}
  tone="navy" // 탄소중립은 green
>
  <ServiceGlassCardList>
    <ServiceGlassCard index={0} image={<Image src={…} alt="" />} title="…" description="…" />
    <ServiceGlassCard index={2} image={…} title="…" bullets={['점 목록 한 줄', '…']} />
  </ServiceGlassCardList>
</PlatformServiceHero>

<ServiceFeatureList columns={2} items={[{icon: <Image src={…} alt="" className="size-10" />, title: '…', description: '…'}]} />`

const TONE_COLUMNS = [
    {key: 'tone', header: 'tone', align: 'start', rowHeader: true},
    {key: 'band', header: '띠 · 번진 원', align: 'start', wrap: true},
    {key: 'accent', header: '큰 제목 강조색', align: 'start'},
    {key: 'where', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const TONE_ROWS = [
    {
        key: 'navy',
        cells: [
            'navy',
            'service-hero-navy-* — 라이트 navy.100 · 오른쪽 아래 purple.200 · 왼쪽 위 blue.200, 다크 navy.800 띠 · purple.900 · blue.900 원',
            'primary-strong #3568d6',
            'K-BIGx 보고서',
        ],
    },
    {
        key: 'green',
        cells: [
            'green',
            'service-hero-green-* — 라이트 green.100 · warning.50 · mint.100(시안), 다크 success.900 띠 · mint.900 · success.800 원',
            'service-accent-green — 라이트 mint.800 · 다크 mint.200',
            '탄소중립',
        ],
    },
]

const PROPS_ITEMS = [
    ['PlatformServiceHero', 'headingId', '큰 제목(h2)의 id — 띠 section 의 이름(aria-labelledby).', '-', 'string'],
    ['PlatformServiceHero', 'titleBar', '띠 안 맨 위 화면 제목 줄(PageTitleBar).', '-', 'ReactNode'],
    ['PlatformServiceHero', 'titleLines', '큰 제목 줄 — 둘째 줄부터 강조색.', '-', 'readonly string[]'],
    [
        'PlatformServiceHero',
        'lead · descriptionLines',
        '보조(24 Bold) · 설명(20, 태블릿부터 줄마다 끊김).',
        '-',
        'string · string[]',
    ],
    ['PlatformServiceHero', 'tone', '띠 · 번진 원 · 강조색 한 벌.', '-', "'navy' | 'green'"],
    ['PlatformServiceHero', 'children', '설명 아래 칸(카드 목록 · 전환 탭 등) — 설명과 48.', '-', 'ReactNode'],
    ['ServiceGlassCard', 'index', '카드 순서(0~2) — 열 때 차례로 떠오르는 지연.', '-', 'number'],
    ['ServiceGlassCard', 'image', '그림(88 칸) — next/image(alt="") 또는 자리.', '-', 'ReactNode'],
    ['ServiceGlassCard', 'description · bullets', '설명 한 단락 또는 점 목록.', '-', 'string · string[]'],
    ['ServiceFeatureList', 'items', '아이콘 · 제목 · 설명 목록.', '-', '{icon; title; description}[]'],
    ['ServiceFeatureList', 'columns', '태블릿부터 열 수 — 2열은 아이콘이 글 가운데, 3열은 글 위에 맞춤.', '-', '2 | 3'],
    [
        'ServiceFeatureList',
        'iconSurfaceClassName',
        '아이콘 칸 바탕 — 화면 전용 색이 있을 때만 넘깁니다(K-BIGx 소개).',
        "'bg-model-icon-surface'",
        'string',
    ],
] as const

const PlatformServiceIntroGuidePage = () => (
    <GuidePageShell
        title="서비스 소개 틀 (PlatformServiceIntro)"
        description="플랫폼 소개 서비스 화면(K-BIGx 보고서 · 탄소중립)이 함께 쓰는 히어로 띠 · 반투명 카드 · 기능 목록입니다."
    >
        <BaseCard>
            <section aria-labelledby="platform-service-intro-hero" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="platform-service-intro-hero" className="typo-h4-bold">
                        히어로 · 유리 카드 (PlatformServiceHero · ServiceGlassCard)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면 전체 폭 띠에 번진 원 두 개가 천천히 떠다니고(animate-ambient-drift-a · b), 큰 제목은 줄마다
                        칸 아래에서 떠오릅니다. 실제 화면 —{' '}
                        <Link href="/corp/platform/k-bigx-report" className={LINK_CLASS}>
                            K-BIGx 보고서
                        </Link>{' '}
                        ·{' '}
                        <Link href="/corp/platform/carbon-neutrality" className={LINK_CLASS}>
                            탄소중립
                        </Link>
                        .
                    </p>
                </div>
                <div className="overflow-hidden rounded-lg">
                    <PlatformServiceHero
                        headingId="guide-service-hero"
                        titleBar={null}
                        titleLines={['서비스를 한 줄로 말하는 제목', '둘째 줄은 강조색']}
                        lead="보조 문장(24 Bold)이 서비스의 가치를 한 문장으로 전합니다."
                        descriptionLines={['설명(20)은 태블릿부터 줄마다 끊기고,', '모바일은 이어서 흐릅니다.']}
                        tone="green"
                    >
                        <ServiceGlassCardList>
                            <ServiceGlassCard
                                index={0}
                                image={<ImageSlot />}
                                title="카드 제목"
                                description="설명 한 단락(16 Medium)입니다."
                            />
                            <ServiceGlassCard
                                index={1}
                                image={<ImageSlot />}
                                title="카드 제목"
                                description="설명 한 단락(16 Medium)입니다."
                            />
                            <ServiceGlassCard
                                index={2}
                                image={<ImageSlot />}
                                title="점 목록 카드"
                                bullets={['설명 대신 점 목록도 됩니다.', '줄 사이 8.']}
                            />
                        </ServiceGlassCardList>
                    </PlatformServiceHero>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <Table caption="히어로 tone" columns={TONE_COLUMNS} rows={TONE_ROWS} size="md" />
                <ul className={LIST_CLASS}>
                    <li>
                        큰 제목 모바일 32 · 태블릿 48 · PC 60 Black(typo-display-hero-black). 화면 제목과 큰 제목
                        100(모바일 60) · 큰 제목과 보조 32 · 보조와 설명 16 · 설명과 아래 칸 48.
                    </li>
                    <li>
                        유리 카드 — 흰 20% 면 · 테두리 1(service-glass-border: 라이트 흰 90% · 다크 흰색 25%) · 반경
                        32(rounded-glass) · 여백 32 · 그림 88 · 제목 24 Bold · 설명 16 Medium. 뒤 흐림은 두지
                        않습니다(시안) — 번진 원의 움직임이 비쳐 보입니다.
                    </li>
                    <li>모바일은 카드를 세로로 쌓습니다(사이 16). 동작 줄이기면 모든 움직임이 없습니다[6.3.1].</li>
                    <li>
                        카드는 transition-none 입니다 — 탭으로 카드 묶음을 바꿀 때 감춤(invisible)이 등장 시간만큼 늦게
                        적용돼 이전 카드가 남아 보이지 않도록 합니다(탄소중립 플랫폼 전환).
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="platform-service-intro-features" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="platform-service-intro-features" className="typo-h4-bold">
                        기능 목록 (ServiceFeatureList)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아이콘 칸(80 · model-icon-surface · 반경 24) + 제목(24 Bold) · 설명(16 Medium · gray.500).
                        K-BIGx 는 2열, 탄소중립은 3열입니다. 화면에 들어오면 떠오릅니다(ScrollReveal).
                    </p>
                </div>
                <ServiceFeatureList columns={3} items={DEMO_FEATURES} />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="platform-service-intro-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="platform-service-intro-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="서비스 소개 틀 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PlatformServiceIntroGuidePage
