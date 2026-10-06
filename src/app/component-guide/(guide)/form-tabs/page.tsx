// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {FormTabTitle, type FormTabStatus} from '@/components/composite/form-tab-title'
import {
    formTabsPickerCurrentRowClassName,
    formTabsPickerPanelClassName,
    formTabsTabletBarClassName,
} from '@/components/theme/form-tabs.variants'
import {cn} from '@/lib/utils'
import FormTabsFormDemo from './form-tabs-form-demo'

export const metadata: Metadata = {title: '폼 탭 (FormTabs)'}

const USAGE_CODE = `import {FormTabs} from '@/components/composite/form-tabs'
import {FormValuesProvider} from '@/components/composite/form-values'

// 작성 상태(미작성·작성중·작성완료)는 적지 않는다 — 각 탭에 입력한 값에서 자동으로 계산된다.
const ITEMS = [
  {value: 'company', title: '기업정보', content: <FormCard title="기업정보">…</FormCard>},
  {value: 'ceo', title: '대표자 경력사항', content: <FormCard title="대표자 경력사항">…</FormCard>},
  {value: 'staff', title: '핵심 기술 인력 현황', content: <FormCard title="핵심 기술 인력 현황">…</FormCard>},
]

// FormValuesProvider 는 선택이 아니라 필수다(아래 "값 관리").
<FormValuesProvider>
  <FormTabs items={ITEMS} />
</FormValuesProvider>`

const VALUES_CODE = `// 입력은 form-values 에서 가져오고 name 만 주면 값이 모인다 — 값 객체의 키가 곧 name 이고 FormData 키와 같다.
import {ClearableInput, DatePicker, Select, SelectTrigger, TelInput, useFormValues} from '@/components/composite/form-values'

<ClearableInput id="ceo-name" name="ceoName" />
<TelInput id="company-tel" name="companyTel" />   // 숫자만 받아 하이픈을 자동으로 넣는다
<DatePicker id="found-date" name="foundDate" maxDate={today} />
<Select name="corpType">
  <SelectTrigger id="corp-type">…</SelectTrigger>  // Select 는 뿌리에 id 가 없다 — 트리거에 붙인다
</Select>

// 모인 값 전체를 읽을 때
const {values} = useFormValues()   // {ceoName: '홍길동', companyTel: '02-1234-5678', …}`

const SUBMIT_CODE = `import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'

const TabsForm = () => {
  // 검사 → 각 칸 밑에 메시지 → 걸린 칸의 탭을 열고 포커스 이동까지 맡는다.
  const {currentTab, setCurrentTab, handleSubmit} = useFormTabsSubmit({defaultTab: ITEMS[0].value})

  const submit = (event: SubmitEvent<HTMLFormElement>) =>
    handleSubmit(event, (values) => {
      // 모두 통과했을 때만 불린다 — values 는 FormData 그대로다. 저장 API 호출은 여기에 붙인다.
    })

  return (
    <form noValidate onSubmit={submit}>
      <FormTabs items={ITEMS} value={currentTab} onValueChange={setCurrentTab} />
      <Button type="submit">입력 내용 확인</Button>
      {/* 행추가·조회처럼 제출이 아닌 버튼에는 반드시 type="button" 을 준다 — 기본값이 submit 이다 */}
    </form>
  )
}

// useFormTabsSubmit 은 FormValuesProvider 안에서만 쓸 수 있다.
<FormValuesProvider defaultValues={DEFAULT_VALUES}>
  <TabsForm />
</FormValuesProvider>`

const VALIDATION_CODE = `// 메시지 자리는 Field 한 곳이다. 컨트롤의 aria-invalid·aria-describedby 는 form-values 의 입력이 같은 id 로 건다.
<Field id="manager-name" label="이름" required>
  <ClearableInput id="manager-name" name="managerName" required />
</Field>

// 직접 메시지를 담을 때 — 키는 입력의 id(라벨의 htmlFor 가 가리키는 그 id)다.
const {setFieldErrors} = useFormValues()
setFieldErrors({'manager-name': '이름을 입력해 주세요.'})

// 값을 고치면 그 칸 메시지는 저절로 사라진다. 짝이 되는 칸을 고쳐 함께 맞게 된 경우만 직접 거둔다.
const clearError = useClearFieldError('career-1-start')

// 입력 즉시 알려야 하는 규칙은 DatePicker 의 validationMessage 로 — 고를 수는 있고 제출만 막힌다.
<DatePicker name="career-1-start" validationMessage={message} />`

