import { apiClient } from "@/features/api";
import { DeviceDto } from "@/pages/device/device.dto";


export const fetchConnection = async (id:number|null) => {
    try {
      const response = await apiClient.get("connection", {
        params: {
          tenantId: id,
        },
      });
      console.log("connections", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

export const fetchDevice = async (id:number|null) => {
    try {
    const response = await apiClient.get<DeviceDto[]>("/device", {
        params: {
        tenantId: id,
        },
    });
    return response.data;
    } catch (error) {
    return [];
    }
};
export const fetchMachine = async (id:number|null) => {
    try {
    const response = await apiClient.get("/machine", {
        params: {
        tenantId: id,
        },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    return [];
    }
};