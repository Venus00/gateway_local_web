import { WorkflowService } from './workflow.service';
import { EditWorkflowDto } from './workflow.dto';
export declare class WorkflowController {
    private workflow;
    private DB_PATH;
    private comonents;
    constructor(workflow: WorkflowService);
    createWorkflow(data: any): Promise<any>;
    serveflowcomponents(): any[];
    find(query: any): Promise<any>;
    findWorkflowId(workflow_id: number): Promise<{
        id: number;
        name: string | null;
        version: string | null;
        tenantId: number;
        url: string | null;
        icon: string | null;
        group: string | null;
        reference: string | null;
        color: string | null;
        author: string | null;
        readme: string | null;
    } | undefined>;
    update(data: EditWorkflowDto): Promise<string>;
    deleteWorkflow(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
