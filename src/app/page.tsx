import Link from 'next/link'
import {ArrowUpRight, GitBranch} from 'lucide-react'
import PublishingIndex from '@/components/custom/publishing-index'
import ThemeToggle from '@/components/composite/theme-toggle'
import {BaseCard} from '@/components/composite/base-card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {ICON_REGISTRY} from '@/constants/icon-registry'
import {HOME_CONTENT} from '@/content'
import {REPOSITORY_URL, SITE_NAME} from '@/constants/site'

// 화면 콘텐츠(텍스트·아이콘 이름·링크)는 src/content/home.json 단일 소스에서 온다.
// 저장소 URL 은 환경변수(NEXT_PUBLIC_REPOSITORY_URL), 타이틀은 SITE_NAME 을 재사용한다.
const {badge, projectInfo, guide} = HOME_CONTENT
const ProjectInfoIcon = ICON_REGISTRY[projectInfo.icon]
const GuideIcon = ICON_REGISTRY[guide.icon]

// 저장소 링크에 URL 자체를 노출해 보는 사람이 주소를 확인할 수 있게 한다(스킴은 생략해 간결하게).
const REPOSITORY_URL_LABEL = REPOSITORY_URL.replace(/^https?:\/\//, '')

// 현재 버전·빌드 시각 — next.config.ts 가 빌드 시점의 git 버전·시각을 주입한다.
// 로컬 개발 등 값이 없을 때만 폴백을 쓴다. (MD-003)
const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? 'dev'
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME ?? '로컬 개발'

const Home = () => {
    return (
        <main className="bg-background text-foreground min-h-screen">
            <div className="max-w-content mx-auto flex w-full flex-col gap-6 px-6 py-16">
                {/* 홈은 헤더가 없어, 라이트/다크 토글을 콘텐츠 우상단에 둔다(헤더가 있는 화면은 헤더 우측). */}
                <div className="flex justify-end">
                    <ThemeToggle />
                </div>
                <header className="flex flex-col items-center gap-3 text-center">
                    <Badge asChild variant="solid" color="navy" shape="round" size="lg" className="font-mono">
                        <code>{badge}</code>
                    </Badge>
                    <h1 className="typo-display-m-bold">{SITE_NAME}</h1>
                    {/* 현재 버전·빌드 시각 (자리만 잡은 placeholder — 위 BUILD_VERSION/BUILD_TIME 참조) */}
                    <p className="typo-body-l-regular text-muted-foreground">
                        현재 버전: <span className="text-foreground font-semibold">{BUILD_VERSION}</span> / {BUILD_TIME}
                    </p>
                </header>

                <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
                    {/* 프로젝트 정보 */}
                    <BaseCard
                        title={
                            <span className="flex items-center gap-2">
                                <ProjectInfoIcon aria-hidden="true" className="text-primary size-6" />
                                <span>{projectInfo.title}</span>
                            </span>
                        }
                    >
                        <dl className="flex flex-col gap-3 text-sm">
                            <div className="flex items-center gap-3">
                                <dt className="text-muted-foreground w-16 shrink-0">저장소</dt>
                                <dd>
                                    <a
                                        href={REPOSITORY_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1.5 rounded font-medium break-all hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                    >
                                        <GitBranch aria-hidden="true" className="size-4 shrink-0" />
                                        {REPOSITORY_URL_LABEL}
                                        <span className="sr-only"> (새 창에서 열림)</span>
                                    </a>
                                </dd>
                            </div>
                            <div className="flex items-center gap-3">
                                <dt className="text-muted-foreground w-16 shrink-0">작업자</dt>
                                <dd>{projectInfo.author}</dd>
                            </div>
                        </dl>
                    </BaseCard>

                    {/* 컴포넌트 가이드 */}
                    <BaseCard
                        title={
                            <span className="flex items-center gap-2">
                                <GuideIcon aria-hidden="true" className="text-primary size-6 shrink-0" />
                                <span>{guide.title}</span>
                            </span>
                        }
                        action={
                            <Button asChild variant="default" size="icon" className="rounded-full">
                                <Link href={guide.href} aria-label={guide.linkLabel}>
                                    <ArrowUpRight aria-hidden="true" />
                                </Link>
                            </Button>
                        }
                    >
                        <p className="typo-body-l-regular text-muted-foreground">{guide.description}</p>
                    </BaseCard>
                </div>

                <PublishingIndex />
            </div>
        </main>
    )
}

export default Home
