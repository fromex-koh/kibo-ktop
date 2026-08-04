import fs from 'node:fs'
import path from 'node:path'

const PAGE_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js']
const ROUTE_GROUP_PATTERN = /^\(.+\)$/

const findPageFile = (directory) =>
    PAGE_EXTENSIONS.map((extension) => path.join(directory, `page.${extension}`)).find((file) => fs.existsSync(file))

const findRoutePage = (directory, segments, index) => {
    if (index === segments.length) return findPageFile(directory)

    const segment = segments[index]
    const directDirectory = path.join(directory, segment)
    const directPage = fs.existsSync(directDirectory) ? findRoutePage(directDirectory, segments, index + 1) : undefined
    if (directPage) return directPage

    const routeGroupDirectories = fs
        .readdirSync(directory, {withFileTypes: true})
        .filter((entry) => entry.isDirectory() && ROUTE_GROUP_PATTERN.test(entry.name))
        .sort((left, right) => left.name.localeCompare(right.name))

    for (const routeGroup of routeGroupDirectories) {
        const groupedDirectory = path.join(directory, routeGroup.name)
        const groupedPage = findRoutePage(groupedDirectory, segments, index)
        if (groupedPage) return groupedPage
    }

    return undefined
}

// URL 경로에는 포함되지 않는 Next.js Route Group 폴더를 건너뛰고 page 파일을 찾는다.
export const findAppPage = (root, routePath) => {
    const segments = routePath.split('/').filter(Boolean)
    const pageFile = findRoutePage(path.join(root, 'src/app'), segments, 0)
    return pageFile ? path.relative(root, pageFile) : undefined
}
