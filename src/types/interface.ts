export interface Event {
  path: string;
  httpMethod: string;
  headers: any;
  queryStringParameters: any;
  body: string;
  isBase64Encoded: string;
}
