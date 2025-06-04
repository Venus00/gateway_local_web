import { Request } from 'express';
declare const RefreshTokenStrategy_base: new (...args: any[]) => InstanceType<any>;
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    constructor();
    validate(req: Request, payload: any): any;
}
export {};
