import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {CircleCheck, Lock, X} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {FormCard} from '@/components/composite/form-card'
import {FormTabs, type FormTabItem} from '@/components/composite/form-tabs'
import {DatePicker} from '@/components/composite/date-picker'
import {
    SubSectionHeader,
    SubSectionHeaderAction,
    SubSectionHeaderTitle,
} from '@/components/composite/sub-section-header'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Input} from '@/components/ui/input'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

export const metadata: Metadata = {title: '폼 탭 (FormTabs)'}

const USAGE_CODE = `const ITEMS = [
  {value: 'company', title: '기업정보', status: 'writing', content: <FormCard title="기업정보">…</FormCard>},
  {value: 'ceo', title: '대표자 경력사항', status: 'done', content: <FormCard title="대표자 경력사항">…</FormCard>},
  {value: 'staff', title: '핵심 기술 인력 현황', status: 'todo', content: <FormCard title="핵심 기술 인력 현황">…</FormCard>},
]

<FormTabs items={ITEMS} />`

// 필수 표시 라벨 — 별표는 장식이라 aria-hidden, 스크린리더에는 "(필수)" 문구를 준다[5.3.1 · 7.4.1].
const FieldLabel = ({htmlFor, children, required}: {htmlFor: string; children: string; required?: boolean}) => (
    <Label htmlFor={htmlFor} className="text-foreground gap-1 font-bold">
        {children}
        {required ? (
            <>
                <span aria-hidden="true" className="text-error-500">
                    *
                </span>
                <span className="sr-only"> (필수)</span>
            </>
        ) : null}
    </Label>
)

// 회원정보에서 자동 입력되는 값 — readOnly + 자물쇠 애드온(FormData 에는 그대로 포함된다).
const LockedField = ({id, label, value, required}: {id: string; label: string; value: string; required?: boolean}) => (
    <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={id} required={required}>
            {label}
        </FieldLabel>
        <InputGroup>
            <InputGroupInput id={id} readOnly defaultValue={value} />
            <InputGroupAddon align="inline-end" className="text-foreground">
                <Lock aria-hidden="true" className="size-icon-md" />
            </InputGroupAddon>
        </InputGroup>
    </div>
)

// 기업정보 탭 본문 — Figma 시안 그대로 [선택 + 자동입력 3필드] 2열 그리드와 안내 콜아웃으로 구성한다.
const CompanyForm = () => (
    <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="ft-corp-type" required>
                    기업형태
                </FieldLabel>
                <Select required>
                    <SelectTrigger id="ft-corp-type" className="w-full">
                        <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="corp">주식회사</SelectItem>
                        <SelectItem value="llc">유한회사</SelectItem>
                        <SelectItem value="etc">기타</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <LockedField id="ft-corp-name" label="기업명" value="(주)테크놀로지" required />
            <LockedField id="ft-biz-no" label="사업자번호" value="123-45-67890" required />
            <LockedField id="ft-corp-no" label="법인번호" value="11222-1234567" />
        </div>
        <Alert variant="solid" color="info">
            <CircleCheck aria-hidden="true" />
            <AlertDescription>
                기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.
            </AlertDescription>
        </Alert>
    </div>
)

// 라벨 + 입력 한 칸.
const Field = ({
    id,
    label,
    required,
    children,
}: {
    id: string
    label: string
    required?: boolean
    children: ReactNode
}) => (
    <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={id} required={required}>
            {label}
        </FieldLabel>
        {children}
    </div>
)

// 항목 반복 구획 — "경력사항 1" 처럼 번호가 붙고 우측에 삭제 버튼이 오는 하위 구획.
const RepeatSection = ({title, children}: {title: string; children: ReactNode}) => (
    <div className="flex flex-col gap-4">
        <SubSectionHeader>
            <SubSectionHeaderTitle>{title}</SubSectionHeaderTitle>
            <SubSectionHeaderAction>
                <Button variant="secondary" size="xs">
                    삭제
                    <X aria-hidden="true" />
                </Button>
            </SubSectionHeaderAction>
        </SubSectionHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">{children}</div>
    </div>
)

// 안내 문구 — FormCard 의 subtitle 은 <p> 라 리스트 대신 인라인 불릿으로 둔다[8.1.1].
const BulletNote = ({children}: {children: string}) => (
    <span className="flex gap-1.5">
        <ListMarker />
        <span>{children}</span>
    </span>
)

