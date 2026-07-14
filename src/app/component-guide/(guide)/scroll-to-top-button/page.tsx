import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'

export const metadata: Metadata = {title: '맨 위로 버튼 (ScrollToTopButton)'}

const USAGE_CODE = `{/* 컴포넌트 가이드 셸(component-guide/(guide)/layout.tsx)에 한 번만 마운트되어 있다 */}
<ScrollToTopButton />`

const CUSTOM_LABEL_CODE = `<ScrollToTopButton label="맨 위로 스크롤" />`

// 조합 API 설명 — [이름, 설명, 타입, 기본값]
const PROPS_ITEMS = [
    ['label', '아이콘 전용 버튼의 접근성 라벨([5.1.1]).', 'string', "'맨 위로 이동'"],
    ['className', '추가 클래스명으로 위치·스타일 확장', 'string', '-'],
] as const

// 맨 위로 버튼 — 스크롤이 SCROLL_THRESHOLD_PX(400px)를 넘으면 우측 하단에 나타나는 플로팅 버튼.
// 화면마다 각자 두지 않고 컴포넌트 가이드 셸(layout.tsx)에 한 번만 마운트해 모든 가이드 페이지가 공유한다 —
// 지금 이 페이지도 아래로 스크롤하면 우측 하단에서 실제 동작을 확인할 수 있다.
const ScrollToTopButtonGuidePage = () => (
    <GuidePageShell
        title="맨 위로 버튼 (ScrollToTopButton)"
        description="일정 높이 이상 스크롤하면 우측 하단에 나타나는 플로팅 버튼입니다. 누르면 문서 맨 위로 스크롤합니다."
    >
        <section aria-labelledby="sttb-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="sttb-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    이 페이지를 <code className="font-mono">400px</code> 이상 아래로 스크롤해 보세요 — 우측 하단에
                    버튼이 나타납니다. 개별 화면마다 넣지 않고, 컴포넌트 가이드 셸에 한 번만 마운트해 모든 페이지가
                    공유합니다.
                </p>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sttb-behavior" className="flex flex-col gap-4">
            <div>
                <h2 id="sttb-behavior" className="typo-h4-bold">
                    동작
                </h2>
            </div>
            <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                <li>
                    스크롤 리스너는 <code className="font-mono">window</code> 기준입니다. 프로젝트 레이아웃은 별도
                    스크롤 컨테이너 없이 문서 자체가 스크롤됩니다.
                </li>
                <li>
                    보이지 않을 때는 DOM 에서 아예 제거됩니다 — 화면 밖에 숨겨진 버튼이 Tab 순서에 남아 포커스를 받는
                    것을 막기 위함입니다([6.1.2]).
                </li>
                <li>
                    클릭하면 맨 위로 스크롤합니다. <code className="font-mono">prefers-reduced-motion</code> 을
                    존중해([6.3.1]) 이 설정이 켜져 있으면 부드러운 스크롤 대신 즉시 이동합니다.
                </li>
                <li>
                    아이콘만 있는 버튼이라 <code className="font-mono">aria-label</code> 로 용도를 알리고 내부 아이콘은{' '}
                    <code className="font-mono">aria-hidden</code> 입니다([5.1.1]).
                </li>
            </ul>
        </section>

        <section aria-labelledby="sttb-label" className="flex flex-col gap-4">
            <div>
                <h2 id="sttb-label" className="typo-h4-bold">
                    라벨 커스텀
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본 라벨은 &quot;맨 위로 이동&quot;입니다. 문맥에 맞게 바꿀 수 있습니다.
                </p>
            </div>
            <CodeBlock code={CUSTOM_LABEL_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sttb-props" className="flex flex-col gap-4">
            <div>
                <h2 id="sttb-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">ScrollToTopButton 에 넘기는 속성입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Type
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {PROPS_ITEMS.map(([name, desc, type, defaultValue]) => (
                            <tr key={name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{desc}</td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {type}
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {defaultValue}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default ScrollToTopButtonGuidePage
