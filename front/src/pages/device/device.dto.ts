import { BrokerDto } from "../settings/settings/components/Broker.dto";

export interface DeviceDto {
    name:string;
    id:number;
    type: any;
    serial:string;
    status:boolean;
    version:string;
    broker:BrokerDto;
    deviceInput:DeviceInputDto[];
    deviceOutput:deviceOutputDto[];
    config?:any
}

export interface DeviceInputDto {
    deviceId:number;
    id:number;
    label:string;
    name:string;
}

export interface deviceOutputDto {
    deviceId:number;
    id:number;
    label:string;
    name:string;
}
export interface DeviceEditDto {
    id:number;
    name:string;
    serial:string;
    version:string;
    type:any;
    status:boolean;
    broker:BrokerDto;
    deviceInput:any[];
    deviceOutput:any[];
}
export interface DeviceCreateDto {
    connectionType:string,
    id?:number;
    name:string;
    serial:string;
    version?:string;
    typeId:number | null;
    status?:boolean
    attribute:Attribute;
    brokerId:number | null;
    config?:any
}

export interface DeviceAttributeDto {
    name:string,
    label:string;
    id:number;
}

interface Attribute {
    input:string[];
    output:string[];
    newInput:string[];
    newOutput:string[];
}

export const ConnectionTypes=[
    "MQTT","API","1nce","dragino","claim-code","particle",'lorawan'
] as const

export type ConnectionType = (typeof ConnectionTypes)[number];