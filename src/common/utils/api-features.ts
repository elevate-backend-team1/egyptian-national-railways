import { Query, Model, Document } from 'mongoose';
import { PaginatedResponse, PaginationMeta } from '../interfaces/pagination.interface';
import { QueryString } from '../interfaces/queryString.interface';

export interface ApiFeaturesConfig {
  searchFields?: string[];
  defaultSort?: string;
  defaultLimit?: number;
  maxLimit?: number;
  populateFields?: string | string[] | { path: string; select?: string }[];
  dateField?: string;
}

export class ApiFeatures<T> {
  private query: Query<any[], any>;
  private queryString: QueryString;
  private config: Required<ApiFeaturesConfig>;
  private model: Model<any>;

  constructor(model: Model<any>, queryString: QueryString = {}, config: ApiFeaturesConfig = {}) {
    this.model = model;
    this.query = model.find();
    this.queryString = queryString;
    this.config = {
      searchFields: config.searchFields || [],
      defaultSort: config.defaultSort || '-createdAt',
      defaultLimit: config.defaultLimit || 20,
      maxLimit: config.maxLimit || 100,
      populateFields: config.populateFields || [],
      dateField: config.dateField || 'date'
    };
  }

  /**
   * Apply filtering based on query parameters
   * Supports MongoDB operators: gt, gte, lt, lte, in, nin
   */
  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword', 'fromDate', 'toDate'];

    // Handle date range filtering (fromDate, toDate)
    if (queryObj.fromDate || queryObj.toDate) {
      const dateField = this.config.dateField || 'date';
      const dateQuery: any = {};

      if (queryObj.fromDate) {
        dateQuery.$gte = queryObj.fromDate;
      }
      if (queryObj.toDate) {
        dateQuery.$lte = queryObj.toDate;
      }

      if (Object.keys(dateQuery).length > 0) {
        queryObj[dateField] = dateQuery;
      }
    }

    // Remove excluded fields
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert operators (gt, gte, lt, lte) to MongoDB format ($gt, $gte, $lt, $lte)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|nin|ne|eq)\b/g, (match) => `${match}`);

    const parsedQuery = JSON.parse(queryStr);
    this.query = this.query.find(parsedQuery);

    return this;
  }

  /**
   * Apply sorting based on query parameters
   * Supports multiple fields: ?sort=field1,-field2 (- for descending)
   */
  sort(): this {
    if (this.queryString.sort) {
      const sortBy = String(this.queryString.sort).split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(this.config.defaultSort);
    }

    return this;
  }

  /**
   * Apply field selection
   * Include fields: ?fields=field1,field2
   * Exclude fields: ?fields=-field1,-field2
   */
  selectFields(): this {
    if (this.queryString.fields) {
      const fields = String(this.queryString.fields).split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  /**
   * Apply search functionality across specified fields
   * Uses case-insensitive regex search
   */
  search(): this {
    const keyword = this.queryString.keyword;

    if (keyword && typeof keyword === 'string' && keyword.trim().length > 0 && this.config.searchFields.length > 0) {
      const regex = new RegExp(keyword.trim(), 'i');
      const orConditions = this.config.searchFields.map((field) => ({
        [field]: regex
      }));

      this.query = this.query.find({ $or: orConditions } as any);
    }

    return this;
  }

  /**
   * Apply pagination
   * ?page=1&limit=20
   */
  paginate(): this {
    const page = Math.max(1, Number(this.queryString.page) || 1);
    const limit = Math.min(
      this.config.maxLimit,
      Math.max(1, Number(this.queryString.limit) || this.config.defaultLimit)
    );
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  /**
   * Populate specified fields
   */
  populate(): this {
    if (this.config.populateFields.length > 0) {
      if (Array.isArray(this.config.populateFields)) {
        this.config.populateFields.forEach((field) => {
          if (typeof field === 'string') {
            this.query = this.query.populate(field);
          } else {
            this.query = this.query.populate(field);
          }
        });
      } else {
        this.query = this.query.populate(this.config.populateFields as string);
      }
    }

    return this;
  }

  /**
   * Execute query and return data with pagination metadata
   */
  async execute(): Promise<PaginatedResponse<T>> {
    const page = Math.max(1, Number(this.queryString.page) || 1);
    const limit = Math.min(
      this.config.maxLimit,
      Math.max(1, Number(this.queryString.limit) || this.config.defaultLimit)
    );

    // Get filter to count documents with same criteria
    const filterQuery = this.query.getFilter();

    // Execute query and count in parallel
    const [data, totalItems] = await Promise.all([this.query.exec(), this.model.countDocuments(filterQuery)]);

    const totalPages = Math.ceil(totalItems / limit);

    const meta: PaginationMeta = {
      totalItems,
      itemsPerPage: limit,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    };

    return {
      meta,
      data: data as T[]
    };
  }

  /**
   * Execute query without pagination metadata
   */
  async executeWithoutMeta(): Promise<T[]> {
    const data = await this.query.exec();
    return data as T[];
  }

  /**
   * Get the raw mongoose query (for advanced customization)
   */
  getQuery(): Query<any[], any> {
    return this.query;
  }

  /**
   * Apply all common features at once
   * @param includePagination - Whether to include pagination (default: true)
   */
  applyFeatures(includePagination: boolean = true): this {
    this.filter().search().sort().selectFields().populate();

    if (includePagination) {
      this.paginate();
    }

    return this;
  }
}
