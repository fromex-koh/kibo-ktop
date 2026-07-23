import type {Metadata} from 'next'
import {
    ChevronRight,
    CircleAlert,
    CircleCheck,
    Download,
    Info,
    LoaderCircle,
    Lock,
    Search,
    TriangleAlert,
    X,
} from 'lucide-react'
import {Icon} from '@/components/custom/icon'
import {ListMarker} from '@/components/custom/list-marker'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {Combobox} from '@/components/composite/combobox'
import {Switch} from '@/components/composite/control-switch'
import {DatePicker} from '@/components/composite/date-picker'
import {SearchBar} from '@/components/composite/search-bar'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {TextareaCounter} from '@/components/composite/textarea-counter'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {cn} from '@/lib/utils'

export const metadata: Metadata = {title: '명도 대비 검사'}

const BADGE_COLORS = [
    'info',
    'success',
    'warning',
    'error',
    'neutral',
    'navy',
    'secondary-green',
    'secondary-orange',
    'secondary-grape',
] as const

const BUTTON_VARIANTS = ['default', 'secondary', 'tertiary', 'outline', 'ghost', 'destructive', 'text', 'link'] as const

const BUTTON_SIZES = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const
const INLINE_BUTTON_SIZES = ['xl', 'lg', 'md', 'sm'] as const
const ICON_BUTTON_VARIANTS = ['default', 'secondary', 'tertiary', 'ghost'] as const
const ICON_BUTTON_SIZES = ['icon-2xl', 'icon-xl', 'icon-lg', 'icon', 'icon-sm', 'icon-xs'] as const
const ICON_SIZES = [
    {key: 'icon-xs', className: 'size-icon-xs'},
    {key: 'icon-sm', className: 'size-icon-sm'},
    {key: 'icon-md', className: 'size-icon-md'},
    {key: 'icon-lg', className: 'size-icon-lg'},
    {key: 'icon-xl', className: 'size-icon-xl'},
    {key: 'icon-2xl', className: 'size-icon-2xl'},
] as const

const INPUT_FIELD_CLASS = 'max-w-90 flex w-full flex-col gap-2'
const COMBOBOX_OPTIONS = [
    {value: 'corp', label: '주식회사'},
    {value: 'llc', label: '유한회사'},
    {value: 'lp', label: '합자회사'},
]
const SAMPLE_DATE = new Date(2026, 6, 13)
const ALERT_VARIANTS = [
    {
        variant: 'info',
        Icon: Info,
        message: '기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.',
    },
    {variant: 'success', Icon: CircleCheck, message: '제출이 정상적으로 완료되었습니다.'},
    {
        variant: 'warning',
        Icon: TriangleAlert,
        message: '입력한 정보가 저장되지 않았습니다. 저장 후 다음 단계로 이동하세요.',
    },
    {variant: 'error', Icon: CircleAlert, message: '사업자번호 형식이 올바르지 않습니다. 다시 확인해 주세요.'},
] as const

const FruitOptions = () => (
    <>
        <SelectItem value="apple">사과</SelectItem>
        <SelectItem value="banana">바나나</SelectItem>
        <SelectItem value="cherry">체리</SelectItem>
    </>
)

