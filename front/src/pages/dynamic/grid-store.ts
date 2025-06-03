import { DateRange, generateRandomString, Widget, WidgetType } from "@/utils";
import { machine } from "os";
import { Layout } from "react-grid-layout";
import { create } from "zustand";

type addWidgetInput = Omit<Widget, "id">;

type State = {
  dashboard: {
    type: "dashboard" | "entity"| "analytic";
    machineId: number;
    machine: any;
    layout: Layout[];
    widgets: Widget[];
    editMode: boolean;
    actionHover: boolean;
    isUpdated: boolean;
    dateRange: DateRange;
    widgetId: string | null;
  }[];
  editMode: boolean;
  actionHover: boolean;
  layouts: Layout[];
  widgets: Widget[];
  isUpdated: boolean;
  dateRange: DateRange;
  widgetId: string | null;
};

type Actions = {
  setMachineId: (
    type: "dashboard" | "entity"| "analytic",
    machineId: number,
    machine: any,
    layout: Layout[],
    widgets: Widget[]
  ) => void;
  setMachineLayout: (machineId: number, layout: Layout[]) => void;
  setMachineWidgets: (machineId: number, widgets: Widget[]) => void;
  setEditMode: (editMode: boolean) => void;
  toggleEditMode: () => void;
  setActionHover: (val: boolean) => void;
  setLayouts: (layouts: Layout[]) => void;
  setWidgets: (widgets: Widget[]) => void;
  addWidget: (widget: addWidgetInput, widgetId?: string) => void;
  setUpdated: (val: boolean) => void;
  setFrom: (val: Date) => void;
  setDateRange: (val: DateRange) => void;
  setWidgetId: (val: string | null) => void;
  toggleMachineEditMode: (machineId: number) => void;
  setActionHoverMachine: (machineId: number, val: boolean) => void;
  setUpdatedMachine: (machineId: number, val: boolean) => void;
  setDateRangeMachine: (machineId: number, val: DateRange) => void;
  setWidgetIdMachine: (machineId: number, val: string | null) => void;
  setAddWidgetMachine: (machineId: number, data: addWidgetInput) => void;
  setEditMachine: (machineId: number, editMode: boolean) => void;
  duplicateWidget:(machineId: number, data: addWidgetInput) => void;
};

const getWidgetSize = (type: WidgetType) => {
  if (["lineChart", "areaChart", "barChart"].includes(type))
    return { w: 4, h: 3, minW: 3, minH: 2 };
  if (["pieChart", "donutChart", "barChart"].includes(type))
    return { w: 3, h: 3, minW: 2, minH: 3 };
  if (["gauge", "circular"].includes(type))
    return { w: 3, h: 3, minW: 3, minH: 3 };
  if (type === "table") return { w: 4, h: 4, minW: 3, minH: 3 };
  if (type === "card") return { w: 3, h: 2, minW: 2, minH: 1 };
  if (type === "battery") return { w: 2, h: 2, minW: 2, minH: 2 };
  if (type === "video") return { w: 3, h: 3, minW: 3, minH: 3 };
  if (type === "map") return { w: 4, h: 4, minW: 4, minH: 4 };
  else return { w: 2, h: 2 };
};

const defaultState: State = {
  dashboard: [],
  editMode: false,
  actionHover: false,
  layouts: [],
  widgets: [],
  isUpdated: false,
  dateRange: {},
  widgetId: null,
};

