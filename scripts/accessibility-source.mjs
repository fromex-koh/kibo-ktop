import {createHash} from 'node:crypto'
import {existsSync, readdirSync, readFileSync} from 'node:fs'
import path from 'node:path'

// 검사 결과 자체는 지문에서 제외해 결과 저장 후에도 같은 소스로 비교합니다.
export function accessibilitySourceHash(root = process.cwd()) {
    const hash = createHash('sha256')
    const visit = (relative) => {
        if (relative === 'src/content/publishing-guide/accessibility-audit.json') return
        const absolute = path.join(root, relative)
        if (!existsSync(absolute)) return
        hash.update(relative + '\0')
        const entries = readdirSafe(absolute)
        if (entries) for (const name of entries.sort()) visit(path.join(relative, name))
        else hash.update(readFileSync(absolute))
    }
    for (const entry of ['src', 'public', 'package.json', 'yarn.lock', 'next.config.ts', 'tokens.json', 'scripts'])
        visit(entry)
    return hash.digest('hex')
}

function readdirSafe(file) {
    try {
        return readdirSync(file)
    } catch (error) {
        if (error.code === 'ENOTDIR') return null
        throw error
    }
}
