'use client'

import {useRef} from 'react'
import {toast} from 'sonner'
import {Bell, CircleCheck} from 'lucide-react'
import {Button} from '@/components/ui/button'

const POSITIONS = [
    {label: '왼쪽 위', value: 'top-left'},
    {label: '가운데 위', value: 'top-center'},
    {label: '오른쪽 위', value: 'top-right'},
    {label: '왼쪽 아래', value: 'bottom-left'},
    {label: '가운데 아래', value: 'bottom-center'},
    {label: '오른쪽 아래', value: 'bottom-right'},
] as const

const ToastDemo = () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Button variant="secondary" onClick={() => toast('변경사항을 저장했습니다.')}>
            기본
        </Button>
        <Button
            variant="secondary"
            onClick={() =>
                toast.success('제출이 완료되었습니다.', {
                    description: '처리 결과는 진행현황에서 확인할 수 있습니다.',
                })
            }
        >
            성공
        </Button>
        <Button variant="secondary" onClick={() => toast.info('새로운 안내사항이 있습니다.')}>
            정보
        </Button>
        <Button variant="secondary" onClick={() => toast.warning('입력하지 않은 항목이 있습니다.')}>
            주의
        </Button>
        <Button variant="secondary" onClick={() => toast.error('저장하지 못했습니다. 다시 시도해 주세요.')}>
            오류
        </Button>
        <Button
            variant="secondary"
            onClick={() =>
                toast('임시저장 내용을 삭제했습니다.', {
                    action: {
                        label: '되돌리기',
                        onClick: () => toast.success('삭제를 취소했습니다.'),
                    },
                })
            }
        >
            액션
        </Button>
    </div>
)

const ToastPositionDemo = () => (
    <div className="grid gap-3 sm:grid-cols-3">
        {POSITIONS.map(({label, value}) => (
            <Button
                key={value}
                variant="secondary"
                onClick={() =>
                    toast(`${label}에 표시되는 토스트입니다.`, {
                        position: value,
                    })
                }
            >
                {label}
            </Button>
        ))}
    </div>
)

const ToastCompositionDemo = () => (
    <div className="grid gap-3 sm:grid-cols-2">
        <Button
            variant="secondary"
            onClick={() =>
                toast('새로운 알림이 있습니다.', {
                    icon: <Bell aria-hidden="true" className="size-icon-md" />,
                })
            }
        >
            아이콘 + 타이틀
        </Button>
        <Button variant="secondary" onClick={() => toast('변경사항을 저장했습니다.')}>
            타이틀
        </Button>
        <Button
            variant="secondary"
            onClick={() =>
                toast('제출이 완료되었습니다.', {
                    description: '처리 결과는 진행현황에서 확인할 수 있습니다.',
                })
            }
        >
            타이틀 + 서브텍스트
        </Button>
        <Button
            variant="secondary"
            onClick={() =>
                toast('제출이 완료되었습니다.', {
                    icon: <CircleCheck aria-hidden="true" className="text-success size-icon-md" />,
                    description: '처리 결과는 진행현황에서 확인할 수 있습니다.',
                })
            }
        >
            아이콘 + 타이틀 + 서브텍스트
        </Button>
    </div>
)

const ToastActionDemo = () => (
    <div className="grid gap-3 sm:grid-cols-3">
        <Button variant="secondary" onClick={() => toast('임시저장 내용을 삭제했습니다.')}>
            액션 없음
        </Button>
        <Button
            variant="secondary"
            onClick={() =>
                toast('임시저장 내용을 삭제했습니다.', {
                    action: {
                        label: '되돌리기',
                        onClick: () => toast.success('삭제를 취소했습니다.'),
                    },
                })
            }
        >
            액션 있음
        </Button>
        <Button
            variant="secondary"
            onClick={() =>
                toast('새로운 안내사항이 있습니다.', {
                    closeButton: true,
                })
            }
        >
            닫기 버튼 있음
        </Button>
    </div>
)

const ToastLifecycleDemo = () => {
    const persistentToastId = useRef<string | number | null>(null)

    const showPromiseToast = (shouldFail = false) => {
        const request = new Promise<{message: string}>((resolve, reject) => {
            window.setTimeout(() => {
                if (shouldFail) {
                    reject(new Error('데이터 요청 실패'))
                    return
                }
                resolve({message: '최신 데이터로 갱신했습니다.'})
            }, 1200)
        })

        toast.promise(request, {
            loading: '데이터를 불러오는 중입니다.',
            success: ({message}) => message,
            error: '데이터를 불러오지 못했습니다.',
        })
    }

    const showPersistentToast = () => {
        persistentToastId.current = toast('확인이 필요한 안내사항입니다.', {
            duration: Infinity,
            closeButton: true,
        })
    }

    const dismissPersistentToast = () => {
        if (persistentToastId.current === null) return
        toast.dismiss(persistentToastId.current)
        persistentToastId.current = null
    }

    const updateToast = () => {
        const id = 'toast-guide-update'

        toast.loading('변경사항을 저장하는 중입니다.', {id})
        window.setTimeout(() => toast.success('변경사항을 저장했습니다.', {id}), 1200)
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="secondary" onClick={() => showPromiseToast()}>
                비동기 성공
            </Button>
            <Button variant="secondary" onClick={() => showPromiseToast(true)}>
                비동기 실패
            </Button>
            <Button variant="secondary" onClick={showPersistentToast}>
                지속 노출
            </Button>
            <Button variant="secondary" onClick={dismissPersistentToast}>
                지속 토스트 닫기
            </Button>
            <Button variant="secondary" onClick={updateToast}>
                동일 ID 갱신
            </Button>
        </div>
    )
}

const ToastEdgeCaseDemo = () => (
    <div className="grid gap-3 sm:grid-cols-3">
        <Button
            variant="secondary"
            onClick={() =>
                toast('변경사항을 적용했습니다.', {
                    cancel: {
                        label: '취소',
                        onClick: () => toast.info('변경사항 적용을 취소했습니다.'),
                    },
                })
            }
        >
            취소 버튼
        </Button>
        <Button
            variant="secondary"
            onClick={() =>
                toast('기술평가 신청 내용을 임시저장했습니다.', {
                    description:
                        '입력한 내용은 신청을 완료하기 전까지 수정할 수 있으며, 마이페이지의 진행현황에서 다시 확인할 수 있습니다.',
                })
            }
        >
            긴 문구
        </Button>
        <Button
            variant="secondary"
            onClick={() => {
                toast.info('첫 번째 알림입니다.')
                toast.success('두 번째 알림입니다.')
                toast.warning('세 번째 알림입니다.')
            }}
        >
            연속 발생
        </Button>
    </div>
)

export default ToastDemo
export {ToastActionDemo, ToastCompositionDemo, ToastEdgeCaseDemo, ToastLifecycleDemo, ToastPositionDemo}
