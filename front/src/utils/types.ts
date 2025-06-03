export const widgetTypes = [
  "card",
  "lineChart",
  "areaChart",
  "barChart",
  "donutChart",
  "pieChart",
  "table",
  "gauge",
  "circular",
  "video",
  "battery",
  "map",
  "button",
  // "progressGauge"
] as const;

export const widgetTypesDashbaord = [
  "card",
  "lineChart",
  "donutChart",
  "pieChart",
  "gauge",
  "circular",
  "video",
  "battery",
] as const;
export const widgetCardTypes = ["text", "telemetry"] as const;

export const groupByOptions = ["hour", "day", "week"] as const;

export type Literal = string | number | boolean | null | Date;

export type JsonValue = Literal | JsonArray | JsonObject;

export type JsonArray = JsonValue[];

export type JsonObject = { [key: string]: JsonValue };

export type WidgetType = (typeof widgetTypes)[number];
export type Widget = {
  id: string;
  title: string;
  type: WidgetType;
  backgroundColor?: string;
  color?: string;
  description?: string;
  attributes?: JsonObject;
  h?: number; w?: number
};

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type ChartTelemetry = {
  name: string;
  label?: string;
  unit?: string;
  color?: string;
};

export type ProgressGaugeWidgetData = {
  telemetryName: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  stops: {
    stop: number;
    color: string;
  }[];
};
export type GaugeWidgetData = {
  telemetryName: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  nrOfLevels?: number;
  colors?: string[]

};
export type RadialWidgetData = {
  telemetryName: string;
  unit?: string;
  stops: { stop: number; color: string }[];
}
export type WidgetCardType = (typeof widgetCardTypes)[number];

export type LineChartWidgetData = {
  telemetries?: ChartTelemetry[];
};
export type GaugeChartWidgetData = {
  telemetries?: GaugeWidgetData[];
};
export type RadialChartWidgetData = {
  telemetries?: RadialWidgetData[];
};

export type TGroupBy = (typeof groupByOptions)[number];
export type MapTelemetry = {
  label: string;
  longitude: string;
  latitude: string;
};
export type MapWidgetData = {
  telemetries?: MapTelemetry[];
};



export type TableWidgetData = {
  telemetries?: ChartTelemetry[];
  dateRange?: DateRange;
};
