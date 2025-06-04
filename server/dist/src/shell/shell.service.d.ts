import { ShellOrder } from './shell.dto';
export declare class ShellService {
    private logger;
    constructor();
    execute(order: ShellOrder): Promise<any>;
}
