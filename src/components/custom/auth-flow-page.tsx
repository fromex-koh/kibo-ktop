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

export {LogoutPage, SessionExtensionPage}
