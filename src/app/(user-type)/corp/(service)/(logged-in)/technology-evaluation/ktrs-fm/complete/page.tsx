import type {Metadata} from 'next'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BankTransferDialog} from '@/components/composite/bank-transfer-dialog'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {GuaranteeApplicationDialog} from '@/components/composite/guarantee-application-dialog'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {StepNavigation} from '@/components/composite/step-navigation'
import {ActionCheck} from '@/components/custom/action-check'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '제출 완료'}

// 시안(알려드려요)은 안내 문장 중 이동 경로만 본문(gray.500)보다 진한 foreground(gray.900)로 강조한다.
const ResultPath = () => <span className="text-foreground">마이페이지 &gt; 평가결과 조회</span>

// 신속표준모형 (5) 완료 화면 — Figma "[신속표준모형 KTRS-FM] 4단계_제출 완료".
// 흐름이 끝난 화면이라 진행 표시(StepHeader)가 없고, 완료 알림 · 안내 · 다음 행동만 남는다.
//
// 한 화면에 담는다 — 완료 화면은 읽고 다음 행동을 고르는 자리라, 버튼까지 스크롤 없이 보여야 한다
// (문의 완료 화면과 같은 방식). main 이 남은 높이를 채우고, 그 안의 간격·여백이 화면 높이에 비례해
// 함께 줄어든다. 세로 간격의 기준은 시안(1920×1080) — 타이틀 아래 100 · 완료 문구 아래 60 · 안내 아래 40.
// 다 줄여도 모자라면 그때는 평소대로 넘쳐 스크롤된다(잘리지 않는다).
const CorpKtrsFmCompletePage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex min-h-0 flex-1 flex-col">
        <div className="grid-layout min-h-0 flex-1 gap-0 pt-0 pb-[clamp(--spacing(6),3.5dvh,--spacing(15))] [--viewport-fit-decorative-size:clamp(var(--spacing-viewport-fit-decorative-min),14dvh,var(--spacing-action-check))] *:col-span-full [&>:not([aria-hidden])]:shrink-0">
            <div aria-hidden="true" className="h-[clamp(--spacing(2),3.7dvh,--spacing(10))]" />
            <PageTitleBar
                title="신속표준모형"
                badge={
                    <Badge variant="solid" color="info" shape="round">
                        KTRS-FM
                    </Badge>
                }
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>기술평가</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>KTRS-FM</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 시안(1080)의 100 은 9.26dvh 지만, 이 화면은 안내가 네 줄이라 그 비율로는 720 화면에서
                버튼이 잘린다. 한 화면에 담는 쪽을 택해 비율을 낮춘다(1080 에서 65 · 720 에서 43). */}
            <div aria-hidden="true" className="h-[clamp(--spacing(5),6dvh,--spacing(25))]" />

            {/* 완료 알림 — 완료 사실은 문구가 전달하므로 애니메이션은 장식으로 두고 접근성 트리에서 제외한다. */}
            <div className="flex flex-col items-center">
                <ActionCheck decorative />
                <h2 className="typo-h2-bold text-foreground text-center">KTRS-FM 기술평가가 완료되었어요.</h2>
            </div>

            <div aria-hidden="true" className="h-[clamp(--spacing(3),4dvh,--spacing(15))]" />

            <div className="flex flex-col gap-[clamp(--spacing(2),3.7dvh,--spacing(10))]">
                {/* 화면이 낮아지면 안내 상자의 위아래 여백부터 줄여 한 화면에 담는다. */}
                <InfoBox variant="outline" title="알려드려요" className="py-[clamp(--spacing(4),2.4dvh,--spacing(8))]">
                    <InfoBoxItem>
                        제출하신 기술평가 결과는 <ResultPath />
                        에서 확인할 수 있어요.
                    </InfoBoxItem>
                    <InfoBoxItem>
                        기술평가 결과발송은 <ResultPath />
                        에서 진행할 수 있어요.
                    </InfoBoxItem>
                    {/* 은행 전송·보증 신청은 이 자리에서 모달로 연다(각각 단독 화면도 있다 —
                        complete/bank-transfer · complete/guarantee-application). 전송·신청 API 는
                        각 모달의 onSubmit 에 붙인다. */}
                    <InfoBoxItem>
                        은행으로 평가결과를 전송하려면{' '}
                        <BankTransferDialog>
                            <Button type="button" variant="text-underline" size="md">
                                은행전송
                                <ChevronRight aria-hidden="true" />
                            </Button>
                        </BankTransferDialog>
                        을 선택하거나 <ResultPath />
                        에서 진행할 수 있어요.
                    </InfoBoxItem>
                    <InfoBoxItem>
                        기관으로 평가결과를 전송하려면{' '}
                        <GuaranteeApplicationDialog>
                            <Button type="button" variant="text-underline" size="md">
                                보증신청
                                <ChevronRight aria-hidden="true" />
                            </Button>
                        </GuaranteeApplicationDialog>
                        을 선택하거나 <ResultPath />
                        에서 진행할 수 있어요.
                    </InfoBoxItem>
                </InfoBox>

                {/* 결과조회 화면이 아직 없어 링크 없이 둔다 — 만들어지면 asChild + Link 로 잇는다. */}
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

export default CorpKtrsFmCompletePage
