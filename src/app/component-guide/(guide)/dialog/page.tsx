import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import PropsTable from '@/components/guide/props-table'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '다이얼로그 (Dialog)'}

const USAGE_CODE = `<Dialog>
  <DialogTrigger asChild>
    <Button size="lg">열기</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>타이틀</DialogTitle>
      <DialogDescription className="sr-only">
        자가진단 안내의 비순서 및 순서 목록을 확인합니다.
      </DialogDescription>
    </DialogHeader>

    {/* 본문 — 소제목(20px Bold) + 리스트(ListMarker 조합). 긴 목록은 아래 '내부 스크롤' 케이스처럼
        max-h + overflow-y-auto 박스로 감싼다. */}
    <div className="flex flex-col gap-4">
      <h3 className="typo-title-l-bold text-foreground">1depth</h3>
      <ul className="flex flex-col gap-2">
        <li>
          <span className="flex gap-1.5 typo-body-xl-regular text-label-foreground">
            <ListMarker type="unordered" level={1} />텍스트 목록 레벨 1
          </span>
          <ul className="flex flex-col gap-2 pt-2 pl-3">
            <li className="flex gap-1.5 typo-body-xl-regular text-label-foreground">
              <ListMarker type="unordered" level={2} />텍스트 목록 레벨 2
            </li>
          </ul>
        </li>
      </ul>
      {/* 순서 목록도 동일 — <ol> + <ListMarker type="ordered" index={n} /> */}
    </div>

    <DialogFooter>
      <DialogClose asChild>
        <Button variant="tertiary" size="2xl">취소</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button size="2xl">확인</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`

// 케이스 설명 — [id, 라벨, 설명]
const CASE_NOTES = [
    ['confirm', '기본 (확인·취소)', '제목 + 설명 + 취소(tertiary)·확인(primary) 두 버튼. Figma 표준 팝업.'],
    ['alert', '알림형 (단일 버튼)', '되돌릴 게 없는 안내. 확인 버튼 하나로 닫는다.'],
    ['form', '폼 입력형', '본문에 입력 필드. 라벨↔input 연결, 저장/취소.'],
    [
        'scroll',
        '내부 스크롤 (높이 제한)',
        '본문에 높이 제한 박스(max-h + overflow-y-auto)를 두어 그 안만 스크롤. 약관·긴 목록용.',
    ],
    ['no-close', '닫기 버튼 숨김', 'showCloseButton={false} 로 우상단 X 를 없앤다(강제 선택 등).'],
    ['sizes', '크기 변형', 'className 의 max-w 로 폭을 조절(기본 sm:max-w-xl).'],
] as const

