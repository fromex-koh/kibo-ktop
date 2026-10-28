// 보고서 문서 화면의 쪽(.report-sheet)들을 PDF 한 파일로 내려받는다 — 도구 막대 [PDF 다운로드](report-print-shell.tsx).
//
// 쪽마다 화면에 그려진 그대로 그림(JPEG)으로 떠서 A4 한 쪽에 한 장씩 넣는다. 그래서 PDF 의 글자는 그림이다
// (선택 · 검색이 안 된다). 글자를 살린 PDF 가 필요하면 서버에서 만들어 내려주는 방식으로 바꾼다.
// 라이브러리는 누를 때 불러온다 — 보고서 화면을 여는 데에는 쓰지 않아 첫 로딩을 늘리지 않는다.
//   · html-to-image(MIT) — 화면 요소를 그림으로 뜬다.
//   · jsPDF(MIT) — 그림을 A4 쪽으로 묶어 PDF 파일로 저장한다.

const REPORT_SHEET_SELECTOR = '.report-sheet'
const CHART_SKELETON_SELECTOR = '[data-slot="chart-skeleton"]'

// 그림 해상도 — 용지 1360px 을 1.5 배(2040px)로 뜬다. A4 폭에 넣으면 약 250dpi 라 글자가 선명하다.
// 더 올리면 파일이 커지고 만드는 시간이 길어진다(쪽 수만큼 곱해진다).
const PDF_PIXEL_RATIO = 1.5
const PDF_JPEG_QUALITY = 0.9

// 그림을 받아올 때 webp · png 를 받는다고 알린다 — 알리지 않으면 Next 이미지 최적화(/_next/image)가 투명 바탕이 없는
// JPEG 로 바꿔 줘서, 표지 · 목차 그림처럼 바탕이 투명한 그림의 빈 곳이 검정으로 나온다.
const IMAGE_FETCH_INIT: RequestInit = {headers: {Accept: 'image/webp,image/png,image/svg+xml,image/*,*/*'}}

// 그림 요소(img · canvas)는 html-to-image 로 뜨지 않고 따로 그려 넣는다.
// html-to-image 는 쪽을 SVG(foreignObject)에 담아 캔버스에 그리는데, Safari 는 그 안의 그림을 그리지 않는다
// (표지 · 목차 그림과, canvas 로 그리는 워드클라우드가 빠진다). 그래서 쪽을 뜰 때는 그림 요소를 잠깐 숨겨(자리는 그대로)
// 글 · 표 · 차트만 뜨고, 그 위에 화면에 있는 그림 요소를 제자리 · 제 크기로 직접 그린다. 브라우저마다 결과가 같다.
// 그림은 맨 위에 얹히므로, 그림 위에 글이 겹치는 배치를 새로 만들면 이 방식을 다시 본다.
const DRAWABLE_SELECTOR = 'img, canvas'
const HIDDEN_VISIBILITY = 'hidden'

// A4 세로(mm). 용지 비율(1360 × 1924)은 A4 와 거의 같아 높이에 맞추고 남는 폭(0.07mm)은 가운데 둔다.
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

// 차트는 크기를 잰 뒤에 그려진다 — 스켈레톤이 남아 있으면 잠깐 기다린다(인쇄 흐름과 같은 기준).
const CHART_READY_INTERVAL_MS = 100
const CHART_READY_TIMEOUT_MS = 5000

const waitForCharts = async () => {
    const startedAt = Date.now()
    const isReady = () =>
        !document.querySelector(CHART_SKELETON_SELECTOR) || Date.now() - startedAt > CHART_READY_TIMEOUT_MS

    await new Promise<void>((resolve) => {
        if (isReady()) {
            resolve()
            return
        }
        const timer = window.setInterval(() => {
            if (!isReady()) return
            window.clearInterval(timer)
            resolve()
        }, CHART_READY_INTERVAL_MS)
    })
}

// 사본에 옮길 스타일 속성 — html-to-image 는 기본으로 요소마다 브라우저의 모든 스타일 속성(약 480개)과 CSS 변수(이 화면은
// 약 820개)를 사본에 적어 넣는다. 대부분은 기본값 그대로라, 쪽 사본이 커져 그림으로 뜨는 시간이 길어진다(28쪽 기준 약 31초 → 10초).
// 그래서 누를 때마다 문서의 요소를 훑어, 한 요소라도 기본값과 다른 속성만 모아 옮긴다. 모든 요소에서 기본값과 같은 속성은
// 옮기지 않아도 사본에서 같은 기본값이 나오므로 그림은 그대로다(속성 목록을 코드에 고정하지 않아 스타일이 바뀌어도 맞다).
//   · 기본값 = 스타일시트 없는 빈 문서(숨긴 iframe)에서 같은 태그가 갖는 값 — 사본이 그려지는 SVG 안과 같은 조건이다.
//   · 가상 요소(::before · ::after)는 기본값 · 부모 값 둘 다와 같을 때만 뺀다(상속 여부를 따지지 않는 보수적 판단).
//   · 뜨는 동안 코드가 바꾸는 속성(그림 숨김 · 배율 · 그림자)은 늘 옮긴다.
// html-to-image 는 처음 받은 목록을 화면(탭)이 닫힐 때까지 다시 쓴다 — 보고서 미리보기는 새 탭으로 열려 한 문서만 받으므로 문제없다.
// 한 탭에서 다른 보고서로 이동해 다시 받는 흐름을 만들면 이 점을 다시 본다.
const ALWAYS_COPIED_PROPERTIES = ['visibility', 'transform', 'box-shadow']
const PSEUDO_ELEMENTS = ['::before', '::after'] as const
const EMPTY_PSEUDO_CONTENTS = ['none', 'normal']
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const CSS_CUSTOM_PROPERTY_PREFIX = '--'

