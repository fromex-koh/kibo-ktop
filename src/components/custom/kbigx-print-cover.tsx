import Image from 'next/image'
import kiboLogo from '@public/images/logo-kibo.svg'
import coverIllustration from '@public/images/report/kbigx-cover.webp'
import tocIllustration from '@public/images/report/kbigx-toc.webp'
import tocStarLarge from '@public/images/report/kbigx-toc-star-large.svg'
import tocStarSmall from '@public/images/report/kbigx-toc-star-small.svg'
import type {InnovationGrowthReport} from '@/content/service/k-bigx-innovation-report'
import {
    formatKbigxPageNumber,
    formatKbigxPrintDate,
    getKbigxPrintToc,
    KBIGX_PRINT_BRAND,
    KBIGX_PRINT_EYEBROW,
    KBIGX_PRINT_NOTICE,
    KBIGX_PRINT_NOTICE_TITLE,
    KBIGX_PRINT_REPORT_NAME,
    KBIGX_PRINT_TAGLINE,
    KBIGX_PRINT_TAGLINE_EN,
    type KbigxPrintPage,
} from '@/content/service/k-bigx-print-report'
import {fitKbxText} from '@/components/custom/kbigx-print-parts'
import {cn} from '@/lib/utils'
import {KBX_EMPTY_VALUE} from '@/components/custom/kbigx-print-format'

// K-BIGx 보고서 인쇄본 — 표지 · 목차 · 뒷표지(쪽 머리말 · 바닥글 없이 용지 한 장 전체를 그리는 쪽).
// 자리가 고정된 쪽이라 일러스트 · 아래 정보 띠 · 유의사항은 용지 좌표(absolute, kbx 토큰)에 놓는다.
// 보고서 값은 표지의 기업명 · 대표자 · 발급일과 목차의 쪽 번호뿐이고, 나머지 문구는 k-bigx-print-report.ts 상수다.

const KIBO_LOGO_ALT = 'KIBO 기술보증기금'
const COVER_ILLUSTRATION_ALT = 'AI 반도체를 중심으로 기업 빌딩과 성장 분석 차트가 연결된 3D 일러스트'
const REPRESENTATIVE_LABEL = '대표자'
// 아래 정보 띠 한 칸의 글자 폭(용지 px) — 띠 1208 ÷ 3 에서 구분선 양쪽 여백 33 · 구분선을 뺀 값.
// COVER_BOTTOM_BAND_CLASS 의 inset-x · 칸의 pl/pr-kbx-33 을 바꾸면 이 값도 같이 고친다.
// 기업명 · 대표자가 길면 35 → 30 → 26 으로 줄이고(fitKbxText), 26 으로도 넘치면 2줄에서 말줄임(line-clamp-2)한다 —
// 정보 띠가 용지 아래로 넘치지 않게 하기 위해서다.
const COVER_INFO_WIDTH = 334
const COVER_INFO_STEPS = [
    {className: 'kbx-text-35', size: 35},
    {className: 'kbx-text-30', size: 30},
    {className: 'kbx-text-26', size: 26},
] as const
// 일러스트 표시 폭(w-257 = 1028px)에 맞는 해상도로 받는다 — 폭 클래스를 바꾸면 같이 고친다.
const COVER_ILLUSTRATION_SIZES = '1028px'
// 인쇄본 이미지는 바로 불러온다 — next/image 기본값(lazy)은 화면에 들어올 때 불러오는데, [출력하기]로 연 탭은 스크롤 없이
// 바로 인쇄하므로 첫 화면 아래(목차 · 뒷표지)의 이미지가 빈 채로 찍힌다.
const PRINT_IMAGE_LOADING = 'eager'
// 아래 띠 자리(위 선 + 좌우 76) — 표지 정보 띠와 뒷표지 로고 띠가 같은 자리에 놓인다.
const COVER_BOTTOM_BAND_CLASS = 'top-kbx-1737 kbx-border-t-regular border-kbx-cover-rule pt-kbx-39 absolute inset-x-19'

type CoverProps = {report: InnovationGrowthReport}

