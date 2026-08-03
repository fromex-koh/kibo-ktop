import FullPageServiceStatus from '@/components/custom/full-page-service-status'

// Header·Footer를 포함하지 않는 공통 전체 화면 500 UI.
// /corp/server-error와 /org/server-error 미리보기에서 재사용하며, 실제 오류 처리 시 각 라우트의 error.tsx에서 렌더링한다.
const FullPageServerError = () => (
    <FullPageServiceStatus
        titleId="server-error-title"
        title="잠시 후 다시 확인해 주세요."
        // 문장별 block을 유지해 넓은 화면에서는 읽기 순서를 분명히 하고, 좁은 화면에서는 각 문장 안에서 줄바꿈한다.
        description={
            <>
                <span className="block">지금 이 서비스와 연결할 수 없습니다.</span>
                <span className="block">문제를 해결하기 위해 열심히 노력을 하고 있습니다.</span>
                <span className="block">잠시 후 다시 확인해 주세요.</span>
            </>
        }
    />
)

export default FullPageServerError
