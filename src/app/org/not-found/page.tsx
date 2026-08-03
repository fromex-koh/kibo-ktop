import type {Metadata} from 'next'
import FullPageNotFound from '@/components/custom/full-page-not-found'

export const metadata: Metadata = {title: '404 에러 화면'}

// 퍼블리싱 인덱스 큐레이션용 404 미리보기 화면. 실제 fallback으로 사용할 때는
// 이 파일을 src/app/org/not-found.tsx로 이동한다.
const OrgNotFoundPreviewPage = () => <FullPageNotFound />

export default OrgNotFoundPreviewPage
