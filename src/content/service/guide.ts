// 이용안내 화면의 문구 — 기업·기관이 같은 글을 쓴다. 화면 구조는 components/custom/service-guide.tsx 가 갖는다.
//
// [프론트엔드 연동] 문구를 API·CMS 에서 받게 되면 이 파일의 값만 같은 모양으로 바꿔 넣는다.

const GUIDE_NOTICE = '기술보증기금은 온라인으로 다양한 기술평가 관련 정보와 평가 서비스를 제공하고 있습니다.'

// 지원 브라우저의 단일 소스 — 여기에 더하거나 빼면 화면의 카드가 따라간다.
// 로고 등록(service-guide.tsx 의 GUIDE_BROWSER_LOGOS)은 타입이 강제하므로 빠뜨리면 빌드가 막는다.
const GUIDE_BROWSERS = ['Microsoft Edge', 'Chrome', 'Naver Whale', 'Safari'] as const

// 확대/축소 예시 그림의 라벨과 alt — label 로 그림을 찾고(GUIDE_ZOOM_SCREENSHOTS) caption 은 alt 로 쓴다.
const GUIDE_ZOOM_EXAMPLES = [
    {label: 'Microsoft Edge', caption: 'Microsoft Edge의 확대/축소 메뉴 위치'},
    {label: 'Chrome', caption: 'Chrome의 확대/축소 메뉴 위치'},
] as const

const GUIDE_BASIC_TITLE = '기본 안내'
const GUIDE_BROWSER_TYPES_TITLE = '이용 가능한 브라우저 종류'
const GUIDE_BROWSER_TYPES_TEXT = '아래 브라우저의 최신 버전에서 이용할 수 있습니다.'
const GUIDE_RESOLUTION_TITLE = '화면 해상도'
const GUIDE_RESOLUTION_TEXT = 'PC로 접속 시 1920×1080 해상도에 최적화된 화면입니다.'

const GUIDE_ZOOM_TITLE = '화면크기 조절 안내'
const GUIDE_ZOOM_LEAD = 'K-TOP은 화면크기를 사용자가 직접 조절할 수 있도록 만들었습니다.'
const GUIDE_ZOOM_ITEMS = [
    '설정 > 확대/축소에서 브라우저의 화면크기를 조절할 수 있습니다.',
    '글자가 작게 보일 때는 브라우저 옵션 > 확대/축소 > 125% 또는 150% 등으로 설정하시기 바랍니다.',
] as const

// 접근성 '준수' 를 단정하는 문장은 의도적으로 두지 않는다 — 이용 방법만 안내한다.
// 개발 기준(KWCAG 2.1)은 docs/ACCESSIBILITY.md 가 갖는다. 문구를 되살리지 않는다.
const GUIDE_ACCESSIBILITY_TITLE = '접근성 안내'

const GUIDE_SCREEN_READER_TITLE = '시각장애인을 위한 이용 안내'
const GUIDE_SCREEN_READER_ITEMS = [
    'K-TOP은 시각장애인을 위한 별도의 화면을 두지 않고 같은 화면에서 이용할 수 있도록 만들었습니다.',
    '시각장애인 여러분께서 K-TOP을 이용하시려면 화면을 읽어 주는 스크린 리더 프로그램이 필요합니다.',
] as const

// 글 중간에 링크가 둘 들어가는 줄 — 화면이 lead · 링크 · middle · 링크 · tail 순으로 이어 붙인다.
// [확인 대기] 두 기관의 현행 명칭 · 주소(https 여부)는 기획 확인 중이다.
const GUIDE_ASSISTIVE_DEVICE = {
    lead: '스크린리더 및 기타보조기기에 대한 안내는 정보통신보조기기(',
    middle: ') 웹사이트에서 안내 받으실 수 있으며, 중앙보조기구센터(',
    tail: ')에서 장애인보조기구 지원사업에 대한 각종 정보를 확인하실 수 있습니다.',
    links: [
        {label: 'http://www.at4u.or.kr', href: 'http://www.at4u.or.kr', name: '정보통신보조기기'},
        {label: 'http://knat.go.kr', href: 'http://knat.go.kr', name: '중앙보조기구센터'},
    ],
} as const

const GUIDE_KEYBOARD_TITLE = '키보드 이용 안내'
const GUIDE_KEYBOARD_ITEMS = [
    '다음 항목으로 이동하실 때는 Tab 키를 누릅니다.',
    '이전 항목으로 이동하실 때는 Shift + Tab 키를 누릅니다.',
    '메뉴나 항목을 선택하거나 첨부파일을 내려받으실 때는 Enter 키를 누릅니다.',
    '이전 페이지로 이동하실 때는 Alt + ← 키를 누릅니다(Mac은 Command + ←).',
] as const

// [확인 대기] 담당부서는 아직 정해지지 않아 '추후 확정' 을 그대로 노출한다 — 값을 받으면 교체한다.
const GUIDE_CONTACT_TITLE = '담당자 정보'
const GUIDE_CONTACT_ITEMS = [
    {label: '담당부서', value: '추후 확정'},
    {label: '전화번호', value: '1544-1120 (대표전화)'},
] as const

export {
    GUIDE_ACCESSIBILITY_TITLE,
    GUIDE_ASSISTIVE_DEVICE,
    GUIDE_BASIC_TITLE,
    GUIDE_BROWSER_TYPES_TEXT,
    GUIDE_BROWSER_TYPES_TITLE,
    GUIDE_BROWSERS,
    GUIDE_CONTACT_ITEMS,
    GUIDE_CONTACT_TITLE,
    GUIDE_KEYBOARD_ITEMS,
    GUIDE_KEYBOARD_TITLE,
    GUIDE_NOTICE,
    GUIDE_RESOLUTION_TEXT,
    GUIDE_RESOLUTION_TITLE,
    GUIDE_SCREEN_READER_ITEMS,
    GUIDE_SCREEN_READER_TITLE,
    GUIDE_ZOOM_EXAMPLES,
    GUIDE_ZOOM_ITEMS,
    GUIDE_ZOOM_LEAD,
    GUIDE_ZOOM_TITLE,
}
