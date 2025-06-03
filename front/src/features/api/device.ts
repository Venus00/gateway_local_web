import { toast } from "@/hooks/use-toast";
import { DeviceCreateDto } from "@/pages/device/device.dto";
import { apiClient } from ".";

export const createDevice = async (data: DeviceCreateDto,tenantId:number | null) => {
    try {
        await apiClient.post('device/create', {
            ...data,
            tenantId,
        })
        toast({
            title: "Success",
            description: "Device created successfully",
            variant: "default",
        })
    } catch (error) {
        toast({
            title: "Error",
            description: "An error occurred",
            variant: "destructive",
        })
    }
}

export const fetchDeviceType = async (tenantId:number | null) => {
    try {
        const response = await apiClient.get('/devicetype',{
            params:tenantId
        });
        return response.data;
    } catch (error) {
        return [];
    }
}
