// K-BIGx 보고서 이용 안내 모달(KbigxLoginGuideDialog)의 문구 — 시안 "K-BIGx 보고서_K-BIGx 보고서 이용 안내"
// (40007590:12034) 그대로다. 로그인하지 않은 채 기술혁신정보를 이용하려 할 때 뜬다.

const LOGIN_GUIDE_TITLE = 'K-BIGx 보고서 이용 안내'
// 시안은 두 줄이다 — 첫 문장 뒤에서 줄을 바꾼다.
const LOGIN_GUIDE_MESSAGE = [
    '기술혁신정보 이용은 로그인이 필요한 서비스입니다.',
    '로그인 페이지로 이동하겠습니까?',
] as const

export {LOGIN_GUIDE_MESSAGE, LOGIN_GUIDE_TITLE}
