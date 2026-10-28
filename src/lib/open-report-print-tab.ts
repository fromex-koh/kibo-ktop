// 보고서 문서를 새 탭으로 연다 — 두 가지다.
//   · openReportTab — 문서 화면만 연다. 사용자가 그 화면 도구 막대의 버튼으로 받는다.
//     K-BIGx 보고서 [보고서 다운로드] → 보고서 내용 선택 [보고서 미리보기] → 고른 내용만 담은 보고서 화면 → [PDF 다운로드].
//   · openReportPrintTab — 열자마자 인쇄한다(?print=1). 지금은 쓰는 곳이 없다(K-BIGx 가 PDF 다운로드 흐름으로 바뀜).
// 새 탭(?print=1)은 문서가 다 그려지면 스스로 인쇄 대화상자를 열고, 인쇄가 끝나거나 취소되면 스스로 닫힌다
// (components/custom/report-print-shell.tsx 의 useAutoPrint). Chrome · Safari 모두 같은 방식이다.
//
// 숨긴 iframe 으로 인쇄하지 않는 이유 — Safari 는 iframe 안에서 print() 를 부르면 쪽 폭을 A4 가 아닌 iframe 폭으로 잡아
// 빈 쪽이 나온다. 문서가 최상위 창이 되는 새 탭은 두 브라우저에서 결과가 같아 브라우저별 분기를 두지 않는다.

const REPORT_AUTO_PRINT_QUERY = 'print'

// 주소에 이미 쿼리(보고서 id · 출력 항목)가 있어도 print 만 더한다.
const toAutoPrintHref = (href: string) => {
    const printUrl = new URL(href, window.location.href)
    printUrl.searchParams.set(REPORT_AUTO_PRINT_QUERY, '1')

    return `${printUrl.pathname}${printUrl.search}`
}

// 클릭 같은 사용자 동작 안에서 불러야 팝업 차단에 걸리지 않는다. 그래도 막히면 지금 탭에서 연다
// (인쇄 후 탭이 닫히지 않으므로 뒤로 가기로 돌아온다).
// 새 탭이 인쇄 뒤 스스로 닫으려면 여는 창(opener)을 알아야 해서 noopener 를 주지 않는다 — 같은 사이트 주소만 연다.
const openTab = (href: string) => {
    const tab = window.open(href, '_blank')
    if (!tab) window.location.assign(href)
}

const openReportPrintTab = (href: string) => openTab(toAutoPrintHref(href))

// 문서 화면만 새 탭으로 연다 — 도구 막대의 [닫기]가 그 탭을 닫을 수 있게 여는 창(opener)을 남긴다(같은 사이트 주소만 연다).
const openReportTab = (href: string) => openTab(href)

export {openReportPrintTab, openReportTab, REPORT_AUTO_PRINT_QUERY}
