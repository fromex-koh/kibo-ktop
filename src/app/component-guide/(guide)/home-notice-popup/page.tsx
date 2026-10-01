import type {Metadata} from 'next'
import Image from 'next/image'
import mockNoticeImageTall from '@public/images/home-notice/mock-notice-image-tall-9x16.webp'
import mockNoticeImageWide from '@public/images/home-notice/mock-notice-image-wide-16x9.webp'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
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
        '[오늘 하루 보지않기]를 눌렀을 때 부릅니다. 창은 스스로 닫히므로 오늘 숨김 기록만 합니다.',
        'undefined',
        '() => void',
    ],
    ['HomeNoticePopup', 'onClose', '창이 닫힌 뒤 부릅니다(두 버튼 · Esc 모두).', 'undefined', '() => void'],
] as const

const LAYOUT_ROWS = [
    ['모바일 (768 미만)', '1장', '328 × 416', '2건 이상'],
    ['태블릿 (768 이상)', '2장', '328 × 416', '3건'],
    ['PC (1280 이상)', '3장', '384 × 490', '나오지 않음'],
] as const

const HomeNoticePopupGuidePage = () => (
    <GuidePageShell
        title="홈 공지 팝업 (HomeNoticePopup)"
        description="메인 화면에 들어오면 어두운 막 위에 공지 카드를 띄우는 팝업입니다. 공지는 최대 3건이고, 화면 폭에 따라 한 번에 보이는 카드 수가 달라집니다."
    >
        <BaseCard>
            <section aria-labelledby="home-notice-popup-layout" className="flex flex-col gap-4">
                <div>
                    <h2 id="home-notice-popup-layout" className="typo-h4-bold">
                        화면 폭별 구성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        공지가 한 번에 보이는 카드 수보다 많을 때만 카드 아래에 조작 줄(번호 · 이전 · 재생/정지 ·
                        다음)이 나오고 한 장씩 순환합니다. 적으면 카드만 가운데에 모입니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">화면 폭별 카드 수 · 카드 크기 · 조작 줄 조건</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                {['화면 폭', '한 번에 보이는 카드', '카드 크기', '조작 줄이 나오는 공지 수'].map(
                                    (heading) => (
                                        <th key={heading} scope="col" className="typo-body-l-medium px-4 py-3">
                                            {heading}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {LAYOUT_ROWS.map(([viewport, ...cells]) => (
                                <tr key={viewport} className="border-border border-b last:border-b-0">
                                    <th scope="row" className="typo-body-l-medium text-foreground px-4 py-3">
                                        {viewport}
                                    </th>
                                    {cells.map((cell) => (
                                        <td key={cell} className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        카드 모양은 세 가지입니다 — 글만 · 그림(4:3)+글 · 그림만(3:4). 그림이 있고 본문이 비어 있으면
                        그림만 있는 카드가 됩니다.
                    </li>
                    <li>카드 높이는 내용과 무관하게 같습니다. 글이 넘치면 카드 안에서 스크롤됩니다.</li>
                    <li>
                        아래 케이스는 지금 창 폭 기준으로 열립니다. 창 폭을 바꿔 가며 같은 케이스를 다시 열어
                        확인합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="home-notice-popup-cases" className="typo-h4-bold">
                        케이스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        공지 건수와 카드 모양의 조합입니다. [열기]를 누르면 그 구성으로 팝업이 뜹니다.
                    </p>
                </div>
                <HomeNoticePopupCases group="basic" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-edge-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="home-notice-popup-edge-cases" className="typo-h4-bold">
                        엣지 케이스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        운영 중 들어올 수 있는 예외적인 값입니다. 어떤 값이 와도 카드 크기와 배치는 흐트러지지 않습니다.
                    </p>
                </div>
                <HomeNoticePopupCases group="edge" />

                {/* 비율 확인용 원본 — 팝업에서 잘린 모습과 견주어 볼 수 있게 자르지 않고 그대로 보여 준다. */}
                <div className="flex flex-col gap-3">
                    <h3 className="typo-body-xl-bold text-foreground">비율 확인용 그림의 원본</h3>
                    <p className="typo-body-l-regular text-muted-foreground break-keep">
                        &quot;비율이 맞지 않는 그림&quot; 케이스에 쓰는 그림입니다. 점선은 칸마다 보이는 범위, 빗금은
                        잘리는 범위입니다. 팝업을 열어 실제로 어디까지 남는지 견주어 봅니다.
                    </p>
                    <div className="flex flex-wrap items-start gap-6">
                        <figure className="flex w-full max-w-96 flex-col gap-2">
                            <Image
                                src={mockNoticeImageWide}
                                alt="가로로 긴 16:9 원본. 4:3 칸에서는 양 끝이, 3:4 칸에서는 가운데 범위만 남고 좌우가 잘립니다."
                                className="h-auto w-full"
                            />
                            <figcaption className="typo-body-l-regular text-muted-foreground">
                                가로로 긴 그림 (16:9 · 1280×720)
                            </figcaption>
                        </figure>
                        <figure className="flex w-full max-w-54 flex-col gap-2">
                            <Image
                                src={mockNoticeImageTall}
                                alt="세로로 긴 9:16 원본. 3:4 칸에서는 위아래 끝이, 4:3 칸에서는 가운데 범위만 남고 위아래가 잘립니다."
                                className="h-auto w-full"
                            />
                            <figcaption className="typo-body-l-regular text-muted-foreground">
                                세로로 긴 그림 (9:16 · 720×1280)
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="home-notice-popup-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        메인 화면 뒤에 한 번 둡니다. 렌더되면 바로 열립니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="ts" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-integration" className="flex flex-col gap-3">
                <h2 id="home-notice-popup-integration" className="typo-h4-bold">
                    프론트엔드 연동
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="font-mono">getHomeNotices()</code> 가 노출 중인 팝업 공지를{' '}
                        <code className="font-mono">HomeNotice</code> 모양으로 돌려주면 화면과 팝업은 고치지 않아도
                        됩니다. 노출 기간 · 게시 여부는 서버가 거른다고 봅니다.
                    </li>
                    <li>
                        [오늘 하루 보지않기]는 지금 창만 닫습니다. <code className="font-mono">onHideToday</code> 에서
                        오늘 숨김을 쿠키 · localStorage 에 기록하고, 다음 방문 때는 이 컴포넌트를 렌더하지 않습니다.
                        함수 prop 이라 서버 컴포넌트에서 직접 넘길 수 없으므로 클라이언트 컴포넌트로 한 번 감쌉니다.
                    </li>
                    <li>
                        그림은 4:3(본문과 함께) · 3:4(그림만) 비율로 받습니다. 서버 주소로 받으면{' '}
                        <code className="font-mono">image</code> 에 주소 문자열을 넣고{' '}
                        <code className="font-mono">next.config</code> 의{' '}
                        <code className="font-mono">images.remotePatterns</code> 에 그 호스트를 등록합니다.
                    </li>
                    <li>
                        목업 그림(<code className="font-mono">public/images/home-notice/mock-notice-image-*.webp</code>
                        )은 비율 확인용 예시입니다. 실제 서비스 그림이 아닙니다 — 4x3 · 3x4 는 칸에 맞는 비율, wide-16x9
                        · tall-9x16 은 잘리는 모습을 보이기 위한 그림입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-a11y" className="flex flex-col gap-3">
                <h2 id="home-notice-popup-a11y" className="typo-h4-bold">
                    동작과 접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        자동 넘김은 5초 간격입니다. 정지 버튼이 늘 보이고, 카드에 마우스를 올리거나 초점이 있으면
                        멈춥니다[6.2.2].
                    </li>
                    <li>OS 의 동작 줄이기가 켜져 있으면 정지 상태로 시작하고, 넘김 움직임도 생략합니다[6.3.1].</li>
                    <li>초점은 팝업 안에 갇히고 Esc 로 닫힙니다. 닫히면 열기 전 자리로 초점이 돌아갑니다[8.2.1].</li>
                    <li>글이 넘치는 카드는 Tab 으로 초점을 준 뒤 방향키로 스크롤할 수 있습니다[6.1.1].</li>
                    <li>
                        그림의 대체 텍스트는 제목입니다(백오피스에 따로 입력하는 칸이 없습니다). 제목이 그림 아래에
                        보이는 카드에서는 같은 말을 두 번 읽지 않도록 비우고, 그림만 있는 카드에서는 제목을 씁니다.
                        제목이 비어 있으면 &quot;공지 n 이미지&quot;를 대신 넣어 빈 채로 나가지 않게 합니다[5.1.1].
                    </li>
                    <li>
                        번호(1 / 3)는 직접 넘겼을 때만 읽어 줍니다. 저절로 넘어가는 동안에는 읽던 것을 끊지 않도록 읽지
                        않습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="home-notice-popup-props" className="flex flex-col gap-4">
                <h2 id="home-notice-popup-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="HomeNoticePopup Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HomeNoticePopupGuidePage
