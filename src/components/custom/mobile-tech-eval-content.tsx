import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
    TECH_EVAL_CTA_FILL_CLASS,
    TechEvalServiceVisual,
    buildTechEvalServices,
} from '@/components/custom/tech-eval-services'
import {cn} from '@/lib/utils'

// 모바일 2섹션은 자동 전환 없이 네 가지 서비스를 문서 순서대로 모두 펼쳐 읽는다.
// [기술평가] 시작하기 CTA 가 갈 곳은 PC 배치와 같이 사용처가 정한다.
const MobileTechEvalContent = ({technologyEvaluationHref}: {technologyEvaluationHref: string}) => (
    <div className="grid-layout w-full">
        <div className="col-span-4 flex min-w-0 flex-col">
            {buildTechEvalServices(technologyEvaluationHref).map((service, index) => (
                <article
                    key={service.title}
                    aria-labelledby={`mobile-tech-eval-title-${index}`}
                    className="border-border flex flex-col gap-6 border-b py-12 first:pt-0 last:border-b-0 last:pb-0"
                >
                    <div className="flex flex-col items-start gap-5">
                        {/* 서비스 이름은 아래 제목의 머리말이라 제목 안에 둔다 — 밖에 굵은 문단으로 두면
                            제목처럼 보이는데 제목이 아닌 글이 되어 WAVE 가 "Possible heading" 으로 잡는다[6.4.2]. */}
                        <h2
                            id={`mobile-tech-eval-title-${index}`}
                            className="text-foreground flex flex-col items-start gap-5"
                        >
                            <span className="text-main-accent block text-lg leading-normal font-bold">
                                {service.title}
                            </span>
                            <span className="block text-3xl leading-normal font-bold break-keep">
                                {service.headline}
                            </span>
                        </h2>
                        {/* aria-label — 보이는 문구가 "시작하기" 뿐이라 링크만 훑을 때 무엇을 시작하는지
                            알 수 없다. 서비스명을 붙여 목적을 드러낸다. [KWCAG 6.4.3] */}
                        <Button size="lg" asChild className={cn(TECH_EVAL_CTA_FILL_CLASS, 'text-base')}>
                            <Link href={service.ctaHref} aria-label={`${service.title} 시작하기`}>
                                시작하기
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-5">
                        <TechEvalServiceVisual service={service} />
                    </div>
                </article>
            ))}
        </div>
    </div>
)

export default MobileTechEvalContent
