import Link from 'next/link'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {BaseCard} from '@/components/composite/base-card'
import {ActionCheck} from '@/components/custom/action-check'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'

// 1:1 문의 등록 완료 — 시안 "[알림마당] 문의하기_완료"(40006769:24553).
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
    // 제목바에서 완료 표시까지는 시안이 100 이다 — 화면 공통 간격(40)에 60 을 더한다.
    <div className="flex flex-col gap-15 pt-15">
        <div className="flex flex-col items-center gap-6">
            {/* 애니메이션은 장식이다 — 완료 사실은 바로 아래 제목이 글로 전달한다. */}
            <ActionCheck decorative size={150} />
            <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="typo-h2-bold text-foreground break-keep">문의가 등록되었어요</h2>
                <p className="typo-title-m-regular text-foreground-subtle break-keep">
                    정확한 내용으로 안내드릴테니 조금만 기다려 주세요
                </p>
            </div>
        </div>

        {/* 안내 카드 여백은 시안대로 좌우 40 · 위아래 32 다. */}
        <BaseCard variant="outlined" className="py-8 [--card-spacing:--spacing(10)]">
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

        <ActionBar>
            <ActionBarCenter className="gap-4">
                <Button asChild variant="tertiary" size="xl">
                    <Link href={homeHref}>홈으로 이동</Link>
                </Button>
                <Button asChild size="xl">
                    <Link href={myPageHref}>마이페이지로 이동</Link>
                </Button>
            </ActionBarCenter>
        </ActionBar>
    </div>
)

export {InquiryComplete}
export type {InquiryCompleteProps}
