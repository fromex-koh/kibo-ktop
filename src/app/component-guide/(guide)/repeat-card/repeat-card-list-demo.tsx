'use client'

import {Plus} from 'lucide-react'
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

// 반복 카드 목록 예시 — 추가·삭제·최소 개수·포커스 이동을 실제로 확인할 수 있는 데모.
// 목록 상태는 useRepeatCards 가 들고 있는다(카드 하나의 생김새와 접기만 RepeatCard 몫).
const RepeatCardListDemo = () => {
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isDeleteDisabled} = useRepeatCards()

    return (
        <div className="bg-card border-subtle-3 flex flex-col gap-6 rounded-md border p-6">
            {ids.map((id, index) => (
                <RepeatCard
                    key={id}
                    ref={setCardRef(id)}
                    title={`경력${index + 1}`}
                    // 가이드는 h2 섹션 바로 아래에 카드를 두므로 카드 제목이 h3 다[6.4.2].
                    headingLevel={3}
                    focusOnMount={id === addedId}
                    deleteDisabled={isDeleteDisabled}
                    onDelete={() => removeCard(id)}
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor={`demo-company-${id}`} className="text-foreground font-bold">
                                근무처
                            </Label>
                            <Input id={`demo-company-${id}`} name={`demo-company-${id}`} placeholder="근무처" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor={`demo-rank-${id}`} className="text-foreground font-bold">
                                최종직급
                            </Label>
                            <Input id={`demo-rank-${id}`} name={`demo-rank-${id}`} placeholder="최종직급" />
                        </div>
                    </div>
                </RepeatCard>
            ))}
            <Button ref={addButtonRef} size="sm" className="w-full" onClick={addCard}>
                행추가
                <Plus aria-hidden="true" />
            </Button>
        </div>
    )
}

export default RepeatCardListDemo
