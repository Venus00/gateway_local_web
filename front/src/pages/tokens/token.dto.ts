
export interface TokenCreateDto {
    name:string;
    description?:string;
    expiryDate:string;
    tenantId:number;
    user:{
        id:number;email:string
      }
}
export interface TokenEditDto {
    id : number;
    name:string;
    description?:string;
    
}


export interface TokenDto {
    id : number;
    tenantId : number;
    name:string;
    token:string;
    description?:string;
    expiryDate:string;
    created_at:Date;
    
}
