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
    SectionHeader,
    SectionHeaderAction,
    SectionHeaderDescription,
    SectionHeaderTitle,
} from '@/components/composite/section-header'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '섹션 헤더 (SectionHeader)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {
  SectionHeader,
  SectionHeaderAction,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from '@/components/composite/section-header'

<SectionHeader>
  <SectionHeaderTitle>부분발송 이메일등록</SectionHeaderTitle>
  <SectionHeaderDescription>
    안내문을 추가로 받으실 이메일 주소를 입력해 주세요.
  </SectionHeaderDescription>
</SectionHeader>`

const USAGE_CODE_ACTION = `<SectionHeader>
  <SectionHeaderTitle>기업정보</SectionHeaderTitle>
  <SectionHeaderDescription>
    <span aria-hidden="true" className="text-error-500">*</span> 표시 항목은 필수 입력 항목입니다.
  </SectionHeaderDescription>
  <SectionHeaderAction>
    <Button variant="tertiary" size="sm">
      최근 입력 정보 불러오기
    </Button>
  </SectionHeaderAction>
</SectionHeader>`

const USAGE_CODE_LIST = `<SectionHeader>
  <SectionHeaderTitle>대표자 경력사항</SectionHeaderTitle>
  <SectionHeaderDescription asChild>
    <ul className="flex list-none flex-col gap-2">
      <li className="flex">
        <ListMarker />
        <span>대표자 경력사항의 모든 정보는 필수 입력정보입니다.</span>
      </li>
      <li className="flex">
        <ListMarker />
        <span>대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로 차례대로 입력해주십시오.</span>
      </li>
    </ul>
  </SectionHeaderDescription>
  <SectionHeaderAction>
    <Button variant="tertiary" size="sm">입력도우미</Button>
  </SectionHeaderAction>
</SectionHeader>`

const USAGE_CODE_SIZE = `<SectionHeader>
  <SectionHeaderTitle size="lg">대표자 이력</SectionHeaderTitle>
  <SectionHeaderDescription size="lg">
    등록된 대표자 이력을 확인해 주세요.
  </SectionHeaderDescription>
