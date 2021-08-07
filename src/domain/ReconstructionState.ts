/**
 * @swagger
 *
 * components:
 *  schemas:
 *    ReconstructionState:
 *      type: string
 *      enum:
 *         - INQUEUE
 *         - INPROGRESS
 *         - COMPLETED
 *         - FAILED
 */

export enum ReconstructionState {
  INQUEUE = 'INQUEUE',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export default ReconstructionState;
