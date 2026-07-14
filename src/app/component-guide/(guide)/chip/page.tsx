import type {Metadata} from 'next'
import {ChevronRight} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {ListMarker} from '@/components/custom/list-marker'
import {Badge} from '@/components/kit/badge'
import {Button} from '@/components/kit/button'

export const metadata: Metadata = {title: '칩 (Chip)'}

// 두 종류 비교 — 시각이 아니라 기능이 다르다: 라디오(단일) vs 체크박스(다중).
const KINDS_CODE = `{/* 라디오 칩 — 그룹에서 하나만 선택(단일). 라벨 가운데, 아이콘 없음 */}
<ChipRadioGroup name="plan" defaultValue="basic">
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

// 크기 비교 — size 는 높이만 바꾼다. 라디오·체크박스 공통. Figma "size=large|medium" 반영.
const SIZE_COMPARISON_CODE = `{/* size 는 높이만 바꾼다 — large(기본, 48px) / medium(40px). 두 종류 공통 */}
<ChipRadioGroup name="a-large" defaultValue="a">
  <ChipRadio size="large" value="a">동의함</ChipRadio>
  <ChipRadio size="large" value="b">동의하지 않음</ChipRadio>
</ChipRadioGroup>
<ChipCheckboxGroup aria-label="large 체크박스">
  <ChipCheckbox size="large" value="a" defaultChecked>기본형</ChipCheckbox>
  <ChipCheckbox size="large" value="b">프리미엄형</ChipCheckbox>
</ChipCheckboxGroup>

<ChipRadioGroup name="a-medium" defaultValue="a">
  <ChipRadio size="medium" value="a">동의함</ChipRadio>
  <ChipRadio size="medium" value="b">동의하지 않음</ChipRadio>
</ChipRadioGroup>
<ChipCheckboxGroup aria-label="medium 체크박스">
  <ChipCheckbox size="medium" value="a" defaultChecked>기본형</ChipCheckbox>
  <ChipCheckbox size="medium" value="b">프리미엄형</ChipCheckbox>
</ChipCheckboxGroup>`

const CONSENT_USAGE_CODE = `{/* 동의 항목처럼 하나만 고르는 자리 — 질문이 라디오 그룹의 레이블 */}
<p id="consent-1-label">위 고유식별정보 수집·이용에 동의하십니까?</p>

<ChipRadioGroup name="consent-1" defaultValue="agree" aria-labelledby="consent-1-label" className="w-full">
  <ChipRadio value="agree" className="flex-1">동의함</ChipRadio>
  <ChipRadio value="disagree" className="flex-1">동의하지 않음</ChipRadio>
</ChipRadioGroup>`

// 자가진단 문항(Figma "li_복합형_체크") — 문장 흐름 안에 체크박스 칩을 끼워 넣는 인라인 사용.
// "외주가공 또는 자체제작"처럼 함께 고를 수 있어 체크박스(다중)를 쓴다. 그룹이 문항 전체를 감싼다.
const CHECKBOX_USAGE_CODE = `{/* 문장 인라인 — 번호 + 카테고리 배지 + 흐르는 텍스트 사이에 체크박스 칩(medium) */}
<div className="flex gap-2">
  <span className="typo-body-xl-bold text-foreground shrink-0">17.</span>
  <ChipCheckboxGroup aria-label="생산과정 방식 선택" className="w-full items-center">
    <Badge variant="solid-pastel" color="secondary-green" shape="round">제조</Badge>
    <span className="typo-body-xl-regular text-foreground">신청기술이 적용된 제품 생산 시, 생산과정이</span>
    <ChipCheckbox size="medium" name="prod-1" value="outsourced" defaultChecked>외주가공</ChipCheckbox>
    <span className="typo-body-xl-regular text-foreground">또는</span>
    <ChipCheckbox size="medium" name="prod-1" value="inhouse">자체제작</ChipCheckbox>
    <span className="typo-body-xl-regular text-foreground">을 통해 이루어진다.</span>
  </ChipCheckboxGroup>
