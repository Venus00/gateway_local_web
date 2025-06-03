export interface MachineCreateDto {
  tenantId:number,
  name: string;
  serial: string;
  version: string;
  typeId: number;
  inputs:any[];
  outputs:any[];
}
export interface MachineUpdateDto {
  id:number;
  tenantId:number,
  name: string;
  serial: string;
  version: string;
  typeId: number;
  inputs:any[];
  outputs:any[];
}

export interface MachineTypeInsertDto {
  tenantId:number,
  name: string;
  input: string;
  output: string;
}
export interface MachineTypeUpdateDto {
  id:number;
  tenantId:number,
  name: string;
  input: string;
  output: string;
}

export interface MachineTypeConfigDto {
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

export interface MachineLayoutDto {
  layout: string;
  widget: string;
}