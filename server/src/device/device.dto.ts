export interface DeviceCreateDto {
  username: string;
  password: string;
}

export interface DeviceInsertDto {
  id:number;
  tenantId:number,
  name: string;
  serial: string;
  status?: boolean;
  version?: string;
  config?: string;
  attribute?: {
    input: string[];
    output: string[];
    newInput: string[];
    newOutput: string[];
  };
  brokerId: number;
  typeId: number;
}



export interface DeviceTypeInsertDto {
  tenantId:number,
  name: string;
  config?: string;
  input: string;
  output: string;
}
export interface DeviceTypeUpdateDto {
  id:number;
  tenantId:number,
  name: string;
  config?: string;
  input: string;
  output: string;
}

export interface DeviceTypeConfigDto {
  inputs: ConfigEntity[];
  outputs: ConfigEntity[];
}

export interface ConfigEntity {
  label: string;
  source: {
    type: string;
    conf: string;
  };
}
