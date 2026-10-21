// K-BIGx 인쇄본 치수 · 글자 어림 — 서버(쪽 · 행 수 어림)와 화면(글자 맞추기)이 같은 값을 쓰도록 한곳에 둔다.
// 'use client' 가 없는 순수 모듈이라 서버 · 클라이언트 어디서든 import 해도 값이 그대로 온다.

// ── 쪽 치수(용지 px, 폭 1360) ──
// 본문은 위 136 에서 시작해 높이 1697, 바닥글 선은 1833. 모든 쪽은 내용을 바닥글 선과 40 이상 띄운다.
const KBX_PAGE_BODY_TOP = 136
const KBX_PAGE_BODY_HEIGHT = 1697
const KBX_PAGE_FOOTER_LINE = KBX_PAGE_BODY_TOP + KBX_PAGE_BODY_HEIGHT
const KBX_FOOTER_GAP = 40
const KBX_PAGE_CONTENT_BOTTOM = KBX_PAGE_FOOTER_LINE - KBX_FOOTER_GAP

// ── 글자 줄이기 단계(px) ──
// KbxFitText(kbigx-print-fit-value.tsx)가 줄여 나가는 크기이자, 기업현황 첫 쪽 높이 어림이 같은 단계로 센다.
// 단계를 바꾸면 kbigx-print-fit-value.tsx 의 FIT_TEXT_CLASSES 에 클래스도 더한다(타입이 빠진 크기를 알려준다).
const KBX_FIT_TEXT_SIZES = [24, 23, 22, 21, 20, 19, 18, 17, 16, 14, 12] as const

// ── 글자 폭 어림 ──
// 서버에서 그려 실제 글자 폭을 잴 수 없어 글자 종류별 비율로 어림한다. 쓰임새가 달라 비율이 둘이다.
//   · estimateLines — 여러 줄 칸의 줄 수(행 · 쪽 높이 어림). 한글을 1em 로 넉넉히 잡아 높이를 모자라게 세지 않는다.
//   · estimateTextEm — 한 줄 맞춤(fitKbxText · 수치 카드)의 글자 폭. 영문 대 · 소문자 · 기호를 나눠 좀 더 가깝게 센다.
// 비율을 바꾸면 쓰는 곳(행 수 · 글자 단계)이 달라지므로 확인 화면에서 넘침 표시를 다시 본다.

// estimateLines — 한글은 글자 크기만큼, 숫자 · 영문 · 기호는 0.56배, 낱말 사이 공백은 0.3배.
// 줄바꿈은 표 칸과 같이 낱말 단위(break-keep)로 흉내 낸다 — 안 들어가는 낱말은 다음 줄로, 한 줄보다 긴 낱말은
// 줄 끝에서 끊긴다(wrap-anywhere).
const HANGUL_PATTERN = /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3]/
const NARROW_CHAR_RATIO = 0.56
const SPACE_RATIO = 0.3
const textWidth = (text: string, fontSize: number) =>
    [...text].reduce((sum, char) => sum + (HANGUL_PATTERN.test(char) ? 1 : NARROW_CHAR_RATIO), 0) * fontSize

const estimateLines = (text: string, fontSize: number, width: number) =>
    text
        .split(' ')
        .filter(Boolean)
        .reduce(
            (acc, word) => {
                const wordWidth = textWidth(word, fontSize)
                const space = acc.used ? SPACE_RATIO * fontSize : 0
                if (acc.used + space + wordWidth <= width) return {lines: acc.lines, used: acc.used + space + wordWidth}
                // 새 줄에서 시작 — 한 줄보다 길면 넘친 몫만큼 줄이 더 늘고, 마지막 줄에 남은 폭이 이어진다.
                const startLines = acc.lines + (acc.used ? 1 : 0)
                return {
                    lines: startLines + Math.ceil(wordWidth / width) - 1,
                    used: wordWidth - (Math.ceil(wordWidth / width) - 1) * width,
                }
            },
            {lines: 1, used: 0},
        ).lines

// estimateTextEm — 글자 크기 대비 폭(em, Pretendard). 한글 · 전각 1, 영문 대문자 · 숫자 0.62, 소문자 0.55, 공백 · 기호 0.35.
// 넘치지 않는 쪽으로 조금 넉넉하게 잡는다.
const WIDE_CHAR_START = 0x1100
const estimateTextEm = (text: string) =>
    [...text].reduce((sum, char) => {
        const code = char.codePointAt(0) ?? 0
        if (code >= WIDE_CHAR_START) return sum + 1
        if (/[A-Z0-9]/.test(char)) return sum + 0.62
        if (/[a-z]/.test(char)) return sum + 0.55
        return sum + 0.35
    }, 0)

export {
    estimateLines,
    estimateTextEm,
    KBX_FIT_TEXT_SIZES,
    KBX_FOOTER_GAP,
    KBX_PAGE_BODY_HEIGHT,
    KBX_PAGE_CONTENT_BOTTOM,
}
