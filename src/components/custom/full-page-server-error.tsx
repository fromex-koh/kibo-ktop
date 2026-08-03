import Link from 'next/link'
import {Button} from '@/components/ui/button'

// Header·Footer 없이 오류 상태 자체에 집중하는 전체 화면 500 에러 표현.
const FullPageServerError = () => (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6 py-16">
        <section
            className="max-w-content flex w-full flex-col items-center gap-6 text-center"
            aria-labelledby="server-error-title"
        >
            <p className="text-primary typo-display-xl-bold" aria-hidden="true">
                500
            </p>
            <div className="flex flex-col gap-3">
                <h1 id="server-error-title" className="typo-display-l-bold">
                    일시적인 오류가 발생했습니다.
                </h1>
                <p className="typo-body-xl-regular text-muted-foreground">
                    서비스 이용에 불편을 드려 죄송합니다. 잠시 후 다시 이용해 주세요.
                </p>
            </div>
            <Button asChild size="xl">
                <Link href="/">홈으로</Link>
            </Button>
        </section>
    </main>
)

export default FullPageServerError
