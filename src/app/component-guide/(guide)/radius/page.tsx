// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '모서리 반경 (Radius)'}

// Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔해 CSS 를 만든다. `rounded-${k}` 처럼 조합하면
// 유틸리티가 생성되지 않으므로 리터럴을 Record 로 나열한다. 키 타입이 tokens.radius 라 토큰을 추가하고
// 여기 빠뜨리면 typecheck 가 실패한다.
const ROUNDED_CLASS: Record<keyof typeof tokens.radius, string> = {
    '3xs': 'rounded-3xs',
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
const ROUNDED_CLASS_BY_NAME = new Map<string, string>(Object.entries(ROUNDED_CLASS))

// tokens.radius 의 숫자는 절대 px 가 아니라 radiusBase 에서 더하는 오프셋이다. 문자열(full)만 절대 값이다.
const resolveRadius = (value: number | string): string =>
    typeof value === 'number' ? `${tokens.radiusBase + value}px` : value
const formatOffset = (value: number | string): string =>
    typeof value === 'number' ? `${tokens.radiusBase} ${value < 0 ? '−' : '+'} ${Math.abs(value)}` : '절대 값'

const BASIC_CODE = `<div className="rounded-lg border">카드</div>
<button className="rounded-md">버튼</button>
<span className="rounded-full">알약</span>`

const RADIUS_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스 (클릭 복사)', align: 'start', rowHeader: true},
    {key: 'value', header: '실제 반경', align: 'start'},
    {key: 'formula', header: '계산 (base 오프셋)', align: 'start'},
] as const

const RadiusGuidePage = () => (
    <GuidePageShell title="모서리 반경 (Radius)" description="컴포넌트 형태에 적용하는 rounded-* 반경 토큰입니다.">
        <BaseCard>
            <section aria-labelledby="radius-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radius-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        반경은 <code>rounded-*</code> 유틸리티로 적용합니다. 값은 <code>tokens.json</code> 의 기준값{' '}
                        <code>radiusBase</code>({tokens.radiusBase}px)에 단계별 오프셋을 더해 계산합니다.
                    </p>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radius-scale" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radius-scale" className="typo-h4-bold">
                        반경 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>tokens.json</code> 에서 읽은 값입니다. 클래스 칩을 누르면 이름이 복사됩니다.
                    </p>
                </div>
                <Table
                    caption="rounded-* 유틸리티, 실제 반경, 계산과 미리보기"
                    columns={RADIUS_COLUMNS}
                    rows={Object.entries(tokens.radius).map(([name, value]) => ({
                        key: name,
                        cells: [
                            <span
                                key="preview"
                                aria-hidden="true"
                                className={`bg-card border-border block size-16 border ${ROUNDED_CLASS_BY_NAME.get(name) ?? ''}`}
                            />,
                            <CopyChip key="class" value={`rounded-${name}`} />,
                            <span key="value" className="font-mono">
                                {resolveRadius(value)}
                            </span>,
                            <span key="formula" className="text-foreground-subtle font-mono">
                                {formatOffset(value)}
                            </span>,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radius-rules" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radius-rules" className="typo-h4-bold">
                        사용 규칙
                    </h2>
                </div>
                <ul className="text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>rounded-*</code> 의 정의된 단계만 씁니다. <code>rounded-[10px]</code> 같은 임의 값은 쓰지
                        않습니다.
                    </li>
                    <li>
                        값은 <code>tokens.json</code> 의 <code>radius</code>(기준값은 <code>radiusBase</code>)를
                        수정하고 <code>yarn tokens</code> 를 실행해 바꿉니다. 기준값을 바꾸면 <code>full</code> 을 뺀
                        모든 단계가 함께 움직입니다.
                    </li>
                    <li>
                        <code>src/app/tokens.css</code> 는 생성 파일이라 직접 고치지 않습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadiusGuidePage
