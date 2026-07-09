import type {Metadata} from 'next'
import {Check, Search} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Switch} from '@/components/ui/switch'
import {Textarea} from '@/components/ui/textarea'
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group'
import AdvancedFields from './advanced-fields'

export const metadata: Metadata = {
    title: 'shadcn 통합 테스트',
}

const ShadcnTestPage = () => {
    return (
        <main id="main" className="max-w-content mx-auto px-4 py-10">
            <h1 className="typo-h4-bold">shadcn 통합 테스트</h1>
            <p className="typo-body-l-regular text-muted-foreground mt-2">
                shadcn 기본 폼 요소가 프로젝트 디자인 토큰(--ds-*)으로 렌더되는지 확인하는 페이지.
            </p>

            {/* Button variants */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Button — variant</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button>기본 (primary)</Button>
                    <Button variant="secondary">보조 (secondary)</Button>
                    <Button variant="outline">아웃라인</Button>
                    <Button variant="ghost">고스트</Button>
                    <Button variant="destructive">삭제</Button>
                    <Button variant="link">링크</Button>
                </div>
            </section>

            {/* Button sizes */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Button — size</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" aria-label="검색">
                        <Search aria-hidden="true" />
                    </Button>
                    <Button size="icon" variant="secondary" aria-label="확인">
                        <Check aria-hidden="true" />
                    </Button>
                </div>
            </section>

            {/* Button states */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Button — 상태</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button disabled>비활성</Button>
                    <Button variant="secondary" disabled>
                        비활성
                    </Button>
                    <Button>
                        <Check aria-hidden="true" />
                        아이콘 + 라벨
                    </Button>
                </div>
            </section>

            {/* Input */}
            <section className="mt-10 flex max-w-md flex-col gap-6">
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
            </section>

            {/* Textarea */}
            <section className="mt-10 flex max-w-md flex-col gap-2">
                <h2 className="typo-title-l-bold">Textarea</h2>
                <Label htmlFor="message">메시지</Label>
                <Textarea id="message" name="message" placeholder="내용을 입력하세요" />
            </section>

            {/* Checkbox */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Checkbox</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Checkbox id="terms" defaultChecked />
                        <Label htmlFor="terms">이용약관에 동의합니다</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="marketing" />
                        <Label htmlFor="marketing">마케팅 정보 수신 (선택)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="cb-disabled" disabled />
                        <Label htmlFor="cb-disabled">비활성 항목</Label>
                    </div>
                </div>
            </section>

            {/* Radio group */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Radio Group</h2>
                <RadioGroup defaultValue="card" aria-label="결제 수단" className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="card" id="pay-card" />
                        <Label htmlFor="pay-card">신용카드</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="transfer" id="pay-transfer" />
                        <Label htmlFor="pay-transfer">계좌이체</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="phone" id="pay-phone" disabled />
                        <Label htmlFor="pay-phone">휴대폰 결제 (비활성)</Label>
                    </div>
                </RadioGroup>
            </section>

            {/* Switch */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Switch</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Switch id="notif" defaultChecked />
                        <Label htmlFor="notif">알림 받기</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch id="sw-disabled" disabled />
                        <Label htmlFor="sw-disabled">비활성 스위치</Label>
                    </div>
                </div>
            </section>

            {/* Select */}
            <section className="mt-10 flex max-w-md flex-col gap-2">
                <h2 className="typo-title-l-bold">Select</h2>
                <Label htmlFor="fruit-trigger">좋아하는 과일</Label>
                <Select>
                    <SelectTrigger id="fruit-trigger" className="w-full">
                        <SelectValue placeholder="과일 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">사과</SelectItem>
                        <SelectItem value="banana">바나나</SelectItem>
                        <SelectItem value="cherry">체리</SelectItem>
                        <SelectItem value="grape">포도</SelectItem>
                    </SelectContent>
                </Select>
            </section>

            {/* Chip (단일 선택 = radio 기능) — shadcn 에 Chip 은 없고 ToggleGroup type="single" 이 그 역할.
                variant="outline" + rounded-full 로 칩(pill) 형태. 하나만 선택된다. */}
            <section className="mt-10 flex flex-col gap-3">
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
            </section>

            {/* Chip (다중 선택 = checkbox 기능) — ToggleGroup type="multiple". 여러 개 선택된다. */}
            <section className="mt-10 flex flex-col gap-3">
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
            </section>

            {/* DatePicker · 주소 검색(+상세) · 업종 코드 — 상태가 필요해 client 컴포넌트로 분리 */}
            <AdvancedFields />

            {/* Overlay — bg-overlay-* 유틸(다크 자동반사). 임의값 var() 대신 토큰 유틸 사용([SC-01]) */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Overlay</h2>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="bg-overlay-sm size-20 rounded-lg" />
                    <div className="bg-overlay-md size-20 rounded-lg" />
                    <div className="bg-overlay-lg size-20 rounded-lg" />
                </div>
            </section>
        </main>
    )
}

export default ShadcnTestPage
