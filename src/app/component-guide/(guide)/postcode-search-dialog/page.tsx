// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {PostcodeSearchDialog} from '@/components/composite/postcode-search-dialog'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'
import {PostcodeSearchDemo} from './postcode-search-demo'

export const metadata: Metadata = {title: '우편번호 검색 (PostcodeSearchDialog)'}

const USAGE_CODE = `import {PostcodeSearchDialog, type PostcodeAddress} from '@/components/composite/postcode-search-dialog'

<PostcodeSearchDialog title="주소 검색" onSelect={(address: PostcodeAddress) => setAddress(address)}>
  <Button type="button" variant="tertiary" size="lg">주소 검색</Button>
</PostcodeSearchDialog>`

const MODE_COLUMNS = [
    {key: 'mode', header: '모드', align: 'start', rowHeader: true},
    {key: 'what', header: '본문', align: 'start', wrap: true},
    {key: 'where', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const MODE_ROWS = [
    {
        key: 'default',
        cells: [
            '기본',
            'Kakao(다음) 우편번호 위젯이 들어올 빈 자리입니다.',
            '회원가입 · 마이페이지 · 보증추천의 주소 검색',
        ],
    },
    {
        key: 'mock',
        cells: [
            <code key="m">mockSearch</code>,
            '화면 확인용 임시 검색 목록입니다. 고른 주소로 입력칸이 채워지는 것까지 보여야 하는 곳에서만 켭니다.',
            '자가진단 기업정보(주소 입력칸 채우기)',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['PostcodeSearchDialog', 'children', '모달을 여는 버튼입니다.', '-', 'ReactNode'],
    ['PostcodeSearchDialog', 'title', '모달 제목입니다. 여는 버튼과 같은 말을 씁니다.', "'우편번호 검색'", 'string'],
    [
        'PostcodeSearchDialog',
        'onSelect',
        '주소를 고르면 값을 넘기고 모달이 닫힙니다. 값의 모양은 위젯 응답(zonecode · roadAddress · jibunAddress)과 같습니다.',
        '-',
        '(address: PostcodeAddress) => void',
    ],
    ['PostcodeSearchDialog', 'mockSearch', '위젯 대신 화면 확인용 임시 검색 목록을 넣습니다.', 'false', 'boolean'],
    ['PostcodeSearchDialog', 'defaultOpen', '트리거 없이 처음부터 열어 둡니다(모달 단독 화면).', 'false', 'boolean'],
] as const

const PostcodeSearchDialogGuidePage = () => (
    <GuidePageShell
        title="우편번호 검색 (PostcodeSearchDialog)"
        description="주소를 받는 화면이 함께 쓰는 모달입니다. 본문은 Kakao(다음) 우편번호 위젯이 들어올 자리입니다."
    >
        <BaseCard>
            <section aria-labelledby="postcode-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="postcode-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        [주소 검색]을 누르면 모달이 열리고, 주소를 고르면 <code>onSelect</code> 로 값을 받아 입력칸에
                        채웁니다. 아래 데모는 <code>mockSearch</code> 로 그 흐름을 보여 줍니다.
                    </p>
                </div>
                <PostcodeSearchDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="postcode-mode" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="postcode-mode" className="typo-h4-bold">
                        본문 모드
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        기본은 위젯 자리를 비워 둡니다. 위젯을 붙일 때는 본문만 위젯으로 바꾸고, 위젯의{' '}
                        <code>onComplete</code> 결과를 그대로 <code>onSelect</code> 로 넘깁니다.
                    </p>
                </div>
                <Table caption="우편번호 검색 본문 모드" columns={MODE_COLUMNS} rows={MODE_ROWS} size="md" />
                <div>
                    <PostcodeSearchDialog>
                        <Button type="button" variant="tertiary" size="md">
                            기본 모드 열어 보기
                        </Button>
                    </PostcodeSearchDialog>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="postcode-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="postcode-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        포커스 가두기 · Esc 닫기 · 닫은 뒤 여는 버튼으로 포커스 복귀는 Dialog(Radix)가
                        처리합니다[8.2.1].
                    </li>
                    <li>고른 주소를 받는 입력칸에는 화면에 보이는 이름표(label)를 연결합니다[7.4.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="postcode-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="postcode-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PostcodeSearchDialog Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PostcodeSearchDialogGuidePage
