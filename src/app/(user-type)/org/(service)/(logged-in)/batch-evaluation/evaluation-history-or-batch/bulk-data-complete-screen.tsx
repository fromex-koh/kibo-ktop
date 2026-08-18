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
import {ActionCheck} from '@/components/custom/action-check'
import {BATCH_MODEL_META, type BatchEvaluationModel} from './batch-model-meta'
import {Badge} from '@/components/ui/badge'

// 시안 "알려드려요" 안내 문구.
// [프론트엔드 연동] 첫 문장의 [평균값 적용]은 1단계에서 고른 "값이 없는 항목 노출 방식"이다 —
// 신청 결과를 받아 그 값으로 바꾼다. 지금은 시안 문구를 그대로 둔다.
const NOTICES = [
    '값이 없는 항목 노출 방식은 [평균값 적용]으로 신청되었습니다. 값이 없는 항목은 대량정보의 평균값으로 노출됩니다.',
    '신청하신 대량정보 조회는 접수 후 내부 검토 절차를 거쳐 진행됩니다.',
    "조회 결과는 '대량정보 조회' 화면에서 확인하실 수 있습니다.",
    '추가 자료 요청이 있을 경우, 담당자가 별도 연락을 드릴 예정입니다.',
] as const

// 기관 일괄평가 (4) 대량정보 조회 신청 완료 — Figma "[일괄평가] 3단계_대량정보 조회 신청 완료".
// 구성은 다른 완료 화면과 같다(완료 알림 · 안내 · 다음 행동) — 화면마다 다른 것은 문구와 경로뿐이다.
//
// 한 화면에 담는다 — 완료 화면은 읽고 다음 행동을 고르는 자리라, 버튼까지 스크롤 없이 보여야 한다.
// main 이 남은 높이를 채우고, 그 안의 간격·여백이 화면 높이에 비례해 함께 줄어든다. 세로 간격의 기준은
// 시안(1920×1080)이다. 다 줄여도 모자라면 그때는 평소대로 넘쳐 스크롤된다(잘리지 않는다).
const BulkDataCompleteScreen = ({model}: {model: BatchEvaluationModel}) => (
    <main id="main" tabIndex={-1} className="bg-background flex min-h-0 flex-1 flex-col">
        <div className="grid-layout min-h-0 flex-1 gap-0 pt-0 pb-[clamp(--spacing(6),3.5dvh,--spacing(15))] [--viewport-fit-decorative-size:clamp(var(--spacing-viewport-fit-decorative-min),14dvh,var(--spacing-action-check))] *:col-span-full [&>:not([aria-hidden])]:shrink-0">
            <div aria-hidden="true" className="h-[clamp(--spacing(2),3.7dvh,--spacing(10))]" />
            <PageTitleBar
                title={BATCH_MODEL_META[model].title}
                badge={
                    <Badge variant="solid" color="info" shape="round">
                        대량정보 조회
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
                                <span>일괄평가</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>평가내역조회</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 안내가 네 줄이라 시안(1080)의 비율 그대로는 720 화면에서 버튼이 잘린다 —
                한 화면에 담는 쪽을 택해 비율을 낮춘다(다른 완료 화면과 같은 값). */}
            <div aria-hidden="true" className="h-[clamp(--spacing(5),6dvh,--spacing(25))]" />

            {/* 완료 알림 — 완료 사실은 문구가 전달하므로 애니메이션은 장식으로 두고 접근성 트리에서 제외한다. */}
            <div className="flex flex-col items-center">
                <ActionCheck decorative />
                <h2 className="typo-h2-bold text-foreground text-center break-keep">
                    평가내역조회 - 혁신성장지수 평가 Tech-Index 신청이 완료되었습니다.
                </h2>
            </div>

            <div aria-hidden="true" className="h-[clamp(--spacing(3),4dvh,--spacing(15))]" />

            <div className="flex flex-col gap-[clamp(--spacing(2),3.7dvh,--spacing(10))]">
                {/* 화면이 낮아지면 안내 상자의 위아래 여백부터 줄여 한 화면에 담는다. */}
                <InfoBox variant="outline" title="알려드려요" className="py-[clamp(--spacing(4),2.4dvh,--spacing(8))]">
                    {NOTICES.map((notice) => (
                        <InfoBoxItem key={notice}>{notice}</InfoBoxItem>
                    ))}
                </InfoBox>

                {/* [결과조회]가 갈 '대량정보 조회' 화면이 아직 없어 링크 없이 둔다 — 만들어지면 asChild + Link 로 잇는다.
                    [메인으로 이동]은 플랫폼 메인(/)이다 — 브레드크럼의 [홈](기관 홈, /org/home)과 가는 곳이 다르다.
                    둘을 같은 주소로 두면 같은 목적지 링크가 화면에 둘이 되어(WAVE "Redundant link") 스크린리더로
                    링크만 훑을 때 같은 곳이 두 번 읽힌다. */}
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

export {BulkDataCompleteScreen}