const collectStyleProperties = (sheets: readonly HTMLElement[]) => {
    const allProperties = [...getComputedStyle(document.documentElement)]
    // CSS 변수(--*)는 옮기지 않는다 — 사본에는 계산이 끝난 실제 값이 적히므로 변수를 다시 풀 일이 없다
    // (SVG 색 속성의 var() 는 resolveSvgColorVariables 가 뜨기 전에 실제 색으로 바꾼다).
    const styleProperties = allProperties.filter((name) => !name.startsWith(CSS_CUSTOM_PROPERTY_PREFIX))
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.tabIndex = -1
    frame.style.cssText = 'position: fixed; width: 0; height: 0; border: 0; visibility: hidden;'
    document.body.append(frame)
    const frameWindow = frame.contentWindow
    const frameDocument = frame.contentDocument
    if (!frameWindow || !frameDocument) {
        frame.remove()
        return styleProperties
    }
    const htmlHost = frameDocument.createElement('div')
    const svgHost = frameDocument.createElementNS(SVG_NAMESPACE, 'svg')
    frameDocument.body.append(htmlHost, svgHost)
    const defaults = new Map<string, CSSStyleDeclaration>()
    const defaultStyleOf = (namespace: string | null, localName: string) => {
        const key = `${namespace ?? ''}|${localName}`
        const cached = defaults.get(key)
        if (cached) return cached
        const isSvg = namespace === SVG_NAMESPACE
        const element = isSvg
            ? frameDocument.createElementNS(SVG_NAMESPACE, localName)
            : frameDocument.createElement(localName)
        ;(isSvg ? svgHost : htmlHost).append(element)
        const style = frameWindow.getComputedStyle(element)
        defaults.set(key, style)
        return style
    }

    const used = new Set(ALWAYS_COPIED_PROPERTIES)
    const spanDefault = defaultStyleOf(null, 'span')
    sheets
        .flatMap((sheet) => [sheet, ...sheet.querySelectorAll('*')])
        .forEach((element) => {
            const style = getComputedStyle(element)
            const reference = defaultStyleOf(element.namespaceURI, element.localName)
            styleProperties
                .filter((name) => !used.has(name))
                .filter((name) => style.getPropertyValue(name) !== reference.getPropertyValue(name))
                .forEach((name) => used.add(name))
            PSEUDO_ELEMENTS.map((pseudo) => getComputedStyle(element, pseudo))
                .filter((pseudoStyle) => !EMPTY_PSEUDO_CONTENTS.includes(pseudoStyle.getPropertyValue('content')))
                .forEach((pseudoStyle) =>
                    styleProperties
                        .filter((name) => !used.has(name))
                        .filter((name) => {
                            const value = pseudoStyle.getPropertyValue(name)
                            return (
                                value !== spanDefault.getPropertyValue(name) || value !== style.getPropertyValue(name)
                            )
                        })
                        .forEach((name) => used.add(name)),
                )
        })
    frame.remove()

    return styleProperties.filter((name) => used.has(name))
}

// SVG 색 속성에 CSS 변수가 들어 있으면(recharts 의 fill="var(--kbx-…)") 그림으로 뜰 때 변수가 풀리지 않아 검정이 된다.
// 뜨기 직전에 그 속성들을 지금 화면의 실제 색으로 바꿔 두고, 다 뜬 뒤 원래 값으로 되돌린다(화면은 그대로다).
const SVG_COLOR_ATTRIBUTES = ['fill', 'stroke', 'stop-color', 'flood-color'] as const
const CSS_VARIABLE_PATTERN = 'var('

const resolveSvgColorVariables = (root: HTMLElement) => {
    const changes = [...root.querySelectorAll('svg *')].flatMap((element) =>
        SVG_COLOR_ATTRIBUTES.filter((name) => element.getAttribute(name)?.includes(CSS_VARIABLE_PATTERN)).map(
            (name) => ({element, name, original: element.getAttribute(name) ?? ''}),
        ),
    )
    changes.forEach(({element, name}) => element.setAttribute(name, getComputedStyle(element).getPropertyValue(name)))

    return () => changes.forEach(({element, name, original}) => element.setAttribute(name, original))
}

