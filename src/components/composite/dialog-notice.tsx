import {ListMarker} from '@/components/custom/list-marker'

// 모달 안내 패널 — 모달 맨 위에서 "무엇을 하는 자리인지" 한두 줄로 알린다(시안 "인포").
//
// 페이지 하단의 InfoBox 와 같은 "회색 면 + 불릿" 이지만 모달 규격이 따로다 —
// 시안: 면 gray.10(surface-subtle) · 반경 8 · 여백 20 · 본문 14/21 · 제목 없음 /
// InfoBox: 면 gray.50 · 반경 16 · 여백 40·32 · 본문 16/24 · 제목 있음.
// 업종코드 조회에 이어 기술평가센터 검색에도 같은 규격이 나와 공통 조각으로 옮겼다.
const DialogNotice = ({notices}: {notices: readonly string[]}) => (
    <ul className="bg-surface-subtle flex list-none flex-col gap-2 rounded-sm p-5">
        {notices.map((notice) => (
            <li key={notice} className="flex">
                {/* 본문이 14/21 이라 점도 작은 것(12×20 칸 · 3×3 점)을 쓴다 — 16/24 본문용 점을 쓰면
                    칸이 24 라 점이 글줄 가운데보다 아래로 내려간다(시안 list_atomic_bullet 작은 형). */}
                <ListMarker type="unordered-small" />
                <span className="typo-body-l-regular text-foreground-subtle min-w-0">{notice}</span>
            </li>
        ))}
    </ul>
)

export {DialogNotice}
