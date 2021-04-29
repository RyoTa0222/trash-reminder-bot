export interface Event {
  path: string;
  httpMethod: string;
  headers: any;
  queryStringParameters: any;
  body: string;
  isBase64Encoded: string;
}

export type DayOfWeek = "月曜日" | "火曜日" | "水曜日" | "木曜日" | "金曜日";
