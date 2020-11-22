import { SortOrder } from './PaginationQuery';

export interface PaginationConfig {
  minPageSize: number;
  defaultOrder: SortOrder;
}

export default PaginationConfig;
