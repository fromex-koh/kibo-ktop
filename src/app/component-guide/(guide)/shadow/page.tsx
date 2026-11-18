// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '그림자 (Shadow)'}

// 동적 키 조합은 Tailwind 가 스캔하지 못하므로 실제 클래스명을 리터럴로 보관한다.
// 키 타입이 tokens.effect.shadow 라 토큰을 추가하고 여기 빠뜨리면 typecheck 가 실패한다.
const SHADOW_CLASS: Record<keyof typeof tokens.effect.shadow, string> = {
    '1': 'shadow-1',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    lift: 'shadow-lift',
    float: 'shadow-float',
    'tint-cell': 'shadow-tint-cell',
    'tint-node': 'shadow-tint-node',
    'tint-raised': 'shadow-tint-raised',
    'tint-panel': 'shadow-tint-panel',
    'tint-lift': 'shadow-tint-lift',
    'tint-pill': 'shadow-tint-pill',
}
const SHADOW_CLASS_BY_NAME = new Map<string, string>(Object.entries(SHADOW_CLASS))

// 겹이 여럿인 토큰(float)은 배열이다 — 목록에서는 겹마다 한 줄씩 보인다.
type ShadowLayer = {x: number; y: number; blur: number; spread: number; color: {light: string; dark: string}}
const toLayers = (value: ShadowLayer | readonly ShadowLayer[]): readonly ShadowLayer[] =>
    'x' in value ? [value] : value
const shadowEntries = Object.entries(tokens.effect.shadow).map(([name, value]) => [name, toLayers(value)] as const)

// "black.5" → "--raw-black-a5" (alpha primitive 참조를 생성된 변수명으로 표시)
// "tint.45" → "--shadow-tint 45%" (요소가 정한 물든 그림자 색을 그 비율로 섞는다)
const rawVar = (ref: string): string => {
    const [name, step] = ref.split('.')
    return name === 'tint' ? `--shadow-tint ${step}%` : `--raw-${name}-a${step}`
}

const BASIC_CODE = `<div className="bg-card rounded-lg border shadow-1">카드</div>`

const ShadowGuidePage = () => (
    <GuidePageShell title="그림자 (Shadow)" description="표면의 높이와 구분을 표현하는 shadow-* 토큰입니다.">
        <BaseCard>
            <section aria-labelledby="shadow-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="shadow-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>shadow-*</code> 유틸리티로 적용합니다. 새 UI 에는 <code>shadow-1</code> 을 우선 쓰고,{' '}
                        <code>shadow-sm</code>·<code>shadow-md</code>·<code>shadow-lg</code> 는 shadcn primitive 가
                        참조하는 단계입니다. <code>shadow-lift</code> 는 떠 있는 강조 칸(플랫폼 소개 히어로 카드 · 결과
                        칸 · 평점 알약) 아래로만 번지는 그림자로, 다크에서도 흰 번짐 대신 어두운 그림자입니다.{' '}
                        <code>shadow-float</code> 는 두 겹(가까운 짙은 그림자 + 넓게 번지는 그림자)으로 떠 있는
                        종이(K-BIGx 보고서 표지)에 씁니다 — 겹이 여럿인 토큰은 tokens.json 에 배열로 둡니다.{' '}
                        <code>shadow-tint-*</code> 는 강조색으로 물든 번짐입니다 — 색은 사용처가{' '}
                        <code>[--shadow-tint:…]</code> 로 넘기고(없으면 투명), 토큰 색은 <code>tint.퍼센트</code> 로
                        적습니다(K-BIGx 분석 구조 도식).
                    </p>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="shadow-list" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="shadow-list" className="typo-h4-bold">
                        그림자 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>tokens.json</code> 의 <code>effect.shadow</code> 값입니다. 색은 light·dark 에 각각 alpha
                        primitive 를 참조해 테마에 따라 자동으로 바뀝니다.
                    </p>
                </div>
                {/* 물든 그림자(tint-*) 예시 색 — 화면에서는 사용처가 [--shadow-tint:…] 로 넘긴다. */}
                <ul className="grid gap-5 [--shadow-tint:var(--color-platform-accent)] md:grid-cols-2 xl:grid-cols-4">
                    {shadowEntries.map(([name, value]) => (
                        <li key={name} className="border-border overflow-hidden rounded-xl border">
                            <div className="bg-background flex aspect-video items-center justify-center">
                                <span
                                    aria-hidden="true"
                                    className={`bg-card border-border size-16 rounded-lg border ${SHADOW_CLASS_BY_NAME.get(name) ?? ''}`}
                                />
                            </div>
                            <div className="border-border flex flex-col gap-2 border-t px-4 py-3">
                                <CopyChip value={SHADOW_CLASS_BY_NAME.get(name) ?? ''} />
                                {value.map((layer) => (
                                    <span
                                        key={`${layer.y}-${layer.blur}`}
                                        className="typo-body-l-regular text-foreground-subtle flex flex-col gap-2 font-mono break-all"
                                    >
                                        <span>
                                            x {layer.x}px · y {layer.y}px · blur {layer.blur}px · spread {layer.spread}
                                            px
                                        </span>
                                        <span>light {rawVar(layer.color.light)}</span>
                                        <span>dark {rawVar(layer.color.dark)}</span>
                                    </span>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="shadow-rules" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="shadow-rules" className="typo-h4-bold">
                        사용 규칙
                    </h2>
                </div>
                <ul className="text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>shadow-[0_4px_8px_...]</code> 같은 임의 값과 색상 리터럴은 쓰지 않습니다.
                    </li>
                    <li>
                        수치와 색은 <code>tokens.json</code> 의 <code>effect.shadow</code> 를 수정하고{' '}
                        <code>yarn tokens</code> 를 실행해 바꿉니다. <code>src/app/tokens.css</code> 는 직접 고치지
                        않습니다.
                    </li>
                    <li>
                        그림자만으로 영역을 구분하지 않습니다. 경계는 <code>border-border</code> 로 함께 표시합니다.{' '}
                        [KWCAG 5.3.5]
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ShadowGuidePage
