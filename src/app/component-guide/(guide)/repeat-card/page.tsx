// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {RepeatCard} from '@/components/composite/repeat-card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import RepeatCardListDemo from './repeat-card-list-demo'

export const metadata: Metadata = {title: '반복 입력 카드 (RepeatCard)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {RepeatCard} from '@/components/composite/repeat-card'

<RepeatCard title="경력1" headingLevel={3}>
  <FieldGrid>
    <Field id="career-1-company" label="근무처">
      <ClearableInput id="career-1-company" name="career-1-company" placeholder="근무처" />
    </Field>
    …
  </FieldGrid>
</RepeatCard>`

const LIST_CODE = `import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'

// 목록 상태(추가·삭제·최소 개수·포커스 이동)는 useRepeatCards 가 관리한다.
const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard, isAddDisabled} = useRepeatCards({
  minCount: 1,                                   // 마지막 한 칸은 지우면 값만 비워진다(기본 1)
  maxCount: 2,                                   // 다 채우면 "행추가" 가 비활성이다(기본 제한 없음)
  onRemove: (id) => clearValues(\`career-\${id}-\`), // 지운 칸의 값도 함께 버린다
})

{ids.map((id, index) => (
  <RepeatCard
    key={id}
    ref={setCardRef(id)}
    title={\`경력\${index + 1}\`}
    focusOnMount={id === addedId}
    clearOnly={isLastCard}                       // 또는 deleteDisabled={isDeleteDisabled} 로 비활성
    onDelete={() => removeCard(id)}
  >
    …
  </RepeatCard>
))}

<Button ref={addButtonRef} disabled={isAddDisabled} onClick={addCard}>행추가</Button>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'repeat-card',
        cells: [
            '번호가 붙어 반복되는 입력 묶음',
            <code key="component">RepeatCard</code>,
            '“경력1”처럼 접기 · 삭제 버튼이 달리고 테두리로만 구분됩니다. 값은 접어도 유지됩니다.',
        ],
    },
    {
        key: 'form-card',
        cells: [
            '입력 폼 섹션 하나',
            <Link key="component" href="/component-guide/form-card" className={LINK_CLASS}>
                FormCard
            </Link>,
            'RepeatCard 의 바깥 컨테이너로 씁니다. 목록 헤더와 “행추가” 버튼도 FormCard 본문에 둡니다.',
        ],
    },
    {
        key: 'base-card',
        cells: [
            '일반 콘텐츠 컨테이너',
            <Link key="component" href="/component-guide/base-card" className={LINK_CLASS}>
                BaseCard
            </Link>,
            '반복 · 접기 · 삭제가 필요 없는 구획에 씁니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['RepeatCard', 'title', '카드 제목입니다. 삭제 버튼과 접기/열기 버튼의 이름에도 쓰입니다.', '-', 'string'],
    ['RepeatCard', 'children', '카드 본문입니다. 보통 필드 그리드를 넣습니다.', '-', 'ReactNode'],
    ['RepeatCard', 'defaultOpen', '처음에 펼쳐 둘지 정합니다.', 'true', 'boolean'],
    [
        'RepeatCard',
        'onDelete',
        '삭제 버튼을 눌렀을 때 실행됩니다. 생략하면 버튼을 눌러도 아무 일도 하지 않습니다.',
        '-',
        '() => void',
    ],
    ['RepeatCard', 'deleteDisabled', 'true 이면 삭제 버튼을 비활성으로 표시합니다.', '-', 'boolean'],
    [
        'RepeatCard',
        'clearOnly',
        'true 이면 삭제 버튼의 이름이 "{title} 입력 내용 비우기"로 바뀝니다. 값을 비우는 일은 onDelete 에서 합니다.',
        '-',
        'boolean',
    ],
    ['RepeatCard', 'headingLevel', '카드 제목의 헤딩 레벨입니다. 3 은 h3, 4 는 h4 입니다.', '4', '3 | 4'],
    ['RepeatCard', 'focusOnMount', 'true 이면 카드가 그려진 직후 제목으로 포커스를 옮깁니다.', '-', 'boolean'],
    [
        'RepeatCard',
        'Collapsible 속성',
        'open · onOpenChange · disabled · className · ref 등을 전달합니다.',
        '-',
        "Omit<ComponentProps<typeof Collapsible>, 'children' | 'title' | 'defaultOpen'>",
    ],
    ['useRepeatCards 옵션', 'initialCount', '처음에 그릴 카드 수입니다.', '1', 'number'],
    [
        'useRepeatCards 옵션',
        'minCount',
        '남겨 둘 최소 카드 수입니다. 이 수 이하에서는 카드를 지우지 않습니다.',
        '1',
        'number',
    ],
    ['useRepeatCards 옵션', 'maxCount', '추가할 수 있는 최대 카드 수입니다.', '제한 없음', 'number'],
    [
        'useRepeatCards 옵션',
        'onRemove',
        'removeCard 를 호출할 때마다 실행됩니다. 카드를 지우지 않고 남긴 경우 isLastCard 가 true 입니다.',
        '-',
        '(id: number, isLastCard: boolean) => void',
    ],
] as const

const RETURN_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
    {key: 'type', header: '타입', align: 'start'},
] as const

const RETURNS = [
    ['ids', '카드의 고유 번호 목록입니다. key 와 필드 id·name 에 씁니다.', 'readonly number[]'],
    ['addedId', '방금 추가한 카드의 번호입니다. focusOnMount 판단에 씁니다.', 'number | null'],
    ['addCard', '카드를 하나 추가합니다. maxCount 에 도달하면 추가하지 않습니다.', '() => void'],
    [
        'removeCard',
        '카드를 지우고 이웃 카드 제목으로 포커스를 옮깁니다. minCount 이하이면 지우지 않고 onRemove 만 호출합니다.',
        '(id: number) => void',
    ],
    ['setCardRef', '각 카드의 ref 에 넘깁니다.', '(id: number) => RefCallback'],
    ['addButtonRef', '"행추가" 버튼의 ref 에 넘깁니다.', 'RefObject<HTMLButtonElement | null>'],
    ['isDeleteDisabled', '카드 수가 minCount 이하이면 true 입니다. deleteDisabled 에 넘깁니다.', 'boolean'],
    ['isLastCard', '카드 수가 minCount 이하이면 true 입니다. clearOnly 에 넘깁니다.', 'boolean'],
    ['isAddDisabled', '카드 수가 maxCount 이상이면 true 입니다. "행추가" 버튼의 disabled 에 넘깁니다.', 'boolean'],
] as const

const RepeatCardGuidePage = () => (
    <GuidePageShell
        title="반복 입력 카드 (RepeatCard)"
        description="“경력1”처럼 번호가 붙어 여러 번 반복되는 입력 묶음을 담는 카드입니다."
    >
        <BaseCard>
            <section aria-labelledby="repeat-card-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="repeat-card-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>title</code>과 본문을 넘기면 접기/열기와 삭제 버튼이 함께 표시됩니다. 카드를 접어도 입력한
                        값은 유지됩니다.
                    </p>
                </div>
                <div className="bg-card border-subtle-3 rounded-md border p-6">
                    <RepeatCard title="경력1" headingLevel={3}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="repeat-card-company" className="text-foreground font-bold">
                                    근무처
                                </Label>
                                <Input id="repeat-card-company" name="repeat-card-company" placeholder="근무처" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="repeat-card-rank" className="text-foreground font-bold">
                                    최종직급
                                </Label>
                                <Input id="repeat-card-rank" name="repeat-card-rank" placeholder="최종직급" />
                            </div>
                        </div>
                    </RepeatCard>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="repeat-card-list" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="repeat-card-list" className="typo-h4-bold">
                        목록으로 쓰기
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        카드의 추가·삭제는 <code>useRepeatCards</code>로 관리합니다. 카드를 추가하면 새 카드 제목으로,
                        지우면 이웃 카드 제목으로 포커스가 옮겨집니다.
                    </p>
                </div>
                <RepeatCardListDemo />
                <CodeBlock code={LIST_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">사용 규칙</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                필드의 <code>id</code>·<code>name</code>은 <code>ids</code>의 값으로 만들고, 보이는
                                번호는 순서(<code>index + 1</code>)로 매깁니다. 가운데 카드를 지워도 아래 카드의 값이
                                밀리지 않습니다.
                            </li>
                            <li>
                                마지막 한 칸은 <code>deleteDisabled</code>로 삭제를 막거나, <code>clearOnly</code>와{' '}
                                <code>onRemove</code>로 값만 비우게 합니다. 위 미리보기는 <code>deleteDisabled</code>를
                                씁니다.
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">useRepeatCards 반환값</h3>
                        <Table
                            caption="useRepeatCards 반환값 목록"
                            columns={RETURN_COLUMNS}
                            rows={RETURNS.map(([name, description, type]) => ({
                                key: name,
                                cells: [<code key="name">{name}</code>, description, <code key="type">{type}</code>],
                            }))}
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="repeat-card-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="repeat-card-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">담는 내용에 따라 카드를 고릅니다.</p>
                </div>
                <Table
                    caption="RepeatCard · FormCard · BaseCard 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="repeat-card-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="repeat-card-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        버튼 이름 · 포커스 이동은 컴포넌트와 훅이 처리합니다. 사용처는 연결과 제목 레벨만 맞춥니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        삭제 버튼은 “경력1 삭제”, 접기/열기 버튼은 “접기 경력1”처럼 <code>title</code>이 이름에
                        붙습니다[6.4.3].
                    </li>
                    <li>
                        카드를 추가하면 새 카드 제목으로, 지우면 이웃 카드 제목으로 포커스가 옮겨집니다 [6.1.2].
                        사용처는 <code>focusOnMount</code> · <code>setCardRef</code> · <code>addButtonRef</code>를
                        연결합니다.
                    </li>
                    <li>
                        제목 레벨은 사용처가 <code>headingLevel</code>로 맞춥니다. 위에 소제목(h3)이 있으면 기본값 4,
                        섹션 제목(h2) 바로 아래면 3 입니다[6.4.2].
                    </li>
                    <li>동작을 줄이도록 설정한 사용자에게는 스크롤이 즉시 이동합니다[6.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="repeat-card-props" className="flex flex-col gap-6">
                <h2 id="repeat-card-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="RepeatCard · useRepeatCards Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RepeatCardGuidePage
