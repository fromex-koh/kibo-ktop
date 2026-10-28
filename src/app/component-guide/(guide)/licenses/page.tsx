// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import thirdPartyLicenses from '@/content/publishing-guide/third-party-licenses.generated.json'

export const metadata: Metadata = {title: '오픈소스 라이선스'}

// 오픈소스 라이선스 — frontend-handoff 로 넘기는 것 중 외부 저작물(패키지 · 폰트 · 복사해 온 코드)의 라이선스를 모은다.
// 직접 의존성 표는 yarn license-notices 가 THIRD_PARTY_LICENSES.md 와 함께 만드는 목록(third-party-licenses.generated.json)을
// 그대로 그린다 — 의존성을 더하거나 올리면 그 명령만 다시 실행하면 이 화면도 따라 바뀐다.
// 하위 패키지 표는 명령으로 만들지 않는 기록이다(설치 환경마다 목록이 조금 달라 자동 비교에서 뺐다) — 의존성을 바꾸면 다시 확인한다.

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

// 1. 넘기는 라이선스 고지 파일
const FILE_COLUMNS = [
    {key: 'file', header: '파일', align: 'start', rowHeader: true},
    {key: 'role', header: '담긴 내용', align: 'start', wrap: true},
] as const

const FILE_ROWS = [
    {
        key: 'notices',
        cells: [
            <code key="file">THIRD_PARTY_LICENSES.md</code>,
            '직접 의존성(package.json 의 dependencies) 전부와 Pretendard 폰트의 라이선스 전문입니다. 저장소 맨 위에 있고 전달본에 그대로 들어갑니다.',
        ],
    },
    {
        key: 'font',
        cells: [
            <code key="file">src/app/fonts/LICENSE-PRETENDARD.txt</code>,
            '폰트 파일(PretendardVariable.woff2) 옆에 두는 폰트 라이선스(SIL OFL 1.1) 원문입니다. 폰트 파일과 함께 옮깁니다.',
        ],
    },
    {
        key: 'packages',
        cells: [
            <code key="file">yarn.lock</code>,
            '하위 패키지까지 설치되는 버전 목록입니다. 하위 패키지의 라이선스 원문은 설치 뒤 node_modules 의 각 패키지 폴더(LICENSE)에 있습니다.',
        ],
    },
] as const

// 2. 라이선스 종류별로 지킬 것
const TYPE_COLUMNS = [
    {key: 'license', header: '라이선스', align: 'start', rowHeader: true},
    {key: 'commercial', header: '상업적 사용', align: 'center'},
    {key: 'duty', header: '지킬 것', align: 'start', wrap: true},
] as const

const TYPE_ROWS = [
    {
        key: 'mit',
        cells: [
            'MIT',
            '가능',
            '배포물에 저작권 표시와 라이선스 문구를 남깁니다(THIRD_PARTY_LICENSES.md 로 충족). 소스 공개 의무는 없습니다.',
        ],
    },
    {key: 'isc', cells: ['ISC', '가능', 'MIT 와 같습니다 — 저작권 표시와 라이선스 문구만 남깁니다.']},
    {
        key: 'apache',
        cells: [
            'Apache-2.0',
            '가능',
            '라이선스 문구를 남기고, 원본에 NOTICE 파일이 있으면 그것도 남깁니다. 고친 파일에는 고쳤다는 표시를 합니다.',
        ],
    },
    {
        key: 'ofl',
        cells: [
            'SIL OFL 1.1(폰트)',
            '가능',
            '화면 · 문서에 자유롭게 씁니다. 폰트 파일만 따로 팔 수 없고, 폰트 파일을 넘길 때는 라이선스 원문을 함께 넘깁니다.',
        ],
    },
] as const

