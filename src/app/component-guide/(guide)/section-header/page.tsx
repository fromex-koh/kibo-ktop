import type {Metadata} from 'next'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Button} from '@/components/ui/button'
import {BaseCard} from '@/components/composite/base-card'
import {
    SectionHeader,
    SectionHeaderAction,
    SectionHeaderDescription,
    SectionHeaderTitle,
} from '@/components/composite/section-header'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '섹션 헤더 (SectionHeader)'}

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<SectionHeader>
  <SectionHeaderTitle>부분발송 이메일등록</SectionHeaderTitle>
  <SectionHeaderDescription>
    안내문을 추가로 받으실 이메일 주소를 입력해주세요.
  </SectionHeaderDescription>
</SectionHeader>`

const USAGE_CODE_ACTION = `<SectionHeader>
  <SectionHeaderTitle>기업정보</SectionHeaderTitle>
  <SectionHeaderDescription>
    <span aria-hidden="true" className="text-error-500">*</span> 표시 항목은 필수 입력 항목입니다.
  </SectionHeaderDescription>
  <SectionHeaderAction>
    <Button variant="tertiary" size="md">
      최근 입력 정보 불러오기
    </Button>
  </SectionHeaderAction>
</SectionHeader>`

// 설명이 여러 줄 안내면 SectionHeaderDescription 을 asChild 로 ul + ListMarker 리스트로 바꾼다.
const USAGE_CODE_LIST = `<SectionHeader>
  <SectionHeaderTitle>대표자 경력사항</SectionHeaderTitle>
  <SectionHeaderDescription asChild>
    <ul className="flex list-none flex-col gap-2">
      <li className="flex gap-1.5">
        <ListMarker />
        <span>대표자 경력사항의 모든 정보는 필수 입력정보입니다.</span>
      </li>
      <li className="flex gap-1.5">
        <ListMarker />
        <span>대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로 차례대로 입력해주십시오.</span>
      </li>
    </ul>
  </SectionHeaderDescription>
  <SectionHeaderAction>
    <Button variant="tertiary" size="md">입력도우미</Button>
  </SectionHeaderAction>
</SectionHeader>`

const STYLE_CODE = `<SectionHeader>
  <SectionHeaderTitle>기업정보</SectionHeaderTitle>
  <SectionHeaderDescription>사업자등록증 기준으로 정확히 입력해 주세요.</SectionHeaderDescription>
  <SectionHeaderAction>
    <Button variant="tertiary" size="md">최근 입력 정보 불러오기</Button>
  </SectionHeaderAction>
