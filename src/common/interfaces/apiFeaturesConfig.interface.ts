export interface ApiFeaturesConfig {
  searchFields?: string[];
  defaultSort?: string;
  defaultLimit?: number;
  maxLimit?: number;
  populateFields?: string | string[] | { path: string; select?: string }[];
  dateField?: string; // Field name to use for date range filtering (default: 'date')
}
