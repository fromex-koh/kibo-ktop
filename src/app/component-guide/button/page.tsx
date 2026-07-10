import type {Metadata} from 'next'
import {ArrowRight, Download} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '버튼 (Button)'}

const USAGE_CODE = `<Button variant="default" size="medium">저장</Button>
<Button variant="secondary" size="medium">취소</Button>
<Button variant="tertiary" size="medium">더보기</Button>`

const USAGE_CODE_ICON = `{/* 아이콘 왼쪽 */}
<Button variant="default" size="medium">
  <Download aria-hidden="true" />
  다운로드
</Button>

{/* 아이콘 오른쪽 */}
<Button variant="default" size="medium">
  다음
  <ArrowRight aria-hidden="true" />
</Button>`

// Figma 버튼 컴포넌트셋의 3 type. secondary 는 회색 solid 가 아니라 연한 블루 틴트+테두리 스타일이다.
const TYPES = [
    {key: 'default', label: 'Primary', desc: '가장 강조되는 주요 액션(화면당 1개 권장)에 사용합니다.'},
    {key: 'secondary', label: 'Secondary', desc: 'Primary 와 나란히 놓이는 보조 액션에 사용합니다.'},
    {key: 'tertiary', label: 'Tertiary', desc: '가장 낮은 강조의 보조 액션(취소·더보기 등)에 사용합니다.'},
] as const

// Figma 사이즈 스케일 그대로 노출한다(xlarge~xsmall). 클래스명은 cva 안에 리터럴로 고정돼 있어
// 여기서도 템플릿 문자열 대신 배열에 직접 나열한다(Tailwind 정적 분석, icon 가이드와 동일 이유).
const SIZES = [
    {key: 'xlarge', label: 'xlarge', height: 60},
    {key: 'large', label: 'large', height: 52},
    {key: 'medium', label: 'medium', height: 48},
    {key: 'small', label: 'small', height: 40},
    {key: 'xsmall', label: 'xsmall', height: 32},
] as const

const LEGACY_SIZES = ['default', 'lg', 'icon', 'icon-lg', 'sm', 'xs', 'icon-sm', 'icon-xs'] as const

// 버튼은 Card 와 달리 아이콘 전용 하위 컴포넌트가 없다 — 아이콘은 props 가 아니라 children 으로
// 직접 조합한다(lucide-react, 장식 목적이면 aria-hidden). 좌/우 어느 쪽에도 넣을 수 있다.
const ButtonGuidePage = () => (
    <GuidePage
        title="버튼 (Button)"
        description="shadcn Button 프리미티브입니다. 3가지 type × 5가지 사이즈를 지원합니다."
    >
        <section aria-labelledby="button-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="button-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">variant</code> 로 강조 단계(Primary/Secondary/Tertiary)를,{' '}
                    <code className="font-mono">size</code> 로 크기를 고릅니다.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="default" size="medium">
                    저장
                </Button>
                <Button variant="secondary" size="medium">
                    취소
                </Button>
                <Button variant="tertiary" size="medium">
                    더보기
                </Button>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">아이콘 조합</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    아이콘은 별도 prop 이 아니라 children 으로 텍스트와 함께 조합합니다. 텍스트 좌/우 어느 쪽에도 놓을
                    수 있고, 장식 목적 아이콘에는 <code className="font-mono">aria-hidden</code> 을 붙입니다.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="default" size="medium">
                    <Download aria-hidden="true" />
                    다운로드
                </Button>
                <Button variant="default" size="medium">
                    다음
                    <ArrowRight aria-hidden="true" />
                </Button>
            </div>
            <CodeBlock code={USAGE_CODE_ICON} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="button-matrix" className="flex flex-col gap-4">
            <div>
                <h2 id="button-matrix" className="typo-h4-bold">
                    Type × Size 큐레이션
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    3 type 을 열로, 5 size 를 행으로 교차해 전체 조합을 확인합니다. 44px 미만인 small·xsmall 은 밀도
                    높은 UI 용 컴팩트 예외입니다(터치 타깃 보정 미적용, 인접 간격 확보 전제).
                </p>
            </div>
            <div className="flex flex-col gap-3">
                {TYPES.map((type) => (
                    <p key={type.key} className="typo-body-l-regular text-muted-foreground">
                        <span className="text-foreground font-medium">{type.label}</span> — {type.desc}
                    </p>
                ))}
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">버튼 type·size 조합 미리보기</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Size
                            </th>
                            {TYPES.map((type) => (
                                <th key={type.key} scope="col" className="typo-body-l-medium px-4 py-3">
                                    {type.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {SIZES.map((size) => (
                            <tr key={size.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {size.label}
                                    <span className="typo-caption-regular text-muted-foreground block font-sans">
                                        {size.height}px
                                    </span>
                                </th>
                                {TYPES.map((type) => (
                                    <td key={type.key} className="px-4 py-3 align-middle">
                                        <div className="flex flex-col items-start gap-2">
                                            <Button variant={type.key} size={size.key}>
                                                <Download aria-hidden="true" />
                                                버튼
                                            </Button>
                                            <CopyChip value={`variant="${type.key}" size="${size.key}"`} label="복사" />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="button-disabled" className="flex flex-col gap-4">
            <div>
                <h2 id="button-disabled" className="typo-h4-bold">
                    Disabled 상태
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    비활성 상태는 단순히 흐리게 처리하지 않고, type 별로 별도 배경·테두리·텍스트 색을 씁니다.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {TYPES.map((type) => (
                    <Button key={type.key} variant={type.key} size="medium" disabled>
                        {type.label}
                    </Button>
                ))}
            </div>
        </section>

        <section aria-labelledby="button-props" className="flex flex-col gap-4">
            <div>
                <h2 id="button-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Button 에서 커스터마이징 가능한 속성입니다.</p>
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
                                variant
                            </th>
                            <td className="px-4 py-3">
                                <p className="typo-body-l-regular text-muted-foreground">
                                    강조 단계. default/secondary/tertiary 는 Figma 디자인을 반영한 버튼 전용 토큰(
                                    <code className="font-mono">button-*</code>)을 씁니다.
                                    outline/ghost/destructive/link 는 다이얼로그·시트 등 내부 컴포넌트가 쓰는 기존
                                    값입니다.
                                </p>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &apos;default&apos;
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {[...TYPES.map((t) => t.key), 'outline', 'ghost', 'destructive', 'link'].map(
                                        (value) => (
                                            <span
                                                key={value}
                                                className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs"
                                            >
                                                {value}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                size
                            </th>
                            <td className="px-4 py-3">
                                <p className="typo-body-l-regular text-muted-foreground">
                                    Figma 사이즈 스케일(xlarge~xsmall)입니다. 기존 값(default/lg/icon 등)은 다이얼로그·
                                    시트·사이드바 등 내부 컴포넌트 호환을 위해 그대로 유지됩니다.
                                </p>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &apos;default&apos;
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {[...SIZES.map((s) => s.key), ...LEGACY_SIZES].map((value) => (
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
                                asChild
                            </th>
                            <td className="px-4 py-3">
                                <p className="typo-body-l-regular text-muted-foreground">
                                    <code className="font-mono">next/link</code> 등 다른 요소에 버튼 스타일만 씌울 때
                                    사용합니다.
                                </p>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">false</td>
                            <td className="px-4 py-3">
                                <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                    boolean
                                </span>
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
                                <p className="typo-body-l-regular text-muted-foreground">
                                    추가 클래스명으로 스타일 확장
                                </p>
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

export default ButtonGuidePage
