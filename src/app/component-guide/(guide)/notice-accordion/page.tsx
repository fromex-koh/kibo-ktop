// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {NoticeAccordion, NoticeAccordionItem} from '@/components/composite/notice-accordion'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '알림 아코디언 (NoticeAccordion)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {NoticeAccordion, NoticeAccordionItem} from '@/components/composite/notice-accordion'

{/* 처음 상태를 주지 않으면 PC(1280 이상)는 펼치고 태블릿·모바일은 접는다 */}
<NoticeAccordion>
  <NoticeAccordionItem>품목을 고른 뒤 [선택] 버튼을 누르면 빈 기술분류 칸에 입력됩니다. (최대 4개)</NoticeAccordionItem>
  <NoticeAccordionItem>선택한 품목을 다시 누르면 해제되며, 검색은 품목명·분야·품목분류에서 찾습니다.</NoticeAccordionItem>
</NoticeAccordion>

{/* 처음 상태를 고정 — 화면 폭과 무관 */}
<NoticeAccordion title="알려드려요" defaultOpen={false}>
  <NoticeAccordionItem>...</NoticeAccordionItem>
</NoticeAccordion>`

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
            <Link key="component" href="/component-guide/info-box" className={LINK_CLASS}>
                InfoBox
            </Link>,
            '제목과 불릿 목록을 항상 펼쳐 둡니다. 상태 색이 없는 중립 패널입니다.',
        ],
    },
    {
        key: 'notice-accordion',
        cells: [
            '모달 · 화면 위쪽에서 접어 둘 수 있는 안내 목록',
            <code key="component">NoticeAccordion</code>,
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
    ['NoticeAccordion', 'title', '제목 줄 글자입니다.', "'꼭 알아두세요'", 'ReactNode'],
    [
        'NoticeAccordion',
        'defaultOpen',
        '처음에 펼칠지 정합니다. 주지 않으면 PC(1280 이상)는 펼치고 태블릿 · 모바일은 접습니다. 한 번 누른 뒤에는 누른 상태를 따릅니다.',
        'undefined',
        'boolean',
    ],
    ['NoticeAccordion', 'open', '여닫기 상태를 바깥에서 제어할 때 씁니다.', 'undefined', 'boolean'],
    ['NoticeAccordion', 'onOpenChange', '여닫을 때 호출됩니다.', 'undefined', '(open: boolean) => void'],
    ['NoticeAccordion', 'className · div props', '패널에 전달합니다.', 'undefined', "ComponentProps<'div'>"],
    ['NoticeAccordionItem', 'children', '불릿 항목 본문입니다.', '-', 'ReactNode'],
    ['NoticeAccordionItem', 'className · li props', '항목에 전달합니다.', 'undefined', "ComponentProps<'li'>"],
] as const

// 알림 아코디언 — 제목 줄을 눌러 안내 목록을 여닫는 회색 패널.
const NoticeAccordionGuidePage = () => (
    <GuidePageShell
        title="알림 아코디언 (NoticeAccordion)"
        description="모달 · 화면 위쪽의 안내 목록을 제목 줄로 여닫는 패널입니다."
    >
        <BaseCard>
            <section aria-labelledby="na-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="na-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        알림 아이콘 · 제목 · 화살표가 한 줄로 서고, 펼치면 아래에 작은 불릿 목록이 나옵니다. 창 폭을
                        1280 아래로 줄이고 새로고침하면 접힌 채로 시작합니다.
                    </p>
                </div>
                <NoticeAccordion>
                    <NoticeAccordionItem>
                        품목을 고른 뒤 [선택] 버튼을 누르면 빈 기술분류 칸에 입력됩니다. (최대 4개)
                    </NoticeAccordionItem>
                    <NoticeAccordionItem>
                        선택한 품목을 다시 누르면 해제되며, 검색은 품목명·분야·품목분류에서 찾습니다.
                    </NoticeAccordionItem>
                </NoticeAccordion>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="na-states" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="na-states" className="typo-h4-bold">
                        처음 상태
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">접힌 채로 시작</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>defaultOpen={false}</code> 는 화면 폭과 무관하게 접습니다.
                        </p>
                        <NoticeAccordion title="접힌 채로 시작" defaultOpen={false}>
                            <NoticeAccordionItem>제목 줄을 누르면 펼쳐집니다.</NoticeAccordionItem>
                        </NoticeAccordion>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">펼친 채로 시작</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>defaultOpen</code> 은 화면 폭과 무관하게 펼칩니다.
                        </p>
                        <NoticeAccordion title="펼친 채로 시작" defaultOpen>
                            <NoticeAccordionItem>항목은 한 개부터 여러 개까지 쌓입니다.</NoticeAccordionItem>
                            <NoticeAccordionItem>
                                긴 문장은 낱말 단위로 줄이 바뀌고, 둘째 줄부터는 점 뒤 글자 시작선에 맞춰 들여 씁니다.
                            </NoticeAccordionItem>
                        </NoticeAccordion>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="na-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="na-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table caption="알림 계열 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="na-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="na-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        제목 줄 전체가 버튼이고, 여닫기 상태(<code>aria-expanded</code>)와 목록 연결(
                        <code>aria-controls</code>)은 Radix Collapsible 이 붙입니다[8.2.1].
                    </li>
                    <li>
                        <kbd>Tab</kbd> 으로 포커스하고 <kbd>Enter</kbd> / <kbd>Space</kbd> 로 여닫습니다. 포커스는
                        외곽선으로 표시됩니다[6.1.1][6.1.2].
                    </li>
                    <li>
                        아이콘 · 화살표는 <code>aria-hidden=&quot;true&quot;</code> 입니다. 화살표 회전은 동작 줄이기
                        설정에서 꺼집니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="na-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="na-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="NoticeAccordion 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default NoticeAccordionGuidePage
