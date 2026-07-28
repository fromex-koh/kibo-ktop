'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {StepNavigation} from '@/components/composite/step-navigation'
import {Button} from '@/components/ui/button'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {cn} from '@/lib/utils'

// 체크리스트 하단 CTA — '다음'을 누르면 바로 넘어가지 않고 최종 확인 모달을 띄운다.
// 시안 "[자가진단] alert"(40006513:19759): 닫기(X)는 모달만 닫고, '제출하기'가 완료 화면으로 보낸다.
// 되돌릴 수 없는 제출이라 확인 단계를 두는 것이고, 모달 안의 주 동작은 하나뿐이라 폭 전체를 채운다.
const FinalSubmitNavigation = ({prevHref, completeHref}: {prevHref: string; completeHref: string}) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <StepNavigation
                appearance="plain"
                prev={{asChild: true, children: <Link href={prevHref}>이전</Link>}}
                next={{children: '다음', onClick: () => setIsOpen(true)}}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>제출 전 최종 확인</DialogTitle>
                    </DialogHeader>
                    {/* 본문 구획 — 소제목과 본문을 한 블록(간격 16)으로 묶는다. 화면이 낮으면 여기만 스크롤된다. */}
                    <div className={cn(dialogBodyClassName, 'gap-4')}>
                        <DialogDescription>최종 제출하시겠습니까?</DialogDescription>
                        <p className="typo-body-xl-regular text-label-foreground">
                            입력한 내용을 최종 제출합니다. 제출 전 입력한 정보가 정확한지 다시 한번 확인해 주세요. 제출
                            후에는 수정이 불가합니다.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button size="2xl" onClick={() => router.push(completeHref)}>
                            제출하기
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FinalSubmitNavigation
