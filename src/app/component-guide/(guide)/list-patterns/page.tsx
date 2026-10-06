// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '목록 패턴 (List)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '보여 줄 내용', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'notice',
        cells: [
            '공지사항 (분류 배지 · 제목 · 등록일)',
            <code key="c">NoticeList</code>,
            '고르는 자리 없이 전체를 한 목록으로 봅니다.',
        ],
    },
    {
        key: 'resource',
        cells: [
            '자료실 (분류 배지 · 제목 · 등록일 · [다운로드])',
            <code key="c">ResourceList</code>,
            '고르는 자리 없음.',
        ],
    },
    {
        key: 'faq',
        cells: [
            'FAQ (질문을 펼치면 답변)',
            <code key="c">FaqList</code>,
            '분류 탭(Tabs)으로 거르고 Accordion 으로 펼칩니다.',
        ],
    },
    {
        key: 'inquiry',
        cells: [
            '1:1 문의 내역 (유형 · 제목 · 답변 상태 · 등록일)',
            <code key="c">InquiryList</code>,
            '[문의 등록] 버튼이 목록에 하나 붙습니다.',
        ],
    },
    {
        key: 'evaluation-result',
        cells: [
            '기업 평가결과 조회 (모형명 · 등급/점수 · 평가일 · 결과 버튼)',
            <code key="c">EvaluationResultList</code>,
            '모형 탭(TextTabs)과 조회 필터로 거릅니다.',
        ],
    },
    {
        key: 'org-evaluation-history',
        cells: [
            '기관 평가결과 조회 (개별평가 카드 · 신청 카드)',
            <code key="c">OrgEvaluationHistoryList</code>,
            '모형 탭에 평가 방식(2depth)과 조회 필터가 더해집니다.',
        ],
    },
    {
        key: 'history',
        cells: [
            '날짜 · 상태로 시작하는 한 줄 이력',
            <Link key="c" href="/component-guide/history-list" className={LINK_CLASS}>
                HistoryList
            </Link>,
            '줄 구성만 갖는 조각입니다. 필터 · 페이지 상태는 쓰는 화면이 관리합니다.',
        ],
    },
    {
        key: 'review',
        cells: [
            '입력 · 판정된 항목을 번호순으로 확인',
            <Link key="c" href="/component-guide/review-list" className={LINK_CLASS}>
                ReviewList
            </Link>,
            '읽기 전용 <ol> 입니다. 번호가 자동으로 붙고 우측에 상태 배지가 놓입니다.',
        ],
    },
    {
        key: 'summary',
        cells: [
            '라벨 · 값 요약 카드',
            <Link key="c" href="/component-guide/summary-list" className={LINK_CLASS}>
                SummaryList
            </Link>,
            '읽기 전용 <dl> 입니다. 선택이 필요하면 SelectableSummaryList 를 씁니다.',
        ],
    },
    {
        key: 'selectable-summary',
        cells: [
            '요약 카드 중 하나를 고름',
            <Link key="c" href="/component-guide/selectable-summary-list" className={LINK_CLASS}>
                SelectableSummaryList
            </Link>,
            '라디오 그룹과 요약 카드의 조합입니다.',
        ],
    },
    {
        key: 'info-table',
        cells: [
            '항목 : 값 쌍을 표처럼 촘촘히',
            <Link key="c" href="/component-guide/info-table" className={LINK_CLASS}>
                InfoTable
            </Link>,
            '이름 칸과 값 칸이 있는 조회용 표입니다. 카드형이면 SummaryList 입니다.',
        ],
    },
] as const

const SCREEN_COLUMNS = [
    {key: 'name', header: '화면 목록', align: 'start', rowHeader: true},
    {key: 'pick', header: '고르는 자리', align: 'start', wrap: true},
    {key: 'extra', header: '고유 props', align: 'start', wrap: true},
] as const

