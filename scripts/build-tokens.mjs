// tokens.json → src/app/tokens.css 생성기 (빌드타임)
// 실행: yarn tokens  (predev/prebuild 에서 자동 실행)
import {readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

const ROOT = process.cwd()
const OUT = resolve(ROOT, 'src/app/tokens.css')
const tokens = JSON.parse(readFileSync(resolve(ROOT, 'tokens.json'), 'utf8'))
const {scale, primitive, semantic} = tokens
const common = tokens.common ?? {} // 스케일 밖 단일값 앵커 (white/black) → --raw-common-white 등
const alpha = tokens.alpha ?? {} // 반투명 프리미티브 (white/black × alpha% → --raw-white-a5 등)

// 디자인 토큰 (px 숫자로 입력 → rem 출력)
const remBase = tokens.remBase ?? 16
const spacingBase = tokens.spacingBase ?? 4 // 숫자 spacing = calc(base × N), 무한 스케일
const radius = tokens.radius ?? {}
const size = tokens.size ?? {}
const effect = tokens.effect ?? {}
const overlay = tokens.overlay ?? {} // 반투명 오버레이 (모드별 alpha)
const z = tokens.z ?? {} // z-index 레이어 순서 (정수, rem 변환 안 함) → z-* 유틸
const typography = tokens.typography ?? {}
const breakpoint = tokens.breakpoint ?? {} // 반응형 브레이크포인트(px) → wide:/pc: 프리픽스
const container = tokens.container ?? {} // 콘텐츠 최대 폭(px) → max-w-* 유틸
const grid = tokens.grid ?? {} // 브레이크포인트별 레이아웃 그리드(columns/gutter/margin) → .grid-layout
// 타이포 모바일→PC 전환점: breakpoint 키 참조("wide") 또는 px 숫자
const typoBpRaw = tokens.typographyBreakpoint ?? 'wide'
const typoBp = typeof typoBpRaw === 'number' ? typoBpRaw : (breakpoint[typoBpRaw] ?? 768)

// px 숫자 → rem. 문자열(%, em, 특수값 등)은 그대로, 0은 무단위.
const toRem = (v) => (typeof v === 'string' ? v : v === 0 ? '0' : `${+(v / remBase).toFixed(4)}rem`)

const errors = []
const HEX = /^#[0-9a-fA-F]{6}$/
// 다크 반사 = 위치 기반(스케일 배열에서 대칭 위치): 50↔900·100↔800…400↔500.
// 스케일이 비대칭(50~900)이라 산술 100−s 를 못 쓴다. 짝수 길이여야 자기 자신에 매핑되는 스텝이 없다.
const mirror = (s) => scale[scale.length - 1 - scale.indexOf(s)]
const hues = Object.keys(primitive)

// ── 1) 색상 구조 검증 ──
if (scale.length % 2 !== 0)
    errors.push(`scale 길이(${scale.length})가 홀수 — 위치 반사 시 가운데 스텝이 자기 자신에 매핑됨`)
for (const hue of hues) {
    for (const s of scale) {
        const v = primitive[hue][String(s)]
        if (!v) errors.push(`primitive.${hue}.${s} 누락`)
        else if (!HEX.test(v)) errors.push(`primitive.${hue}.${s}="${v}" 는 #RRGGBB 형식 아님`)
    }
}
// common: 스케일 밖 단일값(앵커) — hex 만 검증. semantic 은 {light,dark} 에서만 참조한다(반사 대상 아님).
for (const [k, v] of Object.entries(common))
    if (!HEX.test(v) && v !== 'transparent' && v !== 'currentColor')
        errors.push(`common.${k}="${v}" 는 #RRGGBB 또는 transparent/currentColor 여야 함`)
// 참조 파싱: primitive("gray.900") 는 [hue, 숫자스텝], common("common.white") 은 [hue, 문자키].
const parseRef = (ref) => {
    // 구조 키워드(투명/현재색) — 팔레트 밖 리터럴이라 검증/참조 대상이 아니다(예: 고스트 버튼 fill).
    if (ref === 'transparent' || ref === 'currentColor') return [ref, null]
    const [hue, step] = String(ref).split('.')
    if (hue === 'common') {
        if (!common[step]) errors.push(`참조 "${ref}" — common '${step}' 없음`)
        return [hue, step]
    }
    // alpha 참조("black.75"·"white.50") — 반투명 시맨틱(스크림 등)에서 primitive 대신 alpha 를 가리킨다.
    if (hue === 'black' || hue === 'white') {
        if (!Array.isArray(alpha[hue]) || !alpha[hue].includes(Number(step)))
            errors.push(`참조 "${ref}" — alpha ${hue}.${step} 없음 (tokens.json alpha 에 스텝 추가 필요)`)
        return [hue, step]
    }
    if (!primitive[hue]) errors.push(`참조 "${ref}" — 색상 '${hue}' 없음`)
    else if (!scale.includes(Number(step))) errors.push(`참조 "${ref}" — 스케일 '${step}' 없음`)
    return [hue, Number(step)]
}
for (const val of Object.values(semantic)) {
    if (typeof val === 'string') parseRef(val)
    else {
        parseRef(val.light)
        parseRef(val.dark)
    }
}

// ── 1.5) 디자인 토큰 검증 ──
const numOrStr = (v) => typeof v === 'number' || typeof v === 'string'
if (typeof spacingBase !== 'number') errors.push('spacingBase 는 숫자(px)여야 함')
for (const [k, v] of Object.entries(radius))
    if (!numOrStr(v)) errors.push(`radius.${k} 는 숫자(px) 또는 문자열이어야 함`)
// size: 숫자(px) 또는 다른 size 키를 가리키는 참조(문자열). 참조는 값 중복 없이 별칭을 만든다.
// 예: "header-top": "header-h" → 두 유틸이 같은 실제 값 하나를 공유(하나만 바꿔도 동기화).
for (const [k, v] of Object.entries(size)) {
    if (typeof v === 'number') continue
    if (typeof v !== 'string') {
        errors.push(`size.${k} 는 숫자(px) 또는 다른 size 키 참조(문자열)여야 함`)
    } else if (!(v in size)) {
        errors.push(`size.${k}="${v}" — size 에 없는 키를 참조`)
    } else if (v === k) {
        errors.push(`size.${k} 는 자기 자신을 참조할 수 없음`)
    } else if (typeof size[v] !== 'number') {
        errors.push(`size.${k}="${v}" — 참조 대상은 실제 값(숫자) 키여야 함(다단 참조 불가)`)
    }
}
for (const [k, v] of Object.entries(effect.blur ?? {}))
    if (!numOrStr(v)) errors.push(`effect.blur.${k} 는 숫자(px) 또는 문자열이어야 함`)
// z-index: 정수(레이어 순서). 값이 아니라 순서라 음수 허용(예: 배경 뒤로 보내기).
for (const [k, v] of Object.entries(z)) if (!Number.isInteger(v)) errors.push(`z.${k} 는 정수(z-index)여야 함`)
// breakpoint·container: px 숫자. typographyBreakpoint 는 breakpoint 키(또는 px 숫자)
for (const [group, obj] of Object.entries({breakpoint, container})) {
    for (const [k, v] of Object.entries(obj)) if (typeof v !== 'number') errors.push(`${group}.${k} 는 숫자(px)여야 함`)
}
if (typeof typoBpRaw === 'string' && breakpoint[typoBpRaw] === undefined)
    errors.push(`typographyBreakpoint="${typoBpRaw}" — breakpoint 에 해당 키 없음`)
// grid: 키가 'mobile' + breakpoint 키와 정확히 1:1 대응해야 함 (브레이크포인트 리네임 시 함께 갱신 강제)
if (Object.keys(grid).length) {
    const gridExpectedKeys = ['mobile', ...Object.keys(breakpoint)]
    for (const k of gridExpectedKeys) if (!(k in grid)) errors.push(`grid.${k} 누락 — breakpoint 와 1:1 대응 필요`)
    for (const k of Object.keys(grid))
        if (!gridExpectedKeys.includes(k)) errors.push(`grid.${k} — breakpoint 에 없는 키`)
    for (const [k, v] of Object.entries(grid)) {
        if (!v || typeof v !== 'object') {
            errors.push(`grid.${k} 는 { columns, gutter, margin } 객체여야 함`)
            continue
        }
        if (!Number.isInteger(v.columns) || v.columns < 1) errors.push(`grid.${k}.columns 는 1 이상의 정수여야 함`)
        if (!numOrStr(v.gutter)) errors.push(`grid.${k}.gutter 는 숫자(px) 또는 문자열이어야 함`)
        if (!numOrStr(v.margin)) errors.push(`grid.${k}.margin 는 숫자(px) 또는 문자열이어야 함`)
        // container: 콘텐츠 고정 폭(px 숫자) 또는 유동 상한 문자열("100%" = 상한 없음).
        if (!numOrStr(v.container)) errors.push(`grid.${k}.container 는 숫자(px) 또는 문자열("100%")이어야 함`)
    }
}
// alpha 프리미티브: white/black 만, 스텝은 1~100 숫자 배열
for (const [name, steps] of Object.entries(alpha)) {
    if (name !== 'white' && name !== 'black') errors.push(`alpha.${name} — white/black 만 지원`)
    if (!Array.isArray(steps) || steps.some((s) => typeof s !== 'number' || s < 0 || s > 100))
        errors.push(`alpha.${name} 는 0~100 숫자 배열이어야 함`)
}
// overlay: {light,dark} 각각 alpha 프리미티브 참조("black.5" → --raw-black-a5)
const alphaHas = (ref) => {
    const [name, step] = String(ref).split('.')
    return Array.isArray(alpha[name]) && alpha[name].includes(Number(step))
}
for (const [k, v] of Object.entries(overlay)) {
    if (!v || typeof v.light !== 'string' || typeof v.dark !== 'string') {
        errors.push(`overlay.${k} 는 {light,dark} 참조여야 함 (예: {"light":"black.5","dark":"white.5"})`)
        continue
    }
    for (const mode of ['light', 'dark'])
        if (!alphaHas(v[mode])) errors.push(`overlay.${k}.${mode}="${v[mode]}" — alpha 프리미티브 없음`)
}
// shadow: { x,y,blur,spread(px 숫자) + color:{light,dark} alpha 참조 } → 생성기가 rem 변환·조립
for (const [k, v] of Object.entries(effect.shadow ?? {})) {
    if (!v || typeof v !== 'object') {
        errors.push(`effect.shadow.${k} 는 { x,y,blur,spread,color } 객체여야 함`)
        continue
    }
    for (const f of ['x', 'y', 'blur', 'spread'])
        if (v[f] !== undefined && typeof v[f] !== 'number') errors.push(`effect.shadow.${k}.${f} 는 숫자(px)여야 함`)
    if (v.y === undefined || v.blur === undefined) errors.push(`effect.shadow.${k} 는 y·blur(px) 필요`)
    if (!v.color || typeof v.color.light !== 'string' || typeof v.color.dark !== 'string')
        errors.push(`effect.shadow.${k}.color 는 {light,dark} 참조 필요`)
    else
        for (const mode of ['light', 'dark'])
            if (!alphaHas(v.color[mode]))
                errors.push(`effect.shadow.${k}.color.${mode}="${v.color[mode]}" — alpha 프리미티브 없음`)
}
for (const [name, t] of Object.entries(typography)) {
    if (t.size?.mobile === undefined || t.size?.pc === undefined)
        errors.push(`typography.${name}.size.{mobile,pc} 누락`)
    if (t.weight === undefined || t.lineHeight === undefined) errors.push(`typography.${name}.{weight,lineHeight} 누락`)
}

if (errors.length) {
    console.error('❌ tokens.json 검증 실패:\n' + errors.map((e) => '  - ' + e).join('\n'))
    process.exit(1)
}

// ── 2) 대비(WCAG) 검증 — 텍스트 4.5:1 / 큰텍스트·아이콘·그래픽 3:1 ──
const rawHex = (hue, step) => (hue === 'common' ? common[step] : primitive[hue][String(step)])
const resolveHex = (name, mode) => {
    const val = semantic[name]
    if (typeof val === 'string') {
        const [hue, step] = parseRef(val) // 문자열 = ds 반사
        return rawHex(hue, mode === 'dark' ? mirror(step) : step)
    }
    const [hue, step] = parseRef(val[mode]) // {light,dark} = 직접 raw
    return rawHex(hue, step)
}
const lin = (c) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
const lum = (h) =>
    0.2126 * lin(parseInt(h.slice(1, 3), 16)) +
    0.7152 * lin(parseInt(h.slice(3, 5), 16)) +
    0.0722 * lin(parseInt(h.slice(5, 7), 16))
const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
}
// WCAG: 본문 텍스트 4.5:1 / 큰 텍스트·아이콘·UI 그래픽 3:1 (1.4.3, 1.4.11)
const TEXT = 4.5
const NONTEXT = 3
const CHECKS = [
    {fg: 'bolder', bg: 'background', min: TEXT, kind: '본문 텍스트'},
    {fg: 'subtle', bg: 'background', min: TEXT, kind: '보조 텍스트'},
    {fg: 'primary', bg: 'surface', min: TEXT, kind: '링크 텍스트'},
    {fg: 'error', bg: 'error-surface', min: NONTEXT, kind: '상태 텍스트'},
    {fg: 'warning', bg: 'warning-surface', min: NONTEXT, kind: '상태 텍스트'},
    {fg: 'success', bg: 'success-surface', min: NONTEXT, kind: '상태 텍스트'},
    {fg: 'info', bg: 'info-surface', min: NONTEXT, kind: '상태 텍스트'},
]
for (const {fg, bg, min, kind} of CHECKS) {
    for (const mode of ['light', 'dark']) {
        const r = ratio(resolveHex(fg, mode), resolveHex(bg, mode))
        if (r < min) errors.push(`대비 미달 [${mode}] ${fg} on ${bg} (${kind}): ${r.toFixed(2)}:1 (< ${min})`)
    }
}
if (errors.length) {
    console.error('❌ 대비(WCAG) 검증 실패:\n' + errors.map((e) => '  - ' + e).join('\n'))
    process.exit(1)
}

