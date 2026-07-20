import type {Metadata} from 'next'
import Image from 'next/image'
import {ArrowRight} from 'lucide-react'
import Header from '@/components/composite/header'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '메인 히어로 (typeB)'}

// 메인 히어로 — Figma "typeB_01" 반영. 사이드바 없는 독립 전체화면(새 창) 데모.
// [헤더 · 좌측 타이틀+CTA · 우측 통계 카드 그리드 · 그린 원형 배경 · 하단 마퀴 문구] 구조.
// 색은 tokens.json 의 hero-* semantic, 타이포는 typo-display-2xl-black(타이틀)·typo-marquee-black(마퀴)을
// 쓴다. 일러스트는 public/images/main-hero/ 경로 규약으로 받는다(OptionCard 와 동일 방식).

// 데모 일러스트 경로 규약 — public/images/main-hero/<이름>.webp. Figma 에서 export 해 배치하면 표시된다.
const HERO_ILLUSTRATIONS = {
    expert: '/images/main-hero/expert.webp',
    report: '/images/main-hero/report.webp',
} as const

// 통계 카드 공통 텍스트 블록 — [수치+단위 · 라벨 · 영문 보조] (Figma "건수+타이틀")
const HeroStat = ({
    value,
    unit,
    label,
    inverse = false,
    large = false,
}: {
    value: string
    unit: string
    label: string
    inverse?: boolean
    large?: boolean
}) => (
    <div className="flex flex-col gap-1">
        <p className={inverse ? 'text-primary-foreground' : 'text-foreground'}>
            <span className={large ? 'typo-display-xl-bold' : 'typo-h1-bold'}>{value}</span>
            <span className={large ? 'typo-h1-bold' : 'typo-h4-bold'}>{unit}</span>
        </p>
        <div className={inverse ? 'text-primary-foreground flex flex-col' : 'text-foreground flex flex-col'}>
            <span className="typo-body-xl-regular">{label}</span>
            <span className="typo-caption-regular">Professional personnel</span>
        </div>
    </div>
)

// 배경 원형 — Figma typeB_01 배경. 화면 아래-중앙(x -2%, y +145%)을 공유 중심으로 하는 동심원 3겹
// (바깥 민트 → 라임 링 → 안쪽 밝은 원)이 좌하단 밝은 면과 우측 그린, 대각 라임 밴드를 만든다.
// 비율 유지를 위해 Figma 프레임과 같은 16:9 박스를 하단에 깔고 그 % 좌표로 배치한다.
// 화면 고유 그래픽이라 크기·위치는 Figma 비율 기반 arbitrary 를 제한적으로 허용한다(SC-01 app 레이어 예외).
const HeroBackground = () => (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 aspect-[16/9]">
            <div className="bg-hero-circle-outer absolute top-[-88%] left-[-133%] aspect-square w-[261%] rounded-full" />
            <div className="bg-hero-circle-mid absolute top-[-41%] left-[-106%] aspect-square w-[208%] rounded-full" />
            <div className="bg-hero-circle-lime absolute top-[-41%] left-[-106%] aspect-square w-[208%] rounded-full" />
            <div className="bg-hero-surface absolute top-[9%] left-[-78%] aspect-square w-[152%] rounded-full" />
        </div>
    </div>
)

const MainHeroPage = () => (
    <div className="bg-hero-surface flex min-h-screen flex-col">
        <Header />
        <main className="relative flex-1 overflow-hidden">
            <HeroBackground />
            {/* 하단 마퀴 문구 — 장식 텍스트(aria-hidden), 화면 폭을 넘겨 흐르는 느낌만 재현 */}
            <p
                aria-hidden="true"
                className="typo-marquee-black text-hero-watermark pointer-events-none absolute bottom-0 left-0 whitespace-nowrap"
            >
                Korea Technology-rating Open platform&nbsp;&nbsp;&nbsp;&nbsp;Korea Technology-rating Open platform
            </p>

            <div className="max-w-content relative mx-auto flex w-full flex-col gap-10 px-6 pt-16 pb-40 md:pt-28">
                <div className="grid gap-10 md:grid-cols-12 md:gap-6">
                    {/* 좌측 — 타이틀 + CTA */}
                    <div className="flex flex-col gap-15 md:col-span-5">
                        <div className="flex flex-col gap-3">
                            <h1 className="typo-display-2xl-black text-foreground">
                                금융과 성장의
                                <br />
                                기회를 연결하는
                                <br />
                                기술보증기금
                            </h1>
                            <p className="typo-body-xl-regular text-label-foreground">
                                Korea Technology-rating Open platform
                            </p>
                        </div>
                        <div>
                            <Button variant="outline" size="lg" className="border-label-foreground">
                                목적에 맞는 서비스 살펴보기
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        </div>
                    </div>

                    {/* 우측 — 통계 카드 그리드 (row1: 전문인력(세로 2칸) + 특허/기술평가, row2: 노하우 + 평가정보) */}
                    <div className="grid gap-6 md:col-span-7 md:grid-cols-12">
                        <div className="bg-hero-card-navy relative flex flex-col justify-between overflow-hidden rounded-lg p-8 md:col-span-7">
                            <HeroStat value="1,060" unit="명" label="기술평가 전문인력" inverse large />
                            <div className="flex justify-end">
                                <Image
                                    src={HERO_ILLUSTRATIONS.expert}
                                    alt=""
                                    width={152}
                                    height={175}
                                    className="h-auto w-2/5"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 md:col-span-5">
                            <div className="bg-card rounded-lg p-8">
                                <HeroStat value="135" unit="만건" label="특허분석" />
                            </div>
                            <div className="bg-card rounded-lg p-8">
                                <HeroStat value="92" unit="만건" label="기술평가" />
                            </div>
                        </div>
                        <div className="bg-card rounded-lg p-8 md:col-span-5">
                            <HeroStat value="30" unit="년" label="평가 노하우" />
                        </div>
                        <div className="bg-hero-card-violet flex items-center justify-between gap-4 rounded-lg p-8 md:col-span-7">
                            <HeroStat value="2.5" unit="만건" label="매년 평가정보 생성" inverse />
                            <Image
                                src={HERO_ILLUSTRATIONS.report}
                                alt=""
                                width={112}
                                height={112}
                                className="h-auto w-28 shrink-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
)

export default MainHeroPage
