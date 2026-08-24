import Image, {type StaticImageData} from 'next/image'
import type {ReactNode} from 'react'
import patentEvaluationVisual from '@public/images/main-hero/patent-evaluation.webp'
import techEvaluationVisual from '@public/images/main-hero/tech-evaluation.webp'

export type TechEvalService = {
    title: string
    headline: ReactNode
    descriptionTitle: string
    description: string
    tags: string[]
    image: StaticImageData
    // "시작하기" CTA 가 이동할 화면. 목업이 없는 서비스는 '#'.
    ctaHref: string
}

// [기술평가] 카드의 제목 — 이 항목만 CTA 경로를 화면마다 다르게 받는다. [MD-010]
const TECHNOLOGY_EVALUATION_TITLE = '기술평가'

// 목업이 없는 서비스의 CTA. [MD-010]
const NO_LINK = '#'

// "시작하기" CTA가 PC 롤링·모바일 정적 배치에서 공유하는 좌→우 배경 채움 효과.
export const TECH_EVAL_CTA_FILL_CLASS =
    'border-transparent bg-muted text-foreground bg-linear-to-r from-action-fill-hover to-action-fill-hover bg-left bg-no-repeat bg-[length:0_100%] font-bold transition-[background-size,color] duration-300 interactive:hover:bg-muted interactive:hover:bg-[length:100%_100%] interactive:active:bg-gray-50 motion-reduce:transition-none'

// 텍스트·태그는 피그마 시안(type A_01 상태 프레임)을 그대로 반영한다.
export const TECH_EVAL_SERVICES: TechEvalService[] = [
    {
        title: '기술평가',
        headline: (
            <>
                <span className="block">기업이 보유한 기술의</span>
                <span className="block">가치를 증명하는 기술평가</span>
            </>
        ),
        descriptionTitle: '기술평가란?',
        description:
            'K-TOP 기술평가는 기술사업성 평가부터 혁신역량 진단, 투자 적합성 분석까지 3개 평가모형을 통합 제공합니다. 신청 목적에 맞는 모형을 선택하면 하나의 입력 절차로 평가가 진행됩니다.',
        tags: ['기술력 진단', '기술등급', '성장 가능성', '기업평가', '보증·투자 연계'],
        image: techEvaluationVisual,
        ctaHref: NO_LINK,
    },
    {
        title: '특허평가',
        headline: (
            <>
                <span className="block">특허번호 입력만으로</span>
                <span className="block">확인할 수 있는 객관적 특허가치</span>
            </>
        ),
        descriptionTitle: '특허평가(K-PAS)란?',
        description:
            '특허번호 입력만으로 특허의 기술성·권리성·시장성을 종합 분석하여 전체 특허 대비 상대적 위치를 AAA~C 9개 등급으로 산출합니다.',
        tags: ['특허가치', '특허등급', '기술가치평가', '온라인 평가', 'K-PAS'],
        image: patentEvaluationVisual,
        ctaHref: NO_LINK,
    },
    {
        title: 'K-BIGx 보고서',
        headline: (
            <>
                <span className="block">기업과 산업 데이터를 잇는</span>
                <span className="block">K-BIGx 분석 보고서</span>
            </>
        ),
        descriptionTitle: 'K-BIGx 보고서란?',
        description:
            '기업·기술·특허·산업 데이터를 연계해 기업의 현황과 성장 가능성을 다각도로 확인할 수 있도록 구성한 데이터 기반 분석 보고서입니다.',
        tags: ['기업 분석', '산업 분석', '기술 분석', '특허 분석', '데이터 보고서'],
        // 전용 비주얼 미확보 — 확보 전까지 앞의 두 비주얼을 번갈아 재사용한다.
        image: techEvaluationVisual,
        ctaHref: NO_LINK,
    },
    {
        // 시안 목차의 4번째 항목 — 활성 상태 시안이 아직 없어 콘텐츠는 임시값이다.
        title: '탄소중립',
        headline: (
            <>
                <span className="block">탄소중립 전환을 준비하는</span>
                <span className="block">기업 맞춤형 평가</span>
            </>
        ),
        descriptionTitle: '탄소중립 평가란?',
        description:
            '기업의 온실가스 배출 현황과 감축 역량을 진단해 탄소중립 전환 전략 수립을 지원하는 평가 서비스입니다.',
        tags: ['탄소중립', '온실가스 진단', '감축 전략', 'ESG'],
        // 전용 비주얼 미확보 — 확보 전까지 앞의 두 비주얼을 번갈아 재사용한다.
        image: patentEvaluationVisual,
        ctaHref: NO_LINK,
    },
]

// 서비스 비주얼(이미지 + 설명 + 태그)은 PC 롤링과 모바일 정적 목록에서 공유한다.
export const TechEvalServiceVisual = ({service}: {service: TechEvalService}) => (
    <>
        <Image
            src={service.image}
            alt=""
            draggable={false}
            sizes="(max-width: 768px) 100vw, 50vw"
            // 시안 프레임 비율 590:380 — 원본 이미지의 고유 비율(588:399)과 달라 명시한다.
            // 폭은 컬럼을 채우고 높이는 이 비율이 정하며, 남는 부분은 object-cover 가 자른다.
            //
            // md 이상의 상한 — 우측 컬럼은 사진(379) + 간격(20) + 설명·태그(154)로 높이가 고정이라,
            // 헤더와 위아래 여백을 더하면 뷰포트 798px 미만에서는 한 화면에 들어가지 않는다. 그 아래에서만
            // 사진 세로를 남는 높이에 맞춰 줄인다(폭은 w-full 로 고정이라 그리드 끝선은 그대로).
            // 계산: 화면높이 - 헤더(112) - 위여백(7.4vh) - 아래여백(9.26vh) - 설명블록(174) = 83.34vh - 286
            // 상한 380 은 비율에서 나오는 원래 높이(379)와 같아, 높이가 넉넉한 화면에서는 걸리지 않는다.
            className="aspect-[590/380] w-full rounded-2xl object-cover md:max-h-[clamp(--spacing(40),calc(83.34vh---spacing(71.5)),--spacing(95))]"
        />

        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h3 className="typo-title-m-bold text-foreground">{service.descriptionTitle}</h3>
                <p className="typo-body-xl-regular text-foreground">{service.description}</p>
            </div>

            <ul className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                    <li
                        key={tag}
                        className="typo-body-l-medium border-foreground-subtle text-foreground rounded-sm border px-3 py-2"
                    >
                        {tag}
                    </li>
                ))}
            </ul>
        </div>
    </>
)

// [기술평가] 시작하기 CTA 는 이 메인 화면을 쓰는 경로가 갈 곳을 정한다 — 기업 홈은 기업 Tech-Index
// 선택 화면, 기관 홈은 기관 것으로 간다. 나머지 서비스는 목업이 없어 그대로 둔다.
export const buildTechEvalServices = (technologyEvaluationHref: string): TechEvalService[] =>
    TECH_EVAL_SERVICES.map((service) =>
        service.title === TECHNOLOGY_EVALUATION_TITLE ? {...service, ctaHref: technologyEvaluationHref} : service,
    )
