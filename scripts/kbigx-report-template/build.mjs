// K-BIGx 보고서 PDF 템플릿을 단독 HTML 1장(templates/kbigx-report-template.html)으로 만든다.
//   목업 JSON + 현행 화면 코드(React 번들) + 스타일 · 글꼴 + 목업으로 미리 그린 마크업.
//
// 실행: yarn dev 를 켠 상태에서 yarn kbigx-template
//   · 스타일 · 글꼴은 dev 서버의 보고서 미리보기 화면에서 떠 온다(KBIGX_TEMPLATE_BASE_URL 로 서버 주소 변경, 기본 http://localhost:3000).
//   · 헤드리스 Chrome 이 필요하다(CHROME_PATH 로 위치 지정 가능).
//   · PDF 템플릿 코드(kbigx-print-*) · 목업 · 스타일을 바꾸면 다시 실행해 덮어쓴다. 결과물은 손으로 고치지 않는다.
//   · 파일 맨 위 안내 주석은 header.txt 를 고친다.
import {execFileSync} from 'node:child_process'
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import * as esbuild from 'esbuild'
import {openChrome} from './chrome.mjs'
import {stripDark} from './strip-dark.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PROJECT = resolve(HERE, '../..')
const OUTPUT = join(PROJECT, 'templates/kbigx-report-template.html')
const BASE_URL = process.env.KBIGX_TEMPLATE_BASE_URL ?? 'http://localhost:3000'
// 스타일을 떠 올 화면 — PDF 템플릿과 같은 스타일(report-print.css 포함)을 싣는 보고서 미리보기.
const STYLE_PAGE_PATH = '/corp/k-bigx-report/innovation-growth-report/report-print'
const DRAW_TIMEOUT_MS = 20000
// 그리기 완료를 다시 확인하는 간격 · 다 그린 뒤 글꼴 · 애니메이션이 자리 잡기를 기다리는 시간.
const POLL_MS = 200
const SETTLE_MS = 1500
// 목업 JSON 을 받는 자식 프로세스 출력 한도 — 지금 JSON 은 수백 KB 라 넉넉히 둔다.
const DATA_OUTPUT_MAX_MB = 64
const BYTES_PER_MB = 1048576
const BYTES_PER_KB = 1024

