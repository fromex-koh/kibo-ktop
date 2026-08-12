'use client'

import type {ReactNode} from 'react'
import {FormCard} from '@/components/composite/form-card'
import {RecognizedIpDialog} from '@/components/composite/recognized-ip-dialog'
import {TechnologyDefinitionDialog} from '@/components/composite/technology-definition-dialog'
import {TradeTypeGuideDialog} from '@/components/composite/trade-type-guide-dialog'
import {
    SubSectionHeader,
    SubSectionHeaderAction,
    SubSectionHeaderDescription,
    SubSectionHeaderTitle,
} from '@/components/composite/sub-section-header'
import {Button} from '@/components/ui/button'
import {Field as BaseField, FieldError} from '@/components/ui/field'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    RadioGroup,
    RadioGroupItem,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
    useFieldError,
    useFormValues,
} from '@/components/composite/form-values'
import {Field, FieldGrid, FieldRow3} from '@/components/composite/form-fields'

// 기업 기타 정보 탭 본문 — Figma "기업 기타 정보" 탭 컨텐츠(1200×2572) 전체.
// 자가진단 입력 화면과 FormTabs 컴포넌트 가이드가 같은 것을 보도록 여기 한 벌만 둔다.
//
// 이 탭의 칸은 모두 필수다 — 라벨의 빨간 `*` 와 컨트롤의 required 를 함께 붙인다.
// 시안에는 `*` 레이어가 전부 꺼져 있었지만, 필수 처리는 업무 규칙으로 확정된 것이다.
// 예외는 연간 환산 매출액 하나다 — 계산 결과라 사용자가 채울 수 없어 필수로 두면 채울 방법 없이 막힌다.
// 구획 오른쪽 보조 버튼은 지식재산권·거래유형 및 매출처·신청기술 구분 세 곳에서만 켜져 있다.
// 자가사업장 보유 — 화면에 보이는 제목이 라디오 묶음의 이름이 된다(아래 사용처 주석 참고).
const OWN_WORKPLACE_LABEL_ID = 'own-workplace-label'

const TECH_SUMMARY_NAME = 'techSummary'
const TECH_SUMMARY_MAX_LENGTH = 1000

// 평가기술 IPC — 국제특허분류 8개 섹션. 한 섹션이 여러 분야를 묶을 때는 IPC 국문 표기 그대로 세미콜론으로
// 나눈다(가운뎃점이 아니다) — 특허 실무에서 쓰는 표기를 바꾸지 않는다.
const IPC_SECTIONS = [
    {value: 'A', label: 'A : 생활필수품'},
    {value: 'B', label: 'B : 처리조작; 운수'},
    {value: 'C', label: 'C : 화학; 야금'},
    {value: 'D', label: 'D : 섬유; 지류'},
    {value: 'E', label: 'E : 고정구조물'},
    {value: 'F', label: 'F : 기계공학; 조명; 가열; 무기; 폭파'},
    {value: 'G', label: 'G : 물리학'},
    {value: 'H', label: 'H : 전기'},
] as const

// 구획 제목이 곧 입력의 이름인 자리(평가기술명·신청기술 개요·평가기술 IPC·라디오 묶음) — 라벨 요소가 없어
// form-fields 의 Field 를 쓸 수 없다. 그렇다고 메시지를 구획 안에 그냥 두면 구획 간격(24)을 받아 다른 칸의
// 메시지(8)와 어긋나므로, 라벨만 빼고 같은 Field 로 감싼다. 간격과 타이포를 손으로 맞추지 않기 위해서다.
const LabellessField = ({
    id,
    footer,
    children,
}: {
    id: string
    /** 메시지 아래에 붙는 보조 줄(글자 수 세기 등). Field 의 helper 자리와 같다. */
    footer?: ReactNode
    children: ReactNode
}) => {
    const message = useFieldError(id)

    return (
        <BaseField data-invalid={message ? true : undefined}>
            {children}
            {message ? <FieldError id={`${id}-error`}>{message}</FieldError> : null}
            {footer}
        </BaseField>
    )
}

// 구획 하나 — 제목(+설명·보조 버튼)과 그 아래 입력 묶음.
const Section = ({
    title,
    description,
    action,
    children,
}: {
    title: string
    description?: ReactNode
    action?: ReactNode
    children: ReactNode
}) => (
    <div className="flex flex-col gap-6">
        <SubSectionHeader>
            <SubSectionHeaderTitle>{title}</SubSectionHeaderTitle>
            {description ? <SubSectionHeaderDescription>{description}</SubSectionHeaderDescription> : null}
            {action ? <SubSectionHeaderAction>{action}</SubSectionHeaderAction> : null}
        </SubSectionHeader>
        {children}
    </div>
)

