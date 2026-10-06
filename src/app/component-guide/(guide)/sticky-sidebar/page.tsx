// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {LucideIcon} from 'lucide-react'
import {BriefcaseBusiness, CreditCard, FileSearch, MessageCircleMore, NotepadText, User} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {
    StickySidebar,
    StickySidebarNav,
    StickySidebarNavItem,
    StickySidebarProfile,
} from '@/components/composite/sticky-sidebar'
import {Badge} from '@/components/ui/badge'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {cn} from '@/lib/utils'

export const metadata: Metadata = {title: '스티키 사이드바 (StickySidebar)'}

const USAGE_CODE = `import {User, BriefcaseBusiness, FileSearch} from 'lucide-react'
import {
  StickySidebar,
  StickySidebarProfile,
  StickySidebarNav,
  StickySidebarNavItem,
} from '@/components/composite/sticky-sidebar'
import {Badge} from '@/components/ui/badge'

<StickySidebar>
  <StickySidebarProfile
    headingLevel={3}
    name="(주)케이탑테크놀로지"
    badge={
      <Badge variant="outline" color="secondary-purple" shape="round" size="sm">
        기업회원
      </Badge>
    }
  />
  <StickySidebarNav aria-label="마이페이지 메뉴">
    <StickySidebarNavItem icon={User} href="/mypage/profile" active>
      내 정보
    </StickySidebarNavItem>
    <StickySidebarNavItem icon={BriefcaseBusiness} href="/mypage/career">
      대표자(경영자) 역량 및 경력
    </StickySidebarNavItem>
    <StickySidebarNavItem icon={FileSearch} href="/mypage/results">
      평가결과 조회
    </StickySidebarNavItem>
  </StickySidebarNav>
</StickySidebar>`

const LAYOUT_CODE = `import {StickySidebar} from '@/components/composite/sticky-sidebar'

<div className="grid gap-6 md:grid-cols-[--spacing(86)_1fr]">
  <StickySidebar className="max-md:static md:top-20 md:self-start">
    {/* profile + navigation */}
  </StickySidebar>
  <main>{/* page content */}</main>
</div>`

const OPTIONAL_CODE = `import {StickySidebarContact, StickySidebarDivider} from '@/components/composite/sticky-sidebar'

{/* 고객센터가 필요한 화면에서만 StickySidebarNav 아래에 추가합니다. */}
<StickySidebarDivider />
<StickySidebarContact
  phone="1577-0000"
  hours="상담시간 평일 9시~18시"
/>`

const MENU_ITEMS: readonly {icon: LucideIcon; label: string; active?: boolean}[] = [
    {icon: User, label: '내 정보', active: true},
    {icon: BriefcaseBusiness, label: '대표자(경영자) 역량 및 경력'},
    {icon: FileSearch, label: '평가결과 조회'},
    {icon: NotepadText, label: 'K-BIGx 보고서 이력'},
    {icon: CreditCard, label: '유료 서비스 관리'},
    {icon: MessageCircleMore, label: '1:1 문의'},
]

const DemoSidebar = ({name, navLabel, className}: {name: string; navLabel: string; className?: string}) => (
    <StickySidebar className={cn('w-86 max-w-full', className)}>
        <StickySidebarProfile
            name={name}
            // 데모가 놓이는 자리의 앞 제목이 h3(미리보기)이라 이름은 h4 로 낮춘다.
            headingLevel={4}
            badge={
                <Badge variant="outline" color="secondary-purple" shape="round" size="sm">
                    기업회원
                </Badge>
            }
        />
        <StickySidebarNav aria-label={navLabel}>
            {MENU_ITEMS.map(({icon, label, active}) => (
                <StickySidebarNavItem key={label} icon={icon} href="#" active={active}>
                    {label}
                </StickySidebarNavItem>
            ))}
        </StickySidebarNav>
    </StickySidebar>
)

