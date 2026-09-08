import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '목록 패턴 (List)'}

// 화면별 목록 6종은 담기는 값만 다르고 골격이 같다 — 그 골격과 서로 다른 지점을 한 자리에서 비교한다.
const LISTS = [
    {
        key: 'NoticeList',
        where: '기업·기관 공지사항',
        item: '분류 배지 · 제목(+중요공지·N 배지) · 등록일',
        pick: '없음 — 전체를 한 목록으로 본다',
        extra: '-',
    },
    {
        key: 'ResourceList',
        where: '기업·기관 자료실',
        item: '분류 배지 · 제목 · 등록일 · [다운로드]',
        pick: '없음',
        extra: '-',
    },
    {
        key: 'FaqList',
        where: '기업·기관 FAQ',
        item: '질문(펼치면 답변) — Accordion',
        pick: '분류 탭(Tabs)',
        extra: 'categories',
    },
    {
        key: 'InquiryList',
        where: '기업·기관 1:1 문의 내역',
        item: '유형 · 제목 · 답변 상태 배지 · 등록일',
        pick: '없음',
        extra: 'createHref([문의 등록]이 가는 화면)',
    },
    {
        key: 'EvaluationResultList',
        where: '기업 마이페이지 › 평가결과 조회',
        item: '모형명 · 등급/점 배지 · 평가일 · 결과를 여는 버튼들',
        pick: '모형 탭(TextTabs) + 조회 필터',
        extra: 'modelTabs · defaultPeriod',
    },
    {
        key: 'OrgEvaluationHistoryList',
        where: '기관 마이페이지 › 평가결과 조회',
        item: '개별평가 카드 / 신청 카드(상태 배지 · N개 기업 · 신청 정보)',
        pick: '모형 탭 + 평가 방식(2depth) + 조회 필터',
        extra: 'modelTabs · defaultPeriod',
    },
] as const

const LIST_COLUMNS = [
    {key: 'name', header: '목록', align: 'start', rowHeader: true},
    {key: 'where', header: '쓰는 곳', align: 'start', wrap: true},
    {key: 'item', header: '항목 한 줄에 담기는 것', align: 'start', wrap: true},
    {key: 'pick', header: '고르는 방법', align: 'start', wrap: true},
    {key: 'extra', header: 'items·pageSize 외 props', align: 'start', wrap: true},
] as const

const LIST_ROWS = LISTS.map((list) => ({
    key: list.key,
    cells: [<code key="name">{list.key}</code>, list.where, list.item, list.pick, list.extra],
}))

const PAGE_CODE = `// 화면(page.tsx) — 데이터를 읽어 목록에 넘기기만 한다
const CorpNoticePage = async () => {
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
  // 빈 배열을 넘기면 그대로 확인할 수 있다 — 결과 없는 화면을 따로 만들지 않는다
  <EmptyState title="검색내역이 없습니다." />
)}

{items.length > 0 ? <Pagination … /> : null}`

const PROPS_ITEMS = [
    ['공통', 'items', '목록에 그릴 전체 항목입니다. 페이지 나누기는 목록 안에서 처리합니다.', '-', 'readonly Item[]'],
    ['공통', 'pageSize', '한 페이지에 보여 줄 건수입니다.', '10', 'number'],
    ['FaqList', 'categories', '분류 탭 목록입니다. 첫 항목이 처음 고른 탭이 됩니다.', '-', 'readonly FaqCategory[]'],
    [
        'InquiryList',
        'createHref',
        '[문의 등록] 이 가는 화면입니다. 목록에 하나뿐이라 항목이 아니라 목록이 받습니다.',
        '-',
        'string',
    ],
    [
        'EvaluationResultList',
        'modelTabs',
        '모형 탭 목록입니다. 화면이 읽어 내려 주고 목록은 값의 출처를 알지 않습니다.',
        '-',
        'readonly EvaluationModelTab[]',
    ],
    ['EvaluationResultList', 'defaultPeriod', '처음 고른 상태로 열어 둘 조회기간입니다.', '-', 'string'],
    [
        'OrgEvaluationHistoryList',
        'modelTabs',
        'EvaluationResultList 와 같습니다.',
        '-',
        'readonly EvaluationModelTab[]',
    ],
    ['OrgEvaluationHistoryList', 'defaultPeriod', 'EvaluationResultList 와 같습니다.', '-', 'string'],
] as const

