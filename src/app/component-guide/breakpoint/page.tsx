import type {Metadata} from 'next'
import ActiveBreakpointTag from '@/components/guide/active-breakpoint-tag'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import tokens from '@tokens'

export const metadata: Metadata = {title: '브레이크포인트'}

// 브레이크포인트 — 모바일 퍼스트 3단계(기본 → wide: → pc:). 정의된 프리픽스만 사용.
const BreakpointGuidePage = () => (
    <GuidePage
        title="브레이크포인트 (Breakpoint)"
        description={
            <>
                모바일 퍼스트 3단계 브레이크포인트(기본 → <code>wide:</code> → <code>pc:</code>)입니다.
            </>
        }
    >
        <p className="typo-caption-regular text-subtle">
            구간명은 특정 기기 하나를 뜻하지 않는다. <code>wide</code> 는 태블릿(세로·가로)과 노트북이 함께 걸치는 폭
            구간이라 기기 중립적으로 이름 붙였다(단, 12.9형급 대형 태블릿을 가로로 눕히면 <code>pc</code> 구간으로
            넘어갈 수 있다).
        </p>
        <div className="border-gray-subtle-2 overflow-x-auto rounded-xl border">
            <table className="w-full text-left">
                <caption className="sr-only">브레이크포인트 구간과 프리픽스, 포함 기기</caption>
                <thead>
                    <tr className="border-gray-subtle-2 bg-surface border-b">
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            구간
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            범위
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            프리픽스
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            포함 기기
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        // 구간명은 기기 하나를 가리키지 않으므로(예: wide = 태블릿·노트북 공유 폭),
                        // 실제 포함 기기는 여기서 별도 안내한다. 새 브레이크포인트 키 추가 시 함께 갱신.
                        const DEVICE_HINT: Record<string, string> = {
                            mobile: 'Galaxy S24(360px)·iPhone 15(393px)',
                            wide: 'iPad 10세대 세로(820px)·가로(1180px)',
                            pc: 'Full HD 1920×1080(스케일 125%→1536px)',
                        }
                        const entries = Object.entries(tokens.breakpoint).sort((a, b) => a[1] - b[1])
                        const rows = [
                            {
                                key: 'mobile',
                                name: 'mobile (기본)',
                                range: `0 ~ ${entries[0][1] - 1}px`,
                                prefix: null,
                                device: DEVICE_HINT['mobile'],
                            },
                            ...entries.map(([k, v], i) => ({
                                key: k,
                                name: k,
                                range: i + 1 < entries.length ? `${v} ~ ${entries[i + 1][1] - 1}px` : `${v}px ~`,
                                prefix: `${k}:`,
                                device: DEVICE_HINT[k] ?? '—',
                            })),
                        ]
                        return rows.map((r) => (
                            <tr key={r.name} className="border-gray-subtle-2 border-b last:border-b-0">
                                <td className="typo-body-l-regular px-4 py-3">
                                    <span className="inline-flex items-center gap-2">
                                        {r.name}
                                        <ActiveBreakpointTag targetKey={r.key} />
                                    </span>
                                </td>
                                <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">{r.range}</td>
                                <td className="px-4 py-3">
                                    {r.prefix ? (
                                        <CopyChip value={r.prefix} />
                                    ) : (
                                        <span className="typo-caption-regular text-subtle font-mono">없음</span>
                                    )}
                                </td>
                                <td className="typo-body-l-regular text-subtle px-4 py-3">{r.device}</td>
                            </tr>
                        ))
                    })()}
                </tbody>
            </table>
        </div>
        <p className="typo-caption-regular text-subtle">
            국내 스마트폰은 삼성 갤럭시가 다수, iPhone 이 그다음인데 두 계열 모두 CSS 뷰포트 폭이 360~393px 라{' '}
            <code>mobile</code>&nbsp;구간(0~767px) 안에 여유 있게 들어갑니다. 태블릿은 iPad 세로(820px)·가로(1180px)
            모두 <code>wide</code>&nbsp;구간(768~1279px) 안이라 위 &apos;태블릿·노트북이 함께 걸치는 폭&apos; 설계와
            맞습니다. 데스크톱은 Full HD(1920×1080)가 국내 1위 해상도인데, Windows 기본 배율(125%)을 적용해도 유효
            뷰포트가 1536px 라 <code>pc</code>&nbsp;구간(1280px~) 안에 넉넉히 들어옵니다 — 즉 국내에서 실제로 가장 많이
            쓰이는 기기 기준으로는 이 3구간 밖으로 밀려나 레이아웃이 깨지는 경우가 거의 없습니다. (기기 CSS 폭은 실측
            기준이며, 브랜드별 점유율은 조사 시점·기관마다 차이가 있어 참고용입니다.)
        </p>
    </GuidePage>
)

export default BreakpointGuidePage
