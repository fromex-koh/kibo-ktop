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

rmSync(outputDirectory, {recursive: true, force: true})
mkdirSync(outputDirectory, {recursive: true})

for (const path of [
    '.env.example',
    '.gitignore',
    'components.json',
    'next.config.ts',
    'postcss.config.mjs',
    'public',
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

writeFileSync(
    resolve(outputDirectory, 'README.md'),
    `# Frontend handoff

현재 저장소의 검증을 통과한 프론트엔드 실행 소스입니다. 프로젝트 화면과 컴포넌트는 원본 배포와 같은 코드를 사용합니다.

- 전달 버전: v${releaseVersion}
- 원본 브랜치: ${sourceBranch}
- 원본 커밋: ${sourceCommit}
- 생성 시각: ${generatedAt}

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
`,
)

console.log(`✅ frontend-handoff 생성 완료 — ${outputDirectory} (v${releaseVersion}, ${sourceCommit})`)
