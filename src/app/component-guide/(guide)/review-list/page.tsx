import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ReviewList, ReviewItem, ReviewSubItem} from '@/components/composite/review-list'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '검토 목록 (ReviewList)'}

const USAGE_CODE = `{/* 번호는 ReviewList 가 자동으로 매긴다(01·02·…). badge 문자열 = 기본 확인 배지 */}
<ReviewList>
  <ReviewItem badge="확인">
    경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.
  </ReviewItem>
  <ReviewItem badge="확인">
    ① 신청기술은 경쟁사간 기술적 차별화 또는 기술격차로 인해 안정적인 거래처를 확보할 수 있고
    영업적 리스크가 낮다.
  </ReviewItem>
</ReviewList>`

const STATUS_CODE = `{/* 상태별 배지 — 확인(기본)·미응답(neutral)·응답값(secondary-grape). 전부 outline·round·sm */}
<ReviewList>
  <ReviewItem badge="확인">경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.</ReviewItem>
  <ReviewItem badge={<Badge variant="outline" color="neutral" shape="round" size="sm">미응답</Badge>}>
    경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만 해당함)
  </ReviewItem>
  {/* Select 로 답한 값은 문장 속 [값] 표기 + 응답값 배지로 표시한다 */}
  <ReviewItem badge={<Badge variant="outline" color="secondary-grape" shape="round" size="sm">3단계</Badge>}>
    신청기술의 기술성숙도(TRL)는 [3] 단계에 해당한다.
  </ReviewItem>
  <ReviewItem badge={<Badge variant="outline" color="secondary-grape" shape="round" size="sm">성장초기</Badge>}>
    신청기술은 [성장초기] 기술이다.
  </ReviewItem>
</ReviewList>`

const SUB_ITEM_CODE = `{/* 한 번호 아래 여러 하위 행 — 각 행이 자기 상태 배지를 가진다. (1)/(2)는 본문 텍스트 */}
<ReviewList>
  <ReviewItem>
    <ReviewSubItem badge="확인">(1) 신청기술은 동사가 지식재산권을 등록한 기술</ReviewSubItem>
    <ReviewSubItem badge="확인">(2) 또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.</ReviewSubItem>
  </ReviewItem>
</ReviewList>`

const CATEGORY_CODE = `{/* 분류 Badge 하위 행 — category 는 첫 줄 상단, 상태 배지는 행 세로 중앙에 정렬된다 */}
<ReviewList>
  <ReviewItem>
    <ReviewSubItem
      category={<Badge variant="solid-pastel" color="secondary-green" shape="round">제조</Badge>}
      badge="확인"
    >
      신청기술이 적용된 제품 생산 시, 생산과정이 외주가공 또는 자체제작 을 통해 이루어진다.
    </ReviewSubItem>
    <ReviewSubItem
      category={<Badge variant="solid-pastel" color="secondary-grape" shape="round">서비스</Badge>}
      badge="확인"
    >
      신청기술이 적용된 제품/서비스 제작 시, 제작과정이 외주인력 또는 자체인력을 통해 이루어진다.
    </ReviewSubItem>
  </ReviewItem>
</ReviewList>`

const DESCRIPTION_CODE = `{/* 본문 아래 각주 — description. 본문과 붙여(간격 0) 렌더되고 배지는 블록 세로 중앙 */}
<ReviewList>
  <ReviewItem
    description="* '타 분야의 제품/서비스/산업에 적용' 또는 '글로벌 시장으로의 확장(수출)'"
    badge={<Badge variant="outline" color="neutral" shape="round" size="sm">미응답</Badge>}
  >
    신청기술은 확장성*이 구체적으로 존재한다.
  </ReviewItem>
</ReviewList>`

