import Image from 'next/image'
import Link from 'next/link'
import notFoundIllustration from '@public/images/service-status/service-status-illustration.webp'
import {Button} from '@/components/ui/button'

// Header·Footer를 포함하지 않는 공통 전체 화면 404 UI.
// /corp/not-found와 /org/not-found 미리보기에서 재사용하며, 실제 fallback 전환 시 각 라우트의 not-found.tsx에서 렌더링한다.
const FullPageNotFound = () => (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6 py-16">
        <section
            className="max-w-content flex w-full flex-col items-center gap-10 text-center md:gap-15"
            aria-labelledby="not-found-title"
        >
            <div className="flex flex-col items-center gap-6 md:gap-10">
                {/* 제목과 의미가 중복되는 장식용 이미지는 alt를 비워 보조기기가 중복해서 읽지 않게 한다. */}
                <Image src={notFoundIllustration} alt="" priority sizes="320px" className="h-auto w-full max-w-80" />
                <div className="flex flex-col items-center gap-2">
                    {/* 한글 제목이 좁은 화면에서 어절 중간에 끊기지 않도록 한다. */}
                    <h1 id="not-found-title" className="typo-h1-bold text-balance break-keep">
                        찾으시는 페이지가 없습니다.
                    </h1>
                    {/* xl 이상에서는 안내문을 의도한 위치에서 나누고, 작은 화면에서는 자연스럽게 줄바꿈한다. */}
                    <p className="typo-title-m-regular text-foreground-subtle max-w-198 break-keep">
                        페이지 주소가 잘못 입력되었거나, 변경, 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.{' '}
                        <span className="xl:block">입력하신 주소가 정확한지 다시 한번 확인해 주세요.</span>
                    </p>
                </div>
            </div>
            <Button asChild variant="tertiary" size="xl">
                <Link href="/">홈으로</Link>
            </Button>
        </section>
    </main>
)

export default FullPageNotFound
