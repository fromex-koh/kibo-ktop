'use client'

import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
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

type SelfDiagnosisInputHeaderProps = {
    overlay?: boolean
    showThemeToggle?: boolean
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
}

const EXIT_PATH = '/component-guide/self-diagnosis/evaluation-model'
const EXIT_TRIGGER_SELECTOR = '[data-header-menu-trigger], nav a[href]'

/**
 * 자가진단 입력 데모에서만 Header 메뉴 버튼을 작성 종료 확인 동작으로 바꾼다.
 * 공통 Header의 전체 메뉴 동작과 API에는 영향을 주지 않는다.
 */
const SelfDiagnosisInputHeader = (props: SelfDiagnosisInputHeaderProps) => {
    const router = useRouter()
    const headerScopeRef = useRef<HTMLDivElement>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        const headerScope = headerScopeRef.current
        if (!headerScope) return

        const syncMenuTriggerLabel = () => {
            const menuTrigger = headerScope.querySelector<HTMLButtonElement>('[data-header-menu-trigger]')
            if (!menuTrigger) return

            menuTrigger.setAttribute('aria-label', '작성 종료')
            menuTrigger.setAttribute('title', '작성 종료')
        }

        const handleHeaderNavigation = (event: Event) => {
            if (!(event.target instanceof Element) || !event.target.closest(EXIT_TRIGGER_SELECTOR)) return

            event.preventDefault()
            event.stopPropagation()
            setDialogOpen(true)
        }

        // Header 내부 콘텐츠는 Suspense 뒤에 렌더될 수 있어 라벨은 DOM 변경 시에도 동기화한다.
        const contentObserver = new MutationObserver(syncMenuTriggerLabel)
        contentObserver.observe(headerScope, {childList: true, subtree: true})
        syncMenuTriggerLabel()

        // Radix Sheet 트리거보다 앞선 캡처 단계에서 입력 데모 전용 종료 확인 동작으로 전환한다.
        headerScope.addEventListener('click', handleHeaderNavigation, true)

        return () => {
            contentObserver.disconnect()
            headerScope.removeEventListener('click', handleHeaderNavigation, true)
        }
    }, [])

    return (
        <>
            <div ref={headerScopeRef}>
                <Header {...props} />
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>작성 종료</DialogTitle>
                    </DialogHeader>
                    <div className={cn(dialogBodyClassName, 'gap-4')}>
                        <DialogDescription>입력 화면을 나가시겠습니까?</DialogDescription>
                        <p className="typo-body-xl-regular text-label-foreground">
                            현재까지 작성한 내용은 자동으로 저장되었습니다. 입력 화면을 나가도 나중에 이어서 작성할 수
                            있습니다.
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="tertiary" size="2xl">
                                계속 작성
                            </Button>
                        </DialogClose>
                        <Button size="2xl" onClick={() => router.push(EXIT_PATH)}>
                            저장 후 나가기
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SelfDiagnosisInputHeader
