import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '베이스 카드 (BaseCard)'}

const USAGE_CODE = `<BaseCard title="기업정보" action={<Badge color="info">작성중</Badge>}>
  <p>카드 본문 콘텐츠입니다.</p>
</BaseCard>`

const USAGE_CODE_PLAIN = `{/* 헤더 없이 본문만 */}
<BaseCard>
  <p>제목 없이 콘텐츠만 담는 기본 컨테이너입니다.</p>
</BaseCard>`

// Props 설명 — [이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['title', '카드 제목. 값을 전달하면 헤더가 렌더됩니다.', 'undefined', 'ReactNode'],
    ['subtitle', '제목 아래 서브텍스트. title이 있을 때 함께 렌더됩니다.', 'undefined', 'ReactNode'],
    ['action', '헤더 우측 액션. title이 있을 때 함께 렌더됩니다.', 'undefined', 'ReactNode'],
    ['children', '카드 본문 콘텐츠입니다.', '-', 'ReactNode'],
    ['className', 'Card 루트에 추가할 클래스명입니다.', 'undefined', 'string'],
] as const

// 베이스 카드 — ui Card(패딩 24px)를 감싼 도메인 카드(composite/base-card). 제목 헤더는 선택,
// 본문은 필수. 넓은 폼 섹션엔 좌우 패딩이 큰 FormCard 를 쓴다.
const BaseCardGuidePage = () => (
    <GuidePageShell
        title="베이스 카드 (BaseCard)"
        description="패딩 24px의 기본 카드입니다. 제목(+서브텍스트·액션) 헤더는 선택, 본문은 필수."
    >
        <section aria-labelledby="base-card-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="base-card-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    title 을 주면 제목·서브텍스트(좌) / 액션(우) 헤더가 함께 렌더되고, children 이 본문이 됩니다.
                </p>
            </div>
            <BaseCard title="기업정보" action={<Badge color="info">작성중</Badge>} className="max-w-md">
                <p className="typo-body-l-regular text-foreground">카드 본문 콘텐츠입니다.</p>
            </BaseCard>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">헤더 없이 — 본문만</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    title 을 생략하면 헤더 없이 본문만 담는 기본 컨테이너가 된다.
                </p>
            </div>
            <BaseCard className="max-w-md">
                <p className="typo-body-l-regular text-foreground">제목 없이 콘텐츠만 담는 기본 컨테이너입니다.</p>
            </BaseCard>
            <CodeBlock code={USAGE_CODE_PLAIN} language="tsx" copyLabel="복사" />
        </section>

        <BaseCard>
            <section aria-labelledby="base-card-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="base-card-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">BaseCard 에 넘기는 속성입니다.</p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">BaseCard Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Default
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Type
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(([name, description, defaultValue, type]) => (
                                <tr key={name} className="border-border border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BaseCardGuidePage
