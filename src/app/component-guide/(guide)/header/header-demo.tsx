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
    <div className="border-border bg-background overflow-hidden rounded-lg border">
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
