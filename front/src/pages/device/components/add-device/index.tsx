/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/language-context";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { ElementRef, useCallback, useRef } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { ConnectionType, DeviceCreateDto } from "../../device.dto";
import BrokerOption from "./BrokerOption";
import DeviceConnectivity from "./DeviceConnectivity";
import DeviceInfo from "./DeviceInfo";
import { useAddDeviceStore } from "./device-store";
import { Progress } from "@/components/ui/progress";
import { generateRandomString } from "@/utils";

export function AddDevice() {
  const {
    title,
    data,
    step,
    nextStep,
    setTitle,
    setDescription,
    description,
    prevStep,
    setStep,
    setData,
    getDisabled,
  } = useAddDeviceStore();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { tenant } = useSelector((state: RootState) => state.auth);
  // const [step, setStep] = useState(0);
  const closeRef = useRef<ElementRef<"button">>(null);
  const clear = () => {
    setData({
      connectionType: "MQTT" as ConnectionType,
      name: "",
      attribute: {
        input: [],
        output: [],
        newInput: [],
        newOutput: [],
      },
      brokerId: null,
      serial: generateRandomString(12),
      typeId: null,
      config: "",
    });
    setStep(0);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice = {
      ...data,
      config: JSON.stringify({
        ...data.config,
        subTopic: data.config.prefix + data.config.subTopic,
        pubTopic: data.config.prefix + data.config.pubTopic,
        clientId: data.serial,
        connectionType: data.connectionType,
      }),
    };
    console.log(newDevice);

    createDevice(newDevice, tenant.id);
  };
  const createDevice = async (
    data: DeviceCreateDto,
    tenantId: number | null
  ) => {
    try {
      await apiClient.post("device/create", {
        ...data,
        tenantId,
      });
      toast({
        title: "Success",
        description: "Device created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    closeRef.current?.click();
    clear();
  };
  const Step2 = useCallback(() => {
    if (data.connectionType === "MQTT") return <BrokerOption />;

    return null;
  }, [data.connectionType]);
  function handleNextStep() {
    nextStep();
    const newTitle = t("device.addDevice") + " " + data.connectionType;
    setTitle(newTitle);
    setDescription("");
  }
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
          color="red"
          variant="outline"
        >
          {t("device.create")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90%] overflow-y-auto p-0 bg-white dark:bg-neutral-800 ">
        <div className="relative  ">
          <Progress
            value={step === 0 ? 33 : step === 1 ? 66 : 100}
            className="absolute top-0 rounded-none"
          />
          <div className="p-6">
            <DialogTitle>
              <h1 className="font-semibold text-lg">{title}</h1>
            </DialogTitle>
            <DialogDescription className="mb-8">
              {description}
            </DialogDescription>
            {
              {
                0: <DeviceConnectivity />,
                1: <DeviceInfo />,
                2: <Step2 />,
              }[step]
            }
            <div className="flex items-center justify-end gap-4  pt-4">
              <Button variant="outline" onClick={handleClose}>
                <span className="first-letter:uppercase">cancel</span>
              </Button>
              {step !== 0 && (
                <Button
                  onClick={() => {
                    prevStep();
                    if (step === 1) {
                      setTitle(t("device.addDevice"));
                      setDescription(t("device.dialog.description"));
                    }
                  }}
                >
                  <span className="first-letter:uppercase dark:text-white">
                    previous
                  </span>
                </Button>
              )}
              <Button
                disabled={getDisabled()}
                onClick={step === 2 ? handleSubmit : handleNextStep}
              >
                <span className="first-letter:uppercase dark:text-white">
                  {step !== 2 ? "next" : "save"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        <DialogClose ref={closeRef} hidden />
      </DialogContent>
    </Dialog>
  );
}
