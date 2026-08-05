/**
 * Source: shadcn radix-nova registry
 * Purpose: 원본 className 기준선 비교용
 * Do not import from application code.
 */
export const shadcnAccordionClassName = 'flex w-full flex-col'
export const shadcnAccordionItemClassName = 'not-last:border-b'
export const shadcnAccordionTriggerClassName =
    'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground'
export const shadcnAccordionContentClassName =
    'overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up'
export const shadcnAccordionContentBodyClassName =
    'h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'
