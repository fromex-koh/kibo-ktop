'use client'

import {useState, type ReactNode} from 'react'
import Link from 'next/link'
import {Info} from 'lucide-react'
import {ClearableInput} from '@/components/composite/clearable-input'
import {EmptyState} from '@/components/composite/empty-state'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 우편번호 검색 모달 — 주소를 받는 화면이 함께 쓴다(회원가입 흐름의 우편번호 검색 · 자가진단의 기업 주소).
//
// 본문은 Kakao(다음) 우편번호 위젯이 들어올 자리다. 기본은 그 자리를 비워 두고(연동 지점을 그대로 보여준다),
// 고른 주소를 화면의 입력칸에 채워야 하는 곳에서만 mockSearch 로 같은 흐름의 임시 검색 UI 를 켠다.
//
// [프론트엔드 연동] 위젯을 붙일 때는 본문(빈 자리 또는 임시 검색 UI)만 위젯으로 바꾸면 된다. 위젯의
// onComplete 결과를 그대로 onSelect 로 넘기면 되도록 값의 모양을 위젯 응답에 맞춰 두었다.
type PostcodeAddress = {
    /** 우편번호 5자리(위젯의 zonecode). */
    zonecode: string
    /** 도로명주소(위젯의 roadAddress). */
    roadAddress: string
    /** 지번주소(위젯의 jibunAddress). */
    jibunAddress: string
}

// 목업 — 실제 목록은 Kakao 위젯이 준다.
const ADDRESSES: PostcodeAddress[] = [
    {zonecode: '48400', roadAddress: '부산 남구 문현금융로 33', jibunAddress: '부산 남구 문현동 1229'},
    {zonecode: '48058', roadAddress: '부산 해운대구 센텀중앙로 97', jibunAddress: '부산 해운대구 재송동 1200'},
    {zonecode: '06236', roadAddress: '서울 강남구 테헤란로 132', jibunAddress: '서울 강남구 역삼동 823'},
    {zonecode: '07327', roadAddress: '서울 영등포구 여의대로 108', jibunAddress: '서울 영등포구 여의도동 27'},
    {zonecode: '13529', roadAddress: '경기 성남시 분당구 판교역로 235', jibunAddress: '경기 성남시 분당구 삼평동 681'},
    {zonecode: '34126', roadAddress: '대전 유성구 대학로 291', jibunAddress: '대전 유성구 구성동 373-1'},
    {zonecode: '41959', roadAddress: '대구 중구 국채보상로 670', jibunAddress: '대구 중구 동인동1가 2-1'},
    {zonecode: '61947', roadAddress: '광주 서구 상무중앙로 110', jibunAddress: '광주 서구 치평동 1200'},
]

// 위젯 자리를 그대로 둔 모달 화면 — 임시 검색 UI를 켠 곳에서 "실제로 들어갈 모양"으로 가리킨다.
const ADDRESS_SEARCH_PATH = '/corp/technology-evaluation/ktrs-fm/company-info/address-search'

// 검색 — 우편번호·도로명·지번 어느 쪽이든 걸리면 결과에 담는다. 검색어가 비면 전체를 보여 준다.
const searchAddresses = (keyword: string) => {
    const trimmed = keyword.trim()
    if (!trimmed) return ADDRESSES

    return ADDRESSES.filter((address) =>
        [address.zonecode, address.roadAddress, address.jibunAddress].some((value) => value.includes(trimmed)),
    )
}

type PostcodeSearchDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때. */
    defaultOpen?: boolean
    /** 모달 제목. 부르는 버튼과 같은 말을 쓴다(주소 검색 버튼 → "주소 검색"). */
    title?: string
    /**
     * 위젯 자리 대신 화면 확인용 임시 검색 UI를 넣는다 — 고른 주소로 화면의 입력칸이 채워지는 것까지
     * 보여야 하는 곳에서만 켠다(자가진단 기업정보). 위젯을 붙일 때 함께 걷어낸다.
     */
    mockSearch?: boolean
    /** 주소를 고르면 그 값을 넘기고 모달이 닫힌다. 넘기지 않으면 닫히기만 한다. */
    onSelect?: (address: PostcodeAddress) => void
}

