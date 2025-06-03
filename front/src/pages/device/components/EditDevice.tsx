import { Button } from "@/components/ui/button";
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
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { DeviceCreateDto } from "../device.dto";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "@/components/breadcrumb";
import { useLanguage } from "@/context/language-context";

export default function EditDevice() {
  //   const { id } = useParams();
  const navigate = useNavigate();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  //   const device = location.state;
  const [device, setDevice] = useState<DeviceCreateDto>({
    id: location.state.id,
    name: location.state.name,
    serial: location.state.serial,
    version: location.state.version,
    typeId: location.state.typeId,
    brokerId: location.state.brokerId,
    attribute: location.state.attribute,
    connectionType: location.state.connectionType,
  });
  const [devicesTypeAttribute, setDevicesTypeAttribute] = useState<{
    input: string[];
    output: string[];
  }>(location.state.devicesTypeAttribute);
  const { data: devicesType } = useQuery(
    "devicetype",
    () => fetchDeviceType(),
    { initialData: [] }
  );
  const { data: brokers } = useQuery("brokers", () => fetchBrokers(), {
    initialData: [],
  });

  const fetchBrokers = async () => {
    try {
      const response = await apiClient.get("/broker", {
        params: {
          tenantId: tenant?.id,
        },
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };
  const fetchDeviceType = async () => {
    try {
      const response = await apiClient.get("/devicetype", {
        params: {
          tenantId: tenant.id,
        },
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editDevice(device);
  };
  const editDevice = async (data: DeviceCreateDto) => {
    try {
      await apiClient.put("device", data);
      toast({
        title: "Success",
        description: "Device Edited Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      // navigate("/device");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Edit Device",
        variant: "destructive",
      });
    }
  };
  const handleSelectDeviceType = (e: string) => {
    setDevice({
      ...device,
      typeId: +e,
      attribute: {
        input: [""],
        output: [""],
        newInput: [""],
        newOutput: [""],
      },
    });
    setDevicesTypeAttribute({
      input: devicesType
        .find((type: { id: number }) => type.id === +e)
        .input.split(","),
      output: devicesType
        .find((type: { id: number }) => type.id === +e)
        .output.split(","),
    });
  };
  useEffect(() => {}, [device]);
  const breadcrumb = [
    { url: "/device", name: t("nav.device") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];

  return (
    <main
      className={`flex-1 overflow-x-hidden container mx-auto   overflow-y-auto  p-6  `}
    >
      <BreadCrumb links={breadcrumb} pageTitle={t("breadcrumb.edit")} />
      <div className=" bg-white dark:bg-neutral-800 rounded-lg  overflow-hidden p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Device</h1>
        <div className="grid gap-4 py-4 overflow-y-auto h-[90%]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="deviceSerial">Device Serial</Label>
              <Input
                disabled
                id="deviceSerial"
                value={device.serial}
                required
                className="dark:border-neutral-400"
              />
            </div>
            <div>
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                value={device.name}
                onChange={(e) => setDevice({ ...device, name: e.target.value })}
                required
                className="dark:border-neutral-400"
              />
            </div>
            <div>
              <Label htmlFor="deviceType">Device Type</Label>
              <Select
                name="deviceType"
                required
                value={device?.typeId?.toString()}
                onValueChange={(e) => {
                  handleSelectDeviceType(e);
                }}
              >
                <SelectTrigger className="dark:border-neutral-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
                  <SelectGroup>
                    {devicesType?.map(
                      (type: { id: string; name: string }, key: number) => {
                        return (
                          <SelectItem
                            className="dark:hover:bg-neutral-700"
                            key={key}
                            value={type.id.toString()}
                          >
                            {type.name}
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mqttBroker">Mqtt Broker</Label>
              <Select
                name="mqttBroker"
                required
                value={device.brokerId ? device.brokerId.toString() : ""}
                onValueChange={(e) => {
                  setDevice({ ...device, brokerId: +e });
                }}
              >
                <SelectTrigger className="dark:border-neutral-400">
                  <SelectValue placeholder="Select Broker" />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
                  <SelectGroup>
                    {brokers
                      ? brokers.map(
                          (
                            broker: { id: number; name: string },
                            key: number
                          ) => {
                            return (
                              <SelectItem
                                className="dark:hover:bg-neutral-700"
                                key={key}
                                value={broker.id.toString()}
                              >
                                {broker.name}
                              </SelectItem>
                            );
                          }
                        )
                      : null}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {device.attribute.newInput.map((_input, key) => {
                return (
                  <div
                    key={key}
                    className="flex  xl:flex-row flex-col w-full gap-3"
                  >
                    <div className="w-full">
                      <Label htmlFor="deviceInput">
                        Device Input {key + 1}
                      </Label>
                      <Select
                        name="deviceInput"
                        required
                        value={device.attribute.input[key]}
                        onValueChange={(e) => {
                          const input = [...device.attribute.input];
                          input[key] = e;

                          setDevice({
                            ...device,
                            attribute: { ...device.attribute, input: input },
                          });
                        }}
                      >
                        <SelectTrigger className="dark:border-neutral-400">
                          <SelectValue placeholder="Select Input" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
                          <SelectGroup>
                            {devicesTypeAttribute.input.map(
                              (input: string, index: number) => {
                                if (
                                  !device.attribute.input.includes(input) ||
                                  device.attribute.input[key] === input
                                ) {
                                  return (
                                    <SelectItem
                                      className="dark:hover:bg-neutral-700"
                                      key={index}
                                      value={input}
                                    >
                                      {input}{" "}
                                    </SelectItem>
                                  );
                                }
                              }
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div key={key} className="w-full">
                      <Label className="mt-6 w-48 " htmlFor="labelInput">
                        Label for Input {key + 1}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="labelInput"
                          className="dark:border-neutral-400"
                          value={device.attribute.newInput[key]}
                          onChange={(e) => {
                            const newInput = [...device.attribute.newInput];
                            newInput[key] = e.target.value;
                            setDevice({
                              ...device,
                              attribute: {
                                ...device.attribute,
                                newInput: newInput,
                              },
                            });
                          }}
                          required
                        />
                        {device.attribute.newInput.length > 1 && (
                          <Button
                            type="button"
                            className="dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                            onClick={() => {
                              if (device.attribute.newInput.length > 1) {
                                const newInput =
                                  device.attribute.newInput.filter(
                                    (_, index) => index !== key
                                  );
                                setDevice({
                                  ...device,
                                  attribute: {
                                    ...device.attribute,
                                    newInput: newInput,
                                  },
                                });
                              }
                            }}
                            variant="outline"
                          >
                            -
                          </Button>
                        )}

                        <Button
                          type="button"
                          className="dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                          onClick={() => {
                            if (key < devicesTypeAttribute.input.length - 1) {
                              setDevice({
                                ...device,
                                attribute: {
                                  ...device.attribute,
                                  newInput: [...device.attribute.newInput, ""],
                                },
                              });
                            }
                          }}
                          variant="outline"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 w-full">
              {device.attribute.newOutput.map((_output, key) => {
                return (
                  <div
                    key={key}
                    className="flex w-full xl:flex-row flex-col gap-3"
                  >
                    <div className="w-full">
                      <Label htmlFor="deviceOutput">
                        Device Output {key + 1}
                      </Label>
                      <Select
                        name="deviceOutput"
                        required
                        value={device.attribute.output[key]}
                        onValueChange={(e) => {
                          const output = [...device.attribute.output];
                          output[key] = e;
                          setDevice({
                            ...device,
                            attribute: { ...device.attribute, output: output },
                          });
                        }}
                      >
                        <SelectTrigger className="dark:border-neutral-400">
                          <SelectValue placeholder="Select Output" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
                          <SelectGroup>
                            {devicesTypeAttribute.output.map(
                              (output: string, index: number) => {
                                if (
                                  !device.attribute.output.includes(output) ||
                                  device.attribute.output[key] === output
                                ) {
                                  return (
                                    <SelectItem
                                      className="dark:hover:bg-neutral-700"
                                      key={index}
                                      value={output}
                                    >
                                      {output}{" "}
                                    </SelectItem>
                                  );
                                }
                              }
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div key={key} className="w-full">
                      <Label className="mt-6 w-48 " htmlFor="labelOutput">
                        Label for Output {key + 1}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="labelOutput"
                          className="dark:border-neutral-400"
                          value={device.attribute.newOutput[key]}
                          onChange={(e) => {
                            const newOutput = [...device.attribute.newOutput];
                            newOutput[key] = e.target.value;
                            setDevice({
                              ...device,
                              attribute: {
                                ...device.attribute,
                                newOutput: newOutput,
                              },
                            });
                          }}
                          required
                        />

                        <Button
                          type="button"
                          className="dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                          onClick={() => {
                            if (key < devicesTypeAttribute.output.length - 1) {
                              setDevice({
                                ...device,
                                attribute: {
                                  ...device.attribute,
                                  newOutput: [
                                    ...device.attribute.newOutput,
                                    "",
                                  ],
                                },
                              });
                            }
                          }}
                          variant="outline"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4  ">
              <Link to="/device">
                <Button
                  type="button"
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 mt-8"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button className=" mt-8" type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Edit Device
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
