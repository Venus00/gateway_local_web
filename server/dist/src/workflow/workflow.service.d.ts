import { OnModuleInit } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { CreateWorkflowDto, EditWorkflowDto } from './workflow.dto';
export declare class WorkflowService implements OnModuleInit {
    private readonly db;
    private logger;
    constructor(db: NodePgDatabase<typeof schema>);
    onModuleInit(): Promise<void>;
    deleteWorkflow(workflowId: number): Promise<{
        message: string;
        id: number;
    }>;
    pushFlowtoServer(data: any): Promise<any>;
    createWorkflow(payload: CreateWorkflowDto): Promise<any>;
    updateworkflow(data: EditWorkflowDto): Promise<string>;
    findWorkflowById(id: number): Promise<{
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
    getWorkflows(tenantId: any): Promise<any>;
    findWorkflow(tenantId: number): Promise<any>;
}
