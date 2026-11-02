// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChipMarquee} from '@/components/custom/chip-marquee'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {PLATFORM_CARBON_NEUTRALITY} from '@/content/service/platform-carbon-neutrality'

export const metadata: Metadata = {title: '칩 마퀴 (ChipMarquee)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const USAGE_CODE = `import {ChipMarquee} from '@/components/custom/chip-marquee'

// 브라우저 좌우 끝까지 흐르게 하려면 본문 칸(grid-layout) 밖, 화면 전체 폭에 둔다.
<ChipMarquee items={['녹색금융 수혜기업', 'CBAM 대응 기업', …]} label="이런 기업에 적합합니다" className="w-full" />`

const PROPS_ITEMS = [
    ['ChipMarquee', 'items', '칩 글 목록(필수). 링크가 아닌 꾸밈 목록입니다.', '-', 'readonly string[]'],
    ['ChipMarquee', 'label', '흐르는 목록의 이름 — 화면 낭독기에 "(포커스하면 멈춤)"과 함께 읽힙니다.', '-', 'string'],
    ['ChipMarquee', 'className', '바깥 칸 클래스(폭 등).', '-', 'string'],
] as const

const ChipMarqueeGuidePage = () => (
    <GuidePageShell
        title="칩 마퀴 (ChipMarquee)"
        description="칩 줄이 왼쪽으로 끊김 없이 계속 흐릅니다. 마우스 · 터치 · 키보드 포커스가 들어오면 멈춥니다."
    >
        <BaseCard>
            <section aria-labelledby="chip-marquee-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="chip-marquee-usage" className="typo-h4-bold">
                        기본 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/platform/carbon-neutrality" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 탄소중립
                        </Link>{' '}
                        &apos;이런 기업에 적합합니다&apos;(옅은 파랑 띠 · 브라우저 좌우 끝까지).
                    </p>
                </div>
                <div className="bg-service-target-band -mx-6 py-8 md:-mx-8">
                    <ChipMarquee
                        items={PLATFORM_CARBON_NEUTRALITY.target.items}
                        label="미리보기 칩 목록"
                        className="w-full"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <ul className={LIST_CLASS}>
                    <li>
                        끊김 없는 흐름 — 같은 목록을 네 벌 이어 붙이고 한 바퀴(60초)에 절반만큼 같은 속도로
                        옮깁니다(animate-marquee · 가속 없음). 절반 지점이 처음 모습과 같아 이음매 · 멈칫하는 느낌이
                        없고, 넓은 화면에서도 끝 빈자리가 드러나지 않습니다.
                    </li>
                    <li>
                        멈춤(useAutoplayPause) — 마우스를 올리면 멈추고 벗어나면 다시 흐릅니다. 터치하면 멈추고 다른
                        곳을 누르면 다시 흐릅니다. 키보드 포커스가 들어와도 멈춥니다[6.2.2]. 멈춘 자리에서 그대로 이어서
                        흐릅니다.
                    </li>
                    <li>
                        칩 — 옅은 파랑 면(blue.10) · navy.200 테두리 · 반경 16 · 여백 24 × 16 · 16 Bold navy.600.
                        마우스를 올린 칩만 남색 면(navy.500) · 흰 글자입니다(시안의 hover 예시). 다크는 시안대로
                        navy.800 면 · navy.500 테두리 · navy.300 글자이고, 마우스를 올리면 navy.300 면 · 짙은 글자 ·
                        테두리 없음입니다 (chip-marquee-* 토큰).
                    </li>
                    <li>
                        동작 줄이기면 흐르지 않고 줄바꿈된 목록 한 벌로 보입니다[6.3.1]. 화면 낭독기는 첫 벌만
                        읽습니다(나머지는 aria-hidden).
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="chip-marquee-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="chip-marquee-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ChipMarquee Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ChipMarqueeGuidePage
