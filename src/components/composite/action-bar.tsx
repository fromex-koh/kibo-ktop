import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 액션 버튼을 왼쪽·가운데·오른쪽 영역으로 배치하는 공통 레이아웃.
// 양쪽을 동일한 1fr로 두어 가운데 영역을 항상 컨테이너 중앙에 정렬한다.
const ActionBar = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar"
        className={cn('grid w-full grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-4', className)}
        {...props}
    />
)

// 왼쪽 액션 영역. 예: 목록, 이전.
const ActionBarStart = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar-start"
        className={cn('col-start-1 flex items-center justify-start gap-2', className)}
        {...props}
    />
)

// 가운데 액션 영역. 양쪽 영역 유무와 관계없이 컨테이너 중앙에 배치한다.
const ActionBarCenter = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar-center"
        className={cn('col-start-2 flex items-center justify-center gap-2', className)}
        {...props}
    />
)

// 오른쪽 액션 영역. 예: 수정, 저장, 다음.
const ActionBarEnd = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="action-bar-end"
        className={cn('col-start-3 flex items-center justify-end gap-2', className)}
        {...props}
    />
)

export {ActionBar, ActionBarStart, ActionBarCenter, ActionBarEnd}
