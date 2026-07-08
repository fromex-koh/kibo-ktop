import type {Metadata} from 'next'
import SidebarLayoutDemo from '@/components/guide/sidebar-layout-demo'

export const metadata: Metadata = {
    title: '사이드 메뉴 레이아웃',
}

const SidebarLayoutPage = () => {
    return <SidebarLayoutDemo />
}

export default SidebarLayoutPage
