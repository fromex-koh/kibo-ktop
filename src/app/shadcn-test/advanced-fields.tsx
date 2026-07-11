'use client'

import {useState} from 'react'
import {format} from 'date-fns'
import {ko} from 'date-fns/locale'
import {CalendarIcon, Search} from 'lucide-react'
import {Button} from '@/components/kit/button'
import {Calendar} from '@/components/kit/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/kit/dialog'
import {Input} from '@/components/kit/input'
import {Label} from '@/components/kit/label'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/kit/popover'

// 실제 주소검색(Daum 우편번호)·업종코드 조회는 외부 API/스크립트라 [NA-003] 위반이라, 여기선
// "검색 버튼 → 모달 → 선택 → input 채움" UX 패턴만 목업 데이터로 시연한다(컴포넌트 테스트 목적).
type AddressItem = {zip: string; road: string}
const MOCK_ADDRESSES: readonly AddressItem[] = [
    {zip: '06236', road: '서울 강남구 테헤란로 152'},
    {zip: '04524', road: '서울 중구 세종대로 110'},
    {zip: '13529', road: '경기 성남시 분당구 판교역로 235'},
    {zip: '48058', road: '부산 해운대구 센텀중앙로 90'},
    {zip: '35204', road: '대전 서구 둔산로 100'},
]

type IndustryItem = {code: string; name: string}
const MOCK_INDUSTRY: readonly IndustryItem[] = [
    {code: '62010', name: '컴퓨터 프로그래밍 서비스업'},
    {code: '62021', name: '컴퓨터시스템 통합 자문 및 구축 서비스업'},
    {code: '63112', name: '호스팅 및 관련 서비스업'},
    {code: '58221', name: '유선 온라인 게임 소프트웨어 개발 및 공급업'},
    {code: '73101', name: '광고 대행업'},
]

// 모달 안 결과 목록의 선택 버튼(공통 스타일).
const resultButtonClass =
    'hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2'

const AdvancedFields = () => {
    // DatePicker
    const [date, setDate] = useState<Date>()
    // 주소 검색
    const [address, setAddress] = useState<AddressItem>()
    const [addressOpen, setAddressOpen] = useState(false)
    const [addressQuery, setAddressQuery] = useState('')
    // 업종 코드
    const [industry, setIndustry] = useState<IndustryItem>()
    const [industryOpen, setIndustryOpen] = useState(false)
    const [industryQuery, setIndustryQuery] = useState('')

    const addressResults = MOCK_ADDRESSES.filter(
        (item) => item.road.includes(addressQuery) || item.zip.includes(addressQuery),
    )
    const industryResults = MOCK_INDUSTRY.filter(
        (item) => item.name.includes(industryQuery) || item.code.includes(industryQuery),
    )

    return (
        <>
            {/* DatePicker — Popover + Calendar 조합 (shadcn 의 DatePicker 패턴) */}
            <div className="col-span-4 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">DatePicker</h2>
                <Label htmlFor="date-trigger">날짜 선택</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-trigger"
                            variant="outline"
                            className={date ? 'w-full justify-start' : 'text-muted-foreground w-full justify-start'}
                        >
                            <CalendarIcon aria-hidden="true" />
                            {date ? format(date, 'PPP', {locale: ko}) : '날짜를 선택하세요'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} locale={ko} />
                    </PopoverContent>
                </Popover>
            </div>

            {/* 주소 검색 (+ 상세주소) — 검색 버튼 → 모달 → 선택 → input 채움 */}
            <div className="col-span-4 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">주소 검색</h2>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="address">주소</Label>
                    <div className="flex gap-2">
                        <Input
                            id="address"
                            readOnly
                            value={address ? `(${address.zip}) ${address.road}` : ''}
                            placeholder="주소 검색을 눌러주세요"
                            className="flex-1"
                        />
                        <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Search aria-hidden="true" />
                                    주소 검색
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-120">
                                <DialogHeader>
                                    <DialogTitle>주소 검색</DialogTitle>
                                    <DialogDescription>도로명·지번·건물명·우편번호로 검색하세요.</DialogDescription>
                                </DialogHeader>
                                <Input
                                    value={addressQuery}
                                    onChange={(event) => setAddressQuery(event.target.value)}
                                    placeholder="예: 테헤란로"
                                    aria-label="주소 검색어"
                                />
                                <ul className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
                                    {addressResults.map((item) => (
                                        <li key={`${item.zip}-${item.road}`}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAddress(item)
                                                    setAddressOpen(false)
                                                    setAddressQuery('')
                                                }}
                                                className={resultButtonClass}
                                            >
                                                <span className="typo-body-l-regular text-foreground">{item.road}</span>
                                                <span className="typo-caption-regular text-muted-foreground font-mono">
                                                    ({item.zip})
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                    {addressResults.length === 0 && (
                                        <li className="typo-body-l-regular text-muted-foreground px-3 py-6 text-center">
                                            검색 결과가 없습니다.
                                        </li>
                                    )}
                                </ul>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="address-detail">상세주소</Label>
                    <Input id="address-detail" name="address-detail" placeholder="상세주소 (동/호수 등)" />
                </div>
            </div>

            {/* 업종 코드 입력 — 검색 버튼 → 모달 → 선택 → input 채움 */}
            <div className="col-span-4 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">업종 코드</h2>
                <Label htmlFor="industry">업종</Label>
                <div className="flex gap-2">
                    <Input
                        id="industry"
                        readOnly
                        value={industry ? `${industry.code} · ${industry.name}` : ''}
                        placeholder="검색을 눌러 업종을 선택하세요"
                        className="flex-1"
                    />
                    <Dialog open={industryOpen} onOpenChange={setIndustryOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Search aria-hidden="true" />
                                검색
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-120">
                            <DialogHeader>
                                <DialogTitle>업종 코드 검색</DialogTitle>
                                <DialogDescription>업종명 또는 코드로 검색하세요.</DialogDescription>
                            </DialogHeader>
                            <Input
                                value={industryQuery}
                                onChange={(event) => setIndustryQuery(event.target.value)}
                                placeholder="예: 소프트웨어 / 62010"
                                aria-label="업종 검색어"
                            />
                            <ul className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
                                {industryResults.map((item) => (
                                    <li key={item.code}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIndustry(item)
                                                setIndustryOpen(false)
                                                setIndustryQuery('')
                                            }}
                                            className={resultButtonClass}
                                        >
                                            <span className="typo-body-l-regular text-foreground">{item.name}</span>
                                            <span className="typo-caption-regular text-muted-foreground font-mono">
                                                {item.code}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                                {industryResults.length === 0 && (
                                    <li className="typo-body-l-regular text-muted-foreground px-3 py-6 text-center">
                                        검색 결과가 없습니다.
                                    </li>
                                )}
                            </ul>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export default AdvancedFields
