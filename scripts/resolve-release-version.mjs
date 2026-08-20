const latestVersion = process.argv[2]

if (!latestVersion) {
    throw new Error('최신 릴리스 버전(vX.Y.Z)을 인자로 전달해야 합니다.')
}

const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(latestVersion)

if (!match) {
    throw new Error(`잘못된 릴리스 버전입니다: ${latestVersion}`)
}

const [, majorString, minorString, patchString] = match
const major = Number(majorString)
const minor = Number(minorString)
const patch = Number(patchString)

// 기존 릴리스에서 정식 메이저 버전으로 전환하는 일회성 기준을 먼저 처리한다.
if (latestVersion === 'v0.1.10') {
    console.log('v1.0.0')
} else if (latestVersion === 'v1.0.1') {
    console.log('v2.0.0')
} else if (latestVersion === 'v2.0.8') {
    console.log('v3.0.0')
} else if (patch >= 9) {
    // PATCH를 한 자리로 유지하고, 9 다음 릴리스는 MINOR를 올린다.
    console.log(`v${major}.${minor + 1}.0`)
} else {
    console.log(`v${major}.${minor}.${patch + 1}`)
}
