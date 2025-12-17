import { Query } from 'mongoose';

export class ApiFeatures<T> {
  mongooseQuery: Query<T[], T>;
  queryString: Record<string, unknown>;

  constructor(mongooseQuery: Query<T[], T>, queryString: Record<string, unknown>) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // 1- Filter Feature
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];

    excludedFields.forEach((field) => {
      delete queryStringObj[field];
    });
    // add $ operator to query string =>
    let reqQuery = JSON.stringify(queryStringObj);
    reqQuery = reqQuery.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(reqQuery));
    return this;
  }

  // 1- Sorting Feature
  sort() {
    if (typeof this.queryString.sort === 'string') {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort({ departureTime: 1 });
    }
    return this;
  }

  // 3- Fields limiting Feature [for specifying fields to return object]
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
    const page = typeof this.queryString.page === 'string' ? Number(this.queryString.page) : 1;

    const limit = typeof this.queryString.limit === 'string' ? Number(this.queryString.limit) : 20;

    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }

  // 6- Pagination with metaData
  async paginateWithMeta(model: { countDocuments: (filter: Record<string, unknown>) => Promise<number> }) {
    const page = typeof this.queryString.page === 'string' ? Number(this.queryString.page) : 1;

    const limit = typeof this.queryString.limit === 'string' ? Number(this.queryString.limit) : 20;

    const skip = (page - 1) * limit;

    // Apply actual skip/limit
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

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
