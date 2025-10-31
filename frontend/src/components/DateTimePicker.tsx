import { useMemo, useState } from "react"
import { format, setHours, setMinutes } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  value: Date | null
  onChange: (d: Date) => void
  label?: string
  disabled?: boolean
  minuteStep?: 5 | 10 | 15 | 30
}

export default function DateTimePicker({ value, onChange, disabled, minuteStep = 15 }: Props) {
  const [open, setOpen] = useState(false)
  const date = value ?? new Date()

  const hours = useMemo(() => [...Array(24)].map((_, i) => i), [])
  const minutes = useMemo(() => {
    const step = minuteStep
    return [...Array(Math.floor(60 / step))].map((_, i) => i * step)
  }, [minuteStep])

  function setH(h: number) {
    onChange(setHours(date, h))
  }
  function setM(m: number) {
    onChange(setMinutes(date, m))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("justify-start w-full font-normal")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPpp") : "Pick date & time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-[320px]" align="start">
        <div className="space-y-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onChange(setMinutes(setHours(d, date.getHours()), date.getMinutes()))}
            initialFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" />
              <Select value={String(date.getHours())} onValueChange={(v) => setH(Number(v))}>
                <SelectTrigger aria-label="Hour">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {hours.map((h) => (
                    <SelectItem key={h} value={String(h)}>{h.toString().padStart(2, "0")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-70">Min</span>
              <Select value={String(date.getMinutes() - (date.getMinutes() % minuteStep))} onValueChange={(v) => setM(Number(v))}>
                <SelectTrigger aria-label="Minute">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {minutes.map((m) => (
                    <SelectItem key={m} value={String(m)}>{m.toString().padStart(2, "0")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
