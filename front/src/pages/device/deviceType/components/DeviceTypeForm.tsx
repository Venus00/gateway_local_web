import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CreateDeviceTypeDto } from "../deviceType.dto";
import { useQueryClient } from "react-query";
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
function DeviceTypeForm() {
  const queryClient = useQueryClient();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [newDevice, setNewDevice] = useState<CreateDeviceTypeDto>({
    name: "",
    output: "",
    input: "",
  });

  const [outputs, setOutputs] = useState<string[]>([""]);
  const [inputs, setInputs] = useState<string[]>([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createDevice(newDevice);
  };

  const createDevice = async (data: CreateDeviceTypeDto) => {
    try {
      setNewDevice({
        ...newDevice,
        input: inputs.toString(),
        output: outputs.toString(),
      });
      await apiClient.post("devicetype", {
        ...data,
        tenantId: tenant.id,
      });
      setOpen(false);
      toast({
        title: "Success",
        description: "Device Type Created Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["devicetype"] });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        console.log(error);
        toast({
          title: "Error",
          description: error.response?.data?.message,
          variant: "destructive",
        });
      }
    }
  };

  const addOutput = async () => {
    setOutputs([...outputs, ""]);
  };
  const addInput = async () => {
    setInputs([...inputs, ""]);
  };
  const removeInput = async (index: number) => {
    const newInput = [...inputs];
    newInput[index] = "";
    setInputs(newInput.filter((_, i) => i !== index));
    setNewDevice({ ...newDevice, input: newInput.toString() });
  };
  const removeOutput = async (index: number) => {
    const newOutput = [...inputs];
    newOutput[index] = "";
    setOutputs(newOutput.filter((_, i) => i !== index));
    setNewDevice({ ...newDevice, output: newOutput.toString() });
  };
  const handleOutputChange = async (index: number, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[index] = value;
    setOutputs(newOutputs);
    setNewDevice({ ...newDevice, output: newOutputs.toString() });
  };

  const handleInputChange = async (index: number, value: string) => {
    const newInput = [...inputs];
    newInput[index] = value;
    setInputs(newInput);
    setNewDevice({ ...newDevice, input: newInput.toString() });
  };
  console.log(newDevice);

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
            setNewDevice({ name: "", output: "", input: "" });
          }}
          className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
          color="red"
          variant="outline"
        >
          {open ? "Close Form" : "Create Device Type"}
        </Button>
        <motion.div
          variants={variants}
          initial={false}
          animate={open ? "open" : "closed"}
          className=" bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden "
        >
          <div className="flex flex-col  !overflow-hidden ">
            <h1 className="font-semibold text-lg">Create Device Profile</h1>
            <span className="italic">Create a new device type</span>
          </div>
          <div className="flex flex-col gap-4 py-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="flex items-center gap-2 ">
                <Label
                  htmlFor="deviceName"
                  className="font-bold w-fit flex flex-none"
                >
                  Profile Type Name
                </Label>
                <Input
                  id="deviceName"
                  value={newDevice.name}
                  className="dark:border-neutral-400"
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-4 ">
                <div className="flex-1">
                  <Label htmlFor="deviceInput" className="font-bold">
                    Device Input
                  </Label>
                  {inputs.map((input, key) => {
                    return (
                      <div key={key} className="flex gap-3 flex-1">
                        <Label className="mt-6 w-48 " htmlFor="deviceInput">
                          Device Input {key + 1}
                        </Label>
                        <Input
                          id="deviceInput"
                          className="dark:border-neutral-400 mt-2"
                          value={input}
                          onChange={(e) => {
                            handleInputChange(key, e.target.value);
                          }}
                          required
                        />
                        {inputs.length > 1 && (
                          <Button
                            type="button"
                            className="mt-2 dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                            onClick={() => {
                              if (inputs.length > 1) {
                                removeInput(key);
                              }
                            }}
                            variant="outline"
                          >
                            -
                          </Button>
                        )}
                        {key === inputs.length - 1 && (
                          <Button
                            type="button"
                            className="mt-2 dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                            onClick={addInput}
                            variant="outline"
                          >
                            +
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex-1">
                  <Label htmlFor="deviceOutput" className="font-bold">
                    Device Output
                  </Label>

                  {outputs.map((output, key) => {
                    return (
                      <div key={key} className="flex gap-3">
                        <Label className="mt-6 w-48" htmlFor="deviceOutput">
                          Device Output {key + 1}
                        </Label>
                        <Input
                          id="deviceOutput"
                          className="dark:border-neutral-400 mt-2"
                          value={output}
                          onChange={(e) => {
                            handleOutputChange(key, e.target.value);
                          }}
                          required
                        />
                        {outputs.length > 1 && (
                          <Button
                            type="button"
                            className="mt-2 dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                            onClick={() => {
                              if (outputs.length > 1) {
                                removeOutput(key);
                              }
                            }}
                            variant="outline"
                          >
                            -
                          </Button>
                        )}
                        {key === outputs.length - 1 && (
                          <Button
                            type="button"
                            className=" mt-2 dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                            onClick={addOutput}
                            variant="outline"
                          >
                            +
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button className="text-white" type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Device Profile
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DeviceTypeForm;
