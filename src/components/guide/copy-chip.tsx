'use client'

import {useEffect, useRef, useState} from 'react'
import {Check, Copy} from 'lucide-react'
import {Badge} from '@/components/ui/badge'

// 클릭하면 값(유틸리티 클래스명·토큰명 등)을 클립보드에 복사하는 모노 칩.
// 버튼이라 키보드(Enter/Space)로도 동작하고, 복사 성공은 아이콘 교체 + aria-live 로 알린다.
const COPIED_RESET_MS = 1500

// label 을 주면 그 텍스트를 칩에 표시하되 클립보드엔 여전히 value 를 복사한다(예: 긴 코드 스니펫을
// "사용법 복사" 같은 짧은 라벨로 노출). 생략하면 기존처럼 value 를 그대로 표시·복사한다.
const CopyChip = ({value, label}: {value: string; label?: string}) => {
    const [isCopied, setIsCopied] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
    const displayText = label ?? value
    const actionText = label ? `${label} 복사` : `${value} 클래스 복사`

    // 언마운트 시 남은 타이머 정리(복사 직후 이동하면 setState 경고 방지).
    useEffect(() => () => clearTimeout(timerRef.current), [])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setIsCopied(true)
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setIsCopied(false), COPIED_RESET_MS)
        } catch {
            // 클립보드 API 미지원·권한 거부 시 조용히 무시(비보안 컨텍스트 등).
        }
    }

    // kit Badge(solid-pastel·neutral·round)로 스타일링하되, asChild 로 실제 요소는 button 을 유지한다
    // — 클릭·키보드·포커스·복사 로직은 그대로 두고 칩 룩만 Badge 에 위임한다([SC-04]).
    return (
        <Badge asChild variant="solid-pastel" color="neutral" shape="round" className="cursor-pointer font-mono">
            <button type="button" onClick={handleCopy} title={isCopied ? '복사됨' : actionText} aria-label={actionText}>
                {displayText}
                {isCopied ? (
                    <Check aria-hidden="true" className="shrink-0" />
                ) : (
                    <Copy aria-hidden="true" className="shrink-0 opacity-60" />
                )}
                <span role="status" aria-live="polite" className="sr-only">
                    {isCopied ? `${actionText}됨` : ''}
                </span>
            </button>
        </Badge>
    )
}

export default CopyChip
