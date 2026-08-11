import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {RepeatCard} from '@/components/composite/repeat-card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import RepeatCardListDemo from './repeat-card-list-demo'

export const metadata: Metadata = {title: '반복 입력 카드 (RepeatCard)'}

const USAGE_CODE = `<RepeatCard title="경력1" headingLevel={3}>
  <FieldGrid>
    <Field id="career-1-company" label="근무처">
      <ClearableInput id="career-1-company" name="career-1-company" placeholder="근무처" />
    </Field>
    …
  </FieldGrid>
</RepeatCard>`

const LIST_CODE = `// 목록 상태(추가·삭제·최소 개수·포커스 이동)는 useRepeatCards 가 들고 있는다.
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

const PROPS_COLUMNS = [
    {key: 'name', header: 'Name', align: 'start', rowHeader: true},
    {key: 'description', header: 'Description', align: 'start', wrap: true},
    {key: 'type', header: 'Type', align: 'start'},
] as const

const PROPS_ROWS = [
    {
        key: 'title',
        cells: [
            <span key="k" className="text-primary font-mono">
                title
            </span>,
            '묶음 제목입니다. "경력1" 처럼 번호가 붙는 이름을 씁니다. 삭제 버튼의 이름("{title} 삭제")과 접기/열기 버튼의 보조 설명에도 함께 쓰입니다.',
            <span key="t" className="font-mono">
                string
            </span>,
        ],
    },
    {
        key: 'defaultOpen',
        cells: [
            <span key="k" className="text-primary font-mono">
                defaultOpen
            </span>,
            '처음부터 펼쳐 둘지 정합니다. 기본값은 true 이고, 이미 입력이 끝난 칸을 접어서 보여줄 때 false 로 둡니다.',
            <span key="t" className="font-mono">
                boolean
            </span>,
        ],
    },
    {
        key: 'onDelete',
        cells: [
            <span key="k" className="text-primary font-mono">
                onDelete
            </span>,
            '삭제 버튼을 눌렀을 때 실행됩니다. 넘기지 않으면 버튼은 그대로 보이되 아무 일도 하지 않습니다.',
            <span key="t" className="font-mono">
                () =&gt; void
            </span>,
        ],
    },
    {
        key: 'deleteDisabled',
        cells: [
            <span key="k" className="text-primary font-mono">
                deleteDisabled
            </span>,
            '마지막 한 칸처럼 지울 수 없을 때 씁니다. 버튼을 감추지 않고 비활성으로 두어 자리가 흔들리지 않습니다.',
            <span key="t" className="font-mono">
                boolean
            </span>,
        ],
    },
    {
        key: 'headingLevel',
        cells: [
            <span key="k" className="text-primary font-mono">
                headingLevel
            </span>,
            '카드 제목의 헤딩 레벨입니다. 기본값 4 는 카드 위에 소제목(h3)이 있을 때고, 폼 카드 제목(h2) 아래에 카드가 바로 오면 3 을 줍니다 — 레벨을 건너뛰면 스크린리더의 제목 목록에서 한 단계가 비어 보입니다.',
            <span key="t" className="font-mono">
                3 | 4
            </span>,
        ],
    },
    {
        key: 'clearOnly',
        cells: [
            <span key="k" className="text-primary font-mono">
                clearOnly
            </span>,
            '마지막 한 칸을 비활성으로 두는 대신 "값 비우기" 로 쓸 때 씁니다. 카드는 남고 안의 값만 지워지며, 버튼 이름도 "{title} 입력 내용 비우기" 로 바뀝니다. 한 번 고르면 스스로 비울 수 없는 DatePicker·Select 를 처음 상태로 되돌리는 유일한 길입니다.',
            <span key="t" className="font-mono">
                boolean
            </span>,
        ],
    },
    {
        key: 'focusOnMount',
        cells: [
            <span key="k" className="text-primary font-mono">
                focusOnMount
            </span>,
            '방금 추가된 칸에 씁니다. 그려진 직후 제목으로 포커스를 옮겨, 누른 "행추가" 버튼에 포커스가 남지 않게 합니다.',
            <span key="t" className="font-mono">
                boolean
            </span>,
        ],
    },
    {
        key: 'children',
        cells: [
            <span key="k" className="text-primary font-mono">
                children
            </span>,
            '카드 본문입니다. 보통 필드 그리드가 들어갑니다.',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
]

// 반복 입력 카드 — 번호가 붙는 입력 묶음 한 장(경력·인력·특허 등).
const RepeatCardGuidePage = () => (
    <GuidePageShell
        title="반복 입력 카드 (RepeatCard)"
        description="“경력1” 처럼 번호가 붙어 여러 번 반복되는 입력 묶음을 담는 카드입니다. 머리에 접기/열기와 삭제가 오고, 본문에는 그 묶음의 필드가 들어갑니다."
    >
        <BaseCard>
            <section aria-labelledby="repeat-card-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="repeat-card-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        폼 카드(흰 면) 안에 놓이는 한 단계 옅은 카드입니다. 제목과 본문만 넘기면 접기/열기와 삭제 버튼은
                        컴포넌트가 그립니다.
                    </p>
                </div>
                <div className="bg-card border-subtle-3 rounded-md border p-6">
                    <RepeatCard title="경력1">
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
            <section aria-labelledby="repeat-card-list" className="flex flex-col gap-4">
                <div>
                    <h2 id="repeat-card-list" className="typo-h4-bold">
                        목록으로 쓰기
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        추가·삭제는 사용처가 관리합니다 — RepeatCard 는 칸 하나의 생김새와 접기만 담당합니다. 아래에서
                        직접 눌러 볼 수 있습니다. 마지막 한 칸의 삭제 버튼은 비활성이고, 추가하면 새 칸으로, 지우면 이웃
                        칸으로 포커스가 넘어갑니다.
                    </p>
                </div>
                <RepeatCardListDemo />
                <CodeBlock code={LIST_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="repeat-card-behavior" className="flex flex-col gap-4">
                <div>
                    <h2 id="repeat-card-behavior" className="typo-h4-bold">
                        접기와 값 유지
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        접기/열기는 shadcn Collapsible 을 씁니다. 접어도 <strong>입력한 값은 사라지지 않습니다</strong>{' '}
                        — 접힌 동안에도 내용을 그대로 두고 감추기만 하기 때문입니다(FormTabs 의 비활성 탭과 같은 방식).
                        접힌 칸의 입력은 화면에 보이지 않으므로 포커스 순서와 스크린리더에서도 빠집니다.
                    </p>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="repeat-card-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="repeat-card-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아이콘만 있는 삭제 버튼에는 <code className="font-mono">aria-label</code> 로 “경력1 삭제” 처럼
                        어느 묶음인지 붙습니다[5.1.1]. 여러 칸이 같은 “접기/열기” 문구를 쓰므로 그 버튼에도 묶음 이름을
                        숨은 텍스트로 함께 넣습니다[6.4.3]. 제목은 <code className="font-mono">h4</code> 이며(폼 카드 h2
                        · 구획 h3 다음 단계), 칸을 추가·삭제할 때 포커스가 사라지지 않도록 사용처에서{' '}
                        <code className="font-mono">focusOnMount</code> 와 이웃 칸 포커스를 함께 씁니다[6.1.2].
                    </p>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="repeat-card-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="repeat-card-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">RepeatCard 에 넘기는 속성입니다.</p>
                </div>
                <Table size="md" caption="RepeatCard Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RepeatCardGuidePage
