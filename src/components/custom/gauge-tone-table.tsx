// [퍼블리싱 가이드 전용] 원호 게이지 색 단계표 — 단계별 시작 색 · 끝 색 토큰과 색 칩, 시작 → 끝 그라데이션 띠를 보인다.
// 점수 게이지 · 등급 원호 게이지 가이드가 같이 쓴다. 색 칩과 띠는 토큰을 나열하는 가이드라 CSS 변수를 직접 쓴다([PB-12]).

import {Table} from '@/components/custom/table'

type GaugeToneCase = {
    /** 첫 열(예: 우수 · CR-1). */
    label: string
    /** 둘째 열(예: 점수 구간 · 등급명). */
    detail: string
    /** tokens.json 의 gauge-<name>-from/-to 에서 <name>(excellent · good · normal · poor · low · weak). */
    name: string
}

const ColorCell = ({token}: {token: string}) => (
    <span className="inline-flex items-center gap-2">
        <span
            aria-hidden="true"
            className="border-subtle-3 size-4 shrink-0 rounded-xs border"
            style={{backgroundColor: `var(--ds-${token})`}}
        />
        <code>{token}</code>
    </span>
)

const GradientCell = ({name}: {name: string}) => (
    <span
        aria-hidden="true"
        className="block h-4 w-full min-w-32 rounded-full"
        style={{backgroundImage: `linear-gradient(to right, var(--ds-gauge-${name}-from), var(--ds-gauge-${name}-to))`}}
    />
)

const GaugeToneTable = ({
    caption,
    labelHeader,
    detailHeader,
    cases,
}: {
    caption: string
    labelHeader: string
    detailHeader: string
    cases: readonly GaugeToneCase[]
}) => (
    <Table
        caption={caption}
        size="md"
        columns={[
            {key: 'label', header: labelHeader, align: 'start', rowHeader: true},
            {key: 'detail', header: detailHeader, align: 'start'},
            {key: 'from', header: '시작 색(토큰)', align: 'start'},
            {key: 'to', header: '끝 색(토큰)', align: 'start'},
            {key: 'preview', header: '미리보기(시작 → 끝)', align: 'start'},
        ]}
        rows={cases.map((item) => ({
            key: item.label,
            cells: [
                item.label,
                item.detail,
                <ColorCell key="from" token={`gauge-${item.name}-from`} />,
                <ColorCell key="to" token={`gauge-${item.name}-to`} />,
                <GradientCell key="preview" name={item.name} />,
            ],
        }))}
    />
)

export {GaugeToneTable}
export type {GaugeToneCase}
