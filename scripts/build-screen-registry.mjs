import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const REGISTRY_PATH = path.join(ROOT, 'src/content/publishing-guide/screen-registry.json')
const OUTPUT_PATH = path.join(ROOT, 'src/content/publishing-guide/screen-registry.generated.json')
const PAGE_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js']
const GENERATED_FILE_NOTICE =
    '자동 생성 파일 — 직접 수정하지 않습니다. 경로·화면 정보는 screen-registry.json에서 관리하며, page 파일 존재 여부는 dev·build·verify 시 자동 반영되고 릴리스 버전은 main 릴리스에서 Git 이력으로 확정됩니다.'

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'))
const previousOutput = fs.existsSync(OUTPUT_PATH) ? JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8')) : {screens: []}

if (!Array.isArray(registry.screens)) {
    throw new Error('screen-registry.json의 screens는 배열이어야 합니다.')
}

const screens = registry.screens.map((screen) => {
    const routeDirectory = path.join(ROOT, 'src/app', ...screen.path.split('/').filter(Boolean))
    const pageFile = PAGE_EXTENSIONS.map((extension) => path.join(routeDirectory, `page.${extension}`)).find((file) =>
        fs.existsSync(file),
    )
    const implemented = pageFile !== undefined
    const previous = previousOutput.screens.find((item) => item.key === screen.key)
    const previousVersion = typeof previous?.version === 'string' ? previous.version : undefined
    const version = implemented
        ? previousVersion === undefined || previousVersion === '-'
            ? '미배포'
            : previousVersion
        : '미배포'

    return {
        key: screen.key,
        implemented,
        implementationStatus: implemented ? 'in-progress' : 'planned',
        version,
        isCurrent: previous?.isCurrent === true,
    }
})

const output = `${JSON.stringify({'//': GENERATED_FILE_NOTICE, screens}, null, 4)}\n`
const current = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, 'utf8') : ''

if (current !== output) {
    fs.writeFileSync(OUTPUT_PATH, output)
    console.log(
        `✅ 화면 경로 상태 생성 — 등록 ${screens.length}건 · 구현 ${screens.filter((screen) => screen.implemented).length}건`,
    )
} else {
    console.log(
        `✅ 화면 경로 상태 최신 — 등록 ${screens.length}건 · 구현 ${screens.filter((screen) => screen.implemented).length}건`,
    )
}
