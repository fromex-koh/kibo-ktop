import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {ReviewList, ReviewItem} from '@/components/composite/review-list'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '검토 목록 (ReviewList)'}

const USAGE_CODE = `{/* 번호는 ReviewList 가 자동으로 매긴다(01·02·…). 우측 배지는 badge 문자열로 */}
<ReviewList>
  <ReviewItem badge="확인">
    경영주는 최근 3년 내 벤처기업 확인을 받은 이력이 있다.
  </ReviewItem>
  <ReviewItem badge="확인">
    경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만 해당함)
  </ReviewItem>
  <ReviewItem badge="확인">
    경영주는 기술보증기금 또는 신용보증기금의 보증을 받은 이력이 있다.
  </ReviewItem>
</ReviewList>`

const NO_BADGE_CODE = `{/* badge 를 생략하면 번호 + 내용만 */}
<ReviewList>
  <ReviewItem>제출 서류는 최근 3개월 이내 발급본이어야 합니다.</ReviewItem>
  <ReviewItem>모든 항목은 필수 입력입니다.</ReviewItem>
</ReviewList>`

const CUSTOM_BADGE_CODE = `{/* badge 에 엘리먼트를 넘기면 그대로 렌더 — 색·라벨을 바꿀 수 있다 */}
<ReviewList>
  <ReviewItem badge={<Badge variant="outline" color="success" shape="pill" size="sm">확인</Badge>}>
    개인정보 수집·이용에 동의했습니다.
  </ReviewItem>
  <ReviewItem badge={<Badge variant="outline" color="error" shape="pill" size="sm">미응답</Badge>}>
    사업자등록증 사본을 첨부했습니다.
  </ReviewItem>
</ReviewList>`

// 조합 API 설명 — [컴포넌트, 이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['ReviewList', 'children', 'ReviewItem 목록입니다. 순번을 01부터 자동 주입합니다.', '-', 'ReactNode'],
    [
        'ReviewList',
        'className · ol props',
        '목록 스타일과 네이티브 ol 속성을 전달합니다.',
        'undefined',
        'OlHTMLAttributes',
    ],
    ['ReviewItem', 'children', '검토할 항목 본문입니다.', '-', 'ReactNode'],
    [
        'ReviewItem',
        'badge',
        '문자열은 기본 확인 Badge로, ReactNode는 전달한 형태로 표시합니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'ReviewItem',
        'className · li props',
        '항목 스타일과 네이티브 li 속성을 전달합니다.',
        'undefined',
        'LiHTMLAttributes',
    ],
] as const

const PropsTable = ({
    items,
    caption,
}: {
    items: readonly (readonly [string, string, string, string, string])[]
    caption: string
}) => (
    <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-left">
            <caption className="sr-only">{caption}</caption>
            <thead>
                <tr className="border-border bg-card border-b">
                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                        Component
                    </th>
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
                {items.map(([component, name, description, defaultValue, type]) => (
                    <tr key={`${component}-${name}`} className="border-border border-b last:border-b-0">
                        <td className="typo-body-l-regular text-foreground px-4 py-3 font-mono">{component}</td>
                        <th scope="row" className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono">
                            {name}
                        </th>
                        <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">{description}</td>
                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                            {defaultValue}
                        </td>
                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">{type}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

// 검토 목록 — Figma "li"(번호 + 확인 내용 + 확인 배지) 반영. 입력·판정된 항목을 검토·확인하는 읽기 전용 목록.
const ReviewListGuidePage = () => (
    <GuidePageShell
        title="검토 목록 (ReviewList)"
        description="입력·판정된 항목을 검토·확인하는 읽기 전용 목록입니다. 각 항목은 [번호 · 확인 내용 · 우측 확인 배지] 한 줄이고, 번호는 자동으로 매겨집니다. 사용자가 직접 답을 채우는 '작성' 목록(Chip 등)과 구분됩니다. 우측 배지는 기존 Badge 컴포넌트를 재사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="rl-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-basic" className="typo-h4-bold">
                        기본
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        번호 + 확인 내용 + <code className="font-mono">확인</code> 배지. Figma 케이스입니다. 번호는{' '}
                        <code className="font-mono">ReviewList</code> 가 자동으로 매깁니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem badge="확인">경영주는 최근 3년 내 벤처기업 확인을 받은 이력이 있다.</ReviewItem>
                        <ReviewItem badge="확인">
                            경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만
                            해당함)
                        </ReviewItem>
                        <ReviewItem badge="확인">
                            경영주는 기술보증기금 또는 신용보증기금의 보증을 받은 이력이 있다.
                        </ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-no-badge" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-no-badge" className="typo-h4-bold">
                        배지 없이
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">badge</code> 를 생략하면 번호 + 내용만 표시됩니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem>제출 서류는 최근 3개월 이내 발급본이어야 합니다.</ReviewItem>
                        <ReviewItem>모든 항목은 필수 입력입니다.</ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={NO_BADGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-custom-badge" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-custom-badge" className="typo-h4-bold">
                        커스텀 배지
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">badge</code> 에 <code className="font-mono">Badge</code> 엘리먼트를
                        직접 넘기면 색·라벨을 바꿀 수 있습니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem
                            badge={
                                <Badge variant="outline" color="success" shape="pill" size="sm">
                                    확인
                                </Badge>
                            }
                        >
                            개인정보 수집·이용에 동의했습니다.
                        </ReviewItem>
                        <ReviewItem
                            badge={
                                <Badge variant="outline" color="error" shape="pill" size="sm">
                                    미응답
                                </Badge>
                            }
                        >
                            사업자등록증 사본을 첨부했습니다.
                        </ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={CUSTOM_BADGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        ReviewList / ReviewItem 에 넘기는 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ReviewList와 ReviewItem Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ReviewListGuidePage
