import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {FormCard} from '@/components/composite/form-card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

export const metadata: Metadata = {title: '폼 카드 (FormCard)'}

const USAGE_CODE = `<FormCard
  title="기업정보"
  subtitle={<><span className="text-error-500">*</span> 표시 항목은 필수 입력 항목입니다.</>}
  action={<Button variant="tertiary" size="small">최근 입력 정보 불러오기</Button>}
>
  {/* 본문 — 2열 폼 필드. 라벨은 다른 폼(Input/Select/Textarea)과 동일 스타일, 필수 * 는 text-error-500 */}
  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-type" className="text-foreground gap-1 font-bold">기업형태 <span className="text-error-500">*</span></Label>
      <Select>
        <SelectTrigger id="corp-type" className="w-full">
          <SelectValue placeholder="선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="corp">주식회사</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-name" className="text-foreground gap-1 font-bold">기업명 <span className="text-error-500">*</span></Label>
      <Input id="corp-name" defaultValue="(주)테크놀로지" disabled />
    </div>
  </div>
</FormCard>`

// Props 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    ['title', '카드 제목 (필수).', 'ReactNode'],
    ['subtitle', '제목 아래 서브텍스트(선택). 필수 안내 등.', 'ReactNode'],
    ['action', '헤더 우측 액션(버튼 등, 선택).', 'ReactNode'],
    ['children', '헤더 아래 본문 콘텐츠 (필수).', 'ReactNode'],
    ['className', '추가 클래스명으로 스타일 확장.', 'string'],
] as const

// 폼 카드 — kit Card 를 감싼 넓은 폼 섹션 카드(composite/form-card). 좌우 102px·상하 40px 패딩,
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
                        <span className="text-error-500">*</span> 표시 항목은 필수 입력 항목입니다.
                    </>
                }
                action={
                    <Button variant="tertiary" size="small">
                        최근 입력 정보 불러오기
                    </Button>
                }
            >
                {/* Figma 배치 — 한 행에 2개씩(2열 그리드), 좁은 폭에선 1열 */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="corp-type" className="text-foreground gap-1 font-bold">
                            기업형태
                            <span className="text-error-500">*</span>
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
                        <Label htmlFor="corp-name" className="text-foreground gap-1 font-bold">
                            기업명
                            <span className="text-error-500">*</span>
                        </Label>
                        <Input id="corp-name" defaultValue="(주)테크놀로지" disabled />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="corp-reg" className="text-foreground gap-1 font-bold">
                            사업자번호
                            <span className="text-error-500">*</span>
                        </Label>
                        <Input id="corp-reg" defaultValue="123-45-67890" />
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

        <section aria-labelledby="form-card-props" className="flex flex-col gap-4">
            <div>
                <h2 id="form-card-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">FormCard 에 넘기는 속성입니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {PROPS_ITEMS.map(([name, desc, type]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">
                            {name}
                            <span className="text-muted-foreground ml-2 font-normal">{type}</span>
                        </dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default FormCardGuidePage
