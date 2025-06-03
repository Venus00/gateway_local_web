import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { fetchDevice } from "@/pages/connection/utils/actions";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { MachineCreateDto } from "../machine.dto";

export interface InputDefinition {
  id: string;
  deviceId: null | number;
  inputId: null | number;
}
export interface OutputDefinition {
  id: string;
  deviceId: null | number;
  outputId: null | number;
}
const variants = {
  open: {
    height: "auto",
    opacity: 1,
    padding: "1rem",
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      staggerDirection: 1,
    },
  },
  closed: {
    height: 0,
    // opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
function AddMachine() {
  const { data: devices } = useQuery("devices", () => fetchDevice(tenant.id), {
    initialData: [],
  });
  console.log(devices);

  const [newMachine, setnewMachine] = useState<MachineCreateDto>({
    name: "",
    serial: "",
    version: "",
    inputs: [],
    outputs: [],
  });
  const [open, setOpen] = useState(false);
  const { tenant } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMachine({
      ...newMachine,
      inputs,
      outputs,
    });
  };

  const [inputs, setInputs] = useState<InputDefinition[]>([]);
  const [outputs, setOutputs] = useState<OutputDefinition[]>([]);

  const addInput = () => {
    const newInput = {
      id: uuidv4(),
      deviceId: null,
      inputId: null,
    };
    setInputs([...inputs, newInput]);
  };

  const removeInput = (id: string) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((input) => input.id !== id));
    }
  };

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

  const getDeviceInputs = (
    deviceId: number | null,
    currentInputId: number | null
  ) => {
    const device = devices?.find((d) => d.id === deviceId);
    if (!device) return [];
    return device.deviceInput.filter(
      (input) =>
        input.id === currentInputId ||
        !inputs.some((item) => item.inputId === input.id)
    );
  };

  const addOutput = () => {
    const newOutput = {
      id: uuidv4(),
      deviceId: null,
      outputId: null,
    };
    setOutputs([...outputs, newOutput]);
  };

  const removeOutput = (id: string) => {
    if (outputs.length > 1) {
      setOutputs(outputs.filter((output) => output.id !== id));
    }
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

  const getDeviceOutputs = (
    deviceId: number | null,
    currentOutputId: number | null
  ) => {
    const device = devices?.find((d) => d.id === deviceId);
    if (!device) return [];
    return device.deviceOutput.filter(
      (output) =>
        output.id === currentOutputId ||
        !outputs.some((item) => item.outputId === output.id)
    );
  };

  const createMachine = async (data: MachineCreateDto) => {
    try {
      await apiClient.post("machine", {
        ...data,
        tenantId: tenant.id,
      });
      toast({
        title: "Success",
        description: "Entity created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      setOpen(false);
      setnewMachine({
        name: "",
        outputs: [],
        inputs: [],
        serial: "",
        version: "",
      });
      setOutputs([]);
      setInputs([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className={`flex flex-col transition-all duration-500 ease-in-out   overflow-hidden ${
          open ? "gap-4" : "gap-0"
        }`}
      >
        <Button
          onClick={() => {
            setOpen((prev) => !prev);
            setnewMachine({
              name: "",
              outputs: [],
              inputs: [],
              serial: "",
              version: "",
            });
          }}
          className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
          color="red"
          variant="outline"
        >
          {open ? "Close Form" : "Create New Entity"}
        </Button>
        <motion.div
          variants={variants}
          initial={false}
          animate={open ? "open" : "closed"}
          className=" bg-white dark:bg-neutral-800  rounded-lg shadow-md overflow-hidden "
        >
          <div className="flex flex-col  !overflow-hidden ">
            <h1 className="font-semibold text-lg">Create New Entity</h1>
            <span className="italic">Create a new entity</span>
          </div>
          <div className="flex flex-col gap-4 py-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="machineserial">Entity Serial</Label>
                <Input
                  id="machineserial"
                  value={newMachine.serial}
                  onChange={(e) =>
                    setnewMachine({ ...newMachine, serial: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="machineName">Entity Name</Label>
                <Input
                  id="machineName"
                  value={newMachine.name}
                  onChange={(e) =>
                    setnewMachine({ ...newMachine, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="machineVersion">Entity Version</Label>
                <Input
                  id="machineVersion"
                  value={newMachine.version}
                  onChange={(e) =>
                    setnewMachine({ ...newMachine, version: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs Section */}
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Input Definitions
                      </CardTitle>
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
                    </div>
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
                          <div>
                            <Label className="text-xs">Device</Label>
                            <Select
                              value={`${input.deviceId}`}
                              onValueChange={(value: string) => {
                                setInputs(
                                  inputs.map((inputItem) =>
                                    inputItem.id === input.id
                                      ? {
                                          ...inputItem,
                                          deviceId: +value,
                                          inputId: null,
                                        }
                                      : inputItem
                                  )
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select device" />
                              </SelectTrigger>
                              <SelectContent>
                                {getDeviceForInputs(input.deviceId)?.map(
                                  (device) => (
                                    <SelectItem
                                      key={device.id}
                                      value={`${device.id}`}
                                    >
                                      {device.name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Input</Label>
                            <Select
                              value={`${input.inputId}`}
                              onValueChange={(value: string) =>
                                setInputs(
                                  inputs.map((inputItem) =>
                                    inputItem.id === input.id
                                      ? {
                                          ...inputItem,
                                          inputId: +value,
                                        }
                                      : inputItem
                                  )
                                )
                              }
                              disabled={!input.deviceId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select input" />
                              </SelectTrigger>
                              <SelectContent>
                                {getDeviceInputs(
                                  input.deviceId,
                                  input.inputId
                                ).map((deviceInput: any) => (
                                  <SelectItem
                                    key={deviceInput.id}
                                    value={`${deviceInput.id}`}
                                  >
                                    {deviceInput.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Outputs Section */}
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Output Definitions
                      </CardTitle>
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
                    </div>
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
                            <Label className="text-xs">Device</Label>
                            <Select
                              value={`${output.deviceId}`}
                              onValueChange={(value: string) => {
                                setOutputs(
                                  outputs.map((outputItem) =>
                                    outputItem.id === output.id
                                      ? {
                                          ...outputItem,
                                          deviceId: +value,
                                          outputId: null,
                                        }
                                      : outputItem
                                  )
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select device" />
                              </SelectTrigger>
                              <SelectContent>
                                {getDeviceForOutputs(output.deviceId)?.map(
                                  (device) => (
                                    <SelectItem
                                      key={device.id}
                                      value={`${device.id}`}
                                    >
                                      {device.name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Output</Label>
                            <Select
                              value={`${output.outputId}`}
                              onValueChange={(value: string) =>
                                setOutputs(
                                  outputs.map((outputItem) =>
                                    outputItem.id === output.id
                                      ? {
                                          ...outputItem,
                                          outputId: +value,
                                        }
                                      : outputItem
                                  )
                                )
                              }
                              disabled={!output.deviceId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select input" />
                              </SelectTrigger>
                              <SelectContent>
                                {getDeviceOutputs(
                                  output.deviceId,
                                  output.outputId
                                ).map((deviceOutput: any) => (
                                  <SelectItem
                                    key={deviceOutput.id}
                                    value={`${deviceOutput.id}`}
                                  >
                                    {deviceOutput.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Entity
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AddMachine;
