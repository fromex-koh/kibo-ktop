'use client'

import {FormCard} from '@/components/composite/form-card'
import {Field, FieldGrid} from '@/components/composite/form-fields'
import {InputGroupInput, useFormValues} from '@/components/composite/form-values'
import {InputGroup, InputGroupAddon} from '@/components/ui/input-group'
import {TECH_INDEX_RECORD_COUNT_DEFAULT, TECH_INDEX_RECORD_FIELDS} from '@/constants/technology-evaluation'

// Tech-Index 일반용 [기술실적 및 인증실적] 탭 본문 —
// Figma "[혁신성장지수 (일반) Tech-Index] 2단계_기술실적 및 인증실적".
//
// 시안은 두 층이다.
//   위: 무엇을 실적으로 인정하는지 알려 주는 안내 네 줄(카드 제목 아래 불릿 목록).
//   아래: 실적 건수 네 칸(2열 × 2줄). 모두 사람이 적고, 계산해서 채우는 칸은 없다.
// 시안에 필수 표시(*)가 없어 required 는 두지 않는다.

const COUNT_UNIT = '건'
// 값 이름·처음 값은 constants/technology-evaluation 이 갖는다 — 탭 구성(서버 모듈)도 같은 값을 봐야 한다.
const NUMBER_DEFAULT = TECH_INDEX_RECORD_COUNT_DEFAULT
const [DEVELOPMENT_FIELD, UTILIZATION_FIELD, COMMERCIALIZATION_FIELD, CERTIFICATION_FIELD] = TECH_INDEX_RECORD_FIELDS

// 수량 칸에 들어갈 수 있는 것은 숫자뿐이다. inputMode="numeric" 은 모바일 키보드를 숫자판으로 바꿔 줄 뿐
// 글자 입력을 막지 못하므로(데스크톱 키보드·붙여넣기), 값에서 숫자가 아닌 것을 걷어낸다.
// 앞자리 0 도 함께 정리한다 — "007건" 같은 값이 그대로 제출되면 뒤에서 다시 다듬어야 한다.
const formatCount = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')

// 시안 안내 문구 — 카드 제목 아래에 불릿 목록으로 온다.
const NOTICES = [
    '기술개발은 실험(기획, 시도) 과정과 연구개발을 통해 자체 신기술(새로운 서비스)을 개발하여, 시제품 제작을 완료한 경우를 의미 — 기업이 직접 참여한 공동 개발은 인정, 단순 외주 등을 통한 개발은 불인정 / 단, 개발 후 상용화 된 경우는 기술개발 상용화 실적으로만 인정',
    '기술개발 상용화는 기업이 자체 연구개발을 통해 신기술을 개발하고 신제품(새로운 서비스)을 본격적으로 양산하여 시장에 출시(상용화)한 경우',
    '기술활용 상용화는 기업의 기 보유기술, 외주용역 개발기술, 외부기술 등을 통해 기능개선 혹은 사양(spec.)을 변경하여 제품(서비스)을 시장에 출시하거나, 외부 의뢰를 받아 프로젝트 단위의 주문형 제작 혹은 기술용역을 수행한 경우',
    '기술인증 등 각종 인증실적 — 국내 공인 규격(KS, 전, 검, Q, K마크 등) / 국외 공인 규격(UL, ISO9000시리즈, ISO14000시리즈, QS900시리즈, CSA, CC(정보보호시스템 보안성평가 인증) 등) / 기술인증(EM, NT, KT, IT등 (기술유효기간까지)) / 품질관리수준(싱글PPM, 100PPM 등) / 기타 위에 준하는 국내외 인증',
] as const

// 단위가 붙는 수량 입력 — 시안은 단위를 상자 안 오른쪽에 두고 값을 오른쪽 정렬한다.
const CountField = ({id, name, label}: {id: string; name: string; label: string}) => {
    const {setValue} = useFormValues()

    return (
        <Field id={id} label={label}>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    name={name}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={NUMBER_DEFAULT}
                    format={formatCount}
                    // 지워서 비운 칸은 벗어날 때 0 으로 돌려놓는다 — 이 칸의 "없음" 은 0 이다.
                    onBlur={(event) => {
                        if (!event.currentTarget.value) setValue(name, NUMBER_DEFAULT)
                    }}
                    className="text-right"
                />
                <InputGroupAddon align="inline-end" className="text-foreground">
                    {COUNT_UNIT}
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}

const TechIndexRecordForm = () => (
    <FormCard
        title="기술실적 및 인증실적"
        // 안내가 네 줄짜리 목록이라 <p> 가 아닌 <ul> 로 그린다.
        subtitleAsChild
        subtitle={
            <ul className="flex list-disc flex-col gap-1 pl-5">
                {NOTICES.map((notice) => (
                    <li key={notice}>{notice}</li>
                ))}
            </ul>
        }
    >
        {/* 시안 순서 그대로 두 줄이다 — [기술개발 · 기술활용 상용화] / [기술개발 상용화 · 기술인증]. */}
        <FieldGrid>
            <CountField id="tech-development-count" name={DEVELOPMENT_FIELD} label="기술개발" />
            <CountField
                id="tech-utilization-commercialization-count"
                name={UTILIZATION_FIELD}
                label="기술활용 상용화"
            />
            <CountField
                id="tech-development-commercialization-count"
                name={COMMERCIALIZATION_FIELD}
                label="기술개발 상용화"
            />
            <CountField id="tech-certification-count" name={CERTIFICATION_FIELD} label="기술인증" />
        </FieldGrid>
    </FormCard>
)

export default TechIndexRecordForm
