// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {ChevronRight} from 'lucide-react'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {ConsentItem, ConsentList} from '@/components/composite/consent-list'
import {Button} from '@/components/ui/button'
import {Field, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {cn} from '@/lib/utils'
import ConsentListFormDemo from './consent-list-form-demo'

export const metadata: Metadata = {title: '동의 목록 (ConsentList)'}

const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const SUB_LIST = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

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
          /* 오류 문구는 control 안에서 라디오 아래에 둔다 */
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
            {hasError ? (
              <FieldError id={\`\${item.name}-error\`}>
                {value ? '필수 항목입니다. 동의를 선택해 주세요.' : '동의 여부를 선택해 주세요.'}
              </FieldError>
            ) : null}
          </div>
        }
      />
    ))}
  </ConsentList>
  <Button type="submit">동의하고 다음 단계</Button>
</form>`

// "내용보기" — 우측 화살표가 붙은 텍스트 버튼.
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
    {key: 'case', header: '요소', align: 'start', rowHeader: true},
    {key: 'props', header: 'props', align: 'start'},
    {key: 'usage', header: '설명', align: 'start', wrap: true},
] as const

const CASE_ROWS = [
    {
        key: 'required',
        cells: ['필수 동의', <code key="p">requirement=&quot;required&quot;</code>, '기본값. "필수" 배지가 붙습니다.'],
    },
    {
        key: 'optional',
        cells: ['선택 동의', <code key="p">requirement=&quot;optional&quot;</code>, '"선택" 배지가 붙습니다.'],
    },
    {
        key: 'description',
        cells: ['안내 문구', <code key="p">description</code>, '제목 아래에 대시(-) 마커와 함께 놓입니다.'],
    },
    {
        key: 'action',
        cells: [
            '내용보기',
            <code key="p">action</code>,
            '제목 옆에 놓입니다. 보통 약관 전문을 여는 텍스트 버튼을 넣습니다.',
        ],
    },
    {
        key: 'control',
        cells: [
            '동의 컨트롤',
            <code key="p">control</code>,
            '오른쪽에 놓입니다. 보통 동의 · 비동의 RadioGroup 을 넣습니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['ConsentList', 'className', '목록(ul)에 덧붙일 클래스. 항목 간격은 gap-10 입니다.', 'undefined', 'string'],
    ['ConsentItem', 'title', '필수. 항목 제목입니다.', '—', 'ReactNode'],
    [
        'ConsentItem',
        'requirement',
        '필수 · 선택 여부. 배지 문구가 함께 정해집니다.',
        "'required'",
        "'required' | 'optional'",
    ],
    ['ConsentItem', 'description', '제목 아래 안내 문구.', 'undefined', 'ReactNode'],
    ['ConsentItem', 'action', '제목 옆 액션. 보통 "내용보기" 텍스트 버튼입니다.', 'undefined', 'ReactNode'],
    ['ConsentItem', 'control', '오른쪽 컨트롤. 보통 동의 · 비동의 RadioGroup 입니다.', 'undefined', 'ReactNode'],
    ['ConsentItem', 'className', '항목(li)에 덧붙일 클래스.', 'undefined', 'string'],
] as const

const ConsentListGuidePage = () => (
    <GuidePageShell
        title="동의 목록 (ConsentList)"
        description="약관 · 정보제공 동의 항목을 나열하는 목록입니다. 필수 · 선택 배지, 제목, 내용보기, 동의 컨트롤을 한 항목으로 묶습니다."
    >
        <BaseCard>
            <section aria-labelledby="cl-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cl-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ConsentList</code> 안에 <code>ConsentItem</code> 을 나열합니다. 내용보기는{' '}
                        <code>action</code>, 동의 컨트롤은 <code>control</code> 로 넘깁니다. md(768px) 미만에서는 배지 ·
                        제목 · 컨트롤이 세로로 쌓입니다.
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
            <section aria-labelledby="cl-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cl-variants" className="typo-h4-bold">
                        구성과 예시
                    </h2>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">항목 구성</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>description</code> · <code>action</code> · <code>control</code> 은 넘기지 않으면 그
                            자리가 사라집니다.
                        </p>
                        <Table size="md" caption="ConsentItem 구성 요소" columns={CASE_COLUMNS} rows={CASE_ROWS} />
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
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">폼 제출과 오류 표시</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            항목마다 <code>RadioGroup</code> 에 서로 다른 <code>name</code> 을 주면 선택값(
                            <code>agree</code> · <code>disagree</code>)이 함께 제출됩니다. 필수 항목 검사와 포커스
                            이동은 사용처에서 합니다.
                        </p>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>ConsentItem</code> 에는 오류 prop 이 없습니다. 오류 문구는 <code>control</code> 안에서
                            컨트롤 아래에 두고 <code>aria-describedby</code> 로 그룹에 연결합니다.
                        </p>
                        <DemoSurface>
                            <ConsentListFormDemo />
                        </DemoSurface>
                        <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cl-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cl-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        항목은 <code>ul</code> · <code>li</code> 목록으로 렌더링됩니다[8.1.1].
                    </li>
                    <li>필수 여부는 &quot;필수&quot; · &quot;선택&quot; 배지 문구로 전달됩니다[5.3.1].</li>
                    <li>
                        <code>control</code> 에 넣는 컨트롤의 이름은 사용처에서 줍니다. <code>RadioGroup</code> 의{' '}
                        <code>aria-label</code> 에 항목명을 넣어 어느 항목의 동의인지 구분되게 합니다[7.4.1].
                    </li>
                    <li>
                        오류는 <code>aria-invalid</code> · <code>aria-describedby</code> 와 <code>FieldError</code>{' '}
                        문구로 알리고, 제출 시 첫 오류 항목으로 포커스를 옮깁니다[7.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cl-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cl-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        ConsentList 는 ul, ConsentItem 은 li 의 나머지 속성도 그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ConsentList · ConsentItem Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ConsentListGuidePage
