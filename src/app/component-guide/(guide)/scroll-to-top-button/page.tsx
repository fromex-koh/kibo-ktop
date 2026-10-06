// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '맨 위로 버튼 (ScrollToTopButton)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const USAGE_CODE = `import {ScrollToTopButton} from '@/components/composite/scroll-to-top-button'

{/* 레이아웃에 한 번만 둔다 — 컴포넌트 가이드는 component-guide/(guide)/layout.tsx 에 있다 */}
<ScrollToTopButton />`

const CUSTOM_LABEL_CODE = `<ScrollToTopButton label="맨 위로 스크롤" />`

const PROPS_ITEMS = [
    ['ScrollToTopButton', 'label', '스크린리더가 읽는 버튼 이름입니다.', "'맨 위로 이동'", 'string'],
    ['ScrollToTopButton', 'className', '버튼에 덧붙일 클래스입니다. 위치를 바꿀 때 씁니다.', '-', 'string'],
] as const

const ScrollToTopButtonGuidePage = () => (
    <GuidePageShell
        title="맨 위로 버튼 (ScrollToTopButton)"
        description="일정 높이 이상 스크롤하면 우측 하단에 나타나는 플로팅 버튼입니다. 누르면 문서 맨 위로 스크롤합니다."
    >
        <BaseCard>
            <section aria-labelledby="sttb-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sttb-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면마다 넣지 않고 레이아웃에 한 번만 둡니다. props 없이 그대로 씁니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">동작</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                문서(<code>window</code>) 스크롤이 400px 를 넘으면 나타납니다. 별도 스크롤 컨테이너 안의
                                스크롤에는 반응하지 않습니다.
                            </li>
                            <li>
                                화면 오른쪽 아래에 고정되는 원형 아이콘 버튼입니다. 누르면 문서 맨 위로 스크롤합니다.
                            </li>
                            <li>이 가이드 화면에도 들어 있습니다. 아래로 스크롤하면 오른쪽 아래에 나타납니다.</li>
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">라벨 바꾸기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            버튼 이름의 기본값은 &quot;맨 위로 이동&quot;입니다. 다른 이름이 필요하면 <code>label</code>{' '}
                            로 바꿉니다.
                        </p>
                        <CodeBlock code={CUSTOM_LABEL_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sttb-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sttb-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        아이콘만 있는 버튼이라 <code>label</code> 이 <code>aria-label</code> 로 들어가고 아이콘은{' '}
                        <code>aria-hidden</code> 입니다[5.1.1].
                    </li>
                    <li>보이지 않을 때는 렌더링되지 않아 화면 밖 버튼이 Tab 순서에 남지 않습니다[6.1.2].</li>
                    <li>모션 감소 설정에서는 나타나는 효과가 꺼지고 맨 위로 즉시 이동합니다[6.3.1].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sttb-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sttb-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ScrollToTopButton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ScrollToTopButtonGuidePage
