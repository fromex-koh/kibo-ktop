'use client'

import {useCallback, useEffect, useRef, useState, type SyntheticEvent} from 'react'
import Image, {type StaticImageData} from 'next/image'
import consultingPhoto from '@public/images/main-hero/service-intro-consulting.webp'
import selfDiagnosisPhoto from '@public/images/main-hero/service-intro-self-diagnosis.webp'
import {stackPageClassName} from '@/components/theme/stack-pager.variants'
import {STACK_PAGER_TRANSITION_DURATION_MS} from '@/components/custom/stack-pager'
import {cn} from '@/lib/utils'

// 좌우 교차로 번갈아 보여주는 두 벌의 카피 — 시안 [메인] 02-1(기업)·02-2(금융·기관).
// 레이블·제목·설명·레일 제목·단계가 모두 대상에 따라 다르다.
// 레일 위 표식은 세 단계 모두에 찍고, 채움이 지나가는 순서대로 켠다.
const INTRO_SCREENS = [
    {
        key: 'corp',
        label: '중소벤쳐기업',
        title: ['내 기술 3분만에 진단하고', '금융부터 정책사업까지 활용하세요'],
        description: '기업은 자가진단과 전문가 평가를 통해 기술역량을 확인할 수 있습니다.',
        photo: selfDiagnosisPhoto,
        railTitle: '진단부터 활용까지',
        steps: [
            {step: '01', label: '나의 기술 수준 확인'},
            {step: '02', label: '금융 투자 기회 확대'},
            {step: '03', label: '정책 사업 참여'},
        ],
    },
    {
        key: 'org',
        label: '금융·기관',
        title: ['기술기반 정보로 성장 가능성이', '높은 우수 기업을 발굴하세요'],
        description: '조건에 맞는 기업 검색부터 지원 대상 선정까지, 데이터 기반 의사결정을 지원합니다.',
        photo: consultingPhoto,
        railTitle: '데이터 기반 기업 발굴',
        steps: [
            {step: '01', label: '투자 여신 심사 활용'},
            {step: '02', label: '보증 추천 연계'},
            {step: '03', label: '지원사업 선정 활용'},
        ],
    },
] as const

type IntroScreen = (typeof INTRO_SCREENS)[number]

// 교차를 켜는 지점 — 트랙을 얼마나 굴렸는지가 아니라 "굴렸는가"만 본다. 스크롤 양에 비례해 긁히지
// 않고, 진입 리빌과 같은 1초 전환으로 한 번에 재생된다. 되돌리면 원래 배치로 다시 전환된다.
// 트랙은 남은 스크롤로 제스처를 흡수해, 전환이 시작되자마자 3섹션으로 넘어가지 않게 한다.
const SWAP_THRESHOLD = 0.05

// 진입 상태 — 사진 자체를 자르지 않고 사진 위의 단색 패널 네 장을 여닫는다. 섹션 활성 직후에는
// cover=1이고, 이미지 준비 뒤 data-entry-ready를 켜면 0으로 열린다. 사진은 패널 아래에서 처음부터
// 전체 렌더링되므로 최초 clip 해제 순간의 래스터링 번쩍임이 생기지 않는다.
// 페이저가 꺼진 화면과 모션 최소화 환경에서는 규칙이 적용되지 않아 늘 0(열린 상태)이다. [KWCAG 6.3.1]
//
// 조리개를 쓰는 사진은 오른쪽 셀 하나지만 변수는 섹션에 둔다 — 진행 레일이 "조리개가 다 열렸는가"를
// 같은 변수로 읽어야 하고, 그 레일은 왼쪽 카피와 모바일 흐름에도 있다.
// 조건은 섹션 자신의 상태라 &:not(...) 으로 쓴다 — 후손 선택자로 두면 이 클래스를 얹은 섹션에는
// 규칙이 걸리지 않는다(자기 자신은 자기 후손이 아니다).
const ENTRY_STATE_CLASS = [
    '[--intro-entry-cover:0]',
    'motion-safe:pager-on:[&:not([data-entry-ready=true])]:[--intro-entry-cover:1]',
].join(' ')

// 사진은 교차 내내 전체 크기로 합성해 두고, 진입·교차 양쪽 모두 IntroImageCover가 담당한다.
// 움직이는 clip-path가 큰 이미지 레이어를 다시 합성하면서 생기던 번쩍임을 막기 위함이다.
// 라운딩은 사진 자체에만 둔다. 커버 패널이 같은 라운딩에 잘리면 안티에일리어싱 경계가 드러난다.
const STATIC_ROUND_CLASS = '[clip-path:inset(0_round_var(--mask-radius))]'
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
    conceal: {
        vertical: 'scale-y-[var(--intro-progress)]',
        horizontal: 'scale-x-[var(--intro-progress)]',
    },
} as const