</SectionHeader>`

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    [
        'SectionHeader',
        '제목 · 설명 · 액션을 감싸는 div 입니다. 액션이 있으면 제목 · 설명은 왼쪽, 액션은 오른쪽에 놓입니다.',
    ],
    ['SectionHeaderTitle', '섹션 제목입니다. h2 로 렌더링됩니다.'],
    ['SectionHeaderDescription', '제목 아래 설명입니다. 기본은 p 이고, asChild 로 ul 등 다른 요소를 쓸 수 있습니다.'],
    ['SectionHeaderAction', '오른쪽에 놓이는 버튼 등 액션 영역입니다. 선택입니다.'],
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
    ['SectionHeader', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
    [
        'SectionHeaderTitle',
        'size',
        '제목 크기입니다. md 는 typo-h4-bold, lg 는 typo-h1-bold 입니다.',
        "'md'",
        "'md' | 'lg'",
    ],
    ['SectionHeaderTitle', 'h2 속성', 'className 등 h2 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'h2'>"],
    [
        'SectionHeaderDescription',
        'size',
        '설명 크기입니다. md 는 typo-body-xl-regular, lg 는 typo-title-m-regular 입니다.',
        "'md'",
        "'md' | 'lg'",
    ],
    [
        'SectionHeaderDescription',
        'asChild',
        'true 이면 p 대신 자식 요소(ul 등)에 설명 스타일을 입힙니다.',
        'false',
        'boolean',
    ],
    ['SectionHeaderDescription', 'p 속성', 'className 등 p 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'p'>"],
    ['SectionHeaderAction', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
] as const

const SectionHeaderGuidePage = () => (
    <GuidePageShell title="섹션 헤더 (SectionHeader)" description="페이지 안 섹션의 맨 위에 두는 제목·설명 묶음입니다.">
        <BaseCard>
            <section aria-labelledby="sh-demo" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sh-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>SectionHeader</code> 안에 <code>SectionHeaderTitle</code> 과{' '}
                        <code>SectionHeaderDescription</code> 을 넣습니다. 설명은 생략할 수 있습니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <SectionHeader>
                        <SectionHeaderTitle>부분발송 이메일등록</SectionHeaderTitle>
                        <SectionHeaderDescription>
                            안내문을 추가로 받으실 이메일 주소를 입력해 주세요.
                        </SectionHeaderDescription>
                    </SectionHeader>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sh-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sh-variants" className="typo-h4-bold">
                        변형 · 상태
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">오른쪽 액션</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>SectionHeaderAction</code> 을 넣으면 제목 · 설명은 왼쪽, 액션은 오른쪽에 놓입니다.
                            버튼은 <code>variant=&quot;tertiary&quot;</code> · <code>size=&quot;sm&quot;</code> 을
                            씁니다.
                        </p>
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
                                    <Button variant="tertiary" size="sm">
                                        최근 입력 정보 불러오기
                                    </Button>
                                </SectionHeaderAction>
                            </SectionHeader>
                        </div>
                        <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">리스트형 설명</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            안내가 여러 줄이면 <code>SectionHeaderDescription</code> 에 <code>asChild</code> 를 주고{' '}
                            <code>ul</code> + <code>ListMarker</code> 목록을 넣습니다.
                        </p>
                        <div className="border-border rounded-xl border p-6">
                            <SectionHeader>
                                <SectionHeaderTitle>대표자 경력사항</SectionHeaderTitle>
                                <SectionHeaderDescription asChild>
                                    <ul className="flex list-none flex-col gap-2">
                                        <li className="flex">
                                            <ListMarker />
                                            <span>대표자 경력사항의 모든 정보는 필수 입력정보입니다.</span>
                                        </li>
                                        <li className="flex">
                                            <ListMarker />
                                            <span>
                                                대표자의 경력사항을 현 직장 근무경력을 포함하여 최근 경력부터 과거순으로
                                                차례대로 입력해주십시오.
                                            </span>
                                        </li>
                                    </ul>
                                </SectionHeaderDescription>
                                <SectionHeaderAction>
                                    <Button variant="tertiary" size="sm">
                                        입력도우미
                                    </Button>
                                </SectionHeaderAction>
                            </SectionHeader>
                        </div>
                        <CodeBlock code={USAGE_CODE_LIST} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">크기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            페이지 제목 아래에 화면 제목이 한 단계 더 있는 화면에서는 제목과 설명에 모두{' '}
                            <code>size=&quot;lg&quot;</code> 를 줍니다.
                        </p>
                        <div className="border-border rounded-xl border p-6">
                            <SectionHeader>
                                <SectionHeaderTitle size="lg">대표자 이력</SectionHeaderTitle>
                                <SectionHeaderDescription size="lg">
                                    등록된 대표자 이력을 확인해 주세요.
                                </SectionHeaderDescription>
                            </SectionHeader>
                        </div>
                        <CodeBlock code={USAGE_CODE_SIZE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sh-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sh-choice" className="typo-h4-bold">
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
            <section aria-labelledby="sh-composition" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sh-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                </div>
                <Table
                    caption="SectionHeader 구성 요소 목록"
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
            <section aria-labelledby="sh-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sh-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        제목은 <code>h2</code>, 설명은 <code>p</code> 로 렌더링됩니다. 페이지 제목(h1) 아래 섹션에서만
                        쓰고 헤딩 레벨을 건너뛰지 않습니다[6.4.2].
                    </li>
                    <li>
                        여러 줄 안내는 <code>asChild</code> + <code>ul</code>/<code>li</code> 로 넣어 목록 구조를
                        유지합니다[8.1.1].
                    </li>
                    <li>
                        설명 색은 <code>text-foreground-subtle</code> 입니다. 필수 표시 <code>*</code> 는 색만으로
                        전하지 않도록 &quot;표시 항목은 필수 입력 항목입니다&quot; 문구를 함께 둡니다[5.3.1].
                    </li>
                    <li>액션 버튼에는 글자로 된 이름을 넣습니다[6.4.3].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sh-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sh-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SectionHeader Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SectionHeaderGuidePage
