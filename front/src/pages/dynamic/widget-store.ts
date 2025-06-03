import {
  ChartTelemetry,
  GaugeWidgetData,
  JsonValue,
  WidgetCardType,
  Widget,
  WidgetType,
  MapTelemetry,
} from "@/utils";
import { create } from "zustand";

type State = {
  data: Omit<Widget, "id">;
  step: number;
};

type Actions = {
  setData: (data: Omit<Widget, "id">) => void;
  setStep: (step: number) => void;
  setTitle: (name: string) => void;
  setDescription: (description: string) => void;
  setType: (type: WidgetType) => void;
  addTelemetry: (data: ChartTelemetry) => void;
  addMapTelemetry: (data: MapTelemetry) => void;
  editMapTelemetry: (data: MapTelemetry,label:string) => void;
  deleteTelemetry: (telemetry: ChartTelemetry) => void;
  deleteMapTelemetry: (telemetry: MapTelemetry) => void;
  addGaugeTelemetry: (telemetry: GaugeWidgetData) => void;
  deleteGaugeTelemetry: (telemetry: GaugeWidgetData) => void;
  nextStep: () => void;
  getDisabled: () => boolean;
  setAttribute: (key: string, value: JsonValue) => void;
  setBackgroundColor: (color: string) => void;
  setColor: (color: string) => void;
};

export const useAddWidgetStore = create<State & Actions>((set, get) => ({
  data: {
    title: "",
    type: "card" as WidgetType,
    attributes: {},
  },
  step: 0,
  setData: (data: Omit<Widget, "id">) => {
    set({ data });
  },
  setStep: (step: number) => {
    set({ step });
  },
  setTitle: (name: string) => {
    set({
      data: {
        ...get().data,
        title: name,
      },
    });
  },
  setDescription: (description: string) => {
    set({
      data: {
        ...get().data,
        description,
      },
    });
  },
  setType: (type: WidgetType) => {
    set({
      data: {
        ...get().data,
        type,
        attributes: {},
      },
    });
  },
  addTelemetry: (data: ChartTelemetry) => {
    const telemetries = (get().data.attributes?.telemetries ||
      []) as ChartTelemetry[];
    const exist = telemetries.find((item) => item.name === data.name);
    if (exist) return;
    const newTelemetries = [...telemetries, data];
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          telemetries: newTelemetries,
          unit: newTelemetries.length>1?"": (data.unit||""),
        },
      },
    });
  },
  addMapTelemetry: (data: MapTelemetry) => {
    const telemetries = (get().data.attributes?.telemetries ||
      []) as MapTelemetry[];
    const exist = telemetries.find((item) => item.label === data.label);
    if (exist) return;
    const newTelemetries = [...telemetries, data];
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          telemetries: newTelemetries,
        },
      },
    });
  },
  editMapTelemetry: (data: MapTelemetry,label:string) => {
    const telemetries = (get().data.attributes?.telemetries ||
      []) as MapTelemetry[];
    const exist = telemetries.find((item) => item.label === label);
    if (!exist) return;
    const deletedTelemetries = telemetries.filter(
      (item) => item.label !== label
    );
    const newTelemetries = [...deletedTelemetries, data];
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          telemetries: newTelemetries,
        },
      },
    });
  },
  deleteTelemetry: (telemetry: ChartTelemetry) => {
    const telemetries = (get().data.attributes?.telemetries ||
      []) as ChartTelemetry[];
    const newTelemetries = telemetries.filter(
      (item) => item.name !== telemetry.name
    );
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          telemetries: newTelemetries,
        },
      },
    });
  },
  deleteMapTelemetry: (telemetry: MapTelemetry) => {
    const telemetries = (get().data.attributes?.telemetries ||
      []) as MapTelemetry[];
    const newTelemetries = telemetries.filter(
      (item) => item.label !== telemetry.label
    );
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          telemetries: newTelemetries,
        },
      },
    });
  },
  addGaugeTelemetry: (data: GaugeWidgetData) => {
    const telemetries = (get().data.attributes?.telemetries ||
      []) as GaugeWidgetData[];
    const exist = telemetries.find(
      (item) => item.telemetryName === data.telemetryName
    );
    if (exist) return;
    const newTelemetries = [...telemetries, data];
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          telemetries: newTelemetries,
        },
      },
    });
    // set({
    //   data: {
    //     ...get().data,
    //     attributes: data,
    //   },
    // });
  },
  deleteGaugeTelemetry: (telemetry: GaugeWidgetData) => {
    const telemetries = (get().data.attributes?.telemetries ||
      []) as GaugeWidgetData[];
    const newTelemetries = telemetries.filter(
      (item) => item.telemetryName !== telemetry.telemetryName
    );
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          telemetries: newTelemetries,
        },
      },
    });
  },
  nextStep: () => {
    const step = get().step;
    const title = get().data.title;

    if (step === 1 ) return;
    set({ step: step + 1 });
  },
  getDisabled: () => {
    const step = get().step;
    const title = get().data.title;
    const type = get().data.type;
    const telemetries = get().data.attributes?.telemetries as ChartTelemetry[];
    if (step === 1 && !title) return true;
    if (
      step === 1 &&
      ["lineChart", "barChart", "areaChart", "circular","map"].includes(
        type
      ) &&
      !telemetries?.length
    )
      return true;
    if (step === 1 && type === "card") {
      const cardType = get().data.attributes?.type as WidgetCardType;
      const content = get().data.attributes?.content;
      const telemetryName = get().data.attributes?.telemetryName;
      if (!cardType) return true;
      if (cardType === "text" && !content) return true;
      if (cardType === "telemetry" && !telemetryName) {
        return true;
      }
    }
    if (step === 1 && type === "video") {
      const url = get().data.attributes?.url;
      if (!url) return true;
    }
    if (step === 1 && type === "gauge") {
      const gaugeData = get().data.attributes as GaugeWidgetData;
      const { telemetryName,maxValue,minValue } = gaugeData;
      return !telemetryName || !maxValue || !minValue;
    }

    return false;
  },
  setAttribute: (key: string, value: JsonValue) => {
    set({
      data: {
        ...get().data,
        attributes: {
          ...get().data.attributes,
          [key]: value,
        },
      },
    });
  },
  setBackgroundColor: (color: string) => {
    set({
      data: {
        ...get().data,
        backgroundColor: color,
      },
    });
  },
  setColor: (color: string) => {
    set({
      data: {
        ...get().data,
        color,
      },
    });
  },
}));
