// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {Suspense} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import UserTypeSwitchDemo from './user-type-switch-demo'
import SegmentedControlFormDemo from './segmented-control-form-demo'

export const metadata: Metadata = {title: '세그먼티드 컨트롤 (Segmented Control)'}

const USAGE_RADIO_TYPE = `import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'

<SegmentedControl type="radio" defaultValue="corp" aria-label="회원 유형">
  <SegmentedControlItem value="corp">기업</SegmentedControlItem>
  <SegmentedControlItem value="org">기관</SegmentedControlItem>
</SegmentedControl>`

const USAGE_VARIANTS = `{/* Subtle: 기본 회색 트랙 */}
<SegmentedControl type="radio" variant="subtle" size="sm" defaultValue="corp" aria-label="회원 유형">
  <SegmentedControlItem value="corp">기업</SegmentedControlItem>
  <SegmentedControlItem value="org">기관</SegmentedControlItem>
</SegmentedControl>

{/* Solid: 트랙 없이 폭이 같은 상자 */}
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

const USAGE_FORM = `<form onSubmit={handleSubmit}>
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
    {/* Field 가 자식 폭을 늘리지 않도록 w-fit 로 감싼다 */}
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

  <Button type="submit" variant="default" size="sm">선택 내용 확인</Button>
</form>`

const TYPE_COLUMNS = [
    {key: 'type', header: 'type', align: 'start', rowHeader: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
    {key: 'item', header: '항목에 넘기는 것', align: 'start', wrap: true},
] as const

const TYPE_ROWS = [
    {
        key: 'radio',
        cells: [
            <code key="type">radio</code>,
            '현재 화면 안에서 값 하나를 고를 때',
            <span key="item">
                <code>value</code>. 선택값은 그룹의 <code>value</code> · <code>defaultValue</code>로 정합니다.
            </span>,
        ],
    },
    {
        key: 'link',
        cells: [
            <code key="type">link</code>,
            '항목마다 다른 주소로 이동할 때',
            <span key="item">
                <code>href</code>. 현재 항목에는 <code>aria-current=&quot;page&quot;</code>를 줍니다.
            </span>,
        ],
    },
] as const

const VARIANT_COLUMNS = [
    {key: 'variant', header: 'variant', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'width', header: '항목 폭', align: 'start', wrap: true},
] as const

const VARIANT_ROWS = [
    {
        key: 'subtle',
        cells: [
            <code key="variant">subtle</code>,
            '회색 트랙 안에 항목이 붙어 놓이고, 고른 항목은 흰 면으로 올라옵니다. (기본값)',
            '글자 길이 + 좌우 여백',
        ],
    },
    {
        key: 'solid',
        cells: [
            <code key="variant">solid</code>,
            '트랙 없이 테두리 상자가 나란히 놓이고, 고른 항목은 진하게 채워지며 Bold 입니다.',
            '글자 길이와 무관하게 고정',
        ],
    },
] as const

// 치수 근거: theme/segmented-control.variants.ts 의 compoundVariants + tokens.json size.control-h-*.
const SIZE_COLUMNS = [
    {key: 'size', header: 'size', align: 'start', rowHeader: true},
    {key: 'subtle', header: 'subtle (높이 · 좌우 여백 · 글자)', align: 'start'},
    {key: 'solid', header: 'solid (높이 · 폭 · 글자)', align: 'start'},
] as const

const SIZE_ROWS = [
    {key: 'sm', cells: [<code key="size">sm</code>, '24px · 8px · 14px', '32px · 64px · 14px']},
    {key: 'md', cells: [<code key="size">md</code>, '40px · 12px · 14px', '40px · 72px · 14px']},
    {key: 'lg', cells: [<code key="size">lg</code>, '48px · 16px · 16px', '48px · 80px · 16px']},
] as const

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'segmented',
        cells: [
            '짧은 선택지 2~4개를 한 줄에 붙여 놓고 하나 선택, 또는 같은 화면 유형 전환',
            <code key="component">SegmentedControl</code>,
            '회원 유형, 조회 기간처럼 값이 항상 보이는 필터입니다. 항목 폭이 글자 길이(subtle) 또는 고정(solid)입니다.',
        ],
    },
    {
        key: 'chip',
        cells: [
            '떨어져 있는 칩으로 하나 또는 여러 개 선택',
            <Link key="component" href="/component-guide/chip" className={LINK_CLASS}>
                Chip
            </Link>,
            '단일 · 다중 선택이 모두 필요하거나 문장 안에 끼워 넣을 때 씁니다.',
        ],
    },
    {
        key: 'radio',
        cells: [
            '폼 항목으로 하나 선택',
            <Link key="component" href="/component-guide/radio" className={LINK_CLASS}>
                Radio
            </Link>,
            '선택지가 많거나 설명 문구가 길 때 씁니다.',
        ],
    },
    {
        key: 'card',
        cells: [
            '카드째 눌러 선택',
            <span key="component">
                <Link href="/component-guide/selectable-card" className={LINK_CLASS}>
                    SelectableCard
                </Link>
                {' · '}
                <Link href="/component-guide/radio-card" className={LINK_CLASS}>
                    RadioCard
                </Link>
            </span>,
            '라벨 이상의 내용을 담는 큰 선택지입니다.',
        ],
    },
    {
        key: 'tabs',
        cells: [
            '탭마다 다른 본문 패널',
            <Link key="component" href="/component-guide/tabs" className={LINK_CLASS}>
                Tabs
            </Link>,
            '패널을 전환하는 탭입니다. 값만 고르는 컨트롤이 아닙니다.',
        ],
    },
] as const

const SIZES = ['sm', 'md', 'lg'] as const

const PROPS_ITEMS = [
    ['SegmentedControl', 'type', '필수. 단일 선택은 radio, 화면 이동은 link 입니다.', '—', "'radio' | 'link'"],
    ['SegmentedControl', 'variant', '외형입니다.', "'subtle'", "'subtle' | 'solid'"],
    ['SegmentedControl', 'size', '항목의 높이 · 폭(여백) · 글자 크기입니다.', "'sm'", "'sm' | 'md' | 'lg'"],
    [
        'SegmentedControl',
        'aria-label / aria-labelledby',
        '그룹(radio) 또는 내비게이션(link)의 이름입니다.',
        '—',
        'string',
    ],
    ['SegmentedControl', 'className', '바깥 요소에 덧붙일 클래스입니다.', 'undefined', 'string'],
    ['SegmentedControl', 'value / defaultValue', 'radio 전용. 제어 · 비제어 선택값입니다.', '—', 'string'],
    ['SegmentedControl', 'onValueChange', 'radio 전용. 선택값이 바뀔 때 호출됩니다.', '—', '(value: string) => void'],
    ['SegmentedControl', 'name', 'radio 전용. 폼 제출 때 쓰이는 필드 이름입니다.', '—', 'string'],
    ['SegmentedControl', 'disabled', 'radio 전용. 그룹 전체를 비활성화합니다.', 'false', 'boolean'],
    ['SegmentedControl', 'required', 'radio 전용. 필수 선택으로 표시합니다.', 'false', 'boolean'],
    [
        'SegmentedControl',
        'orientation',
        'radio 전용. 항목 배치와 방향키 이동 방향입니다.',
        "'horizontal'",
        "'horizontal' | 'vertical'",
    ],
    ['SegmentedControlItem', 'value', 'radio 항목의 필수 선택값입니다.', '—', 'string'],
    ['SegmentedControlItem', 'disabled', 'radio 항목 하나를 비활성화합니다.', 'false', 'boolean'],
    ['SegmentedControlItem', 'id', 'radio 항목의 id. FieldLabel 의 htmlFor 와 연결할 때 씁니다.', '—', 'string'],
    [
        'SegmentedControlItem',
        'href',
        'link 항목의 이동 주소입니다. href 가 있으면 링크로 렌더링됩니다.',
        '—',
        "LinkProps['href']",
    ],
    [
        'SegmentedControlItem',
        'aria-current',
        'link 항목 중 현재 항목에 page 를 줍니다.',
        'undefined',
        "'page' | undefined",
    ],
    [
        'SegmentedControlItem',
        'replace / scroll 등',
        'link 항목은 next/link 의 나머지 props 를 그대로 받습니다.',
        '—',
        'LinkProps',
    ],
    ['SegmentedControlItem', 'className', '항목에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const SegmentedControlGuidePage = () => (
    <GuidePageShell
        title="세그먼티드 컨트롤 (Segmented Control)"
        description="나란히 놓인 항목 중 하나를 고르는 컨트롤입니다. 동작은 type, 외형은 variant, 크기는 size 로 정하며 서로 자유롭게 조합됩니다."
    >
        <BaseCard>
            <section aria-labelledby="tg-type" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-type" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">type</code>은 필수입니다. 그룹에는{' '}
                        <code className="text-foreground font-mono">aria-label</code> 또는{' '}
                        <code className="text-foreground font-mono">aria-labelledby</code>로 이름을 줍니다.
                    </p>
                </div>
                <Table caption="type 별 사용 기준" columns={TYPE_COLUMNS} rows={TYPE_ROWS} size="md" />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Radio</h3>
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
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Link</h3>
                        <Suspense fallback={null}>
                            <UserTypeSwitchDemo ariaLabel="사용자 유형 — Link 예시" />
                        </Suspense>
                        <CodeBlock code={USAGE_LINK_TYPE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-variant" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-variant" className="typo-h4-bold">
                        외형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">variant</code>로 고릅니다. radio · link 타입 모두에
                        쓸 수 있습니다.
                    </p>
                </div>
                <Table caption="variant 별 모양" columns={VARIANT_COLUMNS} rows={VARIANT_ROWS} size="md" />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Subtle</h3>
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
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Solid</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            조회 기간처럼 카드 위에 바로 놓이는 필터에 씁니다.
                        </p>
                        <div className="flex flex-col gap-3">
                            <h4 className="typo-body-l-bold text-foreground">Radio 타입</h4>
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
                        <div className="flex flex-col gap-3">
                            <h4 className="typo-body-l-bold text-foreground">Link 타입</h4>
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
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-size" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-size" className="typo-h4-bold">
                        크기
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">size</code>는{' '}
                        <code className="text-foreground font-mono">sm</code>(기본) ·{' '}
                        <code className="text-foreground font-mono">md</code> ·{' '}
                        <code className="text-foreground font-mono">lg</code> 세 단계이며, 같은 size 라도 variant 에
                        따라 치수가 다릅니다.
                    </p>
                </div>
                <Table caption="size · variant 별 항목 치수" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    {SIZES.map((size) => (
                        <div
                            key={size}
                            className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6"
                        >
                            <code className="typo-body-l-medium text-foreground font-mono">{size}</code>
                            <SegmentedControl
                                type="radio"
                                variant="subtle"
                                size={size}
                                defaultValue="corp"
                                aria-label={`Subtle ${size} 크기 예시`}
                            >
                                <SegmentedControlItem value="corp">기업</SegmentedControlItem>
                                <SegmentedControlItem value="org">기관</SegmentedControlItem>
                            </SegmentedControl>
                            <SegmentedControl
                                type="radio"
                                variant="solid"
                                size={size}
                                defaultValue="3months"
                                aria-label={`Solid ${size} 크기 예시`}
                            >
                                <SegmentedControlItem value="today">오늘</SegmentedControlItem>
                                <SegmentedControlItem value="1month">1개월</SegmentedControlItem>
                                <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
                            </SegmentedControl>
                        </div>
                    ))}
                </div>
                <CodeBlock code={USAGE_SIZES} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-disabled" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-disabled" className="typo-h4-bold">
                        비활성 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        radio 타입에서 <code className="text-foreground font-mono">disabled</code>를{' '}
                        <code className="text-foreground font-mono">SegmentedControl</code>에 주면 그룹 전체가,{' '}
                        <code className="text-foreground font-mono">SegmentedControlItem</code>에 주면 그 항목만
                        비활성화됩니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Subtle</h3>
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
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Solid</h3>
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
                </div>
                <CodeBlock code={USAGE_DISABLED} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        radio 타입에 <code className="text-foreground font-mono">name</code>을 주면 선택값이 그 이름으로
                        제출됩니다. <code className="text-foreground font-mono">Field</code> 안에서는 컨트롤을{' '}
                        <code className="text-foreground font-mono">w-fit</code>로 감싸 폭이 늘어나지 않게 합니다.
                    </p>
                </div>
                <div className="border-foreground-subtle/30 bg-pastel-neutral/40 flex flex-col gap-1 rounded-sm border p-5">
                    <h3 className="typo-title-m-bold text-foreground">WAVE 검사 예외 — Missing form label</h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        <a
                            href="https://www.radix-ui.com/primitives/docs/components/radio-group"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-strong underline underline-offset-4"
                        >
                            Radix Radio Group
                        </a>
                        이 폼 제출용으로 자동 생성하는 보조 <code className="text-foreground font-mono">input</code>을
                        WAVE 가 <em>Missing form label</em>로 탐지할 수 있습니다. 이 input 은{' '}
                        <code className="text-foreground font-mono">aria-hidden=&quot;true&quot;</code> ·{' '}
                        <code className="text-foreground font-mono">tabindex=&quot;-1&quot;</code>이라 스크린리더와
                        키보드 탐색에서 빠지므로 예외로 처리합니다.
                    </p>
                </div>
                <SegmentedControlFormDemo />
                <CodeBlock code={USAGE_FORM} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        선택 컴포넌트는 선택지의 개수와 담는 내용으로 고릅니다.
                    </p>
                </div>
                <Table caption="선택 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        radio 타입은 라디오 그룹(Radix RadioGroup)이라 방향키로 항목을 옮기고, link 타입은{' '}
                        <code>nav</code> 와 링크로 읽힙니다[6.1.1][8.2.1].
                    </li>
                    <li>radio 항목의 이름은 항목 텍스트로 자동 연결됩니다[7.4.1].</li>
                    <li>
                        그룹 이름은 필수입니다. <code>aria-label</code> 또는 <code>aria-labelledby</code> 로 줍니다.
                    </li>
                    <li>
                        link 타입은 현재 항목에 <code>aria-current=&quot;page&quot;</code> 를 줍니다. 선택 표시도 이
                        값으로 바뀝니다.
                    </li>
                    <li>선택은 면 · 글자 굵기 변화로 표시되고 색만으로 전달하지 않습니다[5.3.1].</li>
                    <li>포커스는 항목 외곽선으로 표시됩니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tg-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tg-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        radio 타입은 RadioGroup, link 타입은 nav 의 나머지 속성도 그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SegmentedControl Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SegmentedControlGuidePage
