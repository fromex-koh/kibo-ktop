import Link from 'next/link'
import {Button} from '@/components/ui/button'

// Header·Footer 없이 오류 상태 자체에 집중하는 userType별 전체 화면 404 표현.
const FullPageNotFound = () => (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6 py-16">
        <section
            className="max-w-content flex w-full flex-col items-center gap-6 text-center"
            aria-labelledby="not-found-title"
        >
            <p className="text-primary typo-display-xl-bold" aria-hidden="true">
                404
            </p>
            <div className="flex flex-col gap-3">
                <h1 id="not-found-title" className="typo-display-l-bold">
                    페이지를 찾을 수 없습니다.
                </h1>
                <p className="typo-body-xl-regular text-muted-foreground">
                    요청하신 페이지가 존재하지 않거나 주소가 변경되었을 수 있습니다.
                </p>
            </div>
            <Button asChild size="xl">
                <Link href="/">홈으로</Link>
            </Button>
        </section>
    </main>
)

export default FullPageNotFound
