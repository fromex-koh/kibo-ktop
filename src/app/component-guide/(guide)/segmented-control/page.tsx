import type {Metadata} from 'next'
import {Suspense} from 'react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import AudienceSwitchDemo from './audience-switch-demo'
import SegmentedControlFormDemo from './segmented-control-form-demo'

export const metadata: Metadata = {title: '세그먼티드 컨트롤 (Segmented Control)'}

const USAGE_SEGMENTED = `<SegmentedControl type="radio" defaultValue="corp" aria-label="회원 유형">
  <SegmentedControlItem value="corp">기업</SegmentedControlItem>
  <SegmentedControlItem value="org">기관</SegmentedControlItem>
</SegmentedControl>`

const USAGE_AUDIENCE_SWITCH = `<SegmentedControl type="link" aria-label="화면 유형">
  <SegmentedControlItem
    href="/service?audience=corp"
    aria-current={audience === 'corp' ? 'page' : undefined}
  >
    기업
  </SegmentedControlItem>
  <SegmentedControlItem
    href="/service?audience=org"
    aria-current={audience === 'org' ? 'page' : undefined}
  >
    기관
  </SegmentedControlItem>
</SegmentedControl>

{audience === 'corp' ? <CorporateView /> : <OrganizationView />}`

const USAGE_DISABLED = `{/* 그룹 전체 비활성화 */}
<SegmentedControl type="radio" defaultValue="corp" disabled aria-label="비활성 회원 유형">
  <SegmentedControlItem value="corp">기업</SegmentedControlItem>
  <SegmentedControlItem value="org">기관</SegmentedControlItem>
</SegmentedControl>

{/* 개별 항목 비활성화 */}
<SegmentedControl type="radio" defaultValue="corp" aria-label="일부 비활성 회원 유형">
  <SegmentedControlItem value="corp">기업</SegmentedControlItem>
  <SegmentedControlItem value="org" disabled>기관</SegmentedControlItem>
</SegmentedControl>`

const USAGE_FORM = `<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={memberTypeError || undefined} className="max-w-90">
    <FieldLabel
      id="member-type-label"
      htmlFor="member-type-corp"
      className="gap-1 font-bold text-foreground"
    >
      회원 유형
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only">필수</span>
    </FieldLabel>
    <div className="w-fit">
      <SegmentedControl
        type="radio"
        name="memberType"
        value={memberType}
        onValueChange={setMemberType}
        required
        aria-labelledby="member-type-label"
        aria-invalid={memberTypeError || undefined}
        aria-describedby={memberTypeError ? 'member-type-error' : undefined}
      >
        <SegmentedControlItem id="member-type-corp" value="corp">기업</SegmentedControlItem>
        <SegmentedControlItem value="org">기관</SegmentedControlItem>
      </SegmentedControl>
    </div>
    {memberTypeError ? (
      <FieldError id="member-type-error">회원 유형을 선택해 주세요.</FieldError>
    ) : null}
  </Field>

  <Field className="max-w-90">
    <FieldLabel
      id="notification-channel-label"
      htmlFor="notification-channel-email"
      className="font-bold text-foreground"
    >
      알림 수신 방식 (선택)
    </FieldLabel>
    <div className="w-fit">
      <SegmentedControl
        type="radio"
        name="notificationChannel"
        aria-labelledby="notification-channel-label"
      >
        <SegmentedControlItem id="notification-channel-email" value="email">이메일</SegmentedControlItem>
        <SegmentedControlItem value="sms">문자</SegmentedControlItem>
      </SegmentedControl>
    </div>
  </Field>

  <Button type="submit" variant="default" size="md">
    선택 내용 확인
  </Button>
</form>`

const COMPOSITION = [
    {
        name: 'SegmentedControl',
        desc: 'type="radio"는 Radix RadioGroup, type="link"는 nav로 렌더링하는 컨테이너.',
    },
    {
        name: 'SegmentedControlItem',
        desc: 'value를 받으면 button[role="radio"], href를 받으면 Next.js Link(a)로 렌더링되는 항목.',
    },
] as const

