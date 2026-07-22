import type {Metadata} from 'next'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Button} from '@/components/ui/button'
import {BaseCard} from '@/components/composite/base-card'
import {
    SubSectionHeader,
    SubSectionHeaderAction,
    SubSectionHeaderDescription,
    SubSectionHeaderTitle,
} from '@/components/composite/sub-section-header'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '서브섹션 헤더 (SubSectionHeader)'}

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<SubSectionHeader>
  <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
  <SubSectionHeaderDescription>
    담당자 정보를 정확히 입력해 주세요.
  </SubSectionHeaderDescription>
</SubSectionHeader>`

const USAGE_CODE_ACTION = `<SubSectionHeader>
  <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
  <SubSectionHeaderDescription>
    담당자 정보를 정확히 입력해 주세요.
  </SubSectionHeaderDescription>
  <SubSectionHeaderAction>
    <Button variant="tertiary" size="xs">
      초기화
    </Button>
  </SubSectionHeaderAction>
</SubSectionHeader>`

// 설명이 여러 줄 안내면 SubSectionHeaderDescription 을 asChild 로 ul + ListMarker(대시 불릿) 리스트로 바꾼다.
const USAGE_CODE_LIST = `<SubSectionHeader>
  <SubSectionHeaderTitle>기술인력</SubSectionHeaderTitle>
  <SubSectionHeaderDescription asChild>
    <ul className="flex list-none flex-col gap-1.5">
      <li className="flex gap-1.5">
        <ListMarker level={2} />
        <span>
          경영주를 제외하고, 4대보험 가입자 명부 등 확인 가능한 인력을 중복 없이 입력해 주세요.
          <br />
          (동일인이 기술사·학사인 경우 기술사에만 입력해 주시면 됩니다.)
        </span>
      </li>
    </ul>
  </SubSectionHeaderDescription>
  <SubSectionHeaderAction>
    <Button variant="tertiary" size="xs">실적인정 지식재산</Button>
  </SubSectionHeaderAction>
</SubSectionHeader>`

const STYLE_CODE = `<SubSectionHeader>
  <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
  <SubSectionHeaderDescription>담당자 정보를 정확히 입력해 주세요.</SubSectionHeaderDescription>
  <SubSectionHeaderAction>
    <Button variant="tertiary" size="xs">초기화</Button>
  </SubSectionHeaderAction>
