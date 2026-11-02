import {statSync} from 'node:fs'
import path from 'node:path'
import type {ElementType} from 'react'
import Image, {type StaticImageData} from 'next/image'
import {cn} from '@/lib/utils'

// 컴포넌트 가이드의 이미지 · 아이콘 목록 틀 — 묶음 제목 · 한 줄 설명 · 파일 정보 + 그림 카드.
// 라이트 · 다크 짝은 한 카드에 나란히 보인다. 미리보기 바탕은 가이드 테마와 상관없이 각 테마로 고정한다.

type GuideAssetFile = {
    file: string
    src: StaticImageData
}

type GuideAssetItem = GuideAssetFile & {
    label: string
    /** 미리보기 그림 크기(리터럴 클래스). */
    className: string
    /** 짝이 없는 그림의 바탕 클래스. */
    surfaceClassName?: string
    /** 짝이 없는 그림의 바탕 이름(예: 남색 머리글 위). */
    surfaceNote?: string
    /** 짝 그림의 칸 색 — 실제 화면과 같은 색(bg-*). 없으면 카드 면. */
    tile?: string
    dark?: GuideAssetFile
}

type GuideAssetGroupData = {
    key: string
    title: string
    description: string
    folder: string
    usedIn: string
    size: string
    items: readonly GuideAssetItem[]
}

type GuideAssetGroupProps = {
    group: GuideAssetGroupData
    /** 제목 태그 — 문서 위계에 맞춰 넘긴다. */
    headingLevel?: 'h4' | 'h5'
    /** 짝이 없는 그림 카드의 격자. */
    gridClassName?: string
    sizes?: string
}

const PAIR_GRID_CLASS_NAME = 'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'
const SINGLE_GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6'
const PAIR_TILE_CLASS_NAME = 'border-subtle-3 flex min-h-24 w-full items-center justify-center rounded-sm border p-3'

const BYTES_PER_KB = 1024
const KB_PER_MB = 1024
// 이 값보다 작은 파일은 소수 첫째 자리까지 적는다(1KB 미만이 0KB 로 보이지 않게).
const DECIMAL_KB_LIMIT = 10

// 파일 용량 — 빌드 때 public 의 실제 파일을 읽는다. 이미지를 교체하면 이 값도 함께 바뀐다.
const getFileBytes = (folder: string, file: string) => statSync(path.join(process.cwd(), folder, file)).size

const formatFileSize = (bytes: number) => {
    const kb = bytes / BYTES_PER_KB
    if (kb >= KB_PER_MB) return `${(kb / KB_PER_MB).toFixed(1)}MB`
    return kb < DECIMAL_KB_LIMIT ? `${kb.toFixed(1)}KB` : `${Math.round(kb)}KB`
}

const describeFile = (folder: string, {file, src}: GuideAssetFile) =>
    `${src.width}×${src.height}px · ${formatFileSize(getFileBytes(folder, file))}`

// 묶음 목록 전체의 파일 수 · 용량 — 짝 그림은 두 개로 센다.
const summarizeAssets = (groups: readonly Pick<GuideAssetGroupData, 'folder' | 'items'>[]) => {
    const bytes = groups.flatMap(({folder, items}) =>
        items.flatMap((item) => [item, ...(item.dark ? [item.dark] : [])].map(({file}) => getFileBytes(folder, file))),
    )
    return {count: bytes.length, totalSize: formatFileSize(bytes.reduce((sum, size) => sum + size, 0))}
}

const AssetFileInfo = ({text, file}: {text: string; file: string}) => (
    <>
        <code className="text-foreground-subtle w-full font-mono text-xs break-all">{file}</code>
        <span className="typo-caption-regular text-foreground-subtle tabular-nums">{text}</span>
    </>
)

const PairCell = ({
    theme,
    asset,
    item,
    text,
    sizes,
}: {
    theme: 'light' | 'dark'
    asset: GuideAssetFile
    item: GuideAssetItem
    text: string
    sizes?: string
}) => (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
        <span className={cn(theme, PAIR_TILE_CLASS_NAME, item.tile ?? 'bg-card')}>
            <Image src={asset.src} alt="" sizes={sizes} className={cn('max-w-full', item.className)} />
        </span>
        <span className="typo-caption-medium text-label-foreground">{theme === 'light' ? '라이트' : '다크'}</span>
        <AssetFileInfo file={asset.file} text={text} />
    </div>
)

const GuideAssetGroup = ({
    group,
    headingLevel = 'h4',
    gridClassName = SINGLE_GRID_CLASS_NAME,
    sizes,
}: GuideAssetGroupProps) => {
    const Heading: ElementType = headingLevel
    const hasPair = group.items.some((item) => item.dark)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Heading className="typo-title-m-bold text-foreground">{group.title}</Heading>
                <p className="typo-body-l-regular text-label-foreground">{group.description}</p>
            </div>
            <dl className="typo-body-m-regular text-foreground-subtle grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt>폴더</dt>
                <dd className="min-w-0">
                    <code className="text-foreground break-all">{group.folder}</code>
                </dd>
                <dt>쓰는 곳</dt>
                <dd className="min-w-0">
                    <code className="text-foreground break-all">{group.usedIn}</code>
                </dd>
                <dt>크기</dt>
                <dd className="min-w-0">
                    <code className="text-foreground">{group.size}</code>
                </dd>
            </dl>
            <ul className={hasPair ? PAIR_GRID_CLASS_NAME : gridClassName}>
                {group.items.map((item) => (
                    <li
                        key={item.file}
                        className="border-border flex min-w-0 flex-col items-center gap-3 rounded-md border p-4 text-center"
                    >
                        <span className="typo-body-m-bold text-foreground break-keep">{item.label}</span>
                        {item.dark ? (
                            <div className="grid w-full grid-cols-2 gap-3">
                                <PairCell
                                    theme="light"
                                    asset={item}
                                    item={item}
                                    text={describeFile(group.folder, item)}
                                    sizes={sizes}
                                />
                                <PairCell
                                    theme="dark"
                                    asset={item.dark}
                                    item={item}
                                    text={describeFile(group.folder, item.dark)}
                                    sizes={sizes}
                                />
                            </div>
                        ) : (
                            <>
                                <span className="flex min-h-24 w-full items-center justify-center">
                                    <span className={item.surfaceClassName}>
                                        <Image src={item.src} alt="" sizes={sizes} className={item.className} />
                                    </span>
                                </span>
                                {item.surfaceNote ? (
                                    <span className="typo-caption-regular text-foreground-subtle">
                                        {item.surfaceNote}
                                    </span>
                                ) : null}
                                <AssetFileInfo file={item.file} text={describeFile(group.folder, item)} />
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {GuideAssetGroup, summarizeAssets}
export type {GuideAssetGroupData, GuideAssetItem}
