import type {KbigxPrintPage} from '@/content/service/k-bigx-print-report'

// K-BIGx 보고서 인쇄본 — 본문 컴포넌트가 아직 없는 쪽의 자리 표시.
// 지금은 모든 쪽 종류가 kbigx-print-document.tsx 의 PAGE_CONTENT 에 있어 그려지지 않는다.
// 새 쪽 종류를 더하는 동안 빈 쪽 대신 보이는 대비용이다.

// 쪽 틀(KbxPage) 안에 들어간다. 목록을 나눈 쪽이면 맡은 범위를 함께 보인다.
const KbigxPrintPagePlaceholder = ({page}: {page: KbigxPrintPage}) => (
    <div className="flex flex-col gap-4">
        <h3 className="kbx-text-36 tracking-kbx-tight font-kbx-extrabold">{page.title}</h3>
        <div className="kbx-text-22 text-kbx-foreground-subtle">이 쪽은 준비 중입니다.</div>
        {page.range ? (
            <div className="kbx-text-22 text-kbx-foreground-subtle">
                목록 {page.range.start + 1}~{page.range.end}번째 / 전체 {page.range.total}건
            </div>
        ) : null}
    </div>
)

export {KbigxPrintPagePlaceholder}
