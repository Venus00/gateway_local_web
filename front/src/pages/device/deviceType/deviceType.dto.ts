export interface CreateDeviceTypeDto {
    name: string;
    output: string;
    input:string;
    config?:string;
}

export interface DeviceTypeDto {
    id:number
    name: string;
    output: string;
    input: string;
    config?:string;
}

