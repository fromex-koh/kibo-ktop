type PropsTableItem = readonly [
    component: string,
    name: string,
    description: string,
    defaultValue: string,
    type: string,
]

const getComponentRowSpan = (items: readonly PropsTableItem[], index: number) => {
    const component = items[index]?.[0]

    if (index > 0 && items[index - 1]?.[0] === component) return 0

    let rowSpan = 1
    while (items[index + rowSpan]?.[0] === component) rowSpan += 1
    return rowSpan
}

const PropsTable = ({items, caption}: {items: readonly PropsTableItem[]; caption: string}) => (
    <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-left">
            <caption className="sr-only">{caption}</caption>
            <thead>
                <tr className="border-border bg-card border-b">
                    {['Component', 'Name', 'Description', 'Default', 'Type'].map((heading) => (
                        <th key={heading} scope="col" className="typo-body-l-medium px-4 py-3">
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {items.map(([component, name, description, defaultValue, type], index) => (
                    <tr key={`${component}-${name}`} className="border-border border-b last:border-b-0">
                        {getComponentRowSpan(items, index) > 0 ? (
                            <th
                                scope="rowgroup"
                                rowSpan={getComponentRowSpan(items, index)}
                                className="typo-body-l-medium text-foreground border-border border-r px-4 py-3 align-top font-mono"
                            >
                                {component}
                            </th>
                        ) : null}
                        <th scope="row" className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono">
                            {name}
                        </th>
                        <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">{description}</td>
                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                            {defaultValue}
                        </td>
                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">{type}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

export default PropsTable
export type {PropsTableItem}
