// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ReviewList, ReviewItem, ReviewSubItem} from '@/components/composite/review-list'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '검토 목록 (ReviewList)'}

const USAGE_CODE = `import {ReviewList, ReviewItem, ReviewSubItem} from '@/components/composite/review-list'

{/* 번호는 ReviewList 가 자동으로 매긴다(01·02·…). badge 문자열 = 기본 확인 배지 */}
<ReviewList>
  <ReviewItem badge="확인">
    경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.
  </ReviewItem>
  <ReviewItem badge="확인">
    ① 신청기술은 경쟁사간 기술적 차별화 또는 기술격차로 인해 안정적인 거래처를 확보할 수 있고
    영업적 리스크가 낮다.
  </ReviewItem>
</ReviewList>`

const STATUS_CODE = `{/* 상태별 배지 — 확인(기본)·미응답(neutral)·응답값(secondary-purple). 전부 outline·round·sm */}
<ReviewList>
  <ReviewItem badge="확인">경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.</ReviewItem>
  <ReviewItem badge={<Badge variant="outline" color="neutral" shape="round" size="sm">미응답</Badge>}>
    경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만 해당함)
  </ReviewItem>
  {/* Select 로 답한 값은 문장 속 [값] 표기 + 응답값 배지로 표시한다 */}
  <ReviewItem badge={<Badge variant="outline" color="secondary-purple" shape="round" size="sm">3단계</Badge>}>
    신청기술의 기술성숙도(TRL)는 [3] 단계에 해당한다.
  </ReviewItem>
  <ReviewItem badge={<Badge variant="outline" color="secondary-purple" shape="round" size="sm">성장초기</Badge>}>
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
      category={<Badge variant="solid-pastel" color="secondary-purple" shape="round">서비스</Badge>}
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

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'review-list',
        cells: [
            '입력·판정된 항목을 번호 순서로 확인',
            <code key="component">ReviewList</code>,
            '번호·본문·상태 배지 행입니다. 번호는 자동으로 매겨집니다.',
        ],
    },
    {
        key: 'history-list',
        cells: [
            '날짜·상태·제목·동작 버튼이 있는 건별 이력',
            <Link key="component" href="/component-guide/history-list" className={LINK_CLASS}>
                HistoryList
            </Link>,
            '마이페이지 조회 결과처럼 한 건이 한 줄 묶음입니다. 구분선으로 항목을 나눕니다.',
        ],
    },
    {
        key: 'summary-list',
        cells: [
            '라벨과 값 쌍을 카드 하나에 나열',
            <Link key="component" href="/component-guide/summary-list" className={LINK_CLASS}>
                SummaryList
            </Link>,
            '<dl> 정의 목록입니다. 값은 오른쪽 정렬이며 편집은 하지 않습니다.',
        ],
    },
    {
        key: 'selectable-summary-list',
        cells: [
            '요약 카드 여럿 중 하나를 라디오로 선택',
            <Link key="component" href="/component-guide/selectable-summary-list" className={LINK_CLASS}>
                SelectableSummaryList
            </Link>,
            'SummaryList 카드에 라디오를 더한 형태입니다.',
        ],
    },
    {
        key: 'info-table',
        cells: [
            '항목과 값을 한 줄에 두 쌍씩 촘촘히 표시',
            <Link key="component" href="/component-guide/info-table" className={LINK_CLASS}>
                InfoTable
            </Link>,
            '이름 칸과 값 칸이 있는 조회용 표입니다.',
        ],
    },
    {
        key: 'list-patterns',
        cells: [
            '공지·자료실·FAQ 같은 게시형 목록',
            <Link key="component" href="/component-guide/list-patterns" className={LINK_CLASS}>
                List 패턴
            </Link>,
            '화면별 목록 골격 규칙을 모아 둔 문서입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['ReviewList', 'children', 'ReviewItem 목록입니다. 순번을 01부터 자동 주입합니다.', '-', 'ReactNode'],
    ['ReviewList', '...props', '목록 스타일과 네이티브 ol 속성을 전달합니다.', 'undefined', 'OlHTMLAttributes'],
    ['ReviewItem', 'index', 'ReviewList 가 자동으로 넣는 순번입니다. 직접 넘기지 않습니다.', '1', 'number'],
    ['ReviewItem', 'children', '검토할 항목 본문 또는 ReviewSubItem 목록입니다.', '-', 'ReactNode'],
    [
        'ReviewItem',
        'badge',
        '우측 상태 배지입니다. 문자열은 기본 확인 Badge로, ReactNode는 전달한 형태로 표시합니다.',
        'undefined',
        'ReactNode',
    ],
    ['ReviewItem', 'description', '본문 아래 각주 설명입니다. 본문과 붙여 렌더됩니다.', 'undefined', 'ReactNode'],
    ['ReviewItem', '...props', '항목 스타일과 네이티브 li 속성을 전달합니다.', 'undefined', 'LiHTMLAttributes'],
    ['ReviewSubItem', 'children', '하위 행 본문입니다.', '-', 'ReactNode'],
    [
        'ReviewSubItem',
        'badge',
        '하위 행 우측 상태 배지입니다. ReviewItem badge와 같은 규칙입니다.',
        'undefined',
        'ReactNode',
    ],
    ['ReviewSubItem', 'category', '행 앞에 붙는 분류 Badge입니다. 첫 줄 상단에 정렬됩니다.', 'undefined', 'ReactNode'],
    ['ReviewSubItem', '...props', '하위 행 스타일과 네이티브 div 속성을 전달합니다.', 'undefined', 'HTMLAttributes'],
] as const

const ReviewListGuidePage = () => (
    <GuidePageShell
        title="검토 목록 (ReviewList)"
        description="입력·판정된 항목을 번호 순서로 확인하는 읽기 전용 목록입니다. 한 행은 번호, 본문, 우측 상태 배지로 이뤄집니다."
    >
        <BaseCard>
            <section aria-labelledby="rl-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rl-basic" className="typo-h4-bold">
                        기본 사용과 변형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        번호는 <code>ReviewList</code> 가 자식 순서대로 01부터 자동으로 매깁니다. 사용처에서 번호를 적지
                        않습니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">기본</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            번호와 본문, <code>badge</code> 문자열이 기본 확인 배지(<code>info</code>)가 됩니다.
                        </p>
                        <div className="border-border rounded-md border p-6">
                            <ReviewList>
                                <ReviewItem badge="확인">
                                    경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.
                                </ReviewItem>
                                <ReviewItem badge="확인">
                                    ① 신청기술은 경쟁사간 기술적 차별화 또는 기술격차로 인해 안정적인 거래처를 확보할 수
                                    있고 영업적 리스크가 낮다.
                                </ReviewItem>
                            </ReviewList>
                        </div>
                        <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태별 배지</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            배지에 엘리먼트를 넘기면 그대로 그립니다. 미응답은 <code>neutral</code>, 응답값은{' '}
                            <code>secondary-purple</code> 입니다.
                        </p>
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
                                    경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한
                                    경우만 해당함)
                                </ReviewItem>
                                <ReviewItem
                                    badge={
                                        <Badge variant="outline" color="secondary-purple" shape="round" size="sm">
                                            3단계
                                        </Badge>
                                    }
                                >
                                    신청기술의 기술성숙도(TRL)는 [3] 단계에 해당한다.
                                </ReviewItem>
                                <ReviewItem
                                    badge={
                                        <Badge variant="outline" color="secondary-purple" shape="round" size="sm">
                                            성장초기
                                        </Badge>
                                    }
                                >
                                    신청기술은 [성장초기] 기술이다.
                                </ReviewItem>
                            </ReviewList>
                        </div>
                        <CodeBlock code={STATUS_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">하위 행</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            한 번호 아래 문장마다 상태가 다르면 <code>ReviewSubItem</code> 으로 나눕니다. 번호는 첫 행에
                            맞춰집니다.
                        </p>
                        <div className="border-border rounded-md border p-6">
                            <ReviewList>
                                <ReviewItem>
                                    <ReviewSubItem badge="확인">
                                        (1) 신청기술은 동사가 지식재산권을 등록한 기술
                                    </ReviewSubItem>
                                    <ReviewSubItem badge="확인">
                                        (2) 또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.
                                    </ReviewSubItem>
                                </ReviewItem>
                            </ReviewList>
                        </div>
                        <CodeBlock code={SUB_ITEM_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">분류 배지</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>category</code> 는 행 앞 분류 배지 자리입니다. 첫 줄 상단에 맞춰집니다.
                        </p>
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
                                        신청기술이 적용된 제품 생산 시, 생산과정이 외주가공 또는 자체제작 을 통해
                                        이루어진다.
                                    </ReviewSubItem>
                                    <ReviewSubItem
                                        category={
                                            <Badge variant="solid-pastel" color="secondary-purple" shape="round">
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
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">각주</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>description</code> 은 본문 바로 아래에 붙고, 상태 배지는 본문과 각주 블록의 세로
                            중앙에 놓입니다.
                        </p>
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
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">배지 없음</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>badge</code> 를 생략하면 번호와 본문만 그립니다.
                        </p>
                        <div className="border-border rounded-md border p-6">
                            <ReviewList>
                                <ReviewItem>제출 서류는 최근 3개월 이내 발급본이어야 합니다.</ReviewItem>
                                <ReviewItem>모든 항목은 필수 입력입니다.</ReviewItem>
                            </ReviewList>
                        </div>
                        <CodeBlock code={NO_BADGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rl-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이름이 비슷한 목록이 많습니다. 담는 내용으로 고릅니다.
                    </p>
                </div>
                <Table caption="목록 컴포넌트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rl-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        구조와 읽기 순서는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>ol</code> · <code>li</code> 로 마크업해 항목 순서가 전달됩니다. 화면의 번호는{' '}
                        <code>aria-hidden</code> 이라 중복해서 읽지 않습니다[7.3.1].
                    </li>
                    <li>상태는 배지 글자로 전달하며 색에만 의존하지 않습니다[5.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rl-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rl-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ReviewList</code> · <code>ReviewItem</code> · <code>ReviewSubItem</code> 의 속성입니다. 각
                        요소의 네이티브 속성(<code>ol</code> · <code>li</code> · <code>div</code>)도 그대로 넘길 수
                        있습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ReviewList와 ReviewItem, ReviewSubItem Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ReviewListGuidePage
