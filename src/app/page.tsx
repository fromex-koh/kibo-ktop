import Link from 'next/link';
import { ArrowUpRight, GitBranch } from 'lucide-react';
import PublishingIndex from '@/components/publishing-index';
import { ICON_REGISTRY } from '@/components/icon-registry';
import { HOME_CONTENT } from '@/content';
import { REPOSITORY_URL, SITE_NAME } from '@/constants/site';

// 화면 콘텐츠(텍스트·아이콘 이름·링크)는 src/content/home.json 단일 소스에서 온다.
// 저장소 URL 은 환경변수(NEXT_PUBLIC_REPOSITORY_URL), 타이틀은 SITE_NAME 을 재사용한다.
const { badge, projectInfo, guide } = HOME_CONTENT;
const ProjectInfoIcon = ICON_REGISTRY[projectInfo.icon];
const GuideIcon = ICON_REGISTRY[guide.icon];

const CARD_CLASS = 'bg-gray-10/25 flex flex-col gap-3 rounded-xl p-6';

// 저장소 링크에 URL 자체를 노출해 보는 사람이 주소를 확인할 수 있게 한다(스킴은 생략해 간결하게).
const REPOSITORY_URL_LABEL = REPOSITORY_URL.replace(/^https?:\/\//, '');

// 현재 버전·빌드 시각 — next.config.ts 가 빌드 시점의 git 버전·시각을 주입한다.
// 로컬 개발 등 값이 없을 때만 폴백을 쓴다. (MD-003)
const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? 'dev';
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME ?? '로컬 개발';

const Home = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="max-w-content mx-auto flex w-full flex-col gap-12 px-6 py-16">
        <header className="flex flex-col items-center gap-3 text-center">
          <code className="border-border text-foreground-muted rounded-md border px-2 py-1 font-mono text-sm">
            {badge}
          </code>
          <h1 className="typo-heading-xl">{SITE_NAME}</h1>
          {/* 현재 버전·빌드 시각 (자리만 잡은 placeholder — 위 BUILD_VERSION/BUILD_TIME 참조) */}
          <p className="typo-body-sm text-foreground-muted">
            현재 버전: <span className="text-foreground font-semibold">{BUILD_VERSION}</span> /{' '}
            {BUILD_TIME}
          </p>
        </header>

        <div className="wide:grid-cols-2 grid gap-6">
          {/* 프로젝트 정보 */}
          <section aria-labelledby="section-project" className={CARD_CLASS}>
            <div className="flex items-center gap-2">
              <ProjectInfoIcon aria-hidden="true" className="text-brand-foreground size-6" />
              <h2 id="section-project" className="typo-heading-sm">
                {projectInfo.title}
              </h2>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3">
                <dt className="text-foreground-muted w-16 shrink-0">저장소</dt>
                <dd>
                  <a
                    href={REPOSITORY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-foreground focus-visible:ring-brand focus-visible:ring-offset-background inline-flex items-center gap-1.5 rounded font-medium break-all hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <GitBranch aria-hidden="true" className="size-4 shrink-0" />
                    {REPOSITORY_URL_LABEL}
                    <span className="sr-only"> (새 창에서 열림)</span>
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="text-foreground-muted w-16 shrink-0">작업자</dt>
                <dd>{projectInfo.author}</dd>
              </div>
            </dl>
          </section>

          {/* 컴포넌트 가이드 */}
          <section aria-labelledby="section-guide" className={CARD_CLASS}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <GuideIcon aria-hidden="true" className="text-brand-foreground size-6 shrink-0" />
                <h2 id="section-guide" className="typo-heading-sm">
                  {guide.title}
                </h2>
              </div>
              <Link
                href={guide.href}
                aria-label={guide.linkLabel}
                className="group bg-brand focus-visible:ring-brand focus-visible:ring-offset-background inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <ArrowUpRight
                  aria-hidden="true"
                  className="text-background size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
            <p className="typo-body-sm text-foreground-muted">{guide.description}</p>
          </section>
        </div>

        <PublishingIndex />
      </div>
    </main>
  );
};

export default Home;