</SubSectionHeader>`

const PROPS_ITEMS = [
    {
        component: 'SubSectionHeader',
        name: '...props',
        type: "ComponentPropsWithoutRef<'div'>",
        defaultValue: '-',
        description: '최상위 div의 네이티브 속성과 className을 전달합니다.',
    },
    {
        component: 'SubSectionHeaderTitle',
        name: '...props',
        type: "ComponentPropsWithoutRef<'h3'>",
        defaultValue: '-',
        description: 'h3의 네이티브 속성과 className을 전달합니다.',
    },
    {
        component: 'SubSectionHeaderDescription',
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description: 'true이면 기본 p 대신 Slot으로 자식 요소(예: ul)에 설명 스타일을 병합합니다.',
    },
    {
        component: 'SubSectionHeaderDescription',
        name: '...props',
        type: "ComponentPropsWithoutRef<'p'>",
        defaultValue: '-',
        description: '기본 p(또는 asChild 자식)의 네이티브 속성과 className을 전달합니다.',
    },
    {
        component: 'SubSectionHeaderAction',
        name: '...props',
        type: "ComponentPropsWithoutRef<'div'>",
        defaultValue: '-',
        description: '액션 래퍼 div의 네이티브 속성과 className을 전달합니다.',
    },
] as const

// 서브섹션 헤더 — SectionHeader(h2) 보다 한 단계 더 작은 섹션 안 하위 구획 타이틀 컴포넌트.
// 구조·색상(text-foreground/text-foreground-subtle)·액션 유무 조건은 SectionHeader 와 동일하고
// 타이포만 다르다(SectionHeader: Heading/H4/bold → SubSectionHeader: Title/L/bold). 헤딩 레벨도
// 한 단계 아래(h3).
const SubSectionHeaderGuidePage = () => (
    <GuidePageShell
        title="서브섹션 헤더 (SubSectionHeader)"
        description="섹션 안의 더 작은 하위 구획 최상단의 제목(+선택적 액션) 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="ssh-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="ssh-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Title/L/bold 제목 + Body/XL/Regular 설명, 간격은 gap-y-1.5(6px)입니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SubSectionHeader>
                        <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                        <SubSectionHeaderDescription>담당자 정보를 정확히 입력해 주세요.</SubSectionHeaderDescription>
                    </SubSectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

                <div className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">SubSectionHeaderAction — 오른쪽 액션(선택)</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        SectionHeader 와 동일하게 <code className="font-mono">SubSectionHeaderAction</code> 을 넣으면
                        자동으로 제목은 왼쪽, 액션은 오른쪽 2열 레이아웃이 된다(CSS{' '}
                        <code className="font-mono">has-data-[slot=...]</code> 선택자 — JS 분기 없음). 액션 버튼은 Figma
                        기준 <code className="font-mono">variant=&quot;tertiary&quot;</code> ·{' '}
                        <code className="font-mono">size=&quot;xs&quot;</code>(32px) 로, SectionHeader(md·40px)보다 한
                        단계 작다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SubSectionHeader>
                        <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                        <SubSectionHeaderDescription>담당자 정보를 정확히 입력해 주세요.</SubSectionHeaderDescription>
                        <SubSectionHeaderAction>
                            <Button variant="tertiary" size="xs">
                                초기화
                            </Button>
                        </SubSectionHeaderAction>
                    </SubSectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />

                <div className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">설명이 리스트인 경우</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        안내가 여러 줄이면 <code className="font-mono">SubSectionHeaderDescription</code> 을{' '}
                        <code className="font-mono">asChild</code> 로 <code className="font-mono">ul</code> +{' '}
                        <code className="font-mono">ListMarker level=&#123;2&#125;</code>(대시 불릿) 리스트로 바꿉니다.
                        한 항목 안에서 <code className="font-mono">&lt;br /&gt;</code> 로 줄을 나누면, 이어지는 줄은
                        대시 너비만큼 들여써 텍스트를 같은 선에 맞춥니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SubSectionHeader>
                        <SubSectionHeaderTitle>기술인력</SubSectionHeaderTitle>
                        <SubSectionHeaderDescription asChild>
                            <ul className="flex list-none flex-col gap-1.5">
                                <li className="flex gap-1.5">
                                    <ListMarker level={2} />
                                    <span>
                                        경영주를 제외하고, 4대보험 가입자 명부 등 확인 가능한 인력을 중복 없이 입력해
                                        주세요.
                                        <br />
                                        (동일인이 기술사·학사인 경우 기술사에만 입력해 주시면 됩니다.)
                                    </span>
                                </li>
                            </ul>
                        </SubSectionHeaderDescription>
                        <SubSectionHeaderAction>
                            <Button variant="tertiary" size="xs">
                                실적인정 지식재산
                            </Button>
                        </SubSectionHeaderAction>
                    </SubSectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE_LIST} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssh-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="ssh-composition" className="typo-h4-bold">
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
                                    SubSectionHeaderTitle
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                    하위 구획 제목을 표시합니다. 내부적으로 h3 요소를 렌더링합니다.
                                </td>
                            </tr>
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    SubSectionHeaderDescription
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                    추가 설명을 표시합니다. 기본은 <code className="font-mono">p</code> 요소이고,{' '}
                                    <code className="font-mono">asChild</code> 로 <code className="font-mono">ul</code>{' '}
                                    등 다른 요소(여러 줄 리스트 안내)에 설명 스타일을 씌울 수 있습니다.
                                </td>
                            </tr>
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    SubSectionHeaderAction
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
            <section aria-labelledby="ssh-style" className="flex flex-col gap-4">
                <div>
                    <h2 id="ssh-style" className="typo-h4-bold">
                        스타일
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        SectionHeader와 같은 CSS <code className="font-mono">has-data-[slot=...]</code> 조합 레이아웃을
                        사용하지만, 하위 구획에 맞춰 제목은 Title/L/bold·h3, 액션은 tertiary/xs로 구성합니다. 설명은
                        Body/XL/Regular과 foreground-subtle 토큰을 사용합니다.
                    </p>
                </div>
                <CodeBlock code={STYLE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssh-accessibility" className="flex flex-col gap-4">
                <div>
                    <h2 id="ssh-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        상위 SectionHeader 아래의 하위 제목 계층과 설명 의미를 유지하도록 사용합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>SubSectionHeaderTitle</code>는 h3으로 렌더링하므로 상위 h2 섹션 안에서 사용합니다.
                    </li>
                    <li>
                        기본 설명은 p로 렌더링하며, 여러 안내 항목은 <code>asChild</code>와 ul/li 구조로 조합합니다.
                    </li>
                    <li>액션 버튼은 텍스트 등으로 접근 가능한 이름을 제공해야 합니다.</li>
                    <li>장식용 ListMarker는 실제 안내 텍스트와 중복되지 않도록 사용합니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssh-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="ssh-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        SubSectionHeader(최상위)에서 커스터마이징 가능한 속성입니다.
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

export default SubSectionHeaderGuidePage