// 진행 레일 — 앞의 조리개가 다 열린 뒤에 이어서 단계별로 재생한다. 카피가 여러 번 쓰이는데
// 각자 앞에 오는 조리개가 달라, 조리개를 움직이는 바로 그 변수를 --rail-on(0=비움 / 1=채움)으로 받는다.
//  · entry — 진입 리빌. 조리개가 닫혀 있으면(--intro-entry-cover:1) 0, 다 열리면 1.
//            여기에 교차 진행도까지 곱한다 — 첫 화면은 교차로 넘어가면 보이지 않으므로 레일도 함께
//            비우고, 되돌아오면 처음부터 다시 재생한다. 곱하지 않으면 두 번째 화면에 갔다 돌아왔을 때
//            이미 다 채워진 레일이 그대로 남는다. 교차가 없는 화면(모바일)은 진행도가 늘 0 이라
//            (1 - 0) = 1 로 종전과 같다.
//  · swap  — 좌우 교차. --intro-progress 를 그대로 쓴다
// 커버·카피 페이드와 같은 변수를 보므로 상태가 어긋날 수 없고, 조리개가 없는 화면(페이저 off·모션
// 최소화)에서는 두 변수 모두 채움 쪽 값이라 처음부터 채워진 상태다. [KWCAG 6.3.1]
const RAIL_ON_CLASS = {
    entry: '[--rail-on:calc((1_-_var(--intro-entry-cover))_*_(1_-_var(--intro-progress)))]',
    swap: '[--rail-on:var(--intro-progress)]',
} as const

// 단계별 재생 순서 — 조리개(1초)가 끝나면 표식 → 그 표식에서 다음 표식까지의 채움 → 다음 표식 …
// 순으로 한 마디씩 넘어간다. 한 단계는 0.6초 간격이고, 마디(0.5초)가 다음 표식(0.3초)에 살짝
// 겹치게 두어 마디 사이가 끊겨 보이지 않게 한다. 마지막 마디는 2.35초에 시작해 2.85초에 끝난다.
//
// 지연은 방향마다 다르다 — transition-delay 는 바뀐 뒤 상태의 값을 쓰므로, --rail-on 으로 두 값을
// 섞으면 한 클래스로 양방향을 적을 수 있다: 채울 때(1)는 앞의 값, 비울 때(0)는 뒤의 값이 남는다.
//
// 비우는 쪽은 채우는 순서를 거꾸로 되감는다 — 마지막 마디가 먼저 사라지고 첫 표식이 마지막에 꺼진다.
// 되감기 값은 채우기 시간표를 뒤집어 얻는다(끝나는 시각 2850ms 기준: 지연 = 2850 - (시작 + 길이)).
// 조리개를 기다릴 필요가 없어 되감기는 1.85초에 끝난다.
//
// 단, 되감기는 섹션 안에서 좌우로 교차할 때만이다. 섹션을 아예 벗어나면(조리개가 다시 닫혀
// --intro-entry-cover 가 1) 되감기 지연과 길이를 모두 0 으로 만들어 그 자리에서 리셋한다 —
// 되감는 1.85초 안에 사용자가 다시 들어오면 반쯤 지워진 레일에서 이어져 버벅이기 때문이다.
// 되감기 항의 (1 - --intro-entry-cover) 가 "섹션 안에서만 되감는다"를 만든다. 클래스 이름은 Tailwind 가
// 소스에서 그대로 찾아 만들어야 해서 문자열을 쪼개 조립하지 않고 통째로 적는다.
const RAIL_MARKER_DELAY_CLASS = [
    '[transition-delay:calc(var(--rail-on)*1000ms_+_(1_-_var(--rail-on))*(1_-_var(--intro-entry-cover))*1550ms)]',
    '[transition-delay:calc(var(--rail-on)*1600ms_+_(1_-_var(--rail-on))*(1_-_var(--intro-entry-cover))*950ms)]',
    '[transition-delay:calc(var(--rail-on)*2200ms_+_(1_-_var(--rail-on))*(1_-_var(--intro-entry-cover))*350ms)]',
] as const
const RAIL_SEGMENT_DELAY_CLASS = [
    '[transition-delay:calc(var(--rail-on)*1150ms_+_(1_-_var(--rail-on))*(1_-_var(--intro-entry-cover))*1200ms)]',
    '[transition-delay:calc(var(--rail-on)*1750ms_+_(1_-_var(--rail-on))*(1_-_var(--intro-entry-cover))*600ms)]',
    '[transition-delay:calc(var(--rail-on)*2350ms)]',
] as const

// 전환 길이도 같은 규칙이다 — 다만 "채우는 쪽"은 조리개 상태와 무관하게 항상 제 길이를 쓴다.
// 조리개만 보고 0 으로 만들면, 아래(3섹션)에서 올라와 2-2 로 들어올 때 교차 진행도가 조리개보다
// 먼저 켜지는 순간 레일이 통째로 튀어 계단식 재생이 사라진다. 비우는 쪽만, 그것도 섹션을 벗어난
// 경우에만 0 이 된다.
const RAIL_MARKER_DURATION_CLASS =
    '[transition-duration:calc((var(--rail-on)_+_(1_-_var(--rail-on))*(1_-_var(--intro-entry-cover)))*300ms)]'
const RAIL_SEGMENT_DURATION_CLASS =
    '[transition-duration:calc((var(--rail-on)_+_(1_-_var(--rail-on))*(1_-_var(--intro-entry-cover)))*500ms)]'