export const useGridStore = create<State & Actions>((set, get) => ({
  ...defaultState,
  toggleMachineEditMode: (machineId) =>
    set((state) => {
      const updatedDashboard = state.dashboard.map((machine) => {
        if (machine.machineId === machineId) {
          return { ...machine, editMode: !machine.editMode,isUpdated:machine.editMode };
        }
        return machine;
      });
      return { dashboard: updatedDashboard };
    }),
  setMachineId: (type, machineId, machine, layout, widgets) => {
    const id = get().dashboard.find(
      (machine) => machine.machineId === machineId
    );
    if (!id) {
      set({
        dashboard: get().dashboard.concat({
          type,
          machineId,
          machine,
          layout,
          widgets,
          editMode: false,
          actionHover: false,
          isUpdated: true,
          dateRange: {},
          widgetId: null,
        }),
      });
    }
  },
  setMachineLayout: (machineId, layout) =>
    set((state) => {
      const machine = state.dashboard.find(
        (machine) => machine.machineId === machineId
      );
      if (machine) {
        machine.layout = layout;
        if(machine.widgets.length===layout.length)
       {const widget = machine.widgets.map((wid,index)=>{
          return {
            ...wid,
            w:layout[index].w,
            h:layout[index].h,
          }
        })
        machine.widgets=widget
      }
        
        
        machine.isUpdated = true;
      }
      return state;
    }),
  setMachineWidgets: (machineId, widgets) =>
    set((state) => {
      
      const updatedDashboard = state.dashboard.map((machine) => {
        if (machine.machineId === machineId) {
          return { ...machine, widgets };
        }
        return machine;
      });
      return { dashboard: updatedDashboard };
    }),
  setEditMachine: (machineId, editMode) =>
    set((state) => {
      const updatedDashboard = state.dashboard.map((machine) => {
        if (machine.machineId === machineId) {
          return { ...machine, editMode };
        }
        return machine;
      });
      return { dashboard: updatedDashboard };
    }),
  setActionHoverMachine: (machineId, val) =>
    set((state) => {
      const updatedDashboard = state.dashboard.map((machine) => {
        if (machine.machineId === machineId) {
          return { ...machine, actionHover: val,editMode: true };
        }
        return machine;
      });
      return { dashboard: updatedDashboard };
    }),
  setUpdatedMachine: (machineId, val) =>
    set((state) => {
      const updatedDashboard = state.dashboard.map((machine) => {
        if (machine.machineId === machineId) {
          return { ...machine, isUpdated: val,editMode: true };
        }
        return machine;
      });
      return { dashboard: updatedDashboard };
    }),
  setDateRangeMachine: (machineId, val) =>
    set((state) => {
      const updatedDashboard = state.dashboard.map((machine) => {
        if (machine.machineId === machineId) {
          return { ...machine, dateRange: val };
        }
        return machine;
      });
      return { dashboard: updatedDashboard };
    }),
  setWidgetIdMachine: (machineId, val) =>
    set((state) => {
      const updatedDashboard = state.dashboard.map((machine) => {
        if (machine.machineId === machineId) {
          return { ...machine, widgetId: val,editMode: true };
        }
        return machine;
      });
      return { dashboard: updatedDashboard };
    }),
  setAddWidgetMachine: (machineId, data: addWidgetInput) => {
    
    const machine = get().dashboard.find(
      (machine) => machine.machineId === machineId
    );
    if (machine) {
      const widgetId = machine.widgetId;
      if (widgetId !== "new") {
        console.log("data edit",data);
        
        const widgets = machine.widgets.map((widget) =>
          widget.id === widgetId ? { ...widget, ...data } : widget
        );
        set((state) => {
          const updatedDashboard = state.dashboard.map((machine) => {
            if (machine.machineId === machineId) {
              return { ...machine, widgets, isUpdated: true, editMode: true };
            }
            return machine;
          });
          return { dashboard: updatedDashboard };
        });
        return;
      }
      const id = generateRandomString(8, false);
      const maxX = machine.layout.reduce((acc, cur) => {
        if (cur.x + cur.w > acc) return cur.x + cur.w;
        return acc;
      }, 0);
      const maxY = machine.layout.reduce((acc, cur) => {
        if (cur.y + cur.h > acc) return cur.y + cur.h;
        return acc;
      }, 0);
      const sizes = getWidgetSize(data.type);
      
      if (
        data?.attributes?.position === "center" ||
        data?.attributes?.position === "reverseCenter"
      ) {
        sizes.w = 2;
        sizes.h = 3;
        sizes.w = 2;
        sizes.h = 3;
      }
      const isInRow = sizes.w + maxX > 12;
      const layouts = machine.layout.concat({
        i: id,
        x: isInRow ? 0 : maxX,
        y: isInRow ? maxY : 0,
        ...sizes,
        static: false,
      });
      const widgets = machine.widgets.concat({
        id,
        ...data,
        h:sizes.h,
        w:sizes.w
      });


      set((state) => {
        const updatedDashboard = state.dashboard.map((machine) => {
          if (machine.machineId === machineId) {
            return {
              ...machine,
              layout: layouts,
              widgets: widgets,
              isUpdated: true,
              editMode: false,
            };
          }
          return machine;
        });
        return { dashboard: updatedDashboard };
      });
    }
  },
  setEditMode: (editMode) => set({ editMode }),
  toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
  setActionHover: (val) => set({ actionHover: val }),
  setLayouts: (layouts) => set({ layouts, isUpdated: true }),
  setWidgets: (widgets) => set({ widgets }),
  addWidget: (data: addWidgetInput) => {
    const widgetId = get().widgetId;
    if (widgetId !== "new") {
      const widgets = get().widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, ...data } : widget
      );
      set({ widgets, isUpdated: true, editMode: false });
      return;
    }
    const id = generateRandomString(8, false);
    const maxX = get().layouts.reduce((acc, cur) => {
      if (cur.x + cur.w > acc) return cur.x + cur.w;
      return acc;
    }, 0);
    const maxY = get().layouts.reduce((acc, cur) => {
      if (cur.y + cur.h > acc) return cur.y + cur.h;
      return acc;
    }, 0);
    const sizes = getWidgetSize(data.type);
    if (
      data?.attributes?.position === "center" ||
      data?.attributes?.position === "reverseCenter"
    ) {
      sizes.w = 2;
      sizes.h = 3;
      sizes.w = 2;
      sizes.h = 3;
    }

    const isInRow = sizes.w + maxX > 12;
    const layouts = get().layouts.concat({
      i: id,
      x: isInRow ? 0 : maxX,
      y: isInRow ? maxY : 0,
      ...sizes,
      static: false,
    });
    const widgets = get().widgets.concat({
      id,
      ...data,
    });

    set({ layouts, widgets, isUpdated: true, editMode: false });
  },
  setUpdated: (val) => set({ isUpdated: val }),
  setDateRange: (val) => set({ dateRange: val }),
  setFrom: (val) =>
    set((state) => ({ dateRange: { ...state.dateRange, from: val } })),
  setWidgetId: (val) => set({ widgetId: val }),
  duplicateWidget:(machineId: number, data: addWidgetInput)=>{
    const machine = get().dashboard.find(
      (machine) => machine.machineId === machineId
    );
    
    if (machine) {
      const newId = generateRandomString(8, false);
      const maxX = machine.layout.reduce((acc, cur) => {
        if (cur.x + cur.w > acc) return cur.x + cur.w;
        return acc;
      }, 0);
      const maxY = machine.layout.reduce((acc, cur) => {
        if (cur.y + cur.h > acc) return cur.y + cur.h;
        return acc;
      }, 0);
      
      const sizes = getWidgetSize(data.type);
      if(data.w&&data.h){
        
        sizes.w = data.w;
        sizes.h = data.h;
      }
     console.log("data sizes",data.w,data.h);
     console.log("sizes",sizes);
     
      const isInRow = sizes.w + maxX > 12;
      const layouts = machine.layout.concat({
        i: newId,
        x: isInRow ? 0 : maxX,
        y: isInRow ? maxY : 0,
        ...sizes,
        static: false,
      });
      const widgets = machine.widgets.concat({
        id:newId,
        ...data,
       
      });
console.log(layouts,widgets);

      set((state) => {
        const updatedDashboard = state.dashboard.map((machine) => {
          if (machine.machineId === machineId) {
            console.log(machineId);
            
            return {
              ...machine,
              layout: layouts,
              widgets: widgets,
              isUpdated: true,
              editMode: true,
            };
          }
          return machine;
        });
        return { dashboard: updatedDashboard };
      });
    }
  }
}));
