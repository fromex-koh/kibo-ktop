import type {Metadata} from 'next'
import {PostcodeSearchPage} from '@/components/custom/auth-flow-page'

export const metadata: Metadata = {title: '우편번호 검색'}

const OrgPostcodeSearchPage = () => <PostcodeSearchPage />

export default OrgPostcodeSearchPage
