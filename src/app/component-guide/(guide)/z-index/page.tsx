import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '쌓임 순서 (Z-index)'}

// 각 z 토큰의 용도 큐레이션 — 값(순서)만으로는 의미가 안 드러나므로 어디에 쓰는지 함께 적는다.
// 키 타입이 tokens.z 라, 토큰을 추가하고 설명을 빠뜨리면 typecheck 가 실패한다(표에 빈칸으로 나가지 않게).
const Z_USAGE: Record<keyof typeof tokens.z, string> = {
    base: '기본 흐름(0). 현재 사용처 없음.',
    dropdown: '드롭다운 메뉴용으로 잡아 둔 자리. 현재 사용처 없음 — Select·DatePicker 목록은 popover 를 쓴다.',
    sticky: '스크롤해도 남는 고정 요소 — 맨 위로 버튼 · 마이페이지 사이드바 · 폼 탭.',
    header: '상단 헤더 — 서비스 헤더와 컴포넌트 가이드 상단 바.',
    'drawer-backdrop': '드로어 뒤의 반투명 막 — Sheet · 가이드 사이드바(모바일).',
    drawer: '옆에서 나오는 드로어 — Sheet · 가이드 사이드바(모바일).',
    modal: '모달 — Dialog 의 막과 내용 · 홈 공지 팝업.',
    popover: '화면 위에 뜨는 목록 — Select · DatePicker · 헤더 메뉴.',
    toast: '토스트 알림.',
    tooltip: '툴팁용으로 잡아 둔 자리. 현재 사용처 없음.',
    skiplink: '본문 바로가기 — 초점을 받으면 모든 것 위에 나온다.',
    'stack-inactive': '메인페이지 스택 페이저에서 화면 밖으로 밀린 섹션.',
    'stack-active': '메인페이지 스택 페이저에서 지금 보이는 섹션.',
}
// 표는 tokens.z 순서로 그리므로 조회는 문자열 키로 한다(위 객체가 누락 검사를 맡는다).
const Z_USAGE_BY_NAME = new Map<string, string>(Object.entries(Z_USAGE))

// 겹침 시연용 큐레이션 subset(값 오름차순). 클래스명은 리터럴로 둬야 Tailwind 가 z-* 유틸을 생성한다.
const STACK_DEMO = [
    {z: 'z-dropdown', label: '드롭다운', value: tokens.z.dropdown, pos: 'top-0 left-0'},
    {z: 'z-sticky', label: '고정 요소', value: tokens.z.sticky, pos: 'top-5 left-8'},
    {z: 'z-drawer', label: '드로어', value: tokens.z.drawer, pos: 'top-10 left-16'},
    {z: 'z-modal', label: '모달', value: tokens.z.modal, pos: 'top-15 left-24'},
    {z: 'z-toast', label: '토스트', value: tokens.z.toast, pos: 'top-20 left-32'},
]

const Z_COLUMNS = [
    {key: 'class', header: '클래스', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
    {key: 'usage', header: '용도', align: 'start', wrap: true},
] as const

// 쌓임 순서 (Z-index) — 겹치는 UI의 우선순위를 정하는 토큰. 값 자체보다 '순서'가 의미.
const ZIndexGuidePage = () => (
    <GuidePageShell title="쌓임 순서 (Z-index)" description="겹치는 UI의 우선순위를 관리하는 z-* 레이어 토큰입니다.">
        {/* 겹침 시연 — 값이 큰 카드가 위에 그려진다 */}
        <BaseCard>
            <section aria-labelledby="z-demo" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="z-demo" className="typo-h4-bold">
                        레이어 우선순위
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        화면 전체에서 겹치는 레이어(헤더 · 드로어 · 모달 등)는 용도에 맞는{' '}
                        <code className="font-mono">z-*</code> 토큰을 씁니다. 값이 큰 레이어가 위에 나옵니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        대괄호로 숫자를 직접 적는 임의 값은 쓰지 않습니다(검사에서 막힙니다). 새 레이어가 필요하면{' '}
                        <code className="font-mono">tokens.json</code>의 <code className="font-mono">z</code>에 이름을
                        추가합니다.
                    </li>
                    <li>
                        컴포넌트 안에서 요소끼리 앞뒤만 정할 때는 <code className="font-mono">z-10</code> 같은 작은
                        숫자를 씁니다. 레이어 토큰은 1000부터라 이 숫자들은 항상 그 아래에 놓입니다.
                    </li>
                </ul>
                {/* 겹침을 보이려면 positioned 요소가 필요해 데모에 한해 absolute 를 쓴다(ST-005 예외). */}
                <div className="border-border bg-background relative h-52 overflow-hidden rounded-xl border">
                    {STACK_DEMO.map((card) => (
                        <div
                            key={card.z}
                            className={`${card.z} ${card.pos} border-border bg-card shadow-1 absolute flex w-36 flex-col gap-1 rounded-lg border p-3`}
                        >
                            <span className="typo-body-l-medium">{card.label}</span>
                            <span className="typo-body-l-regular text-muted-foreground font-mono">
                                {card.z} · {card.value}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        {/* 전체 토큰 레퍼런스 */}
        <BaseCard>
            <section aria-labelledby="z-tokens" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="z-tokens" className="typo-h4-bold">
                        토큰 목록
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값은 <code className="font-mono">tokens.json</code>의 <code className="font-mono">z</code>에서
                        관리합니다.
                    </p>
                </div>
                <Table
                    caption="z-* 레이어 토큰의 값과 용도"
                    columns={Z_COLUMNS}
                    rows={Object.entries(tokens.z).map(([name, value]) => ({
                        key: name,
                        cells: [
                            <CopyChip key="class" value={`z-${name}`} />,
                            <span key="value" className="font-mono">
                                {value}
                            </span>,
                            Z_USAGE_BY_NAME.get(name) ?? '—',
                        ],
                    }))}
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ZIndexGuidePage
