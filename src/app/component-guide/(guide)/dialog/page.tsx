import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
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
          <span className="flex typo-body-xl-regular text-label-foreground">
            <ListMarker type="unordered" level={1} />텍스트 목록 레벨 1
          </span>
          <ul className="flex flex-col gap-2 pt-2 pl-3">
            <li className="flex typo-body-xl-regular text-label-foreground">
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
// 시안 "[공통] 모달"(40006512:19589)의 6가지 실제 사용 케이스.
// 공통 규격: 폭 588 · 반경 24 · 여백 40/40/24 · 딤 검정 75% · CTA 높이 60(둘이면 본문 폭을 반씩 나눠 채움).
const CASE_NOTES = [
    ['signin', '안내 + 두 선택', '본문 없이 물음 한 줄만 두고 취소·확인을 나란히. 본문이 없어 물음을 가운데 정렬한다.'],
    [
        'logout',
        '확인 (되돌릴 수 있는 동작)',
        '소제목으로 무엇을 묻는지, 본문으로 결과를 알린다. 주 동작 하나를 폭 전체로 둔다.',
    ],
    ['session', '시간 제한 안내', '남은 시간을 소제목에 노출하고 연장·로그아웃 두 선택을 준다. [6.2.1]'],
    ['password', '입력 (여러 필드)', '본문에 라벨·필수 표시·도움말을 갖춘 입력을 쌓는다.'],
    ['identity', '입력 (한 줄 복합)', '주민등록번호처럼 한 줄을 두 칸으로 나눠 받는다. 뒷자리는 마스킹한다.'],
    ['verify', '입력 (단일 필드)', '확인용 한 칸. 제출 버튼 하나를 폭 전체로 둔다.'],
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
                                        <span className="typo-body-xl-regular text-label-foreground flex">
                                            <ListMarker type="unordered" level={1} />
                                            텍스트 목록 레벨 1
                                        </span>
                                        <ul className="flex flex-col gap-2 pt-2 pl-3">
                                            <li className="typo-body-xl-regular text-label-foreground flex">
                                                <ListMarker type="unordered" level={2} />
                                                텍스트 목록 레벨 2
                                            </li>
                                            <li className="typo-body-xl-regular text-label-foreground flex">
                                                <ListMarker type="unordered" level={2} />
                                                텍스트 목록 레벨 2
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex">
                                        <ListMarker type="unordered" level={1} />
                                        텍스트 목록 레벨 1
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex">
                                        <ListMarker type="unordered" level={1} />
                                        텍스트 목록 레벨 1
                                    </li>
                                </ul>
                                <ol className="flex flex-col gap-2">
                                    <li>
                                        <span className="typo-body-xl-regular text-label-foreground flex">
                                            <ListMarker type="ordered" level={1} index={1} />
                                            텍스트 목록 레벨 1
                                        </span>
                                        <ol className="flex flex-col gap-2 pt-2 pl-3">
                                            <li className="typo-body-xl-regular text-label-foreground flex">
                                                <ListMarker type="ordered" level={2} index={1} />
                                                텍스트 목록 레벨 2
                                            </li>
                                            <li className="typo-body-xl-regular text-label-foreground flex">
                                                <ListMarker type="ordered" level={2} index={2} />
                                                텍스트 목록 레벨 2
                                            </li>
                                        </ol>
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex">
                                        <ListMarker type="ordered" level={1} index={2} />
                                        텍스트 목록 레벨 1
                                    </li>
                                    <li className="typo-body-xl-regular text-label-foreground flex">
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
                    {/* 안내 + 두 선택 — 본문이 없어 물음을 가운데 정렬한다. */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">안내 + 두 선택</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>회원가입/로그인</DialogTitle>
                                <DialogDescription className="typo-title-l-bold text-foreground text-center">
                                    회원가입/로그인 후 이용하시겠어요?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="2xl">
                                        다음에 하기
                                    </Button>
                                </DialogClose>
                                <Button size="2xl">로그인</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 확인 — 주 동작 하나를 폭 전체로 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">확인</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>로그아웃 안내</DialogTitle>
                                <DialogDescription className="typo-title-l-bold text-foreground">
                                    로그아웃 하시겠어요?
                                </DialogDescription>
                            </DialogHeader>
                            <p className="typo-body-xl-regular text-label-foreground">
                                현재 계정에서 로그아웃됩니다.
                                <br />
                                다시 이용하시려면 로그인해 주세요.
                            </p>
                            <DialogFooter>
                                <Button size="2xl">로그아웃</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 시간 제한 안내 — 남은 시간을 소제목에 노출 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">시간 제한 안내</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>로그인 연장</DialogTitle>
                                <DialogDescription className="typo-title-l-bold text-foreground">
                                    로그아웃까지 남은 시간 : 90초
                                </DialogDescription>
                            </DialogHeader>
                            <p className="typo-body-xl-regular text-label-foreground">
                                10분 동안 서비스를 이용하지 않아 잠시 후 자동으로 로그아웃될 예정입니다.
                                <br />
                                로그인 시간을 연장하시겠어요?
                            </p>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="2xl">
                                        로그아웃
                                    </Button>
                                </DialogClose>
                                <Button size="2xl">로그인 연장</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 입력 — 여러 필드 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">입력 (여러 필드)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>비밀번호 변경</DialogTitle>
                                <DialogDescription className="typo-title-l-bold text-foreground">
                                    회원님의 소중한 정보를 보호하기 위해 비밀번호를 변경해 주세요.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="dlg-pw" className="text-foreground font-bold">
                                        비밀번호 <span className="text-error">*</span>
                                    </Label>
                                    <Input
                                        id="dlg-pw"
                                        type="password"
                                        placeholder="영문, 숫자, 특수문자 포함 10~20자 이내"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="dlg-pw-confirm" className="text-foreground font-bold">
                                        비밀번호 확인 <span className="text-error">*</span>
                                    </Label>
                                    <Input
                                        id="dlg-pw-confirm"
                                        type="password"
                                        placeholder="비밀번호를 다시 입력해 주세요"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button size="2xl">비밀번호 변경</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 입력 — 한 줄 복합 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">입력 (한 줄 복합)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>본인 인증</DialogTitle>
                                <DialogDescription className="typo-title-l-bold text-foreground">
                                    주민등록번호를 입력해주세요
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="dlg-rrn-front" className="text-foreground font-bold">
                                    주민등록번호
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input id="dlg-rrn-front" inputMode="numeric" placeholder="901231" />
                                    <span aria-hidden="true" className="text-label-foreground">
                                        -
                                    </span>
                                    <Input
                                        id="dlg-rrn-back"
                                        type="password"
                                        inputMode="numeric"
                                        aria-label="주민등록번호 뒷자리"
                                        placeholder="*******"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button size="2xl">본인 확인</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 입력 — 단일 필드 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg">입력 (단일 필드)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>내 정보 확인</DialogTitle>
                                <DialogDescription className="typo-title-l-bold text-foreground">
                                    회원님의 소중한 정보를 보호하기 위해 비밀번호를 변경해 주세요.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="dlg-verify-pw" className="text-foreground font-bold">
                                    비밀번호 <span className="text-error">*</span>
                                </Label>
                                <Input id="dlg-verify-pw" type="password" placeholder="비밀번호를 입력해 주세요" />
                            </div>
                            <DialogFooter>
                                <Button size="2xl">비밀번호 확인</Button>
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
