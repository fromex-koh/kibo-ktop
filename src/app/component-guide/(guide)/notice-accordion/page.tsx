import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {NoticeAccordion, NoticeAccordionItem} from '@/components/composite/notice-accordion'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '알림 아코디언 (NoticeAccordion)'}

const USAGE_CODE = `import {NoticeAccordion, NoticeAccordionItem} from '@/components/composite/notice-accordion'

{/* 기본 — PC(1280 이상)는 펼치고, 태블릿·모바일은 접힌 채로 시작 */}
<NoticeAccordion>
  <NoticeAccordionItem>품목을 고른 뒤 [선택] 버튼을 누르면 빈 기술분류 칸에 입력됩니다. (최대 4개)</NoticeAccordionItem>
  <NoticeAccordionItem>선택한 품목을 다시 누르면 해제되며, 검색은 품목명·분야·품목분류에서 찾습니다.</NoticeAccordionItem>
</NoticeAccordion>

{/* 처음 상태를 고정 — 화면 폭과 무관 */}
<NoticeAccordion title="알려드려요" defaultOpen={false}>
  <NoticeAccordionItem>...</NoticeAccordionItem>
</NoticeAccordion>`

const PROPS_ITEMS = [
    ['NoticeAccordion', 'title', '제목 줄 글자입니다.', "'꼭 알아두세요'", 'ReactNode'],
    [
        'NoticeAccordion',
        'defaultOpen',
        '처음에 펼칠지 정합니다. 주지 않으면 PC(1280 이상)는 펼치고 태블릿·모바일은 접습니다.',
        'undefined',
        'boolean',
    ],
    [
        'NoticeAccordion',
        'open · onOpenChange',
        '여닫기 상태를 바깥에서 쥘 때 씁니다.',
        'undefined',
        'boolean · (open: boolean) => void',
    ],
    [
        'NoticeAccordion',
        'className · div props',
        '패널 스타일과 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    ['NoticeAccordionItem', 'children', '불릿 항목 본문입니다.', '-', 'ReactNode'],
    [
        'NoticeAccordionItem',
        'className · li props',
        '항목 스타일과 네이티브 li 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'li'>",
    ],
] as const

// 알림 아코디언 — 제목 줄을 눌러 안내 목록을 여닫는 회색 패널. 혁신성장영위기업 분류근거 모달의 "꼭 알아두세요".
const NoticeAccordionGuidePage = () => (
    <GuidePageShell
        title="알림 아코디언 (NoticeAccordion)"
        description="모달·화면 위쪽의 안내 목록을 제목 줄로 여닫는 패널입니다. 처음 상태는 화면 폭을 따라 PC 는 펼치고 태블릿·모바일은 접습니다."
    >
        <BaseCard>
            <section aria-labelledby="na-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="na-basic" className="typo-h4-bold">
                        기본
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        회색 면(반경 8 · 여백 20)에 알림 아이콘 · 제목 · 여닫는 화살표가 한 줄로 서고, 펼치면 아래 8
                        간격으로 14px 불릿 목록이 나옵니다. 창 폭을 1280 아래로 줄인 뒤 새로고침하면 접힌 채로
                        시작합니다.
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
            <section aria-labelledby="na-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="na-cases" className="typo-h4-bold">
                        케이스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">defaultOpen</code>을 주면 화면 폭과 무관하게 처음 상태가 고정됩니다.
                        제목은 <code className="font-mono">title</code>로 바꿉니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <NoticeAccordion title="접힌 채로 시작 (defaultOpen={false})" defaultOpen={false}>
                        <NoticeAccordionItem>제목 줄을 누르면 펼쳐집니다.</NoticeAccordionItem>
                    </NoticeAccordion>
                    <NoticeAccordion title="펼친 채로 시작 (defaultOpen)" defaultOpen>
                        <NoticeAccordionItem>항목은 한 개부터 여러 개까지 쌓입니다.</NoticeAccordionItem>
                        <NoticeAccordionItem>
                            긴 문장은 낱말 단위로 줄이 바뀌고, 둘째 줄부터는 점 뒤 글자 시작선에 맞춰 들여 씁니다. 좁은
                            화면에서 확인해 보세요.
                        </NoticeAccordionItem>
                    </NoticeAccordion>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="na-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="na-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground list-disc pl-5">
                        <li>
                            제목 줄 전체가 버튼입니다. 여닫기 상태(<code className="font-mono">aria-expanded</code>)와
                            목록 연결(<code className="font-mono">aria-controls</code>)은 radix Collapsible 이 붙입니다.
                        </li>
                        <li>아이콘·화살표는 장식이라 스크린리더에서 숨깁니다.</li>
                        <li>화살표 회전 애니메이션은 동작 줄이기 설정에서 꺼집니다.</li>
                    </ul>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="na-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="na-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        NoticeAccordion 컨테이너와 NoticeAccordionItem 항목에 전달하는 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="NoticeAccordion 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default NoticeAccordionGuidePage
