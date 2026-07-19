const checkboxClassName =
    'peer border-control bg-surface focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled-subtle rounded-2xs relative flex size-6 shrink-0 items-center justify-center border transition-colors outline-none group-has-disabled/field:opacity-100 after:absolute after:-inset-x-3 after:-inset-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-100'
const checkboxIndicatorClassName =
    'grid place-content-center text-current transition-none [&>svg]:size-4 data-[state=indeterminate]:[&>svg]:hidden data-[state=indeterminate]:after:block data-[state=indeterminate]:after:h-0.5 data-[state=indeterminate]:after:w-3 data-[state=indeterminate]:after:rounded-full data-[state=indeterminate]:after:bg-current'

export {checkboxClassName, checkboxIndicatorClassName}
