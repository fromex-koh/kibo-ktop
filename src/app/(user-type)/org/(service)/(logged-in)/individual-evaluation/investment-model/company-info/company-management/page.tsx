import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {CompanyInfoLoadDialog} from '@/components/composite/company-info-load-dialog'
import {getCompanyInfoLoadResult} from '@/content/service/company-info-load'

export const metadata: Metadata = {title: '기업정보 관리'}

// 기관 개별평가 투자모형 2단계 · 기업정보의 [기업정보 관리] 모달(기업정보 불러오기) — 화면정의서의 하위 화면이라
// 경로를 따로 둔다. KTRS-FM 화면(ktrs-fm/company-info/company-management)과 같은 구성이고, 불러오는 평가모형만
// 다르다. 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다.
const OrgInvestmentModelCompanyManagementPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="기업정보 관리">
                기업정보의 [기업정보 관리] 버튼이 호출하는 팝업
                <br />
                위치: [기관] 개별평가 &gt; KTRS-FM · Tech-Index(일반/창업) · 투자모형 &gt; 기업·기술정보 입력 &gt; (1)
                기업정보 탭 — &quot;기업정보&quot; 제목 오른쪽
                <br />
                동작: 목록에서 기업을 선택하면 그 기업의 기업정보가 자동 입력
                <br />
                <br />
                참고: [기관] 마이페이지 &gt; 평가검증 신청 조회 &gt; [평가검증 하기]로 들어오면 [기업정보 관리] 대신
                같은 자리에 [기업 자가진단 결과보기]가 노출(세 모형 공통)
            </PopupPreviewNote>
        </main>
        {/* [프론트엔드 연동] 처음 보여 줄 결과는 content/service/company-info-load.ts 가 준다. */}
        <CompanyInfoLoadDialog
            defaultOpen
            model="investment-model"
            initialResult={getCompanyInfoLoadResult('investment-model')}
        />
    </>
)

export default OrgInvestmentModelCompanyManagementPage
