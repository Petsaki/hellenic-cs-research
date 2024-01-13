import { ResponseData } from "../types";

export function sendResponse<T>(code: number, description: string, data?: T): ResponseData<T> {

    return {
        code: code,
        data: data,
        description: description,
        success: code === 200,
    }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Response:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: HTTP response status code.
 *           example: 200
 *         data:
 *           type: object
 *           description: The response data.
 *         description:
 *           type: string
 *           description: A more humane response message.
 *           example: All good.
 *         success:
 *           type: boolean
 *           description: If it was success base of HTTP response code.
 *           example: true
 */