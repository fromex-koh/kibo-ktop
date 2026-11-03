'use client'

import {useEffect, useRef, useState} from 'react'
import {Check, Copy, Sparkles} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'

// 릴리즈 노트 카드의 'AI 적용 내용' — 카드에는 버튼만 두고, 긴 변경 지시문은 모달 안에 담는다.
// 받는 쪽은 [텍스트 복사]로 지시문 전체를 복사해 AI 에 그대로 넣는다(카드가 길어지지 않게).
const COPIED_RESET_MS = 1500

// 구획 머리(■ …) 앞에 빈 줄을 넣어 모달 · 복사본 모두 덩어리가 나뉘어 보이게 한다.
const SECTION_MARK = '■'
const toGuideText = (text: string) =>
    text
        .split('\n')
        .map((line, index) => (index > 0 && line.startsWith(SECTION_MARK) ? `\n${line}` : line))
        .join('\n')

// attachment — 초안의 '- AI 첨부:' 값. 있으면 모달 제목 아래 설명으로 보인다(복사 대상 아님). title 은 낭독기용 버튼 이름에 쓴다.
const ReleaseNoteAiGuide = ({title, text, attachment}: {title: string; text: string; attachment?: string}) => {
    const guideText = toGuideText(text)
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'selected'>('idle')
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
    const textRef = useRef<HTMLPreElement>(null)

    useEffect(() => () => clearTimeout(timerRef.current), [])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(guideText)
            setCopyState('copied')
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setCopyState('idle'), COPIED_RESET_MS)
        } catch {
            // 클립보드 쓰기가 막힌 환경(비보안 주소 · 권한 거부)에서는 본문 전체를 선택해 두고 Ctrl/⌘+C 를 안내한다.
            const textElement = textRef.current
            if (!textElement) return
            const range = document.createRange()
            range.selectNodeContents(textElement)
            window.getSelection()?.removeAllRanges()
            window.getSelection()?.addRange(range)
            setCopyState('selected')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="w-fit">
                    <Sparkles aria-hidden="true" />
                    AI 적용 내용 보기
                    <span className="sr-only"> ({title})</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI 적용 내용</DialogTitle>
                    {/* 제목 바로 아래 큰 설명 — 카드에 '- AI 첨부:' 가 있으면 그 문장(함께 넣을 파일)을 강조해 보인다. */}
                    <DialogDescription>{attachment ?? '아래 지시문을 복사해 AI 에 넣으세요.'}</DialogDescription>
                </DialogHeader>
                <div className={dialogInfoBodyClassName}>
                    <pre
                        ref={textRef}
                        className="bg-muted text-foreground typo-body-m-regular rounded-md p-4 font-mono break-words whitespace-pre-wrap"
                    >
                        {guideText}
                    </pre>
                    {copyState === 'selected' ? (
                        <p className="typo-body-m-regular text-foreground-subtle pt-2">
                            자동 복사가 막혀 있어 내용을 모두 선택했습니다. Ctrl+C(Mac ⌘+C)로 복사하세요.
                        </p>
                    ) : null}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" size="xl">
                            닫기
                        </Button>
                    </DialogClose>
                    <Button type="button" size="xl" onClick={handleCopy}>
                        {copyState === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                        {copyState === 'copied' ? '복사됨' : '텍스트 복사'}
                    </Button>
                    <span role="status" aria-live="polite" className="sr-only">
                        {copyState === 'copied'
                            ? 'AI 적용 내용을 복사했습니다.'
                            : copyState === 'selected'
                              ? '내용을 모두 선택했습니다. Ctrl+C 로 복사하세요.'
                              : ''}
                    </span>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {ReleaseNoteAiGuide}
