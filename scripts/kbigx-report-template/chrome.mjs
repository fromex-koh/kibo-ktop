// 헤드리스 Chrome 을 띄워 DevTools 프로토콜로 페이지를 열고 스크립트를 실행한다(build.mjs 전용).
// Chrome 위치는 CHROME_PATH 환경변수가 우선이고, 없으면 macOS · Linux 의 기본 설치 경로를 찾는다.
import {spawn} from 'node:child_process'
import {existsSync, mkdtempSync, rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

const CHROME_CANDIDATES = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
]
const DEBUG_PORT = 9335
const CONNECT_RETRY = 50
const CONNECT_INTERVAL_MS = 200

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const findChrome = () => {
    const found = [process.env.CHROME_PATH, ...CHROME_CANDIDATES].find((path) => path && existsSync(path))
    if (!found)
        throw new Error('Chrome 을 찾지 못했습니다. CHROME_PATH 환경변수에 Chrome 실행 파일 경로를 넣어 주세요.')
    return found
}

// 디버그 포트를 이미 다른 프로그램(다른 Chrome 등)이 쓰고 있으면 엉뚱한 브라우저에 붙으므로 먼저 멈춘다.
const assertPortFree = async () => {
    const isInUse = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)
        .then(() => true)
        .catch(() => false)
    if (isInUse)
        throw new Error(
            `${DEBUG_PORT} 포트를 이미 쓰고 있습니다. 그 프로그램(디버그 모드 Chrome 등)을 끄거나 chrome.mjs 의 DEBUG_PORT 를 바꿔 주세요.`,
        )
}

const findPageTarget = async () => {
    for (let attempt = 0; attempt < CONNECT_RETRY; attempt += 1) {
        await sleep(CONNECT_INTERVAL_MS)
        const target = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)
            .then((response) => response.json())
            .then((targets) => targets.find((item) => item.type === 'page'))
            .catch(() => undefined)
        if (target) return target
    }
    throw new Error('헤드리스 Chrome 에 연결하지 못했습니다.')
}

// 용지 폭(1360)이 줄지 않는 창 크기 · 캔버스(워드 클라우드)를 선명하게 뜨기 위한 2배 배율.
const VIEWPORT = {width: 1440, height: 2000, deviceScaleFactor: 2, mobile: false}

const openChrome = async () => {
    await assertPortFree()
    const profile = mkdtempSync(join(tmpdir(), 'kbigx-template-'))
    const chrome = spawn(
        findChrome(),
        [
            '--headless=new',
            '--disable-gpu',
            `--remote-debugging-port=${DEBUG_PORT}`,
            `--user-data-dir=${profile}`,
            'about:blank',
        ],
        {stdio: 'ignore'},
    )
    // Chrome 이 끝난 뒤 임시 프로필을 지운다 — 끝나기 전에 지우면 Chrome 이 아직 쓰는 파일 때문에 실패한다.
    const stopChrome = async () => {
        if (chrome.exitCode === null && chrome.signalCode === null) {
            const exited = new Promise((resolve) => chrome.once('exit', resolve))
            chrome.kill()
            await exited
        }
        rmSync(profile, {recursive: true, force: true, maxRetries: 5, retryDelay: CONNECT_INTERVAL_MS})
    }
    // 연결에 실패하면 띄운 Chrome · 임시 프로필을 정리하고 오류를 그대로 올린다.
    const socket = await findPageTarget()
        .then(async (target) => {
            const opened = new WebSocket(target.webSocketDebuggerUrl)
            await new Promise((resolve, reject) => {
                opened.addEventListener('open', resolve, {once: true})
                opened.addEventListener('error', () => reject(new Error('헤드리스 Chrome 에 연결하지 못했습니다.')), {
                    once: true,
                })
            })
            return opened
        })
        .catch(async (error) => {
            await stopChrome()
            throw error
        })

    let lastId = 0
    const pending = new Map()
    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        if (!message.id || !pending.has(message.id)) return
        pending.get(message.id)(message)
        pending.delete(message.id)
    })
    const send = (method, params = {}) =>
        new Promise((resolve) => {
            lastId += 1
            pending.set(lastId, resolve)
            socket.send(JSON.stringify({id: lastId, method, params}))
        })
    const evaluate = async (expression) => {
        const {result} = await send('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true})
        if (result.exceptionDetails) throw new Error(`페이지 스크립트 오류: ${result.exceptionDetails.text}`)
        return result.result.value
    }
    const open = async (url) => {
        await send('Page.navigate', {url})
        await sleep(CONNECT_INTERVAL_MS)
    }
    const close = async () => {
        socket.close()
        await stopChrome()
    }

    await send('Page.enable')
    await send('Emulation.setDeviceMetricsOverride', VIEWPORT)
    return {open, evaluate, close}
}

export {openChrome}
