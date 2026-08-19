'use client'

import {FieldGrid, FieldRow3} from '@/components/composite/form-fields'
import {FormCard} from '@/components/composite/form-card'
import {Input, Textarea, useFormValues} from '@/components/composite/form-values'
import {TechnologyDefinitionDialog} from '@/components/composite/technology-definition-dialog'
import {TradeTypeGuideDialog} from '@/components/composite/trade-type-guide-dialog'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {LabellessField, RadioRow, Section, UnitField} from '@/components/composite/company-etc-form'
import {
    INVESTMENT_MODEL_EMPLOYEE_COUNT_FIELD,
    INVESTMENT_MODEL_EMPLOYEE_COUNT_LAST_YEAR_FIELD,
    INVESTMENT_MODEL_IP_FIELDS,
    INVESTMENT_MODEL_IP_WIDE_FIELDS,
    INVESTMENT_MODEL_TECH_STAFF_FIELD,
} from '@/constants/technology-evaluation'

// 투자모형 [기업 기타 정보] 탭 본문 — Figma "투자모형_2단계_기업·기술정보 입력_기업 기타 정보".
//
// KTRS-FM 의 같은 이름 탭(company-etc-form)과 구획 순서는 비슷하지만 칸이 달라 모형별로 따로 둔다.
//   기술인력      KTRS-FM 은 학력별 4칸, 이 모형은 합계 1칸
//   지식재산권    KTRS-FM 은 6칸(등록·출원을 나눔), 이 모형은 권리별 11칸
//   매출현황      KTRS-FM 은 연간 환산 매출액까지 3칸, 이 모형은 2칸
//   고용인원      KTRS-FM 은 [상시근로자수] 한 구획, 이 모형은 [현재 고용인원] 과 [1년 전 고용인원 수] 두 구획
//   생산 방식     이 모형에만 있다
//   평가기술 IPC  KTRS-FM 에만 있다
// 구획 제목 줄·단위 입력·라디오 줄은 같은 생김새라 그쪽 조각을 그대로 가져다 쓴다.
//
// 필수(*)는 KTRS-FM 의 같은 탭과 맞춘다 — 시안에는 * 가 한 곳도 없지만, 같은 성격의 칸이 화면마다
// 다르게 요구되면 옮겨 다니는 사용자가 매번 다시 확인해야 한다. 수량 칸은 처음부터 0 이 들어 있어
// "해당사항 없음" 도 그대로 통과한다(카드 안내 문구와 같은 규칙).

const OWN_WORKPLACE_LABEL_ID = 'own-workplace-label'
const TECH_SUMMARY_NAME = 'techSummary'
const TECH_SUMMARY_MAX_LENGTH = 1000

