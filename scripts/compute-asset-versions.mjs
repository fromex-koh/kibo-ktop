// publishing-index.json 의 assetVersions(name·kind·path)를 읽어, 각 경로의 버전을
// git 히스토리에서 자동 계산하고 src/content/asset-versions.generated.json 에 쓴다.
// ⚠️ 생성 파일이다 — 직접 수정하지 말 것. 값을 바꾸려면 publishing-index.json 의 path 를 고친다.
// (tokens.json → build-tokens.mjs → tokens.css 와 같은 패턴)

import { readFileSync, writeFileSync } from 'node:fs';
import { isHeadAtTag, resolveHeadVersion, resolvePathVersion } from './git-info.mjs';

const SOURCE = 'src/content/publishing-index.json';
const OUTPUT = 'src/content/asset-versions.generated.json';

const { assetVersions } = JSON.parse(readFileSync(SOURCE, 'utf8'));
const headVersion = resolveHeadVersion();
// 태그 이후 커밋이 더 있으면(작업 중) 버전 문자열만으로는 오탐(우연한 일치)이 날 수 있어
// "지금이 정확히 그 태그 시점"일 때만 하이라이트를 켠다. work 에서의 평소 개발 중엔 꺼져 있다가,
// main 에 머지해 새 태그를 찍은 그 순간 빌드에서만 실제로 바뀐 자산이 켜진다.
const atTag = isHeadAtTag();

const generated = assetVersions.map(({ name, path }) => {
  const version = resolvePathVersion(path);
  return { name, version, isCurrent: atTag && version === headVersion };
});

writeFileSync(OUTPUT, `${JSON.stringify(generated, null, 2)}\n`);

const updated = generated.filter((a) => a.isCurrent).map((a) => a.name);
console.log(
  `✅ 자산 버전 계산 완료 (현재 ${headVersion}${updated.length ? `, 이번 릴리스 변경: ${updated.join(', ')}` : ''})`,
);
