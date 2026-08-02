import Link from 'next/link'

const Home = () => (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center px-6 py-16">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
            <h1 className="typo-display-s-bold">프론트엔드 프로젝트</h1>
            <p className="typo-body-l-regular text-muted-foreground">
                이 페이지를 서비스의 메인 화면으로 교체하세요. 전달된 퍼블리싱 현황과 컴포넌트 가이드는 아래
                링크에서 확인할 수 있습니다.
            </p>
            <Link
                href="/publishing-guide"
                className="bg-primary text-primary-foreground typo-body-l-medium focus-visible:ring-ring rounded-md px-4 py-2 hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
            >
                퍼블리싱 인덱스 보기
            </Link>
        </div>
    </main>
)

export default Home
