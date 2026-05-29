declare module "pg" {
  export interface PoolConfig {
    connectionString?: string;
    max?: number;
  }

  export class Pool {
    constructor(config?: PoolConfig);
  }
}
