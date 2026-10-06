// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '오버레이 (Overlay)'}

// bg-overlay-* 는 배경 전용 @utility 라 text-*·border-* 등은 만들어지지 않는다. 동적 키 조합은 Tailwind 가
// 스캔하지 못하므로 리터럴을 Record 로 나열한다. 키 타입이 tokens.overlay 라 누락하면 typecheck 가 실패한다.
const OVERLAY_CLASS: Record<keyof typeof tokens.overlay, string> = {
    sm: 'bg-overlay-sm',
    md: 'bg-overlay-md',
    lg: 'bg-overlay-lg',
    xl: 'bg-overlay-xl',
}
const OVERLAY_CLASS_BY_NAME = new Map<string, string>(Object.entries(OVERLAY_CLASS))

// "black.10" → "--raw-black-a10" (alpha primitive 참조를 생성된 변수명으로 표시)
const rawVar = (ref: string): string => {
    const [name, step] = ref.split('.')
    return `--raw-${name}-a${step}`
}

const BASIC_CODE = `<div className="bg-overlay-lg fixed inset-0" />`

const OverlayGuidePage = () => (
    <GuidePageShell
        title="오버레이 (Overlay)"
        description="Dialog·Sheet 뒤의 콘텐츠를 분리하는 반투명 배경 토큰입니다."
    >
        <BaseCard>
            <section aria-labelledby="overlay-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="overlay-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>bg-overlay-*</code> 는 배경색 전용 유틸리티입니다. 단계가 커질수록 불투명해지며 light 는
                        검정, dark 는 흰색 alpha 로 자동 전환됩니다.
                    </p>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="overlay-scale" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="overlay-scale" className="typo-h4-bold">
                        오버레이 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>tokens.json</code> 의 <code>overlay</code> 값입니다. 체커보드 위에 겹쳐 투명도를 보여
                        줍니다.
                    </p>
                </div>
                <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {Object.entries(tokens.overlay).map(([name, ref]) => (
                        <li key={name} className="border-border overflow-hidden rounded-xl border">
                            {/* 투명도를 보이려면 겹침이 필요해 데모에 한해 absolute 를 쓴다(ST-005 예외). */}
                            <div
                                className="relative aspect-video"
                                style={{
                                    background:
                                        'repeating-conic-gradient(var(--raw-gray-300) 0% 25%, var(--raw-common-white) 0% 50%) 0 0 / 1.25rem 1.25rem',
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute inset-0 ${OVERLAY_CLASS_BY_NAME.get(name) ?? ''}`}
                                />
                            </div>
                            <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                                <CopyChip value={OVERLAY_CLASS_BY_NAME.get(name) ?? ''} />
                                <span className="typo-body-l-regular text-foreground-subtle font-mono">
                                    light {rawVar(ref.light)}
                                </span>
                                <span className="typo-body-l-regular text-foreground-subtle font-mono">
                                    dark {rawVar(ref.dark)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="overlay-rules" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="overlay-rules" className="typo-h4-bold">
                        사용 규칙
                    </h2>
                </div>
                <ul className="text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>bg-black/10</code>·<code>bg-[rgba(...)]</code> 같은 직접 투명도는 쓰지 않습니다. 단계는{' '}
                        <code>tokens.json</code> 의 <code>overlay</code> 를 수정하고 <code>yarn tokens</code> 를 실행해
                        바꿉니다.
                    </li>
                    <li>
                        배경 전용이라 <code>text-overlay-*</code>·<code>border-overlay-*</code> 는 없습니다.
                    </li>
                    <li>
                        Dialog·Sheet 는 이미 theme 스타일에 오버레이가 지정돼 있으므로 사용처에서 다시 깔지 않습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OverlayGuidePage
