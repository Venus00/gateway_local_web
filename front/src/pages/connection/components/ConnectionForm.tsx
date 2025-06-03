import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useToast } from "@/hooks/use-toast";
import { DeviceDto } from "@/pages/device/device.dto";
import { motion } from "framer-motion";
import { ArrowRightLeft, Cpu, FormInput, Link, Smartphone } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/language-context";
import {
  Attribute,
  Connection,
  ConnectionCreateDto,
} from "../utils/connection.dto";
import { fetchDevice, fetchMachine } from "../utils/actions";
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
export default function ConnectionForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [openForm, setOpenForm] = useState(false);
  const [connection, setConnection] = useState<Connection>({
    name: "",
    machineId: null,
    machine: { inputs: [], outputs: [] },
    inputConnection: [],
    outputConnection: [],
  });
  const queryClient = useQueryClient();
  const { data: devices } = useQuery("devices", () => fetchDevice(tenant.id), {
    initialData: [],
  });
  const { data: machines } = useQuery(
    "machines",
    () => fetchMachine(tenant.id),
    {
      initialData: [],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: connection.name,
      machineId: connection.machineId,
      deviceInput: connection.inputConnection.map((input) => ({
        id: input.deviceAttributeId,
      })),
      deviceOutput: connection.outputConnection.map((output) => ({
        id: output.deviceAttributeId,
      })),
      machineInput: connection.machine.inputs.join(","),
      machineOutput: connection.machine.outputs.join(","),
    };
    createConnection(data);
    setConnection({
      name: "",
      machineId: null,
      machine: { inputs: [], outputs: [] },
      inputConnection: [],
      outputConnection: [],
    });
  };
  const createConnection = async (data: ConnectionCreateDto) => {
    try {
      await apiClient.post("connection", {
        ...data,
        tenantId: tenant.id,
      });
      toast({
        title: "Success",
        description: "Connection created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setOpenForm(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error creating connection",
        variant: "destructive",
      });
    }
  };

  const selectMachine = async (e: number) => {
    let inputConnection: Attribute[] = [];
    machines[+e].type.input.split(",").forEach((element: string) => {
      inputConnection.push({
        machineInput: element,
        device: null,
        deviceId: null,
        deviceAttributeId: null,
      });
    });
    let outputConnection: Attribute[] = [];
    machines[+e].type.output.split(",").forEach((element: string) => {
      outputConnection.push({
        machineInput: element,
        device: null,
        deviceId: null,
        deviceAttributeId: null,
      });
    });
    let machine = {
      inputs: machines[+e].type.input.split(","),
      outputs: machines[+e].type.output.split(","),
    };
    setConnection({
      ...connection,
      machine,
      machineId: machines[+e].id,
      inputConnection,
      outputConnection,
    });
  };
  const selectDeviceInput = (e: number, index: number) => {
    let device = devices ? devices[e] : null;
    if (device) {
      let inputConnection = connection.inputConnection;
      inputConnection[index].device = device;
      inputConnection[index].deviceId = device.id;
      setConnection({ ...connection, inputConnection });
    }
  };
  const selectDeviceOutput = (e: number, index: number) => {
    let device = devices ? devices[e] : null;
    if (device) {
      let outputConnection = connection.outputConnection;
      outputConnection[index].device = device;
      outputConnection[index].deviceId = device.id;
      setConnection({ ...connection, outputConnection });
    }
  };

  const attributeInput = (e: number, index: number) => {
    let inputConnection = connection.inputConnection;
    inputConnection[index].deviceAttributeId = e;
    setConnection({ ...connection, inputConnection });
  };
  const attributeOutput = (e: number, index: number) => {
    let outputConnection = connection.outputConnection;
    outputConnection[index].deviceAttributeId = e;
    setConnection({ ...connection, outputConnection });
  };
  return (
    <div>
      <div
        className={`flex flex-col transition-all duration-500 ease-in-out   overflow-hidden ${
          openForm ? "gap-4" : "gap-0"
        }`}
      >
        <Button
          onClick={() => {
            setOpenForm((prev) => !prev);
            setConnection({
              name: "",
              machineId: null,
              machine: { inputs: [], outputs: [] },
              inputConnection: [],
              outputConnection: [],
            });
          }}
          className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
          color="red"
          variant="outline"
        >
          {openForm ? t("form.close") : t("connection.create")}
        </Button>
        <motion.div
          variants={variants}
          initial={false}
          animate={openForm ? "open" : "closed"}
          className=" bg-white dark:bg-neutral-800 rounded-lg  shadow-md overflow-hidden "
        >
          <div className="flex flex-col  !overflow-hidden ">
            <h1 className="font-semibold text-lg">
              {t("connection.addConnection")}
            </h1>
            <span className="italic">{t("connection.newConnection")}</span>
          </div>
          <div className="flex flex-col gap-4 py-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4  ">
              <div className="flex items-center space-x-2">
                <Link className="h-5 w-5" />
                <Label htmlFor="connection-name">Connection Name</Label>
              </div>
              <Input
                required
                id="connection-name"
                value={connection.name}
                onChange={(e) =>
                  setConnection({ ...connection, name: e.target.value })
                }
                placeholder="Enter connection name"
                className="flex-grow"
              />
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4" />
                <Label htmlFor="connection-name">Select Machine</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  name="machine"
                  required
                  onValueChange={(e) => selectMachine(+e)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Machine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {machines.map((machine: any, key: number) => {
                        return (
                          <SelectItem key={key} value={key.toString()}>
                            {machine.serial}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="max-h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FormInput className="h-5 w-5" />
                      <span>Input Connections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 overflow-y-auto flex-grow">
                    {connection?.machine?.inputs?.map((input, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <ArrowRightLeft className="h-5 w-5" />
                            <span>Input {index + 1}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div key={index} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Cpu className="h-4 w-4" />
                              <Label>Machine Input</Label>
                            </div>
                            <div>
                              <Input disabled value={input} />
                            </div>
                            <div className="flex gap-2 ">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2 ">
                                  <Smartphone className="h-4 w-4" />
                                  <Label>Device</Label>
                                </div>
                                <Select
                                  name="device"
                                  onValueChange={(e) =>
                                    selectDeviceInput(+e, index)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Device" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {devices &&
                                        devices.map(
                                          (device: DeviceDto, key: number) => {
                                            return (
                                              <SelectItem
                                                key={key}
                                                value={key.toString()}
                                              >
                                                {device.name}
                                              </SelectItem>
                                            );
                                          }
                                        )}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1  space-y-2">
                                <div className="flex items-center space-x-2 ">
                                  <Smartphone className="h-4 w-4" />
                                  <Label>Device input</Label>
                                </div>
                                <Select
                                  onValueChange={(e) => {
                                    attributeInput(+e, index);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Input" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {connection?.inputConnection[
                                        index
                                      ]?.device?.deviceInput?.map(
                                        (
                                          input: {
                                            label: string;
                                            deviceId: number;
                                            id: number;
                                          },
                                          key: number
                                        ) => {
                                          let render = true;
                                          for (
                                            let i = 0;
                                            i <
                                            connection.inputConnection.length;
                                            i++
                                          ) {
                                            if (
                                              connection.inputConnection[i]
                                                .deviceAttributeId === input.id
                                            ) {
                                              render = false;
                                            }
                                          }
                                          if (
                                            render ||
                                            connection.inputConnection[index]
                                              .deviceAttributeId === input.id
                                          ) {
                                            return (
                                              <SelectItem
                                                key={key}
                                                value={input.id.toString()}
                                              >
                                                {input.label}
                                              </SelectItem>
                                            );
                                          }
                                        }
                                      )}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>

                <Card className="max-h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FormInput className="h-5 w-5" />
                      <span>Output Connections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 overflow-y-auto flex-grow">
                    {connection?.machine?.outputs?.map((output, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <ArrowRightLeft className="h-5 w-5" />
                            <span>Output {index + 1}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div key={index} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Cpu className="h-4 w-4" />
                              <Label>Machine Output</Label>
                            </div>
                            <div>
                              <Input disabled value={output} />
                            </div>
                            <div className="flex gap-2 ">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2 ">
                                  <Smartphone className="h-4 w-4" />
                                  <Label>Device</Label>
                                </div>
                                <Select
                                  onValueChange={(e) =>
                                    selectDeviceOutput(+e, index)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Device" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {devices &&
                                        devices.map(
                                          (device: DeviceDto, key: number) => (
                                            <SelectItem
                                              key={key}
                                              value={key.toString()}
                                            >
                                              {device.name}
                                            </SelectItem>
                                          )
                                        )}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1  space-y-2">
                                <div className="flex items-center space-x-2 ">
                                  <Smartphone className="h-4 w-4" />
                                  <Label>Device Output</Label>
                                </div>
                                <Select
                                  onValueChange={(e) => {
                                    attributeOutput(+e, index);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Output" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {connection?.outputConnection[
                                        index
                                      ]?.device?.deviceOutput?.map(
                                        (
                                          output: {
                                            label: string;
                                            deviceId: number;
                                            id: number;
                                          },
                                          key: number
                                        ) => {
                                          let render = true;
                                          for (
                                            let i = 0;
                                            i <
                                            connection.outputConnection.length;
                                            i++
                                          ) {
                                            if (
                                              connection.outputConnection[i]
                                                .deviceAttributeId === output.id
                                            ) {
                                              render = false;
                                            }
                                          }
                                          if (
                                            render ||
                                            connection.outputConnection[index]
                                              .deviceAttributeId === output.id
                                          ) {
                                            return (
                                              <SelectItem
                                                key={key}
                                                value={output.id.toString()}
                                              >
                                                {output.label}
                                              </SelectItem>
                                            );
                                          }
                                        }
                                      )}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </div>

              <Button type="submit" className="w-full">
                <Link className="mr-2 h-4 w-4" />
                Create Connection
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
