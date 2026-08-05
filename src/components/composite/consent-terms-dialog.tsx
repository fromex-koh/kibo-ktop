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

// 개인정보 필수 동의사항을 공통 DialogContent로 렌더링한다.
// 약관 문구는 content/service/consent-terms에서 관리하고, Dialog 루트와 트리거는 사용처에서 구성한다.
//
// 글머리 기호로 표시할 섹션·블록 조합.
const BULLET_BLOCKS: readonly {section: string; block: string}[] = [
    {section: '1.수집, 이용에 관한 사항 (필수 사항)', block: '수집·이용 목적'},
    {section: '3.조회에 관한 사항 (필수 사항)', block: '조회 목적'},
    {section: '4.수집, 이용에 관한 사항 (필수 사항)', block: '수집·이용 목적'},
    {section: '6.조회에 관한 사항 (필수 사항)', block: '조회 목적'},
]

const isBulletBlock = (section: string, block: string) =>
    BULLET_BLOCKS.some((target) => target.section === section && target.block === block)

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
    // 동의 완료 후 실행할 처리. 미전달 시 모달만 닫힌다.
    onAgree?: () => void
    // 화면별 동의·거부 버튼 문구.
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
        {/* 약관 본문만 스크롤하고 제목·버튼 영역은 고정한다. */}
        <div className={cn(dialogBodyClassName, 'max-h-112 [scrollbar-gutter:stable_both-edges] gap-6')}>
            {CONSENT_SECTIONS.map((section) => (
                <ConsentTermsSection key={section.heading} section={section} />
            ))}
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
