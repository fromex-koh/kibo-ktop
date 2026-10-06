// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {Info} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '인포박스 (InfoBox)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

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

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'alert',
        cells: [
            '폼·화면 안에서 상태를 알리는 한두 줄 메시지',
            <Link key="component" href="/component-guide/alert" className={LINK_CLASS}>
                Alert
            </Link>,
            '정보 · 성공 · 주의 · 오류 색과 아이콘으로 상태를 구분하는 인라인 메시지입니다. 접거나 닫지 않습니다.',
        ],
    },
    {
        key: 'info-box',
        cells: [
            '화면 하단의 안내 · 유의사항 목록',
            <code key="component">InfoBox</code>,
            '제목과 불릿 목록을 항상 펼쳐 둡니다. 상태 색이 없는 중립 패널입니다.',
        ],
    },
    {
        key: 'notice-accordion',
        cells: [
            '모달 · 화면 위쪽에서 접어 둘 수 있는 안내 목록',
            <Link key="component" href="/component-guide/notice-accordion" className={LINK_CLASS}>
                NoticeAccordion
            </Link>,
            '제목 줄을 눌러 목록을 여닫습니다. 처음 상태는 화면 폭을 따릅니다.',
        ],
    },
    {
        key: 'toast',
        cells: [
            '저장 · 등록처럼 끝난 일을 잠깐 알림',
            <Link key="component" href="/component-guide/toast" className={LINK_CLASS}>
                Toast · CheckToast
            </Link>,
            '화면 위에 떴다가 스스로 사라집니다. 반드시 읽어야 할 내용에는 쓰지 않습니다.',
        ],
    },
    {
        key: 'dialog',
        cells: [
            '사용자가 확인 · 결정해야 하는 알림',
            <Link key="component" href="/component-guide/dialog" className={LINK_CLASS}>
                Dialog
            </Link>,
            '흐름을 멈추고 응답을 받습니다. 되돌릴 수 없는 일의 결과는 여기서 알립니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'InfoBox',
        'variant',
        'filled 는 회색 채움(테두리 없음), outline 은 흰 배경 + 옅은 테두리입니다.',
        "'filled'",
        "'filled' | 'outline'",
    ],
    ['InfoBox', 'title', '상단 제목입니다. 생략하면 목록만 그립니다.', 'undefined', 'ReactNode'],
    ['InfoBox', 'headingLevel', '제목의 헤딩 단계입니다. 앞 제목보다 한 단계만 낮게 줍니다.', '3', '2 | 3 | 4'],
    [
        'InfoBox',
        'icon',
        '제목 앞에 놓는 선택 아이콘입니다. 24px 로 맞춰지고 aria-hidden 으로 감춥니다. title 이 있을 때만 그려집니다.',
        'undefined',
        'ReactNode',
    ],
    ['InfoBox', 'className · div props', '컨테이너에 전달합니다.', 'undefined', "ComponentProps<'div'>"],
    ['InfoBoxItem', 'children', '불릿 항목 본문입니다.', '-', 'ReactNode'],
    ['InfoBoxItem', 'className · li props', '항목에 전달합니다.', 'undefined', "ComponentProps<'li'>"],
] as const

// 인포박스 — 기존 ListMarker 를 재사용한 "제목 + 불릿 목록" 안내 패널.
const InfoBoxGuidePage = () => (
    <GuidePageShell
        title="인포박스 (InfoBox)"
        description="화면 하단의 안내 · 유의사항을 담는 제목 + 불릿 목록 패널입니다."
    >
        <BaseCard>
            <section aria-labelledby="ib-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ib-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        제목은 <code>title</code>, 항목은 <code>InfoBoxItem</code> 으로 넣습니다. 불릿은{' '}
                        <code>ListMarker</code> 를 재사용합니다.
                    </p>
                </div>
                <InfoBox title="알려드려요">
                    <InfoBoxItem>
                        기업의 자가진단용 기술사업평가는 기술ONE플랫폼 기업회원에 한해 월 1회 무료로 제공됩니다.
                    </InfoBoxItem>
                    <InfoBoxItem>
                        기술사업평가를 신청하시면 국내최초 개방형 평가모형인 KTRS-FM을 통한 기술사업성 평가가 자동으로
                        진행됩니다.
                    </InfoBoxItem>
                    <InfoBoxItem>
                        평가 신청 시 기업·기술 정보 및 체크리스트를 사실에 기반하여 작성해주셔야 정확한 평가가
                        가능합니다.
                    </InfoBoxItem>
                </InfoBox>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ib-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ib-variants" className="typo-h4-bold">
                        변형
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">outline</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            흰 배경에 옅은 테두리를 둘러 본문 카드 위에서도 구분됩니다.
                        </p>
                        <InfoBox variant="outline" title="꼭 확인해 주세요">
                            <InfoBoxItem>
                                제출 이후에는 수정할 수 없습니다. 입력하신 내용을 다시 한번 확인해 주시고, 이상이 없을
                                경우 [제출하기]를 클릭해 주세요.
                            </InfoBoxItem>
                            <InfoBoxItem>
                                진단 결과발송은 &lsquo;진행현황&rsquo; 화면을 통해 진행하실 수 있습니다.
                            </InfoBoxItem>
                        </InfoBox>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">아이콘</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            아이콘 래퍼가 <code>aria-hidden</code> 을 처리하므로 아이콘에 따로 주지 않아도 됩니다.
                        </p>
                        <InfoBox title="알려드려요" icon={<Info className="text-foreground" />}>
                            <InfoBoxItem>
                                제목 앞에 <code>icon</code> 슬롯으로 24px 아이콘을 붙일 수 있습니다.
                            </InfoBoxItem>
                        </InfoBox>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">헤딩 단계</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            제목은 실제 헤딩(기본 <code>h3</code>)입니다. 글자 크기는 단계와 무관하게 같습니다.
                        </p>
                        <InfoBox variant="outline" title="알려드려요" headingLevel={4}>
                            <InfoBoxItem>
                                앞 제목이 h3 인 자리에서는 headingLevel=&#123;4&#125; 로 낮춥니다.
                            </InfoBoxItem>
                        </InfoBox>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ib-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ib-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table caption="알림 계열 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ib-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ib-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        제목은 실제 헤딩이고 항목은 <code>ul</code> &gt; <code>li</code> 라 스크린리더가 항목 수를
                        알립니다[6.4.2][7.3.1].
                    </li>
                    <li>
                        헤딩 단계를 건너뛰지 않도록 앞 제목에 맞춰 <code>headingLevel</code> 을 조정합니다[6.4.2].
                    </li>
                    <li>
                        본문은 <code>text-foreground-subtle</code> 입니다. 배경 대비는 수동으로 검수합니다[5.3.3].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ib-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ib-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="InfoBox 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default InfoBoxGuidePage