// 수량·금액 칸에 들어갈 수 있는 것은 숫자뿐이다. inputMode="numeric" 은 모바일 키보드를 숫자판으로
// 바꿔 줄 뿐 글자 입력을 막지 못하므로(데스크톱 키보드·붙여넣기), 값에서 숫자가 아닌 것을 걷어낸다.
// 앞자리 0 도 함께 정리한다 — "007건" 같은 값이 그대로 제출되면 뒤에서 다시 다듬어야 한다.
const formatCount = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')

// 수량·금액 칸의 기본값 — "해당 사항 없음" 의 답은 빈칸이 아니라 0 이다. 화면이 열릴 때부터 0 이 들어 있고,
// 사용자가 지워서 비면 칸을 벗어날 때 0 으로 되돌린다. 빈칸으로 제출되면 받는 쪽이 "" 를 숫자로 다시
// 해석해야 하고, 안 쓴 것과 0 을 구분할 이유도 없는 칸들이다.
//
// 아래 목록은 UnitField 를 쓰는 칸과 같아야 한다 — 칸을 더하거나 지울 때 여기도 함께 고친다.
const NUMBER_DEFAULT = '0'

const NUMBER_FIELD_IDS = [
    'techStaffDoctor',
    'techStaffMaster',
    'techStaffAssociate',
    'techStaffHighSchool',
    'ipPatentRegistered',
    'ipPatentApplied',
    'ipUtilityRegistered',
    'ipUtilityApplied',
    'ipPlantVariety',
    'ipDesignEtc',
    'salesLastYear',
    'salesThisYear',
    'salesAnnualized',
    'salesPartnerCount',
    'employeeCount',
] as const

const COMPANY_ETC_DEFAULT_VALUES: Record<string, string> = Object.fromEntries(
    NUMBER_FIELD_IDS.map((id) => [id, NUMBER_DEFAULT]),
)

