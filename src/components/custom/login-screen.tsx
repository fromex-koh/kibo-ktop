'use client'

import {useState, type FormEvent} from 'react'
import Image, {type StaticImageData} from 'next/image'
import Link from 'next/link'
import bankBuildingImage from '@public/images/login/bank-building.webp'
import officeBuildingImage from '@public/images/login/office-building.webp'
import {ArrowUpRight, CircleAlert} from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {LoginAgencySignUpGuideDialog} from '@/components/composite/login-agency-signup-guide-dialog'
import {LoginFindAccountDialog} from '@/components/composite/login-find-account-dialog'
import {breadcrumbPillClassName} from '@/components/theme/breadcrumb.variants'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {PasswordInput} from '@/components/composite/password-input'
import {ListMarker} from '@/components/custom/list-marker'
import {
    memberTypeTabClassName,
    memberTypeTabIllustrationClassName,
    memberTypeTabListClassName,
} from '@/components/theme/member-type-tabs.variants'
import {KIBO_ONE_PLATFORM_URL} from '@/constants/site'

// 로그인 화면 — 회원 유형(기업회원 · 기관회원)을 고르고 유형에 맞는 방법으로 로그인한다.
// 한 주소(/corp/auth · /org/auth)에서 탭으로 유형을 오간다 — 주소는 바뀌지 않는다.
//
// 짜임(세로): 제목 묶음(로그인 48 · 안내 20) → 40 → 유형 탭 → 24 → 유형별 카드 → 24 → 아래 안내 줄.
//   내용 폭은 792 로 묶고 가운데에 둔다. 카드 안쪽 폭은 588 이다.
//   좁은 화면(md 미만)은 탭이 높이 48 알약 두 개로, 카드 여백이 24 로 줄어든다.
//
// 기업회원은 기보 ONE 플랫폼(외부 사이트)에서 로그인하고 돌아오므로 이 화면에 입력 칸이 없다.
// 기관회원만 아이디 · 비밀번호를 여기서 받는다.
//
// [프론트엔드 연동]
//   · 기업회원 — [기보 ONE 플랫폼으로 이동하여 로그인]의 주소를 백엔드가 준 로그인 진입 주소로 바꾼다
//     (복귀 주소 redirect 가 붙는다). 상수는 constants/site.ts 의 KIBO_ONE_PLATFORM_URL.
//   · 기관회원 — 지금은 화면만 있는 form 이다. onSubmit 에 로그인 요청을 잇고, 실패하면 아래 오류 문구를
//     role="alert" 자리에 채운다(LoginErrorMessage). '아이디 저장'은 아이디만 로컬에 남기는 값이다.
//   · 회원가입 · 아이디/비밀번호 찾기 경로는 해당 화면이 생기면 href 를 바꾼다.

type MemberType = 'corp' | 'org'

// 화면을 여는 사용자 유형 — 기업(/corp/auth) · 기관(/org/auth) 두 경로가 같은 화면을 쓰고,
// 브레드크럼의 홈 주소만 갈린다(회원 유형 탭은 이 값과 무관하다).
type LoginUserType = 'corp' | 'org'

const MEMBER_TABS = [
    {id: 'corp', label: '기업회원', image: officeBuildingImage},
    {id: 'org', label: '기관회원', image: bankBuildingImage},
] as const satisfies readonly {id: MemberType; label: string; image: StaticImageData}[]

const LOGIN_TITLE = '로그인'
const LOGIN_DESCRIPTION = '회원 유형을 선택하고 로그인해 주세요.'

// 기업회원 — 외부 통합 인증 안내.
const CORP_SUBTITLE = '기보 ONE 플랫폼 통합 로그인 (중소벤처기업부 통합 인증 서비스)'
const CORP_NOTICE_ITEMS = [
    '기업회원은 기보 ONE 플랫폼 통합 계정으로 K-TOP에 로그인합니다.',
    '아래 버튼을 클릭하면 기보 ONE 플랫폼 로그인 페이지로 이동합니다.',
] as const
const CORP_CTA_LABEL = '기보 ONE 로그인'
const CORP_CTA_NOTE = `기보 ONE 플랫폼(${KIBO_ONE_PLATFORM_URL}) 로그인 후,`
const CORP_CTA_NOTE_SECOND = 'K-TOP으로 이동하셔야 로그인이 완료됩니다.'
const CORP_SIGN_UP_QUESTION = '계정이 없으신가요?'
const CORP_SIGN_UP_LABEL = '기보 ONE 플랫폼 회원가입'