// ── 3) CSS 생성 ──
const L = []
L.push('/* 자동 생성 파일 — tokens.json 에서 생성됨. 직접 수정 금지. (yarn tokens) */', '')

// 색상 :root
L.push(':root {', '  color-scheme: light;', '')
for (const hue of hues) {
    L.push(`  /* raw ${hue} */`)
    for (const s of scale) L.push(`  --raw-${hue}-${s}: ${primitive[hue][String(s)]};`)
}
// raw alpha 프리미티브 (white/black × alpha%) → --raw-white-a5: rgba(255,255,255,0.05)
const alphaRgb = {white: '255, 255, 255', black: '0, 0, 0'}
for (const [name, steps] of Object.entries(alpha)) {
    L.push('', `  /* raw ${name} alpha */`)
    for (const s of steps) L.push(`  --raw-${name}-a${s}: rgba(${alphaRgb[name]}, ${s / 100});`)
}
// raw common (스케일 밖 단일값 앵커 — 모드 무관 고정) → --raw-common-white 등
if (Object.keys(common).length) {
    L.push('', '  /* raw common (스케일 밖 단일값 — white/black 앵커) */')
    for (const [k, v] of Object.entries(common)) L.push(`  --raw-common-${k}: ${v};`)
}
// alpha 참조("black.5") → var(--raw-black-a5)
const resolveAlpha = (ref) => {
    const [name, step] = String(ref).split('.')
    return `var(--raw-${name}-a${step})`
}
// semantic {light,dark} 값 → raw var. black/white 는 alpha(반투명), 그 외는 primitive/common.
const rawVarRef = (ref) => {
    if (ref === 'transparent' || ref === 'currentColor') return ref
    const [hue] = String(ref).split('.')
    return hue === 'black' || hue === 'white' ? resolveAlpha(ref) : `var(--raw-${ref.replace('.', '-')})`
}
L.push('', '  /* scale (라이트 = raw identity) */')
for (const hue of hues) for (const s of scale) L.push(`  --ds-${hue}-${s}: var(--raw-${hue}-${s});`)
L.push('', '  /* purpose */')
for (const [name, val] of Object.entries(semantic)) {
    if (typeof val === 'string') {
        const [hue, step] = val.split('.')
        L.push(`  --ds-${name}: var(--ds-${hue}-${step});`)
    } else {
        L.push(`  --ds-${name}: ${rawVarRef(val.light)};`)
    }
}
if (Object.keys(overlay).length) {
    L.push('', '  /* overlay (라이트 = 검정 alpha, primitive 참조) */')
    for (const [k, v] of Object.entries(overlay)) L.push(`  --ds-overlay-${k}: ${resolveAlpha(v.light)};`)
}
L.push('}', '')

