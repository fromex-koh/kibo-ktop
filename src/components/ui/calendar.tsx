"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  calendarClassName,
  calendarClassNames,
  calendarDayButtonClassName,
} from '@/components/theme/calendar.variants'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        calendarClassName,
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(calendarClassNames.root, defaultClassNames.root),
        months: cn(calendarClassNames.months, defaultClassNames.months),
        month: cn(calendarClassNames.month, defaultClassNames.month),
        nav: cn(calendarClassNames.nav, defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          calendarClassNames.button_previous,
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          calendarClassNames.button_next,
          defaultClassNames.button_next
        ),
        month_caption: cn(
          calendarClassNames.month_caption,
          defaultClassNames.month_caption
        ),
        dropdowns: cn(calendarClassNames.dropdowns, defaultClassNames.dropdowns),
        dropdown_root: cn(
          calendarClassNames.dropdown_root,
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(calendarClassNames.dropdown, defaultClassNames.dropdown),
        caption_label: cn(
          calendarClassNames.caption_label,
          captionLayout === "label"
            ? calendarClassNames.caption_label_label
            : calendarClassNames.caption_label_dropdown,
          defaultClassNames.caption_label
        ),
        month_grid: cn(
          calendarClassNames.month_grid,
          defaultClassNames.month_grid
        ),
        weekdays: cn(calendarClassNames.weekdays, defaultClassNames.weekdays),
        weekday: cn(calendarClassNames.weekday, defaultClassNames.weekday),
        week: cn(calendarClassNames.week, defaultClassNames.week),
        week_number_header: cn(
          calendarClassNames.week_number_header,
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          calendarClassNames.week_number,
          defaultClassNames.week_number
        ),
        day: cn(
          calendarClassNames.day,
          props.showWeekNumber
            ? calendarClassNames.day_week_number
            : calendarClassNames.day_first_child,
          defaultClassNames.day
        ),
        range_start: cn(
          calendarClassNames.range_start,
          defaultClassNames.range_start
        ),
        range_middle: cn(
          calendarClassNames.range_middle,
          defaultClassNames.range_middle
        ),
        range_end: cn(calendarClassNames.range_end, defaultClassNames.range_end),
        today: cn(calendarClassNames.today, defaultClassNames.today),
        outside: cn(calendarClassNames.outside, defaultClassNames.outside),
        disabled: cn(calendarClassNames.disabled, defaultClassNames.disabled),
        hidden: cn(calendarClassNames.hidden, defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("cn-rtl-flip size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("cn-rtl-flip size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        calendarDayButtonClassName,
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
