import Image from 'next/image'
import Link from 'next/link'
import {ArrowUpRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import Reveal from './reveal'
import techEvalVisual from '../../../public/images/main-hero/tech-eval-visual.svg'

// 좌측 목차에서 현재 활성인 '기술평가' 뒤에 이어질 서비스들 — 이후 섹션이 추가되면 스크롤 진행에 맞춰 활성 전환 예정.
const UPCOMING_SERVICES = ['특허평가', 'K-BIGx 보고서', '탄소중립']

const EVAL_TAGS = ['기술력 진단', '기술등급', '성장 가능성', '기업평가', '보증·투자 연계']

// 두 번째 화면(기술평가 소개). md 이상에서 뷰포트에 고정된 히어로 위를 이 섹션이 덮으며 올라온다.
// 색상은 mainpage 스킨(다크 기반) 시맨틱 토큰 사용 — 활성 그린은 main-accent, 비활성 목차는
// muted-foreground(mainpage 값 gray.300 = 시안 #848b94), 버튼 표면은 muted(다크 반사 = 시안 #32363b).
const TechEvalSection = () => (
    <section
        aria-labelledby="tech-eval-title"
        className="bg-background relative flex min-h-dvh snap-start flex-col py-28 md:pt-50"
    >
        <div className="grid-layout w-full items-center gap-y-16">
            <div className="col-span-4 flex gap-10 md:col-span-4 xl:col-span-5">
                {/* 진행 인디케이터 — 전체 레일 중 활성(기술평가) 구간만 포인트 그린으로 채운다 */}
                <div aria-hidden="true" className="bg-foreground-subtle w-1 self-stretch">
                    <div className="bg-main-accent h-2/5 w-full" />
                </div>

                <div className="flex flex-col gap-30">
                    <Reveal className="flex flex-col items-start gap-4">
                        <p className="typo-title-l-bold text-main-accent">기술평가</p>
                        <h2 id="tech-eval-title" className="typo-display-xl-bold text-foreground break-keep">
                            기업이 보유한 기술의
                            <br />
                            가치를 증명하는 기술평가
                        </h2>
                        <div className="pt-2">
                            {/* 시안 버튼(#32363b)은 다크 스킨의 muted와 같은 값. hover/active는 다크 반사
                                팔레트로 한 단계씩 밝게/어둡게 조정한다(gray-200→raw 600, gray-50→raw 800). */}
                            <Button
                                size="xl"
                                asChild
                                className="border-muted bg-muted text-foreground text-lg font-bold not-disabled:hover:bg-gray-200 not-disabled:active:bg-gray-50"
                            >
                                <Link href="#">
                                    자가진단 시작하기
                                    <ArrowUpRight aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </Reveal>

                    <ul className="flex flex-col gap-6">
                        {UPCOMING_SERVICES.map((service) => (
                            <li key={service} className="typo-title-l-medium text-muted-foreground">
                                {service}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Reveal className="col-span-4 flex flex-col gap-5 motion-safe:delay-150 md:col-span-4 xl:col-span-6 xl:col-start-7">
                {/* 소개 비주얼 — 실이미지 확보 전 SVG 플레이스홀더. 장식 이미지라 alt는 비운다. [KWCAG 5.1.1] */}
                {/* 첫 휠에 바로 노출되는 화면이라 지연 로딩을 끈다(LCP 경고 방지) */}
                <Image
                    src={techEvalVisual}
                    alt=""
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-auto w-full rounded-2xl"
                />

                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-title-m-bold text-foreground">기술평가란?</h3>
                        <p className="typo-body-xl-regular text-foreground">
                            K-TOP 기술평가는 기술사업성 평가부터 혁신역량 진단, 투자 적합성 분석까지 3개 평가모형을 통합
                            제공합니다. 신청 목적에 맞는 모형을 선택하면 하나의 입력 절차로 평가가 진행됩니다.
                        </p>
                    </div>

                    <ul className="flex flex-wrap gap-2">
                        {EVAL_TAGS.map((tag) => (
                            <li
                                key={tag}
                                className="typo-body-l-medium border-foreground-subtle text-foreground rounded-sm border px-3 py-2"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                </div>
            </Reveal>
        </div>
    </section>
)

export default TechEvalSection
