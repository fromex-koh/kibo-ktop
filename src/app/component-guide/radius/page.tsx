import type {Metadata} from 'next'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '라운드'}

// '미리보기' 칸 클래스 — Tailwind 는 className 에 리터럴로 등장하는 클래스명만 스캔해서 CSS 를
// 생성하므로 `rounded-${k}` 처럼 동적으로 조합하면 안 만들어진다(실제로 rounded-xs/rounded-2xl 은 이
// 프로젝트 다른 곳에 리터럴 사용처가 없어 스캔되지 않고 있었음). radius 키는 7개뿐인 고정 목록이라
// Record 로 리터럴을 나열해 className 에 직접 쓴다.
const ROUNDED_CLASS: Record<string, string> = {
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
}

// tokens.radius 의 숫자값은 절대 px 가 아니라 radiusBase 로부터의 오프셋이다(shadcn 컨벤션: 단일
// --radius + calc 파생, spacing 의 "단일 base 가 전체 스케일을 지배" 원리와 동일). '값' 칸엔 오프셋이
// 아니라 실제 최종 반경(base + 오프셋)을 보여준다.
const resolvedPx = (v: number | string): number | string => (typeof v === 'number' ? tokens.radiusBase + v : v)

// 라운드 — Figma '05 Radius' 정의를 반경 토큰(--ds-radius-*)으로 반영. rounded-* 유틸로 쓰며
// 정의된 키(xs·sm·md·lg·xl·2xl·full)만 사용한다. '클래스' 칩을 클릭하면 이름이 복사된다.
const RadiusGuidePage = () => (
    <GuidePage title="라운드 (Radius)" description="rounded-* 유틸로 쓰는 모서리 반경 토큰입니다.">
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-border border-b">
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            미리보기
                        </th>
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            클래스 (클릭 복사)
                        </th>
                        <th
                            scope="col"
                            className="typo-body-l-medium text-muted-foreground px-3 py-3 whitespace-nowrap"
                        >
                            값
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(tokens.radius).map(([k, offset]) => {
                        const px = resolvedPx(offset)
                        return (
                            <tr key={k} className="border-border hover:bg-card border-b transition-colors">
                                <td className="px-3 py-3">
                                    <span
                                        aria-hidden="true"
                                        className={`bg-card border-border block size-16 border ${ROUNDED_CLASS[k]}`}
                                    />
                                </td>
                                <th scope="row" className="px-3 py-3 text-left font-normal">
                                    <CopyChip value={`rounded-${k}`} />
                                </th>
                                <td className="typo-caption-regular text-muted-foreground px-3 py-3 font-mono whitespace-nowrap">
                                    {typeof px === 'number' ? `${px}px` : px}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </GuidePage>
)

export default RadiusGuidePage
