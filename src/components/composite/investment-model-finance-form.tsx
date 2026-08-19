'use client'

import {FieldGrid, FieldRow3} from '@/components/composite/form-fields'
import {FormCard} from '@/components/composite/form-card'
import {UnitField} from '@/components/composite/company-etc-form'
import {
    INVESTMENT_MODEL_FINANCE_ROW1_FIELDS,
    INVESTMENT_MODEL_FINANCE_ROW2_FIELDS,
} from '@/constants/technology-evaluation'

// 투자모형 [재무정보] 탭 본문 — Figma "투자모형_2단계_기업·기술정보 입력_재무정보".
//
// Tech-Index 의 같은 이름 탭(tech-index-finance-form)과 전혀 다르다 — 그쪽은 재무기준일과 과거 3개년
// 계정 묶음이고, 이 모형은 당기·전기의 금액 다섯 칸뿐이라 모형 전용 조각으로 둔다.
// 금액 칸의 생김새(값 오른쪽 정렬 · 단위를 상자 안에)와 처리(숫자만·앞자리 0 정리·비우면 0 으로 복원)는
// [기업 기타 정보] 탭과 같아 그쪽 조각(UnitField)을 그대로 가져다 쓴다.
//
// 시안에 필수 표시(*)가 없어 required 는 두지 않는다 — Tech-Index 재무정보 탭과 같은 처리다.
// 처음 값도 넣지 않는다. 자리 안내(placeholder)로만 0 을 보여 주고 값은 비워 두어야, 사용자가 0 을
// 그대로 적었을 때 "손댔다" 로 세어 탭이 [작성완료] 가 된다(처음 값으로 0 을 넣어 두면 같은 값이라
// 손댄 것으로 세지 않아 [미작성] 에 머문다).
//
// 단위는 시안대로 "원" 이다 — 같은 화면의 [기업 기타 정보] 매출현황이 "백만원" 인 것과 다르다.
const AMOUNT_UNIT = '원'

const InvestmentModelFinanceForm = () => (
    <FormCard title="재무정보">
        <div className="flex flex-col gap-4">
            {/* 시안 배치 — 1줄 [당기 매출액 · 당기 영업이익] 2열, 2줄 [당기 순이익 · 당기 자본총계 · 전기 순이익] 3열. */}
            <FieldGrid>
                {INVESTMENT_MODEL_FINANCE_ROW1_FIELDS.map((field) => (
                    <UnitField key={field.id} id={field.id} label={field.label} unit={AMOUNT_UNIT} required={false} />
                ))}
            </FieldGrid>
            <FieldRow3>
                {INVESTMENT_MODEL_FINANCE_ROW2_FIELDS.map((field) => (
                    <UnitField key={field.id} id={field.id} label={field.label} unit={AMOUNT_UNIT} required={false} />
                ))}
            </FieldRow3>
        </div>
    </FormCard>
)

export default InvestmentModelFinanceForm