const NO_BADGE_CODE = `{/* badge 를 생략하면 번호 + 내용만 */}
<ReviewList>
  <ReviewItem>제출 서류는 최근 3개월 이내 발급본이어야 합니다.</ReviewItem>
  <ReviewItem>모든 항목은 필수 입력입니다.</ReviewItem>
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
    ['ReviewItem', 'children', '검토할 항목 본문 또는 ReviewSubItem 목록입니다.', '-', 'ReactNode'],
    [
        'ReviewItem',
        'badge',
        '우측 상태 배지입니다. 문자열은 기본 확인 Badge로, ReactNode는 전달한 형태로 표시합니다.',
        'undefined',
        'ReactNode',
    ],
    ['ReviewItem', 'description', '본문 아래 각주 설명입니다. 본문과 붙여 렌더됩니다.', 'undefined', 'ReactNode'],
    [
        'ReviewItem',
        'className · li props',
        '항목 스타일과 네이티브 li 속성을 전달합니다.',
        'undefined',
        'LiHTMLAttributes',
    ],
    ['ReviewSubItem', 'children', '하위 행 본문입니다.', '-', 'ReactNode'],
    [
        'ReviewSubItem',
        'badge',
        '하위 행 우측 상태 배지입니다. ReviewItem badge와 같은 규칙입니다.',
        'undefined',
        'ReactNode',
    ],
    ['ReviewSubItem', 'category', '행 앞에 붙는 분류 Badge입니다. 첫 줄 상단에 정렬됩니다.', 'undefined', 'ReactNode'],
    [
        'ReviewSubItem',
        'className · div props',
        '하위 행 스타일과 네이티브 div 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
] as const

// 검토 목록 — Figma "리스트"(번호 + 확인 내용 + 우측 상태 배지) 반영. 입력·판정된 항목을 검토·확인하는 읽기 전용 목록.
const ReviewListGuidePage = () => (
    <GuidePageShell
        title="검토 목록 (ReviewList)"
        description="입력·판정된 항목을 검토·확인하는 읽기 전용 목록입니다. 각 항목은 [번호 · 확인 내용 · 우측 상태 배지] 행이고, 번호는 자동으로 매겨집니다. 사용자가 직접 답을 채우는 '작성' 목록(QuestionList + Chip 등)과 구분됩니다. 우측 배지는 기존 Badge 컴포넌트를 재사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="rl-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-basic" className="typo-h4-bold">
                        기본
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        번호 + 확인 내용 + <code className="font-mono">확인</code> 배지. 번호는{' '}
                        <code className="font-mono">ReviewList</code> 가 자동으로 매기고, 배지는 여러 줄 본문에서도 내용
                        블록 세로 중앙에 정렬됩니다. ① 같은 원문자 접두는 본문 텍스트로 씁니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem badge="확인">
                            경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.
                        </ReviewItem>
                        <ReviewItem badge="확인">
                            ① 신청기술은 경쟁사간 기술적 차별화 또는 기술격차로 인해 안정적인 거래처를 확보할 수 있고
                            영업적 리스크가 낮다.
                        </ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-status" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-status" className="typo-h4-bold">
                        상태 배지 종류
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        확인(<code className="font-mono">info</code>, 기본) · 미응답(
                        <code className="font-mono">neutral</code>) · 응답값(
                        <code className="font-mono">secondary-grape</code>) 세 종류를 씁니다. Select로 답한 값은 문장 속{' '}
                        <code className="font-mono">[값]</code> 표기와 응답값 배지로 함께 표시합니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem badge="확인">
                            경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.
                        </ReviewItem>
                        <ReviewItem
                            badge={
                                <Badge variant="outline" color="neutral" shape="round" size="sm">
                                    미응답
                                </Badge>
                            }
                        >
                            경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만
                            해당함)
                        </ReviewItem>
                        <ReviewItem
                            badge={
                                <Badge variant="outline" color="secondary-grape" shape="round" size="sm">
                                    3단계
                                </Badge>
                            }
                        >
                            신청기술의 기술성숙도(TRL)는 [3] 단계에 해당한다.
                        </ReviewItem>
                        <ReviewItem
                            badge={
                                <Badge variant="outline" color="secondary-grape" shape="round" size="sm">
                                    성장초기
                                </Badge>
                            }
                        >
                            신청기술은 [성장초기] 기술이다.
                        </ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={STATUS_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-sub-items" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-sub-items" className="typo-h4-bold">
                        복수 하위 항목
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        한 번호 아래 여러 문장이 각자 상태 배지를 가지면{' '}
                        <code className="font-mono">ReviewSubItem</code> 으로 행을 나눕니다. (1)/(2) 같은 하위 번호는
                        본문 텍스트로 씁니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem>
                            <ReviewSubItem badge="확인">(1) 신청기술은 동사가 지식재산권을 등록한 기술</ReviewSubItem>
                            <ReviewSubItem badge="확인">
                                (2) 또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.
                            </ReviewSubItem>
                        </ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={SUB_ITEM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-category" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-category" className="typo-h4-bold">
                        분류 Badge 하위 행
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제조/서비스처럼 행 앞에 분류 Badge가 붙는 케이스는{' '}
                        <code className="font-mono">ReviewSubItem</code> 의 <code className="font-mono">category</code>{' '}
                        슬롯을 씁니다. 분류 Badge는 첫 줄 상단에, 상태 배지는 행 세로 중앙에 정렬됩니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem>
                            <ReviewSubItem
                                category={
                                    <Badge variant="solid-pastel" color="secondary-green" shape="round">
                                        제조
                                    </Badge>
                                }
                                badge="확인"
                            >
                                신청기술이 적용된 제품 생산 시, 생산과정이 외주가공 또는 자체제작 을 통해 이루어진다.
                            </ReviewSubItem>
                            <ReviewSubItem
                                category={
                                    <Badge variant="solid-pastel" color="secondary-grape" shape="round">
                                        서비스
                                    </Badge>
                                }
                                badge="확인"
                            >
                                신청기술이 적용된 제품/서비스 제작 시, 제작과정이 외주인력 또는 자체인력을 통해
                                이루어진다.
                            </ReviewSubItem>
                        </ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={CATEGORY_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-description" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-description" className="typo-h4-bold">
                        각주 설명
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        본문 아래 부연이 필요하면 <code className="font-mono">description</code> 을 씁니다. 본문과
                        붙여(간격 0) 렌더되고, 배지는 본문+각주 블록의 세로 중앙에 정렬됩니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <ReviewList>
                        <ReviewItem
                            description="* '타 분야의 제품/서비스/산업에 적용' 또는 '글로벌 시장으로의 확장(수출)'"
                            badge={
                                <Badge variant="outline" color="neutral" shape="round" size="sm">
                                    미응답
                                </Badge>
                            }
                        >
                            신청기술은 확장성*이 구체적으로 존재한다.
                        </ReviewItem>
                    </ReviewList>
                </div>
                <CodeBlock code={DESCRIPTION_CODE} language="tsx" copyLabel="복사" />
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
            <section aria-labelledby="rl-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="rl-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        ReviewList / ReviewItem / ReviewSubItem 에 넘기는 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ReviewList와 ReviewItem, ReviewSubItem Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ReviewListGuidePage
