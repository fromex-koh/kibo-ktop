import type {Metadata} from 'next'
import Link from 'next/link'
import {ArrowRight, ArrowUpRight} from 'lucide-react'
import {GUIDE_NAV_SECTIONS} from '@/constants/guide-nav'
import GuidePage from '@/components/guide/guide-page'

export const metadata: Metadata = {
    // layout 의 template('%s · 컴포넌트 가이드')과 겹치지 않도록 개요는 단독 제목을 쓴다.
    title: {absolute: '컴포넌트 가이드'},
}

// 개요(랜딩) — 디자인 토큰 섹션들을 카테고리별 카드로 나열해 각 페이지로 안내한다.
// 섹션 목록은 사이드 네비와 동일한 단일 소스(GUIDE_NAV_SECTIONS)를 쓴다.
const ComponentGuidePage = () => (
    <GuidePage title="컴포넌트 가이드" description="디자인 토큰과 레이아웃 기준을 섹션별로 정리했습니다.">
        <div className="flex flex-col gap-8">
            {GUIDE_NAV_SECTIONS.map((section) => (
                <section key={section.title} aria-label={section.title} className="flex flex-col gap-3">
                    <h2 className="typo-title-l-bold text-muted-foreground">{section.title}</h2>
                    <ul className="wide:grid-cols-2 pc:grid-cols-3 grid grid-cols-1 gap-3">
                        {section.items.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    {...(item.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                                    className="border-border bg-card focus-visible:ring-ring focus-visible:ring-offset-background flex items-center justify-between gap-3 rounded-xl border px-4 py-4 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    <span className="typo-body-xl-regular font-medium">
                                        {item.label}
                                        {item.external && <span className="sr-only"> (새 창에서 열림)</span>}
                                    </span>
                                    {item.external ? (
                                        <ArrowUpRight
                                            aria-hidden="true"
                                            className="text-muted-foreground size-4 shrink-0"
                                        />
                                    ) : (
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="text-muted-foreground size-4 shrink-0"
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    </GuidePage>
)

export default ComponentGuidePage
