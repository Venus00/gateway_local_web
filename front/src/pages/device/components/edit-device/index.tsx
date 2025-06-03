/* eslint-disable @typescript-eslint/no-unused-vars */
import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/language-context";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { generateRandomString } from "@/utils";
import { ElementRef, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { ConnectionType, DeviceCreateDto } from "../../device.dto";
import BrokerOption from "./BrokerOption";
import DeviceConnectivity from "./DeviceConnectivity";
import DeviceInfo from "./DeviceInfo";
import { useEditDeviceStore } from "./device-store";
import { useLocation, useNavigate } from "react-router";

export function EditDevice() {
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
  } = useEditDeviceStore();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
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

    editDevice(newDevice);
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
      handleClose();
      navigate("/device");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Edit Device",
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
    const newTitle = t("device.editDevice") + " " + data.connectionType;
    setTitle(newTitle);
    setDescription("");
  }
  const breadcrumb = [{ url: "/device", name: t("nav.device") }];
  useEffect(() => {
    const config = JSON.parse(location.state.config || "{}");

    const device = {
      id: location.state.id,
      connectionType: config.connectionType as ConnectionType,
      name: location.state?.name || "",
      attribute: location.state.attribute,
      brokerId: location.state.brokerId,
      serial: location.state.serial,
      typeId: location.state.typeId,
      config: {
        ...config,
        subTopic: config.prefix
          ? config.subTopic.split(config.prefix)[1]
          : config.subTopic,
        pubTopic: config.prefix
          ? config.pubTopic.split(config.prefix)[1]
          : config.pubTopic,
      },
    };

    setData(device);
  }, [location]);

  return (
    <main
      className={`flex-1 overflow-x-hidden  container mx-auto   overflow-y-auto  `}
    >
      <BreadCrumb links={breadcrumb} pageTitle={t("breadcrumb.edit")} />
      <div className="  overflow-y-auto p-0 bg-white dark:bg-neutral-800 ">
        <div className="relative  ">
          <Progress
            value={step === 0 ? 33 : step === 1 ? 66 : 100}
            className="absolute top-0 rounded-none"
          />
          <div className="p-6">
            <div>
              <h1 className="font-semibold text-lg">{title}</h1>
            </div>
            <p className="mb-8">{description}</p>
            {
              {
                0: <DeviceConnectivity />,
                1: <DeviceInfo />,
                2: <Step2 />,
              }[step]
            }
            <div className="flex items-center justify-end gap-4  pt-4">
              {step !== 0 && (
                <Button
                  onClick={() => {
                    prevStep();
                    if (step === 1) {
                      setTitle(t("device.editDevice"));
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

        {/* <DialogClose ref={closeRef} hidden /> */}
      </div>
    </main>
  );
}
