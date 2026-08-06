import Link from 'next/link'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {BaseCard} from '@/components/composite/base-card'
import {ActionCheck} from '@/components/custom/action-check'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'

// 문의하기 완료 — 시안 "[알림마당] 문의하기_완료"(40006769:24553).
// 기존 컴포넌트 조합이다: ActionCheck(완료 애니메이션) · BaseCard(안내) · ListMarker(글머리) · ActionBar/Button(CTA).
// 시안의 success-check 이미지는 프로젝트의 완료 애니메이션으로 대체한다 — 화면 진입 시 한 번 재생하고
// 체크 프레임에서 멈추며, 모션 감소 설정이면 완료 프레임만 바로 보여준다.

// 등록 후 안내 문구 — 시안 "알려드려요" 목록.
const NOTICE_ITEMS: readonly string[] = [
    '문의 내용과 답변은 마이페이지 > 1:1 문의내역 또는 이메일로 확인할 수 있어요',
    '문의 내용에 따라 답변까지 시간이 소요될 수 있어요',
]

type InquiryCompleteProps = {
    // 마이페이지 이동 경로(1:1 문의내역).
    myPageHref: string
    // 홈 이동 경로.
    homeHref?: string
}

const InquiryComplete = ({myPageHref, homeHref = '/'}: InquiryCompleteProps) => (
    <div className="flex flex-col gap-[clamp(--spacing(4),3.7dvh,--spacing(10))] pt-[clamp(--spacing(2),2dvh,--spacing(15))] [--viewport-fit-decorative-size:clamp(var(--spacing-viewport-fit-decorative-min),14dvh,var(--spacing-action-check))]">
        <div className="flex flex-col items-center gap-[clamp(--spacing(2),1.5dvh,--spacing(6))]">
            {/* 애니메이션은 장식이다 — 완료 사실은 바로 아래 제목이 글로 전달한다. */}
            <ActionCheck decorative />
            <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="typo-h2-bold text-foreground break-keep">문의가 등록되었어요</h2>
                <p className="typo-title-m-regular text-foreground-subtle break-keep">
                    정확한 내용으로 안내드릴테니 조금만 기다려 주세요
                </p>
            </div>
        </div>

        {/* 화면 높이가 낮아지면 안내 카드의 상하 여백을 줄여 한 화면에 배치한다. */}
        <BaseCard
            variant="outlined"
            className="shrink-0 py-[clamp(--spacing(4),3dvh,--spacing(8))] [--card-spacing:--spacing(10)]"
        >
            <div className="flex flex-col gap-4">
                <h3 className="typo-title-l-bold text-foreground">알려드려요</h3>
                <ul className="flex flex-col gap-2">
                    {NOTICE_ITEMS.map((item) => (
                        <li key={item} className="typo-body-xl-regular text-foreground-subtle flex break-keep">
                            <ListMarker type="unordered" level={1} />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </BaseCard>

        <ActionBar className="shrink-0">
            <ActionBarCenter className="gap-4 max-sm:col-span-3 max-sm:col-start-1 max-sm:w-full max-sm:flex-col">
                <Button asChild variant="tertiary" size="xl" className="w-full sm:w-auto">
                    <Link href={homeHref}>홈으로 이동</Link>
                </Button>
                <Button asChild size="xl" className="w-full sm:w-auto">
                    <Link href={myPageHref}>마이페이지로 이동</Link>
                </Button>
            </ActionBarCenter>
        </ActionBar>
    </div>
)

export {InquiryComplete}
export type {InquiryCompleteProps}
