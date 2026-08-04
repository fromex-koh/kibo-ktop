import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'
import {ConsentTermsDialogContent} from '@/components/composite/consent-terms-dialog'
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
    <Button size="md">열기</Button>
  </DialogTrigger>

  <DialogContent>
    {/* 머리 — 제목. 닫기(X)는 셸이 자동으로 넣는다(끄려면 showCloseButton={false}) */}
    <DialogHeader>
      <DialogTitle>타이틀</DialogTitle>
    </DialogHeader>

    {/* 본문 — 이 구획만 스크롤된다. 안쪽 간격은 gap 으로 직접 정한다 */}
    <div className={cn(dialogBodyClassName, 'gap-4')}>
      <DialogDescription>소제목</DialogDescription>
      <p className="typo-body-xl-regular text-label-foreground">본문</p>
    </div>

    {/* CTA — 둘이면 폭을 반씩, 하나면 폭 전체 */}
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="tertiary" size="xl">취소</Button>
      </DialogClose>
      <Button size="xl">확인</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`

// 케이스별 구성 — 시안 "[공통] 모달"(40006512:19589)의 실제 사용 케이스 7가지.
// 공통 규격: 폭 588 · 반경 24 · 여백 40/40/24 · 딤 검정 75% · CTA 높이 60(둘이면 본문 폭을 반씩 나눠 채움).
// 이름만으로는 어떤 조합인지 알 수 없어 슬롯 단위로 나눠 적는다 — 아래 데모 버튼의 라벨과 같은 순서다.
// slots: DialogHeader~본문에 무엇이 들어가는지 · cta: 버튼 구성 · close: 우상단 닫기(X) 노출 여부
const CASE_SPECS = [
    {
        key: 'signin',
        label: '안내 + 두 선택',
        slots: 'Title(sr-only) + Description(가운데)',
        cta: '보조 + 주 · 반씩(246)',
        close: '없음',
        when: '즉시 답할 수 있는 물음 하나. 본문이 없어 물음을 가운데 두고, 닫기는 Esc 와 취소 버튼이 대신한다.',
    },
    {
        key: 'logout',
        label: '확인',
        slots: 'Title + Description + 본문 <p>',
        cta: '주 1개 · 폭 전체(508)',
        close: '있음',
        when: '되돌릴 수 있는 동작을 한 번 더 묻는다. 소제목으로 무엇을 묻는지, 본문으로 그 결과를 알린다.',
    },
    {
        key: 'draft-exit',
        label: '작성 종료 확인',
        slots: 'Title + Description + 본문 <p>',
        cta: '보조 + 주 · 반씩(246)',
        close: '있음',
        when: '작성 중인 화면을 나가기 전에 자동 저장 여부를 알리고, 계속 작성하거나 나가도록 선택하게 한다.',
    },
    {
        key: 'session',
        label: '시간 제한 안내',
        slots: 'Title + Description(숫자만 primary) + 본문 <p>',
        cta: '보조 + 주 · 반씩(246)',
        close: '있음',
        when: '남은 시간을 소제목에 노출하고 연장·로그아웃을 고르게 한다. [6.2.1]',
    },
    {
        key: 'password',
        label: '입력 (여러 필드)',
        slots: 'Title + Description + (Label + Input) × 2',
        cta: '주 1개 · 폭 전체(508)',
        close: '있음',
        when: '필드를 세로로 쌓는다. 묶음 사이 8, 레이블→입력 16. 시안은 필수 표시(*)를 꺼 둔 상태다.',
    },
    {
        key: 'identity',
        label: '입력 (한 줄 복합)',
        slots: 'Title + Description + Label + Input 2칸',
        cta: '주 1개 · 폭 전체(508)',
        close: '있음',
        when: '주민등록번호처럼 한 줄을 두 칸으로 나눠 받는다. 뒷자리는 마스킹한다.',
    },
    {
        key: 'verify',
        label: '입력 (단일 필드)',
        slots: 'Title + Description + Label + Input',
        cta: '주 1개 · 폭 전체(508)',
        close: '있음',
        when: '확인용 한 칸. 시안은 필수 표시(*)를 꺼 둔 상태다.',
    },
    {
        key: 'scroll',
        label: '필수 동의사항 (내부 스크롤)',
        slots: 'Title + 본문 스크롤 박스(440 고정)',
        cta: '보조 + 주 · 반씩(246)',
        close: '있음',
        when: '약관처럼 본문이 긴 경우. 제목과 CTA 는 고정하고 본문만 스크롤해 닫기·확인을 항상 보이게 한다.',
    },
] as const

// 카드의 세 구획 — 여백을 카드가 통째로 갖지 않고 구획이 각자 갖는다. 그래야 본문이 스크롤될 때 글이
// 머리·CTA 의 여백 아래로 들어가며 잘린다(가장자리에서 뚝 끊기지 않는다).
const REGION_COLUMNS = [
    {key: 'region', header: '구획', align: 'start', rowHeader: true},
    {key: 'element', header: '요소', align: 'start'},
    {key: 'padding', header: '자기 여백', align: 'start'},
    {key: 'behavior', header: '화면이 낮아지면', align: 'start', wrap: true},
] as const

const REGION_ROWS = [
    {
        key: 'head',
        cells: [
            <span key="r" className="text-foreground font-medium">
                머리
            </span>,
            <span key="e" className="text-primary font-mono">
                DialogHeader (+ 닫기 X)
            </span>,
            '위 40 · 좌우 40 · 아래 20',
            '고정 — 높이 그대로 남는다',
        ],
    },
    {
        key: 'body',
        cells: [
            <span key="r" className="text-foreground font-medium">
                본문
            </span>,
            <span key="e" className="text-primary font-mono">
                div + dialogBodyClassName
            </span>,
            '좌우 40 · 상하 4(포커스 링 자리)',
            '이 구획만 줄어들며 스크롤된다',
        ],
    },
    {
        key: 'footer',
        cells: [
            <span key="r" className="text-foreground font-medium">
                CTA
            </span>,
            <span key="e" className="text-primary font-mono">
                DialogFooter
            </span>,
            '위 20 · 좌우 40 · 아래 24',
            '고정 — 높이 그대로 남는다',
        ],
    },
] as const

const CASE_COLUMNS = [
    {key: 'case', header: '케이스', align: 'start', rowHeader: true},
    {key: 'slots', header: '구성', align: 'start', wrap: true},
    {key: 'cta', header: 'CTA', align: 'start'},
    {key: 'close', header: '닫기(X)', align: 'start'},
    {key: 'when', header: '언제 쓰나', align: 'start', wrap: true},
] as const

const CASE_ROWS = CASE_SPECS.map((spec) => ({
    key: spec.key,
    cells: [
        <span key="case" className="text-foreground font-medium">
            {spec.label}
        </span>,
        <span key="slots" className="text-primary font-mono">
            {spec.slots}
        </span>,
        spec.cta,
        spec.close,
        spec.when,
    ],
}))

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
        '머리 구획입니다. 제목이 여기 들어가고 자기 여백(위 40 · 좌우 40 · 아래 20)을 가집니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    ['DialogTitle', 'children · title props', '접근 가능한 다이얼로그 제목입니다.', '-', 'DialogPrimitive.Title props'],
    [
        'DialogDescription',
        'children · description props',
        '소제목(20px Bold)입니다. 시안에서는 머리가 아니라 본문 구획의 첫 줄입니다.',
        '-',
        'DialogPrimitive.Description props',
    ],
    ['DialogFooter', 'showCloseButton', 'Footer 끝에 기본 Close 버튼을 추가합니다.', 'false', 'boolean'],
    [
        'DialogFooter',
        'className · div props',
        'CTA 구획입니다. 자기 여백(위 20 · 좌우 40 · 아래 24)을 가지며 마지막 행에 놓입니다.',
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
                        <strong className="text-foreground font-medium">머리 · 본문 · CTA 세 구획</strong>이고, 본문은{' '}
                        <code className="font-mono">dialogBodyClassName</code> 으로 감쌉니다 — 화면이 낮아지면 이 구획만
                        줄어들며 스크롤됩니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap gap-3 rounded-md border p-6">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">기본 다이얼로그 열기</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>타이틀</DialogTitle>
                                <DialogDescription className="sr-only">
                                    자가진단 안내의 비순서 및 순서 목록을 확인합니다.
                                </DialogDescription>
                            </DialogHeader>
                            {/* 본문 구획 — 화면이 낮으면 여기만 줄어들며 스크롤된다(머리·CTA 는 고정). */}
                            <div className={cn(dialogBodyClassName, 'gap-4')}>
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
                                    <Button variant="tertiary" size="xl">
                                        취소
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button size="xl">확인</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-layout" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="dialog-layout" className="typo-h4-bold">
                        레이아웃 구조
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        카드는 세 구획으로 나뉜 grid 입니다. 여백은 카드가 통째로 갖지 않고 구획이 각자 갖습니다 —
                        그래야 본문이 스크롤될 때 글이 머리·CTA 의 여백 아래로 들어가며 잘리고, 가장자리에서 뚝 끊기지
                        않습니다.
                    </p>
                </div>
                <Table size="md" caption="다이얼로그 카드의 세 구획" columns={REGION_COLUMNS} rows={REGION_ROWS} />
                <p className="typo-body-l-regular text-muted-foreground">
                    카드는 화면보다 짧으면 자기 높이 그대로이고, 화면의 80%(
                    <code className="font-mono">size.modal-max-h</code>)에 걸리면 본문 구획만 줄어들며 스크롤됩니다.
                    약관처럼 더 좁은 상한이 필요하면 본문에 <code className="font-mono">max-h-*</code> 를 얹습니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="dialog-cases" className="typo-h4-bold">
                        케이스 큐레이션
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        자주 쓰는 8가지 구성입니다. 표에서 어떤 슬롯 조합인지 확인하고, 아래 같은 이름의 버튼을 눌러
                        실제 동작을 보세요. 폭 588 · 반경 24 · 여백 40/40/24 는 모든 케이스가 공유합니다.
                    </p>
                </div>
                <Table size="md" caption="다이얼로그 케이스별 구성" columns={CASE_COLUMNS} rows={CASE_ROWS} />
                <div className="border-border flex flex-wrap gap-3 rounded-md border p-6">
                    {/* 안내 + 두 선택 — 시안(40006512:19591)은 이 케이스에서만 타이틀 행(제목·닫기 X)을 숨긴다.
                        물음 한 줄만 남으므로 가운데 정렬하고, 위아래 32 여백으로 시안의 블록 높이(94)를 맞춘다.
                        제목은 스크린리더가 모달 이름으로 읽어야 하므로 sr-only 로 남긴다. 닫기는 Esc 와
                        '다음에 하기'가 대신한다. */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">안내 + 두 선택</Button>
                        </DialogTrigger>
                        <DialogContent showCloseButton={false}>
                            {/* 머리 구획이 없는 유일한 케이스 — 제목이 sr-only 라 머리 여백을 없애 첫 행을
                                0 으로 만든다. 그래야 시안 높이(242)가 나온다. */}
                            <DialogHeader className="p-0">
                                <DialogTitle className="sr-only">회원가입/로그인</DialogTitle>
                            </DialogHeader>
                            <div className={cn(dialogBodyClassName, 'pt-10')}>
                                <DialogDescription className="py-8 text-center">
                                    회원가입/로그인 후 이용하시겠어요?
                                </DialogDescription>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="xl">
                                        다음에 하기
                                    </Button>
                                </DialogClose>
                                <Button size="xl">로그인</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 확인 — 주 동작 하나를 폭 전체로 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">확인</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>로그아웃 안내</DialogTitle>
                            </DialogHeader>
                            {/* 시안의 content 프레임 — 소제목과 본문을 한 블록(간격 16)으로 묶는다. */}
                            <div className={cn(dialogBodyClassName, 'gap-4')}>
                                <DialogDescription>로그아웃 하시겠어요?</DialogDescription>
                                <p className="typo-body-xl-regular text-label-foreground">
                                    현재 계정에서 로그아웃됩니다.
                                    <br />
                                    다시 이용하시려면 로그인해 주세요.
                                </p>
                            </div>
                            <DialogFooter>
                                <Button size="xl">로그아웃</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 작성 종료 확인 — 자동 저장 안내 후 계속 작성하거나 화면을 나가도록 선택 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">작성 종료 확인</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>작성 종료</DialogTitle>
                            </DialogHeader>
                            <div className={cn(dialogBodyClassName, 'gap-4')}>
                                <DialogDescription>입력 화면을 나가시겠습니까?</DialogDescription>
                                <p className="typo-body-xl-regular text-label-foreground">
                                    현재까지 작성한 내용은 자동으로 저장되었습니다. 입력 화면을 나가도 나중에 이어서
                                    작성할 수 있습니다.
                                </p>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="xl">
                                        계속 작성
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button size="xl">저장 후 나가기</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 시간 제한 안내 — 남은 시간을 소제목에 노출 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">시간 제한 안내</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>로그인 연장</DialogTitle>
                            </DialogHeader>
                            {/* 시안의 content 프레임 — 소제목과 본문을 한 블록(간격 16)으로 묶는다.
                                타이틀과의 간격 24 와 CTA 와의 간격 24 는 Content 의 grid gap 이 만든다. */}
                            <div className={cn(dialogBodyClassName, 'gap-4')}>
                                <DialogDescription>
                                    로그아웃까지 남은 시간 : <strong className="text-primary font-bold">90초</strong>
                                </DialogDescription>
                                <p className="typo-body-xl-regular text-label-foreground">
                                    10분 동안 서비스를 이용하지 않아 잠시 후 자동으로 로그아웃될 예정입니다.
                                    <br />
                                    로그인 시간을 연장하시겠어요?
                                </p>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="tertiary" size="xl">
                                        로그아웃
                                    </Button>
                                </DialogClose>
                                <Button size="xl">로그인 연장</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 입력 — 여러 필드 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">입력 (여러 필드)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>비밀번호 변경</DialogTitle>
                            </DialogHeader>
                            {/* 본문 구획 — 소제목과 입력 묶음(간격 24). 화면이 낮으면 여기만 스크롤된다. */}
                            <div className={cn(dialogBodyClassName, 'gap-6')}>
                                <DialogDescription>
                                    회원님의 소중한 정보를 보호하기 위해 비밀번호를 변경해 주세요.
                                </DialogDescription>
                                {/* 시안의 li 프레임 — 입력 묶음 사이는 8, 각 묶음 안의 레이블→입력은 16.
                                    시안 인스턴스는 필수 표시(*)를 꺼 둔 상태다. */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-4">
                                        <Label htmlFor="dlg-pw" className="text-foreground font-bold">
                                            비밀번호
                                        </Label>
                                        <Input
                                            id="dlg-pw"
                                            type="password"
                                            placeholder="영문, 숫자, 특수문자 포함 10~20자 이내"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <Label htmlFor="dlg-pw-confirm" className="text-foreground font-bold">
                                            비밀번호 확인
                                        </Label>
                                        <Input
                                            id="dlg-pw-confirm"
                                            type="password"
                                            placeholder="비밀번호를 다시 입력해 주세요"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button size="xl">비밀번호 변경</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 입력 — 한 줄 복합 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">입력 (한 줄 복합)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>본인 인증</DialogTitle>
                            </DialogHeader>
                            {/* 본문 구획 — 소제목과 입력 묶음(간격 24). 화면이 낮으면 여기만 스크롤된다. */}
                            <div className={cn(dialogBodyClassName, 'gap-6')}>
                                <DialogDescription>주민등록번호를 입력해 주세요</DialogDescription>
                                {/* 시안의 li 프레임 — 레이블→입력 16, 한 줄 안의 두 칸과 구분자 사이는 각각 8. */}
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="dlg-rrn-front" className="text-foreground font-bold">
                                        주민등록번호
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="dlg-rrn-front" inputMode="numeric" placeholder="901231" />
                                        <span aria-hidden="true" className="text-foreground">
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
                            </div>
                            <DialogFooter>
                                <Button size="xl">본인 확인</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 입력 — 단일 필드 */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">입력 (단일 필드)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>내 정보 확인</DialogTitle>
                            </DialogHeader>
                            {/* 본문 구획 — 소제목과 입력 묶음(간격 24). 화면이 낮으면 여기만 스크롤된다. */}
                            <div className={cn(dialogBodyClassName, 'gap-6')}>
                                <DialogDescription>
                                    회원님의 소중한 정보를 보호하기 위해 비밀번호를 변경해 주세요.
                                </DialogDescription>
                                {/* 시안의 li 프레임 — 레이블→입력 16. 시안 인스턴스는 필수 표시(*)를 꺼 둔 상태다. */}
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="dlg-verify-pw" className="text-foreground font-bold">
                                        비밀번호
                                    </Label>
                                    <Input id="dlg-verify-pw" type="password" placeholder="비밀번호를 입력해 주세요" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button size="xl">비밀번호 확인</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* 내부 스크롤 — 시안(40006522:18978)은 본문을 440 높이로 잘라 스크롤한다. 다른 케이스와
                        같은 본문 구획이고 상한만 더 얹는다 — max-h-112(448)는 시안의 440 + 포커스 링 자리
                        py-1(8)이라, 실제로 보이는 스크롤 영역이 440 이 된다. */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">필수 동의사항 (내부 스크롤)</Button>
                        </DialogTrigger>
                        {/* 본문·CTA 는 composite/consent-terms-dialog 가 갖는다 — 문의 등록 화면의 "내용보기"와 같은 내용이다. */}
                        <ConsentTermsDialogContent />
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
                    <li>
                        포커스 트랩·Esc 닫기·바깥 클릭 닫기·닫은 뒤 포커스 복귀·배경 스크롤 잠금은 radix 가 처리합니다
                        ([8.2.1]). 직접 구현하지 마세요.
                    </li>
                    <li>
                        <code className="font-mono">DialogTitle</code> 은 필수입니다(스크린리더가 모달 이름으로 읽음).
                        시각적 제목이 없으면 <code className="font-mono">sr-only</code> 로라도 둡니다.
                    </li>
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
