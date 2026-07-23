import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

export const metadata: Metadata = {title: '쌓임 순서 (Z-index)'}

// 각 z 토큰의 용도 큐레이션 — 값(순서)만으로는 의미가 안 드러나므로 어디에 쓰는지 함께 적는다.
const Z_USAGE: Record<string, string> = {
    base: '기본 흐름 — 별도 레이어 없음(0).',
    dropdown: '드롭다운·셀렉트 메뉴.',
    sticky: '일반 고정 요소 — 툴바·섹션 헤더 등.',
    header: '프로젝트 상단 헤더(sticky 상단 바).',
    'drawer-backdrop': '드로어·모달 뒤 반투명 배경(백드롭).',
    drawer: '오프캔버스 사이드 드로어.',
    modal: '모달 다이얼로그.',
    popover: '팝오버 등 부유 콘텐츠.',
    toast: '토스트·스낵바 알림.',
    tooltip: '툴팁 — 거의 최상위.',
    skiplink: '스킵 링크 — 포커스 시 모든 것 위.',
}

// 겹침 시연용 큐레이션 subset(값 오름차순). 클래스명은 리터럴로 둬야 Tailwind 가 z-* 유틸을 생성한다.
const STACK_DEMO = [
    {z: 'z-dropdown', label: '드롭다운', value: tokens.z.dropdown, pos: 'top-0 left-0'},
    {z: 'z-sticky', label: '헤더(sticky)', value: tokens.z.sticky, pos: 'top-5 left-8'},
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
    <GuidePageShell
        title="쌓임 순서 (Z-index)"
        description={
            <>
                겹치는 UI의 <strong>쌓임 순서</strong>를 일관되게 관리하는 {Object.keys(tokens.z).length}개 토큰입니다.
            </>
        }
    >
        {/* 겹침 시연 — 값이 큰 카드가 위에 그려진다 */}
        <BaseCard>
            <section aria-labelledby="z-demo" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="z-demo" className="typo-h4-bold">
                        쌓임 순서 미리보기
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아래 카드는 값이 큰 순서대로 위에 겹칩니다 — 토큰 값이 곧 우선순위입니다.
                    </p>
                </div>
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
                        Z-index 토큰
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        정수라 rem 변환하지 않습니다. 클래스 칩을 클릭하면 이름이 복사됩니다.
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
                            Z_USAGE[name] ?? '—',
                        ],
                    }))}
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ZIndexGuidePage
