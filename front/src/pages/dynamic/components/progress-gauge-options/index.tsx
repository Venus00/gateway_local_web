import ColorPicker from "@/components/color-picker";
import { Table } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GaugeChartWidgetData, GaugeWidgetData } from "@/utils";
import { Minus, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";
import { useAddWidgetStore } from "../../widget-store";

const defaultTelemetry: GaugeWidgetData = {
  telemetryName: "",
  unit: "",
  stops: [],
};

export default function ProgressGaugeOptions() {
  const [telemetryData, setTelemetryData] = useState(defaultTelemetry);
  const { data, addGaugeTelemetry, deleteGaugeTelemetry } = useAddWidgetStore();
  const [stopData, setStopData] = useState<{ stop: number; color: string }[]>([
    {
      stop: 100,
      color: "#ff0000",
    },
  ]);

  const { telemetries = [] } = data.attributes as GaugeChartWidgetData;
  const { dashboard } = useGridStore();
  const location = useLocation();
  const machineId = location.pathname.split("/")[2];
  const dashboardItem = dashboard.find(
    (machine: { machineId: number }) => machine.machineId === Number(machineId)
  );
  const machine = dashboardItem ? dashboardItem.machine : undefined;
  function handleAddStop() {
    setStopData((prev) => [
      ...prev,
      {
        stop: 100,
        color: "#ff0000",
      },
    ]);
  }
  function handleRemoveStop(index: number) {
    const newStops = stopData.filter((_, i) => i !== index);
    setStopData(newStops);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    if (!telemetryData.telemetryName) {
      return;
    }

    const telemetry = {
      ...telemetryData,
      stops: stopData,
    };
    console.log(stopData, telemetry);
    addGaugeTelemetry(telemetry);
    setStopData([
      {
        stop: 100,
        color: "#ff0000",
      },
    ]);
    setTelemetryData(defaultTelemetry);
    // addGaugeStop(telemetry);
  }
  return (
    <div className="flex flex-col gap-4 relative">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]  gap-x-2 gap-y-3"
      >
        <Select
          name="telemetryData"
          required
          onValueChange={(value) => {
            setTelemetryData((prev) => ({
              ...prev,
              telemetryName: value,
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Telemetry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {machine?.connection?.machineInput
                ?.split(",")
                .map((item: string) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Input
          className="rounded"
          //   placeholder={t("label")}
          placeholder="label"
          name="label"
          value={telemetryData.telemetryName}
          onChange={(e) => {
            setTelemetryData((prev) => ({
              ...prev,
              telemetryName: e.target.value,
            }));
          }}
        /> */}
        <Input
          className="rounded"
          //   placeholder={t("unit")}
          placeholder="unit"
          name="unit"
          value={telemetryData.unit}
          onChange={(e) => {
            setTelemetryData((prev) => ({
              ...prev,
              unit: e.target.value,
            }));
          }}
        />
        {telemetries.length < 1 && (
          <Button
            type="submit"
            variant="outline"
            className="flex items-center gap-2"
            disabled={!telemetryData.telemetryName}
          >
            <PlusIcon size={18} /> <span>Add Telemetry</span>
          </Button>
        )}
        <Label className="col-span-3">Stops</Label>
        <span className="text-xs col-span-3">
          Define value ranges and assign colors to visually represent different
          levels.
        </span>{" "}
        {stopData.map((sd, index) => {
          return (
            <div
              key={index}
              className="col-span-3 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2"
            >
              <Input
                className="rounded w-full "
                //   placeholder={t("unit")}
                placeholder="stop"
                name="stop"
                value={sd.stop}
                onChange={(e) => {
                  const newStop = [...stopData];
                  newStop[index].stop = +e.target.value;
                  setStopData(newStop);
                }}
              />{" "}
              <ColorPicker
                className="rounded-md !w-full  flex !ring-0 h-9 outline-none border-none"
                color={sd.color}
                onChange={(color) => {
                  const newStop = [...stopData];
                  newStop[index].color = color;
                  setStopData(newStop);
                }}
              />
              <div className="flex items-center gap-2">
                {stopData.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!sd.stop}
                    onClick={() => handleRemoveStop(index)}
                  >
                    <Minus size={18} />
                    {/* <span>Remove</span> */}
                  </Button>
                )}
                {index === stopData.length - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!sd.stop}
                    onClick={handleAddStop}
                  >
                    <PlusIcon size={18} />
                    {/* <span>Add Stop</span> */}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </form>
      {telemetries.length > 0 && (
        <ScrollArea className="max-h-[20rem] p-2  border rounded-lg">
          <Table className="w-full text-xs [&_th]:p-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Stops</th>
              </tr>
            </thead>
            <tbody>
              {telemetries.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.telemetryName}</td>
                    <td>
                      {item.unit}
                      {/* <div className="flex items-center gap-1">
                        {item.stops.map((ss, i) => (
                          <span key={i}>{ss.stop}</span>
                        ))}
                      </div> */}
                    </td>
                    <td>
                      <div className="flex items-center  gap-1 justify-between">
                        <div className="flex items-center gap-2">
                          {item.stops.map((ss, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: ss.color }}
                              ></div>
                              <span>{ss.stop}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => {
                            deleteGaugeTelemetry(item);
                          }}
                          // onClick={() => {
                          //   const newStops = stops.filter(
                          //     (_, i) => i !== index
                          //   );

                          //   deleteGaugeStop({
                          //     ...telemetryData,
                          //     stops: newStops,
                          //   });
                          //   setTelemetryData((prev) => {
                          //     return { ...prev, stops: newStops };
                          //   });
                          // }}
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
