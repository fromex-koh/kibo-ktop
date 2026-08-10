import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {FormTabTitle, type FormTabStatus} from '@/components/composite/form-tab-title'
import {formTabsPickerPanelClassName, formTabsPickerRowClassName} from '@/components/theme/form-tabs.variants'
import FormTabsFormDemo from './form-tabs-form-demo'

export const metadata: Metadata = {title: '폼 탭 (FormTabs)'}

const USAGE_CODE = `// 작성 상태(미작성·작성중·작성완료)는 적지 않는다 — 각 탭에 입력한 값에서 자동으로 계산된다.
const ITEMS = [
  {value: 'company', title: '기업정보', content: <FormCard title="기업정보">…</FormCard>},
  {value: 'ceo', title: '대표자 경력사항', content: <FormCard title="대표자 경력사항">…</FormCard>},
  {value: 'staff', title: '핵심 기술 인력 현황', content: <FormCard title="핵심 기술 인력 현황">…</FormCard>},
]

<FormTabs items={ITEMS} />`

const VALUES_CODE = `// 값은 FormTabs 바깥에 모은다. xl(1280) 을 넘나들면 FormTabs 안쪽이 다시 그려지므로,
// 값이 DOM 에만 있으면(비제어 입력) 그때 사라진다.
<FormValuesProvider>
  <FormTabs items={ITEMS} />
</FormValuesProvider>

// 입력은 form-values 에서 가져오고 name 만 주면 된다 — 값 객체의 키가 곧 name 이고 FormData 키와 같다.
import {ClearableInput, DatePicker, Select, TelInput, useFormValues} from '@/components/composite/form-values'

<ClearableInput id="ceo-name" name="ceoName" />
<TelInput id="company-tel" name="companyTel" />   // 숫자만 받아 하이픈을 자동으로 넣는다
<DatePicker id="found-date" name="foundDate" maxDate={today} />
<Select name="corpType">
  <SelectTrigger id="corp-type">…</SelectTrigger>  // Select 는 뿌리에 id 가 없다 — 트리거에 붙인다
</Select>

// 모인 값 전체를 읽을 때
const {values} = useFormValues()   // {ceoName: '홍길동', companyTel: '02-1234-5678', …}`

const FORM_CODE = `<FormValuesProvider>
  <form noValidate onSubmit={handleSubmit}>
    <FormTabs items={ITEMS} value={currentTab} onValueChange={setCurrentTab} />
    <Button type="submit">입력 내용 확인</Button>
    {/* 그 밖의 버튼(행추가·조회 등)에는 type="button" 을 반드시 준다 — 기본값이 submit 이다 */}
  </form>
</FormValuesProvider>

const handleSubmit = (event) => {
  event.preventDefault()
  const form = event.currentTarget
  const errors = getFieldErrors(form)          // 브라우저 기본 검사(checkValidity)를 그대로 쓴다
  setFieldErrors(errors)                       // 메시지는 각 칸 밑에 Field 가 그린다

  if (errors.length) {
    const [first] = errors
    setCurrentTab(first.section)               // 걸린 칸이 다른 탭이면 그 탭을 먼저 연다
    // 그려진 다음(커밋 후) 첫 오류 칸으로 포커스를 옮긴다
    return
  }

  const values = Object.fromEntries(new FormData(form))
}`

const VALIDATION_CODE = `// 메시지 자리는 Field 한 곳이다. 컨트롤의 aria-invalid·aria-describedby 는
// form-values 의 입력 래퍼가 같은 id 로 알아서 건다.
<Field id="manager-name" label="이름" required>
  <ClearableInput id="manager-name" name="managerName" required />
</Field>

// 제출할 때 담는다 — 키는 입력의 id(라벨의 htmlFor 가 가리키는 그 id)다.
const {setFieldErrors} = useFormValues()
setFieldErrors({'manager-name': '이름을 입력해 주세요.'})

// 값을 고치면 그 칸 메시지는 저절로 사라진다. 짝이 되는 칸을 고쳐 함께 맞게 된 경우만 직접 거둔다.
const clearError = useClearFieldError('career-1-start')

// 입력 즉시 알려야 하는 규칙은 DatePicker 의 validationMessage 로 — 고를 수는 있고 제출만 막힌다.
<DatePicker name="career-1-start" validationMessage={message} />`

