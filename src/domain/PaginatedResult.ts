/**
 * @swagger
 *
 * components:
 *  schemas:
 *    PaginatedResult:
 *      type: object
 *      properties:
 *        data:
 *          type: array
 *          items: {}
 *        total:
 *          type: number
 *        pageSize:
 *          type: number
 *        currentPage:
 *          type: number
 *        hasNextPage:
 *          type: boolean
 *        hasPrevPage:
 *          type: boolean
 *        currentPageSize:
 *          type: number
 */

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
