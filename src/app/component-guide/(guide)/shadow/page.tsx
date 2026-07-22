import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '그림자 (Shadow)'}

// 동적 키 조합은 Tailwind가 스캔하지 못하므로 실제 토큰 이름을 리터럴로 보관한다.
const SHADOW_CLASS: Record<string, string> = {
    '1': 'shadow-1',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
}

const shadowEntries = Object.entries(tokens.effect.shadow)
const projectEntries = shadowEntries.filter(([name]) => /^\d+$/.test(name))
const compatibilityEntries = shadowEntries.filter(([name]) => !/^\d+$/.test(name))

const rawVar = (ref: string): string => {
    const [name, step] = ref.split('.')
    return `--raw-${name}-a${step}`
}

const ShadowList = ({entries}: {entries: typeof shadowEntries}) => (
    <ul className="grid gap-5 md:grid-cols-3">
        {entries.map(([name, value]) => (
            <li key={name} className="border-border overflow-hidden rounded-xl border">
                <div className="bg-background flex aspect-video items-center justify-center">
                    <span className={`bg-card border-border size-16 rounded-lg border ${SHADOW_CLASS[name]}`} />
                </div>
                <div className="border-border flex flex-col gap-2 border-t px-4 py-3">
                    <CopyChip value={SHADOW_CLASS[name]} />
                    <span className="typo-body-l-regular text-muted-foreground font-mono">
                        x {value.x}px · y {value.y}px · blur {value.blur}px · spread {value.spread}px
                    </span>
                    <span className="typo-body-l-regular text-muted-foreground font-mono">
                        {rawVar(value.color.light)} / {rawVar(value.color.dark)}
                    </span>
                </div>
            </li>
        ))}
    </ul>
)

const ShadowGuidePage = () => (
    <GuidePageShell
        title="그림자 (Shadow)"
        description="프로젝트 표면과 shadcn primitive에서 사용하는 box-shadow 토큰입니다."
    >
        <BaseCard>
            <section aria-labelledby="project-shadow" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="project-shadow" className="typo-h4-bold text-foreground">
                        프로젝트 그림자
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        프로젝트 화면에서 직접 선택하는 그림자입니다. 현재 <code className="font-mono">shadow-1</code>을
                        사용합니다.
                    </p>
                </div>
                <ShadowList entries={projectEntries} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="compatibility-shadow" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="compatibility-shadow" className="typo-h4-bold text-foreground">
                        shadcn 호환 그림자
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        shadcn primitive가 참조하는 표준 유틸리티 이름을 유지합니다. 프로젝트 화면에서는 먼저 shadow-1을
                        검토합니다.
                    </p>
                </div>
                <ShadowList entries={compatibilityEntries} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ShadowGuidePage