const WRAPPER_COLUMNS = [
    {key: 'name', header: '입력', align: 'start', rowHeader: true},
    {key: 'note', header: '쓰는 자리와 특징', align: 'start', wrap: true},
] as const

const WRAPPER_ROWS = [
    {key: 'input', cells: ['Input', '기본 한 줄 입력. 조회 버튼이 붙는 칸처럼 지우기 버튼이 필요 없을 때.']},
    {key: 'clearable', cells: ['ClearableInput', '지우기 버튼이 붙는 한 줄 입력. 대부분의 텍스트 칸이 이것이다.']},
    {key: 'tel', cells: ['TelInput', '전화번호. 숫자만 받아 하이픈을 자동으로 넣는다(02·050X·1544 대응).']},
    {key: 'group', cells: ['InputGroupInput', '단위(명·건·백만원)가 붙는 입력. InputGroup 안에서 쓴다.']},
    {key: 'textarea', cells: ['Textarea', '여러 줄 입력.']},
    {key: 'select', cells: ['Select · SelectTrigger', 'id 는 트리거에 붙인다 — 뿌리(Select)에는 id 속성이 없다.']},
    {key: 'radio', cells: ['RadioGroup', '라디오 묶음. 항목은 RadioGroupItem 을 그대로 쓴다.']},
    {key: 'date', cells: ['DatePicker', '날짜. 값은 yyyy-MM-dd 문자열로 담기고 제출 값도 같다.']},
]

const TITLE_CODE = `// 탭 한 칸의 생김새 — FormTabs 는 이 컴포넌트를 TabsTrigger 에 얹어 쓴다.
<FormTabTitle title="기업정보" status="writing" active />

<FormTabTitle asChild title="기업정보" status="writing">
  <TabsTrigger value="company" />
</FormTabTitle>`

// 탭 타이틀 케이스 표 — 시안의 "탭 타이틀" 섹션은 [상태 3종 × 선택 여부] 와 제목 줄 수 조합으로 이뤄진다.
const TITLE_CASES: readonly {status: FormTabStatus; title: string}[] = [
    {status: 'done', title: '기업정보'},
    {status: 'writing', title: '경영진 역량 및 구성'},
    {status: 'todo', title: '재무정보'},
]

// 제목 길이별 큐레이션 — 짧은 제목 · 두 줄로 넘어가는 제목 · 띄어쓰기가 없어 글자 단위로 끊기는 제목.
const TITLE_LENGTH_CASES: readonly {status: FormTabStatus; title: string}[] = [
    {status: 'done', title: '재무정보'},
    {status: 'done', title: '핵심 기술 인력 현황'},
    {status: 'writing', title: '기술개발 및 사업화 추진실적 상세현황'},
    {status: 'todo', title: '지식재산권보유및기술이전실적상세내역'},
    {status: 'todo', title: '특허 보유현황'},
]

// 탭 개수별 모양 — 칸은 남는 폭을 똑같이 나눠 가지므로 개수가 늘수록 좁아진다. 시안 기준 최대 7개.
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
    {key: 'shape', header: '모양과 기반 컴포넌트', align: 'start', wrap: true},
] as const

const RESPONSIVE_ROWS = [
    {
        key: 'xl',
        cells: ['xl 이상 (1280~)', '가로 탭 — 칸이 폭을 나눠 갖고, 선택한 탭 아래에 폼 카드가 붙습니다. (Tabs)'],
    },
    {
        key: 'md',
        cells: [
            'md~xl (768~1279)',
            '세로 펼침 목록 — 접힌 섹션은 탭 행, 펼친 섹션은 행이 사라지고 폼 카드만 남습니다. (Collapsible)',
        ],
    },
    {
        key: 'mobile',
        cells: [
            'md 미만 (~767)',
            '현재 섹션 한 줄이 헤더 아래에 고정되고, 그 줄을 누르면 바로 아래로 항목 목록이 열립니다. (Popover)',
        ],
    },
]

