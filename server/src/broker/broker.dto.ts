export interface BrokerDto {
    tenantId: number,
    name: string;
    host: string;
    ip: string;
    port: number;
    clientId: string;
    username: string;
    password: string;
    topic: string;
    hide?: boolean;
}

export interface EditBrokerDto {
    id: number;
    tenantId: number,
    name: string;
    host: string;
    ip: string;
    port: number;
    clientId: string;
    username: string;
    password: string;
    topic: string;
    hide:boolean
}