// 쪽 안의 그림 요소를 숨기고, 다 뜬 뒤 원래대로 되돌린다.
const hideDrawables = (drawables: readonly (HTMLImageElement | HTMLCanvasElement)[]) => {
    const originals = drawables.map((element) => element.style.visibility)
    drawables.forEach((element) => {
        element.style.visibility = HIDDEN_VISIBILITY
    })

    return () =>
        drawables.forEach((element, index) => {
            element.style.visibility = originals[index] ?? ''
        })
}

const isDrawable = (element: Element): element is HTMLImageElement | HTMLCanvasElement =>
    element instanceof HTMLImageElement || element instanceof HTMLCanvasElement

// 뜬 쪽(canvas) 위에 그림 요소를 화면과 같은 자리 · 크기로 그린다. 화면의 용지는 배율(transform)로 줄어 있어
// 화면 좌표를 그 배율로 나눠 용지 좌표로 되돌리고, 뜬 그림의 배율(canvasScale)을 곱한다.
const drawDrawables = async (
    canvas: HTMLCanvasElement,
    sheet: HTMLElement,
    drawables: readonly (HTMLImageElement | HTMLCanvasElement)[],
) => {
    const context = canvas.getContext('2d')
    if (!context) return
    const sheetRect = sheet.getBoundingClientRect()
    const screenScale = sheetRect.width / sheet.offsetWidth
    const canvasScale = canvas.width / sheet.offsetWidth

    await Promise.all(
        drawables.map((element) =>
            element instanceof HTMLImageElement && !element.complete ? element.decode().catch(() => undefined) : null,
        ),
    )
    drawables.forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        if (element instanceof HTMLImageElement && !element.naturalWidth) return
        const toCanvas = (value: number) => (value / screenScale) * canvasScale
        context.drawImage(
            element,
            toCanvas(rect.left - sheetRect.left),
            toCanvas(rect.top - sheetRect.top),
            toCanvas(rect.width),
            toCanvas(rect.height),
        )
    })
}

const downloadReportPdf = async (fileName: string) => {
    const sheets = [...document.querySelectorAll<HTMLElement>(REPORT_SHEET_SELECTOR)]
    const [firstSheet] = sheets
    if (!firstSheet) return

    const [{getFontEmbedCSS, toCanvas}, {jsPDF}] = await Promise.all([import('html-to-image'), import('jspdf')])
    await document.fonts.ready
    await waitForCharts()

    // 화면에서는 용지를 transform 으로 줄여 보이지만, offset 크기는 줄이기 전 크기(1360 × 1924)다.
    const sheetWidth = firstSheet.offsetWidth
    const sheetHeight = firstSheet.offsetHeight
    const imageWidthMm = (A4_HEIGHT_MM * sheetWidth) / sheetHeight
    const imageLeftMm = (A4_WIDTH_MM - imageWidthMm) / 2
    // 글꼴은 한 번만 읽어 모든 쪽에 같이 쓴다 — 쪽마다 읽으면 쪽 수만큼 느려진다.
    const fontEmbedCSS = await getFontEmbedCSS(firstSheet)
    // Safari 처럼 계산된 스타일의 cssText 를 주는 브라우저에서는 html-to-image 가 cssText 를 통째로 옮겨 목록을 쓰지 않는다
    // — 그때는 모으지 않는다(결과 · 시간 모두 지금과 같다).
    const includeStyleProperties = getComputedStyle(firstSheet).cssText ? undefined : collectStyleProperties(sheets)
    const pdf = new jsPDF({orientation: 'portrait', unit: 'mm', format: 'a4', compress: true})

    // 쪽은 차례대로 뜬다 — 한꺼번에 뜨면 메모리가 쪽 수만큼 늘어 긴 보고서에서 브라우저가 멈출 수 있다.
    await sheets.reduce(async (previous, sheet, index) => {
        await previous
        const drawables = [...sheet.querySelectorAll(DRAWABLE_SELECTOR)].filter(isDrawable)
        const restoreSvgColors = resolveSvgColorVariables(sheet)
        const restoreDrawables = hideDrawables(drawables)
        const canvas = await toCanvas(sheet, {
            width: sheetWidth,
            height: sheetHeight,
            pixelRatio: PDF_PIXEL_RATIO,
            fontEmbedCSS,
            includeStyleProperties,
            fetchRequestInit: IMAGE_FETCH_INIT,
            backgroundColor: getComputedStyle(sheet).backgroundColor,
            // 화면 배율(transform)과 그림자는 빼고 원래 크기로 뜬다.
            style: {transform: 'none', boxShadow: 'none'},
        }).finally(() => {
            restoreDrawables()
            restoreSvgColors()
        })
        await drawDrawables(canvas, sheet, drawables)
        const image = canvas.toDataURL('image/jpeg', PDF_JPEG_QUALITY)
        if (index > 0) pdf.addPage()
        pdf.addImage(image, 'JPEG', imageLeftMm, 0, imageWidthMm, A4_HEIGHT_MM)
    }, Promise.resolve())

    pdf.save(fileName)
}

export {downloadReportPdf}
