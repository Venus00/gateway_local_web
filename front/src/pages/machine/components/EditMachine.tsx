import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { MachineUpdtaeDto } from "../machine.dto";
import { Link } from "react-router-dom";
import BreadCrumb from "@/components/breadcrumb";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputDefinition, OutputDefinition } from "./AddMachine";
import { fetchDevice } from "@/pages/connection/utils/actions";
import { v4 as uuidv4 } from "uuid";

export default function EditMachine() {
  const navigate = useNavigate();
  //   const { id } = useParams();
  const queryClient = useQueryClient();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { t } = useLanguage();
  const [machine, setMachine] = useState<MachineUpdtaeDto>({
    id: location.state?.id,
    name: location.state?.name,
    serial: location.state?.serial,
    version: location.state?.version,
    connectionInputs: location.state?.connectionInputs,
    connectionOutputs: location.state?.connectionOutputs,
  });
  const [inputs, setInputs] = useState<InputDefinition[]>(
    machine.connectionInputs.map((item) => {
      return {
        id: item.input.id,
        deviceId: item.input.deviceId,
        inputId: item.input.id,
      };
    }) || []
  );
  const [outputs, setOutputs] = useState<OutputDefinition[]>(
    machine.connectionOutputs.map((item) => {
      return {
        id: item.output.id,
        deviceId: item.output.deviceId,
        outputId: item.output.id,
      };
    }) || []
  );
  const { data: devices = [] } = useQuery("devices", () =>
    fetchDevice(tenant.id)
  );
  console.log(inputs, outputs);

  const addInput = () => {
    const newInput = {
      id: uuidv4(),
      deviceId: null,
      inputId: null,
    };
    setInputs([...inputs, newInput]);
  };
  const addOutput = () => {
    const newOutput = {
      id: uuidv4(),
      deviceId: null,
      outputId: null,
    };
    setOutputs([...outputs, newOutput]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editMachine(machine);
  };
  const editMachine = async (data: MachineUpdtaeDto) => {
    console.log(data);

    try {
      await apiClient.put("machine", {
        ...machine,
        inputs,
        outputs,
      });
      toast({
        title: "Success",
        description: "Machine Updated Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      navigate("/machine");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update Machine",
        variant: "destructive",
      });
    }
  };

  const breadcrumb = [
    { url: "/machine", name: t("nav.entity") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];

  const getDeviceForInputs = (currentDeviceId: number | null) => {
    const result = [];
    if (!devices) return [];
    for (let i = 0; i < devices.length; i++) {
      const inputsCheck = devices[i].deviceInput.filter(
        (input) => !inputs.some((item) => item.inputId === input.id)
      );

      if (inputsCheck.length !== 0 || currentDeviceId === devices[i].id)
        result.push(devices[i]);
    }
    return result;
  };
  const getDeviceForOutputs = (currentDeviceId: number | null) => {
    const result = [];
    if (!devices) return [];
    for (let i = 0; i < devices.length; i++) {
      const outputCheck = devices[i].deviceOutput.filter(
        (output) => !outputs.some((item) => item.outputId === output.id)
      );

      if (outputCheck.length !== 0 || currentDeviceId === devices[i].id)
        result.push(devices[i]);
    }
    return result;
  };
  const removeInput = (id: string) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((input) => input.id !== id));
    }
  };
  const removeOutput = (id: string) => {
    if (outputs.length > 1) {
      setOutputs(outputs.filter((output) => output.id !== id));
    }
  };
  const getAvailableInputs = (
    deviceId: number | null,
    currentInputId: number | null
  ) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return [];
    return device.deviceInput.filter(
      (input) =>
        input.id === currentInputId ||
        !inputs.some((i) => i.inputId === input.id)
    );
  };

  const getAvailableOutputs = (
    deviceId: number | null,
    currentOutputId: number | null
  ) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return [];
    return device.deviceOutput.filter(
      (output) =>
        output.id === currentOutputId ||
        !outputs.some((o) => o.outputId === output.id)
    );
  };
  console.log(machine);

  return (
    <main
      className={`flex-1 overflow-x-hidden container mx-auto p-6  overflow-y-auto    `}
    >
      <BreadCrumb links={breadcrumb} pageTitle={t("breadcrumb.edit")} />
      <div className=" bg-white dark:bg-neutral-800 rounded-lg  overflow-hidden p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Machine</h1>
        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="machineserial">Entity Serial</Label>
              <Input
                id="machineserial"
                value={machine.serial}
                onChange={(e) =>
                  setMachine({ ...machine, serial: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="machineName">Entity Name</Label>
              <Input
                id="machineName"
                value={machine?.name}
                onChange={(e) =>
                  setMachine({ ...machine, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="machineVersion">Entity Version</Label>
              <Input
                id="machineVersion"
                value={machine.version}
                onChange={(e) =>
                  setMachine({ ...machine, version: e.target.value })
                }
                required
              />
            </div>
            {/* Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Input Definitions</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addInput}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Input
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inputs.map((input, index) => (
                    <div
                      key={input.id}
                      className="space-y-3 p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Input {index + 1}
                        </span>
                        {inputs.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInput(input.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label>Device</Label>
                        <Select
                          value={`${input.deviceId}` || undefined}
                          onValueChange={(val: string | number) =>
                            setInputs((prev) =>
                              prev.map((item) =>
                                item.id === input.id
                                  ? { ...item, deviceId: +val, inputId: null }
                                  : item
                              )
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select device" />
                          </SelectTrigger>
                          <SelectContent>
                            {getDeviceForInputs(input.deviceId).map(
                              (d: { id: any; name: any }) => (
                                <SelectItem key={d.id} value={`${d.id}`}>
                                  {d.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Input</Label>
                        <Select
                          value={`${input.inputId}` || undefined}
                          onValueChange={(val: string | number) =>
                            setInputs((prev) =>
                              prev.map((item) =>
                                item.id === input.id
                                  ? { ...item, inputId: +val }
                                  : item
                              )
                            )
                          }
                          disabled={!input.deviceId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select input" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableInputs(
                              input.deviceId,
                              input.inputId
                            ).map((inp) => (
                              <SelectItem key={inp.id} value={`${inp.id}`}>
                                {inp.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Outputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Output Definitions</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOutput}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Output
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {outputs.map((output, index) => (
                    <div
                      key={output.id}
                      className="space-y-3 p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Output {index + 1}
                        </span>
                        {outputs.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOutput(output.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Device</Label>
                          <Select
                            value={`${output.deviceId}` || undefined}
                            onValueChange={(val: string | number) =>
                              setOutputs((prev) =>
                                prev.map((item) =>
                                  item.id === output.id
                                    ? {
                                        ...item,
                                        deviceId: +val,
                                        outputId: null,
                                      }
                                    : item
                                )
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select device" />
                            </SelectTrigger>
                            <SelectContent>
                              {getDeviceForOutputs(output.deviceId).map((d) => (
                                <SelectItem key={d.id} value={`${d.id}`}>
                                  {d.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Output</Label>
                        <Select
                          value={`${output.outputId}` || undefined}
                          onValueChange={(val: string | number) =>
                            setOutputs((prev) =>
                              prev.map((item) =>
                                item.id === output.id
                                  ? { ...item, outputId: +val }
                                  : item
                              )
                            )
                          }
                          disabled={!output.deviceId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select output" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableOutputs(
                              output.deviceId,
                              output.outputId
                            ).map((out) => (
                              <SelectItem key={out.id} value={`${out.id}`}>
                                {out.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex items-center gap-4">
                <Link to="/machine">
                  <Button
                    type="button"
                    className="bg-gray-200 text-gray-800  mt-8  hover:bg-gray-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className=" mt-8 ">
                  <Plus className="h-4 w-4 mr-2" />
                  Edit Entity
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