// 기관회원 — 아이디 · 비밀번호 로그인.
const ORG_SUBTITLE = '아이디 · 비밀번호 로그인'
const ORG_ID_LABEL = '아이디'
const ORG_ID_PLACEHOLDER = '아이디를 입력하세요'
const ORG_PASSWORD_LABEL = '비밀번호'
const ORG_PASSWORD_PLACEHOLDER = '비밀번호를 입력하세요'
const ORG_REMEMBER_LABEL = '아이디 저장'
const ORG_FIND_LABEL = '아이디 · 비밀번호 찾기'
const ORG_SUBMIT_LABEL = '로그인'
const ORG_ID_EMPTY_ERROR = '아이디를 입력해주세요.'
const ORG_PASSWORD_EMPTY_ERROR = '비밀번호를 입력해주세요.'
// 로그인 실패 — 칸 하나가 아니라 아이디 · 비밀번호 조합이 틀린 것이라 [로그인] 버튼 위 안내 상자로 알린다.
const ORG_LOGIN_FAILED_ERROR = '아이디 또는 비밀번호가 올바르지 않습니다. 입력한 정보를 다시 확인해 주세요.'
const ORG_SIGN_UP_QUESTION = '아직 회원이 아니신가요?'
const ORG_SIGN_UP_LABEL = '회원가입'

// [프론트엔드 연동] 아직 화면이 없는 링크의 임의 주소 — 접근성 검사 경고를 피하려고 넣어 둔 값이다.
// 실제 주소로 바꾼다(나란한 링크가 같은 주소면 '중복 링크'로 잡힌다).
const KIBO_ONE_SIGN_UP_HREF = '/sign-up/kibo-one'

// 카드 안쪽 폭 588 — 카드(792)의 좌우 여백까지 더하면 시안의 102 가 된다. 좁은 화면에서는 여백만 24 로 줄고 폭은 칸을 채운다.
const cardClassName = 'bg-card mx-auto flex w-full flex-col rounded-lg p-6 md:p-12'
const cardInnerClassName = 'mx-auto flex w-full max-w-147 flex-col gap-6'

// 카드 머리 — 유형 이름(24 Bold)과 로그인 방법 한 줄.
const PanelHeader = ({title, description}: {title: string; description: string}) => (
    <div className="flex flex-col gap-1">
        <h2 className="typo-h4-bold text-foreground break-keep">{title}</h2>
        <p className="typo-body-xl-regular text-foreground-subtle break-keep">{description}</p>
    </div>
)

// 카드 아래 한 줄 — "계정이 없으신가요? [회원가입]". 질문과 버튼이 한 문장처럼 읽히도록 나란히 둔다.
// 카드 아래 한 줄 — 질문과 버튼이 한 문장처럼 읽히도록 나란히 둔다.
// href 를 주면 링크, 주지 않으면 사용처가 감싼 모달 트리거로 쓴다.
const SignUpNotice = ({question, label, href}: {question: string; label: string; href?: string}) => (
    <p className="typo-body-xl-regular text-foreground-subtle flex flex-wrap items-center justify-center gap-2 break-keep">
        {question}
        {/* size md — 시안의 button_text 는 16/24 이고, 회원가입 글자만 Bold 다. */}
        <Button
            asChild={Boolean(href)}
            type={href ? undefined : 'button'}
            variant="text-underline"
            size="md"
            aria-haspopup={href ? undefined : 'dialog'}
            className="text-foreground font-bold"
        >
            {href ? <Link href={href}>{label}</Link> : label}
        </Button>
    </p>
)

// 기업회원 — 안내 상자 + 외부 사이트로 나가는 버튼.
const CorpLoginPanel = () => (
    <div className={cardInnerClassName}>
        <PanelHeader title={MEMBER_TABS[0].label} description={CORP_SUBTITLE} />
        {/* 안내 상자 — 제목 없이 목록만 담는다(옅은 회색 면 · 여백 20). 공통 InfoBox 는 제목 슬롯과 16 글자를
            전제하므로 쓰지 않는다. 마커는 14 글자 줄(21)에 맞는 작은 점이다. */}
        <ul className="bg-surface-subtle typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2 rounded-sm p-5">
            {CORP_NOTICE_ITEMS.map((item) => (
                <li key={item} className="flex">
                    <ListMarker type="unordered-small" />
                    <span className="min-w-0 break-keep">{item}</span>
                </li>
            ))}
        </ul>
        {/* 버튼 위만 48 을 둔다(안내 상자와 떨어뜨린다) — 카드 안 기본 사이 간격은 24 다. */}
        <div className="flex flex-col gap-2 pt-6">
            {/* 외부 사이트로 나가는 링크라 next/link 가 아니라 <a> 를 쓴다[NA-006 예외]. 새 창이 아니라
                같은 창에서 이동했다가 로그인 뒤 돌아오는 흐름이다. */}
            <Button asChild size="xl" className="w-full">
                <a href={KIBO_ONE_PLATFORM_URL}>
                    {CORP_CTA_LABEL}
                    <ArrowUpRight aria-hidden="true" />
                </a>
            </Button>
            <p className="typo-body-m-regular text-foreground-subtle text-center break-keep">
                {CORP_CTA_NOTE}
                <br />
                {CORP_CTA_NOTE_SECOND}
            </p>
        </div>
    </div>
)