// 채움 마디의 폭 — 표식은 단계 그리드의 컬럼 시작점에 있으므로, 앞의 두 마디는 컬럼 사이 간격
// (gap-x-3.5 = 14px)까지 건너야 다음 표식에 닿는다. 마지막 마디는 레일 끝까지 간다.
const RAIL_SEGMENT_WIDTH_CLASS = [
    'w-[calc(100%+var(--spacing)*3.5)]',
    'w-[calc(100%+var(--spacing)*3.5)]',
    'w-full',
] as const

// 사진 아래에 깔리는 카피 — 진입 중에는 사진이 접혀 있어 그대로 두면 밑의 카피가 드러난다. 교차
// 진행도에 맞춰 페이드해 진입 때는 감춰 두고, 사진이 줄어드는 동안 함께 나타나게 한다.
const BASE_COPY_FADE_CLASS =
    '[opacity:var(--intro-progress)] motion-safe:transition-opacity motion-safe:duration-1000 motion-safe:ease-stack'
const SWAP_COPY_FADE_CLASS =
    '[opacity:calc(1_-_var(--intro-progress))] motion-safe:transition-opacity motion-safe:duration-1000 motion-safe:ease-stack'

// 셀 — 시안의 588×640 사각형. 두 겹(아래/위)이 이 상자를 같이 채운다.
// 라운딩·클리핑을 두지 않는다 — 모서리는 위층 사진의 clip-path 가 혼자 만든다(위 주석 참고).
// 아래층 카피는 면색이 없어 모서리를 깎을 것이 없고, 본문은 여백 안쪽이라 모서리에 닿지 않는다.
//
// flex + aspect 조합의 이유 — 카피를 흐름에 두면 그리드 항목의 자동 최소 크기가 걸려, 컬럼이 좁아
// 카피가 시안 비율보다 커지는 화면에서는 셀이 카피만큼 늘어난다(잘리지 않는다). 반대로 여유가
// 있으면 aspect 가 이겨 시안의 588:640 이 그대로 나온다. 카피는 flex 항목이라 셀 높이를 채운다.
//
const CELL_ASPECT_CLASS = 'aspect-[588/640]'

// 모바일 사진은 셀 비율(588:640)이 아니라 3섹션 모바일 사진과 같은 590:380 을 쓴다.
// 교차가 없어 사진을 단독으로 놓으므로, 한 화면 안에서 두 섹션의 사진 인상이 같아야 한다.
const MOBILE_PHOTO_ASPECT_CLASS = 'aspect-[590/380]'
// w-full 이 필요한 이유 — aspect 와 max-h-full 이 함께 걸리면 높이가 잘릴 때 비율을 지키려고 너비까지
// 함께 줄어든다(1280×720 에서 588 → 507). 그러면 사진이 그리드 끝선에 못 닿고 카피 폭도 시안(508)보다
// 좁아진다. 너비를 컬럼에 고정해 두면 잘리는 쪽은 높이뿐이고, 사진은 object-cover 가 채운다.
//
// xl 미만(태블릿)에서 비율을 푸는 이유 — 컬럼이 342 까지 좁아지면 카피가 시안 비율보다 훨씬 길어진다
// (768×1024 에서 셀 372 vs 카피 746). 비율을 고정하면 카피가 셀 밖으로 흘러넘치고 반대쪽 사진은
// 짧게 끝나 아래가 비어 보인다. 높이를 카피가 정하게 두면 두 셀이 같은 높이로 맞는다.
const CELL_CLASS = cn('relative col-span-full flex w-full max-xl:aspect-auto', CELL_ASPECT_CLASS)
const LEFT_SLOT_CLASS = 'md:col-span-4 md:col-start-1 md:row-start-1 xl:col-span-6 xl:col-start-1'
const RIGHT_SLOT_CLASS = 'md:col-span-4 md:col-start-5 md:row-start-1 xl:col-span-6 xl:col-start-7'

// 카피 폭 — 시안(1920×1080)에서 카피는 컬럼(588) 전체를 쓰지 않고 사진 쪽으로 물러나 있다.
// 물러나는 쪽은 사진의 반대편이라 1영역은 끝(pe), 2영역은 시작(ps) 에 준다.
//  · 1영역 508(= 588 - 80) — 레일(3×160 + 간격 2×14)과 설명문(437)이 모두 508 안에 든다.
//  · 2영역 518(= 588 - 70) — 설명문 "조건에 맞는 …" 은 한 줄이 517.5px 라 508 에서 두 줄로 접힌다.
//    시안도 이 설명문만 518 로 두어 콘텐츠 우측선(1560)을 10px 넘겨 놨는데, 넘기는 대신 카피 열을
//    10px 넓혀 우측선을 그리드에 맞춘다(레일 컬럼은 160 → 163.3 으로 늘어난다).
// 컬럼이 342 로 좁아지는 태블릿에서는 두 영역 모두 같은 비율(약 13.6%)인 40 을 쓴다 — 80 을 그대로
// 빼면 262 만 남아 제목이 다섯 줄로 접힌다.
const COPY_INSET_CLASS = {
    firstArea: 'md:pe-10 xl:pe-20',
    secondArea: 'md:ps-10 xl:ps-17.5',
} as const

