import type {FormTabItem} from '@/components/composite/form-tabs'
import CompanyInfoForm from '@/components/composite/company-info-form'
import CareerForm from '@/components/composite/career-form'
import CompanyEtcForm from '@/components/composite/company-etc-form'
import TechStaffForm from '@/components/composite/tech-staff-form'
import RndForm from '@/components/composite/rnd-form'

// 자가진단 2단계(기업·기술정보 입력)의 탭 구성 — 제목과 순서는 시안 값 그대로다.
// 실제 화면과 FormTabs 컴포넌트 가이드가 같은 것을 보도록 여기 한 벌만 둔다.
// (한 화면에 두 번 렌더하면 입력 id 가 겹치므로 페이지마다 한 번만 쓴다.)
//
// 작성 상태(미작성·작성중·작성완료)는 적지 않는다 — 그 탭에 입력한 값에서 FormTabs 가 계산한다.
const SELF_DIAGNOSIS_FORM_TABS: readonly FormTabItem[] = [
    {value: 'company', title: '기업정보', content: <CompanyInfoForm />},
    {value: 'ceo', title: '대표자 경력사항', content: <CareerForm />},
    {value: 'etc', title: '기업 기타 정보', content: <CompanyEtcForm />},
    {value: 'staff', title: '핵심 기술 인력 현황', content: <TechStaffForm />},
    {value: 'rnd', title: '기술 개발 실적', content: <RndForm />},
]

export {SELF_DIAGNOSIS_FORM_TABS}
