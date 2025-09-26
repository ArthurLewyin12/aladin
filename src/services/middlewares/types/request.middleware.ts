export type RequestMiddleware = (
  config: any,
  next: (config: any) => Promise<any>,
) => Promise<any>;
