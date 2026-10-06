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
}
const SHADOW_CLASS_BY_NAME = new Map<string, string>(Object.entries(SHADOW_CLASS))

const shadowEntries = Object.entries(tokens.effect.shadow)

// "black.5" → "--raw-black-a5" (alpha primitive 참조를 생성된 변수명으로 표시)
const rawVar = (ref: string): string => {
    const [name, step] = ref.split('.')
    return `--raw-${name}-a${step}`
}

const BASIC_CODE = `<div className="bg-card rounded-lg border shadow-1">카드</div>`

const ShadowGuidePage = () => (
    <GuidePageShell title="그림자 (Shadow)" description="표면의 높이와 구분을 표현하는 shadow-* 토큰입니다.">
        <BaseCard>
            <section aria-labelledby="shadow-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="shadow-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>shadow-*</code> 유틸리티로 적용합니다. 새 UI 에는 <code>shadow-1</code> 을 우선 쓰고,{' '}
                        <code>shadow-sm</code>·<code>shadow-md</code>·<code>shadow-lg</code> 는 shadcn primitive 가
                        참조하는 단계입니다.
                    </p>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="shadow-list" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="shadow-list" className="typo-h4-bold">
                        그림자 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>tokens.json</code> 의 <code>effect.shadow</code> 값입니다. 색은 light·dark 에 각각 alpha
                        primitive 를 참조해 테마에 따라 자동으로 바뀝니다.
                    </p>
                </div>
                <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                                <span className="typo-body-l-regular text-foreground-subtle font-mono">
                                    x {value.x}px · y {value.y}px · blur {value.blur}px · spread {value.spread}px
                                </span>
                                <span className="typo-body-l-regular text-foreground-subtle font-mono break-all">
                                    light {rawVar(value.color.light)}
                                </span>
                                <span className="typo-body-l-regular text-foreground-subtle font-mono break-all">
                                    dark {rawVar(value.color.dark)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="shadow-rules" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
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
