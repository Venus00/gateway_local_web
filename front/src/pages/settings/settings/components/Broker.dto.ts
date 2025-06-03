export interface BrokerDto {
    tenantId:number | null,
    id?:number;
    name :string;
    host: string;
    ip: string;
    port:number;
    clientId:string;
    username?:string;
    password?:string;
    topic:string;
    hide:boolean
}

export interface BrokerTableDto {
    tenantId:number | null,
    id:number;
    name :string;
    host: string;
    ip: string;
    port:number;
    clientId:string;
    username?:string;
    password?:string;
    topic:string;
    hide:boolean;
}