// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'
import {Icon} from '@/components/custom/icon'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '베이스 카드 (BaseCard)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {BaseCard} from '@/components/composite/base-card'

<BaseCard title="기업정보" action={<Badge color="info">작성중</Badge>}>
  <p>카드 본문 콘텐츠입니다.</p>
</BaseCard>

{/* 헤더 없이 본문만 */}
<BaseCard>
  <p>제목 없이 콘텐츠만 담는 기본 컨테이너입니다.</p>
</BaseCard>`

const PADDING_USAGE_CODE = `{/* 기본(md) — 패딩 24px */}
<BaseCard title="기본 카드">…</BaseCard>

{/* lg — 패딩 32px */}
<BaseCard padding="lg">…</BaseCard>`

const OUTLINED_USAGE_CODE = `<BaseCard variant="outlined" padding="lg">
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <Icon symbol="alert" variant="solid" className="size-icon-lg shrink-0 bg-icon-solid-neutral text-icon-solid-neutral-foreground" />
      <h3 className="typo-title-l-bold text-foreground">자가진단 안내</h3>
    </div>
    <ul className="flex list-none flex-col gap-2">
      <li className="flex">
        <ListMarker />
        <span className="typo-body-xl-regular text-foreground-subtle">안내 항목…</span>
      </li>
    </ul>
  </div>