// 색상 .dark
L.push('.dark {', '  color-scheme: dark;', '')
L.push('  /* scale (다크 = 위치 반사: 50↔900·100↔800…400↔500) */')
for (const hue of hues) for (const s of scale) L.push(`  --ds-${hue}-${s}: var(--raw-${hue}-${mirror(s)});`)
const overrides = Object.entries(semantic).filter(([, v]) => typeof v !== 'string')
if (overrides.length) {
    L.push('', '  /* purpose override (수동 지정) */')
    for (const [name, val] of overrides) {
        L.push(`  --ds-${name}: ${rawVarRef(val.dark)};`)
    }
}
if (Object.keys(overlay).length) {
    L.push('', '  /* overlay override (다크 = 흰색 alpha, primitive 참조) */')
    for (const [k, v] of Object.entries(overlay)) L.push(`  --ds-overlay-${k}: ${resolveAlpha(v.dark)};`)
}
L.push('}', '')

// @theme inline — 색상 브리지 (런타임 --ds 참조)
// Tailwind 기본 색 팔레트(red/slate/… 50~950)를 제거 → 프로젝트 8색·시맨틱만 유효(오사용은 무효 유틸이 되어 드러남).
// breakpoint·container 를 initial 로 지우는 것과 같은 방식. 단 구조 키워드(투명/현재색/상속)는 되살린다.
L.push('@theme inline {')
L.push('  --color-*: initial;')
L.push('  --color-transparent: transparent;')
L.push('  --color-current: currentColor;')
L.push('  --color-inherit: inherit;')
L.push('')
for (const name of Object.keys(semantic)) L.push(`  --color-${name}: var(--ds-${name});`)
for (const k of Object.keys(overlay)) L.push(`  --color-overlay-${k}: var(--ds-overlay-${k});`)
L.push('')
for (const hue of hues) for (const s of scale) L.push(`  --color-${hue}-${s}: var(--ds-${hue}-${s});`)
L.push('}', '')

