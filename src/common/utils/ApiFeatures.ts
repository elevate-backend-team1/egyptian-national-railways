import { Query } from 'mongoose';

// Make the query string generic too
export class ApiFeatures<T, Q = any> {
  mongooseQuery: Query<T[], T>;
  queryString: Q & {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: string;
    keyword?: string;
  };

  constructor(
    mongooseQuery: Query<T[], T>,
    queryString: Q & {
      page?: number;
      limit?: number;
      sort?: string;
      fields?: string;
      keyword?: string;
    }
  ) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // 1- Filter Feature
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];

    excludedFields.forEach((field) => {
      delete queryStringObj[field as keyof typeof queryStringObj];
    });

    let reqQuery = JSON.stringify(queryStringObj);
    reqQuery = reqQuery.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(reqQuery) as Record<string, unknown>);
    return this;
  }

  // 2- Sorting Feature
  sort() {
    if (typeof this.queryString.sort === 'string') {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 });
    }
    return this;
  }

  // 3- Fields limiting Feature
  limitFields() {
    const { fields } = this.queryString;
    if (typeof fields === 'string') {
      const selectedFields = fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(selectedFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  // 4- Search Feature
  search(fields: string[] = []) {
    const keyword = this.queryString.keyword;

    if (typeof keyword === 'string' && keyword.trim().length > 0) {
      const regex = new RegExp(keyword, 'i');

      const orArray = fields.map((field) => ({
        [field]: regex
      })) as Record<string, unknown>[];

      this.mongooseQuery = this.mongooseQuery.find({ $or: orArray });
    }
    return this;
  }

  // 5- Pagination Feature
  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 20;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  // 6- Pagination with metaData
  async paginateWithMeta(model: { countDocuments: (filter: Record<string, unknown>) => Promise<number> }) {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 20;

    // Count documents using same filter
    const filterQuery = this.mongooseQuery.getFilter();
    const totalItems = await model.countDocuments(filterQuery);

    const totalPages = Math.ceil(totalItems / limit);

    const meta = {
      totalItems,
      itemsPerPage: limit,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    };

    return meta;
  }

  // The final built of mongoose query
  getQuery() {
    return this.mongooseQuery;
  }
}
