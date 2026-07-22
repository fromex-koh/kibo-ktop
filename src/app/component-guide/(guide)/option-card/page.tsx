import type {Metadata} from 'next'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import {OptionCard} from '@/components/composite/option-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '옵션 카드 (OptionCard)'}

// 데모 일러스트 경로 규약 — public/images/option-card/<모형>.webp (Figma 이미지영역 148×100). 이 경로에
// Figma 에서 export 한 3D 일러스트를 넣으면 바로 표시된다(파일 배치 전에는 빈 이미지로 보인다).
const OPTION_ILLUSTRATIONS = {
    ktrsFm: '/images/option-card/ktrs-fm.webp',
    startupTechIndex: '/images/option-card/startup-tech-index.webp',
    growthIndex: '/images/option-card/growth-index.webp',
    investment: '/images/option-card/investment.webp',
} as const

// 실제 사용처는 next/image 로 일러스트를 넘긴다([NA-005]). 제목이 정보를 전달하므로 일러스트는 장식이다 → alt=""([5.1.1]).
const DemoIllustration = ({src, loading = 'lazy'}: {src: string; loading?: 'eager' | 'lazy'}) => (
    <Image src={src} alt="" width={148} height={100} loading={loading} style={{width: 148, height: 100}} />
)

const USAGE_CODE = `<OptionCard
  href="/evaluation/ktrs-fm"
  badge="기술평가"
  title="KTRS-FM 평가"
  subtitle="표준 기술금융 모형"
  description="기술사업화 역량 및 재무적 안정성을 종합적으로 평가하는 표준 기술금융 모형입니다."
  illustration={<Image src={ktrsIllust} alt="" width={148} height={100} />}
/>`

const LIST_CODE = `{/* 여러 선택지를 그리드로 나열 — 카드는 h-full 이라 높이가 균일하게 맞춰진다 */}
<div className="grid gap-4 md:grid-cols-2">
  <OptionCard href="/evaluation/ktrs-fm" badge="기술평가" title="KTRS-FM 평가" subtitle="표준 기술금융 모형"
    description="..." illustration={<Image src={ktrsIllust} alt="" width={148} height={100} />} />
  <OptionCard href="/evaluation/tech-index" badge="혁신평가" title="창업용 Tech-Index" subtitle="창업기업용"
    description="..." illustration={<Image src={techIllust} alt="" width={148} height={100} />} />
  {/* … */}
</div>`

const MINIMAL_CODE = `{/* 배지·부제·일러스트를 생략하면 제목 + 설명 + 화살표만 */}
<OptionCard
  href="/evaluation/basic"
  title="기본 평가"
  description="표준 항목만으로 간단히 평가합니다."
/>`

const CUSTOM_BADGE_CODE = `{/* badge 에 Badge 엘리먼트를 넘기면 색·모양을 바꿀 수 있다 */}
<OptionCard
  href="/evaluation/new"
  badge={<Badge variant="solid" color="secondary-grape" shape="pill" size="sm">신규</Badge>}
  title="투자 모형"
  subtitle="투자 특화 모형"
  description="투자 적합성 및 사업화 가능성을 중점으로 분석하는 투자 특화 평가 모형입니다."
/>`

const PROPS_ITEMS = [
    ['OptionCard', 'href', '카드 전체가 이동하는 링크 경로입니다.', '-', 'string'],
    ['OptionCard', 'title', '카드 제목(굵은 강조 텍스트)입니다.', '-', 'ReactNode'],
    [
        'OptionCard',
        'badge',
        '상단 배지입니다. 문자열은 기본 배지(solid·info·pill)로, ReactNode는 전달한 형태로 표시합니다.',
        'undefined',
        'ReactNode',
    ],
    ['OptionCard', 'subtitle', '제목 아래 부제입니다.', 'undefined', 'ReactNode'],
    ['OptionCard', 'description', '설명 본문입니다.', 'undefined', 'ReactNode'],
    [
        'OptionCard',
        'illustration',
        '우측 일러스트/아이콘 슬롯입니다. 장식이면 aria-hidden/alt="" 로 넘깁니다.',
        'undefined',
        'ReactNode',
    ],
    ['OptionCard', 'className · Link props', '카드 스타일과 next/link 속성을 전달합니다.', 'undefined', 'LinkProps'],
] as const

