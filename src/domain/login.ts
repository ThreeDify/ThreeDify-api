/**
 * @swagger
 *
 * components:
 *  schemas:
 *    LoginCredential:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *        password:
 *          type: string
 *  requestBodies:
 *    LoginCredential:
 *      description: Login credential for user
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginCredential'
 */
export interface LoginCredential {
  username: string;
  password: string;
}

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    TokenCredential:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 *  parameters:
 *    RefreshTokenParam:
 *      description: Refresh token
 *      name: x-refresh-token
 *      in: 'header'
 *      required: true
 *      schema:
 *        type: string
 *  securitySchemes:
 *    Authentication:
 *      type: 'http'
 *      scheme: 'bearer'
 *      bearerFormat: 'JWT'
 *  responses:
 *    TokenCredential:
 *      description: Token credential for user
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/TokenCredential'
 */
export interface TokenCredential {
  accessToken?: string;
  refreshToken?: string;
}

export default LoginCredential;
