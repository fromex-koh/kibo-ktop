'use client'

import {useEffect, useRef, useState} from 'react'
import type {StaticImageData} from 'next/image'
import {PlatformReportFrame, preloadReportImages} from '@/components/custom/platform-report-preview'
import {
    platformCardClassName,
    platformViewerMenuClassName,
    platformViewerTabClassName,
    platformViewerTabNumberClassName,
} from '@/components/theme/platform-intro.variants'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {cn} from '@/lib/utils'

// 보고서 뷰어 — 보고서 항목(진단브리핑 · 기업현황 …)을 고르면 오른쪽에 그 쪽 화면 캡처와 '주요 제공 정보'가 나온다.
//   · PC(1024↑): 왼쪽 260 세로 메뉴(스크롤해도 섹션 탭 아래 붙음) | 오른쪽 패널. 태블릿: 메뉴가 위에서 4열 격자. 모바일: 2열 격자(항목이 늘 다 보인다).
//   · 패널(카드): 항목 이름(h3) · 'n / 전체' 칩 → 설명 → 캡처 틀(PC 520 · 그 아래 400, 세로 스크롤 · 샘플 배지) → 주요 제공 정보(2열 · 모바일 1열).
//   · 캡처는 라이트 · 다크 그림이 따로다. 첫 그림이 뜨면 나머지 항목 그림을 미리 받아 탭을 옮길 때 기다리지 않는다.
//   · 탭 역할 · 방향키 이동 · aria-selected 는 Radix Tabs 가 맡는다[8.2.1]. 방향키는 화면 폭과 관계없이 왼 · 오른쪽이다
//     (PC 세로 메뉴도 같음) — ui/tabs 셸이 orientation 을 Radix 에 넘기지 않아 늘 가로(aria-orientation="horizontal")로 동작한다.
// 색 = 화면 <main> 의 --platform-tone-fill(고른 칸 · 샘플 배지) · --platform-tone-step(번호 글자).
// 쓰는 곳: custom/platform-k-bigx-report.tsx(보고서 미리보기).

type PlatformReportViewerInfo = {title: string; description: string}

type PlatformReportViewerSection = {
    id: string
    name: string
    description: string
    image: {light: StaticImageData; dark: StaticImageData}
    info: readonly PlatformReportViewerInfo[]
}

// 세로 메뉴로 바뀌는 폭 — 아래 lg: 클래스(1024)와 같다.
const VERTICAL_MENU_QUERY = '(min-width: 64rem)'
const FRAME_HEIGHT_CLASS = 'h-100 lg:h-130'

const PlatformReportViewer = ({
    sections,
    listLabel,
    reportName,
    infoTitle,
    sampleBadge,
    scrollCaption,
    sampleNote,
    className,
}: {
    sections: readonly PlatformReportViewerSection[]
    /** 메뉴 이름(낭독기). */
    listLabel: string
    /** 그림 대체 텍스트 앞부분(예: K-BIGx 기업혁신성장 보고서). */
    reportName: string
    /** 패널 아래 목록 제목(예: 주요 제공 정보). */
    infoTitle: string
    sampleBadge: string
    scrollCaption: string
    /** 그림 설명 끝 안내(예시 데이터). */
    sampleNote: string
    className?: string
}) => {
    // 메뉴 모양용 — Tabs 의 data-orientation 만 바꿔 세로 메뉴 스타일(group-data-vertical)을 켠다. 방향키에는 영향 없음.
    const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
    const hasPreloadedRef = useRef(false)

    useEffect(() => {
        const query = window.matchMedia(VERTICAL_MENU_QUERY)
        const sync = () => setOrientation(query.matches ? 'vertical' : 'horizontal')
        sync()
        query.addEventListener('change', sync)
        return () => query.removeEventListener('change', sync)
    }, [])

    // 첫 그림이 뜨면 나머지 항목 그림(지금 테마 쪽)을 한 번 미리 받는다.
    const handleImageLoaded = () => {
        if (hasPreloadedRef.current) return
        hasPreloadedRef.current = true
        const isDark = document.documentElement.classList.contains('dark')
        preloadReportImages(sections.map((section) => (isDark ? section.image.dark : section.image.light)))
    }

    return (
        <Tabs
            defaultValue={sections[0]?.id}
            orientation={orientation}
            className={cn('grid items-start gap-4 lg:grid-cols-[--spacing(65)_minmax(0,1fr)] lg:gap-6', className)}
        >
            <TabsList variant="plain" aria-label={listLabel} className={platformViewerMenuClassName}>
                {sections.map((section, index) => (
                    <TabsTrigger key={section.id} value={section.id} className={platformViewerTabClassName}>
                        <span aria-hidden="true" className={platformViewerTabNumberClassName}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        {section.name}
                    </TabsTrigger>
                ))}
            </TabsList>
            {sections.map((section, index) => (
                <TabsContent
                    key={section.id}
                    value={section.id}
                    className={cn(
                        platformCardClassName,
                        'motion-safe:animate-in motion-safe:fade-in-0 mt-0 flex flex-col p-4 motion-safe:duration-400 md:p-5',
                    )}
                >
                    {/* 간격(시안): 머리 → 설명 14 · 설명 → 틀 16 · 안내 → 주요 제공 정보 20 · 제목 → 목록 30. */}
                    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="typo-title-l-bold text-foreground">{section.name}</h3>
                        <span className="typo-platform-chip-semibold bg-platform-panel-inset border-platform-panel-border text-foreground-subtle inline-flex h-7 items-center rounded-xs border px-2.5">
                            {index + 1} / {sections.length}
                        </span>
                    </div>
                    <p className="typo-body-xl-regular text-label-foreground mb-4">{section.description}</p>
                    <PlatformReportFrame
                        isBare
                        frameHeightClassName={FRAME_HEIGHT_CLASS}
                        label={section.name}
                        image={section.image.light}
                        darkImage={section.image.dark}
                        alt={`${reportName} ${section.name} 화면 예시 — ${sampleNote}`}
                        sampleBadge={sampleBadge}
                        scrollCaption={scrollCaption}
                        onLoaded={handleImageLoaded}
                    />
                    <div className="mt-5 flex flex-col gap-7.5">
                        <h4 className="typo-body-xl-bold text-foreground">{infoTitle}</h4>
                        <dl className="grid gap-3 md:grid-cols-2">
                            {section.info.map((item) => (
                                <div key={item.title} className="bg-platform-panel-inset rounded-2xs px-4.5 py-4">
                                    <dt className="typo-body-l-bold text-foreground-subtle">{item.title}</dt>
                                    <dd className="typo-body-xl-regular text-foreground mt-1">{item.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
}

export {PlatformReportViewer}
export type {PlatformReportViewerInfo, PlatformReportViewerSection}
