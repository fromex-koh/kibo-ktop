// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
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

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {
  SubSectionHeader,
  SubSectionHeaderAction,
  SubSectionHeaderDescription,
  SubSectionHeaderTitle,
} from '@/components/composite/sub-section-header'

<SubSectionHeader>
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

const USAGE_CODE_LIST = `<SubSectionHeader>
  <SubSectionHeaderTitle>기술인력</SubSectionHeaderTitle>
  <SubSectionHeaderDescription asChild>
    <ul className="flex list-none flex-col gap-1.5">
      <li className="flex">
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

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    ['SubSectionHeader', '제목 · 설명 · 액션을 감싸는 div 입니다.'],
    ['SubSectionHeaderTitle', '하위 구획 제목입니다. h3 으로 렌더링됩니다.'],
    [
        'SubSectionHeaderDescription',
        '제목 아래 설명입니다. 기본은 p 이고, asChild 로 ul 등 다른 요소를 쓸 수 있습니다.',
    ],
    ['SubSectionHeaderAction', '오른쪽에 놓이는 버튼 등 액션 영역입니다. 선택입니다.'],
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'section-header',
        cells: [
            '페이지 안 섹션의 제목',
            <code key="c">SectionHeader</code>,
            'h2 입니다. 기본 typo-h4-bold, size="lg" 는 typo-h1-bold 입니다.',
        ],
    },
    {
        key: 'sub-section-header',
        cells: [
            '섹션 안의 하위 구획 제목',
            <Link key="c" href="/component-guide/sub-section-header" className={LINK_CLASS}>
                SubSectionHeader
            </Link>,
            'h3 이며 typo-title-l-bold 로 한 단계 작습니다. h2 섹션 안에서만 씁니다.',
        ],
    },
    {
        key: 'step-header',
        cells: [
            '단계형 화면의 단계 제목과 진행바',
            <Link key="c" href="/component-guide/step-header" className={LINK_CLASS}>
                StepHeader
            </Link>,
            'h2 + 진행바를 한 묶음으로 제공합니다. 진행바가 필요 없으면 SectionHeader size="lg" 와 같은 타이포를 씁니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['SubSectionHeader', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
    ['SubSectionHeaderTitle', 'h3 속성', 'className 등 h3 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'h3'>"],
    [
        'SubSectionHeaderDescription',
        'asChild',
        'true 이면 p 대신 자식 요소(ul 등)에 설명 스타일을 입힙니다.',
        'false',
        'boolean',
    ],
    [
        'SubSectionHeaderDescription',
        'p 속성',
        'className 등 p 속성을 전달합니다.',
        '-',
        "ComponentPropsWithoutRef<'p'>",
    ],
    [
        'SubSectionHeaderAction',
        'div 속성',
        'className 등 div 속성을 전달합니다.',
        '-',
        "ComponentPropsWithoutRef<'div'>",
    ],
] as const

const SubSectionHeaderGuidePage = () => (
    <GuidePageShell
        title="서브섹션 헤더 (SubSectionHeader)"
        description="섹션 안의 하위 구획 맨 위에 두는 제목·설명 묶음입니다."
    >
        <BaseCard>
            <section aria-labelledby="ssh-demo" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ssh-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>SubSectionHeader</code> 안에 <code>SubSectionHeaderTitle</code> 과{' '}
                        <code>SubSectionHeaderDescription</code> 을 넣습니다. 설명은 생략할 수 있습니다. 제목은{' '}
                        <code>typo-title-l-bold</code>, 설명은 <code>typo-body-l-regular</code> 입니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SubSectionHeader>
                        <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                        <SubSectionHeaderDescription>담당자 정보를 정확히 입력해 주세요.</SubSectionHeaderDescription>
                    </SubSectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ssh-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ssh-variants" className="typo-h4-bold">
                        변형 · 상태
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">오른쪽 액션</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>SubSectionHeaderAction</code> 을 넣으면 제목 · 설명은 왼쪽, 액션은 오른쪽에 놓입니다.
                            버튼은 <code>variant=&quot;tertiary&quot;</code> · <code>size=&quot;xs&quot;</code> 를
                            씁니다.
                        </p>
                        <div className="border-border rounded-xl border p-6">
                            <SubSectionHeader>
                                <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                                <SubSectionHeaderDescription>
                                    담당자 정보를 정확히 입력해 주세요.
                                </SubSectionHeaderDescription>
                                <SubSectionHeaderAction>
                                    <Button variant="tertiary" size="xs">
                                        초기화
                                    </Button>
                                </SubSectionHeaderAction>
                            </SubSectionHeader>
                        </div>
                        <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">리스트형 설명</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            안내가 여러 줄이면 <code>SubSectionHeaderDescription</code> 에 <code>asChild</code> 를 주고{' '}
                            <code>ul</code> + <code>ListMarker level={2}</code>(대시) 목록을 넣습니다.
                        </p>
                        <div className="border-border rounded-xl border p-6">
                            <SubSectionHeader>
                                <SubSectionHeaderTitle>기술인력</SubSectionHeaderTitle>
                                <SubSectionHeaderDescription asChild>
                                    <ul className="flex list-none flex-col gap-1.5">
                                        <li className="flex">
                                            <ListMarker level={2} />
                                            <span>
                                                경영주를 제외하고, 4대보험 가입자 명부 등 확인 가능한 인력을 중복 없이
                                                입력해 주세요.
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
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ssh-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ssh-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        제목의 위계(h2 · h3)와 단계형 화면 여부로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="섹션 · 서브섹션 · 스텝 헤더 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ssh-composition" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ssh-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                </div>
                <Table
                    caption="SubSectionHeader 구성 요소 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION.map(([name, description]) => ({
                        key: name,
                        cells: [<code key="name">{name}</code>, description],
                    }))}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ssh-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ssh-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        제목은 <code>h3</code>, 설명은 <code>p</code> 로 렌더링됩니다. <code>h2</code>{' '}
                        섹션(SectionHeader 등) 안에서만 써서 헤딩 레벨을 건너뛰지 않습니다[6.4.2].
                    </li>
                    <li>
                        여러 줄 안내는 <code>asChild</code> + <code>ul</code>/<code>li</code> 로 넣어 목록 구조를
                        유지합니다[8.1.1].
                    </li>
                    <li>액션 버튼에는 글자로 된 이름을 넣습니다[6.4.3].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ssh-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ssh-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SubSectionHeader Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SubSectionHeaderGuidePage