const STICKY_FILLER = [
    '스티키 사이드바와 함께 배치되는 본문 영역입니다.',
    '본문이 사이드바보다 길어야 고정되는 구간을 확인할 수 있습니다.',
    '상단 고정 헤더가 있다면 헤더 높이와 여백을 top 값에 반영합니다.',
    '모바일에서는 1단으로 쌓고 sticky를 해제합니다.',
    '스크롤 조상의 overflow 속성이 sticky 동작을 제한하지 않는지 확인합니다.',
    '사이드바의 너비는 컴포넌트가 아니라 페이지 레이아웃에서 결정합니다.',
    '현재 메뉴는 경로와 일치하는 항목 하나에만 지정합니다.',
    '긴 메뉴명은 말줄임 없이 여러 줄로 표시됩니다.',
    '본문 콘텐츠가 늘어나도 사이드바 내부 구성은 변하지 않습니다.',
    '계속 스크롤해 사이드바가 헤더 아래 위치를 유지하는지 확인합니다.',
] as const

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    {name: 'StickySidebar', desc: 'aside 카드 컨테이너입니다. sticky top-6(24px)이 기본입니다.'},
    {name: 'StickySidebarProfile', desc: '회원 배지와 이름입니다. 배지가 이름 위에 놓입니다.'},
    {name: 'StickySidebarNav', desc: '메뉴를 감싸는 nav 입니다. aria-label 을 지정합니다.'},
    {name: 'StickySidebarNavItem', desc: '아이콘과 라벨로 된 메뉴 링크입니다. 높이는 56px 이상입니다.'},
    {name: 'StickySidebarDivider', desc: '고객센터 같은 선택 영역을 가르는 구분선입니다.'},
    {name: 'StickySidebarContact', desc: '고객센터 전화번호(tel 링크)와 상담시간입니다. 필요한 화면에서만 씁니다.'},
] as const

const PROPS_ITEMS = [
    [
        'StickySidebar',
        'className · aside 속성',
        '너비 · sticky 위치 · 반응형 동작을 페이지에 맞게 조정합니다.',
        '-',
        "ComponentPropsWithoutRef<'aside'>",
    ],
    ['StickySidebarProfile', 'name', '기업 또는 사용자 이름입니다(필수).', '-', 'ReactNode'],
    [
        'StickySidebarProfile',
        'headingLevel',
        '이름의 헤딩 단계입니다. 화면의 앞 제목보다 한 단계 낮게 줍니다.',
        '2',
        '2 | 3 | 4',
    ],
    ['StickySidebarProfile', 'badge', '이름 위에 둘 Badge 입니다.', '-', 'ReactNode'],
    [
        'StickySidebarProfile',
        'className · div 속성',
        'div 에 그대로 전달합니다.',
        '-',
        "ComponentPropsWithoutRef<'div'>",
    ],
    [
        'StickySidebarNav',
        'aria-label · nav 속성',
        '메뉴의 이름과 nav 속성입니다.',
        '-',
        "ComponentPropsWithoutRef<'nav'>",
    ],
    ['StickySidebarNavItem', 'icon', '항목 앞 아이콘입니다(필수). 20px 로 그립니다.', '-', 'LucideIcon'],
    ['StickySidebarNavItem', 'href', '이동 경로입니다(필수).', '-', 'string'],
    [
        'StickySidebarNavItem',
        'active',
        '현재 페이지 항목입니다. 강조 표시하고 aria-current="page" 를 줍니다.',
        'false',
        'boolean',
    ],
    ['StickySidebarNavItem', 'children', '메뉴 라벨입니다(필수).', '-', 'ReactNode'],
    ['StickySidebarNavItem', 'className · Link 속성', 'next/link 의 Link 에 그대로 전달합니다.', '-', 'LinkProps'],
    [
        'StickySidebarDivider',
        'className · Separator 속성',
        'Separator 에 그대로 전달합니다.',
        '-',
        'ComponentPropsWithoutRef<typeof Separator>',
    ],
    ['StickySidebarContact', 'label', '고객센터 영역의 라벨입니다.', "'고객센터'", 'ReactNode'],
    ['StickySidebarContact', 'phone', '전화번호입니다(필수). tel 링크로 그립니다.', '-', 'string'],
    ['StickySidebarContact', 'hours', '상담시간 같은 보조 안내입니다.', '-', 'ReactNode'],
    [
        'StickySidebarContact',
        'className · div 속성',
        'div 에 그대로 전달합니다.',
        '-',
        "ComponentPropsWithoutRef<'div'>",
    ],
] as const

