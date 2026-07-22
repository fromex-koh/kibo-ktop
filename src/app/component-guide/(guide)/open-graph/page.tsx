import type {Metadata} from 'next'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'

export const metadata: Metadata = {title: 'Open Graph 미리보기'}

const SERVICE_IMAGE = '/images/og/k-top-service-preview.png'

const OPEN_GRAPH_CODE = `export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.kibo.or.kr/ktop/main',
    title: 'K-TOP 개방형 기술평가 플랫폼',
    description: '기업의 혁신성장역량, 기술사업성, 원천기술 특성을 평가하는 개방형 기술평가 플랫폼입니다.',
    images: [{
      url: '${SERVICE_IMAGE}',
      width: 1200,
      height: 630,
    }],
  },
}`

const PREVIEW_CONTENT = {
    domain: 'www.kibo.or.kr/ktop/main',
    title: 'K-TOP 개방형 기술평가 플랫폼',
    description: '기업의 혁신성장역량 평가, 기술사업성 평가, 원천기술 평가를 제공하는 개방형 기술평가 플랫폼입니다.',
}

const PreviewLogo = ({className = ''}: {className?: string}) => (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
        <Image src={SERVICE_IMAGE} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
    </div>
)

const OpenGraphGuidePage = () => (
    <GuidePageShell
        title="Open Graph 미리보기"
        description="링크 공유 시 노출되는 메타데이터와 대표 이미지를 확인합니다."
    >
        <section aria-labelledby="og-preview" className="flex flex-col gap-4">
            <div className="text-center">
                <h2 id="og-preview" className="typo-h4-bold">
                    공유 미리보기
                </h2>
                <p className="typo-body-l-regular text-foreground-subtle">
                    실 서비스 K-TOP 페이지에서 사용하는 제목·설명·대표 이미지 기준으로 공유 미리보기를 확인합니다.
                </p>
            </div>
            <div className="border-subtle-3 mx-auto w-full max-w-2xl overflow-hidden rounded-lg border">
                <Image
                    src={SERVICE_IMAGE}
                    alt="K-TOP 개방형 기술평가 플랫폼 Open Graph 이미지"
                    width={1200}
                    height={630}
                    loading="eager"
                    className="h-auto w-full"
                />
                <div className="border-border bg-surface flex flex-col gap-1 border-t px-4 py-3">
                    <p className="typo-body-l-medium text-foreground">{PREVIEW_CONTENT.title}</p>
                    <p className="typo-body-l-regular text-foreground-subtle">{PREVIEW_CONTENT.description}</p>
                    <p className="typo-caption-regular text-muted-foreground font-mono">{PREVIEW_CONTENT.domain}</p>
                </div>
            </div>
        </section>

        <section aria-labelledby="og-shapes" className="flex flex-col gap-8">
            <BaseCard>
                <div>
                    <h2 id="og-shapes" className="typo-h4-bold">
                        공유 카드 형태
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        채널별로 자주 사용되는 링크 미리보기 형태를 확인합니다. 실제 노출은 채널의 정책과 캐시에 따라
                        달라질 수 있습니다.
                    </p>
                </div>
            </BaseCard>
            <div className="grid w-full items-start justify-items-center gap-8 lg:grid-cols-2">
                <article className="order-3 flex w-full flex-col gap-3 self-start overflow-hidden p-0">
                    <div className="flex items-center justify-between">
                        <p className="typo-body-l-medium">가로형 링크 카드</p>
                        <span className="typo-caption-regular text-muted-foreground">네이버·X</span>
                    </div>
                    <div className="bg-surface border-subtle-3 flex min-h-32 overflow-hidden rounded-md border">
                        <PreviewLogo className="w-40 shrink-0" />
                        <div className="bg-surface flex min-w-0 flex-col justify-center gap-1 px-4 py-3">
                            <p className="typo-caption-regular text-muted-foreground">{PREVIEW_CONTENT.domain}</p>
                            <p className="typo-body-l-medium line-clamp-1">{PREVIEW_CONTENT.title}</p>
                            <p className="typo-caption-regular text-muted-foreground line-clamp-2">
                                {PREVIEW_CONTENT.description}
                            </p>
                        </div>
                    </div>
                </article>

                <article className="order-first flex w-full flex-col gap-3 self-start overflow-hidden">
                    <div className="flex items-center gap-2 px-0 pt-0 pb-3">
                        <p className="typo-body-l-medium">피드형 이미지 카드</p>
                        <span className="typo-caption-regular text-muted-foreground ml-auto">Facebook</span>
                    </div>
                    <div className="bg-surface border-subtle-3 overflow-hidden rounded-md border p-4">
                        <PreviewLogo className="aspect-video w-full rounded-md" />
                        <div className="px-3 py-3">
                            <p className="typo-caption-regular text-muted-foreground uppercase">
                                {PREVIEW_CONTENT.domain}
                            </p>
                            <p className="typo-body-l-medium">{PREVIEW_CONTENT.title}</p>
                            <p className="typo-caption-regular text-muted-foreground line-clamp-2">
                                {PREVIEW_CONTENT.description}
                            </p>
                        </div>
                    </div>
                </article>

                <article className="order-last flex w-full flex-col gap-3 self-start overflow-hidden">
                    <div className="flex items-center gap-2 px-0 pt-0 pb-3">
                        <p className="typo-body-l-medium">왼쪽 강조 링크 카드</p>
                        <span className="typo-caption-regular text-muted-foreground ml-auto">Slack</span>
                    </div>
                    <div className="bg-surface border-subtle-3 m-0 rounded-md border p-3">
                        <p className="typo-body-l-medium">{PREVIEW_CONTENT.title}</p>
                        <p className="typo-caption-regular text-muted-foreground">{PREVIEW_CONTENT.domain}</p>
                        <p className="typo-caption-regular text-muted-foreground line-clamp-2">
                            {PREVIEW_CONTENT.description}
                        </p>
                        <PreviewLogo className="mt-3 aspect-video w-48 rounded-md" />
                    </div>
                </article>

                <article className="order-2 flex w-full flex-col gap-3 self-start overflow-hidden">
                    <div className="flex items-center justify-between px-0 pt-0 pb-3">
                        <p className="typo-body-l-medium">링크 펼침 카드</p>
                        <span className="typo-caption-regular text-muted-foreground">Discord·Teams</span>
                    </div>
                    <div className="bg-surface border-subtle-3 rounded-md border p-4">
                        <p className="typo-caption-regular text-muted-foreground">{PREVIEW_CONTENT.domain}</p>
                        <p className="text-primary typo-body-l-medium">{PREVIEW_CONTENT.title}</p>
                        <p className="typo-caption-regular text-foreground-subtle line-clamp-2">
                            {PREVIEW_CONTENT.description}
                        </p>
                        <PreviewLogo className="mt-3 aspect-video w-full rounded-md" />
                    </div>
                </article>
            </div>
        </section>

        <BaseCard>
            <section aria-labelledby="og-meta" className="flex flex-col gap-4">
                <div>
                    <h2 id="og-meta" className="typo-h4-bold">
                        적용 메타데이터
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        값은 <code className="font-mono">src/app/layout.tsx</code>의 전역 metadata에서 관리합니다.
                    </p>
                </div>
                <CodeBlock code={OPEN_GRAPH_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OpenGraphGuidePage
