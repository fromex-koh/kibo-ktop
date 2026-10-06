// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {FormCard} from '@/components/composite/form-card'
import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '요약 목록 (SummaryList)'}

const COMPANY_INFO = [
    ['기업형태', '법인', false],
    ['기업명', '㈜테크놀로지', false],
    ['사업자번호', '123-45-67890', false],
    ['법인번호', '110111-1234567', false],
    ['설립일', '2020-03-15', false],
    ['대표자명', '홍길동', false],
    ['회사전화번호', '02-1234-5678', false],
    ['업종코드', '미입력', true],
    ['주소', '미입력', true],
    ['담당자명', '김민수', false],
    ['직위', '책임연구원', false],
    ['연락처', '02-1234-5678', false],
    ['이메일', 'example@email.com', false],
    ['산업분야 코드', '미입력', true],
    ['기술분류', '미입력', true],
    ['대표기술', '미입력', true],
    ['대표기술제품 (서비스)', '미입력', true],
] as const

const CAREER_1 = [
    ['근무시작 년월', '2018-01'],
    ['근무종료 년월', '2020-02'],
    ['근무처', 'ABC테크'],
    ['업종', 'IT서비스'],
    ['동업종 여부', '예'],
    ['담당업무', '기술개발'],
    ['최종직급', '팀장'],
] as const

const CAREER_2 = [
    ['근무시작 년월', '2020-03'],
    ['근무종료 년월', '2023-12'],
    ['근무처', 'XYZ소프트'],
    ['업종', '소프트웨어'],
    ['동업종 여부', '예'],
    ['담당업무', '연구개발'],
    ['최종직급', '수석'],
] as const

const USAGE_CODE = `import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'

{/* 목록은 FormCard 본문에 넣는다 */}
<FormCard title="기업정보">
  <SummaryList>
    <SummaryListItem term="기업형태">법인</SummaryListItem>
    <SummaryListItem term="기업명">㈜테크놀로지</SummaryListItem>
    {/* 값이 없으면 empty — "미입력"을 더 흐린 색으로 */}
    <SummaryListItem term="업종코드" empty>미입력</SummaryListItem>
  </SummaryList>
</FormCard>`

const COMPOSED_CODE = `{/* FormCard 의 title · action 으로 제목과 수정 버튼 헤더가 만들어진다 */}
<FormCard title="기업정보" action={<Button variant="tertiary" size="sm">수정</Button>}>
  <SummaryList>
    <SummaryListItem term="기업형태">법인</SummaryListItem>
    {/* … */}
  </SummaryList>
</FormCard>`

const TWO_COLUMN_CODE = `{/* 2열 배치 — 좁은 화면에서는 1열로 접힌다 */}
<FormCard
  title={<span className="flex items-center gap-2">대표자 경력사항 <Badge type="number" color="primary">2</Badge></span>}
  action={<Button variant="tertiary" size="sm">수정</Button>}
>
  <div className="grid gap-6 md:grid-cols-2">
    <SummaryList>{/* 경력 1 */}</SummaryList>
    <SummaryList>{/* 경력 2 */}</SummaryList>
  </div>
</FormCard>`

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
            <Link key="component" href="/component-guide/review-list" className={LINK_CLASS}>
                ReviewList
            </Link>,
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
            <code key="component">SummaryList</code>,
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
    ['SummaryList', 'children', 'SummaryListItem 목록입니다.', '-', 'ReactNode'],
    ['SummaryList', '...props', '목록 스타일과 네이티브 dl 속성을 전달합니다.', 'undefined', 'DlHTMLAttributes'],
    ['SummaryListItem', 'term', '왼쪽 dt로 렌더링할 항목명입니다.', '-', 'ReactNode'],
    ['SummaryListItem', 'children', '오른쪽 dd로 렌더링할 값입니다.', '-', 'ReactNode'],
    ['SummaryListItem', 'empty', '미입력 값에 흐린 상태 색상을 적용합니다.', 'false', 'boolean'],
    ['SummaryListItem', '...props', '행 스타일과 네이티브 div 속성을 전달합니다.', 'undefined', 'HTMLAttributes'],
] as const

