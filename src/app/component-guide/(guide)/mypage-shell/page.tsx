import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {MypageFormCard} from '@/components/composite/mypage-form-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '마이페이지 셸 (MypageSidebar · MypageFormCard)'}

const LAYOUT_CODE = `<main id="main" tabIndex={-1} className="bg-background flex-1">
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

const CARD_CODE = `<MypageFormCard
  title="대표자 이력"
  subtitle="본 화면의 정보는 개인정보 수집·이용 동의에 따라 수집·관리되는 대표자 개인정보입니다."
>
  <FieldGrid>…</FieldGrid>
</MypageFormCard>`

const PROPS_ITEMS = [
    ['MypageSidebar', 'userType', '어느 쪽 마이페이지인지 — 메뉴 목록이 갈립니다.', '-', "'corp' | 'org'"],
    [
        'MypageSidebar',
        'current',
        '지금 보고 있는 화면의 메뉴 라벨입니다. 그 항목이 활성으로 표시됩니다.',
        '-',
        'string',
    ],
    ['MypageSidebar', 'companyName', '사이드바 위에 보이는 회원 이름입니다.', '-', 'ReactNode'],
    ['MypageFormCard', 'title', '카드 제목입니다.', '-', 'ReactNode'],
    ['MypageFormCard', 'subtitle', '제목 아래 설명입니다.', 'undefined', 'ReactNode'],
    ['MypageFormCard', 'children', '카드 본문(폼 칸 묶음)입니다.', '-', 'ReactNode'],
] as const

const MypageShellGuidePage = () => (
    <GuidePageShell
        title="마이페이지 셸 (MypageSidebar · MypageFormCard)"
        description="마이페이지의 모든 화면이 공유하는 좌측 메뉴와 본문 카드입니다. 화면은 어느 쪽(기업·기관)인지와 지금 보고 있는 메뉴만 알려 주고, 메뉴 목록과 배치는 여기 한 벌만 둡니다."
    >
        <BaseCard>
            <section aria-labelledby="mypage-shell-layout" className="flex flex-col gap-4">
                <div>
                    <h2 id="mypage-shell-layout" className="typo-h4-bold">
                        화면 배치
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        사이드바 344 · 간격 64 · 본문 792(합 1200)입니다. 카드·항목 스타일은 공통{' '}
                        <code className="font-mono">StickySidebar</code> 가 갖습니다.
                    </p>
                </div>
                <CodeBlock code={LAYOUT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-responsive" className="flex flex-col gap-3">
                <h2 id="mypage-shell-responsive" className="typo-h4-bold">
                    폭에 따른 세 가지 모습
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    메뉴 여섯 칸이 세로로 서 있으면 좁은 화면에서 사이드바가 본문보다 길어집니다. 그래서 기업·기술정보
                    입력의 탭과 같은 방식으로 좁아질수록 접습니다.
                </p>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <strong className="text-foreground">xl 이상</strong> — 본문 옆에 붙어 따라오는 사이드바 카드
                    </li>
                    <li>
                        <strong className="text-foreground">md~xl</strong> — 콘텐츠 열 안의 카드. 지금 메뉴 한 줄만 두고
                        누르면 아래로 목록이 열립니다(고정하지 않음)
                    </li>
                    <li>
                        <strong className="text-foreground">md 미만</strong> — 같은 줄을 화면 폭으로 넓혀 헤더 아래에
                        고정
                    </li>
                </ul>
                <p className="typo-body-l-regular text-muted-foreground">
                    목록은 화면을 덮는 모달이 아니라 눌린 줄에 붙는 드롭다운입니다 — 열고 닫기·Esc·바깥 클릭·포커스
                    복귀는 Popover(Radix)가 맡습니다[8.2.1].
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-card" className="flex flex-col gap-4">
                <div>
                    <h2 id="mypage-shell-card" className="typo-h4-bold">
                        MypageFormCard
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        마이페이지 본문의 폼 카드입니다. 제목·설명 자리를 카드가 갖고 본문에는 폼 칸만 넣습니다.
                    </p>
                </div>
                <MypageFormCard
                    title="대표자 이력"
                    subtitle="본 화면의 정보는 개인정보 수집·이용 동의에 따라 수집·관리되는 대표자 개인정보입니다."
                >
                    <p className="typo-body-l-regular text-muted-foreground">여기에 폼 칸 묶음이 들어갑니다.</p>
                </MypageFormCard>
                <CodeBlock code={CARD_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-menu" className="flex flex-col gap-3">
                <h2 id="mypage-shell-menu" className="typo-h4-bold">
                    메뉴 목록
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        아이콘은 컴포넌트(함수)라 서버에서 클라이언트로 넘길 수 없습니다. 그래서 목록을 화면이 아니라
                        컴포넌트 파일에 두고, 화면은 <code className="font-mono">userType</code> 만 알려 줍니다.
                    </li>
                    <li>
                        아직 만들지 않은 화면은 경로를 <code className="font-mono">&apos;#&apos;</code> 으로 둡니다 —
                        경로가 타입으로 검사되어 없는 주소를 미리 적어 둘 수 없습니다. 그 화면이 생기면 그 경로로
                        바꿉니다.
                    </li>
                    <li>기관 [내 정보] 는 회원 유형별로 화면이 나뉩니다 — 실제로는 로그인한 유형의 화면으로 갑니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mypage-shell-props" className="flex flex-col gap-4">
                <h2 id="mypage-shell-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="마이페이지 셸 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MypageShellGuidePage