// 단위가 붙는 수량 입력 — 시안은 단위(명·건·백만원)를 상자 안 오른쪽에 두고 값을 오른쪽 정렬한다.
const UnitField = ({
    id,
    label,
    unit,
    readOnly,
    helper,
    className,
}: {
    id: string
    label: string
    unit: string
    readOnly?: boolean
    helper?: string
    className?: string
}) => {
    const {setValue} = useFormValues()

    return (
        // 읽기 전용 칸은 계산 결과라 사용자가 채울 수 없다 — 필수로 두면 채울 방법 없이 막힌다.
        <Field id={id} label={label} required={!readOnly} helper={helper} className={className}>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    name={id}
                    readOnly={readOnly}
                    required={!readOnly}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={NUMBER_DEFAULT}
                    format={formatCount}
                    // 지워서 비운 칸은 벗어날 때 0 으로 돌려놓는다 — 이 칸의 "없음" 은 0 이다.
                    onBlur={(event) => {
                        if (!event.currentTarget.value) setValue(id, NUMBER_DEFAULT)
                    }}
                    aria-describedby={helper ? `${id}-helper` : undefined}
                    className="text-right"
                />
                <InputGroupAddon align="inline-end" className="text-foreground">
                    {unit}
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}

// 가로로 늘어서는 선택지 한 줄.
const RadioRow = ({
    name,
    label,
    labelledBy,
    options,
}: {
    name: string
    /** 묶음의 이름을 글자로 줄 때. 화면에 보이는 제목이 따로 있으면 labelledBy 를 쓴다. */
    label?: string
    /** 화면에 보이는 제목의 id — 그 글이 곧 묶음의 이름이 된다. label 보다 우선한다[7.4.1]. */
    labelledBy?: string
    options: readonly {value: string; label: string}[]
}) => (
    <LabellessField id={name}>
        {/* 묶음에 id 와 tabIndex 를 두는 이유 — 값을 나르는 radio input 은 숨어 있어 검사 메시지를 붙일
            자리도, 포커스를 보낼 자리도 없다. 묶음이 그 역할을 대신한다. */}
        <RadioGroup
            id={name}
            name={name}
            required
            tabIndex={-1}
            aria-label={labelledBy ? undefined : label}
            aria-labelledby={labelledBy}
            className="flex flex-wrap items-center gap-x-10 gap-y-4"
        >
            {options.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem id={`${name}-${option.value}`} value={option.value} />
                    <Label htmlFor={`${name}-${option.value}`} className="typo-body-xl-regular text-foreground">
                        {option.label}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    </LabellessField>
)

const CompanyEtcForm = () => {
    const {values} = useFormValues()
    const summaryLength = (values[TECH_SUMMARY_NAME] ?? '').length

    return (
        <FormCard title="기업 기타 정보" subtitle="아래 각 항목에 해당사항이 없을 경우 0으로 입력해 주십시오.">
            <div className="flex flex-col gap-10">
                <Section
                    title="기술인력"
                    description={
                        <>
                            경영주를 제외하고, 4대보험 가입자 명부 등 확인 가능한 인력을 중복 없이 입력해 주세요.
                            <br />
                            (동일인이 기술사·학사인 경우 기술사에만 입력해 주시면 됩니다.)
                        </>
                    }
                >
                    <FieldGrid>
                        <UnitField id="techStaffDoctor" label="박사/기술사/기능장" unit="명" />
                        <UnitField id="techStaffMaster" label="석사/학사/기사" unit="명" />
                        <UnitField id="techStaffAssociate" label="전문학사/산업기사" unit="명" />
                        <UnitField id="techStaffHighSchool" label="고졸이하" unit="명" />
                    </FieldGrid>
                </Section>

                <Separator />

                <Section
                    title="지식재산권"
                    description={
                        <>
                            동일기술에 대한 국내외 지식재산권이 여러 건 있을 때는 1건으로 인정
                            <br />
                            예) 특허·실용신안은 동일 기술인 경우, 특허만 인정
                            <br />
                            예) 동일 프로그램에 대해 버전업을 통한 프로그램 등록은 1건으로 인정
                        </>
                    }
                    action={
                        <RecognizedIpDialog>
                            <Button type="button" variant="secondary" size="xs">
                                실적인정 지식재산
                            </Button>
                        </RecognizedIpDialog>
                    }
                >
                    <FieldRow3>
                        <UnitField id="ipPatentRegistered" label="특허등록" unit="건" />
                        <UnitField id="ipPatentApplied" label="특허출원" unit="건" />
                        <UnitField id="ipUtilityRegistered" label="실용신안등록" unit="건" />
                        <UnitField id="ipUtilityApplied" label="실용신안출원" unit="건" />
                        <UnitField id="ipPlantVariety" label="품종보호권" unit="건" />
                        <UnitField id="ipDesignEtc" label="디자인·상표권·프로그램등록·기술임치증" unit="건" />
                    </FieldRow3>
                </Section>

                <Separator />

                <Section title="매출현황">
                    <FieldRow3>
                        <UnitField id="salesLastYear" label="'25년 매출액" unit="백만원" />
                        <UnitField
                            id="salesThisYear"
                            label="'26년 7월까지 매출액"
                            unit="백만원"
                            helper="백만원 미만 절사"
                        />
                        {/* 연환산 값은 입력이 아니라 계산 결과라 읽기 전용이다. */}
                        <UnitField
                            id="salesAnnualized"
                            label="연간 환산 매출액"
                            unit="백만원"
                            readOnly
                            helper="'26년 7월까지 기준 연환산"
                        />
                    </FieldRow3>
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

                <Section title="상시근로자수">
                    <FieldGrid>
                        <UnitField id="employeeCount" label="상시근로자수" unit="명" />
                        <div className="flex flex-col gap-4">
                            {/* <label> 은 컨트롤 하나만 가리킬 수 있어 라디오 '묶음'의 이름이 될 수 없다.
                                그래서 label 요소로 두면 어느 컨트롤과도 이어지지 않은 라벨이 된다
                                (WAVE "Orphaned form label"). 생김새는 그대로 두고 요소만 바꾼 뒤,
                                묶음이 aria-labelledby 로 이 글을 가리켜 이름을 가져간다[7.4.1]. */}
                            <Label asChild className="text-foreground cursor-auto font-bold">
                                <span id={OWN_WORKPLACE_LABEL_ID}>자가사업장 보유</span>
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

                <Section
                    title="신청기술 구분"
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

                <Section title="평가기술명">
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

                <Section title="신청기술 개요">
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

                <Section title="평가기술 IPC">
                    <LabellessField id="techIpc">
                        <Select name="techIpc" required>
                            <SelectTrigger id="techIpc" aria-label="평가기술 IPC" className="w-full">
                                <SelectValue placeholder="선택해 주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {IPC_SECTIONS.map((section) => (
                                    <SelectItem key={section.value} value={section.value}>
                                        {section.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </LabellessField>
                </Section>
            </div>
        </FormCard>
    )
}

export default CompanyEtcForm
export {COMPANY_ETC_DEFAULT_VALUES}
