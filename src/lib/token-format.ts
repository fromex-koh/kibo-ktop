import tokens from '@tokens'

// 토큰 값을 가이드 표에 적는 형식으로 바꾼다.
//
// tokens.json 의 수치는 px 로 관리하고 생성기가 rem 으로 바꾼다([PB-03]). 다만 유동 크기처럼
// 단위 변환 대상이 아닌 값은 문자열로 적히는데, 그 안의 rem 은 표에서 px 로 되돌려 보여준다 —
// 다른 행이 전부 px 기준이라 혼자 rem 이면 크기를 가늠할 수 없다.
export const remLiteralsToPx = (value: string): string =>
    value.replace(/(\d*\.?\d+)rem\b/g, (_, number) => `${Number(number) * tokens.remBase}px`)