// 3. 직접 의존성 — 자동 생성 목록에서 그린다.
// '하는 일'은 개발자가 아닌 사람도 읽을 수 있게 화면에서 보이는 결과로 적는다. 이름 · 버전 · 라이선스와 달리 자동으로
// 만들 수 없어 여기서 관리한다 — 라이브러리를 더하면 한 줄 더하고, 빠뜨리면 표에 '설명 필요'로 보인다.
const LIBRARY_ROLES: Record<string, string> = {
    '@base-ui/react': '검색하며 고르는 입력칸(콤보박스)의 동작과 접근성을 맡는 부품',
    'class-variance-authority': '버튼의 크기 · 색처럼 컴포넌트의 모양 종류를 한곳에 정리해 쓰게 하는 도구',
    clsx: '상황에 따라 스타일을 붙였다 뗐다 하는 작은 도구',
    cmdk: '검색어를 치면 목록이 걸러지는 검색 메뉴의 동작',
    cytoscape: '점과 선으로 이어진 관계도(기업 관계 · 네트워크 그래프)를 그리는 도구',
    'cytoscape-fcose': '관계도의 점들이 겹치지 않게 자동으로 배치',
    'date-fns': '날짜 계산과 표기(예: 2026.10.26)',
    'html-to-image': '보고서 쪽을 그림으로 떠서 PDF 를 만들 때 사용',
    jspdf: '뜬 그림을 A4 쪽으로 묶어 PDF 파일로 저장',
    'lottie-web': '완료 체크 같은 움직이는 그림(애니메이션) 재생',
    'lucide-react': '화면 전체에서 쓰는 아이콘 모음',
    next: '사이트의 뼈대 — 페이지 이동, 서버에서 화면 만들기, 이미지 최적화',
    'next-themes': '라이트 · 다크 모드 전환과 사용자가 고른 모드 기억',
    'prism-react-renderer': '컴포넌트 가이드의 코드 예시에 색을 입혀 보여 줌(가이드 전용)',
    'radix-ui': '모달 · 탭 · 드롭다운 같은 기본 부품의 동작, 키보드 조작, 접근성',
    react: '화면을 부품 단위로 만드는 기본 라이브러리',
    'react-day-picker': '날짜를 고르는 달력',
    'react-dom': 'React 로 만든 화면을 브라우저에 그려 줌',
    'react-is': '차트 라이브러리(recharts)가 함께 설치를 요구하는 보조 패키지',
    recharts: '막대 · 꺾은선 · 도넛 · 레이더 등 각종 차트',
    shadcn: '기본 UI 부품의 원본 코드와 공통 스타일(CSS) 제공',
    sonner: '화면에 잠깐 떴다 사라지는 알림 메시지(토스트)',
    'tailwind-merge': '겹치는 스타일을 정리해 마지막에 정한 것만 남김',
    'tw-animate-css': '모달 · 메뉴가 열리고 닫힐 때의 부드러운 전환 효과',
    wordcloud: '키워드를 중요도만큼 크게 그리는 워드클라우드',
    'Pretendard Variable': '화면 전체에 쓰는 한글 · 영문 글꼴',
}
const LIBRARY_ROLE_FALLBACK = '설명 필요'

const DEPENDENCY_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'role', header: '하는 일', align: 'start', wrap: true},
    {key: 'version', header: '버전', align: 'center'},
    {key: 'license', header: '라이선스', align: 'center'},
    {key: 'source', header: '출처', align: 'start'},
] as const

const DEPENDENCY_ROWS = thirdPartyLicenses.licenses.map((item) => ({
    key: item.name,
    cells: [
        item.name,
        LIBRARY_ROLES[item.name] ?? LIBRARY_ROLE_FALLBACK,
        item.version,
        item.license,
        item.source ? (
            <a key="source" href={item.source} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                저장소
                <span className="sr-only"> {item.name} (새 창)</span>
            </a>
        ) : (
            '-'
        ),
    ],
}))

const LICENSE_COUNTS = Object.entries(
    thirdPartyLicenses.licenses.reduce<Record<string, number>>(
        (counts, item) => ({...counts, [item.license]: (counts[item.license] ?? 0) + 1}),
        {},
    ),
)
    .map(([license, count]) => `${license} ${count}개`)
    .join(' · ')

// 4. 하위 패키지 중 따로 알아 둘 것 — 2026-10-26 기준, 직접 의존성에서 이어지는 488개를 확인한 기록.
const TRANSITIVE_COLUMNS = [
    {key: 'name', header: '패키지', align: 'start', rowHeader: true},
    {key: 'license', header: '라이선스', align: 'start'},
    {key: 'note', header: '판단', align: 'start', wrap: true},
] as const

const TRANSITIVE_ROWS = [
    {
        key: 'dompurify',
        cells: [
            'dompurify',
            'MPL-2.0 OR Apache-2.0',
            '둘 중 Apache-2.0 으로 쓰면 됩니다. jsPDF 의 선택 패키지이고, 보고서 PDF 다운로드는 이 기능을 쓰지 않습니다.',
        ],
    },
    {
        key: 'libvips',
        cells: [
            '@img/sharp-libvips-*',
            'LGPL-3.0-or-later',
            'Next.js 이미지 최적화가 서버에서 쓰는 이미지 처리 라이브러리입니다. 브라우저로 내려가지 않고 별도 파일로 연결해 쓰므로 우리 코드 공개 의무는 생기지 않습니다. 설치 환경(OS)마다 이름 끝이 다릅니다.',
        ],
    },
    {
        key: 'caniuse',
        cells: [
            'caniuse-lite',
            'CC-BY-4.0',
            '빌드 도구가 지원 브라우저를 판단할 때 읽는 데이터입니다. 화면에 들어가지 않고, 출처 표시는 패키지에 들어 있습니다.',
        ],
    },
    {
        key: 'etc',
        cells: [
            'pako · rgbcolor · argparse · isexe · minimatch 등',
            'MIT AND Zlib · Python-2.0 · BlueOak-1.0.0 등',
            '모두 상업적 사용이 가능한 허용형 라이선스입니다. 지킬 것은 MIT 와 같습니다(고지 유지).',
        ],
    },
] as const