const PostcodeSearchDialog = ({
    children,
    defaultOpen,
    title = '우편번호 검색',
    mockSearch,
    onSelect,
}: PostcodeSearchDialogProps) => {
    const [open, setOpen] = useState(Boolean(defaultOpen))
    const [keyword, setKeyword] = useState('')
    // null = 아직 검색하지 않음. 빈 배열 = 검색했지만 결과 없음 — 둘 다 같은 빈 상태를 보여 준다.
    const [results, setResults] = useState<PostcodeAddress[] | null>(null)

    // 닫을 때 처음 상태로 되돌린다 — 다음에 열었을 때 지난 검색이 남아 있으면 혼란스럽다.
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (nextOpen) return

        setKeyword('')
        setResults(null)
    }

    const select = (address: PostcodeAddress) => {
        onSelect?.(address)
        handleOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 위젯이 들어올 자리라 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {/* CTA 가 없으므로 아래 여백 40 은 본문이 갖는다. */}
                {mockSearch ? (
                    <div className={cn(dialogBodyClassName, 'gap-6 pb-10')}>
                        {/* 목업임을 화면에서도 알린다 — 검토자가 이 목록을 실제 주소 데이터로 오해하지 않도록.
                        위젯을 붙이면 이 안내와 아래 목록을 함께 걷어낸다. */}
                        <Alert variant="outline" color="info">
                            <Info aria-hidden="true" />
                            <AlertDescription>
                                화면 확인용으로 넣은 임시 목록입니다. 실제 서비스에서는 주소 찾기 API(Kakao 우편번호
                                서비스)를 연결해 사용합니다. 목업 주소를 보려면{' '}
                                <strong className="text-foreground font-bold">남구</strong>로 검색해 보세요.
                                <br />
                                실제 서비스에 들어갈 모달은{' '}
                                <Link
                                    href={ADDRESS_SEARCH_PATH}
                                    className="text-primary outline-ring focus-visible:outline-ring rounded-2xs underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    주소 찾기 화면
                                </Link>
                                (<code className="font-mono">{ADDRESS_SEARCH_PATH}</code>)을 참고해 주세요.
                            </AlertDescription>
                        </Alert>
                        {/* Enter 로도 검색되게 한다 — 검색창에서 가장 먼저 눌러 보는 키다. */}
                        <div className="flex items-start gap-2">
                            <ClearableInput
                                id="postcode-keyword"
                                name="postcodeKeyword"
                                autoComplete="off"
                                aria-label="도로명 · 지번 · 우편번호"
                                placeholder="도로명, 지번, 건물명을 입력해 주세요"
                                value={keyword}
                                onChange={(event) => setKeyword(event.currentTarget.value)}
                                onKeyDown={(event) => {
                                    if (event.key !== 'Enter') return

                                    event.preventDefault()
                                    setResults(searchAddresses(keyword))
                                }}
                                className="min-w-0 flex-1"
                            />
                            <Button
                                type="button"
                                size="md"
                                className="shrink-0"
                                onClick={() => setResults(searchAddresses(keyword))}
                            >
                                검색
                            </Button>
                        </div>
                        {results?.length ? (
                            // 고르는 목록이라 각 줄을 버튼으로 둔다 — 클릭·키보드·읽어 주기가 모두 기본 동작이다[6.1.1].
                            <ul className="flex list-none flex-col">
                                {results.map((address) => (
                                    <li key={address.zonecode} className="border-subtle-3 border-b first:border-t">
                                        <button
                                            type="button"
                                            onClick={() => select(address)}
                                            className="interactive:hover:bg-surface-subtle focus-visible:outline-ring flex w-full flex-col gap-1 px-4 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2"
                                        >
                                            <span className="typo-body-l-bold text-foreground">{address.zonecode}</span>
                                            <span className="typo-body-xl-regular text-label-foreground">
                                                {address.roadAddress}
                                            </span>
                                            <span className="typo-body-l-regular text-foreground-subtle">
                                                [지번] {address.jibunAddress}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState title="검색내역이 없습니다." className="min-h-72" />
                        )}
                    </div>
                ) : (
                    // 위젯이 들어올 빈 자리 — 연동 지점을 그대로 보여 준다.
                    <div className={cn(dialogBodyClassName, 'pb-10')}>
                        <p className="bg-accent-subtle typo-title-l-bold text-foreground flex min-h-100 items-center justify-center text-center">
                            Kakao(다음) 우편번호 검색 영역
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export {PostcodeSearchDialog}
export type {PostcodeAddress}
