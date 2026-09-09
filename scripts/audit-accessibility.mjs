import {execFileSync, spawn, spawnSync} from 'node:child_process'
import {mkdtempSync, readFileSync, writeFileSync, renameSync, rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {setTimeout as delay} from 'node:timers/promises'
import {accessibilitySourceHash} from './accessibility-source.mjs'
import {findAppPage} from './find-app-page.mjs'

// 운영 빌드를 직접 생성하므로 개발 서버나 다른 소스의 결과를 최신으로 저장하지 않습니다.
const jar = process.env.VNU_JAR
if (!jar)
    throw new Error('VNU_JAR에 Nu Html Checker의 vnu.jar 절대 경로를 지정하세요. docs/accessibility-audit.md 참고')
const validatorVersion = execFileSync('java', ['-jar', jar, '--version'], {encoding: 'utf8'}).trim()
const root = process.cwd()
const output = path.join(root, 'src/content/publishing-guide/accessibility-audit.json')
const next = path.join(root, 'node_modules/next/dist/bin/next')
execFileSync('yarn', ['prebuild'], {stdio: 'inherit'})
const sourceHash = accessibilitySourceHash(root)
execFileSync(process.execPath, [next, 'build'], {stdio: 'inherit'})
if (accessibilitySourceHash(root) !== sourceHash) throw new Error('빌드 중 소스가 변경되었습니다. 다시 실행하세요.')
const git = spawnSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'})
const commit = git.status === 0 ? git.stdout.trim() : null
const registry = JSON.parse(readFileSync('src/content/publishing-guide/screen-registry.json', 'utf8'))
const screens = [
    ...new Map(
        registry.screens
            .filter(
                (screen) =>
                    /^\/(corp|org)\//.test(screen.path) &&
                    screen.placeholder !== true &&
                    findAppPage(root, screen.path),
            )
            .map((screen) => [screen.path, screen]),
    ).values(),
]
if (!screens.length) throw new Error('검사 대상 화면이 없습니다.')
const port = Number(process.env.AUDIT_PORT || 3099)
const server = spawn(process.execPath, [next, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    stdio: ['ignore', 'pipe', 'pipe'],
})
const temp = mkdtempSync(path.join(tmpdir(), 'ktop-audit-'))
let serverError = ''
server.stderr.on('data', (chunk) => {
    serverError += chunk
})
let ready = false
server.stdout.on('data', (chunk) => {
    if (String(chunk).includes('Ready')) ready = true
})
try {
    for (let i = 0; !ready && i < 120; i++) {
        if (server.exitCode !== null) throw new Error(`검사 서버 시작 실패: ${serverError}`)
        await delay(500)
    }
    if (!ready) throw new Error('검사 서버 준비 시간 초과')
    const results = []
    for (const screen of screens) {
        const response = await fetch(`http://127.0.0.1:${port}${screen.path}`, {
            redirect: 'manual',
            signal: AbortSignal.timeout(60000),
        })
        if (response.status !== 200)
            throw new Error(`${screen.path}: HTTP ${response.status} — 결과를 저장하지 않습니다.`)
        const html = path.join(temp, 'screen.html')
        writeFileSync(html, await response.text())
        const validation = spawnSync('java', ['-jar', jar, '--format', 'json', html], {
            encoding: 'utf8',
            maxBuffer: 32 * 1024 * 1024,
            timeout: 60000,
        })
        if (validation.error || validation.signal) throw validation.error || new Error('검사기 실행 중단')
        const raw = validation.stdout?.trim() || validation.stderr?.trim()
        if (!raw) throw new Error(`${screen.path}: 검사기 JSON 결과가 없습니다.`)
        const report = JSON.parse(raw)
        if (!Array.isArray(report.messages) || report.messages.some((message) => message.type === 'non-document-error'))
            throw new Error(`${screen.path}: 검사 실패`)
        const messages = report.messages.map(({type, subType, message, lastLine, firstColumn}) => ({
            type,
            subType,
            message,
            lastLine,
            firstColumn,
        }))
        results.push({
            path: screen.path,
            name: screen.name,
            errors: messages.filter((m) => m.type === 'error').length,
            warnings: messages.filter((m) => m.subType === 'warning').length,
            messages,
        })
        console.log(`[${results.length}/${screens.length}] ${screen.path}`)
    }
    if (accessibilitySourceHash(root) !== sourceHash) throw new Error('검사 중 소스가 변경되었습니다. 다시 실행하세요.')
    const report = {checkedAt: new Date().toISOString(), commit, sourceHash, validatorVersion, screens: results}
    writeFileSync(output + '.tmp', JSON.stringify(report, null, 4) + '\n')
    renameSync(output + '.tmp', output)
    console.log('검사 결과 저장 완료. 실행 중인 개발 서버를 재시작하거나 다시 빌드하면 안내 페이지에 반영됩니다.')
} finally {
    server.kill('SIGTERM')
    rmSync(temp, {recursive: true, force: true})
}
