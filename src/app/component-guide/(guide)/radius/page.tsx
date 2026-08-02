import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '모서리 반경 (Radius)'}

// '미리보기' 칸 클래스 — Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔해서 CSS 를
// 생성하므로 `rounded-${k}` 처럼 동적으로 조합하면 안 만들어진다(실제로 rounded-2xs/rounded-2xl 은 이
// 프로젝트 다른 곳에 리터럴 사용처가 없어 스캔되지 않고 있었음). radius 키는 9개뿐인 고정 목록이라
// Record 로 리터럴을 나열해 className 에 직접 쓴다.
const ROUNDED_CLASS: Record<keyof typeof tokens.radius, string> = {
    '2xs': 'rounded-2xs',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
}
// 표는 tokens.json 순서로 그리므로 조회는 문자열 키로 한다(위 객체가 누락 검사를 맡는다).
const ROUNDED_CLASS_BY_NAME = new Map<string, string>(Object.entries(ROUNDED_CLASS))

// tokens.radius 의 숫자값은 절대 px 가 아니라 radiusBase 로부터의 오프셋이다(shadcn 컨벤션: 단일
// --radius + calc 파생, spacing 의 "단일 base 가 전체 스케일을 지배" 원리와 동일). '값' 칸엔 오프셋이
// 아니라 실제 최종 반경(base + 오프셋)을 보여준다.
const resolvedPx = (v: number | string): number | string => (typeof v === 'number' ? tokens.radiusBase + v : v)

const RADIUS_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스 (클릭 복사)', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
] as const

// 모서리 반경 — Figma '05 Radius' 정의를 반경 토큰(--ds-radius-*)으로 반영. rounded-* 유틸로 쓰며
// 정의된 9개 키(2xs·xs·sm·md·lg·xl·2xl·3xl·full)만 사용한다. '클래스' 칩을 클릭하면 이름이 복사된다.
const RadiusGuidePage = () => (
    <GuidePageShell title="모서리 반경 (Radius)" description="컴포넌트 형태에 적용하는 rounded-* 반경 토큰입니다.">
        <BaseCard>
            <section aria-labelledby="radius-scale" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="radius-scale" className="typo-h4-bold text-foreground">
                        반경 선택
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        <code className="font-mono">rounded-*</code>만 사용합니다. 값은{' '}
                        <code className="font-mono">tokens.json</code>의 base {tokens.radiusBase}px와 단계별 오프셋으로
                        관리하며, CSS 리터럴은 직접 입력하지 않습니다.
                    </p>
                </div>
                <Table
                    caption="Radius 유틸리티, 실제 반경과 미리보기"
                    columns={RADIUS_COLUMNS}
                    rows={Object.entries(tokens.radius).map(([k, offset]) => {
                        const px = resolvedPx(offset)
                        return {
                            key: k,
                            cells: [
                                <span
                                    key="preview"
                                    aria-hidden="true"
                                    className={`bg-card border-border block size-16 border ${ROUNDED_CLASS_BY_NAME.get(k) ?? ''}`}
                                />,
                                <CopyChip key="class" value={`rounded-${k}`} />,
                                <span key="value" className="font-mono">
                                    {typeof px === 'number' ? `${px}px` : px}
                                </span>,
                            ],
                        }
                    })}
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadiusGuidePage
