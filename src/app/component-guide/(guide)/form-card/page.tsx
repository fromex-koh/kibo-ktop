import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {FormCard} from '@/components/composite/form-card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

export const metadata: Metadata = {title: '폼 카드 (FormCard)'}

const USAGE_CODE = `<FormCard
  title="기업정보"
  subtitle={<><span aria-hidden="true" className="text-error-500">*</span><span className="sr-only">별표</span> 표시 항목은 필수 입력 항목입니다.</>}
  action={<Button variant="tertiary" size="md">최근 입력 정보 불러오기</Button>}
>
  {/* 본문 — 2열 폼 필드. 라벨은 다른 폼(Input/Select/Textarea)과 동일 스타일, 필수 * 는 text-error-500 */}
  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-type" className="text-foreground gap-1 font-bold">기업형태 <span aria-hidden="true" className="text-error-500">*</span><span className="sr-only"> (필수)</span></Label>
      <Select required>
        <SelectTrigger id="corp-type" className="w-full">
          <SelectValue placeholder="선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="corp">주식회사</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-name" className="text-foreground gap-1 font-bold">기업명 <span aria-hidden="true" className="text-error-500">*</span><span className="sr-only"> (필수)</span></Label>
      <Input id="corp-name" defaultValue="(주)테크놀로지" required disabled />
    </div>
  </div>
</FormCard>`

// Props 설명 — [이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['title', '카드 제목. subtitle·action과 함께 헤더를 구성합니다.', 'undefined', 'ReactNode'],
    ['subtitle', '제목 아래 서브텍스트 또는 필수 입력 안내입니다.', 'undefined', 'ReactNode'],
    ['action', '헤더 우측 액션 영역입니다.', 'undefined', 'ReactNode'],
    ['children', '헤더 아래 폼 본문 콘텐츠입니다.', '-', 'ReactNode'],
    ['className', 'Card 루트에 추가할 클래스명입니다.', 'undefined', 'string'],
] as const

// 폼 카드 — ui Card를 감싼 넓은 폼 섹션 카드(composite/form-card). 좌우 102px·상하 40px 패딩,
// 헤더(제목·서브텍스트 좌 / 액션 우) + 본문(2열 폼 필드). Figma "기업정보" 폼 섹션을 반영한다.
const FormCardGuidePage = () => (
    <GuidePageShell
        title="폼 카드 (FormCard)"
        description="넓은 폼 섹션용 카드입니다. 좌우 102px 패딩 + 헤더(SectionHeader) + 본문."
    >
        <section aria-labelledby="form-card-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="form-card-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    헤더는 <code className="font-mono">SectionHeader</code> 를 그대로 재사용합니다 — 좌측 제목(H4/bold)·
                    서브텍스트(Body/XL/Regular), 우측 액션이 자동 배치되고, 그 아래로 본문(폼 필드 등)이 들어옵니다.
                </p>
            </div>
            <FormCard
                title="기업정보"
                subtitle={
                    <>
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        <span className="sr-only">별표</span> 표시 항목은 필수 입력 항목입니다.
                    </>
                }
                action={
                    <Button variant="tertiary" size="md">
                        최근 입력 정보 불러오기
                    </Button>
                }
            >
                {/* Figma 배치 — 한 행에 2개씩(2열 그리드), 좁은 폭에선 1열 */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="corp-type" className="text-foreground gap-1 font-bold">
                            기업형태
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </Label>
                        <Select required>
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
                        <Label htmlFor="corp-name" className="text-foreground gap-1 font-bold">
                            기업명
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </Label>
                        <Input id="corp-name" defaultValue="(주)테크놀로지" required disabled />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="corp-reg" className="text-foreground gap-1 font-bold">
                            사업자번호
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </Label>
                        <Input id="corp-reg" defaultValue="123-45-67890" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="corp-corp-no" className="text-foreground gap-1 font-bold">
                            법인번호
                        </Label>
                        <Input id="corp-corp-no" defaultValue="11222-1234567" />
                    </div>
                </div>
            </FormCard>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <BaseCard>
            <section aria-labelledby="form-card-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="form-card-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">FormCard 에 넘기는 속성입니다.</p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">FormCard Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
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
                                    Type
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(([name, description, defaultValue, type]) => (
                                <tr key={name} className="border-border border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FormCardGuidePage
