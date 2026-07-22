import type {Metadata} from 'next'
import {ChevronRight} from 'lucide-react'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {QuestionItem, QuestionList} from '@/components/composite/question-list'
import {ListMarker} from '@/components/custom/list-marker'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import ChipFormDemo from './chip-form-demo'

export const metadata: Metadata = {title: '칩 (Chip)'}

// 두 종류 비교 — 시각이 아니라 기능이 다르다: 라디오(단일) vs 체크박스(다중).
const KINDS_CODE = `{/* 라디오 칩 — 그룹에서 하나만 선택(단일). 라벨 가운데, 아이콘 없음 */}
<ChipRadioGroup name="plan" defaultValue="basic" aria-label="요금제">
  <ChipRadio value="basic">기본형</ChipRadio>
  <ChipRadio value="premium">프리미엄형</ChipRadio>
  <ChipRadio value="custom">맞춤형</ChipRadio>
</ChipRadioGroup>

{/* 체크박스 칩 — 각자 독립 토글(다중). 선택 시 우측 체크 아이콘 */}
<ChipCheckboxGroup aria-label="관심 분야">
  <ChipCheckbox name="interest" value="ai" defaultChecked>AI</ChipCheckbox>
  <ChipCheckbox name="interest" value="cloud">클라우드</ChipCheckbox>
  <ChipCheckbox name="interest" value="security" defaultChecked>보안</ChipCheckbox>
</ChipCheckboxGroup>`

// 크기 비교 — size 는 높이만 바꾼다. 라디오·체크박스 공통. Figma "size=lg|md" 반영.
const SIZE_COMPARISON_CODE = `{/* size 는 높이만 바꾼다 — lg(기본, 48px) / md(40px). 두 종류 공통 */}
<ChipRadioGroup name="a-lg" defaultValue="a" aria-label="lg 라디오 칩">
  <ChipRadio size="lg" value="a">동의함</ChipRadio>
  <ChipRadio size="lg" value="b">동의하지 않음</ChipRadio>
</ChipRadioGroup>
<ChipCheckboxGroup aria-label="lg 체크박스">
  <ChipCheckbox size="lg" value="a" defaultChecked>기본형</ChipCheckbox>
  <ChipCheckbox size="lg" value="b">프리미엄형</ChipCheckbox>
</ChipCheckboxGroup>

<ChipRadioGroup name="a-md" defaultValue="a" aria-label="md 라디오 칩">
  <ChipRadio size="md" value="a">동의함</ChipRadio>
  <ChipRadio size="md" value="b">동의하지 않음</ChipRadio>
</ChipRadioGroup>
<ChipCheckboxGroup aria-label="md 체크박스">
  <ChipCheckbox size="md" value="a" defaultChecked>기본형</ChipCheckbox>
  <ChipCheckbox size="md" value="b">프리미엄형</ChipCheckbox>
</ChipCheckboxGroup>`

const DISABLED_CODE = `{/* disabled — bg-control-disabled / border-disabled-subtle / text-disabled */}
<ChipRadioGroup name="disabled-radio" defaultValue="agree" aria-label="비활성 라디오 칩">
  <ChipRadio value="agree" disabled>동의함</ChipRadio>
  <ChipRadio value="disagree" disabled>동의하지 않음</ChipRadio>
</ChipRadioGroup>

<ChipCheckboxGroup aria-label="비활성 체크박스 칩">
  <ChipCheckbox name="disabled-chip" value="ai" defaultChecked disabled>AI</ChipCheckbox>
  <ChipCheckbox name="disabled-chip" value="cloud" disabled>클라우드</ChipCheckbox>
</ChipCheckboxGroup>`

const CONSENT_USAGE_CODE = `{/* 동의 항목처럼 하나만 고르는 자리 — 질문이 라디오 그룹의 레이블 */}
<p id="consent-1-label">위 고유식별정보 수집·이용에 동의하십니까?</p>

<ChipRadioGroup name="consent-1" defaultValue="agree" aria-labelledby="consent-1-label" className="w-full">
  <ChipRadio value="agree" className="flex-1">동의함</ChipRadio>
  <ChipRadio value="disagree" className="flex-1">동의하지 않음</ChipRadio>
</ChipRadioGroup>`

