'use client'

import {Printer} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 인쇄 버튼 — 보고 있는 문서를 그대로 인쇄한다(브라우저 인쇄 대화상자).
// 새 창으로 여는 평가결과 리포트의 머리에 선다.
//
// 인쇄물에서는 스스로 사라진다 — 종이에 남아도 누를 수 없는 컨트롤이라 문서만 남긴다.

type PrintButtonProps = {className?: string}

const PrintButton = ({className}: PrintButtonProps) => (
    <Button
        type="button"
        variant="tertiary"
        size="xs"
        // 리포트 문서는 화면(595)에 맞춰 글자·컨트롤이 한 단계 작다 — 이 화면에서만 쓰는 크기라
        // 버튼 size 축을 늘리지 않고 사용처에서 줄인다(시안 61×28 · 글자 12 · 아이콘 12).
        // 테두리·글자 굵기도 시안을 따른다 — tertiary 기본은 gray.300 테두리에 medium 이지만
        // 시안은 gray.200(border-control) 테두리에 regular 다.
        className={cn(
            "border-control h-7 min-w-0 gap-1 px-3 text-xs font-normal print:hidden [&_svg:not([class*='size-'])]:size-3",
            className,
        )}
        onClick={() => window.print()}
    >
        <Printer aria-hidden="true" />
        인쇄
    </Button>
)

export {PrintButton}
export type {PrintButtonProps}
