export interface ConnectionCreateDto {
  tenantId:number,
  name:string;
  machineId: number;
  deviceInput: {id:number}[];
  deviceOutput: {id:number}[];
  machineInput: string;
  machineOutput: string;
}

export interface Action {
  machineId: number;
  value: string;
  deviceOutputId: number;
}