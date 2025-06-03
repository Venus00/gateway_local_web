import { useEffect, useState } from "react";
import { endOfWeek, format, set, subDays, subMonths } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { DateInterval, DateRange } from "react-day-picker";
import { addHours, addDays, addWeeks, startOfDay, endOfDay } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useGridStore } from "@/pages/dynamic/grid-store";

interface PropsType {
  editMode: boolean;
  isLiveView: boolean;
  setIsLiveView: (args: boolean) => void;
  dateRange: DateRange | undefined;
  setDateRange: (args: DateRange | undefined) => void;
  submitForm: () => void;
  color?: string;
  timeframe?: string;
}
export function ViewDateTimeSwitcher({
  editMode,
  isLiveView,
  setIsLiveView,
  dateRange,
  setDateRange,
  submitForm,
  color,
  timeframe,
}: PropsType) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("23:59");
  const [selectedPeriod, setselectedPeriod] = useState<string>(
    timeframe || "1H"
  );

  const handleApply = () => {
    console.log("apply data range fetch");
    if (dateRange?.from && dateRange?.to) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const updatedFrom = set(dateRange.from, {
        hours: startHour,
        minutes: startMinute,
      });
      const updatedTo = set(dateRange.to, {
        hours: endHour,
        minutes: endMinute,
      });
      setDateRange({
        from: updatedFrom,
        to: updatedTo,
      });
      setCalendarOpen(false);
    }
  };

  const handlePeriodChange = (period: string) => {
    const now = new Date();
    let from: Date = new Date();
    let to: Date = endOfDay(now);

    switch (period) {
      case "1H":
        from = addHours(now, -1);
        setStartTime(format(from, "HH:mm"));
        setEndTime(format(to, "HH:mm"));
        setselectedPeriod(period);

        break;
      case "1D":
        from = startOfDay(now);
        setStartTime("00:00");
        setEndTime("23:59");
        setselectedPeriod(period);
        break;
      case "1W":
        from = subDays(now, 7);
        setStartTime("00:00");
        setEndTime("23:59");
        setselectedPeriod(period);

        break;
      case "1M":
        from = subMonths(now, 1);
        setStartTime("00:00");
        setEndTime("23:59");
        setselectedPeriod(period);

        break;
      case "Custom":
        setselectedPeriod(period);
        setCalendarOpen(true);
        break;
      case "live":
        setselectedPeriod(period);
        setIsLiveView(true);
        break;
    }
    if (period !== "live") {
      setIsLiveView(false);
      setDateRange({ from, to });
      //submitForm();
    }
  };

  useEffect(() => {
    if (dateRange?.from !== dateRange?.to && selectedPeriod !== "live") {
      submitForm();
    }
  }, [selectedPeriod, dateRange]);
  return (
    <div className="absolute flex space-x-4 right-2 top-2">
      {!editMode && (
        <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
          <div
            className={
              "flex space-x-0 gap-0 border-primary border   rounded-lg"
            }
            style={{
              borderColor: color,
            }}
          >
            {["1H", "1D", "1W", "1M", "Custom", "live"].map((period) => (
              <button
                key={period}
                className={cn(
                  "text-xs p-1  cursor  hover:bg-primary/30 ",
                  selectedPeriod === period && " !text-white "
                )}
                style={{
                  color: color,
                  backgroundColor:
                    selectedPeriod === period ? color : "transparent",
                }}
                onClick={() => handlePeriodChange(period)}
              >
                {period}
              </button>
            ))}
          </div>
          <DialogContent className="flex-1 ">
            <DialogHeader>
              <DialogTitle>Calendar</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="">
              <Calendar
                initialFocus
                mode="range"
                className="text-sm"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
              <div className="flex justify-between">
                <div className="space-y-1">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger id="start-time" className="w-[120px]">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 * 4 }).map((_, index) => {
                        const hours = Math.floor(index / 4);
                        const minutes = (index % 4) * 15;
                        const time = `${hours
                          .toString()
                          .padStart(2, "0")}:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                        return (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end-time">End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger id="end-time" className="w-[120px]">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 * 4 }).map((_, index) => {
                        const hours = Math.floor(index / 4);
                        const minutes = (index % 4) * 15;
                        const time = `${hours
                          .toString()
                          .padStart(2, "0")}:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                        return (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value={"23:59"}>{"23:59"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="flex items-center justify-end gap-2 p-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateRange(undefined);
                    setStartTime("00:00");
                    setEndTime("23:59");
                  }}
                  className="w-full"
                >
                  Clear
                </Button>
                <Button onClick={handleApply} className="w-full">
                  Apply
                </Button>
                {/* <DialogClose asChild>
                                    
                                </DialogClose> */}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