// 디자인 토큰 값 — plain :root (모드 무관·항상 출력, tree-shake 안 됨). px→rem.
const shadow = effect.shadow ?? {}
const blur = effect.blur ?? {}
// box-shadow 조립: 지오메트리(px→rem) + 색(primitive 참조). offset/blur/spread 도 rem 통일. [PB-03]
const shadowCss = (v, mode) =>
    `${toRem(v.x ?? 0)} ${toRem(v.y ?? 0)} ${toRem(v.blur ?? 0)} ${toRem(v.spread ?? 0)} ${resolveAlpha(v.color[mode])}`
L.push(':root {')
if (Object.keys(size).length) {
    L.push('  /* fixed size (명명) → size-* w-* h-* */')
    // 문자열 값 = 다른 size 키 별칭 → var() 로 참조(값 중복 없이 하나의 실제 값 공유). 숫자 = px→rem.
    const sizeVal = (v) => (typeof v === 'string' ? `var(--ds-spacing-${v})` : toRem(v))
    for (const [k, v] of Object.entries(size)) L.push(`  --ds-spacing-${k}: ${sizeVal(v)};`)
}
if (Object.keys(radius).length) {
    L.push('  /* radius */')
    for (const [k, v] of Object.entries(radius)) L.push(`  --ds-radius-${k}: ${toRem(v)};`)
}
if (Object.keys(shadow).length) {
    L.push('  /* shadow (라이트) — px 입력 → rem, 색은 primitive 참조 */')
    for (const [k, v] of Object.entries(shadow)) L.push(`  --ds-shadow-${k}: ${shadowCss(v, 'light')};`)
}
if (Object.keys(blur).length) {
    L.push('  /* blur */')
    for (const [k, v] of Object.entries(blur)) L.push(`  --ds-blur-${k}: ${toRem(v)};`)
}
if (Object.keys(z).length) {
    L.push('  /* z-index (레이어 순서) — 정수, rem 변환 안 함 */')
    for (const [k, v] of Object.entries(z)) L.push(`  --ds-z-${k}: ${v};`)
}
if (grid.mobile) {
    L.push('  /* grid (모바일 기본) — columns/gutter/margin(최소여백)/container(고정폭), 상위 구간은 아래 @media */')
    L.push(`  --ds-grid-columns: ${grid.mobile.columns};`)
    L.push(`  --ds-grid-gutter: ${toRem(grid.mobile.gutter)};`)
    L.push(`  --ds-grid-margin: ${toRem(grid.mobile.margin)};`)
    L.push(`  --ds-grid-container: ${toRem(grid.mobile.container)};`)
}
L.push('}', '')