// 기관회원 — 아이디 · 비밀번호 입력.
//
// 오류는 자리가 둘이다.
//   · errors    — 칸별 오류. 그 칸 바로 아래에 붙는다(빈 값 검사).
//   · formError — 폼 전체 오류. [로그인] 버튼 위 안내 상자에 붙는다(아이디 · 비밀번호 불일치 등).
//
// [프론트엔드 연동] 지금 들어 있는 것은 오류 문구의 생김새를 확인하려고 둔 목업이다.
//   1. 빈 값 검사만 진짜로 돈다 → 자리 수 · 허용 문자 같은 칸별 검사를 nextErrors 에 이어 붙인다.
//   2. 빈 값이 아니면 무조건 로그인 실패 문구를 보인다(MOCK) → 아래 표시한 자리를 로그인 API 호출로 바꾸고,
//      응답이 실패일 때만 setFormError(ORG_LOGIN_FAILED_ERROR), 성공이면 setFormError('') 뒤 이동시킨다.
const OrgLoginPanel = () => {
    const [errors, setErrors] = useState<{loginId?: string; password?: string}>({})
    const [formError, setFormError] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const loginId = String(formData.get('loginId') ?? '').trim()
        const password = String(formData.get('password') ?? '')
        const nextErrors = {
            loginId: loginId ? undefined : ORG_ID_EMPTY_ERROR,
            password: password ? undefined : ORG_PASSWORD_EMPTY_ERROR,
        }
        setErrors(nextErrors)
        if (nextErrors.loginId || nextErrors.password) {
            setFormError('')
            return
        }
        // ↓ [퍼블리싱 확인용] 이 줄을 로그인 API 호출로 바꾼다. 지금은 값이 있으면 늘 실패로 둔다.
        setFormError(ORG_LOGIN_FAILED_ERROR)
    }

    return (
        <form noValidate onSubmit={handleSubmit} className={cardInnerClassName}>
            <PanelHeader title={MEMBER_TABS[1].label} description={ORG_SUBTITLE} />
            <div className="flex flex-col gap-6">
                {/* 오류가 있으면 Field 에 data-invalid, 칸에 aria-invalid, 문구는 aria-describedby 로 잇는다[7.4.2]. */}
                <Field data-invalid={errors.loginId ? true : undefined}>
                    <FieldLabel htmlFor="login-id" className="text-foreground font-bold">
                        {ORG_ID_LABEL}
                    </FieldLabel>
                    <Input
                        id="login-id"
                        name="loginId"
                        autoComplete="username"
                        placeholder={ORG_ID_PLACEHOLDER}
                        aria-invalid={errors.loginId ? true : undefined}
                        aria-describedby={errors.loginId ? 'login-id-error' : undefined}
                    />
                    {errors.loginId ? <FieldError id="login-id-error">{errors.loginId}</FieldError> : null}
                </Field>
                <Field data-invalid={errors.password ? true : undefined}>
                    <FieldLabel htmlFor="login-password" className="text-foreground font-bold">
                        {ORG_PASSWORD_LABEL}
                    </FieldLabel>
                    <PasswordInput
                        id="login-password"
                        name="password"
                        autoComplete="current-password"
                        placeholder={ORG_PASSWORD_PLACEHOLDER}
                        aria-invalid={errors.password ? true : undefined}
                        aria-describedby={errors.password ? 'login-password-error' : undefined}
                    />
                    {errors.password ? <FieldError id="login-password-error">{errors.password}</FieldError> : null}
                </Field>
            </div>
            {/* 아이디 저장과 찾기 링크 — 좁은 화면에서는 줄이 바뀌어도 서로 겹치지 않게 gap 을 둔다[6.1.3]. */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                {/* 체크박스 이름은 aria-labelledby 로 잇는다 — Radix 체크박스는 button 이라 label[for] 만으로는
                    검사 도구가 이름 없는 버튼으로 본다(다른 화면의 체크박스와 같은 방식). */}
                <div className="flex items-center gap-2">
                    <Checkbox id="login-remember" name="remember" aria-labelledby="login-remember-label" />
                    <label
                        id="login-remember-label"
                        htmlFor="login-remember"
                        className="typo-body-xl-regular text-label-foreground cursor-pointer"
                    >
                        {ORG_REMEMBER_LABEL}
                    </label>
                </div>
                {/* 찾기 · 회원가입은 화면 이동이 아니라 안내 모달을 연다. */}
                <LoginFindAccountDialog>
                    <Button type="button" variant="text-underline" size="md" aria-haspopup="dialog">
                        {ORG_FIND_LABEL}
                    </Button>
                </LoginFindAccountDialog>
            </div>
            {/* 폼 전체 오류 — 테두리 상자에 경고 아이콘과 함께 담는다. 값이 생기면 그 자리에서 바로 읽힌다
                (role="alert")[7.4.2]. 칸 오류와 달리 어느 칸이 틀렸는지 알리지 않으므로 입력에 aria-invalid 를 걸지 않는다.
                아이콘은 EmptyState 와 같은 방식으로 채운 원을 만든다 — lucide 에 채움 아이콘이 없다[NA-008]. */}
            {formError ? (
                <div
                    role="alert"
                    className="border-subtle-3 typo-body-m-regular text-field-error-foreground flex min-h-12 items-center justify-center gap-1 rounded-sm border px-4 py-2 text-center"
                >
                    <CircleAlert
                        aria-hidden="true"
                        className="size-icon-sm [&>line]:stroke-card shrink-0 [&>circle]:fill-current"
                    />
                    <span className="min-w-0 break-keep">{formError}</span>
                </div>
            ) : null}
            {/* 로그인 버튼 위만 48 을 둔다(앞 줄과 떨어뜨린다) — form 의 기본 사이 간격은 24 다. */}
            <div className="flex flex-col pt-6">
                <Button type="submit" size="xl" className="w-full">
                    {ORG_SUBMIT_LABEL}
                </Button>
            </div>
        </form>
    )
}

