import type {Metadata} from 'next'
import {ChevronRight} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {ListMarker} from '@/components/custom/list-marker'
import {Badge} from '@/components/kit/badge'
import {Button} from '@/components/kit/button'

export const metadata: Metadata = {title: '칩 (Chip)'}

const RADIO_USAGE_CODE = `{/* 동의 항목처럼 하나만 고르는 자리 — 질문이 라디오 그룹의 레이블 */}
<p id="consent-1-label">위 고유식별정보 수집·이용에 동의하십니까?</p>

<ChipRadioGroup name="consent-1" defaultValue="agree" aria-labelledby="consent-1-label" className="w-full">
  <ChipRadio value="agree" className="flex-1">동의함</ChipRadio>
  <ChipRadio value="disagree" className="flex-1">동의하지 않음</ChipRadio>
</ChipRadioGroup>`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    ['ChipRadioGroup', '라디오 칩들을 감싸는 그룹. name 을 주면 선택값이 hidden input 으로 폼 제출된다. 하나만 선택.'],
    ['ChipRadio', '개별 라디오 칩. value 로 식별한다. 아이콘은 없다.'],
] as const

// 칩 — 겉모습은 칩, 속은 Radix RadioGroup(폼 프리미티브). name→hidden input 으로 폼 제출된다.
const ChipGuidePage = () => (
    <GuidePageShell
        title="칩 (Chip)"
        description="라벨을 눌러 하나를 고르는 카드형 라디오 컨트롤입니다. 겉모습은 칩이지만 속은 RadioGroup 폼 프리미티브라, 그룹에 name 을 주면 선택값이 hidden input 으로 폼에 제출됩니다."
    >
        <section aria-labelledby="chip-radio-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="chip-radio-usage" className="typo-h4-bold">
                    사용 예시 (radio)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    동의 항목처럼 하나만 고르는 자리에 라디오형 칩을 씁니다. 제목(필수 배지 + 번호)·안내 질문·동일 폭
                    라디오 칩 두 개로 구성한 실제 예시입니다.
                </p>
            </div>
            <BaseCard>
                <div className="flex flex-col gap-3">
                    {/* 헤더 — 뱃지 + 제목 | 내용보기 버튼 */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" color="info" shape="round">
                                필수
                            </Badge>
                            <h3 className="typo-title-l-medium text-foreground">1. 수집·이용에 관한 사항</h3>
                        </div>
                        <Button type="button" variant="text" size="xsmall">
                            내용보기
                            <ChevronRight aria-hidden="true" />
                        </Button>
                    </div>
                    {/* 안내 질문 — 라디오 그룹의 레이블(aria-labelledby 로 연결) */}
                    <p
                        id="consent-1-label"
                        className="typo-body-xl-regular text-foreground-subtle flex items-start gap-1.5"
                    >
                        <ListMarker type="unordered" level={2} />위 고유식별정보 수집·이용에 동의하십니까?
                    </p>
                    {/* 라디오 칩 — 동일 폭 2개(flex-1) */}
                    <ChipRadioGroup
                        name="consent-1"
                        defaultValue="agree"
                        aria-labelledby="consent-1-label"
                        className="w-full"
                    >
                        <ChipRadio value="agree" className="flex-1">
                            동의함
                        </ChipRadio>
                        <ChipRadio value="disagree" className="flex-1">
                            동의하지 않음
                        </ChipRadio>
                    </ChipRadioGroup>
                </div>
            </BaseCard>
            <CodeBlock code={RADIO_USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="chip-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="chip-composition" className="typo-h4-bold">
                    구성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">칩은 그룹과 개별 칩으로 이뤄집니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {COMPOSITION.map(([name, desc]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default ChipGuidePage
