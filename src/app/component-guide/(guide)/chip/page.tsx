// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {QuestionItem, QuestionList} from '@/components/composite/question-list'
import {ListMarker} from '@/components/custom/list-marker'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import ChipFormDemo from './chip-form-demo'

export const metadata: Metadata = {title: '칩 (Chip)'}

const KINDS_CODE = `import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'

{/* 라디오 칩 — 그룹에서 하나만 선택(단일). 라벨 가운데, 아이콘 없음 */}
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

const DISABLED_CODE = `{/* 칩마다 disabled — 그룹에 주면 전체가 잠긴다 */}
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

const CHECKBOX_USAGE_CODE = `{/* 문장 인라인 — 번호·Badge·본문 열 정렬은 QuestionList가 담당한다.
    align="control"로 번호·배지가 40px 칩 라인 중앙에 맞고, 문장+칩을 ChipCheckboxGroup
    하나로 감싸 줄바꿈 시 두 번째 줄이 배지 뒤부터 정렬(hanging indent)된다. */}
<QuestionList>
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
    badge={<Badge variant="solid-pastel" color="secondary-purple" shape="round">서비스</Badge>}
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

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'chip',
        cells: [
            '짧은 값을 칩으로 하나 또는 여러 개 고름',
            <code key="component">ChipRadio · ChipCheckbox</code>,
            '한 줄짜리 라벨입니다. 동의 여부, 관심 분야, 문장 안 선택에 씁니다.',
        ],
    },
    {
        key: 'radio-chip',
        cells: [
            '제목과 설명이 붙는 낮은 선택 상자',
            <Link key="component" href="/component-guide/radio-chip" className={LINK_CLASS}>
                RadioChip
            </Link>,
            '제목 아래 설명 한두 줄을 담는 단일 선택입니다.',
        ],
    },
    {
        key: 'radio-checkbox',
        cells: [
            '폼 안의 일반 선택 항목',
            <span key="component">
                <Link href="/component-guide/radio" className={LINK_CLASS}>
                    Radio
                </Link>
                {' · '}
                <Link href="/component-guide/checkbox" className={LINK_CLASS}>
                    Checkbox
                </Link>
            </span>,
            '동그라미·체크 표시가 있는 기본 컨트롤입니다. 칩 모양이 필요 없으면 이쪽을 씁니다.',
        ],
    },
    {
        key: 'radio-card',
        cells: [
            '카드 형태의 큰 선택지',
            <span key="component">
                <Link href="/component-guide/radio-card" className={LINK_CLASS}>
                    RadioCard
                </Link>
                {' · '}
                <Link href="/component-guide/option-card" className={LINK_CLASS}>
                    OptionCard
                </Link>
            </span>,
            '배지나 부가 정보가 함께 놓이는 선택지입니다.',
        ],
    },
    {
        key: 'segmented',
        cells: [
            '같은 영역의 보기 전환',
            <Link key="component" href="/component-guide/segmented-control" className={LINK_CLASS}>
                SegmentedControl
            </Link>,
            '붙어 있는 세그먼트로 하나를 고르거나 화면을 이동합니다.',
        ],
    },
] as const

const PROPS = [
    ['ChipRadioGroup', 'value / defaultValue', '선택된 칩의 value 입니다(제어 · 비제어).', '-', 'string'],
    ['ChipRadioGroup', 'onValueChange', '선택값이 바뀔 때 호출됩니다.', '-', '(value: string) => void'],
    ['ChipRadioGroup', 'name', '폼 제출 필드 이름입니다.', '-', 'string'],
    ['ChipRadio', 'value', '칩을 구분하는 값입니다.', '-', 'string'],
    ['ChipRadio · ChipCheckbox', 'size', '칩 최소 높이입니다. lg 48px · md 40px.', '"lg"', '"lg" | "md"'],
    [
        'ChipCheckboxGroup',
        'aria-label / legend',
        '묶음 이름입니다. 화면에는 보이지 않는 legend 로 렌더링됩니다.',
        '"항목 선택"',
        'string / ReactNode',
    ],
    [
        'ChipCheckbox',
        'checked / defaultChecked',
        '선택 상태입니다(제어 · 비제어).',
        'false',
        'boolean | "indeterminate"',
    ],
    ['ChipCheckbox', 'onCheckedChange', '선택 상태가 바뀔 때 호출됩니다.', '-', '(checked) => void'],
    ['ChipCheckbox', 'name / value', '체크된 칩이 제출될 때의 필드 이름과 값입니다.', 'value="on"', 'string'],
    ['ChipRadioGroup · ChipRadio · ChipCheckbox', 'disabled', '그룹 전체 또는 칩 하나를 잠급니다.', 'false', 'boolean'],
    ['모든 구성요소', 'className', '폭 · 배치 등 사용처 스타일입니다.', '-', 'string'],
] as const

const SubHeading = ({children}: {children: string}) => <h3 className="typo-title-m-bold text-foreground">{children}</h3>

const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const ChipGuidePage = () => (
    <GuidePageShell
        title="칩 (Chip)"
        description="눌러서 고르는 칩 모양 선택 컨트롤입니다. 하나만 고르는 ChipRadio 와 여러 개를 고르는 ChipCheckbox 가 있습니다."
    >
        <BaseCard>
            <section aria-labelledby="chip-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="chip-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모양은 같고 기능이 다릅니다. 그룹(<code>ChipRadioGroup</code> · <code>ChipCheckboxGroup</code>)
                        안에 칩을 넣고 묶음 이름을 <code>aria-label</code> 로 줍니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <SubHeading>ChipRadio · 단일 선택</SubHeading>
                        <ChipRadioGroup name="kind-radio-demo" defaultValue="basic" aria-label="요금제(단일 선택)">
                            <ChipRadio value="basic">기본형</ChipRadio>
                            <ChipRadio value="premium">프리미엄형</ChipRadio>
                            <ChipRadio value="custom">맞춤형</ChipRadio>
                        </ChipRadioGroup>
                    </div>
                    <div className="flex flex-col gap-2">
                        <SubHeading>ChipCheckbox · 다중 선택</SubHeading>
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
            <section aria-labelledby="chip-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="chip-variants" className="typo-h4-bold">
                        크기와 상태
                    </h2>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <SubHeading>크기 (size)</SubHeading>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>lg</code>(기본)는 최소 높이 48px, <code>md</code> 는 40px 입니다. 두 종류에 공통이며
                            글이 두 줄 이상이면 높이가 늘어납니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <ChipRadioGroup name="size-lg-radio" defaultValue="agree" aria-label="lg 라디오 칩">
                                    <ChipRadio size="lg" value="agree">
                                        동의함
                                    </ChipRadio>
                                    <ChipRadio size="lg" value="disagree">
                                        동의하지 않음
                                    </ChipRadio>
                                </ChipRadioGroup>
                                <ChipCheckboxGroup aria-label="lg 체크박스 칩">
                                    <ChipCheckbox size="lg" value="basic" defaultChecked>
                                        기본형
                                    </ChipCheckbox>
                                    <ChipCheckbox size="lg" value="premium">
                                        프리미엄형
                                    </ChipCheckbox>
                                </ChipCheckboxGroup>
                            </div>
                            <div className="flex flex-col gap-3">
                                <ChipRadioGroup name="size-md-radio" defaultValue="agree" aria-label="md 라디오 칩">
                                    <ChipRadio size="md" value="agree">
                                        동의함
                                    </ChipRadio>
                                    <ChipRadio size="md" value="disagree">
                                        동의하지 않음
                                    </ChipRadio>
                                </ChipRadioGroup>
                                <ChipCheckboxGroup aria-label="md 체크박스 칩">
                                    <ChipCheckbox size="md" value="basic" defaultChecked>
                                        기본형
                                    </ChipCheckbox>
                                    <ChipCheckbox size="md" value="premium">
                                        프리미엄형
                                    </ChipCheckbox>
                                </ChipCheckboxGroup>
                            </div>
                        </div>
                        <CodeBlock code={SIZE_COMPARISON_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className={BLOCK}>
                        <SubHeading>비활성 (disabled)</SubHeading>
                        <p className="typo-body-l-regular text-label-foreground">
                            그룹에 주면 전체가, 칩에 주면 그 칩만 잠깁니다. 비활성 칩은 폼 제출에서 빠집니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ChipRadioGroup
                                name="disabled-radio-demo"
                                defaultValue="agree"
                                aria-label="비활성 라디오 칩"
                            >
                                <ChipRadio value="agree" disabled>
                                    동의함
                                </ChipRadio>
                                <ChipRadio value="disagree" disabled>
                                    동의하지 않음
                                </ChipRadio>
                            </ChipRadioGroup>
                            <ChipCheckboxGroup aria-label="비활성 체크박스 칩">
                                <ChipCheckbox name="disabled-chip-demo" value="ai" defaultChecked disabled>
                                    AI
                                </ChipCheckbox>
                                <ChipCheckbox name="disabled-chip-demo" value="cloud" disabled>
                                    클라우드
                                </ChipCheckbox>
                            </ChipCheckboxGroup>
                        </div>
                        <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-examples" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="chip-examples" className="typo-h4-bold">
                        사용 예
                    </h2>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <SubHeading>동의 항목 (ChipRadio)</SubHeading>
                        <p className="typo-body-l-regular text-label-foreground">
                            둘 중 하나를 고르는 자리입니다. 질문을 <code>aria-labelledby</code> 로 그룹 이름에 연결하고
                            칩에 <code>flex-1</code> 을 주어 폭을 나눕니다.
                        </p>
                        <div className="border-border rounded-xl border p-6">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" color="info" shape="round">
                                            필수
                                        </Badge>
                                        <h4 className="typo-title-m-bold text-foreground">1. 수집·이용에 관한 사항</h4>
                                    </div>
                                    <Button type="button" variant="text" size="md">
                                        내용보기
                                        <ChevronRight aria-hidden="true" />
                                    </Button>
                                </div>
                                <p
                                    id="consent-1-label"
                                    className="typo-body-xl-regular text-foreground-subtle flex items-start"
                                >
                                    <ListMarker type="unordered" level={2} />위 고유식별정보 수집·이용에 동의하십니까?
                                </p>
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
                    </div>

                    <div className={BLOCK}>
                        <SubHeading>문장 안의 선택 (ChipCheckbox)</SubHeading>
                        <p className="typo-body-l-regular text-label-foreground">
                            문장과 칩을 <code>ChipCheckboxGroup</code> 하나로 감쌉니다. 번호 · 배지 · 본문 정렬은{' '}
                            <code>QuestionList</code> 가 맡습니다.
                        </p>
                        <div className="border-border rounded-xl border p-6">
                            <QuestionList>
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
                                        <Badge variant="solid-pastel" color="secondary-purple" shape="round">
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
                    </div>

                    <div className={BLOCK}>
                        <SubHeading>폼 제출</SubHeading>
                        <p className="typo-body-l-regular text-label-foreground">
                            라디오는 그룹에 <code>name</code>, 칩에 <code>value</code> 를 주면 값 하나가 제출됩니다.
                            체크박스는 칩마다 같은 <code>name</code> 과 각자의 <code>value</code> 를 주고{' '}
                            <code>FormData.getAll()</code> 로 읽습니다.
                        </p>
                        <ChipFormDemo />
                        <CodeBlock code={FORM_SUBMIT_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="chip-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        선택 컨트롤은 모양이 비슷해 헷갈리기 쉽습니다. 담는 내용과 크기로 고릅니다.
                    </p>
                </div>
                <Table caption="선택 컨트롤 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="chip-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        동작은 Radix RadioGroup · Checkbox 가 제공합니다. 라디오 칩은 방향키로 이동하고 그룹 안에서 Tab
                        한 번에 들어갑니다[6.1.1][8.2.1].
                    </li>
                    <li>
                        그룹 이름은 필수입니다. <code>aria-label</code> 이나 <code>aria-labelledby</code> 로 주고,{' '}
                        <code>ChipCheckboxGroup</code> 은 <code>fieldset</code> + 숨김 <code>legend</code> 로
                        렌더링합니다[7.4.1].
                    </li>
                    <li>체크박스 칩은 선택 시 체크 아이콘이 나타나 색만으로 선택을 전하지 않습니다[5.3.1].</li>
                    <li>키보드 포커스는 외곽선으로 표시됩니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chip-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="chip-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그 밖의 Radix RadioGroup · Checkbox 속성도 그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS} caption="Chip Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ChipGuidePage
