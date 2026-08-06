import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {EmailField} from '@/components/composite/email-field'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '이메일 입력 (EmailField)'}

const USAGE_CODE = `<FormCard title="부분발송 이메일등록" subtitle="안내문을 추가로 받으실 이메일 주소를 입력해 주세요.">
  <EmailField name="additionalNoticeEmail" />
</FormCard>`

const SUBMIT_CODE = `{/* 실제로 폼에 실리는 값은 hidden input 하나다 */}
<input type="hidden" name="additionalNoticeEmail" value="abc@naver.com" />

const handleSubmit = (formData: FormData) => {
  formData.get('additionalNoticeEmail') // 'abc@naver.com'
}`

const DOMAINS_CODE = `{/* 화면에 맞춰 목록을 갈아 끼운다. '직접입력'은 항상 맨 앞에 자동으로 들어간다 */}
<EmailField name="companyEmail" domains={['kibo.or.kr', 'korea.kr']} />

{/* 기존 값을 채워 두면, 그 도메인이 목록에 있으면 셀렉트도 함께 맞춰진다 */}
<EmailField name="companyEmail" defaultLocalPart="kibo" defaultDomain="kibo.or.kr" />`

const PROPS_ITEMS = [
    ['EmailField', 'name', '서버로 보낼 필드명입니다. 이 이름으로 합친 주소 하나가 전송됩니다.', "'email'", 'string'],
    [
        'EmailField',
        'domains',
        "셀렉트에 나열할 도메인 목록입니다. '직접입력'은 항상 맨 앞에 자동으로 들어갑니다.",
        'naver·gmail·daum·hanmail·nate',
        'readonly string[]',
    ],
    ['EmailField', 'defaultLocalPart', '아이디 칸의 초기값입니다.', "''", 'string'],
    [
        'EmailField',
        'defaultDomain',
        '도메인 칸의 초기값입니다. 목록에 있는 도메인이면 셀렉트도 그 항목으로 시작합니다.',
        "''",
        'string',
    ],
    [
        'EmailField',
        'required',
        '필수 여부입니다. 보이는 두 칸에 걸립니다 — hidden input 은 브라우저 유효성 검사 대상이 아닙니다.',
        'false',
        'boolean',
    ],
    ['EmailField', 'className', '바깥 상자에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

// 이메일 입력 — Input·Select 를 조합한 프로젝트 폼 패턴. 상태를 들고 있어야 해서 client 컴포넌트다.
const EmailFieldGuidePage = () => (
    <GuidePageShell
        title="이메일 입력 (EmailField)"
        description="아이디·도메인·도메인 셀렉트로 나눠 받고 서버에는 합친 주소 하나를 보내는 이메일 입력입니다. 셋으로 쪼개는 건 자주 쓰는 도메인의 오타를 막기 위한 입력 편의이고, 데이터는 이메일 한 개입니다."
    >
        <BaseCard>
            <section aria-labelledby="email-field-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="email-field-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        셀렉트에서 도메인을 고르면 도메인 칸이 자동으로 채워지고 잠깁니다. 다시{' '}
                        <code className="font-mono">직접입력</code>을 고르면 칸이 비워지며 편집할 수 있게 되고 커서가 그
                        칸으로 들어갑니다.
                    </p>
                </div>
                <EmailField name="guideEmail" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-behavior" className="flex flex-col gap-4">
                <div>
                    <h2 id="email-field-behavior" className="typo-h4-bold">
                        동작 — 셀렉트는 도메인 칸의 모드 스위치
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        셀렉트는 값을 고르는 컨트롤이 아니라 도메인 칸의 상태를 지배합니다.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse text-left">
                        <caption className="sr-only">셀렉트 값에 따른 도메인 칸의 상태</caption>
                        <thead>
                            <tr className="border-subtle-3 border-b">
                                <th scope="col" className="typo-body-l-bold text-foreground py-3 pr-6">
                                    셀렉트 값
                                </th>
                                <th scope="col" className="typo-body-l-bold text-foreground py-3 pr-6">
                                    도메인 칸 값
                                </th>
                                <th scope="col" className="typo-body-l-bold text-foreground py-3 pr-6">
                                    도메인 칸 상태
                                </th>
                                <th scope="col" className="typo-body-l-bold text-foreground py-3">
                                    포커스
                                </th>
                            </tr>
                        </thead>
                        <tbody className="typo-body-l-regular text-muted-foreground">
                            <tr className="border-subtle-3 border-b">
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    직접입력 (기본)
                                </th>
                                <td className="py-3 pr-6">비움</td>
                                <td className="py-3 pr-6">편집 가능</td>
                                <td className="py-3">도메인 칸으로 이동</td>
                            </tr>
                            <tr>
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    목록의 도메인
                                </th>
                                <td className="py-3 pr-6">고른 값 자동 입력</td>
                                <td className="py-3 pr-6">readOnly · 잠긴 표면색</td>
                                <td className="py-3">이동 없음</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>값을 숨기지 않고 그대로 보여줍니다 — 사용자가 최종 주소를 눈으로 확인할 수 있어야 합니다.</li>
                    <li>
                        잠금은 <code className="font-mono">disabled</code>가 아니라{' '}
                        <code className="font-mono">readOnly</code>입니다. disabled 는 값이 폼 전송에서 빠지고 포커스도
                        못 받아 스크린리더가 건너뜁니다.
                    </li>
                    <li>직접입력으로 돌아오면 고른 값을 지웁니다. 남겨 두면 그 위에 덧쓰려다 헷갈립니다.</li>
                    <li>
                        포커스는 목록이 <strong className="text-foreground">닫히는 시점</strong>에 옮깁니다(radix 의{' '}
                        <code className="font-mono">onCloseAutoFocus</code>). 값이 바뀌자마자 옮기면 뒤이어 radix 가
                        포커스를 트리거로 되돌려 놓아, 도메인 칸에 들어갔다가 바로 빠져나옵니다. 값을 바꾸지 않고 Esc·
                        바깥 클릭으로 닫았을 때는 원래대로 트리거로 돌아갑니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-submit" className="flex flex-col gap-4">
                <div>
                    <h2 id="email-field-submit" className="typo-h4-bold">
                        서버 전송 — 합친 값 하나
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        보이는 세 컨트롤에는 <code className="font-mono">name</code>을 두지 않고, hidden input 하나에
                        합친 주소를 담습니다. UI 를 건드리지 않고 submit 만 붙이면 FormData 에 최종 주소가 들어
                        있습니다.
                    </p>
                </div>
                <CodeBlock code={SUBMIT_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>양끝 공백을 제거하고 도메인만 소문자로 맞춥니다(로컬파트는 대소문자를 구분합니다).</li>
                    <li>
                        아이디·도메인 중 하나라도 비면 값이 빈 문자열입니다 — <code className="font-mono">abc@</code>나{' '}
                        <code className="font-mono">@naver.com</code> 같은 반쪽 주소가 서버로 가지 않습니다.
                    </li>
                    <li>셀렉트에서 고른 값은 UI 상태라 전송하지 않습니다.</li>
                    <li>
                        유효성 검사는 조각이 아니라 이 합친 주소를 기준으로 합니다. 백엔드 스펙이 아이디·도메인을 따로
                        받는다면 hidden input 대신 보이는 두 칸에 <code className="font-mono">name</code>을 나눠 답니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-domains" className="flex flex-col gap-4">
                <div>
                    <h2 id="email-field-domains" className="typo-h4-bold">
                        도메인 목록·초기값
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본 목록은 naver·gmail·daum·hanmail·nate 입니다. 기관 메일만 받는 화면처럼 목록이 다르면{' '}
                        <code className="font-mono">domains</code>로 갈아 끼웁니다.
                    </p>
                </div>
                <EmailField name="guideCompanyEmail" domains={['kibo.or.kr', 'korea.kr']} defaultDomain="kibo.or.kr" />
                <CodeBlock code={DOMAINS_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="email-field-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        세 컨트롤 모두 이름을 갖습니다 — 이메일 아이디 · 이메일 도메인 · 이메일 도메인 선택([7.4.1]).
                        placeholder 는 이름을 대신하지 못하므로 <code className="font-mono">aria-label</code>을 함께
                        둡니다.
                    </li>
                    <li>
                        잠긴 도메인 칸은 네이티브 <code className="font-mono">readonly</code>라 포커스를 받고
                        스크린리더가 읽습니다. 별도 <code className="font-mono">aria-readonly</code>는 두지
                        않습니다(중복).
                    </li>
                    <li>
                        셀렉트를 바꾸면 옆 칸이 함께 바뀌지만 페이지 이동·제출 같은 큰 변화는 없습니다([7.2.1]). 포커스
                        이동도 직접입력을 고른 경우로 한정합니다.
                    </li>
                    <li>
                        <code className="font-mono">required</code>는 보이는 두 칸에 걸립니다 — hidden input 은 브라우저
                        유효성 검사 대상이 아닙니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="email-field-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="email-field-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">EmailField 에 전달하는 속성입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="EmailField Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default EmailFieldGuidePage
