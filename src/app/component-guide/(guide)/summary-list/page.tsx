import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'
import {FormCard} from '@/components/composite/form-card'
import {NumberBadge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '요약 목록 (SummaryList)'}

// 기업정보 요약 데이터 — [라벨, 값, 미입력여부]. Figma "리스트" 필드 반영(상태 라벨성 junk 행은 제외).
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

// 대표자 경력사항 2건(Figma "2단") — [라벨, 값]. 좌우 열에 한 건씩.
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

const USAGE_CODE = `{/* 리스트는 FormCard(헤더 내장 카드) 본문으로 넣어 실제 화면처럼 배치 */}
<FormCard title="기업정보">
  <SummaryList>
    <SummaryListItem term="기업형태">법인</SummaryListItem>
    <SummaryListItem term="기업명">㈜테크놀로지</SummaryListItem>
    {/* 값이 없으면 empty — "미입력"을 더 흐린 색으로 */}
    <SummaryListItem term="업종코드" empty>미입력</SummaryListItem>
  </SummaryList>
</FormCard>`

const COMPOSED_CODE = `{/* FormCard 헤더는 SectionHeader 를 그대로 내장 — title/action 만 주면 제목+수정 버튼 헤더가 되고,
    목록은 본문(children)으로 들어간다. 헤더를 따로 조립할 필요가 없다. */}
<FormCard title="기업정보" action={<Button variant="tertiary" size="md">수정</Button>}>
  <SummaryList>
    <SummaryListItem term="기업형태">법인</SummaryListItem>
    {/* … */}
  </SummaryList>
</FormCard>`

const TWO_COLUMN_CODE = `{/* 항목이 많으면 리스트를 2열로 — Figma "2단"(경력 2건). 제목 옆 건수는 NumberBadge */}
<FormCard
  title={<span className="flex items-center gap-2">대표자 경력사항 <NumberBadge>2</NumberBadge></span>}
  action={<Button variant="tertiary" size="md">수정</Button>}
>
  <div className="grid gap-6 md:grid-cols-2">
    <SummaryList>{/* 경력 1 */}</SummaryList>
    <SummaryList>{/* 경력 2 */}</SummaryList>
  </div>
</FormCard>`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    [
        'SummaryList',
        '읽기 전용 정보 목록 컨테이너. 내부적으로 <dl> 을 렌더링한다. 흰 배경·연한 테두리·둥근 모서리 카드.',
    ],
    [
        'SummaryListItem',
        '개별 행. term(라벨, <dt>) + 값(children, <dd> 우측 정렬). empty 를 주면 값을 더 흐린 색으로 표시(미입력 등).',
    ],
] as const

// 요약 목록 — Figma "기업정보"·"2단" 요약 화면 반영. 목록만 신규 composite, 헤더·카드는 FormCard(SectionHeader 내장) 재사용.
const SummaryListGuidePage = () => (
    <GuidePageShell
        title="요약 목록 (SummaryList)"
        description="라벨(좌)과 값(우)으로 정보를 나열하는 읽기 전용 요약 목록입니다. 시맨틱은 HTML 정의 목록(<dl>/<dt>/<dd>) 그대로라 스크린리더가 '라벨: 값' 쌍으로 읽습니다. 값 편집이 아니라 조회용입니다."
    >
        <section aria-labelledby="sl-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="sl-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    각 행은 <code className="font-mono">term</code>(라벨)과 값(children)으로 이뤄집니다. 값이 없는 행은{' '}
                    <code className="font-mono">empty</code> 를 주면{' '}
                    <strong className="text-foreground font-medium">&quot;미입력&quot;</strong> 처럼 더 흐린 색으로
                    표시됩니다. 실제 화면처럼 <code className="font-mono">FormCard</code>(헤더 내장 카드) 본문에 넣어
                    보여줍니다.
                </p>
            </div>
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
        </section>

        <section aria-labelledby="sl-composed" className="flex flex-col gap-4">
            <div>
                <h2 id="sl-composed" className="typo-h4-bold">
                    FormCard 조립 (제목 + 액션)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Figma 화면은 <strong className="text-foreground font-medium">상단 타이틀+버튼 + 아래 목록</strong>
                    으로 구성됩니다. <code className="font-mono">FormCard</code> 는 헤더로{' '}
                    <code className="font-mono">SectionHeader</code> 를 그대로 내장하므로, 따로 조립할 필요 없이{' '}
                    <code className="font-mono">title</code>·<code className="font-mono">action</code> 만 주면 제목+수정
                    버튼 헤더가 되고 목록은 본문으로 들어갑니다.
                </p>
            </div>
            <FormCard
                title="기업정보"
                action={
                    <Button variant="tertiary" size="md">
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
        </section>

        <section aria-labelledby="sl-two-column" className="flex flex-col gap-4">
            <div>
                <h2 id="sl-two-column" className="typo-h4-bold">
                    2단 (2-column)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    항목이 여럿이면 목록을 <strong className="text-foreground font-medium">2열로 나란히</strong> 둡니다
                    (Figma &quot;2단&quot; — 대표자 경력 2건). 제목 옆 건수는{' '}
                    <code className="font-mono">NumberBadge</code> 로 표시하고, 좁은 화면에선 자동으로 1열로 접힙니다.
                </p>
            </div>
            <FormCard
                title={
                    <span className="flex items-center gap-2">
                        대표자 경력사항
                        <NumberBadge>2</NumberBadge>
                    </span>
                }
                action={
                    <Button variant="tertiary" size="md">
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
        </section>

        <section aria-labelledby="sl-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="sl-composition" className="typo-h4-bold">
                    구성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    요약 목록은 컨테이너와 개별 행으로 이뤄집니다.
                </p>
            </div>
            <dl className="flex flex-col gap-2">
                {COMPOSITION.map(([name, desc]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default SummaryListGuidePage
