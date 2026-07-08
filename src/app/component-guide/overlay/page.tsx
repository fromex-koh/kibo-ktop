import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '오버레이'}

// 오버레이 — 반투명 토큰(라이트=검정 / 다크=흰색 alpha). 색상값만 있어 Tailwind 유틸리티로 노출하지
// 않고 var(--ds-overlay-*) 로 직접 참조한다(드로어 백드롭 등).
const OverlayGuidePage = () => (
    <GuidePage
        title="오버레이 (Overlay)"
        description="var(--ds-overlay-*) 로 직접 참조하는 반투명 오버레이 토큰입니다."
    >
        <ul className="wide:grid-cols-3 grid grid-cols-2 gap-5">
            {Object.entries(tokens.overlay).map(([k, ref]) => {
                // "black.5" → "--raw-black-a5" (primitive → semantic 매핑 표시)
                const rawVar = (r: string) => {
                    const [name, step] = r.split('.')
                    return `--raw-${name}-a${step}`
                }
                return (
                    <li key={k} className="border-border overflow-hidden rounded-xl border">
                        <div
                            className="relative aspect-[16/10]"
                            style={{
                                background:
                                    'repeating-conic-gradient(var(--ds-gray-200) 0% 25%, var(--ds-gray-100) 0% 50%) 0 0 / 20px 20px',
                            }}
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-0"
                                style={{background: `var(--ds-overlay-${k})`}}
                            />
                        </div>
                        <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                            {/* Tailwind 유틸리티가 없으니(NO_UTILITY_SLOTS) 복사값은 클래스명이 아니라
                                실제 사용법 그대로인 CSS 변수 참조 — label 로 짧은 이름만 보여준다. */}
                            <CopyChip value={`var(--ds-overlay-${k})`} label={`overlay-${k}`} />
                            <span className="typo-caption-regular text-muted-foreground font-mono">
                                ↳ {rawVar(ref.light)} / {rawVar(ref.dark)}
                            </span>
                        </div>
                    </li>
                )
            })}
        </ul>
    </GuidePage>
)

export default OverlayGuidePage