const ITEMS: readonly FormTabItem[] = [
    {
        value: 'company',
        title: '기업정보',
        status: 'writing',
        content: (
            <FormCard
                title="기업정보"
                subtitle={
                    <>
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        <span className="sr-only">별표</span> 표시 항목은 필수 입력 항목입니다.
                    </>
                }
            >
                <CompanyForm />
            </FormCard>
        ),
    },
    {
        value: 'ceo',
        title: '대표자 경력사항',
        status: 'done',
        content: (
            <FormCard
                title="대표자 경력사항"
                subtitle={
                    <BulletNote>
                        대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로 차례대로
                        입력해주십시오.
                    </BulletNote>
                }
                action={
                    <Button variant="secondary" size="md">
                        입력도우미
                    </Button>
                }
            >
                <RepeatSection title="경력사항 1">
                    <Field id="ft-career-start" label="근무시작 년월" required>
                        <DatePicker id="ft-career-start" />
                    </Field>
                    <Field id="ft-career-end" label="근무종료 년월" required>
                        <DatePicker id="ft-career-end" />
                    </Field>
                    <Field id="ft-career-company" label="회사명" required>
                        <Input id="ft-career-company" placeholder="입력해주세요" />
                    </Field>
                    <Field id="ft-career-position" label="직위" required>
                        <Input id="ft-career-position" placeholder="입력해주세요" />
                    </Field>
                </RepeatSection>
            </FormCard>
        ),
    },
    {
        value: 'staff',
        title: '핵심 기술 인력 현황',
        status: 'todo',
        content: (
            <FormCard
                title="핵심 기술 인력 현황"
                subtitle={<BulletNote>보유 기술 개발에 직접 참여한 인력을 기준으로 입력해주십시오.</BulletNote>}
                action={
                    <Button variant="secondary" size="md">
                        입력도우미
                    </Button>
                }
            >
                <RepeatSection title="핵심 인력 1">
                    <Field id="ft-staff-name" label="성명" required>
                        <Input id="ft-staff-name" placeholder="입력해주세요" />
                    </Field>
                    <Field id="ft-staff-position" label="직위" required>
                        <Input id="ft-staff-position" placeholder="입력해주세요" />
                    </Field>
                    <Field id="ft-staff-join" label="입사 년월" required>
                        <DatePicker id="ft-staff-join" />
                    </Field>
                    <Field id="ft-staff-tech" label="주요 담당 기술" required>
                        <Input id="ft-staff-tech" placeholder="입력해주세요" />
                    </Field>
                </RepeatSection>
            </FormCard>
        ),
    },
    {
        value: 'etc',
        title: '기업 기타 정보',
        status: 'writing',
        content: (
            <FormCard title="기업 기타 정보" subtitle={<BulletNote>최근 결산 기준으로 입력해주십시오.</BulletNote>}>
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <Field id="ft-etc-client" label="주요 거래처" required>
                        <Input id="ft-etc-client" placeholder="입력해주세요" />
                    </Field>
                    <Field id="ft-etc-export" label="수출 여부" required>
                        <Select required>
                            <SelectTrigger id="ft-etc-export" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">있음</SelectItem>
                                <SelectItem value="no">없음</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </FormCard>
        ),
    },
    {
        value: 'rnd',
        title: '기술 개발 실적',
        status: 'done',
        content: (
            <FormCard
                title="기술 개발 실적"
                subtitle={<BulletNote>최근 3년 이내 완료된 개발 과제부터 입력해주십시오.</BulletNote>}
                action={
                    <Button variant="secondary" size="md">
                        입력도우미
                    </Button>
                }
            >
                <RepeatSection title="개발 실적 1">
                    <Field id="ft-rnd-name" label="개발 과제명" required>
                        <Input id="ft-rnd-name" placeholder="입력해주세요" />
                    </Field>
                    <Field id="ft-rnd-done" label="개발 완료일" required>
                        <DatePicker id="ft-rnd-done" />
                    </Field>
                </RepeatSection>
            </FormCard>
        ),
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
            '탭 목록입니다. 각 항목은 value(식별자) · title(섹션 제목) · status(작성 상태) · content(탭 본문)로 구성하며, content 에는 보통 FormCard 를 넣습니다.',
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
            '작성 상태입니다. 문구와 아이콘이 함께 정해집니다.',
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
            'shadcn Tabs(Radix) 의 속성을 그대로 전달합니다. 생략하면 첫 번째 탭이 선택됩니다.',
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
                        <code className="font-mono">items</code> 에 탭별 제목·상태·본문을 넘기면 탭 전환과 본문 표시가
                        함께 처리됩니다. 본문에는 기존 <code className="font-mono">FormCard</code> 를 그대로 사용합니다.
                    </p>
                </div>
                {/* FormTabs 는 흰 카드(활성 탭·FormCard)가 곧 컴포넌트라, 가이드 카드의 흰 배경 위에 그대로
                    두면 경계가 사라진다. 실제 화면과 같은 페이지 배경(background) 위에 올려 보여준다. */}
                <div className="bg-background border-subtle-3 rounded-md border p-6">
                    <FormTabs items={ITEMS} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
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
