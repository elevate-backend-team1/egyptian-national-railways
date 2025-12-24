import { PopulateOptions } from 'mongoose';

export interface ApiFeaturesConfig {
  searchFields?: string[];
  defaultSort?: string;
  defaultLimit?: number;
  maxLimit?: number;
  populateFields?: string | string[] | PopulateOptions[];
  dateField?: string;
}