const PROPS = [
    {
        component: 'SegmentedControl',
        name: 'type',
        desc: '의미와 렌더링 방식을 결정하는 필수 구분자',
        values: "'radio' | 'link'",
        def: '—',
    },
    {
        component: 'SegmentedControl',
        name: 'value',
        desc: 'radio 타입의 controlled 현재 선택값',
        values: 'string',
        def: '—',
    },
    {
        component: 'SegmentedControl',
        name: 'defaultValue',
        desc: 'radio 타입의 uncontrolled 초기 선택값',
        values: 'string',
        def: '—',
    },
    {
        component: 'SegmentedControl',
        name: 'onValueChange',
        desc: 'radio 타입의 선택값 변경 함수',
        values: '(value: string) => void',
        def: '—',
    },
    {
        component: 'SegmentedControl',
        name: 'orientation',
        desc: 'radio 타입의 항목 배치 및 키보드 방향',
        values: "'horizontal' | 'vertical'",
        def: "'horizontal'",
    },
    {
        component: 'SegmentedControl',
        name: 'disabled',
        desc: 'radio 타입의 그룹 전체를 비활성화',
        values: 'boolean',
        def: 'false',
    },
    {component: 'SegmentedControl', name: 'name', desc: 'radio 타입의 FormData 필드명', values: 'string', def: '—'},
    {
        component: 'SegmentedControl',
        name: 'aria-label / aria-labelledby',
        desc: 'radio 그룹 또는 link 내비게이션의 접근 가능한 이름',
        values: 'string',
        def: '—',
    },
    {
        component: 'SegmentedControlItem',
        name: 'value',
        desc: 'radio item을 식별하는 필수 선택값',
        values: 'string',
        def: '—',
    },
    {
        component: 'SegmentedControlItem',
        name: 'disabled',
        desc: '개별 radio item을 비활성화',
        values: 'boolean',
        def: 'false',
    },
    {
        component: 'SegmentedControlItem',
        name: 'href',
        desc: 'link item의 이동 주소이자 link 타입 판별값',
        values: 'LinkProps["href"]',
        def: '—',
    },
    {
        component: 'SegmentedControlItem',
        name: 'aria-current',
        desc: '현재 link item임을 접근성 API와 선택 스타일에 전달',
        values: "'page' | undefined",
        def: 'undefined',
    },
] as const