const TITLE_CODE = `import {FormTabTitle} from '@/components/composite/form-tab-title'

// 탭 밖에서 단독으로 쓸 때 — 선택 상태를 active 로 직접 준다.
<FormTabTitle title="기업정보" status="writing" active />

// FormTabs 가 쓰는 방식 — asChild 로 TabsTrigger 에 얹어 동작은 Radix 에 맡긴다.
<FormTabTitle asChild title="기업정보" status="writing">
  <TabsTrigger value="company" />
</FormTabTitle>`

const PARTS_COLUMNS = [
    {key: 'name', header: '구성 요소', align: 'start', rowHeader: true},
    {key: 'path', header: 'import', align: 'start'},
    {key: 'role', header: '역할', align: 'start', wrap: true},
] as const

const PARTS_ROWS = [
    {
        key: 'form-tabs',
        cells: [
            <code key="n">FormTabs</code>,
            <code key="p">composite/form-tabs</code>,
            '탭 전환 · 본문 표시 · 화면 폭에 따른 형태 전환. 사용처는 items 만 넘깁니다.',
        ],
    },
    {
        key: 'form-tab-title',
        cells: [
            <code key="n">FormTabTitle</code>,
            <code key="p">composite/form-tab-title</code>,
            '탭 한 칸의 생김새(제목 + 작성 상태). FormTabs 가 내부에서 쓰며, 단독으로도 쓸 수 있습니다.',
        ],
    },
    {
        key: 'form-values',
        cells: [
            <code key="n">FormValuesProvider · 입력 컴포넌트</code>,
            <code key="p">composite/form-values</code>,
            '입력값을 name 을 키로 한 객체 하나에 모읍니다. 작성 상태 계산과 값 유지의 근거입니다.',
        ],
    },
    {
        key: 'form-tabs-submit',
        cells: [
            <code key="n">useFormTabsSubmit</code>,
            <code key="p">composite/form-tabs-submit</code>,
            '제출 관문. 검사 → 메시지 표시 → 걸린 칸의 탭 열기·포커스까지 맡고, 통과한 값만 콜백으로 넘깁니다.',
        ],
    },
] as const

const WRAPPER_COLUMNS = [
    {key: 'name', header: '입력', align: 'start', rowHeader: true},
    {key: 'note', header: '쓰는 자리와 특징', align: 'start', wrap: true},
] as const

const WRAPPER_ROWS = [
    {key: 'input', cells: ['Input', '기본 한 줄 입력. 조회 버튼이 붙는 칸처럼 지우기 버튼이 필요 없을 때.']},
    {key: 'clearable', cells: ['ClearableInput', '지우기 버튼이 붙는 한 줄 입력. 대부분의 텍스트 칸이 이것입니다.']},
    {key: 'tel', cells: ['TelInput', '전화번호. 숫자만 받아 하이픈을 자동으로 넣습니다(02·050X·1544 대응).']},
    {key: 'group', cells: ['InputGroupInput', '단위(명·건·백만원)가 붙는 입력. InputGroup 안에서 씁니다.']},
    {key: 'textarea', cells: ['Textarea', '여러 줄 입력.']},
    {key: 'select', cells: ['Select · SelectTrigger', 'id 는 트리거에 붙입니다. 뿌리(Select)에는 id 속성이 없습니다.']},
    {key: 'radio', cells: ['RadioGroup', '라디오 묶음. 항목은 RadioGroupItem 을 그대로 씁니다.']},
    {key: 'date', cells: ['DatePicker', '날짜. 값은 yyyy-MM-dd 문자열로 담기고 제출 값도 같습니다.']},
] as const

