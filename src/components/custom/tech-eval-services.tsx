import Image, {type StaticImageData} from 'next/image'
import type {ReactNode} from 'react'
import patentEvaluationVisual from '../../../public/images/main-hero/patent-evaluation.webp'
import techEvaluationVisual from '../../../public/images/main-hero/tech-evaluation.webp'

export type TechEvalService = {
    title: string
    headline: ReactNode
    descriptionTitle: string
    description: string
    tags: string[]
    image: StaticImageData
}

// 텍스트·태그는 피그마 시안(type A_01 상태 프레임)을 그대로 반영한다.
export const TECH_EVAL_SERVICES: TechEvalService[] = [
    {
        title: '기술평가',
        headline: (
            <>
                <span className="block">기업이 보유한 기술의</span>
                <span className="block">가치를 증명하는</span>
                <span className="block">기술평가</span>
            </>
        ),
        descriptionTitle: '기술평가란?',
        description:
            'K-TOP 기술평가는 기술사업성 평가부터 혁신역량 진단, 투자 적합성 분석까지 3개 평가모형을 통합 제공합니다. 신청 목적에 맞는 모형을 선택하면 하나의 입력 절차로 평가가 진행됩니다.',
        tags: ['기술력 진단', '기술등급', '성장 가능성', '기업평가', '보증·투자 연계'],
        image: techEvaluationVisual,
    },
    {
        title: '특허평가',
        headline: (
            <>
                <span className="block">특허번호 입력만으로</span>
                <span className="block">확인할 수 있는</span>
                <span className="block">객관적 특허가치</span>
            </>
        ),
        descriptionTitle: '특허평가(K-PAS)란?',
        description:
            '특허번호 입력만으로 특허의 기술성·권리성·시장성을 종합 분석하여 전체 특허 대비 상대적 위치를 AAA~C 9개 등급으로 산출합니다.',
        tags: ['특허가치', '특허등급', '기술가치평가', '온라인 평가', 'K-PAS'],
        image: patentEvaluationVisual,
    },
    {
        title: 'K-BIGx 보고서',
        headline: (
            <>
                <span className="block">기업과 산업 데이터를</span>
                <span className="block">한눈에 연결하는</span>
                <span className="block">K-BIGx 분석 보고서</span>
            </>
        ),
        descriptionTitle: 'K-BIGx 보고서란?',
        description:
            '기업·기술·특허·산업 데이터를 연계해 기업의 현황과 성장 가능성을 다각도로 확인할 수 있도록 구성한 데이터 기반 분석 보고서입니다.',
        tags: ['기업 분석', '산업 분석', '기술 분석', '특허 분석', '데이터 보고서'],
        // 전용 비주얼 미확보 — 확보 전까지 앞의 두 비주얼을 번갈아 재사용한다.
        image: techEvaluationVisual,
    },
    {
        // 시안 목차의 4번째 항목 — 활성 상태 시안이 아직 없어 콘텐츠는 임시값이다.
        title: '탄소중립',
        headline: (
            <>
                <span className="block">탄소중립 전환을</span>
                <span className="block">체계적으로 준비하는</span>
                <span className="block">기업 맞춤형 평가</span>
            </>
        ),
        descriptionTitle: '탄소중립 평가란?',
        description:
            '기업의 온실가스 배출 현황과 감축 역량을 진단해 탄소중립 전환 전략 수립을 지원하는 평가 서비스입니다.',
        tags: ['탄소중립', '온실가스 진단', '감축 전략', 'ESG'],
        // 전용 비주얼 미확보 — 확보 전까지 앞의 두 비주얼을 번갈아 재사용한다.
        image: patentEvaluationVisual,
    },
]

// 서비스 비주얼(이미지 + 설명 + 태그)은 PC 롤링과 모바일 정적 목록에서 공유한다.
export const TechEvalServiceVisual = ({service}: {service: TechEvalService}) => (
    <>
        <Image
            src={service.image}
            alt=""
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto w-full rounded-2xl"
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