// 교차는 페이저가 켜진 화면에서만 한다 — 안쪽 스크롤 트랙이 있어야 스크럽할 것이 생긴다.
// 폭 기준을 따로 두지 않는 이유: 셀이 카피 높이만큼 늘어나므로 컬럼이 좁아도 잘리지 않는다.
// (xl 로 묶었더니 1280px 창이 스크롤바 6px 때문에 레이아웃 폭 1274 가 되어 교차가 통째로 꺼졌다.)
// 페이저가 꺼진 화면은 레퍼런스가 좁은 화면에서 clip-path 를 끄는 것과 같게 아래층을 렌더하지 않는다.
const CROSSOVER_IMAGE_CLASS = 'hidden pager-on:block'
const CROSSOVER_COPY_CLASS = 'hidden pager-on:flex'

// 사진 — 마스크(588:640 = 0.919)와 원본(1764:1920 = 0.919)의 비율이 같아 object-cover 가 한 픽셀도
// 자르지 않는다. 예전에는 가로형 원본을 시안의 좁은 마스크에 맞추려고 2.4배 확대 프레임을 얹었는데,
// 세로형 원본에는 그대로 두면 가로 띠만 남는다.
//
// overflow-hidden 을 두지 않는다 — object-fit 이 이미 상자 안에서 자르고, clip-path 와 같은 직선
// 모서리를 두 번 깎으면 서브픽셀 경계가 실선으로 드러난다.
// 장식 이미지라 alt="" 로 둔다([KWCAG 5.1.1]).
//
// 두 장 모두 preload 로 head 에서 먼저 요청한다. 이 섹션은 활성화 전까지 화면 밖(스택 레이어)이라
// 기본 lazy 로 두면 교차가 시작될 때 아직 받는 중이라 빈 상자가 열린다.
// 최초 요청에서 Next 이미지 최적화를 기다리지 않도록 원본 WebP 를 그대로 쓴다(unoptimized).
// isEntryImage — 진입 리빌의 준비 여부를 판단하는 기준 사진이다. 화면마다 렌더되는 사진 수가 달라
// "섹션의 첫 img" 로 찾으면 모바일 사진을 집을 수 있어, 조리개가 덮고 있는 사진을 직접 표시해 둔다.
const IntroImage = ({
    photo,
    className,
    isEntryImage = false,
    onLoad,
}: {
    photo: StaticImageData
    className?: string
    isEntryImage?: boolean
    onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
}) => (
    <div data-entry-image={isEntryImage || undefined} className={cn('relative', className)}>
        <Image src={photo} alt="" fill preload unoptimized onLoad={onLoad} className="object-cover" />
    </div>
)

// 이미지 위의 단색 패널 네 장이 가장자리 방향으로 줄어들며 중앙부터 사진을 드러낸다.
// 이미지 자체는 처음부터 전체 면적으로 렌더링되므로 최초 표시 시 텍스처 업로드로 인한 번쩍임이 없다.
//
// 이 래퍼는 자르지도 둥글게 하지도 않는다 — 패널은 섹션 배경과 같은 색이라 사진 밖에서는 어차피
// 보이지 않고, 여기에 라운딩을 주면 같은 상자를 두 번 둥글게 깎아(사진 clip 과 겹쳐) 모서리에서
// 아래층 안티에일리어싱이 실선처럼 드러난다. 패널이 opacity 로 별도 레이어라 더 도드라진다.
//
// -inset-px 로 사진보다 1px 크게 잡는다. 가장자리가 정확히 겹치면 소수점 픽셀에서 패널과 사진이
// 각각 부분만 덮어 사진이 실선처럼 비친다. 1px 넘긴 자리는 배경색이라 보이지 않는다.
const IntroImageCover = ({mode}: {mode: keyof typeof COVER_SCALE_CLASS}) => (
    <div aria-hidden="true" className="pointer-events-none absolute -inset-px z-10">
        <span
            data-intro-aperture-panel
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-x-0 top-0 h-1/2 origin-top',
                COVER_SCALE_CLASS[mode].vertical,
            )}
        />
        <span
            data-intro-aperture-panel
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-x-0 bottom-0 h-1/2 origin-bottom',
                COVER_SCALE_CLASS[mode].vertical,
            )}
        />
        <span
            data-intro-aperture-panel
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-y-0 left-0 w-1/2 origin-left',
                COVER_SCALE_CLASS[mode].horizontal,
            )}
        />
        <span
            data-intro-aperture-panel
            className={cn(
                ENTRY_COVER_PANEL_CLASS,
                'inset-y-0 right-0 w-1/2 origin-right',
                COVER_SCALE_CLASS[mode].horizontal,
            )}
        />
    </div>
)

