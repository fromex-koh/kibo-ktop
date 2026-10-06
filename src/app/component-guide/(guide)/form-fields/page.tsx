// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {
    Field,
    FieldGrid,
    FieldRow3,
    LockedField,
    LookupField,
    RequiredFieldsNotice,
} from '@/components/composite/form-fields'
import {Input} from '@/components/ui/input'
import {InputGroup, InputGroupInput} from '@/components/ui/input-group'

export const metadata: Metadata = {title: '폼 필드 (Field)'}

const USAGE_CODE = `{/* 라벨 + 입력 한 칸 — Field 의 id 와 컨트롤의 id 를 같게 준다 */}
<Field id="companyName" label="기업명" required>
  <InputGroup>
    <InputGroupInput id="companyName" name="companyName" placeholder="기업명을 입력해 주세요" />
  </InputGroup>
</Field>

{/* 두 칸씩 놓는 줄 */}
<FieldGrid>
  <Field id="ceoName" label="대표자명">…</Field>
  <Field id="foundedAt" label="설립일">…</Field>
</FieldGrid>

{/* 세 칸이 오는 줄 */}
<FieldRow3>
  <Field id="sameIndustry" label="동업종 여부">…</Field>
  <Field id="task" label="담당업무">…</Field>
  <Field id="position" label="최종직급">…</Field>
</FieldRow3>`

const ERROR_CODE = `{/* 입력하는 순간 아는 오류 — error 로 직접 넘긴다 */}
<Field id="foundedAt" label="설립일" error="오늘 이후 날짜는 고를 수 없습니다.">…</Field>

{/* 제출 때 걸리는 오류 — error 를 넘기지 않으면 폼(FormValues)이 담아 둔 메시지를 id 로 찾아 쓴다 */}
<Field id="email" label="이메일">…</Field>`

const VARIANT_CODE = `{/* 회원정보에서 자동으로 채워지는 값 — readOnly 지만 FormData 에는 그대로 담긴다 */}
<LockedField id="businessNumber" label="사업자번호" value="123-45-67890" />

{/* 조회·검색 버튼이 붙는 입력 */}
<LookupField
  id="industryCode"
  label="업종코드"
  placeholder="업종코드를 조회해 주세요"
  action="업종코드 조회"
  readOnly
  wrapAction={(button) => <IndustryCodeDialog>{button}</IndustryCodeDialog>}
/>

{/* 모달 없이 그 자리에서 확인하는 버튼(중복확인 등) + 형식 검사 */}
<LookupField
  id="loginId"
  label="아이디"
  placeholder="아이디를 입력해 주세요"
  action="중복확인"
  pattern="[a-z0-9]{4,12}"
  patternMessage="영문 소문자 · 숫자 4~12자로 입력해 주세요."
  onAction={checkDuplicate}
  actionPending={isChecking}
  actionPendingLabel="확인 중"
/>`

