/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useLanguage } from "@/context/language-context";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { generateRandomString } from "@/utils";
import { RefreshCcw, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useAddDeviceStore } from "./device-store";
export default function DeviceInfo() {
  const { data, setData } = useAddDeviceStore();
  const { t, isArabic } = useLanguage();
  const [devicesTypeAttribute, setDevicesTypeAttribute] = useState<{
    input: string[];
    output: string[];
  }>({
    input: [],
    output: [],
  });
  const { tenant } = useSelector((state: RootState) => state.auth);
  const { data: devicesType } = useQuery(
    "devicetype",
    () => fetchDeviceType(),
    { initialData: [] }
  );

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
  const handleSelectDeviceType = (e: any) => {
    setData({
      ...data,
      typeId: +devicesType[e].id,
      attribute: {
        input: [],
        output: [],
        newInput: [""],
        newOutput: [""],
      },
    });
    setDevicesTypeAttribute({
      input: devicesType[e].input.split(","),
      output: devicesType[e].output.split(","),
    });
  };
  useEffect(() => {
    const deviceType = devicesType.find(
      (type: { id: number }) => type.id === data.typeId
    );

    // console.log(
    //   devicesType.findIndex(
    //     (type: { id: number }) => type.id === data.typeId
    //   ) || undefined
    // );

    if (!deviceType) return;
    setDevicesTypeAttribute({
      input: deviceType.input.split(","),
      output: deviceType.output.split(","),
    });
  }, [devicesType, data.typeId]);

  return (
    <div className=" rounded-lg overflow-hidden p-4">
      <div className="flex flex-col gap-4 py-4 overflow-y-auto">
        <div className="space-y-2">
          <div>
            <Label htmlFor="deviceSerial">{t("table.column.serial")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="deviceSerial"
                value={data.serial}
                onChange={(e) =>
                  setData({
                    ...data,
                    serial: e.target.value,
                    config: { ...data.config, clientId: e.target.value },
                  })
                }
                className="dark:border-neutral-400"
                required
              />
              <Button
                size={"icon"}
                className="h-fit w-fit p-1"
                onClick={() =>
                  setData({ ...data, serial: generateRandomString(12) })
                }
              >
                <RefreshCcw size={14} />
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="deviceName">{t("table.column.name")}</Label>
            <Input
              id="deviceName"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="dark:border-neutral-400"
              required
            />
          </div>{" "}
          <div>
            <Label htmlFor="deviceType">{t("table.column.type")}</Label>
            <Select
              name="deviceType"
              required
              value={
                devicesType
                  .findIndex((type: { id: number }) => type.id === data.typeId)
                  ?.toString() || undefined
              }
              // value={data.typeId?.toString() || undefined}
              onValueChange={(e) => {
                console.log(e, " selected index");

                handleSelectDeviceType(e);
              }}
              dir={isArabic ? "rtl" : "ltr"}
            >
              <SelectTrigger className="dark:border-neutral-400">
                <SelectValue placeholder={t("device.selectType")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
                <SelectGroup>
                  {devicesType.map(
                    (type: { id: string; name: string }, key: number) => {
                      return (
                        <SelectItem
                          key={key}
                          value={key.toString()}
                          className="dark:hover:bg-neutral-700"
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
          {devicesTypeAttribute.input.some((ni) => ni === "") ? (
            <div className="border rounded-md gap-3 text-sm p-4 text-center mx-auto !mt-4 max-w-screen-sm w-fit flex bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <TriangleAlert size={16} />
              <span>
                Device type does not have inputs. Please add inputs before
                creating device
              </span>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 w-full max-h-[170px]  overflow-y-auto">
                {data.attribute.newInput.map((_input, key) => {
                  return (
                    <div
                      key={key}
                      className="flex  xl:flex-row flex-col w-full gap-3"
                    >
                      <div className="w-full">
                        <Label htmlFor="deviceInput">
                          {t("device.Input")} {key + 1}
                        </Label>
                        <Select
                          name="deviceInput"
                          required
                          value={data.attribute.input[key] || ""}
                          onValueChange={(e) => {
                            setData({
                              ...data,
                              attribute: {
                                ...data.attribute,
                                input: [...data.attribute.input, e],
                              },
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Input" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {devicesTypeAttribute.input.map(
                                (input: string, index: number) => {
                                  if (
                                    !data.attribute.input.includes(input) ||
                                    data.attribute.input[key] === input
                                  ) {
                                    return (
                                      <SelectItem key={index} value={input}>
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
                          {t("device.inputLabel")} {key + 1}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="labelInput"
                            className=""
                            value={data.attribute.newInput[key]}
                            onChange={(e) => {
                              const newInput = [...data.attribute.newInput];
                              newInput[key] = e.target.value;
                              setData({
                                ...data,
                                attribute: {
                                  ...data.attribute,
                                  newInput: newInput,
                                },
                              });
                            }}
                            required
                          />
                          {data.attribute.newInput.length > 1 && (
                            <Button
                              type="button"
                              className="dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:text-white"
                              onClick={() => {
                                console.log(data.attribute.newInput);
                                if (data.attribute.newInput.length > 1) {
                                  const newInput =
                                    data.attribute.newInput.filter(
                                      (_, index) => index !== key
                                    );
                                  setData({
                                    ...data,
                                    attribute: {
                                      ...data.attribute,
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
                            className=""
                            onClick={() => {
                              if (key < devicesTypeAttribute.input.length - 1) {
                                setData({
                                  ...data,
                                  attribute: {
                                    ...data.attribute,
                                    newInput: [...data.attribute.newInput, ""],
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
              <div className="flex flex-col gap-2 w-full max-h-[170px]  overflow-y-auto">
                {!devicesTypeAttribute.output.some((ni) => ni === "") &&
                  data.attribute.newOutput.map((_putput, key) => {
                    return (
                      <div
                        key={key}
                        className="flex w-full xl:flex-row flex-col gap-3"
                      >
                        <div className="w-full">
                          <Label htmlFor="deviceOutput">
                            {t("device.Output")} {key + 1}
                          </Label>
                          <Select
                            name="deviceOutput"
                            required
                            value={data.attribute.output[key] || ""}
                            onValueChange={(e) => {
                              setData({
                                ...data,
                                attribute: {
                                  ...data.attribute,
                                  output: [...data.attribute.output, e],
                                },
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Output" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {devicesTypeAttribute.output.map(
                                  (output: string, index: number) => {
                                    if (
                                      !data.attribute.output.includes(output) ||
                                      data.attribute.output[key] === output
                                    ) {
                                      return (
                                        <SelectItem key={index} value={output}>
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
                            {t("device.outputLabel")} {key + 1}
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="labelOutput"
                              className=""
                              value={data.attribute.newOutput[key]}
                              onChange={(e) => {
                                const newOutput = [...data.attribute.newOutput];
                                newOutput[key] = e.target.value;
                                setData({
                                  ...data,
                                  attribute: {
                                    ...data.attribute,
                                    newOutput: newOutput,
                                  },
                                });
                              }}
                              required
                            />
                            {data.attribute.newOutput.length > 1 && (
                              <Button
                                type="button"
                                className=""
                                onClick={() => {
                                  if (data.attribute.newOutput.length > 1) {
                                    const newOutput =
                                      data.attribute.newOutput.filter(
                                        (_, index) => index !== key
                                      );
                                    setData({
                                      ...data,
                                      attribute: {
                                        ...data.attribute,
                                        newOutput: newOutput,
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
                              className=""
                              onClick={() => {
                                if (
                                  key <
                                  devicesTypeAttribute.output.length - 1
                                ) {
                                  setData({
                                    ...data,
                                    attribute: {
                                      ...data.attribute,
                                      newOutput: [
                                        ...data.attribute.newOutput,
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
