import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CreateMachineTypeDto } from "../machineTypedto";
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
function AddMachineType() {
  const [newMachine, setNewMachine] = useState<CreateMachineTypeDto>({
    name: "",
    output: "",
    input: "",
  });
  const [open, setOpen] = useState(false);
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [outputs, setOutputs] = useState<string[]>([""]);
  const [inputs, setInputs] = useState<string[]>([""]);
  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createmachine(newMachine);
    setNewMachine({ name: "", output: "", input: "" });
    setOutputs([""]);
    setInputs([""]);
  };

  const createmachine = async (data: CreateMachineTypeDto) => {
    try {
      await apiClient.post("machinetype", {
        ...data,
        tenantId: tenant.id,
      });
      queryClient.invalidateQueries({ queryKey: ["machinesType"] });
      setOpen(false);
    } catch (error) {
      console.log(error);
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
    setNewMachine({ ...newMachine, input: newInput.toString() });
  };
  const removeOutput = async (index: number) => {
    const newOutput = [...inputs];
    newOutput[index] = "";
    setOutputs(newOutput.filter((_, i) => i !== index));
    setNewMachine({ ...newMachine, output: newOutput.toString() });
  };
  const handleOutputChange = async (index: number, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[index] = value;
    setOutputs(newOutputs);
    setNewMachine({ ...newMachine, output: newOutputs.toString() });
  };

  const handleInputChange = async (index: number, value: string) => {
    const newInput = [...inputs];
    newInput[index] = value;
    setInputs(newInput);
    setNewMachine({ ...newMachine, input: newInput.toString() });
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
            setNewMachine({ name: "", output: "", input: "" });
          }}
          className="w-fit"
          color="red"
          variant="outline"
        >
          {open ? "Close Form" : "Create New Entity Type"}
        </Button>
        <motion.div
          variants={variants}
          initial={false}
          animate={open ? "open" : "closed"}
          className=" bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden "
        >
          <div className="flex flex-col  !overflow-hidden ">
            <h1 className="font-semibold text-lg">Create New Entity Type</h1>
            <span className="italic">Create a new entity type</span>
          </div>
          <div className="flex flex-col gap-4 py-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="machineName"
                  className="font-bold w-fit flex flex-none"
                >
                  Machine Name
                </Label>
                <Input
                  id="machineName"
                  value={newMachine.name}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-6">
                <div className="flex-1 ">
                  <Label htmlFor="deviceInput" className="font-bold ">
                    Entity Input
                  </Label>

                  {inputs.map((input, key) => {
                    return (
                      <div key={key} className="flex gap-3 flex-1">
                        <Label className="mt-6 w-48 " htmlFor="deviceInput">
                          Entity Input {key + 1}
                        </Label>
                        <Input
                          id="deviceInput"
                          className="mt-2"
                          value={input}
                          onChange={(e) => {
                            handleInputChange(key, e.target.value);
                          }}
                          required
                        />
                        {inputs.length > 1 && (
                          <Button
                            type="button"
                            className="mt-2"
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
                            className="mt-2"
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
                    Entity Output
                  </Label>

                  {outputs.map((output, key) => {
                    return (
                      <div key={key} className="flex gap-6">
                        <Label className="mt-6 w-48" htmlFor="deviceOutput">
                          Entity Output {key + 1}
                        </Label>
                        <Input
                          id="deviceOutput"
                          className="mt-2"
                          value={output}
                          onChange={(e) => {
                            handleOutputChange(key, e.target.value);
                          }}
                          required
                        />
                        {outputs.length > 1 && (
                          <Button
                            type="button"
                            className="mt-2"
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
                            className="mt-2"
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
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Entity Profile
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AddMachineType;
