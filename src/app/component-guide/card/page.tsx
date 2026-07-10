import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePage from '@/components/guide/guide-page'
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'

export const metadata: Metadata = {title: '카드 (Card)'}

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>`

const USAGE_CODE_ACTION = `<Card>
  <CardHeader>
    <CardTitle>플랜 안내</CardTitle>
    <CardDescription>
      제목 오른쪽에 액션을 둘 수 있습니다.
    </CardDescription>
    <CardAction>수정</CardAction>
  </CardHeader>
  <CardContent>
    <p>본문 콘텐츠입니다.</p>
  </CardContent>
  <CardFooter>
    <p>저장</p>
  </CardFooter>
</Card>`

const USAGE_CODE_ALIGN = `{/* align / gapX / gapY 를 바꿔도 Composition(Header/Title/Description/Action/Content/Footer)은 동일하게 유지됩니다 */}
<Card align="left">
  <CardHeader>
    <CardTitle>왼쪽 정렬</CardTitle>
    <CardDescription>align="left"</CardDescription>
    <CardAction>수정</CardAction>
  </CardHeader>
  <CardContent>
    <p>텍스트가 왼쪽으로 정렬됩니다.</p>
  </CardContent>
  <CardFooter>
    <p>확인</p>
  </CardFooter>
</Card>

<Card align="right">
  {/* ...align="left" 와 동일 구조, align 값만 "right" */}
</Card>

<Card gapY={6}>
  {/* gapY 는 row-gap 으로 동작 — 헤더·본문·푸터 사이 세로 간격이 넓어집니다 */}
</Card>

<Card gapX={4}>
  {/* gapX 는 column-gap — 기본 flex-col 레이아웃에선 시각적 효과가 없고,
      className="flex-row flex-wrap" 로 방향을 바꿔야 자식이 가로로 나열되며 드러납니다 */}
