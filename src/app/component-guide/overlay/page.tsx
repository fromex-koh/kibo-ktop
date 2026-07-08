import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '오버레이'}

// bg-overlay-* 는 @utility 로 배경 전용 유틸리티만 만들어져 있다(text-*/border-* 등은 의도적으로
// 없음). Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔하므로 `bg-overlay-${k}` 처럼
// 동적으로 조합하면 안 만들어져 — 3개뿐인 고정 목록이라 Record 로 리터럴을 나열해 className 에 쓴다.
const OVERLAY_CLASS: Record<string, string> = {sm: 'bg-overlay-sm', md: 'bg-overlay-md', lg: 'bg-overlay-lg'}

// 오버레이 — 반투명 토큰(라이트=검정 / 다크=흰색 alpha). bg-overlay-* 유틸리티로 적용한다(드로어
// 백드롭 등). 배경 전용이라 text-*/border-* 등 다른 색 유틸리티는 의도적으로 만들지 않았다.
const OverlayGuidePage = () => (
    <GuidePage title="오버레이 (Overlay)" description="bg-overlay-* 유틸리티로 적용하는 반투명 오버레이 토큰입니다.">
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
                            <span aria-hidden="true" className={`absolute inset-0 ${OVERLAY_CLASS[k]}`} />
                        </div>
                        <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                            <CopyChip value={OVERLAY_CLASS[k]} />
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
