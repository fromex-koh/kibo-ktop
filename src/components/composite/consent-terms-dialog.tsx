import type {ReactNode} from 'react'
import {DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {ListMarker} from '@/components/custom/list-marker'
import {
    CONSENT_QUESTION,
    CONSENT_SECTIONS,
    CONSENT_TITLE,
    OPTIONAL_CONSENT_QUESTION,
    OPTIONAL_CONSENT_SECTIONS,
    OPTIONAL_CONSENT_TITLE,
    isOptionalConsentSection,
    type ConsentSection,
} from '@/content/service/consent-terms'
import {cn} from '@/lib/utils'

// 약관 본문은 content/service/consent-terms에서 가져오고, Dialog 루트와 트리거는 사용처에서 구성한다.
// 글머리 기호가 필요한 섹션·블록을 지정한다.
const BULLET_BLOCKS: readonly {section: string; block: string}[] = [
    {section: '1.수집, 이용에 관한 사항 (필수 사항)', block: '수집·이용 목적'},
    {section: '3.조회에 관한 사항 (필수 사항)', block: '조회 목적'},
    {section: '4.수집, 이용에 관한 사항 (필수 사항)', block: '수집·이용 목적'},
    {section: '6.조회에 관한 사항 (필수 사항)', block: '조회 목적'},
    {section: '1.세무회계자료의 온라인 제출에 관한 사항 (선택 사항)', block: '제출목적'},
    {section: '1.세무회계자료의 온라인 제출에 관한 사항 (선택 사항)', block: '동의내용'},
]

const isBulletBlock = (section: string, block: string) =>
    BULLET_BLOCKS.some((target) => target.section === section && target.block === block)

// 개별 항목 모달에서 약관 원문 번호를 화면 항목 번호로 맞춘다.
const withHeadingNumber = (heading: string, headingNumber?: number) =>
    headingNumber ? heading.replace(/^\d+/, String(headingNumber)) : heading

const ConsentTermsSection = ({section, headingNumber}: {section: ConsentSection; headingNumber?: number}) => (
    <div className="flex flex-col gap-4">
        <h3 className="typo-title-l-bold text-foreground">{withHeadingNumber(section.heading, headingNumber)}</h3>
        {section.blocks.map((block) => (
            <div key={block.heading} className="flex flex-col gap-2">
                <h4 className="typo-title-m-bold text-foreground">{block.heading}</h4>
                {isBulletBlock(section.heading, block.heading) ? (
                    <ul className="flex flex-col gap-2">
                        {block.lines.map((line, lineIndex) => (
                            <li key={lineIndex} className="typo-body-xl-regular text-label-foreground flex">
                                <ListMarker type="unordered" level={1} />
                                <span>{line.text}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    block.lines.map((line, lineIndex) =>
                        line.kind === 'label' ? (
                            <p key={lineIndex} className="typo-body-xl-medium text-foreground">
                                {line.text}
                            </p>
                        ) : (
                            <p key={lineIndex} className="typo-body-xl-regular text-label-foreground">
                                {line.text}
                            </p>
                        ),
                    )
                )}
            </div>
        ))}
    </div>
)

type ConsentTermsDialogContentProps = {
    // 동의 완료 후 실행할 처리.
    onAgree?: () => void
    // '동의하지 않음' 버튼을 눌렀을 때만 실행한다.
    onDecline?: () => void
    // 동의·거부 버튼 문구.
    agreeLabel?: ReactNode
    declineLabel?: ReactNode
    // false이면 동의 후 다음 동의 모달을 이어서 연다.
    closeOnAgree?: boolean
}

// 두 단계(필수·선택)의 다른 점은 제목·본문·물음뿐이라 한 벌로 둔다.
// 한 컴포넌트로 묶는 이유 — 필수 → 선택으로 넘어갈 때 카드가 다시 그려지지 않아야 한다. 서로 다른
// 컴포넌트로 나눠 두면 단계가 바뀔 때 DialogContent 가 통째로 교체되면서 등장 애니메이션이 다시 돌아
// 화면이 한 번 번쩍인다. 같은 컴포넌트면 글자만 바뀐다.
const CONSENT_TERMS_STEPS = {
    required: {
        title: CONSENT_TITLE,
        description: '필수 동의사항 전문을 스크롤하며 확인합니다.',
        sections: CONSENT_SECTIONS,
        question: CONSENT_QUESTION,
    },
    optional: {
        title: OPTIONAL_CONSENT_TITLE,
        description: '선택 동의사항 전문을 스크롤하며 확인합니다.',
        sections: OPTIONAL_CONSENT_SECTIONS,
        question: OPTIONAL_CONSENT_QUESTION,
    },
} as const

type ConsentTermsStep = keyof typeof CONSENT_TERMS_STEPS

const ConsentTermsStepDialogContent = ({
    step,
    onAgree,
    onDecline,
    agreeLabel = '동의함',
    declineLabel = '동의하지 않음',
    closeOnAgree = true,
}: ConsentTermsDialogContentProps & {step: ConsentTermsStep}) => {
    const {title, description, sections, question} = CONSENT_TERMS_STEPS[step]

    const descriptionId = `consent-terms-${step}-description`

    return (
        // 설명은 DialogDescription 이 아니라 순수 sr-only 문단으로 둔다 — DialogDescription 의 기본 글자가
        // 20px Bold 라, 보이지 않는 글인데도 "제목처럼 보이는 글"로 잡힌다(WAVE "Possible heading").
        // aria-describedby 는 그 문단의 id 를 직접 가리킨다 — undefined 를 넘겨 설명을 없애는 방법은 이
        // 파일이 서버 컴포넌트라 통하지 않는다(서버→클라이언트로 넘길 때 undefined 는 사라진다).
        <DialogContent aria-describedby={descriptionId}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <p id={descriptionId} className="sr-only">
                    {description}
                </p>
            </DialogHeader>
            {/* 약관 본문만 스크롤하고 제목·버튼 영역은 고정한다. */}
            <div className={cn(dialogBodyClassName, 'max-h-112 [scrollbar-gutter:stable_both-edges] gap-6')}>
                {sections.map((section) => (
                    <ConsentTermsSection key={section.id} section={section} />
                ))}
                {/* 물음은 바로 아래 [동의함]·[동의하지 않음] 을 이끄는 머리다 — 크기·굵기만 제목처럼인
                    문단으로 두면 "제목처럼 보이는데 제목이 아닌 글"이 되고(WAVE "Possible heading"), 긴
                    약관을 스크롤하는 대신 제목 이동으로 결정 지점까지 건너뛸 수도 없다[6.4.2]. */}
                <h3 className="typo-title-l-bold text-foreground text-center">{question}</h3>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl" onClick={onDecline}>
                        {declineLabel}
                    </Button>
                </DialogClose>
                {closeOnAgree ? (
                    <DialogClose asChild>
                        <Button size="xl" onClick={onAgree}>
                            {agreeLabel}
                        </Button>
                    </DialogClose>
                ) : (
                    <Button size="xl" onClick={onAgree}>
                        {agreeLabel}
                    </Button>
                )}
            </DialogFooter>
        </DialogContent>
    )
}

// 단계를 따로 부르는 화면(개별 팝업·가이드)을 위한 이름. 내용은 위와 같다.
const ConsentTermsDialogContent = (props: ConsentTermsDialogContentProps) => (
    <ConsentTermsStepDialogContent step="required" {...props} />
)

// 필수 동의 후 이어지는 선택 동의 모달.
const OptionalConsentTermsDialogContent = (props: ConsentTermsDialogContentProps) => (
    <ConsentTermsStepDialogContent step="optional" {...props} />
)

const ConsentTermsSectionDialogContent = ({
    section,
    headingNumber,
    onAgree,
    onDecline,
    agreeLabel = '동의함',
    declineLabel = '동의하지 않음',
}: ConsentTermsDialogContentProps & {
    section?: ConsentSection
    // 화면 항목 번호. 없으면 약관 원문 번호를 사용한다.
    headingNumber?: number
}) => (
    <DialogContent aria-describedby={`consent-terms-${section?.id ?? 'empty'}-description`}>
        <DialogHeader>
            <DialogTitle>
                {section && isOptionalConsentSection(section.id) ? OPTIONAL_CONSENT_TITLE : CONSENT_TITLE}
            </DialogTitle>
            {/* 항목마다 모달이 따로 있어 id 에 항목 이름을 넣는다 — 같은 화면에 둘이 떠도 겹치지 않는다. */}
            <p id={`consent-terms-${section?.id ?? 'empty'}-description`} className="sr-only">
                해당 항목의 동의사항 전문을 스크롤하며 확인합니다.
            </p>
        </DialogHeader>
        <div className={cn(dialogBodyClassName, 'max-h-112 [scrollbar-gutter:stable_both-edges] gap-6')}>
            {section ? (
                <>
                    <ConsentTermsSection section={section} headingNumber={headingNumber} />
                    <h3 className="typo-title-l-bold text-foreground text-center">{section.question}</h3>
                </>
            ) : (
                <p className="typo-title-l-bold text-foreground py-10 text-center">내용 추후 업데이트</p>
            )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="tertiary" size="xl" onClick={onDecline}>
                    {declineLabel}
                </Button>
            </DialogClose>
            <DialogClose asChild>
                <Button size="xl" onClick={onAgree}>
                    {agreeLabel}
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
)

export {
    ConsentTermsDialogContent,
    ConsentTermsSectionDialogContent,
    ConsentTermsStepDialogContent,
    OptionalConsentTermsDialogContent,
}
export type {ConsentTermsDialogContentProps, ConsentTermsStep}
