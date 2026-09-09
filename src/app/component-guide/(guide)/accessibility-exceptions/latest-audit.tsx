import auditData from '@/content/publishing-guide/accessibility-audit.json'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'

export type Audit = {
    checkedAt: string | null
    commit: string | null
    sourceHash: string | null
    validatorVersion: string | null
    screens: {
        path: string
        name: string
        errors: number
        warnings: number
        messages: {type: string; subType?: string; message: string; lastLine?: number}[]
    }[]
}

export default function LatestAudit() {
    const audit: Audit = auditData
    const hasResult = Boolean(audit.checkedAt && audit.sourceHash && audit.screens.length)
    const handoff = process.env.NEXT_PUBLIC_ACCESSIBILITY_HANDOFF === 'true'
    const current = hasResult && audit.sourceHash === process.env.NEXT_PUBLIC_ACCESSIBILITY_SOURCE
    return (
        <BaseCard
            title="최근 W3C 검사 결과"
            subtitle="운영 빌드의 초기 HTML 검사입니다. 모달 조작 후 DOM과 WAVE 검사는 별도 확인합니다."
            action={
                <Badge color={current ? 'success' : 'warning'}>
                    {!hasResult
                        ? '검사 기록 없음'
                        : handoff
                          ? '전달 시점 검사 기록'
                          : current
                            ? '현재 빌드와 일치'
                            : '재검사 필요'}
                </Badge>
            }
        >
            <div className="flex flex-col gap-4">
                <ul className="list-disc space-y-2 pl-5">
                    {handoff ? (
                        <li>
                            전달 시점의 검사 결과입니다. 이후 개발 변경은 반영되지 않으며, 현재 화면의 검사는 별도로
                            진행합니다.
                        </li>
                    ) : (
                        <>
                            <li>
                                갱신: <code>VNU_JAR=/절대경로/vnu.jar yarn audit:accessibility</code> 실행 후 개발 서버
                                재시작 또는 재빌드합니다.
                            </li>
                            <li>소스 변경 시 재검사가 필요합니다. 소스 일치는 접근성 통과 판정이 아닙니다.</li>
                        </>
                    )}
                    <li>WAVE: 자동 갱신 대상이 아닙니다. 증적 작성 시 현재 화면을 별도로 검사합니다.</li>
                </ul>
                {hasResult ? (
                    <>
                        <p>
                            검사일 {audit.checkedAt} · 커밋 {audit.commit?.slice(0, 7)} · Nu Html Checker{' '}
                            {audit.validatorVersion}
                        </p>
                        <p>
                            {audit.screens.length}개 화면 · 오류{' '}
                            {audit.screens.reduce((sum, screen) => sum + screen.errors, 0)}건 · 경고{' '}
                            {audit.screens.reduce((sum, screen) => sum + screen.warnings, 0)}건
                        </p>
                    </>
                ) : (
                    <p>아직 자동 검사 결과가 없습니다. 아래 과거 검사 기록을 현재 결과로 사용하지 않습니다.</p>
                )}
            </div>
        </BaseCard>
    )
}
