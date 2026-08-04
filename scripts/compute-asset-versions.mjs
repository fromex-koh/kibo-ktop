// GitHub Actions의 전체 git 히스토리에서 다음 릴리스 메타데이터를 확정한다.
// 결과 파일은 릴리스 커밋에 포함되며, Vercel·로컬 빌드는 git을 다시 조회하지 않고 이 스냅샷만 읽는다.
// ⚠️ 직접 실행할 때도 RELEASE_VERSION=vX.Y.Z 가 반드시 필요하다.

import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {format, resolveConfig} from 'prettier'
import {resolvePathVersion} from './git-info.mjs'

const SOURCE = 'src/content/publishing-guide/publishing-index.json'
const OUTPUT = 'src/content/publishing-guide/asset-versions.generated.json'
const RELEASE_NOTES_OUTPUT = 'src/content/publishing-guide/release-notes.generated.json'
const SCREEN_REGISTRY_SOURCE = 'src/content/publishing-guide/screen-registry.json'
const SCREEN_REGISTRY_OUTPUT = 'src/content/publishing-guide/screen-registry.generated.json'
const SCREEN_REGISTRY_GENERATED_NOTICE =
    '자동 생성 파일 — 직접 수정하지 않습니다. 경로·화면 정보는 screen-registry.json에서 관리하며, page 파일 존재 여부는 dev·build·verify 시 자동 반영되고 릴리스 버전은 main 릴리스에서 Git 이력으로 확정됩니다.'
const RELEASE_NOTES_DRAFT = 'RELEASE_NOTES_DRAFT.md'
const EMPTY_RELEASE_NOTES_DRAFT = `# 다음 릴리스 변경사항

<!--
main 병합 전에 노출할 내용을 아래에 불릿(-)으로 작성하세요.
항목이 많을 때는 \`[적용 화면 또는 작업 영역] 변경사항\` 형식으로 구분하며, 개수는 제한하지 않습니다.
컴포넌트 가이드 페이지는 \`[페이지 제목](/component-guide/경로)\` 형식으로 작성하면 새 창 링크로 표시됩니다.
릴리스 성공 후 내용은 자동으로 비워집니다.
-->
`
const releaseVersion = process.env.RELEASE_VERSION

if (!releaseVersion || !/^v\d+\.\d+\.\d+$/.test(releaseVersion)) {
    throw new Error('RELEASE_VERSION=vX.Y.Z 형식의 다음 릴리스 버전이 필요합니다.')
}

// 릴리스 문장이 길어지면 JSON.stringify 들여쓰기만으로는 Prettier 결과와 달라질 수 있다.
// 생성 시점에 프로젝트 설정을 적용해, 생성 직후 format:check와 pre-push 검사가 항상 같은 결과를 보게 한다.
const prettierConfig = (await resolveConfig(RELEASE_NOTES_OUTPUT)) ?? {}
const formatJson = (value, filepath) => format(JSON.stringify(value), {...prettierConfig, filepath})

// Vercel 이전 배포에서 git 이력 조회가 실패했으므로 자산별 버전 추적을 v0.1.3에서 다시 시작한다.
// 그 이전 커밋에서 마지막으로 바뀐 자산도 인계 기준선에는 v0.1.3으로 표시하되,
// 이미 v0.1.0으로 배포된 폰트 이력은 그대로 보존한다.
// '미배포'는 아직 어떤 태그에도 포함되지 않은 실제 변경이므로 기준선으로 덮어쓰지 않는다.
const DEFAULT_BASELINE_VERSION = 'v0.1.3'
const BASELINE_VERSION_BY_PATH = new Map([['src/app/fonts', 'v0.1.0']])

const parseVersion = (version) => {
    const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(version)
    return match ? match.slice(1).map(Number) : null
}

const applyBaselineVersion = (version, path) => {
    const baselineVersion = BASELINE_VERSION_BY_PATH.get(path) ?? DEFAULT_BASELINE_VERSION
    const parsedVersion = parseVersion(version)
    const parsedBaseline = parseVersion(baselineVersion)
    if (!parsedVersion || !parsedBaseline) return version

    for (let index = 0; index < parsedVersion.length; index += 1) {
        if (parsedVersion[index] > parsedBaseline[index]) return version
        if (parsedVersion[index] < parsedBaseline[index]) return baselineVersion
    }
    return version
}

const {assetVersions, commonLayouts} = JSON.parse(readFileSync(SOURCE, 'utf8'))
const screenRegistry = JSON.parse(readFileSync(SCREEN_REGISTRY_SOURCE, 'utf8'))

