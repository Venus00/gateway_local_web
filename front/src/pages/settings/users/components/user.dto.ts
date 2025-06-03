export interface User {
    id: number
    name: string
    email: string
    role: string
    image?:string
    active: boolean
    created_at: string
    updated_at: string
    isVerified:boolean
}
export interface CreateUserDto {
    tenantId:number|null
    tenantName?:string
    image?:string
    name: string
    email: string
    role: string
    isActive: boolean
    password:string
    confirmpassword:string
    isVerified:boolean
}
export interface UpdateUserDto {
    id:number;
    tenantId:number|null
    tenantName?:string
    image?:string
    name: string
    email: string
    role: string
    isActive: boolean
    password:string
    confirmpassword:string
    isVerified:boolean
}