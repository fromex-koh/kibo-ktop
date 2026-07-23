import type {Metadata} from 'next'
import type {LucideIcon} from 'lucide-react'
import {CreditCard, FileSearch, MessageCircleMore, NotepadText, User} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {
    StickySidebar,
    StickySidebarContact,
    StickySidebarDivider,
    StickySidebarNav,
    StickySidebarNavItem,
    StickySidebarProfile,
} from '@/components/composite/sticky-sidebar'
import {Badge} from '@/components/ui/badge'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '스티키 사이드바 (StickySidebar)'}

const USAGE_CODE = `import {User, FileSearch, NotepadText, CreditCard, MessageCircleMore} from 'lucide-react'
import {
  StickySidebar, StickySidebarProfile, StickySidebarNav,
  StickySidebarNavItem, StickySidebarDivider, StickySidebarContact,
} from '@/components/composite/sticky-sidebar'
import {Badge} from '@/components/ui/badge'

<StickySidebar>
  {/* logoSrc: API가 내려주는 회사 로고 URL. 없으면 grape 플레이스홀더 */}
  <StickySidebarProfile
    name="(주)케이탑테크놀로지"
    logoSrc={company.logoUrl}
    badge={<Badge variant="outline" color="secondary-grape" shape="round" size="sm">기업회원</Badge>}
  />
  <StickySidebarNav aria-label="마이페이지 메뉴">
    <StickySidebarNavItem icon={User} href="/mypage/profile" active>내 정보</StickySidebarNavItem>
    <StickySidebarNavItem icon={FileSearch} href="/mypage/history">평가이력 조회</StickySidebarNavItem>
    <StickySidebarNavItem icon={NotepadText} href="/mypage/reports">K-BIGx 보고서 이력</StickySidebarNavItem>
    <StickySidebarNavItem icon={CreditCard} href="/mypage/billing">유료 서비스 관리</StickySidebarNavItem>
    <StickySidebarNavItem icon={MessageCircleMore} href="/mypage/inquiry">1:1 문의</StickySidebarNavItem>
  </StickySidebarNav>
  <StickySidebarDivider />
  <StickySidebarContact phone="1577-0000" hours="상담시간 평일 9시~18시" />
</StickySidebar>`

// 메뉴 항목 — 데모 사이드바가 공유한다.
const MENU_ITEMS: readonly {icon: LucideIcon; label: string; active?: boolean}[] = [
    {icon: User, label: '내 정보', active: true},
    {icon: FileSearch, label: '평가이력 조회'},
    {icon: NotepadText, label: 'K-BIGx 보고서 이력'},
    {icon: CreditCard, label: '유료 서비스 관리'},
    {icon: MessageCircleMore, label: '1:1 문의'},
]

// 데모용 회사 로고 — 실제로는 API 가 내려주는 URL. 여기서는 동일 출처 public 자산으로 대체한다.
const SAMPLE_LOGO = '/icon-512.png'

// 데모 사이드바 — 이름·로고·nav 이름·컨테이너 클래스만 바꿔 여러 케이스에 재사용한다.
const DemoSidebar = ({
    name,
    navLabel,
    className,
    logoSrc,
}: {
    name: string
    navLabel: string
    className?: string
    logoSrc?: string
}) => (
    <StickySidebar className={className}>
        <StickySidebarProfile
            name={name}
            logoSrc={logoSrc}
            badge={
                <Badge variant="outline" color="secondary-grape" shape="round" size="sm">
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
        <StickySidebarDivider />
        <StickySidebarContact phone="1577-0000" hours="상담시간 평일 9시~18시" />
    </StickySidebar>
)

const STICKY_FILLER = [
    '아래 본문 영역을 스크롤하면 좌측 사이드바가 상단(top-6)에 고정된 채로 본문만 이동합니다.',
    '마이페이지처럼 본문이 길어도 메뉴는 항상 같은 위치에 남아 이동 비용을 줄입니다.',
    '사이드바가 본문보다 짧을 때 고정 효과가 가장 잘 드러납니다.',
    '본문 영역은 표·카드·폼 등 어떤 콘텐츠든 올 수 있습니다.',
    '데스크톱(md 이상)에서 2단 레이아웃으로 배치하고, 모바일에서는 세로로 쌓입니다.',
    '사이드바는 position: sticky 로 동작하며, 스크롤 조상에 overflow: hidden 이 있으면 고정이 풀립니다.',
    '그래서 이 데모는 자체 스크롤 박스 안에서 사이드바를 고정합니다.',
    '실제 화면에서는 페이지 전체가 스크롤 컨텍스트가 되어 뷰포트에 고정됩니다.',
    '계속 스크롤해 보세요 — 사이드바가 제자리에 남아 있는지 확인할 수 있습니다.',
    '본문이 사이드바보다 충분히 길어야 고정 구간이 길게 보입니다.',
] as const

const COMPOSITION = [
    {name: 'StickySidebar', desc: '흰 카드(테두리·rounded-lg) + sticky 컨테이너. 스크롤 시 top-6 위치에 고정된다.'},
    {
        name: 'StickySidebarProfile',
        desc: '로고(logoSrc) + 기업명 + 회원 배지. 가운데 정렬. 로고 없으면 플레이스홀더, 긴 이름은 줄바꿈.',
    },
    {name: 'StickySidebarNav', desc: '메뉴 목록 <nav> 랜드마크. aria-label로 이름을 준다.'},
    {
        name: 'StickySidebarNavItem',
        desc: '아이콘 + 라벨 링크(next/link). active면 옅은 파랑 면 + chevron + aria-current.',
    },
    {name: 'StickySidebarDivider', desc: '메뉴와 고객센터 사이 옅은 구분선(gray.100).'},
    {name: 'StickySidebarContact', desc: '고객센터 라벨 + 전화(tel 링크) + 상담시간.'},
] as const

const PROPS_ITEMS = [
    [
        'StickySidebar',
        'className · aside props',
        'sticky 위치·너비 등 컨테이너 스타일을 조정합니다.',
        'undefined',
        "ComponentProps<'aside'>",
    ],
    ['StickySidebarProfile', 'name', '기업/사용자 이름입니다. 길면 여러 줄로 줄바꿈됩니다.', '-', 'ReactNode'],
    [
        'StickySidebarProfile',
        'logoSrc',
        '회사 로고 URL(API 경유). 없으면 grape 플레이스홀더를 렌더합니다.',
        'undefined',
        'string',
    ],
    [
        'StickySidebarProfile',
        'logoAlt',
        '로고 대체 텍스트. 기본은 빈 문자열(기업명이 텍스트로 제공되어 장식).',
        "''",
        'string',
    ],
    ['StickySidebarProfile', 'badge', '이름 아래 회원 배지 슬롯입니다.', 'undefined', 'ReactNode'],
    ['StickySidebarProfile', 'avatar', '아바타 전체 슬롯. 지정 시 logoSrc보다 우선합니다.', 'undefined', 'ReactNode'],
    [
        'StickySidebarNav',
        'aria-label · nav props',
        '메뉴 랜드마크 이름과 스타일을 전달합니다.',
        'undefined',
        "ComponentProps<'nav'>",
    ],
    ['StickySidebarNavItem', 'icon', '항목 아이콘(lucide). 20px로 렌더합니다.', '-', 'LucideIcon'],
    ['StickySidebarNavItem', 'href', '이동 경로입니다.', '-', 'string'],
    ['StickySidebarNavItem', 'active', '현재 위치 여부. 강조 면 + chevron + aria-current="page".', 'false', 'boolean'],
    ['StickySidebarContact', 'label', '고객센터 라벨입니다.', "'고객센터'", 'ReactNode'],
    ['StickySidebarContact', 'phone', '전화번호. tel 링크로 렌더합니다.', '-', 'string'],
    ['StickySidebarContact', 'hours', '상담시간 등 보조 안내입니다.', 'undefined', 'ReactNode'],
] as const

// 스티키 사이드바 — 마이페이지 프로필 + 메뉴 + 고객센터 카드. Figma "Frame 2085664009" 반영.
const StickySidebarGuidePage = () => (
    <GuidePageShell
        title="스티키 사이드바 (StickySidebar)"
        description="마이페이지 좌측에 고정되는 프로필 + 메뉴 + 고객센터 카드입니다. compound API로 프로필·메뉴·구분선·고객센터를 조합하고, 배지는 기존 Badge를 그대로 재사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="ss-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="ss-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        현재 메뉴는 옅은 파랑 면 + 우측 chevron으로 강조되고{' '}
                        <code className="font-mono">aria-current</code>가 붙습니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border p-6">
                    <div className="max-w-xs">
                        <DemoSidebar
                            name="(주)케이탑테크놀로지"
                            navLabel="마이페이지 메뉴"
                            logoSrc={SAMPLE_LOGO}
                            className="static"
                        />
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ss-logo" className="flex flex-col gap-4">
                <div>
                    <h2 id="ss-logo" className="typo-h4-bold">
                        로고 (있음 / 없음)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        회사 로고는 API가 내려주는 <code className="font-mono">logoSrc</code> URL로 렌더됩니다. 값이
                        있으면 로고 이미지를, 로고가 없으면(미등록) 브랜드 grape 플레이스홀더를 보여줍니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <p className="typo-body-l-medium text-foreground">로고 있음</p>
                        <DemoSidebar
                            name="(주)케이탑테크놀로지"
                            navLabel="마이페이지 메뉴 (로고 있음)"
                            logoSrc={SAMPLE_LOGO}
                            className="static"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="typo-body-l-medium text-foreground">로고 없음 (플레이스홀더)</p>
                        <DemoSidebar
                            name="(주)케이탑테크놀로지"
                            navLabel="마이페이지 메뉴 (로고 없음)"
                            className="static"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ss-long" className="flex flex-col gap-4">
                <div>
                    <h2 id="ss-long" className="typo-h4-bold">
                        긴 기업명
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기업명이 길면 가운데 정렬을 유지한 채 여러 줄로 줄바꿈되고, 배지와 아래 메뉴가 자연스럽게
                        밀려납니다. 카드 너비는 그대로 유지됩니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border p-6">
                    <div className="max-w-xs">
                        <DemoSidebar
                            name="(주)케이탑테크놀로지벤처투자기술평가연구소"
                            navLabel="마이페이지 메뉴 (긴 이름 예시)"
                            logoSrc={SAMPLE_LOGO}
                            className="static"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        {/* overflow-visible: 기본 BaseCard(overflow-hidden)는 sticky 스크롤 컨텍스트를 가둬 고정을 무력화하므로 해제한다. */}
        <BaseCard className="overflow-visible">
            <section aria-labelledby="ss-sticky" className="flex flex-col gap-4">
                <div>
                    <h2 id="ss-sticky" className="typo-h4-bold">
                        스티키 동작
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        2단 레이아웃에서 페이지를 아래로 스크롤하면 좌측 사이드바가 상단에 고정된 채 본문만 지나갑니다.
                        고정 위치(<code className="font-mono">top</code>)는 상단 고정 헤더 높이만큼 내려, 카드 전체가
                        가려지지 않게 합니다. <code className="font-mono">position: sticky</code>는 스크롤 조상에{' '}
                        <code className="font-mono">overflow: hidden</code>이 있으면 풀리므로, 사이드바를 감싸는 카드의
                        overflow도 해제했습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr]">
                    {/* top-20(80px): 가이드 상단 고정 헤더(h-header-h, 64px) 아래에 카드 전체가 보이도록 오프셋을 준다. */}
                    <DemoSidebar
                        name="(주)케이탑테크놀로지"
                        navLabel="마이페이지 메뉴 (스티키 예시)"
                        logoSrc={SAMPLE_LOGO}
                        className="top-20 self-start"
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
            <section aria-labelledby="ss-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="ss-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">StickySidebar를 이루는 요소들입니다.</p>
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
                            {COMPOSITION.map((row) => (
                                <tr key={row.name} className="border-border bg-background border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                    >
                                        {row.name}
                                    </th>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{row.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ss-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="ss-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        컨테이너와 각 섹션 컴포넌트에 전달하는 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="StickySidebar 컴포넌트 Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ss-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="ss-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        StickySidebar가 지키는 KWCAG 2.1 요건입니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        메뉴는 <code className="font-mono">nav[aria-label]</code> 랜드마크로, 각 항목은{' '}
                        <code className="font-mono">next/link</code>로 렌더되어 키보드로 조작할 수 있습니다.
                        [6.1.1/6.4.2]
                    </li>
                    <li>
                        현재 항목은 <code className="font-mono">aria-current=&quot;page&quot;</code>로 표시하고, 색만
                        아니라 chevron으로도 구분합니다. [5.3.1]
                    </li>
                    <li>모든 항목은 h-14(56px)로 44px 터치 타깃을 넘고 focus-visible 링을 가집니다. [6.1.2/6.1.3]</li>
                    <li>아바타·아이콘·chevron은 장식이라 aria-hidden이며, 전화번호는 tel 링크로 제공됩니다.</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StickySidebarGuidePage