const generated = assetVersions.map(({name, path}) => {
    const resolvedVersion = applyBaselineVersion(resolvePathVersion(path), path)
    // 최신 태그 이후 변경은 아직 이를 포함하는 태그가 없어서 '미배포'다. 릴리스 파일을 만드는
    // 이 시점에만 해당 변경을 곧 생성할 태그 버전으로 확정한다.
    const version = resolvedVersion === '미배포' ? releaseVersion : resolvedVersion
    return {name, version, isCurrent: version === releaseVersion}
})

const generatedCommonLayouts = commonLayouts.map(({label, path}) => {
    const resolvedVersion = applyBaselineVersion(resolvePathVersion(path), path)
    const version = resolvedVersion === '미배포' ? releaseVersion : resolvedVersion
    return {label, path, version, isCurrent: version === releaseVersion}
})

const metadata = {version: releaseVersion, assets: generated, commonLayouts: generatedCommonLayouts}
writeFileSync(OUTPUT, await formatJson(metadata, OUTPUT))

const PAGE_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js']
const generatedScreens = screenRegistry.screens.map((screen) => {
    const pagePath = PAGE_EXTENSIONS.map(
        (extension) => `src/app${screen.path === '/' ? '' : screen.path}/page.${extension}`,
    ).find((candidate) => existsSync(candidate))
    const implemented = pagePath !== undefined
    const resolvedVersion = implemented ? resolvePathVersion(pagePath) : '미배포'
    const version = implemented && resolvedVersion === '미배포' ? releaseVersion : resolvedVersion

    return {
        key: screen.key,
        implemented,
        implementationStatus: implemented ? 'in-progress' : 'planned',
        version,
        isCurrent: implemented && version === releaseVersion,
    }
})
writeFileSync(
    SCREEN_REGISTRY_OUTPUT,
    await formatJson({'//': SCREEN_REGISTRY_GENERATED_NOTICE, screens: generatedScreens}, SCREEN_REGISTRY_OUTPUT),
)

const git = (...args) => execFileSync('git', args, {encoding: 'utf8'}).trim()
const previousTag = git('tag', '--list', 'v[0-9]*.[0-9]*.[0-9]*', '--sort=-v:refname').split('\n')[0]
const releaseRange = previousTag ? `${previousTag}..HEAD` : 'HEAD'
const commitSubjects = git('log', releaseRange, '--format=%s', '--no-merges')
    .split('\n')
    .filter(Boolean)
    .filter((subject) => !subject.startsWith('chore(release):'))

const summarizeSubject = (subject) =>
    subject.replace(/^(?:feat|fix|docs|refactor|perf|test|build|ci|chore|style)(?:\([^)]*\))?!?:\s*/i, '').trim()

const draftChanges = readFileSync(RELEASE_NOTES_DRAFT, 'utf8')
    .split('\n')
    .map((line) => /^-\s+(.+)$/.exec(line.trim())?.[1]?.trim())
    .filter(Boolean)
const automaticChanges = [...new Set(commitSubjects.map(summarizeSubject).filter(Boolean))].slice(0, 8)
const changes = draftChanges.length > 0 ? draftChanges : automaticChanges
const releasedAt = git('log', '-1', '--format=%cs', 'HEAD')
const previousReleaseNotes = JSON.parse(readFileSync(RELEASE_NOTES_OUTPUT, 'utf8')).releases
const releases = [
    {
        version: releaseVersion,
        releasedAt,
        changes: changes.length > 0 ? changes : ['릴리스 메타데이터 업데이트'],
    },
    ...previousReleaseNotes.filter((release) => release.version !== releaseVersion),
].slice(0, 30)
writeFileSync(RELEASE_NOTES_OUTPUT, await formatJson({releases}, RELEASE_NOTES_OUTPUT))
writeFileSync(RELEASE_NOTES_DRAFT, EMPTY_RELEASE_NOTES_DRAFT)

const updated = generated.filter((a) => a.isCurrent).map((a) => a.name)
const updatedScreens = generatedScreens.filter((screen) => screen.isCurrent).map((screen) => screen.key)
console.log(
    `✅ 릴리스 메타데이터 생성 완료 (${releaseVersion}, 릴리스 노트: ${
        draftChanges.length > 0 ? '수동 초안' : '커밋 제목 자동 수집'
    }${updated.length ? `, 변경 자산: ${updated.join(', ')}` : ''}${
        updatedScreens.length ? `, 변경 화면: ${updatedScreens.join(', ')}` : ''
    })`,
)
