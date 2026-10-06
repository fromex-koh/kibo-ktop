// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {ChevronRight, Download, LoaderCircle, Search, X} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '버튼 (Button)'}

const BASIC_CODE = `import {Button} from '@/components/ui/button'

<Button type="submit" variant="default" size="md">저장</Button>
<Button type="button" variant="secondary" size="md">취소</Button>
<Button type="button" variant="tertiary" size="md">더보기</Button>`

const ICON_CODE = `<Button type="button" size="md">
  <Download aria-hidden="true" />
  다운로드
</Button>

<Button type="button" size="icon-md" aria-label="검색">
  <Search aria-hidden="true" />
</Button>

<Button type="button" variant="plain" size="icon-md" aria-label="닫기">
  <X aria-hidden="true" />
</Button>`

const LINK_CODE = `import Link from 'next/link'

{/* 동작 실행 */}
<Button type="button" variant="text" size="md" onClick={openDialog}>
  내용보기
</Button>

{/* 주소 이동 */}
<Button variant="text-underline" size="md" asChild>
  <Link href="/result">
    결과 보기
    <ChevronRight aria-hidden="true" />
  </Link>
</Button>`

const STATE_CODE = `<Button type="button" size="md" disabled>
  저장
</Button>

<Button type="button" size="md" disabled aria-busy="true">
  <LoaderCircle aria-hidden="true" className="animate-spin" />
  저장 중
</Button>`

const VARIANTS = [
    {key: 'default', use: '화면의 주요 액션', label: 'Primary'},
    {key: 'secondary', use: '주요 액션 옆의 보조 액션', label: 'Secondary'},
    {key: 'tertiary', use: '취소 · 더보기처럼 강조가 낮은 액션', label: 'Tertiary'},
    {key: 'text', use: '밑줄 없는 인라인 동작', label: 'Text'},
    {key: 'text-underline', use: '밑줄 있는 인라인 동작 · 링크', label: 'Text underline'},
    {key: 'plain', use: '배경 · 여백 없는 아이콘 액션', label: 'Plain'},
    {key: 'destructive', use: '삭제처럼 되돌리기 어려운 액션', label: 'Destructive'},
    {key: 'outline', use: '다이얼로그 · 시트 내부', label: 'Outline'},
    {key: 'ghost', use: '사이드바 내부', label: 'Ghost'},
] as const

const SIZES = [
    {key: 'xl', height: 60, iconKey: 'icon-xl'},
    {key: 'lg', height: 52, iconKey: 'icon-lg'},
    {key: 'md', height: 48, iconKey: 'icon-md'},
    {key: 'sm', height: 40, iconKey: 'icon-sm'},
    {key: 'xs', height: 32, iconKey: 'icon-xs'},
] as const

const TEXT_BUTTON_SIZES = [
    {key: 'lg', font: 18, lineHeight: 27, use: '강조가 필요한 독립형 인라인 액션'},
    {key: 'md', font: 16, lineHeight: 24, use: '본문의 기본 인라인 액션'},
    {key: 'sm', font: 14, lineHeight: 21, use: '보조 설명과 밀도 높은 UI의 액션'},
    {key: 'xs', font: 12, lineHeight: 18, use: '캡션 영역의 짧은 보조 액션'},
] as const

const VARIANT_COLUMNS = [
    {key: 'variant', header: 'Variant', align: 'start', rowHeader: true},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
    {key: 'preview', header: '미리보기', align: 'start'},
] as const

const VARIANT_ROWS = VARIANTS.map((variant) => ({
    key: variant.key,
    cells: [
        <code key="variant">{variant.key}</code>,
        variant.use,
        variant.key === 'plain' ? (
            <Button key="preview" type="button" variant="plain" size="icon-md" aria-label={`${variant.label} 미리보기`}>
                <Search aria-hidden="true" />
            </Button>
        ) : (
            <Button key="preview" type="button" variant={variant.key} size="md">
                {variant.label}
            </Button>
        ),
    ],
}))

// 비활성(disabled) 스타일 — 잠긴 모습은 variant 마다 정해져 있어 사용처에서는 disabled 속성만 켠다.
// 색 토큰은 theme/button.variants.ts 가 원본이므로 여기에는 눈으로 구분할 만큼만 적는다.
const DISABLED_VARIANTS = [
    {key: 'default', label: 'Primary', summary: '회색 면 · 테두리 안 보임'},
    {key: 'secondary', label: 'Secondary', summary: '회색 면 · 옅은 테두리'},
    {key: 'tertiary', label: 'Tertiary', summary: '흰 면 그대로 · 글자를 한 단계 더 옅게'},
    {key: 'text-underline', label: 'Text underline', summary: '글자와 밑줄만 옅게'},
    {key: 'text', label: 'Text', summary: '글자만 옅게'},
    {key: 'destructive', label: 'Destructive', summary: '회색 면 · 옅은 테두리'},
    {key: 'outline', label: 'Outline', summary: '회색 면 · 옅은 테두리'},
    {key: 'ghost', label: 'Ghost', summary: '회색 면 · 테두리 없음'},
] as const

