import type {ReactNode} from 'react'

// 회사명 · 기관명의 줄바꿈 — 띄어쓰기가 있으면 낱말 사이에서 끊고, 없으면 줄을 채운 뒤 글자 사이에서 끊되 끝 글자만 남지 않게 한다.
// 띄어쓰기 없는 이름에 break-keep 을 그대로 두면 "(주)" 뒤에서만 끊겨 "(주)" 한 줄 + 나머지로 갈라진다.
const getNameBreakClassName = (name: ReactNode) =>
    typeof name === 'string' && !/\s/.test(name) ? 'break-normal text-pretty' : 'break-keep'

export {getNameBreakClassName}