// 자가진단 문항(Figma "li_복합형_체크") — 문장 흐름 안에 체크박스 칩을 끼워 넣는 인라인 사용.
// "외주가공 또는 자체제작"처럼 함께 고를 수 있어 체크박스(다중)를 쓴다. 그룹이 문항 전체를 감싼다.
const CHECKBOX_USAGE_CODE = `{/* 문장 인라인 — 번호·Badge·본문 열 정렬은 QuestionList가 담당한다.
    align="control"로 번호·배지가 40px 칩 라인 중앙에 맞고, 문장+칩을 ChipCheckboxGroup
    하나로 감싸 줄바꿈 시 두 번째 줄이 배지 뒤부터 정렬(hanging indent)된다. */}
<QuestionList start={17}>
  <QuestionItem
    align="control"
    badge={<Badge variant="solid-pastel" color="secondary-green" shape="round">제조</Badge>}
  >
    <ChipCheckboxGroup aria-label="생산과정 방식 선택" className="flex-1 items-center">
      신청기술이 적용된 제품 생산 시, 생산과정이
      <ChipCheckbox size="md" name="prod-1" value="outsourced" defaultChecked>외주가공</ChipCheckbox>
      또는
      <ChipCheckbox size="md" name="prod-1" value="inhouse">자체제작</ChipCheckbox>
      을 통해 이루어진다.
    </ChipCheckboxGroup>
  </QuestionItem>
  <QuestionItem
    align="control"
    badge={<Badge variant="solid-pastel" color="secondary-grape" shape="round">서비스</Badge>}
  >
    <ChipCheckboxGroup aria-label="제작과정 방식 선택" className="flex-1 items-center">
      신청기술이 적용된 제품/서비스 제작 시, 제작과정이
      <ChipCheckbox size="md" name="prod-2" value="outsourced">외주인력</ChipCheckbox>
      또는
      <ChipCheckbox size="md" name="prod-2" value="inhouse">자체인력</ChipCheckbox>
      을 통해 이루어진다.
    </ChipCheckboxGroup>
  </QuestionItem>
</QuestionList>`

const FORM_SUBMIT_CODE = `<form onSubmit={handleSubmit}>
  {/* 라디오: 그룹에 name, 각 항목에 고유한 value를 지정합니다. */}
  <ChipRadioGroup name="plan" defaultValue="basic" aria-label="요금제">
    <ChipRadio value="basic">기본형</ChipRadio>
    <ChipRadio value="premium">프리미엄형</ChipRadio>
  </ChipRadioGroup>

  {/* 체크박스: 함께 제출할 항목에 같은 name과 각 value를 지정합니다. */}
  <ChipCheckboxGroup aria-label="관심 분야">
    <ChipCheckbox name="interest" value="ai">AI</ChipCheckbox>
    <ChipCheckbox name="interest" value="cloud">클라우드</ChipCheckbox>
  </ChipCheckboxGroup>

  <Button type="submit">제출</Button>
</form>

const formData = new FormData(form)
formData.get('plan') // "basic"
formData.getAll('interest') // 선택된 값 배열: ["ai", "cloud"]`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    [
        'ChipRadioGroup',
        '라디오 칩들을 감싸는 그룹(Radix RadioGroup). name 을 주면 선택값 1개가 hidden input 으로 폼 제출된다. 하나만 선택.',
    ],
    ['ChipRadio', '개별 라디오 칩. value 로 식별. 라벨은 가운데 정렬, 아이콘 없음. size="lg"(기본)|"md".'],
    [
        'ChipCheckboxGroup',
        '체크박스 칩 묶음(레이아웃 + role="group"). Radix 에 CheckboxGroup 이 없어 얇은 래퍼다. aria-label 로 묶음 이름을 준다.',
    ],
    [
        'ChipCheckbox',
        '개별 체크박스 칩. 독립 토글(다중 선택). 선택 시 우측 체크 아이콘. checked/defaultChecked 로 상태, name+value 로 체크 시 폼 제출. size="lg"(기본)|"md".',
    ],
]