const OptionCardGuidePage = () => (
    <GuidePageShell
        title="옵션 카드 (OptionCard)"
        description="여러 선택지(평가 모형 등) 중 하나로 진입하는 링크 카드입니다. [상단 배지 · 제목 · 부제 · 우측 일러스트 · 설명 · 진입 화살표] 구조이고, hover·포커스 시 파란 테두리·배경으로 강조됩니다. 카드 전체가 링크라 어디를 눌러도 이동합니다."
    >
        <BaseCard>
            <section aria-labelledby="oc-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="oc-basic" className="typo-h4-bold">
                        기본
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        배지 · 제목 · 부제 · 일러스트 · 설명 · 진입 화살표. 마우스를 올리거나 키보드로 포커스하면 파란
                        테두리·배경과 원형 화살표 버튼으로 강조됩니다. 일러스트는 실제 사용처에서{' '}
                        <code className="font-mono">next/image</code> 로 넘깁니다.
                    </p>
                </div>
                <OptionCard
                    href="#oc-props"
                    badge="기술평가"
                    title="KTRS-FM 평가"
                    subtitle="표준 기술금융 모형"
                    description="기술사업화 역량 및 재무적 안정성을 종합적으로 평가하는 표준 기술금융 모형입니다. 기업의 기술력, 사업성, 경영능력을 정량·정성 지표로 분석합니다."
                    illustration={<DemoIllustration src={OPTION_ILLUSTRATIONS.ktrsFm} />}
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="oc-list" className="flex flex-col gap-4">
                <div>
                    <h2 id="oc-list" className="typo-h4-bold">
                        선택지 목록
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        여러 모형을 그리드로 나열합니다. 카드는 <code className="font-mono">h-full</code> 이라 설명
                        길이가 달라도 높이가 균일하게 맞춰지고, 화살표는 항상 우하단에 고정됩니다.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <OptionCard
                        href="#oc-props"
                        badge="기술평가"
                        title="KTRS-FM 평가"
                        subtitle="표준 기술금융 모형"
                        description="기술사업화 역량 및 재무적 안정성을 종합적으로 평가하는 표준 기술금융 모형입니다."
                        illustration={<DemoIllustration src={OPTION_ILLUSTRATIONS.ktrsFm} loading="eager" />}
                    />
                    <OptionCard
                        href="#oc-props"
                        badge="혁신평가"
                        title="창업용 Tech-Index"
                        subtitle="창업기업용"
                        description="창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다. 보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다."
                        illustration={<DemoIllustration src={OPTION_ILLUSTRATIONS.startupTechIndex} />}
                    />
                    <OptionCard
                        href="#oc-props"
                        badge="혁신평가"
                        title="혁신성장지수 평가"
                        subtitle="Tech-Index"
                        description="일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다."
                        illustration={<DemoIllustration src={OPTION_ILLUSTRATIONS.growthIndex} />}
                    />
                    <OptionCard
                        href="#oc-props"
                        badge="투자평가"
                        title="투자 모형"
                        subtitle="투자 특화 모형"
                        description="투자 적합성 및 사업화 가능성을 중점으로 분석하는 투자 특화 평가 모형입니다."
                        illustration={<DemoIllustration src={OPTION_ILLUSTRATIONS.investment} />}
                    />
                </div>
                <CodeBlock code={LIST_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="oc-minimal" className="flex flex-col gap-4">
                <div>
                    <h2 id="oc-minimal" className="typo-h4-bold">
                        최소 구성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">badge</code> · <code className="font-mono">subtitle</code> ·{' '}
                        <code className="font-mono">illustration</code> 을 생략하면 제목 + 설명 + 화살표만 표시됩니다.
                    </p>
                </div>
                <OptionCard href="#oc-props" title="기본 평가" description="표준 항목만으로 간단히 평가합니다." />
                <CodeBlock code={MINIMAL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="oc-custom-badge" className="flex flex-col gap-4">
                <div>
                    <h2 id="oc-custom-badge" className="typo-h4-bold">
                        커스텀 배지
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">badge</code> 에 <code className="font-mono">Badge</code> 엘리먼트를
                        직접 넘기면 색·모양을 바꿀 수 있습니다.
                    </p>
                </div>
                <OptionCard
                    href="#oc-props"
                    badge={
                        <Badge variant="solid" color="secondary-grape" shape="pill" size="sm">
                            신규
                        </Badge>
                    }
                    title="투자 모형"
                    subtitle="투자 특화 모형"
                    description="투자 적합성 및 사업화 가능성을 중점으로 분석하는 투자 특화 평가 모형입니다."
                    illustration={<DemoIllustration src={OPTION_ILLUSTRATIONS.investment} />}
                />
                <CodeBlock code={CUSTOM_BADGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section id="oc-props" aria-labelledby="oc-props-title" className="flex flex-col gap-4">
                <div>
                    <h2 id="oc-props-title" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">OptionCard 에 넘기는 속성입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="OptionCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OptionCardGuidePage
