import { JwtPayload } from '../jwt-payload';
declare const AccessTokenStrategy_base: new (...args: any[]) => InstanceType<any>;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    constructor();
    validate(payload: JwtPayload): {
        sub: number;
        email: string;
        role: string;
        tenantId: number;
        permissions: string[];
    };
}
export {};
