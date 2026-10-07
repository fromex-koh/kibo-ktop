'use client'

import {useState, type ReactNode} from 'react'
import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Tabs, TabsContent, TabsTrigger} from '@/components/ui/tabs'
import {
    KBIGX_TERMS_BY_VERSION,
    TECH_TERMS_BY_VERSION,
    TECH_TERMS_VERSIONS,
    TERMS_PLACEHOLDER,
    TERMS_VERSIONS,
    type TermsDocument,
    type TermsParagraph,
    type TermsView,
} from '@/content/service/terms'

// 이용약관 — 탭(기술평가 · K-BIGx) 아래에 약관 버전 셀렉트와 본문이 온다. 데이터는 content/service/terms.ts.
// 탭은 개인정보 처리방침과 같은 text 탭이다.
// 탭 이동, roving tabindex, aria-controls는 Tabs 내부의 Radix 동작을 따른다.

const TECH_VIEW = {value: 'tech', label: '기술평가 이용약관'} as const satisfies {value: TermsView; label: string}
const KBIGX_VIEW = {value: 'kbigx', label: 'K-BIGx 이용약관'} as const satisfies {value: TermsView; label: string}
const TERMS_VIEWS = [TECH_VIEW, KBIGX_VIEW] as const

// 본문이 아직 없는 약관(버전)은 K-BIGx 약관 본문과 같은 글자 모양으로 안내 문구만 둔다.
// 약관 전문과 마찬가지로 문서 제목은 보이지 않게 두고 탭 패널의 제목으로 스크린리더에 남긴다[6.4.2].
const TermsPlaceholder = ({title, text = TERMS_PLACEHOLDER}: {title: string; text?: string}) => (
    <article className="text-label-foreground typo-body-xl-regular flex flex-col gap-6 break-keep">
        <h2 className="sr-only">{title}</h2>
        <p>{text}</p>
    </article>
)

// 항(①) 또는 번호 없는 단락과 그 아래 호(1.) 목록.
// 항 번호는 글과 같은 줄에 붙고, 호는 번호 뒤에 글이 매달린다(내어쓰기). 항 아래 호는 들여 쓰고,
// 번호 없는 단락("다음 각호와 같습니다") 아래 호는 들여 쓰지 않는다.
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

// 약관 전문 — 장 › 조 › 항 · 호 순서로 그린다.
const TermsDocumentView = ({document}: {document: TermsDocument}) => (
    <article className="text-label-foreground typo-body-xl-regular flex flex-col gap-6 break-keep">
        {/* 문서 제목은 화면에 보이지 않게 두고 탭 패널의 제목으로 스크린리더에 남긴다[6.4.2]. */}
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

// 약관 버전 셀렉트와 본문 — 셀렉트에서 고른 버전의 본문이 아래에 보인다.
// 버전은 비어 있지 않은 목록이라 첫 항목이 처음 값이다.
type TermsVersionOption = {value: string; label: string}

const TermsVersionPanel = ({
    name,
    versions,
    renderContent,
}: {
    /** 셀렉트의 이름표에 쓰는 약관 이름(예: K-BIGx 이용약관). */
    name: string
    versions: readonly [TermsVersionOption, ...TermsVersionOption[]]
    /** 고른 버전의 본문. */
    renderContent: (version: string) => ReactNode
}) => {
    const [version, setVersion] = useState(versions[0].value)

    return (
        <div className="flex flex-col gap-6">
            <Select value={version} onValueChange={setVersion}>
                <SelectTrigger aria-label={`${name} 버전`} className="w-full sm:w-60">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {versions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {renderContent(version)}
        </div>
    )
}

// 고른 버전의 본문 — content/service/terms.ts 의 버전별 표에서 꺼낸다. 표에 없는 버전은 안내 문구가 보인다.
// [프론트엔드 연동] 개정본 원문을 API·CMS 에서 받게 되면 이 표 조회를 요청으로 바꾼다.
const KbigxTermsPanel = () => (
    <TermsVersionPanel
        name={KBIGX_VIEW.label}
        versions={TERMS_VERSIONS}
        renderContent={(version) => {
            const document = KBIGX_TERMS_BY_VERSION[version]

            return document ? <TermsDocumentView document={document} /> : <TermsPlaceholder title={KBIGX_VIEW.label} />
        }}
    />
)

const TechTermsPanel = () => (
    <TermsVersionPanel
        name={TECH_VIEW.label}
        versions={TECH_TERMS_VERSIONS}
        renderContent={(version) => <TermsPlaceholder title={TECH_VIEW.label} text={TECH_TERMS_BY_VERSION[version]} />}
    />
)

// 처음 열 탭(defaultView)은 페이지가 주소의 ?tab= 을 읽어 넘긴다.
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
            <TechTermsPanel />
        </TabsContent>
        <TabsContent value={KBIGX_VIEW.value}>
            <KbigxTermsPanel />
        </TabsContent>
    </Tabs>
)

export default TermsTabs
