import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {SelectSearchFormDemo} from './select-search-form-demo'

export const metadata: Metadata = {title: '기준 선택 검색 (SelectSearchForm)'}

const USAGE_CODE = `// 하이픈은 있어도 없어도 된다(10-1111111-0000 · 1011111110000).
const OPTIONS = [
  {
    value: 'registration',
    label: '특허등록번호',
    pattern: /^(\\d{2}-?\\d{7}-?\\d{4}|\\d{7})$/,
    placeholder: '(로그인후) 13자리 또는 7자리 등록·출원번호를 입력하세요',
    note: '※ 검색대상 : 2026-04-01이전 등록 및 공고된 특허정보',
  },
  {
    value: 'application',
    label: '특허출원번호',
    pattern: /^(\\d{2}-?\\d{4}-?\\d{7}|\\d{9})$/,
    placeholder: '13자리 또는 9자리 등록번호를 입력하세요',
    note: '※ 출원상태인 특허는 평가제외',
  },
]

const [isSearching, setIsSearching] = useState(false)

<SelectSearchForm
  options={OPTIONS}
  emptyError="특허등록번호 또는 특허출원번호를 입력해주세요."
  isSearching={isSearching}
  onSearch={async ({type, value}) => {
    setIsSearching(true)
    setResult(await searchPatentGrade({type, number: value}))
    setIsSearching(false)
  }}
  // [초기화] — 검색 칸과 함께 결과도 처음 상태로 되돌린다.
  onReset={() => setResult(null)}
/>`

const DEFAULTS_CODE = `// 퍼블리싱 확인용 기본값 — 화면을 연 사람이 [검색하기]만 눌러 결과를 볼 수 있게 한다.
// 연동 시 defaultValues 한 줄을 지우면 빈 칸으로 시작한다.
<SelectSearchForm
  options={OPTIONS}
  defaultValues={{registration: '10-1111111-0000', application: '10-2026-1111111'}}
  onSearch={handleSearch}
/>`

const STATE_RULES = [
    '빈 값으로 검색 — 입력 줄 아래 4 에 emptyError 안내(16 Regular · 폼 오류 색)가 입력과 같은 왼쪽 선에 서고, 입력으로 포커스가 옮겨집니다.',
    '형식이 맞지 않음 — 고른 기준의 pattern 과 다르면 invalidError(기준 이름) 안내가 같은 자리에 섭니다. 입력하거나 기준을 바꾸면 안내가 사라집니다.',
    '검색 중(isSearching) — [검색하기]가 도는 표시와 "검색 중"으로 바뀌고 눌리지 않습니다. [초기화]도 함께 눌리지 않습니다. 최소 폭 128 이라 버튼이 흔들리지 않습니다.',
    '지우기(X) — 값이 있고 입력에 포커스가 있으면 오른쪽에 지우기 버튼이 뜹니다(ClearableInput 과 같음). 지운 뒤 포커스는 입력으로 돌아옵니다.',
    '구분선 색은 상태와 관계없이 바뀌지 않습니다 — 포커스는 입력 칸의 포커스 링, 오류는 안내 문구로만 알립니다.',
    '기준별 안내 — 기준을 바꾸면 입력 칸 안내(option.placeholder)와 버튼 줄 왼쪽 도움말(option.note, 14 Regular gray.600)이 그 기준의 문구로 바뀝니다. 도움말은 입력의 설명(aria-describedby)으로도 이어집니다. 좁은 화면에서는 도움말이 버튼 위 줄로 내려갑니다.',
] as const

const DEFAULT_RULES = [
    '첫 옵션이 처음 고른 기준이고, 입력은 defaultValues[첫 기준] 으로 시작합니다.',
    '기준을 바꾸면, 입력이 이전 기준의 기본값 그대로일 때만 새 기준의 기본값으로 바뀝니다 — 직접 입력한 값은 덮어쓰지 않습니다.',
    '[초기화]는 첫 기준과 그 기본값으로 돌아갑니다. defaultValues 가 없으면 빈 칸이 됩니다. 이어서 onReset 이 불리므로 사용처는 여기서 검색 결과도 처음 상태로 되돌립니다(특허 등급조회: 결과 영역이 사라지고 검색 전 상태로 돌아감).',
] as const

const A11Y_RULES = [
    '검색 기준 셀렉트와 입력에는 화면에 보이지 않는 이름(label)이 있습니다 — 입력의 이름은 고른 기준(예: 특허등록번호)입니다[7.4.1].',
    '오류 안내는 role="alert" 로 바로 읽히고, 입력의 aria-invalid · aria-describedby 로 이어집니다[7.4.2].',
    '검색 중에는 [검색하기]에 aria-busy 가 켜집니다. 도는 표시는 동작 줄이기 설정에서 멈춥니다[6.3.1].',
] as const

