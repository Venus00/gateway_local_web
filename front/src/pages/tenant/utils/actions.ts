import { apiClient } from "@/features/api";


export const fetchTenant = async (id:number|null) => {
    try {
      const response = await apiClient.get(`/tenant/dashboard`, {
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
  export  const fetchConnection = async (id:number|null) => {
    try {
      const response = await apiClient.get("connection", {
        params: {
          tenantId: id,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchDevices = async (id:number|null) => {
    try {
      const response = await apiClient.get("/device", {
        params: {
          tenantId: id,
        },
      });
      response.data.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };
 export const fetchUsers = async (id:number|null) => {
      try {
        const response = await apiClient.get("/users", {
          params: {
            tenantId: id,
          },
        });
        return response.data;
      } catch (error) {
        return [];
      }
    };