// 카피(시안 [메인] 02-1·02-2) — 두 화면이 서로 다른 대상을 향하므로 내용도 한 벌씩 따로 쓴다.
// 색은 시안(다크 면·흰 텍스트·민트 강조)을 main-intro-* 토큰으로 그대로 옮겼다
// (강조=accent, 제목·레이블·본문=foreground/foreground-subtle, 레일=border).
//
// 리드와 진행 레일을 나눠 둔 이유 — md 이상은 둘 사이를 유동 여백으로 벌려 한 화면에 맞추지만,
// 모바일은 흐름대로 한 칸씩 쌓아 사진과 번갈아 배치한다.
const IntroLead = ({screen, headingId}: {screen: IntroScreen; headingId?: string}) => (
    <div className="flex flex-col">
        {/* 대상(중소벤쳐기업·금융·기관)은 아래 제목의 머리말이라 제목 안에 둔다 — 밖에 굵은 문단으로
            두면 제목처럼 보이는데 제목이 아닌 글이 되어 WAVE 가 "Possible heading" 으로 잡고,
            스크린리더의 제목 이동에서도 빠진다[6.4.2]. 크기·굵기는 시안 그대로다.
            크기는 28~36px 사이에서 유동 축소한다(시안 36px). 굵기는 시안대로 ExtraBold(800) 다.
            typo-* 는 반응형 variant 를 못 받는다 — SHADCN.md 타이포 유틸 예외(메인페이지 목업 한시적 허용). */}
        <h2 id={headingId} className="text-main-intro-foreground flex flex-col">
            <span className="typo-title-m-bold block">{screen.label}</span>
            <span className="mt-8 block text-[clamp(--spacing(7),calc(--spacing(4)+2vw),--spacing(9))] leading-normal font-extrabold break-keep max-xl:text-[clamp(--spacing(7),calc(--spacing(4)+2vw),--spacing(8))]">
                {screen.title[0]}
                <br />
                {screen.title[1]}
            </span>
        </h2>
        <p className="typo-body-xl-medium text-main-intro-foreground-subtle mt-4 break-keep">{screen.description}</p>
    </div>
)

const IntroProcessRail = ({screen, trigger}: {screen: IntroScreen; trigger: keyof typeof RAIL_ON_CLASS}) => (
    <div className={cn('flex flex-col', RAIL_ON_CLASS[trigger])}>
        <h3 className="typo-title-m-bold text-main-intro-foreground">{screen.railTitle}</h3>
        {/* 진행 레일 — 채움과 표식은 장식이라 접근성 트리에서 뺀다. 단계 순서는 아래 ol 이 전한다.
            표식과 채움 마디를 단계 그리드에 함께 얹어, 표식이 항상 아래 ol 의 단계 시작점에 선다.
            gap-x-3.5(14px) — 시안이 508 안에 160 컬럼 + 14 간격이라 그대로 맞춘다. 14 는 spacing
            base(4)의 정수 배수가 아니어서 [PB-13] 의 예외다(시안 수치 일치를 우선). */}
        <div aria-hidden="true" className="relative mt-9 h-2">
            <span className="bg-main-intro-border absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2" />
            <span className="absolute inset-0 grid grid-cols-3 gap-x-3.5">
                {screen.steps.map(({step}, index) => (
                    <span key={step} className="relative">
                        {/* 채움 마디 — ease-out 이라 다음 표식에 닿을수록 속도가 줄어든다.
                            한 마디씩 급정거하는 인상을 줄이려는 것이다. */}
                        <span
                            className={cn(
                                'bg-main-intro-accent absolute top-1/2 left-0 h-0.5 origin-left -translate-y-1/2',
                                RAIL_SEGMENT_WIDTH_CLASS[index],
                                'scale-x-[var(--rail-on)]',
                                'transition-[scale] ease-out motion-reduce:transition-none',
                                RAIL_SEGMENT_DURATION_CLASS,
                                RAIL_SEGMENT_DELAY_CLASS[index],
                            )}
                        />
                        {/* 표식 — 불투명도만 켜면 툭 나타나 보여서 0.5 에서 커지며 자리를 잡게 한다. */}
                        <span
                            className={cn(
                                'bg-main-intro-accent absolute top-0 left-0 size-2 rounded-full',
                                'scale-[calc(0.5_+_0.5_*_var(--rail-on))] [opacity:var(--rail-on)]',
                                'transition-[opacity,scale] ease-out motion-reduce:transition-none',
                                RAIL_MARKER_DURATION_CLASS,
                                RAIL_MARKER_DELAY_CLASS[index],
                            )}
                        />
                    </span>
                ))}
            </span>
        </div>
        <ol className="mt-4 grid grid-cols-3 gap-x-3.5">
            {screen.steps.map(({step, label}) => (
                <li key={step} className="flex flex-col">
                    <span className="typo-body-xl-bold text-main-intro-accent">{step}</span>
                    <span className="typo-title-m-bold text-main-intro-foreground-subtle mt-1 break-keep">{label}</span>
                </li>
            ))}
        </ol>
    </div>
)

const IntroProcessCopy = ({
    screen,
    className,
    trigger,
    headingId,
}: {
    screen: IntroScreen
    className: string
    trigger: keyof typeof RAIL_ON_CLASS
    headingId?: string
}) => (
    <div className={className}>
        <IntroLead screen={screen} headingId={headingId} />

        {/* 앞 화면과 같은 방식의 유동 여백. 시안에서는 232px 이고 화면이 낮아지면 48px 까지 줄어든다. */}
        <div aria-hidden="true" className="min-h-12 flex-1 max-xl:min-h-4 md:max-h-58" />

        <IntroProcessRail screen={screen} trigger={trigger} />
    </div>
)

