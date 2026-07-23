import type {Metadata} from 'next'
import {Suspense} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import UserTypeSwitchDemo from './user-type-switch-demo'
import SegmentedControlFormDemo from './segmented-control-form-demo'

export const metadata: Metadata = {title: '세그먼티드 컨트롤 (Segmented Control)'}

const USAGE_RADIO_TYPE = `<SegmentedControl type="radio" defaultValue="corp" aria-label="회원 유형">
  <SegmentedControlItem value="corp">기업</SegmentedControlItem>
  <SegmentedControlItem value="org">기관</SegmentedControlItem>
</SegmentedControl>`

const USAGE_VARIANTS = `{/* Subtle: 기본 회색 트랙 */}
<SegmentedControl type="radio" variant="subtle" size="sm" defaultValue="corp" aria-label="회원 유형">
  <SegmentedControlItem value="corp">기업</SegmentedControlItem>
  <SegmentedControlItem value="org">기관</SegmentedControlItem>
</SegmentedControl>

{/* 흰 표면 위 인디고 선택 항목 — 항목은 텍스트 너비만큼만 차지 */}
<SegmentedControl
  type="radio"
  variant="solid"
  size="md"
  defaultValue="3months"
  aria-label="조회 기간"
>
  <SegmentedControlItem value="today">오늘</SegmentedControlItem>
  <SegmentedControlItem value="1month">1개월</SegmentedControlItem>
  <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
  <SegmentedControlItem value="all">전체</SegmentedControlItem>
</SegmentedControl>`

const USAGE_LINK_TYPE = `<SegmentedControl type="link" aria-label="화면 유형">
  <SegmentedControlItem
    href="/service?userType=corp"
    aria-current={userType === 'corp' ? 'page' : undefined}
  >
    기업
  </SegmentedControlItem>
  <SegmentedControlItem
    href="/service?userType=org"
    aria-current={userType === 'org' ? 'page' : undefined}
  >
    기관
  </SegmentedControlItem>
</SegmentedControl>`

const USAGE_SOLID_LINK = `{/* Solid도 Link 타입에 동일하게 적용할 수 있습니다. */}
<SegmentedControl
  type="link"
  variant="solid"
  size="md"
  aria-label="화면 유형"
>
  <SegmentedControlItem
    href="/service?userType=corp"
    aria-current={userType === 'corp' ? 'page' : undefined}
  >
    기업
  </SegmentedControlItem>
  <SegmentedControlItem
    href="/service?userType=org"
    aria-current={userType === 'org' ? 'page' : undefined}
  >
    기관
  </SegmentedControlItem>
</SegmentedControl>

{userType === 'corp' ? <CorporateView /> : <OrganizationView />}`

const USAGE_SIZES = `{/* size 는 sm·md·lg 세 단계이며 variant 와 무관하게 선택합니다. */}
<SegmentedControl type="radio" size="sm" defaultValue="corp" aria-label="회원 유형">…</SegmentedControl>
<SegmentedControl type="radio" size="md" defaultValue="corp" aria-label="회원 유형">…</SegmentedControl>
<SegmentedControl type="radio" size="lg" defaultValue="corp" aria-label="회원 유형">…</SegmentedControl>`

// Size 섹션 데모 목록 — [값, 표기, 설명]
const SIZE_SPECS = [
    {size: 'sm', label: 'Sm', desc: '좁은 영역이나 유틸바처럼 밀도가 높은 곳에 쓰는 컴팩트 크기입니다.'},
    {
        size: 'md',
        label: 'Md',
        desc: '카드·폼 안에서 기본으로 쓰는 중간 크기입니다. solid는 이 크기가 시안(토글) 기준입니다.',
    },
    {size: 'lg', label: 'Lg', desc: '넓은 영역에서 옵션의 시각적 위계를 높일 때 쓰는 큰 크기입니다.'},
] as const

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