const ListPatternsGuidePage = () => (
    <GuidePageShell
        title="목록 패턴 (List)"
        description="화면마다 담기는 값은 다르지만 목록의 골격은 같습니다. 공지사항·자료실·FAQ·1:1 문의·평가결과 조회 여섯 목록이 공유하는 규칙과 서로 다른 지점을 한자리에 모았습니다."
    >
        <BaseCard>
            <section aria-labelledby="list-patterns-shape" className="flex flex-col gap-4">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-shape" className="typo-h4-bold">
                        공통 골격
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        여섯 목록 모두 아래 순서로 서고, 각 조각은 공통 컴포넌트를 그대로 씁니다.
                    </p>
                </div>
                <ol className="typo-body-l-regular text-muted-foreground flex list-decimal flex-col gap-2 pl-5">
                    <li>
                        <strong className="text-foreground">고르는 자리</strong> — 탭(Tabs · TextTabs) 또는 조회
                        필터(SearchFilterForm). 없는 목록도 있습니다.
                    </li>
                    <li>
                        <strong className="text-foreground">총 N건</strong> — 건수만 굵고 브랜드 색입니다.
                    </li>
                    <li>
                        <strong className="text-foreground">항목</strong> — 한 건이 <code>li</code> 하나입니다. 줄로
                        나열하는 목록은 Separator, 카드로 세우는 목록은 BaseCard 를 씁니다.
                    </li>
                    <li>
                        <strong className="text-foreground">빈 상태</strong> — 항목이 없으면 그 자리를 EmptyState 가
                        대신합니다.
                    </li>
                    <li>
                        <strong className="text-foreground">페이지 이동</strong> — Pagination. 좁은 화면에서는 좌우
                        글자를 빼고 개수를 줄인 compact 로 그립니다.
                    </li>
                </ol>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-compare" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-compare" className="typo-h4-bold">
                        여섯 목록 비교
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        모두 <code>items</code> 와 <code>pageSize</code> 를 받습니다. 그 밖의 props 는 그 목록에만 있는
                        것입니다.
                    </p>
                </div>
                <Table caption="목록 6종 비교" columns={LIST_COLUMNS} rows={LIST_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-data" className="flex flex-col gap-4">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-data" className="typo-h4-bold">
                        데이터를 넘기는 방식
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        목록은 받은 것만 그립니다. 데이터가 목업인지 API 응답인지는{' '}
                        <code>content/service/&lt;기능&gt;.ts</code> 한 곳이 정하므로, 연동할 때 화면과 목록 컴포넌트는
                        고치지 않습니다.
                    </p>
                </div>
                <CodeBlock code={PAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="ts" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-rule" className="flex flex-col gap-4">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="list-patterns-rule" className="typo-h4-bold">
                        지키는 규칙
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <strong className="text-foreground">건수와 페이지는 거른 결과 기준</strong> — 탭이나 필터로
                        거르면 총 N건과 페이지 수도 함께 바뀌고, 고른 값이 바뀌면 1페이지로 돌아갑니다.
                    </li>
                    <li>
                        <strong className="text-foreground">빈 배열이 곧 빈 상태</strong> — 결과가 없을 때의 화면을 따로
                        만들지 않습니다. 목업 배열을 비워 보면 그대로 확인할 수 있습니다.
                    </li>
                    <li>
                        <strong className="text-foreground">항목마다 다른 주소는 항목이 든다</strong> — 상세로 가는
                        경로는 목록이 아니라 각 항목의 <code>href</code> 입니다. 목록에 하나뿐인 버튼(문의 등록 등)만
                        목록이 받습니다.
                    </li>
                    <li>
                        <strong className="text-foreground">페이지를 넘기면 맨 위로</strong> — 여섯 목록이 같은 동작을
                        하고, 모션 감소 설정이면 부드러운 스크롤 없이 즉시 올립니다[6.3.1].
                    </li>
                    <li>
                        <strong className="text-foreground">상태는 색만으로 전하지 않는다</strong> — 답변 상태·진행
                        상태는 배지 글자를 함께 둡니다[5.3.1].
                    </li>
                </ul>
                <CodeBlock code={EMPTY_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-a11y" className="flex flex-col gap-3">
                <h2 id="list-patterns-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        항목은 <code>ul</code> / <code>li</code> 로 그려 몇 건인지와 몇 번째인지가 함께 읽힙니다.
                    </li>
                    <li>
                        빈 상태는 <code>role=&quot;status&quot;</code> 로 알려, 조회 결과가 없다는 것이 화면을 보지
                        않아도 전해집니다[8.2.1].
                    </li>
                    <li>
                        탭으로 거르는 목록은 바뀌는 영역에 <code>role=&quot;tabpanel&quot;</code> 을 두고 탭과{' '}
                        <code>aria-controls</code> 로 잇습니다.
                    </li>
                    <li>
                        제목 링크는 글자만으로 어디로 가는지 알 수 있어야 합니다 — &quot;더보기&quot; 같은 단독 문구를
                        쓰지 않습니다[6.4.3].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="list-patterns-props" className="flex flex-col gap-4">
                <h2 id="list-patterns-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="목록 패턴 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ListPatternsGuidePage
