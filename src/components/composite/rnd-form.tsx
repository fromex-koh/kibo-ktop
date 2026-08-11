'use client'

import {Plus} from 'lucide-react'
import {FormCard} from '@/components/composite/form-card'
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {Button} from '@/components/ui/button'
import {
    ClearableInput,
    FormCardScope,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useFormValues,
} from '@/components/composite/form-values'
import {Field, FieldGrid, FieldRow3} from '@/components/composite/form-fields'

// 기술 개발 실적 탭 본문 — Figma "기술 개발 실적" 탭 컨텐츠(1200×982) 전체.
// 자가진단 입력 화면과 FormTabs 컴포넌트 가이드가 같은 것을 보도록 여기 한 벌만 둔다.
//
// 카드 안의 칸은 카드 단위로 필수다 — 전부 비우거나 전부 채우거나 둘 중 하나다(FormCardScope 참고).
// 시안에는 `*` 레이어가 꺼져 있었지만 필수 처리는 업무 규칙으로 확정된 것이다(카드 안내 문구의 불릿은
// 시안대로 두지 않는다).
// 구분 — 기존 시스템의 셀렉트 옵션 그대로다(자체개발·공동개발·위탁개발).
const RND_CATEGORIES = [
    {value: 'inHouse', label: '자체개발'},
    {value: 'joint', label: '공동개발'},
    {value: 'outsourced', label: '위탁개발'},
] as const

// 여부 셀렉트 세 개(시제품제작·매출발생·지식재산권)가 같은 선택지를 쓴다.
// 문구는 대표자 경력사항의 "동업종 여부" 와 같은 예·아니오다.
const YES_NO_OPTIONS = [
    {value: 'yes', label: '예'},
    {value: 'no', label: '아니오'},
] as const

const rndField = (id: number, name: string) => `rnd-${id}-${name}`

type RndEntryProps = {
    id: number
    label: string
    /** "행추가" 로 늘린 카드인지 — 그 카드는 비어 있어도 처음부터 모두 필수다. */
    isAdded: boolean
    focusOnMount?: boolean
    /** 마지막 한 장 — 지우면 카드가 사라지는 대신 값만 비워진다. */
    isLastCard?: boolean
    onDelete: () => void
    cardRef: (node: HTMLDivElement | null) => void
}

// 같은 모양의 셀렉트가 카드마다 네 번 나온다.
const SelectField = ({
    id,
    label,
    options,
}: {
    id: string
    label: string
    options: readonly {value: string; label: string}[]
}) => (
    <Field id={id} label={label} required>
        <Select name={id} required>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </Field>
)

const RndEntry = ({id, label, isAdded, focusOnMount, isLastCard, onDelete, cardRef}: RndEntryProps) => {
    const field = (name: string) => rndField(id, name)

    return (
        <RepeatCard
            ref={cardRef}
            title={label}
            // 이 탭은 폼 카드 제목(h2) 아래에 카드가 바로 온다 — 소제목이 없으므로 카드 제목이 h3 다.
            headingLevel={3}
            focusOnMount={focusOnMount}
            clearOnly={isLastCard}
            onDelete={onDelete}
        >
            <FormCardScope namePrefix={`rnd-${id}-`} alwaysRequired={isAdded}>
                <FieldRow3>
                    <SelectField id={field('category')} label="구분" options={RND_CATEGORIES} />
                    <SelectField id={field('prototype')} label="시제품제작 여부" options={YES_NO_OPTIONS} />
                    <SelectField id={field('sales')} label="매출발생 여부" options={YES_NO_OPTIONS} />
                </FieldRow3>
                <FieldGrid>
                    <SelectField id={field('ip')} label="지식재산권 여부" options={YES_NO_OPTIONS} />
                    <Field id={field('techName')} label="기술명" required>
                        <ClearableInput
                            id={field('techName')}
                            name={field('techName')}
                            required
                            autoComplete="off"
                            placeholder="기술명"
                        />
                    </Field>
                </FieldGrid>
            </FormCardScope>
        </RepeatCard>
    )
}

const RndForm = () => {
    const {clearValues} = useFormValues()
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard} = useRepeatCards({
        // 지운 칸의 값도 함께 버린다 — 남겨두면 제출 데이터에 유령 값이 섞인다.
        onRemove: (id) => clearValues(`rnd-${id}-`),
    })

    return (
        <FormCard title="기술 개발 실적" subtitle="시제품 제작이 완료된 경우만 인정">
            <div className="flex flex-col gap-6">
                {ids.map((id, index) => (
                    <RndEntry
                        key={id}
                        id={id}
                        cardRef={setCardRef(id)}
                        label={`순번${index + 1}`}
                        isAdded={index > 0}
                        focusOnMount={id === addedId}
                        isLastCard={isLastCard}
                        onDelete={() => removeCard(id)}
                    />
                ))}
                {/* 행추가 — 시안은 카드 폭 전체를 채우는 primary 버튼이다. */}
                <Button type="button" ref={addButtonRef} size="sm" className="w-full" onClick={addCard}>
                    행추가
                    <Plus aria-hidden="true" />
                </Button>
            </div>
        </FormCard>
    )
}

export default RndForm
