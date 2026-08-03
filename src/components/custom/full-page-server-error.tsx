import Image from 'next/image'
import Link from 'next/link'
import serverErrorIllustration from '@public/images/service-status/service-status-illustration.webp'
import {Button} from '@/components/ui/button'

// Header·Footer를 포함하지 않는 공통 전체 화면 500 UI.
// /corp/server-error와 /org/server-error 미리보기에서 재사용하며, 실제 오류 처리로 전환할 때 각 라우트의 error.tsx에서 렌더링한다.
const FullPageServerError = () => (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6 py-16">
        <section
            className="max-w-content flex w-full flex-col items-center gap-10 text-center md:gap-15"
            aria-labelledby="server-error-title"
        >
            <div className="flex flex-col items-center gap-6 md:gap-10">
                {/* 제목과 의미가 중복되는 장식용 이미지는 alt를 비워 보조기기가 중복해서 읽지 않게 한다. */}
                <Image src={serverErrorIllustration} alt="" priority sizes="320px" className="h-auto w-full max-w-80" />
                <div className="flex flex-col items-center gap-2">
                    {/* 한글 제목이 좁은 화면에서 어절 중간에 끊기지 않도록 한다. */}
                    <h1 id="server-error-title" className="typo-h1-bold text-balance break-keep">
                        잠시 후 다시 확인해 주세요.
                    </h1>
                    {/* 시안이 세 문장을 각각 한 줄로 나눠 두었다. 각 줄은 좁은 화면에서만 안쪽에서 다시 줄바꿈한다. */}
                    <p className="typo-title-m-regular text-foreground-subtle max-w-198 break-keep">
                        <span className="block">지금 이 서비스와 연결할 수 없습니다.</span>
                        <span className="block">문제를 해결하기 위해 열심히 노력을 하고 있습니다.</span>
                        <span className="block">잠시 후 다시 확인해 주세요.</span>
                    </p>
                </div>
            </div>
            <Button asChild variant="tertiary" size="xl">
                <Link href="/">홈으로</Link>
            </Button>
        </section>
    </main>
)

export default FullPageServerError
