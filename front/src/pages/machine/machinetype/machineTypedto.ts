export interface CreateMachineTypeDto {
    name: string;
    output: string;
    input: string;
    config?:string;
}

export interface MachineTypeDto {
    id:number
    name: string;
    output: string;
    input:string;
    config?:string;
}

