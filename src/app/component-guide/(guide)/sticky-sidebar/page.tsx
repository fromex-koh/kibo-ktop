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

const LAYOUT_CODE = `<div className="grid gap-6 md:grid-cols-[--spacing(86)_1fr]">
  <StickySidebar className="max-md:static md:top-20 md:self-start">
    {/* profile + navigation */}
  </StickySidebar>
  <main>{/* page content */}</main>
</div>`

const OPTIONAL_CODE = `{/* 최신 LNB에서는 사용하지 않으며, 고객센터가 필요한 화면에서만 추가합니다. */}
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

const COMPOSITION = [
    ['StickySidebar', 'aside 요소인 카드 컨테이너입니다. 기본적으로 sticky top-6이 적용됩니다.'],
    ['StickySidebarProfile', '회원 배지와 기업명을 세로로 배치합니다. 배지가 이름보다 먼저 표시됩니다.'],
    ['StickySidebarNav', '메뉴를 감싸는 nav 랜드마크입니다. 사용처에서 aria-label을 지정합니다.'],
    [
        'StickySidebarNavItem',
        'Lucide 아이콘, 라벨과 chevron으로 구성된 링크입니다. active 상태에는 aria-current="page"가 적용됩니다.',
    ],
    ['StickySidebarDivider', '고객센터 같은 선택 영역을 구분할 때 사용하는 구분선입니다.'],
    ['StickySidebarContact', '전화번호와 상담시간을 표시하는 선택 영역이며 최신 기본 LNB에는 포함하지 않습니다.'],
] as const

const PROPS_ITEMS = [
    [
        'StickySidebar',
        'className · aside props',
        '너비, sticky offset과 반응형 동작을 페이지에 맞게 조정합니다.',
        'undefined',
        "ComponentProps<'aside'>",
    ],
    ['StickySidebarProfile', 'name', '기업 또는 사용자 이름입니다. 긴 이름은 여러 줄로 표시됩니다.', '-', 'ReactNode'],
    ['StickySidebarProfile', 'badge', '이름 위에 표시하는 Badge 슬롯입니다.', 'undefined', 'ReactNode'],
    [
        'StickySidebarNav',
        'aria-label · nav props',
        '메뉴 랜드마크의 접근 가능한 이름과 nav 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'nav'>",
    ],
    ['StickySidebarNavItem', 'icon', '항목 앞에 표시하는 Lucide 아이콘입니다.', '-', 'LucideIcon'],
    ['StickySidebarNavItem', 'href', '항목의 이동 경로입니다.', '-', 'string'],
    ['StickySidebarNavItem', 'active', '현재 페이지를 강조하고 aria-current="page"를 적용합니다.', 'false', 'boolean'],
    ['StickySidebarContact', 'label', '고객센터 영역의 라벨입니다.', "'고객센터'", 'ReactNode'],
    ['StickySidebarContact', 'phone', 'tel 링크로 제공할 전화번호입니다.', '-', 'string'],
    ['StickySidebarContact', 'hours', '상담시간 등의 보조 안내입니다.', 'undefined', 'ReactNode'],
] as const

const StickySidebarGuidePage = () => (
    <GuidePageShell
        title="스티키 사이드바 (StickySidebar)"
        description="마이페이지처럼 본문이 긴 화면에서 프로필과 현재 메뉴를 좌측에 유지하는 compound 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="sticky-sidebar-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="sticky-sidebar-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        최신 LNB는 회원 배지, 기업명과 메뉴로 구성합니다. 현재 항목과 hover·focus 항목에는 강조 면과
                        chevron이 표시됩니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border p-6">
                    <DemoSidebar name="(주)케이탑테크놀로지" navLabel="마이페이지 메뉴" className="static" />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sticky-sidebar-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="sticky-sidebar-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본 LNB는 Profile과 Nav만 사용합니다. Divider와 Contact는 필요한 화면에서만 추가합니다.
                    </p>
                </div>
                <dl className="border-border divide-border divide-y rounded-md border">
                    {COMPOSITION.map(([name, description]) => (
                        <div key={name} className="grid gap-1 p-4 md:grid-cols-[--spacing(60)_1fr] md:gap-4">
                            <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                            <dd className="typo-body-l-regular text-muted-foreground">{description}</dd>
                        </div>
                    ))}
                </dl>
                <CodeBlock code={OPTIONAL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard className="overflow-visible">
            <section aria-labelledby="sticky-sidebar-layout" className="flex flex-col gap-4">
                <div>
                    <h2 id="sticky-sidebar-layout" className="typo-h4-bold">
                        Layout
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                        <li>사이드바의 344px 너비는 페이지의 2단 grid에서 정하고 컴포넌트는 w-full로 채웁니다.</li>
                        <li>
                            고정 헤더가 없으면 기본 top-6을 사용하고, 있다면 헤더 높이를 포함한 top 값으로 덮어씁니다.
                        </li>
                        <li>모바일 1단 레이아웃에서는 max-md:static으로 sticky를 해제합니다.</li>
                        <li>스크롤 조상의 overflow와 사이드바보다 짧은 본문은 sticky 구간을 제한할 수 있습니다.</li>
                    </ul>
                </div>
                <CodeBlock code={LAYOUT_CODE} language="tsx" copyLabel="복사" />
                <div className="grid gap-6 md:grid-cols-[--spacing(86)_1fr]">
                    <DemoSidebar
                        name="(주)케이탑테크놀로지벤처투자기술평가연구소"
                        navLabel="마이페이지 메뉴 (스티키 예시)"
                        className="max-md:static md:top-20 md:self-start"
                    />
                    <div className="flex flex-col gap-4">
                        {STICKY_FILLER.map((text, index) => (
                            <div key={text} className="border-border flex flex-col gap-2 rounded-md border p-6">
                                <h3 className="typo-title-m-bold text-foreground">본문 섹션 {index + 1}</h3>
                                <p className="typo-body-l-regular text-muted-foreground">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sticky-sidebar-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sticky-sidebar-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        각 하위 컴포넌트는 기본 HTML 속성과 className도 함께 전달받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="StickySidebar 컴포넌트 Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sticky-sidebar-accessibility" className="flex flex-col gap-3">
                <h2 id="sticky-sidebar-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                    <li>메뉴마다 용도를 구분할 수 있는 aria-label을 StickySidebarNav에 지정합니다.</li>
                    <li>현재 경로와 일치하는 항목 하나에만 active를 전달해 aria-current를 중복하지 않습니다.</li>
                    <li>아이콘과 chevron은 장식으로 처리되며 링크 라벨만으로 이동 목적을 이해할 수 있어야 합니다.</li>
                    <li>긴 기업명과 메뉴명은 생략하지 않고 줄바꿈해 전체 내용을 확인할 수 있도록 합니다.</li>
                    <li>메뉴 항목은 44px 이상의 조작 영역과 키보드 포커스링을 유지합니다.</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StickySidebarGuidePage