</BaseCard>`

// 📄 콘텐츠 검수 필요: 원문의 붙여 쓴 띄어쓰기("평가는기술ONE"·"한해월"·"평가모형인KTRS"·"체크리스트를사실")를 그대로 옮겼다.
const SELF_DIAGNOSIS_NOTES = [
    '기업의 자가진단용 기술사업평가는기술ONE플랫폼 기업회원에 한해월 1회 무료로 제공됩니다.',
    '기술사업평가를 신청하시면 국내최초 개방형 평가모형인KTRS-FM을 통한 기술사업성 평가가 자동으로 진행됩니다.',
    '평가 신청 시 기업·기술 정보 및 체크리스트를사실에 기반하여 작성해주셔야 정확한 평가가 가능합니다.',
    '아래 기술사업평가 신청 버튼을 누르면 평가를 위한 정보 입력화면으로 이동합니다.',
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'base-card',
        cells: [
            '일반 콘텐츠를 담는 컨테이너',
            <code key="component">BaseCard</code>,
            '제목 · 보조 문구 · 액션 헤더는 선택이고 본문만 필수입니다. 페이지의 구획마다 한 장씩 씁니다.',
        ],
    },
    {
        key: 'form-card',
        cells: [
            '입력 폼 섹션 하나',
            <Link key="component" href="/component-guide/form-card" className={LINK_CLASS}>
                FormCard
            </Link>,
            '좌우 여백이 화면 폭에 따라 넓어지는 폼 전용 카드입니다. 헤더에 설명 목록과 여러 액션을 둘 수 있습니다.',
        ],
    },
    {
        key: 'repeat-card',
        cells: [
            '번호가 붙어 반복되는 입력 묶음',
            <Link key="component" href="/component-guide/repeat-card" className={LINK_CLASS}>
                RepeatCard
            </Link>,
            '“경력1”처럼 접기 · 삭제 버튼이 달린 테두리 카드입니다. 폼 카드 안에 넣어 씁니다.',
        ],
    },
] as const

const PADDING_COLUMNS = [
    {key: 'padding', header: 'padding', align: 'start', rowHeader: true},
    {key: 'value', header: '여백', align: 'start'},
] as const

const PADDING_ROWS = [
    {key: 'md', cells: [<code key="padding">md</code>, '24px']},
    {key: 'lg', cells: [<code key="padding">lg</code>, '32px']},
]

const PROPS_ITEMS = [
    ['BaseCard', 'title', '카드 제목입니다. 넘기면 헤더가 표시됩니다.', '-', 'ReactNode'],
    ['BaseCard', 'subtitle', '제목 아래 보조 문구입니다. title 이 있을 때만 표시됩니다.', '-', 'ReactNode'],
    ['BaseCard', 'action', '헤더 오른쪽 액션입니다. title 이 있을 때만 표시됩니다.', '-', 'ReactNode'],
    ['BaseCard', 'children', '카드 본문입니다. 필수입니다.', '-', 'ReactNode'],
    ['BaseCard', 'variant', 'outlined 는 테두리(border-subtle-3)를 표시합니다.', "'default'", "'default' | 'outlined'"],
    ['BaseCard', 'padding', '카드 안쪽 여백입니다. md 는 24px, lg 는 32px 입니다.', "'md'", "'md' | 'lg'"],
    ['BaseCard', 'className', '카드 바깥 요소에 클래스를 추가합니다.', '-', 'string'],
] as const

const BaseCardGuidePage = () => (
    <GuidePageShell
        title="베이스 카드 (BaseCard)"
        description="콘텐츠를 담는 기본 카드입니다. 제목 헤더는 선택이고 본문은 필수입니다."
    >
        <BaseCard>
            <section aria-labelledby="base-card-demo" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="base-card-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>title</code>을 넘기면 헤더가 표시되고 <code>children</code>이 본문이 됩니다.{' '}
                        <code>subtitle</code>은 제목 아래, <code>action</code>은 헤더 오른쪽에 놓입니다. 카드는 가로폭을
                        채우므로 폭 제한은 사용처 <code>className</code>으로 줍니다.
                    </p>
                </div>
                <div className="bg-background rounded-xl p-4 md:p-6">
                    <BaseCard title="기업정보" action={<Badge color="info">작성중</Badge>} className="max-w-md">
                        <p className="typo-body-l-regular text-foreground">카드 본문 콘텐츠입니다.</p>
                    </BaseCard>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">헤더 없이 본문만</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>title</code>을 생략하면 헤더 없이 본문만 표시됩니다. 이때 <code>subtitle</code>·
                            <code>action</code>도 표시되지 않습니다.
                        </p>
                        <div className="bg-background rounded-xl p-4 md:p-6">
                            <BaseCard className="max-w-md">
                                <p className="typo-body-l-regular text-foreground">
                                    제목 없이 콘텐츠만 담는 기본 컨테이너입니다.
                                </p>
                            </BaseCard>
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="base-card-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="base-card-variants" className="typo-h4-bold">
                        변형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        여백은 <code>padding</code>, 테두리는 <code>variant</code>로 고릅니다. 값을{' '}
                        <code>className</code>으로 덮어쓰지 않습니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">패딩 (padding)</h3>
                        <Table caption="padding 값별 여백" columns={PADDING_COLUMNS} rows={PADDING_ROWS} size="md" />
                        <div className="bg-background flex flex-col gap-6 rounded-xl p-4 md:p-6">
                            <BaseCard title="기본 카드">
                                <p className="typo-body-l-regular text-foreground">상하좌우 패딩 24px</p>
                            </BaseCard>
                            <BaseCard padding="lg">
                                <p className="typo-body-l-regular text-foreground">상하좌우 패딩 32px</p>
                            </BaseCard>
                        </div>
                        <CodeBlock code={PADDING_USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">테두리 (variant=&quot;outlined&quot;)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            카드를 배경과 테두리로 구분할 때 씁니다.
                        </p>
                        <div className="bg-background rounded-xl p-4 md:p-6">
                            <BaseCard variant="outlined" padding="lg">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <Icon
                                            symbol="alert"
                                            variant="solid"
                                            className="bg-icon-solid-neutral text-icon-solid-neutral-foreground size-icon-lg shrink-0"
                                        />
                                        <h3 className="typo-title-l-bold text-foreground">자가진단 안내</h3>
                                    </div>
                                    <ul className="flex list-none flex-col gap-2">
                                        {SELF_DIAGNOSIS_NOTES.map((note) => (
                                            <li key={note} className="flex">
                                                <ListMarker />
                                                <span className="typo-body-xl-regular text-foreground-subtle">
                                                    {note}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </BaseCard>
                        </div>
                        <CodeBlock code={OUTLINED_USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="base-card-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="base-card-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        담는 내용에 따라 카드를 고릅니다. 선택지를 고르는 카드는{' '}
                        <Link href="/component-guide/selectable-card" className={LINK_CLASS}>
                            SelectableCard
                        </Link>
                        ,{' '}
                        <Link href="/component-guide/option-card" className={LINK_CLASS}>
                            OptionCard
                        </Link>
                        를 씁니다.
                    </p>
                </div>
                <Table
                    caption="BaseCard · FormCard · RepeatCard 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="base-card-props" className="flex flex-col gap-6">
                <h2 id="base-card-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="BaseCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BaseCardGuidePage
