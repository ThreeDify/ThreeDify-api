export enum SortOrder {
  ASC = 'ASC',
  DSC = 'DESC',
}

export interface PaginationQuery {
  page: number;
  size: number;
  filters: string[];
  order: SortOrder;
}

export default PaginationQuery;
