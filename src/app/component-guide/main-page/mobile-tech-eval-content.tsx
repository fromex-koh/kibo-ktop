import Link from 'next/link'
import {ArrowUpRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {TECH_EVAL_SERVICES, TechEvalServiceVisual} from '@/components/custom/tech-eval-services'

// 모바일 2섹션은 자동 전환 없이 네 가지 서비스를 문서 순서대로 모두 펼쳐 읽는다.
const MobileTechEvalContent = () => (
    <div className="grid-layout w-full">
        <div className="col-span-4 flex min-w-0 flex-col">
            {TECH_EVAL_SERVICES.map((service, index) => (
                <article
                    key={service.title}
                    aria-labelledby={`mobile-tech-eval-title-${index}`}
                    className="border-border flex flex-col gap-6 border-b py-12 first:pt-0 last:border-b-0 last:pb-0"
                >
                    <div className="flex flex-col items-start gap-5">
                        <p className="text-main-accent text-lg leading-normal font-bold">{service.title}</p>
                        <h2
                            id={`mobile-tech-eval-title-${index}`}
                            className="text-foreground text-3xl leading-normal font-bold break-keep"
                        >
                            {service.headline}
                        </h2>
                        <Button
                            size="xl"
                            asChild
                            className="border-muted bg-muted text-foreground interactive:hover:bg-gray-200 interactive:active:bg-gray-50 text-base font-bold"
                        >
                            <Link href="#">
                                자가진단 시작하기
                                <ArrowUpRight aria-hidden="true" />
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
