import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '그림자 (Shadow)'}

// '미리보기' 칸 클래스 — Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔해서 CSS 를
// 생성하므로 `shadow-${k}` 처럼 동적으로 조합하면 안 만들어진다. shadow 키는 3개뿐인 고정 목록이라
// Record 로 리터럴을 나열해 className 에 직접 쓴다.
const SHADOW_CLASS: Record<string, string> = {sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg'}

// 그림자 — primitive alpha 참조(라이트=검정 / 다크=흰색)라 배경에 관계없이 보인다. shadcn/Tailwind 도
// box-shadow 는 x/y/blur/spread/색이 합쳐진 복합값이라 radius 처럼 단일 base+calc 로 못 만들고, 스텝마다
// 독립된 값을 쓴다 — 이 프로젝트 구조가 이미 그 컨벤션과 일치한다.
const ShadowGuidePage = () => (
    <GuidePage title="그림자 (Shadow)" description="shadow-* 유틸로 쓰는 그림자 토큰입니다.">
        <ul className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {Object.entries(tokens.effect.shadow).map(([k, val]) => {
                // color 참조 "black.10" → "--raw-black-a10" (primitive → semantic 매핑 표시)
                const rawVar = (ref: string) => {
                    const [name, step] = ref.split('.')
                    return `--raw-${name}-a${step}`
                }
                return (
                    <li key={k} className="border-border overflow-hidden rounded-xl border">
                        {/* 그림자가 라이트=검정/다크=흰색으로 전환되므로 자연 배경 위에서 양쪽 다 보임 */}
                        <div className="bg-background flex aspect-[16/10] items-center justify-center">
                            <span className={`bg-card border-border size-16 rounded-lg border ${SHADOW_CLASS[k]}`} />
                        </div>
                        <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                            <CopyChip value={`shadow-${k}`} />
                            <span className="typo-caption-regular text-muted-foreground font-mono">
                                --ds-shadow-{k}
                            </span>
                            <span className="typo-caption-regular text-muted-foreground font-mono">
                                ↳ {rawVar(val.color.light)} / {rawVar(val.color.dark)}
                            </span>
                        </div>
                    </li>
                )
            })}
        </ul>
    </GuidePage>
)

export default ShadowGuidePage
