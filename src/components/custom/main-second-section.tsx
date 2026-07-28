import {stackPageClassName} from '@/components/theme/stack-pager.variants'
import {cn} from '@/lib/utils'

const MainSecondSection = () => (
    <section
        id="service-intro"
        tabIndex={-1}
        data-stack-page
        aria-labelledby="service-intro-title"
        className={cn(
            stackPageClassName,
            'bg-background pager-off:snap-start relative flex min-h-dvh flex-col py-28 md:h-dvh md:min-h-0 md:overflow-hidden md:pt-50',
        )}
    >
        <div className="grid-layout content-layout w-full">
            <h2 id="service-intro-title" className="typo-h1-bold text-foreground col-span-full">
                2섹션
            </h2>
        </div>
    </section>
)

export default MainSecondSection
