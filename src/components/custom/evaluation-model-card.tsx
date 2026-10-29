import Image from 'next/image'
import {ArrowRight} from 'lucide-react'
import type {EvaluationModel, EvaluationModelTone} from '@/content/service/evaluation-model-selection'
import {cn} from '@/lib/utils'

// 평가모형 카드의 겉모습 — 평가모형 선택(라디오 카드)과 플랫폼 소개 > 기술평가(탭 카드)가 함께 쓴다.
// 고르는 방식(라디오 · 탭)은 감싸는 쪽이 정하고, 이 파일은 카드 면과 내용만 그린다.
//
// 카드 규격: 반경 16 · 여백 위·좌우 32, 아래 24 · 약칭(14 Bold)과 제목(28 Bold) 8 · 제목과 설명(14) 16 ·
// 설명과 일러스트 자리(높이 144) 32 · 오른쪽 아래 짙은 원형 화살표(48) · 카드 사이 24.
// 마우스를 올리거나 키보드로 포커스하면 테두리가 그라데이션으로 바뀐다.

// 모형별 카드 면 · 약칭 · 그라데이션 테두리 색 — 시맨틱 토큰 model-card-<색>-*(tokens.json)이 라이트 · 다크 값을 함께 정한다.
// 원시 팔레트 유틸리티는 다크에서 단계가 뒤집혀 글자 대비가 무너지므로 쓰지 않는다.
// border — 그라데이션 테두리의 두 끝 색(진한 쪽 → 옅은 쪽). 색만 정해 두고, 언제 보일지는 감싸는 쪽의
// bg-linear-to-br 변형(hover · 선택 · 포커스)이 정한다.
const EVALUATION_MODEL_TONE_CLASS: Record<EvaluationModelTone, {surface: string; label: string; border: string}> = {
    blue: {
        surface: 'bg-model-card-blue',
        label: 'text-model-card-blue-foreground',
        border: 'from-model-card-blue-border-from to-model-card-blue-border-to',
    },
    mint: {
        surface: 'bg-model-card-mint',
        label: 'text-model-card-mint-foreground',
        border: 'from-model-card-mint-border-from to-model-card-mint-border-to',
    },
    orange: {
        surface: 'bg-model-card-orange',
        label: 'text-model-card-orange-foreground',
        border: 'from-model-card-orange-border-from to-model-card-orange-border-to',
    },
}

// 테두리는 바깥 상자(1px 여백)의 면으로 그린다 — 평소에는 투명하고, 감싸는 쪽 변형이 켜질 때 그라데이션이 비친다.
const EVALUATION_MODEL_CARD_OUTER_CLASS_NAME = 'outline-ring block h-full rounded-lg p-px transition-colors'

type EvaluationModelCardContentProps = {
    model: EvaluationModel
    /** 제목의 id — 탭 카드가 탭 이름(aria-labelledby)으로 잇는다. */
    titleId?: string
    /**
     * 오른쪽 아래 화살표를 PC(xl)에서만 보일지. 플랫폼 소개 > 기술평가 탭 카드는 태블릿 · 모바일 시안에 화살표가 없다 —
     * 그때 아래 여백은 위와 같은 32 다. 평가모형 선택은 모든 폭에서 보인다(기본값).
     */
    isArrowDesktopOnly?: boolean
}

// 안쪽 카드 반경은 바깥(16)보다 1 작아야 모서리가 겹쳐 보이지 않는다.
// 라디오 카드는 label 안에 놓이므로 블록 요소 대신 span 으로 그린다.
const EvaluationModelCardContent = ({model, titleId, isArrowDesktopOnly = false}: EvaluationModelCardContentProps) => {
    const tone = EVALUATION_MODEL_TONE_CLASS[model.tone]

    return (
        <span
            className={cn(
                'flex h-full flex-col rounded-[calc(var(--radius-lg)-1px)] px-8 pt-8',
                isArrowDesktopOnly ? 'pb-8 xl:pb-6' : 'pb-6',
                tone.surface,
            )}
        >
            <span className="flex flex-col gap-2">
                {/* 약칭이 없는 카드(투자모형)도 그 줄을 비워 두어 세 카드의 제목 높이를 맞춘다. */}
                <span aria-hidden={model.label ? undefined : true} className={cn('typo-body-l-bold', tone.label)}>
                    {model.label ?? ' '}
                </span>
                {/* 단어 단위로 끊되(break-keep), 한 단어가 칸보다 길면 그 안에서 줄을 바꾼다(wrap-break-word) —
                    태블릿 3열(글자 칸 184)에서 '혁신성장역량지수'(28)가 카드 밖으로 넘치지 않게 한다(시안도 두 줄). */}
                <span id={titleId} className="typo-h2-bold text-foreground wrap-break-word break-keep">
                    {model.title}
                </span>
            </span>
            <span className="typo-body-l-regular text-label-foreground mt-4 break-keep">{model.description}</span>
            {/* 일러스트 자리(높이 144) — 그림은 정해진 표시 크기로 자리의 가운데(가로·세로)에 놓는다.
                투자모형(188)은 자리보다 커서 위아래로 조금씩 넘친다. 좁은 카드에서는 폭에 맞춰
                줄어든다. 에셋이 없으면 빈 자리로 둔다. 제목이 같은 뜻을 전하므로 그림은 꾸밈이다[5.1.1]. */}
            <span className="mt-8 flex h-36 items-center justify-center">
                {model.image ? (
                    <Image
                        src={model.image.src}
                        alt=""
                        width={model.image.width}
                        height={model.image.height}
                        draggable={false}
                        className="h-auto max-w-full"
                    />
                ) : null}
            </span>
            <span
                aria-hidden="true"
                className={cn(
                    'bg-label-foreground text-primary-foreground mt-auto size-12 shrink-0 items-center justify-center self-end rounded-full',
                    isArrowDesktopOnly ? 'hidden xl:flex' : 'flex',
                )}
            >
                <ArrowRight className="size-8" />
            </span>
        </span>
    )
}

export {EVALUATION_MODEL_CARD_OUTER_CLASS_NAME, EVALUATION_MODEL_TONE_CLASS, EvaluationModelCardContent}
export type {EvaluationModelCardContentProps}