// 로고 + AI-POWERED INSIGHT — 표지 위 · 뒷표지 아래에 같은 모양으로 놓인다.
const KbxBrandBar = ({className}: {className?: string}) => (
    <div className={cn('flex items-center justify-between', className)}>
        <Image src={kiboLogo} alt={KIBO_LOGO_ALT} loading={PRINT_IMAGE_LOADING} />
        <div className="kbx-text-16 font-kbx-bold tracking-kbx-eyebrow whitespace-nowrap" lang="en">
            {KBIGX_PRINT_EYEBROW}
        </div>
    </div>
)

// 표지 — 보고서 제목(h1) · 일러스트 · 기업명 / 대표자 / 발급일.
// 대표자는 기업 개요 표(report.company.rows)에서 라벨 '대표자' 줄을 찾아 쓴다. 값이 없으면 '-'.
const KbigxPrintCover = ({report}: CoverProps) => {
    const representative = report.company.rows.find((row) => row.label === REPRESENTATIVE_LABEL)?.value
    const info = [
        {label: '기업명', value: report.companyName || KBX_EMPTY_VALUE},
        {label: REPRESENTATIVE_LABEL, value: representative || KBX_EMPTY_VALUE},
        {label: '발급일', value: formatKbigxPrintDate(report.issuedAt)},
    ]

    return (
        <div className="text-kbx-foreground-strong leading-kbx-normal pt-kbx-53 pl-kbx-75 relative h-full pr-19">
            <KbxBrandBar className="h-8" />

            <div className="mt-kbx-119 pl-kbx-71 flex flex-col items-start whitespace-nowrap">
                <h1 className="font-kbx-black tracking-kbx-cover-brand flex flex-col">
                    <span className="kbx-text-148 leading-kbx-95 text-kbx-cover-brand" lang="en">
                        {KBIGX_PRINT_BRAND}
                    </span>
                    <span className="kbx-text-150 leading-kbx-105 text-kbx-cover-title">
                        기업혁신성장
                        <br />
                        보고서
                    </span>
                </h1>
                <div className="pt-kbx-22 kbx-text-40 font-kbx-bold leading-kbx-140 tracking-kbx-cover-tagline pl-1">
                    {KBIGX_PRINT_TAGLINE}
                </div>
                <div className="kbx-text-27 tracking-kbx-caption text-kbx-cover-caption pt-2 pl-1" lang="en">
                    {KBIGX_PRINT_TAGLINE_EN}
                </div>
            </div>

            <Image
                src={coverIllustration}
                alt={COVER_ILLUSTRATION_ALT}
                loading={PRINT_IMAGE_LOADING}
                sizes={COVER_ILLUSTRATION_SIZES}
                className="left-kbx-161 top-kbx-871 absolute h-auto w-257"
            />

            <dl className={cn(COVER_BOTTOM_BAND_CLASS, 'grid grid-cols-3')}>
                {info.map((item, index) => (
                    <div
                        key={item.label}
                        className={cn(
                            'flex min-w-0 flex-col items-start',
                            index > 0 && 'kbx-border-l-regular border-kbx-cover-divider pl-kbx-33',
                            // 다음 칸 구분선 앞에도 같은 여백 — 긴 이름이 구분선에 붙지 않게.
                            index < info.length - 1 && 'pr-kbx-33',
                        )}
                    >
                        <dt className="kbx-text-23 text-kbx-cover-label whitespace-nowrap">{item.label}</dt>
                        <dd
                            className={cn(
                                'pt-kbx-7 leading-kbx-130 tracking-kbx-cover-value m-0 line-clamp-2 w-full',
                                fitKbxText(item.value, COVER_INFO_WIDTH, COVER_INFO_STEPS),
                            )}
                        >
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

// 목차 — 인쇄되는 장과 그 장의 첫 쪽 번호(getKbigxPrintToc). 고른 장 · 쪽 수에 따라 목록과 번호가 저절로 바뀐다.
const KbigxPrintToc = ({pages}: {pages: readonly KbigxPrintPage[]}) => (
    <div className="text-kbx-ink leading-kbx-normal pt-kbx-290 relative h-full px-35">
        {/* 장식 그림 — 뜻이 없어 alt="" 로 읽지 않게 한다[5.1.1]. 별 두 개도 같다. */}
        <Image
            src={tocIllustration}
            alt=""
            loading={PRINT_IMAGE_LOADING}
            className="left-kbx-727 w-kbx-493 absolute top-50 h-auto"
        />
        <Image src={kiboLogo} alt={KIBO_LOGO_ALT} loading={PRINT_IMAGE_LOADING} className="absolute top-25 right-20" />

        <div className="relative w-fit">
            <h2 className="kbx-text-100 font-kbx-black leading-kbx-140">목차</h2>
            <Image
                src={tocStarLarge}
                alt=""
                loading={PRINT_IMAGE_LOADING}
                className="left-kbx-189 -top-kbx-14 absolute size-7"
            />
            <Image
                src={tocStarSmall}
                alt=""
                loading={PRINT_IMAGE_LOADING}
                className="left-kbx-169 size-kbx-22 absolute top-0.5"
            />
        </div>

        <ol className="mt-kbx-241 gap-kbx-35 flex flex-col">
            {getKbigxPrintToc(pages).map((item, index, toc) => (
                // 장 이름 — 점선 리더 — 쪽 번호. 줄 높이 56 + 아래 여백 37(마지막 줄 제외), 줄 사이 35.
                <li
                    key={item.section}
                    className={cn('flex items-center gap-10', index < toc.length - 1 && 'pb-kbx-37')}
                >
                    <span className="kbx-text-48 font-kbx-medium tracking-kbx-toc h-14 shrink-0 content-center">
                        {item.label}
                    </span>
                    {/* 리더 점선 — 꾸밈이라 스크린리더가 읽지 않는다. 번호가 길어지면 리더가 줄어든다. */}
                    <span
                        aria-hidden="true"
                        className="border-kbx-gray kbx-border-t-heavy mt-1 h-0 min-w-6 flex-1 border-dotted"
                    />
                    <span className="kbx-text-44 font-kbx-regular h-14 min-w-14 content-center text-right whitespace-nowrap tabular-nums">
                        {item.pageNumber ? formatKbigxPageNumber(item.pageNumber) : null}
                    </span>
                </li>
            ))}
        </ol>

        <section className="border-kbx-divider kbx-border-thin rounded-kbx-16 bg-kbx-paper absolute inset-x-35 top-404 flex flex-col gap-2 px-10 py-8">
            <h3 className="kbx-text-24 font-kbx-bold leading-kbx-150">{KBIGX_PRINT_NOTICE_TITLE}</h3>
            {/* 양쪽 정렬 — 박스 안에서 문단 오른쪽 끝을 맞춘다(마지막 줄은 왼쪽 정렬). */}
            <p className="kbx-text-20 leading-kbx-150 text-kbx-body text-justify break-keep">{KBIGX_PRINT_NOTICE}</p>
        </section>
    </div>
)

// 뒷표지 — 보고서 이름을 쪽 높이 가운데에, 아래에 로고 띠.
const KbigxPrintBackCover = () => (
    <div className="text-kbx-foreground-strong leading-kbx-normal pl-kbx-146 relative flex h-full items-center">
        <div className="flex flex-col items-start whitespace-nowrap">
            <div
                className="kbx-text-120 font-kbx-black leading-kbx-110 tracking-kbx-back-brand text-kbx-cover-brand"
                lang="en"
            >
                {KBIGX_PRINT_BRAND}
            </div>
            <div className="kbx-text-72 font-kbx-black leading-kbx-115 tracking-kbx-back-title text-kbx-cover-title">
                {KBIGX_PRINT_REPORT_NAME}
            </div>
            <div className="pt-kbx-22 kbx-text-32 font-kbx-bold leading-kbx-140 tracking-kbx-back-tagline pl-1">
                {KBIGX_PRINT_TAGLINE}
            </div>
            <div className="kbx-text-24 tracking-kbx-caption text-kbx-cover-caption pt-2 pl-1" lang="en">
                {KBIGX_PRINT_TAGLINE_EN}
            </div>
        </div>
        <KbxBrandBar className={COVER_BOTTOM_BAND_CLASS} />
    </div>
)

export {KbigxPrintBackCover, KbigxPrintCover, KbigxPrintToc}
