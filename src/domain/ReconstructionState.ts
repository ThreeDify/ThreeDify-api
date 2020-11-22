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
 */

export enum ReconstructionState {
  INQUEUE = 'INQUEUE',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
}

export default ReconstructionState;
