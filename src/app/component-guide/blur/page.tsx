import type {Metadata} from 'next'
import Image from 'next/image'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'
import sampleCatImg from '../../../../public/sample-cat.jpg'

export const metadata: Metadata = {title: '흐림 (Blur)'}

// Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔해서 CSS 를 생성한다 — tokens.effect.blur
// 의 키(k)를 템플릿 리터럴로 조합해 넘기면(예: `blur-${k}`) 스캔되지 않아 유틸리티가 아예 안 만들어진다.
// 그래서 실제 blur-sm/md/lg 리터럴 문자열을 고정 Record 로 두고 그 값을 그대로 className 에 쓴다.
const BLUR_CLASS: Record<string, string> = {sm: 'blur-sm', md: 'blur-md', lg: 'blur-lg'}

// 흐림 — 흐림 토큰(--ds-blur-*)을 blur-* 유틸리티로 적용. 실제 사진으로 강도를 시각화한다.
const BlurGuidePage = () => (
    <GuidePage title="흐림 (Blur)" description="blur-* 유틸리티로 적용하는 흐림 토큰입니다.">
        <ul className="wide:grid-cols-3 grid grid-cols-2 gap-5">
            {Object.entries(tokens.effect.blur).map(([k, px]) => (
                <li key={k} className="border-border overflow-hidden rounded-xl border">
                    <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                            src={sampleCatImg}
                            alt="파란 하늘을 배경으로 위를 올려다보는 고양이"
                            fill
                            sizes="(min-width: 768px) 33vw, 50vw"
                            className={`object-cover ${BLUR_CLASS[k]}`}
                        />
                    </div>
                    <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                        <CopyChip value={`blur-${k}`} />
                        <span className="typo-caption-regular text-muted-foreground font-mono">
                            --ds-blur-{k} · {px}px
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    </GuidePage>
)

export default BlurGuidePage
