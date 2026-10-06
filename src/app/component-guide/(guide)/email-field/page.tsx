// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {EmailField} from '@/components/composite/email-field'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

import EmailFieldFormDemo from './email-field-form-demo'

export const metadata: Metadata = {title: '이메일 입력 (EmailField)'}

const USAGE_CODE = `<FormCard title="부분발송 이메일등록" subtitle="안내문을 추가로 받으실 이메일 주소를 입력해 주세요.">
  <EmailField name="additionalNoticeEmail" />
</FormCard>`

const SUBMIT_CODE = `{/* 주소는 hidden input 하나로 실린다 */}
<input type="hidden" name="additionalNoticeEmail" value="abc@naver.com" />

const handleSubmit = (formData: FormData) => {
  formData.get('additionalNoticeEmail')        // 'abc@naver.com'
  formData.get('additionalNoticeEmailPreset')  // 'naver.com' — 도메인 칸의 모드. 받는 쪽은 무시해도 된다
}`

const DOMAINS_CODE = `{/* 목록 바꾸기 — '직접입력'은 항상 맨 앞에 자동으로 들어간다 */}
<EmailField name="companyEmail" domains={['kibo.or.kr', 'korea.kr']} />

{/* 초기값 — 도메인이 목록에 있으면 셀렉트도 그 항목으로 시작한다 */}
<EmailField name="companyEmail" defaultLocalPart="kibo" defaultDomain="kibo.or.kr" />`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <EmailField name="contactEmail" required />
  <Button type="submit">입력 내용 확인</Button>
</form>

const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  formData.get('contactEmail') // 'abc@naver.com'
}`

const PROPS_ITEMS = [
    ['EmailField', 'name', '제출 필드명. 이 이름으로 합친 주소 하나가 전송됩니다.', "'email'", 'string'],
    [
        'EmailField',
        'domains',
        "셀렉트의 도메인 목록. '직접입력'은 항상 맨 앞에 자동으로 들어갑니다.",
        'naver · gmail · daum · hanmail · nate',
        'readonly string[]',
    ],
    ['EmailField', 'defaultLocalPart', '아이디 칸 초기값.', "''", 'string'],
    ['EmailField', 'defaultDomain', '도메인 칸 초기값. 목록에 있으면 셀렉트도 그 항목으로 시작합니다.', "''", 'string'],
    [
        'EmailField',
        'required',
        '필수 여부. 보이는 두 칸(아이디 · 도메인)에 걸립니다. 한 칸만 채우면 필수가 아니어도 나머지 칸을 검사합니다.',
        'false',
        'boolean',
    ],
    ['EmailField', 'className', '바깥 상자에 덧붙일 클래스.', 'undefined', 'string'],
] as const

const BEHAVIOR_COLUMNS = [
    {key: 'select', header: '셀렉트 값', align: 'start', rowHeader: true},
    {key: 'value', header: '도메인 칸 값', align: 'start'},
    {key: 'state', header: '도메인 칸 상태', align: 'start'},
    {key: 'focus', header: '포커스', align: 'start'},
] as const

const BEHAVIOR_ROWS = [
    {key: 'direct', cells: ['직접입력 (기본)', '비움', '편집 가능', '도메인 칸으로 이동']},
    {key: 'preset', cells: ['목록의 도메인', '고른 값 자동 입력', '읽기전용 (잠긴 색)', '이동 없음']},
] as const

const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const SUB_LIST = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

// 이메일 입력 — Input·Select 를 조합한 프로젝트 폼 패턴. 상태를 들고 있어야 해서 client 컴포넌트다.
const EmailFieldGuidePage = () => (
    <GuidePageShell
        title="이메일 입력 (EmailField)"
        description="아이디 · 도메인 · 도메인 선택 세 칸으로 받고, 서버에는 합친 주소 하나를 보내는 이메일 입력입니다."
    >
        <BaseCard>
            <section aria-labelledby="email-field-demo" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="email-field-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>name</code> 만 주면 됩니다. 셀렉트에서 도메인을 고르면 도메인 칸이 채워지고,{' '}
                        <code>직접입력</code> 을 고르면 직접 적을 수 있습니다.
                    </p>
                </div>
                <EmailField name="guideEmail" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="email-field-variants" className="typo-h4-bold">
                        동작과 예시
                    </h2>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">도메인 칸 동작</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            셀렉트는 값 선택기가 아니라 도메인 칸의 모드 스위치입니다.
                        </p>
                        <Table
                            caption="셀렉트 값에 따른 도메인 칸의 상태"
                            columns={BEHAVIOR_COLUMNS}
                            rows={BEHAVIOR_ROWS}
                            size="md"
                        />
                        <ul className={LIST_CLASS}>
                            <li>
                                잠긴 칸은 <code>disabled</code> 가 아니라 <code>readOnly</code> 라 값이 제출되고
                                포커스도 받습니다.
                            </li>
                            <li>직접입력으로 돌아오면 고른 값은 지워집니다.</li>
                        </ul>
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">도메인 목록 · 초기값</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            기본 목록은 naver · gmail · daum · hanmail · nate 입니다. 다른 목록은 <code>domains</code>{' '}
                            로 바꿉니다.
                        </p>
                        <EmailField
                            name="guideCompanyEmail"
                            domains={['kibo.or.kr', 'korea.kr']}
                            defaultDomain="kibo.or.kr"
                        />
                        <CodeBlock code={DOMAINS_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">폼 제출과 서버 전송</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            합친 주소 하나가 <code>name</code> 으로 제출됩니다. 화면의 두 칸에는 name 이 없습니다.
                        </p>
                        <EmailFieldFormDemo />
                        <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
                        <CodeBlock code={SUBMIT_CODE} language="tsx" copyLabel="복사" />
                        <ul className={LIST_CLASS}>
                            <li>양끝 공백을 없애고 도메인만 소문자로 맞춥니다.</li>
                            <li>
                                아이디 · 도메인 중 하나라도 비면 빈 문자열이 제출됩니다(<code>abc@</code> 같은 반쪽
                                주소는 가지 않습니다).
                            </li>
                            <li>
                                <code>{'{name}Preset'}</code> 은 셀렉트 값입니다. 주소 조각이 아니라 받는 쪽은 무시해도
                                됩니다.
                            </li>
                            <li>
                                백엔드가 아이디 · 도메인을 따로 받는다면 hidden input 대신 보이는 두 칸에{' '}
                                <code>name</code> 을 나눠 답니다.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="email-field-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래는 컴포넌트가 처리하므로 사용처에서 따로 넣지 않습니다.
                    </p>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        세 칸 모두 <code>aria-label</code> 로 이름이 있습니다(이메일 아이디 · 이메일 도메인 · 이메일
                        도메인 선택)[7.4.1].
                    </li>
                    <li>
                        <code>required</code> 는 보이는 두 칸에 걸립니다. 제출 시 오류 문구가 <code>FieldError</code> 로
                        나타나고 해당 칸에 <code>aria-invalid</code> · <code>aria-describedby</code> 가 붙습니다[7.4.2].
                    </li>
                    <li>
                        직접입력에서는 도메인 형식도 검사합니다. 직접입력을 고르면 포커스가 도메인 칸으로
                        이동합니다[6.1.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="email-field-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="EmailField Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default EmailFieldGuidePage