const SCREEN_ROWS = [
    {key: 'notice', cells: [<code key="n">NoticeList</code>, '없음', '-']},
    {key: 'resource', cells: [<code key="n">ResourceList</code>, '없음', '-']},
    {key: 'faq', cells: [<code key="n">FaqList</code>, '분류 탭', <code key="e">categories</code>]},
    {key: 'inquiry', cells: [<code key="n">InquiryList</code>, '없음', <code key="e">createHref</code>]},
    {
        key: 'evaluation-result',
        cells: [
            <code key="n">EvaluationResultList</code>,
            '모형 탭 + 조회 필터',
            <span key="e">
                <code>modelTabs</code> · <code>defaultPeriod</code>
            </span>,
        ],
    },
    {
        key: 'org-evaluation-history',
        cells: [
            <code key="n">OrgEvaluationHistoryList</code>,
            '모형 탭 + 평가 방식 + 조회 필터',
            <span key="e">
                <code>modelTabs</code> · <code>defaultPeriod</code>
            </span>,
        ],
    },
] as const

const PAGE_CODE = `const CorpNoticePage = async () => {
  const notices = await getNotices()

  return (
    <main id="main" tabIndex={-1}>
      …
      <NoticeList items={notices} pageSize={10} />
    </main>
  )
}`

const DATA_CODE = `// content/service/<기능>.ts — 목업과 API 의 교체 지점
const MOCK_NOTICES: readonly NoticeItem[] = [ … ]

/** 지금은 목업을 그대로 돌려주고, 연동 후에는 조회 API 응답을 돌려준다. */
const getNotices = (): Promise<readonly NoticeItem[]> => Promise.resolve(MOCK_NOTICES)`

const EMPTY_CODE = `{visibleItems.length > 0 ? (
  <ul>…</ul>
) : (
  <EmptyState title="검색내역이 없습니다." />
)}

{items.length > 0 ? <Pagination … /> : null}`

const PROPS_ITEMS = [
    [
        '화면 목록 6종 공통',
        'items',
        '목록에 그릴 전체 항목입니다. 페이지 나누기는 목록 안에서 처리합니다.',
        '-',
        'readonly Item[]',
    ],
    ['화면 목록 6종 공통', 'pageSize', '한 페이지에 보여 줄 건수입니다. 1 미만이면 1 로 처리합니다.', '10', 'number'],
    ['FaqList', 'categories', '분류 탭 목록입니다. 첫 항목이 처음 고른 탭이 됩니다.', '-', 'readonly FaqCategory[]'],
    [
        'InquiryList',
        'createHref',
        '[문의 등록] 이 가는 화면입니다. 목록에 하나뿐이라 항목이 아니라 목록이 받습니다.',
        '-',
        'string',
    ],
    [
        'EvaluationResultList · OrgEvaluationHistoryList',
        'modelTabs',
        '모형 탭 목록입니다. 화면이 읽어 내려 줍니다.',
        '-',
        'readonly EvaluationModelTab[]',
    ],
    ['EvaluationResultList · OrgEvaluationHistoryList', 'defaultPeriod', '처음 열어 둘 조회기간입니다.', '-', 'string'],
] as const

