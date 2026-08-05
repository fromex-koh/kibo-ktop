import FullPageServiceStatus from '@/components/custom/full-page-service-status'

// Header·Footer를 포함하지 않는 공통 전체 화면 404 UI.
// /corp/not-found와 /org/not-found 미리보기에서 재사용하며, 실제 fallback 전환 시 각 라우트의 not-found.tsx에서 렌더링한다.
const FullPageNotFound = () => (
    <FullPageServiceStatus
        titleId="not-found-title"
        title="찾으시는 페이지가 없습니다."
        description={
            <>
                페이지 주소가 잘못 입력되었거나, 변경, 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.{' '}
                {/* xl 이상에서는 안내문을 시안이 의도한 위치에서 나누고, 작은 화면에서는 자연스럽게 줄바꿈한다. */}
                <span className="xl:block">입력하신 주소가 정확한지 다시 한번 확인해 주세요.</span>
            </>
        }
    />
)

export default FullPageNotFound
