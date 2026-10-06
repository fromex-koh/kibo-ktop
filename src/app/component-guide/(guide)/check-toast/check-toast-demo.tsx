'use client'

import {showCheckToast} from '@/components/custom/check-toast'
import {Button} from '@/components/ui/button'

// 가이드 전용 데모 — 버튼을 누르면 확인 토스트를 띄운다. 같은 id 라 연타해도 쌓이지 않는다.
const CheckToastDemo = () => (
    <Button type="button" variant="outline" onClick={() => showCheckToast('저장되었습니다.', {id: 'check-toast-demo'})}>
        확인 토스트 띄우기
    </Button>
)

export default CheckToastDemo