</Card>`

// 카드 — shadcn CLI 로 설치된 실제 프리미티브(src/components/ui/card.tsx). 별도 래퍼 컴포넌트를
// 만들지 않고 원본을 그대로 쓴다([SC-02]). 개별 콘텐츠 블록(통계 카드·항목 박스)에 쓰고, 여러
// 데모·섹션을 하나로 묶는 넓은 콘텐츠 영역에는 Panel 을 쓴다(component-guide/panel 참고).
const CardGuidePage = () => (
    <GuidePage title="카드 (Card)" description="shadcn Card 프리미티브입니다. 개별 콘텐츠 블록을 감쌉니다.">
        <section aria-labelledby="card-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="card-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Card 가 가진 Composition 전부 —
                    CardHeader/CardTitle/CardDescription/CardAction/CardContent/CardFooter 를 모두 사용한 기본형입니다.
                    CardAction/CardFooter 는 버튼 없이 텍스트만으로도 쓸 수 있습니다.
                </p>
            </div>
            <div className="bg-background rounded-md p-6">
                <Card className="max-w-sm">
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                        <CardAction>Card Action</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="typo-body-l-regular text-foreground">Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p className="typo-body-l-regular text-foreground">Card Footer</p>
                    </CardFooter>
                </Card>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">CardAction — 제목 오른쪽 액션(선택)</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">CardAction</code> 을 CardHeader 안에 넣으면 CSS{' '}
                    <code className="font-mono">has-data-[slot=card-action]</code> 선택자로 자동 2열 레이아웃이 된다(JS
                    분기 없음).
                </p>
            </div>
            <div className="bg-background rounded-md p-6">
                <Card className="max-w-sm">
                    <CardHeader>
                        <CardTitle>플랜 안내</CardTitle>
                        <CardDescription>제목 오른쪽에 액션을 둘 수 있습니다.</CardDescription>
                        <CardAction>수정</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="typo-body-l-regular text-foreground">본문 콘텐츠입니다.</p>
                    </CardContent>
                    <CardFooter>
                        <p className="typo-body-l-regular text-foreground">저장</p>
                    </CardFooter>
                </Card>
            </div>
            <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">align / gapX / gapY — 정렬·간격 커스터마이징</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">align</code> 은 내부 텍스트 정렬(기본값{' '}
                    <code className="font-mono">center</code>), <code className="font-mono">gapX</code>/
                    <code className="font-mono">gapY</code> 는 자식 요소 사이 간격입니다. spacingBase(4px) 배수 중{' '}
                    <code className="font-mono">0/1/2/3/4/6/8</code> 만 선택 가능합니다(PB-13). 아래 4개 카드는 모두
                    같은 Composition(Header/Title/Description/Action/Content/Footer)을 쓰고, 바뀐 prop 만 다릅니다.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <Card align="left">
                    <CardHeader>
                        <CardTitle>왼쪽 정렬</CardTitle>
                        <CardDescription>align=&quot;left&quot;</CardDescription>
                        <CardAction>수정</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="typo-body-l-regular text-foreground">텍스트가 왼쪽으로 정렬됩니다.</p>
                    </CardContent>
                    <CardFooter>
                        <p className="typo-body-l-regular text-foreground">확인</p>
                    </CardFooter>
                </Card>
                <Card align="right">
                    <CardHeader>
                        <CardTitle>오른쪽 정렬</CardTitle>
                        <CardDescription>align=&quot;right&quot;</CardDescription>
                        <CardAction>수정</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="typo-body-l-regular text-foreground">텍스트가 오른쪽으로 정렬됩니다.</p>
                    </CardContent>
                    <CardFooter>
                        <p className="typo-body-l-regular text-foreground">확인</p>
                    </CardFooter>
                </Card>
                <Card gapY={6}>
                    <CardHeader>
                        <CardTitle>세로 간격 확장</CardTitle>
                        <CardDescription>gapY={'{6}'}</CardDescription>
                        <CardAction>수정</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="typo-body-l-regular text-foreground">
                            헤더·본문·푸터 사이 세로 간격이 넓어집니다.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="typo-body-l-regular text-foreground">확인</p>
                    </CardFooter>
                </Card>
                <Card gapX={4}>
                    <CardHeader>
                        <CardTitle>가로 간격(gapX)</CardTitle>
                        <CardDescription>gapX={'{4}'}</CardDescription>
                        <CardAction>수정</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="typo-body-l-regular text-foreground">
                            column-gap 이라 flex-row 로 바꿔야 간격이 보입니다.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className="typo-body-l-regular text-foreground">확인</p>
                    </CardFooter>
                </Card>
            </div>
            <CodeBlock code={USAGE_CODE_ALIGN} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="card-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="card-composition" className="typo-h4-bold">
                    Composition
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    이 컴포넌트 내부에 들어갈 수 있는 요소들입니다.
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
                            ['CardHeader', '제목·설명·액션을 묶는 상단 영역입니다.'],
                            ['CardTitle', '카드 제목을 표시합니다.'],
                            ['CardDescription', '카드의 추가 설명을 표시합니다.'],
                            ['CardAction', 'CardHeader 우측에 배치하는 액션(버튼 등) 영역입니다.'],
                            ['CardContent', '카드의 본문 콘텐츠를 표시합니다.'],
                            ['CardFooter', '카드 하단의 액션 영역을 표시합니다.'],
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

        <section aria-labelledby="card-props" className="flex flex-col gap-4">
            <div>
                <h2 id="card-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Card(최상위)에서 커스터마이징 가능한 속성입니다.
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
                                        <code className="font-mono">--card-spacing</code> 변수 크기.
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
                                align
                            </th>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    <p className="typo-body-l-regular text-muted-foreground">
                                        Card 내부 텍스트 정렬 방향
                                    </p>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        &apos;center&apos; | &apos;left&apos; | &apos;right&apos;
                                    </span>
                                </div>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &apos;center&apos;
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        center
                                    </span>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        left
                                    </span>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        right
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                gapX / gapY
                            </th>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    <p className="typo-body-l-regular text-muted-foreground">
                                        자식 요소 사이 가로/세로 간격(gap-x-*/gap-y-*). spacingBase(4px) 배수 중 정의된
                                        값만 선택 가능(PB-13).
                                    </p>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        0 | 1 | 2 | 3 | 4 | 6 | 8
                                    </span>
                                </div>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                undefined
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {[0, 1, 2, 3, 4, 6, 8].map((value) => (
                                        <span
                                            key={value}
                                            className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs"
                                        >
                                            {value}
                                        </span>
                                    ))}
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
    </GuidePage>
)

export default CardGuidePage
