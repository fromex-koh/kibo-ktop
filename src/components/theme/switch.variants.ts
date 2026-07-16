const switchRootClassName =
    'peer group/switch focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground-subtle data-disabled:bg-control-disabled data-disabled:data-[state=checked]:bg-control-disabled data-disabled:data-[state=unchecked]:bg-control-disabled relative inline-flex shrink-0 items-center rounded-full border border-transparent p-1 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid aria-invalid:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-100'
const switchThumbClassName =
    'group/thumb bg-surface text-foreground-subtle data-[state=checked]:text-primary group-data-disabled/switch:bg-disabled-subtle group-data-disabled/switch:text-disabled pointer-events-none flex items-center justify-center rounded-full ring-0 transition-transform'

export {switchRootClassName, switchThumbClassName}