const SegmentedControlGuidePage = () => (
    <GuidePageShell
        title="세그먼티드 컨트롤 (Segmented Control)"
        description="단일 선택을 위한 radio 타입과 화면 이동을 위한 link 타입을 제공하는 세그먼티드 컨트롤입니다."
    >
        <section aria-labelledby="tg-audience-switch" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-audience-switch" className="typo-h4-bold">
                    Link 타입 — 사이트 화면 전환
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">type=&quot;link&quot;</code>는 nav와 Next.js Link를 렌더링합니다.
                    기업용·기관용처럼 페이지 주소와 콘텐츠 범위를 함께 바꾸고, 현재 링크는{' '}
                    <code className="font-mono">aria-current=&quot;page&quot;</code>로 선택 스타일과 접근성 상태를
                    전달합니다.
                </p>
            </div>
            <Suspense fallback={null}>
                <AudienceSwitchDemo />
            </Suspense>
            <CodeBlock code={USAGE_AUDIENCE_SWITCH} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="tg-preview" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-preview" className="typo-h4-bold">
                    Radio 타입
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">type=&quot;radio&quot;</code>는 Radix RadioGroup을 사용한 로컬 단일
                    선택입니다. 높이는 24px로 고정되며 회색 트랙 위에서 선택 항목을 흰 배경으로 표시합니다. 토글처럼
                    다중 선택하거나 선택을 해제하지 않습니다.
                </p>
            </div>
            <div className="border-border flex flex-wrap items-center gap-6 rounded-md border p-6">
                <SegmentedControl type="radio" defaultValue="corp" aria-label="회원 유형 (2개)">
                    <SegmentedControlItem value="corp">기업</SegmentedControlItem>
                    <SegmentedControlItem value="org">기관</SegmentedControlItem>
                </SegmentedControl>
                <SegmentedControl type="radio" defaultValue="corp" aria-label="회원 유형 (3개)">
                    <SegmentedControlItem value="corp">기업</SegmentedControlItem>
                    <SegmentedControlItem value="org">기관</SegmentedControlItem>
                    <SegmentedControlItem value="person">개인</SegmentedControlItem>
                </SegmentedControl>
            </div>
            <CodeBlock code={USAGE_SEGMENTED} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="tg-disabled" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-disabled" className="typo-h4-bold">
                    Disabled 상태
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    radio 타입은 그룹 전체 또는 개별 항목을 비활성화할 수 있습니다. 선택된 비활성 항목은{' '}
                    <code className="font-mono">bg-control-disabled-subtle</code>, 모든 비활성 텍스트는{' '}
                    <code className="font-mono">text-disabled</code>를 사용합니다.
                </p>
            </div>
            <div className="border-border flex flex-wrap items-center gap-6 rounded-md border p-6">
                <SegmentedControl type="radio" defaultValue="corp" disabled aria-label="비활성 회원 유형">
                    <SegmentedControlItem value="corp">기업</SegmentedControlItem>
                    <SegmentedControlItem value="org">기관</SegmentedControlItem>
                </SegmentedControl>
                <SegmentedControl type="radio" defaultValue="corp" aria-label="일부 비활성 회원 유형">
                    <SegmentedControlItem value="corp">기업</SegmentedControlItem>
                    <SegmentedControlItem value="org" disabled>
                        기관
                    </SegmentedControlItem>
                </SegmentedControl>
            </div>
            <CodeBlock code={USAGE_DISABLED} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="tg-form" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-form" className="typo-h4-bold">
                    Form 제출
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    필수 그룹은 FieldLabel·FieldError와 조합해 미선택 제출 시 오류를 노출하고 첫 항목으로 포커스를
                    이동합니다. 선택 그룹은 required 없이 제출할 수 있으며, 선택한 값만 FormData에 포함됩니다. 두 그룹
                    모두 2개의 선택지를 함께 보여줍니다.
                </p>
                <div className="bg-surface border-border mt-3 flex flex-col gap-1 rounded-md border p-4">
                    <h3 className="typo-body-l-medium text-foreground">WAVE 검사 예외 — Missing form label</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <a
                            href="https://www.radix-ui.com/primitives/docs/components/radio-group"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-4"
                        >
                            Radix Radio Group
                        </a>
                        이 폼 데이터와 이벤트를 전달하기 위해 자동 생성하는 보조{' '}
                        <code className="font-mono">input</code>에는 Label이 연결되지 않아 WAVE가{' '}
                        <em>Missing form label</em>로 탐지할 수 있습니다. 해당 input은{' '}
                        <code className="font-mono">aria-hidden=&quot;true&quot;</code>와{' '}
                        <code className="font-mono">tabindex=&quot;-1&quot;</code>로 접근성 트리와 키보드 탐색에서
                        제외됩니다. 실제 조작 요소인 <code className="font-mono">button[role=&quot;radio&quot;]</code>는
                        보이는 항목 텍스트를 <code className="font-mono">aria-labelledby</code>로 참조해 접근 가능한
                        이름을 제공하므로 실제 사용자 접근성에 영향을 주지 않는 자동 검사 오탐으로 판단하여 예외
                        처리합니다.
                    </p>
                </div>
            </div>
            <SegmentedControlFormDemo />
            <CodeBlock code={USAGE_FORM} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="tg-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-composition" className="typo-h4-bold">
                    Composition
                </h2>
                <p className="text-foreground-muted text-sm">이 컴포넌트를 이루는 요소들입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Composition 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPOSITION.map((row) => (
                            <tr key={row.name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    {row.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{row.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="tg-props" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="text-foreground-muted text-sm">SegmentedControl과 Item의 주요 속성입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Component
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Type
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {PROPS.map((p) => (
                            <tr
                                key={`${p.component}-${p.name}`}
                                className="border-border bg-background border-b last:border-b-0"
                            >
                                <td className="typo-caption-regular border-border text-muted-foreground border-r px-4 py-3 align-top font-mono">
                                    {p.component}
                                </td>
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    {p.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{p.desc}</td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {p.values}
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {p.def}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default SegmentedControlGuidePage