// 탭 타이틀 케이스 — [상태 3종 × 선택 여부].
const TITLE_CASES: readonly {status: FormTabStatus; title: string}[] = [
    {status: 'done', title: '기업정보'},
    {status: 'writing', title: '경영진 역량 및 구성'},
    {status: 'todo', title: '재무정보'},
]

// 제목 길이별 — 짧은 제목 · 두 줄로 넘어가는 제목 · 띄어쓰기가 없어 글자 단위로 끊기는 제목.
const TITLE_LENGTH_CASES: readonly {status: FormTabStatus; title: string}[] = [
    {status: 'done', title: '재무정보'},
    {status: 'done', title: '핵심 기술 인력 현황'},
    {status: 'writing', title: '기술개발 및 사업화 추진실적 상세현황'},
    {status: 'todo', title: '지식재산권보유및기술이전실적상세내역'},
    {status: 'todo', title: '특허 보유현황'},
]

// 탭 개수별 — 칸은 남는 폭을 똑같이 나눠 가지므로 개수가 늘수록 좁아진다. 시안 기준 최대 7개.
const TAB_COUNT_CASES: readonly {status: FormTabStatus; title: string}[] = [
    {status: 'done', title: '기업정보'},
    {status: 'done', title: '대표자 역량 및 경력사항'},
    {status: 'writing', title: '기업 기타 정보'},
    {status: 'todo', title: '핵심 기술 인력 현황'},
    {status: 'todo', title: '경영진 역량 및 구성'},
    {status: 'todo', title: '특허 보유현황'},
    {status: 'todo', title: '기술실적 및 인증실적'},
]

const MAX_TAB_COUNT = TAB_COUNT_CASES.length
const MIN_TAB_COUNT = 2
// 선택된 칸은 세 번째로 두되, 칸이 그보다 적으면 마지막 칸을 선택한다.
const ACTIVE_TAB_INDEX = 2

const TAB_COUNTS = Array.from({length: MAX_TAB_COUNT - MIN_TAB_COUNT + 1}, (_, index) => MIN_TAB_COUNT + index)

// 케이스 행 — 칸 폭이 곧 줄바꿈을 결정하므로 실제 화면 폭(max-w-content, 1200px)을 그대로 잡고,
// 가이드 카드가 그보다 좁으면 가로 스크롤한다. 카드 폭에 맞춰 줄이면 시안보다 훨씬 좁은 칸이 나와
// 개수별 모양을 잘못 보게 된다.
const TitleRow = ({children}: {children: ReactNode}) => (
    <div className="overflow-x-auto">
        <div className="bg-background border-subtle-3 min-w-content flex items-stretch gap-1 rounded-md border p-6">
            {children}
        </div>
    </div>
)

const RESPONSIVE_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'base', header: '기반', align: 'start'},
] as const

const RESPONSIVE_ROWS = [
    {
        key: 'xl',
        cells: ['xl 이상 (1280~)', '가로 탭. 칸이 폭을 나눠 갖고 선택한 탭 아래에 폼 카드가 붙습니다.', 'Tabs'],
    },
    {
        key: 'md',
        cells: [
            'md~xl (768~1279)',
            '현재 섹션 한 줄이 콘텐츠 열 안의 카드로 놓이고, 누르면 바로 아래로 항목 목록이 열립니다.',
            'Popover',
        ],
    },
    {
        key: 'mobile',
        cells: ['md 미만 (~767)', '같은 방식이되 줄이 화면 폭을 채우고 헤더 아래에 고정됩니다.', 'Popover'],
    },
] as const

const STATUS_COLUMNS = [
    {key: 'status', header: 'status', align: 'start', rowHeader: true},
    {key: 'label', header: '표시 문구', align: 'start'},
    {key: 'icon', header: '아이콘', align: 'start'},
    {key: 'rule', header: '판정 기준', align: 'start', wrap: true},
] as const

