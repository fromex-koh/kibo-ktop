// 보고서 인쇄본을 새 탭으로 열어 바로 인쇄한다 — K-BIGx 보고서 [보고서 출력] → 인쇄 출력물 선택 [출력하기].
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
const openReportPrintTab = (href: string) => {
    const printHref = toAutoPrintHref(href)
    const printTab = window.open(printHref, '_blank')
    if (!printTab) window.location.assign(printHref)
}

export {openReportPrintTab, REPORT_AUTO_PRINT_QUERY}