const ListPatternsGuidePage = () => (
    <GuidePageShell
        title="목록 패턴 (List)"
        description="목록 컴포넌트를 고르는 기준과, 화면 목록 6종(공지사항·자료실·FAQ·1:1 문의·평가결과 조회)이 공유하는 골격과 규칙입니다."
    >
        <BaseCard>
            <section aria-labelledby="list-patterns-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        보여 줄 내용으로 고릅니다. 화면 목록 6종은 <code>@/components/custom</code>, 나머지는{' '}
                        <code>@/components/composite</code> 에 있습니다.
                    </p>
                </div>
                <Table caption="목록 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-shape" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-shape" className="typo-h4-bold">
                        화면 목록 6종
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        담기는 값만 다르고 골격이 같으며, 각 조각은 공통 컴포넌트를 그대로 씁니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">공통 골격</h3>
                        <ol className="typo-body-l-regular text-label-foreground flex list-decimal flex-col gap-2 pl-5">
                            <li>
                                <strong className="text-foreground">고르는 자리</strong> — 탭(Tabs · TextTabs) 또는 조회
                                필터(SearchFilterForm). 없는 목록도 있습니다.
                            </li>
                            <li>
                                <strong className="text-foreground">항목</strong> — 한 건이 <code>li</code> 하나입니다.
                                줄로 나열하는 목록은 Separator, 카드로 세우는 목록은 BaseCard 를 씁니다.
                            </li>
                            <li>
                                <strong className="text-foreground">빈 상태</strong> — 항목이 없으면{' '}
                                <Link href="/component-guide/empty-state" className={LINK_CLASS}>
                                    EmptyState
                                </Link>
                                가 대신합니다.
                            </li>
                            <li>
                                <strong className="text-foreground">페이지 이동</strong> —{' '}
                                <Link href="/component-guide/pagination" className={LINK_CLASS}>
                                    Pagination
                                </Link>
                                . 모바일에서는 <code>compact</code> 로 그립니다.
                            </li>
                        </ol>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>InquiryList</code> · <code>EvaluationResultList</code> 는 목록 위에 “총 N건”도
                            그립니다.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">목록별 차이</h3>
                        <Table
                            caption="화면 목록 6종의 고르는 자리와 고유 props"
                            columns={SCREEN_COLUMNS}
                            rows={SCREEN_ROWS}
                            size="md"
                        />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">데이터를 넘기는 방식</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            목록은 받은 것만 그립니다. 목업인지 API 응답인지는{' '}
                            <code>content/service/&lt;기능&gt;.ts</code> 한 곳이 정하므로 연동할 때 화면과 목록
                            컴포넌트는 고치지 않습니다.
                        </p>
                        <CodeBlock code={PAGE_CODE} language="tsx" copyLabel="복사" />
                        <CodeBlock code={DATA_CODE} language="ts" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">지키는 규칙</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                <strong className="text-foreground">건수와 페이지는 거른 결과 기준</strong> — 탭이나
                                필터로 거르면 페이지 수도 함께 바뀝니다.
                            </li>
                            <li>
                                <strong className="text-foreground">빈 배열이 곧 빈 상태</strong> — 결과 없는 화면을
                                따로 만들지 않습니다. 목업 배열을 비우면 그대로 확인됩니다.
                            </li>
                            <li>
                                <strong className="text-foreground">항목마다 다른 주소는 항목이 든다</strong> — 상세
                                경로는 각 항목의 <code>href</code> 이고, 목록에 하나뿐인 버튼(문의 등록)만 목록이
                                받습니다.
                            </li>
                        </ul>
                        <CodeBlock code={EMPTY_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        항목은 <code>ul</code> / <code>li</code> 로 그려 건수와 순서가 읽힙니다[7.3.1].
                    </li>
                    <li>
                        빈 상태(EmptyState)는 <code>role=&quot;status&quot;</code> 로 알립니다[8.2.1].
                    </li>
                    <li>
                        모형 탭으로 거르는 목록은 바뀌는 영역에 <code>role=&quot;tabpanel&quot;</code> 을 두고 탭과{' '}
                        <code>aria-controls</code> 로 잇습니다[8.2.1].
                    </li>
                    <li>
                        페이지를 넘기면 맨 위로 올라가며, 모션 감소 설정이면 부드러운 스크롤 없이 즉시 올립니다[6.3.1].
                    </li>
                    <li>
                        상태는 배지 글자를 함께 두어 색만으로 전하지 않습니다[5.3.1]. 링크 글자는 목적지를 알 수 있어야
                        합니다[6.4.3].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">화면 목록 6종의 props 입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="화면 목록 6종 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ListPatternsGuidePage