const InvestmentModelCompanyEtcForm = () => {
    const {values} = useFormValues()
    const summaryLength = (values[TECH_SUMMARY_NAME] ?? '').length

    return (
        <FormCard title="기업 기타 정보" subtitle="아래 각 항목에 해당사항이 없을 경우 0으로 입력해 주십시오.">
            <div className="flex flex-col gap-6">
                {/* 구획 제목이 곧 이 칸의 이름이라 라벨을 따로 두지 않는다. */}
                <Section title="기술인력" required>
                    <UnitField id={INVESTMENT_MODEL_TECH_STAFF_FIELD} label="기술인력" unit="명" labelHidden />
                </Section>

                <Separator />

                <Section
                    title="지식재산권"
                    description={
                        <>
                            동일기술에 대한 국내외 지식재산권이 여러 건 있을 때는 1건으로 인정
                            <br />
                            예) 특허와 실용신안을 동시 출원한 경우, 특허만 인정
                            <br />
                            예) 동일 프로그램에 대해 버전업(버전2, 버전3)을 통한 프로그램 등록은 1건으로 인정
                        </>
                    }
                >
                    <FieldRow3>
                        {INVESTMENT_MODEL_IP_FIELDS.map((field) => (
                            <UnitField key={field.id} id={field.id} label={field.label} unit="건" />
                        ))}
                    </FieldRow3>
                    {/* 이름이 긴 두 칸은 시안대로 2열로 내려온다. */}
                    <FieldGrid>
                        {INVESTMENT_MODEL_IP_WIDE_FIELDS.map((field) => (
                            <UnitField key={field.id} id={field.id} label={field.label} unit="건" />
                        ))}
                    </FieldGrid>
                </Section>

                <Separator />

                <Section title="매출현황">
                    <FieldGrid>
                        <UnitField id="salesLastYear" label="'25년 매출액" unit="백만원" />
                        <UnitField
                            id="salesThisYear"
                            label="'26년 7월까지 매출액"
                            unit="백만원"

                            helper="백만원 미만 절사"
                        />
                    </FieldGrid>
                </Section>

                <Separator />

                <Section
                    title="거래유형 및 매출처"
                    description="거래형태가 중복될 시 가장 매출에 크게 기여하는 거래 유형 1개를 선택 바랍니다."
                    action={
                        <TradeTypeGuideDialog>
                            <Button type="button" variant="secondary" size="xs">
                                거래유형 설명
                            </Button>
                        </TradeTypeGuideDialog>
                    }
                >
                    <RadioRow
                        name="tradeType"
                        label="거래유형"

                        options={[
                            {value: 'b2b', label: '기업간 거래(B2B)'},
                            {value: 'b2c', label: '개인소비자 거래(B2C)'},
                            {value: 'b2g', label: '정부기관 거래(B2G)'},
                        ]}
                    />
                    <UnitField id="salesPartnerCount" label="'25년 매출처 개수" unit="개" />
                </Section>

                <Separator />

                <Section title="현재 고용인원">
                    <FieldGrid>
                        <UnitField id={INVESTMENT_MODEL_EMPLOYEE_COUNT_FIELD} label="현재 고용인원" unit="명" />
                        <div className="flex flex-col gap-4">
                            {/* <label> 은 컨트롤 하나만 가리킬 수 있어 라디오 '묶음'의 이름이 될 수 없다.
                                생김새는 그대로 두고 요소만 바꾼 뒤, 묶음이 aria-labelledby 로 이 글을 가리켜
                                이름을 가져간다[7.4.1]. */}
                            <Label asChild className="text-foreground cursor-auto gap-1 font-bold">
                                <span id={OWN_WORKPLACE_LABEL_ID}>
                                    자가사업장 보유
                                    {/* 별표는 장식이라 aria-hidden 이고, 읽어 줄 때는 뒤의 문장으로 대신
                                        읽힌다[5.3.1] — 라벨의 필수 표시(FieldLabel)와 같은 방식·같은 색이다. */}
                                    <span aria-hidden="true" className="text-error-500">
                                        *
                                    </span>
                                    <span className="sr-only"> (필수)</span>
                                </span>
                            </Label>
                            <div className="h-control-h-md flex items-center">
                                <RadioRow
                                    name="ownWorkplace"
                                    labelledBy={OWN_WORKPLACE_LABEL_ID}

                                    options={[
                                        {value: 'yes', label: '여'},
                                        {value: 'no', label: '부'},
                                    ]}
                                />
                            </div>
                        </div>
                    </FieldGrid>
                </Section>

                <Separator />

                <Section title="1년 전 고용인원 수" required>
                    <UnitField
                        id={INVESTMENT_MODEL_EMPLOYEE_COUNT_LAST_YEAR_FIELD}
                        label="1년 전 고용인원 수"
                        unit="명"

                        labelHidden
                    />
                </Section>

                <Separator />

                <Section
                    title="신청기술 구분"
                    required
                    action={
                        <TechnologyDefinitionDialog>
                            <Button type="button" variant="secondary" size="xs">
                                전문기술/숙련기술 정의
                            </Button>
                        </TechnologyDefinitionDialog>
                    }
                >
                    <RadioRow
                        name="techCategory"
                        label="신청기술 구분"

                        options={[
                            {value: 'professional', label: '신청기술은 전문기술에 해당한다.'},
                            {value: 'skilled', label: '신청기술은 숙련기술에 해당한다.'},
                        ]}
                    />
                </Section>

                <Separator />

                <Section title="평가기술명" required>
                    <LabellessField id="techName">
                        {/* 구획 제목이 곧 이 입력의 이름이라 라벨을 따로 두지 않고 aria-label 로 연결한다[7.4.1]. */}
                        <Input
                            id="techName"
                            name="techName"
                            required
                            autoComplete="off"
                            aria-label="평가기술명"
                            placeholder="평가 대상 기술명을 입력해 주세요"
                        />
                    </LabellessField>
                </Section>

                <Separator />

                <Section title="신청기술 개요" required>
                    <LabellessField
                        id={TECH_SUMMARY_NAME}
                        footer={
                            <div className="flex items-center justify-between gap-4">
                                <p id="tech-summary-helper" className="typo-caption-regular text-foreground-subtle">
                                    3줄 이상 작성권장
                                </p>
                                {/* 글자 수는 입력에 따라 바뀌므로 스크린리더에도 알린다. */}
                                <p aria-live="polite" className="typo-caption-regular text-foreground-subtle">
                                    {summaryLength} / {TECH_SUMMARY_MAX_LENGTH}
                                </p>
                            </div>
                        }
                    >
                        <Textarea
                            id={TECH_SUMMARY_NAME}
                            name={TECH_SUMMARY_NAME}
                            maxLength={TECH_SUMMARY_MAX_LENGTH}
                            required
                            aria-label="신청기술 개요"
                            aria-describedby="tech-summary-helper"
                            placeholder="신청 기술의 주요 내용, 특징, 활용 분야 등을 입력해 주세요"
                            className="min-h-30"
                        />
                    </LabellessField>
                </Section>

                <Separator />

                <Section title="생산 방식" required>
                    <RadioRow
                        name="productionType"
                        label="생산 방식"

                        options={[
                            {value: 'in-house', label: '자체생산'},
                            {value: 'outsourced', label: '외주생산'},
                        ]}
                    />
                </Section>
            </div>
        </FormCard>
    )
}

export default InvestmentModelCompanyEtcForm
