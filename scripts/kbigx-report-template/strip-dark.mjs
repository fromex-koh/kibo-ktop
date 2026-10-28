// CSS 에서 다크 모드 규칙만 걸러 낸다 — 이 파일은 늘 라이트로 그리므로(<html class="light">) 다크 규칙은 쓰이지 않는다.
// 선택자 목록에서 .dark 조건이 든 부분만 빼고, 다 빠진 규칙은 통째로 지운다. @media · @supports · @layer 안과 중첩 규칙도 같은 방식.
// '.dark\:block' 처럼 이름이 dark 로 시작하는 클래스는 다크 조건이 아니므로 남긴다(뒤에 '\' 가 붙는다).
const DARK_CLASS = /\.dark(?![\w\\-])/

// 따옴표 · 괄호 안은 건너뛰며 i 부터 targets 중 처음 나오는 문자의 위치를 찾는다.
const scan = (text, start, targets) => {
    let depth = 0
    let quote = ''
    for (let i = start; i < text.length; i += 1) {
        const ch = text[i]
        if (quote) {
            if (ch === '\\') i += 1
            else if (ch === quote) quote = ''
            continue
        }
        // 클래스 이름 안의 이스케이프(예: content-\[\'\'\])는 따옴표 · 괄호가 아니다 — 다음 글자를 건너뛴다.
        if (ch === '\\') i += 1
        else if (ch === '"' || ch === "'") quote = ch
        else if (ch === '(' || ch === '[') depth += 1
        else if (ch === ')' || ch === ']') depth -= 1
        else if (depth === 0 && targets.includes(ch)) return i
    }
    return -1
}

// '{' 다음부터 짝이 맞는 '}' 의 위치.
const matchBrace = (text, open) => {
    let depth = 0
    let i = open
    while (i < text.length) {
        const k = scan(text, i, '{}')
        if (k < 0) return text.length
        depth += text[k] === '{' ? 1 : -1
        if (depth === 0) return k
        i = k + 1
    }
    return text.length
}

const splitSelectors = (selector) => {
    const parts = []
    let start = 0
    for (;;) {
        const k = scan(selector, start, ',')
        if (k < 0) break
        parts.push(selector.slice(start, k))
        start = k + 1
    }
    parts.push(selector.slice(start))
    return parts
}

const stripDark = (css) => {
    let out = ''
    let i = 0
    while (i < css.length) {
        const k = scan(css, i, '{;}')
        if (k < 0) {
            out += css.slice(i)
            break
        }
        if (css[k] !== '{') {
            out += css.slice(i, k + 1)
            i = k + 1
            continue
        }
        const prelude = css.slice(i, k)
        const close = matchBrace(css, k)
        const inner = css.slice(k + 1, close)
        i = close + 1
        if (prelude.trim().startsWith('@')) {
            const keep = /^@(font-face|keyframes|-webkit-keyframes|property|page|counter-style)\b/.test(prelude.trim())
            const body = keep ? inner : stripDark(inner)
            if (body.trim()) out += `${prelude}{${body}}`
            continue
        }
        const kept = splitSelectors(prelude).filter((part) => !DARK_CLASS.test(part))
        if (!kept.length) continue
        out += `${kept.join(',')}{${stripDark(inner)}}`
    }
    return out
}

export {stripDark}
