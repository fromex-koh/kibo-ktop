import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'
import {Icon} from '@/components/custom/icon'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '베이스 카드 (BaseCard)'}

const USAGE_CODE = `<BaseCard title="기업정보" action={<Badge color="info">작성중</Badge>}>
  <p>카드 본문 콘텐츠입니다.</p>
</BaseCard>`

const USAGE_CODE_PLAIN = `{/* 헤더 없이 본문만 */}
<BaseCard>
  <p>제목 없이 콘텐츠만 담는 기본 컨테이너입니다.</p>
</BaseCard>`

const PADDING_USAGE_CODE = `{/* 기본 — shadcn Card의 --card-spacing 기본값 24px */}
<BaseCard title="기본 카드">
  <p>상하좌우 패딩 24px</p>
</BaseCard>

{/* 반복되는 32px 사양은 padding variant로 사용한다. */}
<BaseCard padding="lg">
  <p>상하좌우 패딩 32px</p>
</BaseCard>`

const SELF_DIAGNOSIS_USAGE_CODE = `<BaseCard variant="outlined" padding="lg">
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <Icon
        symbol="alert"
        variant="solid"
        className="size-icon-lg shrink-0 bg-icon-solid-neutral text-icon-solid-neutral-foreground"
      />
      <h3 className="typo-title-l-bold text-foreground">자가진단 안내</h3>
    </div>
    <ul className="flex list-none flex-col gap-2">
      <li className="flex gap-1.5">
        <ListMarker />
        <span className="typo-body-xl-regular text-foreground-subtle">안내 항목…</span>
      </li>
      {/* … 항목 반복 */}
    </ul>
  </div>
</BaseCard>`

// 패딩 32px 케이스 데모 콘텐츠 — Figma "하단인포"(자가진단 안내) 그대로. 📄 콘텐츠 검수 필요:
// Figma 원문에 붙어 있는 띄어쓰기("평가는기술ONE"·"한해월"·"평가모형인KTRS"·"체크리스트를사실")를 그대로 옮겼다.
const SELF_DIAGNOSIS_NOTES = [
    '기업의 자가진단용 기술사업평가는기술ONE플랫폼 기업회원에 한해월 1회 무료로 제공됩니다.',
    '기술사업평가를 신청하시면 국내최초 개방형 평가모형인KTRS-FM을 통한 기술사업성 평가가 자동으로 진행됩니다.',
    '평가 신청 시 기업·기술 정보 및 체크리스트를사실에 기반하여 작성해주셔야 정확한 평가가 가능합니다.',
    '아래 기술사업평가 신청 버튼을 누르면 평가를 위한 정보 입력화면으로 이동합니다.',
] as const

// Props 설명 — [이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['title', '카드 제목. 값을 전달하면 헤더가 렌더됩니다.', 'undefined', 'ReactNode'],
    ['subtitle', '제목 아래 서브텍스트. title이 있을 때 함께 렌더됩니다.', 'undefined', 'ReactNode'],
    ['action', '헤더 우측 액션. title이 있을 때 함께 렌더됩니다.', 'undefined', 'ReactNode'],
    ['children', '카드 본문 콘텐츠입니다.', '-', 'ReactNode'],
    ['variant', '카드의 시각 구분입니다.', 'default', "'default' | 'outlined'"],
    ['padding', '카드 내부 여백입니다. md는 24px, lg는 32px입니다.', 'md', "'md' | 'lg'"],
    ['className', 'Card 루트에 추가할 클래스명입니다.', 'undefined', 'string'],
] as const

// 베이스 카드 — ui Card(패딩 24px)를 감싼 도메인 카드(composite/base-card). 제목 헤더는 선택,
// 본문은 필수. 넓은 폼 섹션엔 좌우 패딩이 큰 FormCard 를 쓴다.
const BaseCardGuidePage = () => (
    <GuidePageShell
        title="베이스 카드 (BaseCard)"
        description="패딩 24px의 기본 카드입니다. 제목(+서브텍스트·액션) 헤더는 선택, 본문은 필수."
    >
        <section aria-labelledby="base-card-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="base-card-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    title 을 주면 제목·서브텍스트(좌) / 액션(우) 헤더가 함께 렌더되고, children 이 본문이 됩니다.
                </p>
            </div>
            <BaseCard title="기업정보" action={<Badge color="info">작성중</Badge>} className="max-w-md">
                <p className="typo-body-l-regular text-foreground">카드 본문 콘텐츠입니다.</p>
            </BaseCard>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">헤더 없이 — 본문만</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    title 을 생략하면 헤더 없이 본문만 담는 기본 컨테이너가 된다.
                </p>
            </div>
            <BaseCard className="max-w-md">
                <p className="typo-body-l-regular text-foreground">제목 없이 콘텐츠만 담는 기본 컨테이너입니다.</p>
            </BaseCard>
            <CodeBlock code={USAGE_CODE_PLAIN} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="base-card-padding" className="flex flex-col gap-4">
            <div>
                <h2 id="base-card-padding" className="typo-h4-bold">
                    패딩 변경
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본 md는 24px, lg는 32px입니다. padding variant가 shadcn Card의 로컬 spacing 변수를 바꾸므로
                    Header·Content의 여백이 함께 유지됩니다.
                </p>
            </div>
            <div className="flex flex-col gap-6">
                <BaseCard title="기본 카드">
                    <p className="typo-body-l-regular text-foreground">상하좌우 패딩 24px</p>
                </BaseCard>
                <BaseCard padding="lg">
                    <p className="typo-body-l-regular text-foreground">상하좌우 패딩 32px</p>
                </BaseCard>
            </div>
            <CodeBlock code={PADDING_USAGE_CODE} language="tsx" copyLabel="복사" />
            <p className="bg-muted text-foreground-subtle rounded-md p-4">
                같은 패딩 값이 여러 화면에서 반복되면 일회성 className을 복제하지 않고 BaseCard의 의미 있는 padding
                variant 또는 프로젝트 토큰으로 승격합니다. 패딩 외에 구조와 역할까지 달라질 때만 별도 composite Card를
                만듭니다.
            </p>
        </section>

        <section aria-labelledby="base-card-border" className="flex flex-col gap-4">
            <div>
                <h2 id="base-card-border" className="typo-h4-bold">
                    테두리 변경
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본 카드 구조를 유지하면서 테두리로 구획할 때는 outlined variant를 사용합니다. 아래 자가진단 안내
                    카드는 border-subtle-3 테두리와 중립 Solid 아이콘 시맨틱 색상을 적용한 예시입니다.
                </p>
            </div>
            <BaseCard variant="outlined" padding="lg">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Icon
                            symbol="alert"
                            variant="solid"
                            className="bg-icon-solid-neutral text-icon-solid-neutral-foreground size-icon-lg shrink-0"
                        />
                        <h3 className="typo-title-l-bold text-foreground">자가진단 안내</h3>
                    </div>
                    <ul className="flex list-none flex-col gap-2">
                        {SELF_DIAGNOSIS_NOTES.map((note) => (
                            <li key={note} className="flex gap-1.5">
                                <ListMarker />
                                <span className="typo-body-xl-regular text-foreground-subtle">{note}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </BaseCard>
            <CodeBlock code={SELF_DIAGNOSIS_USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <BaseCard>
            <section aria-labelledby="base-card-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="base-card-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">BaseCard 에 넘기는 속성입니다.</p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">BaseCard Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
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
                                    Type
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(([name, description, defaultValue, type]) => (
                                <tr key={name} className="border-border border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {type}
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

export default BaseCardGuidePage
