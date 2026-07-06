// 빌드/개발 시점에 git 정보를 읽는 공용 유틸.
// next.config.ts(전체 프로젝트 버전)와 compute-asset-versions.mjs(자산별 버전)가 같이 쓴다.
// (전체·자산 버전 계산 로직이 두 곳에 따로 있으면 어긋날 수 있어 한 곳으로 모은다)

import { execSync } from 'node:child_process';

const run = (command) =>
  execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();

// 현재 HEAD 의 버전 — 태그가 있으면 최신 태그(vX.Y.Z), 없으면 short commit SHA.
export const resolveHeadVersion = () => {
  try {
    return run('git describe --tags --always');
  } catch {
    return 'unknown';
  }
};

// 주어진 경로(파일·폴더)가 마지막으로 바뀐 시점을 '그 변경을 포함하는 가장 가까운 태그'로 표현한다.
// 예: v0.1.0 이후 globals.css 만 바뀌었다면 → v0.1.0 은 그 변경을 포함하지 않으므로,
//     다음 태그(v0.2.0)가 만들어져야 그 값이 나온다. 아직 태그되지 않았으면 '미배포'.
export const resolvePathVersion = (path) => {
  let lastCommit;
  try {
    lastCommit = run(`git log -1 --format=%H -- "${path}"`);
  } catch {
    return '-';
  }
  if (!lastCommit) return '-';

  try {
    const described = run(`git describe --tags --contains "${lastCommit}"`);
    // "v0.2.0~3" 처럼 태그 뒤에 조상 거리(~N)가 붙을 수 있어, 태그명만 잘라낸다.
    return described.split(/[~^]/)[0];
  } catch {
    return '미배포'; // 어떤 태그에도 포함되지 않음 = 마지막 릴리스 이후 변경, 아직 공유 전
  }
};