</div>`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    [
        'ChipRadioGroup',
        '라디오 칩들을 감싸는 그룹(Radix RadioGroup). name 을 주면 선택값 1개가 hidden input 으로 폼 제출된다. 하나만 선택.',
    ],
    ['ChipRadio', '개별 라디오 칩. value 로 식별. 라벨은 가운데 정렬, 아이콘 없음. size="large"(기본)|"medium".'],
    [
        'ChipCheckboxGroup',
        '체크박스 칩 묶음(레이아웃 + role="group"). Radix 에 CheckboxGroup 이 없어 얇은 래퍼다. aria-label 로 묶음 이름을 준다.',
    ],
    [
        'ChipCheckbox',
        '개별 체크박스 칩. 독립 토글(다중 선택). 선택 시 우측 체크 아이콘. checked/defaultChecked 로 상태, name+value 로 체크 시 폼 제출. size="large"(기본)|"medium".',
    ],
] as const

// 칩 — 기능이 다른 두 종류(라디오·체크박스). 둘 다 name(+value)→hidden input 으로 폼 제출된다.
const ChipGuidePage = () => (
    <GuidePageShell
        title="칩 (Chip)"
        description="라벨을 눌러 고르는 카드형 선택 컨트롤입니다. 겉모습은 칩이지만 기능이 다른 두 종류가 있습니다 — 하나만 고르는 라디오 칩과, 여러 개를 독립적으로 켜고 끄는 체크박스 칩입니다. 둘 다 속은 폼 프리미티브라 name 을 주면 선택값이 폼에 제출됩니다."
    >
        <section aria-labelledby="chip-kinds" className="flex flex-col gap-4">
            <div>
                <h2 id="chip-kinds" className="typo-h4-bold">
                    두 종류 (라디오 · 체크박스)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <strong className="text-foreground font-medium">모양이 아니라 기능이 다릅니다.</strong> 라디오 칩은
                    그룹에서 <strong className="text-foreground font-medium">하나만</strong> 고르고(하나를 고르면 다른
                    것이 해제), 체크박스 칩은 각 칩을{' '}
                    <strong className="text-foreground font-medium">독립적으로 켜고 끕니다(여러 개 동시 선택)</strong>.
                    직접 눌러보면 차이가 바로 보입니다.
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

        <section aria-labelledby="chip-sizes" className="flex flex-col gap-4">
            <div>
                <h2 id="chip-sizes" className="typo-h4-bold">
                    크기 (size)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">size</code> 는 높이만 바꾸고, 라디오·체크박스 두 종류에 똑같이
                    적용됩니다 — <code className="font-mono">large</code>(기본, 48px)·
                    <code className="font-mono">medium</code>
                    (40px)입니다. <code className="font-mono">medium</code> 은 44px 터치 타깃([6.1.3]) 미만인 컴팩트
                    예외라, 밀도가 필요한 자리에서만 제한적으로 씁니다(버튼의 <code className="font-mono">sm</code>/
                    <code className="font-mono">xs</code> 와 같은 성격).
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <h3 className="typo-title-l-medium text-foreground">
                        large{' '}
                        <code className="typo-body-l-regular text-muted-foreground font-mono">(기본값, 48px)</code>
                    </h3>
                    <div className="flex flex-col gap-1.5">
                        <span className="typo-caption-regular text-muted-foreground font-mono">ChipRadio</span>
                        <ChipRadioGroup
                            name="size-large-radio"
                            defaultValue="agree"
                            aria-label="크기 비교 — large 라디오"
                        >
                            <ChipRadio size="large" value="agree">
                                동의함
                            </ChipRadio>
                            <ChipRadio size="large" value="disagree">
                                동의하지 않음
                            </ChipRadio>
                        </ChipRadioGroup>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="typo-caption-regular text-muted-foreground font-mono">ChipCheckbox</span>
                        <ChipCheckboxGroup aria-label="크기 비교 — large 체크박스">
                            <ChipCheckbox size="large" value="basic" defaultChecked>
                                기본형
                            </ChipCheckbox>
                            <ChipCheckbox size="large" value="premium">
                                프리미엄형
                            </ChipCheckbox>
                        </ChipCheckboxGroup>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="typo-title-l-medium text-foreground">
                        medium <code className="typo-body-l-regular text-muted-foreground font-mono">(40px)</code>
                    </h3>
                    <div className="flex flex-col gap-1.5">
                        <span className="typo-caption-regular text-muted-foreground font-mono">ChipRadio</span>
                        <ChipRadioGroup
                            name="size-medium-radio"
                            defaultValue="agree"
                            aria-label="크기 비교 — medium 라디오"
                        >
                            <ChipRadio size="medium" value="agree">
                                동의함
                            </ChipRadio>
                            <ChipRadio size="medium" value="disagree">
                                동의하지 않음
                            </ChipRadio>
                        </ChipRadioGroup>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="typo-caption-regular text-muted-foreground font-mono">ChipCheckbox</span>
                        <ChipCheckboxGroup aria-label="크기 비교 — medium 체크박스">
                            <ChipCheckbox size="medium" value="basic" defaultChecked>
                                기본형
                            </ChipCheckbox>
                            <ChipCheckbox size="medium" value="premium">
                                프리미엄형
                            </ChipCheckbox>
                        </ChipCheckboxGroup>
                    </div>
                </div>
            </div>
            <CodeBlock code={SIZE_COMPARISON_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="chip-consent-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="chip-consent-usage" className="typo-h4-bold">
                    실제 사용 예시 — 라디오 (동의)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    동의 항목처럼 하나만 고르는 자리에 라디오 칩을 씁니다. 제목(필수 배지 + 번호)·안내 질문·동일 폭 칩
                    두 개로 구성한 예시입니다.
                </p>
            </div>
            <BaseCard>
                <div className="flex flex-col gap-3">
                    {/* 헤더 — 뱃지 + 제목 | 내용보기 버튼 */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" color="info" shape="round">
                                필수
                            </Badge>
                            <h3 className="typo-title-l-medium text-foreground">1. 수집·이용에 관한 사항</h3>
                        </div>
                        <Button type="button" variant="text" size="xsmall">
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
            </BaseCard>
            <CodeBlock code={CONSENT_USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="chip-checkbox-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="chip-checkbox-usage" className="typo-h4-bold">
                    실제 사용 예시 — 체크박스 (문장 인라인)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    자가진단 문항처럼 문장 흐름 안에 체크박스 칩을 끼워 넣는 예시입니다.{' '}
                    <strong className="text-foreground font-medium">&quot;외주가공 또는 자체제작&quot;</strong> 처럼
                    여러 항목을 함께 고를 수 있어 체크박스(다중)를 씁니다. 번호·카테고리 배지·흐르는 텍스트 사이에
                    칩(medium)이 인라인으로 배치됩니다.
                </p>
            </div>
            <BaseCard>
                <div className="flex flex-col gap-2">
                    {/* 문항 1 — 제조(초록 배지) */}
                    <div className="flex gap-2">
                        <span className="typo-body-xl-bold text-foreground mt-2 shrink-0">17.</span>
                        <ChipCheckboxGroup aria-label="생산과정 방식 선택" className="w-full items-center">
                            <Badge variant="solid-pastel" color="secondary-green" shape="round">
                                제조
                            </Badge>
                            <span className="typo-body-xl-regular text-foreground">
                                신청기술이 적용된 제품 생산 시, 생산과정이
                            </span>
                            <ChipCheckbox size="medium" name="prod-1" value="outsourced" defaultChecked>
                                외주가공
                            </ChipCheckbox>
                            <span className="typo-body-xl-regular text-foreground">또는</span>
                            <ChipCheckbox size="medium" name="prod-1" value="inhouse">
                                자체제작
                            </ChipCheckbox>
                            <span className="typo-body-xl-regular text-foreground">을 통해 이루어진다.</span>
                        </ChipCheckboxGroup>
                    </div>
                    {/* 문항 2 — 서비스(보라 배지) */}
                    <div className="flex gap-2">
                        {/* 번호 자리 맞춤용 빈 칸(같은 폭) — 실제 화면에선 문항마다 번호가 붙는다 */}
                        <span aria-hidden="true" className="typo-body-xl-bold mt-2 shrink-0 opacity-0">
                            17.
                        </span>
                        <ChipCheckboxGroup aria-label="제작과정 방식 선택" className="w-full items-center">
                            <Badge variant="solid-pastel" color="secondary-grape" shape="round">
                                서비스
                            </Badge>
                            <span className="typo-body-xl-regular text-foreground">
                                신청기술이 적용된 제품/서비스 제작 시, 제작과정이
                            </span>
                            <ChipCheckbox size="medium" name="prod-2" value="outsourced">
                                외주인력
                            </ChipCheckbox>
                            <span className="typo-body-xl-regular text-foreground">또는</span>
                            <ChipCheckbox size="medium" name="prod-2" value="inhouse">
                                자체인력
                            </ChipCheckbox>
                            <span className="typo-body-xl-regular text-foreground">을 통해 이루어진다.</span>
                        </ChipCheckboxGroup>
                    </div>
                </div>
            </BaseCard>
            <CodeBlock code={CHECKBOX_USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

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

        <section aria-labelledby="chip-form-submit" className="flex flex-col gap-4">
            <div>
                <h2 id="chip-form-submit" className="typo-h4-bold">
                    폼 제출
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    두 종류 모두 Radix 가 실제 hidden input 을 렌더링해 네이티브 폼으로 제출됩니다 — 라디오는{' '}
                    <code className="font-mono">{'<input type="radio">'}</code> 로 그룹의 선택값{' '}
                    <strong className="text-foreground font-medium">1개</strong>가, 체크박스는{' '}
                    <code className="font-mono">{'<input type="checkbox">'}</code> 로{' '}
                    <strong className="text-foreground font-medium">체크된 칩마다</strong> 각자{' '}
                    <code className="font-mono">value</code> 가 실립니다. 클릭 트리거는{' '}
                    <code className="font-mono">type=&quot;button&quot;</code> 으로 고정돼 있어 칩을 눌러도 의도치 않게
                    폼이 제출되지는 않습니다.
                </p>
                <p className="typo-body-l-regular text-muted-foreground">
                    단, 이 hidden input 이 값으로 실려 나가려면{' '}
                    <span className="text-foreground font-medium">상위에 실제 &lt;form&gt; 요소가 있어야</span> 합니다.
                    이 가이드 페이지는 컴포넌트 시연용이라 <code className="font-mono">{'<form>'}</code> 으로 감싸져
                    있지 않으므로, 실제 화면에 쓸 때는 사용처에서 <code className="font-mono">{'<form>'}</code>
                    으로 감싸야 제출됩니다.
                </p>
            </div>
        </section>
    </GuidePageShell>
)

export default ChipGuidePage
