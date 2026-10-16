// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: 'Open Graph 미리보기'}

// 공유 미리보기 · 채널별 카드에 쓰는 견본 이미지(서비스 화면에서는 쓰지 않는다).
const SERVICE_IMAGE = '/images/og-sample/k-top-service-preview.png'

const PREVIEW_CONTENT = {
    domain: 'www.kibo.or.kr/ktop/main',
    title: 'K-TOP 개방형 기술평가 플랫폼',
    description: '기업의 혁신성장역량 평가, 기술사업성 평가, 원천기술 평가를 제공하는 개방형 기술평가 플랫폼입니다.',
}

// 1-1. 이미지 규격
const SPEC_COLUMNS = [
    {key: 'item', header: '항목', align: 'start', rowHeader: true},
    {key: 'value', header: '기준', align: 'start', wrap: true},
] as const

const SPEC_ROWS = [
    {key: 'size', cells: ['크기', '1200×630px (1.91:1). 대부분의 채널이 권장하는 표준 크기입니다.']},
    {
        key: 'safe',
        cells: [
            '안전 영역',
            '채널에 따라 가로를 자르거나 정사각으로 줄여 보여 줍니다. 로고 · 핵심 문구는 가운데 630×630 안에 둡니다.',
        ],
    },
    {key: 'format', cells: ['형식', 'png 또는 jpg. webp 는 일부 채널에서 이미지가 보이지 않을 수 있습니다.']},
    {key: 'weight', cells: ['용량', '1MB 이하를 권장합니다. 크면 공유 미리보기가 늦게 뜨거나 이미지가 빠집니다.']},
    {key: 'path', cells: ['파일 위치', 'public/og-image.png (사이트 대표 이미지 한 장)']},
] as const

// 1-2. 글자
const TEXT_COLUMNS = [
    {key: 'item', header: '항목', align: 'start', rowHeader: true},
    {key: 'value', header: '기준', align: 'start', wrap: true},
] as const

const TEXT_ROWS = [
    {key: 'title', cells: ['제목(title)', '40자 이내. 넘으면 채널에서 말줄임으로 잘립니다.']},
    {key: 'description', cells: ['설명(description)', '80자 이내. 카드에는 보통 1 ~ 2줄만 보입니다.']},
    {key: 'alt', cells: ['이미지 대체 텍스트(alt)', '이미지가 무엇인지 한 줄로 적습니다(보통 사이트 이름).']},
] as const

// 1-3. 적용 위치
const WHERE_COLUMNS = [
    {key: 'file', header: '파일', align: 'start', rowHeader: true},
    {key: 'role', header: '역할', align: 'start', wrap: true},
] as const

const WHERE_ROWS = [
    {
        key: 'site',
        cells: [
            <code key="file">src/constants/site.ts</code>,
            '사이트 주소 · 이름 · 설명 · 대표 이미지 경로 · 대체 텍스트 값을 둡니다. 값은 여기서만 고칩니다.',
        ],
    },
    {
        key: 'layout',
        cells: [
            <code key="file">src/app/layout.tsx</code>,
            '위 값으로 전역 metadata 의 openGraph 를 만듭니다. metadataBase(SITE_URL) 가 이미지 경로를 절대 주소로 바꿔 줍니다.',
        ],
    },
    {
        key: 'handoff',
        cells: [
            <code key="file">handoff/site.ts · handoff/og-image.png</code>,
            '프론트엔드 전달본에 들어갈 값과 이미지입니다. 전달본을 만들 때 위 두 파일을 이것으로 바꿉니다.',
        ],
    },
] as const

const OPEN_GRAPH_CODE = `// src/constants/site.ts — 값은 여기서만 고친다
export const SITE_URL = 'https://…'            // 실제 서비스 주소(metadataBase)
export const SITE_NAME = 'K-TOP 개방형 기술평가 플랫폼'
export const SITE_DESCRIPTION = '기업의 혁신성장역량, …'
export const SITE_OG_IMAGE = '/og-image.png'   // public 기준 경로
export const SITE_OG_IMAGE_ALT = SITE_NAME

// src/app/layout.tsx — 전역 metadata
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{url: SITE_OG_IMAGE, width: 1200, height: 630, alt: SITE_OG_IMAGE_ALT}],
  },
}`

const CHECK_ITEMS = [
    '이미지를 바꿔도 채널이 예전 미리보기를 기억하고 있을 수 있습니다. 각 채널의 공유 디버거(카카오 · 페이스북 등)에서 캐시를 지우거나, 파일 이름을 바꿔 새로 읽게 합니다.',
    '미리보기는 로그인 없이 열리는 공개 주소에서만 만들어집니다. 개발 서버(localhost)나 로그인이 필요한 화면은 채널이 읽지 못합니다.',
    '화면마다 다르게 보이게 하려면 그 화면 page.tsx 의 metadata 에 openGraph 를 넣습니다. 넣지 않은 값은 전역 값을 그대로 씁니다.',
] as const

const JUMP_LINK_CLASS =
    'border-border bg-card typo-body-l-bold text-foreground hover:bg-muted focus-visible:ring-ring rounded-md border px-4 py-2 outline-ring focus:outline-none focus-visible:ring-2'

// 섹션 묶음 제목 — 아래 카드들이 이 묶음에 속한다.
const GroupHeading = ({id, title, children}: {id: string; title: string; children: ReactNode}) => (
    <div className="flex scroll-mt-24 flex-col gap-2 pt-4" id={id}>
        <h2 className="typo-h3-bold text-foreground">{title}</h2>
        <p className="typo-body-l-regular text-label-foreground">{children}</p>
    </div>
)

