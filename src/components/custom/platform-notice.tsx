import type {ReactNode} from 'react'
import {Info} from 'lucide-react'
import {cn} from '@/lib/utils'

// 안내 상자 — 옅은 강조 면(platform-accent-subtle) 위에 정보 아이콘 + 안내 줄 목록. 점 없이 줄만 쌓는다(이용 조건 · 입력 안내 등).
//   · 아이콘은 꾸밈이라 읽지 않는다. 강조 낱말은 <b> 로 넘긴다.
// 쓰는 곳: custom/platform-patent-evaluation.tsx(특허번호 조회 안내) · custom/platform-k-bigx-report.tsx(이용 절차 아래 이용 안내).

const PlatformNotice = ({items, className}: {items: readonly ReactNode[]; className?: string}) => (
    <div
        className={cn(
            'bg-platform-accent-subtle typo-body-xl-regular text-foreground flex gap-3.5 rounded-md px-5.5 py-4.5',
            className,
        )}
    >
        <Info aria-hidden="true" className="text-platform-accent-foreground mt-0.75 size-5 shrink-0" />
        <ul className="grid gap-1 break-keep">
            {items.map((item, index) => (
                // 안내 줄은 순서가 바뀌지 않는 고정 목록이라 순번을 키로 쓴다.
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
)

export {PlatformNotice}
