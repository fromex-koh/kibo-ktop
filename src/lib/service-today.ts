// 서비스 기준일(한국 날짜) — 이용중지 · 이용권 목업이 모두 이 날짜를 오늘로 쓴다.
// 서버(UTC)와 사용자(KST)의 날짜가 어긋나지 않도록 한국 날짜로 고정한다.
// [프론트엔드 연동] 서버 기준일을 내려 주면 이 함수만 그 값을 돌려주도록 바꾼다(팝업의 시작일 · 종료일 범위도 같이 바뀐다).
const KST_OFFSET_MS = 9 * 60 * 60 * 1000

const getServiceToday = () => {
    const kst = new Date(Date.now() + KST_OFFSET_MS)

    return new Date(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate())
}

export {getServiceToday}
