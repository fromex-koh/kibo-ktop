'use client'

import {Field, FieldRow3} from '@/components/composite/form-fields'
import {useFormValues} from '@/components/composite/form-values'
import {InputGroup, InputGroupAddon, InputGroupInput as BaseInputGroupInput} from '@/components/ui/input-group'
import {
    TECH_INDEX_PRODUCTION_STAFF_FIELD,
    TECH_INDEX_RESEARCH_STAFF_FIELD,
    TECH_INDEX_TOTAL_STAFF_FIELD,
} from '@/constants/technology-evaluation'

// Tech-Index 일반용 [기술 인력 현황] 탭 상단의 인원 요약 —
// Figma "[혁신성장지수 (일반) Tech-Index] 2단계_기술 인력 현황".
// KTRS-FM 의 핵심 기술 인력 현황 탭에는 없고 이 모형에만 있는 줄이라, 인력 카드 본문(tech-staff-form) 위에
// 끼워 넣는 조각으로 따로 둔다. 카드·행추가는 그쪽이 그대로 갖는다.
//
// 줄 구성 — 한 줄에 세 칸(연구개발 인력 · 생산기술인력 · 총). 아래 인력 카드의 [구분] 선택을 세어
// 모두 자동 계산하며, 사용자가 직접 수정하지 못하도록 읽기 전용으로 보여 준다.

// 값 이름과 처음 값은 constants/technology-evaluation 이 갖는다 — 탭 구성(서버 모듈)도 같은 값을 봐야 한다.
const RESEARCH_FIELD = TECH_INDEX_RESEARCH_STAFF_FIELD
const PRODUCTION_FIELD = TECH_INDEX_PRODUCTION_STAFF_FIELD
const TOTAL_FIELD = TECH_INDEX_TOTAL_STAFF_FIELD
const UNIT = '명'
const STAFF_CATEGORY_FIELD_PATTERN = /^staff-\d+-category$/
const RESEARCH_CATEGORY = 'researchDevelopment'
const PRODUCTION_CATEGORY = 'productionTech'

const CalculatedStaffCountField = ({
    id,
    name,
    label,
    value,
}: {
    id: string
    name: string
    label: string
    value: number
}) => (
    <Field id={id} label={label}>
        <InputGroup>
            <BaseInputGroupInput
                id={id}
                name={name}
                readOnly
                value={String(value)}
                autoComplete="off"
                className="text-right"
            />
            <InputGroupAddon align="inline-end" className="text-foreground">
                {UNIT}
            </InputGroupAddon>
        </InputGroup>
    </Field>
)

const TechIndexStaffSummary = () => {
    const {values} = useFormValues()
    const categories = Object.entries(values)
        .filter(([name]) => STAFF_CATEGORY_FIELD_PATTERN.test(name))
        .map(([, value]) => value)
    const researchCount = categories.filter((category) => category === RESEARCH_CATEGORY).length
    const productionCount = categories.filter((category) => category === PRODUCTION_CATEGORY).length
    const total = researchCount + productionCount

    return (
        <FieldRow3>
            <CalculatedStaffCountField
                id="research-staff-count"
                name={RESEARCH_FIELD}
                label="연구개발 인력"
                value={researchCount}
            />
            <CalculatedStaffCountField
                id="production-staff-count"
                name={PRODUCTION_FIELD}
                label="생산기술인력 (공정, 품질관리)"
                value={productionCount}
            />
            <CalculatedStaffCountField id="total-staff-count" name={TOTAL_FIELD} label="총" value={total} />
        </FieldRow3>
    )
}

export default TechIndexStaffSummary
