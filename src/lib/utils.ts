import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// 프로젝트 커스텀 spacing 스케일(control-h·control-min-w·icon)을 twMerge 에 등록한다.
// 미등록 시 h-control-h-* / min-w-control-* / size-icon-* 같은 커스텀 유틸이 표준 유틸(h-auto·min-w-0 등)과
// 충돌 해소(dedupe)되지 않아 className 오버라이드가 무시된다(예: link 를 인라인으로 리셋 불가, 아이콘 버튼 min-w 제거 불가).
// shadcn 순정 cn 을 확장하는 예외 — SHADCN.md 의 "그럴 만한 이유가 있을 때만 cn 확장, 주석으로 남긴다" 에 해당.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "control-h-xs",
        "control-h-sm",
        "control-h-md",
        "control-h-lg",
        "control-h-xl",
        "control-h-2xl",
        "control-min-w-xs",
        "control-min-w-sm",
        "control-min-w-md",
        "control-min-w-lg",
        "icon-xs",
        "icon-sm",
        "icon-md",
        "icon-lg",
        "icon-xl",
        "icon-2xl",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
