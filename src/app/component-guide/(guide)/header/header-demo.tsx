import Header, {type HeaderNavigationByUserType, type HeaderUser, type UserType} from '@/components/composite/header'

// 컴포넌트 가이드에서 실제 Header의 상태별 모습을 확인하기 위한 데모 래퍼.
const HeaderDemo = ({
    overlay = false,
    showThemeToggle = true,
    navigationByUserType,
    userType,
    user,
}: {
    overlay?: boolean
    showThemeToggle?: boolean
    navigationByUserType?: HeaderNavigationByUserType
    userType?: UserType
    user?: HeaderUser
}) => (
    // 가이드 셸의 sticky 앱바와 데모 Header가 화면 상단에서 겹치지 않도록 미리보기에서만 문서 흐름에 둔다.
    <div className="border-border bg-background overflow-hidden rounded-lg border [&>header]:!static [&>header]:!inset-auto [&>header]:!z-auto">
        <Header
            overlay={overlay}
            showThemeToggle={showThemeToggle}
            showUserTypeToggle={!user}
            navigationByUserType={navigationByUserType}
            userType={userType}
            user={user}
        />
    </div>
)

export default HeaderDemo
