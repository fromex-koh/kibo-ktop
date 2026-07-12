import type {Metadata} from 'next'
import {RotateCcw} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Badge} from '@/components/kit/badge'
import {Button} from '@/components/kit/button'
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/kit/card'
import {Input} from '@/components/kit/input'
import {Label} from '@/components/kit/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/kit/select'

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

// Figma 케이스 ① 상태 카드 — 제목 + 상태 배지, 선택은 테두리(border-primary)로 강조.
const USAGE_STATUS_CARD = `<Card size="sm" className="w-fit border border-primary">
  <CardHeader>
    <CardTitle>기업정보</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge color="info">작성중</Badge>
  </CardContent>
</Card>`

// Figma 케이스 ② 폼 섹션 카드 — 헤더(제목·필수 안내·액션 버튼) + 폼 필드(라벨+컨트롤).
const USAGE_FORM_CARD = `<Card>
  <CardHeader className="border-b">
    <CardTitle>기업정보</CardTitle>
    <CardDescription>* 표시 항목은 필수 입력 항목입니다.</CardDescription>
    <CardAction>
      <Button variant="tertiary" size="small">
        <RotateCcw aria-hidden="true" /> 최근 입력 정보 불러오기
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent className="flex flex-col gap-4">
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-type">기업형태 <span className="text-destructive">*</span></Label>
      <Select>
        <SelectTrigger id="corp-type" className="w-full">
          <SelectValue placeholder="선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="corp">주식회사</SelectItem>
          <SelectItem value="llc">유한회사</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-name">기업명 <span className="text-destructive">*</span></Label>
      <Input id="corp-name" defaultValue="(주)테크놀로지" disabled />
    </div>
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="biz-code">업종코드</Label>
      <div className="flex gap-2">
        <Input id="biz-code" placeholder="[조회] 버튼으로 자동 입력됩니다" readOnly />
        <Button variant="secondary" size="small" className="shrink-0">조회</Button>
      </div>
    </div>
  </CardContent>
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

// 카드 — kit styled copy(src/components/kit/card.tsx). shadcn 원본(ui/card)을 복사해 Figma 스타일만
// 바꿨다: 흰 배경(bg-card) · 라운드 16px(rounded-lg) · 테두리/그림자 없음 · 안쪽 여백 24px.
// 배경(gray.50) 위 흰 카드라 테두리 없이 구분되며, 개별 콘텐츠 블록부터 여러 섹션을 묶는 넓은 영역까지
// 이 Card 하나로 쓴다(좌우 패딩이 크던 Panel 은 폐지). 선택·강조 테두리는 className 으로 얹는다.
const CardGuidePage = () => (
    <GuidePageShell
        title="카드 (Card)"
        description="흰 배경·라운드 16px·테두리 없는 콘텐츠 컨테이너입니다. 개별 블록부터 넓은 섹션 묶음까지 씁니다."
    >
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

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">케이스 ① 상태 카드</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    제목 + 상태 배지의 컴팩트 카드. 기본 카드는 테두리가 없고(배경 대비로 구분), 선택·강조는{' '}
                    <code className="font-mono">className=&quot;border border-primary&quot;</code> 로 얹는다.
                </p>
            </div>
            <Card size="sm" className="border-primary w-fit border">
                <CardHeader>
                    <CardTitle>기업정보</CardTitle>
                </CardHeader>
                <CardContent>
                    <Badge color="info">작성중</Badge>
                </CardContent>
            </Card>
            <CodeBlock code={USAGE_STATUS_CARD} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">케이스 ② 폼 섹션 카드</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    헤더(제목·필수 안내·액션 버튼) + 폼 필드(라벨 + Select/Input)를 담는 넓은 섹션 카드. 좌우 패딩이
                    크던 Panel 을 이 형태로 대체한다.
                </p>
            </div>
            <Card className="max-w-xl">
                <CardHeader className="border-b">
                    <CardTitle>기업정보</CardTitle>
                    <CardDescription>* 표시 항목은 필수 입력 항목입니다.</CardDescription>
                    <CardAction>
                        <Button variant="tertiary" size="small">
                            <RotateCcw aria-hidden="true" />
                            최근 입력 정보 불러오기
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="corp-type">
                            기업형태 <span className="text-destructive">*</span>
                        </Label>
                        <Select>
                            <SelectTrigger id="corp-type" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="corp">주식회사</SelectItem>
                                <SelectItem value="llc">유한회사</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="corp-name">
                            기업명 <span className="text-destructive">*</span>
                        </Label>
                        <Input id="corp-name" defaultValue="(주)테크놀로지" disabled />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="biz-code">업종코드</Label>
                        <div className="flex gap-2">
                            <Input id="biz-code" placeholder="[조회] 버튼으로 자동 입력됩니다" readOnly />
                            <Button variant="secondary" size="small" className="shrink-0">
                                조회
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <CodeBlock code={USAGE_FORM_CARD} language="tsx" copyLabel="복사" />
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
    </GuidePageShell>
)

export default CardGuidePage
