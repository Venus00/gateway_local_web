export declare function hashGenerate(value: string, secret: string): Promise<string>;
export declare function hashCompare(origin: string, hashed: string, secret: string): Promise<boolean>;
