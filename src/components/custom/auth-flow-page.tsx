'use client'

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
const AuthFlowPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="content-layout min-h-full" />
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

const LogoutDialog = () => (
    // 화면 확인을 위해 로그아웃 모달을 열어 둔다.
    <Dialog defaultOpen>
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

const LogoutPage = () => (
    <>
        <AuthFlowPage />
        <LogoutDialog />
    </>
)

const InitialPasswordChangePage = () => (
    <>
        <AuthFlowPage />
        <InitialPasswordChangeDialog />
    </>
)

export {InitialPasswordChangePage, LogoutPage, SessionExtensionPage}