const STATUS_ROWS = [
    {
        key: 'todo',
        cells: [
            <code key="k">todo</code>,
            '미작성',
            '없음',
            '이 탭에 손댄 흔적이 없을 때. 채운 칸도, 늘린 카드도 없습니다.',
        ],
    },
    {
        key: 'writing',
        cells: [
            <code key="k">writing</code>,
            '작성중',
            'MessageCircleMore',
            '일부만 채웠을 때. 비어 있는 필수 칸이 남았거나 어긋난 값이 있습니다.',
        ],
    },
    {
        key: 'done',
        cells: [<code key="k">done</code>, '작성완료', 'CircleCheck', '필수 칸을 모두 채웠고 어긋난 값이 없을 때.'],
    },
] as const

const API_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const TITLE_API_ROWS = [
    {
        key: 'title',
        cells: [
            <code key="p">title</code>,
            <code key="t">ReactNode</code>,
            '섹션 제목입니다. 칸 너비를 넘으면 두 줄로 줄바꿈됩니다.',
        ],
    },
    {
        key: 'status',
        cells: [
            <code key="p">status</code>,
            <code key="t">&apos;done&apos; | &apos;writing&apos; | &apos;todo&apos;</code>,
            '작성 상태입니다. 문구와 아이콘이 함께 정해집니다. 기본값은 todo 입니다.',
        ],
    },
    {
        key: 'active',
        cells: [
            <code key="p">active</code>,
            <code key="t">boolean</code>,
            '선택 상태입니다. Tabs 안에서는 Radix 가 알려주므로 탭 밖에서 단독으로 쓸 때만 지정합니다.',
        ],
    },
    {
        key: 'variant',
        cells: [
            <code key="p">variant</code>,
            <code key="t">&apos;tab&apos; | &apos;row&apos; | &apos;bar&apos;</code>,
            '놓이는 자리입니다. tab 은 가로 탭 한 칸, row 는 세로 목록의 카드 행, bar 는 면도 여백도 없는 한 줄(모바일 고정 헤더)입니다.',
        ],
    },
    {
        key: 'chevron',
        cells: [
            <code key="p">chevron</code>,
            <code key="t">boolean</code>,
            '오른쪽 끝에 펼침 아이콘을 붙입니다. 누르면 목록이 열리는 자리에만 씁니다.',
        ],
    },
    {
        key: 'asChild',
        cells: [
            <code key="p">asChild</code>,
            <code key="t">boolean</code>,
            '이 생김새를 children 으로 넘긴 요소(TabsTrigger 등)에 얹습니다. FormTabs 가 쓰는 방식입니다.',
        ],
    },
] as const

const API_ROWS = [
    {
        key: 'items',
        cells: [
            <code key="p">items</code>,
            <code key="t">FormTabItem[]</code>,
            '탭 목록입니다. 각 항목은 value(식별자) · title(섹션 제목) · content(탭 본문)로 구성하며 content 에는 보통 FormCard 를 넣습니다. 선택하지 않은 탭도 마운트한 채로 두므로 값과 스크롤 위치가 유지됩니다.',
        ],
    },
    {
        key: 'status',
        cells: [
            <code key="p">items[].status</code>,
            <code key="t">&apos;done&apos; | &apos;writing&apos; | &apos;todo&apos;</code>,
            '작성 상태입니다. 생략하면 그 탭에 입력한 값에서 자동으로 계산되므로 보통은 넘기지 않습니다. 특정 상태를 고정해 보여줄 때만 씁니다.',
        ],
    },
    {
        key: 'value',
        cells: [
            <code key="p">defaultValue · value · onValueChange</code>,
            <code key="t">string · (value: string) =&gt; void</code>,
            '선택된 탭입니다. 생략하면 첫 번째 탭이 선택되고 FormTabs 가 스스로 관리합니다. useFormTabsSubmit 처럼 밖에서 탭을 바꿔야 하면 value · onValueChange 로 제어합니다.',
        ],
    },
    {
        key: 'stickyHeader',
        cells: [
            <code key="p">stickyHeader</code>,
            <code key="t">ReactNode</code>,
            '모바일 고정 줄 위에 함께 붙는 내용(단계·제목)입니다. 모바일에서만 그려지며, 태블릿·PC 는 화면이 제목을 따로 둡니다.',
        ],
    },
    {
        key: 'className',
        cells: [
            <code key="p">className</code>,
            <code key="t">string</code>,
            '탭과 본문을 감싸는 루트의 레이아웃을 확장합니다.',
        ],
    },
] as const