const ContrastCheckPage = () => (
    <div className="max-w-content mx-auto flex w-full flex-col gap-10 px-6 py-12 md:py-16">
        <header className="flex flex-col gap-2">
            <h1 className="typo-display-m-bold text-foreground">웹 접근성 명도 대비 검사</h1>
            <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-1">
                <li className="flex items-start gap-1.5">
                    <ListMarker type="unordered" level={1} />
                    <span>
                        WCAG AA 기준은 일반 텍스트 4.5:1 이상, 24px 이상 또는 18.66px 굵은 텍스트 3:1 이상이며, 사용자
                        인터페이스와 의미 있는 그래픽은 인접 색상과 3:1 이상이어야 합니다.
                    </span>
                </li>
                <li className="flex items-start gap-1.5">
                    <ListMarker type="unordered" level={1} />
                    <span>
                        비선택 상태나 placeholder처럼 사용자가 조작할 수 있거나 입력에 필요한 요소는 4.5:1 이상의 명도
                        대비를 충족해야 합니다.
                    </span>
                </li>
            </ul>
        </header>

        <section className="flex flex-wrap items-center gap-4" aria-label="배지 명도 대비 검수 목록">
            {(['solid-pastel', 'outline', 'solid'] as const).flatMap((variant) =>
                BADGE_COLORS.map((color) => (
                    <Badge key={`${variant}-${color}`} variant={variant} color={color}>
                        상태
                    </Badge>
                )),
            )}
            <Badge type="number" color="primary">
                2
            </Badge>
            <Badge type="number" color="new">
                5
            </Badge>
        </section>

        <section className="flex flex-wrap items-center gap-4" aria-label="아이콘 명도 대비 검수 목록">
            {ICON_SIZES.flatMap((size) => [
                <Icon key={`${size.key}-outline`} icon={X} className={`${size.className} text-foreground`} />,
                <Icon key={`${size.key}-solid`} icon={X} variant="solid" className={size.className} />,
            ])}
        </section>

        <section className="flex flex-col gap-6" aria-label="버튼 명도 대비 검수 목록">
            <div className="flex flex-wrap items-center gap-4">
                {BUTTON_VARIANTS.map((variant) => (
                    <Button key={variant} variant={variant} size="lg">
                        {variant}
                    </Button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {BUTTON_VARIANTS.map((variant) => (
                    <Button key={`${variant}-left-icon`} variant={variant} size="lg">
                        <Download aria-hidden="true" />
                        {variant}
                    </Button>
                ))}
                {BUTTON_VARIANTS.map((variant) => (
                    <Button key={`${variant}-right-icon`} variant={variant} size="lg">
                        {variant}
                        <ChevronRight aria-hidden="true" />
                    </Button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {BUTTON_SIZES.flatMap((size) =>
                    (['default', 'secondary', 'tertiary'] as const).map((variant) => (
                        <Button key={`${variant}-${size}`} variant={variant} size={size}>
                            {variant}
                        </Button>
                    )),
                )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {(['text', 'link'] as const).flatMap((variant) =>
                    INLINE_BUTTON_SIZES.map((size) => (
                        <Button key={`${variant}-${size}`} variant={variant} size={size}>
                            <Download aria-hidden="true" />
                            {variant}
                        </Button>
                    )),
                )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {ICON_BUTTON_VARIANTS.flatMap((variant) =>
                    ICON_BUTTON_SIZES.map((size) => (
                        <Button
                            key={`${variant}-${size}`}
                            variant={variant}
                            size={size}
                            aria-label={`${variant} ${size} 아이콘 버튼`}
                        >
                            <Search aria-hidden="true" />
                        </Button>
                    )),
                )}
                {ICON_BUTTON_VARIANTS.map((variant) => (
                    <Button
                        key={`${variant}-round-icon`}
                        variant={variant}
                        size="icon"
                        className="rounded-full"
                        aria-label={`${variant} 원형 아이콘 버튼`}
                    >
                        <Search aria-hidden="true" />
                    </Button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <Button variant="default" size="lg" aria-busy="true" className="pointer-events-none">
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                    처리 중
                </Button>
            </div>
        </section>

        <section
            className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2"
            aria-label="인풋 명도 대비 검수 목록"
        >
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-input-default" className="text-foreground font-bold">
                    기본 (default)
                </FieldLabel>
                <Input id="contrast-input-default" placeholder="내용을 입력하세요" />
            </Field>
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-input-completed" className="text-foreground font-bold">
                    값 입력됨 (completed)
                </FieldLabel>
                <Input id="contrast-input-completed" defaultValue="홍길동" />
            </Field>
            <Field data-invalid className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-input-error" className="text-foreground font-bold">
                    오류 (error)
                </FieldLabel>
                <Input
                    id="contrast-input-error"
                    placeholder="내용을 입력하세요"
                    aria-invalid="true"
                    aria-describedby="contrast-input-error-message"
                />
                <FieldError id="contrast-input-error-message">에러메시지가 노출됩니다.</FieldError>
            </Field>
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-input-view" className="text-foreground font-bold">
                    읽기전용 (view)
                </FieldLabel>
                <Input id="contrast-input-view" defaultValue="수정 불가한 값" readOnly />
            </Field>
        </section>

        <section
            className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2"
            aria-label="애드온 인풋 명도 대비 검수 목록"
        >
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-addon-default" className="text-foreground font-bold">
                    기본 (default)
                </FieldLabel>
                <InputGroup>
                    <InputGroupInput id="contrast-addon-default" placeholder="내용을 입력하세요" />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        <Lock aria-hidden="true" className="size-5" />
                    </InputGroupAddon>
                </InputGroup>
            </Field>
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-addon-completed" className="text-foreground font-bold">
                    값 입력됨 (completed)
                </FieldLabel>
                <InputGroup>
                    <InputGroupInput id="contrast-addon-completed" defaultValue="11222-1234567" />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        <Lock aria-hidden="true" className="size-5" />
                    </InputGroupAddon>
                </InputGroup>
            </Field>
            <Field data-invalid className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-addon-error" className="text-foreground font-bold">
                    오류 (error)
                </FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="contrast-addon-error"
                        placeholder="내용을 입력하세요"
                        aria-invalid="true"
                        aria-describedby="contrast-addon-error-message"
                    />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        <Lock aria-hidden="true" className="size-5" />
                    </InputGroupAddon>
                </InputGroup>
                <FieldError id="contrast-addon-error-message">에러메시지가 노출됩니다.</FieldError>
            </Field>
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-addon-view" className="text-foreground font-bold">
                    읽기전용 (view)
                </FieldLabel>
                <InputGroup>
                    <InputGroupInput id="contrast-addon-view" defaultValue="수정 불가한 값" readOnly />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        <Lock aria-hidden="true" className="size-5" />
                    </InputGroupAddon>
                </InputGroup>
            </Field>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="셀렉트 명도 대비 검수 목록">
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-select-default" className="text-foreground font-bold">
                    기본 (default)
                </FieldLabel>
                <Select>
                    <SelectTrigger id="contrast-select-default" className="w-full">
                        <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <FruitOptions />
                    </SelectContent>
                </Select>
            </Field>
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-select-completed" className="text-foreground font-bold">
                    값 선택됨 (completed)
                </FieldLabel>
                <Select defaultValue="apple">
                    <SelectTrigger id="contrast-select-completed" className="w-full">
                        <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <FruitOptions />
                    </SelectContent>
                </Select>
            </Field>
            <Field data-invalid className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-select-error" className="text-foreground font-bold">
                    오류 (error)
                </FieldLabel>
                <Select>
                    <SelectTrigger
                        id="contrast-select-error"
                        aria-invalid="true"
                        aria-describedby="contrast-select-error-message"
                        className="w-full"
                    >
                        <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <FruitOptions />
                    </SelectContent>
                </Select>
                <FieldError id="contrast-select-error-message">필수 항목입니다.</FieldError>
            </Field>
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-select-readonly" className="text-foreground font-bold">
                    읽기전용 (readOnly)
                </FieldLabel>
                <Select defaultValue="apple" readOnly>
                    <SelectTrigger id="contrast-select-readonly" className="w-full">
                        <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <FruitOptions />
                    </SelectContent>
                </Select>
            </Field>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2" aria-label="콤보박스 명도 대비 검수 목록">
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-combobox-default" className="text-foreground font-bold">
                    기본 (placeholder)
                </FieldLabel>
                <Combobox id="contrast-combobox-default" options={COMBOBOX_OPTIONS} value="" placeholder="선택하세요" />
            </Field>
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-combobox-completed" className="text-foreground font-bold">
                    값 선택됨
                </FieldLabel>
                <Combobox id="contrast-combobox-completed" options={COMBOBOX_OPTIONS} value="corp" />
            </Field>
            <Field data-invalid className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-combobox-error" className="text-foreground font-bold">
                    오류 (error)
                </FieldLabel>
                <Combobox
                    id="contrast-combobox-error"
                    options={COMBOBOX_OPTIONS}
                    value=""
                    placeholder="선택하세요"
                    aria-invalid="true"
                    aria-describedby="contrast-combobox-error-message"
                />
                <FieldError id="contrast-combobox-error-message">필수 항목입니다.</FieldError>
            </Field>
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-combobox-readonly" className="text-foreground font-bold">
                    읽기전용 (readOnly)
                </FieldLabel>
                <Combobox id="contrast-combobox-readonly" options={COMBOBOX_OPTIONS} value="corp" readOnly />
            </Field>
        </section>

        <section
            className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2"
            aria-label="날짜 선택 명도 대비 검수 목록"
        >
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-date-default" className="text-foreground font-bold">
                    기본 (placeholder)
                </FieldLabel>
                <DatePicker id="contrast-date-default" />
            </Field>
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-date-completed" className="text-foreground font-bold">
                    값 입력됨
                </FieldLabel>
                <DatePicker id="contrast-date-completed" value={SAMPLE_DATE} />
            </Field>
            <Field data-invalid className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-date-error" className="text-foreground font-bold">
                    오류 (error)
                </FieldLabel>
                <DatePicker id="contrast-date-error" aria-invalid aria-describedby="contrast-date-error-message" />
                <FieldError id="contrast-date-error-message">날짜를 선택해 주세요.</FieldError>
            </Field>
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-date-readonly" className="text-foreground font-bold">
                    읽기전용 (readOnly)
                </FieldLabel>
                <DatePicker id="contrast-date-readonly" value={SAMPLE_DATE} readOnly />
            </Field>
        </section>

        <section
            className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2"
            aria-label="텍스트 영역 명도 대비 검수 목록"
        >
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-textarea-default" className="text-foreground font-bold">
                    기본 (default)
                </FieldLabel>
                <TextareaCounter id="contrast-textarea-default" maxLength={100} placeholder="내용을 입력하세요" />
            </Field>
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-textarea-completed" className="text-foreground font-bold">
                    값 입력됨 (completed)
                </FieldLabel>
                <TextareaCounter id="contrast-textarea-completed" maxLength={100} defaultValue="입력된 내용입니다." />
            </Field>
            <Field data-invalid className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-textarea-error" className="text-foreground font-bold">
                    오류 (error)
                </FieldLabel>
                <TextareaCounter
                    id="contrast-textarea-error"
                    maxLength={100}
                    placeholder="내용을 입력하세요"
                    aria-invalid
                    aria-describedby="contrast-textarea-error-message"
                    footer={<FieldError id="contrast-textarea-error-message">필수 항목입니다.</FieldError>}
                />
            </Field>
            <Field className={cn(INPUT_FIELD_CLASS, FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="contrast-textarea-readonly" className="text-foreground font-bold">
                    읽기전용 (readOnly)
                </FieldLabel>
                <TextareaCounter
                    id="contrast-textarea-readonly"
                    maxLength={100}
                    defaultValue="수정 불가한 내용입니다."
                    readOnly
                />
            </Field>
        </section>

        <section className="flex flex-wrap items-center gap-8" aria-label="체크박스 명도 대비 검수 목록">
            {([false, true, 'indeterminate'] as const).map((checked) => {
                const state = checked === 'indeterminate' ? 'indeterminate' : checked ? 'on' : 'off'
                const id = `contrast-checkbox-${state}`
                return (
                    <Field key={id} orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                        <Checkbox id={id} defaultChecked={checked} aria-labelledby={`${id}-label`} />
                        <FieldLabel id={`${id}-label`} htmlFor={id}>
                            {state}
                        </FieldLabel>
                    </Field>
                )
            })}
        </section>

        <section className="flex flex-wrap items-center gap-8" aria-label="라디오 명도 대비 검수 목록">
            {([false, true] as const).map((checked) => {
                const state = checked ? 'on' : 'off'
                const id = `contrast-radio-${state}`
                return (
                    <RadioGroup key={id} defaultValue={checked ? 'on' : 'off'} className="w-auto">
                        <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                            <RadioGroupItem value="on" id={id} aria-labelledby={`${id}-label`} />
                            <FieldLabel id={`${id}-label`} htmlFor={id}>
                                {state}
                            </FieldLabel>
                        </Field>
                    </RadioGroup>
                )
            })}
        </section>

        <section className="flex flex-wrap items-center gap-8" aria-label="스위치 명도 대비 검수 목록">
            {([false, true] as const).map((checked) => {
                const state = checked ? 'on' : 'off'
                const id = `contrast-switch-${state}`
                return (
                    <Field key={id} orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                        <Switch id={id} size="lg" defaultChecked={checked} aria-labelledby={`${id}-label`} />
                        <FieldLabel id={`${id}-label`} htmlFor={id}>
                            {state}
                        </FieldLabel>
                    </Field>
                )
            })}
        </section>

        <section className="flex flex-col gap-6" aria-label="칩 명도 대비 검수 목록">
            <div className="flex flex-wrap items-center gap-6">
                <ChipRadioGroup name="contrast-chip-radio-lg" defaultValue="selected" aria-label="lg 라디오 칩">
                    <ChipRadio size="lg" value="selected">
                        선택
                    </ChipRadio>
                    <ChipRadio size="lg" value="default">
                        미선택
                    </ChipRadio>
                </ChipRadioGroup>
                <ChipCheckboxGroup aria-label="lg 체크박스 칩">
                    <ChipCheckbox size="lg" value="selected" defaultChecked>
                        선택
                    </ChipCheckbox>
                    <ChipCheckbox size="lg" value="default">
                        미선택
                    </ChipCheckbox>
                </ChipCheckboxGroup>
            </div>

            <div className="flex flex-wrap items-center gap-6">
                <ChipRadioGroup name="contrast-chip-radio-md" defaultValue="selected" aria-label="md 라디오 칩">
                    <ChipRadio size="md" value="selected">
                        선택
                    </ChipRadio>
                    <ChipRadio size="md" value="default">
                        미선택
                    </ChipRadio>
                </ChipRadioGroup>
                <ChipCheckboxGroup aria-label="md 체크박스 칩">
                    <ChipCheckbox size="md" value="selected" defaultChecked>
                        선택
                    </ChipCheckbox>
                    <ChipCheckbox size="md" value="default">
                        미선택
                    </ChipCheckbox>
                </ChipCheckboxGroup>
            </div>
        </section>

        <section className="flex flex-wrap items-center gap-6" aria-label="세그먼티드 컨트롤 명도 대비 검수 목록">
            <SegmentedControl type="link" aria-label="화면 유형">
                <SegmentedControlItem href="/component-guide/contrast-check?userType=corp" aria-current="page">
                    기업
                </SegmentedControlItem>
                <SegmentedControlItem href="/component-guide/contrast-check?userType=org">기관</SegmentedControlItem>
            </SegmentedControl>
        </section>

        <section className="grid grid-cols-1 gap-6" aria-label="검색 바 명도 대비 검수 목록">
            <SearchBar label="기본 검색" placeholder="검색어를 입력하세요" />
        </section>

        <section className="flex flex-col gap-3" aria-label="알림 명도 대비 검수 목록">
            {ALERT_VARIANTS.map(({variant, Icon: AlertIcon, message}) => (
                <Alert key={variant} variant={variant}>
                    <AlertIcon aria-hidden="true" />
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            ))}
        </section>
    </div>
)

export default ContrastCheckPage