const StickySidebarGuidePage = () => (
    <GuidePageShell
        title="스티키 사이드바 (StickySidebar)"
        description="마이페이지처럼 본문이 긴 화면에서 프로필과 메뉴를 왼쪽에 고정해 두는 사이드바입니다."
    >
        <BaseCard>
            <section aria-labelledby="sticky-sidebar-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sticky-sidebar-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">StickySidebar</code> 안에{' '}
                        <code className="text-foreground font-mono">StickySidebarProfile</code>과{' '}
                        <code className="text-foreground font-mono">StickySidebarNav</code>를 넣습니다. 현재 경로의 항목
                        하나에만 <code className="text-foreground font-mono">active</code>를 줍니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <div className="border-border overflow-x-auto rounded-md border p-6">
                        <DemoSidebar name="(주)케이탑테크놀로지" navLabel="마이페이지 메뉴" className="static" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sticky-sidebar-composition" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sticky-sidebar-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모두 <code className="text-foreground font-mono">@/components/composite/sticky-sidebar</code>
                        에서 가져옵니다. 기본은 Profile 과 Nav 만 쓰고, Divider 와 Contact 는 필요한 화면에서만
                        추가합니다.
                    </p>
                </div>
                <Table
                    caption="스티키 사이드바 구성 요소 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION.map((row) => ({
                        key: row.name,
                        cells: [<code key="name">{row.name}</code>, row.desc],
                    }))}
                    size="md"
                />
                <CodeBlock code={OPTIONAL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard className="overflow-visible">
            <section aria-labelledby="sticky-sidebar-layout" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sticky-sidebar-layout" className="typo-h4-bold">
                        페이지 배치
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        너비와 고정 위치는 페이지 레이아웃에서 정합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        사이드바는 <code className="text-foreground font-mono">w-full</code>이므로 너비(
                        <code>w-86</code> = 344px)는 페이지의 2단 grid 열에서 정합니다. 2단은{' '}
                        <code className="text-foreground font-mono">md</code>(768) 이상입니다.
                    </li>
                    <li>
                        고정 헤더가 있으면 헤더 높이를 더한 <code className="text-foreground font-mono">top</code> 값을{' '}
                        <code className="text-foreground font-mono">className</code>으로 넘깁니다.
                    </li>
                    <li>
                        모바일 1단 레이아웃에서는 <code className="text-foreground font-mono">max-md:static</code>으로
                        고정을 풉니다.
                    </li>
                    <li>
                        조상 요소에 <code className="text-foreground font-mono">overflow</code>가 걸려 있거나 본문이
                        사이드바보다 짧으면 고정되지 않습니다.
                    </li>
                </ul>
                <CodeBlock code={LAYOUT_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <div className="grid gap-6 md:grid-cols-[--spacing(86)_1fr]">
                        <DemoSidebar
                            name="(주)케이탑테크놀로지벤처투자기술평가연구소"
                            navLabel="마이페이지 메뉴 (스티키 예시)"
                            className="max-md:static md:top-20 md:self-start"
                        />
                        <div className="flex flex-col gap-4">
                            {STICKY_FILLER.map((text, index) => (
                                <div key={text} className="border-border flex flex-col gap-2 rounded-md border p-6">
                                    <h4 className="typo-title-m-bold text-foreground">본문 섹션 {index + 1}</h4>
                                    <p className="typo-body-l-regular text-label-foreground">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sticky-sidebar-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sticky-sidebar-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        현재 위치 표시와 헤딩은 컴포넌트가 처리하고, 이름과 단계는 사용처가 정합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>aside</code> 안의 <code>nav</code>에 <code>aria-label</code>을 줍니다[6.4.2]. 페이지에
                        메뉴가 둘 이상이면 이름을 서로 다르게 합니다.
                    </li>
                    <li>
                        <code>active</code> 항목에 <code>aria-current=&quot;page&quot;</code>가 붙습니다. 강조 면과
                        chevron 이 함께 나와 색만으로 전하지 않습니다[5.3.1]. 사용처는 <code>active</code>를 현재 경로의
                        항목 하나에만 줍니다.
                    </li>
                    <li>
                        아이콘과 chevron 은 <code>aria-hidden</code>이고 포커스 링이 있습니다[5.1.1][6.1.2].
                    </li>
                    <li>
                        프로필 이름은 실제 헤딩입니다. <code>headingLevel</code>(기본 2)을 화면의 제목 순서에 맞춰
                        건너뛰지 않게 합니다[6.4.2].
                    </li>
                    <li>
                        <code>sticky</code>는 DOM 순서를 바꾸지 않으므로 읽는 순서는 그대로입니다. 모바일 1단에서는
                        사이드바를 본문 앞에 두고 고정을 풉니다[7.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sticky-sidebar-props" className="flex flex-col gap-6">
                <h2 id="sticky-sidebar-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="StickySidebar 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StickySidebarGuidePage
