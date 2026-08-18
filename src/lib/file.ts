// 파일 크기 표시 형식 — 시안 "856.0KB" · "128.4MB" 처럼 단위 하나에 소수 첫째 자리까지 적는다.
//
// 1KB = 1024B(이진 접두어)로 센다 — 브라우저·OS 의 파일 속성 표기와 같은 기준이라
// 사용자가 자기 파일 크기와 화면 값을 그대로 맞춰 볼 수 있다.
// 순수 함수라 상태도 DOM 도 건드리지 않으므로 그대로 단위 테스트할 수 있다.

const BYTES_PER_UNIT = 1024
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

const formatFileSize = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0B'

    // 1024 로 몇 번 나눌 수 있는지가 곧 단위 자리다. 마지막 단위를 넘지 않게 가둔다.
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(BYTES_PER_UNIT)), UNITS.length - 1)
    const size = bytes / BYTES_PER_UNIT ** unitIndex

    // 바이트는 소수가 의미 없다(0.5B 는 없다) — 그 단위만 정수로 적는다.
    return unitIndex === 0 ? `${Math.round(size)}B` : `${size.toFixed(1)}${UNITS[unitIndex]}`
}

export {formatFileSize}
