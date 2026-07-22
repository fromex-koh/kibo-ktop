import Image from 'next/image'
import Link from 'next/link'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

const MARQUEE_TEXT = 'Korea Technology-rating Open platform'

// 관련사이트 목록 — 이동 대상 확정 전 목업 값.
const FAMILY_SITES = [
    {value: 'kibo', label: '기술보증기금'},
    {value: 'mss', label: '중소벤처기업부'},
    {value: 'smes', label: '중소벤처24'},
]

const FOOTER_LINKS: {label: string; emphasized?: boolean}[] = [
    {label: '플랫폼 소개'},
    {label: '이용약관'},
    {label: '가격 정책'},
    {label: '개인정보처리방침', emphasized: true},
    {label: '공지사항/FAQ'},
]

// 페이지 하단 — 흐르는 마키 문구(다크 밴드) + 화이트 푸터(시안 type A_01 하단 영역).
// snap-end: 스냅 페이지 흐름의 마지막 정착 지점이 푸터 하단에 맞도록 한다.
// relative + bg-background: fixed 히어로 위에 그려지도록 포지셔닝하고 마키 밴드 뒤를 불투명하게 덮는다.
// 마키는 장식 요소라 접근성 트리에서 제외하고, 감속 모션 선호 시 정지한다. [KWCAG 6.3.1]
const MainFooter = () => (
    <div data-stack-page className="bg-background relative snap-end">
        {/* 마키 밴드 — 시안은 다크 배경 위 은은한 대형 문구가 좌측으로 흐른다 */}
        <div aria-hidden="true" className="overflow-hidden py-16">
            {/* PROJECT-STYLE: 140px 대형 장식 타이포는 typo 스케일 밖의 화면 고유 그래픽 요소라
                clamp arbitrary 값을 제한적으로 사용한다(다른 화면에서 재사용 시 토큰 승격). */}
            <div className="main-marquee flex w-max">
                <span className="text-[clamp(4rem,7.3vw,8.75rem)] leading-[1.4] font-black whitespace-nowrap text-white/10">
                    {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
                </span>
                <span className="text-[clamp(4rem,7.3vw,8.75rem)] leading-[1.4] font-black whitespace-nowrap text-white/10">
                    {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
                </span>
            </div>
        </div>

        {/* 푸터 — mainpage 스킨(다크)과 무관하게 항상 화이트 표면이라 구조색(white/black)을 쓴다 */}
        <footer className="bg-white text-black">
            <div className="content-layout flex flex-col gap-12 py-14">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    {/* 시안의 KIBO 기술보증기금 로고 에셋 미확보 — 확보 전까지 라이트 로고로 대체 */}
                    <Link href="#" className="flex items-center">
                        <Image
                            src="/images/logo-light.svg"
                            alt="기술보증기금"
                            width={140}
                            height={32}
                            className="h-auto w-30"
                        />
                    </Link>

                    <nav aria-label="푸터 메뉴">
                        <ul className="flex flex-wrap items-center gap-6">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href="#"
                                        className={
                                            link.emphasized
                                                ? 'typo-body-xl-bold focus-visible:ring-ring focus:outline-none focus-visible:ring-2'
                                                : 'typo-body-xl-regular focus-visible:ring-ring focus:outline-none focus-visible:ring-2'
                                        }
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="flex items-baseline gap-4">
                        <span className="typo-title-m-bold">대표전화</span>
                        <span className="typo-h4-bold">1544-1120</span>
                    </p>
                    <p className="typo-body-xl-regular">평일 09:00 ~ 18:00 (토요일 및 공휴일 휴무)</p>
                    <p className="typo-body-xl-regular">48400 부산광역시 남구 문현금융로 33 기술보증기금</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6">
                    <p className="typo-body-l-regular">
                        ⓒ The Government of the Republic of Korea. All rights reserved.
                    </p>
                    {/* 관련 사이트 — 구조·크기는 가이드의 Select를 그대로 사용하고, 밝은 푸터 표면의 색상만
                        mainpage 전용 main-footer-* 시맨틱 토큰으로 연결한다. */}
                    <Select>
                        <SelectTrigger
                            aria-label="관련 사이트"
                            className="border-main-footer-control bg-main-footer-surface text-main-footer-foreground data-placeholder:text-main-footer-placeholder focus-visible:border-main-footer-focus focus-visible:outline-main-footer-focus data-[state=open]:border-main-footer-focus data-[state=open]:outline-main-footer-focus [&_svg]:text-main-footer-foreground w-full max-w-90"
                        >
                            <SelectValue placeholder="관련 사이트" />
                        </SelectTrigger>
                        <SelectContent className="bg-main-footer-popover text-main-footer-popover-foreground ring-main-footer-control">
                            {FAMILY_SITES.map((site) => (
                                <SelectItem
                                    key={site.value}
                                    value={site.value}
                                    className="focus:bg-main-footer-accent focus:text-main-footer-accent-foreground not-data-[variant=destructive]:focus:**:text-main-footer-accent-foreground"
                                >
                                    {site.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </footer>
    </div>
)

export default MainFooter
