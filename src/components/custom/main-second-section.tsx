'use client'

import {useCallback, useEffect, useRef, useState, type SyntheticEvent} from 'react'
import Image from 'next/image'
import {BriefcaseBusiness} from 'lucide-react'
import sectionBg from '@public/images/main-hero/section-2-bg-display.webp'
import {stackPageClassName} from '@/components/theme/stack-pager.variants'
import {cn} from '@/lib/utils'

// 기업회원 이용 흐름 4단계. 시안의 줄바꿈을 그대로 두려고 label 을 줄 단위 배열로 관리한다.
const BUSINESS_STEPS = [
    {step: '01', lines: ['자가진단 신청 및', '결과 조회']},
    {step: '02', lines: ['전문가 평가 신청 및', '결과 확인']},
    {step: '03', lines: ['K-BIGx 보고서를', '통한 종합 분석']},
    {step: '04', lines: ['결과 전송 및', '이력 관리']},
] as const

// 교차를 켜는 지점 — 트랙을 얼마나 굴렸는지가 아니라 "굴렸는가"만 본다. 스크롤 양에 비례해 긁히지
// 않고, 진입 리빌과 같은 1초 전환으로 한 번에 재생된다. 되돌리면 원래 배치로 다시 전환된다.
// 트랙은 남은 스크롤로 제스처를 흡수해, 전환이 시작되자마자 3섹션으로 넘어가지 않게 한다.
const SWAP_THRESHOLD = 0.05

// 진입 상태 — 사진 자체를 자르지 않고 사진 위의 단색 패널 네 장을 여닫는다. 섹션 활성 직후에는
// cover=1이고, 이미지 준비 뒤 data-entry-ready를 켜면 0으로 열린다. 사진은 패널 아래에서 처음부터
// 전체 렌더링되므로 최초 clip 해제 순간의 래스터링 번쩍임이 생기지 않는다.
// 페이저가 꺼진 화면과 모션 최소화 환경에서는 규칙이 적용되지 않아 늘 0(열린 상태)이다. [KWCAG 6.3.1]
const ENTRY_STATE_CLASS = [
    '[--intro-entry-cover:0]',
    'motion-safe:pager-on:[[data-stack-page]:not([data-entry-ready=true])_&]:[--intro-entry-cover:1]',
].join(' ')

// 왼쪽 사진 clip은 교차 시 축소에만 사용한다. 최초 진입과 오른쪽 사진의 교차 확대는
// IntroImageCover가 담당해 이미지 래스터링과 애니메이션을 분리한다.
const SWAP_TRANSITION_CLASS =
    'motion-safe:will-change-[clip-path] motion-safe:transition-[clip-path] motion-safe:duration-1000 motion-safe:ease-stack'
const SHRINK_CLASS = '[clip-path:inset(calc(var(--intro-progress)*50%)_round_var(--mask-radius))]'
const ENTRY_COVER_PANEL_CLASS =
    'bg-main-intro-surface absolute opacity-[0.999] will-change-[scale] transition-[scale] duration-1000 ease-stack motion-reduce:transition-none'
const COVER_SCALE_CLASS = {
    entry: {
        vertical: 'scale-y-[var(--intro-entry-cover)]',
        horizontal: 'scale-x-[var(--intro-entry-cover)]',
    },
    swap: {
        vertical: 'scale-y-[calc(1_-_var(--intro-progress))]',
        horizontal: 'scale-x-[calc(1_-_var(--intro-progress))]',
    },
} as const

// 왼쪽 아래층 카피 — 진입 중에는 사진이 접혀 있어 그대로 두면 밑의 카피가 드러난다. 교차 진행도에
// 맞춰 페이드해 진입 때는 감춰 두고, 사진이 줄어드는 동안 함께 나타나게 한다.
const BASE_COPY_FADE_CLASS =
    '[opacity:var(--intro-progress)] motion-safe:transition-opacity motion-safe:duration-1000 motion-safe:ease-stack'