// 모바일(md 미만) — 조리개·교차 없이 문서 순서대로 한 칸씩 쌓아 읽는다(3섹션 모바일과 같은 방식).
// 교차가 없으니 두 화면을 번갈아 보여줄 수 없어, 두 벌을 순서대로 모두 편다.
// 레일은 두 벌 다 entry 트리거를 쓴다 — 교차용 --intro-progress 는 모바일에서 늘 0 이라 그대로 두면
// 두 번째 레일이 비어 버린다. entry 쪽 변수는 페이저가 꺼진 화면에서 채움 값(1)이다.
// id 는 md 이상 카피가 가지므로 여기엔 두지 않는다(중복 id 금지 [KWCAG 8.1.1]).
const MobileIntroContent = () => (
    <div className="grid-layout w-full">
        <div className="col-span-4 flex min-w-0 flex-col gap-12">
            {INTRO_SCREENS.map((screen) => (
                <div key={screen.key} className="flex flex-col gap-12">
                    <IntroLead screen={screen} />
                    <IntroImage photo={screen.photo} className={cn(MOBILE_PHOTO_ASPECT_CLASS, STATIC_ROUND_CLASS)} />
                    <IntroProcessRail screen={screen} trigger="entry" />
                </div>
            ))}
        </div>
    </div>
)