const DISABLED_COLUMNS = [
    {key: 'variant', header: 'Variant', align: 'start', rowHeader: true},
    {key: 'default', header: '기본', align: 'start'},
    {key: 'disabled', header: '비활성', align: 'start'},
    {key: 'summary', header: '잠긴 모습', align: 'start', wrap: true},
] as const

const DISABLED_ROWS = DISABLED_VARIANTS.map((variant) => ({
    key: variant.key,
    cells: [
        <code key="variant">{variant.key}</code>,
        <Button key="default" type="button" variant={variant.key} size="md">
            {variant.label}
        </Button>,
        <Button key="disabled" type="button" variant={variant.key} size="md" disabled>
            {variant.label}
        </Button>,
        variant.summary,
    ],
}))

const SIZE_COLUMNS = [
    {key: 'size', header: '텍스트 버튼', align: 'start', rowHeader: true},
    {key: 'height', header: '높이', align: 'start'},
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'mixed-preview', header: 'text + 아이콘 미리보기', align: 'start'},
    {key: 'icon-size', header: '아이콘 버튼', align: 'start'},
    {key: 'icon-preview', header: '미리보기', align: 'start'},
] as const

const SIZE_ROWS = SIZES.map((size) => ({
    key: size.key,
    cells: [
        <code key="size">{size.key}</code>,
        `${size.height}px`,
        <Button key="preview" type="button" size={size.key}>
            버튼
        </Button>,
        <Button key="mixed-preview" type="button" size={size.key}>
            <Search aria-hidden="true" />
            검색
        </Button>,
        <code key="icon-size">{size.iconKey}</code>,
        <Button key="icon-preview" type="button" size={size.iconKey} aria-label={`${size.height}px 검색`}>
            <Search aria-hidden="true" />
        </Button>,
    ],
}))

const TEXT_BUTTON_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    {key: 'spec', header: '폰트 / 행간', align: 'start'},
    {key: 'use', header: '용도', align: 'start', wrap: true},
    {key: 'text', header: 'text', align: 'start'},
    {key: 'text-mixed', header: 'text + 아이콘', align: 'start'},
    {key: 'underline', header: 'text-underline', align: 'start'},
    {key: 'underline-mixed', header: 'text-underline + 아이콘', align: 'start'},
] as const

