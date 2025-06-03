export interface BrokerDto {
    id:number
    name :string;
    host: string;
    ip: string;
    port:number;
    clientId:string;
    username:string;
    password:string;
    topic:string | null;
}