const LoginScreen = ({userType}: {userType: LoginUserType}) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 pb-15 *:col-span-full">
            {/* 브레드크럼만 둔다 — 화면 제목은 가운데 묶음이 맡으므로 왼쪽 제목을 두면 같은 말이 두 번 나온다.
                좁은 화면(md 미만)에서는 시안대로 감춘다 — 가운데 제목이 바로 오고 경로는 헤더로 돌아갈 수 있다. */}
            <div className="hidden justify-end md:flex">
                <div className={breadcrumbPillClassName}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${userType}/home`}>홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{LOGIN_TITLE}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
            <div className="mx-auto flex w-full max-w-198 flex-col">
                {/* 가운데 제목 묶음 — 페이지 제목(위 PageTitleBar)과 같은 말이라 h2 로 두어 제목 단계를 지킨다[6.4.2].
                    아래 여백만 넓다(좁은 화면 40 · md 부터 80). 나머지 사이는 24 다. */}
                <div className="flex flex-col items-center gap-1 pb-10 text-center md:pb-20">
                    <h1 className="typo-display-l-bold text-foreground break-keep">{LOGIN_TITLE}</h1>
                    <p className="typo-title-l-regular text-label-foreground break-keep">{LOGIN_DESCRIPTION}</p>
                </div>

                {/* 회원 유형 탭 — 한 화면에서 유형만 바꾼다. 목록 · 좌우 화살표 이동 · 패널 연결은 공통 Tabs 가 맡는다[8.2.1]. */}
                <Tabs defaultValue={MEMBER_TABS[0].id} className="gap-6">
                    {/* variant="plain" — 공통 탭의 표면 스타일을 비우고 이 화면의 카드 · 알약 모양을 얹는다. */}
                    <TabsList variant="plain" aria-label="회원 유형" className={memberTypeTabListClassName}>
                        {MEMBER_TABS.map((tab) => (
                            <TabsTrigger key={tab.id} value={tab.id} className={memberTypeTabClassName}>
                                {/* 유형 그림 — 옆에 유형 이름이 있어 장식이다(alt="")[5.1.1]. 좁은 화면에서는 그리지 않는다. */}
                                <Image
                                    src={tab.image}
                                    alt=""
                                    sizes="96px"
                                    className={memberTypeTabIllustrationClassName}
                                />
                                <span className="truncate">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value={MEMBER_TABS[0].id} className="flex flex-col gap-6">
                        <div className={cardClassName} data-slot="login-card">
                            <CorpLoginPanel />
                        </div>
                        <SignUpNotice
                            question={CORP_SIGN_UP_QUESTION}
                            label={CORP_SIGN_UP_LABEL}
                            href={KIBO_ONE_SIGN_UP_HREF}
                        />
                    </TabsContent>

                    <TabsContent value={MEMBER_TABS[1].id} className="flex flex-col gap-6">
                        <div className={cardClassName} data-slot="login-card">
                            <OrgLoginPanel />
                        </div>
                        <LoginAgencySignUpGuideDialog>
                            <SignUpNotice question={ORG_SIGN_UP_QUESTION} label={ORG_SIGN_UP_LABEL} />
                        </LoginAgencySignUpGuideDialog>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </main>
)

export {LoginScreen}
export type {LoginUserType, MemberType}
