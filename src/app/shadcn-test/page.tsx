import type {Metadata} from 'next'
import {Check, Search} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {PageHeader, PageHeaderDescription, PageHeaderTitle} from '@/components/page-header'
import {Panel, PanelContent} from '@/components/panel'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {
    SectionHeader,
    SectionHeaderAction,
    SectionHeaderDescription,
    SectionHeaderTitle,
} from '@/components/section-header'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Separator} from '@/components/ui/separator'
import {
    SubSectionHeader,
    SubSectionHeaderAction,
    SubSectionHeaderDescription,
    SubSectionHeaderTitle,
} from '@/components/sub-section-header'
import {Textarea} from '@/components/ui/textarea'
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group'
import AdvancedFields from './advanced-fields'
import Composite from './composite'
import Showcase from './showcase'
import SiteHeader from './site-header'

export const metadata: Metadata = {
    title: 'shadcn 통합 테스트',
}

// Card 5개 가로 나열 데모 항목(데모 데이터). 상태 색은 Figma 배지 반영본 Badge 의 color 로 정한다
// (composite.tsx 의 STATUSES 와 동일 매핑 — 활성=success·대기=warning·정지=error·신규=info).
const CARD_ROW_ITEMS = [
    {title: '기업정보', status: '활성', statusColor: 'success'},
    {title: '대표자 경력사항', status: '대기', statusColor: 'warning'},
    {title: '기업 기타 정보', status: '정지', statusColor: 'error'},
    {title: '핵심 기술 인력 현황', status: '신규', statusColor: 'info'},
    {title: '기술 개발 실적', status: '활성', statusColor: 'success'},
] as const

const ShadcnTestPage = () => {
    return (
        <>
            <SiteHeader />
            <main id="main" className="bg-background py-10">
                <div className="grid-layout">
                    {/* 페이지 타이틀 — PageHeader compact variant, Panel 밖에 위치, 그리드 전체 폭(col-span-full) */}
                    <PageHeader className="col-span-full">
                        <PageHeaderTitle variant="compact">shadcn 통합 테스트</PageHeaderTitle>
                        <PageHeaderDescription variant="compact">
                            shadcn 기본 폼 요소·컴포넌트가 프로젝트 디자인 토큰·레이아웃 그리드로 렌더되는지 확인하는
                            페이지.
                        </PageHeaderDescription>
                    </PageHeader>

                    <h4 className="typo-h4-bold text-foreground col-span-full">
                        [기업] 정보 수집·이용·제공·조회 동의서
                    </h4>

                    {/* Card 5개 가로 나열 — gap-x-4(16px) */}
                    <div className="col-span-full mb-6 grid grid-cols-5 gap-x-4">
                        {CARD_ROW_ITEMS.map((item) => (
                            <Card key={item.title}>
                                <CardHeader>
                                    <CardTitle>
                                        <h3 className="typo-title-l-bold">{item.title}</h3>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Badge color={item.statusColor}>{item.status}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* 모든 데모를 Panel 하나에 담는다 — 개별 Card 래핑 대신 이 Panel 안에서
                    grid-layout(4/8/12 반응형 컬럼)으로 배치 (PB-15) */}
                    <Panel className="col-span-full">
                        <PanelContent>
                            {/* SectionHeader — Panel 내부 섹션 타이틀 데모. SectionHeaderAction 으로 오른쪽 버튼 시연 */}
                            <SectionHeader className="col-span-full">
                                <SectionHeaderTitle>[기업] 정보 수집·이용·제공·조회 동의서</SectionHeaderTitle>
                                <SectionHeaderDescription>
                                    서비스 이용을 위해 아래 개인정보 처리방침에 동의해 주세요.
                                </SectionHeaderDescription>
                                <SectionHeaderAction>
                                    <Button variant="tertiary" size="small">
                                        최근 입력 정보 불러오기
                                    </Button>
                                </SectionHeaderAction>
                            </SectionHeader>

                            <SubSectionHeader className="col-span-full">
                                <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                                <SubSectionHeaderDescription>
                                    담당자 정보를 정확히 입력해 주세요.
                                </SubSectionHeaderDescription>
                                <SubSectionHeaderAction>
                                    <Button variant="tertiary" size="small">
                                        초기화
                                    </Button>
                                </SubSectionHeaderAction>
                            </SubSectionHeader>

                            <Separator className="border-subtle-3 col-span-full my-10 border-t bg-transparent" />

                            {/* Button variants — Figma 디자인(default/secondary/tertiary) + 유틸 variant */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Button — variant</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button variant="default" size="medium">
                                        Primary
                                    </Button>
                                    <Button variant="secondary" size="medium">
                                        Secondary
                                    </Button>
                                    <Button variant="tertiary" size="medium">
                                        Tertiary
                                    </Button>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button variant="outline" size="medium">
                                        아웃라인
                                    </Button>
                                    <Button variant="ghost" size="medium">
                                        고스트
                                    </Button>
                                    <Button variant="destructive" size="medium">
                                        삭제
                                    </Button>
                                    <Button variant="link">링크</Button>
                                </div>
                            </div>

                            {/* Button sizes — Figma 사이즈 스케일(xlarge~xsmall) + 아이콘 버튼 */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Button — size</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button size="xlarge">xlarge</Button>
                                    <Button size="large">large</Button>
                                    <Button size="medium">medium</Button>
                                    <Button size="small">small</Button>
                                    <Button size="xsmall">xsmall</Button>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button size="icon" aria-label="검색">
                                        <Search aria-hidden="true" />
                                    </Button>
                                    <Button size="icon-sm" variant="secondary" aria-label="확인">
                                        <Check aria-hidden="true" />
                                    </Button>
                                </div>
                            </div>

                            {/* Button states — Figma variant 별 비활성 + 아이콘 조합 */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Button — 상태</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button variant="default" size="medium" disabled>
                                        비활성
                                    </Button>
                                    <Button variant="secondary" size="medium" disabled>
                                        비활성
                                    </Button>
                                    <Button variant="tertiary" size="medium" disabled>
                                        비활성
                                    </Button>
                                    <Button variant="default" size="medium">
                                        <Check aria-hidden="true" />
                                        아이콘 + 라벨
                                    </Button>
                                </div>
                            </div>

                            {/* Input */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Input</h2>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">이름</Label>
                                    <Input id="name" name="name" placeholder="홍길동" autoComplete="name" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">이메일</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        aria-invalid="true"
                                        aria-describedby="email-err"
                                    />
                                    <p id="email-err" role="alert" className="typo-caption-regular text-destructive">
                                        올바른 이메일을 입력하세요.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="disabled-input">비활성 입력</Label>
                                    <Input id="disabled-input" name="disabled-input" placeholder="수정 불가" disabled />
                                </div>
                            </div>

                            {/* Textarea */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Textarea</h2>
                                <Label htmlFor="message">메시지</Label>
                                <Textarea id="message" name="message" placeholder="내용을 입력하세요" />
                            </div>

                            {/* Checkbox — 1depth(라벨만) + 2depth(제목+설명) */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Checkbox</h2>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="terms" defaultChecked />
                                        <Label htmlFor="terms" className="font-normal">
                                            이용약관에 동의합니다
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="marketing" />
                                        <Label htmlFor="marketing" className="font-normal">
                                            마케팅 정보 수신 (선택)
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="cb-disabled" disabled />
                                        <Label htmlFor="cb-disabled" className="font-normal">
                                            비활성 항목
                                        </Label>
                                    </div>
                                    {/* 2depth — 제목 + 설명 */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="cb-all" defaultChecked aria-describedby="cb-all-desc" />
                                            <Label htmlFor="cb-all" className="font-bold">
                                                전체 동의
                                            </Label>
                                        </div>
                                        <p id="cb-all-desc" className="typo-body-xl-regular text-muted-foreground ml-8">
                                            서비스 이용약관·개인정보 수집 및 이용에 모두 동의합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Radio group — 1depth(라벨만) + 2depth(제목+설명) */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Radio Group</h2>
                                <RadioGroup defaultValue="card" aria-label="결제 수단" className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="card" id="pay-card" />
                                        <Label htmlFor="pay-card" className="font-normal">
                                            신용카드
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="transfer" id="pay-transfer" />
                                        <Label htmlFor="pay-transfer" className="font-normal">
                                            계좌이체
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="phone" id="pay-phone" disabled />
                                        <Label htmlFor="pay-phone" className="font-normal">
                                            휴대폰 결제 (비활성)
                                        </Label>
                                    </div>
                                    {/* 2depth — 제목 + 설명 */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <RadioGroupItem
                                                value="meet"
                                                id="pay-meet"
                                                aria-describedby="pay-meet-desc"
                                            />
                                            <Label htmlFor="pay-meet" className="font-bold">
                                                만나서 결제
                                            </Label>
                                        </div>
                                        <p
                                            id="pay-meet-desc"
                                            className="typo-body-xl-regular text-muted-foreground ml-8"
                                        >
                                            상품 수령 시 카드 또는 현금으로 결제합니다.
                                        </p>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Select — Figma selectbox 반영(48px). 필수표시 별표 + 오류 상태 예시 */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Select</h2>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="fruit-trigger">
                                        좋아하는 과일 <span className="text-error-500">*</span>
                                    </Label>
                                    <Select>
                                        <SelectTrigger id="fruit-trigger" className="w-full">
                                            <SelectValue placeholder="선택해주세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="apple">사과</SelectItem>
                                            <SelectItem value="banana">바나나</SelectItem>
                                            <SelectItem value="cherry">체리</SelectItem>
                                            <SelectItem value="grape">포도</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="region-trigger">
                                        지역 <span className="text-error-500">*</span>
                                    </Label>
                                    <Select>
                                        <SelectTrigger
                                            id="region-trigger"
                                            aria-invalid="true"
                                            aria-describedby="region-err"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="선택해주세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="seoul">서울</SelectItem>
                                            <SelectItem value="busan">부산</SelectItem>
                                            <SelectItem value="daegu">대구</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p id="region-err" role="alert" className="typo-caption-regular text-error-500">
                                        필수 항목입니다.
                                    </p>
                                </div>
                            </div>

                            {/* Chip (단일 선택 = radio 기능) — shadcn 에 Chip 은 없고 ToggleGroup type="single" 이
                                그 역할. variant="outline" + rounded-full 로 칩(pill) 형태. 하나만 선택된다. */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Chip — 단일 선택 (radio 기능)</h2>
                                <p className="typo-caption-regular text-muted-foreground">
                                    ToggleGroup <code>type=&quot;single&quot;</code> — 하나만 선택됩니다.
                                </p>
                                <ToggleGroup
                                    type="single"
                                    defaultValue="week"
                                    variant="outline"
                                    aria-label="기간"
                                    className="flex-wrap"
                                >
                                    <ToggleGroupItem value="day" className="rounded-full px-4">
                                        일간
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="week" className="rounded-full px-4">
                                        주간
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="month" className="rounded-full px-4">
                                        월간
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="year" className="rounded-full px-4">
                                        연간
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>

                            {/* Chip (다중 선택 = checkbox 기능) — ToggleGroup type="multiple". 여러 개 선택된다. */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Chip — 다중 선택 (checkbox 기능)</h2>
                                <p className="typo-caption-regular text-muted-foreground">
                                    ToggleGroup <code>type=&quot;multiple&quot;</code> — 여러 개 선택됩니다.
                                </p>
                                <ToggleGroup
                                    type="multiple"
                                    defaultValue={['react', 'ts']}
                                    variant="outline"
                                    aria-label="관심 기술"
                                    className="flex-wrap"
                                >
                                    <ToggleGroupItem value="react" className="rounded-full px-4">
                                        React
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="ts" className="rounded-full px-4">
                                        TypeScript
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="tailwind" className="rounded-full px-4">
                                        Tailwind
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="next" className="rounded-full px-4">
                                        Next.js
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="radix" className="rounded-full px-4">
                                        Radix
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>

                            {/* DatePicker · 주소 검색(+상세) · 업종 코드 — 상태가 필요해 client 컴포넌트로 분리 */}
                            <AdvancedFields />

                            {/* Overlay — bg-overlay-* 유틸(다크 자동반사). 임의값 var() 대신 토큰 유틸 사용([SC-01]) */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Overlay</h2>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="bg-overlay-sm size-20 rounded-lg" />
                                    <div className="bg-overlay-md size-20 rounded-lg" />
                                    <div className="bg-overlay-lg size-20 rounded-lg" />
                                    <div className="bg-overlay-xl size-20 rounded-lg" />
                                </div>
                            </div>

                            {/* Card — shadcn 컴포넌트 자체 데모(Panel 과는 별개 컴포넌트). */}
                            <div className="col-span-4 flex flex-col gap-4">
                                <h2 className="typo-title-l-bold">Card</h2>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>플랜 안내</CardTitle>
                                        <CardDescription>
                                            bg-card 토큰과 rounded-lg 라운드로 구성한 카드입니다.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="typo-body-l-regular text-foreground">
                                            shadcn Card 컴포넌트를 그대로 사용합니다.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button size="sm">자세히 보기</Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            {/* Stepper · Tabs · Breadcrumb · Confirm 모달 · Pagination · 데이터 테이블 */}
                            <Showcase />

                            {/* 상태 칩 · 세그먼티드 컨트롤 · 전역 헤더 · Sticky 사이드메뉴(LNB) */}
                            <Composite />
                        </PanelContent>
                    </Panel>
                </div>
            </main>
        </>
    )
}

export default ShadcnTestPage