const USAGE_FORM = `// 세그먼티드는 토글 성격이라 기본값을 두고, 선택값을 name 으로 제출한다.
<form onSubmit={handleSubmit}>
  <Field className="items-start">
    <FieldLabel id="user-type-label" htmlFor="user-type-corp">회원 유형</FieldLabel>
    <div className="w-fit">
      <SegmentedControl
        type="radio"
        name="userType"
        value={userType}
        onValueChange={setUserType}
        aria-labelledby="user-type-label"
      >
        <SegmentedControlItem id="user-type-corp" value="corp">기업</SegmentedControlItem>
        <SegmentedControlItem value="org">기관</SegmentedControlItem>
      </SegmentedControl>
    </div>
  </Field>

  <Field className="items-start">
    <FieldLabel id="period-label" htmlFor="period-today">조회 기간</FieldLabel>
    {/* solid 은 항목 폭만큼만 차지하므로 w-fit 로 감싼다 */}
    <div className="w-fit">
      <SegmentedControl
        type="radio"
        variant="solid"
        size="md"
        name="period"
        value={period}
        onValueChange={setPeriod}
        aria-labelledby="period-label"
      >
        <SegmentedControlItem id="period-today" value="today">오늘</SegmentedControlItem>
        <SegmentedControlItem value="1month">1개월</SegmentedControlItem>
        <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
        <SegmentedControlItem value="all">전체</SegmentedControlItem>
      </SegmentedControl>
    </div>
  </Field>

  <Button type="submit" variant="default" size="md">선택 내용 확인</Button>
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
        name: 'variant',
        desc: '선택 컨트롤의 표면과 활성 항목 강조 방식',
        values: "'subtle' | 'solid'",
        def: "'subtle'",
    },
    {
        component: 'SegmentedControl',
        name: 'size',
        desc: '항목의 높이·패딩·타이포그래피 크기',
        values: "'sm' | 'md' | 'lg'",
        def: "'sm'",
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
        description="동작과 시맨틱은 type(link·radio), 표현 방식은 variant(subtle·solid), 크기는 size(sm·md·lg)로 각각 독립적으로 선택합니다. 세 축은 서로 자유롭게 조합됩니다."
    >
        <BaseCard>
            <section aria-labelledby="tg-type" className="flex flex-col gap-8">
                <div>
                    <h2 id="tg-type" className="typo-h4-bold">
                        Type
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">type</code>은 컨트롤의 동작과 HTML 시맨틱을 결정합니다. 화면 이동은{' '}
                        <code className="font-mono">link</code>, 현재 화면 안의 단일 선택은{' '}
                        <code className="font-mono">radio</code>를 사용합니다.
                    </p>
                </div>
                <section aria-labelledby="tg-type-link" className="flex flex-col gap-4">
                    <div>
                        <h3 id="tg-type-link" className="typo-title-l-bold">
                            Link
                        </h3>
                        <p className="typo-body-l-regular text-muted-foreground mt-2">
                            <code className="font-mono">type=&quot;link&quot;</code>는 nav와 Next.js Link를
                            렌더링합니다. 현재 링크에는 <code className="font-mono">aria-current=&quot;page&quot;</code>
                            를 전달합니다.
                        </p>
                    </div>
                    <Suspense fallback={null}>
                        <UserTypeSwitchDemo ariaLabel="사용자 유형 — Link 예시" />
                    </Suspense>
                    <CodeBlock code={USAGE_LINK_TYPE} language="tsx" copyLabel="복사" />
                </section>

                <section aria-labelledby="tg-type-radio" className="flex flex-col gap-4">
                    <div>
                        <h3 id="tg-type-radio" className="typo-title-l-bold">
                            Radio
                        </h3>
                        <p className="typo-body-l-regular text-muted-foreground mt-2">
                            <code className="font-mono">type=&quot;radio&quot;</code>는 Radix RadioGroup을 사용하며 현재
                            화면 안에서 하나의 값을 선택합니다.
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
                    <CodeBlock code={USAGE_RADIO_TYPE} language="tsx" copyLabel="복사" />
                </section>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-variant" className="flex flex-col gap-8">
                <div>
                    <h2 id="tg-variant" className="typo-h4-bold">
                        Variant
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">variant</code>는 외형만 결정합니다.{' '}
                        <code className="font-mono">subtle</code>과 <code className="font-mono">solid</code>는 Link와
                        Radio 타입 모두에 동일하게 적용할 수 있습니다.
                    </p>
                </div>

                <section aria-labelledby="tg-variant-subtle" className="flex flex-col gap-4">
                    <div>
                        <h3 id="tg-variant-subtle" className="typo-title-l-bold">
                            Subtle
                        </h3>
                        <p className="typo-body-l-regular text-muted-foreground mt-2">
                            회색 트랙(<code className="font-mono">segmented-track</code>) 위에 흰색 선택 항목을 얹는
                            기본 스타일입니다. 유틸바처럼 밀도 높은 곳에서는 <code className="font-mono">sm</code>을
                            주로 씁니다.
                        </p>
                    </div>
                    <div className="border-border flex flex-wrap items-center gap-6 rounded-md border p-6">
                        <SegmentedControl
                            type="radio"
                            variant="subtle"
                            size="sm"
                            defaultValue="corp"
                            aria-label="Subtle Radio 예시"
                        >
                            <SegmentedControlItem value="corp">기업</SegmentedControlItem>
                            <SegmentedControlItem value="org">기관</SegmentedControlItem>
                        </SegmentedControl>
                    </div>
                </section>

                <section aria-labelledby="tg-variant-solid" className="flex flex-col gap-4">
                    <div>
                        <h3 id="tg-variant-solid" className="typo-title-l-bold">
                            Solid
                        </h3>
                        <p className="typo-body-l-regular text-muted-foreground mt-2">
                            흰 표면 위에서 선택 항목을 진한 인디고(
                            <code className="font-mono">segmented-solid-active</code>)로 강조하고, 비선택 항목 사이에는
                            얇은 회색 구분선(<code className="font-mono">subtle-2</code>)을 둡니다. 선택된 인디고 면에
                            닿는 구분선은 숨겨, 항목이 2개일 때는 인디고 면 자체가 두 옵션을 나눕니다. 필터·기간 전환
                            토글에 쓰며 시안(Figma 토글) 기준 크기는 <code className="font-mono">md</code>입니다.
                        </p>
                    </div>
                    <div aria-labelledby="tg-variant-solid-radio" className="flex flex-col gap-3">
                        <h4 id="tg-variant-solid-radio" className="typo-body-l-bold text-foreground">
                            Radio 타입
                        </h4>
                        <div className="bg-muted rounded-md p-6">
                            <SegmentedControl
                                type="radio"
                                variant="solid"
                                size="md"
                                defaultValue="3months"
                                aria-label="Solid Radio 예시"
                            >
                                <SegmentedControlItem value="today">오늘</SegmentedControlItem>
                                <SegmentedControlItem value="1month">1개월</SegmentedControlItem>
                                <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
                                <SegmentedControlItem value="all">전체</SegmentedControlItem>
                            </SegmentedControl>
                        </div>
                    </div>
                    <div aria-labelledby="tg-variant-solid-link" className="flex flex-col gap-3">
                        <h4 id="tg-variant-solid-link" className="typo-body-l-bold text-foreground">
                            Link 타입
                        </h4>
                        <Suspense fallback={null}>
                            <UserTypeSwitchDemo
                                variant="solid"
                                size="md"
                                ariaLabel="화면 유형 — Solid Link 예시"
                                wrapperClassName="bg-muted border-0"
                                showContent={false}
                            />
                        </Suspense>
                    </div>
                    <CodeBlock code={USAGE_VARIANTS} language="tsx" copyLabel="복사" />
                    <CodeBlock code={USAGE_SOLID_LINK} language="tsx" copyLabel="복사" />
                </section>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-size" className="flex flex-col gap-8">
                <div>
                    <h2 id="tg-size" className="typo-h4-bold">
                        Size
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">size</code>는 컨트롤의 높이·패딩·타이포그래피 크기만 결정합니다.
                        Type과 Variant에 관계없이 <code className="font-mono">sm</code>·
                        <code className="font-mono">md</code>·<code className="font-mono">lg</code>를 선택할 수
                        있습니다. 아래는 각 크기를 subtle·solid 두 variant로 나란히 보여줍니다.
                    </p>
                </div>

                {SIZE_SPECS.map((spec) => (
                    <section key={spec.size} aria-labelledby={`tg-size-${spec.size}`} className="flex flex-col gap-4">
                        <div>
                            <h3 id={`tg-size-${spec.size}`} className="typo-title-l-bold">
                                {spec.label}
                            </h3>
                            <p className="typo-body-l-regular text-muted-foreground mt-2">{spec.desc}</p>
                        </div>
                        <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                            <SegmentedControl
                                type="radio"
                                variant="subtle"
                                size={spec.size}
                                defaultValue="corp"
                                aria-label={`Subtle ${spec.label} 크기 예시`}
                            >
                                <SegmentedControlItem value="corp">기업</SegmentedControlItem>
                                <SegmentedControlItem value="org">기관</SegmentedControlItem>
                            </SegmentedControl>
                            <SegmentedControl
                                type="radio"
                                variant="solid"
                                size={spec.size}
                                defaultValue="3months"
                                aria-label={`Solid ${spec.label} 크기 예시`}
                            >
                                <SegmentedControlItem value="today">오늘</SegmentedControlItem>
                                <SegmentedControlItem value="1month">1개월</SegmentedControlItem>
                                <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
                            </SegmentedControl>
                        </div>
                    </section>
                ))}
                <CodeBlock code={USAGE_SIZES} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-disabled" className="flex flex-col gap-4">
                <div>
                    <h2 id="tg-disabled" className="typo-h4-bold">
                        Disabled 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        radio 타입은 그룹 전체 또는 개별 항목을 비활성화할 수 있습니다. 선택된 비활성 항목은 강조색 대신
                        흐린 표면(<code className="font-mono">bg-control-disabled-subtle</code>)에 놓이고, 모든 비활성
                        텍스트는 <code className="font-mono">text-disabled</code>를 사용합니다. subtle·solid 두 variant
                        모두 같은 규칙을 따릅니다.
                    </p>
                </div>
                <div aria-labelledby="tg-disabled-subtle" className="flex flex-col gap-3">
                    <h3 id="tg-disabled-subtle" className="typo-body-l-bold text-foreground">
                        Subtle
                    </h3>
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
                </div>
                <div aria-labelledby="tg-disabled-solid" className="flex flex-col gap-3">
                    <h3 id="tg-disabled-solid" className="typo-body-l-bold text-foreground">
                        Solid
                    </h3>
                    <div className="bg-muted flex flex-wrap items-center gap-6 rounded-md p-6">
                        <SegmentedControl
                            type="radio"
                            variant="solid"
                            size="md"
                            defaultValue="3months"
                            disabled
                            aria-label="비활성 조회 기간"
                        >
                            <SegmentedControlItem value="today">오늘</SegmentedControlItem>
                            <SegmentedControlItem value="1month">1개월</SegmentedControlItem>
                            <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
                            <SegmentedControlItem value="all">전체</SegmentedControlItem>
                        </SegmentedControl>
                        <SegmentedControl
                            type="radio"
                            variant="solid"
                            size="md"
                            defaultValue="3months"
                            aria-label="일부 비활성 조회 기간"
                        >
                            <SegmentedControlItem value="today">오늘</SegmentedControlItem>
                            <SegmentedControlItem value="1month" disabled>
                                1개월
                            </SegmentedControlItem>
                            <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
                            <SegmentedControlItem value="all">전체</SegmentedControlItem>
                        </SegmentedControl>
                    </div>
                </div>
                <CodeBlock code={USAGE_DISABLED} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="tg-form" className="typo-h4-bold">
                        Form 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        세그먼티드 컨트롤은 토글 성격이라 보통 한 항목이 기본 선택된 상태로 제공됩니다. 그래서
                        필수·미선택 오류 흐름 대신, 기본값을 가진 컨트롤의 선택값이{' '}
                        <code className="font-mono">name</code>에 맞춰 FormData로 제출되는 흐름을 보여줍니다. 아래
                        결과에서 <code className="font-mono">subtle + sm</code> 필드와{' '}
                        <code className="font-mono">solid + md</code> 필드 값이 함께 포함되는지 확인할 수 있습니다.
                        solid 컨트롤은 항목 폭만큼만 차지하도록 <code className="font-mono">w-fit</code>로 감쌉니다.
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
                            제외됩니다. 실제 조작 요소인{' '}
                            <code className="font-mono">button[role=&quot;radio&quot;]</code>는 보이는 항목 텍스트를{' '}
                            <code className="font-mono">aria-labelledby</code>로 참조해 접근 가능한 이름을 제공하므로
                            실제 사용자 접근성에 영향을 주지 않는 자동 검사 오탐으로 판단하여 예외 처리합니다.
                        </p>
                    </div>
                </div>
                <SegmentedControlFormDemo />
                <CodeBlock code={USAGE_FORM} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
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
        </BaseCard>

        <BaseCard>
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
                            {PROPS.map((p, index) => (
                                <tr
                                    key={`${p.component}-${p.name}`}
                                    className="border-border bg-background border-b last:border-b-0"
                                >
                                    {PROPS.findIndex((item) => item.component === p.component) === index ? (
                                        <th
                                            scope="rowgroup"
                                            rowSpan={PROPS.filter((item) => item.component === p.component).length}
                                            className="typo-caption-regular border-border text-muted-foreground border-r px-4 py-3 align-top font-mono font-normal"
                                        >
                                            {p.component}
                                        </th>
                                    ) : null}
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
        </BaseCard>
    </GuidePageShell>
)

export default SegmentedControlGuidePage
