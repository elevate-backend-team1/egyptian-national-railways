export interface QueryString {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  fields?: string;
  keyword?: string;
  [key: string]: unknown; // any type
}
