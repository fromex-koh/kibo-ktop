'use client'

import {useEffect} from 'react'

// 보고서 화면의 인쇄 규칙 — 각 화면의 <main> 안에 <ReportPageStyle /> 로 한 번 둔다.
//
// A4 세로 · 여백 0 — 이 문서들은 A4 한 쪽(210 × 297mm) 크기이고 여백도 문서가 직접 그린다.
// 기본 여백이 붙거나 용지가 A4 가 아니면 폭이 모자라 브라우저가 문서 전체를 줄인다.
// 여백이 0 이면 브라우저가 그 자리에 찍던 머리글 · 바닥글(날짜 · 주소 · 쪽 번호)도 함께 사라진다 —
// 쪽 번호가 필요하면 문서 안에 직접 그린다.
//
// <style> 은 <main> 의 자식이 될 수 없어(W3C 검사 오류) 본문에 그리지 않고, 화면이 떠 있는 동안만 <head> 에 넣는다.
// 화면을 떠나면 지워져서 다른 화면의 인쇄에는 영향이 없다.
const REPORT_PAGE_STYLE = `
@media print {
    @page { size: A4 portrait; margin: 0; }

    /* 창 높이(dvh) 기준 최소 높이를 푼다 — 인쇄에는 창 높이가 없어 다시 계산될 때마다 쪽 나눔이 흔들린다.
       문서가 이미 A4 크기라 배치는 그대로다. */
    main { min-height: 0; }

    /* 개발 모드에서 Next.js 가 화면에 고정해 띄우는 표시. 인쇄 배치를 건드린다(배포 빌드에는 없다). */
    nextjs-portal { display: none; }
}`

const ReportPageStyle = () => {
    useEffect(() => {
        const style = document.createElement('style')
        style.textContent = REPORT_PAGE_STYLE
        document.head.append(style)

        return () => style.remove()
    }, [])

    return null
}

export {ReportPageStyle}
