import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {ReviewList, ReviewItem} from '@/components/composite/review-list'
import {Badge} from '@/components/kit/badge'

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

// 조합 API 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    ['ReviewList · children', 'ReviewItem 항목들. 순번은 순서대로 자동 부여된다(01·02·…).', 'ReactNode'],
    ['ReviewItem · children', '항목 본문(확인할 내용, 16px).', 'ReactNode'],
    [
        'ReviewItem · badge',
        '우측 배지(선택). 문자열이면 기본 확인 배지(outline·info·pill·sm)로, 엘리먼트면 그대로 렌더. 생략하면 배지 없음.',
        'ReactNode',
    ],
] as const

// 검토 목록 — Figma "li"(번호 + 확인 내용 + 확인 배지) 반영. 입력·판정된 항목을 검토·확인하는 읽기 전용 목록.
const ReviewListGuidePage = () => (
    <GuidePageShell
        title="검토 목록 (ReviewList)"
        description="입력·판정된 항목을 검토·확인하는 읽기 전용 목록입니다. 각 항목은 [번호 · 확인 내용 · 우측 확인 배지] 한 줄이고, 번호는 자동으로 매겨집니다. 사용자가 직접 답을 채우는 '작성' 목록(Chip 등)과 구분됩니다. 우측 배지는 기존 Badge 컴포넌트를 재사용합니다."
    >
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

        <section aria-labelledby="rl-custom-badge" className="flex flex-col gap-4">
            <div>
                <h2 id="rl-custom-badge" className="typo-h4-bold">
                    커스텀 배지
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">badge</code> 에 <code className="font-mono">Badge</code> 엘리먼트를 직접
                    넘기면 색·라벨을 바꿀 수 있습니다.
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

        <section aria-labelledby="rl-props" className="flex flex-col gap-4">
            <div>
                <h2 id="rl-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    ReviewList / ReviewItem 에 넘기는 속성입니다.
                </p>
            </div>
            <dl className="flex flex-col gap-2">
                {PROPS_ITEMS.map(([name, desc, type]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">
                            {name}
                            <span className="text-muted-foreground ml-2 font-normal">{type}</span>
                        </dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default ReviewListGuidePage
