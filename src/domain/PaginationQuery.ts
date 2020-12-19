/**
 * @swagger
 *
 * components:
 *  parameters:
 *    q:
 *      in: query
 *      name: q
 *      description: The search query string.
 *      schema:
 *        type: string
 *    page:
 *      in: query
 *      name: page
 *      description: The page to fetch data from.
 *      schema:
 *        type: number
 *        minimum: 1
 *        default: 1
 *    size:
 *      in: query
 *      name: size
 *      description: Size of the page.
 *      schema:
 *        type: number
 *        minimum: 1
 *        default: 10
 *    filters:
 *      in: query
 *      name: filters
 *      description: Filters to apply to generate pages. For multiple filters, use comma(,) separated value.
 *      required: false
 *      schema:
 *        type: string
 *    order:
 *      in: query
 *      name: order
 *      description: The order to sort the result in .
 *      schema:
 *        type: string
 *        enum:
 *          - ASC
 *          - DESC
 *        default: ASC
 */

export enum SortOrder {
  ASC = 'ASC',
  DSC = 'DESC',
}

export interface PaginationQuery {
  q?: string;
  page: number;
  size: number;
  filters: string[];
  order: SortOrder;
}

export default PaginationQuery;