const PreviewLogo = ({className = '', loading = 'lazy'}: {className?: string; loading?: 'eager' | 'lazy'}) => (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
        <Image
            src={SERVICE_IMAGE}
            alt=""
            draggable={false}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            loading={loading}
            className="object-cover"
        />
    </div>
)

// 채널별 카드 머리 — 형태 이름과 대표 채널.
const ChannelHeading = ({title, channel}: {title: string; channel: string}) => (
    <div className="flex items-center justify-between gap-2">
        <h4 className="typo-title-m-bold text-foreground">{title}</h4>
        <span className="typo-caption-regular text-muted-foreground">{channel}</span>
    </div>
)

const OpenGraphGuidePage = () => (
    <GuidePageShell
        title="Open Graph 미리보기"
        description="링크를 공유할 때 보이는 제목 · 설명 · 대표 이미지(Open Graph)의 규격과 적용 위치입니다."
    >
        <BaseCard>
            <section aria-labelledby="og-preview" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="og-preview" className="typo-h4-bold">
                        공유 미리보기
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        K-TOP 서비스의 제목 · 설명 · 대표 이미지로 만든 견본입니다.
                    </p>
                </div>
                <div className="border-subtle-3 mx-auto w-full max-w-2xl overflow-hidden rounded-lg border">
                    <Image
                        src={SERVICE_IMAGE}
                        alt="K-TOP 개방형 기술평가 플랫폼 Open Graph 이미지"
                        draggable={false}
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
                <nav aria-label="Open Graph 문서 구성" className="flex flex-wrap gap-3">
                    <a href="#og-spec-group" className={JUMP_LINK_CLASS}>
                        1. 규격 · 적용
                    </a>
                    <a href="#og-channel-group" className={JUMP_LINK_CLASS}>
                        2. 채널별 카드 형태
                    </a>
                </nav>
            </section>
        </BaseCard>

        <GroupHeading id="og-spec-group" title="1. 규격 · 적용">
            대표 이미지와 글자를 만들 때, 값을 고칠 때 확인합니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="og-spec" className="flex flex-col gap-6">
                <h3 id="og-spec" className="typo-h4-bold">
                    1-1. 이미지 규격
                </h3>
                <Table caption="Open Graph 이미지 규격" columns={SPEC_COLUMNS} rows={SPEC_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="og-text" className="flex flex-col gap-6">
                <h3 id="og-text" className="typo-h4-bold">
                    1-2. 제목 · 설명
                </h3>
                <Table caption="Open Graph 글자 기준" columns={TEXT_COLUMNS} rows={TEXT_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="og-where" className="flex flex-col gap-6">
                <h3 id="og-where" className="typo-h4-bold">
                    1-3. 적용 위치
                </h3>
                <Table caption="Open Graph 값을 두는 파일" columns={WHERE_COLUMNS} rows={WHERE_ROWS} size="md" />
                <CodeBlock code={OPEN_GRAPH_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="og-check" className="flex flex-col gap-6">
                <h3 id="og-check" className="typo-h4-bold">
                    1-4. 바꾼 뒤 확인할 것
                </h3>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    {CHECK_ITEMS.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <GroupHeading id="og-channel-group" title="2. 채널별 카드 형태">
            같은 값이 채널마다 다른 모양으로 보입니다. 실제 모양은 채널의 정책과 캐시에 따라 달라질 수 있습니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="og-shapes" className="flex flex-col gap-6">
                <h3 id="og-shapes" className="typo-h4-bold">
                    2-1. 카드 형태
                </h3>
                <div className="grid w-full items-start gap-8 lg:grid-cols-2">
                    <article className="flex w-full flex-col gap-3">
                        <ChannelHeading title="피드형 이미지 카드" channel="Facebook" />
                        <div className="bg-surface border-subtle-3 overflow-hidden rounded-md border p-4">
                            <PreviewLogo className="aspect-video w-full rounded-md" loading="eager" />
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

                    <article className="flex w-full flex-col gap-3">
                        <ChannelHeading title="링크 펼침 카드" channel="Discord · Teams" />
                        <div className="bg-surface border-subtle-3 rounded-md border p-4">
                            <p className="typo-caption-regular text-muted-foreground">{PREVIEW_CONTENT.domain}</p>
                            <p className="text-primary typo-body-l-medium">{PREVIEW_CONTENT.title}</p>
                            <p className="typo-caption-regular text-foreground-subtle line-clamp-2">
                                {PREVIEW_CONTENT.description}
                            </p>
                            <PreviewLogo className="mt-3 aspect-video w-full rounded-md" />
                        </div>
                    </article>

                    <article className="flex w-full flex-col gap-3">
                        <ChannelHeading title="가로형 링크 카드" channel="네이버 · X" />
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

                    <article className="flex w-full flex-col gap-3">
                        <ChannelHeading title="왼쪽 강조 링크 카드" channel="Slack" />
                        <div className="bg-surface border-subtle-3 rounded-md border p-3">
                            <p className="typo-body-l-medium">{PREVIEW_CONTENT.title}</p>
                            <p className="typo-caption-regular text-muted-foreground">{PREVIEW_CONTENT.domain}</p>
                            <p className="typo-caption-regular text-muted-foreground line-clamp-2">
                                {PREVIEW_CONTENT.description}
                            </p>
                            <PreviewLogo className="mt-3 aspect-video w-48 rounded-md" />
                        </div>
                    </article>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OpenGraphGuidePage