const PROPS_ITEMS = [
    [
        'SelectSearchForm',
        'options',
        '검색 기준 목록입니다. 첫 항목이 처음 고른 기준입니다. pattern 을 주면 형식이 맞아야 검색하고, placeholder 는 그 기준의 입력 안내, note 는 버튼 줄 왼쪽 도움말(※ 검색대상 등)입니다.',
        '-',
        'readonly {value; label; pattern?; placeholder?; note?}[]',
    ],
    [
        'SelectSearchForm',
        'onSearch',
        '형식 검사를 통과한 검색입니다. 고른 기준(type)과 앞뒤 공백을 걷은 값(value)을 넘깁니다.',
        '-',
        '({type, value}) => void',
    ],
    [
        'SelectSearchForm',
        'onReset',
        '[초기화]를 눌렀을 때입니다. 검색 칸이 처음 상태로 돌아간 뒤 불리며, 사용처는 여기서 검색 결과도 되돌립니다.',
        '-',
        '() => void',
    ],
    [
        'SelectSearchForm',
        'isSearching',
        '조회 중입니다. [검색하기]가 스피너 · searchingLabel 로 바뀌고 [검색하기] · [초기화]가 눌리지 않습니다.',
        'false',
        'boolean',
    ],
    [
        'SelectSearchForm',
        'defaultValues',
        '기준별로 처음 넣어 둘 값입니다. 기준 전환 · [초기화] 때도 이 값을 씁니다. 비우면 빈 칸으로 시작합니다.',
        '-',
        'Partial<Record<string, string>>',
    ],
    ['SelectSearchForm', 'emptyError', '입력을 비우고 검색했을 때의 안내입니다.', "'검색어를 입력해주세요.'", 'string'],
    [
        'SelectSearchForm',
        'invalidError',
        '형식이 맞지 않을 때의 안내입니다. 기준 이름을 받아 문장을 만듭니다.',
        'label => `${label} 형식이 올바르지 않습니다.`',
        '(label) => string',
    ],
    [
        'SelectSearchForm',
        'placeholder',
        '기준에 placeholder 가 없을 때 쓰는 입력 칸 안내 문구입니다. 기준 이름을 받아 문장을 만듭니다.',
        'option.placeholder ?? (label => `${label}를 입력하세요`)',
        '(label) => string',
    ],
    [
        'SelectSearchForm',
        'typeLabel · searchLabel · searchingLabel · resetLabel',
        '셀렉트 접근성 이름과 버튼 글자입니다.',
        "'검색 기준' · '검색하기' · '검색 중' · '초기화'",
        'string',
    ],
    ['SelectSearchForm', 'className', '카드(form) 스타일을 확장합니다.', '-', 'string'],
] as const

const RuleList = ({rules}: {rules: readonly string[]}) => (
    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
        {rules.map((rule) => (
            <li key={rule} className="flex">
                <ListMarker type="unordered" />
                <span className="min-w-0">{rule}</span>
            </li>
        ))}
    </ul>
)

const SelectSearchFormGuidePage = () => (
    <GuidePageShell
        title="기준 선택 검색 (SelectSearchForm)"
        description="검색 기준(셀렉트)을 고르고 번호 · 검색어를 한 줄에 크게 입력해 조회하는 검색 카드입니다. 특허 등급조회의 특허등록번호 / 특허출원번호 검색이 이 형태입니다."
    >
        <BaseCard>
            <section aria-labelledby="ssf-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="ssf-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        카드 흰 면 · 반경 24 · 그림자 · 여백 40 입니다. 기준 셀렉트(20 Medium · 화살표 20)와 입력(24
                        Regular)이 한 줄에 서고, 그 아래 구분선과 [초기화] · [검색하기]가 옵니다. 드롭다운 목록은
                        프로젝트 공통 셀렉트와 같습니다. 빈 값 · 형식이 틀린 값을 넣어 오류 안내도 확인해 보세요.
                    </p>
                </div>
                <SelectSearchFormDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssf-state" className="flex flex-col gap-4">
                <h2 id="ssf-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <RuleList rules={STATE_RULES} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssf-defaults" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="ssf-defaults" className="typo-h4-bold">
                        기본값 (defaultValues)
                    </h2>
                    <RuleList rules={DEFAULT_RULES} />
                </div>
                <SelectSearchFormDemo withDefaults />
                <CodeBlock code={DEFAULTS_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssf-a11y" className="flex flex-col gap-4">
                <h2 id="ssf-a11y" className="typo-h4-bold">
                    접근성 (Accessibility)
                </h2>
                <RuleList rules={A11Y_RULES} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssf-props" className="flex flex-col gap-4">
                <h2 id="ssf-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="SelectSearchForm 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectSearchFormGuidePage
