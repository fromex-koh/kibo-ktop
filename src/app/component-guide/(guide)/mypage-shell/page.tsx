// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {MypageFormCard} from '@/components/composite/mypage-form-card'
import CodeBlock from '@/components/custom/code-block'
import Link from 'next/link'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '마이페이지 사이드바 (MypageSidebar)'}

const LAYOUT_CODE = `import {MypageSidebar} from '@/components/composite/mypage-sidebar'
import {PageTitleBar} from '@/components/composite/page-title-bar'

<main id="main" tabIndex={-1} className="bg-background flex-1">
  <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
    <PageTitleBar title="마이페이지" breadcrumb={…} />

    {/* 사이드바 344 + 64 + 본문 792 = 1200 */}
    <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
      <MypageSidebar userType="corp" current="평가결과 조회" companyName={MYPAGE_MEMBER.companyName} />

      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <SectionHeader>
          <SectionHeaderTitle size="lg">평가결과 조회</SectionHeaderTitle>
        </SectionHeader>
        …
      </div>
    </div>
  </div>
</main>`

const CARD_CODE = `import {MypageFormCard} from '@/components/composite/mypage-form-card'

<MypageFormCard
  title="대표자 이력"
  subtitle="본 화면의 정보는 개인정보 수집·이용 동의에 따라 수집·관리되는 대표자 개인정보입니다."
>
  <FieldGrid>…</FieldGrid>
</MypageFormCard>`

const PROPS_ITEMS = [
    [
        'MypageSidebar',
        'userType',
        '기업 · 기관 중 어느 마이페이지인지입니다(필수). 메뉴 목록이 달라집니다.',
        '-',
        "'corp' | 'org'",
    ],
    [
        'MypageSidebar',
        'current',
        '지금 화면의 메뉴 라벨입니다(필수). 메뉴 라벨과 글자가 같아야 그 항목이 활성으로 표시됩니다.',
        '-',
        'string',
    ],
    ['MypageSidebar', 'companyName', '유형 배지 옆에 보이는 회원 이름입니다(필수).', '-', 'ReactNode'],
    [
        'MypageSidebar',
        'className · aside 속성',
        'xl 이상의 사이드바 카드(aside)에 전달됩니다. xl 미만에서는 className 만 적용됩니다.',
        '-',
        "ComponentPropsWithoutRef<'aside'>",
    ],
    ['MypageFormCard', 'title', '카드 제목입니다(필수).', '-', 'ReactNode'],
    ['MypageFormCard', 'subtitle', '제목 아래 설명입니다.', 'undefined', 'ReactNode'],
    ['MypageFormCard', 'children', '카드 본문(폼 칸 묶음)입니다(필수).', '-', 'ReactNode'],
] as const

const RESPONSIVE_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'shape', header: '모습', align: 'start', wrap: true},
] as const

const RESPONSIVE_ROWS = [
    {key: 'xl', cells: ['xl 이상', '본문 옆에 붙어 스크롤을 따라오는 사이드바 카드(폭 344)입니다.']},
    {
        key: 'md',
        cells: [
            'md 이상 xl 미만',
            '본문 위의 카드입니다. 지금 메뉴 한 줄만 보이고, 누르면 아래로 메뉴 목록이 열립니다.',
        ],
    },
    {key: 'mobile', cells: ['md 미만', '같은 한 줄이 화면 폭으로 넓어져 헤더 아래에 고정됩니다.']},
] as const

const MENU_COLUMNS = [
    {key: 'userType', header: 'userType', align: 'start', rowHeader: true},
    {key: 'labels', header: '메뉴 라벨 (current 에 넘기는 값)', align: 'start', wrap: true},
] as const

const MENU_ROWS = [
    {
        key: 'corp',
        cells: [
            <code key="userType">corp</code>,
            '내 정보 · 대표자 이력 · 평가결과 조회 · K-BIGx 보고서 이력 · 유료 서비스 관리 · 1:1 문의',
        ],
    },
    {
        key: 'org',
        cells: [
            <code key="userType">org</code>,
            '내 정보 · 평가결과 조회 · 평가검증 신청 조회 · K-BIGx 보고서 이력 · 하위계정 현황 · 1:1 문의',
        ],
    },
] as const

const MypageShellGuidePage = () => (
    <GuidePageShell
        title="마이페이지 사이드바 (MypageSidebar)"
        description="마이페이지의 모든 화면이 함께 쓰는 좌측 메뉴입니다. 본문 카드(MypageFormCard)도 이 문서에서 함께 다룹니다."
    >
        <BaseCard>
            <section aria-labelledby="mypage-shell-layout" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="mypage-shell-layout" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">MypageSidebar</code>에{' '}
                        <code className="text-foreground font-mono">userType</code> ·{' '}
                        <code className="text-foreground font-mono">current</code> ·{' '}
                        <code className="text-foreground font-mono">companyName</code>을 넘기고, 본문과 함께 아래처럼
                        배치합니다. xl 이상에서 페이지 컬럼은 <code>grid-layout</code>, 폭 상한은{' '}
                        <code>max-w-content</code>(1200)이며 xl 이상에서 사이드바 344 · 간격 64 · 본문 792입니다.
                    </p>
                </div>
                <CodeBlock code={LAYOUT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-responsive" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="mypage-shell-responsive" className="typo-h4-bold">
                        화면 폭에 따른 모습
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">MypageSidebar</code>는 화면 폭에 따라 세 가지로
                        바뀝니다. 사용처에서 따로 분기하지 않습니다.
                    </p>
                </div>
                <Table
                    caption="화면 폭에 따른 MypageSidebar 의 모습"
                    columns={RESPONSIVE_COLUMNS}
                    rows={RESPONSIVE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-menu" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="mypage-shell-menu" className="typo-h4-bold">
                        메뉴 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        메뉴는 화면에서 넘기지 않습니다. 라벨 · 아이콘 · 경로는{' '}
                        <code className="text-foreground font-mono">mypage-sidebar.tsx</code>의{' '}
                        <code className="text-foreground font-mono">MYPAGE_MENU</code>에서 고칩니다.
                    </p>
                </div>
                <Table caption="userType 별 메뉴 라벨" columns={MENU_COLUMNS} rows={MENU_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-card" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="mypage-shell-card" className="typo-h4-bold">
                        본문 카드 (MypageFormCard)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사이드바 옆 본문에 쓰는 폼 카드입니다.{' '}
                        <Link
                            href="/component-guide/form-card"
                            className="text-primary focus-visible:ring-ring rounded-xs underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
                        >
                            FormCard
                        </Link>
                        와 같은 카드이고, xl 이상의 좌우 안쪽 여백만 40으로 줄였습니다(FormCard 기본 102). 마이페이지
                        밖에서는 FormCard를 씁니다.
                    </p>
                </div>
                <MypageFormCard
                    title="대표자 이력"
                    subtitle="본 화면의 정보는 개인정보 수집·이용 동의에 따라 수집·관리되는 대표자 개인정보입니다."
                >
                    <p className="typo-body-l-regular text-label-foreground">여기에 폼 칸 묶음이 들어갑니다.</p>
                </MypageFormCard>
                <CodeBlock code={CARD_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="mypage-shell-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        메뉴 이름과 열고 닫기는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        메뉴는 &quot;마이페이지 메뉴&quot;라는 이름의 <code>nav</code>이고 지금 메뉴에{' '}
                        <code>aria-current=&quot;page&quot;</code>가 붙습니다[6.4.2].
                    </li>
                    <li>
                        접힌 목록은 Popover 라 Esc · 바깥 클릭으로 닫히고 닫힌 뒤 포커스가 트리거로 돌아갑니다. 항목을
                        누르면 닫힙니다[8.2.1][6.1.1].
                    </li>
                    <li>
                        접힌 목록의 트리거에는 현재 메뉴 라벨이 보이고 목록 열림 상태가 Popover 로 전달됩니다. 유형은
                        배지 글자(기업 · 기관)로도 표시됩니다[5.3.1].
                    </li>
                    <li>
                        사용처는 <code>PageTitleBar</code>로 <code>h1</code>을 두고 본문 <code>main</code>에{' '}
                        <code>id=&quot;main&quot;</code>를 줍니다[6.4.1][6.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-props" className="flex flex-col gap-6">
                <h2 id="mypage-shell-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="MypageSidebar · MypageFormCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MypageShellGuidePage
