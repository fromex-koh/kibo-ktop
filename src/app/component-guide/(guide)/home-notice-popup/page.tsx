// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Image from 'next/image'
import mockNoticeImageTall from '@public/images/home-notice/mock-notice-image-tall-9x16.webp'
import mockNoticeImageWide from '@public/images/home-notice/mock-notice-image-wide-16x9.webp'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import HomeNoticePopupCases from './home-notice-popup-cases'

export const metadata: Metadata = {title: '홈 공지 팝업 (HomeNoticePopup)'}

const USAGE_CODE = `// page.tsx (서버 컴포넌트)
const notices = await getHomeNotices()

return (
  <>
    <MainPageScreen ... />
    <HomeNoticePopup items={notices} />
  </>
)`

const DATA_CODE = `// content/service/home-notices.ts
type HomeNotice = {
  id: string
  title?: string                     // 그림만 있는 공지에서는 그림의 대체 텍스트로 쓰인다
  body?: string                      // 줄바꿈(\\n)은 그대로 줄을 나눈다
  image?: StaticImageData | string
}

// 글만
{id: 'notice-001', title: '시스템 정기 점검 안내', body: '...'}
// 그림(4:3) + 글
{id: 'notice-002', title: '...', body: '...', image}
// 그림만(3:4) — body 를 비운다. title 은 보이지 않고 대체 텍스트가 된다
{id: 'notice-003', title: '자가진단 서비스 안내 — ...', image}`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const H3_CLASS = 'typo-title-m-bold text-foreground'
const DESC_CLASS = 'typo-body-l-regular text-label-foreground'
const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'

const LAYOUT_COLUMNS = [
    {key: 'viewport', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'perView', header: '한 번에 보이는 카드', align: 'start'},
    {key: 'size', header: '카드 크기', align: 'start'},
    {key: 'controls', header: '조작 줄이 나오는 공지 수', align: 'start'},
] as const

const LAYOUT_ROWS = [
    {key: 'mobile', cells: ['모바일 (768 미만)', '1장', '328 × 416', '2건 이상']},
    {key: 'tablet', cells: ['태블릿 (768 이상)', '2장', '328 × 416', '3건']},
    {key: 'pc', cells: ['PC (1280 이상)', '3장', '384 × 490', '나오지 않음']},
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'home-notice-popup',
        cells: [
            '메인 진입 시 공지 최대 3건을 카드로 띄움',
            <code key="c">HomeNoticePopup</code>,
            '막 위에 카드 여러 장이 뜨고 [오늘 하루 보지않기] · [닫기]를 둡니다. 렌더되면 바로 열립니다.',
        ],
    },
    {
        key: 'dialog',
        cells: [
            '사용자의 선택·입력을 받는 모달',
            <Link key="c" href="/component-guide/dialog" className={LINK_CLASS}>
                Dialog
            </Link>,
            '흰 카드 한 장에 머리 · 본문 · CTA 구조입니다. 이 팝업은 같은 Radix Dialog 를 쓰되 카드 레이아웃이 달라 셸의 DialogContent 를 쓰지 않습니다.',
        ],
    },
    {
        key: 'toast',
        cells: [
            '짧은 결과를 흐름 끊지 않고 알림',
            <Link key="c" href="/component-guide/toast" className={LINK_CLASS}>
                Toast
            </Link>,
            '자동으로 사라지는 한 줄 안내입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'HomeNoticePopup',
        'items',
        '보여 줄 공지입니다. 최대 3건이며 더 넘겨도 앞 3건만 씁니다. 빈 배열이면 팝업을 그리지 않습니다.',
        '-',
        'readonly HomeNotice[]',
    ],
    [
        'HomeNoticePopup',
        'onHideToday',
        '[오늘 하루 보지않기]를 눌렀을 때 호출됩니다. 창은 스스로 닫히므로 오늘 숨김 기록만 합니다.',
        'undefined',
        '() => void',
    ],
    ['HomeNoticePopup', 'onClose', '창이 닫힌 뒤 호출됩니다(두 버튼 · Esc 모두).', 'undefined', '() => void'],
    ['HomeNotice', 'id', '공지 식별자입니다. 한 팝업 안에서 겹치면 안 됩니다.', '-', 'string'],
    [
        'HomeNotice',
        'title',
        '제목입니다. 그림만 있는 공지에서는 보이지 않고 그림의 대체 텍스트가 됩니다. 비면 "공지 n 이미지"가 들어갑니다.',
        'undefined',
        'string',
    ],
    [
        'HomeNotice',
        'body',
        '본문입니다. 줄바꿈(\\n)은 그대로 줄을 나눕니다. 비우면 그림만 있는 카드가 됩니다.',
        'undefined',
        'string',
    ],
    [
        'HomeNotice',
        'image',
        '그림입니다. 본문과 함께면 4:3, 없으면 3:4 로 잘려 보입니다.',
        'undefined',
        'StaticImageData | string',
    ],
] as const