// grid 브레이크포인트 오버라이드 (plain media, tree-shake 안 됨). breakpoint 와 같은 rem 단위 사용.
const gridEntries = Object.entries(breakpoint).sort((a, b) => a[1] - b[1])
for (const [key, px] of gridEntries) {
    const g = grid[key]
    if (!g) continue
    L.push(`@media (min-width: ${toRem(px)}) {`, '  :root {')
    L.push(`    --ds-grid-columns: ${g.columns};`)
    L.push(`    --ds-grid-gutter: ${toRem(g.gutter)};`)
    L.push(`    --ds-grid-margin: ${toRem(g.margin)};`)
    L.push(`    --ds-grid-container: ${toRem(g.container)};`)
    L.push('  }', '}', '')
}

// shadow 다크 오버라이드 — 색만 흰색 primitive 로 전환 (지오메트리는 동일). plain .dark
if (Object.keys(shadow).length) {
    L.push('.dark {', '  /* shadow (다크 = 흰색 primitive) */')
    for (const [k, v] of Object.entries(shadow)) L.push(`  --ds-shadow-${k}: ${shadowCss(v, 'dark')};`)
    L.push('}', '')
}

// @theme — spacing base 하나로 숫자 스케일 전체 지배: p-N = calc(var(--spacing) * N), 무한.
L.push('@theme {', `  --spacing: ${toRem(spacingBase)};`)
// breakpoint — Tailwind 기본(sm/md/lg/xl/2xl) 제거 후 정의 키만 → wide:/pc: (모바일 퍼스트)
if (Object.keys(breakpoint).length) {
    L.push('', '  /* breakpoint — 기본 sm/md/lg/xl/2xl 제거, 정의 키만 (모바일 = 기본) */')
    L.push('  --breakpoint-*: initial;')
    for (const [k, v] of Object.entries(breakpoint)) L.push(`  --breakpoint-${k}: ${toRem(v)};`)
}
// container — 콘텐츠 최대 폭. 기본 스케일(4xl 등) 제거, 정의 키만 → max-w-content
if (Object.keys(container).length) {
    L.push('', '  /* container(max-width) — 기본 스케일 제거, 정의 키만 */')
    L.push('  --container-*: initial;')
    for (const [k, v] of Object.entries(container)) L.push(`  --container-${k}: ${toRem(v)};`)
}
L.push('}', '')

