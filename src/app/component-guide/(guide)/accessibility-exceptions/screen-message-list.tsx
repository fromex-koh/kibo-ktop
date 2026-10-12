import {Badge} from '@/components/ui/badge'

// 화면별 검사 기록의 "오류·경고 상세" 목록 — 번호를 붙이고 맨 위에 건수를 적어, 표의 오류·경고 건수와
// 목록 줄 수를 검수자가 그대로 맞춰 볼 수 있다.
// 배색: 요약은 실색 배지(오류 빨강 · 경고 노랑), 번호는 파란 원, 검사기 원문은 오류·경고 색 띠가 붙은 상자 —
// 라이트·다크 어디서나 줄 · 종류 · 원문이 한눈에 갈린다(pastel 배경은 다크에서 모두 같은 회색이라 쓰지 않는다).

type W3cMessage = {type: string; subType?: string; message: string; lastLine?: number}

const isShownMessage = (message: W3cMessage) => message.type === 'error' || message.subType === 'warning'

// 건수 요약 — 오류 · 경고는 실색 배지로 눈에 띄게 하고, 총 건수는 옆에 옅게 적는다.
const CountSummary = ({errors, warnings, total}: {errors: number; warnings: number; total: string}) => (
    <p className="flex flex-wrap items-center gap-2">
        <Badge variant="solid" color="error" size="xs">
            오류 {errors}건
        </Badge>
        <Badge variant="solid" color={warnings ? 'warning' : 'neutral'} size="xs">
            경고 {warnings}건
        </Badge>
        <span className="typo-caption-medium text-foreground-subtle">{total}</span>
    </p>
)

const NumberMark = ({index}: {index: number}) => (
    <span className="bg-primary text-primary-foreground typo-caption-bold flex size-6 items-center justify-center rounded-full tabular-nums">
        {index + 1}
    </span>
)

// 검사기 원문 — 영문이라 lang="en" 으로 두고, 옅은 상자 안에 고정폭 글자로 보여 준다. 왼쪽 띠가 오류(빨강) · 경고(노랑)를 가른다.
const RawMessage = ({text, level}: {text: string; level: 'error' | 'warning'}) => (
    <p
        lang="en"
        className={`bg-surface-subtle typo-caption-regular text-foreground rounded-xs border-l-4 px-2 py-1.5 font-mono break-words ${level === 'error' ? 'border-destructive' : 'border-warning'}`}
    >
        {text}
    </p>
)

const LIST_CLASS = 'border-subtle-2 bg-card divide-subtle-3 flex flex-col divide-y rounded-sm border'
const ITEM_CLASS = 'grid grid-cols-[auto_1fr] gap-x-3 px-3 py-3'

type W3cMessageListProps = {
    messages: readonly W3cMessage[]
    /** 검사기 문구가 어떤 종류(원인)인지 알려 주는 이름. */
    getKindLabel: (message: string) => string
}

const W3cMessageList = ({messages, getKindLabel}: W3cMessageListProps) => {
    const items = messages.filter(isShownMessage)
    const errorCount = items.filter((message) => message.type === 'error').length

    return (
        <div className="flex flex-col gap-2">
            <CountSummary errors={errorCount} warnings={items.length - errorCount} total={`총 ${items.length}건`} />
            <ol className={LIST_CLASS}>
                {items.map((message, index) => (
                    <li key={index} className={ITEM_CLASS}>
                        <NumberMark index={index} />
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                                <span className="typo-body-m-bold text-foreground">
                                    {getKindLabel(message.message)}
                                </span>
                                {message.lastLine ? (
                                    <span className="typo-caption-regular text-foreground-subtle">
                                        HTML {message.lastLine}행
                                    </span>
                                ) : null}
                            </span>
                            <RawMessage text={message.message} level={message.type === 'error' ? 'error' : 'warning'} />
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}

type WaveMessage = {
    level: string
    message: string
    count: number
    /** 오류가 나는 조작 요소(체크박스·선택 상자 등). */
    control: string
    owner: string
    verdict: string
}

// WAVE 는 같은 종류를 한 줄로 묶어 건수를 따로 준다 — 번호는 항목 순서이고, 맨 위 합계는 건수를 더한 값이다.
const WaveMessageList = ({messages}: {messages: readonly WaveMessage[]}) => {
    const sumCount = (level: string) =>
        messages.filter((message) => message.level === level).reduce((sum, message) => sum + message.count, 0)

    return (
        <div className="flex flex-col gap-2">
            <CountSummary
                errors={sumCount('error')}
                warnings={sumCount('warning')}
                total={`항목 ${messages.length}개`}
            />
            <ol className={LIST_CLASS}>
                {messages.map((message, index) => (
                    <li key={`${message.level}-${message.control}-${message.message}`} className={ITEM_CLASS}>
                        <NumberMark index={index} />
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                                <span className="typo-body-m-bold text-foreground">{message.control}</span>
                                <span className="typo-caption-medium text-foreground-subtle">{message.count}건</span>
                            </span>
                            <RawMessage
                                text={message.message}
                                level={message.level === 'error' ? 'error' : 'warning'}
                            />
                            <dl className="text-foreground-subtle typo-caption-regular grid gap-x-2 gap-y-0.5 sm:grid-cols-[auto_1fr]">
                                <dt className="typo-caption-bold">발생 요소</dt>
                                <dd>{message.owner}</dd>
                                <dt className="typo-caption-bold">상세</dt>
                                <dd>{message.verdict}</dd>
                            </dl>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export {W3cMessageList, WaveMessageList}
