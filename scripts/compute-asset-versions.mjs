// publishing-index.json 의 assetVersions(name·kind·path)를 읽어, 각 경로의 버전을
// git 히스토리에서 자동 계산하고 src/content/asset-versions.generated.json 에 쓴다.
// ⚠️ 생성 파일이다 — 직접 수정하지 말 것. 값을 바꾸려면 publishing-index.json 의 path 를 고친다.
// (tokens.json → build-tokens.mjs → tokens.css 와 같은 패턴)

import { readFileSync, writeFileSync } from 'node:fs';
import { resolveHeadVersion, resolvePathVersion } from './git-info.mjs';

const SOURCE = 'src/content/publishing-index.json';
const OUTPUT = 'src/content/asset-versions.generated.json';

const { assetVersions } = JSON.parse(readFileSync(SOURCE, 'utf8'));
const headVersion = resolveHeadVersion();

const generated = assetVersions.map(({ name, path }) => {
  const version = resolvePathVersion(path);
  return { name, version, isCurrent: version === headVersion };
});

writeFileSync(OUTPUT, `${JSON.stringify(generated, null, 2)}\n`);

const updated = generated.filter((a) => a.isCurrent).map((a) => a.name);
console.log(
  `✅ 자산 버전 계산 완료 (현재 ${headVersion}${updated.length ? `, 이번 릴리스 변경: ${updated.join(', ')}` : ''})`,
);
