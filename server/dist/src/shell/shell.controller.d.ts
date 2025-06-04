import { ShellService } from './shell.service';
import { ShellOrder } from './shell.dto';
export declare class ShellController {
    private shellService;
    constructor(shellService: ShellService);
    execute(shellOrder: ShellOrder): Promise<any>;
}
