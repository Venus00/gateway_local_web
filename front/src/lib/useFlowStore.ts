import { create } from 'zustand';
import { ReactFlowInstance } from 'reactflow';

interface FlowState {
  zoom: number;
  setZoom: (zoom: number) => void;
  reactFlowInstance: ReactFlowInstance | null;
  setReactFlowInstance: (instance: ReactFlowInstance | null) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  zoom: 0.5, 
  setZoom: (zoom) => set({ zoom }),
  reactFlowInstance: null,
  setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),
}));