const PROPS_ITEMS = [
    ['Field', 'id', '라벨 · 메시지와 컨트롤을 잇는 id. 자식 컨트롤에 같은 id 를 줍니다.', '-', 'string'],
    ['Field', 'label', '칸 위 라벨.', '-', 'string'],
    ['Field', 'required', '라벨에 필수 표시(*)를 붙입니다. 컨트롤의 required 는 따로 줍니다.', 'false', 'boolean'],
    ['Field', 'helper', '칸 아래 도움말.', 'undefined', 'string'],
    ['Field', 'error', '직접 넘기는 오류 문구. 없으면 제출 때 담긴 메시지를 id 로 찾아 씁니다.', 'undefined', 'string'],
    ['Field', 'className', '이 칸에만 주는 배치 조정.', 'undefined', 'string'],
    ['Field', 'children', '감쌀 컨트롤(Input · Select · DatePicker 등).', '-', 'ReactNode'],
    ['LockedField', 'id', 'id 이자 name. 읽기전용이지만 제출에는 포함됩니다.', '-', 'string'],
    ['LockedField', 'label', '라벨.', '-', 'string'],
    ['LockedField', 'value', '채워 넣을 값.', '-', 'string'],
    ['LockedField', 'required', '필수 표시와 컨트롤의 required 를 함께 켭니다.', 'false', 'boolean'],
    ['LockedField', 'autoComplete', '브라우저 자동완성 힌트.', "'off'", 'string'],
    ['LookupField', 'id', 'id 이자 기본 name.', '-', 'string'],
    ['LookupField', 'name', 'id 와 다른 이름으로 제출할 때만 줍니다.', 'id', 'string'],
    ['LookupField', 'label', '라벨.', '-', 'string'],
    ['LookupField', 'placeholder', '입력 안내 문구.', '-', 'string'],
    ['LookupField', 'action', '오른쪽 버튼 글자(조회 · 검색 · 중복확인 등).', '-', 'string'],
    ['LookupField', 'required', '필수 표시와 컨트롤의 required 를 함께 켭니다.', 'false', 'boolean'],
    ['LookupField', 'readOnly', '버튼으로만 채우는 칸이면 켭니다.', 'false', 'boolean'],
    ['LookupField', 'helper', '칸 아래 도움말.', 'undefined', 'string'],
    ['LookupField', 'pattern', '값의 형식(HTML pattern).', 'undefined', 'string'],
    ['LookupField', 'patternMessage', '형식이 어긋났을 때 칸 밑에 띄울 안내.', 'undefined', 'string'],
    [
        'LookupField',
        'wrapAction',
        '버튼을 감싸 모달 트리거로 만들 때 씁니다. 감싼 결과를 돌려줍니다.',
        'undefined',
        '(button: ReactNode) => ReactNode',
    ],
    ['LookupField', 'onAction', '모달 없이 그 자리에서 확인할 때의 버튼 동작(중복확인 등).', 'undefined', '() => void'],
    [
        'LookupField',
        'actionPending',
        '확인 중 표시. 버튼이 진행 표시로 바뀌고 다시 눌리지 않습니다.',
        'false',
        'boolean',
    ],
    ['LookupField', 'actionPendingLabel', '확인 중에 버튼에 보일 글자.', 'action 과 같음', 'string'],
    ['LookupField', 'className', '이 칸에만 주는 배치 조정.', 'undefined', 'string'],
    ['FieldLabel', 'htmlFor', '연결할 컨트롤의 id 입니다.', '-', 'string'],
    ['FieldLabel', 'required', '필수 표시(*)와 스크린리더용 "(필수)" 문구를 붙입니다.', 'false', 'boolean'],
    ['FieldLabel', 'children', '라벨 글자입니다.', '-', 'string'],
    ['FieldGrid', 'children', '한 줄에 두 칸(md 이상). 칸 사이 · 줄 사이 간격은 24px.', '-', 'ReactNode'],
    ['FieldRow3', 'children', '한 줄에 세 칸(md 이상).', '-', 'ReactNode'],
    ['FieldRow3', 'className', '라벨이 긴 칸이 섞여 줄이 어긋날 때만 칸 수를 조정합니다.', 'undefined', 'string'],
] as const

