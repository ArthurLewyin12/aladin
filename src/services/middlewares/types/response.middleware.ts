export type ResponseMiddleware = (
  response: any,
  next: (response: any) => any,
) => any;