// 셀 — 시안의 588×686 사각형. 두 겹(아래/위)이 이 상자를 같이 채운다.
// 라운딩·클리핑을 두지 않는다 — 모서리는 위층 사진의 clip-path 가 혼자 만든다(위 주석 참고).
// 아래층 카피는 면색이 없어 모서리를 깎을 것이 없고, 본문은 여백 안쪽이라 모서리에 닿지 않는다.
//
// flex + aspect 조합의 이유 — 카피를 흐름에 두면 그리드 항목의 자동 최소 크기가 걸려, 컬럼이 좁아
// 카피가 시안 비율보다 커지는 화면에서는 셀이 카피만큼 늘어난다(잘리지 않는다). 반대로 여유가
// 있으면 aspect 가 이겨 시안의 588:686 이 그대로 나온다. 카피는 flex 항목이라 셀 높이를 채운다.
const CELL_CLASS = 'relative col-span-full flex aspect-[588/686]'
const LEFT_SLOT_CLASS = 'md:col-span-4 md:col-start-1 md:row-start-1 xl:col-span-6 xl:col-start-1'
const RIGHT_SLOT_CLASS = 'md:col-span-4 md:col-start-5 md:row-start-1 xl:col-span-6 xl:col-start-7'

// 교차는 페이저가 켜진 화면에서만 한다 — 안쪽 스크롤 트랙이 있어야 스크럽할 것이 생긴다.
// 폭 기준을 따로 두지 않는 이유: 셀이 카피 높이만큼 늘어나므로 컬럼이 좁아도 잘리지 않는다.
// (xl 로 묶었더니 1280px 창이 스크롤바 6px 때문에 레이아웃 폭 1274 가 되어 교차가 통째로 꺼졌다.)
// 페이저가 꺼진 화면은 레퍼런스가 좁은 화면에서 clip-path 를 끄는 것과 같게 아래층을 렌더하지 않는다.
const CROSSOVER_IMAGE_CLASS = 'hidden pager-on:block'
const CROSSOVER_COPY_CLASS = 'hidden pager-on:flex'

// overflow-hidden 을 두지 않는다 — 아래 배치 프레임은 clip-path 가 이미 상자 밖으로 못 나가게 자르고,
// 둘을 겹치면 같은 직선 모서리를 두 번 깎아 서브픽셀 경계가 실선으로 드러난다.
const IntroImage = ({
    className,
    preload = false,
    onLoad,
}: {
    className?: string
    preload?: boolean
    onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
}) => (
    <div className={cn('relative', className)}>
        {/* 시안과 같은 구도를 만드는 배치 프레임. Figma 에서 사진은 마스크(588×686)보다 크게
            1415×796 로 깔리고 마스크 왼쪽·위보다 574·89px 앞서 시작한다. object-fit 만으로는
            이 배율(=cover 보다 약 1.16배 확대)을 낼 수 없어 프레임을 시안 비율의 %로 잡는다.
            마스크 비율이 588:686 로 고정이라 화면 크기가 달라져도 구도가 유지된다.
              w 1415/588 · h 796/686 · left -574/588 · top -89/686
            프레임 비율(1415:796)이 사진 원본 비율과 같아 안쪽 object-cover 는 추가로 자르지 않는다.
            장식 이미지라 alt="" 로 둔다([KWCAG 5.1.1]). */}
        {/* 최초 요청에서 Next 이미지 최적화를 기다리지 않도록 표시 크기에 맞춘 전용 WebP를 직접 사용한다.
            왼쪽 인스턴스는 Next 16의 preload로 head에서 먼저 요청한다. 오른쪽도 같은 src라 네트워크
            요청과 디코딩 결과를 공유한다. */}
        <div className="absolute top-[-12.9738%] left-[-97.619%] h-[116.035%] w-[240.6463%]">
            <Image src={sectionBg} alt="" fill preload={preload} unoptimized onLoad={onLoad} className="object-cover" />
        </div>
    </div>
)

