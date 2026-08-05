import {AuthFlowPage} from '@/components/custom/auth-flow-page'
import {InquiryCancelDialog} from '@/components/custom/inquiry-form'

// 문의 취소 화면 확인용 페이지. 중앙 콘텐츠는 비우고 취소 모달만 기본 노출한다.
const InquiryCancelPage = () => (
    <>
        <AuthFlowPage>
            <p className="typo-body-xl-regular text-label-foreground py-10">
                문의하기 화면에서 취소 버튼을 클릭하면 노출되는 작성 취소 모달입니다.
            </p>
        </AuthFlowPage>
        <InquiryCancelDialog cancelHref="/" defaultOpen showTrigger={false} />
    </>
)

export {InquiryCancelPage}
