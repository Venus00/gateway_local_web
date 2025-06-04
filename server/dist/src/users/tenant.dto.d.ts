export interface CreateTenantDto {
    name: string;
    description?: string;
    phone?: string;
    company?: string;
    adminId?: string;
    image?: string;
    subscriptionPlanId: string;
}
export interface EditTenantDto {
    id: number;
    name: string;
    description?: string;
    phone?: string;
    company?: string;
    image?: string;
    adminId?: string;
    subscriptionPlanId: string;
}
export declare class TenantReponseDto {
    name: string | undefined;
}
