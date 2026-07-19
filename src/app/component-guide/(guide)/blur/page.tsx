import type {Metadata} from 'next'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/guide/copy-chip'
import GuidePageShell from '@/components/guide/guide-page-shell'
import tokens from '@tokens'
import blurSampleImg from '../../../../../public/blur-sample.png'

export const metadata: Metadata = {title: '흐림 (Blur)'}

// Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔해서 CSS 를 생성한다 — tokens.effect.blur
// 의 키(k)를 템플릿 리터럴로 조합해 넘기면(예: `blur-${k}`) 스캔되지 않아 유틸리티가 아예 안 만들어진다.
// 그래서 실제 blur-sm/md/lg 리터럴 문자열을 고정 Record 로 두고 그 값을 그대로 className 에 쓴다.
const BLUR_CLASS: Record<string, string> = {sm: 'blur-sm', md: 'blur-md', lg: 'blur-lg'}

// 흐림 — 흐림 토큰(--ds-blur-*)을 blur-* 유틸리티로 적용. 공통 OG 이미지와 같은 navy 계열의 추상 이미지로 강도를 시각화한다.
const BlurGuidePage = () => (
    <GuidePageShell title="흐림 (Blur)" description="이미지와 장식 요소에 적용하는 blur-* 효과 토큰입니다.">
        <BaseCard>
            <section aria-labelledby="blur-scale" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="blur-scale" className="typo-h4-bold text-foreground">
                        Blur scale
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        sm·md·lg 세 단계로 흐림 강도를 구분합니다. 실제 콘텐츠를 가리는 배경 효과에는 Overlay 토큰을
                        함께 검토합니다.
                    </p>
                </div>
                <ul className="grid gap-5 md:grid-cols-3">
                    {Object.entries(tokens.effect.blur).map(([k, px]) => (
                        <li key={k} className="border-border overflow-hidden rounded-xl border">
                            <div className="relative aspect-video overflow-hidden">
                                <Image
                                    src={blurSampleImg}
                                    alt="navy 격자 위에 빛나는 중심 큐브가 있는 추상 기술 이미지"
                                    fill
                                    sizes="(min-width: 768px) 33vw, 100vw"
                                    className={`object-cover ${BLUR_CLASS[k]}`}
                                />
                            </div>
                            <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                                <CopyChip value={`blur-${k}`} />
                                <span className="typo-body-l-regular text-muted-foreground font-mono">
                                    --ds-blur-{k} · {px}px
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BlurGuidePage