const SectionHead = ({id, title, description}: {id: string; title: string; description: string}) => (
    <div className="flex max-w-4xl flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        <p className="typo-body-l-regular text-label-foreground">{description}</p>
    </div>
)

const HomeNoticePopupGuidePage = () => (
    <GuidePageShell
        title="홈 공지 팝업 (HomeNoticePopup)"
        description="메인 화면에 들어오면 어두운 막 위에 공지 카드를 띄우는 팝업입니다. 공지는 최대 3건이고, 화면 폭에 따라 한 번에 보이는 카드 수가 달라집니다."
    >
        <BaseCard>
            <section aria-labelledby="home-notice-popup-basic" className="flex flex-col gap-6">
                <SectionHead
                    id="home-notice-popup-basic"
                    title="기본 사용"
                    description="메인 화면 뒤에 한 번 둡니다. 렌더되면 바로 열립니다."
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="ts" copyLabel="복사" />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>화면 폭별 구성</h3>
                        <p className={DESC_CLASS}>
                            공지가 한 번에 보이는 카드 수보다 많을 때만 조작 줄(번호 · 이전 · 재생/정지 · 다음)이 나오고
                            한 장씩 순환합니다. 적으면 카드만 가운데에 모입니다.
                        </p>
                        <Table
                            caption="화면 폭별 카드 수 · 카드 크기 · 조작 줄 조건"
                            columns={LAYOUT_COLUMNS}
                            rows={LAYOUT_ROWS}
                            size="md"
                        />
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                카드 모양은 글만 · 그림(4:3)+글 · 그림만(3:4) 세 가지이며, 그림이 있고 본문이 비어
                                있으면 그림만 있는 카드가 됩니다.
                            </li>
                            <li>카드 높이는 내용과 무관하게 같고, 글이 넘치면 카드 안에서 스크롤됩니다.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-cases" className="flex flex-col gap-6">
                <SectionHead
                    id="home-notice-popup-cases"
                    title="케이스 예시"
                    description="[열기]를 누르면 그 구성으로 팝업이 뜹니다. 현재 창 폭 기준이므로 폭을 바꿔 가며 다시 열어 확인합니다."
                />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>공지 건수와 카드 모양</h3>
                        <HomeNoticePopupCases group="basic" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>엣지 케이스</h3>
                        <p className={DESC_CLASS}>
                            운영 중 들어올 수 있는 예외 값입니다. 어떤 값이 와도 카드 크기와 배치는 흐트러지지 않습니다.
                        </p>
                        <HomeNoticePopupCases group="edge" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>비율 확인용 그림 원본</h3>
                        <p className={DESC_CLASS}>
                            &quot;비율이 맞지 않는 그림&quot; 케이스에 쓰는 그림입니다. 점선은 칸마다 보이는 범위,
                            빗금은 잘리는 범위입니다. 실제 서비스 그림이 아닌 목업입니다.
                        </p>
                        <div className="flex flex-wrap items-start gap-6">
                            <figure className="flex w-full max-w-96 flex-col gap-2">
                                <Image
                                    src={mockNoticeImageWide}
                                    alt="가로로 긴 16:9 원본. 4:3 칸에서는 양 끝이, 3:4 칸에서는 가운데 범위만 남고 좌우가 잘립니다."
                                    className="h-auto w-full"
                                />
                                <figcaption className={DESC_CLASS}>가로로 긴 그림 (16:9)</figcaption>
                            </figure>
                            <figure className="flex w-full max-w-54 flex-col gap-2">
                                <Image
                                    src={mockNoticeImageTall}
                                    alt="세로로 긴 9:16 원본. 3:4 칸에서는 위아래 끝이, 4:3 칸에서는 가운데 범위만 남고 위아래가 잘립니다."
                                    className="h-auto w-full"
                                />
                                <figcaption className={DESC_CLASS}>세로로 긴 그림 (9:16)</figcaption>
                            </figure>
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-integration" className="flex flex-col gap-6">
                <SectionHead
                    id="home-notice-popup-integration"
                    title="프론트엔드 연동"
                    description="공지 조회와 숨김 기록은 사용처가 맡습니다."
                />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>getHomeNotices()</code> 가 노출 중인 공지를 <code>HomeNotice</code> 모양으로 돌려주면
                        화면과 팝업은 고치지 않아도 됩니다. 노출 기간 · 게시 여부는 서버가 거릅니다.
                    </li>
                    <li>
                        [오늘 하루 보지않기]는 지금 창만 닫습니다. <code>onHideToday</code> 에서 오늘 숨김을 쿠키 ·
                        localStorage 에 기록하고 다음 방문에는 이 컴포넌트를 렌더하지 않습니다. 함수 prop 이라 서버
                        컴포넌트에서 직접 넘길 수 없으므로 클라이언트 컴포넌트로 한 번 감쌉니다.
                    </li>
                    <li>
                        서버 주소 그림은 <code>image</code> 에 문자열로 넣고 <code>next.config</code> 의{' '}
                        <code>images.remotePatterns</code> 에 호스트를 등록합니다. 비율이 다르면 가운데 기준으로
                        잘립니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-choice" className="flex flex-col gap-6">
                <SectionHead
                    id="home-notice-popup-choice"
                    title="컴포넌트 선택"
                    description="같은 오버레이 계열과 혼동되지 않도록 용도로 구분합니다."
                />
                <Table
                    caption="HomeNoticePopup · Dialog · Toast 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-a11y" className="flex flex-col gap-6">
                <SectionHead
                    id="home-notice-popup-a11y"
                    title="접근성"
                    description="포커스 가둠 · Esc · 스크롤 잠금은 Radix Dialog 가 처리하고, 컴포넌트는 자동 넘김과 대체 텍스트를 책임집니다."
                />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        초점은 팝업 안에 갇히고 Esc 로 닫히며, 닫히면 열기 전 자리로 돌아갑니다[8.2.1]. 제목
                        &quot;공지사항&quot;은 <code>sr-only</code> 로 대화상자 이름이 됩니다.
                    </li>
                    <li>
                        자동 넘김은 5초 간격입니다. 정지 버튼이 늘 보이고 카드에 마우스를 올리거나 초점이 있으면
                        멈춥니다[6.2.2].
                    </li>
                    <li>OS 의 동작 줄이기가 켜져 있으면 정지 상태로 시작하고 넘김 움직임도 생략합니다[6.3.1].</li>
                    <li>글이 넘치는 카드는 Tab 으로 초점을 준 뒤 방향키로 스크롤할 수 있습니다[6.1.1].</li>
                    <li>
                        그림 대체 텍스트는 제목입니다. 제목이 그림 아래에 보이는 카드는 중복 낭독을 피하려 비우고,
                        그림만 있는 카드는 제목을 씁니다. 제목이 없으면 &quot;공지 n 이미지&quot;를 넣습니다[5.1.1].
                    </li>
                    <li>번호(1 / 3)는 직접 넘겼을 때만 읽어 줍니다. 저절로 넘어가는 동안에는 읽지 않습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-props" className="flex flex-col gap-6">
                <SectionHead
                    id="home-notice-popup-props"
                    title="Props API"
                    description="팝업 속성과 공지 데이터(HomeNotice) 필드입니다."
                />
                <PropsTable items={PROPS_ITEMS} caption="HomeNoticePopup Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HomeNoticePopupGuidePage