// 이미지 위의 단색 패널 네 장이 가장자리 방향으로 줄어들며 중앙부터 사진을 드러낸다.
// 이미지 자체는 처음부터 전체 면적으로 렌더링되므로 최초 표시 시 텍스처 업로드로 인한 번쩍임이 없다.
const IntroImageCover = ({mode, className}: {mode: keyof typeof COVER_SCALE_CLASS; className?: string}) => (
    <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl', className)}
    >
        <span
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-x-0 top-0 h-1/2 origin-top',
                COVER_SCALE_CLASS[mode].vertical,
            )}
        />
        <span
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-x-0 bottom-0 h-1/2 origin-bottom',
                COVER_SCALE_CLASS[mode].vertical,
            )}
        />
        <span
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-y-0 left-0 w-1/2 origin-left',
                COVER_SCALE_CLASS[mode].horizontal,
            )}
        />
        <span
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-y-0 right-0 w-1/2 origin-right',
                COVER_SCALE_CLASS[mode].horizontal,
            )}
        />
    </div>
)

// 카피 — 두 벌이 같은 내용이라 접근성 트리에는 한 벌만 남긴다. 사본은 aria-hidden 으로 두고
// id 도 주지 않는다(중복 id 금지 [KWCAG 8.1.1]). 원본은 스크롤 위치와 무관하게 항상 트리에 있어
// 스크린리더 사용자는 교차 여부와 상관없이 같은 내용을 한 번 듣는다.
const IntroCopy = ({className, isDuplicate = false}: {className: string; isDuplicate?: boolean}) => (
    <div aria-hidden={isDuplicate || undefined} className={className}>
        <p className="typo-body-xl-bold text-main-intro-accent">기업회원을 위한 플랫폼</p>
        {/* 크기는 28~40px 사이에서 유동 축소한다. typo-* 는 생성기가 찍는 plain 클래스라 반응형
            variant 를 못 받는다(SHADCN.md 타이포 유틸 예외 — 메인페이지 목업 한시적 허용). */}
        <h2
            id={isDuplicate ? undefined : 'service-intro-title'}
            className="text-main-intro-foreground mt-6 text-[clamp(--spacing(7),calc(--spacing(4)+2.2vw),--spacing(10))] leading-normal font-bold break-keep"
        >
            기업의 기술 가치와
            <br />
            지원사업 혜택이 궁금하신가요?
        </h2>
        <p className="typo-title-m-medium text-main-intro-foreground-subtle mt-3 break-keep">
            기업은 자가진단과 전문가 평가를 통해 기술역량을 확인할 수 있습니다.
        </p>

        {/* 카피와 단계 목록 사이의 유동 여백. 시안에서는 188px 이고 화면이 낮아지면 48px 까지
            줄어든다. margin 으로는 상한과 하한을 동시에 줄 수 없어 빈 요소로 둔다. */}
        <div aria-hidden="true" className="min-h-12 flex-1 md:max-h-47" />

        <div className="flex flex-col">
            <h3 className="text-main-intro-foreground flex items-center gap-2">
                <BriefcaseBusiness aria-hidden="true" className="size-icon-md" />
                <span lang="en" className="typo-body-xl-bold">
                    For Business
                </span>
            </h3>
            <ol className="border-main-intro-border mt-11 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-2 md:grid-cols-4">
                {BUSINESS_STEPS.map(({step, lines}) => (
                    <li key={step} className="flex flex-col">
                        <span className="typo-title-m-bold text-main-intro-accent">{step}</span>
                        <span className="typo-body-l-medium text-main-intro-foreground-subtle mt-1 break-keep">
                            {lines[0]}
                            <br />
                            {lines[1]}
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    </div>
)

// 두 번째 화면(기업회원 소개). 시안이 페이지 테마(mainpage=다크)와 무관하게 밝은 면으로 고정되는
// 구간이라, 테마 스코프를 바꾸지 않고 main-intro-* 시맨틱 토큰으로 색을 고정한다([PB-06] 유지).
//
// 레이아웃(1920 시안) — 588 + 24 + 588 = 1200 이라 그대로 grid-layout 의 두 컬럼에 얹힌다.
// 콘텐츠 높이는 시안의 이미지 마스크(588×686)가 정하고, 그보다 낮은 화면에서는 max-h-full 로 줄어든다.
//
// 인터랙션은 두 가지다(레퍼런스 oneretinaclinic 의 Our Value 섹션).
//  · 진입 리빌 — 섹션이 활성 스택 페이지가 될 때 사진 위의 단색 패널이 조리개처럼 열린다.
//  · 좌우 교차 — 안쪽 스크롤 트랙을 한 번 굴리면 왼쪽 사진의 조리개가 줄어들며 밑의 카피가 드러나고,
//    동시에 오른쪽 사진의 조리개가 커지며 카피를 덮는다. 결과적으로 좌우 배치가 뒤바뀐다.
//    스크롤 양에 비례해 긁히지 않고 진입 리빌과 같은 1초 전환으로 재생된다.
// StackPager 는 활성 페이지가 안쪽으로 더 스크롤될 수 있으면 페이지를 넘기지 않으므로
// (SCROLLABLE_OVERFLOW), 트랙을 다 굴린 뒤에야 3섹션으로 넘어간다.
const MainSecondSection = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const imageReadyFrameRef = useRef(0)
    const imageReadyStartedRef = useRef(false)
    const [entryImageReady, setEntryImageReady] = useState(false)

    const confirmEntryImageReady = useCallback((image: HTMLImageElement) => {
        if (imageReadyStartedRef.current) return
        imageReadyStartedRef.current = true

        void image
            .decode()
            .catch(() => undefined)
            .then(() => {
                // decode 직후에도 합성 레이어에 반영되지 않을 수 있어 실제 페인트 프레임까지 보장한다.
                imageReadyFrameRef.current = window.requestAnimationFrame(() => {
                    imageReadyFrameRef.current = window.requestAnimationFrame(() => {
                        setEntryImageReady(true)
                    })
                })
            })
    }, [])

    const handleEntryImageLoad = useCallback(
        (event: SyntheticEvent<HTMLImageElement>) => {
            confirmEntryImageReady(event.currentTarget)
        },
        [confirmEntryImageReady],
    )

    // preload가 hydration보다 먼저 끝난 경우 load 이벤트를 놓칠 수 있어 complete 상태도 함께 확인한다.
    useEffect(() => {
        const image = sectionRef.current?.querySelector<HTMLImageElement>('img')
        if (image?.complete && image.naturalWidth > 0) confirmEntryImageReady(image)

        return () => window.cancelAnimationFrame(imageReadyFrameRef.current)
    }, [confirmEntryImageReady])

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        let entryRevealFrame = 0
        let entrySequence = 0

        const syncEntryReveal = () => {
            const currentSequence = ++entrySequence
            window.cancelAnimationFrame(entryRevealFrame)
            delete section.dataset.entryReady

            if (section.dataset.stackState !== 'active' || !entryImageReady) {
                return
            }

            // 별도 사본으로 미리 합성된 이미지를 닫힌 상태에서 두 프레임 확정한 다음 리빌한다.
            entryRevealFrame = window.requestAnimationFrame(() => {
                entryRevealFrame = window.requestAnimationFrame(() => {
                    if (currentSequence === entrySequence && section.dataset.stackState === 'active') {
                        section.dataset.entryReady = 'true'
                    }
                })
            })
        }

        // 스크롤 양을 그대로 쓰지 않고 0/1 로만 뒤집는다 — 전환 자체는 CSS transition 이 재생한다.
        // 스크롤 이벤트에서 바로 쓴다. 브라우저가 이미 프레임당 한 번으로 묶어 보내고 하는 일도
        // 커스텀 프로퍼티 한 줄이라, requestAnimationFrame 으로 한 겹 더 미룰 이유가 없다.
        const update = () => {
            const maxScroll = section.scrollHeight - section.clientHeight
            const scrolled = maxScroll > 0 ? section.scrollTop / maxScroll : 0
            section.style.setProperty('--intro-progress', scrolled > SWAP_THRESHOLD ? '1' : '0')
        }

        // 브라우저가 새로고침 때 안쪽 트랙의 스크롤 위치를 복원하면, 첫 진입에 이미 교차가 끝난 상태로
        // 시작해 전환 없이 뚝 바뀐 것처럼 보인다. 처음 한 번 트랙을 되감아 항상 같은 지점에서 시작한다.
        section.scrollTop = 0
        update()
        const sectionStateObserver = new MutationObserver(syncEntryReveal)
        sectionStateObserver.observe(section, {attributes: true, attributeFilter: ['data-stack-state']})
        syncEntryReveal()
        section.addEventListener('scroll', update, {passive: true})
        return () => {
            entrySequence += 1
            window.cancelAnimationFrame(entryRevealFrame)
            sectionStateObserver.disconnect()
            section.removeEventListener('scroll', update)
            delete section.dataset.entryReady
        }
    }, [entryImageReady])

    return (
        <section
            ref={sectionRef}
            id="service-intro"
            tabIndex={-1}
            data-stack-page
            aria-labelledby="service-intro-title"
            // pager-off:snap-start — 페이저가 꺼진 화면의 스크롤 스냅 지점(StackPager 가 컨테이너 담당).
            // pager-on:overflow-y-auto — 교차용 안쪽 스크롤 트랙. 페이저는 이 값이 auto/scroll 일 때만
            // 양보하므로, 트랙이 없는 화면에서는 한 번의 제스처가 그대로 3섹션으로 넘어간다.
            // --intro-progress 기본 0 은 JS 가 붙기 전과 트랙이 없는 화면의 상태다(위층이 열린 채).
            className={cn(
                stackPageClassName,
                'bg-main-intro-surface pager-off:snap-start pager-on:overflow-y-auto relative flex min-h-dvh flex-col py-28 md:h-dvh md:min-h-0 md:overflow-hidden md:py-0',
                '[--intro-progress:0] [--mask-radius:var(--radius-3xl)]',
            )}
        >
            {/* 스크롤 트랙 — 교차가 있는 화면에서만 2화면 높이가 되고, 안쪽 화면이 sticky 로 고정된다. */}
            <div className="pager-on:h-[200dvh] pager-on:flex-none flex-1">
                <div className="pager-on:sticky pager-on:top-0 pager-on:h-dvh flex h-full flex-col justify-center">
                    {/* content-layout — 헤더·1섹션·3섹션과 같은 콘텐츠 폭 셸. grid-layout 만 쓰면 md 티어에서
                        그리드 자체 container(792)로 좁아져 헤더와 좌우 시작선이 어긋난다. */}
                    <div className="grid-layout content-layout w-full gap-y-12 md:max-h-full md:grid-rows-1 md:gap-y-0">
                        {/* 왼쪽 셀 — 아래층 카피 위에 사진이 얹혀 있다. 진입 때 사진이 열리고, 스크롤하면
                            다시 줄어들며 아래층 카피가 드러난다. 진입은 패널, 교차 축소는 clip이 맡는다. */}
                        <div className={cn(ENTRY_STATE_CLASS, CELL_CLASS, 'max-h-full', LEFT_SLOT_CLASS)}>
                            <IntroCopy
                                isDuplicate
                                className={cn(CROSSOVER_COPY_CLASS, BASE_COPY_FADE_CLASS, 'w-full flex-col md:pt-23')}
                            />
                            <IntroImage
                                preload
                                onLoad={handleEntryImageLoad}
                                className={cn('absolute inset-0', SHRINK_CLASS, SWAP_TRANSITION_CLASS)}
                            />
                            <IntroImageCover mode="entry" />
                        </div>

                        {/* 오른쪽 셀 — 사진은 처음부터 렌더링하고, 패널이 열리며 밑의 카피를 덮는다. */}
                        <div className={cn(CELL_CLASS, 'max-h-full', RIGHT_SLOT_CLASS)}>
                            <IntroCopy className="flex w-full flex-col md:pt-23" />
                            <IntroImage
                                className={cn(
                                    CROSSOVER_IMAGE_CLASS,
                                    'absolute inset-0 transform-gpu will-change-transform',
                                )}
                            />
                            <IntroImageCover mode="swap" className={CROSSOVER_IMAGE_CLASS} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MainSecondSection
