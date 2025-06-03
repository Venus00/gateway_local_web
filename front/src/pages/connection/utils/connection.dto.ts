import { DeviceDto } from "../device/device.dto";
import { MachineDto } from "../machine/machine.dto";



export interface Connection {
    name:string;
    machineId: number | null;
    machine: {
        inputs:string[];
        outputs:string[];
    };
    inputConnection:Attribute[];
    outputConnection:Attribute[];
}

export interface Attribute {
    machineInput: string;
    deviceAttributeId: number | null;
    device: DeviceDto | null;
    deviceId: number | null;
}

export interface ConnectionDto {
    id:number;
    name:string;
    machine: MachineDto;
    machineId: number | null;
    deviceInput: {
        deviceId:number;
        label:string;
        input:any
    }[];
    deviceOutput: {
        deviceId:number;
        label:string;
        output:any
    }[];
    machineInput: string;
    machineOutput: string;    
}

export interface ConnectionCreateDto {
    name:string;
    machineId: number | null;
    deviceInput: {id:number | null}[];
    deviceOutput: {id:number | null}[];
    machineInput: string;
    machineOutput: string;
}