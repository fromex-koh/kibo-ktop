'use client'

import type {ReactNode} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import serviceStatusIllustration from '@public/images/service-status/service-status-illustration.webp'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 로그인 흐름 화면의 콘텐츠 영역만 비워 둔다. 실제 화면 내용은 서비스 연동 시 추가한다.
const AuthFlowPage = ({children}: {children?: ReactNode}) => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="grid-layout *:col-span-full">{children}</div>
    </main>
)

const SessionExtensionDialog = () => (
    // 화면 확인을 위해 모달을 열어 둔다.
    <Dialog defaultOpen>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>로그인 연장</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'gap-4')}>
                <DialogDescription>
                    로그아웃까지 남은 시간 : <strong className="text-primary font-bold">30:00</strong>
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
)

const InitialPasswordChangeDialog = () => (
    // 화면 확인을 위해 모달을 열어 둔다.
    <Dialog defaultOpen>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>내 정보 확인</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'gap-6')}>
                <DialogDescription>회원님의 소중한 정보를 보호하기 위해 비밀번호를 변경해 주세요.</DialogDescription>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="initial-password" className="text-foreground font-bold">
                        비밀번호
                    </Label>
                    <Input id="initial-password" type="password" placeholder="비밀번호를 입력해 주세요" />
                </div>
            </div>
            <DialogFooter>
                <Button size="xl">비밀번호 확인</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

const SessionExtensionPage = () => (
    <>
        <AuthFlowPage />
        <SessionExtensionDialog />
    </>
)

const LoginGuideDialog = () => (
    // 비로그인 상태에서 보호된 메뉴를 선택했을 때의 안내 모달을 화면 확인용으로 연다.
    <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
            <DialogHeader className="p-0">
                <DialogTitle className="sr-only">회원가입/로그인</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'pt-0')}>
                <DialogDescription className="py-8 text-center">
                    로그인이 필요한 서비스입니다. 로그인하시겠습니까?
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
)

const LoginGuidePage = () => (
    <>
        <AuthFlowPage>
            <p className="typo-body-xl-regular text-label-foreground py-10">
                로그인해야 볼 수 있는 메뉴를 비로그인 상태에서 클릭하면 노출되는 모달입니다.
            </p>
        </AuthFlowPage>
        <LoginGuideDialog />
    </>
)

// 로그인 종료 — 시안 "[공통] 로그인 종료"(40006805:26258).
// 기존 컴포넌트·이미지 조합이다: 서비스 상태 일러스트(404·500·정기점검과 같은 파일) · ActionBar · Button.
// 자동 로그아웃된 뒤의 화면이라 Header 는 로그인 전 구성으로 둔다((logged-out) 그룹).
// 로그인 경로는 인증 연동 시 실제 로그인 화면으로 연결한다.
const LoginEndPage = () => (
    <AuthFlowPage>
        {/* 세로 간격은 시안 그대로다 — 헤더 아래 80, 일러스트↔제목 40, 제목↔설명 8, 설명↔버튼 60. */}
        <div className="flex flex-col items-center gap-15 py-20">
            <div className="flex flex-col items-center gap-10">
                <Image
                    src={serviceStatusIllustration}
                    alt=""
                    priority
                    sizes="320px"
                    className="h-auto w-full max-w-80"
                />
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="typo-h1-bold text-foreground text-balance break-keep">자동 로그아웃 되었어요</h1>
                    <p className="typo-title-m-regular text-foreground-subtle break-keep">
                        회원님의 안전한 서비스 이용을 위해 일정시간 동안 서비스 이용이 없는 경우 자동 로그아웃 됩니다.
                    </p>
                </div>
            </div>
            <ActionBar>
                <ActionBarCenter className="col-span-3 col-start-1 w-full flex-col gap-4 md:col-span-1 md:col-start-2 md:w-auto md:flex-row">
                    <Button asChild variant="tertiary" size="xl" className="w-full md:w-auto">
                        <Link href="/">홈으로 이동</Link>
                    </Button>
                    <Button asChild size="xl" className="w-full md:w-auto">
                        <Link href="#">로그인</Link>
                    </Button>
                </ActionBarCenter>
            </ActionBar>
        </div>
    </AuthFlowPage>
)

const InitialPasswordChangePage = () => (
    <>
        <AuthFlowPage />
        <InitialPasswordChangeDialog />
    </>
)

// 우편번호 검색 — 시안 "modal"(40006806:26429). 카드 588 · 여백 40 · 제목 24 는 Dialog 의 기본값 그대로다.
// 시안이 "내용 추후 업데이트"로 비워 둔 자리에 Kakao(다음) 우편번호 위젯이 들어온다. 그 자리를 같은
// 크기(최소 400)의 안내 면으로 표시해 두었으니, 연동할 때 이 면을 위젯 컨테이너로 바꾸면 된다.
//
// 시안 아래쪽에 겹쳐 있는 CTA 두 개(placeholder "버튼명" · 다른 모달에서 복사된 "비밀번호 확인")는
// 카드 높이(540 = 40+36+24+400+40) 밖으로 벗어나 있는 남은 요소라 옮기지 않는다. 주소를 고르면 닫히는
// 흐름이라 닫기(X)로 충분하다.
const PostcodeSearchPage = () => (
    <>
        <AuthFlowPage>
            <p className="typo-body-xl-regular text-label-foreground py-10">Kakao(다음) 우편번호 API를 사용한다.</p>
        </AuthFlowPage>
        {/* 화면 확인을 위해 모달을 열어 둔다 — 실제 화면에서는 "주소 검색" 버튼이 연다. */}
        <PostcodeSearchDialog defaultOpen />
    </>
)

const RealNameVerificationDialog = () => (
    // 화면 확인을 위해 모달을 열어 둔다.
    <Dialog defaultOpen>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>본인 인증</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'gap-6')}>
                <DialogDescription>주민등록번호를 입력해 주세요</DialogDescription>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="real-name-rrn-front" className="text-foreground font-bold">
                        주민등록번호
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input id="real-name-rrn-front" inputMode="numeric" placeholder="901231" />
                        <span aria-hidden="true" className="text-foreground">
                            -
                        </span>
                        <Input
                            id="real-name-rrn-back"
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
)

const RealNameVerificationPage = () => (
    <>
        <AuthFlowPage>
            <p className="typo-body-xl-regular text-label-foreground py-10">
                기업 회원이 회원가입 후 처음으로 기술평가 &gt; 모델 선택 &gt; 고객정보활용동의 페이지에 진입하면
                노출되는 모달입니다.
            </p>
        </AuthFlowPage>
        <RealNameVerificationDialog />
    </>
)

export {
    AuthFlowPage,
    InitialPasswordChangePage,
    LoginEndPage,
    LoginGuidePage,
    PostcodeSearchPage,
    RealNameVerificationPage,
    SessionExtensionPage,
}
