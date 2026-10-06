// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '흐림 (Blur)'}

// 동적 키 조합은 Tailwind 가 스캔하지 못하므로 실제 클래스명을 리터럴로 보관한다.
// 키 타입이 tokens.effect.blur 라 토큰을 추가하고 여기 빠뜨리면 typecheck 가 실패한다.
const BLUR_CLASS: Record<keyof typeof tokens.effect.blur, string> = {sm: 'blur-sm', md: 'blur-md', lg: 'blur-lg'}
const BLUR_CLASS_BY_NAME = new Map<string, string>(Object.entries(BLUR_CLASS))

const BASIC_CODE = `<Image src={decoration} alt="" className="blur-md" />`

const BlurGuidePage = () => (
    <GuidePageShell title="흐림 (Blur)" description="요소 자체를 흐리게 만드는 blur-* 효과 토큰입니다.">
        <BaseCard>
            <section aria-labelledby="blur-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="blur-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>blur-*</code> 유틸리티는 요소 자체를 흐리게 합니다. 장식 이미지에 쓰고, 콘텐츠 뒤 배경을
                        어둡게 할 때는 <code>blur-*</code> 대신 <code>bg-overlay-*</code> 를 사용합니다.
                    </p>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="blur-scale" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="blur-scale" className="typo-h4-bold">
                        흐림 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>tokens.json</code> 의 <code>effect.blur</code> 값입니다.
                    </p>
                </div>
                <ul className="grid gap-5 md:grid-cols-3">
                    {Object.entries(tokens.effect.blur).map(([name, px]) => (
                        <li key={name} className="border-border overflow-hidden rounded-xl border">
                            <div className="relative aspect-video overflow-hidden">
                                <Image
                                    src="/blur-sample.png"
                                    alt="navy 격자 위에 빛나는 중심 큐브가 있는 추상 기술 이미지"
                                    draggable={false}
                                    fill
                                    sizes="(min-width: 768px) 33vw, 100vw"
                                    className={`object-cover ${BLUR_CLASS_BY_NAME.get(name) ?? ''}`}
                                />
                            </div>
                            <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                                <CopyChip value={`blur-${name}`} />
                                <span className="typo-body-l-regular text-foreground-subtle font-mono">
                                    --ds-blur-{name} · {px}px
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="blur-rules" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="blur-rules" className="typo-h4-bold">
                        사용 규칙
                    </h2>
                </div>
                <ul className="text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>blur-[10px]</code> 같은 임의 값은 쓰지 않습니다. 필요한 단계가 없으면{' '}
                        <code>tokens.json</code> 의 <code>effect.blur</code> 를 수정하고 <code>yarn tokens</code> 를
                        실행합니다.
                    </li>
                    <li>
                        <code>src/app/tokens.css</code> 는 생성 파일이라 직접 고치지 않습니다.
                    </li>
                    <li>글자나 정보를 담은 요소에는 쓰지 않습니다. 흐리게 만들면 읽을 수 없게 됩니다. [KWCAG 5.3.3]</li>
                    <li>
                        흐림 처리한 장식 이미지는 <code>alt=&quot;&quot;</code> 로 두어 스크린리더가 건너뛰게 합니다.
                        [KWCAG 5.1.1]
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BlurGuidePage