const PROPS = [
    {
        component: 'ChipRadioGroup',
        name: 'value / defaultValue',
        description: '제어 또는 비제어 방식으로 현재 선택된 ChipRadio의 value를 지정합니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'ChipRadioGroup',
        name: 'onValueChange',
        description: '단일 선택값이 바뀔 때 호출됩니다.',
        defaultValue: '-',
        control: '(value) => void',
    },
    {
        component: 'ChipRadioGroup',
        name: 'name',
        description: '폼 제출에 사용할 라디오 그룹 이름입니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'ChipRadio',
        name: 'value',
        description: '그룹 안에서 개별 라디오 칩을 구분하는 필수 값입니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'ChipRadio / ChipCheckbox',
        name: 'size',
        description: '칩 높이입니다. lg는 48px, md는 40px입니다.',
        defaultValue: '"lg"',
        control: '"lg" | "md"',
    },
    {
        component: 'ChipCheckbox',
        name: 'checked / defaultChecked',
        description: '제어 또는 비제어 방식으로 개별 체크박스 칩의 선택 상태를 지정합니다.',
        defaultValue: 'false',
        control: 'boolean | "indeterminate"',
    },
    {
        component: 'ChipCheckbox',
        name: 'onCheckedChange',
        description: '개별 체크박스 칩의 선택 상태가 바뀔 때 호출됩니다.',
        defaultValue: '-',
        control: '(checked) => void',
    },
    {
        component: 'ChipCheckbox',
        name: 'name / value',
        description: '체크된 칩을 폼으로 제출할 때 사용할 필드 이름과 값입니다.',
        defaultValue: 'value="on"',
        control: 'string',
    },
    {
        component: 'ChipRadioGroup / ChipRadio / ChipCheckbox',
        name: 'disabled',
        description: '그룹 전체 또는 개별 칩의 상호작용을 비활성화합니다.',
        defaultValue: 'false',
        control: 'boolean',
    },
    {
        component: '모든 구성요소',
        name: 'className',
        description: '레이아웃이나 폭 등 사용처 스타일을 추가합니다.',
        defaultValue: '""',
        control: 'string',
    },
]

