import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import tokens from '@tokens'

export const metadata: Metadata = {title: '그림자 (Shadow)'}

// 동적 키 조합은 Tailwind가 스캔하지 못하므로 실제 토큰 이름을 리터럴로 보관한다.
const SHADOW_CLASS: Record<keyof typeof tokens.effect.shadow, string> = {
    '1': 'shadow-1',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
}
// 표는 tokens.json 순서로 그리므로 조회는 문자열 키로 한다(위 객체가 누락 검사를 맡는다).
const SHADOW_CLASS_BY_NAME = new Map<string, string>(Object.entries(SHADOW_CLASS))

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
                    <span
                        className={`bg-card border-border size-16 rounded-lg border ${SHADOW_CLASS_BY_NAME.get(name) ?? ''}`}
                    />
                </div>
                <div className="border-border flex flex-col gap-2 border-t px-4 py-3">
                    <CopyChip value={SHADOW_CLASS_BY_NAME.get(name) ?? ''} />
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
    <GuidePageShell title="그림자 (Shadow)" description="표면의 높이와 구분을 표현하는 shadow-* 토큰입니다.">
        <BaseCard>
            <section aria-labelledby="project-shadow" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="project-shadow" className="typo-h4-bold text-foreground">
                        프로젝트 기본
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        새 UI에는 <code className="font-mono">shadow-1</code>을 우선 사용합니다. 수치와 테마별 색상은{' '}
                        <code className="font-mono">tokens.json</code>에서 관리합니다.
                    </p>
                </div>
                <ShadowList entries={projectEntries} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="compatibility-shadow" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="compatibility-shadow" className="typo-h4-bold text-foreground">
                        shadcn 호환
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        <code className="font-mono">shadow-sm/md/lg</code>는 shadcn primitive 호환용입니다. 새 UI의 임의
                        단계 선택에는 사용하지 않습니다.
                    </p>
                </div>
                <ShadowList entries={compatibilityEntries} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ShadowGuidePage
