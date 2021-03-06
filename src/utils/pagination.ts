import Debug, { Debugger } from 'debug';
import { Model, Page, QueryBuilder } from 'objection';

import config from '../config';
import PaginatedResult from '../domain/PaginatedResult';
import PaginationQuery, { SortOrder } from '../domain/PaginationQuery';

const debug: Debugger = Debug('threedify:utils:pagination');

export function getDefaultOptions(): PaginationQuery {
  debug('Extracting default pagination query.');

  return {
    page: 1,
    filters: [],
    size: config.paginationConfig.minPageSize,
    order: config.paginationConfig.defaultOrder,
  };
}

export function getPaginationQuery(query: any): PaginationQuery {
  debug('Extracting pagination query.');

  const defaultOption: PaginationQuery = getDefaultOptions();
  const paginationQuery: any = query || {};

  debug('Extracting pagination filters.');
  const filters =
    (paginationQuery.filters as string | undefined)?.split(',') ||
    defaultOption.filters;

  if (paginationQuery.q) {
    debug('Adding search filter.');
    filters.push('search');
  }

  debug('Extracting pagination sort order.');
  let sortOrder = (paginationQuery.order as string)?.toUpperCase();
  if (!Object.values(SortOrder).includes(sortOrder as SortOrder)) {
    sortOrder = defaultOption.order;
  }

  return {
    q: paginationQuery.q,
    filters: filters.map((x) => x.trim()),
    page: +paginationQuery.page || defaultOption.page,
    size: +paginationQuery.size || defaultOption.size,
    order: sortOrder as SortOrder,
  };
}

export async function applyPagination<T extends Model>(
  schema: QueryBuilder<T>,
  query: PaginationQuery,
  availableFilters?: string[]
): Promise<PaginatedResult<T> | undefined> {
  let availableModelFilters = availableFilters || [];

  debug('Applying pagination.');
  const result: Page<T> = await schema
    .context({ sortOrder: query.order, queryString: query.q })
    .modify(
      query.filters.filter((filter) => {
        return availableModelFilters.includes(filter);
      })
    )
    .page(query.page - 1, query.size);

  if (result.results.length > 0) {
    debug('Tranforming query result to paginated result.');
    return {
      data: result.results,
      total: result.total,
      pageSize: query.size,
      currentPage: query.page,
      hasPrevPage: query.page > 1,
      currentPageSize: result.results.length,
      hasNextPage: query.page * query.size < result.total,
    };
  }

  debug("Query didn't return any result.");
}

export default {
  applyPagination,
  getDefaultOptions,
  getPaginationQuery,
};
