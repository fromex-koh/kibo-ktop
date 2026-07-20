// GitHub Actions의 전체 git 히스토리에서 다음 릴리스 메타데이터를 확정한다.
// 결과 파일은 릴리스 커밋에 포함되며, Vercel·로컬 빌드는 git을 다시 조회하지 않고 이 스냅샷만 읽는다.
// ⚠️ 직접 실행할 때도 RELEASE_VERSION=vX.Y.Z 가 반드시 필요하다.

import {readFileSync, writeFileSync} from 'node:fs'
import {resolvePathVersion} from './git-info.mjs'

const SOURCE = 'src/content/publishing-index.json'
const OUTPUT = 'src/content/asset-versions.generated.json'
const releaseVersion = process.env.RELEASE_VERSION

if (!releaseVersion || !/^v\d+\.\d+\.\d+$/.test(releaseVersion)) {
    throw new Error('RELEASE_VERSION=vX.Y.Z 형식의 다음 릴리스 버전이 필요합니다.')
}

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

const {assetVersions} = JSON.parse(readFileSync(SOURCE, 'utf8'))

const generated = assetVersions.map(({name, path}) => {
    const resolvedVersion = applyBaselineVersion(resolvePathVersion(path), path)
    // 최신 태그 이후 변경은 아직 이를 포함하는 태그가 없어서 '미배포'다. 릴리스 파일을 만드는
    // 이 시점에만 해당 변경을 곧 생성할 태그 버전으로 확정한다.
    const version = resolvedVersion === '미배포' ? releaseVersion : resolvedVersion
    return {name, version, isCurrent: version === releaseVersion}
})

const metadata = {version: releaseVersion, assets: generated}
writeFileSync(OUTPUT, `${JSON.stringify(metadata, null, 4)}\n`)

const updated = generated.filter((a) => a.isCurrent).map((a) => a.name)
console.log(
    `✅ 릴리스 메타데이터 생성 완료 (${releaseVersion}${updated.length ? `, 변경 자산: ${updated.join(', ')}` : ''})`,
)
