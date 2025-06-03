
export interface MachineCreateDto {
    name:string;
    serial:string;
    version:string;
    inputs:any[];
    outputs:any[];
}
export interface MachineUpdtaeDto {
    id:number;
    name:string;
    serial:string;
    version:string;
    connectionInputs:any[];
    connectionOutputs:any[];

}


export interface MachineDto {
    id : number;
    name:string;
    serial:string;
    input:string;
    output:string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type:any;
    version:string;
}
