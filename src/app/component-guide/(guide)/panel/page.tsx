import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Button} from '@/components/kit/button'
import {Panel, PanelContent} from '@/components/composite/panel'

export const metadata: Metadata = {title: '패널 (Panel)'}

// 사용법 스니펫 — 가장 흔한 형태(Panel + PanelContent 만, Header/Footer 없음).
// CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<Panel>
  <PanelContent>
   {/* 데모·섹션들을 그리드 셀로 배치 */}
  </PanelContent>
</Panel>`

// 패널 — shadcn Card 와 구조·스타일이 동일한 합성(compound) 컴포넌트입니다. shadcn CLI 로 설치되는
// 실제 프리미티브가 아니라 kit 을 조합한 프로젝트 커스텀 컴포넌트(src/components/composite/panel.tsx)라
// src/components/ui/** 밖(PageHeader 와 같은 composite 레이어)에 있습니다. Card 와 달리 border/ring 이 없고,
// 상하 40px·좌우 102px 패딩이 기본값입니다(여러 데모를 하나의 패널로 묶어 담는 용도로 조정됨).
// 아래 데모는 가장 흔한 형태 — Panel + PanelContent 만 쓰고 PanelHeader/PanelFooter 는 쓰지 않는다
// (Panel 하나로 여러 데모 콘텐츠를 그리드로 감싼다).
const PanelGuidePage = () => (
    <GuidePageShell
        title="패널 (Panel)"
        description="Card 와 구조·스타일이 동일한 합성 컴포넌트입니다. border/ring 없이 배경만으로 콘텐츠 영역을 감쌉니다."
    >
        <section aria-labelledby="panel-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="panel-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    가장 흔한 형태입니다 — Panel 하나가 여러 데모 섹션을 그리드로 묶어 감쌉니다.
                </p>
            </div>
            <div className="bg-background rounded-md p-6">
                <Panel>
                    <PanelContent>
                        <div className="col-span-4 flex flex-col gap-4">
                            <h3 className="typo-title-l-bold">섹션 A</h3>
                            <p className="typo-body-l-regular text-muted-foreground">
                                그리드 셀 하나에 들어가는 콘텐츠입니다.
                            </p>
                        </div>
                        <div className="col-span-4 flex flex-col gap-4">
                            <h3 className="typo-title-l-bold">섹션 B</h3>
                            <Button size="sm">액션</Button>
                        </div>
                    </PanelContent>
                </Panel>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="panel-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="panel-composition" className="typo-h4-bold">
                    Composition
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    이 컴포넌트 내부에 들어갈 수 있는 요소들입니다. 현재 앱에서는{' '}
                    <code className="font-mono">PanelContent</code> 만 쓰지만, Card 와 같은 합성 API 라 나머지도 필요할
                    때 그대로 쓸 수 있습니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Composition 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['PanelContent', '패널의 본문 콘텐츠를 표시합니다. 현재 유일하게 쓰이는 슬롯입니다.'],
                            ['PanelHeader', '제목·설명·액션을 묶는 상단 영역입니다. (현재 미사용)'],
                            [
                                'PanelTitle',
                                '패널 제목을 표시합니다. 시맨틱 헤딩은 직접 자식으로 넣습니다. (현재 미사용)',
                            ],
                            ['PanelDescription', '패널의 추가 설명을 표시합니다. (현재 미사용)'],
                            ['PanelAction', 'PanelHeader 우측에 배치하는 액션(버튼 등) 영역입니다. (현재 미사용)'],
                            ['PanelFooter', '패널 하단의 액션 영역을 표시합니다. (현재 미사용)'],
                        ].map(([name, desc]) => (
                            <tr key={name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    {name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="panel-props" className="flex flex-col gap-4">
            <div>
                <h2 id="panel-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Panel(최상위)에서 커스터마이징 가능한 속성입니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Control
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                size
                            </th>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    <p className="typo-body-l-regular text-muted-foreground">
                                        내부 요소 간 간격(gap)에 쓰이는{' '}
                                        <code className="font-mono">--panel-spacing</code> 변수 크기.
                                    </p>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        &apos;default&apos; | &apos;sm&apos;
                                    </span>
                                </div>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &apos;default&apos;
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        default
                                    </span>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        sm
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                className
                            </th>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    <p className="typo-body-l-regular text-muted-foreground">
                                        추가 클래스명으로 스타일 확장
                                    </p>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        string
                                    </span>
                                </div>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &quot;&quot;
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default PanelGuidePage
