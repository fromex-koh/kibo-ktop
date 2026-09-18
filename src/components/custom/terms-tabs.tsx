'use client'

import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Tabs, TabsContent, TabsTrigger} from '@/components/ui/tabs'
import {
    KBIGX_TERMS,
    TERMS_VERSIONS,
    type TermsDocument,
    type TermsParagraph,
    type TermsView,
} from '@/content/service/terms'

// 이용약관 — 시안 "SB-FOTA-CP3-0007_K-BIGx 이용약관"(40007578:163310).
// 1뎁스는 글자만으로 갈리는 text 탭(개인정보 처리방침과 같은 모양)이고, 탭 아래에 약관 버전 셀렉트와 전문이 온다.
// 본문 문구는 설계 참고 화면(https://1-fo.vercel.app/terms)과 같다 — 데이터는 content/service/terms.ts.
// 탭 이동, roving tabindex, aria-controls는 Tabs 내부의 Radix 동작을 따른다.

const TECH_VIEW = {value: 'tech', label: '기술평가 이용약관'} as const satisfies {value: TermsView; label: string}
const KBIGX_VIEW = {value: 'kbigx', label: 'K-BIGx 이용약관'} as const satisfies {value: TermsView; label: string}
const TERMS_VIEWS = [TECH_VIEW, KBIGX_VIEW] as const

// 기술평가 이용약관은 원문 수급 전이라 임시 안내를 둔다(설계 참고 화면과 같은 문구).
const PlaceholderPanel = () => (
    <div className="bg-background flex min-h-100 items-center justify-center px-6">
        <h2 className="typo-title-l-bold text-center break-keep">내용 추후 업데이트</h2>
    </div>
)

// 항(①) 또는 번호 없는 단락과 그 아래 호(1.) 목록.
// 시안 — 항 번호는 글과 같은 줄에 붙고 줄이 바뀌면 왼쪽 끝으로 돌아간다. 호는 번호 뒤에 글이 매달린다(내어쓰기).
// 항 아래 호는 16 들여 쓰고, 번호 없는 단락("다음 각호와 같습니다") 아래 호는 들여 쓰지 않는다.
const TermsParagraphBlock = ({paragraph}: {paragraph: TermsParagraph}) => (
    <div className="flex flex-col gap-2">
        <p>{paragraph.no ? `${paragraph.no} ${paragraph.text}` : paragraph.text}</p>
        {paragraph.items ? (
            <ol className={paragraph.no ? 'flex list-none flex-col gap-2 pl-4' : 'flex list-none flex-col gap-2'}>
                {paragraph.items.map((item) => (
                    <li key={item.no} className="flex gap-1">
                        <span className="shrink-0">{item.no}</span>
                        <span className="min-w-0">{item.text}</span>
                    </li>
                ))}
            </ol>
        ) : null}
    </div>
)

// 약관 전문 — 장(20 Bold) › 조(18 Bold) › 항·호(16 Regular).
// 간격(시안): 장 사이 24 · 장 제목과 첫 조 16 · 조 사이 16 · 조 제목과 본문 8 · 단락 사이 8.
const TermsDocumentView = ({document}: {document: TermsDocument}) => (
    <article className="text-label-foreground typo-body-xl-regular flex flex-col gap-6 break-keep">
        {/* 문서 제목은 시안에 보이지 않지만 탭 패널의 제목으로 스크린리더에 남긴다[6.4.2]. */}
        <h2 className="sr-only">{document.title}</h2>
        {document.chapters.map((chapter) => (
            <section key={chapter.title} className="flex flex-col gap-4">
                <h3 className="typo-title-l-bold text-foreground">{chapter.title}</h3>
                {chapter.articles.map((article) => (
                    <div key={article.title} className="flex flex-col gap-2">
                        <h4 className="typo-title-m-bold text-foreground">{article.title}</h4>
                        {article.paragraphs.map((paragraph) => (
                            <TermsParagraphBlock key={`${paragraph.no ?? ''}${paragraph.text}`} paragraph={paragraph} />
                        ))}
                    </div>
                ))}
            </section>
        ))}
        <section className="flex flex-col gap-4">
            <h3 className="typo-title-l-bold text-foreground">{document.supplementary.title}</h3>
            {document.supplementary.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
            ))}
        </section>
    </article>
)

// 약관 버전 셀렉트와 전문. 셀렉트와 본문 사이는 시안 24 다.
// [프론트엔드 연동] 개정 이력이 생기면 고른 버전의 원문을 불러와 TermsDocumentView 에 넘긴다.
const KbigxTermsPanel = () => (
    <div className="flex flex-col gap-6">
        <Select defaultValue={TERMS_VERSIONS[0].value}>
            <SelectTrigger aria-label="K-BIGx 이용약관 버전" className="w-full sm:w-60">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {TERMS_VERSIONS.map((version) => (
                    <SelectItem key={version.value} value={version.value}>
                        {version.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <TermsDocumentView document={KBIGX_TERMS} />
    </div>
)

// 탭과 본문 사이는 시안 40 이다. 처음 열 탭(defaultView)은 페이지가 주소의 ?tab= 을 읽어 넘긴다.
const TermsTabs = ({defaultView = TECH_VIEW.value}: {defaultView?: TermsView}) => (
    <Tabs defaultValue={defaultView} className="gap-10">
        {/* 1뎁스 제목이 긴 모바일 화면은 TabsScrollArea로 가로 스크롤을 제공한다. */}
        <TabsScrollArea variant="text" aria-label="이용약관 구분">
            {TERMS_VIEWS.map((view) => (
                <TabsTrigger key={view.value} value={view.value}>
                    {view.label}
                </TabsTrigger>
            ))}
        </TabsScrollArea>
        <TabsContent value={TECH_VIEW.value}>
            <PlaceholderPanel />
        </TabsContent>
        <TabsContent value={KBIGX_VIEW.value}>
            <KbigxTermsPanel />
        </TabsContent>
    </Tabs>
)

export default TermsTabs