// 두 번째 화면(기업회원 소개). 시안이 페이지 테마와 무관하게 한 벌로 정의돼 있어, 테마 스코프를
// 바꾸지 않고 main-intro-* 시맨틱 토큰으로 색을 고정한다([PB-06] 유지).
//
// 레이아웃(1920 시안) — 588 + 24 + 588 = 1200 이라 그대로 grid-layout 의 두 컬럼에 얹힌다.
// 콘텐츠 높이는 시안의 이미지 마스크(588×686)가 정하고, 그보다 낮은 화면에서는 max-h-full 로 줄어든다.
//
// 인터랙션은 두 가지다(레퍼런스 oneretinaclinic 의 Our Value 섹션).
//  · 진입 리빌 — 섹션이 활성 스택 페이지가 될 때 사진 위의 단색 패널이 조리개처럼 열린다.
//  · 좌우 교차 — 첫 화면은 카피(왼쪽) + 사진(오른쪽)이고, 안쪽 스크롤 트랙을 한 번 굴리면
//    오른쪽 사진의 조리개가 줄어들며 밑의 카피가 드러나고 동시에 왼쪽 사진의 조리개가 커지며
//    카피를 덮는다. 결과적으로 사진(왼쪽) + 카피(오른쪽)으로 좌우가 뒤바뀐다.
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
        const image = sectionRef.current?.querySelector<HTMLImageElement>('[data-entry-image] img')
        if (image?.complete && image.naturalWidth > 0) confirmEntryImageReady(image)

        return () => window.cancelAnimationFrame(imageReadyFrameRef.current)
    }, [confirmEntryImageReady])

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        let entryRevealFrame = 0
        let crossoverSettleFrame = 0
        let entrySequence = 0
        let resetTrackTimer = 0
        let settlingPanels: HTMLElement[] = []

        const releaseCrossoverPanels = () => {
            settlingPanels.forEach((panel) => panel.style.removeProperty('transition'))
            settlingPanels = []
            delete section.dataset.introCrossoverSettling
        }

        // 스크롤 양을 그대로 쓰지 않고 0/1 로만 뒤집는다 — 전환 자체는 CSS transition 이 재생한다.
        // 스크롤 이벤트에서 바로 쓴다. 브라우저가 이미 프레임당 한 번으로 묶어 보내고 하는 일도
        // 커스텀 프로퍼티 한 줄이라, requestAnimationFrame 으로 한 겹 더 미룰 이유가 없다.
        const update = () => {
            const maxScroll = section.scrollHeight - section.clientHeight
            const scrolled = maxScroll > 0 ? section.scrollTop / maxScroll : 0
            section.style.setProperty('--intro-progress', scrolled > SWAP_THRESHOLD ? '1' : '0')
        }

        // 안쪽 트랙을 되감고 교차 상태도 함께 되돌린다. 트랙의 scrollTop 이 바뀌어도 scroll 이벤트가
        // 오지 않는 경로가 있어(페이지 전환·새로고침 복원) update() 를 직접 부른다.
        const rewindTrack = () => {
            section.scrollTop = 0
            update()
        }

        const syncEntryReveal = () => {
            const currentSequence = ++entrySequence
            window.cancelAnimationFrame(entryRevealFrame)
            window.cancelAnimationFrame(crossoverSettleFrame)
            releaseCrossoverPanels()

            // 비활성이 되면 다음 방문을 위해 트랙을 되감아야 한다. 단, 상태가 바뀌는 즉시 되감으면
            // 화면 전환 레이어 아래에서 2영역→1영역 조리개가 잠깐 재생돼 "움찔"해 보인다.
            // StackPager의 레이어 전환이 끝난 뒤, 화면 밖에서 초기화한다.
            if (section.dataset.stackState !== 'active') {
                window.clearTimeout(resetTrackTimer)
                resetTrackTimer = window.setTimeout(() => {
                    if (section.dataset.stackState !== 'active') {
                        delete section.dataset.entryReady
                        rewindTrack()
                    }
                }, STACK_PAGER_TRANSITION_DURATION_MS)
                return
            }

            // 3섹션에서 위로 복귀한 경우에는 StackPager가 이미 트랙 끝(2영역)에 맞춰 둔다.
            // 이때 비활성 상태에서 초기화했던 --intro-progress(0)를 active 상태에서 1로 바꾸면,
            // 조리개 transition이 한 프레임 재생돼 이미지가 커졌다 작아지는 것처럼 보인다.
            // 첫 페인트까지 transition을 잠그고 2영역 값을 확정한 뒤 잠금을 해제한다.
            const maxScroll = section.scrollHeight - section.clientHeight
            const isReverseCrossoverEntry =
                section.dataset.stackEntryDirection === 'backward' &&
                maxScroll > 0 &&
                section.scrollTop / maxScroll > SWAP_THRESHOLD
            if (isReverseCrossoverEntry) {
                section.dataset.introCrossoverSettling = 'true'
                settlingPanels = Array.from(section.querySelectorAll<HTMLElement>('[data-intro-aperture-panel]'))
                settlingPanels.forEach((panel) => panel.style.setProperty('transition', 'none'))
                update()
                // transition:none과 최종 scale을 같은 레이아웃 계산에 확정한다. 이 읽기가 없으면
                // 브라우저가 잠금 해제까지 한 프레임으로 합쳐 기존 값에서 다시 보간할 수 있다.
                void section.offsetHeight
                section.dataset.entryReady = 'true'

                crossoverSettleFrame = window.requestAnimationFrame(() => {
                    crossoverSettleFrame = window.requestAnimationFrame(() => {
                        if (currentSequence === entrySequence && section.dataset.stackState === 'active') {
                            releaseCrossoverPanels()
                        }
                    })
                })
                return
            }

            releaseCrossoverPanels()
            window.clearTimeout(resetTrackTimer)
            update()
            delete section.dataset.entryReady

            if (!entryImageReady) {
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

        // 브라우저가 새로고침 때 안쪽 트랙의 스크롤 위치를 복원하면, 첫 진입에 이미 교차가 끝난 상태로
        // 시작해 전환 없이 뚝 바뀐 것처럼 보인다. 처음 한 번 트랙을 되감아 항상 같은 지점에서 시작한다.
        rewindTrack()
        const sectionStateObserver = new MutationObserver(syncEntryReveal)
        sectionStateObserver.observe(section, {attributes: true, attributeFilter: ['data-stack-state']})
        syncEntryReveal()
        section.addEventListener('scroll', update, {passive: true})
        return () => {
            entrySequence += 1
            window.cancelAnimationFrame(entryRevealFrame)
            window.cancelAnimationFrame(crossoverSettleFrame)
            releaseCrossoverPanels()
            window.clearTimeout(resetTrackTimer)
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
            // 3섹션에서 위로 돌아오면 교차가 끝난 2영역부터 보여 준다. 이후 위로 스크롤하면
            // 내부 트랙을 되감아 1영역을 거친 뒤에야 1섹션으로 이동한다.
            data-stack-reverse-entry="end"
            aria-labelledby="service-intro-title"
            // pager-on:overflow-y-auto — 교차용 안쪽 스크롤 트랙. 페이저는 이 값이 auto/scroll 일 때만
            // 양보하므로, 트랙이 없는 화면에서는 한 번의 제스처가 그대로 3섹션으로 넘어간다.
            // --intro-progress 기본 0 은 JS 가 붙기 전과 트랙이 없는 화면의 상태다(위층이 열린 채).
            //
            // 화면 하나에 맞추는 상자(h-dvh)는 md: 가 아니라 pager-on: 으로 묶는다([PB-17]) — 폭만 보는
            // md: 로 두면 md 이상이면서 높이가 낮은 화면(페이저 off)에서도 뷰포트 높이에 갇혀,
            // 넘치는 카피 하단이 잘렸다. 페이저가 꺼진 화면에서는 여느 섹션처럼 내용만큼 늘어난다.
            className={cn(
                stackPageClassName,
                // 아래 여백을 두지 않는다 — 페이저가 꺼진 화면에서는 다음 섹션의 위 여백(112)이 그대로
                // 섹션 사이 간격이 된다. 양쪽에 다 주면 1섹션↔2섹션(112)의 두 배가 되어 혼자 벌어진다.
                'bg-main-intro-surface pager-on:overflow-y-auto relative flex min-h-dvh flex-col pt-28',
                'pager-on:h-dvh pager-on:min-h-0 pager-on:py-0',
                ENTRY_STATE_CLASS,
                '[--intro-progress:0] [--mask-radius:var(--radius-3xl)]',
            )}
        >
            {/* 모바일과 md 이상은 서로 다른 한 벌만 노출한다. grid-layout 은 display 를 지정하는 프로젝트
                유틸리티라 같은 요소에 hidden 을 얹으면 생성 순서상 grid-layout 이 이겨 숨지 않는다
                — 3섹션과 같게 노출 제어를 바깥 래퍼가 맡는다. */}
            <div data-mobile-intro-content className="md:hidden">
                <MobileIntroContent />
            </div>

            {/* 스크롤 트랙 — 교차가 있는 화면에서만 화면보다 조금 높아지고, 안쪽 화면이 sticky 로 고정된다.
                남는 스크롤(10dvh)은 교차를 켜는 데만 쓴다. StackPager 는 이 트랙을 끝까지 굴린 뒤에야
                다음 섹션으로 넘기므로, 트랙이 길면 교차를 본 뒤 3섹션까지 여러 번 굴려야 했다
                (2화면 높이 = 한 화면치가 남아 세 번). 한 번 굴리면 교차가 켜지며 트랙도 바닥나고,
                그다음 한 번에 3섹션으로 넘어간다. */}
            <div className="pager-on:h-[110dvh] pager-on:flex-none flex-1 max-md:hidden">
                {/* 세로 배치 — 시안(1920×1080) 기준으로 헤더 아래 100px, 사진 아래 220px 이다.
                    가운데 정렬 대신 위에서부터 쌓아, 헤더 아래 여백만 시안 비율(100/1080 = 9.26vh)로
                    따라가게 하고 남는 높이는 전부 사진 아래로 보낸다. 높이가 모자라면 이 여백과 셀이
                    함께 줄어들어(shrink) 카피가 헤더 밑으로 파고들지 않는다. */}
                <div className="pager-on:sticky pager-on:top-0 pager-on:h-dvh flex h-full flex-col">
                    {/* 고정 헤더 자리 — md 56px · lg 이상 112px. 여기만 줄어들지 않는다. */}
                    <div aria-hidden="true" className="h-14 shrink-0 lg:h-28" />
                    <div aria-hidden="true" className="h-[clamp(--spacing(6),9.26vh,--spacing(25))]" />
                    {/* 헤더·1섹션·3섹션과 같은 grid-layout 을 쓴다 — md 티어에서 함께 container(792)로
                        좁아져야 헤더와 좌우 시작선이 맞는다. */}
                    <div className="grid-layout min-h-0 w-full gap-y-12 md:grid-rows-1 md:gap-y-0">
                        {/* 왼쪽 셀 — 첫 화면에서 카피가 보이는 쪽. 사진은 처음부터 전체 면적으로 합성해
                            두고 표면색 패널만 연다. 카피는 패널보다 위에서 함께 페이드하므로 초기
                            레이아웃을 가리지 않는다. 스크롤하면 패널이 열리며 사진으로 바뀐다. */}
                        <div className={cn(CELL_CLASS, 'max-h-full', LEFT_SLOT_CLASS)}>
                            {/* 교차 뒤에 드러나는 사진은 그때 함께 보이는 카피(두 번째 화면)의 것이다. */}
                            <IntroImage
                                photo={INTRO_SCREENS[1].photo}
                                className={cn(CROSSOVER_IMAGE_CLASS, 'absolute inset-0', STATIC_ROUND_CLASS)}
                            />
                            <IntroImageCover mode="swap" />
                            {/* 카피 폭은 COPY_INSET_CLASS 가 정한다(위 주석 — 1영역 508 / 2영역 518). */}
                            <IntroProcessCopy
                                screen={INTRO_SCREENS[0]}
                                headingId="service-intro-title"
                                trigger="entry"
                                className={cn(
                                    SWAP_COPY_FADE_CLASS,
                                    'relative z-20 flex w-full flex-col md:pt-5',
                                    COPY_INSET_CLASS.firstArea,
                                )}
                            />
                        </div>

                        {/* 오른쪽 셀 — 첫 화면에서 사진이 보이는 쪽. 사진은 처음부터 렌더링하고,
                            교차 시 표면색 패널이 덮이며 카피가 나타난다. */}
                        <div className={cn(CELL_CLASS, 'max-h-full', RIGHT_SLOT_CLASS)}>
                            <IntroProcessCopy
                                screen={INTRO_SCREENS[1]}
                                trigger="swap"
                                className={cn(
                                    CROSSOVER_COPY_CLASS,
                                    BASE_COPY_FADE_CLASS,
                                    'relative z-20 w-full flex-col md:pt-5',
                                    COPY_INSET_CLASS.secondArea,
                                )}
                            />
                            <IntroImage
                                photo={INTRO_SCREENS[0].photo}
                                isEntryImage
                                onLoad={handleEntryImageLoad}
                                className={cn('absolute inset-0', STATIC_ROUND_CLASS)}
                            />
                            <IntroImageCover mode="entry" />
                            <IntroImageCover mode="conceal" />
                        </div>
                    </div>
                    {/* 사진 아래 여백 — 시안 220px 을 같은 비율(220/1080 = 20.37vh)로 따라간다.
                        위 여백과 같은 규칙이라 낮은 화면에서도 위:아래 = 100:220 의 비례가 유지된다. */}
                    <div aria-hidden="true" className="h-[clamp(--spacing(14),20.37vh,--spacing(55))]" />
                </div>
            </div>
        </section>
    )
}

export default MainSecondSection
