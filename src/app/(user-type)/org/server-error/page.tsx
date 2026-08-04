import type {Metadata} from 'next'
import FullPageServerError from '@/components/custom/full-page-server-error'

export const metadata: Metadata = {title: '500 에러 화면'}

// 퍼블리싱 인덱스에서 직접 확인하는 500 에러 화면 미리보기.
// 실제 오류 처리(error.tsx)는 서비스 구현 시 별도로 연결한다.
const OrgServerErrorPreviewPage = () => <FullPageServerError />

export default OrgServerErrorPreviewPage
