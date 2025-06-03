import { create } from "zustand";
import { ConnectionType, DeviceCreateDto } from "../../device.dto";
import { generateRandomString } from "@/utils";

type State = {
  data: DeviceCreateDto;
  step: number;
  title:string
  description:string
};

type Actions = {
  setData: (data: DeviceCreateDto) => void;
  setStep: (step: number) => void;
  setTitle: (name: string) => void;
  setDescription: (description: string) => void;
  setConnectionType: (type: ConnectionType) => void;
  nextStep: () => void;
  prevStep: () => void;
  getDisabled: () => boolean;
};

export const useAddDeviceStore = create<State & Actions>((set, get) => ({
  data: {
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
    config:""
  },
  step: 0,
  title:"Add Device",
  description:"Start by choosing the connectivity type of your device.",
  setData: (data:DeviceCreateDto) => {
    set({ data });
  },
  setStep: (step: number) => {
    set({ step });
  },
  setTitle: (title: string) => {
    set({
      title
    });
  },
  setDescription: (description: string) => {
    set({
      description});
  },
  setConnectionType: (connectionType: ConnectionType) => {
    set({
      data: {
        ...get().data,
        connectionType,
      },
    });
  },
  nextStep: () => {
    const step = get().step;
    const title = get().title;

    if (step === 2 ) return;
    set({ step: step + 1 });
  },
  prevStep: () => {
    const step = get().step;
    if (step === 0 ) return;
    set({ step: step -1 });
  },
  getDisabled: () => {
    const step = get().step;
    if(step === 2 && get().data.connectionType === "MQTT") {
      const brokerId = get().data.brokerId;
      const {username,password,subTopic,pubTopic} = get().data.config ;
    return  !username || !password || !brokerId || !subTopic || !pubTopic;
  }
    if(step === 1 ) {
      const {name,serial,typeId,attribute} = get().data;
      const {input, newInput} = attribute;
    return !name || !serial || !typeId|| input.length===0|| newInput.some((ni)=>ni==="");
  }
    return false;
  }
 
}));