const PART_COLUMNS = [
    {key: 'part', header: '조각', align: 'start', rowHeader: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const PART_ROWS = [
    {
        key: 'field',
        cells: [<code key="part">Field</code>, '라벨 + 컨트롤 한 칸. 도움말 · 오류 메시지 자리를 갖습니다.'],
    },
    {key: 'grid', cells: [<code key="part">FieldGrid</code>, '한 줄에 두 칸 (md 이상)']},
    {key: 'row3', cells: [<code key="part">FieldRow3</code>, '한 줄에 세 칸 (md 이상)']},
    {key: 'locked', cells: [<code key="part">LockedField</code>, '회원정보 등에서 자동으로 채워지는 읽기전용 칸']},
    {key: 'lookup', cells: [<code key="part">LookupField</code>, '조회 · 검색 · 중복확인 버튼이 붙는 칸']},
    {
        key: 'notice',
        cells: [
            <code key="part">RequiredFieldsNotice</code>,
            '카드 제목 아래(FormCard 의 subtitle)에 두는 "* 표시 항목은 필수" 안내',
        ],
    },
] as const

const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const SUB_LIST = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const FormFieldsGuidePage = () => (
    <GuidePageShell title="폼 필드 (Field)" description="라벨 · 컨트롤 · 메시지를 한 칸으로 묶는 폼의 기본 조각입니다.">
        <BaseCard>
            <section aria-labelledby="form-fields-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="form-fields-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>Field</code> 의 <code>id</code> 와 자식 컨트롤의 <code>id</code> 를 같게 줍니다. 간격과
                        메시지 표시는 Field 가 맡습니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    {/* 안내는 별표와 문장이 한 줄이어야 한다 — 세로 묶음의 자식으로 바로 두면 둘이 다른 줄로 갈라진다. */}
                    <p className="typo-body-l-regular text-label-foreground">
                        <RequiredFieldsNotice />
                    </p>
                    <Field id="guide-company-name" label="기업명" required>
                        <InputGroup>
                            <InputGroupInput
                                id="guide-company-name"
                                name="guide-company-name"
                                placeholder="기업명을 입력해 주세요"
                            />
                        </InputGroup>
                    </Field>
                    <FieldGrid>
                        <Field id="guide-ceo" label="대표자명" helper="법인등기부상 이름을 적어 주세요.">
                            <Input id="guide-ceo" name="guide-ceo" placeholder="대표자명" />
                        </Field>
                        <Field id="guide-email" label="이메일" error="올바른 이메일을 입력해 주세요.">
                            <Input id="guide-email" name="guide-email" placeholder="example@email.com" />
                        </Field>
                    </FieldGrid>
                    <FieldRow3>
                        <Field id="guide-task" label="담당업무">
                            <Input id="guide-task" name="guide-task" placeholder="담당업무" />
                        </Field>
                        <Field id="guide-position" label="최종직급">
                            <Input id="guide-position" name="guide-position" placeholder="최종직급" />
                        </Field>
                        <Field id="guide-period" label="근무기간">
                            <Input id="guide-period" name="guide-period" placeholder="근무기간" />
                        </Field>
                    </FieldRow3>
                    <FieldGrid>
                        <LockedField id="guide-business-number" label="사업자번호" value="123-45-67890" />
                        <LookupField
                            id="guide-industry-code"
                            label="업종코드"
                            placeholder="업종코드를 조회해 주세요"
                            action="업종코드 조회"
                            readOnly
                        />
                    </FieldGrid>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <Table caption="폼 필드 조각과 쓰는 곳" columns={PART_COLUMNS} rows={PART_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-fields-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="form-fields-variants" className="typo-h4-bold">
                        변형과 상태
                    </h2>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">오류 메시지</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            입력하는 순간 아는 오류는 <code>error</code> 로 넘깁니다. 넘기지 않으면 제출 때 폼이 담아 둔
                            메시지를 id 로 찾아 칸 밑에 붙입니다.
                        </p>
                        <CodeBlock code={ERROR_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">잠긴 칸과 조회 칸</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            자동으로 채워지는 칸은 <code>LockedField</code>, 버튼으로 값을 받아오거나 확인하는 칸은{' '}
                            <code>LookupField</code> 를 씁니다. 버튼이 모달을 열면 <code>wrapAction</code>, 그 자리에서
                            확인하면 <code>onAction</code> 을 씁니다.
                        </p>
                        <CodeBlock code={VARIANT_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-fields-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="form-fields-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사용처에서 할 일은 id 를 맞추는 것 하나입니다. 나머지는 Field 가 연결합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        라벨은 컨트롤의 <code>id</code> 로 이어집니다[7.4.1]. 자식 컨트롤에 같은 id 를 반드시 줍니다.
                    </li>
                    <li>
                        도움말(<code>{'{id}-helper'}</code>)과 오류(<code>{'{id}-error'}</code>)는{' '}
                        <code>aria-describedby</code> 로 이어지고, 오류가 있으면 <code>aria-invalid</code> 가 함께
                        걸립니다[7.4.2]. 오류 문구는 <code>FieldError</code> 가 알립니다.
                    </li>
                    <li>
                        필수 표시 <code>*</code> 는 장식(<code>aria-hidden</code>)이고 스크린리더에는 &quot;(필수)&quot;
                        문구를 줍니다. 색만으로 전하지 않도록 <code>RequiredFieldsNotice</code> 문장을 함께
                        둡니다[5.3.1].
                    </li>
                    <li>
                        <code>LookupField</code> 의 <code>actionPending</code> 중에는 버튼이 비활성이 되고{' '}
                        <code>aria-busy</code> 가 붙습니다[8.2.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-fields-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="form-fields-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="폼 필드 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FormFieldsGuidePage