const STATUS_COLUMNS = [
    {key: 'status', header: 'status', align: 'start', rowHeader: true},
    {key: 'label', header: '표시 문구', align: 'start'},
    {key: 'icon', header: '아이콘', align: 'start'},
    {key: 'style', header: '스타일', align: 'start', wrap: true},
] as const

const STATUS_ROWS = [
    {
        key: 'done',
        cells: [
            <span key="k" className="text-primary font-mono">
                done
            </span>,
            '작성완료',
            'CircleCheck',
            '문구 Medium · foreground-subtle(활성 탭에서는 foreground)',
        ],
    },
    {
        key: 'writing',
        cells: [
            <span key="k" className="text-primary font-mono">
                writing
            </span>,
            '작성중',
            'MessageCircleMore',
            '문구 Medium · foreground-subtle(활성 탭에서는 foreground)',
        ],
    },
    {
        key: 'todo',
        cells: [
            <span key="k" className="text-primary font-mono">
                todo
            </span>,
            '미작성',
            '없음',
            '문구 Regular · disabled(활성 탭에서는 foreground)',
        ],
    },
]

const STATUS_RULE_COLUMNS = [
    {key: 'status', header: '표시', align: 'start', rowHeader: true},
    {key: 'rule', header: '그 탭이 이럴 때', align: 'start', wrap: true},
] as const

const STATUS_RULE_ROWS = [
    {key: 'todo', cells: ['미작성', '이 탭에 손댄 흔적이 없을 때 — 채운 칸도, 늘린 카드도 없습니다']},
    {
        key: 'writing',
        cells: ['작성중', '일부만 채웠을 때 — 비어 있는 필수 칸이 남았거나, 채웠어도 어긋난 값이 있습니다'],
    },
    {key: 'done', cells: ['작성완료', '필수 칸을 모두 채웠고 어긋난 값이 없을 때']},
]

