// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import Link from 'next/link'
import {Table} from '@/components/custom/table'

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const COLUMNS = [
    {key: 'screen', header: '화면 유형', align: 'start', rowHeader: true},
    {key: 'layout', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const ROWS = [
    {
        key: 'sub',
        cells: [
            '일반 서비스 화면(목록 · 폼 · 마이페이지)',
            <Link key="layout" href="/component-guide/sub-page-layout" className={LINK_CLASS}>
                SubPageLayout
            </Link>,
            'sticky Header 와 Footer 를 함께 그립니다. 본문 main 은 사용처가 작성합니다.',
        ],
    },
    {
        key: 'main',
        cells: [
            '메인 랜딩페이지(StackPager 풀스크린 섹션)',
            <Link key="layout" href="/component-guide/main-page-layout" className={LINK_CLASS}>
                MainPageLayout
            </Link>,
            '본문 위에 겹치는 overlay Header 만 그립니다. Footer 는 마지막 섹션에 직접 넣습니다.',
        ],
    },
    {
        key: 'fit',
        cells: [
            '완료 · 결과 · 안내처럼 한 화면에서 끝나는 화면',
            <Link key="layout" href="/component-guide/viewport-fit-layout" className={LINK_CLASS}>
                ViewportFitLayout
            </Link>,
            'Header · 하단 액션을 슬롯으로 받아 한 화면에 맞춥니다. SkipNav 도 사용처가 header 슬롯에 넣습니다.',
        ],
    },
    {
        key: 'status',
        cells: [
            '404 · 500 · 정기점검',
            <Link key="layout" href="/component-guide/full-page-service-status" className={LINK_CLASS}>
                FullPageServiceStatus
            </Link>,
            'Header · Footer 없이 main 까지 직접 그리는 독립 화면입니다. 레이아웃으로 감싸지 않습니다.',
        ],
    },
] as const

const LayoutChoiceTable = () => (
    <Table caption="화면 유형별 레이아웃 선택 기준" columns={COLUMNS} rows={ROWS} size="md" />
)

export default LayoutChoiceTable
