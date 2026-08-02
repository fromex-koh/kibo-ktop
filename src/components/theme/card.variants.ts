export const cardClassName =
    'group/card bg-card text-card-foreground flex flex-col gap-(--card-spacing) overflow-hidden rounded-lg py-(--card-spacing) text-sm [--card-spacing:--spacing(6)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg'
export const cardHeaderClassName =
    'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)'
export const cardTitleClassName = 'text-base leading-snug font-medium group-data-[size=sm]/card:text-sm'
export const cardDescriptionClassName = 'text-muted-foreground text-sm'
export const cardActionClassName = 'col-start-2 row-span-2 row-start-1 self-start justify-self-end'
export const cardContentClassName = 'px-(--card-spacing)'
export const cardFooterClassName = 'bg-muted/50 flex items-center rounded-b-lg border-t p-(--card-spacing)'
