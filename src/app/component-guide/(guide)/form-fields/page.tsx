import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
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

const USAGE_CODE = `{/* 라벨 + 입력 한 칸. 라벨·간격·오류 메시지 자리를 Field 가 갖는다 */}
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

const ERROR_CODE = `{/* 입력 즉시 아는 오류는 error 로 직접 넘긴다 */}
<Field id="foundedAt" label="설립일" error="오늘 이후 날짜는 고를 수 없습니다.">…</Field>

{/* 넘기지 않으면 제출할 때 담긴 메시지(FormValues)를 이 칸의 id 로 찾아 쓴다 */}
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
/>`

const PROPS_ITEMS = [
    ['Field', 'id', '라벨·오류 메시지와 컨트롤을 잇는 id 입니다. 자식 컨트롤에 같은 id 를 줍니다.', '-', 'string'],
    ['Field', 'label', '칸 위에 붙는 라벨 글자입니다.', '-', 'string'],
    [
        'Field',
        'required',
        '라벨 뒤에 필수 표시(*)를 붙입니다. 컨트롤의 required 는 따로 지정합니다.',
        'false',
        'boolean',
    ],
    ['Field', 'helper', '칸 아래 도움말입니다. id-helper 로 aria-describedby 에 이어집니다.', 'undefined', 'string'],
    [
        'Field',
        'error',
        '직접 넘기는 오류 문구입니다. 넘기지 않으면 제출 때 담긴 메시지를 id 로 찾아 씁니다.',
        'undefined',
        'string',
    ],
    ['Field', 'className', '칸 하나에만 주는 배치 조정입니다.', 'undefined', 'string'],
    ['Field', 'children', '이 칸이 감싸는 컨트롤입니다(Input·Select·DatePicker 등).', '-', 'ReactNode'],
    ['LockedField', 'id', 'id 이자 name 입니다. 값은 readOnly 로 두되 제출에는 포함됩니다.', '-', 'string'],
    ['LockedField', 'label', '라벨 글자입니다.', '-', 'string'],
    ['LockedField', 'value', '자동으로 채워 넣을 값입니다.', '-', 'string'],
    ['LockedField', 'required', '라벨의 필수 표시와 컨트롤의 required 를 함께 켭니다.', 'false', 'boolean'],
    ['LockedField', 'autoComplete', '브라우저 자동완성 힌트입니다.', "'off'", 'string'],
    ['LookupField', 'id', 'id 이자 기본 name 입니다.', '-', 'string'],
    ['LookupField', 'name', 'id 와 다른 이름으로 제출해야 할 때만 지정합니다.', 'id', 'string'],
    ['LookupField', 'label', '라벨 글자입니다.', '-', 'string'],
    ['LookupField', 'placeholder', '입력 안내 문구입니다.', '-', 'string'],
    ['LookupField', 'action', '오른쪽 버튼의 글자입니다(조회·검색 등).', '-', 'string'],
    ['LookupField', 'readOnly', '조회로만 채우는 칸이면 켭니다.', 'false', 'boolean'],
    [
        'LookupField',
        'wrapAction',
        '버튼을 감싸 모달 트리거로 만들 때 씁니다. 감싼 결과를 돌려줍니다.',
        'undefined',
        '(button: ReactNode) => ReactNode',
    ],
    ['FieldGrid', 'children', '한 줄에 두 칸씩(md 이상) 놓습니다. 거터·줄 간격 모두 24 입니다.', '-', 'ReactNode'],
    ['FieldRow3', 'children', '한 줄에 세 칸(md 이상)을 놓습니다.', '-', 'ReactNode'],
    [
        'FieldRow3',
        'className',
        '라벨이 긴 칸이 섞여 태블릿 폭에서 줄이 어긋날 때만 칸 수를 조정합니다.',
        'undefined',
        'string',
    ],
] as const

const FormFieldsGuidePage = () => (
    <GuidePageShell
        title="폼 필드 (Field)"
        description="라벨·컨트롤·오류 메시지를 한 칸으로 묶는 폼의 기본 조각입니다. 화면은 이 조각만 늘어놓고, 간격과 오류 표시 방식은 여기 한 곳에서 정합니다."
    >
        <BaseCard>
            <section aria-labelledby="form-fields-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="form-fields-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">Field</code> 가 라벨과 메시지 자리를 갖고, 줄 배치는{' '}
                        <code className="font-mono">FieldGrid</code>(2열)·
                        <code className="font-mono">FieldRow3</code>(3열)가 맡습니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <RequiredFieldsNotice />
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-fields-error" className="flex flex-col gap-4">
                <div>
                    <h2 id="form-fields-error" className="typo-h4-bold">
                        오류 메시지
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        메시지는 두 갈래로 들어옵니다. 입력하는 순간 아는 오류는{' '}
                        <code className="font-mono">error</code> 로 직접 넘기고, 제출할 때 걸리는 오류는 폼이 담아 둔
                        메시지를 이 칸의 id 로 찾아 씁니다.
                    </p>
                </div>
                <CodeBlock code={ERROR_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-fields-variants" className="flex flex-col gap-4">
                <div>
                    <h2 id="form-fields-variants" className="typo-h4-bold">
                        잠긴 칸과 조회 칸
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        회원정보에서 자동으로 채워지는 칸은 <code className="font-mono">LockedField</code>,
                        모달·검색으로 값을 받아오는 칸은 <code className="font-mono">LookupField</code> 를 씁니다.
                    </p>
                </div>
                <CodeBlock code={VARIANT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-fields-a11y" className="flex flex-col gap-3">
                <h2 id="form-fields-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        라벨은 <code className="font-mono">label htmlFor</code> ↔ 컨트롤{' '}
                        <code className="font-mono">id</code> 로 잇습니다 — 같은 id 를 자식 컨트롤에도 반드시 넘겨야
                        합니다[7.4.1].
                    </li>
                    <li>
                        오류가 있으면 칸에 <code className="font-mono">data-invalid</code>, 컨트롤에{' '}
                        <code className="font-mono">aria-invalid</code>, 메시지에{' '}
                        <code className="font-mono">aria-describedby</code> 가 함께 걸립니다[7.4.2].
                    </li>
                    <li>
                        도움말은 <code className="font-mono">{`{id}-helper`}</code>, 오류는{' '}
                        <code className="font-mono">{`{id}-error`}</code> 로 id 가 정해져 있어 사용처에서 따로 이을 것이
                        없습니다.
                    </li>
                    <li>
                        필수 표시는 색이 아니라 <code className="font-mono">*</code> 기호와 라벨 앞의 안내 (
                        <code className="font-mono">RequiredFieldsNotice</code>)로 함께 전합니다[5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-fields-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="form-fields-props" className="typo-h4-bold">
                        Props
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="폼 필드 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FormFieldsGuidePage
