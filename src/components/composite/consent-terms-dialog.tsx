import type {ReactNode} from 'react'
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {ListMarker} from '@/components/custom/list-marker'
import {CONSENT_QUESTION, CONSENT_SECTIONS, CONSENT_TITLE, type ConsentSection} from '@/content/service/consent-terms'
import {cn} from '@/lib/utils'

// 필수 동의사항 모달의 내용 — 시안 "[공통] 모달"의 내부 스크롤 케이스(40006522:18538).
// 제목과 CTA 는 고정하고 본문만 스크롤한다(max-h-112 = 440). 약관 문구는 content/service/consent-terms 가 갖는다.
// Dialog 루트와 트리거는 사용처가 감싼다 — 문의 등록의 "내용보기", 컴포넌트 가이드의 예시가 같은 내용을 쓴다.
//
// 목록으로 보여야 하는 블록 — 시안에서 이 네 곳만 글머리 기호가 붙는다.
const BULLET_BLOCKS: readonly {section: string; block: string}[] = [
    {section: '1.수집, 이용에 관한 사항 (필수 사항)', block: '수집·이용 목적'},
    {section: '3.조회에 관한 사항 (필수 사항)', block: '조회 목적'},
    {section: '4.수집, 이용에 관한 사항 (필수 사항)', block: '수집·이용 목적'},
    {section: '6.조회에 관한 사항 (필수 사항)', block: '조회 목적'},
]

const isBulletBlock = (section: string, block: string) =>
    BULLET_BLOCKS.some((target) => target.section === section && target.block === block)

// 섹션 사이 24, 섹션 안의 블록 사이 16 은 시안 실측값이다.
const ConsentTermsSection = ({section}: {section: ConsentSection}) => (
    <div className="flex flex-col gap-4">
        <h3 className="typo-title-l-bold text-foreground">{section.heading}</h3>
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
                    // 같은 문구가 한 블록 안에서 되풀이되는 약관이라(제공받는 자별 항목 등) 본문은 순번을 키로 쓴다.
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
    // 동의함을 눌렀을 때 처리(예: 동의 체크박스 켜기). 넘기지 않으면 닫기만 한다.
    onAgree?: () => void
    // CTA 문구 — 화면에 따라 "동의함/동의하지 않음" 대신 다른 말이 필요할 때 바꾼다.
    agreeLabel?: ReactNode
    declineLabel?: ReactNode
}

const ConsentTermsDialogContent = ({
    onAgree,
    agreeLabel = '동의함',
    declineLabel = '동의하지 않음',
}: ConsentTermsDialogContentProps) => (
    <DialogContent>
        <DialogHeader>
            <DialogTitle>{CONSENT_TITLE}</DialogTitle>
            <DialogDescription className="sr-only">필수 동의사항 전문을 스크롤하며 확인합니다.</DialogDescription>
        </DialogHeader>
        {/* 본문 스크롤 박스 — 시안 440(max-h-112). pr-3 은 스크롤바 자리다. */}
        <div className={cn(dialogBodyClassName, 'max-h-112 gap-6 pr-3')}>
            {CONSENT_SECTIONS.map((section) => (
                <ConsentTermsSection key={section.heading} section={section} />
            ))}
            {/* 마무리 질문 — 시안은 이 줄만 가운데 정렬이다(본문 508 폭 기준). */}
            <p className="typo-title-l-bold text-foreground text-center">{CONSENT_QUESTION}</p>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="tertiary" size="xl">
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

export {ConsentTermsDialogContent}
export type {ConsentTermsDialogContentProps}
