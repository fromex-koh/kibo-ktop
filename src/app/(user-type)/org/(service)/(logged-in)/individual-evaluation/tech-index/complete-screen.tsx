import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {StepNavigation} from '@/components/composite/step-navigation'
import {Badge} from '@/components/ui/badge'
import {ActionCheck} from '@/components/custom/action-check'
import {TECH_INDEX_MODEL_META, type TechIndexModel} from './model-meta'

// 안내 문장 중 이동 화면 이름만 본문(gray.500)보다 진한 foreground(gray.900)로 강조한다(다른 완료 화면과 동일).
const ProgressPath = () => <span className="text-foreground">&apos;진행현황&apos;</span>

// 기관 개별평가 Tech-Index (5) 완료 화면 — 기업 Tech-Index 완료 화면과 같은 구성이다(완료 알림 · 안내 · 다음 행동).
// 기관 시안이 나오면 이 화면부터 조정한다 — 지금은 기업 화면을 그대로 옮기고 제목·브레드크럼을 기관 IA 로 바꿨다.
// 안내의 이동 경로는 기관 마이페이지 메뉴명(평가이력 조회)을 쓴다.
//
// 한 화면에 담는다 — 완료 화면은 읽고 다음 행동을 고르는 자리라, 버튼까지 스크롤 없이 보여야 한다.
// main 이 남은 높이를 채우고, 그 안의 간격·여백이 화면 높이에 비례해 함께 줄어든다.
// 다 줄여도 모자라면 그때는 평소대로 넘쳐 스크롤된다(잘리지 않는다).
const TechIndexCompleteScreen = ({model}: {model: TechIndexModel}) => (
    <main id="main" tabIndex={-1} className="bg-background flex min-h-0 flex-1 flex-col">
        <div className="grid-layout min-h-0 flex-1 gap-0 pt-0 pb-[clamp(--spacing(6),3.5dvh,--spacing(15))] [--viewport-fit-decorative-size:clamp(var(--spacing-viewport-fit-decorative-min),14dvh,var(--spacing-action-check))] *:col-span-full [&>:not([aria-hidden])]:shrink-0">
            <div aria-hidden="true" className="h-[clamp(--spacing(2),3.7dvh,--spacing(10))]" />
            <PageTitleBar
                title={TECH_INDEX_MODEL_META[model].title}
                badge={
                    <Badge variant="solid" color="info" shape="round">
                        Tech-Index
                    </Badge>
                }
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>개별평가</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tech-Index</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 안내가 두 줄이라 시안(1080)의 100 = 9.26dvh 를 그대로 써도 낮은 화면(720)에서 버튼까지 들어간다. */}
            <div aria-hidden="true" className="h-[clamp(--spacing(6),9.26dvh,--spacing(25))]" />

            {/* 완료 알림 — 완료 사실은 문구가 전달하므로 애니메이션은 장식으로 두고 접근성 트리에서 제외한다. */}
            <div className="flex flex-col items-center">
                <ActionCheck decorative />
                {/* 완료 문구는 라우트의 모형(일반/창업)을 표시한다 — 큰 타이틀과 같은 기준이다. */}
                <h2 className="typo-h2-bold text-foreground text-center break-keep">
                    {TECH_INDEX_MODEL_META[model].completeMessage}
                </h2>
            </div>

            <div aria-hidden="true" className="h-[clamp(--spacing(3),4dvh,--spacing(15))]" />

            <div className="flex flex-col gap-[clamp(--spacing(2),3.7dvh,--spacing(10))]">
                {/* 화면이 낮아지면 안내 상자의 위아래 여백부터 줄여 한 화면에 담는다. */}
                <InfoBox variant="outline" title="알려드려요" className="py-[clamp(--spacing(4),2.4dvh,--spacing(8))]">
                    <InfoBoxItem>
                        제출하신 개별평가 결과는 <ProgressPath /> 화면에서 확인하실 수 있습니다.
                    </InfoBoxItem>
                    <InfoBoxItem>
                        평가 진행 중 추가 자료 요청이 있을 수 있으며, 등록하신 연락처로 안내드립니다.
                    </InfoBoxItem>
                </InfoBox>

                {/* 결과조회 화면이 아직 없어 링크 없이 둔다 — 만들어지면 asChild + Link 로 잇는다.
                    [메인으로 이동] 은 플랫폼 메인(/)이다 — 브레드크럼의 [홈](기관 홈, /org/home)과 가는 곳이
                    다르다. 둘을 같은 주소로 두면 같은 목적지 링크가 화면에 둘이 되어(WAVE "Redundant link")
                    스크린리더로 링크만 훑을 때 같은 곳이 두 번 읽힌다. */}
                <StepNavigation
                    appearance="plain"
                    className="[&>div]:max-w-none [&>div]:px-0 [&>div]:py-0"
                    prev={{asChild: true, children: <Link href="/">메인으로 이동</Link>}}
                    next={{children: '결과조회'}}
                />
            </div>
        </div>
    </main>
)

export {TechIndexCompleteScreen}