const SummaryListGuidePage = () => (
    <GuidePageShell
        title="요약 목록 (SummaryList)"
        description="라벨(좌)과 값(우)으로 정보를 나열하는 읽기 전용 목록입니다. 값 편집에는 쓰지 않습니다."
    >
        <BaseCard>
            <section aria-labelledby="sl-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sl-basic" className="typo-h4-bold">
                        기본 사용과 변형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        흰 카드 박스 안에 행을 쌓습니다. 카드 제목과 버튼이 필요하면 <code>FormCard</code> 본문으로
                        넣습니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">기본</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>term</code> 은 라벨, children 은 값입니다. 값이 없는 행은 <code>empty</code> 로 더
                            흐리게 표시합니다.
                        </p>
                        <FormCard title="기업정보">
                            <SummaryList>
                                {COMPANY_INFO.map(([term, detail, empty]) => (
                                    <SummaryListItem key={term} term={term} empty={empty}>
                                        {detail}
                                    </SummaryListItem>
                                ))}
                            </SummaryList>
                        </FormCard>
                        <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목과 버튼</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>FormCard</code> 의 <code>title</code> · <code>action</code> 으로 헤더를 만들고 목록을
                            본문에 둡니다.
                        </p>
                        <FormCard
                            title="기업정보"
                            action={
                                <Button variant="tertiary" size="sm">
                                    수정
                                </Button>
                            }
                        >
                            <SummaryList>
                                {COMPANY_INFO.map(([term, detail, empty]) => (
                                    <SummaryListItem key={term} term={term} empty={empty}>
                                        {detail}
                                    </SummaryListItem>
                                ))}
                            </SummaryList>
                        </FormCard>
                        <CodeBlock code={COMPOSED_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">2열 배치</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            항목이 많으면 목록을 나란히 둡니다. 제목 옆 건수는{' '}
                            <code>Badge type=&quot;number&quot;</code> 입니다.
                        </p>
                        <FormCard
                            title={
                                <span className="flex items-center gap-2">
                                    대표자 경력사항
                                    <Badge type="number" color="primary">
                                        2
                                    </Badge>
                                </span>
                            }
                            action={
                                <Button variant="tertiary" size="sm">
                                    수정
                                </Button>
                            }
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <SummaryList>
                                    {CAREER_1.map(([term, detail]) => (
                                        <SummaryListItem key={term} term={term}>
                                            {detail}
                                        </SummaryListItem>
                                    ))}
                                </SummaryList>
                                <SummaryList>
                                    {CAREER_2.map(([term, detail]) => (
                                        <SummaryListItem key={term} term={term}>
                                            {detail}
                                        </SummaryListItem>
                                    ))}
                                </SummaryList>
                            </div>
                        </FormCard>
                        <CodeBlock code={TWO_COLUMN_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sl-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sl-choice" className="typo-h4-bold">
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
            <section aria-labelledby="sl-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sl-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        구조와 읽기 순서는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>dl</code> · <code>dt</code> · <code>dd</code> 정의 목록이라 스크린리더가 라벨과 값을
                        쌍으로 읽습니다[7.3.1][8.1.1].
                    </li>
                    <li>
                        <code>empty</code> 값의 색은 흰 배경 대비 4.5:1 에 못 미칩니다. 본문 값이 아니라 값 없음
                        표시에만 쓰고 &quot;미입력&quot; 같은 글자를 함께 둡니다[5.3.3][5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sl-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sl-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>SummaryList</code> · <code>SummaryListItem</code> 의 속성입니다. 카드 박스 클래스는{' '}
                        <code>summaryListBoxClassName</code> 으로 따로 내보냅니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SummaryList와 SummaryListItem Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SummaryListGuidePage