const TEXT_BUTTON_ROWS = TEXT_BUTTON_SIZES.map((size) => ({
    key: size.key,
    cells: [
        <code key="size">{size.key}</code>,
        `${size.font}px / ${size.lineHeight}px`,
        size.use,
        <Button key="text" type="button" variant="text" size={size.key}>
            내용보기
        </Button>,
        <Button key="text-mixed" type="button" variant="text" size={size.key}>
            내용보기
            <ChevronRight aria-hidden="true" />
        </Button>,
        <Button key="underline" type="button" variant="text-underline" size={size.key}>
            내용보기
        </Button>,
        <Button key="underline-mixed" type="button" variant="text-underline" size={size.key}>
            내용보기
            <ChevronRight aria-hidden="true" />
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
                default | secondary | tertiary | text | text-underline | plain | destructive | outline | ghost
            </code>,
            <code key="default">default</code>,
            '액션의 강조와 표현 방식을 선택합니다.',
        ],
    },
    {
        key: 'size',
        cells: [
            <code key="prop">size</code>,
            <code key="type">
                default | xl | lg | md | sm | xs | icon | icon-xl | icon-lg | icon-md | icon-sm | icon-xs
            </code>,
            <code key="default">default</code>,
            '일반 버튼 또는 아이콘 전용 버튼의 크기를 선택합니다. <code>default</code> · <code>icon</code> 은 높이 40px 에 최소 높이 44px(<code>min-h-11</code>)이 걸려 실제로는 44px 입니다.',
        ],
    },
    {
        key: 'asChild',
        cells: [
            <code key="prop">asChild</code>,
            <code key="type">boolean</code>,
            <code key="default">false</code>,
            'Link 등 자식 요소를 실제 DOM 요소로 사용하면서 Button 스타일을 적용합니다.',
        ],
    },
    {
        key: 'type',
        cells: [
            <code key="prop">type</code>,
            <code key="type">button | submit | reset</code>,
            <code key="default">HTML 기본값</code>,
            '폼 안의 의도하지 않은 제출을 막기 위해 항상 명시합니다.',
        ],
    },
    {
        key: 'disabled',
        cells: [
            <code key="prop">disabled</code>,
            <code key="type">boolean</code>,
            <code key="default">false</code>,
            '클릭과 키보드 실행을 모두 차단합니다.',
        ],
    },
] as const

const ButtonGuidePage = () => (
    <GuidePageShell title="버튼 (Button)" description="강조 단계(variant)와 크기(size)를 고르는 공통 버튼입니다.">
        <BaseCard>
            <section aria-labelledby="button-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>variant</code>로 강조 단계를, <code>size</code>로 크기를 정합니다. 폼 액션은{' '}
                        <code>md</code> 이상을 쓰고 <code>type</code>을 항상 적습니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button type="button" variant="default" size="md">
                        저장
                    </Button>
                    <Button type="button" variant="secondary" size="md">
                        취소
                    </Button>
                    <Button type="button" variant="tertiary" size="md">
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
                    <p className="typo-body-l-regular text-label-foreground">
                        일반 액션은 <code>default</code> · <code>secondary</code> · <code>tertiary</code>를 먼저 씁니다.
                    </p>
                </div>
                <Table caption="Button variant와 사용 기준" columns={VARIANT_COLUMNS} rows={VARIANT_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-disabled" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-disabled" className="typo-h4-bold">
                        비활성(disabled) 스타일
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        잠긴 모습은 variant 마다 정해져 있습니다. 사용처에서는 <code>disabled</code> 속성만 켭니다.
                    </p>
                </div>
                <Table
                    caption="Button variant별 비활성 스타일"
                    columns={DISABLED_COLUMNS}
                    rows={DISABLED_ROWS}
                    size="md"
                />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>잠긴 버튼은 클릭과 키보드 포커스를 모두 받지 않습니다.</li>
                    <li>
                        링크를 잠가야 하면 <code>asChild</code> 대신 <code>button</code>으로 그립니다.
                    </li>
                    <li>진행 중 표시는 아래 &quot;비활성과 진행 중&quot; 패턴을 따릅니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-size" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-size" className="typo-h4-bold">
                        Size 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        높이는 5단계입니다. 아이콘만 있는 버튼은 같은 단계의 <code>icon-*</code>를 씁니다.
                    </p>
                </div>
                <Table caption="Button size와 높이" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
                <div className="border-subtle-3 flex flex-col gap-2 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">Text Button</h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>text</code> · <code>text-underline</code>은 높이 없이 글자 크기와 행간만 바뀝니다.
                    </p>
                </div>
                <Table
                    caption="Text Button size와 사용 기준"
                    columns={TEXT_BUTTON_COLUMNS}
                    rows={TEXT_BUTTON_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-patterns" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-patterns" className="typo-h4-bold">
                        구현 패턴
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아이콘 · 링크 · 진행 상태를 넣을 때의 마크업입니다.
                    </p>
                </div>

                {/* 소제목 블록마다 가로선과 같은 여백으로 갈라, 섹션 제목(24) → 소제목(18) → 본문(14) 순서가 보이게 한다. */}
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">아이콘</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            아이콘에는 <code>aria-hidden</code>을, 아이콘만 있는 버튼에는 <code>aria-label</code>을
                            줍니다.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button type="button" size="md">
                                <Download aria-hidden="true" />
                                다운로드
                            </Button>
                            <Button type="button" size="icon-md" aria-label="검색">
                                <Search aria-hidden="true" />
                            </Button>
                            <Button type="button" variant="plain" size="icon-md" aria-label="닫기">
                                <X aria-hidden="true" />
                            </Button>
                        </div>
                        <CodeBlock code={ICON_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">동작과 링크</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            화면 안에서 실행하는 동작은 button, 주소 이동은 <code>asChild</code> +{' '}
                            <code>next/link</code>로 만듭니다.
                        </p>
                        <div className="flex flex-wrap items-center gap-6">
                            <Button type="button" variant="text" size="md">
                                내용보기
                            </Button>
                            <Button variant="text-underline" size="md" asChild>
                                <Link href="#button-api">
                                    Props 보기
                                    <ChevronRight aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                        <CodeBlock code={LINK_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">비활성과 진행 중</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            실행할 수 없으면 <code>disabled</code>, 진행 중이면 <code>disabled</code>에{' '}
                            <code>aria-busy</code>를 더해 중복 실행을 막습니다.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="button" size="md" disabled>
                                저장
                            </Button>
                            <Button type="button" size="md" disabled aria-busy="true">
                                <LoaderCircle aria-hidden="true" className="animate-spin" />
                                저장 중
                            </Button>
                        </div>
                        <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        동작은 <code>button</code>, 이동은 <code>asChild</code> + <code>next/link</code> 로 만들어
                        키보드(Enter · Space)로 실행됩니다[6.1.1, 8.1.1].
                    </li>
                    <li>
                        포커스는 <code>focus-visible</code> 외곽선으로 표시되며 평상시에도 외곽선 색이 지정되어
                        있습니다[6.1.2].
                    </li>
                    <li>
                        아이콘만 있는 버튼은 <code>aria-label</code>, 내부 아이콘은 <code>aria-hidden</code> 을
                        둡니다[5.1.1]. 링크 텍스트는 목적을 알 수 있게 씁니다[6.4.3].
                    </li>
                    <li>
                        인접한 버튼은 간격을 두어 겹치지 않게 합니다[6.1.3]. 상태는 색뿐 아니라 글자로도
                        전합니다[5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section id="button-api" aria-labelledby="button-api-title" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-api-title" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        기본 HTML button 속성과 아래 프로젝트 속성을 함께 사용할 수 있습니다.
                    </p>
                </div>
                <Table caption="Button Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ButtonGuidePage