</SectionHeader>`

const PROPS_ITEMS = [
    {
        component: 'SectionHeader',
        name: '...props',
        type: "ComponentPropsWithoutRef<'div'>",
        defaultValue: '-',
        description: '최상위 div의 네이티브 속성과 className을 전달합니다.',
    },
    {
        component: 'SectionHeaderTitle',
        name: '...props',
        type: "ComponentPropsWithoutRef<'h2'>",
        defaultValue: '-',
        description: 'h2의 네이티브 속성과 className을 전달합니다.',
    },
    {
        component: 'SectionHeaderDescription',
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description: 'true이면 기본 p 대신 Slot으로 자식 요소(예: ul)에 설명 스타일을 병합합니다.',
    },
    {
        component: 'SectionHeaderDescription',
        name: '...props',
        type: "ComponentPropsWithoutRef<'p'>",
        defaultValue: '-',
        description: '기본 p(또는 asChild 자식)의 네이티브 속성과 className을 전달합니다.',
    },
    {
        component: 'SectionHeaderAction',
        name: '...props',
        type: "ComponentPropsWithoutRef<'div'>",
        defaultValue: '-',
        description: '액션 래퍼 div의 네이티브 속성과 className을 전달합니다.',
    },
] as const

// 섹션 헤더 — 페이지 안 개별 섹션의 제목+설명 묶음 컴포넌트.
// 섹션 타이틀이므로 h2 를 쓰고, text-foreground·text-foreground-subtle 토큰을 사용한다.
const SectionHeaderGuidePage = () => (
    <GuidePageShell
        title="섹션 헤더 (SectionHeader)"
        description="페이지 안 개별 섹션 최상단의 제목+설명 묶음 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="sh-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Heading/H4/bold 제목 + Body/XL/Regular 설명, 간격은 gap-2(8px) 고정입니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SectionHeader>
                        <SectionHeaderTitle>부분발송 이메일등록</SectionHeaderTitle>
                        <SectionHeaderDescription>
                            안내문을 추가로 받으실 이메일 주소를 입력해주세요.
                        </SectionHeaderDescription>
                    </SectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

                <div className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">SectionHeaderAction — 오른쪽 액션(선택)</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">SectionHeaderAction</code> 을 넣으면 자동으로 제목/설명은 왼쪽,
                        액션은 오른쪽 2열 레이아웃이 된다(CSS <code className="font-mono">has-data-[slot=...]</code>{' '}
                        선택자 — JS 분기 없음). 넣지 않으면 위 예시처럼 세로로만 쌓인다. 액션 버튼은 Figma 기준{' '}
                        <code className="font-mono">variant=&quot;tertiary&quot;</code> ·{' '}
                        <code className="font-mono">size=&quot;md&quot;</code>(40px) 이다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SectionHeader>
                        <SectionHeaderTitle>기업정보</SectionHeaderTitle>
                        <SectionHeaderDescription>
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>{' '}
                            표시 항목은 필수 입력 항목입니다.
                        </SectionHeaderDescription>
                        <SectionHeaderAction>
                            <Button variant="tertiary" size="md">
                                최근 입력 정보 불러오기
                            </Button>
                        </SectionHeaderAction>
                    </SectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />

                <div className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">설명이 리스트인 경우</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        안내가 여러 줄이면 <code className="font-mono">SectionHeaderDescription</code> 을{' '}
                        <code className="font-mono">asChild</code> 로 <code className="font-mono">ul</code> +{' '}
                        <code className="font-mono">ListMarker</code>(점 불릿) 리스트로 바꿉니다. 오른쪽 액션과 나란히
                        놓이는 배치는 그대로입니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SectionHeader>
                        <SectionHeaderTitle>대표자 경력사항</SectionHeaderTitle>
                        <SectionHeaderDescription asChild>
                            <ul className="flex list-none flex-col gap-2">
                                <li className="flex gap-1.5">
                                    <ListMarker />
                                    <span>대표자 경력사항의 모든 정보는 필수 입력정보입니다.</span>
                                </li>
                                <li className="flex gap-1.5">
                                    <ListMarker />
                                    <span>
                                        대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로
                                        차례대로 입력해주십시오.
                                    </span>
                                </li>
                            </ul>
                        </SectionHeaderDescription>
                        <SectionHeaderAction>
                            <Button variant="tertiary" size="md">
                                입력도우미
                            </Button>
                        </SectionHeaderAction>
                    </SectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE_LIST} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        이 컴포넌트 내부에 들어갈 수 있는 요소들입니다.
                    </p>
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
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    SectionHeaderTitle
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                    섹션 제목을 표시합니다. 내부적으로 h2 요소를 렌더링합니다.
                                </td>
                            </tr>
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    SectionHeaderDescription
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                    섹션의 추가 설명을 표시합니다. 기본은 <code className="font-mono">p</code> 요소이고,{' '}
                                    <code className="font-mono">asChild</code> 로 <code className="font-mono">ul</code>{' '}
                                    등 다른 요소(여러 줄 리스트 안내)에 설명 스타일을 씌울 수 있습니다.
                                </td>
                            </tr>
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    SectionHeaderAction
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                    제목 오른쪽에 배치하는 선택적 액션(버튼 등) 영역입니다. 넣지 않아도 됩니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-style" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-style" className="typo-h4-bold">
                        스타일
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목과 설명만 넣으면 세로 스택으로 배치되고, SectionHeaderAction을 추가하면 CSS{' '}
                        <code className="font-mono">has-data-[slot=...]</code> 선택자로 제목·설명 왼쪽과 액션 오른쪽의
                        2열 레이아웃으로 전환됩니다. 프로젝트 타이포그래피와 foreground 토큰을 사용합니다.
                    </p>
                </div>
                <CodeBlock code={STYLE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-accessibility" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        섹션의 문서 구조와 설명 콘텐츠의 의미를 유지하도록 조합합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>SectionHeaderTitle</code>는 h2로 렌더링되므로 페이지 제목(h1) 아래의 섹션 계층에서
                        사용합니다.
                    </li>
                    <li>
                        기본 설명은 p로 렌더링되며, 여러 항목 안내는 <code>asChild</code>와 의미 있는 ul/li 구조로
                        조합합니다.
                    </li>
                    <li>
                        액션은 제목과 설명을 보조하는 버튼 등으로 구성하고, 버튼의 accessible name을 텍스트로
                        제공합니다.
                    </li>
                    <li>
                        리스트의 장식용 <code>ListMarker</code>는 실제 텍스트 정보와 중복되지 않도록 조합합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        SectionHeader(최상위)에서 커스터마이징 가능한 속성입니다.
                    </p>
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
                                    Type
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Default
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(({component, name, type, defaultValue, description}, index) => (
                                <tr
                                    key={`${component}-${name}`}
                                    className="border-border bg-background border-b last:border-b-0"
                                >
                                    {index === 0 || component !== PROPS_ITEMS[index - 1]?.component ? (
                                        <th
                                            scope="rowgroup"
                                            rowSpan={PROPS_ITEMS.filter((item) => item.component === component).length}
                                            className="typo-body-l-medium border-border text-primary border-r px-4 py-3 text-left align-top font-mono"
                                        >
                                            {component}
                                        </th>
                                    ) : null}
                                    <th
                                        scope="row"
                                        className="typo-body-l-regular px-4 py-3 text-left font-mono font-normal whitespace-nowrap"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                        {type}
                                    </td>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                        {description}
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

export default SectionHeaderGuidePage
