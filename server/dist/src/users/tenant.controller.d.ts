import { TenantService } from './tenant.service';
import { CreateTenantDto, EditTenantDto, TenantReponseDto } from './tenant.dto';
import { UserResponseDto } from './users.dto';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    handleGetAllTenant(): Promise<TenantReponseDto[]>;
    handleGetLayout(query: {
        tenantId: number;
    }): Promise<{
        [x: string]: any;
    } | undefined>;
    deleteDashboard(id: number): Promise<"Success" | "Error">;
    handleSetLayout(data: {
        tenantId: number;
        widget: string;
        layout: string;
    }): Promise<import("pg").QueryResult<never>>;
    handleCreateTenant(data: CreateTenantDto, req: any): Promise<any>;
    handleUpdateTenant(data: EditTenantDto): Promise<import("pg").QueryResult<never>>;
    handleDeleteUser(req: Request, id: number): Promise<UserResponseDto>;
}
