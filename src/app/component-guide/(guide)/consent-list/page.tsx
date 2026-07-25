import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {ChevronRight} from 'lucide-react'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {ConsentItem, ConsentList} from '@/components/composite/consent-list'
import {Button} from '@/components/ui/button'
import {Field, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {cn} from '@/lib/utils'
import ConsentListFormDemo from './consent-list-form-demo'

export const metadata: Metadata = {title: '동의 목록 (ConsentList)'}

const USAGE_CODE = `<ConsentList>
  <ConsentItem
    title="1. 수집·이용에 관한 사항"
    description="위 고유식별정보 수집·이용에 동의하십니까?"
    action={
      <Button variant="text" size="lg" asChild>
        <Link href="#">내용보기<ChevronRight aria-hidden="true" /></Link>
      </Button>
    }
    control={<ConsentRadio name="consent-1" />}
  />
  <ConsentItem requirement="optional" title="4. 세무회계자료의 온라인 제출에 관한 사항" … />
</ConsentList>`

const FORM_CODE = `const [values, setValues] = useState<Record<string, string>>({})
const [invalidNames, setInvalidNames] = useState<readonly string[]>([])

<form
  noValidate
  onSubmit={(event) => {
    event.preventDefault()

    // 필수 항목은 "동의"를 선택해야 통과한다.
    const nextInvalidNames = CONSENT_ITEMS.filter(
      (item) => item.isRequired && values[item.name] !== 'agree',
    ).map((item) => item.name)
    setInvalidNames(nextInvalidNames)

    if (nextInvalidNames.length) {
      agreeRefs.current[nextInvalidNames[0]]?.focus()
      return
    }

    const entries = Array.from(new FormData(event.currentTarget).entries())
    setSubmittedData(JSON.stringify(Object.fromEntries(entries)))
  }}
>
  <ConsentList>
    {CONSENT_ITEMS.map((item) => (
      <ConsentItem
        key={item.name}
        requirement={item.isRequired ? 'required' : 'optional'}
        title={item.title}
        description={item.description}
        action={<Button variant="text" size="lg">내용보기<ChevronRight aria-hidden="true" /></Button>}
        control={
          {/* 오류 슬롯이 없어 컨트롤 슬롯 안에서 라디오 아래에 오류 문구를 둔다 */}
          <div className="flex flex-col items-end gap-1">
            <RadioGroup
              name={item.name}
              value={values[item.name] ?? ''}
              onValueChange={…}
              required={item.isRequired}
              aria-label={\`\${item.title} 동의 여부\`}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? \`\${item.name}-error\` : undefined}
              className="flex w-fit flex-row gap-6"
            >
              …동의 / 비동의
            </RadioGroup>
            {hasError ? <FieldError id={\`\${item.name}-error\`}>동의 여부를 선택해 주세요.</FieldError> : null}
          </div>
        }
      />
    ))}
  </ConsentList>
  <Button type="submit">동의하고 다음 단계</Button>
</form>`

// "내용보기" — 시안은 우측 화살표가 붙은 텍스트 버튼이다(실제 화면에서는 약관 모달을 연다).
const DetailAction = () => (
    <Button variant="text" size="lg">
        내용보기
        <ChevronRight aria-hidden="true" />
    </Button>
)

// 동의/비동의 라디오 — 동의 항목의 기본 컨트롤. 항목마다 name 이 달라야 서로 독립적으로 선택된다.
// RadioGroup 기본은 세로(grid) 배치라 가로 한 줄로 바꾼다 — grid 를 지우려면 flex 를 함께 준다.
const ConsentRadio = ({name, label}: {name: string; label: string}) => (
    <RadioGroup name={name} aria-label={`${label} 동의 여부`} className="flex w-fit flex-row gap-6">
        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
            <RadioGroupItem value="agree" id={`${name}-agree`} aria-labelledby={`${name}-agree-label`} />
            <FieldLabel id={`${name}-agree-label`} htmlFor={`${name}-agree`}>
                동의
            </FieldLabel>
        </Field>
        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
            <RadioGroupItem value="disagree" id={`${name}-disagree`} aria-labelledby={`${name}-disagree-label`} />
            <FieldLabel id={`${name}-disagree-label`} htmlFor={`${name}-disagree`}>
                비동의
            </FieldLabel>
        </Field>
    </RadioGroup>
)

// 케이스 데모를 감싸는 흰 카드 — 실제 화면에서 동의 목록은 폼 카드 안에 놓인다.
const DemoSurface = ({children}: {children: ReactNode}) => (
    <div className="bg-card border-subtle-3 rounded-md border p-6">{children}</div>
)

const CASE_COLUMNS = [
    {key: 'case', header: '케이스', align: 'start', rowHeader: true},
    {key: 'props', header: 'props', align: 'start', wrap: true},
    {key: 'usage', header: '쓰임', align: 'start', wrap: true},
] as const

const CASE_ROWS = [
    {
        key: 'required',
        cells: [
            '필수 동의',
            <span key="p" className="font-mono">
                requirement=&quot;required&quot;(기본)
            </span>,
            '동의해야 다음 단계로 진행할 수 있는 항목. 배지는 info 아웃라인입니다.',
        ],
    },
    {
        key: 'optional',
        cells: [
            '선택 동의',
            <span key="p" className="font-mono">
                requirement=&quot;optional&quot;
            </span>,
            '동의하지 않아도 진행 가능한 항목. 배지는 중립(gray) 아웃라인입니다.',
        ],
    },
    {
        key: 'description',
        cells: [
            '안내 문구',
            <span key="p" className="font-mono">
                description
            </span>,
            '제목 아래 대시 마커와 함께 붙는 확인 문구. 생략하면 한 줄 항목이 됩니다.',
        ],
    },
    {
        key: 'action',
        cells: [
            '내용보기',
            <span key="p" className="font-mono">
                action
            </span>,
            '제목 옆 인라인 액션. 보통 약관 전문을 여는 텍스트 버튼을 넣습니다.',
        ],
    },
    {
        key: 'control',
        cells: [
            '동의 컨트롤',
            <span key="p" className="font-mono">
                control
            </span>,
            '우측 컨트롤 슬롯. 동의/비동의 RadioGroup 이 기본이며, 체크박스 등 다른 컨트롤도 넣을 수 있습니다.',
        ],
    },
]

const PROPS_COLUMNS = [
    {key: 'name', header: 'Name', align: 'start', rowHeader: true},
    {key: 'description', header: 'Description', align: 'start', wrap: true},
    {key: 'type', header: 'Type', align: 'start'},
] as const

const PROPS_ROWS = [
    {
        key: 'title',
        cells: [
            <span key="k" className="text-primary font-mono">
                title
            </span>,
            '항목 제목입니다. 시안 기준 20px Medium 으로 렌더됩니다.',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
    {
        key: 'requirement',
        cells: [
            <span key="k" className="text-primary font-mono">
                requirement
            </span>,
            '필수·선택 여부. 배지 문구와 색이 함께 정해집니다.',
            <span key="t" className="font-mono">
                &apos;required&apos; | &apos;optional&apos;
            </span>,
        ],
    },
    {
        key: 'description',
        cells: [
            <span key="k" className="text-primary font-mono">
                description
            </span>,
            '제목 아래 안내 문구(선택). 대시 마커가 함께 붙습니다.',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
    {
        key: 'action',
        cells: [
            <span key="k" className="text-primary font-mono">
                action
            </span>,
            '제목 옆 인라인 액션(선택). 보통 "내용보기" 텍스트 버튼입니다.',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
    {
        key: 'control',
        cells: [
            <span key="k" className="text-primary font-mono">
                control
            </span>,
            '우측 컨트롤(선택). 항목 전체 높이 기준 중앙에 배치됩니다.',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
    {
        key: 'className',
        cells: [
            <span key="k" className="text-primary font-mono">
                className
            </span>,
            '추가 클래스명으로 레이아웃을 확장합니다. ConsentList 는 항목 간 간격만 담당합니다.',
            <span key="t" className="font-mono">
                string
            </span>,
        ],
    },
]

// 동의 목록 — 약관·정보제공 동의 항목 행(composite). Badge + 제목/내용보기 + 동의 컨트롤 조합.
const ConsentListGuidePage = () => (
    <GuidePageShell
        title="동의 목록 (ConsentList)"
        description="약관·정보제공 동의 항목을 한 줄씩 나열하는 목록입니다. 필수·선택 배지와 항목 제목, 내용보기, 동의/비동의 컨트롤을 한 행으로 묶습니다."
    >
        <BaseCard>
            <section aria-labelledby="cl-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="cl-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">ConsentList</code> 안에{' '}
                        <code className="font-mono">ConsentItem</code> 을 나열합니다. 배지·제목·안내 문구는 props 로,
                        내용보기와 동의 컨트롤은 슬롯으로 넣습니다.
                    </p>
                </div>
                <DemoSurface>
                    <ConsentList>
                        <ConsentItem
                            title="1. 수집·이용에 관한 사항"
                            description="위 고유식별정보 수집·이용에 동의하십니까?"
                            action={<DetailAction />}
                            control={<ConsentRadio name="consent-collect" label="수집·이용에 관한 사항" />}
                        />
                        <ConsentItem
                            title="2. 제3자 제공에 관한 사항"
                            description="위 고유식별정보 제3자 제공에 동의하십니까?"
                            action={<DetailAction />}
                            control={<ConsentRadio name="consent-third-party" label="제3자 제공에 관한 사항" />}
                        />
                        <ConsentItem
                            requirement="optional"
                            title="4. 세무회계자료의 온라인 제출에 관한 사항"
                            description="위 세무회계자료의 온라인 제출에 동의하십니까?"
                            action={<DetailAction />}
                            control={<ConsentRadio name="consent-tax" label="세무회계자료의 온라인 제출" />}
                        />
                    </ConsentList>
                </DemoSurface>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cl-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="cl-cases" className="typo-h4-bold">
                        케이스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        배지 종류와 선택 요소(안내 문구·내용보기·컨트롤)의 조합입니다. 필요 없는 요소는 넘기지 않으면
                        해당 자리가 사라집니다.
                    </p>
                </div>
                <DemoSurface>
                    <ConsentList>
                        {/* 필수 + 전체 요소 */}
                        <ConsentItem
                            title="필수 · 안내 문구 + 내용보기 + 컨트롤"
                            description="위 고유식별정보 수집·이용에 동의하십니까?"
                            action={<DetailAction />}
                            control={<ConsentRadio name="case-full" label="전체 요소" />}
                        />
                        {/* 선택 배지 */}
                        <ConsentItem
                            requirement="optional"
                            title="선택 · 안내 문구 + 내용보기 + 컨트롤"
                            description="위 세무회계자료의 온라인 제출에 동의하십니까?"
                            action={<DetailAction />}
                            control={<ConsentRadio name="case-optional" label="선택 항목" />}
                        />
                        {/* 안내 문구 없음 — 한 줄 항목 */}
                        <ConsentItem
                            title="안내 문구 없음"
                            action={<DetailAction />}
                            control={<ConsentRadio name="case-no-description" label="안내 문구 없음" />}
                        />
                        {/* 내용보기 없음 */}
                        <ConsentItem
                            title="내용보기 없음"
                            description="약관 전문이 따로 없는 항목입니다."
                            control={<ConsentRadio name="case-no-action" label="내용보기 없음" />}
                        />
                        {/* 컨트롤 없음 — 안내 전용 행 */}
                        <ConsentItem
                            requirement="optional"
                            title="컨트롤 없음(안내 전용)"
                            description="동의 대상이 아니라 안내만 하는 항목입니다."
                            action={<DetailAction />}
                        />
                    </ConsentList>
                </DemoSurface>
                <Table size="md" caption="ConsentItem 케이스" columns={CASE_COLUMNS} rows={CASE_ROWS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cl-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="cl-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        항목마다 <code className="font-mono">RadioGroup</code> 에{' '}
                        <code className="font-mono">name</code> 을 주면 선택값(
                        <code className="font-mono">agree</code>·<code className="font-mono">disagree</code>)이 하나의{' '}
                        <code className="font-mono">FormData</code> 로 제출됩니다. 필수 항목은{' '}
                        <code className="font-mono">동의</code> 를 선택해야 통과하며, 제출 시 조건을 만족하지 않은 첫
                        항목의 <code className="font-mono">동의</code> 라디오로 포커스를 옮기고 오류 문구를{' '}
                        <code className="font-mono">role=&quot;alert&quot;</code> 로 알립니다[7.4.2]. 미선택과 비동의는
                        정정 방법이 달라 문구를 나눕니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground mt-2">
                        <code className="font-mono">ConsentItem</code> 에는 오류 슬롯이 없으므로 오류 문구는{' '}
                        <code className="font-mono">control</code> 슬롯 안에서 컨트롤 아래에 놓고{' '}
                        <code className="font-mono">aria-describedby</code> 로 해당 그룹에 연결합니다. 여러 화면에서
                        같은 형태가 반복되면 전용 prop 으로 승격합니다.
                    </p>
                </div>
                <DemoSurface>
                    <ConsentListFormDemo />
                </DemoSurface>
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cl-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="cl-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        항목은 <code className="font-mono">ul</code>/<code className="font-mono">li</code> 목록으로
                        렌더되어 스크린리더가 개수와 순서를 읽습니다. 동의/비동의는 항목마다 독립된{' '}
                        <code className="font-mono">RadioGroup</code> 이며,{' '}
                        <code className="font-mono">aria-label</code> 에 항목명을 넣어 어떤 항목의 동의인지 구분되게
                        합니다[7.4.1]. 필수 여부는 색이 아니라 &quot;필수/선택&quot; 문구로 전달됩니다[5.3.1].
                    </p>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cl-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="cl-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">ConsentItem 에 넘기는 속성입니다.</p>
                </div>
                <Table size="md" caption="ConsentItem Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ConsentListGuidePage