// @theme inline — Tailwind 유틸 브리지 (plain --ds-* 참조). size-* rounded-* shadow-* blur-*
L.push('@theme inline {')
for (const k of Object.keys(size)) L.push(`  --spacing-${k}: var(--ds-spacing-${k});`)
for (const k of Object.keys(radius)) L.push(`  --radius-${k}: var(--ds-radius-${k});`)
for (const k of Object.keys(shadow)) L.push(`  --shadow-${k}: var(--ds-shadow-${k});`)
for (const k of Object.keys(blur)) L.push(`  --blur-${k}: var(--ds-blur-${k});`)
L.push('}', '')

// typography — 복합 토큰 → .typo-* 클래스 (모바일 기본 + PC 미디어쿼리)
const typoNames = Object.keys(typography)
if (typoNames.length) {
    L.push(`/* typography → .typo-* (모바일 기본, ${typoBp}px↑ = PC) */`)
    for (const [name, t] of Object.entries(typography)) {
        L.push(`.typo-${name} {`)
        L.push(`  font-size: ${toRem(t.size.mobile)};`)
        L.push(`  font-weight: ${t.weight};`)
        L.push(`  line-height: ${t.lineHeight};`)
        if (t.letterSpacing !== undefined) L.push(`  letter-spacing: ${toRem(t.letterSpacing)};`)
        L.push('}')
    }
    L.push(`@media (min-width: ${typoBp}px) {`)
    for (const [name, t] of Object.entries(typography)) L.push(`  .typo-${name} { font-size: ${toRem(t.size.pc)}; }`)
    L.push('}', '')
}

