// K-BIGx 기업신용등급 게이지 데이터 — 등급 코드로 SemicircleRatingGauge 의 data 를 만들고, 등급 단계 색 · 트랙을 붙인다.
// 'use client' 가 없는 순수 계산 파일이다(웹 보고서 문서 · 가이드가 함께 쓴다).
//   · 색: 등급 단계(cri-grades.ts getCriGradeBand — 우량 ~ 위험 · 유보)마다 credit-gauge-<단계> 그라데이션.
//   · 채움: 등급 순위(toCriRatingData). 유보(R)는 순위 밖이라 절반(50), 평가제외(NR) · 표에 없는 코드는 0(트랙만).
// [프론트엔드 연동] API 가 등급 코드 · 날짜 목록을 주면 toCreditGaugeData(코드, 날짜 목록)를 게이지 data 로 넘긴다.
import {CREDIT_GAUGE_TRACK, creditGaugeGradient} from '@/components/custom/arc-gauge-shape'
import type {RatingGaugeDetail, SemicircleRatingData} from '@/components/custom/semicircle-rating-gauge'
import {getCriGradeBand, toCriRatingData} from '@/content/service/cri-grades'

// 유보(R) 채움 — 등급 순위 밖이라 절반만 채운다.
const CREDIT_HOLD_PERCENTAGE = 50
// 값이 없을 때 — 등급 코드가 비면 등급 자리 '-'(설명 없음 · 트랙만), 날짜 값이 비면 '-'.
const EMPTY_VALUE = '-'

const toCreditGaugeData = (grade: string, details: RatingGaugeDetail[] = []): SemicircleRatingData => {
    const filledDetails = details.map((detail) => ({...detail, value: detail.value.trim() || EMPTY_VALUE}))
    if (!grade.trim()) {
        return {
            label: EMPTY_VALUE,
            description: '',
            percentage: 0,
            details: filledDetails,
            trackColor: CREDIT_GAUGE_TRACK,
        }
    }
    const band = getCriGradeBand(grade)
    const data = toCriRatingData(grade, filledDetails)
    return {
        ...data,
        percentage: band === 'hold' ? CREDIT_HOLD_PERCENTAGE : data.percentage,
        gradient: band && band !== 'excluded' ? creditGaugeGradient(band) : undefined,
        trackColor: CREDIT_GAUGE_TRACK,
    }
}

export {toCreditGaugeData}