const FormTabsGuidePage = () => (
    <GuidePageShell
        title="폼 탭 (FormTabs)"
        description="긴 입력 폼을 섹션 단위로 나눠 보여주는 카드형 탭입니다. 각 탭에 섹션 제목과 작성 상태를 함께 표시하고, 선택된 탭 아래에 그 섹션의 폼(FormCard)이 이어집니다."
    >
        <BaseCard>
            <section aria-labelledby="ft-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>items</code> 에 탭별 식별자 · 제목 · 본문을 넘기면 탭 전환과 본문 표시, 화면 폭에 따른
                        형태 전환이 함께 처리됩니다. 작성 상태는 적지 않습니다. 직접 눌러 보는 예시는 아래{' '}
                        <a href="#ft-submit" className="text-primary-strong underline underline-offset-4">
                            폼 제출
                        </a>{' '}
                        에 한 벌만 둡니다. 같은 폼을 한 화면에 두 번 두면 입력 <code>id</code> 가 겹치기
                        때문입니다[8.1.1].
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-parts" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-parts" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        폼 탭 화면은 네 가지를 조합합니다. 실제 화면(자가진단 &gt; 기업·기술정보 입력)도 같은
                        구성입니다.
                    </p>
                </div>
                <Table caption="FormTabs 구성 요소와 역할" columns={PARTS_COLUMNS} rows={PARTS_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-values" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-values" className="typo-h4-bold">
                        값 관리
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        입력값은 <code>FormValuesProvider</code> 가 <code>name</code> 을 키로 한 객체 하나에 모읍니다.
                        FormTabs 를 쓸 때 이 Provider 는 필수입니다. 화면 폭이 xl(1280)을 넘나들면 FormTabs 안쪽 트리가
                        통째로 다시 그려지므로, 값이 DOM 에만 있으면(비제어 입력) 그 순간 사라집니다.
                    </p>
                </div>
                <CodeBlock code={VALUES_CODE} language="tsx" copyLabel="복사" />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">값이 모이는 입력</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            아래 컴포넌트를 <code>@/components/composite/form-values</code> 에서 가져오면 값이 자동으로
                            모입니다. 같은 이름을 <code>ui/</code> 에서 직접 가져오면 보관소에 연결되지 않으니 import
                            경로를 확인합니다.
                        </p>
                        <Table
                            size="md"
                            caption="값이 모이는 입력 목록"
                            columns={WRAPPER_COLUMNS}
                            rows={WRAPPER_ROWS}
                        />
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                값 객체의 키는 각 입력의 <code>name</code> 이라 <code>FormData</code> 의 키와 같습니다.
                                보고 있지 않은 탭의 값도 함께 제출됩니다.
                            </li>
                            <li>
                                입력값을 다듬어 담아야 하면 <code>format</code> 을 줍니다(하이픈 · 숫자만 남기기 등).
                                보정된 값이 그대로 상태에 담겨 화면 표시와 제출 값이 항상 같습니다.
                            </li>
                            <li>
                                폼 라이브러리로 옮길 때는 <code>FormValuesProvider</code> 를 react-hook-form 의{' '}
                                <code>FormProvider</code> 등으로, 입력 래퍼의 value/onChange 연결을{' '}
                                <code>register</code>/<code>Controller</code> 로 바꿉니다. 화면(JSX)은 <code>name</code>{' '}
                                만 주고 쓰므로 그대로 둡니다.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-submit" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-submit" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>useFormTabsSubmit</code> 이 검사 · 메시지 표시 · 걸린 칸의 탭 열기와 포커스 이동을 맡고,
                        모두 통과했을 때만 콜백에 값을 넘깁니다. 실제 화면과 같은 다섯 개 탭 구성이며, 입력하는 즉시
                        &ldquo;모이는 중&rdquo; 칸에 값이 쌓여 어느 탭의 값이 어떤 이름으로 모이는지 확인할 수 있습니다.
                        수량 · 금액 칸은 <code>defaultValues</code> 로 화면이 열릴 때부터 0 이 들어 있습니다.
                    </p>
                </div>
                <FormTabsFormDemo />
                <CodeBlock code={SUBMIT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-validation" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-validation" className="typo-h4-bold">
                        유효성 검사
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        검사 규칙을 따로 만들지 않고 브라우저 기본 제약 검사(<code>required</code> ·{' '}
                        <code>type=&quot;email&quot;</code> · <code>min</code>/<code>max</code>)를 그대로 씁니다. 화면에
                        적어 둔 <code>required</code> 가 곧 검사 기준이자 작성 상태 기준이라 기준이 한 벌로 유지됩니다.
                    </p>
                </div>
                <CodeBlock code={VALIDATION_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        메시지는 브라우저 기본 문구 대신 라벨을 넣어 &ldquo;이름을 입력해 주세요.&rdquo; 처럼 다시
                        씁니다[7.4.2]. 라벨만으로 부족한 칸은 <code>data-required-message</code> ·{' '}
                        <code>data-pattern-message</code> 로 문구를 직접 적습니다.
                    </li>
                    <li>
                        읽기 전용 칸은 브라우저 검사에서 빠집니다. [조회] 버튼으로 채우는 필수 칸만 예외로 직접
                        확인합니다.
                    </li>
                    <li>
                        &ldquo;고를 수는 있지만 제출은 막아야 하는&rdquo; 규칙(근무 시작·종료 순서 등)은 달력에서 막지
                        않고 <code>DatePicker</code> 의 <code>validationMessage</code> 로 처리합니다. 못 누르게 하면
                        사용자는 이유를 모른 채 고장으로 읽습니다.
                    </li>
                    <li>
                        폼 안의 버튼은 <code>type</code> 을 주지 않으면 기본이 <code>submit</code> 입니다. 행추가 ·
                        조회처럼 제출이 아닌 버튼에는 반드시 <code>type=&quot;button&quot;</code> 을 줍니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-status" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-status" className="typo-h4-bold">
                        작성 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        상태는 손으로 적지 않고 그 탭에 입력한 값에서 계산합니다. 값이 바뀌면 문구와 아이콘이 함께
                        바뀝니다. 선택된 탭은 흰 카드 배경에 좌측 primary 액센트 바가 붙고 제목이 Bold 로 바뀝니다.
                    </p>
                </div>
                <Table size="md" caption="FormTabs 작성 상태와 판정 기준" columns={STATUS_COLUMNS} rows={STATUS_ROWS} />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        작성완료 판정에 세는 것은 <code>required</code> 를 붙인 칸뿐입니다. 읽기 전용 칸은 세지
                        않습니다. 필수 칸이 하나도 없는 탭은 무엇이든 하나 채우면 작성완료가 됩니다.
                    </li>
                    <li>
                        값이 어긋난 칸(이메일 형식 · 짝이 되는 날짜의 앞뒤)이 있으면 다 채웠어도 작성완료가 되지
                        않습니다. 고칠 것이 남았는데 완료로 보이면 사용자가 그 탭을 다시 열어 볼 이유가 없어집니다.
                    </li>
                    <li>
                        반복 카드를 쓰는 탭은 필수 여부가 카드 단위입니다(<code>FormCardScope</code>). 기본 첫 카드는
                        손대지 않으면 세지 않고 한 칸이라도 채우면 나머지 칸이 모두 필수가 됩니다. &quot;행추가&quot; 로
                        늘린 카드는 처음부터 모두 필수라, 쓰지 않을 카드는 지웁니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-responsive" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-responsive" className="typo-h4-bold">
                        반응형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면 폭에 따라 두 가지 모양이 됩니다. <code>items</code> 는 같아 화면 코드는 그대로입니다.
                        보이는 위젯이 달라지므로 기반 컴포넌트도 함께 바뀝니다. 같은 마크업에 CSS 만 씌우면 생김새와
                        역할(<code>role</code> · 키보드 조작)이 어긋납니다[8.2.1].
                    </p>
                </div>
                <Table size="md" caption="FormTabs 반응형 동작" columns={RESPONSIVE_COLUMNS} rows={RESPONSIVE_ROWS} />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">태블릿 (md~xl)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            현재 섹션 한 줄만 콘텐츠 열 안의 카드로 놓이고 본문은 그 섹션만 보입니다. 줄의 아래 여백
                            20px 을 폼 카드가 덮고 올라와 한 덩어리로 읽힙니다. 목록은 제목 바로 아래(4px)에서 열리고
                            폭은 제목 묶음과 같습니다. 줄은 고정하지 않고 본문과 함께 흐릅니다.
                        </p>
                        {/* 태블릿 줄은 768 이상에서만 쓰이므로 좁은 가이드 화면에 맞춰 줄이지 않고 가로 스크롤한다.
                            Popover 는 눌러야 열리므로 여기서는 같은 조각으로 결과만 재현한다. */}
                        <div className="overflow-x-auto">
                            <div className="bg-background border-subtle-3 min-w-content flex flex-col rounded-md border p-6">
                                <div className={formTabsTabletBarClassName}>
                                    <FormTabTitle
                                        active
                                        chevron
                                        variant="bar"
                                        title={TITLE_CASES[1]?.title}
                                        status={TITLE_CASES[1]?.status}
                                    />
                                </div>
                                <div className={cn(formTabsPickerPanelClassName, 'mx-10 -mt-9')}>
                                    {TITLE_CASES.map((item) => (
                                        <FormTabTitle
                                            key={item.status}
                                            variant="row"
                                            title={item.title}
                                            status={item.status}
                                            className={
                                                item.status === TITLE_CASES[1]?.status
                                                    ? formTabsPickerCurrentRowClassName
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">모바일 (md 미만)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            현재 섹션 한 줄이 사이트 헤더 아래에 고정됩니다. 줄은 화면 폭을 채우고 아래 두 모서리만
                            둥글어 폼 카드와 한 덩어리로 읽힙니다. 목록은 고정 줄 아래 4px 에서 같은 폭으로 열리며, 아래
                            공간이 부족하면 Popover 가 위로 엽니다. 화면을 덮는 모달이 아니라 눌린 줄에 붙는
                            드롭다운이라 어디를 눌러 열었는지가 그대로 남습니다.
                        </p>
                        {/* 실제 화면은 좁은 폭에서만 이 모양이라, 가이드에서는 모바일 폭(360)을 잡아 열린 모습 그대로 보여준다. */}
                        <div className="bg-background border-subtle-3 rounded-md border p-6">
                            <div className="mx-auto flex w-full max-w-90 flex-col gap-1">
                                <div className="bg-card flex rounded-b-lg px-4 py-4">
                                    <FormTabTitle
                                        active
                                        chevron
                                        variant="bar"
                                        title={TITLE_CASES[1]?.title}
                                        status={TITLE_CASES[1]?.status}
                                    />
                                </div>
                                <div className={formTabsPickerPanelClassName}>
                                    {TITLE_CASES.map((item) => (
                                        <FormTabTitle
                                            key={item.status}
                                            variant="row"
                                            title={item.title}
                                            status={item.status}
                                            className={
                                                item.status === TITLE_CASES[1]?.status
                                                    ? formTabsPickerCurrentRowClassName
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-title" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-title" className="typo-h4-bold">
                        탭 타이틀 (FormTabTitle)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        탭 한 칸의 생김새를 담당합니다. FormTabs 는 이 컴포넌트를 <code>asChild</code> 로{' '}
                        <code>TabsTrigger</code> 에 얹어 쓰므로 단독으로 쓸 때와 모양이 같습니다. 단독으로 쓸 때는{' '}
                        <code>active</code> 로 선택 상태를 직접 지정합니다.
                    </p>
                </div>
                <CodeBlock code={TITLE_CODE} language="tsx" copyLabel="복사" />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태별 모양</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            작성완료 · 작성중 · 미작성 순서입니다. 첫 줄은 비선택, 둘째 줄은 선택 상태입니다.
                        </p>
                        <TitleRow>
                            {TITLE_CASES.map((item) => (
                                <FormTabTitle key={item.status} title={item.title} status={item.status} />
                            ))}
                        </TitleRow>
                        <TitleRow>
                            {TITLE_CASES.map((item) => (
                                <FormTabTitle key={item.status} active title={item.title} status={item.status} />
                            ))}
                        </TitleRow>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목이 길 때</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            제목은 띄어쓰기 단위로 줄바꿈되고, 띄어쓰기가 없어 한 줄에 담기지 않는 말만 글자 단위로
                            넘어갑니다. 칸 높이는 가장 긴 제목에 맞춰 함께 늘어나며 문구는 모두 위에서부터 정렬됩니다.
                        </p>
                        <TitleRow>
                            {TITLE_LENGTH_CASES.map((item, index) => (
                                <FormTabTitle
                                    key={item.title}
                                    active={index === ACTIVE_TAB_INDEX}
                                    title={item.title}
                                    status={item.status}
                                />
                            ))}
                        </TitleRow>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">탭 개수</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            칸은 남는 폭을 똑같이 나눠 가집니다. 개수가 늘수록 칸이 좁아져 제목이 두 줄로 넘어가고, 시안
                            기준 최대 {MAX_TAB_COUNT}개까지 한 줄에 놓입니다.
                        </p>
                        {TAB_COUNTS.map((count) => (
                            <div key={count} className="flex flex-col gap-2">
                                <p className="typo-body-m-medium text-foreground-subtle">{count}개</p>
                                <TitleRow>
                                    {TAB_COUNT_CASES.slice(0, count).map((item, index) => (
                                        <FormTabTitle
                                            key={item.title}
                                            active={index === Math.min(ACTIVE_TAB_INDEX, count - 1)}
                                            title={item.title}
                                            status={item.status}
                                        />
                                    ))}
                                </TitleRow>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">FormTabTitle Props</h3>
                        <Table
                            size="md"
                            caption="FormTabTitle Props 목록"
                            columns={API_COLUMNS}
                            rows={TITLE_API_ROWS}
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        탭 동작은 shadcn Tabs(Radix), 좁은 화면의 목록은 Popover(Radix)를 그대로 써서 역할과 키보드
                        조작을 손수 만들지 않습니다[8.2.1].
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        xl 이상은 <code>role=&quot;tab&quot;</code>/<code>tabpanel</code> 연결, 좌우 화살표 이동, roving
                        tabindex 가 기본 제공됩니다.
                    </li>
                    <li>xl 미만의 항목 목록은 Esc · 바깥 클릭으로 닫히고 포커스가 눌렀던 줄로 돌아옵니다[6.1.2].</li>
                    <li>작성 상태는 아이콘뿐 아니라 문구로도 표시되어 색 · 아이콘에만 의존하지 않습니다[5.3.1].</li>
                    <li>
                        오류 메시지는 <code>role=&quot;alert&quot;</code> 로 그 자리에서 읽히고 컨트롤과{' '}
                        <code>aria-describedby</code> 로 이어집니다[7.4.2].
                    </li>
                    <li>
                        걸린 칸으로의 스크롤 이동은 <code>prefers-reduced-motion</code> 을 존중합니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ft-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        FormTabs 에 넘기는 속성입니다. 그 밖의 Radix Tabs 속성도 그대로 넘길 수 있습니다.
                    </p>
                </div>
                <Table size="md" caption="FormTabs Props 목록" columns={API_COLUMNS} rows={API_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FormTabsGuidePage