// .grid-layout — grid(columns/gutter/margin/container)를 한 클래스로 캡슐화.
// width = min(100% − 2×margin, container) + margin-inline:auto:
//  · 넓은 화면: container 고정폭으로 캡핑되고 남는 공간이 자동 여백(중앙정렬) → 스펙의 큰 여백(204/360)이 자동
//  · 좁은 화면: container 에 못 미치면 최소 margin 만 남기고 폭이 유동으로 줄어듦(컬럼이 과하게 안 좁아짐)
if (Object.keys(grid).length) {
    L.push('/* .grid-layout — tokens.json grid 기반 반응형 컬럼 그리드.')
    L.push('   width = min(100% − 2×margin, container): 넓으면 container 고정폭 중앙정렬(남는 공간=자동 여백),')
    L.push('   좁으면 최소 margin 만 남기고 폭이 줄어든다. margin=가장자리 최소 여백, container=콘텐츠 고정 폭. */')
    L.push('.grid-layout {')
    L.push('  display: grid;')
    L.push('  grid-template-columns: repeat(var(--ds-grid-columns), minmax(0, 1fr));')
    L.push('  gap: var(--ds-grid-gutter);')
    L.push('  width: min(100% - 2 * var(--ds-grid-margin), var(--ds-grid-container));')
    L.push('  margin-inline: auto;')
    L.push('}', '')
}

// z-index → z-* 유틸. Tailwind v4 엔 z-index 테마 네임스페이스가 없어 @utility 로 만든다
// (@utility 라 focus:/hover: 등 variant 도 자동 지원). z-[숫자] 하드코딩 대신 z-modal 처럼 쓴다. [CD-002]
if (Object.keys(z).length) {
    L.push('/* z-index → z-* 유틸 (@utility 라 focus: 등 variant 지원) */')
    for (const k of Object.keys(z)) L.push(`@utility z-${k} {`, `  z-index: var(--ds-z-${k});`, '}')
    L.push('')
}

writeFileSync(OUT, L.join('\n'))
console.log(
    `✅ tokens.css 생성 — color(hue ${hues.length}·semantic ${Object.keys(semantic).length}·alpha ${Object.keys(alpha).length}), ` +
        `spacingBase ${spacingBase}px, radius ${Object.keys(radius).length}, ` +
        `size ${Object.keys(size).length}, shadow ${Object.keys(effect.shadow ?? {}).length}, ` +
        `blur ${Object.keys(effect.blur ?? {}).length}, overlay ${Object.keys(overlay).length}, ` +
        `breakpoint ${Object.keys(breakpoint).length}, container ${Object.keys(container).length}, ` +
        `grid ${Object.keys(grid).length}, z ${Object.keys(z).length}, typography ${typoNames.length}`,
)
