export interface CreateWorkflowDto {
    tenantId: number;
    data: {
        name: string;
        url: string;
        icon: string;
        group?: string;
        reference?: string;
        version?: string;
        color?: string;
        author?: string;
        readme?: string;
    };
}
export interface EditWorkflowDto {
    id: number;
    name: string;
    url: string;
    icon: string;
    group?: string;
    reference?: string;
    version?: string;
    color?: string;
    author?: string;
    readme?: string;
}
export declare class WorkflowReponseDto {
    name: string | undefined;
}
