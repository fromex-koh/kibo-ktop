// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ConsentTermsDialogContent, OptionalConsentTermsDialogContent} from '@/components/composite/consent-terms-dialog'
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
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
import {cn} from '@/lib/utils'

export const metadata: Metadata = {title: '다이얼로그 (Dialog)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'

<Dialog>
  <DialogTrigger asChild>
    <Button size="md">열기</Button>
  </DialogTrigger>

  <DialogContent>
    {/* 머리 — 제목. 닫기(X)는 DialogContent 가 넣는다(끄려면 showCloseButton={false}) */}
    <DialogHeader>
      <DialogTitle>타이틀</DialogTitle>
    </DialogHeader>

    {/* 본문 — 이 구획만 스크롤된다. 안쪽 간격은 gap 으로 정한다 */}
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

const REGION_COLUMNS = [
    {key: 'region', header: '구획', align: 'start', rowHeader: true},
    {key: 'element', header: '컴포넌트', align: 'start'},
    {key: 'padding', header: '자기 여백', align: 'start'},
    {key: 'behavior', header: '화면이 낮아지면', align: 'start', wrap: true},
] as const

const REGION_ROWS = [
    {
        key: 'head',
        cells: [
            '머리',
            <code key="e">DialogHeader</code>,
            '위·좌우 24(sm 이상 40) · 아래 20',
            '높이 그대로 고정됩니다.',
        ],
    },
    {
        key: 'body',
        cells: [
            '본문',
            <code key="e">div + dialogBodyClassName</code>,
            '좌우 24(sm 이상 40) · 상하 4',
            '이 구획만 줄어들며 스크롤됩니다. 상하 4 는 포커스 링이 잘리지 않는 자리입니다.',
        ],
    },
    {
        key: 'footer',
        cells: [
            'CTA',
            <code key="e">DialogFooter</code>,
            '위 20 · 좌우 24(sm 이상 40) · 아래 24',
            '높이 그대로 고정됩니다.',
        ],
    },
] as const

const CASE_COLUMNS = [
    {key: 'case', header: '케이스', align: 'start', rowHeader: true},
    {key: 'slots', header: '구성', align: 'start', wrap: true},
    {key: 'cta', header: 'CTA', align: 'start'},
    {key: 'when', header: '언제 쓰나', align: 'start', wrap: true},
] as const

const CASE_ROWS = [
    {
        key: 'signin',
        cells: [
            '안내 + 두 선택',
            '닫기(X) 없음 · Title(sr-only) + Description(가운데)',
            '보조 + 주',
            '즉시 답할 수 있는 물음 하나. 닫기는 Esc 와 취소 버튼이 대신합니다.',
        ],
    },
    {
        key: 'confirm',
        cells: ['확인', 'Title + Description + 본문', '주 1개', '되돌릴 수 있는 동작을 한 번 더 묻고 결과를 알립니다.'],
    },
    {
        key: 'draft-exit',
        cells: [
            '작성 종료 확인',
            'Title + Description + 본문',
            '보조 + 주',
            '작성 중인 화면을 나가기 전에 계속할지 나갈지 고르게 합니다.',
        ],
    },
    {
        key: 'session',
        cells: [
            '시간 제한 안내',
            'Title + Description(남은 시간) + 본문',
            '보조 + 주',
            '세션 만료 전 연장·로그아웃을 고르게 합니다. [6.2.1]',
        ],
    },
    {
        key: 'input',
        cells: [
            '입력 (여러 필드 · 한 줄 복합 · 단일)',
            'Title + Description + Label + Input',
            '주 1개',
            '필드를 세로로 쌓습니다. 묶음 사이 8, 레이블→입력 16.',
        ],
    },
    {
        key: 'search',
        cells: [
            '검색 + 결과',
            'Title + 안내 + 검색 줄 + 결과',
            '보조 + 주',
            '코드·주소처럼 목록에서 값을 골라 올 때 씁니다(IndustryCodeDialog).',
        ],
    },
    {
        key: 'scroll',
        cells: [
            '필수·선택 동의사항',
            'Title + 스크롤 본문',
            '보조 + 주',
            '약관처럼 긴 본문. 제목과 CTA 는 고정하고 본문만 스크롤합니다.',
        ],
    },
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'dialog',
        cells: [
            '사용자의 선택·입력을 받아야 흐름이 이어짐',
            <code key="c">Dialog</code>,
            '배경을 막고 포커스를 가둡니다. 확인·입력·약관처럼 답을 해야 닫히는 자리에 씁니다.',
        ],
    },
    {
        key: 'confirm-dialog',
        cells: [
            '삭제·초기화 전에 한 번 더 물음',
            <code key="c">ConfirmDialog</code>,
            <>
                <code>composite/confirm-dialog</code> 에 제목·물음·덧붙임·<code>onConfirm</code> 만 넘기는 확인
                모달입니다. 같은 모양으로 반복되는 확인은 Dialog 를 조합하지 말고 이걸 씁니다.
            </>,
        ],
    },
    {
        key: 'toast',
        cells: [
            '저장·제출 같은 짧은 결과를 흐름 끊지 않고 알림',
            <Link key="c" href="/component-guide/toast" className={LINK_CLASS}>
                Toast
            </Link>,
            '자동으로 사라지는 한 줄 안내입니다. 결정이나 긴 설명이 필요하면 쓰지 않습니다.',
        ],
    },
    {
        key: 'check-toast',
        cells: [
            '완료를 체크 표식과 함께 알림',
            <Link key="c" href="/component-guide/check-toast" className={LINK_CLASS}>
                CheckToast
            </Link>,
            '자동저장처럼 화면 위 가운데에 뜨는 완료 토스트입니다.',
        ],
    },
    {
        key: 'alert',
        cells: [
            '화면에 계속 남는 안내',
            <Link key="c" href="/component-guide/alert" className={LINK_CLASS}>
                Alert
            </Link>,
            '본문 안에 인라인으로 놓이고 닫히지 않습니다. 흐름을 막지 않습니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['Dialog', 'open', '열림 상태를 제어합니다. 생략하면 DialogTrigger 로 비제어 동작합니다.', 'undefined', 'boolean'],
    ['Dialog', 'onOpenChange', '열림 상태가 바뀔 때 호출됩니다.', 'undefined', '(open: boolean) => void'],
    ['Dialog', 'defaultOpen', '처음부터 열어 둘지 정합니다.', 'false', 'boolean'],
    ['Dialog', 'modal', '모달 동작(배경 잠금·포커스 가둠) 여부입니다.', 'true', 'boolean'],
    ['DialogTrigger', 'asChild', '자식 요소(Button 등)를 열기 트리거로 씁니다.', 'false', 'boolean'],
    ['DialogContent', 'showCloseButton', '우측 상단 닫기(X) 버튼을 표시합니다.', 'true', 'boolean'],
    [
        'DialogContent',
        'className',
        '카드 스타일을 덧붙입니다. 나머지 Radix Content props 도 전달됩니다.',
        'undefined',
        'string',
    ],
    ['DialogHeader', 'className', '머리 구획입니다. 제목이 여기 들어갑니다.', 'undefined', 'string'],
    ['DialogTitle', 'children', '대화상자의 이름입니다. 스크린리더가 읽습니다.', '-', 'ReactNode'],
    [
        'DialogDescription',
        'children',
        '소제목입니다. 머리가 아니라 본문 구획의 첫 줄에 둡니다. 숨기려면 className="sr-only" 를 줍니다.',
        '-',
        'ReactNode',
    ],
    ['DialogFooter', 'showCloseButton', 'CTA 끝에 기본 닫기 버튼(Close)을 추가합니다.', 'false', 'boolean'],
    ['DialogFooter', 'className', 'CTA 구획입니다. 버튼이 폭을 나눠 채웁니다.', 'undefined', 'string'],
    ['DialogClose', 'asChild', '자식 버튼을 닫기 트리거로 씁니다.', 'false', 'boolean'],
] as const

const H3_CLASS = 'typo-title-m-bold text-foreground'
const DESC_CLASS = 'typo-body-l-regular text-label-foreground'
const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'

const BASIC_DEMO = (
    <Dialog>
        <DialogTrigger asChild>
            <Button size="md">기본 다이얼로그 열기</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>타이틀</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'gap-4')}>
                <DialogDescription>소제목</DialogDescription>
                <p className="typo-body-xl-regular text-label-foreground">본문 내용입니다.</p>
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
)

