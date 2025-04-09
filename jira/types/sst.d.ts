declare module "sst" {
    export interface SSTConfig {
      config(input: any): {
        name: string;
        region: string;
      };
      stacks(app: any): void;
    }
  }
  
  declare module "sst/constructs" {
    export class NextjsSite {
      constructor(scope: any, id: string, props: {
        path: string;
        environment?: Record<string, string>;
      });
      url: string;
    }
  }