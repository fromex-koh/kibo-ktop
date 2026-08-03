import FullPageServiceStatus from '@/components/custom/full-page-service-status'

// 실제 점검 일정과 문의처로 교체해야 하는 화면 표시용 목업 값.
const MAINTENANCE_PERIOD = '2026-05-22(금) 18:00 ~ 2026-05-22(금) 작업 완료(예정)까지'
const MAINTENANCE_CONTACT = '당직실 : 051-606-7301 / 고객센터 : 1544-1120'

// 점검 일정과 문의처를 안내문과 분리해 표시하는 보조 정보 영역.
const MaintenancePeriodPanel = () => (
    <div className="bg-background flex w-full max-w-198 flex-col items-center gap-4 rounded-lg px-6 py-8">
        <h2 className="typo-title-l-bold">서비스 점검 기간</h2>
        <div className="flex flex-col items-center gap-2">
            <p className="typo-body-xl-regular text-foreground-subtle break-keep">{MAINTENANCE_PERIOD}</p>
            <p className="typo-body-xl-regular text-foreground-subtle break-keep">{MAINTENANCE_CONTACT}</p>
        </div>
    </div>
)

// Header·Footer를 포함하지 않는 공통 전체 화면 정기점검 UI.
// /corp/maintenance와 /org/maintenance 미리보기에서 재사용하며, 실제 점검 공지로 전환할 때 같은 컴포넌트를 렌더링한다.
const FullPageMaintenance = () => (
    <FullPageServiceStatus
        titleId="maintenance-title"
        title="서비스 점검 안내"
        // 문장별 block을 유지해 넓은 화면에서는 읽기 순서를 분명히 하고, 좁은 화면에서는 각 문장 안에서 줄바꿈한다.
        description={
            <>
                <span className="block">보다 안정적인 서비스를 제공하기 위해 시스템 점검을 진행하고 있습니다.</span>
                <span className="block">
                    시스템 점검 시간 동안 홈페이지 및 모든 서비스 이용이 중단되오니, 고객님의 양해 부탁드립니다.
                </span>
                <span className="block">감사합니다.</span>
            </>
        }
        panel={<MaintenancePeriodPanel />}
    />
)

export default FullPageMaintenance