// 다이얼로그 — shadcn Dialog 셸에 프로젝트 theme 스타일을 연결한다. 포커스 트랩·Esc·포커스 복귀·배경 스크롤 잠금은
// Radix 가 담당한다([8.2.1]).
const DialogGuidePage = () => (
    <GuidePageShell
        title="다이얼로그 (Dialog)"
        description="화면 위에 띄우는 모달 창입니다. 확인·입력·안내처럼 흐름을 잠시 멈추고 사용자의 답을 받을 때 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="dialog-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dialog-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>Dialog</code> 안에 <code>DialogTrigger</code> 와 <code>DialogContent</code> 를 둡니다.
                        카드는 머리 · 본문 · CTA 세 구획이며, 본문은 <code>dialogBodyClassName</code> 으로 감쌉니다.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">{BASIC_DEMO}</div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>구획과 스크롤</h3>
                        <p className={DESC_CLASS}>
                            여백은 카드가 통째로 갖지 않고 구획이 각자 갖습니다. 그래야 본문이 스크롤될 때 글이 머리·CTA
                            여백 아래로 들어가며 잘립니다. 카드 높이는 화면의 80%(<code>size.modal-max-h</code>
                            )까지이고, 약관처럼 더 낮은 상한이 필요하면 본문에 <code>max-h-*</code> 를 얹습니다.
                        </p>
                        <Table
                            size="md"
                            caption="다이얼로그 카드의 세 구획"
                            columns={REGION_COLUMNS}
                            rows={REGION_ROWS}
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-cases" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dialog-cases" className="typo-h4-bold">
                        케이스 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        자주 쓰는 구성입니다. 표에서 슬롯 조합을 확인하고, 버튼을 눌러 실제 동작을 확인합니다.
                    </p>
                </div>
                <Table size="md" caption="다이얼로그 케이스별 구성" columns={CASE_COLUMNS} rows={CASE_ROWS} />
                <div className="flex flex-wrap gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">안내 + 두 선택</Button>
                        </DialogTrigger>
                        <DialogContent showCloseButton={false}>
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
                                        취소
                                    </Button>
                                </DialogClose>
                                <Button size="xl">로그인하기</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <IndustryCodeDialog>
                        <Button size="md">검색 + 결과</Button>
                    </IndustryCodeDialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">확인</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>로그아웃 안내</DialogTitle>
                            </DialogHeader>
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">시간 제한 안내</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>로그인 연장</DialogTitle>
                            </DialogHeader>
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">입력 (여러 필드)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>비밀번호 변경</DialogTitle>
                            </DialogHeader>
                            <div className={cn(dialogBodyClassName, 'gap-6')}>
                                <DialogDescription>
                                    회원님의 소중한 정보를 보호하기 위해 비밀번호를 변경해 주세요.
                                </DialogDescription>
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">입력 (한 줄 복합)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>본인 인증</DialogTitle>
                            </DialogHeader>
                            <div className={cn(dialogBodyClassName, 'gap-6')}>
                                <DialogDescription>주민등록번호를 입력해 주세요</DialogDescription>
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">입력 (단일 필드)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>내 정보 확인</DialogTitle>
                            </DialogHeader>
                            <div className={cn(dialogBodyClassName, 'gap-6')}>
                                <DialogDescription>
                                    회원님의 소중한 정보를 보호하기 위해 비밀번호를 변경해 주세요.
                                </DialogDescription>
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">필수 동의사항 (내부 스크롤)</Button>
                        </DialogTrigger>
                        <ConsentTermsDialogContent />
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="md">선택 동의사항</Button>
                        </DialogTrigger>
                        <OptionalConsentTermsDialogContent />
                    </Dialog>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dialog-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사용자의 답이 필요한지, 화면에 얼마나 남아야 하는지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="Dialog · Toast · CheckToast · Alert 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dialog-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        동작은 업스트림(Radix)이 처리하므로 사용처는 구조만 맞춥니다. theme 는 스타일만 담당합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        포커스 가둠 · Esc 닫기 · 바깥 클릭 닫기 · 닫은 뒤 포커스 복귀 · 배경 스크롤 잠금은 Radix 가
                        처리합니다[8.2.1]. 직접 구현하지 않습니다.
                    </li>
                    <li>
                        <code>DialogTitle</code> 은 필수입니다. 보이는 제목이 없으면 <code>sr-only</code> 로 둡니다.
                    </li>
                    <li>
                        닫기(X)는 <code>DialogContent</code> 가 아이콘 + <code>sr-only</code> &quot;닫기&quot; 로
                        렌더하며, 끈 경우 취소·확인 버튼으로 닫을 수 있어야 합니다[5.1.1].
                    </li>
                    <li>
                        입력 모달은 <code>Label htmlFor</code> ↔ <code>Input id</code> 를 연결합니다[7.4.1].
                    </li>
                    <li>세션 만료처럼 시간 제한이 있는 안내는 연장 수단(버튼)을 함께 제공합니다[6.2.1].</li>
                    <li>화면이 낮아져도 제목·CTA 가 보이도록 본문 구획만 스크롤됩니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dialog-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dialog-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        주요 속성입니다. 표에 없는 속성은 Radix Dialog 의 같은 이름 컴포넌트 props 를 따릅니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Dialog 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DialogGuidePage
