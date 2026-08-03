import type {Metadata} from 'next'
import {Info} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '인포박스 (InfoBox)'}

const USAGE_CODE = `import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'

{/* filled(회색 채움) — 화면 하단 안내 */}
<InfoBox title="알려드려요">
  <InfoBoxItem>기업의 자가진단용 기술사업평가는 기업회원에 한해 월 1회 무료로 제공됩니다.</InfoBoxItem>
  <InfoBoxItem>평가 신청 시 정보를 사실에 기반하여 작성해주셔야 정확한 평가가 가능합니다.</InfoBoxItem>
</InfoBox>

{/* outline(테두리) — 제출 전 유의사항 */}
<InfoBox variant="outline" title="꼭 확인해 주세요">
  <InfoBoxItem>제출 이후에는 수정할 수 없습니다. 입력하신 내용을 다시 확인해 주세요.</InfoBoxItem>
</InfoBox>`

const PROPS_ITEMS = [
    ['InfoBox', 'variant', '외형 스타일. filled(회색 채움)·outline(테두리).', "'filled'", "'filled' | 'outline'"],
    ['InfoBox', 'title', '상단 제목. 생략하면 목록만 렌더합니다.', 'undefined', 'ReactNode'],
    ['InfoBox', 'icon', '제목 앞 선택 아이콘(24px). size-6 아이콘을 넘깁니다.', 'undefined', 'ReactNode'],
    [
        'InfoBox',
        'className · div props',
        '컨테이너 스타일과 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    ['InfoBoxItem', 'children', '불릿 항목 본문입니다.', '-', 'ReactNode'],
    [
        'InfoBoxItem',
        'className · li props',
        '항목 스타일과 네이티브 li 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'li'>",
    ],
] as const

// 인포박스 — 기존 ListMarker 를 재사용한 "제목 + 불릿 목록" 안내 패널. Figma 하단인포·타이틀 2줄 반영.
const InfoBoxGuidePage = () => (
    <GuidePageShell
        title="인포박스 (InfoBox)"
        description="화면 하단의 안내·유의사항을 담는 제목 + 불릿 목록 패널입니다. variant(filled·outline)로 외형을 나누고, 불릿은 기존 ListMarker 를 그대로 재사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="ib-variant" className="flex flex-col gap-4">
                <div>
                    <h2 id="ib-variant" className="typo-h4-bold">
                        스타일 (variant)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">filled</code>는 옅은 회색 채움(테두리 없음),{' '}
                        <code className="font-mono">outline</code>은 흰 배경 + 옅은 테두리입니다. 제목은{' '}
                        <code className="font-mono">title</code>, 항목은 <code className="font-mono">InfoBoxItem</code>
                        으로 넣습니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <InfoBox title="알려드려요">
                        <InfoBoxItem>
                            기업의 자가진단용 기술사업평가는 기술ONE플랫폼 기업회원에 한해 월 1회 무료로 제공됩니다.
                        </InfoBoxItem>
                        <InfoBoxItem>
                            기술사업평가를 신청하시면 국내최초 개방형 평가모형인 KTRS-FM을 통한 기술사업성 평가가
                            자동으로 진행됩니다.
                        </InfoBoxItem>
                        <InfoBoxItem>
                            평가 신청 시 기업·기술 정보 및 체크리스트를 사실에 기반하여 작성해주셔야 정확한 평가가
                            가능합니다.
                        </InfoBoxItem>
                        <InfoBoxItem>
                            아래 기술사업평가 신청 버튼을 누르면 평가를 위한 정보 입력화면으로 이동합니다.
                        </InfoBoxItem>
                    </InfoBox>
                    <InfoBox variant="outline" title="꼭 확인해 주세요">
                        <InfoBoxItem>
                            제출 이후에는 수정할 수 없습니다. 입력하신 내용을 다시 한번 확인해 주시고, 이상이 없을 경우
                            [제출하기]를 클릭해 주세요.
                        </InfoBoxItem>
                        <InfoBoxItem>
                            진단 결과발송은 &lsquo;진행현황&rsquo; 화면을 통해 진행하실 수 있습니다.
                        </InfoBoxItem>
                    </InfoBox>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ib-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="ib-cases" className="typo-h4-bold">
                        케이스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        같은 컴포넌트로 안내형(알려드려요)·확인형(꼭 확인해 주세요)을 표현합니다. 항목은 한 개부터 여러
                        개까지 자유롭게 쌓입니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <InfoBox variant="outline" title="알려드려요">
                        <InfoBoxItem>
                            제출하신 자가진단 결과는 &lsquo;진행현황&rsquo; 화면에서 확인하실 수 있습니다.
                        </InfoBoxItem>
                        <InfoBoxItem>
                            진단 결과발송은 &lsquo;진행현황&rsquo; 화면을 통해 진행하실 수 있습니다.
                        </InfoBoxItem>
                    </InfoBox>
                    <InfoBox title="알려드려요" icon={<Info aria-hidden="true" className="text-foreground" />}>
                        <InfoBoxItem>
                            제목 앞에 <code className="font-mono">icon</code> 슬롯으로 24px 아이콘을 붙일 수 있습니다.
                        </InfoBoxItem>
                    </InfoBox>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ib-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="ib-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        InfoBox 컨테이너와 InfoBoxItem 항목에 전달하는 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="InfoBox 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default InfoBoxGuidePage
