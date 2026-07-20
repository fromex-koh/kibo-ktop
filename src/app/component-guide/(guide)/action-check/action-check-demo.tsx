'use client'

import {useState} from 'react'
import {ActionCheck} from '@/components/custom/action-check'
import {Button} from '@/components/ui/button'

// 가이드 전용 재생 데모 — key를 바꿔 실제 화면 진입처럼 ActionCheck를 다시 마운트한다.
const ActionCheckDemo = () => {
    const [playKey, setPlayKey] = useState(0)

    return (
        <div className="flex flex-col items-center gap-4">
            <ActionCheck key={playKey} aria-label="제출이 완료되었습니다" />
            <Button type="button" variant="outline" onClick={() => setPlayKey((current) => current + 1)}>
                애니메이션 다시 보기
            </Button>
        </div>
    )
}

export default ActionCheckDemo
