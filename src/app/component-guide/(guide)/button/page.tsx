import type {Metadata} from 'next'
import Link from 'next/link'
import {ArrowRight, ChevronRight, Download, LoaderCircle, Search, X} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '버튼 (Button)'}

const BASIC_CODE = `import {Button} from '@/components/ui/button'

<Button variant="default" size="md">저장</Button>
<Button variant="secondary" size="md">취소</Button>
<Button variant="tertiary" size="md">더보기</Button>`

const ICON_CODE = `<Button size="md">
  <Download aria-hidden="true" />
  다운로드
</Button>

<Button size="icon-md" aria-label="검색">
  <Search aria-hidden="true" />
</Button>

<Button variant="plain" size="icon-md" aria-label="닫기">
  <X aria-hidden="true" />
</Button>`

const INLINE_CODE = `import Link from 'next/link'

{/* 현재 화면에서 실행 */}
<Button variant="text" size="md" onClick={openDialog}>
  내용보기
</Button>

{/* 다른 주소로 이동 */}
<Button variant="text-underline" size="md" asChild>
  <Link href="/result">
    결과 보기
    <ChevronRight aria-hidden="true" />
  </Link>
</Button>`

const STATE_CODE = `<Button size="md" disabled>저장</Button>

<Button
  size="md"
  aria-busy="true"
  className="pointer-events-none"
>
  <LoaderCircle aria-hidden="true" className="animate-spin" />
  저장 중
</Button>`

const VARIANTS = [
    {key: 'default', use: '화면의 주요 액션', label: 'Primary'},
    {key: 'secondary', use: '주요 액션과 나란히 쓰는 보조 액션', label: 'Secondary'},
    {key: 'tertiary', use: '취소·더보기 등 낮은 강조의 액션', label: 'Tertiary'},
    {key: 'text', use: '채움과 밑줄이 없는 인라인 액션', label: 'Text'},
    {key: 'text-underline', use: '항상 밑줄이 보이는 인라인 액션', label: 'Text underline'},
    {key: 'plain', use: '배경과 여백이 없는 아이콘 액션', label: 'Plain'},
    {key: 'outline', use: '다이얼로그·시트 등 내부 UI', label: 'Outline'},
    {key: 'ghost', use: '사이드바 등 내부 UI', label: 'Ghost'},
    {key: 'destructive', use: '삭제 등 되돌리기 어려운 액션', label: 'Destructive'},
] as const

const SIZES = [
    {key: 'xl', height: 60, iconKey: 'icon-xl'},
    {key: 'lg', height: 52, iconKey: 'icon-lg'},
    {key: 'md', height: 48, iconKey: 'icon-md'},
    {key: 'sm', height: 40, iconKey: 'icon-sm'},
    {key: 'xs', height: 32, iconKey: 'icon-xs'},
] as const

const INLINE_SIZES = [
    {key: 'lg', figma: 'large', font: 18, lineHeight: 27, icon: 16},
    {key: 'md', figma: 'medium', font: 16, lineHeight: 24, icon: 16},
    {key: 'sm', figma: 'small', font: 14, lineHeight: 21, icon: 16},
    {key: 'xs', figma: 'xsmall', font: 12, lineHeight: 18, icon: 12},
] as const

const VARIANT_COLUMNS = [
    {key: 'variant', header: 'Variant', align: 'start', rowHeader: true},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
    {key: 'preview', header: '미리보기', align: 'start'},
] as const

const VARIANT_ROWS = VARIANTS.map((variant) => ({
    key: variant.key,
    cells: [
        <span key="variant" className="text-primary font-mono">
            {variant.key}
        </span>,
        variant.use,
        variant.key === 'plain' ? (
            <Button key="preview" variant="plain" size="icon-md" aria-label={`${variant.label} 미리보기`}>
                <Search aria-hidden="true" />
            </Button>
        ) : (
            <Button key="preview" variant={variant.key} size="md">
                {variant.label}
            </Button>
        ),
    ],
}))

const SIZE_COLUMNS = [
    {key: 'size', header: '텍스트 버튼', align: 'start', rowHeader: true},
    {key: 'height', header: '높이', align: 'start'},
    {key: 'button', header: '미리보기', align: 'start'},
    {key: 'icon-size', header: '아이콘 버튼', align: 'start'},
    {key: 'icon', header: '미리보기', align: 'start'},
] as const

const SIZE_ROWS = SIZES.map((size) => ({
    key: size.key,
    cells: [
        <span key="size" className="text-primary font-mono">
            {size.key}
        </span>,
        `${size.height}px`,
        <Button key="button" size={size.key}>
            버튼
        </Button>,
        <span key="icon-size" className="text-primary font-mono">
            {size.iconKey}
        </span>,
        <Button key="icon" size={size.iconKey} aria-label={`${size.height}px 아이콘 버튼`}>
            <Search aria-hidden="true" />
        </Button>,
    ],
}))

const INLINE_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    {key: 'figma', header: 'Figma', align: 'start'},
    {key: 'spec', header: '폰트 / 행간 / 아이콘', align: 'start'},
    {key: 'text', header: 'text', align: 'start'},
    {key: 'underline', header: 'text-underline', align: 'start'},
] as const

const INLINE_ROWS = INLINE_SIZES.map((size) => ({
    key: size.key,
    cells: [
        <span key="size" className="text-primary font-mono">
            {size.key}
        </span>,
        size.figma,
        `${size.font}px / ${size.lineHeight}px / ${size.icon}px`,
        <Button key="text" variant="text" size={size.key}>
            내용보기
        </Button>,
        <Button key="underline" variant="text-underline" size={size.key}>
            내용보기
        </Button>,
    ],
}))

