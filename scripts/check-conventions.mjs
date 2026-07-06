// CODE_CONVENTION / PUBLISHING_CONVENTION 중 ESLint 로 잡기 어려운 Tailwind 클래스 규칙을
// 정규식으로 정적 검사한다. 위반이 하나라도 있으면 exit 1 → pre-push 훅이 push 를 막는다.
//
// ⚠️ 자동 검사는 '기계적으로 판별 가능한' 규칙만 커버한다. Magic Number·가독성·대체 텍스트의
//    적절성 등은 사람이 판단해야 하므로 docs 의 PR 체크리스트로 수동 확인한다.
//
// 검사 대상: src/**/*.{ts,tsx}. (docs/*.md 의 '나쁜 예시' 코드블록은 검사하지 않는다.)

import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC_DIR = 'src';
const TARGET_EXT = new Set(['.ts', '.tsx']);

// [규칙ID, 설명, 정규식] — 각 소스 라인에 대해 test 한다.
const RULES = [
  {
    id: 'NA-009',
    desc: 'hex 색상 하드코딩 — 시맨틱 색상 토큰을 쓰세요',
    re: /\[#[0-9a-fA-F]{3,8}\]/,
  },
  {
    id: 'ST-004',
    desc: '고정 px 크기 — 반응형 단위(%/vh/max-w 등)를 쓰세요',
    re: /\b(?:w|h|min-w|max-w|min-h|max-h)-\[[\d.]+px\]/,
  },
  {
    id: 'CD-001',
    desc: '!important 사용 금지 — 선택자 구체성/클래스 조합으로 해결하세요',
    re: /!important|(?<=[\s"'`])!(?:bg|text|border|ring|outline|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|h|gap|rounded|shadow|z|font|leading|tracking|opacity|flex|grid|from|to|via)-/,
  },
  {
    id: 'CD-002',
    desc: 'z-index 하드코딩 금지 — DOM 순서/Portal 로 해결하세요',
    re: /\bz-\[\d+\]/,
  },
  {
    id: 'PB-05',
    desc: 'Tailwind 기본 팔레트 키 사용 금지 — 프로젝트 팔레트(0·10·30·50·70·90·100)/시맨틱 토큰을 쓰세요',
    re: /-(?:gray|zinc|slate|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:200|300|400|500|600|700|800|900|950)\b/,
  },
  {
    id: 'NA-005',
    desc: '<img> 대신 next/image 를 쓰세요',
    re: /<img[\s>]/,
  },
];

const collectFiles = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(full);
    if (TARGET_EXT.has(extname(entry.name))) return [full];
    return [];
  });
};

const files = collectFiles(SRC_DIR);
const violations = files.flatMap((file) => {
  const lines = readFileSync(file, 'utf8').split('\n');
  return lines.flatMap((line, i) =>
    RULES.filter((rule) => rule.re.test(line)).map((rule) => ({
      file,
      line: i + 1,
      rule,
      snippet: line.trim(),
    })),
  );
});

if (violations.length === 0) {
  console.log(`✅ 컨벤션 검사 통과 (검사 파일 ${files.length}개)`);
  process.exit(0);
}

console.error(`\n❌ 컨벤션 위반 ${violations.length}건 발견:\n`);
violations.forEach(({ file, line, rule, snippet }) => {
  console.error(`  ${file}:${line}  [${rule.id}] ${rule.desc}`);
  console.error(`    → ${snippet}\n`);
});
console.error('위반을 수정한 뒤 다시 커밋/푸시하세요.\n');
process.exit(1);
