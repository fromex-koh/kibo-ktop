import {cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {basename, resolve} from 'node:path'
import process from 'node:process'

const outputArgument = process.argv[2]

if (!outputArgument) {
    throw new Error('사용법: node scripts/build-frontend-handoff.mjs <output-directory>')
}

const repositoryRoot = process.cwd()
const outputDirectory = resolve(outputArgument)

if (outputDirectory === repositoryRoot || basename(outputDirectory) !== 'frontend-handoff') {
    throw new Error('출력 경로는 현재 저장소 밖의 frontend-handoff 디렉터리여야 합니다.')
}

const copy = (source, destination = source) => {
    const sourcePath = resolve(repositoryRoot, source)
    if (!existsSync(sourcePath)) return
    cpSync(sourcePath, resolve(outputDirectory, destination), {recursive: true})
}

const copyRequiredHandoffAsset = (source, destination) => {
    const sourcePath = resolve(repositoryRoot, source)
    if (!existsSync(sourcePath)) {
        throw new Error(`handoff 전용 파일이 없습니다: ${source}`)
    }
    cpSync(sourcePath, resolve(outputDirectory, destination), {recursive: true})
}

rmSync(outputDirectory, {recursive: true, force: true})
mkdirSync(outputDirectory, {recursive: true})

for (const path of [
    '.gitignore',
    'components.json',
    'next.config.ts',
    'postcss.config.mjs',
    'public',
    'scripts/build-tokens.mjs',
    'src',
    'THIRD_PARTY_LICENSES.md',
    'tokens.json',
    'tsconfig.json',
    'vendor',
    'yarn.lock',
]) {
    copy(path)
}

for (const path of ['src/.DS_Store', 'src/app/.DS_Store']) {
    rmSync(resolve(outputDirectory, path), {force: true})
}

// 원본 사이트 정보와 handoff 사이트 정보는 별도로 관리한다.
copyRequiredHandoffAsset('handoff/site.ts', 'src/constants/site.ts')

// handoff는 사이트 설정을 constants/site.ts에서 관리하므로 환경변수 예시 파일을 전달하지 않는다.
const publishingIndexPath = resolve(outputDirectory, 'src/content/publishing-guide/publishing-index.json')
const publishingIndex = JSON.parse(readFileSync(publishingIndexPath, 'utf8'))
publishingIndex.assetVersions = publishingIndex.assetVersions.filter((asset) => asset.name !== '.env.example')
writeFileSync(publishingIndexPath, `${JSON.stringify(publishingIndex, null, 4)}\n`)

const assetVersionsPath = resolve(outputDirectory, 'src/content/publishing-guide/asset-versions.generated.json')
const assetVersions = JSON.parse(readFileSync(assetVersionsPath, 'utf8'))
assetVersions.assets = assetVersions.assets.filter((asset) => asset.name !== '.env.example')
writeFileSync(assetVersionsPath, `${JSON.stringify(assetVersions, null, 4)}\n`)

// 원본 OG 이미지는 전달하지 않는다. handoff/og-image.png가 있을 때만 handoff 이미지로 교체한다.
rmSync(resolve(outputDirectory, 'public/og-image.png'), {force: true})
copy('handoff/og-image.png', 'public/og-image.png')

// 전달본은 생성된 tokens.css를 초기 결과물로 커밋하고, tokens.json 수정 시 같은 스크립트로 갱신한다.
const handoffGitignorePath = resolve(outputDirectory, '.gitignore')
const handoffGitignore = readFileSync(handoffGitignorePath, 'utf8')
    .split('\n')
    .filter((line) => !['/src/app/tokens.css', '!.env.example'].includes(line.trim()))
    .join('\n')
writeFileSync(handoffGitignorePath, handoffGitignore)

// 원본 배포의 인덱스 화면은 전달본에서도 유지하되, 서비스가 사용할 루트 경로는 비워 둔다.
const publishingGuideDirectory = resolve(outputDirectory, 'src/app/publishing-guide')
mkdirSync(publishingGuideDirectory, {recursive: true})
cpSync(resolve(outputDirectory, 'src/app/page.tsx'), resolve(publishingGuideDirectory, 'page.tsx'))
writeFileSync(
    resolve(outputDirectory, 'src/app/page.tsx'),
    `import Link from 'next/link'

const Home = () => (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center px-6 py-16">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
            <h1 className="typo-display-s-bold">프론트엔드 프로젝트</h1>
            <p className="typo-body-l-regular text-muted-foreground">
                이 페이지를 서비스의 메인 화면으로 교체하세요. 전달된 퍼블리싱 현황과 컴포넌트 가이드는 아래
                링크에서 확인할 수 있습니다.
            </p>
            <Link
                href="/publishing-guide"
                className="bg-primary text-primary-foreground typo-body-l-medium focus-visible:ring-ring rounded-md px-4 py-2 hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
            >
                퍼블리싱 인덱스 보기
            </Link>
        </div>
    </main>
)

export default Home
`,
)

const sourcePackage = JSON.parse(readFileSync(resolve(repositoryRoot, 'package.json'), 'utf8'))
const releaseMetadata = JSON.parse(
    readFileSync(resolve(repositoryRoot, 'src/content/publishing-guide/asset-versions.generated.json'), 'utf8'),
)
const releaseVersion = String(releaseMetadata.version).replace(/^v/, '')
const handoffPackage = {
    name: `${sourcePackage.name}-frontend-handoff`,
    version: releaseVersion,
    private: true,
    packageManager: sourcePackage.packageManager,
    scripts: {
        tokens: 'node scripts/build-tokens.mjs',
        predev: 'yarn tokens',
        prebuild: 'yarn tokens',
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        typecheck: 'next typegen && tsc --noEmit',
    },
    dependencies: sourcePackage.dependencies,
    devDependencies: Object.fromEntries(
        [
            '@tailwindcss/postcss',
            '@types/node',
            '@types/react',
            '@types/react-dom',
            '@types/wordcloud',
            'tailwindcss',
            'typescript',
        ].map((name) => [name, sourcePackage.devDependencies[name]]),
    ),
}

writeFileSync(resolve(outputDirectory, 'package.json'), `${JSON.stringify(handoffPackage, null, 4)}\n`)

const sourceCommit = process.env.HANDOFF_SOURCE_COMMIT ?? 'local'
const sourceBranch = process.env.HANDOFF_SOURCE_BRANCH ?? 'local'
const generatedAt = process.env.HANDOFF_GENERATED_AT ?? new Date().toISOString()
const previousReadmePath = process.env.HANDOFF_PREVIOUS_README

const stripCodeSpan = (value) => value.trim().replace(/^`(.*)`$/, '$1')

const parseHistoryRow = (line) => {
    const cells = line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => stripCodeSpan(cell.replaceAll('\\|', '|')))

    if (
        cells.length !== 4 ||
        cells.some((cell) => cell.length === 0) ||
        cells[0] === '버전' ||
        /^[-:]+$/.test(cells[0])
    ) {
        return undefined
    }

    return {
        version: cells[0],
        sourceBranch: cells[1],
        sourceCommit: cells[2],
        generatedAt: cells[3],
    }
}

const parsePreviousHistory = (readme) => {
    const historyHeading = readme.indexOf('## 버전 이력')
    const historySection = historyHeading === -1 ? '' : readme.slice(historyHeading)
    const history = historySection
        .split('\n')
        .map((line) => (line.startsWith('|') ? parseHistoryRow(line) : undefined))
        .filter((record) => record && record.version !== '버전')

    const legacyVersion = readme.match(/^- 전달 버전:\s*(.+)$/m)?.[1]
    if (!legacyVersion) return history

    const legacyRecord = {
        version: legacyVersion.trim(),
        sourceBranch: readme.match(/^- 원본 브랜치:\s*(.+)$/m)?.[1]?.trim() ?? '-',
        sourceCommit: readme.match(/^- 원본 커밋:\s*(.+)$/m)?.[1]?.trim() ?? '-',
        generatedAt: readme.match(/^- 생성 시각:\s*(.+)$/m)?.[1]?.trim() ?? '-',
    }

    return [legacyRecord, ...history]
}

const previousHistory =
    previousReadmePath && existsSync(previousReadmePath)
        ? parsePreviousHistory(readFileSync(previousReadmePath, 'utf8'))
        : []
const currentHistoryRecord = {
    version: `v${releaseVersion}`,
    sourceBranch,
    sourceCommit,
    generatedAt,
}
const versionHistory = [currentHistoryRecord, ...previousHistory].filter(
    (record, index, records) => records.findIndex((candidate) => candidate.version === record.version) === index,
)

const formatTableCell = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
const formatHistoryRow = ({version, sourceBranch: branch, sourceCommit: commit, generatedAt: time}) =>
    `| ${formatTableCell(version)} | ${formatTableCell(branch)} | ${formatTableCell(`\`${commit}\``)} | ${formatTableCell(time)} |`
const versionHistoryTable = [
    '| 버전 | 원본 브랜치 | 원본 커밋 | 생성 시각 |',
    '| --- | --- | --- | --- |',
    ...versionHistory.map(formatHistoryRow),
].join('\n')

writeFileSync(
    resolve(outputDirectory, 'README.md'),
    `# Frontend handoff

현재 저장소의 검증을 통과한 프론트엔드 실행 소스입니다. 프로젝트 화면과 컴포넌트는 원본 배포와 같은 코드를 사용합니다.

## 버전 이력

최신 전달본이 위에 표시됩니다. 각 행에서 전달 버전, 원본 브랜치와 커밋, 생성 시각을 확인할 수 있습니다.

${versionHistoryTable}

## 실행

\`\`\`bash
yarn install --frozen-lockfile
yarn dev
\`\`\`

프로덕션 빌드는 \`yarn build\`, 실행은 \`yarn start\`를 사용합니다. 전달 이후의 코드 스타일, 브랜치 전략, Lint와 포맷 정책은 프론트엔드 저장소에서 관리합니다.

## 주요 경로

- \`/\`: 서비스 메인 화면으로 교체할 최소 시작 페이지
- \`/publishing-guide\`: 원본 저장소의 퍼블리싱 인덱스
- \`/component-guide\`: 컴포넌트 가이드

## 사이트 메타데이터

\`src/constants/site.ts\`는 handoff 전용 사이트명, 설명, URL과 저장소 URL을 관리합니다. handoff 생성 전에는 저장소의 \`handoff/site.ts\`를 수정합니다.

OG 이미지 경로는 \`/og-image.png\`로 유지하며, 디자인 작업 완료 후 \`handoff/og-image.png\`를 추가하면 자동으로 적용됩니다.

## 디자인 토큰

\`src/app/tokens.css\`는 검증된 초기 결과물로 포함됩니다. \`tokens.json\`을 수정한 뒤 \`yarn tokens\`로 다시 생성할 수 있으며, \`yarn dev\`와 \`yarn build\` 실행 전에도 자동으로 갱신됩니다.
`,
)

console.log(`✅ frontend-handoff 생성 완료 — ${outputDirectory} (v${releaseVersion}, ${sourceCommit})`)