const API_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start', wrap: true},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'variant',
        cells: [
            <code key="prop">variant</code>,
            <code key="type">
                default | secondary | tertiary | text | text-underline | plain | outline | ghost | destructive
            </code>,
            <code key="default">default</code>,
            '액션의 강조와 표현 방식을 선택합니다.',
        ],
    },
    {
        key: 'size',
        cells: [
            <code key="prop">size</code>,
            <code key="type">xl | lg | md | sm | xs | icon-xl | icon-lg | icon-md | icon-sm | icon-xs</code>,
            <code key="default">default</code>,
            '일반 버튼과 아이콘 전용 버튼의 크기를 선택합니다.',
        ],
    },
    {
        key: 'asChild',
        cells: [
            <code key="prop">asChild</code>,
            <code key="type">boolean</code>,
            <code key="default">false</code>,
            'Link 등 자식 요소에 Button 스타일을 적용합니다.',
        ],
    },
    {
        key: 'disabled',
        cells: [
            <code key="prop">disabled</code>,
            <code key="type">boolean</code>,
            <code key="default">false</code>,
            '사용할 수 없는 액션임을 표시하고 상호작용을 막습니다.',
        ],
    },
] as const

const ButtonGuidePage = () => (
    <GuidePageShell
        title="버튼 (Button)"
        description="액션의 강조 단계, 크기, 아이콘과 상태를 일관되게 구현하는 공통 Button 컴포넌트입니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="button-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>variant</code>로 강조 단계를 정하고 <code>size</code>로 크기를 선택합니다. 일반적인 폼
                        액션은 <code>md</code>부터 사용합니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default" size="md">
                        저장
                    </Button>
                    <Button variant="secondary" size="md">
                        취소
                    </Button>
                    <Button variant="tertiary" size="md">
                        더보기
                    </Button>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-variant" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-variant" className="typo-h4-bold">
                        Variant 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        화면의 액션에는 <code>default</code> · <code>secondary</code> · <code>tertiary</code>를 우선
                        사용합니다. 나머지는 아래 용도에 맞을 때만 선택합니다.
                    </p>
                </div>
                <Table caption="Button variant와 사용 기준" columns={VARIANT_COLUMNS} rows={VARIANT_ROWS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-size" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-size" className="typo-h4-bold">
                        Size 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        일반 버튼과 정사각 아이콘 버튼은 같은 5단계 높이를 공유합니다. <code>sm</code>과 <code>xs</code>
                        는 밀도 높은 UI에서만 사용합니다.
                    </p>
                </div>
                <Table caption="Button size와 실제 높이" columns={SIZE_COLUMNS} rows={SIZE_ROWS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-icon" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-icon" className="typo-h4-bold">
                        아이콘 사용
                    </h2>
                    <div className="typo-body-l-regular text-muted-foreground flex flex-col gap-2">
                        <p>텍스트와 함께 쓰는 아이콘은 children으로 배치하고 장식 아이콘에 aria-hidden을 지정합니다.</p>
                        <p>
                            아이콘만 있는 버튼은 <code>icon-*</code> size와 용도를 설명하는 <code>aria-label</code>이
                            필요합니다. 배경과 여백이 없는 아이콘 액션은 <code>plain</code>을 사용합니다.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <Button size="md">
                        <Download aria-hidden="true" />
                        다운로드
                    </Button>
                    <Button size="icon-md" aria-label="검색">
                        <Search aria-hidden="true" />
                    </Button>
                    <Button variant="plain" size="icon-md" aria-label="닫기">
                        <X aria-hidden="true" />
                    </Button>
                </div>
                <CodeBlock code={ICON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-inline" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-inline" className="typo-h4-bold">
                        인라인 버튼과 링크
                    </h2>
                    <div className="typo-body-l-regular text-muted-foreground flex flex-col gap-2">
                        <p>
                            <code>text</code>와 <code>text-underline</code>은 컨트롤 높이가 아닌 전용 글자 크기 스케일을
                            사용합니다.
                        </p>
                        <p>
                            현재 화면의 동작은 button으로, 주소 이동은 <code>asChild</code>와 <code>next/link</code>로
                            구현합니다.
                        </p>
                    </div>
                </div>
                <Table caption="인라인 Button size 사양" columns={INLINE_COLUMNS} rows={INLINE_ROWS} />
                <div className="flex flex-wrap items-center gap-6">
                    <Button variant="text" size="md">
                        내용보기
                    </Button>
                    <Button variant="text-underline" size="md" asChild>
                        <Link href="#button-api">
                            Props 보기
                            <ChevronRight aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
                <CodeBlock code={INLINE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-state" className="typo-h4-bold">
                        상태 처리
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        사용할 수 없는 액션은 <code>disabled</code>를 사용합니다. 진행 중에는 <code>aria-busy</code>를
                        알리고 중복 실행을 차단합니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="md" disabled>
                        저장
                    </Button>
                    <Button size="md" aria-busy="true" className="pointer-events-none">
                        <LoaderCircle aria-hidden="true" className="animate-spin" />
                        저장 중
                    </Button>
                    <Button variant="secondary" size="md" disabled>
                        <ArrowRight aria-hidden="true" />
                        다음
                    </Button>
                </div>
                <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section id="button-api" aria-labelledby="button-api-title" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-api-title" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본 HTML button 속성과 아래 프로젝트 속성을 함께 사용할 수 있습니다.
                    </p>
                </div>
                <Table size="md" caption="Button Props" columns={API_COLUMNS} rows={API_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ButtonGuidePage
