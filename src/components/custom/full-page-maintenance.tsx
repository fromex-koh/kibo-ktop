import Link from 'next/link'
import {Button} from '@/components/ui/button'

// Header·Footer 없이 점검 안내에 집중하는 전체 화면 정기점검 표현.
const FullPageMaintenance = () => (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6 py-16">
        <section
            className="max-w-content flex w-full flex-col items-center gap-6 text-center"
            aria-labelledby="maintenance-title"
        >
            <p className="text-primary typo-display-xl-bold" aria-hidden="true">
                점검 중
            </p>
            <div className="flex flex-col gap-3">
                <h1 id="maintenance-title" className="typo-display-l-bold">
                    서비스 점검 중입니다.
                </h1>
                <p className="typo-body-xl-regular text-muted-foreground">
                    더 나은 서비스 제공을 위해 정기점검을 진행하고 있습니다. 잠시 후 다시 이용해 주세요.
                </p>
            </div>
            <Button asChild size="xl">
                <Link href="/">홈으로</Link>
            </Button>
        </section>
    </main>
)

export default FullPageMaintenance
