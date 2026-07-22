import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '오버레이 (Overlay)'}

// bg-overlay-* 는 @utility 로 배경 전용 유틸리티만 만들어져 있다(text-*/border-* 등은 의도적으로
// 없음). Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔하므로 `bg-overlay-${k}` 처럼
// 동적으로 조합하면 안 만들어져 — 4개 고정 목록을 Record 로 나열해 className 에 쓴다.
const OVERLAY_CLASS: Record<string, string> = {
    sm: 'bg-overlay-sm',
    md: 'bg-overlay-md',
    lg: 'bg-overlay-lg',
    xl: 'bg-overlay-xl',
}

// 오버레이 — 반투명 토큰(라이트=검정 / 다크=흰색 alpha). bg-overlay-* 유틸리티로 적용한다(드로어
// 백드롭 등). 배경 전용이라 text-*/border-* 등 다른 색 유틸리티는 의도적으로 만들지 않았다.
const OverlayGuidePage = () => (
    <GuidePageShell
        title="오버레이 (Overlay)"
        description="Dialog·Sheet 등 현재 콘텐츠 위에 새 레이어가 열릴 때 사용하는 반투명 배경 토큰입니다."
    >
        <BaseCard>
            <section aria-labelledby="overlay-scale" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="overlay-scale" className="typo-h4-bold text-foreground">
                        Overlay scale
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        sm부터 xl까지 불투명도가 높아집니다. 라이트 모드는 black alpha, 다크 모드는 white alpha를
                        사용합니다.
                    </p>
                </div>
                <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {Object.entries(tokens.overlay).map(([k, ref]) => {
                        // "black.5" → "--raw-black-a5" (primitive → semantic 매핑 표시)
                        const rawVar = (r: string) => {
                            const [name, step] = r.split('.')
                            return `--raw-${name}-a${step}`
                        }
                        return (
                            <li key={k} className="border-border overflow-hidden rounded-xl border">
                                <div
                                    className="relative aspect-video"
                                    style={{
                                        background:
                                            'repeating-conic-gradient(var(--ds-gray-200) 0% 25%, var(--ds-gray-100) 0% 50%) 0 0 / 20px 20px',
                                    }}
                                >
                                    <span aria-hidden="true" className={`absolute inset-0 ${OVERLAY_CLASS[k]}`} />
                                </div>
                                <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                                    <CopyChip value={OVERLAY_CLASS[k]} />
                                    <span className="typo-body-l-regular text-muted-foreground font-mono">
                                        {rawVar(ref.light)} / {rawVar(ref.dark)}
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OverlayGuidePage
