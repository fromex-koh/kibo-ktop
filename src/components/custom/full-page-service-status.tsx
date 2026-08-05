import Image from 'next/image'
import Link from 'next/link'
import type {ReactNode} from 'react'
import serviceStatusIllustration from '@public/images/service-status/service-status-illustration.webp'
import {Button} from '@/components/ui/button'

type FullPageServiceStatusProps = {
    // section의 aria-labelledby와 제목에 함께 사용하는 식별자. 화면별로 다른 값을 전달한다.
    titleId: string
    title: string
    // 화면별 문장 구성과 줄바꿈을 유지할 수 있도록 ReactNode로 받는다.
    description: ReactNode
    // 점검 기간처럼 안내문 아래에 추가할 보조 정보 영역.
    panel?: ReactNode
}

// 404·500·정기점검 화면이 공유하는 Header·Footer 없는 전체 화면 상태 UI.
// 공통 일러스트·레이아웃·홈 이동 버튼은 이 컴포넌트에서 관리하고, 화면별 콘텐츠만 props로 받는다.
// min-h-dvh와 flex 정렬로 화면 높이에 맞춰 중앙 배치하며, 콘텐츠가 길어지면 페이지가 자연스럽게 스크롤된다.
const FullPageServiceStatus = ({titleId, title, description, panel}: FullPageServiceStatusProps) => (
    <main className="bg-surface text-foreground flex min-h-dvh items-center justify-center px-6 py-16">
        <section
            className="max-w-content flex w-full flex-col items-center gap-10 text-center md:gap-15"
            aria-labelledby={titleId}
        >
            <div className="flex w-full flex-col items-center gap-6 md:gap-10">
                {/* 제목과 의미가 중복되는 장식용 이미지는 alt를 비워 보조기기가 중복해서 읽지 않게 한다. */}
                <Image
                    src={serviceStatusIllustration}
                    alt=""
                    priority
                    sizes="320px"
                    className="h-auto w-full max-w-80"
                />
                <div className="flex flex-col items-center gap-2">
                    {/* 한글 제목이 좁은 화면에서 어절 중간에 끊기지 않도록 한다. */}
                    <h1 id={titleId} className="typo-h1-bold text-balance break-keep">
                        {title}
                    </h1>
                    <p className="typo-title-m-regular text-foreground-subtle max-w-198 break-keep">{description}</p>
                </div>
                {panel}
            </div>
            <Button asChild variant="tertiary" size="xl">
                <Link href="/">홈으로</Link>
            </Button>
        </section>
    </main>
)

export default FullPageServiceStatus
