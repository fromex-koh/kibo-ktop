import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ReleaseNoteChangeList} from '@/components/custom/release-note-change-list'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Badge} from '@/components/ui/badge'
import {RELEASE_NOTES_ARCHIVE} from '@/content/publishing-guide'

export const metadata: Metadata = {title: '버전 업데이트 아카이브'}

// 첫 버전부터 모든 릴리스의 변경사항을 최신순으로 모아 둔다. 데이터는 release-notes-archive.generated.json 이고
// 릴리스 때 scripts/compute-asset-versions.mjs 가 새 버전을 맨 앞에 넣으므로 이 화면은 손대지 않아도 쌓인다.
// 퍼블리싱 인덱스의 "버전 업데이트" 표는 최근 30개만 보여 준다.
const majorOf = (version: string) => version.replace(/^v/, '').split('.')[0]

// 메이저 버전별로 묶는다 — 아카이브가 최신순이라 묶음도 최신 메이저부터 선다.
const RELEASE_GROUPS = [...new Set(RELEASE_NOTES_ARCHIVE.map((release) => majorOf(release.version)))].map((major) => {
    const releases = RELEASE_NOTES_ARCHIVE.filter((release) => majorOf(release.version) === major)
    return {
        major,
        releases,
        latest: releases[0],
        oldest: releases[releases.length - 1],
    }
})

const LATEST_RELEASE = RELEASE_NOTES_ARCHIVE[0]
const OLDEST_RELEASE = RELEASE_NOTES_ARCHIVE[RELEASE_NOTES_ARCHIVE.length - 1]

const ARCHIVE_TOTALS = [
    {label: '전체 버전', value: `${RELEASE_NOTES_ARCHIVE.length}개`},
    {label: '최신 버전', value: LATEST_RELEASE?.version ?? '-', note: LATEST_RELEASE?.releasedAt},
    {label: '첫 버전', value: OLDEST_RELEASE?.version ?? '-', note: OLDEST_RELEASE?.releasedAt},
]

const cardHeading = (text: string) => <span className="typo-h4-bold">{text}</span>

const ReleaseArchivePage = () => (
    <GuidePageShell
        title="버전 업데이트 아카이브"
        description="첫 버전부터 지금까지의 릴리스별 변경사항을 최신순으로 모아 둔 기록입니다. 새 버전이 릴리스되면 자동으로 추가됩니다."
    >
        <BaseCard title={cardHeading('아카이브 요약')}>
            <div className="flex flex-col gap-4">
                <dl className="grid gap-3 sm:grid-cols-3">
                    {ARCHIVE_TOTALS.map((total) => (
                        <div
                            key={total.label}
                            className="border-foreground-subtle/30 bg-pastel-neutral/40 flex min-w-0 flex-col gap-2 rounded-sm border p-5"
                        >
                            <dt className="typo-body-l-medium text-label-foreground">{total.label}</dt>
                            <dd className="flex flex-wrap items-baseline gap-x-2">
                                <span className="typo-h4-bold text-foreground">{total.value}</span>
                                {total.note ? (
                                    <time dateTime={total.note} className="typo-body-l-regular text-label-foreground">
                                        {total.note}
                                    </time>
                                ) : null}
                            </dd>
                        </div>
                    ))}
                </dl>
                <nav aria-label="메이저 버전 바로가기">
                    <ul className="flex flex-wrap gap-2">
                        {RELEASE_GROUPS.map((group) => (
                            <li key={group.major}>
                                <Badge variant="outline" color="neutral" asChild>
                                    <a href={`#release-v${group.major}`}>
                                        v{group.major}.x ({group.releases.length})
                                    </a>
                                </Badge>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </BaseCard>

        {RELEASE_GROUPS.map((group, groupIndex) => (
            <div key={group.major} id={`release-v${group.major}`} className="scroll-mt-24">
                <BaseCard
                    title={cardHeading(`v${group.major}.x`)}
                    subtitle={`${group.oldest.version} (${group.oldest.releasedAt}) ~ ${group.latest.version} (${group.latest.releasedAt}) · ${group.releases.length}개 버전`}
                >
                    {/* 버전이 많고 한 버전의 변경사항도 길어 접어 둔다 — 최신 버전만 처음부터 펼친다. */}
                    <Accordion
                        type="multiple"
                        defaultValue={groupIndex === 0 ? [group.latest.version] : undefined}
                        className="gap-2"
                    >
                        {group.releases.map((release) => (
                            <AccordionItem
                                key={release.version}
                                value={release.version}
                                className="border-subtle-3 rounded-sm border bg-transparent px-4 py-1"
                            >
                                <AccordionTrigger className="py-2">
                                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        <span className="typo-body-xl-bold">{release.version}</span>
                                        <time
                                            dateTime={release.releasedAt}
                                            className="typo-body-l-regular text-foreground-subtle"
                                        >
                                            {release.releasedAt}
                                        </time>
                                        <span className="typo-body-l-regular text-foreground-subtle">
                                            변경 {release.changes.length}건
                                        </span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="typo-body-l-regular text-foreground-subtle pt-3 pb-3">
                                    <ReleaseNoteChangeList changes={release.changes} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </BaseCard>
            </div>
        ))}
    </GuidePageShell>
)

export default ReleaseArchivePage
