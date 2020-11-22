import { Model } from 'objection';

export interface PaginatedResult<T extends Model> {
  data: T[];
  total: number;
  pageSize: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPageSize: number;
}

export default PaginatedResult;