// 칩 — 기능이 다른 두 종류(라디오·체크박스). 둘 다 name(+value)→hidden input 으로 폼 제출된다.
const ChipGuidePage = () => (
    <GuidePageShell
        title="칩 (Chip)"
        description="라벨을 눌러 고르는 카드형 선택 컨트롤입니다. 겉모습은 칩이지만 기능이 다른 두 종류가 있습니다 — 하나만 고르는 라디오 칩과, 여러 개를 독립적으로 켜고 끄는 체크박스 칩입니다. 둘 다 속은 폼 프리미티브라 name 을 주면 선택값이 폼에 제출됩니다."
    >
        <BaseCard>
            <section aria-labelledby="chip-kinds" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-kinds" className="typo-h4-bold">
                        두 종류 (라디오 · 체크박스)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <strong className="text-foreground font-medium">모양이 아니라 기능이 다릅니다.</strong> 라디오
                        칩은 그룹에서 <strong className="text-foreground font-medium">하나만</strong> 고르고(하나를
                        고르면 다른 것이 해제), 체크박스 칩은 각 칩을{' '}
                        <strong className="text-foreground font-medium">
                            독립적으로 켜고 끕니다(여러 개 동시 선택)
                        </strong>
                        . 직접 눌러보면 차이가 바로 보입니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-title-l-medium text-foreground">라디오 — 단일 선택</h3>
                        <p className="typo-body-l-regular text-muted-foreground">
                            하나만 선택됩니다. 라벨은 가운데 정렬, 아이콘 없음.
                        </p>
                        <ChipRadioGroup name="kind-radio-demo" defaultValue="basic" aria-label="요금제(단일 선택)">
                            <ChipRadio value="basic">기본형</ChipRadio>
                            <ChipRadio value="premium">프리미엄형</ChipRadio>
                            <ChipRadio value="custom">맞춤형</ChipRadio>
                        </ChipRadioGroup>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-title-l-medium text-foreground">체크박스 — 다중 선택</h3>
                        <p className="typo-body-l-regular text-muted-foreground">
                            여러 개를 동시에 켤 수 있습니다. 선택 시 우측에 체크 아이콘.
                        </p>
                        <ChipCheckboxGroup aria-label="관심 분야(다중 선택)">
                            <ChipCheckbox name="interest" value="ai" defaultChecked>
                                AI
                            </ChipCheckbox>
                            <ChipCheckbox name="interest" value="cloud">
                                클라우드
                            </ChipCheckbox>
                            <ChipCheckbox name="interest" value="security" defaultChecked>
                                보안
                            </ChipCheckbox>
                        </ChipCheckboxGroup>
                    </div>
                </div>
                <CodeBlock code={KINDS_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-sizes" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-sizes" className="typo-h4-bold">
                        크기 (size)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">size</code> 는 높이만 바꾸고, 라디오·체크박스 두 종류에 똑같이
                        적용됩니다 — <code className="font-mono">lg</code>(기본, 48px)·
                        <code className="font-mono">md</code>
                        (40px)입니다. <code className="font-mono">md</code> 는 44px 터치 타깃([6.1.3]) 미만인 컴팩트
                        예외라, 밀도가 필요한 자리에서만 제한적으로 씁니다(버튼의 <code className="font-mono">sm</code>/
                        <code className="font-mono">xs</code> 와 같은 성격).
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-title-l-medium text-foreground">
                            lg{' '}
                            <code className="typo-body-l-regular text-muted-foreground font-mono">(기본값, 48px)</code>
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <span className="typo-caption-regular text-muted-foreground font-mono">ChipRadio</span>
                            <ChipRadioGroup
                                name="size-lg-radio"
                                defaultValue="agree"
                                aria-label="크기 비교 — lg 라디오"
                            >
                                <ChipRadio size="lg" value="agree">
                                    동의함
                                </ChipRadio>
                                <ChipRadio size="lg" value="disagree">
                                    동의하지 않음
                                </ChipRadio>
                            </ChipRadioGroup>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="typo-caption-regular text-muted-foreground font-mono">ChipCheckbox</span>
                            <ChipCheckboxGroup aria-label="크기 비교 — lg 체크박스">
                                <ChipCheckbox size="lg" value="basic" defaultChecked>
                                    기본형
                                </ChipCheckbox>
                                <ChipCheckbox size="lg" value="premium">
                                    프리미엄형
                                </ChipCheckbox>
                            </ChipCheckboxGroup>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-title-l-medium text-foreground">
                            md <code className="typo-body-l-regular text-muted-foreground font-mono">(40px)</code>
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <span className="typo-caption-regular text-muted-foreground font-mono">ChipRadio</span>
                            <ChipRadioGroup
                                name="size-md-radio"
                                defaultValue="agree"
                                aria-label="크기 비교 — md 라디오"
                            >
                                <ChipRadio size="md" value="agree">
                                    동의함
                                </ChipRadio>
                                <ChipRadio size="md" value="disagree">
                                    동의하지 않음
                                </ChipRadio>
                            </ChipRadioGroup>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="typo-caption-regular text-muted-foreground font-mono">ChipCheckbox</span>
                            <ChipCheckboxGroup aria-label="크기 비교 — md 체크박스">
                                <ChipCheckbox size="md" value="basic" defaultChecked>
                                    기본형
                                </ChipCheckbox>
                                <ChipCheckbox size="md" value="premium">
                                    프리미엄형
                                </ChipCheckbox>
                            </ChipCheckboxGroup>
                        </div>
                    </div>
                </div>
                <CodeBlock code={SIZE_COMPARISON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-disabled" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-disabled" className="typo-h4-bold">
                        비활성 상태 (disabled)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        비활성 칩은 선택/입력 컨트롤 공통 disabled 토큰을 씁니다. 배경은{' '}
                        <code className="font-mono">bg-control-disabled</code>, 테두리는{' '}
                        <code className="font-mono">border-disabled-subtle</code>, 텍스트는{' '}
                        <code className="font-mono">text-disabled</code>로 통일합니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-title-l-medium text-foreground">라디오 칩</h3>
                        <ChipRadioGroup name="disabled-radio-demo" defaultValue="agree" aria-label="비활성 라디오 칩">
                            <ChipRadio value="agree" disabled>
                                동의함
                            </ChipRadio>
                            <ChipRadio value="disagree" disabled>
                                동의하지 않음
                            </ChipRadio>
                        </ChipRadioGroup>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-title-l-medium text-foreground">체크박스 칩</h3>
                        <ChipCheckboxGroup aria-label="비활성 체크박스 칩">
                            <ChipCheckbox name="disabled-chip-demo" value="ai" defaultChecked disabled>
                                AI
                            </ChipCheckbox>
                            <ChipCheckbox name="disabled-chip-demo" value="cloud" disabled>
                                클라우드
                            </ChipCheckbox>
                        </ChipCheckboxGroup>
                    </div>
                </div>
                <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-consent-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-consent-usage" className="typo-h4-bold">
                        실제 사용 예시 — 라디오 (동의)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        동의 항목처럼 하나만 고르는 자리에 라디오 칩을 씁니다. 제목(필수 배지 + 번호)·안내 질문·동일 폭
                        칩 두 개로 구성한 예시입니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <div className="flex flex-col gap-3">
                        {/* 헤더 — 뱃지 + 제목 | 내용보기 버튼 */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" color="info" shape="round">
                                    필수
                                </Badge>
                                <h3 className="typo-title-l-medium text-foreground">1. 수집·이용에 관한 사항</h3>
                            </div>
                            <Button type="button" variant="text" size="md">
                                내용보기
                                <ChevronRight aria-hidden="true" />
                            </Button>
                        </div>
                        {/* 안내 질문 — 라디오 그룹의 레이블(aria-labelledby 로 연결) */}
                        <p
                            id="consent-1-label"
                            className="typo-body-xl-regular text-foreground-subtle flex items-start gap-1.5"
                        >
                            <ListMarker type="unordered" level={2} />위 고유식별정보 수집·이용에 동의하십니까?
                        </p>
                        {/* 라디오 칩 — 동일 폭 2개(flex-1) */}
                        <ChipRadioGroup
                            name="consent-1"
                            defaultValue="agree"
                            aria-labelledby="consent-1-label"
                            className="w-full"
                        >
                            <ChipRadio value="agree" className="flex-1">
                                동의함
                            </ChipRadio>
                            <ChipRadio value="disagree" className="flex-1">
                                동의하지 않음
                            </ChipRadio>
                        </ChipRadioGroup>
                    </div>
                </div>
                <CodeBlock code={CONSENT_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-checkbox-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-checkbox-usage" className="typo-h4-bold">
                        실제 사용 예시 — 체크박스 (문장 인라인)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        자가진단 문항처럼 문장 흐름 안에 체크박스 칩을 끼워 넣는 예시입니다.{' '}
                        <strong className="text-foreground font-medium">&quot;외주가공 또는 자체제작&quot;</strong> 처럼
                        여러 항목을 함께 고를 수 있어 체크박스(다중)를 씁니다. 번호·카테고리 배지·본문 열 정렬은
                        QuestionList가 담당하고, 문장 전체를 ChipCheckboxGroup으로 감싸 줄바꿈 시 두 번째 줄이 배지
                        뒤부터 정렬됩니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <QuestionList start={17}>
                        <QuestionItem
                            align="control"
                            badge={
                                <Badge variant="solid-pastel" color="secondary-green" shape="round">
                                    제조
                                </Badge>
                            }
                        >
                            <ChipCheckboxGroup aria-label="생산과정 방식 선택" className="flex-1 items-center">
                                신청기술이 적용된 제품 생산 시, 생산과정이
                                <ChipCheckbox size="md" name="prod-1" value="outsourced" defaultChecked>
                                    외주가공
                                </ChipCheckbox>
                                또는
                                <ChipCheckbox size="md" name="prod-1" value="inhouse">
                                    자체제작
                                </ChipCheckbox>
                                을 통해 이루어진다.
                            </ChipCheckboxGroup>
                        </QuestionItem>
                        <QuestionItem
                            align="control"
                            badge={
                                <Badge variant="solid-pastel" color="secondary-grape" shape="round">
                                    서비스
                                </Badge>
                            }
                        >
                            <ChipCheckboxGroup aria-label="제작과정 방식 선택" className="flex-1 items-center">
                                신청기술이 적용된 제품/서비스 제작 시, 제작과정이
                                <ChipCheckbox size="md" name="prod-2" value="outsourced">
                                    외주인력
                                </ChipCheckbox>
                                또는
                                <ChipCheckbox size="md" name="prod-2" value="inhouse">
                                    자체인력
                                </ChipCheckbox>
                                을 통해 이루어진다.
                            </ChipCheckboxGroup>
                        </QuestionItem>
                    </QuestionList>
                </div>
                <CodeBlock code={CHECKBOX_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-composition" className="typo-h4-bold">
                        구성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        칩은 그룹과 개별 칩으로 이뤄지며, 라디오·체크박스 각각 한 쌍입니다.
                    </p>
                </div>
                <dl className="flex flex-col gap-2">
                    {COMPOSITION.map(([name, desc]) => (
                        <div key={name} className="flex flex-col gap-0.5">
                            <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                            <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-form-submit" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-form-submit" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Chip은 Radix의 네이티브 폼 동작을 그대로 사용합니다. 실제{' '}
                        <code className="font-mono">form</code> 안에서 라디오 그룹에{' '}
                        <code className="font-mono">name</code>, 각 항목에 고유한{' '}
                        <code className="font-mono">value</code>를 지정하면 선택값 하나가 제출됩니다. 체크박스는 함께
                        제출할 항목에 같은 <code className="font-mono">name</code>과 각{' '}
                        <code className="font-mono">value</code>를 지정하며, 선택된 값은{' '}
                        <code className="font-mono">FormData.getAll()</code>로 읽습니다.{' '}
                        <code className="font-mono">name</code>은 폼 제출이 필요할 때만 사용하고,{' '}
                        <code className="font-mono">disabled</code> 항목은 HTML 표준에 따라 제출에서 제외됩니다.
                    </p>
                </div>
                <ChipFormDemo />
                <CodeBlock code={FORM_SUBMIT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="chip-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Chip을 구성하는 라디오·체크박스 그룹과 개별 칩에서 주로 사용하는 속성입니다.
                    </p>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Chip Props 목록</caption>
                        <thead>
                            <tr className="border-border border-b bg-gray-100/25">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Component
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Default
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Control
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS.map((prop) => (
                                <tr
                                    key={`${prop.component}-${prop.name}`}
                                    className="border-border bg-background border-b last:border-b-0"
                                >
                                    <th
                                        scope="row"
                                        className="typo-caption-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                    >
                                        {prop.component}
                                    </th>
                                    <td className="typo-caption-regular text-primary px-4 py-3 align-top font-mono whitespace-nowrap">
                                        {prop.name}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 align-top">
                                        {prop.description}
                                    </td>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 align-top font-mono whitespace-nowrap">
                                        {prop.defaultValue}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs whitespace-nowrap">
                                            {prop.control}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ChipGuidePage
