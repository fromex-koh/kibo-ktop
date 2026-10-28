import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

// K-BIGx 보고서 PDF 템플릿(단독 HTML)을 내려받는 주소 — 퍼블리싱 인덱스의 [보고서 템플릿 다운로드]가 가리킨다.
// 원본은 templates/kbigx-report-template.html(원본 퍼블리싱 저장소에서 만들어 전달하는 결과물)이고, 백엔드가 데이터를 넣어 PDF 를 만든다.
// 빌드 때 한 번 읽어 정적 응답으로 굳힌다 — 요청마다 파일을 읽지 않고, 배포 서버에 templates/ 가 없어도 된다.
export const dynamic = 'force-static'

const TEMPLATE_PATH = join(process.cwd(), 'templates', 'kbigx-report-template.html')
const DOWNLOAD_FILE_NAME = 'kbigx-report-template.html'

export const GET = async () =>
    new Response(await readFile(TEMPLATE_PATH), {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            // 브라우저가 화면으로 열지 않고 파일로 저장하게 한다.
            'Content-Disposition': `attachment; filename="${DOWNLOAD_FILE_NAME}"`,
        },
    })
