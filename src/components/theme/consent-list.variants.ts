// PROJECT-STYLE: Figma "동의" 행 — [필수/선택 배지][제목 + 내용보기][동의/비동의 컨트롤] 한 줄 구성.
// 제목은 20px Medium(label-foreground), 설명은 16px Regular(foreground-subtle)에 대시 마커가 붙는다.
// 배지는 제목 줄(32px) 중앙에, 우측 컨트롤은 항목 전체 높이의 중앙에 정렬한다(시안 실측).
// 항목 간격 40px — 시안의 [기업]·[개인] 동의서 카드 모두 행 간격이 40px 다(행 높이 32·60 모두 동일 간격).
const consentListClassName = 'flex list-none flex-col gap-10'

// 모바일(768 미만) 시안은 한 줄이 아니라 [배지] / [제목+내용보기] / [동의·비동의] 세로 스택이다 —
// 폭이 296 라 한 줄에 다 넣으면 제목이 글자 단위로 쪼개진다. md 부터 시안대로 한 줄 그리드가 된다.
const consentItemClassName =
    'flex flex-col gap-2 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start md:gap-x-2 md:gap-y-0'

// 배지 칸 — md 이상에서는 제목 줄 높이(32px) 안에서 세로 중앙. 모바일은 배지 높이(28) 그대로 한 줄을 차지한다.
const consentBadgeClassName = 'flex items-center md:min-h-8'

const consentContentClassName = 'flex min-w-0 flex-col gap-1'

// 제목 줄 — 제목과 "내용보기" 같은 인라인 액션이 나란히 온다. 좁은 폭에서는 줄바꿈한다.
const consentTitleRowClassName = 'flex min-h-8 flex-wrap items-center gap-2'

const consentTitleClassName = 'typo-title-l-medium text-label-foreground'

// 안내 문구 — 대시 마커와 본문 사이 간격은 ListMarker 가 자기 폭에 포함하므로 행에 gap 을 두지 않는다.
const consentDescriptionClassName = 'typo-body-xl-regular text-foreground-subtle flex'

// 컨트롤 — md 이상에서는 항목 전체 높이 기준 중앙 정렬이라 설명 유무와 관계없이 가운데 온다.
// 모바일은 내용 아래 줄로 내려가며 시안 간격이 24 다(스택 gap 8 + mt-4).
const consentControlClassName = 'mt-4 flex shrink-0 items-center md:mt-0 md:self-center md:pl-4'

export {
    consentBadgeClassName,
    consentContentClassName,
    consentControlClassName,
    consentDescriptionClassName,
    consentItemClassName,
    consentListClassName,
    consentTitleClassName,
    consentTitleRowClassName,
}
