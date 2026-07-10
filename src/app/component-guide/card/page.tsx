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

// Composition 트리 — https://ui.shadcn.com/docs/components/base/card 의 표기 방식을 따른다.
const COMPOSITION_TREE = `Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter`

const COMPOSITION_ITEMS = [
    ['CardHeader', '제목·설명·액션을 묶는 상단 영역입니다.'],
    ['CardTitle', '카드 제목을 표시합니다.'],
    ['CardDescription', '카드의 추가 설명을 표시합니다.'],
    ['CardAction', 'CardHeader 우측에 배치하는 액션(버튼 등) 영역입니다.'],
    ['CardContent', '카드의 본문 콘텐츠를 표시합니다.'],
    ['CardFooter', '카드 하단의 액션 영역을 표시합니다.'],
] as const

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
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">CardAction — 제목 오른쪽 액션(선택)</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">CardAction</code> 을 CardHeader 안에 넣으면 CSS{' '}
                    <code className="font-mono">has-data-[slot=card-action]</code> 선택자로 자동 2열 레이아웃이 된다(JS
                    분기 없음).
                </p>
            </div>
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
            <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />
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
            <div className="bg-background border-border overflow-x-auto rounded-md border p-4">
                <pre className="typo-caption-regular text-foreground font-mono">{COMPOSITION_TREE}</pre>
            </div>
            <dl className="flex flex-col gap-2">
                {COMPOSITION_ITEMS.map(([name, desc]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
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
