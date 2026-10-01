'use client'

import {useEffect} from 'react'
import {Printer} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 인쇄 버튼 — 보고 있는 문서를 그대로 인쇄한다(브라우저 인쇄 대화상자).
// 새 창으로 여는 평가결과 리포트의 머리에 선다.
//
// 인쇄물에서는 스스로 사라진다 — 종이에 남아도 누를 수 없는 컨트롤이라 문서만 남긴다.

// 인쇄 중에는 차트 칸의 크기를 픽셀로 고정한다(끝나면 되돌린다).
//
// 차트는 그려진 폭을 재서 그린다(ResponsiveContainer). 인쇄 대화상자가 열린 뒤 창이 다시 배치되면
// 폭을 다시 재고 문서 높이가 달라져 쪽 나눔이 바뀌는데, Safari 는 그때 인쇄 대화상자가 멎는 일이 있다.
// 크기를 고정해 두면 다시 재도 값이 같아 쪽 나눔이 흔들리지 않는다(Safari 버그 자체를 고치지는 못한다).
const CHART_SELECTOR = '[data-slot="chart"]'

const usePrintSizeLock = () => {
    useEffect(() => {
        const lock = () => {
            document.querySelectorAll(CHART_SELECTOR).forEach((chart) => {
                if (!(chart instanceof HTMLElement)) return

                // 되돌릴 때 쓸 원래 인라인 값(대개 빈 문자열).
                chart.dataset.printWidth = chart.style.width
                chart.dataset.printHeight = chart.style.height
                chart.style.width = `${chart.offsetWidth}px`
                chart.style.height = `${chart.offsetHeight}px`
            })
        }
        const unlock = () => {
            document.querySelectorAll(CHART_SELECTOR).forEach((chart) => {
                if (!(chart instanceof HTMLElement)) return
                if (chart.dataset.printWidth === undefined) return

                chart.style.width = chart.dataset.printWidth
                chart.style.height = chart.dataset.printHeight ?? ''
                delete chart.dataset.printWidth
                delete chart.dataset.printHeight
            })
        }

        window.addEventListener('beforeprint', lock)
        window.addEventListener('afterprint', unlock)

        return () => {
            window.removeEventListener('beforeprint', lock)
            window.removeEventListener('afterprint', unlock)
            unlock()
        }
    }, [])
}

type PrintButtonProps = {className?: string}

const PrintButton = ({className}: PrintButtonProps) => {
    usePrintSizeLock()

    return (
        <Button
            type="button"
            variant="tertiary"
            size="xs"
            // 문서가 A4 폭이 되면서 버튼도 xs 기본값(32 높이 · 글자 14 · 아이콘 16)을 그대로 쓴다.
            // 인쇄물에서는 스스로 사라진다.
            className={cn('min-w-0 print:hidden', className)}
            onClick={() => window.print()}
        >
            <Printer aria-hidden="true" />
            인쇄
        </Button>
    )
}

export {PrintButton}
export type {PrintButtonProps}
