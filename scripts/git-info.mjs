// 빌드/개발 시점에 git 정보를 읽는 공용 유틸.
// next.config.ts(전체 프로젝트 버전)와 compute-asset-versions.mjs(자산별 버전)가 같이 쓴다.
// (전체·자산 버전 계산 로직이 두 곳에 따로 있으면 어긋날 수 있어 한 곳으로 모은다)

import {execSync} from 'node:child_process'

const run = (command) =>
    execSync(command, {stdio: ['ignore', 'pipe', 'ignore']})
        .toString()
        .trim()

// 현재 HEAD 의 버전 — 커밋 SHA 는 섞지 않고 태그명만 보여준다(--abbrev=0).
// 태그 이후 커밋이 더 있어도(아직 다음 릴리스 전) 마지막 태그를 그대로 보여준다 —
// resolvePathVersion 이 반환하는 '깨끗한 태그명'과 형식이 같아야 isCurrent 비교가 맞아떨어진다.
export const resolveHeadVersion = () => {
    try {
        return run('git describe --tags --abbrev=0')
    } catch {
        return '미배포' // 태그가 하나도 없음
    }
}

// HEAD 가 태그가 찍힌 바로 그 커밋인지(= 방금 그 버전으로 공유된 시점인지).
// resolveHeadVersion 은 태그 이후 커밋이 더 있어도 마지막 태그명을 그대로 보여주므로,
// 이 값 없이 버전 문자열만 비교하면 '아직 배포 안 한 work 작업 중'에도 예전 태그와
// 우연히 같아 보여 자산이 잘못 하이라이트될 수 있다 — isCurrent 계산에 반드시 같이 쓴다.
export const isHeadAtTag = () => {
    try {
        return !/-\d+-g[0-9a-f]+$/.test(run('git describe --tags --always'))
    } catch {
        return false
    }
}

// 주어진 경로(파일·폴더)가 마지막으로 바뀐 시점을 '그 변경을 포함하는 가장 가까운 태그'로 표현한다.
// 예: v0.1.0 이후 globals.css 만 바뀌었다면 → v0.1.0 은 그 변경을 포함하지 않으므로,
//     다음 태그(v0.2.0)가 만들어져야 그 값이 나온다. 아직 태그되지 않았으면 '미배포'.
export const resolvePathVersion = (path) => {
    let lastCommit
    try {
        lastCommit = run(`git log -1 --format=%H -- "${path}"`)
    } catch {
        return '-'
    }
    if (!lastCommit) return '-'

    try {
        const described = run(`git describe --tags --contains "${lastCommit}"`)
        // "v0.2.0~3" 처럼 태그 뒤에 조상 거리(~N)가 붙을 수 있어, 태그명만 잘라낸다.
        return described.split(/[~^]/)[0]
    } catch {
        return '미배포' // 어떤 태그에도 포함되지 않음 = 마지막 릴리스 이후 변경, 아직 공유 전
    }
}