const work = mkdtempSync(join(tmpdir(), 'kbigx-template-build-'))
// 중간에 실패해도 임시 폴더 · 헤드리스 Chrome 이 남지 않게 끝에서 늘 정리한다(맨 아래 finally).
let chrome
try {
    // 1) 목업 데이터 JSON · 화면 코드 번들 ---------------------------------------------------------------
    const esbuildCommon = {
        bundle: true,
        tsconfig: join(PROJECT, 'tsconfig.json'),
        absWorkingDir: PROJECT,
        jsx: 'automatic',
        logLevel: 'error',
        // 이미지는 data URI 로 넣고, 컴포넌트가 부르는 CSS 는 2) 에서 화면째 떠 오므로 비운다.
        loader: {'.webp': 'dataurl', '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.css': 'empty'},
        alias: {'next/image': join(HERE, 'next-image-shim.tsx')},
        define: {'process.env.NODE_ENV': '"production"'},
    }

    const dataScript = join(work, 'data-export.mjs')
    await esbuild.build({
        ...esbuildCommon,
        entryPoints: [join(HERE, 'data-export.ts')],
        platform: 'node',
        format: 'esm',
        outfile: dataScript,
    })
    const json = execFileSync('node', [dataScript], {encoding: 'utf8', maxBuffer: DATA_OUTPUT_MAX_MB * BYTES_PER_MB})

    const bundle = await esbuild.build({
        ...esbuildCommon,
        entryPoints: [join(HERE, 'entry.tsx')],
        platform: 'browser',
        format: 'iife',
        minify: true,
        write: false,
        target: 'es2020',
    })
    const js = bundle.outputFiles[0].text

    // 2) 스타일 · 글꼴 — dev 서버 화면에서 <link> · <style> 을 문서 순서대로 떠 와 글꼴 · 이미지까지 data URI 로 넣는다 -----
    const MIME_BY_EXTENSION = {
        woff2: 'font/woff2',
        woff: 'font/woff',
        svg: 'image/svg+xml',
        webp: 'image/webp',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
    }

    const fetchOrThrow = async (url) => {
        const response = await fetch(url).catch(() => undefined)
        if (!response?.ok) throw new Error(`불러오지 못했습니다: ${url} — yarn dev 가 켜져 있는지 확인하세요.`)
        return response
    }

    const toDataUri = async (url) => {
        const response = await fetchOrThrow(url)
        const extension = new URL(url).pathname.split('.').at(-1)?.toLowerCase() ?? ''
        const type = response.headers.get('content-type')?.split(';')[0] || MIME_BY_EXTENSION[extension]
        const body = Buffer.from(await response.arrayBuffer()).toString('base64')
        return `data:${type ?? 'application/octet-stream'};base64,${body}`
    }

    // CSS 안 url(...) 을 data URI 로 바꾼다(이미 data: 이거나 #참조면 그대로).
    const inlineCssUrls = async (css, baseUrl) => {
        const urls = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]))]
        const replacements = await Promise.all(
            urls.map(async (raw) => {
                const value = raw.trim().replace(/^['"]|['"]$/g, '')
                if (value.startsWith('data:') || value.startsWith('#')) return [raw, raw]
                return [raw, `"${await toDataUri(new URL(value, baseUrl).href)}"`]
            }),
        )
        return replacements.reduce((text, [raw, next]) => text.replaceAll(`url(${raw})`, `url(${next})`), css)
    }

    await fetchOrThrow(BASE_URL)
    chrome = await openChrome()
    const stylePageUrl = new URL(STYLE_PAGE_PATH, BASE_URL).href
    await chrome.open(stylePageUrl)
    const captured = await chrome.evaluate(`new Promise(async (resolve) => {
    const startedAt = Date.now()
    while (document.readyState !== 'complete' || document.querySelector('[data-slot="chart-skeleton"]')) {
        if (Date.now() - startedAt > ${DRAW_TIMEOUT_MS}) break
        await new Promise((r) => setTimeout(r, ${POLL_MS}))
    }
    await document.fonts.ready
    await new Promise((r) => setTimeout(r, ${SETTLE_MS}))
    resolve({
        sheets: [...document.querySelectorAll('link[rel~="stylesheet"], style')].map((element) =>
            element.tagName === 'LINK' ? {href: element.href} : {css: element.textContent},
        ),
        bodyAttributes: [...document.body.attributes].map(({name, value}) => [name, value]),
    })
})`)

    const sheets = await Promise.all(
        captured.sheets.map(async (sheet) => {
            const css = sheet.href ? await (await fetchOrThrow(sheet.href)).text() : sheet.css
            return inlineCssUrls(css, sheet.href ?? stylePageUrl)
        }),
    )
    // CSS 주석(원본 경로 · 소스맵 주소)은 지우고, 다크 규칙도 지운다 — 이 파일은 늘 라이트로 그린다(<html class="light">).
    const styles = sheets.map((css) => `<style>${stripDark(css.replace(/\/\*[\s\S]*?\*\//g, ''))}</style>`).join('\n')

    const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
    const bodyAttributes = captured.bodyAttributes
        .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
        .join('')
    // <html> 은 라이트로 고정한다 — 다크 클래스 · color-scheme 이 남으면 열 때 다크로 그렸다가 라이트로 바뀌며 깜빡인다.
    const HTML_ATTRIBUTES = ' lang="ko" class="h-full antialiased light" style="color-scheme: light;"'

    // 3) 문서 틀 ---------------------------------------------------------------------------------------
    const header = readFileSync(join(HERE, 'header.txt'), 'utf8').trimEnd()
    const escapeScript = (text) => text.replace(/<\/(script)/gi, '<\\/$1')
    // 안내 주석은 파일을 열자마자 보이도록 맨 위(<!DOCTYPE> 바로 다음)에 둔다.
    const page = (markup) => `<!DOCTYPE html>
<!--
${header}
-->
<html${HTML_ATTRIBUTES}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>K-BIGx 기업혁신성장 보고서</title>
${styles}
</head>
<body${bodyAttributes}>
<script id="kbigx-report-data" type="application/json">
${escapeScript(json)}
</script>
<div id="kbigx-report-root">${markup}</div>
<script>${escapeScript(js)}</script>
</body>
</html>
`

    // 4) 미리 그린 마크업 — 빈 틀을 열어 목업으로 다 그려진 마크업을 떠서 #kbigx-report-root 에 넣는다 --------------------
    //    스크립트 없이 열어도 보고서가 보이게 하기 위함이다. 캔버스(워드 클라우드)는 그림이 마크업에 남지 않아 <img>(PNG)로 바꾼다.
    const draft = join(work, 'draft.html')
    writeFileSync(draft, page(''))
    await chrome.open(`file://${draft}`)
    const drawn = await chrome.evaluate(`new Promise(async (resolve) => {
    const startedAt = Date.now()
    const root = () => document.getElementById('kbigx-report-root')
    while (!root()?.dataset.ready && !root()?.hasAttribute('data-error') && Date.now() - startedAt < ${DRAW_TIMEOUT_MS}) {
        await new Promise((r) => setTimeout(r, ${POLL_MS}))
    }
    if (root()?.dataset.ready !== 'true') {
        resolve({error: root()?.getAttribute('data-error') ?? '시간 안에 그리지 못했습니다.'})
        return
    }
    const clone = root().cloneNode(true)
    clone.querySelectorAll('script').forEach((script) => script.remove())
    const canvases = [...root().querySelectorAll('canvas')]
    ;[...clone.querySelectorAll('canvas')].forEach((canvas, index) => {
        const img = document.createElement('img')
        img.src = canvases[index].toDataURL('image/png')
        img.alt = ''
        img.className = canvas.className
        img.setAttribute('style', (canvas.getAttribute('style') || '') + ';width:100%;height:100%')
        canvas.replaceWith(img)
    })
    resolve({markup: clone.innerHTML})
})`)
    if (drawn.error) throw new Error(`목업으로 그리지 못했습니다: ${drawn.error}`)

    // 미리 그린 마크업 안 그래프 색 <style>(라이트 · 다크 한 쌍)에서도 다크 규칙을 지운다. 비면 태그째 지운다.
    const lightMarkup = drawn.markup.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/g, (_, attributes, css) => {
        const light = stripDark(css)
        return light.trim() ? `<style${attributes}>${light}</style>` : ''
    })
    const html = page(lightMarkup)
    writeFileSync(OUTPUT, html)
    console.log(
        `✅ ${OUTPUT.replace(`${PROJECT}/`, '')} — ${(html.length / BYTES_PER_MB).toFixed(2)}MB` +
            ` · JSON ${(json.length / BYTES_PER_KB).toFixed(0)}KB · 미리 그린 마크업 ${(drawn.markup.length / BYTES_PER_KB).toFixed(0)}KB`,
    )
} finally {
    await chrome?.close()
    rmSync(work, {recursive: true, force: true})
}