const PROPS_ITEMS = [
    [
        'Dialog',
        'open · onOpenChange',
        '열림 상태를 제어합니다. 생략하면 Trigger로 비제어 동작합니다.',
        'undefined',
        'boolean · (open: boolean) => void',
    ],
    ['Dialog', 'defaultOpen · modal', '초기 열림 상태와 모달 동작 여부를 설정합니다.', 'false · true', 'boolean'],
    [
        'DialogTrigger',
        'asChild · trigger props',
        '프로젝트 Button 등 자식 요소를 열기 트리거로 사용합니다.',
        'false',
        'DialogPrimitive.Trigger props',
    ],
    ['DialogContent', 'showCloseButton', '우측 상단 닫기 버튼을 표시합니다.', 'true', 'boolean'],
    [
        'DialogContent',
        'className · content props',
        '폭 등 카드 스타일과 Radix Content 속성을 전달합니다.',
        'undefined',
        'DialogPrimitive.Content props',
    ],
    [
        'DialogHeader',
        'className · div props',
        '제목과 설명을 묶는 헤더 영역 속성입니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    ['DialogTitle', 'children · title props', '접근 가능한 다이얼로그 제목입니다.', '-', 'DialogPrimitive.Title props'],
    [
        'DialogDescription',
        'children · description props',
        '제목 아래의 선택적 설명입니다.',
        '-',
        'DialogPrimitive.Description props',
    ],
    ['DialogFooter', 'showCloseButton', 'Footer 끝에 기본 Close 버튼을 추가합니다.', 'false', 'boolean'],
    [
        'DialogFooter',
        'className · div props',
        '액션 영역 스타일과 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    [
        'DialogClose',
        'asChild · close props',
        '자식 버튼을 닫기 트리거로 사용합니다.',
        'false',
        'DialogPrimitive.Close props',
    ],
    [
        'DialogOverlay · DialogPortal',
        'primitive props',
        '오버레이와 포털의 Radix 속성을 전달합니다.',
        'undefined',
        'Radix Dialog props',
    ],
] as const

// 다이얼로그 — shadcn Dialog 셸에 프로젝트 theme 스타일을 연결한다. Radix가 포커스 트랩·Esc·
// 포커스 복귀·배경 스크롤 잠금을 담당한다([8.2.1]).
const DialogGuidePage = () => (
    <GuidePageShell
        title="다이얼로그 (Dialog)"
        description="화면 위에 띄우는 모달 창입니다. 확인·입력·안내 등 흐름을 잠시 멈추고 사용자 선택을 받을 때 씁니다. 포커스 트랩·Esc 닫기·배경 잠금은 radix 가 제공합니다."
    >
        <BaseCard>
            <section aria-labelledby="dialog-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="dialog-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">Dialog</code> 안에 <code className="font-mono">DialogTrigger</code>
                        (여는 버튼)와 <code className="font-mono">DialogContent</code>(카드)를 둡니다. 카드는{' '}
                        <code className="font-mono">Header</code>·<code className="font-mono">Footer</code> 로
                        구성합니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap gap-3 rounded-md border p-6">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">기본 다이얼로그 열기</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>타이틀</DialogTitle>
                                <DialogDescription className="sr-only">
                                    자가진단 안내의 비순서 및 순서 목록을 확인합니다.
                                </DialogDescription>
                            </DialogHeader>
                            {/* 본문 — Figma 그대로: 소제목(20px Bold) + 비순서/순서 중첩 리스트(ListMarker).
                            일반 본문은 스크롤 없이 그대로 흐른다(긴 목록은 아래 '내부 스크롤' 케이스 참고). */}
                            <div className="flex flex-col gap-4">
                                <h3 className="typo-title-l-bold text-foreground">1depth</h3>
                                <ul className="flex flex-col gap-2">
                                    <li>
                                        <span className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                            <ListMarker type="unordered" level={1} />
                                            텍스트 목록 레벨 1
                                        </span>
                                        <ul className="flex flex-col gap-2 pt-2 pl-3">
                                            <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                                <ListMarker type="unordered" level={2} />
                                                텍스트 목록 레벨 2
                                            </li>
                                            <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                                <ListMarker type="unordered" level={2} />
                                                텍스트 목록 레벨 2
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                        <ListMarker type="unordered" level={1} />
                                        텍스트 목록 레벨 1
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                        <ListMarker type="unordered" level={1} />
                                        텍스트 목록 레벨 1
                                    </li>
                                </ul>
                                <ol className="flex flex-col gap-2">
                                    <li>
                                        <span className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                            <ListMarker type="ordered" level={1} index={1} />
                                            텍스트 목록 레벨 1
                                        </span>
                                        <ol className="flex flex-col gap-2 pt-2 pl-3">
                                            <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                                <ListMarker type="ordered" level={2} index={1} />
                                                텍스트 목록 레벨 2
                                            </li>
                                            <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                                <ListMarker type="ordered" level={2} index={2} />
                                                텍스트 목록 레벨 2
                                            </li>
                                        </ol>
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                        <ListMarker type="ordered" level={1} index={2} />
                                        텍스트 목록 레벨 1
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex gap-1.5">
                                        <ListMarker type="ordered" level={1} index={3} />
                                        텍스트 목록 레벨 1
                                    </li>
                                </ol>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="2xl">
                                        취소
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button size="2xl">확인</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="dialog-cases" className="typo-h4-bold">
                        케이스 큐레이션
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        자주 쓰는 6가지 구성입니다. 각 버튼을 눌러 실제 동작을 확인하세요.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    {CASE_NOTES.map(([id, label, desc]) => (
                        <p key={id} className="typo-body-l-regular text-muted-foreground">
                            <span className="text-foreground font-medium">{label}</span> — {desc}
                        </p>
                    ))}
                </div>
                <div className="border-border flex flex-wrap gap-3 rounded-md border p-6">
                    {/* 알림형 — 단일 확인 버튼 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">알림형</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>제출이 완료되었습니다</DialogTitle>
                                <DialogDescription>
                                    자가진단 결과는 마이페이지에서 다시 확인할 수 있습니다.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button size="2xl">확인</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 폼 입력형 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">폼 입력형</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>담당자 정보 입력</DialogTitle>
                                <DialogDescription>보고서에 표기할 담당자 이름을 입력해 주세요.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="dlg-manager" className="text-foreground font-bold">
                                    담당자 이름
                                </Label>
                                <Input id="dlg-manager" placeholder="홍길동" />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="2xl">
                                        취소
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button size="2xl">저장</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 내부 스크롤 (높이 제한) — 본문에 max-h + overflow-y-auto 박스를 두어 그 안만 스크롤한다.
                    모달·헤더·푸터는 그대로 있고, 스크롤 영역만 높이가 고정된다(약관·긴 목록용). */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">내부 스크롤 (높이 제한)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>이용 약관</DialogTitle>
                                <DialogDescription>아래 약관을 확인한 뒤 동의해 주세요.</DialogDescription>
                            </DialogHeader>
                            <div className="text-label-foreground max-h-64 overflow-y-auto pr-2 text-base">
                                {Array.from({length: 12}, (_, i) => (
                                    <p key={i} className="mb-3">
                                        제{i + 1}조. 본 서비스는 KTRS-FM 평가 결과를 참고 자료로 제공하며, 그 정확성이나
                                        특정 목적 적합성을 보증하지 않습니다. 이용자는 결과를 최종 의사결정의 유일한
                                        근거로 삼지 않아야 합니다.
                                    </p>
                                ))}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="2xl">
                                        닫기
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button size="2xl">동의</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 닫기 버튼 숨김 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">닫기 버튼 숨김</Button>
                        </DialogTrigger>
                        <DialogContent showCloseButton={false}>
                            <DialogHeader>
                                <DialogTitle>약관에 동의해야 진행됩니다</DialogTitle>
                                <DialogDescription>
                                    우상단 X 없이, 아래 버튼으로만 선택할 수 있습니다.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="2xl">
                                        거부
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button size="2xl">동의</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 크기 변형 — 넓게 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">크기 변형 (넓게)</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>넓은 다이얼로그</DialogTitle>
                                <DialogDescription>
                                    <code className="font-mono">className=&quot;sm:max-w-2xl&quot;</code> 로 폭을
                                    넓혔습니다. 표·목록처럼 가로 공간이 필요한 내용에 씁니다.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button size="2xl">확인</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="dialog-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>Radix가 포커스 트랩·Esc 닫기·닫은 뒤 포커스 복귀·배경 스크롤 잠금을 제공합니다([8.2.1]).</li>
                    <li>
                        <code className="font-mono">DialogTitle</code> 은 필수입니다(스크린리더가 모달 이름으로 읽음).
                        시각적 제목이 없으면 <code className="font-mono">sr-only</code> 로라도 둡니다.
                    </li>
                    <li>아이콘만 있는 닫기(X) 버튼에는 sr-only 텍스트가 포함되어 있습니다([5.1.1]).</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="dialog-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Dialog 루트와 각 조합 컴포넌트에 전달하는 주요 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Dialog 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DialogGuidePage