// 5. 코드 · 자산
const ASSET_COLUMNS = [
    {key: 'target', header: '대상', align: 'start', rowHeader: true},
    {key: 'license', header: '라이선스', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const ASSET_ROWS = [
    {
        key: 'shadcn',
        cells: [
            <code key="target">src/components/ui · vendor/shadcn-baseline</code>,
            'MIT(shadcn/ui)',
            'shadcn/ui 에서 받아 온 컴포넌트 코드입니다. 같은 라이선스의 shadcn 패키지 고지가 THIRD_PARTY_LICENSES.md 에 들어 있습니다.',
        ],
    },
    {
        key: 'icons',
        cells: [
            '아이콘',
            'ISC(lucide-react)',
            '모든 아이콘은 lucide-react 패키지에서 가져옵니다. 별도 고지는 THIRD_PARTY_LICENSES.md 의 lucide-react 항목입니다.',
        ],
    },
    {
        key: 'images',
        cells: [
            <code key="target">public/</code>,
            '이 문서 대상 아님',
            '로고 · 일러스트 · 화면 이미지는 오픈소스가 아닙니다. 쓸 수 있는 범위는 제공처(발주처 · 디자인 담당)에 확인합니다.',
        ],
    },
] as const

// 6. 관리 방법
const MANAGE_ITEMS = [
    '라이브러리를 더하거나 버전을 올리면 yarn license-notices 를 실행합니다 — THIRD_PARTY_LICENSES.md 와 이 화면의 직접 의존성 표가 함께 바뀝니다.',
    'yarn verify(push 전 자동 실행)가 yarn license-notices:check 로 두 파일이 최신인지 확인하고, 다르면 push 를 막습니다.',
    '새 라이브러리는 들이기 전에 라이선스를 확인합니다. MIT · ISC · Apache-2.0 · BSD 같은 허용형을 씁니다. GPL · AGPL 처럼 소스 공개 의무가 있는 라이선스는 쓰기 전에 발주처와 확인합니다.',
    '이 문서는 라이선스 조건을 정리한 것이고 법률 검토가 아닙니다. 발주처에 오픈소스 사용 승인 절차가 있으면 그 기준을 따릅니다.',
] as const

const SectionTitle = ({id, title, description}: {id: string; title: string; description?: string}) => (
    <div className="flex flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        {description ? <p className="typo-body-l-regular text-label-foreground">{description}</p> : null}
    </div>
)

const LicensesGuidePage = () => (
    <GuidePageShell
        title="오픈소스 라이선스"
        description="frontend-handoff 로 넘기는 것 중 외부 저작물(패키지 · 폰트 · 받아 온 코드)의 라이선스와 지킬 것을 정리합니다."
    >
        <BaseCard>
            <section aria-labelledby="licenses-summary" className="flex flex-col gap-6">
                <SectionTitle
                    id="licenses-summary"
                    title="요약"
                    description="직접 쓰는 라이브러리와 폰트는 모두 상업적으로 쓸 수 있는 라이선스입니다. 지킬 것은 라이선스 고지를 함께 넘기는 것이며, 아래 고지 파일이 전달본에 들어 있어 충족됩니다."
                />
                <Table caption="넘기는 라이선스 고지 파일" columns={FILE_COLUMNS} rows={FILE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="licenses-types" className="flex flex-col gap-6">
                <SectionTitle id="licenses-types" title="라이선스 종류별로 지킬 것" />
                <Table
                    caption="라이선스 종류별 상업적 사용과 지킬 것"
                    columns={TYPE_COLUMNS}
                    rows={TYPE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="licenses-dependencies" className="flex flex-col gap-6">
                <SectionTitle
                    id="licenses-dependencies"
                    title="직접 의존성과 폰트"
                    description={`이 프로젝트가 직접 설치해 쓰는 라이브러리와 폰트입니다 — ${LICENSE_COUNTS}. 라이선스 전문은 THIRD_PARTY_LICENSES.md 에 있습니다.`}
                />
                <Table
                    caption="직접 의존성과 폰트 라이선스"
                    columns={DEPENDENCY_COLUMNS}
                    rows={DEPENDENCY_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="licenses-transitive" className="flex flex-col gap-6">
                <SectionTitle
                    id="licenses-transitive"
                    title="하위 패키지 중 알아 둘 것"
                    description="위 라이브러리를 설치하면 함께 들어오는 패키지입니다. 2026-10-26 기준 488개 중 대부분이 MIT · ISC · Apache-2.0 · BSD 이고, 그 밖의 라이선스만 모았습니다."
                />
                <Table
                    caption="하위 패키지 중 알아 둘 라이선스"
                    columns={TRANSITIVE_COLUMNS}
                    rows={TRANSITIVE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="licenses-assets" className="flex flex-col gap-6">
                <SectionTitle id="licenses-assets" title="받아 온 코드 · 아이콘 · 이미지" />
                <Table caption="코드와 자산의 라이선스" columns={ASSET_COLUMNS} rows={ASSET_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="licenses-manage" className="flex flex-col gap-6">
                <SectionTitle id="licenses-manage" title="관리 방법" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    {MANAGE_ITEMS.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LicensesGuidePage
