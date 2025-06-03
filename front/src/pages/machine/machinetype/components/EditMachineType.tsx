import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/features/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { CreateMachineTypeDto, MachineTypeDto } from "../machineTypedto";
import { useQueryClient } from "react-query";
import { useLanguage } from "@/context/language-context";
import BreadCrumb from "@/components/breadcrumb";

export default function EditMachineType() {
  //   const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useLanguage();
  //   const machine = location.state;
  const [machine, setMachine] = useState<MachineTypeDto>({
    name: location.state.name,
    id: location.state.id,
    input: location.state.input,
    output: location.state.output,
  });
  const [outputs, setOutputs] = useState<string[]>([]);
  const [inputs, setInputs] = useState<string[]>([]);

  useEffect(() => {
    setOutputs(machine.output.split(","));
    setInputs(machine.input.split(","));
  }, [machine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createDevice(machine);
  };
  const removeInput = async (index: number) => {
    const newInput = [...inputs];
    newInput[index] = "";
    setInputs(newInput.filter((_, i) => i !== index));
    setMachine({ ...machine, input: newInput.toString() });
  };
  const removeOutput = async (index: number) => {
    const newOutput = [...inputs];
    newOutput[index] = "";
    setInputs(newOutput.filter((_, i) => i !== index));
    setMachine({ ...machine, output: newOutput.toString() });
  };
  const createDevice = async (data: CreateMachineTypeDto) => {
    try {
      setMachine({
        ...machine,
        input: inputs.toString(),
        output: outputs.toString(),
      });
      await apiClient.put("machinetype", data);
      toast({
        title: "Success",
        description: "Entity Type Updated Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["machinesType"] });
      navigate("/machineType");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update Entity Type",
        variant: "destructive",
      });
    }
  };

  const addOutput = async () => {
    setOutputs([...outputs, ""]);
  };
  const addInput = async () => {
    setInputs([...inputs, ""]);
  };
  const handleOutputChange = async (index: number, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[index] = value;
    setOutputs(newOutputs);
    setMachine({ ...machine, output: newOutputs.toString() });
  };

  const handleInputChange = async (index: number, value: string) => {
    const newInput = [...inputs];
    newInput[index] = value;
    setInputs(newInput);
    setMachine({ ...machine, input: newInput.toString() });
  };
  const breadcrumb = [
    { url: "/machine", name: t("nav.entity") },
    { url: "/machinetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];
  return (
    <main
      className={`flex-1 overflow-x-hidden container mx-auto py-4  overflow-y-auto p-6   `}
    >
      <BreadCrumb links={breadcrumb} pageTitle={t("breadcrumb.edit")} />
      <div className=" bg-white dark:bg-neutral-800 rounded-lg  overflow-hidden p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Entity Profile</h1>
        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col ">
            <div className="flex items-center gap-2 ">
              <Label
                htmlFor="deviceName"
                className="font-bold w-fit flex flex-none"
              >
                Entity Type Name
              </Label>
              <Input
                id="deviceName"
                value={machine.name}
                className=""
                onChange={(e) =>
                  setMachine({ ...machine, name: e.target.value })
                }
                required
              />
            </div>
            <div className="flex gap-4 ">
              <div className="flex-1">
                <Label htmlFor="deviceInput" className="font-bold">
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
                    <div key={key} className="flex gap-3">
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
            <div className="flex items-center gap-4">
              <Link to="/deviceType">
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
                Edit Entity Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