const TITLE_PROPS_ROWS = [
    {
        key: 'title',
        cells: [
            <span key="k" className="text-primary font-mono">
                title
            </span>,
            '섹션 제목입니다. 칸 너비를 넘으면 두 줄로 줄바꿈됩니다.',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
    {
        key: 'status',
        cells: [
            <span key="k" className="text-primary font-mono">
                status
            </span>,
            '작성 상태입니다. 문구와 아이콘이 함께 정해집니다. 기본값은 todo 입니다.',
            <span key="t" className="font-mono">
                &apos;done&apos; | &apos;writing&apos; | &apos;todo&apos;
            </span>,
        ],
    },
    {
        key: 'active',
        cells: [
            <span key="k" className="text-primary font-mono">
                active
            </span>,
            '선택 상태입니다. Tabs 안에서는 Radix 가 알려주므로 넘기지 않고, 탭 밖에서 단독으로 쓸 때만 지정합니다.',
            <span key="t" className="font-mono">
                boolean
            </span>,
        ],
    },
    {
        key: 'variant',
        cells: [
            <span key="k" className="text-primary font-mono">
                variant
            </span>,
            '놓이는 자리입니다. tab 은 가로 탭 한 칸, row 는 세로 목록의 흰 카드 행, bar 는 면도 여백도 없는 한 줄(모바일 고정 헤더)입니다.',
            <span key="t" className="font-mono">
                &apos;tab&apos; | &apos;row&apos; | &apos;bar&apos;
            </span>,
        ],
    },
    {
        key: 'chevron',
        cells: [
            <span key="k" className="text-primary font-mono">
                chevron
            </span>,
            '오른쪽 끝에 펼침 아이콘을 붙입니다. 누르면 펼쳐지거나 목록이 열리는 자리에만 씁니다.',
            <span key="t" className="font-mono">
                boolean
            </span>,
        ],
    },
    {
        key: 'asChild',
        cells: [
            <span key="k" className="text-primary font-mono">
                asChild
            </span>,
            '이 생김새를 children 으로 넘긴 요소(TabsTrigger 등)에 얹습니다. FormTabs 가 쓰는 방식입니다.',
            <span key="t" className="font-mono">
                boolean
            </span>,
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
        key: 'items',
        cells: [
            <span key="k" className="text-primary font-mono">
                items
            </span>,
            '탭 목록입니다. 각 항목은 value(식별자) · title(섹션 제목) · content(탭 본문)로 구성하며, content 에는 보통 FormCard 를 넣습니다. 선택하지 않은 탭도 마운트한 채로 두므로 값과 스크롤 위치가 유지됩니다.',
            <span key="t" className="font-mono">
                FormTabItem[]
            </span>,
        ],
    },
    {
        key: 'status',
        cells: [
            <span key="k" className="text-primary font-mono">
                items[].status
            </span>,
            '작성 상태입니다. 문구와 아이콘이 함께 정해집니다. 생략하면 그 탭에 입력한 값에서 자동으로 계산되므로, 보통은 넘기지 않습니다.',
            <span key="t" className="font-mono">
                &apos;done&apos; | &apos;writing&apos; | &apos;todo&apos;
            </span>,
        ],
    },
    {
        key: 'defaultValue',
        cells: [
            <span key="k" className="text-primary font-mono">
                defaultValue · value · onValueChange
            </span>,
            '선택된 탭입니다. 생략하면 첫 번째 탭이 선택되고 FormTabs 가 스스로 관리합니다. 검사에 걸린 칸의 탭으로 옮기는 것처럼 밖에서 탭을 바꿔야 하면 value·onValueChange 로 제어합니다.',
            <span key="t" className="font-mono">
                string · (value: string) =&gt; void
            </span>,
        ],
    },
    {
        key: 'className',
        cells: [
            <span key="k" className="text-primary font-mono">
                className
            </span>,
            '탭과 본문을 감싸는 루트의 레이아웃을 확장합니다.',
            <span key="t" className="font-mono">
                string
            </span>,
        ],
    },
]

// 폼 탭 — 카드형 탭(제목 + 작성 상태) + 탭 본문(FormCard) 조합.
const FormTabsGuidePage = () => (
    <GuidePageShell
        title="폼 탭 (FormTabs)"
        description="긴 입력 폼을 섹션 단위로 나눠 보여주는 카드형 탭입니다. 각 탭에 섹션 제목과 작성 상태를 함께 표시하고, 선택된 탭 아래에 해당 섹션의 폼(FormCard)이 이어집니다."
    >
        <BaseCard>
            <section aria-labelledby="ft-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">items</code> 에 탭별 식별자·제목·본문을 넘기면 탭 전환과 본문 표시,
                        화면 폭에 따른 형태 전환이 함께 처리됩니다. 본문에는 기존{' '}
                        <code className="font-mono">FormCard</code> 를 그대로 사용하고, 작성 상태는 적지 않습니다 — 그
                        탭에 입력한 값에서 계산됩니다.
                    </p>
                </div>
                {/* 실제로 눌러 보는 예시는 아래 "폼 제출" 한 곳에만 둔다 — 같은 폼을 한 화면에 두 번 렌더하면
                    입력 id 와 name 이 겹친다[8.1.1]. */}
                <p className="typo-body-l-regular text-muted-foreground">
                    직접 눌러 보는 예시는 아래{' '}
                    <a href="#ft-form" className="text-primary underline">
                        폼 제출
                    </a>{' '}
                    에 있습니다. 실제 화면(자가진단 &gt; 기업·기술정보 입력)과 같은 다섯 개 탭 구성이며, 같은 폼을 한
                    화면에 두 번 두면 입력 <code className="font-mono">id</code> 가 겹치므로 이 페이지에는 한 벌만
                    둡니다.
                </p>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-values" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-values" className="typo-h4-bold">
                        값 관리
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        입력값은 <code className="font-mono">FormValuesProvider</code> 가{' '}
                        <code className="font-mono">name</code> 을 키로 한 객체 하나에 모읍니다. FormTabs 를 쓸 때 이
                        Provider 는 선택이 아니라 필수입니다 — 화면 폭이 xl(1280) 을 넘나들면 FormTabs 안쪽 트리가
                        통째로 다시 그려지므로, 값이 DOM 에만 있으면(비제어 입력) 그 순간 사라집니다.
                    </p>
                </div>
                <CodeBlock code={VALUES_CODE} language="tsx" copyLabel="값 관리 코드 복사" />
                <div>
                    <h3 className="typo-body-xl-bold">값이 모이는 입력</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아래 컴포넌트를 <code className="font-mono">@/components/composite/form-values</code> 에서
                        가져오면 값이 자동으로 모입니다. 같은 이름을 <code className="font-mono">ui/</code> 에서 직접
                        가져오면 보관소에 연결되지 않으니 import 경로를 확인해 주세요.
                    </p>
                </div>
                <Table size="md" caption="값이 모이는 입력 목록" columns={WRAPPER_COLUMNS} rows={WRAPPER_ROWS} />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                    <li>
                        값 객체의 키는 각 입력의 <code className="font-mono">name</code> 이라{' '}
                        <code className="font-mono">FormData</code> 의 키와 정확히 같습니다. 보고 있지 않은 탭의 값도
                        함께 제출됩니다 — 선택하지 않은 탭도 마운트한 채로 두고 감추기만 하기 때문입니다.
                    </li>
                    <li>
                        입력값을 다듬어 담아야 하면 <code className="font-mono">format</code> 을 줍니다(전화번호 하이픈
                        · 숫자만 남기기 등). 보정된 값이 그대로 상태에 담기므로 화면 표시와 제출 값이 항상 같습니다.
                    </li>
                    <li>
                        폼 라이브러리로 옮길 때 손댈 곳은 두 군데입니다 —{' '}
                        <code className="font-mono">FormValuesProvider</code> 를 react-hook-form 의{' '}
                        <code className="font-mono">FormProvider</code> 등으로 바꾸고, 위 래퍼들의 value/onChange 연결을{' '}
                        <code className="font-mono">register</code>/<code className="font-mono">Controller</code> 로
                        바꾸면 됩니다. 화면(JSX)은 <code className="font-mono">name</code> 만 주고 쓰므로 그대로 둡니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        실제 화면과 같은 다섯 개 탭 구성입니다. 보고 있지 않은 탭의 입력도 함께 제출됩니다 — 선택하지
                        않은 탭도 마운트한 채로 두고 감추기만 하기 때문입니다. 제출하기 전에도 입력하는 즉시
                        &ldquo;모이는 중&rdquo; 칸에 값이 쌓이므로, 어느 탭의 값이 어떤 이름으로 모이는지 그 자리에서
                        확인할 수 있습니다. 비워 둔 숫자 칸은 제출할 때만{' '}
                        <code className="font-mono">&quot;0&quot;</code> 으로 채워 보냅니다 — 화면에는 그대로 비어 있어
                        작성 상태 판정에는 영향을 주지 않습니다.
                    </p>
                </div>
                <p className="typo-body-l-regular text-muted-foreground">
                    값은 <code className="font-mono">FormValuesProvider</code> 로 FormTabs 바깥에 모읍니다. 화면 폭이
                    바뀌면 FormTabs 안쪽이 다시 그려지므로, 값이 DOM 에만 있으면(비제어 입력) 그때 사라집니다. 값 객체의
                    키는 각 입력의 <code className="font-mono">name</code> 이라 FormData 의 키와 같습니다 — 창 크기를
                    바꿔 가며 입력해도 값이 남아 있는지 함께 확인해 보세요.
                </p>
                <FormTabsFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="폼 제출 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-validation" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-validation" className="typo-h4-bold">
                        유효성 검사
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        검사 규칙을 따로 만들지 않고 브라우저 기본 제약 검사(
                        <code className="font-mono">required</code> ·{' '}
                        <code className="font-mono">type=&quot;email&quot;</code> ·{' '}
                        <code className="font-mono">min</code>/<code className="font-mono">max</code>)를 그대로 씁니다.
                        화면에 적어 둔 <code className="font-mono">required</code> 가 곧 검사 기준이자 작성 상태
                        기준이라 기준이 한 벌로 유지됩니다.
                    </p>
                </div>
                <CodeBlock code={VALIDATION_CODE} language="tsx" copyLabel="유효성 검사 코드 복사" />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                    <li>
                        메시지는 입력 바로 밑, 도움말 위에 <code className="font-mono">Field</code> 가 그립니다.
                        컨트롤의 <code className="font-mono">aria-invalid</code> 와{' '}
                        <code className="font-mono">aria-describedby</code> 는 같은 id 로 자동 연결되고, 기존 도움말
                        연결이 있으면 함께 묶입니다[7.4.2].
                    </li>
                    <li>
                        걸린 칸이 다른 탭에 있으면 그 탭을 먼저 열고 첫 번째 칸으로 포커스를 옮깁니다 — 안 보이는 곳의
                        메시지는 없는 것과 같습니다. 마우스로 제출하면 브라우저가{' '}
                        <code className="font-mono">:focus-visible</code> 을 켜지 않으므로, 검사에 걸린 칸은{' '}
                        <code className="font-mono">:focus</code> 에도 포커스 표시가 나오게 해 두었습니다[6.1.2].
                    </li>
                    <li>
                        읽기 전용 칸은 브라우저 검사에서 빠집니다(<code className="font-mono">willValidate</code> 가
                        false). [조회] 버튼으로 채우는 필수 칸처럼 그래도 비면 안 되는 값은 직접 확인해야 합니다.
                    </li>
                    <li>
                        &quot;고를 수는 있지만 제출은 막아야 하는&quot; 규칙(근무 시작·종료 순서 등)은 달력에서 막지
                        않고 <code className="font-mono">DatePicker</code> 의{' '}
                        <code className="font-mono">validationMessage</code> 로 처리합니다. 아예 못 누르게 하면 사용자는
                        이유를 모른 채 고장으로 읽습니다.
                    </li>
                    <li>
                        폼 안의 버튼은 <code className="font-mono">type</code> 을 주지 않으면 기본이{' '}
                        <code className="font-mono">submit</code> 입니다. 행추가·조회처럼 제출이 아닌 버튼에는 반드시{' '}
                        <code className="font-mono">type=&quot;button&quot;</code> 을 줍니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-responsive" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-responsive" className="typo-h4-bold">
                        반응형
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        화면 폭에 따라 세 가지 모양이 됩니다. <code className="font-mono">items</code> 는 셋 모두 같아
                        화면 코드는 그대로입니다. 보이는 위젯이 달라지므로 기반 컴포넌트도 함께 바뀝니다 — 같은 마크업에
                        CSS 만 씌우면 생김새와 역할(<code className="font-mono">role</code> · 키보드 조작)이
                        어긋납니다[8.2.1].
                    </p>
                </div>
                <Table size="md" caption="FormTabs 반응형 동작" columns={RESPONSIVE_COLUMNS} rows={RESPONSIVE_ROWS} />
                <h3 className="typo-body-xl-bold">태블릿 (md~xl) — 세로 펼침 목록</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    접힌 섹션은 탭 행 한 줄로 보이고, 펼치면 그 행이 사라지면서 폼 카드만 남습니다. 다시 접는 버튼은
                    카드 제목 오른쪽에 붙습니다.
                </p>
                {/* 태블릿 행은 768 이상에서만 쓰이므로 좁은 가이드 화면에 맞춰 줄이지 않고 가로 스크롤한다. */}
                <div className="overflow-x-auto">
                    <div className="bg-background border-subtle-3 min-w-content flex flex-col gap-2 rounded-md border p-6">
                        {TITLE_CASES.map((item) => (
                            <FormTabTitle
                                key={item.status}
                                chevron
                                variant="row"
                                title={item.title}
                                status={item.status}
                                active={item.status === 'writing'}
                            />
                        ))}
                    </div>
                </div>
                <h3 className="typo-body-xl-bold">모바일 (md 미만) — 고정 한 줄 + 항목 목록</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    현재 섹션 한 줄만 사이트 헤더 아래에 고정되고 본문은 그 섹션만 보입니다. 줄을 누르면 그 줄 바로
                    아래로 모든 항목의 제목과 작성 상태를 담은 목록이 열리고, 고른 항목이 같은 화면에서 바로 펼쳐집니다.
                    화면을 덮는 모달이 아니라 눌린 줄에 붙는 드롭다운이라, 지금 어디를 눌러 열었는지가 화면에 그대로
                    남습니다.
                </p>
                {/* 실제 화면은 좁은 폭에서만 이 모양이라, 가이드에서는 모바일 폭(360)을 잡아 열린 모습 그대로 보여준다.
                    Popover 는 눌러야 열리므로 여기서는 같은 조각으로 결과만 재현한다. */}
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
                                    className={formTabsPickerRowClassName}
                                    title={item.title}
                                    status={item.status}
                                    active={item.status === TITLE_CASES[1]?.status}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                    <li>
                        고정 줄은 화면 폭을 꽉 채우고 아래 두 모서리만 둥급니다 — 아래 폼 카드와 한 덩어리로 읽힙니다.
                    </li>
                    <li>
                        목록은 눌린 줄이 아니라 고정 줄(흰 면) 아래로 4px 떨어져 열리고, 폭은 줄과 같습니다. 여는 방향과
                        위치는 Popover 가 화면 여백을 보고 정하므로 아래 공간이 부족하면 위로 열립니다.
                    </li>
                    <li>Esc·바깥 클릭으로 닫히고 포커스는 눌렀던 줄로 돌아옵니다 — Radix 가 맡습니다[8.2.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-title" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-title" className="typo-h4-bold">
                        탭 타이틀 (FormTabTitle)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        탭 한 칸의 생김새를 담당하는 컴포넌트입니다. FormTabs 는 이 컴포넌트를{' '}
                        <code className="font-mono">asChild</code> 로 <code className="font-mono">TabsTrigger</code> 에
                        얹어 사용하므로, 탭 밖에서 단독으로 쓸 때와 모양이 완전히 같습니다. 단독으로 쓸 때는{' '}
                        <code className="font-mono">active</code> 로 선택 상태를 직접 지정합니다.
                    </p>
                </div>
                <h3 className="typo-body-xl-bold">비선택</h3>
                <TitleRow>
                    {TITLE_CASES.map((item) => (
                        <FormTabTitle key={item.status} title={item.title} status={item.status} />
                    ))}
                </TitleRow>
                <h3 className="typo-body-xl-bold">선택</h3>
                <TitleRow>
                    {TITLE_CASES.map((item) => (
                        <FormTabTitle key={item.status} active title={item.title} status={item.status} />
                    ))}
                </TitleRow>
                <div>
                    <h3 className="typo-body-xl-bold">제목이 길 때</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목은 띄어쓰기 단위로 줄바꿈되고, 띄어쓰기가 없어 한 줄에 담기지 않는 말만 글자 단위로
                        넘어갑니다. 칸 높이는 가장 긴 제목에 맞춰 함께 늘어나며, 문구는 모두 위에서부터 정렬됩니다.
                    </p>
                </div>
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
                <div>
                    <h3 className="typo-body-xl-bold">탭 개수</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        칸은 남는 폭을 똑같이 나눠 가집니다. 개수가 늘수록 칸이 좁아져 제목이 두 줄로 넘어가고, 시안
                        기준 최대 {MAX_TAB_COUNT}개까지 한 줄에 놓입니다.
                    </p>
                </div>
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
                <CodeBlock code={TITLE_CODE} language="tsx" copyLabel="복사" />
                <Table size="md" caption="FormTabTitle Props 목록" columns={PROPS_COLUMNS} rows={TITLE_PROPS_ROWS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-status" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-status" className="typo-h4-bold">
                        작성 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        상태는 세 가지이며 문구·아이콘·색이 함께 정해집니다. 선택된 탭은 흰 카드 배경에 좌측 primary
                        액센트 바가 붙고 제목이 Bold 로 바뀝니다.
                    </p>
                </div>
                <Table size="md" caption="FormTabs 작성 상태" columns={STATUS_COLUMNS} rows={STATUS_ROWS} />
                <p className="typo-body-l-regular text-muted-foreground">
                    상태는 손으로 적지 않고 그 탭에 입력한 값에서 계산합니다. 값이 바뀌면 문구와 아이콘이 함께 바뀝니다.
                </p>
                <Table size="md" caption="작성 상태 판정 기준" columns={STATUS_RULE_COLUMNS} rows={STATUS_RULE_ROWS} />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                    <li>
                        읽기 전용 칸은 세지 않습니다 — 회원정보에서 자동으로 채워지는 값이나 계산 결과처럼 사용자가 쓰는
                        칸이 아니기 때문입니다.
                    </li>
                    <li>
                        작성완료 판정에 세는 것은 <code className="font-mono">required</code> 를 붙인 칸뿐입니다 —
                        화면에 <span aria-hidden="true">*</span> 로 표시한 것과 같은 기준입니다. 필수 칸이 하나도 없는
                        탭은 무엇이든 하나 채우면 작성완료가 됩니다(반드시 채워야 할 값이 없다는 뜻입니다).
                    </li>
                    <li>
                        값이 어긋난 칸이 있으면 다 채웠어도 작성완료가 되지 않습니다 — 이메일 형식이 맞지 않거나, 근무
                        시작·종료처럼 짝이 되는 칸의 앞뒤가 뒤집힌 경우입니다. 고칠 것이 남았는데 완료로 보이면 사용자가
                        그 탭을 다시 열어 볼 이유가 없어집니다.
                    </li>
                    <li>
                        반복 카드를 쓰는 탭은 필수 여부가 카드 단위입니다(
                        <code className="font-mono">FormCardScope</code>). 기본으로 주어지는 첫 카드는 손대지 않으면
                        세지 않고, 한 칸이라도 채우면 그 카드의 나머지 칸이 모두 필수가 됩니다. 사용자가
                        &quot;행추가&quot; 로 늘린 카드는 비어 있어도 처음부터 모두 필수라, 추가만 하고 비워 둔 탭은
                        작성중이 됩니다 — 쓰지 않을 카드는 지웁니다.
                    </li>
                    <li>
                        <code className="font-mono">items[].status</code> 를 직접 넘기면 계산 대신 그 값을 씁니다 — 아래
                        탭 타이틀 예시처럼 특정 상태를 고정해 보여줄 때만 씁니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        탭 동작은 shadcn Tabs(Radix)를 그대로 사용합니다 —{' '}
                        <code className="font-mono">role=&quot;tab&quot;</code>/
                        <code className="font-mono">tabpanel</code> 연결, 좌우 화살표 이동, 선택 탭만 Tab 키 순서에
                        포함되는 roving tabindex 가 기본 제공됩니다[8.2.1]. 작성 상태는 아이콘뿐 아니라 문구로도
                        표시되어 색·아이콘에만 의존하지 않습니다[5.3.1].
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                    <li>
                        화면 폭에 따라 기반 컴포넌트가 바뀝니다(Tabs · Collapsible · Popover). 같은 마크업에 CSS 만
                        씌우지 않는 이유는 보이는 위젯과 역할·키보드 조작을 맞추기 위해서입니다[8.2.1].
                    </li>
                    <li>
                        태블릿에서 섹션을 펼치면 눌렀던 행이 사라지므로 카드 헤더의 접기 버튼으로, 접으면 다시 나타난
                        행으로 포커스를 넘깁니다. 모바일 목록은 Popover(Radix)라 Esc·바깥 클릭으로 닫히고 포커스가
                        눌렀던 줄로 돌아옵니다[6.1.2].
                    </li>
                    <li>
                        오류 메시지는 <code className="font-mono">role=&quot;alert&quot;</code> 로 그 자리에서 읽히고,
                        컨트롤과 <code className="font-mono">aria-describedby</code> 로 이어집니다[7.4.2].
                    </li>
                    <li>
                        스크롤 이동은 <code className="font-mono">prefers-reduced-motion</code> 을 존중해, 동작을
                        줄이도록 설정한 사용자에게는 즉시 이동합니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">FormTabs 에 넘기는 속성입니다.</p>
                </div>
                <Table size="md" caption="FormTabs Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FormTabsGuidePage
